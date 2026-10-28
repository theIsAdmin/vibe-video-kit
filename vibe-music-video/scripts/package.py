"""Create a source ZIP from an explicit allowlist; never package local projects or outputs."""
import argparse,zipfile,re
from pathlib import Path
from common import ROOT,digest,write_json

ROOT_FILES=['README.md','AGENTS.md','LICENSE','THIRD_PARTY.md','package.json','pnpm-lock.yaml','pnpm-workspace.yaml','requirements.txt','requirements-align.txt','.gitignore','.gitattributes','.env.example']
DIRECTORIES=['src','scripts','docs','examples','skills','.github','tests','licenses']

def release_files():
    files=[ROOT/name for name in ROOT_FILES]
    for name in DIRECTORIES:
        files.extend(p for p in (ROOT/name).rglob('*') if p.is_file() and '__pycache__' not in p.parts and p.suffix!='.pyc')
    for p in files:
        if not p.is_file():raise FileNotFoundError(p)
        if p.is_symlink():raise ValueError('Symlinks must not enter source ZIP: '+str(p))
        if p.stat().st_size>=90*1024*1024:raise ValueError('File too large for normal GitHub tracking: '+str(p))
        if p.suffix in ['.json','.md','.py','.mjs','.ts','.tsx','.txt','.yml','.yaml']:
            text=p.read_text(encoding='utf-8')
            if re.search(r'(?i)[a-z]:[\\/](?:users|motiongit)[\\/]',text):raise ValueError('Local machine path in '+str(p.relative_to(ROOT)))
            if re.search(r'gh[pousr]_[A-Za-z0-9]{25,}|github_pat_[A-Za-z0-9_]{30,}|sk-[A-Za-z0-9]{30,}',text):raise ValueError('Possible credential in '+str(p.relative_to(ROOT)))
    return sorted(set(files))

if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--out',default='dist/vibe-music-video.zip');a=p.parse_args();out=(ROOT/a.out).resolve();out.parent.mkdir(parents=True,exist_ok=True)
    if out.exists():raise FileExistsError('ZIP exists; choose a new filename')
    files=release_files()
    with zipfile.ZipFile(out,'x',compression=zipfile.ZIP_DEFLATED,compresslevel=6) as z:
        for f in files:z.write(f,Path('vibe-music-video')/f.relative_to(ROOT))
    with zipfile.ZipFile(out) as z:assert z.testzip() is None
    write_json(out.with_suffix('.manifest.json'),{'file':out.name,'sha256':digest(out),'bytes':out.stat().st_size,'files':[{'path':str(f.relative_to(ROOT)).replace('\\','/'),'bytes':f.stat().st_size,'sha256':digest(f)} for f in files]})
    print('Source ZIP verified:',out,'| files:',len(files),'| bytes:',out.stat().st_size)
