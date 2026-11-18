
const jakarta = 'Asia/Jakarta';
const fmtDate = (date, options = {dateStyle:'long'}) => new Intl.DateTimeFormat('id-ID', {timeZone:jakarta, ...options}).format(date);
const todayKey = () => {
  const parts = new Intl.DateTimeFormat('en-CA', {timeZone:jakarta, year:'numeric', month:'2-digit', day:'2-digit'}).formatToParts(new Date());
  const get = key => parts.find(p => p.type === key).value;
  return [get('year'),get('month'),get('day')].join('-');
};
const dayMs = 86_400_000;
const dateKey = d => d.toISOString().slice(0,10);
const addDays = (date,count) => new Date(+date + count * dayMs);
const fmtRange = (start,end) => dateKey(start) === dateKey(end) ? fmtDate(start) : fmtDate(start)+' – '+fmtDate(end);
const periodLabels = {day:'Harian',week:'Mingguan',month:'Bulanan',year:'Tahunan'};
const reportUnits = [
  ['Kunjungan IGD',colors[0],117],['Rawat Jalan',colors[1],486],
  ['Masuk Rawat Inap',colors[6],46],['Hemodialisa',colors[2],40]
];

function rangeFor(mode,key){
  const d = new Date(key+'T00:00:00Z');
  const year = d.getUTCFullYear(), month = d.getUTCMonth();
  if(mode === 'day') return [d,d];
  if(mode === 'week'){
    const start = addDays(d,-(d.getUTCDay()+6)%7);
    return [start,addDays(start,6)];
  }
  if(mode === 'month') return [new Date(Date.UTC(year,month,1)),new Date(Date.UTC(year,month+1,0))];
  return [new Date(Date.UTC(year,0,1)),new Date(Date.UTC(year,11,31))];
}

function dailyFactor(date){
  return 0.79 + ((Math.floor(+date/dayMs)*17)%19)/50;
}

function sumsFor(values,start,end){
  const result = values.map(()=>0);
  for(let day = start; day <= end; day = addDays(day,1)){
    const rate = dailyFactor(day);
    values.forEach((n,i)=>{ result[i] += Math.round(n*rate); });
  }
  return result;
}

function reportData(mode,key,sort){
  const [start,end] = rangeFor(mode,key);
  const previous = rangeFor(mode,dateKey(addDays(start,-1)));
  const sorted = (names,counts,order) => {
    const rows = names.map((name,i)=>[name,counts[i]]);
    if(order?.field){
      const comparator = order.field === 'name' ? (a,b)=>a[0].localeCompare(b[0],'id') : (a,b)=>a[1]-b[1];
      rows.sort((a,b)=>comparator(a,b)*order.direction);
    }
    return rows;
  };
  const last = date => new Date(Math.min(+date, +new Date(todayKey()+'T00:00:00Z')));
  const aggregate = ([from,to]) => {
    const through = last(to);
    return [
      sumsFor([117],from,through)[0], tally(sumsFor(pp,from,through)),
      tally(sumsFor(rvalues,from,through)), sumsFor([40],from,through)[0]
    ];
  };
  return {
    label: fmtRange(start,end), previousLabel:fmtRange(...previous),
    summary: aggregate([start,end]), previous:aggregate(previous),
    poli:sorted(poli,sumsFor(pp,start,last(end)),sort.poli),
    ward:sorted(ranap,sumsFor(rvalues,start,last(end)),sort.ward),
    payer:payer.map((name,i)=>[name,...allShares.map(row=>sumsFor([row[i]],start,last(end))[0])])
  };
}

const headerText = [
  'PEMERINTAH KABUPATEN SIDOARJO','RUMAH SAKIT UMUM DAERAH SIDOARJO BARAT',
  'Jalan Bibis Bunder, Tambak Kemerakan, Krian, Sidoarjo',
  'Jawa Timur 61262 · Telepon (031) 8991119',
  'rsudsidoarjobarat.sidoarjokab.go.id'
];
function paperPreview(report,prepared){
  const rows = reportUnits.map(([label],i)=>[label,report.summary[i]]);
  const smallTable = (title,items) => '<table><tbody><tr><td>'+title+'</td><td>Jumlah</td></tr>'+items.map(([label,n])=>'<tr><td>'+label+'</td><td>'+num(n)+'</td></tr>').join('')+'</tbody></table>';
  const markers = prepared ? '<div class="sign-placeholders"><span>$qrcode</span><span class="eb-number">$nomor</span></div>' : '';
  return '<div class="paper"><div class="letter"><img src="assets/pemkab.png" alt="Lambang Kabupaten Sidoarjo"><div><span>'+headerText[0]+'</span><b>'+headerText[1]+'</b>'+headerText.slice(2).map(s=>'<span>'+s+'</span>').join('')+'</div>'+logo('paper-logo')+
    '</div><h4>DASHBOARD RSUD SIDOARJO BARAT</h4><p>'+report.label+' · Data contoh</p>'+smallTable('Ringkasan layanan',rows)+smallTable('Poli',report.poli.slice(0,8))+
    '<div class="sign-box eb-sign"><strong>Tanda Tangan Direktur</strong><div class="sign-room">'+markers+'</div><strong>'+directorName+'</strong></div><div class="pfoot"><span>Data contoh</span><span>Halaman 1 / 2</span></div></div>';
}

