// Mağaza ekran görüntüleri: headless Chromium (playwright-core) + geçici window.__R köprüsü
// kullanım: node shots.js <out-dir> [sizes=iphone67,iphone65,android] [langs=tr,en]
const { chromium } = require('playwright-core');
const fs = require('fs'), path = require('path');
const OUT = process.argv[2] || 'out';
const SIZES = { iphone67: [430, 932, 3], iphone65: [428, 926, 3], android: [405, 720, 1080 / 405] };
const sizes = (process.argv[3] || 'iphone67,iphone65,android').split(',');
const langs = (process.argv[4] || 'tr,en').split(',');
const EXE = process.env.HOME + '/Library/Caches/ms-playwright/chromium-1208/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing';
const wait = ms => new Promise(r => setTimeout(r, ms));

const SETUP = async (lang) => {
  const R = window.__R;
  await new Promise(r => { const iv = setInterval(() => { if (window.__gameLoaded) { clearInterval(iv); r(); } }, 50); });
  await document.fonts.ready;
  const p = R.profile;
  Object.assign(p, {
    name: lang === 'tr' ? 'Komutan' : 'Commander', tutorialDone: true, games: 42, kills: 1240, wins: 17, bestWave: 14, level: 9, xp: 260,
    coins: 12480, gems: 215, tokens: 7, bestRunTime: 402, selected: 'goldking', skin: 'default', accessory: '',
    owned: ['recruit', 'scout', 'guardian', 'sniper', 'phantom', 'goldking', 'heavy', 'twin', 'arty', 'mamut', 'hover', 'titan'],
    accessories: ['flag', 'cone', 'duck', 'crown', 'wings'], skins: ['camo', 'gold', 'chrome', 'neon', 'inferno'],
  });
  R.settings.autoFire = false; R.settings.music = false; R.settings.muted = true; R.settings.quality = 'high';
  p.lastDaily = new Date().toISOString().slice(0, 10); p.streak = 5; // günlük ödül toast'ı çıkmasın
  R.saveProfile(); R.updateCoinBar();
  document.getElementById('toast').style.display = 'none'; if (R.toastQ) R.toastQ.length = 0;
  R.lang = lang; try { localStorage.setItem('tanklang', lang); } catch (e) {}
  R.applyLang(); R.openMenu();
  for (const m of Object.keys(R.MODEL_PATHS)) await R.ensureModel(m);
  return { lang: R.lang, coins: R.profile.coins };
};

