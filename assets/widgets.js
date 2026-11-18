
const chartKinds = {bar:'Bar horizontal',column:'Bar vertikal',line:'Garis',donut:'Doughnut',number:'Kartu angka',table:'Tabel'};
const demoSources = {
  poli:'Kunjungan per poli',ward:'Pasien masuk per ruang',payer:'Penjamin per layanan',
  total:'Total per layanan',trend:'Pendaftaran per jam'
};
function monitorKey(){ return state.monitorDate || todayKey(); }
function monitorLabel(){return monitorKey()===todayKey()?'hari ini':'tanggal dipilih';}
function monitorDay(){ return new Date(monitorKey()+'T00:00:00Z'); }
function monitorScale(number){
  const date=monitorDay();
  return monitorKey()===todayKey()?number:Math.round(number*dailyFactor(date));
}
function demoRows(key){
  if(key==='poli')return poli.map((name,i)=>[name,monitorScale(pp[i])]);
  if(key==='ward')return ranap.map((name,i)=>[name,monitorScale(rvalues[i])]);
  if(key==='payer')return payer.map((name,i)=>[name,tally(allShares.map(row=>monitorScale(row[i])))]);
  if(key==='trend')return [8,10,18,27,24,34].map((n,i)=>[String(i+8).padStart(2,'0')+'.00',monitorScale(n)]);
  return allTitles.map((name,i)=>[name,tally(allShares[i].map(monitorScale))]);
}
function validRows(rows){
  return Array.isArray(rows)&&rows.length>0&&rows.length<=50&&rows.every(row=>Array.isArray(row)&&typeof row[0]==='string'&&row[0].trim().length>0&&row[0].length<=100&&typeof row[1]==='number'&&Number.isFinite(row[1])&&row[1]>=0&&row[1]<=1e12);
}
function parseRows(input){
  const rows=input.split(/\r?\n/).filter(s=>s.trim()).map(line=>{
    const i=line.lastIndexOf(';');
    const value=line.slice(i+1).trim();
    return [line.slice(0,i).trim(),i>0&&/^\d+(?:\.\d+)?$/.test(value)?Number(value):NaN];
  });
  if(!validRows(rows))throw new Error('Isi 1–50 baris dengan format Label; nilai, misalnya BPJS; 120.');
  return rows;
}
function endpointUrl(raw){
  const url=new URL(raw,location.href);
  if(!['http:','https:'].includes(url.protocol)||url.username||url.password)throw new Error('Gunakan URL HTTP(S) atau path API relatif.');
  url.searchParams.set('date',monitorKey());
  return url;
}
const apiCache=new Map();
function endpointRows(item){
  if(location.protocol==='file:')return {error:'Buka lewat Apache untuk menggunakan API.'};
  const url=endpointUrl(item.endpoint).href;
  if(!apiCache.has(url))return {loading:true};
  return apiCache.get(url);
}
async function refreshSources(items,force=false){
  if(location.protocol==='file:')return;
  const requests=new Set(items.filter(p=>p.source==='api').map(p=>endpointUrl(p.endpoint).href));
  if(!force||apiCache.size>100){
    for(const key of apiCache.keys())if(!requests.has(key))apiCache.delete(key);
  }
  let changed=false;
  await Promise.all([...requests].map(async url=>{
    const prior=apiCache.get(url);
    if(prior?.pending||(!force&&prior))return;
    const entry={...(prior||{loading:true}),pending:true};
    apiCache.set(url,entry);
    try{
      const response=await fetch(url,{headers:{Accept:'application/json'},signal:AbortSignal.timeout(8000)});
      if(!response.ok)throw new Error('API HTTP '+response.status);
      const body=await response.json();
      const rows=body?.rows?.map(row=>[row?.label,row?.value]);
      if(!validRows(rows))throw new Error('Format data API tidak sesuai.');
      if(apiCache.get(url)===entry){apiCache.set(url,{rows});changed=true;}
    }catch(error){
      const fallback=prior?.rows?{rows:prior.rows,error:'Pembaruan API gagal. Menampilkan data terakhir.'}:{error:error.message==='Failed to fetch'?'API tidak dapat dijangkau.':error.message};
      if(apiCache.get(url)===entry){apiCache.set(url,fallback);changed=true;}
    }
  }));
  if(changed&&monitorPages.includes(route()))paintMonitorCharts();
  if(changed&&route()==='master'){
    const box=document.querySelector('.master-grid');
    if(box)box.innerHTML=dashboardGrid(state.masterTab,true);
  }
}
function widgetChart(item,rows){
  const total=tally(rows.map(r=>r[1])), max=Math.max(1,...rows.map(r=>r[1]));
  if(item.chart==='number')return '<div class="widget-number"><strong>'+num(total)+'</strong><span>Total · '+rows.length+' kategori</span></div>';
  if(item.chart==='donut'){
    const segments=rows.slice(0,7);
    if(rows.length>7)segments.push(['Lainnya',tally(rows.slice(7).map(r=>r[1]))]);
    return '<div class="widget-donut">'+ringCC(segments.map(r=>r[1]),escapeHtml(item.label))+'<div class="widget-rows">'+segments.map(([label,value],i)=>'<div class="cov-line"><i class="swatch" style="background:'+colors[i%colors.length]+'"></i><span>'+escapeHtml(label)+'</span><b>'+num(value)+'</b><em>'+percent(value,total)+'</em></div>').join('')+'</div></div>';
  }
  if(item.chart==='bar'||item.chart==='table'){
    const table=item.chart==='table';
    return '<div class="widget-rows">'+rows.map(([label,value],i)=>'<div class="widget-row'+(table?' tabular':'')+'" title="'+escapeHtml(label)+': '+num(value)+'"><span>'+escapeHtml(label)+'</span>'+
      (table?'':'<div class="track"><div class="fill" style="--bar:'+colors[i%colors.length]+';width:'+value/max*100+'%"></div></div>')+
      '<strong>'+num(value)+'</strong></div>').join('')+'</div>';
  }
  const visible=rows.slice(0,12), W=440, baseline=181, span=(W-44)/visible.length;
  const points=visible.map((row,i)=>[22+(i+.5)*span,baseline-row[1]/max*138]);
  const line=item.chart==='line';
  const marks=visible.map(([label,value],i)=>{
    const [x,y]=points[i],title='<title>'+escapeHtml(label)+' · '+num(value)+'</title>';
    const mark=line?'<circle class="chart-mark" tabindex="0" cx="'+x+'" cy="'+y+'" r="5" fill="#08766d">'+title+'</circle>':
      rectTop(x-Math.min(20,span*.32),y,Math.min(40,span*.64),baseline-y,colors[i%colors.length]).replace('/>', '>'+title+'</path>');
    return mark+txt(x,y-8,num(value),{size:12,bold:true})+txt(x,201,escapeHtml(label.length>9?label.slice(0,8)+'…':label),{size:11});
  }).join('');
  return '<svg class="current-chart widget-svg" viewBox="0 0 440 214" role="img"><title>'+escapeHtml(item.label)+'</title><path d="M22 181H418" stroke="#d8e1e7"/>'+
    (line?'<polyline points="'+points.map(p=>p.join(',')).join(' ')+'" fill="none" stroke="#08766d" stroke-width="3"/>':'')+marks+'</svg>'+
    (rows.length>12?'<p class="scope">12 dari '+rows.length+' kategori · gunakan tabel untuk melihat semua.</p>':'');
}
function configuredCard(item){
  let result;
  if(item.source==='api')result=endpointRows(item);
  else if(item.source==='manual')result={rows:item.rows};
  else result={rows:demoRows(item.dataset)};
  const source=item.source==='api'?'API':item.source==='manual'?'Data manual':'Data contoh';
  const message=result.loading?'Memuat data API…':result.error;
  const body=(message?'<p class="scope widget-message">'+escapeHtml(message)+'</p>':'')+(result.rows?widgetChart(item,result.rows):'');
  return panel('#08766d',phead(escapeHtml(item.label),'chart'),'<p class="scope">'+source+'</p>'+body);
}


