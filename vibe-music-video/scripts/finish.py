import argparse, shutil, html
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
from common import project_at,inside,read_json,write_json,run,FFMPEG,digest
from verify import verify

def finish(directory, output):
    directory,project,timing=project_at(directory);out=Path(output);meta=read_json(out/'render.json');clip=meta['duration'];start=meta['start'];title=project['title'];video=out/'video.mp4'
    run([FFMPEG,'-v','error','-n','-i',out/'silent.mp4','-ss',start,'-i',out/'audio/mix.wav','-map','0:v:0','-map','1:a:0','-c:v','copy','-c:a','aac','-b:a','192k','-ar','48000','-t',clip,'-movflags','+faststart',video])
    report=verify(video,meta)
    for source,target,seek in [(video,'video-audio.mp3',0),(out/'audio/music.wav','music.mp3',start)]:
        run([FFMPEG,'-v','error','-n','-ss',seek,'-i',source,'-t',clip,'-vn','-c:a','libmp3lame','-b:a','320k',out/target])
    source=inside(directory,project['audio']['source'])
    if source.suffix.lower()=='.mp3':shutil.copy2(source,out/'song-original.mp3')
    else:run([FFMPEG,'-v','error','-n','-i',source,'-vn','-c:a','libmp3lame','-b:a','320k',out/'song-original.mp3'])
    times=[max(0,min(clip-1/meta['fps'],t-start)) for t in project.get('key_times',[]) if start<=t<start+clip]
    if len(times)<4:times=[clip*p for p in [.08,.32,.56,.80]]
    frame_numbers=sorted({min(meta['last']-meta['first'],round(t*meta['fps'])) for t in times})
    frames=out/'frames';frames.mkdir();select='+'.join(f'eq(n\\,{n})' for n in frame_numbers)
    run([FFMPEG,'-v','error','-n','-i',video,'-vf','select='+select,'-fps_mode','vfr','-q:v','2',frames/'frame-%03d.jpg'])
    pictures=sorted(frames.glob('*.jpg'));assert len(pictures)==len(frame_numbers)
    font=ImageFont.truetype(str(directory/'assets/LXGWWenKai-Regular.ttf'),24)
    sheet=Image.new('RGB',(1280,400*((len(pictures)+1)//2)),'#e7dfcd');draw=ImageDraw.Draw(sheet)
    for i,(picture,number) in enumerate(zip(pictures,frame_numbers)):
        x=i%2*640;y=i//2*400;sheet.paste(Image.open(picture).resize((640,360),Image.Resampling.LANCZOS),(x,y+35));draw.text((x+10,y+3),f'{number/meta["fps"]+start:.3f}s',font=font,fill='#554b3c')
    sheet.save(out/'storyboard.jpg',quality=93);shutil.copy2(pictures[0],out/'poster.jpg')
    report['clip_global_start']=start;report['music']=project['audio'];report['lyric_mode']='upper scene heading only; per-character bounce; no bottom subtitle';report['ai_generated_music_and_artwork']=True
    report['mp3s']=[{'file':name,'sha256':digest(out/name)} for name in ['music.mp3','video-audio.mp3']];write_json(out/'report.json',report)
    write_json(out/'timing.json',timing)
    rows=''
    for line in timing['lines']:
        if line['end']<start or line['start']>=start+clip:continue
        at=max(0,line['start']-.15-start);end=min(clip,line['end']+.25-start)
        rows+=f'<li><button data-start="{at}" data-end="{end}">{html.escape(line["text"])}</button></li>'
    page='''<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>TITLE · MV</title><style>*{box-sizing:border-box}body{margin:0;background:#172d3c;color:#f4e7ce;font:16px/1.7 system-ui,sans-serif}main{max-width:1120px;margin:auto;padding:24px}video{width:100%;display:block;border-radius:10px}button,a{font:inherit}button{padding:8px 13px;margin:5px;border:0;border-radius:5px;background:#e4dcc3;cursor:pointer;color:#253e47}a{color:#f6d391}img{width:100%}li{list-style:none}ul{padding:0}</style><main><h1>TITLE</h1><p>THEME · 上方歌词随演唱逐字跳动</p><video controls preload="metadata" poster="poster.jpg" src="video.mp4?v=HASH"></video><p><button id="play">从头播放</button><button id="pause">暂停</button><button id="back">后退一帧</button><button id="next">前进一帧</button><button id="slow">0.5 倍速</button><button id="normal">正常速度</button></p><p id="clock"></p><p><a href="video.mp4" download>下载完整视频</a> · <a href="music.mp3" download>歌曲 MP3</a> · <a href="video-audio.mp3" download>视频音轨 MP3</a> · <a href="report.json">检查记录</a></p><details><summary>歌词定位</summary><ul>ROWS</ul></details><details><summary>关键画面</summary><img src="storyboard.jpg" alt="关键画面联系图"></details><p>AI 生成音乐与插画；分镜、动作与歌词时间线由 agent 编排。保留音乐来源标识，参见项目 THIRD_PARTY.md。</p></main><script>const v=document.querySelector('video'),clock=document.querySelector('#clock');let end=DURATION;document.querySelector('#play').onclick=()=>{end=DURATION;v.currentTime=0;v.play().catch(console.error)};document.querySelector('#pause').onclick=()=>v.pause();for(const[id,d]of[['back',-1],['next',1]])document.querySelector('#'+id).onclick=()=>{v.pause();v.currentTime=Math.max(0,Math.min(DURATION-1/30,(Math.round(v.currentTime*30)+d)/30))};for(const[id,rate]of[['slow',.5],['normal',1]])document.querySelector('#'+id).onclick=()=>v.playbackRate=rate;for(const b of document.querySelectorAll('[data-start]'))b.onclick=()=>{end=Number(b.dataset.end);v.currentTime=Number(b.dataset.start);v.play().catch(console.error)};function tick(){if(!v.paused&&end<DURATION-.02&&v.currentTime>=end-.015)v.pause();clock.textContent=v.currentTime.toFixed(3)+' / '+DURATION.toFixed(3)+'s · '+(v.ended?'播放完毕':v.paused?'已暂停':'播放中');requestAnimationFrame(tick)}tick();</script></html>'''
    for token,value in [('TITLE',html.escape(title)),('THEME',html.escape(project['theme'])),('HASH',report['sha256'][:12]),('ROWS',rows),('DURATION',str(clip))]:page=page.replace(token,value)
    (out/'index.html').write_text(page,encoding='utf-8');print('Complete video, MP3s, review page and decode report ready:',video)

if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--project',required=True);p.add_argument('--out',required=True);a=p.parse_args();finish(a.project,a.out)
