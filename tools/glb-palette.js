#!/usr/bin/env node
// Kaynak GLB'nin malzeme taban renklerini (baseColorFactor) hedef GLB'ye ad eşlemesiyle taşır.
// Neden: Blender'a giren glTF'te vertex-color düğümü bağlıysa Principled Base Color okunamaz → boru hattı gri (0.8) kalır.
// kullanım: node tools/glb-palette.js <hedef.glb> <kaynak.glb> "Main_Dark=TankDark,Main_Light=TankLight,..." [--rough 0.6]
const fs = require('fs');
const [target, source, mapStr] = process.argv.slice(2);
const read = p => { const b = fs.readFileSync(p); const jl = b.readUInt32LE(12); return { buf: b, json: JSON.parse(b.slice(20, 20 + jl).toString('utf8')), rest: b.slice(20 + jl) }; };
const strip = n => (n || '').replace(/\.\d{3}$/, '');
const src = read(source), dst = read(target);
const map = Object.fromEntries((mapStr || '').split(',').filter(Boolean).map(p => p.split('=')));
const srcCol = {}; for (const m of src.json.materials || []) { const f = (m.pbrMetallicRoughness || {}).baseColorFactor; if (f) srcCol[strip(m.name)] = f; }
const done = [];
for (const m of dst.json.materials || []) {
  const from = Object.keys(map).find(k => map[k] === m.name);
  if (!from || !srcCol[from]) continue;
  m.pbrMetallicRoughness = m.pbrMetallicRoughness || {}; m.pbrMetallicRoughness.baseColorFactor = srcCol[from].slice();
  done.push(`${m.name}<-${from}(${srcCol[from].slice(0, 3).map(v => v.toFixed(2)).join(',')})`);
}
let js = Buffer.from(JSON.stringify(dst.json), 'utf8'); while (js.length % 4) js = Buffer.concat([js, Buffer.from(' ')]);
const head = Buffer.alloc(12); head.writeUInt32LE(0x46546C67, 0); head.writeUInt32LE(2, 4);
const jh = Buffer.alloc(8); jh.writeUInt32LE(js.length, 0); jh.writeUInt32LE(0x4E4F534A, 4);
const out = Buffer.concat([head, jh, js, dst.rest]); out.writeUInt32LE(out.length, 8); fs.writeFileSync(target, out);
console.log(JSON.stringify({ target, kb: +(out.length / 1024).toFixed(1), done }));
