#!/usr/bin/env node
// GERÇEK OYNANIŞ REKLAMI v5 — 3 gerçek sahne (hepsi oyunun kendi arayüzü/kamerası/sesi, otomatik kusurlu oyuncu) + kapanış kartı:
//  S1 Kar: gerçek 2 sekmeli vuruş (oyunun kendi ağır çekimi + "MEGA SEKME!" yazısı), altyazı "Bu atışı yapabilir misin?"
//  S2 Stadyum: dalga 4 kalabalık çatışma   S3 Kanyon: dalga 5 BOSS (gerçek can barı, telegraf, patlama) + kapanış kartı
// Ses: oyun SFX (sayfada MediaRecorder) + müzik yatağı (/tmp/v2-music.wav) → loudnorm -14. Kullanım: NODE_PATH=<playwright-core> node tools/reklam/real2.js <outdir> [seed]
const { chromium } = require('playwright-core');
const fs = require('fs'), path = require('path'), { execSync } = require('child_process');
const OUT = process.argv[2] || '/tmp/real-ad2', SEED = +(process.argv[3] || 7), MUSIC = process.env.MUSIC || '/tmp/v2-music.wav';
const EXE = process.env.HOME + '/Library/Caches/ms-playwright/chromium-1208/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing';
fs.mkdirSync(OUT, { recursive: true });

