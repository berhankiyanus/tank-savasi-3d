// Reklam kompozitörü + kayıt kütüphanesi (sayfaya javascript_tool ile enjekte edilir). window.__S
(() => {
  const R = window.__R;
  const W = 1080, H = 1920;
  const comp = document.createElement('canvas'); comp.width = W; comp.height = H;
  const cx = comp.getContext('2d');
  const gameCanvas = R.renderer.domElement;
  const S = window.__S = { W, H, cx, comp, overlays: [], pre: null, t0: 0, shotT: 0, timer: null, fade: null, log: [] };
  const FONT = '"Russo One", "Courier New", monospace';

  // ---- render sarmalayıcı: her karede pre() → oyun render → kompozit ----
  if (!R.renderer.__wrapped) {
    const orig = R.renderer.render.bind(R.renderer);
    R.renderer.render = (s, c) => { try { if (S.pre) S.pre(s, c); } catch (e) { S.log.push('pre:' + e.message); } orig(s, c); try { if (S.post) { S.post(); S.post = null; } S.composite(); } catch (e) { S.log.push('comp:' + e.message); } };
    R.renderer.__wrapped = true;
  }
  S.composite = () => {
    if (S.capFps) { const now = performance.now(); if (now - (S.lastDraw || 0) < 1000 / S.capFps - 1.5) return; S.lastDraw = now; }
    const gw = gameCanvas.width, gh = gameCanvas.height;
    const sc = Math.max(W / gw, H / gh), dw = gw * sc, dh = gh * sc;
    cx.drawImage(gameCanvas, (W - dw) / 2, (H - dh) / 2, dw, dh);
    S.shotT = performance.now() / 1000 - S.t0;
    const t = S.shotT;
    for (const o of S.overlays) o(cx, t);
    if (S.fade) { const a = S.fade(t); if (a > 0) { cx.fillStyle = `rgba(255,255,255,${a})`; cx.fillRect(0, 0, W, H); } }
  };

  // ---- yardımcılar ----
  S.wait = ms => new Promise(r => setTimeout(r, ms));
  S.until = (fn, max = 8000) => new Promise(r => { const t0 = Date.now(); const iv = setInterval(() => { if (fn() || Date.now() - t0 > max) { clearInterval(iv); r(); } }, 30); });
  S.ease = x => x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  S.clamp01 = x => Math.max(0, Math.min(1, x));
  S.fmt = s => Math.floor(s / 60) + ':' + String(Math.floor(s) % 60).padStart(2, '0');

  // metin: dış çizgi + gölge
  S.text = (str, x, y, size, opt = {}) => {
    cx.save();
    cx.font = `${opt.weight || 400} ${size}px ${FONT}`;
    cx.textAlign = opt.align || 'center'; cx.textBaseline = opt.base || 'middle';
    if (opt.alpha != null) cx.globalAlpha = opt.alpha;
    if (opt.rot) { cx.translate(x, y); cx.rotate(opt.rot); x = 0; y = 0; }
    cx.shadowColor = 'rgba(0,0,0,0.65)'; cx.shadowBlur = size * 0.18; cx.shadowOffsetY = size * 0.06;
    cx.lineJoin = 'round'; cx.lineWidth = opt.stroke != null ? opt.stroke : size * 0.16; cx.strokeStyle = opt.strokeCol || '#0b0f08';
    cx.strokeText(str, x, y);
    cx.shadowColor = 'transparent';
    if (opt.grad) { const g = cx.createLinearGradient(0, y - size / 2, 0, y + size / 2); g.addColorStop(0, opt.grad[0]); g.addColorStop(1, opt.grad[1]); cx.fillStyle = g; }
    else cx.fillStyle = opt.col || '#fff';
    cx.fillText(str, x, y);
    cx.restore();
  };
  S.GOLD = ['#fff3b0', '#ffb62a'];
  // pill (rozet)
  S.pill = (str, x, y, size, opt = {}) => {
    cx.save();
    cx.font = `${size}px ${FONT}`;
    const w = cx.measureText(str).width + size * 1.4, h = size * 1.7;
    if (opt.alpha != null) cx.globalAlpha = opt.alpha;
    cx.shadowColor = 'rgba(0,0,0,0.5)'; cx.shadowBlur = 24; cx.shadowOffsetY = 8;
    cx.fillStyle = opt.bg || 'rgba(12,18,10,0.82)';
    S.rr(x - w / 2, y - h / 2, w, h, h / 2); cx.fill();
    cx.shadowColor = 'transparent';
    if (opt.border) { cx.lineWidth = 4; cx.strokeStyle = opt.border; S.rr(x - w / 2, y - h / 2, w, h, h / 2); cx.stroke(); }
    cx.fillStyle = opt.col || '#fff'; cx.textAlign = 'center'; cx.textBaseline = 'middle';
    cx.fillText(str, x, y + size * 0.04);
    cx.restore();
  };
  S.rr = (x, y, w, h, r) => { cx.beginPath(); cx.moveTo(x + r, y); cx.arcTo(x + w, y, x + w, y + h, r); cx.arcTo(x + w, y + h, x, y + h, r); cx.arcTo(x, y + h, x, y, r); cx.arcTo(x, y, x + w, y, r); cx.closePath(); };
  // vinyet + alt karartma (metin okunurluğu)
  S.vignette = (a = 0.55) => { const g = cx.createRadialGradient(W / 2, H / 2, H * 0.25, W / 2, H / 2, H * 0.75); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(0,0,0,${a})`); cx.fillStyle = g; cx.fillRect(0, 0, W, H); };
  S.bottomShade = (h = 520, a = 0.75) => { const g = cx.createLinearGradient(0, H - h, 0, H); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(0,0,0,${a})`); cx.fillStyle = g; cx.fillRect(0, H - h, W, h); };
  S.topShade = (h = 420, a = 0.7) => { const g = cx.createLinearGradient(0, 0, 0, h); g.addColorStop(0, `rgba(0,0,0,${a})`); g.addColorStop(1, 'rgba(0,0,0,0)'); cx.fillStyle = g; cx.fillRect(0, 0, W, h); };
  // "pop" ölçeği (giriş animasyonu): t0'dan itibaren 0.35sn
  S.pop = (t, t0, dur = 0.35) => { const p = S.clamp01((t - t0) / dur); return p <= 0 ? 0 : 1 + Math.sin(p * Math.PI) * 0.18 * (1 - p) + (p < 1 ? 0 : 0); };
  S.popScale = (t, t0, dur = 0.32) => { const p = S.clamp01((t - t0) / dur); if (p <= 0) return 0; const b = 1.7; const o = p - 1; return 1 + (o * o * ((b + 1) * o + b)) * 0.0 + (p < 1 ? Math.sin(p * Math.PI) * 0.22 : 0); };
  // ölçekli çizim sarmalayıcı
  S.scaled = (x, y, s, fn) => { if (s <= 0) return; cx.save(); cx.translate(x, y); cx.scale(s, s); fn(); cx.restore(); };
  // marka CTA (alt): logo satırı + rozet
  S.brand = (t, t0 = 0, sub = 'ÜCRETSİZ OYNA') => {
    const p = S.clamp01((t - t0) / 0.4); if (p <= 0) return;
    S.bottomShade(600, 0.8);
    cx.save(); cx.globalAlpha = p;
    S.text('TANK SAVAŞI 3D', W / 2, H - 300, 78, { grad: S.GOLD, stroke: 12 });
    S.pill(sub, W / 2, H - 190, 46, { bg: '#ff9a1e', col: '#1a1000', border: '#ffd88a' });
    cx.restore();
  };
  // sayaç (speedrun) — üst orta
  S.drawTimer = (secs, t, opt = {}) => {
    const x = W / 2, y = opt.y || 210;
    cx.save();
    if (opt.pulse) { const s = 1 + Math.sin(t * 22) * 0.03; cx.translate(x, y); cx.scale(s, s); cx.translate(-x, -y); }
    S.pill('⏱ ' + S.fmt(secs), x, y, 84, { bg: 'rgba(8,12,8,0.78)', col: opt.col || '#fff', border: opt.border || 'rgba(255,214,74,0.9)' });
    cx.restore();
  };
  // dalga şeridi (sol üst) + coin (sağ üst)
  S.hud = (wave, coins, t) => {
    S.topShade(300, 0.55);
    S.pill('DALGA ' + wave + '/10', 250, 90, 44, { bg: 'rgba(8,12,8,0.75)', col: '#dfffc8' });
    S.pill('🪙 ' + coins, W - 250, 90, 44, { bg: 'rgba(8,12,8,0.75)', col: '#ffd76a' });
  };
  // boss barı
  S.bossBar = (name, frac, t, y = 330) => {
    const w = 820, h = 40, x = (W - w) / 2;
    S.text('💀 ' + name, W / 2, y - 48, 44, { col: '#ffb3a0', stroke: 8 });
    cx.save(); cx.shadowColor = 'rgba(0,0,0,0.6)'; cx.shadowBlur = 16;
    cx.fillStyle = 'rgba(10,8,8,0.85)'; S.rr(x, y, w, h, 20); cx.fill();
    cx.shadowColor = 'transparent';
    const g = cx.createLinearGradient(x, 0, x + w, 0); g.addColorStop(0, '#ff3c2a'); g.addColorStop(1, '#ff8a3c');
    cx.fillStyle = g; S.rr(x + 5, y + 5, Math.max(20, (w - 10) * S.clamp01(frac)), h - 10, 15); cx.fill();
    cx.lineWidth = 3; cx.strokeStyle = 'rgba(255,255,255,0.35)'; S.rr(x, y, w, h, 20); cx.stroke();
    cx.restore();
  };
  // konfeti
  S.confetti = (t, t0, n = 90) => {
    const p = t - t0; if (p < 0) return;
    cx.save();
    for (let i = 0; i < n; i++) {
      const sx = ((i * 7919) % 1000) / 1000, sp = 0.5 + ((i * 104729) % 1000) / 1000;
      const x = sx * W + Math.sin(p * 3 + i) * 40, y = -60 + (p * 700 * sp) % (H + 120);
      cx.fillStyle = ['#ffd24a', '#ff6a3c', '#54ff7a', '#5ad0ff', '#ff3aa0', '#fff'][i % 6];
      cx.save(); cx.translate(x, y); cx.rotate(p * 6 + i); cx.fillRect(-14, -8, 28, 16); cx.restore();
    }
    cx.restore();
  };

  // ---- ses tap ----
  S.audioInit = async () => {
    R.audio(); const AC = R.AC; try { await AC.resume(); } catch (e) {}
    if (!S.adest) { S.adest = AC.createMediaStreamDestination(); R.sfxBus.connect(S.adest); }
    return AC.state;
  };

  // ---- kayıt ----
  S.record = async (name, fn, opt = {}) => {
    S.overlays = []; S.fade = null; S.pre = null;
    S.capFps = opt.fps || S.defFps || 0; const stream = comp.captureStream(S.capFps || 60);
    if (S.adest) for (const tr of S.adest.stream.getAudioTracks()) stream.addTrack(tr);
    const mt = opt.mime || ['video/webm;codecs=h264,opus', 'video/webm;codecs=avc1,opus', 'video/webm;codecs=vp8,opus', 'video/webm;codecs=vp9,opus'].find(m => MediaRecorder.isTypeSupported(m));
    S.mime = mt;
    const rec = new MediaRecorder(stream, { mimeType: mt, videoBitsPerSecond: opt.bps || 16e6 });
    const chunks = []; rec.ondataavailable = e => { if (e.data.size) chunks.push(e.data); };
    const done = new Promise(res => { rec.onstop = res; });
    S.unpause(); const guard = setInterval(S.unpause, 60); // odak kaybı → otomatik DURAKLADI; kayıtta engelle
    S.t0 = performance.now() / 1000; S.shotT = 0;
    rec.start(100);
    try { await fn(); } catch (e) { S.log.push('shot:' + e.message + ' ' + (e.stack || '').slice(0, 200)); }
    clearInterval(guard); rec.stop(); await done;
    S.overlays = []; S.fade = null; S.pre = null; S.capFps = 0;
    const blob = new Blob(chunks, { type: 'video/webm' });
    const r = await fetch('http://localhost:9799/' + name, { method: 'POST', body: blob });
    return name + ' ' + blob.size + 'B http' + r.status + ' t=' + S.shotT.toFixed(2);
  };

  // ---- oyun kontrol yardımcıları ----
  S.unpause = () => { if (R.paused) { try { R.closeSettings(); } catch (e) {} R.paused = false; } };
  S.prepProfile = () => {
    const p = R.profile;
    p.tutorialDone = true; p.games = Math.max(p.games || 0, 20);
    p.coins = 12480; p.gems = 215; p.tokens = 7;
    p.owned = ['recruit', 'scout', 'guardian', 'sniper', 'phantom', 'goldking', 'heavy', 'twin', 'arty', 'mamut', 'hover', 'titan'];
    p.accessories = ['surf', 'flag', 'cone', 'tophat', 'spoiler', 'duck', 'disco', 'crown', 'wings', 'jetpack'];
    p.skins = p.skins || []; p.name = 'BERHAN';
    R.settings.autoFire = true; R.settings.muted = false; R.settings.music = false; R.settings.quality = 'high'; R.settings.volSfx = 1;
    if (R.musicGain) R.musicGain.gain.value = 0;
  };
  S.playerCenter = () => {
    // en açık hücre: merkeze en yakın açık hücre
    const cells = R.openCells; let best = null, bd = 1e9;
    for (const c of cells) { const d = c.x * c.x + c.z * c.z; if (d < bd) { bd = d; best = c; } }
    const P = R.player; P.x = best.x; P.z = best.z; P.vx = P.vz = 0; P.mesh.position.set(P.x, 0, P.z);
  };
  S.godMode = () => { const P = R.player; P.inv = 9999; P.health = P.maxHealth; };
  // hedef yönü: LOS'u en uzun açık olan yön (namlu önü boş kalsın)
  S.bestHeading = (dist = 20) => {
    const P = R.player; let best = 0, bl = -1;
    for (let i = 0; i < 48; i++) { const a = (i / 48) * Math.PI * 2; let l = 0; for (let d = 2; d <= dist; d += 1) { if (!R.losClear(P.x, P.z, P.x + R.fwdX(a) * d, P.z + R.fwdZ(a) * d)) break; l = d; } if (l > bl) { bl = l; best = a; } }
    return { a: best, len: bl };
  };
  // nöbetçi: görünmez, uzak, ateş etmeyen düşman → dalga hiç bitmez (sim akışı bizim kontrolümüzde)
  S.sentinel = () => {
    R.spawnEnemies(['normal']); const e = R.enemies[R.enemies.length - 1];
    e.x = 9999; e.z = 9999; e.mesh.position.set(e.x, -50, e.z); e.mesh.visible = false; e.speed = 0; e.sight = 0; e.hp = 99999; e.maxHp = 99999; e.cool = 1e9; e.sentinel = true;
    return e;
  };
  // namlu önüne düşman koy (gerçek isabetle ölür — oto-ateş)
  S.putEnemy = (type, dist, lateral = 0, opt = {}) => {
    const P = R.player, a = P.a;
    R.spawnEnemies([type]); const e = R.enemies[R.enemies.length - 1];
    const rx = R.fwdZ(a), rz = -R.fwdX(a); // sağ vektör
    e.x = P.x + R.fwdX(a) * dist + rx * lateral; e.z = P.z + R.fwdZ(a) * dist + rz * lateral;
    e.a = a + Math.PI; e.mesh.position.set(e.x, 0, e.z); e.mesh.rotation.y = e.a;
    e.cool = opt.cool != null ? opt.cool : 1e9; // düşman ateş etmesin (isabet sahnesi temiz kalsın)
    if (opt.hp) { e.hp = opt.hp; e.maxHp = opt.hp; }
    if (opt.keep != null) e.keep = opt.keep;
    if (opt.speed != null) e.speed = opt.speed;
    return e;
  };
  S.clearNonSentinel = () => { for (const e of R.enemies) if (!e.sentinel && e.alive) { e.alive = false; R.scene.remove(e.mesh); R.disposeTank(e.mesh); } R.enemies = R.enemies.filter(e => e.alive); };
  // kamera yakınlaştırma (pre-hook içinde çağrılır): fov + alçak açı
  S.camTight = (fov = 44, drop = 2.5, ahead = 6, back = 0) => {
    const C = R.camera, P = R.player;
    const sp = C.position.clone(), sq = C.quaternion.clone();
    C.fov = fov; C.updateProjectionMatrix();
    C.position.y -= drop; C.position.x -= R.fwdX(P.a) * back; C.position.z -= R.fwdZ(P.a) * back;
    C.lookAt(P.x + R.fwdX(P.a) * ahead, 1.2, P.z + R.fwdZ(P.a) * ahead);
    S.post = () => { C.position.copy(sp); C.quaternion.copy(sq); }; // lerp durumu bozulmasın (kalıcı sapma yok)
  };
  S.camReset = () => { R.camera.fov = 55; R.camera.updateProjectionMatrix(); };
  S.thumbs = {};
  S.loadThumbs = async () => {
    for (const t of R.TANKS) { if (t.model) await R.ensureModel(t.model); const url = R.renderTankThumb(t); if (url) { const im = new Image(); im.src = url; await new Promise(r => { im.onload = r; im.onerror = r; }); S.thumbs[t.id] = im; } }
    return Object.keys(S.thumbs).length;
  };
  return 'lib ok';
})();
