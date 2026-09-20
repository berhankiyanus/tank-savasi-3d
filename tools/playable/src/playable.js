// TANK SAVAŞI 3D — Playable ad (tek dosya, MRAID/Meta/Google uyumlu). Oyunun çekirdek döngüsü: sür + ateş, 2 sekmeli mermi (MEGA SEKME), 2 dalga (3 düşman → BOSS).
// Ağ şartları: dış istek yok, ses yalnız etkileşimden sonra, MRAID viewableChange beklenir, CTA → mraid.open / ExitApi.exit / FbPlayableAd.onCTAClick / dapi.
import * as THREE from '../../../libs/three.module.js';

const PA = window.__PA || {}, STORE = PA.url || 'https://play.google.com/store/apps/details?id=com.berhankiyanus.tanksavasi';
const $ = id => document.getElementById(id);
const GRID = ['#############', '#...........#', '#.#.#...#.#.#', '#...........#', '#..#.....#..#', '#....###....#', '#...........#', '#....###....#', '#..#.....#..#', '#...........#', '#.#.#...#.#.#', '#...........#', '#############'];
const CELL = 4.2, N = 13, HALF = 6;
const cx = c => (c - HALF) * CELL, cz = r => (r - HALF) * CELL;
const cellAt = (x, z) => [Math.round(z / CELL) + HALF, Math.round(x / CELL) + HALF];
const isWall = (x, z) => { const [r, c] = cellAt(x, z); return r < 0 || c < 0 || r >= N || c >= N || GRID[r][c] === '#'; };
const blocked = (x, z, rad) => { for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; if (isWall(x + Math.cos(a) * rad, z + Math.sin(a) * rad)) return true; } return false; };
const los = (ax, az, bx, bz) => { const d = Math.hypot(bx - ax, bz - az), n = Math.ceil(d / 0.6); for (let i = 1; i < n; i++) { const t = i / n; if (isWall(ax + (bx - ax) * t, az + (bz - az) * t)) return false; } return true; };
const fwdX = a => -Math.sin(a), fwdZ = a => -Math.cos(a), ang = a => Math.atan2(Math.sin(a), Math.cos(a));
const headTo = (x, z, tx, tz) => Math.atan2(-(tx - x), -(tz - z));
const rnd = (a, b) => a + Math.random() * (b - a);

