import {C,Images,clamp,ease,lerp,out,pop,hash,text,font,round,paper,title,bg,sprite} from '@mv/art';
import timing from './timing.json';
import poseMeta from './poses.json';
const T:any=timing;
export const duration=T.duration;
export const assetNames=['bedroom','cafe','pajama-atlas','cafe-cast'];
const beat=(t:number)=>{let q=0;for(const b of T.beats){const d=t-b;if(d>=0&&d<.19)q=Math.max(q,Math.exp(-d*18));}return q;};
function heading(c:C,s:string,x:number,y:number,size=108,p=1){title(c,s,x,y,size,p,'#fff2cf');}
function pill(c:C,s:string,x:number,y:number,w=280,color='#fff0cd',size=43,k=1){c.save();c.translate(x,y);c.scale(k,k);c.fillStyle=color;c.strokeStyle='#70665f';c.lineWidth=3;round(c,-w/2,-37,w,74,24);c.fill();c.stroke();text(c,s,0,0,size,'#403b38',true);c.restore();}
function bubble(c:C,s:string,x:number,y:number,w=310,color='#fff3d3',k=1,size=55){c.save();c.translate(x,y);c.scale(k,k);c.shadowColor='rgba(9,18,34,.18)';c.shadowBlur=12;c.shadowOffsetY=6;c.fillStyle=color;c.strokeStyle='#686e65';c.lineWidth=3;round(c,-w/2,-52,w,104,25);c.fill();c.shadowColor='transparent';c.stroke();c.beginPath();c.moveTo(-w*.2,51);c.lineTo(-w*.27,76);c.lineTo(-w*.08,51);c.fill();c.stroke();text(c,s,0,0,size,'#3b3b39',true);c.restore();}
function pose(c:C,images:Images,name:string,x:number,base:number,h:number,t:number,k=1,rot=0){
 const r=(poseMeta as any)[name] as number[],w=h*r[2]/r[3],pulse=beat(t);c.save();c.translate(x,base);c.rotate(rot);c.scale(k*(1+pulse*.006),k*(1-pulse*.004));c.drawImage(images['pajama-atlas'],r[0],r[1],r[2],r[3],-w/2,-h,w,h);c.restore();return {x:x-w/2,y:base-h,w,h};
}
function stars(c:C,t:number,amount=17,alpha=1){for(let i=0;i<amount;i++){const x=100+hash(i+80)*1680,y=95+hash(i+55)*660,s=4+hash(i+27)*8,p=.3+.7*Math.max(0,Math.sin(t*1.4+i*2));c.save();c.globalAlpha=alpha*p;c.fillStyle=i%3===0?'#f6cf90':'#d6e5ec';c.beginPath();c.moveTo(x-s,y);c.quadraticCurveTo(x,y,x,y-s);c.quadraticCurveTo(x,y,x+s,y);c.quadraticCurveTo(x,y,x,y+s);c.quadraticCurveTo(x,y,x-s,y);c.fill();c.restore();}}
function room(c:C,images:Images,t:number,dim=.24){bg(c,images.bedroom,t,1.025,Math.sin(t*.16)*4);c.fillStyle=`rgba(7,22,42,${dim})`;c.fillRect(0,0,1920,1080);const glow=c.createRadialGradient(848,520,8,848,520,260);glow.addColorStop(0,`rgba(255,197,102,${Math.max(0,.26-dim*.5)})`);glow.addColorStop(1,'rgba(255,197,102,0)');c.fillStyle=glow;c.fillRect(530,245,630,550);}
function clock(c:C,t:number,value='00:13'){pill(c,value,1680,106,240,'#d5e3df',49,1);text(c,'脑袋还没打烊',1680,164,25,'#d8dfd9');}
function power(c:C,x:number,y:number,p:number,t:number){c.save();c.translate(x,y);c.scale(pop(p),pop(p));c.shadowColor='#8cdecf';c.shadowBlur=18;c.strokeStyle='#9ce2ca';c.lineWidth=13;c.lineCap='round';c.beginPath();c.arc(0,0,47,-Math.PI*.33,Math.PI*1.33);c.stroke();c.beginPath();c.moveTo(0,-65);c.lineTo(0,-12);c.stroke();c.shadowBlur=0;text(c,'脑内影院',0,95,40,'#e9e8ce',true);c.restore();}
function cafe(c:C,images:Images,t:number,stage:number,moving=false){
 bg(c,images.cafe,t,1.02,Math.sin(t*.15)*3);
 // Place the clerk behind the actual painted counter, then restore its foreground.
 sprite(c,images,'cafe-cast','girl',1400,860,640,t,beat(t),0,Math.sin(t*5)*.009);
 c.save();c.beginPath();c.rect(900,552,1020,528);c.clip();bg(c,images.cafe,t,1.02,Math.sin(t*.15)*3);c.restore();
 const entered=ease(stage/.3),exit=stage>.78?ease((stage-.78)/.22):0;
 sprite(c,images,'cafe-cast','boy',lerp(360,530,entered)-exit*80,1000,700,t,beat(t),moving&&stage<.32?1:0,stage>.55?-.035:0);
 if(stage>.16)bubble(c,'慢走～',1410,220,330,'#f2e8cd',pop((stage-.16)/.18),65);
 if(stage>.53){bubble(c,'你也是！',520,208,390,'#d8eadb',pop((stage-.53)/.17),78);for(let i=0;i<3;i++){text(c,'·',835+i*50,430+Math.sin(t*5+i)*4,68,'#6c726b',true);}}
}
function film(c:C,images:Images,x:number,y:number,w:number,h:number,t:number,stage:number,k=1,angle=0,label='尴尬高清回放'){
 c.save();c.translate(x,y);c.rotate(angle);c.scale(k,k);c.shadowColor='rgba(5,13,29,.35)';c.shadowBlur=18;c.shadowOffsetY=13;round(c,-w/2,-h/2,w,h,19);c.fillStyle='#303c48';c.fill();c.shadowBlur=0;
 c.save();c.beginPath();c.rect(-w/2+26,-h/2+38,w-52,h-76);c.clip();c.translate(-w/2+26,-h/2+38);c.scale((w-52)/1920,(h-76)/1080);cafe(c,images,t,stage,true);c.restore();
 c.fillStyle='#e9dfc0';for(let side=0;side<2;side++)for(let i=0;i<13;i++){round(c,-w/2+15+i*(w-30)/13,side?h/2-26:-h/2+10,26,14,3);c.fill();}
 if(label)text(c,label,0,-h/2-38,40,'#ffedbd',true);c.restore();
}
function rewind(c:C,x:number,y:number,k:number,t:number){c.save();c.translate(x,y);c.scale(k,k);c.fillStyle='#edc492';for(let i=0;i<2;i++){c.beginPath();c.moveTo(20+i*67,-56);c.lineTo(-47+i*67,0);c.lineTo(20+i*67,56);c.closePath();c.fill();}c.restore();}
function projector(c:C,x:number,y:number,t:number,p=1){c.save();c.translate(x,y);c.scale(p,p);c.fillStyle='#6d8091';c.strokeStyle='#293848';c.lineWidth=5;round(c,-80,-60,160,110,15);c.fill();c.stroke();for(const xx of [-48,48]){c.save();c.translate(xx,-85);c.rotate(t*2);c.beginPath();c.arc(0,0,40,0,Math.PI*2);c.fillStyle='#a4b3b5';c.fill();c.stroke();for(let i=0;i<4;i++){c.beginPath();c.arc(Math.cos(i*Math.PI/2)*21,Math.sin(i*Math.PI/2)*21,8,0,Math.PI*2);c.fillStyle='#4a5a6b';c.fill();}c.restore();}c.fillStyle='#c0d9d1';round(c,69,-38,45,40,5);c.fill();c.stroke();c.beginPath();c.moveTo(-35,50);c.lineTo(-54,94);c.moveTo(35,50);c.lineTo(54,94);c.stroke();c.restore();}
function pillow(c:C,x:number,y:number,w:number,h:number,rotation=0,flip=1){c.save();c.translate(x,y);c.rotate(rotation);c.scale(flip,1);c.shadowColor='rgba(10,20,33,.2)';c.shadowBlur=14;c.shadowOffsetY=8;c.beginPath();c.moveTo(-w/2,-h/2);c.bezierCurveTo(-w*.25,-h*.4,w*.28,-h*.4,w/2,-h/2);c.quadraticCurveTo(w*.43,0,w/2,h/2);c.bezierCurveTo(w*.25,h*.39,-w*.2,h*.42,-w/2,h/2);c.quadraticCurveTo(-w*.43,0,-w/2,-h/2);c.closePath();c.fillStyle='#fff0cd';c.fill();c.shadowBlur=0;c.strokeStyle='#ac997d';c.lineWidth=4;c.stroke();c.setLineDash([5,8]);round(c,-w*.43,-h*.37,w*.86,h*.74,35);c.lineWidth=2;c.stroke();c.restore();}
function stopBeam(c:C,t:number,start:number,from=[1220,450],to=[900,390]){const p=clamp((t-start)/.35);if(p<=0||p>=1)return;c.save();c.globalAlpha=Math.sin(p*Math.PI)*.7;c.strokeStyle='#aee1d0';c.lineWidth=8;c.setLineDash([18,16]);c.beginPath();c.moveTo(from[0],from[1]);c.lineTo(lerp(from[0],to[0],p),lerp(from[1],to[1],p));c.stroke();c.restore();}
function windows(c:C,t:number,start:number){const p=clamp((t-start)/1.7);for(let i=0;i<12;i++){const a=clamp(p*13-i),xx=135+(i%4)*110,yy=285+Math.floor(i/4)*95;c.save();c.globalAlpha=a*.82;c.fillStyle='#12283d';round(c,xx,yy,55,60,5);c.fill();c.restore();}}
function page(c:C,x:number,y:number,t:number,start:number){const p=clamp((t-start)/.65);c.save();c.translate(x,y);c.rotate(-.06);paper(c,-220,-135,440,270,'#f8e9c9',33);text(c,'别人已经翻篇',0,-37,48,'#635844',true);text(c,'下一页：明天',0,58,39,'#7a846f');if(p<1){c.save();c.scale(Math.max(.02,Math.cos(p*Math.PI/2)),1);paper(c,-220,-135,440,270,'#e1d4b7',38);text(c,'刚才那句话',0,-20,50,'#715a4f',true);text(c,'慢走  /  你也是',0,58,39,'#8a7460');c.restore();}c.restore();}
function thoughtsToStars(c:C,t:number,start:number){for(let i=0;i<10;i++){const p=clamp((t-start-i*.14)/1.7);if(p<=0||p>=1)continue;const x=lerp(680,250+hash(i+14)*1150,p),y=lerp(480,100+hash(i)*350,p)-Math.sin(p*Math.PI)*150;c.save();c.globalAlpha=Math.sin(p*Math.PI);c.translate(x,y);c.rotate(p*(i%2?1:-1));paper(c,-50,-25,100,50,'#f5dfb8',i);text(c,i%2?'…':'回放',0,0,26,'#817668');c.restore();}}

