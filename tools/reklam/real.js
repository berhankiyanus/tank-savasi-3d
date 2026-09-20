#!/usr/bin/env node
// GERÇEK OYNANIŞ REKLAMI (v4): headless Chrome (GPU) + CDP screencast → oyunun kendi arayüzü (joystick, ateş tuşu, kalpler, dalga yazısı) ile
// gerçek bir tur oynanır (otomatik ama kusurlu "başparmak" oyuncusu), sonda kısa DOM kapanış kartı. Ses: oyunun SFX+müziği sayfada MediaRecorder ile.
// kullanım: NODE_PATH=<playwright-core dizini> node tools/reklam/real.js <outdir> [map=3] [seconds=15] [seed=1] [wave=3]   (önce: kanca main.js'te, assets/_reclib.js kopyalı, localhost:8734 açık)
const { chromium } = require('playwright-core');
const fs = require('fs'), path = require('path'), { execSync } = require('child_process');
const OUT = process.argv[2] || '/tmp/real-ad', MAP = +(process.argv[3] || 3), SECS = +(process.argv[4] || 15), SEED = +(process.argv[5] || 1), WAVE = +(process.argv[6] || 3);
const EXE = process.env.HOME + '/Library/Caches/ms-playwright/chromium-1208/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing';
fs.mkdirSync(path.join(OUT, 'frames'), { recursive: true });

const SETUP = `(async () => {
  const R = window.__R; await document.fonts.ready;
  await new Promise(r => { const s = document.createElement('script'); s.src = 'assets/_reclib.js?' + Date.now(); s.onload = r; document.head.appendChild(s); });
  const S = window.__S, p = R.profile;
  Object.assign(p, { name: 'Komutan', tutorialDone: true, games: 31, kills: 640, wins: 12, bestWave: 12, level: 14, xp: 120, coins: 3860, gems: 41, tokens: 3,
    selected: 'goldking', skin: 'dragon', accessory: 'dragonwings', accessory2: '', trail: 'dragonfire', explosion: 'dragonblast', track: 'tr_gold' });
  for (const [k, v] of [['skins', 'dragon'], ['accessories', 'dragonwings'], ['trails', 'dragonfire'], ['explosions', 'dragonblast'], ['tracks', 'tr_gold'], ['owned', 'goldking']]) { p[k] = p[k] || []; if (!p[k].includes(v)) p[k].push(v); }
  p.lastDaily = new Date().toISOString().slice(0, 10); p.streak = 4;
  R.settings.autoFire = false; R.settings.music = true; R.settings.muted = false; R.settings.quality = 'high'; R.settings.stick = 'normal';
  R.saveProfile(); R.updateCoinBar();
  document.getElementById('toast').style.display = 'none'; if (R.toastQ) R.toastQ.length = 0;
  // UI 2x (1080x1920 CSS piksel = cihaz pikseli; arayüz telefon boyutunda kalsın), 3B kanvas dokunulmaz
  const st = document.createElement('style'); st.textContent = 'body > *:not(#game):not(#advthumb):not(#advtap):not(#advend) { zoom: 2; } #advthumb { position: fixed; z-index: 99; width: 150px; height: 150px; border-radius: 50%; background: rgba(255,255,255,0.28); border: 4px solid rgba(255,255,255,0.55); box-shadow: 0 12px 36px rgba(0,0,0,0.35); pointer-events: none; transform: translate(-50%,-50%); display: none; } #advtap { position: fixed; z-index: 99; width: 150px; height: 150px; border-radius: 50%; border: 6px solid rgba(255,255,255,0.8); pointer-events: none; transform: translate(-50%,-50%) scale(0.6); opacity: 0; transition: transform .18s ease-out, opacity .22s ease-out; } #advend { position: fixed; inset: 0; z-index: 200; display: none; background: linear-gradient(180deg, rgba(0,0,0,0) 35%, rgba(0,0,0,0.78) 70%); font-family: "Russo One", "Courier New", monospace; text-align: center; } #advend .t { position: absolute; left: 0; right: 0; top: 62%; font-size: 92px; color: #ffd76a; text-shadow: 0 6px 0 #6b4a00, 0 16px 44px rgba(0,0,0,0.7); letter-spacing: 4px; } #advend .s { position: absolute; left: 0; right: 0; top: 69.5%; font-size: 36px; color: #fff; letter-spacing: 2px; text-shadow: 0 4px 16px #000; } #advend .b { position: absolute; left: 50%; top: 75.5%; transform: translateX(-50%); background: linear-gradient(#ffb347, #ff8c1a); color: #1a1000; font-size: 50px; padding: 28px 80px; border-radius: 80px; border: 6px solid #ffd88a; box-shadow: 0 16px 48px rgba(0,0,0,0.5); animation: advpulse 0.9s ease-in-out infinite; } @keyframes advpulse { 0%,100% { transform: translateX(-50%) scale(1); } 50% { transform: translateX(-50%) scale(1.05); } }';
  document.head.appendChild(st);
  const th = document.createElement('div'); th.id = 'advthumb'; document.body.appendChild(th);
  const tp = document.createElement('div'); tp.id = 'advtap'; document.body.appendChild(tp);
  const end = document.createElement('div'); end.id = 'advend'; end.innerHTML = '<div class="t">TANK SAVAŞI 3D</div><div class="s">15 TANK · 12 HARİTA · SANDIKLAR</div><div class="b">▶ ÜCRETSİZ OYNA</div>'; document.body.appendChild(end);
  for (const m of Object.keys(R.MODEL_PATHS)) await R.ensureModel(m);
  await S.audioInit();
  return { ac: R.AC.state, touch: document.body.classList.contains('touch'), cw: R.renderer.domElement.width, ch: R.renderer.domElement.height };
})()`;

