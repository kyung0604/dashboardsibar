const paths={
 more:'M12 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm0 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm0 6a2 2 0 1 0 0 4 2 2 0 0 0 0-4z',
 calendar:'M19 3h-1V1h-2v2H8V1H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm0 16H5V9h14v10z',
 timer:'M15 1H9v2h6zM11 8h2v5h-2zM19 7l1.4-1.4L19 4.2l-1.4 1.4a9 9 0 1 0 1.4 1.4zM12 20a7 7 0 1 1 0-14 7 7 0 0 1 0 14z',
 login:'M19 3H5a2 2 0 0 0-2 2v4h2V5h14v14H5v-4H3v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zM8 13h6l-2 2 1.4 1.4 4.4-4.4-4.4-4.4L12 9l2 2H8z',
 dashboard:'M3 3h8v8H3zm10 0h8v5h-8zM3 13h8v8H3zm10-3h8v11h-8z',
 settings:'M3 6h18v2H3zm0 10h18v2H3zm4-12h3v6H7zm7 10h3v6h-3z',
 report:'M6 2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm8 2v5h4zM7 12v2h10v-2zm0 4v2h10v-2z',
 person:'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0 2c-4.4 0-8 2-8 4.4V20h16v-1.6c0-2.4-3.6-4.4-8-4.4z',
 lock:'M18 8h-1V6a5 5 0 0 0-10 0v2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2zM9 6a3 3 0 0 1 6 0v2H9zm3 11a2 2 0 1 1 0-4 2 2 0 0 1 0 4z',
 visibility:'M12 5c-5 0-9.3 3-11 7 1.7 4 6 7 11 7s9.3-3 11-7c-1.7-4-6-7-11-7zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-2a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
 download:'M5 20h14v-2H5zm7-17h-2v8H7l5 5 5-5h-3V3z',
 chart:'M3 19h18v2H3zm2-8h3v6H5zm6-6h3v12h-3zm6 3h3v9h-3z',
 pie:'M11 2a10 10 0 1 0 11 11H11zm2 0v9h9a10 10 0 0 0-9-9z',
 check:'M9 16.2l-4.2-4.2-1.4 1.4L9 19 21 7l-1.4-1.4z',
 expand:'M7.4 8.6 12 13.2l4.6-4.6L18 10l-6 6-6-6z'
};
const fa={
 users:['0 0 640 512','M144 256a80 80 0 1 0 0-160 80 80 0 1 0 0 160zm368 0a80 80 0 1 0 0-160 80 80 0 1 0 0 160zM0 384v32c0 17.7 14.3 32 32 32h104c-5.2-14.7-8-30.5-8-47 0-47.6 21.5-90.1 55.3-118.4-12.4-2.9-25.2-4.5-38.3-4.5C65 278.1 0 325.5 0 384zm488 17c0 16.5-2.8 32.3-8 47h128c17.7 0 32-14.3 32-32v-32c0-58.5-65-105.9-145-105.9a167 167 0 0 0-52 8.2c27.8 28 45 66.7 45 114.7zM320 256a112 112 0 1 0 0-224 112 112 0 1 0 0 224zM160 400v32c0 26.5 21.5 48 48 48h224c26.5 0 48-21.5 48-48v-32c0-61.9-50.1-112-112-112h-96c-61.9 0-112 50.1-112 112z'],
 hospital:['0 0 640 512','M224 0h192c17.7 0 32 14.3 32 32v64h64c35.3 0 64 28.7 64 64v288h32c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32h32V160c0-35.3 28.7-64 64-64h64V32c0-17.7 14.3-32 32-32zm72 51v29h-29v48h29v29h48v-29h29V80h-29V51zm-25 397h98v-89h-98zM128 192v48h48v-48zm336 0v48h48v-48zM128 288v48h48v-48zm336 0v48h48v-48z'],
 bed:['0 0 640 512','M32 32c17.7 0 32 14.3 32 32v256h512V224H288v64H96v-96c0-35.3 28.7-64 64-64h416c35.3 0 64 28.7 64 64v256c0 17.7-14.3 32-32 32s-32-14.3-32-32v-64H64v64c0 17.7-14.3 32-32 32S0 465.7 0 448V64c0-17.7 14.3-32 32-32z'],
 shield:['0 0 512 512','M256 0c4.6 0 9.2 1 13.4 2.9l188.3 79.9c13.5 5.7 23.6 19 23.5 35.1-.5 97.1-40.2 274.4-200.3 351.1-15.7 7.5-34.1 7.5-49.8 0C70.9 392.3 31.3 215 30.8 117.9c-.1-16.1 10-29.4 23.5-35.1L242.6 2.9C246.8 1 251.4 0 256 0zm0 67v337c120.8-66.7 156.1-203.8 160.6-269.1L256 67z'],
 circle:['0 0 512 512','M256 0a256 256 0 1 0 0 512 256 256 0 1 0 0-512zm0 104a28 28 0 1 1 0 56 28 28 0 1 1 0-56zm-29 92h53v208h-53z']
};
const ico=(key,small=false)=>{
 const [box,d]=fa[key]||['0 0 24 24',paths[key]];
 return '<svg class="ico'+(small?' sm':'')+'" viewBox="'+box+'" aria-hidden="true"><path d="'+d+'"/></svg>';
};

