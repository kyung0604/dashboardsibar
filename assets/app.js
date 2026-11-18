
const app = document.getElementById('app');
const dialog = document.getElementById('settings-dialog');
const notice = document.getElementById('notice');
const routes = {kunjungan:'Jumlah Kunjungan',penjaminan:'Pasien per Penjaminan',login:'',master:'Pengaturan Dashboard',laporan:'Dashboard RSUD Sidoarjo Barat'};
const visitTiles = [
  ['igd','IGD'],['mne','MNE'],['poli','Poli Rawat Jalan'],['hd','Hemodialisa'],
  ['peri','Peristi Ibu Bayi'],['intensive','Intensive'],['ward','Kamar Rawat Inap'],['op','Ruang Operasi']
];
const coverageTiles = allTitles.map((name,i)=>['payer-'+i,name]).concat([['matrix','Perbandingan penjamin antar layanan']]);
const intervalOptions = [10,15,30,60];
const storagePrefix = 'dashboardsibar:v1:';
const readStore = (store,key,fallback) => {
  try { return JSON.parse(store.getItem(storagePrefix+key)) ?? fallback; }
  catch { return fallback; }
};
const writeStore = (store,key,value) => store.setItem(storagePrefix+key,JSON.stringify(value));
const initialPanels = Object.fromEntries([
  ['kunjungan',visitTiles.map(([key,label])=>({key,label,type:key,active:true}))],
  ['penjaminan',coverageTiles.map(([key,label])=>({key,label,type:key,active:true}))]
]);
const storedInterval = readStore(localStorage,'interval',30);
const storedRole = readStore(sessionStorage,'role',null);
const state = {
  role: ['admin','direktur'].includes(storedRole)?storedRole:null,
  interval: intervalOptions.includes(storedInterval)?storedInterval:30,
  panels: readStore(localStorage,'panels',initialPanels),
  monitorDate:null, draft: null, masterTab:'kunjungan', timer:null, update:new Date(), menu:false,
  reportMode:'week', reportDate:todayKey(), sort:{poli:null,ward:null}, signingKey:null
};
const escapeHtml = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const monitorPages = ['kunjungan','penjaminan'];
const internalPages = ['master','laporan'];
let focusAfterDialog = null;
let toastTimer;
let intendedRoute = 'kunjungan';

function route(){
  const key = location.hash.replace(/^#\/?/,'') || 'kunjungan';
  return Object.hasOwn(routes,key)?key:'kunjungan';
}
function navigate(key){ if(route()===key) render(); else location.hash = '#/'+key; }
function toast(message){
  notice.textContent=message;
  notice.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>notice.classList.remove('visible'),3200);
}
const action = (label,key,icon,cls='btn',extra='') =>
  '<button type="button" class="'+cls+'" data-action="'+key+'" '+extra+'>'+(icon?ico(icon,true):'')+label+'</button>';
const navLink = (label,page,icon,active=false,cls='') =>
  '<a href="#/'+page+'" class="'+cls+(active?' selected':'')+'"'+(active?' aria-current="page"':'')+'>'+ico(icon,true)+label+'</a>';
