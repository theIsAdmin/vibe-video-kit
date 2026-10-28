import argparse, sys, importlib.metadata
from pathlib import Path
from common import project_at, validate_timing, inside, probe, run, FFMPEG
from PIL import Image
import numpy

def check(directory):
    if sys.version_info < (3, 11):
        raise RuntimeError('Python 3.11+ is required')
    directory, project, timing = project_at(directory)
    validate_timing(timing)
    if not project.get('ready'):
        raise ValueError('Project is not ready; adapt the storyboard before rendering')
    for name in ['scenes.ts', 'sprites.json', 'poses.json']:
        if not (directory / name).is_file(): raise FileNotFoundError(name)
    for name in ['LXGWWenKai-Regular.ttf', 'ZCOOLKuaiLe-Regular.ttf']:
        if not (directory / 'assets' / name).is_file(): raise FileNotFoundError(name)
    images = list((directory / 'assets').glob('*.png'))
    if not images: raise ValueError('No artwork')
    for image in images:
        with Image.open(image) as im: im.verify()
    audio = probe(inside(directory, project['audio']['source']))
    if not any(s['codec_type'] == 'audio' for s in audio['streams']): raise ValueError('Song has no audio stream')
    if float(audio['format']['duration']) + .1 < project['audio']['crop_start'] + timing['duration']:
        raise ValueError('Song is shorter than the configured crop; generate new timings for new music')
    encoders = run([FFMPEG, '-hide_banner', '-encoders'])[0]
    if 'libmp3lame' not in encoders: raise ValueError('FFmpeg needs libmp3lame')
    print('Project OK:', project['title'], '|', timing['duration'], 'seconds |', len(timing['lines']), 'lyric lines')
    print('Python', sys.version.split()[0], '| NumPy', numpy.__version__, '| Pillow', importlib.metadata.version('Pillow'))
    print('FFmpeg/ffprobe, source audio, fonts, images and character timestamps: OK')

if __name__ == '__main__':
    p=argparse.ArgumentParser();p.add_argument('--project',required=True);check(p.parse_args().project)
