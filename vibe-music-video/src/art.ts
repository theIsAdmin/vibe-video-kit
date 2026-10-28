import meta from '@project/sprites.json';
export type C=CanvasRenderingContext2D;
export type Images=Record<string,HTMLImageElement>;
export const W=1920,H=1080;
export const clamp=(v:number,a=0,b=1)=>Math.max(a,Math.min(b,v));
export const ease=(v:number)=>{v=clamp(v);return v*v*(3-2*v)};
export const lerp=(a:number,b:number,p:number)=>a+(b-a)*p;
export const out=(v:number)=>1-Math.pow(1-clamp(v),3);
export const pop=(v:number)=>{const q=clamp(v)-1;return 1+2.70158*q*q*q+1.70158*q*q};
export const hash=(v:number)=>{const q=Math.sin(v*78.233+13.71)*43758.545;return q-Math.floor(q)};
export function font(c:C,size:number,bold=false){c.font=size+'px '+(bold?'MVHappy':'MVKai');c.textBaseline='middle';c.lineJoin='round';}
export function round(c:C,x:number,y:number,w:number,h:number,r=20){c.beginPath();c.roundRect(x,y,w,h,r);}
export function text(c:C,s:string,x:number,y:number,size:number,color='#352e28',bold=false){c.save();font(c,size,bold);c.fillStyle=color;c.textAlign='center';c.fillText(s,x,y);c.restore();}
export function paper(c:C,x:number,y:number,w:number,h:number,color='#fff5da',seed=1){c.beginPath();c.moveTo(x,y);for(let i=1;i<=24;i++)c.lineTo(x+w*i/24,y+(hash(i+seed)-.5)*9);c.lineTo(x+w,y+h);for(let i=23;i>=0;i--)c.lineTo(x+w*i/24,y+h+(hash(i+seed+29)-.5)*9);c.closePath();c.fillStyle=color;c.fill();c.strokeStyle='#9b8970';c.lineWidth=2;c.stroke();}
export function heart(c:C,x:number,y:number,size:number,color='#ee96a8',alpha=1){c.save();c.globalAlpha*=alpha;c.translate(x,y);c.scale(size/100,size/100);c.beginPath();c.moveTo(0,42);c.bezierCurveTo(-8,21,-59,-9,-44,-35);c.bezierCurveTo(-32,-58,-5,-52,0,-32);c.bezierCurveTo(12,-59,42,-54,48,-32);c.bezierCurveTo(60,-5,17,25,0,42);c.closePath();c.fillStyle=color;c.fill();c.strokeStyle='#72554d';c.lineWidth=2.8;c.stroke();c.restore();}
export function bubble(c:C,s:string,x:number,y:number,w=300,color='#e6f1df',scale=1,size=48){c.save();c.translate(x,y);c.scale(scale,scale);c.shadowColor='rgba(68,45,29,.16)';c.shadowBlur=12;c.shadowOffsetY=7;round(c,-w/2,-48,w,96,22);c.fillStyle=color;c.fill();c.shadowColor='transparent';c.strokeStyle='#7c8170';c.lineWidth=2.5;c.stroke();c.beginPath();c.moveTo(-w*.27,47);c.lineTo(-w*.31,67);c.lineTo(-w*.15,47);c.fillStyle=color;c.fill();c.stroke();text(c,s,0,0,size);c.restore();}
export function title(c:C,s:string,x:number,y:number,size=145,p=1,color='#fff3cf'){c.save();c.translate(x,y);const k=pop(p);c.scale(k,k);font(c,size,true);c.textAlign='center';c.shadowColor='rgba(60,36,25,.2)';c.shadowBlur=10;c.shadowOffsetY=8;for(let i=13;i>=0;i-=2){c.strokeStyle='#3f3630';c.lineWidth=9;c.strokeText(s,i,i);c.fillStyle='#ce9660';c.fillText(s,i,i);}c.shadowColor='transparent';c.lineWidth=7;c.strokeStyle='#493b30';c.strokeText(s,0,0);c.fillStyle=color;c.fillText(s,0,0);c.restore();}
export function bg(c:C,im:HTMLImageElement,t:number,zoom=1.03,pan=0){c.save();c.translate(960,540);c.scale(zoom,zoom);c.drawImage(im,-960+pan,-540,1920,1080);c.restore();c.fillStyle='rgba(255,247,218,.06)';c.fillRect(0,0,1920,1080);}
export function sprite(c:C,images:Images,name:string,sex:'girl'|'boy',x:number,foot:number,h:number,t:number,beat=0,walk=0,lean=0){
 foot-=65;
 const r=(meta as any)[name][sex] as number[],im=images[name],w=h*r[2]/r[3],bob=walk?Math.abs(Math.sin(t*9))*11:beat*5+Math.sin(t*2)*2;
 c.save();c.fillStyle='rgba(66,45,25,.16)';c.beginPath();c.ellipse(x,foot-6,w*.28,13,0,0,Math.PI*2);c.fill();
 c.translate(x,foot-bob);c.rotate(lean+Math.sin(t*2)*.006);c.scale(1+beat*.009,1-beat*.007);
 if(walk){const cut=sex==='girl'?.70:.66;c.drawImage(im,r[0],r[1],r[2],r[3]*cut,-w/2,-h,w,h*cut);
  for(let side=0;side<2;side++){c.save();const px=(side?1:-1)*w*.14,py=-h*(1-cut);c.translate(px,py);c.rotate(Math.sin(t*9+side*Math.PI)*.1);c.translate(-px,-py);c.drawImage(im,r[0]+side*r[2]/2,r[1]+r[3]*cut,r[2]/2,r[3]*(1-cut),-w/2+side*w/2,-h*(1-cut),w/2,h*(1-cut));c.restore();}
 }else c.drawImage(im,r[0],r[1],r[2],r[3],-w/2,-h,w,h);
 c.restore();return {x:x-w/2,y:foot-h-bob,w,h};
}