const views = page => '<nav class="viewtabs" aria-label="Tampilan dashboard">'+navLink('Kunjungan','kunjungan','chart',page==='kunjungan')+navLink('Penjaminan','penjaminan','pie',page==='penjaminan')+'</nav>';
const profile = role => role==='direktur'?'Direktur':'Admin';
const refreshedTime = () => fmtDate(state.update,{hour:'2-digit',minute:'2-digit'});
function topBar(page){
  const watch = monitorPages.includes(page);
  const openButton = watch || internalPages.includes(page);
  const menu = state.menu && openButton?'<div class="menu export-menu" aria-label="Menu dashboard">'+
    (state.role?action('Master','master','settings')+action('Laporan','laporan','report')+action('Keluar','logout','login'):action('Login','login','login'))+
    (watch?action('Set auto interval','interval','timer')+navLink(page==='kunjungan'?'Penjaminan':'Kunjungan',page==='kunjungan'?'penjaminan':'kunjungan',page==='kunjungan'?'pie':'chart')+
      '<hr>'+action('Save as Image','image','download','export-action'):'')+'</div>':'';
  const centerTitle = routes[page]?'<h1 class="headline">'+routes[page]+'</h1>':'<span></span>';
  return '<header class="top"><a class="brand" href="#/kunjungan">'+logo()+'<div><b>RSUD Sidoarjo Barat</b><small>Dashboard</small></div></a>'+centerTitle+
    '<div class="actions">'+(watch?'<span class="stamp"><i class="dot"></i><span id="refresh-label">Diperbarui '+refreshedTime()+' WIB</span></span>':'')+
    '<span class="tag">Data contoh</span>'+(openButton?action('', 'menu',watch?'more':'person','iconbtn','aria-label="'+(watch?'Menu dashboard':'Menu akun')+'" aria-expanded="'+state.menu+'"'):'')+'</div>'+menu+'</header>';
}
function mainNav(page){
  const items = [['Dashboard','kunjungan','dashboard'],['Master','master','settings'],['Laporan','laporan','report']];
  return '<aside class="side"><nav aria-label="Menu internal">'+items.map(([label,key,icon])=>navLink(label,key,icon,(key===page||(key==='kunjungan'&&page==='penjaminan')))).join('')+'</nav>'+
    action('Keluar','logout','login','logout')+'</aside>';
}
const bodyInternal = (page,content) => '<div class="in-shell">'+mainNav(page)+'<main class="main-in">'+content+'</main></div>';

