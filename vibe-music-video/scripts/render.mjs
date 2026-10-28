import fs from 'node:fs/promises';
import path from 'node:path';
import {existsSync} from 'node:fs';
import {bundle} from '@remotion/bundler';
import {openBrowser,selectComposition,renderStill,renderMedia,ensureBrowser} from '@remotion/renderer';
import {root,clipRange} from './options.mjs';
function findChrome(){
 if(process.env.CHROME_EXECUTABLE){if(!existsSync(process.env.CHROME_EXECUTABLE))throw Error('CHROME_EXECUTABLE does not exist.');return process.env.CHROME_EXECUTABLE;}
 if(process.platform==='win32')for(const dir of [process.env.PROGRAMFILES,process.env['PROGRAMFILES(X86)'],process.env.LOCALAPPDATA]){if(!dir)continue;const p=path.join(dir,'Google/Chrome/Application/chrome.exe');if(existsSync(p))return p;}
 if(process.platform==='darwin'){const p='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';if(existsSync(p))return p;}
 return undefined;
}
export async function render({dir,project,timing,out,mode,opts}){
 const range=clipRange(mode,timing,project,opts);
 const fix=r=>{if(!r||typeof r!=='object')return;if(Array.isArray(r)){r.forEach(fix);return;}if(r.loader&&String(r.loader).includes('esbuild-loader'))r.options={...(r.options||{}),tsconfigRaw:{compilerOptions:{jsx:'react-jsx'}}};for(const k of ['use','oneOf','rules'])if(r[k])fix(r[k]);};
 const serveUrl=await bundle({entryPoint:path.join(root,'src/index.tsx'),publicDir:path.join(dir,'assets'),webpackOverride:c=>{fix(c.module.rules);c.resolve.alias={...c.resolve.alias,'@project':dir,'@mv':path.join(root,'src')};return c;}});
 const executable=findChrome();if(!executable)await ensureBrowser();
 const browser=await openBrowser('chrome',{...(executable?{browserExecutable:executable}:{}),logLevel:'warn'});
 try{
  const composition=await selectComposition({serveUrl,id:'MusicVideo',puppeteerInstance:browser});
  const meta={schema_version:1,title:project.title,mode,width:project.width,height:project.height,fps:project.fps,total_duration:timing.duration,...range};
  await fs.writeFile(path.join(out,'render.json'),JSON.stringify(meta,null,2));
  if(mode==='keys'){
   const times=project.key_times||timing.lines.map(l=>(l.start+l.end)/2);
   for(let i=0;i<times.length;i++){const frame=Math.max(0,Math.min(composition.durationInFrames-1,Math.round(times[i]*project.fps)));await renderStill({serveUrl,composition,puppeteerInstance:browser,frame,output:path.join(out,`key-${String(i+1).padStart(2,'0')}.png`),overwrite:false});console.log(JSON.stringify({key:i+1,frame}));}
  }else{
   const concurrency=Number(opts.concurrency||2);if(!Number.isInteger(concurrency)||concurrency<1||concurrency>16)throw Error('Concurrency must be an integer from 1 to 16.');
   let last=-1;await renderMedia({serveUrl,composition,puppeteerInstance:browser,codec:'h264',outputLocation:path.join(out,'silent.mp4'),crf:17,x264Preset:'fast',pixelFormat:'yuv420p',imageFormat:'jpeg',jpegQuality:95,concurrency,frameRange:[range.first,range.last],timeoutInMilliseconds:120000,onProgress:p=>{const q=Math.floor(p.progress*20);if(q!==last){last=q;console.log(JSON.stringify({progress:Math.round(p.progress*100),rendered_frames:p.renderedFrames}));}}});
  }
 }finally{await browser.close({silent:true});}
}
