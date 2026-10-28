import argparse, numpy as np, wave
from pathlib import Path
from common import project_at, inside, read_json, run, FFMPEG

def build(directory, output):
    directory, project, timing = project_at(directory);output=Path(output);folder=output/'audio';folder.mkdir(exist_ok=False)
    duration=timing['duration'];source=inside(directory,project['audio']['source']);settings=project['audio']
    run([FFMPEG,'-v','error','-n','-ss',settings['crop_start'],'-i',source,'-t',duration,'-af',f'afade=t=in:d=0.025,afade=t=out:st={duration-settings.get("fade_out",.45)}:d={settings.get("fade_out",.45)},volume={settings.get("gain_db",-2)}dB','-ar','48000','-ac','2','-c:a','pcm_s16le',folder/'music.wav'])
    sr=48000;n=round(duration*sr);sfx=np.zeros(n,dtype=np.float32)
    design=read_json(inside(directory,project['sound_design']));rng=np.random.default_rng(design.get('seed',717))
    for event in design['events']:
        kind=event['kind'];length=event.get('length',.16);amp=event.get('amp',.01);x=np.arange(round(sr*length))/sr
        if kind=='ping':
            f=event['f'];sound=(np.sin(2*np.pi*f*x)+.18*np.sin(2*np.pi*f*2*x))*np.exp(-x*27)*amp
        elif kind=='paper':
            noise=np.convolve(rng.normal(0,1,len(x)),np.ones(7)/7,'same');sound=noise*np.sin(np.pi*x/length)**2*amp
        elif kind=='rewind':
            freq=430-240*x/length;sound=np.sin(2*np.pi*np.cumsum(freq)/sr)*np.exp(-x*22)*amp
        else: raise ValueError('Unknown sound effect: '+kind)
        a=max(0,round(event['at']*sr));b=min(n,a+len(sound))
        if b>a:sfx[a:b]+=sound[:b-a]
    with wave.open(str(folder/'foley.wav'),'wb') as w:
        w.setnchannels(2);w.setsampwidth(2);w.setframerate(sr);w.writeframes((np.clip(np.stack([sfx,sfx],axis=1),-1,1)*32767).astype('<i2').tobytes())
    run([FFMPEG,'-v','error','-n','-i',folder/'music.wav','-i',folder/'foley.wav','-filter_complex','[0:a][1:a]amix=inputs=2:duration=longest:normalize=0,loudnorm=I=-16:TP=-1.3:LRA=11','-t',duration,'-ar','48000','-c:a','pcm_s16le',folder/'mix.wav'])
    print('Prepared song, synthesized action effects and mix.')

if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--project',required=True);p.add_argument('--out',required=True);a=p.parse_args();build(a.project,a.out)