function customCard(item){
  const title=escapeHtml(item.label);
  if(item.type==='trend'){
    return panel('#08766d',phead(title,'chart'),'<p class="scope revised-scope">Pendaftaran '+monitorLabel()+'</p>'+trendNew());
  }
  const totals=allShares.map(tally);
  const chart='<div class="total-card">'+allTitles.map((name,i)=>'<div><span>'+name+'</span><strong>'+num(totals[i])+'</strong></div>').join('')+'</div>';
  return panel('#08766d',phead(title,'chart'),chart);
}
function payerCard(i){
  const label = allTitles[i], values = allShares[i].map(monitorScale), total = tally(values);
  const rows = payer.map((name,j)=>'<div class="cov-line"><span class="swatch" style="background:'+payerColors[j]+'"></span><span>'+name+'</span><b>'+values[j]+'</b><em>'+percent(values[j],total)+'</em></div>');
  return '<article class="card cov" style="--t:'+allCovColors[i]+'">'+phead(label,i===2?'bed':'hospital')+
    '<p class="scope">Komposisi penjamin '+monitorLabel()+'</p><div class="cov-main">'+ringCC(values,label)+'<div class="cov-leg">'+rows.join('')+'</div></div></article>';
}
function payerTable(){
  return '<article class="card matrix">'+phead('Perbandingan penjamin antar layanan','shield','<span class="tag">Jumlah kunjungan</span>')+
    '<div class="tablebox"><table class="table"><thead><tr><th>Penjamin</th>'+allTitles.map(t=>'<th class="r">'+t+'</th>').join('')+
    '</tr></thead><tbody>'+payer.map((name,i)=>'<tr><td><span class="inline"><i class="swatch" style="background:'+payerColors[i]+'"></i>'+name+'</span></td>' +allShares.map(a=>'<td class="r">'+monitorScale(a[i])+'</td>').join('')+'</tr>').join('')+
    '</tbody><tfoot><tr><td>Total per layanan</td>'+allShares.map(a=>'<td class="r">'+num(tally(a.map(monitorScale)))+'</td>').join('')+'</tr></tfoot></table></div></article>';
}
function panelMarkup(item,edit){
  const {type,key,active} = item;
  let html;
  if(type==='configured') html=configuredCard(item);
  else if(type==='poli') html=polyPanel(false);
  else if(type==='ward') html=wardPanel(false);
  else if(type==='peri') html=periV3(false);
  else if(type==='matrix') html=payerTable();
  else if(type.startsWith('payer-')) html=payerCard(Number(type.split('-')[1]));
  else if(Object.hasOwn(services,type)) html=serviceV2(type,false);
  else html=customCard(item);
  if(!active) html=html.replace(/class="(panel|card)/,'class="$1 inactive');
  if(edit){
    const safeKey=escapeHtml(key), safeLabel=escapeHtml(item.label);
    const toggleControl='<button type="button" class="switch '+(active?'':'off')+'" role="switch" aria-checked="'+active+'" aria-label="'+safeLabel+'" data-action="toggle" data-key="'+safeKey+'"></button>';
    const editControl=type==='configured'?action('Edit','edit',null,'remove-panel','data-key="'+safeKey+'" aria-label="Edit '+safeLabel+'"'):'';
    const remove=key!==type?action('Hapus','remove',null,'remove-panel','data-key="'+safeKey+'" aria-label="Hapus '+safeLabel+'"'):'';
    html=html.replace('</header>','<div class="panel-controls">'+editControl+remove+toggleControl+'</div></header>');
  }
  return html;
}
function dashboardGrid(page,edit=false){
  const panels=(edit?state.draft:state.panels)[page].filter(item=>edit||item.active);
  if(!panels.length) return '<p class="card empty">Belum ada panel aktif.</p>';
  if(page==='kunjungan'){
    const standard=panels.length===8 && panels.every((p,i)=>p.type===visitTiles[i][0]);
    const nine=panels.length===9 && panels.slice(0,8).every((p,i)=>p.type===visitTiles[i][0]);
    let layout='flexible';
    if(standard) layout='standard';
    if(nine) layout='nine';
    return '<section class="board live-board layout-'+layout+'" style="--panel-count:'+panels.length+'">'+panels.map(p=>panelMarkup(p,edit)).join('')+'</section>';
  }
  const cards=panels.filter(p=>p.type!=='matrix');
  const matrix=panels.find(p=>p.type==='matrix');
  const top=cards.length?'<section class="covers covers-four live-covers" style="--cover-columns:'+Math.min(cards.length,6)+'">'+cards.map(p=>panelMarkup(p,edit)).join('')+'</section>':'';
  return top+(matrix?panelMarkup(matrix,edit):'');
}
function live(page){
  const date=monitorKey();
  const body='<div class="toolbar">'+views(page)+'<div class="monitor-date">'+(state.monitorDate?action('Hari ini','today',null):'')+'<label class="date-current date-filter">'+ico('calendar',true)+'<time id="visit-date" datetime="'+date+'">'+fmtDate(monitorDay(),{dateStyle:'full'})+'</time><input id="monitor-date" type="date" aria-label="Tanggal dashboard" min="2000-01-01" max="'+todayKey()+'" value="'+date+'"></label></div></div>'+
    '<div id="chart-export">'+dashboardGrid(page)+'</div>';
  return state.role?bodyInternal(page,'<div class="watch-main signed-watch">'+body+'</div>'):'<main class="wrapcc watch-main">'+body+'</main>';
}
function loginView(){
  return '<main class="login-bg"><form class="login-card" id="login-form">'+logo()+'<h1>Masuk</h1><p>Dashboard RSUD Sidoarjo Barat</p>'+
    '<label for="user">Nama pengguna</label><div class="field">'+ico('person',true)+'<input id="user" name="user" autocomplete="username" placeholder="Masukkan nama pengguna" required></div>'+
    '<label for="pw">Kata sandi</label><div class="field">'+ico('lock',true)+'<input type="password" id="pw" name="password" placeholder="Masukkan kata sandi" autocomplete="current-password" required>'+
    action('','password','visibility','field-icon','aria-label="Tampilkan kata sandi" aria-pressed="false"')+'</div><div id="login-error" class="login-error" aria-live="polite"></div>'+
    '<button class="primary" type="submit">Masuk '+ico('login',true)+'</button><a class="back" href="#/kunjungan">Kembali ke Kunjungan</a>'+
    '<p class="demo-hint">Demo: <b>admin</b> atau <b>direktur</b> · Kata sandi <b>demo</b></p></form></main>';
}
function masterView(){
  state.draft ??= structuredClone(state.panels);
  const page=state.masterTab,count=state.draft[page].length,active=state.draft[page].filter(p=>p.active).length;
  const tabs=monitorPages.map(key=>action(key==='kunjungan'?'Kunjungan':'Penjaminan','master-tab',null,key===page?'active':'','data-key="'+key+'" aria-pressed="'+(key===page)+'"')).join('');
  return bodyInternal('master','<div class="master-v3 live-master"><div class="in-head"><div><h1>Master Panel</h1><p>Atur chart yang tampil di dashboard.</p></div><div class="in-actions">'+
    action('＋ Tambah Container','add',null)+action('Simpan perubahan','save','check','primary')+'</div></div>'+
    '<div class="mbar"><div class="seg" aria-label="Jenis dashboard">'+tabs+'</div><span><b>'+active+' dari '+count+' panel aktif</b></span></div>'+
    '<div class="master-grid">'+dashboardGrid(page,true)+'</div></div>');
}


const signingKey = () => state.reportMode+':'+state.reportDate;
const signingPrepared = () => state.role==='direktur' && state.signingKey===signingKey();
const currentReport = () => reportData(state.reportMode,state.reportDate,state.sort);
function detailTable(label,rows,kind){
  const order=state.sort[kind];
  const sortHead=(text,key)=>'<th aria-sort="'+(order?.field===key?(order.direction===1?'ascending':'descending'):'none')+'">'+
    action(text+' '+(order?.field===key?(order.direction===1?'↑':'↓'):'↕'),'sort',null,'sort-button','data-key="'+kind+':'+key+'"')+'</th>';
  return '<article class="card report-detail">'+caption(label,kind==='poli'?'21 poli':'8 ruang')+
    '<div class="tablebox report-scroll"><table class="table"><thead><tr>'+sortHead(kind==='poli'?'Poli':'Ruang','name')+sortHead('Jumlah','count')+'</tr></thead><tbody>'+
    rows.map(([name,value])=>'<tr><td>'+name+'</td><td class="r">'+num(value)+'</td></tr>').join('')+'</tbody><tfoot><tr><td>Total '+rows.length+' '+(kind==='poli'?'poli':'ruang')+
    '</td><td class="r">'+num(tally(rows.map(r=>r[1])))+'</td></tr></tfoot></table></div></article>';
}
function reportsView(){
  const data = currentReport(), ready=signingPrepared();
  const filters=Object.entries(periodLabels).map(([key,label])=>action(label,'report-mode',null,key===state.reportMode?'active':'','data-key="'+key+'" aria-pressed="'+(key===state.reportMode)+'"')).join('');
  const summaries=reportUnits.map(([name,tone],i)=>'<article class="card" style="--t:'+tone+'"><h2>'+name+'</h2><div class="tablebox"><table class="table"><thead><tr><th>Periode</th><th class="r">Jumlah</th></tr></thead><tbody>'+
    '<tr><td>'+data.label+'</td><td class="r">'+num(data.summary[i])+'</td></tr><tr><td>'+data.previousLabel+'</td><td class="r">'+num(data.previous[i])+'</td></tr></tbody></table></div></article>').join('');
  const sign=state.role==='direktur'?(ready?'<span class="tag eb-ready">Siap diunduh</span>':action('Tanda Tangani','sign','check','primary')):'';
  const preview='<article class="card sign-preview">'+caption('Pratinjau PDF','A4 portrait · Sebelum cetak','<span class="tag '+(ready?'eb-ready':'approval')+'">'+(ready?'Penanda eBuddy siap':'Belum disiapkan')+'</span>')+
    '<div class="sign-tools"><span class="tag">Akses '+profile(state.role)+'</span>'+sign+'</div><div class="paper-zone">'+paperPreview(data,ready)+'</div>'+
    '<div class="sign-foot"><span>'+(ready?'Unduh PDF untuk diunggah ke eBuddy Sidoarjo.':state.role==='direktur'?'Klik Tanda Tangani untuk menyiapkan penanda eBuddy.':'Area tanda tangan kosong pada dokumen ini.')+'</span></div></article>';
  return bodyInternal('laporan','<div class="report-v3 live-report"><div class="in-head"><div><h1>Laporan Global</h1><p>Rekap kunjungan dan penjaminan seluruh rumah sakit.</p></div>'+
    action('Unduh PDF','pdf','download','primary')+'</div><div class="gfilter card report-filter"><div class="seg" aria-label="Frekuensi laporan">'+filters+'</div>'+
    '<label class="date-filter">'+ico('calendar',true)+'<span>'+data.label+'</span><input aria-label="Tanggal acuan laporan" type="date" min="2000-01-01" max="'+todayKey()+'" value="'+state.reportDate+'" id="report-date"></label><span class="range">Periode dalam WIB</span></div>'+
    '<section class="report-sums">'+summaries+'</section><section class="report-lower">'+detailTable('Kunjungan per Poli',data.poli,'poli')+detailTable('Masuk Rawat Inap',data.ward,'ward')+preview+'</section></div>');
}
function paintMonitorCharts(){
  const area=document.getElementById('chart-export');
  if(area)area.innerHTML=dashboardGrid(route());
}
function refreshDisplay(){
  state.update=new Date();
  const label=document.querySelector('#refresh-label');
  if(label) label.textContent='Diperbarui '+refreshedTime()+' WIB';
  const date=document.querySelector('#monitor-date');
  if(date&&date.max!==todayKey()){render();return;}
  if(monitorPages.includes(route())) void refreshSources(state.panels[route()].filter(p=>p.active),true);
}
function startInterval(){
  clearInterval(state.timer);
  if(monitorPages.includes(route())) state.timer=setInterval(()=>{if(!document.hidden)refreshDisplay();},state.interval*1000);
}
function render(){
  let page=route();
  if(internalPages.includes(page)&&!state.role){
    intendedRoute=page;
    page='login';
    history.replaceState(null,'','#/login');
  }
  app.className='app page-'+page;
  const content=page==='login'?loginView():page==='master'?masterView():page==='laporan'?reportsView():live(page);
  app.innerHTML=topBar(page)+content;
  startInterval();
  if(monitorPages.includes(page)) void refreshSources(state.panels[page].filter(p=>p.active));
  if(page==='master') void refreshSources(state.draft[state.masterTab]);
}

function showDialog(title,body){
  focusAfterDialog=document.activeElement?.dataset.action;
  dialog.innerHTML='<form id="dialog-form"><header><h2>'+title+'</h2>'+action('×','close',null,'dialog-close','aria-label="Tutup"')+'</header>'+body+'</form>';
  dialog.showModal();
}
function intervalDialog(){
  const inputs=intervalOptions.map(n=>'<label class="interval-option"><input type="radio" name="seconds" value="'+n+'" '+(n===state.interval?'checked':'')+'> '+n+' detik</label>').join('');
  showDialog('Set auto interval','<div class="interval-list">'+inputs+'</div><footer>'+action('Batal','close',null)+'<button class="primary" value="interval">Simpan</button></footer>');
}
function addDialog(item){
  const options=(values,selected)=>Object.entries(values).map(([key,label])=>'<option value="'+key+'"'+(key===selected?' selected':'')+'>'+label+'</option>').join('');
  const source=item?.source||'demo';
  const key=item?' data-edit="'+escapeHtml(item.key)+'"':'';
  showDialog(item?'Edit Container':'Tambah Container','<label class="dialog-label" for="tile-type">Jenis chart</label><select id="tile-type" name="type">'+options(chartKinds,item?.chart)+'</select>'+
    '<label class="dialog-label" for="tile-label">Judul panel</label><input id="tile-label" name="label" maxlength="48" value="'+escapeHtml(item?.label||'')+'" placeholder="Gunakan nama sumber data">'+
    '<label class="dialog-label" for="tile-source">Sumber data</label><select id="tile-source" name="source">'+options({demo:'Data contoh',manual:'Input manual',api:'Endpoint API'},source)+'</select>'+
    '<div data-source="demo"><label class="dialog-label" for="tile-dataset">Dataset</label><select id="tile-dataset" name="dataset">'+options(demoSources,item?.dataset||(state.masterTab==='penjaminan'?'payer':'poli'))+'</select></div>'+
    '<div data-source="manual" hidden><label class="dialog-label" for="tile-rows">Data per baris (Label; nilai)</label><textarea id="tile-rows" name="rows" rows="5" placeholder="BPJS; 120&#10;Umum; 35">'+escapeHtml(item?.rows?.map(row=>row.join('; ')).join('\n')||'')+'</textarea></div>'+
    '<div data-source="api" hidden><label class="dialog-label" for="tile-endpoint">URL atau path API</label><input id="tile-endpoint" name="endpoint" placeholder="./api/kunjungan.php" value="'+escapeHtml(item?.endpoint||'')+'"><p class="dialog-hint">Dashboard mengirim parameter date (YYYY-MM-DD). API mengembalikan rows berisi label dan value.</p></div>'+
    '<p class="login-error" id="widget-error" role="alert"></p><footer>'+action('Batal','close',null)+'<button class="primary" value="add"'+key+'>'+(item?'Terapkan':'Tambah')+'</button></footer>');
  syncSourceFields();
}
function syncSourceFields(){
  const source=dialog.querySelector('#tile-source')?.value;
  dialog.querySelectorAll('[data-source]').forEach(field=>{field.hidden=field.dataset.source!==source;});
}
function repaintMenu(){
  const focused = document.activeElement?.dataset.action;
  app.querySelector('.top').outerHTML=topBar(route());
  if(focused==='menu') app.querySelector('[data-action="menu"]')?.focus();
}
function closeMenu(){
  if(!state.menu) return;
  state.menu=false;
  repaintMenu();
}
async function exportCharts(){
  const element=document.querySelector('#chart-export');
  const bounds=element.getBoundingClientRect();
  if(!bounds.width||!bounds.height) throw new Error('Chart tidak tersedia.');
  const width=Math.ceil(bounds.width),height=Math.ceil(bounds.height);
  const clone=element.cloneNode(true);
  const originals=[element,...element.querySelectorAll('*')];
  const copies=[clone,...clone.querySelectorAll('*')];
  const properties=('display position box-sizing width height min-width min-height max-width max-height '+
    'padding margin border border-radius background-color color box-shadow opacity overflow '+
    'grid-template-columns grid-template-rows grid-auto-rows grid-column grid-row gap align-items justify-items justify-content '+
    'flex flex-direction flex-wrap flex-shrink align-self font font-size font-weight line-height text-align letter-spacing '+
    'white-space text-overflow overflow-wrap vertical-align').split(' ');
  originals.forEach((node,index)=>{
    const style=getComputedStyle(node), copy=copies[index];
    for(const property of properties)copy.style.setProperty(property,style.getPropertyValue(property));
    copy.style.animation='none';
    copy.style.transform='none';
  });
  const wrapper=document.createElementNS('http://www.w3.org/1999/xhtml','div');
  wrapper.style.cssText='width:'+width+'px;min-height:'+height+'px;background:#f1f4f6;color:#17252c;font-family:Segoe UI,Arial,sans-serif';
  wrapper.append(clone);
  const markup=new XMLSerializer().serializeToString(wrapper);
  const svg='<svg xmlns="http://www.w3.org/2000/svg" width="'+width+'" height="'+height+'"><foreignObject width="100%" height="100%">'+markup+'</foreignObject></svg>';
  const image=new Image();
  image.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
  await image.decode();
  const canvas=document.createElement('canvas');
  const scale=Math.min(2,8192/Math.max(width,height));
  canvas.width=Math.round(width*scale);
  canvas.height=Math.round(height*scale);
  const ctx=canvas.getContext('2d');
  ctx.fillStyle='#f1f4f6';
  ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.drawImage(image,0,0,canvas.width,canvas.height);
  const png=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));
  if(!png) throw new Error('PNG tidak dapat dibuat.');
  downloadFile(png,'dashboard-'+route()+'-'+monitorKey()+'.png');
}

