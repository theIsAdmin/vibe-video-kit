"""Produce reviewable ASR/beat-based timing proposals; never replace accepted timings."""
import argparse,re,math,json,subprocess
from pathlib import Path
from difflib import SequenceMatcher
import numpy as np
from common import ROOT,read_json,write_json,inside,probe,FFMPEG

def clean(text):
    mapping=str.maketrans('燈關腦機尷尬說員這還會裡頭過來裏','灯关脑机尴尬说员这还会里头过来里')
    return ''.join(re.findall('[\u4e00-\u9fff]',text.translate(mapping)))

def estimate_beats(y,sr=16000):
    hop=256;nfft=2048
    if len(y)<nfft*2:raise ValueError('Audio is too short')
    frames=np.lib.stride_tricks.sliding_window_view(y,nfft)[::hop]
    spec=np.abs(np.fft.rfft(frames*np.hanning(nfft),axis=1));freq=np.fft.rfftfreq(nfft,1/sr)
    mag=np.log1p(spec[:,(freq>80)&(freq<7000)]*10);flux=np.r_[0,np.maximum(0,np.diff(mag,axis=0)).mean(axis=1)]
    flux=np.maximum(0,flux-np.convolve(flux,np.ones(43)/43,'same')*.8);flux/=max(.001,float(np.quantile(flux,.98)))
    acf=np.correlate(flux,flux,'full')[len(flux)-1:];bpms=np.linspace(70,160,1801);lags=60*sr/hop/bpms
    bpm=float(bpms[np.argmax(np.interp(lags,np.arange(len(acf)),acf))]);period=60/bpm;times=np.arange(len(flux))*hop/sr+nfft/(2*sr)
    phases=np.linspace(0,period,120);scores=[]
    for phase in phases:
        grid=np.arange(phase,len(y)/sr,period);scores.append(float(np.interp(grid,times,flux).mean()))
    phase=float(phases[np.argmax(scores)]);beats=[]
    for at in np.arange(phase,len(y)/sr,period):
        idx=np.flatnonzero((times>at-period*.12)&(times<at+period*.12));beats.append(float(times[idx[np.argmax(flux[idx])]]) if len(idx) else float(at))
    return bpm,beats

if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--project',required=True);p.add_argument('--model',default='small');p.add_argument('--model-dir',default='.models');a=p.parse_args()
    from faster_whisper import WhisperModel
    directory=Path(a.project).resolve();project=read_json(directory/'project.json');source=inside(directory,project['audio']['source'])
    destination=directory/'timing.proposed.json'
    if destination.exists():raise FileExistsError('Timing proposal exists. Review/rename it before running alignment again.')
    lyrics=[' '.join(clean(part) for part in line.split() if clean(part)) for line in (directory/'lyrics.txt').read_text(encoding='utf-8-sig').splitlines() if clean(line)]
    raw=subprocess.run([FFMPEG,'-v','error','-i',str(source),'-f','f32le','-ar','16000','-ac','1','-'],capture_output=True,check=True).stdout;y=np.frombuffer(raw,dtype=np.float32).copy()
    model=WhisperModel(a.model,device='cpu',compute_type='int8',cpu_threads=4,download_root=str((ROOT/a.model_dir).resolve()))
    segments,_=model.transcribe(y,language='zh',beam_size=1,best_of=1,word_timestamps=True,vad_filter=False,condition_on_previous_text=False,initial_prompt='中文歌曲：'+'。'.join(lyrics))
    recognized=[];chars=[]
    for segment in segments:
        recognized.append({'start':segment.start,'end':segment.end,'text':segment.text})
        for word in segment.words or []:
            text=clean(word.word);start=word.start;end=word.end
            if not text:continue
            if end-start<.025:start=max(chars[-1]['end'] if chars else 0,start-.12);end=max(start+.06,end)
            for i,ch in enumerate(text):chars.append({'char':ch,'start':start+(end-start)*i/len(text),'end':start+(end-start)*(i+1)/len(text),'asr_probability':word.probability})
    raw_text=''.join(c['char'] for c in chars);cursor=0;lines=[];repairs=[]
    for i,text in enumerate(lyrics):
        expected=clean(text);index=raw_text.find(expected,cursor);score=1.0
        if index<0:
            candidates=[(SequenceMatcher(None,expected,raw_text[k:k+len(expected)]).ratio(),k) for k in range(cursor,len(chars)-len(expected)+1)]
            if not candidates:raise ValueError('Not enough recognized characters for '+text)
            score,index=max(candidates)
            if score<.55:raise ValueError('Cannot locate lyric reliably; correct the song/ASR manually: '+text)
            repairs.append({'line':i,'expected':expected,'recognized':raw_text[index:index+len(expected)],'similarity':score,'needs_review':True})
        selected=[dict(char,char=expected[j]) for j,char in enumerate(chars[index:index+len(expected)])];cursor=index+len(expected)
        cue=len(text.split()[0]) if len(text.split())>1 else len(selected)//2
        lines.append({'id':i,'text':text,'start':selected[0]['start'],'end':selected[-1]['end'],'cueTime':selected[cue]['start'],'clauseTime':selected[cue]['start'],'chars':selected})
    bpm,beats=estimate_beats(y);target=max(0,lines[0]['start']-1.65);crop=min(beats,key=lambda x:abs(x-target));end=min(len(y)/16000,lines[-1]['end']+1.2);duration=math.ceil((end-crop)*30)/30
    for line in lines:
        for key in ['start','end','cueTime','clauseTime']:line[key]=round(line[key]-crop,4)
        for char in line['chars']:
            for key in ['start','end']:char[key]=round(char[key]-crop,4)
        line['cut']=max(0,round(line['start']-.18,4))
    lines[0]['cut']=0
    proposal={'title':project['title'],'duration':duration,'source_duration':len(y)/16000,'source_crop_start':crop,'source_crop_end':end,'bpm':round(bpm,2),'beats':[round(b-crop,4) for b in beats if crop<=b<crop+duration],'lines':lines,'alignment_method':'Whisper word timestamps matched to supplied Chinese lyrics; approximate spectral-onset beat grid; NOT vocal melody extraction or forced alignment','alignment_repairs':repairs,'review_required':True}
    write_json(destination,proposal);write_json(directory/'asr.proposed.json',recognized)
    project['audio']['crop_start']=crop;project['preview']={'start':max(0,lines[0]['start']-.3),'end':min(duration,lines[min(1,len(lines)-1)]['end']+.3)};write_json(directory/'project.proposed.json',project)
    print('Timing proposals written. Review lyric match/cuts/homophones and listen before accepting. No accepted project file was overwritten.')
