import path from 'node:path';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
export const root=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
export function parse(argv){
 const opts={};for(let i=0;i<argv.length;i++){
  const key=argv[i];if(!key.startsWith('--'))throw Error('Unexpected argument: '+key);
  if(key==='--help'){opts.help=true;continue;}
  if(i+1>=argv.length||argv[i+1].startsWith('--'))throw Error('Missing value for '+key);
  opts[key.slice(2)]=argv[++i];
 }return opts;
}
export function loadProject(value='examples/biebole'){
 const dir=path.resolve(root,value),file=path.join(dir,'project.json');
 const project=JSON.parse(fs.readFileSync(file,'utf8'));
 if(!project.ready)throw Error('Project is a scaffold. Adapt scenes, music and timings, then set ready=true.');
 if(project.width!==1920||project.height!==1080||project.fps!==30)throw Error('This scene renderer currently requires 1920x1080 at 30 fps.');
 const timing=JSON.parse(fs.readFileSync(path.join(dir,project.timing),'utf8'));
 return {dir,project,timing};
}
export function clipRange(mode,timing,project,opts={}){
 const fps=project.fps,total=Math.ceil(timing.duration*fps);
 let start=mode==='preview'?project.preview.start:0,end=mode==='preview'?project.preview.end:timing.duration;
 if(opts.start!==undefined)start=Number(opts.start);
 if(opts.duration!==undefined)end=start+Number(opts.duration);
 if(!Number.isFinite(start)||!Number.isFinite(end)||start<0||end<=start||end>total/fps+.001)throw Error('Clip must lie inside the composition.');
 const first=Math.round(start*fps),last=Math.min(total-1,Math.round(end*fps)-1);
 if(last<first)throw Error('Clip must contain at least one frame.');
 return {first,last,start:first/fps,duration:(last-first+1)/fps};
}
