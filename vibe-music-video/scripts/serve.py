"""Local-only static preview server with MP4 byte ranges for video seeking."""
import argparse, functools, os, re, shutil
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

class Handler(SimpleHTTPRequestHandler):
    def send_head(self):
        self._remaining=None
        p=Path(self.translate_path(self.path))
        if p.suffix.lower()!='.mp4' or not p.is_file():
            return super().send_head()
        f=p.open('rb'); stat=os.fstat(f.fileno()); size=stat.st_size
        start,end=0,size-1
        value=self.headers.get('Range')
        if value:
            m=re.fullmatch(r'bytes=(\d+)-(\d*)',value.strip())
            if not m or int(m[1])>=size:
                f.close(); self.send_response(416); self.send_header('Content-Range',f'bytes */{size}'); self.end_headers(); return None
            start=int(m[1]); end=min(int(m[2]) if m[2] else size-1,size-1)
            if end<start:
                f.close(); self.send_error(416); return None
        self.send_response(206 if value else 200)
        self.send_header('Content-Type','video/mp4')
        self.send_header('Accept-Ranges','bytes')
        self.send_header('Content-Length',str(end-start+1))
        self.send_header('Last-Modified',self.date_time_string(stat.st_mtime))
        if value:self.send_header('Content-Range',f'bytes {start}-{end}/{size}')
        self.end_headers(); f.seek(start); self._remaining=end-start+1
        return f
    def copyfile(self,source,outputfile):
        if self._remaining is None:return shutil.copyfileobj(source,outputfile)
        remaining=self._remaining
        try:
            while remaining:
                buf=source.read(min(1024*1024,remaining))
                if not buf:break
                outputfile.write(buf);remaining-=len(buf)
        except (BrokenPipeError,ConnectionResetError,ConnectionAbortedError):pass

if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('directory');parser.add_argument('--port',type=int,required=True)
    args=parser.parse_args();root=Path(args.directory).resolve(strict=True)
    with ThreadingHTTPServer(('127.0.0.1',args.port),functools.partial(Handler,directory=str(root))) as server:
        print(f'http://127.0.0.1:{args.port}/',flush=True);server.serve_forever()