const SETUP = `(async () => {
  const R = window.__R; await document.fonts.ready;
  await new Promise(r => { const s = document.createElement('script'); s.src = 'assets/_reclib.js?' + Date.now(); s.onload = r; document.head.appendChild(s); });
  const S = window.__S, p = R.profile;
  Object.assign(p, { name: 'Komutan', tutorialDone: true, games: 31, kills: 640, wins: 12, bestWave: 12, level: 14, xp: 120, coins: 3860, gems: 41, tokens: 3,
    selected: 'goldking', skin: 'dragon', accessory: 'dragonwings', accessory2: '', trail: 'dragonfire', explosion: 'dragonblast', track: 'tr_gold' });
  for (const [k, v] of [['skins', 'dragon'], ['accessories', 'dragonwings'], ['trails', 'dragonfire'], ['explosions', 'dragonblast'], ['tracks', 'tr_gold'], ['owned', 'goldking']]) { p[k] = p[k] || []; if (!p[k].includes(v)) p[k].push(v); }
  p.lastDaily = new Date().toISOString().slice(0, 10); p.streak = 4;
  R.settings.autoFire = false; R.settings.music = false; R.settings.muted = false; R.settings.quality = 'high'; R.settings.stick = 'normal';
  R.saveProfile(); R.updateCoinBar();
  document.getElementById('toast').style.display = 'none'; if (R.toastQ) R.toastQ.length = 0;
  const st = document.createElement('style'); st.textContent = 'body > *:not(#game):not(#advthumb):not(#advtap):not(#advend):not(#advcap) { zoom: 2; } #advthumb { position: fixed; z-index: 99; width: 150px; height: 150px; border-radius: 50%; background: rgba(255,255,255,0.28); border: 4px solid rgba(255,255,255,0.55); box-shadow: 0 12px 36px rgba(0,0,0,0.35); pointer-events: none; transform: translate(-50%,-50%); display: none; } #advtap { position: fixed; z-index: 99; width: 150px; height: 150px; border-radius: 50%; border: 6px solid rgba(255,255,255,0.8); pointer-events: none; transform: translate(-50%,-50%) scale(0.6); opacity: 0; transition: transform .18s ease-out, opacity .22s ease-out; } #advcap { position: fixed; z-index: 150; left: 0; right: 0; top: 17%; text-align: center; font-family: "Russo One", "Courier New", monospace; font-size: 54px; color: #fff; letter-spacing: 1px; text-shadow: 0 3px 0 #000, 0 0 18px rgba(0,0,0,0.9), 0 6px 24px rgba(0,0,0,0.8); opacity: 0; transition: opacity .25s ease-out; pointer-events: none; padding: 0 60px; } #advend { position: fixed; inset: 0; z-index: 200; display: none; background: linear-gradient(180deg, rgba(0,0,0,0) 35%, rgba(0,0,0,0.78) 70%); font-family: "Russo One", "Courier New", monospace; text-align: center; } #advend .t { position: absolute; left: 0; right: 0; top: 62%; font-size: 92px; color: #ffd76a; text-shadow: 0 6px 0 #6b4a00, 0 16px 44px rgba(0,0,0,0.7); letter-spacing: 4px; } #advend .s { position: absolute; left: 0; right: 0; top: 69.5%; font-size: 36px; color: #fff; letter-spacing: 2px; text-shadow: 0 4px 16px #000; } #advend .b { position: absolute; left: 50%; top: 75.5%; transform: translateX(-50%); background: linear-gradient(#ffb347, #ff8c1a); color: #1a1000; font-size: 50px; padding: 28px 80px; border-radius: 80px; border: 6px solid #ffd88a; box-shadow: 0 16px 48px rgba(0,0,0,0.5); animation: advpulse 0.9s ease-in-out infinite; } @keyframes advpulse { 0%,100% { transform: translateX(-50%) scale(1); } 50% { transform: translateX(-50%) scale(1.05); } }';
  document.head.appendChild(st);
  for (const [id, html] of [['advthumb', ''], ['advtap', ''], ['advcap', ''], ['advend', '<div class="t">TANK SAVAŞI 3D</div><div class="s">15 TANK · 12 HARİTA · SANDIKLAR</div><div class="b">▶ ÜCRETSİZ OYNA</div>']]) { const d = document.createElement('div'); d.id = id; d.innerHTML = html; document.body.appendChild(d); }
  window.__advCaption = (text, secs) => { const c = document.getElementById('advcap'); c.textContent = text; c.style.opacity = 1; clearTimeout(window.__capT); window.__capT = setTimeout(() => { c.style.opacity = 0; }, secs * 1000); };
  for (const m of Object.keys(R.MODEL_PATHS)) await R.ensureModel(m);
  await S.audioInit();
  // otomatik oyuncu (tek döngü; sahneler arası parametreler window.__adv üzerinden)
  const P = R.player, T = R.touchCtl, stick = document.getElementById('stick'), knob = document.getElementById('knob'), fire = document.getElementById('firebtn'), th = document.getElementById('advthumb'), tp = document.getElementById('advtap');
  let rs = ${SEED} * 9301 + 49297; const rnd = () => { rs = (rs * 9301 + 49297) % 233280; return rs / 233280; };
  const ang = a => Math.atan2(Math.sin(a), Math.cos(a)); const headTo = (x, z) => Math.atan2(P.x - x, P.z - z);
  const rootRect = el => { const r = el.getBoundingClientRect(); const f = 2 / (r.width / el.offsetWidth); return { left: r.left * f, top: r.top * f, width: r.width * f, height: r.height * f }; };
  const knobR = () => { const r = rootRect(stick); return { cx: r.left + r.width / 2, cy: r.top + r.height / 2, max: stick.offsetWidth / 2 - 18 }; };
  const tap = el => { const fr = rootRect(el); tp.style.left = (fr.left + fr.width / 2) + 'px'; tp.style.top = (fr.top + fr.height / 2) + 'px'; tp.style.opacity = 1; tp.style.transform = 'translate(-50%,-50%) scale(1.15)'; setTimeout(() => { tp.style.opacity = 0; tp.style.transform = 'translate(-50%,-50%) scale(0.6)'; }, 160); };
  const A = window.__adv = { on: false, force: null, preferBoss: false, stats: { shots: 0, mega: 0, picks: 0 }, jx: 0, jy: 0, fireT: 0, wallT: 0, dodgeT: 0, dodgeDir: 1, noLosT: 0, pickT: 0, megaOn: false };
  A.doFire = () => { T.fire = true; setTimeout(() => { T.fire = false; }, 90); A.fireT = 0.3 + rnd() * 0.2; A.stats.shots++; tap(fire); };
  setInterval(() => {
    if (!A.on || R.state !== 'play' || R.paused) return;
    const dt = 0.016; A.fireT -= dt; A.dodgeT -= dt; A.wallT -= dt;
    if (R.slowmoT > 0) { if (!A.megaOn) { A.megaOn = true; A.stats.mega++; } } else A.megaOn = false;
    const bc = document.getElementById('buildchoice');
    if (bc && !bc.classList.contains('hidden')) { A.pickT += dt; if (A.pickT > 0.7) { const cards = document.getElementById('build-cards').children; const c = cards[Math.min(cards.length - 1, 1 + Math.floor(rnd() * (cards.length - 1)))] || cards[0]; if (c) { tap(c); setTimeout(() => c.click(), 120); A.stats.picks++; } A.pickT = -9; } th.style.display = 'none'; return; }
    if (A.pickT < 0) A.pickT = 0;
    let wantTurn = Math.sin(performance.now() / 900) * 0.5, wantMove = 0.6;
    if (A.force) { // zorunlu yön: sekme atışı (gerçek 2 sekme yolu) — hizalan, ateş et, bırak
      const diff = ang(A.force.a - P.a); wantTurn = Math.max(-1, Math.min(1, diff * 2.2)); wantMove = 0;
      if (Math.abs(diff) < 0.035 && performance.now() > A.force.notBefore) { P.a = A.force.a; P.mesh.rotation.y = P.a; A.doFire(); A.force = null; A.fireT = 0.9; }
    } else {
      let tgt = null, bd = 1e9; for (const e of R.enemies) { if (!e.alive) continue; const d = Math.hypot(e.x - P.x, e.z - P.z); const los = R.losClear(P.x, P.z, e.x, e.z); const sc = d + (los ? 0 : 14) - (A.preferBoss && R.isBoss(e.type) ? 30 : 0); if (sc < bd) { bd = sc; tgt = e; } }
      if (tgt) {
        const d = Math.hypot(tgt.x - P.x, tgt.z - P.z), los = R.losClear(P.x, P.z, tgt.x, tgt.z); A.noLosT = los ? 0 : A.noLosT + dt;
        let diff = ang(headTo(tgt.x, tgt.z) - P.a);
        if (!los && A.noLosT > 0.9 && A.wallT <= 0) A.wallT = 2.2;
        if (A.wallT > 0) diff += 0.55 * (${SEED} % 2 ? 1 : -1);
        wantTurn = Math.max(-1, Math.min(1, diff * 1.7)); wantMove = d > 11 ? 0.8 : d > 6 ? 0.35 : -0.25;
        const aimed = Math.abs(diff) < 0.2 || (A.wallT > 0 && Math.abs(diff) < 0.25) || (d < 7 && Math.abs(diff) < 0.35);
        if (A.fireT <= 0 && (aimed || (rnd() < 0.02 && Math.abs(diff) < 0.6))) A.doFire();
      }
      for (const b of R.bullets) { if (b.fromPlayer) continue; const dx = b.mesh.position.x - P.x, dz = b.mesh.position.z - P.z, dist = Math.hypot(dx, dz); if (dist < 5 && (dx * (b.vx || 0) + dz * (b.vz || 0)) < 0 && A.dodgeT <= 0) { A.dodgeT = 0.45; A.dodgeDir = rnd() < 0.5 ? -1 : 1; } }
      if (A.dodgeT > 0) { wantMove = 0.9; wantTurn = A.dodgeDir * 0.8; }
    }
    A.jx += (wantTurn - A.jx) * 0.18; A.jy += (wantMove - A.jy) * 0.14;
    const k = knobR(); const dx = -A.jx * k.max, dy = -A.jy * k.max; knob.style.transform = 'translate(' + dx + 'px, ' + dy + 'px)';
    th.style.display = 'block'; th.style.left = (k.cx + dx * 2) + 'px'; th.style.top = (k.cy + dy * 2) + 'px';
    T.turn = Math.abs(A.jx) > 0.1 ? A.jx : 0; T.move = Math.abs(A.jy) > 0.1 ? A.jy : 0;
  }, 16);
  // sahne kurulumu: harita + dalga (gerçek spawn), opsiyonel boss can ayarı / sekme yolu
  window.__advScene = async (map, wave, opt = {}) => {
    A.on = false; A.force = null; A.preferBoss = !!opt.boss; T.turn = T.move = 0; T.fire = false;
    R.openMenu(); R.startSolo(map);
    for (const e of R.enemies) { e.alive = false; R.scene.remove(e.mesh); } R.enemies = [];
    R.wave = wave; R.spawnEnemies(R.waveComposition(wave)); R.updateHUD();
    if (opt.boss) { // boss görüş içinde başlasın: oyuncunun önünde açık ve görüşü net bir nokta
      for (const e of R.enemies) if (R.isBoss(e.type)) { e.hp = e.maxHp = opt.bossHp || 6; const rx = R.fwdZ(P.a), rz = -R.fwdX(P.a);
        for (const [d, l] of [[11, 0], [12, 2.5], [12, -2.5], [10, 3.5], [10, -3.5], [13, 0], [9, 0], [14, 2], [14, -2]]) { const x = P.x + R.fwdX(P.a) * d + rx * l, z = P.z + R.fwdZ(P.a) * d + rz * l; if (!R.pointInWall(x, z) && R.losClear(P.x, P.z, x, z)) { e.x = x; e.z = z; e.mesh.position.set(x, 0, z); e.a = Math.atan2(P.x - x, P.z - z); e.mesh.rotation.y = e.a; break; } } }
      R.banner(R.T().bossW); } else R.banner('DALGA ' + wave);
    let mega = null;
    if (opt.mega) { // kayıt dışı: gerçek mermiyle 2 sekmeli yol bul, iniş noktasına düşman koy
      const S = window.__S; for (let k = 0; k < 24 && !mega; k++) {
        const a = P.a + k * (Math.PI / 12); P.a = a; P.mesh.rotation.y = a; if (R.playerTurret) R.playerTurret.rotation.y = 0;
        const n0 = R.bullets.length; R.fire(P); const b = R.bullets[R.bullets.length - 1]; if (!b || R.bullets.length === n0) continue;
        let hit = null; for (let i = 0; i < 160; i++) { await S.wait(16); if (!R.bullets.includes(b)) break; if (b.b0 - b.bounces >= 2) { hit = { x: b.mesh.position.x, z: b.mesh.position.z, vx: b.vx, vz: b.vz }; break; } }
        const idx = R.bullets.indexOf(b); if (idx >= 0) { R.scene.remove(b.mesh); R.bullets.splice(idx, 1); }
        if (hit) { const sp = Math.hypot(hit.vx, hit.vz) || 1, d = 3.2, ex = hit.x + hit.vx / sp * d, ez = hit.z + hit.vz / sp * d; const dp = Math.hypot(ex - P.x, ez - P.z), fx = R.fwdX(a), fz = R.fwdZ(a); const perp = Math.abs((ex - P.x) * fz - (ez - P.z) * fx); if (dp > 4 && dp < 16 && perp > 2 && R.losClear(hit.x, hit.z, ex, ez)) mega = { a, ex, ez, perp: +perp.toFixed(1) }; }
      }
      if (mega) { R.spawnEnemies(['normal']); const e = R.enemies[R.enemies.length - 1]; e.x = mega.ex; e.z = mega.ez; e.a = Math.atan2(P.x - mega.ex, P.z - mega.ez); e.mesh.position.set(e.x, 0, e.z); e.mesh.rotation.y = e.a; e.cool = 1e9; e.speed = 0; e.keep = 99; P.a = mega.a - 0.9; P.mesh.rotation.y = P.a; A.force = { a: mega.a, notBefore: performance.now() + (opt.megaDelay || 900) }; }
    }
    A.stats = { shots: 0, mega: 0, picks: 0 }; A.jx = A.jy = 0; A.fireT = opt.boss ? 1.0 : 0; A.on = true; // boss: önce bak, sonra ateş
    return { enemies: R.enemies.length, wave: R.wave, mega };
  };
  return { ac: R.AC.state, touch: document.body.classList.contains('touch'), cw: R.renderer.domElement.width, ch: R.renderer.domElement.height };
})()`;

