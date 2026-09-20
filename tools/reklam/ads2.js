// Reklam varyantları 2026 (araştırma: tools/reklam/BRIEF.md) — window.__C "MEGA SEKME + Ejderha Seti" (15s/30s), window.__D "1 CAN KALDI" (~14s)
// Tasarım kuralları: kanca 0-3 sn (tatmin anı / başarısızlık), ilk 5 sn'de 2+ kesme, altyazı = büyük metin (sessiz izlenir),
// marka etiketi sol üstte sürekli, CTA alt %20'nin üstünde, metinler y∈[430,1490] (Stories güvenli alanı + 1:1 kırpma).
(() => {
  const R = window.__R, S = window.__S, W = S.W, H = S.H, cx = S.cx;
  S.tag = () => S.pill('TANK SAVAŞI 3D', 300, 470, 40, { bg: 'rgba(8,12,8,0.7)', col: '#ffd76a', border: 'rgba(255,214,74,0.6)' });
  S.brand2 = (t, t0 = 0, sub = 'ÜCRETSİZ OYNA') => {
    const p = S.clamp01((t - t0) / 0.4); if (p <= 0) return;
    S.bottomShade(900, 0.75);
    cx.save(); cx.globalAlpha = p;
    S.text('TANK SAVAŞI 3D', W / 2, 1300, 84, { grad: S.GOLD, stroke: 13 });
    const s = 1 + Math.sin(t * 5) * 0.03; S.scaled(W / 2, 1430, s, () => S.pill(sub, 0, 0, 52, { bg: '#ff9a1e', col: '#1a1000', border: '#ffd88a' }));
    cx.restore();
  };
  S.hearts = (hp, max, t, y = 560) => {
    const size = 60, gap = 14, x0 = W / 2 - ((max * size + (max - 1) * gap) / 2) + size / 2;
    for (let i = 0; i < max; i++) { const on = i < hp, pulse = on && hp === 1 ? 1 + Math.sin(t * 14) * 0.14 : 1; cx.save(); cx.globalAlpha = on ? 1 : 0.28; S.scaled(x0 + i * (size + gap), y, pulse, () => S.text(on ? '❤️' : '🖤', 0, 0, size, { stroke: 0 })); cx.restore(); }
  };
  S.chestRitual = (t, t0, opt) => { // sallan → nadirlik patlaması → kart (desen/thumb) → opt.until'de küçülür
    const p = t - t0; if (p < 0) return;
    S.vignette(0.55);
    if (p < 0.75) { const sh = Math.sin(p * 40) * 0.2 * (1 - p / 0.75); cx.save(); cx.translate(W / 2, 900); cx.rotate(sh); cx.scale(1 + p * 0.25, 1 + p * 0.25); S.text(opt.icon || '🎁', 0, 0, 220, { stroke: 0 }); cx.restore(); }
    else if (p < 1.05) { const q = (p - 0.75) / 0.3; cx.save(); const g = cx.createRadialGradient(W / 2, 900, 10, W / 2, 900, 900 * q + 200); g.addColorStop(0, opt.col || '#ffcc33'); g.addColorStop(1, 'rgba(0,0,0,0)'); cx.globalAlpha = 1 - q; cx.fillStyle = g; cx.fillRect(0, 0, W, H); cx.restore(); }
    if (p >= 0.95) S.card(t, t0 + 0.95, opt.until || 99, () => {
      cx.save(); cx.shadowColor = 'rgba(0,0,0,0.6)'; cx.shadowBlur = 30; cx.fillStyle = 'rgba(20,28,16,0.94)'; S.rr(-400, 640, 800, 560, 28); cx.fill(); cx.shadowColor = 'transparent';
      cx.lineWidth = 6; cx.strokeStyle = opt.col || '#ffcc33'; S.rr(-400, 640, 800, 560, 28); cx.stroke(); cx.restore(); // S.card içinde x merkeze göre (0 = W/2)
      if (opt.canvas) { cx.save(); S.rr(-350, 700, 700, 220, 18); cx.clip(); cx.fillStyle = cx.createPattern(opt.canvas, 'repeat'); cx.fillRect(-350, 700, 700, 220); cx.restore(); }
      else if (opt.thumb) { cx.save(); S.rr(-350, 700, 700, 220, 18); cx.clip(); cx.fillStyle = '#10151c'; cx.fillRect(-350, 700, 700, 220); cx.drawImage(opt.thumb, -176, 700, 352, 220); cx.restore(); }
      S.text(opt.name, 0, 1000, 70, { grad: S.GOLD, stroke: 12 });
      S.pill(opt.rar || '✨ EFSANEVİ', 0, 1105, 46, { bg: 'rgba(40,30,8,0.9)', col: opt.col || '#ffcc33', border: opt.col || '#ffcc33' });
    }, 920);
  };
  S.putAt = (type, x, z, opt = {}) => { // mutlak konumlu düşman
    R.spawnEnemies([type]); const e = R.enemies[R.enemies.length - 1]; const P = R.player;
    e.x = x; e.z = z; e.a = Math.atan2(P.x - x, P.z - z); e.mesh.position.set(x, 0, z); e.mesh.rotation.y = e.a;
    e.cool = opt.cool != null ? opt.cool : 1e9; if (opt.hp) { e.hp = opt.hp; e.maxHp = opt.hp; } if (opt.speed != null) e.speed = opt.speed; e.keep = opt.keep != null ? opt.keep : 99;
    return e;
  };
  S.dragonProfile = () => { const p = R.profile; for (const s of ['dragon']) if (!p.skins.includes(s)) p.skins.push(s); if (!p.accessories.includes('dragonwings')) p.accessories.push('dragonwings'); if (!p.trails.includes('dragonfire')) p.trails.push('dragonfire'); if (!p.explosions.includes('dragonblast')) p.explosions.push('dragonblast'); p.selected = 'goldking'; p.skin = 'dragon'; p.accessory = 'dragonwings'; p.accessory2 = ''; p.trail = 'dragonfire'; p.explosion = 'dragonblast'; p.track = 'tr_gold'; if (!p.tracks.includes('tr_gold')) p.tracks.push('tr_gold'); };
  // MEGA SEKME: sonda mermi ile 2 sekmelik yol bul (yön 15° adımlarla döner), düşman iniş noktasına konur
  S.probeBounce = async (tries = 24) => {
    const P = R.player;
    for (let k = 0; k < tries; k++) {
      const a = P.a + k * (Math.PI / 12); P.a = a; P.mesh.rotation.y = a; if (R.playerTurret) R.playerTurret.rotation.y = 0;
      const n0 = R.bullets.length; R.fire(P); const b = R.bullets[R.bullets.length - 1];
      if (!b || R.bullets.length === n0) continue;
      let hit = null, path = 0;
      for (let i = 0; i < 160; i++) { await S.wait(16); if (!R.bullets.includes(b)) break; if (b.b0 - b.bounces >= 2) { hit = { x: b.mesh.position.x, z: b.mesh.position.z, vx: b.vx, vz: b.vz }; break; } }
      const idx = R.bullets.indexOf(b); if (idx >= 0) { R.scene.remove(b.mesh); R.bullets.splice(idx, 1); }
      if (hit) { const sp = Math.hypot(hit.vx, hit.vz) || 1, d = 3.2, ex = hit.x + hit.vx / sp * d, ez = hit.z + hit.vz / sp * d; const dp = Math.hypot(ex - P.x, ez - P.z); const fx = R.fwdX(a), fz = R.fwdZ(a), perp = Math.abs((ex - P.x) * fz - (ez - P.z) * fx); const ahead = (ex - P.x) * fx + (ez - P.z) * fz; if (dp > 4 && dp < 16 && (perp > 2.5 || ahead < 0) && R.losClear(hit.x, hit.z, ex, ez)) return { a, ex, ez, dp, perp: +perp.toFixed(2), ahead: +ahead.toFixed(2) }; } // iniş noktası ilk ışın üzerinde olmasın (doğrudan vuruş = sekme yok)
    }
    return null;
  };

  // =====================================================================
  // VARYANT C — "MEGA SEKME + EJDERHA SETİ"
  // =====================================================================
  const C = window.__C = {};
  C.prep = async () => { // kayıt dışı hazırlık: sahne + sekme yolu + düşman
    S.dragonProfile(); S.setStage(0); S.godMode();
    R.settings.autoFire = false; R.touchCtl.fire = false; R.touchCtl.move = 0;
    const r = await S.probeBounce(); C.hit = r;
    if (r) { R.player.a = r.a; R.player.mesh.rotation.y = r.a; C.target = S.putAt('heavy', r.ex, r.ez, { hp: 1, speed: 0 }); }
    return r;
  };
  C.s1 = () => S.record('C1.webm', async () => { // 0-3.4 KANCA: 3 sekme 1 vuruş (gerçek MEGA SEKME → oyun-içi slow-mo)
    S.pre = () => { // kuşbakışı çerçeve: oyuncu + iniş noktası + sekme duvarları aynı karede (bilardo hissi)
      if (R.showroom.active) return; const Cm = R.camera, P = R.player, h = C.hit || { ex: P.x, ez: P.z };
      const sp = Cm.position.clone(), sq = Cm.quaternion.clone(); Cm.fov = 60; Cm.updateProjectionMatrix();
      const mx = (P.x + h.ex) / 2, mz = (P.z + h.ez) / 2; Cm.position.set(mx, 26, mz + 9); Cm.lookAt(mx, 0, mz - 1);
      S.post = () => { Cm.position.copy(sp); Cm.quaternion.copy(sq); };
    };
    let hitT = 0;
    S.overlays.push((c, t) => {
      S.tag(); S.hud(3, 420, t);
      S.card(t, 0.1, 99, () => { S.text('3 SEKME.', 0, 1150, 118, { grad: S.GOLD, stroke: 18 }); S.text('1 VURUŞ.', 0, 1280, 118, { col: '#fff', stroke: 18 }); }, 1215);
      if (hitT) { S.flash(t, hitT, 0.14); S.card(t, hitT + 0.05, 99, () => S.pill('MEGA SEKME! 🤯', 0, 1440, 64, { bg: '#ff9a1e', col: '#1a1000', border: '#ffd88a' }), 1440); }
    });
    await S.wait(350); R.fire(R.player);
    await S.until(() => C.target && !C.target.alive, 2600); hitT = S.shotT; R.slowmoT = Math.max(R.slowmoT || 0, 0.9);
    await S.wait(1350);
  });
  C.s2 = (cutsN = 2, name = 'C2.webm') => S.record(name, async () => { // montaj: harita kesmeleri + ejderha ateşi
    const all = [{ map: 2, wave: 4, cap: 'DALGA 4 · ÇÖL' }, { map: 6, wave: 7, cap: 'DALGA 7 · UZAY' }, { map: 4, wave: 9, cap: 'DALGA 9 · GECE' }];
    const cuts = all.slice(0, cutsN); let ci = 0, cutStart = 0;
    S.pre = () => { if (!R.showroom.active) S.camTight(48, 1.5, 7); };
    S.overlays.push((c, t) => {
      const cu = cuts[ci], lt = t - cutStart; S.tag(); S.hud(cu.wave, 380 + cu.wave * 90 + Math.floor(lt * 30), t);
      S.card(t, cutStart + 0.05, cutStart + 1.3, () => S.pill(cu.cap, 0, 1180, 64, { bg: 'rgba(30,90,40,0.9)', col: '#dfffc8', border: '#8aff9a' }), 1180);
      S.flash(t, cutStart, 0.1);
    });
    R.settings.autoFire = true;
    for (ci = 0; ci < cuts.length; ci++) {
      cutStart = S.shotT; S.setStage(cuts[ci].map); S.godMode(); R.settings.autoFire = true; R.touchCtl.move = 0.4;
      const stop = S.parade(4, 330, { dist: 10, types: ['normal', 'scout', 'heavy', 'normal'] });
      await S.wait(2050); stop();
    }
  });
  C.s3 = () => S.record('C3.webm', async () => { // boss: telegraf → savunmasız → düşer
    S.setStage(5); S.godMode(); R.settings.autoFire = true;
    S.pre = () => { if (!R.showroom.active) S.camTight(46, 2.0, 7); };
    const boss = S.putEnemy('boss', 13, 0, { hp: 6, cool: 1.2, keep: 10 }); boss.bossName = 'GENERAL KARA';
    let dead = 0, deathT = 0;
    S.overlays.push((c, t) => {
      S.tag(); S.hud(10, 1180 + Math.floor(t * 20), t);
      if (!dead) S.bossBar('GENERAL KARA', boss.hp / boss.maxHp, t, 600);
      S.card(t, 0.05, 1.1, () => S.pill('💀 BOSS DALGASI', 0, 1180, 66, { bg: 'rgba(120,20,20,0.92)', col: '#ffd9d0', border: '#ff7a5a' }), 1180);
      if (dead) { S.flash(t, deathT, 0.12); S.card(t, deathT + 0.05, 99, () => { S.text('GENERAL DÜŞTÜ!', 0, 1180, 96, { grad: S.GOLD, stroke: 16 }); S.pill('+🪙80  +🎰1', 0, 1300, 56, { bg: 'rgba(8,12,8,0.85)', col: '#ffd76a', border: '#ffd64a' }); }, 1240); }
    });
    R.touchCtl.move = 0.25;
    await S.until(() => !boss.alive, 6000);
    dead = 1; deathT = S.shotT; R.touchCtl.move = 0; R.slowmoT = 1.0; R.shake = 2.0;
    for (let i = 0; i < 4; i++) { R.explode(boss.x + (Math.random() - 0.5) * 3, 1 + Math.random() * 2, boss.z + (Math.random() - 0.5) * 3, true, R.playerExplPal); R.sfxBoom(true); await S.wait(140); }
    await S.wait(1200);
  });
  C.s4 = (name = 'C4.webm', dur = 3700) => S.record(name, async () => { // sandık ritüeli → vitrin ejderha → CTA (15 sn kapanışı)
    await S.openSR('goldking', 'dragonwings', 'dragon'); R.profile.track = 'tr_gold'; R.buildShowroomTank();
    S.showroomDrive(t => 0.5 + t * 0.55, 0.78, 0.3, 0);
    const canv = R.camoCanvas('dragon');
    S.overlays.push((c, t) => {
      S.tag();
      S.chestRitual(t, 0.05, { icon: '🐉', name: 'EJDERHA PULU', col: '#ff9a3a', canvas: canv, until: 2.25 });
      if (t > 2.4) S.card(t, 2.4, 99, () => S.pill('EJDERHA SETİNİ TAMAMLA 🐉', 0, 560, 54, { bg: 'rgba(60,16,8,0.9)', col: '#ffd0a0', border: '#ff9a3a' }), 560);
      S.brand2(t, 2.6, 'ÜCRETSİZ OYNA');
    });
    R.sfxUI(); await S.wait(750); R.sfxPower(); await S.wait(dur - 750);
  });
  C.s5 = () => S.record('C5.webm', async () => { // 30 sn: garaj ızgarası — 15 tank thumb'ı sırayla belirir
    await S.openSR('titan', 'crown', 'gold'); S.showroomDrive(t => 2.0 + t * 0.4, 0.9, 0.35, 0);
    const ids = R.TANKS.map(x => x.id).filter(id => S.thumbs[id]).slice(0, 15);
    S.overlays.push((c, t) => {
      S.tag(); S.vignette(0.7);
      const cw = 240, ch = 150, gx = 16, gy = 14, cols = 4, y0 = 560; // 4x4 (son satır 3'lü, ortalı); etiketle çakışmaz, metinler y<1490
      ids.forEach((id, i) => { const t0 = 0.1 + i * 0.09, s = S.popScale(t, t0); if (s <= 0) return; const row = Math.floor(i / cols), n = Math.min(cols, ids.length - row * cols), x0 = (W - (n * cw + (n - 1) * gx)) / 2, x = x0 + (i % cols) * (cw + gx), y = y0 + row * (ch + gy); S.scaled(x + cw / 2, y + ch / 2, s, () => { cx.save(); cx.fillStyle = 'rgba(20,28,16,0.9)'; S.rr(-cw / 2, -ch / 2, cw, ch, 16); cx.fill(); cx.drawImage(S.thumbs[id], -cw / 2, -ch / 2, cw, ch); cx.restore(); }); });
      S.card(t, 1.6, 99, () => { S.text('15 TANK · 48 KAPLAMA', 0, 1300, 66, { grad: S.GOLD, stroke: 11 }); S.text('SANDIKLAR · AKSESUARLAR', 0, 1385, 54, { col: '#fff', stroke: 9 }); }, 1340);
    });
    await S.wait(3200);
  });
  C.s6 = () => S.record('C6.webm', async () => { // 30 sn: iki açılış — pul + kanat
    await S.openSR('goldking', 'dragonwings', 'dragon'); R.profile.track = 'tr_gold'; R.buildShowroomTank(); S.showroomDrive(t => 0.4 + t * 0.4, 0.78, 0.3, 0);
    const canv = R.camoCanvas('dragon'); const th = new Image(); th.src = R.renderAccThumb(R.accById('dragonwings')) || ''; await new Promise(r => { th.onload = r; th.onerror = r; });
    S.overlays.push((c, t) => {
      S.tag();
      S.chestRitual(t, 0.05, { icon: '🐉', name: 'EJDERHA PULU', col: '#ff9a3a', canvas: canv, until: 2.0 });
      if (t > 2.25) S.chestRitual(t, 2.25, { icon: '🐉', name: 'EJDERHA KANADI', col: '#ff9a3a', thumb: th.width ? th : null, until: 4.2 });
    });
    R.sfxUI(); await S.wait(750); R.sfxPower(); await S.wait(1500); R.sfxUI(); await S.wait(750); R.sfxPower(); await S.wait(1600);
  });
  C.s7 = () => S.record('C7.webm', async () => { // 30 sn kapanış: set takılı vitrin + unvan + CTA
    await S.openSR('goldking', 'dragonwings', 'dragon'); R.profile.track = 'tr_gold'; R.buildShowroomTank(); S.showroomDrive(t => 0.5 + t * 0.5, 0.78, 0.3, 0);
    S.overlays.push((c, t) => { // etiket yok: başlık üstte, marka brand2'de büyük
      S.card(t, 0.1, 99, () => { S.text('SET TAMAMLANDI', 0, 520, 78, { grad: S.GOLD, stroke: 12 }); S.pill('🏷️ EJDERHA EFENDİSİ', 0, 620, 54, { bg: 'rgba(60,16,8,0.9)', col: '#ffd0a0', border: '#ff9a3a' }); }, 570);
      S.confetti(t, 0.1, 70);
      S.brand2(t, 1.0, 'ÜCRETSİZ OYNA · ŞİMDİ');
    });
    R.sfxPower(); await S.wait(3800);
  });

  // =====================================================================
  // VARYANT D — "1 CAN KALDI" (başarısızlık kancası → geri dönüş)
  // =====================================================================
  const D = window.__D = {};
  D.s1 = () => S.record('D1.webm', async () => { // 0-2.9: 1 can, 4 düşman ateş ediyor
    S.dragonProfile(); S.setStage(5); S.godMode(); R.settings.autoFire = false; R.touchCtl.fire = false;
    S.pre = () => { if (!R.showroom.active) S.camTight(50, 1.2, 7); };
    for (const [d, l] of [[9, -3], [11, 3], [13, -1], [12, 5]]) S.putEnemy('normal', d, l, { cool: 0.9, speed: 1.5 });
    S.overlays.push((c, t) => {
      S.tag(); S.hud(8, 1040, t); S.hearts(1, 6, t, 600);
      if (t > 0.3 && Math.sin(t * 9) > 0) { cx.save(); cx.fillStyle = 'rgba(255,40,20,0.14)'; cx.fillRect(0, 0, W, H); cx.restore(); }
      S.card(t, 0.15, 99, () => { S.text('1 CAN KALDI…', 0, 1180, 112, { col: '#ff5a4a', stroke: 18 }); S.text('4 DÜŞMAN. HİÇ ŞANS YOK?', 0, 1300, 60, { col: '#fff', stroke: 10 }); }, 1240);
    });
    R.touchCtl.move = -0.2; await S.wait(1400); R.shake = 1.2; await S.wait(1500);
  });
  D.s2 = () => S.record('D2.webm', async () => { // 2.9-5.4: NEREDEYSE! → DEVAM ET → tam can
    S.pre = () => { if (!R.showroom.active) S.camTight(50, 1.2, 7); };
    let hp = 1;
    S.overlays.push((c, t) => {
      S.tag(); S.hud(8, 1040, t); S.hearts(hp, 6, t, 600);
      if (t < 1.25) { S.vignette(0.6); S.card(t, 0.05, 1.25, () => { S.text('NEREDEYSE!', 0, 1000, 118, { grad: S.GOLD, stroke: 18 }); S.pill('📺 DEVAM ET', 0, 1150, 66, { bg: '#ff9a1e', col: '#1a1000', border: '#ffd88a' }); }, 1075); }
      S.flash(t, 1.25, 0.18);
      if (t > 1.3) S.card(t, 1.3, 99, () => S.text('TAM CAN. GERİ DÖN.', 0, 1180, 88, { col: '#7dff9b', stroke: 14 }), 1180);
    });
    await S.wait(1250); R.sfxPower(); S.clearNonSentinel();
    for (let i = 2; i <= 6; i++) { hp = i; await S.wait(110); }
    await S.wait(900);
  });
  D.s3 = () => S.record('D3.webm', async () => { // 5.4-9.6: geri dönüş serisi — her ~0.5 sn ateş + garantili yok etme (sayaç x1..x7)
    S.pre = () => { if (!R.showroom.active) S.camTight(48, 1.5, 7); };
    R.settings.autoFire = false; R.touchCtl.move = 0; let kills = 0, kT = 0;
    S.overlays.push((c, t) => {
      S.tag(); S.hud(8, 1040 + kills * 35, t); S.hearts(6, 6, t, 600);
      if (kills >= 1) S.card(t, kT, 99, () => S.pill(kills >= 2 ? `GERİ DÖNÜŞ · x${kills} SERİ` : 'GERİ DÖNÜŞ!', 0, 1180, 64, { bg: 'rgba(30,90,40,0.92)', col: '#dfffc8', border: '#8aff9a' }), 1180);
    });
    const types = ['normal', 'scout', 'normal', 'heavy', 'scout', 'normal', 'normal'], lat = [0, -2.4, 2.2, -1.2, 1.9, -3, 2.8];
    const q = types.map((ty, i) => S.putEnemy(ty, 9 + (i % 3) * 2.4, lat[i], { speed: 2.2, keep: 99 }));
    for (let i = 0; i < q.length; i++) {
      await S.wait(i ? 480 : 380); const e = q[i]; if (!e.alive) continue;
      R.player.a = Math.atan2(R.player.x - e.x, R.player.z - e.z); R.player.mesh.rotation.y = R.player.a; // namlu hedefe (fwd = (-sin a, -cos a))
      R.fire(R.player); await S.wait(130); R.damageEnemy(e, 99); kills++; if (kills === 1) kT = S.shotT;
    }
    await S.wait(650);
  });
  D.s4 = () => S.record('D4.webm', async () => { // 9.6-13.4: vitrin + CTA
    await S.openSR('goldking', 'dragonwings', 'dragon'); R.profile.track = 'tr_gold'; R.buildShowroomTank(); S.showroomDrive(t => 0.5 + t * 0.55, 0.78, 0.3, 0);
    S.overlays.push((c, t) => { // etiket yok (başlıkla çakışır)
      S.card(t, 0.1, 99, () => { S.text('PES ETME.', 0, 520, 96, { grad: S.GOLD, stroke: 15 }); S.text('DEVAM ET.', 0, 640, 96, { col: '#fff', stroke: 15 }); }, 580);
      S.brand2(t, 0.9, 'ÜCRETSİZ OYNA');
    });
    await S.wait(3700);
  });
  return 'ads2 ok';
})();