const handlers = {
  menu:()=>{state.menu=!state.menu;repaintMenu();},
  login:()=>{intendedRoute='kunjungan';navigate('login');},
  master:()=>navigate('master'),
  laporan:()=>navigate('laporan'),
  logout:()=>{
    state.role=null;
    state.draft=null;
    state.signingKey=null;
    sessionStorage.removeItem(storagePrefix+'role');
    navigate('kunjungan');
    toast('Anda telah keluar.');
  },
  password:button=>{
    const field=document.querySelector('#pw');
    const show=field.type==='password';
    field.type=show?'text':'password';
    button.setAttribute('aria-pressed',String(show));
    button.setAttribute('aria-label',show?'Sembunyikan kata sandi':'Tampilkan kata sandi');
  },
  interval:intervalDialog,
  close:()=>dialog.close(),
  image:async()=>{await exportCharts();toast('Gambar telah diunduh.');},
  'master-tab':button=>{state.masterTab=button.dataset.key;render();},
  toggle:button=>{
    const item=state.draft[state.masterTab].find(p=>p.key===button.dataset.key);
    if(item){item.active=!item.active;render(); app.querySelector('[data-action="toggle"][data-key="'+CSS.escape(item.key)+'"]')?.focus();}
  },
  remove:button=>{state.draft[state.masterTab]=state.draft[state.masterTab].filter(item=>item.key!==button.dataset.key);render();},
  add:()=>addDialog(),
  edit:button=>addDialog(state.draft[state.masterTab].find(p=>p.key===button.dataset.key)),
  today:()=>{state.monitorDate=null;render();},
  save:()=>{
    writeStore(localStorage,'panels',state.draft);
    state.panels=structuredClone(state.draft);
    toast('Perubahan dashboard disimpan.');
  },
  'report-mode':button=>{state.reportMode=button.dataset.key;render();},
  sort:button=>{
    const [kind,field]=button.dataset.key.split(':');
    const previous=state.sort[kind];
    state.sort[kind]={field,direction:previous?.field===field?-previous.direction:1};
    render();
    app.querySelector('[data-action="sort"][data-key="'+CSS.escape(button.dataset.key)+'"]')?.focus();
  },
  sign:()=>{
    if(state.role!=='direktur')return;
    state.signingKey=signingKey();
    render();
    toast('Penanda eBuddy siap di PDF.');
  },
  pdf:async button=>{
    const report=currentReport(),prepared=signingPrepared(),date=state.reportDate;
    button.disabled=true;
    try{await saveReport(report,prepared,date);}
    finally{button.disabled=false;}
  }
};

