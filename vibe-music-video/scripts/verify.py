import argparse
from pathlib import Path
from common import probe, run, FFMPEG, digest, write_json

def verify(path, expected=None):
    path=Path(path);info=probe(path);v=next(s for s in info['streams'] if s['codec_type']=='video');a=next(s for s in info['streams'] if s['codec_type']=='audio')
    _,errors=run([FFMPEG,'-v','error','-i',path,'-f','null','-'])
    if errors.strip():raise ValueError(errors)
    if expected:
        assert v['width']==expected['width'] and v['height']==expected['height']
        assert v['avg_frame_rate']==str(expected['fps'])+'/1'
        assert int(v['nb_frames'])==expected['last']-expected['first']+1
        assert abs(float(info['format']['duration'])-expected['duration'])<.06
    return {'file':path.name,'width':v['width'],'height':v['height'],'fps':v['avg_frame_rate'],'frames':int(v['nb_frames']),'duration':float(info['format']['duration']),'video_codec':v['codec_name'],'audio_codec':a['codec_name'],'sha256':digest(path),'complete_decode_errors':errors,'subjective_listening_performed':False,'visual_review':'Required: inspect contact sheet and play the rendered video.'}

if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--file',required=True);a=p.parse_args();report=verify(a.file);write_json(Path(a.file).with_suffix('.verification.json'),report);print(report)