const poli=['Poli Jantung dan Pembuluh Darah','Poli Anak','Poli Bedah Mulut','Poli Bedah Orthopedi','Poli Bedah Umum','Poli Gigi dan Mulut','Poli Penyakit Dalam','Poli Obgyn','Poli Saraf','Poli Paru','Poli TB','Poli Medical Check Up','Poli UPIPI','Poli Mata','Poli Psikiatri','Poli THT','Poli Urologi','Poli Gigi Anak','Poli Periodonsia','Poli Anestesi','Poli Kulit & Kelamin'];
const ranap=['Uranus Selatan','Merkurius','Mars Utara','Jupiter','Venus','Isolasi','Uranus Utara','Mars Selatan'];
const pvalues=[37,29,12,25,24,21,67,33,34,26,8,6,13,25,12,23,18,13,10,7,29];
const rvalues=[8,5,7,9,6,1,5,5];

const num=n=>new Intl.NumberFormat('id-ID').format(n);
const percent=(n,total)=>total===0?'0,0%':new Intl.NumberFormat('id-ID',{minimumFractionDigits:1,maximumFractionDigits:1}).format(n*100/total)+'%';
const logo=(cls='brand-logo')=>'<span class="'+cls+'"><img src="assets/rsud.png" alt="Logo RSUD Sidoarjo Barat"></span>';

const caption=(title,detail,end='')=>'<header class="cap"><div><h2>'+title+'</h2><p>'+detail+'</p></div>'+end+'</header>';

const colors=['#4777EE','#A680EE','#F2A94F','#F3C941','#EE687D','#DE65BA','#39BCC5'];

const ic=(name)=>'<span class="picon">'+ico(name)+'</span>';

