import React,{useRef,useState,useEffect,useLayoutEffect} from 'react';
import {Composition,registerRoot,useCurrentFrame,delayRender,continueRender,cancelRender,staticFile} from 'remotion';
import {draw,assetNames,duration} from '@project/scenes';
import project from '@project/project.json';
let ready:Promise<Record<string,HTMLImageElement>>|undefined;
function load(){
 if(!ready)ready=(async()=>{
  await Promise.all([['MVKai','LXGWWenKai-Regular.ttf'],['MVHappy','ZCOOLKuaiLe-Regular.ttf']].map(async([name,file])=>{const f=new FontFace(name,'url("'+staticFile(file)+'")');await f.load();document.fonts.add(f)}));
  return Object.fromEntries(await Promise.all(assetNames.map(name=>new Promise<[string,HTMLImageElement]>((resolve,reject)=>{const im=new Image();im.onload=()=>resolve([name,im]);im.onerror=()=>reject(Error('Cannot load artwork: '+name));im.src=staticFile(name+'.png')}))));
 })();return ready;
}
const MV=()=>{
 const frame=useCurrentFrame(),canvas=useRef<HTMLCanvasElement>(null),done=useRef(false);
 const[handle]=useState(()=>delayRender('Loading artwork and fonts'));
 const[images,setImages]=useState<Record<string,HTMLImageElement>|null>(null);
 useEffect(()=>{load().then(setImages).catch(cancelRender)},[]);
 useLayoutEffect(()=>{if(images&&canvas.current){draw(canvas.current.getContext('2d')!,images,frame/project.fps);if(!done.current){done.current=true;continueRender(handle)}}},[frame,images]);
 return <canvas ref={canvas} width={project.width} height={project.height} style={{width:'100%',height:'100%',display:'block'}}/>;
};
registerRoot(()=> <Composition id="MusicVideo" component={MV} width={project.width} height={project.height} fps={project.fps} durationInFrames={Math.ceil(duration*project.fps)}/>);