function downloadFile(resource,name){
  const url = URL.createObjectURL(resource);
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(()=>URL.revokeObjectURL(url),2000);
}

async function saveReport(report,prepared,key){
  const {PDFDocument,StandardFonts,rgb,PageSizes} = window.PDFLib;
  const pdf = await PDFDocument.create();
  pdf.setTitle('Dashboard RSUD Sidoarjo Barat');
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const assets = await Promise.all(['pemkab.png','rsud.png'].map(path=>pdf.embedPng(reportLogos[path])));
  const first = pdf.addPage(PageSizes.A4), detail = pdf.addPage(PageSizes.A4);
  const dark = rgb(.10,.16,.20), light = rgb(.91,.95,.95), line = rgb(.73,.79,.81);
  const write = (page,value,x,y,size=10,face=font,color=dark) => page.drawText(String(value),{x,y,size,font:face,color});
  const center = (page,value,x,y,size=10,face=font,color=dark) =>
    write(page,value,x-face.widthOfTextAtSize(value,size)/2,y,size,face,color);
  const rule = (page,x,y,width) => page.drawLine({start:{x,y},end:{x:x+width,y},color:line,thickness:.65});
  const image = (page,asset,x,y,w,h) => {
    const size=asset.scaleToFit(w,h);
    page.drawImage(asset,{x:x+(w-size.width)/2,y:y+(h-size.height)/2,...size});
  };
  function table(page,y,headers,rows,widths,height=17){
    page.drawRectangle({x:42,y:y-height+4,width:511,height,color:light});
    [headers,...rows].forEach((row,index)=>{
      let x=42;
      row.forEach((value,i)=>{
        const content=typeof value==='number'?num(value):String(value);
        write(page,content,x+6,y-index*height-7,9,index===0?bold:font);
        x+=widths[i];
      });
      rule(page,42,y-(index+1)*height+4,511);
    });
    return y-(rows.length+1)*height;
  }
  image(first,assets[0],42,732,63,59);
  image(first,assets[1],487,728,66,61);
  headerText.forEach((value,i)=>center(first,value,297.5,786-i*12,i===1?11:8,i===1?bold:font));
  rule(first,42,723,511);
  center(first,'DASHBOARD RSUD SIDOARJO BARAT',297.5,695,13,bold);
  center(first,report.label+' · Data contoh',297.5,677,10);
  let pos=table(first,652,['Ringkasan layanan','Jumlah'],reportUnits.map(([label],i)=>[label,report.summary[i]]),[391,120],20);
  pos=table(first,pos-20,['Poli','Jumlah'],report.poli.slice(0,8),[391,120],20);
  const signY=pos-105;
  first.drawRectangle({x:308,y:signY,width:245,height:83,borderColor:line,borderWidth:.7,color:rgb(1,1,1)});
  center(first,'Tanda Tangan Direktur',430.5,signY+66,10,bold);
  if(prepared){
    center(first,'$qrcode',430.5,signY+43,11,bold);
    center(first,'$nomor',430.5,signY+29,10,font,rgb(1,1,1));
  }
  center(first,directorName,430.5,signY+10,9,bold);
  write(detail,'Rincian kunjungan dan penjaminan',42,784,14,bold);
  write(detail,report.label+' · Data contoh',42,763,10);
  let y=table(detail,742,['Poli','Jumlah'],report.poli,[391,120],14)-17;
  y=table(detail,y,['Ruang rawat inap','Jumlah'],report.ward,[391,120],14)-17;
  table(detail,y,['Penjamin','IGD / MNE','Rawat jalan','Rawat inap','Hemodialisa'],report.payer,[175,81,85,85,85],16);
  [first,detail].forEach((page,i)=>{
    rule(page,42,45,511);
    write(page,'Data contoh',42,33,8);
    write(page,'Halaman '+(i+1)+' / 2',488,33,8);
  });
  const bytes=await pdf.save();
  downloadFile(new Blob([bytes],{type:'application/pdf'}),'dashboard-rsud-sidoarjo-barat-'+key+'.pdf');
}