const SHOTS = {
  // 1) lav haritasında patlama anı (HUD + dokunmatik kontroller görünür)
  1: async () => {
    const R = window.__R;
    R.openMenu(); R.startSolo(5);
    R.wave = 6; R.score = 5480; R.roundCoins = 214; R.updateHUD();
    const P = R.player; P.inv = 9999; P.health = P.maxHealth; R.renderHealth();
    const cells = R.openCells; let best = null, bd = 1e9;
    for (const c of cells) { const d = c.x * c.x + c.z * c.z; if (d < bd) { bd = d; best = c; } }
    P.x = best.x; P.z = best.z; P.vx = P.vz = 0; P.mesh.position.set(P.x, 0, P.z);
    let ba = 0, bl = -1;
    for (let i = 0; i < 48; i++) { const a = (i / 48) * Math.PI * 2; let l = 0; for (let d = 2; d <= 20; d += 1) { if (!R.losClear(P.x, P.z, P.x + R.fwdX(a) * d, P.z + R.fwdZ(a) * d)) break; l = d; } if (l > bl) { bl = l; ba = a; } }
    P.a = ba; P.mesh.rotation.y = ba;
    for (const e of R.enemies) { e.alive = false; R.scene.remove(e.mesh); }
    R.enemies = [];
    const put = (type, dist, lat) => { R.spawnEnemies([type]); const e = R.enemies[R.enemies.length - 1]; const rx = R.fwdZ(ba), rz = -R.fwdX(ba); e.x = P.x + R.fwdX(ba) * dist + rx * lat; e.z = P.z + R.fwdZ(ba) * dist + rz * lat; e.a = ba + Math.PI; e.mesh.position.set(e.x, 0, e.z); e.mesh.rotation.y = e.a; e.cool = 1e9; e.speed = 0; e.turn = 0; return e; };
    const e1 = put('normal', 5.5, -1.0); put('scout', 8.2, 1.3); put('heavy', 10.8, -0.6);
    await new Promise(r => setTimeout(r, 700));
    R.fire(P); await new Promise(r => setTimeout(r, 120));
    R.damageEnemy(e1, 99); R.shake = 0;
    await new Promise(r => setTimeout(r, 190));
    return { enemies: R.enemies.length, wave: R.wave, state: R.state };
  },
  // 2) garaj vitrini: Titan (altın halka) + taç
  2: async () => {
    const R = window.__R;
    R.openMenu(); R.profile.selected = 'titan'; R.profile.accessory = 'crown'; R.profile.skin = 'royal';
    await R.openShowroom('titan');
    R.showroom.rot = -0.55; R.showroom.vel = 0; R.showroom.elev = 0.4;
    await new Promise(r => setTimeout(r, 500));
    return { sr: R.showroom.active };
  },
  // 3) garaj kart listesi (12 tank görselli)
  3: async () => {
    const R = window.__R;
    R.closeShowroom(); R.profile.selected = 'goldking'; R.profile.accessory = ''; R.profile.skin = 'default'; R.openMenu(); R.openGarage();
    const t = document.getElementById('gt-tanks'); if (t) t.click();
    await new Promise(r => setTimeout(r, 900));
    return { cards: document.querySelectorAll('#cardwrap-garage .card, #cardwrap-garage > *').length };
  },
  // 4) zafer ekranı — süre rekoru
  4: async () => {
    const R = window.__R;
    R.openMenu(); R.startSolo(5);
    for (const e of R.enemies) { e.alive = false; R.scene.remove(e.mesh); } R.enemies = [];
    R.wave = 10; R.score = 18450; R.roundCoins = 812; R.profile.bestRunTime = 0;
    R.soloRunStart = R.clock.elapsedTime - 402;
    R.soloVictory();
    await new Promise(r => setTimeout(r, 2200));
    return { title: document.getElementById('res-title').textContent, sub: document.getElementById('res-sub').textContent.slice(0, 80) };
  },
  // 5) düello — bot seçimi
  5: async () => {
    const R = window.__R;
    R.openMenu(); document.getElementById('btn-duel').click();
    await new Promise(r => setTimeout(r, 600));
    return { panel: document.getElementById('panel-duel').classList.contains('show') };
  },
  // 6) harita seçimi (12 harita, hepsi açık)
  6: async () => {
    const R = window.__R;
    R.openMenu(); document.getElementById('btn-single').click();
    await new Promise(r => setTimeout(r, 600));
    return { panel: document.getElementById('panel-maps').classList.contains('show'), cards: document.querySelectorAll('#cardwrap-maps > *').length };
  },
};

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ executablePath: EXE, headless: true, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'] });
  for (const sz of sizes) for (const lang of langs) {
    const [w, h, dpr] = SIZES[sz];
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: dpr, isMobile: true, hasTouch: true, locale: lang === 'tr' ? 'tr-TR' : 'en-US' });
    const page = await ctx.newPage();
    const errs = []; page.on('pageerror', e => errs.push(String(e.message).slice(0, 120)));
    await page.goto('http://localhost:8734/?ss=1', { waitUntil: 'load' });
    const s = await page.evaluate(SETUP, lang);
    console.log(sz, lang, 'setup', JSON.stringify(s));
    for (const n of Object.keys(SHOTS)) {
      const r = await page.evaluate(SHOTS[n]);
      await wait(150);
      const file = path.join(OUT, `${sz}-${lang}-${n}.png`);
      await page.screenshot({ path: file, type: 'png' });
      console.log(' ', n, JSON.stringify(r), file);
    }
    if (errs.length) console.log('  pageerrors:', errs);
    await ctx.close();
  }
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