function scene(c:C,images:Images,id:number,t:number){
 const l=T.lines[id],u=t-l.start,p=clamp(u/(l.end-l.start)),cue=l.cueTime,b=beat(t);c.save();
 if(id===0){
  const off=l.chars[2].start;room(c,images,t,.10+ease((t-off)/.4)*.36);clock(c,t,'23:58');
  const k=ease((t-cue+.08)/.25);if(k<1){c.save();c.globalAlpha=1-k;pose(c,images,'yawn',560,938,660,t,1,Math.sin(t*2)*.014);c.restore();}if(k>0){c.save();c.globalAlpha=k;pose(c,images,'alert',1440,790,550,t,1,Math.sin(t*3)*.013);c.restore();}
  if(t>cue){power(c,1000,390,(t-cue)/.35,t);bubble(c,'怎么又开始了？',1400,190,440,'#d9e8e0',pop((t-cue-.2)/.4),51);}
 }else if(id===1){
  room(c,images,t,.38);clock(c,t);pose(c,images,'alert',1460,790,550,t,1,Math.sin(t*4)*.012);
  const appear=out((u+.1)/.5);film(c,images,620,505,960,565,t,.18,appear,-.025,'');
  if(t>cue){const z=ease((t-cue)/.6);c.strokeStyle='#ecd7a8';c.lineWidth=4;c.setLineDash([18,14]);c.strokeRect(210-35*z,265-20*z,820+70*z,415+40*z);c.setLineDash([]);}
  projector(c,1020,837,t,1);stars(c,t,9,.3);
 }else if(id===2){
  const reply=cue,clerk=l.chars[3].start,progress=t<clerk?lerp(.05,.16,clamp(u/(clerk-l.start))):t<reply?lerp(.16,.52,clamp((t-clerk)/(reply-clerk))):lerp(.54,.96,clamp((t-reply)/(l.end-reply)));
  cafe(c,images,t,progress,true);
  if(t>reply+.15)pill(c,'空气突然安静…',1040,425,460,'#f4dfbd',46,pop((t-reply-.15)/.3));
 }else if(id===3){
  room(c,images,t,.38);clock(c,t);pose(c,images,'hide',1480,790,570,t,1,Math.sin(t*3)*.02);
  const loop=clamp((t-cue+.1)/.8),stage=t<cue?.65:((t-cue)*1.55)%1;film(c,images,645,470,960,565,t,stage,1,Math.sin(t*2)*.025,'');
  if(t>cue){rewind(c,650,470,pop((t-cue)/.25),t);pill(c,'回放 × '+(2+Math.floor((t-cue)/.8)),650,822,300,'#f0c3a4',48);}
 }else if(id===4){
  room(c,images,t,.4);clock(c,t);pose(c,images,'remote',1465,800,600,t,1,Math.sin(t*3)*.018);
  const first=l.chars[0].start,second=cue,hit=t>second?second:first,q=ease((t-hit)/.18);
  const shrink=1-Math.sin(clamp((t-hit)/.4)*Math.PI)*.16;
  film(c,images,610,485,930,548,t,.72,shrink,Math.sin(t*3)*.012,'');
  stopBeam(c,t,first);stopBeam(c,t,second);
  if(t>first+.13)pill(c,t>second?'再按一次暂停':'暂停',650,480,300,'#dc9a86',52,pop((t-hit-.08)/.2));
 }else if(id===5){
  room(c,images,t,.43);clock(c,t,'00:14');const k=ease((t-cue)/.5);
  pose(c,images,t<cue?'hide':'calm',1450,790,550,t,1-k*.04,Math.sin(t*2)*.015);
  pillow(c,610,570,500,285,-.07+Math.sin(t*2)*.04);
  const z=ease((t-cue+.1)/.6);for(let i=0;i<3;i++)text(c,'Z',530+i*100,560-i*90-z*60,55+i*14,'#98b7bd',true);
  if(t>cue)pill(c,'人想睡  /  脑子不想',650,828,510,'#e6d2b9',43,pop((t-cue)/.25));
 }else if(id===6){
  room(c,images,t,.46);clock(c,t,'00:14');windows(c,t,l.start);stars(c,t,16,.7);
  page(c,630,500,t,cue);pose(c,images,'calm',1460,790,550,t,1,Math.sin(t*1.5)*.008);
  if(t>cue)pill(c,'店员：早就忘记啦',640,790,500,'#cddfcf',46,pop((t-cue)/.3));
 }else if(id===7){
  room(c,images,t,.42);clock(c,t,'00:15');pose(c,images,'alert',1455,790,560,t,1,Math.sin(t*5)*.012);
  const q=out((t-cue+.3)/.42),x=lerp(-600,620,q);film(c,images,x,480,960,565,t,((t-cue)*.8+1)%1,1,-.03,'');
  if(t>cue){rewind(c,620,480,pop((t-cue)/.25),t);pill(c,'自动重播 +1',640,826,400,'#edbf9c',48,pop((t-cue-.2)/.3));}
 }else if(id===8){
  room(c,images,t,.42);clock(c,t,'00:15');const flip=l.chars[3].start,k=clamp((t-flip)/.7);
  if(k<.55)pose(c,images,'calm',1450,790,550,t);else pose(c,images,'sleep',1370,755,305,t,1+Math.sin(t*1.8)*.004,-.025);
  if(k<1){c.save();c.globalAlpha=1-ease((k-.72)/.28);pillow(c,lerp(640,1370,k),lerp(530,650,k)-240*Math.sin(k*Math.PI),480,265,k*Math.PI*2,Math.max(.08,Math.abs(Math.cos(k*Math.PI))));c.restore();}
  if(t>cue){pill(c,'今晚暂停营业',650,445,540,'#d7e3cb',67,pop((t-cue)/.35));thoughtsToStars(c,t,cue);}
 }else{
  room(c,images,t,.48);clock(c,t,'00:15');windows(c,t,l.start);stars(c,t,24,.8);
  pose(c,images,'sleep',1365,755+Math.sin(t*1.6)*2,305,t,1+Math.sin(t*1.6)*.004,-.025);
  c.save();c.translate(650,495);c.rotate(-.06);paper(c,-220,-135,440,270,'#f8e9c9',33);text(c,'暂存到明天',0,-77,47,'#76634e',true);c.restore();
  if(t>l.start+.45){c.save();c.translate(650,530);c.rotate(-.08);c.globalAlpha=out((t-l.start-.45)/.5);c.strokeStyle='#77917e';c.lineWidth=7;round(c,-190,-55,380,110,10);c.stroke();text(c,'脑袋，下班！',0,0,61,'#6c8e78',true);c.restore();}
  thoughtsToStars(c,t,l.start+.2);
  for(let i=0;i<3;i++){const k=(t*.24+i*.3)%1;text(c,'Z',1625+i*48+Math.sin(t+i)*5,360-i*65-k*60,36+i*10,'#c2d7d3',true);}
  if(t>cue){pill(c,'脑袋辛苦了，今晚先休息',760,805,850,'#dfe7cf',53,pop((t-cue)/.4));}
 }
 c.restore();
}
// One lyric area: the large heading belongs to the scene, with no bottom strip.
// Explicit spaces in the lyric sheet define phrases; each glyph keeps its own
// original vocal timestamp even when the second phrase replaces the first.
const topLyricLayout=[
 [650,150,123,980],[650,135,120,980],[960,112,108,1160],
 [650,130,120,1000],[650,130,138,1000],[650,155,112,1000],
 [730,155,112,1090],[660,135,112,1040],[650,145,128,1000],
 [655,165,141,1040],
];
function lyric(c:C,t:number,id:number){
 const l=T.lines[id];if(t<T.lines[0].start-.15)return;
 const phrases=l.text.trim().split(/\s+/);let offset=0;
 const chunks=phrases.map((s:string)=>{const chars=l.chars.slice(offset,offset+[...s].length);offset+=chars.length;return {s,chars};});
 let active=0;for(let i=1;i<chunks.length;i++)if(t>=chunks[i].chars[0].start-.04)active=i;
 const {s,chars}=chunks[active],layout=topLyricLayout[id],cx=layout[0],cy=layout[1],gap=5;
 c.save();c.globalAlpha=ease((t-Math.max(l.cut,T.lines[0].start-.15))/.13);
 let size=layout[2];font(c,size,true);let widths=[...s].map(ch=>c.measureText(ch).width+gap);
 const raw=widths.reduce((a,b)=>a+b,0);if(raw>layout[3]){size*=layout[3]/raw;font(c,size,true);widths=[...s].map(ch=>c.measureText(ch).width+gap);}
 let x=cx-widths.reduce((a,b)=>a+b,0)/2;
 [...s].forEach((ch,i)=>{
  const a=chars[i].start,b=chars[i].end,w=widths[i],dt=t-a,span=clamp(b-a+.12,.32,.48),phase=dt/span;
  let hop=0,landing=0;
  if(phase>=0&&phase<.72)hop=Math.sin(Math.PI*phase/.72);
  else if(phase>=.72&&phase<1){const p=(phase-.72)/.28;hop=.16*Math.sin(Math.PI*p);landing=Math.sin(Math.PI*p);}
  c.save();c.translate(x+w/2,cy-26*hop);c.scale(1+.045*hop,1+.065*hop-.025*landing);c.textAlign='center';
  c.lineWidth=8;c.strokeStyle='#3f3630';c.fillStyle='#bc8656';c.strokeText(ch,8,9);c.fillText(ch,8,9);
  c.lineWidth=7;c.strokeStyle='#493b30';c.strokeText(ch,0,0);c.fillStyle='#fff2cf';c.fillText(ch,0,0);
  const q=clamp(dt/Math.max(.06,b-a));
  if(q){c.save();c.beginPath();c.rect(-w/2-4,-size,(w+8)*q,size*2);c.clip();c.fillStyle='#ffdc94';c.fillText(ch,0,0);c.restore();}
  c.restore();x+=w;
 });
 c.restore();
}
export function draw(c:C,images:Images,t:number){c.clearRect(0,0,1920,1080);c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';let id=0;for(let i=0;i<T.lines.length;i++)if(t>=T.lines[i].cut)id=i;scene(c,images,id,t);
 for(let i=1;i<T.lines.length;i++){const cut=T.lines[i].cut;if(t>cut-.13&&t<cut+.13){scene(c,images,i-1,t);const p=ease((t-cut+.13)/.26),x=1920*p;c.save();c.beginPath();c.moveTo(0,0);c.lineTo(x,0);for(let y=0;y<=1080;y+=30)c.lineTo(x+Math.sin(y*.05)*11,y);c.lineTo(0,1080);c.closePath();c.clip();scene(c,images,i,t);c.restore();c.strokeStyle='#e7d7b3';c.lineWidth=16;c.beginPath();for(let y=0;y<=1080;y+=15){const xx=x+Math.sin(y*.05)*11;y?c.lineTo(xx,y):c.moveTo(xx,y);}c.stroke();break;}}
 if(t<T.lines[0].start-.15){const k=1-ease((t-T.lines[0].start+.6)/.45);c.save();c.globalAlpha=k;room(c,images,t,.28);pose(c,images,'alert',1450,805,570,t);paper(c,150,310,880,370,'#fff0cf',41);heading(c,'别播了',590,430,190,(t+.12)/.4);text(c,'人都躺下了',590,563,53,'#746451');text(c,'脑袋还在加班？',590,634,63,'#66523e',true);pill(c,'23:58',1665,120,230,'#d9e3d8',48);c.restore();}
 lyric(c,t,id);c.save();c.fillStyle='rgba(25,41,54,.8)';round(c,27,24,182,53,10);c.fill();text(c,'别播了',118,50,32,'#f9e5ba',true);c.strokeStyle='#e6d8b6';c.lineWidth=10;c.strokeRect(5,5,1910,1070);c.restore();
 const fade=1-ease(t/.3)+ease((t-(duration-.55))/.55);if(fade>0){c.fillStyle='rgba(20,39,56,'+clamp(fade)+')';c.fillRect(0,0,1920,1080);}
}