const rectTop=(x,y,w,h,t,hx=6)=>{
 if(h<=0)return '';
 const r=Math.min(h,w/2,hx);
 return '<path class="chart-mark" d="M'+x+','+(y+h)+' V'+(y+r)+' Q'+x+','+y+' '+(x+r)+','+y+' H'+(x+w-r)+' Q'+(x+w)+','+y+' '+(x+w)+','+(y+r)+' V'+(y+h)+' Z" fill="'+t+'"/>';
};
const txt=(x,y,s,opt={})=>'<text x="'+x+'" y="'+y+'" text-anchor="'+(opt.align||'middle')+'" fill="'+(opt.color||'#52616e')+'" font-size="'+(opt.size||13)+'" font-weight="'+(opt.bold?'700':'500')+'">'+s+'</text>';
function vchart(values,labels,opt={}){
 const ward=!!opt.ward,W=ward?780:282,H=ward?254:242;
 const left=ward?40:39,right=W-9,top=27,bottom=H-(ward?49:39);
 const max=opt.max, step=(right-left)/labels.length;
 const nx=opt.group?2:1;
 const barW=ward?43:nx===2?23:49;
 let parts='';
 for(let i=0;i<=4;i++) {
   const y=bottom-(bottom-top)*i/4;
   parts+='<line x1="'+left+'" x2="'+right+'" y1="'+y+'" y2="'+y+'" stroke="'+(i?'#e8edf2':'#d8e1e7')+'"/>'+txt(left-7,y+4,Math.round(max*i/4),{align:'end',size:12});
 }
 for(let i=0;i<labels.length;i++){
   const cx=left+(i+.5)*step;
   const series=Array.isArray(values[i])?values[i]:[values[i]];
   series.forEach((v,j)=>{
     const h=(bottom-top)*v/max, x=cx+(nx===2?(j===0?-barW-2:2):-barW/2);
     const tone=ward?colors[i%colors.length]:nx===2?[colors[0],colors[1]][j]:opt.tone;
     parts+=rectTop(x,bottom-h,barW,h,tone,ward?7:5);
     if(!ward&&i===2)parts+='<line x1="'+x+'" x2="'+(x+barW)+'" y1="'+(bottom-1)+'" y2="'+(bottom-1)+'" stroke="#27303a" stroke-opacity=".6" stroke-width="2"/>';
     parts+=txt(x+barW/2,bottom-h-7,v,{size:ward?16:13,bold:true,color:'#293844'});
   });
   const name=labels[i];
   if(ward&&name.startsWith('Uranus ')){parts+=txt(cx,bottom+20,'Uranus',{size:13,bold:true})+txt(cx,bottom+36,name.split(' ')[1],{size:13});}
   else if(ward&&name.startsWith('Mars ')){parts+=txt(cx,bottom+20,'Mars',{size:13,bold:true})+txt(cx,bottom+36,name.split(' ')[1],{size:13});}
   else parts+=txt(cx,bottom+23,name,{size:ward?14:13,bold:ward||i===2,color:!ward&&i===2?'#0b7166':'#52616e'});
 }
 return '<svg class="'+(ward?'ward-svg':'mini-svg')+'" viewBox="0 0 '+W+' '+H+'" role="img"><title>'+opt.label+'</title>'+parts+'</svg>';
}
const services={
 igd:{title:'IGD',icon:'hospital',tone:colors[0],n:117,snap:34,desc:'Pendaftaran',values:[[49,42],[56,48],[64,53]],max:80,group:true},
 mne:{title:'MNE',icon:'hospital',tone:colors[1],n:24,snap:12,desc:'Pendaftaran',values:[17,21,24],max:32},
 hd:{title:'Hemodialisa',icon:'hospital',tone:colors[2],n:40,desc:'Kunjungan',values:[34,44,40],max:48},
 peri:{title:'Peristi Ibu Bayi',icon:'bed',tone:colors[5],n:16,snap:28,desc:'Pasien masuk',values:[11,14,16],max:20},
 intensive:{title:'Intensive',icon:'bed',tone:colors[6],n:12,snap:30,desc:'Pasien masuk',values:[8,13,12],max:16,scope:'ICU · HCU · NICU · PICU'},
 op:{title:'Ruang Operasi',icon:'hospital',tone:colors[4],n:18,desc:'Tindakan selesai',values:[11,15,18],max:20}
};
const toggle=(active,label)=>'<button class="switch '+(active?'':'off')+'" aria-label="'+label+'" role="switch" aria-checked="'+active+'"></button>';
const phead=(text,icon,end='')=>'<header class="phead"><div class="inline">'+ic(icon)+'<h2>'+text+'</h2></div>'+end+'</header>';
const panel=(tone,head,content,wide=false,active=true)=>'<article class="panel'+(wide?' wide':'')+(active?'':' inactive')+'" style="--t:'+tone+'">'+head+'<div class="preview-plot">'+content+'</div></article>';

