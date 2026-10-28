from pathlib import Path
import json, os, subprocess, hashlib

ROOT = Path(__file__).resolve().parents[1]
FFMPEG = os.environ.get('FFMPEG_PATH', 'ffmpeg')
FFPROBE = os.environ.get('FFPROBE_PATH', 'ffprobe')

def run(args):
    p = subprocess.run([str(a) for a in args], capture_output=True, text=True, encoding='utf-8', errors='replace')
    if p.returncode:
        raise RuntimeError(f'{Path(str(args[0])).name} failed:\n{p.stderr[-5000:]}')
    return p.stdout, p.stderr

def read_json(path):
    return json.loads(Path(path).read_text(encoding='utf-8'))

def write_json(path, value):
    Path(path).write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')

def inside(directory, value):
    directory = Path(directory).resolve()
    path = (directory / value).resolve()
    if not path.is_relative_to(directory):
        raise ValueError('Project file must remain inside project directory: ' + value)
    return path

def project_at(directory):
    directory = Path(directory).resolve()
    project = read_json(directory / 'project.json')
    timing = read_json(inside(directory, project['timing']))
    return directory, project, timing

def digest(path):
    with Path(path).open('rb') as f:
        return hashlib.file_digest(f, 'sha256').hexdigest()

def probe(path):
    return json.loads(run([FFPROBE, '-v', 'error', '-show_streams', '-show_format', '-of', 'json', path])[0])

def validate_timing(timing):
    import math
    duration = timing['duration']
    if not isinstance(duration, (float, int)) or not math.isfinite(duration) or duration <= 0:
        raise ValueError('duration must be positive and finite')
    if not timing['lines']:
        raise ValueError('No lyric lines')
    last_start = -1
    for line in timing['lines']:
        chars = line['chars']
        if ''.join(line['text'].split()) != ''.join(c['char'] for c in chars):
            raise ValueError('Lyric text and character timestamps differ: ' + line['text'])
        if not 0 <= line['start'] < line['end'] <= duration or line['start'] < last_start:
            raise ValueError('Invalid lyric line interval: ' + line['text'])
        if not 0 <= line['cut'] <= line['start'] or not line['start'] <= line['cueTime'] <= line['end']:
            raise ValueError('Invalid cut/cue: ' + line['text'])
        previous = line['start']
        for char in chars:
            if not (previous - .001 <= char['start'] < char['end'] <= line['end'] + .001):
                raise ValueError('Invalid/non-monotonic character timestamps: ' + line['text'])
            previous = char['end']
        last_start = line['start']
    if any(not 0 <= beat <= duration for beat in timing.get('beats', [])):
        raise ValueError('Beat outside composition')