// ---------- mini GLB yükleyici (dokusuz, animasyonsuz; normal yoksa düz normal) ----------
function parseGLB(b64) {
  const bin = atob(b64), buf = new ArrayBuffer(bin.length), u8 = new Uint8Array(buf); for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
  const dv = new DataView(buf), jsonLen = dv.getUint32(12, true), json = JSON.parse(new TextDecoder().decode(new Uint8Array(buf, 20, jsonLen))), binOff = 20 + jsonLen + 8;
  const TYPES = { 5120: Int8Array, 5121: Uint8Array, 5122: Int16Array, 5123: Uint16Array, 5125: Uint32Array, 5126: Float32Array }, NS = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4 };
  const acc = i => { const a = json.accessors[i], bv = json.bufferViews[a.bufferView], T = TYPES[a.componentType], n = NS[a.type], off = binOff + (bv.byteOffset || 0) + (a.byteOffset || 0); return { arr: new T(buf.slice(off, off + a.count * n * T.BYTES_PER_ELEMENT)), n }; };
  const mats = (json.materials || []).map(m => { const p = m.pbrMetallicRoughness || {}, c = p.baseColorFactor || [0.8, 0.8, 0.8, 1]; const mat = new THREE.MeshStandardMaterial({ metalness: Math.min(0.25, p.metallicFactor != null ? p.metallicFactor : 0.2), roughness: Math.max(0.45, p.roughnessFactor != null ? p.roughnessFactor : 0.6), flatShading: true }); /* ortam haritası yok: metal siyaha dönmesin */ mat.color.setRGB(c[0], c[1], c[2], THREE.LinearSRGBColorSpace); if (m.emissiveFactor) mat.emissive.setRGB(m.emissiveFactor[0], m.emissiveFactor[1], m.emissiveFactor[2], THREE.LinearSRGBColorSpace); mat.name = m.name || ''; return mat; });
  const meshes = json.meshes.map(m => m.primitives.map(p => { let g = new THREE.BufferGeometry(); const pos = acc(p.attributes.POSITION); g.setAttribute('position', new THREE.BufferAttribute(pos.arr, 3)); if (p.attributes.NORMAL) g.setAttribute('normal', new THREE.BufferAttribute(acc(p.attributes.NORMAL).arr, 3)); if (p.indices != null) g.setIndex(new THREE.BufferAttribute(acc(p.indices).arr, 1)); if (!p.attributes.NORMAL) { if (g.index) g = g.toNonIndexed(); g.computeVertexNormals(); } return new THREE.Mesh(g, mats[p.material] || new THREE.MeshStandardMaterial({ color: 0x888888, flatShading: true })); }));
  const build = i => { const n = json.nodes[i], o = new THREE.Group(); o.name = n.name || ''; if (n.matrix) new THREE.Matrix4().fromArray(n.matrix).decompose(o.position, o.quaternion, o.scale); else { if (n.translation) o.position.fromArray(n.translation); if (n.rotation) o.quaternion.fromArray(n.rotation); if (n.scale) o.scale.fromArray(n.scale); } if (n.mesh != null) for (const mm of meshes[n.mesh]) o.add(mm.clone()); for (const c of n.children || []) o.add(build(c)); return o; };
  const root = new THREE.Group(); for (const i of json.scenes[json.scene || 0].nodes) root.add(build(i)); return root;
}
function tintClone(src, paint, scale = 1) { const o = src.clone(true); o.traverse(m => { if (m.isMesh && paint && m.material.name === 'TankPaint') { m.material = m.material.clone(); m.material.color.set(paint); } }); o.scale.setScalar(scale); return o; }
function findTurret(o) { let t = null; o.traverse(n => { if (!t && /^TankTurret/.test(n.name)) t = n; }); return t; }

// ---------- sahne ----------
const canvas = $('game'), renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2)); renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
const scene = new THREE.Scene(); scene.background = new THREE.Color(0x8fd0ff); scene.fog = new THREE.Fog(0x8fd0ff, 45, 95);
const camera = new THREE.PerspectiveCamera(55, 1, 0.5, 200);
scene.add(new THREE.HemisphereLight(0xe8f4ff, 0x3f6b2a, 0.95));
const sun = new THREE.DirectionalLight(0xfff1d0, 1.7); sun.position.set(14, 26, 10); scene.add(sun);
{ // çim zemini (prosedürel doku)
  const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d'); g.fillStyle = '#6a9a3e'; g.fillRect(0, 0, 128, 128);
  for (let i = 0; i < 2600; i++) { const v = Math.random(); g.fillStyle = v < 0.5 ? `rgba(40,80,25,${0.25 + Math.random() * 0.3})` : `rgba(150,200,90,${0.15 + Math.random() * 0.25})`; g.fillRect(Math.random() * 128, Math.random() * 128, 1 + Math.random() * 2, 1 + Math.random() * 2); }
  const tex = new THREE.CanvasTexture(c); tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.repeat.set(N, N); tex.colorSpace = THREE.SRGBColorSpace;
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(N * CELL, N * CELL), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.95 })); ground.rotation.x = -Math.PI / 2; scene.add(ground);
  const far = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), new THREE.MeshStandardMaterial({ color: 0x5f8f3a, roughness: 1 })); far.rotation.x = -Math.PI / 2; far.position.y = -0.05; scene.add(far);
}
{ // çit duvarları (tek instanced çizim) + açık taş üst şerit
  const cells = []; for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) if (GRID[r][c] === '#') cells.push([r, c]);
  const geo = new THREE.BoxGeometry(CELL, 3.0, CELL), mat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9, flatShading: true });
  const im = new THREE.InstancedMesh(geo, mat, cells.length); const m4 = new THREE.Matrix4(), col = new THREE.Color();
  cells.forEach(([r, c], i) => { m4.makeTranslation(cx(c), 1.5, cz(r)); im.setMatrixAt(i, m4); col.setHSL(0.30 + Math.random() * 0.03, 0.55, 0.36 + Math.random() * 0.09); im.setColorAt(i, col); });
  im.instanceMatrix.needsUpdate = true; scene.add(im);
}
const shadowGeo = new THREE.CircleGeometry(1.7, 20), shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.26, depthWrite: false });
const blob = () => { const m = new THREE.Mesh(shadowGeo, shadowMat); m.rotation.x = -Math.PI / 2; m.position.y = 0.03; scene.add(m); return m; };