// otomatik "başparmak" oyuncu: en yakın düşmana yumuşak dönüş, mesafeye göre sür/geri, hizalanınca kısa basış ateş (bazen ıskalar), görüş yoksa duvara sekme denemesi, mermi gelince kaçış
const PLAY = `(async (map, seed) => {
  const R = window.__R, S = window.__S; let rs = seed * 9301 + 49297; const rnd = () => { rs = (rs * 9301 + 49297) % 233280; return rs / 233280; };
  R.openMenu(); R.startSolo(map);
  if (window.__advWave > 1) { for (const e of R.enemies) { e.alive = false; R.scene.remove(e.mesh); } R.enemies = []; R.wave = window.__advWave; R.spawnEnemies(R.waveComposition(R.wave)); R.updateHUD(); R.banner('DALGA ' + R.wave); }
  try { R.startMusic(); } catch (e) {} if (R.musicGain && S.adest) { try { R.musicGain.connect(S.adest); } catch (e) {} } // oyunun kendi müziği kayda
  const P = R.player, T = R.touchCtl, stick = document.getElementById('stick'), knob = document.getElementById('knob'), fire = document.getElementById('firebtn'), th = document.getElementById('advthumb'), tp = document.getElementById('advtap');
  const ang = a => Math.atan2(Math.sin(a), Math.cos(a));
  const headTo = (x, z) => Math.atan2(P.x - x, P.z - z); // fwd = (-sin a, -cos a)
  let jx = 0, jy = 0, fireT = 0, wallT = 0, dodgeT = 0, dodgeDir = 1, noLosT = 0, lastFireAt = 0; const stats = { shots: 0, kills0: R.profile.kills, mega: 0 }; let megaOn = false;
  window.__advStop = false;
  const rootRect = el => { const r = el.getBoundingClientRect(); const f = 2 / (r.width / el.offsetWidth); return { left: r.left * f, top: r.top * f, width: r.width * f, height: r.height * f }; }; // kök px
  const knobR = () => { const r = rootRect(stick); return { cx: r.left + r.width / 2, cy: r.top + r.height / 2, max: stick.offsetWidth / 2 - 18 }; };
  let pickT = 0;
  const loop = setInterval(() => {
    if (window.__advStop || R.state !== 'play' || R.paused) return;
    const bc = document.getElementById('buildchoice');
    if (bc && !bc.classList.contains('hidden')) { pickT += 0.016; if (pickT > 0.7) { const cards = document.getElementById('build-cards').children; const c = cards[Math.min(cards.length - 1, 1 + Math.floor(rnd() * (cards.length - 1)))] || cards[0]; if (c) { const cr = rootRect(c); tp.style.left = (cr.left + cr.width / 2) + 'px'; tp.style.top = (cr.top + cr.height / 2) + 'px'; tp.style.opacity = 1; tp.style.transform = 'translate(-50%,-50%) scale(1.15)'; setTimeout(() => { tp.style.opacity = 0; tp.style.transform = 'translate(-50%,-50%) scale(0.6)'; }, 160); setTimeout(() => c.click(), 120); stats.picks = (stats.picks || 0) + 1; } pickT = -9; } th.style.display = 'none'; return; }
    if (pickT < 0) pickT = 0;
    const dt = 0.016; fireT -= dt; dodgeT -= dt; wallT -= dt;
    if (R.slowmoT > 0) { if (!megaOn) { megaOn = true; stats.mega++; } } else megaOn = false; // gerçek MEGA SEKME sayacı
    let tgt = null, bd = 1e9; for (const e of R.enemies) { if (!e.alive) continue; const d = Math.hypot(e.x - P.x, e.z - P.z); const los = R.losClear(P.x, P.z, e.x, e.z); const sc = d + (los ? 0 : 14); if (sc < bd) { bd = sc; tgt = e; } }
    let wantTurn = Math.sin(performance.now() / 900) * 0.5, wantMove = 0.6; // hedef yok: dolaş
    if (tgt) {
      const d = Math.hypot(tgt.x - P.x, tgt.z - P.z), los = R.losClear(P.x, P.z, tgt.x, tgt.z); noLosT = los ? 0 : noLosT + dt;
      let diff = ang(headTo(tgt.x, tgt.z) - P.a);
      if (!los && noLosT > 0.9 && wallT <= 0) { wallT = 2.2; } // duvara açılı at (sekme şansı)
      if (wallT > 0) diff += 0.55 * (seed % 2 ? 1 : -1);
      wantTurn = Math.max(-1, Math.min(1, diff * 1.7));
      wantMove = d > 11 ? 0.8 : d > 6 ? 0.35 : -0.25;
      const aimed = Math.abs(diff) < 0.2 || (wallT > 0 && Math.abs(diff) < 0.25) || (d < 7 && Math.abs(diff) < 0.35);
      if (fireT <= 0 && (aimed || (rnd() < 0.02 && Math.abs(diff) < 0.6))) { T.fire = true; setTimeout(() => { T.fire = false; }, 90); fireT = 0.3 + rnd() * 0.2; stats.shots++; lastFireAt = performance.now();
        const fr = rootRect(fire); tp.style.left = (fr.left + fr.width / 2) + 'px'; tp.style.top = (fr.top + fr.height / 2) + 'px'; tp.style.opacity = 1; tp.style.transform = 'translate(-50%,-50%) scale(1.15)'; setTimeout(() => { tp.style.opacity = 0; tp.style.transform = 'translate(-50%,-50%) scale(0.6)'; }, 160); }
    }
    // gelen mermi → kaçış
    for (const b of R.bullets) { if (b.fromPlayer) continue; const dx = b.mesh.position.x - P.x, dz = b.mesh.position.z - P.z, dist = Math.hypot(dx, dz); if (dist < 5 && (dx * (b.vx || 0) + dz * (b.vz || 0)) < 0 && dodgeT <= 0) { dodgeT = 0.45; dodgeDir = rnd() < 0.5 ? -1 : 1; } }
    if (dodgeT > 0) { wantMove = 0.9; wantTurn = dodgeDir * 0.8; }
    // başparmak: yumuşak joystick (insan gecikmesi) + ölü bölge
    jx += (wantTurn - jx) * 0.18; jy += (wantMove - jy) * 0.14;
    const k = knobR(); const nx = -jx, ny = -jy; const dx = nx * k.max, dy = ny * k.max; knob.style.transform = 'translate(' + dx + 'px, ' + dy + 'px)';
    th.style.display = 'block'; th.style.left = (k.cx + dx * 2) + 'px'; th.style.top = (k.cy + dy * 2) + 'px'; // knob layout px → kök px
    T.turn = Math.abs(jx) > 0.1 ? jx : 0; T.move = Math.abs(jy) > 0.1 ? jy : 0;
  }, 16);
  window.__advLoop = loop; window.__advStats = () => ({ shots: stats.shots, kills: R.profile.kills - stats.kills0, mega: stats.mega, picks: stats.picks || 0, wave: R.wave, hp: P.health, alive: P.alive, state: R.state, music: !!R.musicGain, musicV: R.musicGain ? +R.musicGain.gain.value.toFixed(2) : null });
  return 'play started';
})`;

