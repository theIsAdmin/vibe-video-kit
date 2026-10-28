const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '..');
const catalog = JSON.parse(fs.readFileSync(path.join(root, 'catalog.json'), 'utf8'));
function assert(ok, message) { if (!ok) throw Error(message); }
function sha(file) { return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'); }
assert(catalog.length === 20, 'Expected 20 first-edition templates');
assert(new Set(catalog.map(x => x.id)).size === 20, 'Duplicate template IDs');
const readme = fs.readFileSync(path.join(root, 'README.md'), 'utf8');
const gallery = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
for (const row of catalog) {
  assert(/^\d\d$/.test(row.id), 'Invalid style number');
  for (const name of ['source', 'video', 'poster']) {
    const target = path.resolve(root, row[name]);
    assert(target.startsWith(root + path.sep) && fs.statSync(target).isFile(), 'Missing ' + row[name]);
  }
  assert(sha(path.join(root, row.source)) === row.template_sha256, 'Template hash mismatch: ' + row.id);
  assert(sha(path.join(root, row.video)) === row.preview_sha256, 'Preview hash mismatch: ' + row.id);
  assert(readme.includes('id="style-' + row.id + '"') && readme.includes(row.source), 'Missing README entry: ' + row.id);
  assert(gallery.includes('id="style-' + row.id + '"') && gallery.includes(row.video), 'Missing gallery entry: ' + row.id);
}
for (const file of ['index.html', ...catalog.map(x => x.source)]) {
  const text = fs.readFileSync(path.join(root, file), 'utf8');
  assert(!text.includes('D:/vibe') && !text.includes('D:\\vibe') && !text.includes('C:\\Users\\'), 'Machine path in ' + file);
  for (const match of text.matchAll(/(?:src|href)=["']([^"']+)["']/g)) {
    const url = match[1];
    if (/^(?:https?:|data:|#|mailto:|javascript:)/.test(url) || /[{}+$]/.test(url)) continue;
    const clean = decodeURIComponent(url.split(/[?#]/)[0]);
    if (!clean) continue;
    const target = path.resolve(path.dirname(path.join(root, file)), clean);
    assert(target.startsWith(root + path.sep) && fs.existsSync(target), 'Broken local reference in ' + file + ': ' + url);
  }
}
for (const file of ['LICENSE', 'THIRD_PARTY_NOTICES.md', 'UPSTREAM.json', 'skills/vibe-video-kit/SKILL.md']) {
  assert(fs.statSync(path.join(root, file)).isFile(), 'Missing ' + file);
}
assert(fs.readFileSync(path.join(root, 'LICENSE'), 'utf8').includes('Copyright (c) 2026 肖雄 XIAOXIONG'), 'Upstream copyright missing');
console.log('PASS: 20 templates, 20 videos, 20 posters, source hashes, README anchors, gallery links and license.');