const pp=[51,...pvalues.slice(1)]; 
const maxPoli=Math.max(...pp);
const pRows=(a,b)=>'<div>'+poli.slice(a,b).map((label,i)=>{
 const n=monitorScale(pp[a+i]);return '<div class="poly-row"><span>'+label+'</span><div class="track"><div class="fill" style="--bar:'+colors[(a+i)%colors.length]+';width:'+n/maxPoli*100+'%"></div></div><strong>'+n+'</strong></div>';
}).join('')+'</div>';
const totalsBadge=(n,detail)=>'<div class="head-number"><b>'+num(n)+'</b><small>'+detail+'</small></div>';
const polyPanel=admin=>panel(colors[1],phead('Poli Rawat Jalan','hospital',admin?toggle(true,'Poli Rawat Jalan'):totalsBadge(tally(pp.map(monitorScale)),'kunjungan<br>'+monitorLabel())),'<p class="scope">21 poli · kunjungan per unit</p><div class="poly-body">'+pRows(0,11)+pRows(11,21)+'</div>',true);
const wardPanel=admin=>panel(colors[6],phead('Kamar Rawat Inap','bed',admin?toggle(true,'Kamar Rawat Inap'):totalsBadge(tally(rvalues.map(monitorScale)),'pasien masuk<br>'+monitorLabel())),'<div class="ward-metrics"><span>8 ruang · Pasien masuk per ruang</span><span><b>'+monitorScale(138)+'</b> masih dirawat</span></div>'+vchart(rvalues.map(monitorScale),ranap,{ward:true,label:'Pasien masuk per ruang',max:12}),true);

const payer=['Umum','BPJS Kesehatan','BRI Life','BPJS Ketenagakerjaan','Jasa Raharja','PLN'];
const payerColors=[colors[0],colors[1],colors[2],colors[3],colors[4],colors[5]];
const shares=[
 [35,72,5,11,16,2],
 [98,321,12,31,18,6],
 [8,29,1,3,4,1]
];
const covTitles=['IGD / MNE','Poli Rawat Jalan','Kamar Rawat Inap'];
const covColors=[colors[0],colors[1],colors[6]];
const tally=a=>a.reduce((s,v)=>s+v,0);
function ringCC(a,label){
 const total=tally(a); let angle=-90;
 const radius=70; const p=t=>[100+radius*Math.cos(t*Math.PI/180),100+radius*Math.sin(t*Math.PI/180)].join(',');
 return '<svg viewBox="0 0 200 200" role="img"><title>'+label+' · '+total+' kunjungan</title>'+a.map((v,i)=>{
  if(!v)return '';
  const sweep=v/total*360,start=angle,gap=Math.min(1.35,sweep/4);angle+=sweep;
  return '<path class="chart-mark doughnut-mark" d="M'+p(start+gap)+' A70,70 0 '+(sweep-gap*2>180?1:0)+' 1 '+p(angle-gap)+'" fill="none" stroke="'+payerColors[i]+'" stroke-width="24"/>';
 }).join('')+txt(100,104,num(total),{size:35,bold:true,color:'#18242e'})+txt(100,121,'Total kunjungan',{size:9})+'</svg>';
}