// ---------- ses (yalnız etkileşimden sonra) ----------
let AC = null, bus = null, muted = false;
function audio() { if (!AC) { AC = new (window.AudioContext || window.webkitAudioContext)(); bus = AC.createGain(); bus.gain.value = 0.9; bus.connect(AC.destination); } if (AC.state === 'suspended') AC.resume(); return AC; }
function noise(ac, dur) { const b = ac.createBuffer(1, ac.sampleRate * dur, ac.sampleRate), d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; return b; }
function sfxFire() { if (!AC || muted) return; const ac = AC, t = ac.currentTime, o = ac.createOscillator(), g = ac.createGain(); o.type = 'square'; o.frequency.setValueAtTime(240, t); o.frequency.exponentialRampToValueAtTime(50, t + 0.16); g.gain.setValueAtTime(0.11, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.18); o.connect(g).connect(bus); o.start(t); o.stop(t + 0.2); const n = ac.createBufferSource(), ng = ac.createGain(), f = ac.createBiquadFilter(); n.buffer = noise(ac, 0.12); f.type = 'lowpass'; f.frequency.value = 2400; ng.gain.setValueAtTime(0.09, t); ng.gain.exponentialRampToValueAtTime(0.001, t + 0.12); n.connect(f).connect(ng).connect(bus); n.start(t); }
function sfxBounce() { if (!AC || muted) return; const ac = AC, t = ac.currentTime, o = ac.createOscillator(), g = ac.createGain(); o.type = 'triangle'; o.frequency.setValueAtTime(900, t); o.frequency.exponentialRampToValueAtTime(300, t + 0.08); g.gain.setValueAtTime(0.07, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.09); o.connect(g).connect(bus); o.start(t); o.stop(t + 0.1); }
let lastBoom = 0;
function sfxBoom(big) { if (!AC || muted) return; const now = performance.now(); if (!big && now - lastBoom < 55) return; lastBoom = now; const ac = AC, t = ac.currentTime, n = ac.createBufferSource(), g = ac.createGain(), f = ac.createBiquadFilter(); n.buffer = noise(ac, big ? 0.9 : 0.5); f.type = 'lowpass'; f.frequency.setValueAtTime(big ? 900 : 700, t); f.frequency.exponentialRampToValueAtTime(60, t + (big ? 0.8 : 0.45)); g.gain.setValueAtTime(big ? 0.5 : 0.3, t); g.gain.exponentialRampToValueAtTime(0.001, t + (big ? 0.9 : 0.5)); n.connect(f).connect(g).connect(bus); n.start(t); }
function sting(notes, dur = 0.14, type = 'square', vol = 0.12) { if (!AC || muted) return; const ac = AC; let t = ac.currentTime; for (const f of notes) { const o = ac.createOscillator(), g = ac.createGain(); o.type = type; o.frequency.value = f; g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + dur); o.connect(g).connect(bus); o.start(t); o.stop(t + dur + 0.03); t += dur; } }