(async () => {
  const browser = await chromium.launch({ executablePath: EXE, headless: true, args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist', '--enable-gpu-rasterization', '--autoplay-policy=no-user-gesture-required'] });
  const ctx = await browser.newContext({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, locale: 'tr-TR' });
  const page = await ctx.newPage(); const errs = []; page.on('pageerror', e => errs.push(String(e.message).slice(0, 140)));
  await page.goto('http://localhost:8734/?rec=1', { waitUntil: 'load' });
  await page.evaluate(() => new Promise(r => { const iv = setInterval(() => { if (window.__gameLoaded) { clearInterval(iv); r(); } }, 50); }));
  console.log('setup', JSON.stringify(await page.evaluate(SETUP)));
  const cdp = await ctx.newCDPSession(page);
  let frames = [], idx = 0, dir = '';
  cdp.on('Page.screencastFrame', ev => { const i = idx++; frames.push({ i, t: ev.metadata.timestamp }); fs.writeFile(path.join(dir, `f${String(i).padStart(5, '0')}.jpg`), Buffer.from(ev.data, 'base64'), () => {}); cdp.send('Page.screencastFrameAck', { sessionId: ev.sessionId }).catch(() => {}); });
  const recordScene = async (name, secs, before, after) => {
    dir = path.join(OUT, name); fs.mkdirSync(dir, { recursive: true }); frames = []; idx = 0;
    await page.evaluate(() => { const S = window.__S; const rec = new MediaRecorder(S.adest.stream, { mimeType: 'audio/webm;codecs=opus', audioBitsPerSecond: 160000 }); const ch = []; rec.ondataavailable = e => { if (e.data.size) ch.push(e.data); }; window.__aud = { rec, ch, t0: 0 }; rec.onstart = () => { window.__aud.t0 = Date.now() / 1000; }; rec.start(250); });
    await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 92, maxWidth: 1080, maxHeight: 1920, everyNthFrame: 1 });
    if (before) await before();
    await page.waitForTimeout(secs * 1000);
    if (after) await after();
    await cdp.send('Page.stopScreencast');
    const aud = await page.evaluate(() => new Promise(r => { const a = window.__aud; a.rec.onstop = async () => { const b = new Blob(a.ch, { type: 'audio/webm' }); const buf = await b.arrayBuffer(); let s = ''; const u8 = new Uint8Array(buf); for (let i = 0; i < u8.length; i += 0x8000) s += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000)); r({ b64: btoa(s), t0: a.t0, size: buf.byteLength }); }; a.rec.stop(); }));
    fs.writeFileSync(path.join(dir, 'audio.webm'), Buffer.from(aud.b64, 'base64'));
    await new Promise(r => setTimeout(r, 600));
    const lines = []; for (let i = 0; i < frames.length; i++) { const d = i + 1 < frames.length ? Math.max(0.004, frames[i + 1].t - frames[i].t) : 0.033; lines.push(`file 'f${String(frames[i].i).padStart(5, '0')}.jpg'`, `duration ${d.toFixed(5)}`); }
    lines.push(`file 'f${String(frames[frames.length - 1].i).padStart(5, '0')}.jpg'`); fs.writeFileSync(path.join(dir, 'frames.txt'), lines.join('\n') + '\n');
    const off = (frames[0].t - aud.t0).toFixed(3), dur = (frames[frames.length - 1].t - frames[0].t).toFixed(2);
    execSync(`cd "${dir}" && ffmpeg -v error -y -f concat -safe 0 -i frames.txt -ss ${off} -i audio.webm -vf "fps=30,format=yuv420p" -c:v libx264 -preset medium -crf 18 -c:a aac -b:a 160k -ar 48000 -shortest "${path.join(OUT, name + '.mp4')}"`);
    const stats = await page.evaluate(() => window.__adv.stats);
    console.log(name, JSON.stringify({ frames: frames.length, fps: +(frames.length / dur).toFixed(1), dur: +dur, stats }));
  };
  const want = n => !process.env.SCENES || process.env.SCENES.split(',').includes(n);
  // S1: Kar, dalga 3, gerçek MEGA SEKME (yol kayıt dışı bulunur) + altyazı
  if (want('S1')) { const s1 = await page.evaluate(`window.__advScene(3, 3, { mega: true, megaDelay: 700 })`); console.log('S1 prep', JSON.stringify(s1));
  await page.evaluate(() => window.__advCaption('Bu atışı yapabilir misin? 👀', 2.4));
  await recordScene('S1', 3.8); }
  // S2: Stadyum, dalga 4 kalabalık çatışma (banner geçtikten sonra)
  if (want('S2')) { const s2 = await page.evaluate(`window.__advScene(1, 4, {})`); console.log('S2 prep', JSON.stringify(s2));
  await page.waitForTimeout(1100);
  await recordScene('S2', 4.2); }
  // S3: Kanyon, dalga 5 BOSS (gerçek can barı) + kapanış kartı
  if (want('S3')) { const s3 = await page.evaluate(`window.__advScene(11, 5, { boss: true, bossHp: 9 })`); console.log('S3 prep', JSON.stringify(s3));
  await page.waitForTimeout(500);
  await recordScene('S3', 5.0 + 2.3, async () => { await page.evaluate(() => setTimeout(() => { window.__adv.on = false; const T = window.__R.touchCtl; T.turn = 0; T.move = 0; T.fire = false; document.getElementById('advthumb').style.display = 'none'; for (const id of ['topbar', 'minimap', 'enemyarrow', 'runcoins', 'killfeed']) { const el = document.getElementById(id); if (el) el.style.visibility = 'hidden'; } document.getElementById('advend').style.display = 'block'; }, 5000)); }); } // kapanış kartı: kaydın son 2.3 sn'si
  const list = ['S1', 'S2', 'S3'].map(n => `file '${path.join(OUT, n + '.mp4')}'`).join('\n') + '\n'; fs.writeFileSync(path.join(OUT, 'list.txt'), list);
  execSync(`cd "${OUT}" && ffmpeg -v error -y -f concat -safe 0 -i list.txt -c copy cat.mp4`);
  const dur = +execSync(`ffprobe -v error -show_entries format=duration -of csv=p=0 "${path.join(OUT, 'cat.mp4')}"`).toString().trim();
  const fo = Math.max(0, dur - 1.2).toFixed(2);
  const mus = fs.existsSync(MUSIC) ? `-stream_loop -1 -i "${MUSIC}" -filter_complex "[0:a]volume=1.0[g];[1:a]atrim=0:${dur.toFixed(2)},afade=t=in:st=0:d=0.3,afade=t=out:st=${fo}:d=1.2,volume=0.42[m];[g][m]amix=inputs=2:duration=first:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=11[a]" -map 0:v -map "[a]"` : `-af "loudnorm=I=-14:TP=-1.5:LRA=11"`;
  execSync(`cd "${OUT}" && ffmpeg -v error -y -i cat.mp4 ${mus} -c:v copy -c:a aac -b:a 192k -ar 48000 -movflags +faststart final.mp4`);
  console.log('final', dur.toFixed(2), 's', fs.statSync(path.join(OUT, 'final.mp4')).size, 'errs', JSON.stringify(errs));
  await browser.close();
})().catch(e => { console.error('ERR', e.stack || e.message); process.exit(1); });
