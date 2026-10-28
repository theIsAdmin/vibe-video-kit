const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const port = Number(process.env.PORT || 4173);
const types = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.css':'text/css; charset=utf-8','.mp4':'video/mp4','.jpg':'image/jpeg','.png':'image/png','.md':'text/plain; charset=utf-8'};
http.createServer((req, res) => {
  let name;
  try { name = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); }
  catch { res.writeHead(400).end(); return; }
  if (name.split('/').some(x => x.startsWith('.'))) { res.writeHead(404).end(); return; }
  let target = path.resolve(root, '.' + name);
  if (target !== root && !target.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
  if (fs.existsSync(target) && fs.statSync(target).isDirectory()) target = path.join(target, 'index.html');
  if (!fs.existsSync(target) || !fs.statSync(target).isFile()) { res.writeHead(404).end(); return; }
  const size = fs.statSync(target).size;
  const headers = {'Content-Type': types[path.extname(target)] || 'application/octet-stream','Accept-Ranges':'bytes'};
  let start=0, end=size-1;
  if (req.headers.range) {
    const m = /^bytes=(\d+)-(\d*)$/.exec(req.headers.range);
    if (!m) { res.writeHead(416, {'Content-Range': 'bytes */'+size}).end(); return; }
    start=Number(m[1]); end=m[2] ? Math.min(Number(m[2]),size-1) : size-1;
    if (start>=size || start>end) { res.writeHead(416, {'Content-Range': 'bytes */'+size}).end(); return; }
    headers['Content-Range']='bytes '+start+'-'+end+'/'+size;
  }
  headers['Content-Length']=Math.max(0,end-start+1);
  res.writeHead(req.headers.range ? 206 : 200,headers);
  if (req.method==='HEAD' || size===0) { res.end(); return; }
  fs.createReadStream(target,{start,end}).on('error',()=>res.destroy()).pipe(res);
}).listen(port,'127.0.0.1',()=>console.log('Video gallery: http://127.0.0.1:'+port));