const statusLabels=[['Pendaftaran','Hari Ini'],['Masih','Dirawat']];
const metricTone={igd:['#A680EE','#4777EE'],mne:['#E48AB5','#875CCF'],peri:['#C9329F','#E74C62'],intensive:['#129F9B','#299A4F','#EA8191','#EE8C2E']};
const statusCaption={
 igd:'Pendaftaran dan pasien dalam perawatan',
 mne:'Pendaftaran dan pasien dalam perawatan',
 hd:'Kunjungan pada hari ini',
 peri:'Peristi Ibu Bayi dan Peristi Anak',
 intensive:'Pendaftaran dan pasien dirawat per unit',
 op:'Tindakan operasi selesai hari ini'
};
const usage={
 igd:[117,34],mne:[24,12],peri:[[16,6],[28,9]],
 intensive:[[4,9],[3,8],[3,7],[2,6]],hd:[40],op:[18]
};
function stackedTop(x,y,w,h,tone,isBottom){
 return isBottom?'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" fill="'+tone+'"/>':rectTop(x,y,w,h,tone,8);
}
function labelsAt(x,y,rows,opts={}){
 return rows.map((word,i)=>txt(x,y+i*15,word,{size:opts.size||13,bold:i===0||opts.allBold,color:'#41515e'})).join('');
}
function newChart(key){
 const W=282,H=284, left=32,right=275,top=25,floor=224;
 const block=usage[key].map(v=>Array.isArray(v)?v.map(monitorScale):monitorScale(v)), group=key==='intensive', isPeri=key==='peri';
 const rawMax=Math.max(...block.flat());
 const max=Math.max({igd:120,mne:32,peri:40,intensive:12,hd:48,op:20}[key],Math.ceil(rawMax/4)*4);
 const span=(floor-top)/max, map=metricTone[key]||[services[key].tone];
 let p='';
 for(let i=0;i<=4;i++){
  const y=floor-(floor-top)*i/4;
  p+='<line x1="'+left+'" x2="'+right+'" y1="'+y+'" y2="'+y+'" stroke="'+(i?'#e8edf2':'#d8e1e7')+'"/>'+txt(left-7,y+4,Math.round(max*i/4),{align:'end',size:11});
 }
 if(group){
  const units=['HCU','ICU','NICU','PICU'], step=(right-left)/4;
  block.forEach(([registered,staying],i)=>{
   const cx=left+(i+.5)*step, wb=18, h1=registered*span,h2=staying*span;
   p+=rectTop(cx-wb-2,floor-h1,wb,h1,map[i],4);
   p+='<path class="chart-mark" d="M'+(cx+2)+','+floor+' V'+(floor-h2+4)+' Q'+(cx+2)+','+(floor-h2)+' '+(cx+6)+','+(floor-h2)+' H'+(cx+16)+' Q'+(cx+20)+','+(floor-h2)+' '+(cx+20)+','+(floor-h2+4)+' V'+floor+' Z" fill="'+map[i]+'" fill-opacity=".25" stroke="'+map[i]+'" stroke-width="1.5"/>';
   p+=txt(cx-wb/2-2,floor-h1-7,registered,{size:13,bold:true,color:'#263746'})+txt(cx+wb/2+2,floor-h2-7,staying,{size:13,bold:true,color:'#263746'});
   p+=labelsAt(cx,floor+20,[units[i]],{size:12});
  });
 } else {
  const step=(right-left)/block.length;
  block.forEach((v,i)=>{
   const cx=left+(i+.5)*step, bw=block.length===1?86:68,x=cx-bw/2;
   let height=0,total=0;
   if(isPeri){
    v.forEach((value,j)=>{
     const b=value*span;
     p+=stackedTop(x,floor-height-b,bw,b,map[j],j===0);
     p+=txt(cx,floor-height-b/2+4,value,{size:12,bold:true,color:'#fff'});
     height+=b;total+=value;
    });
   }else{
    height=v*span;total=v;p+=rectTop(x,floor-height,bw,height,map[i]||map[0],8);
   }
   p+=txt(cx,floor-height-9,total,{size:17,bold:true,color:'#243442'});
   const labels=block.length===1?(key==='hd'?['Kunjungan','Hari Ini']:['Tindakan Selesai','Hari Ini']):statusLabels[i];
   if(monitorKey()!==todayKey()&&i===0)labels[1]='Tanggal Ini';
   p+=labelsAt(cx,floor+20,labels);
  });
 }
 return '<svg class="current-chart" viewBox="0 0 '+W+' '+H+'" role="img"><title>'+services[key].title+' · '+statusCaption[key].replace('hari ini',monitorLabel())+'</title>'+p+'</svg>';
}
const legendSwatch=(color,label,outline=false)=>'<span><i class="swatch" style="'+(outline?'background:#e8edf0;border:1px solid #778996':'background:'+color)+'"></i>'+label+'</span>';
const legendV2=key=>key==='peri'?'<div class="legend-row revised-legend">'+legendSwatch(metricTone.peri[0],'Peristi Ibu Bayi')+legendSwatch(metricTone.peri[1],'Peristi Anak')+'</div>':
 key==='intensive'?'<div class="legend-row revised-legend intensive-legend">'+legendSwatch('#526778','Pendaftaran Hari Ini')+legendSwatch('#526778','Masih Dirawat',true)+'</div>':'';
