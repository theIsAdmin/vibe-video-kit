import argparse, re, shutil
from pathlib import Path
from common import ROOT,read_json,write_json

if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--slug',required=True);p.add_argument('--title',required=True);p.add_argument('--lyrics',required=True);p.add_argument('--song',required=True);a=p.parse_args()
    if not re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*',a.slug):raise ValueError('slug must be lowercase letters, digits and hyphens')
    song=Path(a.song).resolve(strict=True);lyrics=Path(a.lyrics).resolve(strict=True);lines=[s.strip() for s in lyrics.read_text(encoding='utf-8-sig').splitlines() if s.strip() and not s.strip().startswith('[')]
    if not lines:raise ValueError('Lyrics are empty')
    target=ROOT/'projects'/a.slug
    if target.exists():raise FileExistsError(target)
    target.mkdir(parents=True);example=ROOT/'examples/biebole'
    # The exemplar is a starting point for the agent, not an automatically adapted MV.
    for name in ['assets','scenes.ts','sprites.json','poses.json','sound-design.json']:
        source=example/name
        if source.is_dir():shutil.copytree(source,target/name)
        else:shutil.copy2(source,target/name)
    (target/'audio').mkdir();shutil.copy2(song,target/'audio'/('song'+song.suffix.lower()))
    (target/'lyrics.txt').write_text('\n'.join(lines)+'\n',encoding='utf-8')
    project=read_json(example/'project.json');project.update(slug=a.slug,title=a.title,theme=a.title,ready=False)
    project['audio']={'source':'audio/song'+song.suffix.lower(),'crop_start':0,'gain_db':-2,'fade_out':.45,'ai_model':'Set the actual source model/provider','export':'Set source attribution'}
    project.pop('key_times',None);write_json(target/'project.json',project)
    print('Created draft:',target)
    print('Next: align music, review proposed timestamps, adapt scenes/artwork/action cues, then set ready=true. See AGENTS.md.')
