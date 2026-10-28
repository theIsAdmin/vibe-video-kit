import sys,unittest,copy
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'scripts'))
from common import project_at,validate_timing,inside,ROOT
from package import release_files

class PipelineTests(unittest.TestCase):
    def test_real_timing_is_valid(self):
        _,_,timing=project_at(ROOT/'examples/biebole');validate_timing(timing)
    def test_invalid_character_timing_is_rejected(self):
        _,_,t=project_at(ROOT/'examples/biebole');t=copy.deepcopy(t);t['lines'][0]['chars'][1]['start']=0
        with self.assertRaises(ValueError):validate_timing(t)
    def test_project_file_cannot_escape_directory(self):
        with self.assertRaises(ValueError):inside(ROOT/'examples/biebole','../../README.md')
    def test_release_excludes_local_outputs_and_private_projects(self):
        paths=[p.relative_to(ROOT).parts for p in release_files()]
        self.assertFalse(any(p[0] in ['outputs','projects','node_modules','.git','.venv'] for p in paths))
        self.assertTrue(any(p[-1]=='song.mp3' for p in paths))

if __name__=='__main__':unittest.main()