// ---------- varlıklar ----------
const models = { player: parseGLB(PA.player), enemy: parseGLB(PA.enemy), boss: parseGLB(PA.boss) };
const P = { x: 0, z: 0, a: 0, hp: 5, maxHp: 5, speed: 7.5, turn: 2.6, cool: 0, inv: 0, alive: true, mesh: null, turret: null, shadow: null, recoil: 0 };
P.mesh = tintClone(models.player, 0xffc832); /* Altın Kral boyası (oyunda TankPaint tank rengiyle boyanır) */ P.turret = findTurret(P.mesh); P.shadow = blob(); scene.add(P.mesh);
const enemies = [], bullets = [], parts = [];
const bulletGeo = new THREE.SphereGeometry(0.34, 10, 8), tailGeo = new THREE.ConeGeometry(0.22, 1.4, 6);
const pMat = new THREE.MeshBasicMaterial({ color: 0xffb020 }), pTail = new THREE.MeshBasicMaterial({ color: 0xff6a1e, transparent: true, opacity: 0.85 });
const eMat = new THREE.MeshBasicMaterial({ color: 0xff3a3a }), eTail = new THREE.MeshBasicMaterial({ color: 0xff8080, transparent: true, opacity: 0.7 });
const partGeo = new THREE.BoxGeometry(0.34, 0.34, 0.34), partMats = [0xff8a1e, 0xffd23c, 0xff3b1e, 0x2a2a2a, 0xffffff].map(c => new THREE.MeshBasicMaterial({ color: c }));
for (let i = 0; i < 70; i++) { const m = new THREE.Mesh(partGeo, partMats[i % partMats.length]); m.visible = false; scene.add(m); parts.push({ m, life: 0, vx: 0, vy: 0, vz: 0 }); }
function explode(x, z, big) { let n = big ? 34 : 18; for (const p of parts) { if (n <= 0) break; if (p.life > 0) continue; n--; p.life = 0.6 + Math.random() * 0.5; p.m.visible = true; p.m.position.set(x, 1 + Math.random(), z); const a = Math.random() * Math.PI * 2, s = (big ? 9 : 6) * (0.4 + Math.random()); p.vx = Math.cos(a) * s; p.vz = Math.sin(a) * s; p.vy = 5 + Math.random() * (big ? 9 : 6); p.m.scale.setScalar(big ? 1.6 : 1); } shake = Math.max(shake, big ? 1.6 : 0.7); sfxBoom(big); }

function fire(owner, isPlayer, angOff = 0) {
  const a = owner.a + angOff, m = new THREE.Mesh(bulletGeo, isPlayer ? pMat : eMat), tail = new THREE.Mesh(tailGeo, isPlayer ? pTail : eTail);
  tail.rotation.x = Math.PI / 2; tail.position.z = 0.9; m.add(tail); m.rotation.y = a; m.position.set(owner.x + fwdX(a) * 2.6, 1.13, owner.z + fwdZ(a) * 2.6); scene.add(m);
  const sp = isPlayer ? 26 : 17, nB = isPlayer ? 2 : 1; bullets.push({ m, isPlayer, vx: fwdX(a) * sp, vz: fwdZ(a) * sp, life: 2.6, bounces: nB, b0: nB });
  if (isPlayer) { P.recoil = 0.3; } sfxFire();
}
function spawnEnemy(type, r, c) {
  const boss = type === 'boss', mesh = tintClone(boss ? models.boss : models.enemy, boss ? 0x2b2b2b : (type === 'scout' ? 0xd94a1e : 0xc62828), boss ? 1.45 : 1);
  const e = { type, boss, x: cx(c), z: cz(r), a: 0, hp: boss ? 6 : 1, maxHp: boss ? 6 : 1, speed: boss ? 2.4 : (type === 'scout' ? 4.2 : 3.0), turn: boss ? 1.2 : 1.8, keep: boss ? 11 : 9, cool: 1.2 + Math.random(), think: 0, bias: 0, alive: true, mesh, shadow: blob() };
  e.a = headTo(e.x, e.z, P.x, P.z); mesh.position.set(e.x, 0, e.z); mesh.rotation.y = e.a; scene.add(mesh); enemies.push(e); return e;
}
function killEnemy(e, byBounce) {
  e.alive = false; scene.remove(e.mesh); scene.remove(e.shadow); explode(e.x, e.z, e.boss);
  score += e.boss ? 1000 : 100; coins += e.boss ? 80 : 7; floater(e.x, 2.2, e.z, `+${e.boss ? 80 : 7} 🪙  +${e.boss ? 1000 : 100}`);
  if (byBounce >= 2) { slowmo = 0.55; score += 250; floater(e.x, 3.4, e.z, 'MEGA SEKME! 🤯', '#ffd23c', 1.8); banner('MEGA SEKME! 🤯', 1.4); sting([523, 659, 784, 1047], 0.09); }
  if (e.boss) { $('bossbar').style.display = 'none'; }
  updateHUD();
}
function hitPlayer() {
  if (P.inv > 0 || !P.alive || state !== 'play') return; P.hp--; P.inv = 1.4; shake = Math.max(shake, 1.2); flash('#ff2a1a', 0.35); updateHUD();
  if (P.hp <= 0) { P.alive = false; explode(P.x, P.z, true); P.mesh.visible = false; P.shadow.visible = false; sting([392, 330, 262, 196], 0.2, 'triangle', 0.12); finish('lose'); }
}

