#!/usr/bin/env node
// Playable ad derleyici: src/playable.js (three.js ES modülü) → esbuild IIFE minify → shell.html içine inline (font + GLB base64) → dist/
// kullanım: ESBUILD=<esbuild yolu> node tools/playable/build.js   → dist/tank-savasi-playable.html (MRAID/Meta/DAPI evrensel), -google.html (+ExitApi) ve .zip
const fs = require('fs'), path = require('path'), { execSync } = require('child_process');
const ROOT = path.resolve(__dirname, '../..'), SRC = path.join(__dirname, 'src'), DIST = path.join(__dirname, 'dist');
const ESBUILD = process.env.ESBUILD || path.join(ROOT, 'node_modules/.bin/esbuild');
const STORE_URL = process.env.STORE_URL || 'https://play.google.com/store/apps/details?id=com.berhankiyanus.tanksavasi';
fs.mkdirSync(DIST, { recursive: true });
const js = execSync(`"${ESBUILD}" "${path.join(SRC, 'playable.js')}" --bundle ${process.env.DEBUG ? '' : '--minify'} --format=iife --target=es2018 --legal-comments=none --log-level=error`, { maxBuffer: 64 << 20 }).toString();
require('../../legal/verify-release.cjs').verifyRelease();
const b64 = f => fs.readFileSync(f).toString('base64');
let html = fs.readFileSync(path.join(SRC, 'shell.html'), 'utf8')
  .replace('%%FONT_MAIN%%', b64(path.join(ROOT, 'assets/fonts/BarlowSemiCondensed-SemiBold.ttf')))
  .replace('%%FONT_SYMBOLS%%', b64(path.join(ROOT, 'assets/fonts/field-symbols.ttf')))
  .replace('%%GLB_PLAYER%%', b64(path.join(ROOT, 'assets/tank_goldking_mk2.glb')))
  .replace('%%GLB_ENEMY%%', b64(path.join(ROOT, 'assets/tank_recruit_mk2.glb')))
  .replace('%%GLB_BOSS%%', b64(path.join(ROOT, 'assets/tank_heavy_mk2.glb')))
  .replace('%%STORE_URL%%', STORE_URL)
  .replace('%%LICENSE_TEXT%%', ['three-r160-MIT.txt','Barlow-OFL.txt','NotoEmoji-OFL.txt'].map(f => fs.readFileSync(path.join(ROOT,'legal/licenses',f),'utf8')).join('\n\n').replace(/[ \t]+$/gm,'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'))
  .replace('%%JS%%', () => js.replace(/<\/script/gi, '<\\/script'));
const out = {};
out.universal = html.replace('%%GOOGLE_EXIT%%', '');
out.google = html.replace('%%GOOGLE_EXIT%%', '<script type="text/javascript" src="https://tpc.googlesyndication.com/pagead/gadgets/html5/api/exitapi.js"></script>');
if (process.env.DEBUG) { fs.writeFileSync(path.join(DIST, 'tank-savasi-playable-debug.html'), out.universal); console.log('debug build yazıldı'); process.exit(0); }
fs.writeFileSync(path.join(DIST, 'tank-savasi-playable.html'), out.universal);
fs.writeFileSync(path.join(DIST, 'index.html'), out.google);
try { execSync(`cd "${DIST}" && rm -f tank-savasi-playable-google.zip && zip -q -X tank-savasi-playable-google.zip index.html`); } catch (e) { console.error('zip yok:', e.message); }
fs.renameSync(path.join(DIST, 'index.html'), path.join(DIST, 'tank-savasi-playable-google.html'));
for (const f of fs.readdirSync(DIST)) console.log(f.padEnd(40), (fs.statSync(path.join(DIST, f)).size / 1024).toFixed(0) + ' KB');
console.log('js', (js.length / 1024).toFixed(0), 'KB (minified bundle)');