(async () => {
  const browser = await chromium.launch({ executablePath: EXE, headless: true, args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist', '--enable-gpu-rasterization', '--autoplay-policy=no-user-gesture-required'] });
  const ctx = await browser.newContext({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, locale: 'tr-TR' });
  const page = await ctx.newPage(); const errs = []; page.on('pageerror', e => errs.push(String(e.message).slice(0, 140)));
  await page.goto('http://localhost:8734/?rec=1', { waitUntil: 'load' });
  await page.evaluate(() => new Promise(r => { const iv = setInterval(() => { if (window.__gameLoaded) { clearInterval(iv); r(); } }, 50); }));
  console.log('setup', JSON.stringify(await page.evaluate(SETUP)));
  await page.evaluate(`window.__advWave = ${WAVE}`);
  await page.evaluate(PLAY + `(${MAP}, ${SEED})`).then(r => console.log(r)); // dize ifadesi: fonksiyonu burada çağır
  await page.waitForTimeout(900); // dalga banner'ı + ilk düşmanlar
  // ses kaydı (sayfada) + screencast
  await page.evaluate(() => { const S = window.__S; const rec = new MediaRecorder(S.adest.stream, { mimeType: 'audio/webm;codecs=opus', audioBitsPerSecond: 160000 }); const ch = []; rec.ondataavailable = e => { if (e.data.size) ch.push(e.data); }; window.__aud = { rec, ch, t0: 0 }; rec.onstart = () => { window.__aud.t0 = Date.now() / 1000; }; rec.start(250); });
  const cdp = await ctx.newCDPSession(page); const frames = []; let idx = 0;
  cdp.on('Page.screencastFrame', ev => { const i = idx++; frames.push({ i, t: ev.metadata.timestamp }); fs.writeFile(path.join(OUT, 'frames', `f${String(i).padStart(5, '0')}.jpg`), Buffer.from(ev.data, 'base64'), () => {}); cdp.send('Page.screencastFrameAck', { sessionId: ev.sessionId }).catch(() => {}); });
  await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 92, maxWidth: 1080, maxHeight: 1920, everyNthFrame: 1 });
  const castT0 = Date.now() / 1000;
  await page.waitForTimeout(SECS * 1000);
  const stats = await page.evaluate(() => window.__advStats());
  await page.evaluate(() => { window.__advStop = true; const T = window.__R.touchCtl; T.turn = 0; T.move = 0; T.fire = false; document.getElementById('advthumb').style.display = 'none'; document.getElementById('advend').style.display = 'block'; });
  await page.waitForTimeout(2300);
  await cdp.send('Page.stopScreencast');
  const aud = await page.evaluate(() => new Promise(r => { const a = window.__aud; a.rec.onstop = async () => { const b = new Blob(a.ch, { type: 'audio/webm' }); const buf = await b.arrayBuffer(); let s = ''; const u8 = new Uint8Array(buf); for (let i = 0; i < u8.length; i += 0x8000) s += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000)); r({ b64: btoa(s), t0: a.t0, size: buf.byteLength }); }; a.rec.stop(); }));
  fs.writeFileSync(path.join(OUT, 'audio.webm'), Buffer.from(aud.b64, 'base64'));
  await new Promise(r => setTimeout(r, 800));
  // kare listesi (concat demuxer, değişken süre) → 30 fps mp4; ses ofseti: kayıt başlangıcı vs ilk kare
  const lines = []; for (let i = 0; i < frames.length; i++) { const d = i + 1 < frames.length ? Math.max(0.004, frames[i + 1].t - frames[i].t) : 0.033; lines.push(`file 'frames/f${String(frames[i].i).padStart(5, '0')}.jpg'`, `duration ${d.toFixed(5)}`); }
  lines.push(`file 'frames/f${String(frames[frames.length - 1].i).padStart(5, '0')}.jpg'`);
  fs.writeFileSync(path.join(OUT, 'frames.txt'), lines.join('\n') + '\n');
  const off = (frames[0].t - aud.t0).toFixed(3); // ses, kareden bu kadar önce başladı → sesi kaydır
  const dur = (frames[frames.length - 1].t - frames[0].t).toFixed(2);
  console.log(JSON.stringify({ frames: frames.length, fps: +(frames.length / dur).toFixed(1), dur: +dur, audioKB: Math.round(aud.size / 1024), audioOffset: +off, stats, errs }));
  execSync(`cd "${OUT}" && ffmpeg -v error -y -f concat -safe 0 -i frames.txt -ss ${off} -i audio.webm -vf "fps=30,format=yuv420p" -c:v libx264 -preset medium -crf 18 -c:a aac -b:a 160k -ar 48000 -shortest -movflags +faststart raw.mp4`);
  console.log('raw.mp4 ok', fs.statSync(path.join(OUT, 'raw.mp4')).size);
  await browser.close();
})().catch(e => { console.error('ERR', e.stack || e.message); process.exit(1); });