// ---------- HUD ----------
let score = 0, coins = 0, wave = 1, state = 'load', shake = 0, slowmo = 0, tPlay = 0, bannerT = null;
function updateHUD() { $('hearts').textContent = '❤'.repeat(Math.max(0, P.hp)) + '🖤'.repeat(Math.max(0, P.maxHp - P.hp)); $('wave').textContent = `DALGA ${wave}/2`; $('score').textContent = `SKOR ${score}`; const b = enemies.find(e => e.boss && e.alive); if (b) $('bosshp').style.width = Math.max(0, b.hp / b.maxHp * 100) + '%'; }
function banner(t, secs = 1.6) { const b = $('banner'); b.textContent = t; b.style.opacity = 1; clearTimeout(bannerT); bannerT = setTimeout(() => { b.style.opacity = 0; }, secs * 1000); }
function hint(t) { const h = $('hint'); h.textContent = t || ''; h.style.opacity = t ? 1 : 0; }
const v3 = new THREE.Vector3();
function floater(x, y, z, text, col, sz) { v3.set(x, y, z).project(camera); const d = document.createElement('div'); d.className = 'fl'; d.textContent = text; if (col) d.style.color = col; if (sz) d.style.fontSize = `clamp(${15 * sz}px, ${4.4 * sz}vmin, ${26 * sz}px)`; d.style.left = ((v3.x + 1) / 2 * innerWidth) + 'px'; d.style.top = ((1 - v3.y) / 2 * innerHeight) + 'px'; document.body.appendChild(d); setTimeout(() => d.remove(), 1000); }
function flash(col, a) { const f = $('flash'); f.style.background = col; f.style.transition = 'none'; f.style.opacity = a; requestAnimationFrame(() => { f.style.transition = 'opacity .35s'; f.style.opacity = 0; }); }

