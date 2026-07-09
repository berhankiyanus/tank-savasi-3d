// Capacitor webDir'i (www/) sadece web varlıklarından oluşturur.
// (server.js, node_modules, korku/, .git vs. native pakete GİRMEZ.)
const fs = require('fs');
const path = require('path');

const root = __dirname;
const out = path.join(root, 'www');
const items = ['index.html', 'main.js', 'manifest.json', 'sw.js', 'libs', 'assets'];

function copy(src, dst) {
  const st = fs.statSync(src);
  if (st.isDirectory()) {
    fs.mkdirSync(dst, { recursive: true });
    for (const f of fs.readdirSync(src)) {
      if (f === '.DS_Store') continue;
      copy(path.join(src, f), path.join(dst, f));
    }
  } else {
    fs.copyFileSync(src, dst);
  }
}

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
for (const it of items) {
  const s = path.join(root, it);
  if (fs.existsSync(s)) copy(s, path.join(out, it));
  else console.warn('atlandı (yok):', it);
}
console.log('www/ oluşturuldu:', items.filter(i => fs.existsSync(path.join(root, i))).join(', '));
