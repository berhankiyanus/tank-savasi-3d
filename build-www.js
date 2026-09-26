// Capacitor webDir'i (www/) sadece web varlıklarından oluşturur.
// (server.js, node_modules, korku/, .git vs. native pakete GİRMEZ.)
const fs = require('fs');
const path = require('path');

const root = __dirname;
const out = path.join(root, 'www');
const { files: items } = require('./release-policy.cjs');
require('./legal/verify-release.cjs').verifyRelease();
// Imports in .mjs files must parse too; main.js minification alone cannot catch them.
for(const file of items.filter(f=>/\.m?js$/.test(f)))require('child_process').execFileSync(process.execPath,['--input-type=module','--check'],{input:fs.readFileSync(path.join(root,file)),stdio:['pipe','pipe','pipe']});

function copy(src, dst) {
  fs.mkdirSync(path.dirname(dst), { recursive: true });
  const st = fs.statSync(src);
  if (st.isDirectory()) {
    fs.mkdirSync(dst, { recursive: true });
    for (const f of fs.readdirSync(src)) {
      if (f === '.DS_Store') continue;
      copy(path.join(src, f), path.join(dst, f));
    }
  } else if (path.basename(src) === 'main.js') {
    // üretim kopyası: geliştirme simülasyonu (sahte reklam/satın alma başarısı) kesinlikle kapalı
    const js = fs.readFileSync(src, 'utf8'), re = /^const DEV_SIM = .*$/m;
    if (!re.test(js)) throw new Error('main.js: DEV_SIM satırı bulunamadı (build-www)');
    fs.writeFileSync(dst, js.replace(re, 'const DEV_SIM = false;'));
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
// LANSMAN P1-5: üretim kopyasında JS küçültme (bundle değil → import yolları ve sw.js CORE aynı kalır; top-level await ESM'de desteklenir)
try {
  const { execFileSync } = require('child_process');
  const esb = path.join(root, 'node_modules', '.bin', 'esbuild');
  if (fs.existsSync(esb)) {
    const walk = d => fs.readdirSync(d).flatMap(f => { const q = path.join(d, f); return fs.statSync(q).isDirectory() ? walk(q) : (q.endsWith('.js') ? [q] : []); });
    const targets = [path.join(out, 'main.js'), ...walk(path.join(out, 'libs'))];
    for (const f of targets) execFileSync(esb, [f, '--minify', '--format=esm', '--target=es2022', '--allow-overwrite', '--log-level=error', '--outfile=' + f]);
    console.log('küçültüldü:', targets.length, 'dosya (esbuild)');
  } else console.warn('esbuild yok (npm i -D esbuild) → küçültmesiz kopya');
} catch (e) { console.warn('küçültme atlandı:', e.message); }
const sizeOf = d => fs.readdirSync(d).reduce((a, f) => { const q = path.join(d, f); const st = fs.statSync(q); return a + (st.isDirectory() ? sizeOf(q) : st.size); }, 0);
const mb = sizeOf(out) / 1048576;
const digest=require('crypto').createHash('sha256');for(const file of [...items].sort()){digest.update(file+'\0');digest.update(fs.readFileSync(path.join(root,file)));}
fs.writeFileSync(path.join(out,'build-info.json'),JSON.stringify({sourceDigest:digest.digest('hex'),builtAt:new Date().toISOString()},null,2));
console.log('www/ oluşturuldu:', items.filter(i => fs.existsSync(path.join(root, i))).join(', '), '·', mb.toFixed(2), 'MB' + (mb > 7 ? '  ⚠ 7 MB hedefi aşıldı' : ''));