// ---------- girdi ----------
const ctl = { turn: 0, move: 0, fire: false, moved: false, fired: false };
{ const stick = $('stick'), knob = $('knob'); let pid = null;
  const apply = ev => { const r = stick.getBoundingClientRect(); let dx = ev.clientX - (r.left + r.width / 2), dy = ev.clientY - (r.top + r.height / 2); const max = r.width / 2 - r.width * 0.21, d = Math.hypot(dx, dy); if (d > max) { dx *= max / d; dy *= max / d; } knob.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`; const nx = dx / max, ny = dy / max; ctl.turn = Math.abs(nx) > 0.12 ? -nx : 0; ctl.move = Math.abs(ny) > 0.12 ? -ny : 0; if (Math.hypot(nx, ny) > 0.3) ctl.moved = true; };
  stick.addEventListener('pointerdown', ev => { ev.preventDefault(); pid = ev.pointerId; stick.setPointerCapture(pid); audio(); apply(ev); });
  stick.addEventListener('pointermove', ev => { if (ev.pointerId === pid) { ev.preventDefault(); apply(ev); } });
  const end = ev => { if (ev.pointerId === pid) { pid = null; knob.style.transform = 'translate(-50%, -50%)'; ctl.turn = ctl.move = 0; } };
  stick.addEventListener('pointerup', end); stick.addEventListener('pointercancel', end);
  const fb = $('fire'); fb.addEventListener('pointerdown', ev => { ev.preventDefault(); audio(); ctl.fire = true; ctl.fired = true; fb.classList.add('on'); }); const fend = () => { ctl.fire = false; fb.classList.remove('on'); }; fb.addEventListener('pointerup', fend); fb.addEventListener('pointercancel', fend); fb.addEventListener('pointerleave', fend);
  const keys = {}; addEventListener('keydown', e => { keys[e.code] = true; audio(); if (e.code === 'Space') { ctl.fire = true; ctl.fired = true; } }); addEventListener('keyup', e => { keys[e.code] = false; if (e.code === 'Space') ctl.fire = false; });
  setInterval(() => { if (pid != null) return; const t = (keys.ArrowLeft || keys.KeyA ? 1 : 0) - (keys.ArrowRight || keys.KeyD ? 1 : 0), m = (keys.ArrowUp || keys.KeyW ? 1 : 0) - (keys.ArrowDown || keys.KeyS ? 1 : 0); if (t || m) { ctl.turn = t; ctl.move = m; ctl.moved = true; } else if (!pid) { ctl.turn = ctl.move = 0; } }, 30);
  document.addEventListener('pointerdown', () => audio(), { once: true });
  /* iOS Safari: viewport 'user-scalable=no' yok sayılır; hızlı ATEŞ dokunuşları çift dokunuş sayılıp sayfayı büyütür.
     Dokunma varsayılanlarını sayfa düzeyinde engelle (pointer olayları yine çalışır), pinch (gesturestart) ve dblclick kapat. */
  for (const t of ['touchstart', 'touchmove', 'touchend']) document.addEventListener(t, e => { e.preventDefault(); }, { passive: false });
  document.addEventListener('gesturestart', e => e.preventDefault()); document.addEventListener('dblclick', e => e.preventDefault());
}
// CTA: her ağın çıkış kancası (biri çalışır)
function cta() {
  try { if (window.ExitApi && ExitApi.exit) return ExitApi.exit(); } catch (e) {}
  try { if (window.mraid && mraid.open) return mraid.open(STORE); } catch (e) {}
  try { if (window.FbPlayableAd && FbPlayableAd.onCTAClick) return FbPlayableAd.onCTAClick(); } catch (e) {}
  try { if (window.dapi && dapi.openStoreUrl) return dapi.openStoreUrl(); } catch (e) {}
  try { if (typeof window.install === 'function') return window.install(); } catch (e) {}
  try { if (window.parent !== window) window.parent.postMessage('download', '*'); } catch (e) {}
  try { window.open(STORE, '_blank'); } catch (e) { location.href = STORE; }
}
$('cta').addEventListener('pointerup', cta); $('end').addEventListener('pointerup', cta);

// ---------- akış ----------
let tut = 0; // 0 sür, 1 ateş, 2 bitti
function placeHand(el) { const r = el.getBoundingClientRect(); $('hand').style.left = (r.left + r.width * (0.35 + Math.sin(performance.now() / 300) * 0.22)) + 'px'; $('hand').style.top = (r.top + r.height * (0.35 + Math.cos(performance.now() / 300) * 0.22)) + 'px'; }
function tutorial() { if (tut === 0 && (ctl.moved || tPlay > 7)) { tut = 1; hint('ATEŞ ET! 🔥'); } if (tut === 1 && (ctl.fired || tPlay > 11)) { tut = 2; hint(''); $('hand').style.display = 'none'; } if (tut < 2) { $('hand').style.display = 'block'; placeHand(tut === 0 ? $('stick') : $('fire')); } }
function startWave(w) {
  wave = w; updateHUD();
  if (w === 1) { spawnEnemy('normal', 8, 6); spawnEnemy('scout', 9, 2); spawnEnemy('normal', 9, 10); banner('DALGA 1', 1.4); sting([523, 659, 784], 0.12); }
  else { const b = spawnEnemy('boss', 8, 6); b.a = headTo(b.x, b.z, P.x, P.z); spawnEnemy('scout', 9, 2); spawnEnemy('normal', 9, 10); $('bossbar').style.display = 'block'; banner('BOSS DALGASI! ☠️', 1.8); sting([146, 123, 98, 82], 0.26, 'sawtooth', 0.14); updateHUD(); }
}
function start() { if (state !== 'load') return; state = 'play'; $('load').style.display = 'none'; P.x = cx(6); P.z = cz(11); P.a = 0; hint('Sür ve dön 🕹️'); startWave(1); }
function finish(how) {
  if (state === 'end') return; state = 'end'; ctl.fire = false; $('hand').style.display = 'none'; hint('');
  const r = $('endr'); r.textContent = how === 'win' ? `ZAFER! 🏆   Skor ${score}` : how === 'lose' ? `NEREDEYSE! 💥   Skor ${score}` : `Skor ${score} · Devamı oyunda!`;
  if (how === 'win') { banner('ZAFER! 🏆', 1.2); sting([523, 659, 784, 1047], 0.13); }
  setTimeout(() => { $('end').style.display = 'block'; }, how === 'timeout' ? 200 : 1100);
}
// MRAID: hazır + görünür olunca başla (Unity/AppLovin/ironSource); yoksa hemen
function whenViewable(cb) { const m = window.mraid; if (!m) return cb(); const go = () => { try { if (m.isViewable()) cb(); else m.addEventListener('viewableChange', v => { if (v) cb(); }); } catch (e) { cb(); } }; try { if (m.getState() === 'loading') m.addEventListener('ready', go); else go(); } catch (e) { cb(); } }
whenViewable(() => setTimeout(start, 250));
setTimeout(() => { if (state === 'load') start(); }, 6000); // MRAID olayı gelmezse güvenlik

// ---------- döngü ----------
function resize() { const w = innerWidth, h = innerHeight; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); }
addEventListener('resize', resize); resize();
const camT = new THREE.Vector3(); let last = performance.now(), hidden = false;
document.addEventListener('visibilitychange', () => { hidden = document.hidden; last = performance.now(); });
function tick(now) {
  requestAnimationFrame(tick);
  let dt = Math.min(0.05, (now - last) / 1000); last = now; if (hidden) return;
  if (slowmo > 0) { slowmo -= dt; dt *= 0.35; }
  if (state === 'play') {
    tPlay += dt; tutorial(); if (tPlay > 45) finish('timeout');
    // oyuncu
    if (P.alive) {
      P.a += ctl.turn * P.turn * dt; const sp = ctl.move * P.speed * dt; let nx = P.x + fwdX(P.a) * sp, nz = P.z + fwdZ(P.a) * sp;
      if (!blocked(nx, nz, 1.3)) { P.x = nx; P.z = nz; } else if (!blocked(nx, P.z, 1.3)) P.x = nx; else if (!blocked(P.x, nz, 1.3)) P.z = nz;
      P.cool -= dt; P.inv -= dt; if (ctl.fire && P.cool <= 0) { P.cool = 0.42; fire(P, true); }
      P.mesh.position.set(P.x, 0, P.z); P.mesh.rotation.y = P.a; P.shadow.position.set(P.x, 0.03, P.z);
      if (P.turret) { P.recoil = Math.max(0, P.recoil - dt * 2); P.turret.position.z = P.recoil * 0.6; }
      P.mesh.visible = !(P.inv > 0 && Math.floor(P.inv * 14) % 2);
    }
    // düşmanlar
    for (const e of enemies) {
      if (!e.alive) continue; const d = Math.hypot(P.x - e.x, P.z - e.z), see = los(e.x, e.z, P.x, P.z);
      e.think -= dt; if (e.think <= 0) { e.think = 1.2 + Math.random(); e.bias = (Math.random() - 0.5) * 1.2; }
      const want = headTo(e.x, e.z, P.x, P.z) + (see ? 0 : e.bias), diff = ang(want - e.a); e.a += Math.max(-e.turn * dt, Math.min(e.turn * dt, diff));
      let mv = 0; if (d > e.keep + 1) mv = 1; else if (d < e.keep - 3) mv = -0.6; else mv = 0.25 * Math.sign(e.bias);
      const sp = mv * e.speed * dt; let nx = e.x + fwdX(e.a) * sp, nz = e.z + fwdZ(e.a) * sp;
      if (!blocked(nx, nz, 1.4)) { e.x = nx; e.z = nz; } else { e.a += e.turn * dt * (e.bias >= 0 ? 1 : -1); e.think = 0.4; }
      e.cool -= dt; if (e.cool <= 0 && see && Math.abs(diff) < 0.25 && P.alive && tPlay > 4.0) { e.cool = e.boss ? 2.4 : 2.3 + Math.random() * 1.2; if (e.boss) { fire(e, false, -0.16); fire(e, false, 0); fire(e, false, 0.16); } else fire(e, false, (Math.random() - 0.5) * 0.34); }
      e.mesh.position.set(e.x, 0, e.z); e.mesh.rotation.y = e.a; e.shadow.position.set(e.x, 0.03, e.z);
    }
    // mermiler
    for (let i = bullets.length - 1; i >= 0; i--) {
      const b = bullets[i]; b.life -= dt; const ox = b.m.position.x, oz = b.m.position.z; let nx = ox + b.vx * dt, nz = oz + b.vz * dt, dead = b.life <= 0;
      if (isWall(nx, nz)) { if (b.bounces <= 0) dead = true; else { b.bounces--; const wx = isWall(nx, oz), wz = isWall(ox, nz); if (wx || (!wx && !wz)) b.vx = -b.vx; if (wz || (!wx && !wz)) b.vz = -b.vz; nx = ox + b.vx * dt; nz = oz + b.vz * dt; b.m.rotation.y = Math.atan2(-b.vx, -b.vz); sfxBounce(); if (b.isPlayer && b.b0 - b.bounces === 2) floater(nx, 2, nz, 'SEKME!', '#ffe86a'); } }
      b.m.position.set(nx, 1.13, nz);
      if (!dead) {
        if (b.isPlayer) { for (const e of enemies) { if (!e.alive) continue; const rr = e.boss ? 2.6 : 1.7; if (Math.hypot(e.x - nx, e.z - nz) < rr) { e.hp--; dead = true; if (e.hp <= 0) killEnemy(e, b.b0 - b.bounces); else { explode(nx, nz, false); updateHUD(); } break; } } }
        else if (P.alive && Math.hypot(P.x - nx, P.z - nz) < 1.6) { dead = true; hitPlayer(); explode(nx, nz, false); }
      }
      if (dead) { scene.remove(b.m); bullets.splice(i, 1); }
    }
    if (P.alive && !enemies.some(e => e.alive)) { if (wave === 1) { startWave(2); } else finish('win'); }
  }
  for (const p of parts) { if (p.life <= 0) continue; p.life -= dt; p.vy -= 22 * dt; p.m.position.x += p.vx * dt; p.m.position.y += p.vy * dt; p.m.position.z += p.vz * dt; if (p.m.position.y < 0.15) { p.m.position.y = 0.15; p.vy *= -0.4; p.vx *= 0.7; p.vz *= 0.7; } p.m.rotation.x += dt * 9; p.m.rotation.z += dt * 7; if (p.life <= 0) p.m.visible = false; }
  const portrait = camera.aspect < 1, back = portrait ? 10 : 10.5, ahead = portrait ? 7 : 5;
  camT.set(P.x - fwdX(P.a) * back, portrait ? 15 : 11, P.z - fwdZ(P.a) * back); /* yatayda tank tam görünsün */ camera.position.lerp(camT, 1 - Math.exp(-4 * dt));
  shake = Math.max(0, shake - dt * 1.2); if (shake > 0) { camera.position.x += (Math.random() - 0.5) * shake; camera.position.y += (Math.random() - 0.5) * shake * 0.6; camera.position.z += (Math.random() - 0.5) * shake; }
  camera.lookAt(P.x + fwdX(P.a) * ahead, 1.0, P.z + fwdZ(P.a) * ahead);
  renderer.render(scene, camera);
}
camera.position.set(P.x, 15, P.z + 10); updateHUD(); requestAnimationFrame(tick);
if (/debug/.test(location.hash)) window.__pa = { P, enemies, bullets, get state() { return state; }, get score() { return score; }, get wave() { return wave; }, finish, killAll: () => { for (const e of enemies) if (e.alive) killEnemy(e, 0); }, hit: hitPlayer, cta }; // yalnız test