function serviceV2(key,admin){
 const s=services[key],active=key!=='peri'&&key!=='hd';
 return panel(s.tone,phead(s.title,s.icon,admin?toggle(active,s.title):''),
 '<p class="scope revised-scope">'+statusCaption[key]+'</p>'+newChart(key)+legendV2(key),false,!admin||active);
}

const motherColor='#C9329F',babyColor='#F3C941';
function periMini(title,values){
 const floor=171; let plot='';
 [0,10,20,30].forEach(n=>{
  const y=floor-n*4.7;
  plot+='<line x1="24" y1="'+y+'" x2="128" y2="'+y+'" stroke="'+(n?'#e1e8ed':'#ccd9e0')+'"/>'+txt(19,y+3,n,{size:10,align:'end'});
 });
 [motherColor,babyColor].forEach((color,i)=>{
  const x=36+i*48, h=values[i]*4.7;
  plot+=rectTop(x,floor-h,30,h,color,5)+txt(x+15,floor-h-6,values[i],{size:15,bold:true,color:'#243442'});
  plot+=txt(x+15,188,i===0?'Ibu':'Bayi',{size:12,bold:true});
 });
 return '<div class="peri-block"><h3>'+title+'</h3><svg viewBox="0 0 135 203" role="img"><title>'+title+' · Peristi Ibu '+values[0]+', Peristi Bayi '+values[1]+'</title>'+plot+'</svg></div>';
}
const periV3=admin=>panel(motherColor,phead('Peristi Ibu Bayi','bed',admin?toggle(true,'Peristi Ibu Bayi'):''),
 '<div class="double-peristi">'+periMini('Pendaftaran '+(monitorKey()===todayKey()?'Hari Ini':'Tanggal Ini'),[16,6].map(monitorScale))+periMini('Masih Dirawat',[28,9].map(monitorScale))+'</div><div class="legend-row peri-v3-legend">'+legendSwatch(motherColor,'Peristi Ibu')+legendSwatch(babyColor,'Peristi Bayi')+'</div>');
function trendNew(){
 const arr=[8,10,18,27,24,34].map(monitorScale), points=arr.map((n,i)=>(24+i*45)+','+(178-n*3.6));
 return '<svg class="current-chart" viewBox="0 0 282 223" role="img"><title>Pendaftaran per jam</title>'+
 [0,10,20,30,40].map(n=>'<line x1="24" x2="251" y1="'+(178-n*3.6)+'" y2="'+(178-n*3.6)+'" stroke="#e8edf2"/>').join('')+
 '<polygon points="24,178 '+points.join(' ')+' 249,178" fill="#08766d18"/><polyline points="'+points.join(' ')+'" fill="none" stroke="#08766d" stroke-width="3"/>'+
 points.map(p=>{const [x,y]=p.split(',');return '<circle cx="'+x+'" cy="'+y+'" r="3.6" fill="#08766d"/>';}).join('')+
 txt(24,198,'08.00',{size:12})+txt(114,198,'10.00',{size:12})+txt(204,198,'12.00',{size:12})+'</svg>';
}

const allShares=[...shares,[7,27,1,2,2,1]], allTitles=[...covTitles,'Hemodialisa'], allCovColors=[...covColors,colors[2]];
if(tally(allShares[3])!==usage.hd[0])throw new Error('Hemodialisa totals differ');

const directorName='dr. ABDILLAH SEGAF AL HADAD, MM';
