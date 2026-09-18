// Capacitor webDir'i (www/) sadece web varlıklarından oluşturur.
// (server.js, node_modules, korku/, .git vs. native pakete GİRMEZ.)
const fs = require('fs');
const path = require('path');

const root = __dirname;
const out = path.join(root, 'www');
const items = ['index.html', 'main.js', 'manifest.json', 'sw.js', 'libs', 'assets'];

const EXCLUDE = new Set(['icon-1024.png']); // 813KB kaynak ikon — pakete girmesin (resources/icon.png zaten kaynak)

function copy(src, dst) {
  const st = fs.statSync(src);
  if (st.isDirectory()) {
    fs.mkdirSync(dst, { recursive: true });
    for (const f of fs.readdirSync(src)) {
      if (f === '.DS_Store' || EXCLUDE.has(f)) continue;
      copy(path.join(src, f), path.join(dst, f));
    }
  } else if (path.basename(src) === 'sw.js') {
    // native sürüm damgası: her paket taze önbellek adıyla çıkar (offline eski kabukta kalmaz)
    const stamped = fs.readFileSync(src, 'utf8').replaceAll('__BUILDSTAMP__', Date.now().toString(36)); // damga yorumda da geçiyor → replaceAll
    fs.writeFileSync(dst, stamped);
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
