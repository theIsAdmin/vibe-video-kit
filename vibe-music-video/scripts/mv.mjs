import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {root,parse,loadProject} from './options.mjs';
const [command='help',...argv]=process.argv.slice(2);
const allowed=new Set(['project','out','start','duration','concurrency','file','port','slug','title','song','lyrics','model','model-dir']);
function python(){
 const local=path.join(root,'.venv',process.platform==='win32'?'Scripts/python.exe':'bin/python');
 const candidates=process.env.MV_PYTHON?[process.env.MV_PYTHON]:[local,'python3','python'];
 for(const exe of candidates){const p=spawnSync(exe,['-c','import sys; assert sys.version_info >= (3,11)'],{stdio:'ignore'});if(p.status===0)return exe;}
 throw Error('Python 3.11+ not found. Create .venv or set MV_PYTHON.');
}
function py(script,args=[]){const p=spawnSync(python(),['-X','utf8',path.join(root,'scripts',script),...args],{cwd:root,stdio:'inherit',env:{...process.env,PYTHONIOENCODING:'utf-8'}});if(p.status!==0)throw Error(script+' failed'+(p.error?': '+p.error.message:''));}
function help(){console.log(`Usage: pnpm <command> [--project examples/biebole] [--out outputs/run-name]
doctor  Check Node, Python, FFmpeg, source assets and word timings
keys    Render keyframes only
preview Render a short excerpt with music and foley
demo / render  Render a full MV with MP3s, contact sheet and review page
verify  --file outputs/run-name/video.mp4
serve   --out outputs/run-name [--port 8800]
align   --project projects/name [--model small] [--model-dir .models]
new     --slug name --title title --lyrics lyrics.txt --song song.mp3
package --out dist/vibe-music-video.zip
Render options: --start seconds --duration seconds --concurrency 2
Browser: CHROME_EXECUTABLE; Python: MV_PYTHON; FFmpeg: FFMPEG_PATH / FFPROBE_PATH`);}
try{
 const opts=parse(argv);for(const k of Object.keys(opts))if(!allowed.has(k)&&k!=='help')throw Error('Unknown option: --'+k);
 if(opts.help||command==='help'){help();process.exit(0);}
 if(command==='package'){py('package.py',['--out',opts.out||'dist/vibe-music-video.zip']);process.exit(0);}
 if(command==='new'){const args=[];for(const k of ['slug','title','lyrics','song']){if(!opts[k])throw Error('Required: --'+k);args.push('--'+k,opts[k]);}py('new-project.py',args);process.exit(0);}
 if(command==='verify'){if(!opts.file)throw Error('Required: --file');py('verify.py',['--file',opts.file]);process.exit(0);}
 if(command==='serve'){if(!opts.out)throw Error('Required: --out');py('serve.py',[path.resolve(root,opts.out),'--port',opts.port||'8800']);process.exit(0);}
 if(command==='align'){if(!opts.project)throw Error('Required: --project');py('align.py',['--project',path.resolve(root,opts.project),'--model',opts.model||'small','--model-dir',opts['model-dir']||'.models']);process.exit(0);}
 if(Number(process.versions.node.split('.')[0])<22)throw Error('Node.js 22+ is required.');
 const {dir,project,timing}=loadProject(opts.project);
 py('doctor.py',['--project',dir]);
 if(command==='doctor')process.exit(0);
 if(!['keys','preview','render'].includes(command))throw Error('Unknown command: '+command);
 const stamp=new Date().toISOString().replace(/[:.]/g,'-');
 const out=path.resolve(root,opts.out||`outputs/${project.slug}-${command}-${stamp}`);
 if(fs.existsSync(out))throw Error('Output already exists; choose a new --out path.');
 fs.mkdirSync(out,{recursive:true});
 const {render}=await import('./render.mjs');await render({dir,project,timing,out,mode:command,opts});
 if(command!=='keys'){
  py('audio.py',['--project',dir,'--out',out]);
  py('finish.py',['--project',dir,'--out',out]);
 }
 console.log('Output:',out);
}catch(error){console.error('\nERROR:',error.message);process.exitCode=1;}