document.addEventListener('click',async event=>{
  const button=event.target.closest('button[data-action]');
  if(!button){
    if(state.menu&&!event.target.closest('.export-menu')) closeMenu();
    return;
  }
  const key=button.dataset.action;
  if(key!=='menu') closeMenu();
  if(!Object.hasOwn(handlers,key))return;
  try{await handlers[key](button);}
  catch(error){console.error(error);toast(error.message||'Aksi gagal. Coba lagi.');}
});
document.addEventListener('submit',event=>{
  const form=event.target;
  if(form.id==='login-form'){
    event.preventDefault();
    const data=new FormData(form), user=String(data.get('user')).trim().toLowerCase();
    if(!['admin','direktur'].includes(user)||data.get('password')!=='demo'){
      document.getElementById('login-error').textContent='Nama pengguna atau kata sandi demo salah.';
      return;
    }
    state.role=user;
    writeStore(sessionStorage,'role',user);
    navigate(intendedRoute);
    intendedRoute='kunjungan';
  }
  if(form.id==='dialog-form'){
    event.preventDefault();
    const data=new FormData(form), kind=event.submitter?.value;
    if(kind==='interval'){
      const seconds=Number(data.get('seconds'));
      if(intervalOptions.includes(seconds)){
        state.interval=seconds;
        writeStore(localStorage,'interval',seconds);
        startInterval();
        toast('Interval pembaruan '+seconds+' detik.');
      }
    }
    if(kind==='add'){
      try{
        const chart=data.get('type'), source=data.get('source'), dataset=data.get('dataset');
        const label=String(data.get('label')).trim()||(source==='demo'?demoSources[dataset]:chartKinds[chart]);
        const item={key:event.submitter?.dataset.edit||'custom-'+Date.now().toString(36),label,type:'configured',chart,source,dataset,active:true};
        if(source==='manual')item.rows=parseRows(String(data.get('rows')));
        if(source==='api'){
          item.endpoint=String(data.get('endpoint')).trim();
          if(!item.endpoint)throw new Error('Isi URL atau path API.');
          endpointUrl(item.endpoint);
        }
        const list=state.draft[state.masterTab],index=list.findIndex(p=>p.key===item.key);
        if(index<0)list.push(item);
        else list[index]={...item,active:list[index].active};
        render();
      }catch(error){dialog.querySelector('#widget-error').textContent=error.message;return;}
    }
    dialog.close();
  }
});
document.addEventListener('change',event=>{
  if(event.target.id==='tile-source')syncSourceFields();
  if(event.target.id==='monitor-date'&&event.target.value&&event.target.validity.valid){
    state.monitorDate=event.target.value===todayKey()?null:event.target.value;
    render();
  }
  if(event.target.id==='report-date'&&event.target.value&&event.target.validity.valid){
    state.reportDate=event.target.value;
    render();
  }
});
document.addEventListener('keydown',event=>{if(event.key==='Escape')closeMenu();});
dialog.addEventListener('close',()=>app.querySelector('[data-action="'+(focusAfterDialog||'menu')+'"]')?.focus());
window.addEventListener('hashchange',()=>{
  state.menu=false;
  if(dialog.open)dialog.close();
  render();
  window.scrollTo(0,0);
});
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&monitorPages.includes(route()))refreshDisplay();});
render();


