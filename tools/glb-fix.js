#!/usr/bin/env node
// GLB son işlem + doğrulayıcı (varlık boru hattı): malzeme/düğüm adlarını sözleşmeye göre yeniden adlandırır,
// sıkıştırma/doku/animasyon olmadığını, üçgen ve boyut bütçesini, TankPaint/TankTurret varlığını denetler.
// kullanım: node tools/glb-fix.js <in.glb> <out.glb> [--rename "TankPaint.001=TankPaint,Main=TankPaint"] [--max-tris 3000] [--max-kb 150] [--decor]
const fs = require('fs');
const args = process.argv.slice(2);
const inp = args[0], out = args[1];
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const renames = Object.fromEntries((opt('--rename', '') || '').split(',').filter(Boolean).map(p => p.split('=')));
const maxTris = +opt('--max-tris', 3000), maxKb = +opt('--max-kb', 150), decor = args.includes('--decor');
const buf = fs.readFileSync(inp);
if (buf.readUInt32LE(0) !== 0x46546C67) throw new Error('GLB değil');
const jsonLen = buf.readUInt32LE(12);
const json = JSON.parse(buf.slice(20, 20 + jsonLen).toString('utf8'));
const rest = buf.slice(20 + jsonLen); // BIN chunk(ları)
const strip = n => n.replace(/\.\d{3}$/, '');
for (const m of json.materials || []) { const n = m.name || ''; m.name = renames[n] || renames[strip(n)] || strip(n); }
for (const n of json.nodes || []) { const nm = n.name || ''; if (renames[nm]) n.name = renames[nm]; }
const tris = (json.meshes || []).reduce((a, m) => a + m.primitives.reduce((x, p) => x + Math.round((p.indices != null ? json.accessors[p.indices].count : json.accessors[p.attributes.POSITION].count) / 3), 0), 0);
const problems = [];
if ((json.images || []).length || (json.textures || []).length) problems.push('doku var (0 olmalı)');
if ((json.animations || []).length) problems.push('animasyon var');
if ((json.skins || []).length) problems.push('skin/armature var');
for (const e of json.extensionsRequired || []) if (/draco|meshopt|texture_basisu/i.test(e)) problems.push('sıkıştırma uzantısı: ' + e);
if (tris > maxTris) problems.push(`üçgen ${tris} > ${maxTris}`);
const matNames = (json.materials || []).map(m => m.name), nodeNames = (json.nodes || []).map(n => n.name);
if (!decor) {
  if (!matNames.includes('TankPaint')) problems.push('TankPaint malzemesi yok');
  if (!nodeNames.some(n => /^TankTurret/.test(n || ''))) problems.push('TankTurret* düğümü yok');
}
// yeniden paketle (JSON 4 bayt hizalı)
let js = Buffer.from(JSON.stringify(json), 'utf8');
while (js.length % 4) js = Buffer.concat([js, Buffer.from(' ')]);
const head = Buffer.alloc(12); head.writeUInt32LE(0x46546C67, 0); head.writeUInt32LE(2, 4);
const jh = Buffer.alloc(8); jh.writeUInt32LE(js.length, 0); jh.writeUInt32LE(0x4E4F534A, 4);
const outBuf = Buffer.concat([head, jh, js, rest]); outBuf.writeUInt32LE(outBuf.length, 8);
if (out) fs.writeFileSync(out, outBuf);
const kb = outBuf.length / 1024; if (kb > maxKb) problems.push(`boyut ${kb.toFixed(0)} KB > ${maxKb}`);
const report = { in: inp, out, kb: +kb.toFixed(1), tris, materials: matNames, nodes: nodeNames, ok: !problems.length, problems };
console.log(JSON.stringify(report));
process.exit(problems.length ? 1 : 0);
