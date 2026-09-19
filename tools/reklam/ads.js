// İki reklam varyantının koreografisi: window.__A (speedrun) ve window.__B (koleksiyon)
(() => {
  const R = window.__R, S = window.__S, W = S.W, H = S.H;
  const cx = S.cx;

  // ---- ortak sahne kurulumu ----
  S.setStage = (mapIdx, tankId) => {
    if (tankId) { R.profile.selected = tankId; R.profile.skin = 'default'; R.profile.accessory = ''; }
    if (R.showroom.active) R.closeShowroom();
    R.startSolo(mapIdx);
    S.clearNonSentinel(); S.sentinel(); S.playerCenter();
    const h = S.bestHeading(24); R.player.a = h.a; S.godMode();
    R.touchCtl.move = 0; R.touchCtl.turn = 0; R.touchCtl.fire = false;
    return h;
  };
  // geçit: her `every` sn'de namlu önüne düşman (gerçek isabetle ölür)
  S.parade = (n, every = 450, opt = {}) => {
    let i = 0; const lat = [0, -3.5, 3, -1.5, 2.5, -4, 4, 1];
    const iv = setInterval(() => {
      if (i >= n) return clearInterval(iv);
      const type = opt.types ? opt.types[i % opt.types.length] : (i % 3 === 1 ? 'scout' : 'normal');
      S.putEnemy(type, (opt.dist || 15) + (i % 2) * 3, lat[i % lat.length], { speed: 3 });
      i++;
    }, every);
    return () => clearInterval(iv);
  };
  // showroom sürücüsü: rot/radius/elev her karede bizden
  S.showroomDrive = (rotFn, radiusMul = 0.78, elev = 0.34, yShift = 0) => {
    S.pre = () => {
      if (!R.showroom.active) return;
      const sh = R.showroom;
      sh.rot = rotFn(S.shotT); R.showroomTurn.rotation.y = sh.rot;
      const mesh = R.showroomTankMesh;
      if (mesh && !sh.__r0) { sh.__r0 = sh.radius; }
      sh.radius = (sh.__r0 || sh.radius) * radiusMul; sh.elev = elev;
      R.frameShowroomCam(); R.showroomCam.position.y += yShift;
      R.showroomCam.lookAt(0, sh.centerY - sh.radius * 0.06 + yShift, 0);
    };
  };
  S.openSR = async (tankId, accId = '', skin = 'default') => {
    R.profile.selected = tankId; R.profile.skin = skin; R.profile.accessory = accId;
    if (R.showroom.active) { R.showroom.tankId = tankId; R.showroom.accId = accId; R.showroom.mode = 'tank'; if (R.tankById(tankId).model) await R.ensureModel(R.tankById(tankId).model); R.showroom.__r0 = 0; R.buildShowroomTank(); }
    else { await R.openShowroom(tankId); R.showroom.accId = accId; R.showroom.__r0 = 0; R.buildShowroomTank(); }
  };
  S.flash = (t, t0, dur = 0.12) => { const p = (t - t0) / dur; if (p < 0 || p > 1) return; cx.fillStyle = `rgba(255,255,255,${(1 - p) * 0.85})`; cx.fillRect(0, 0, W, H); };
  // kart: pop ile gelir, out anında küçülüp kaybolur
  S.card = (t, tIn, tOut, fn, py = H / 2) => {
    if (t < tIn || t > tOut + 0.25) return;
    let s = S.popScale(t, tIn), a = 1;
    if (t > tOut) { const p = (t - tOut) / 0.25; s = 1 - p * 0.3; a = 1 - p; }
    cx.save(); cx.globalAlpha = a; S.scaled(W / 2, py, s, () => { cx.translate(0, -py); fn(); }); cx.restore();
  };
  const TR = { titan: 'TİTAN', mamut: 'MAMUT', hover: 'HOVER TANK', arty: 'OBÜS', goldking: 'ALTIN KRAL', heavy: 'AĞIR TANK', twin: 'İKİZ NAMLU', phantom: 'HAYALET' };
  const SKIN_TR = { gold: 'ALTIN', chrome: 'KROM', neon: 'NEON', inferno: 'ATEŞ', plasma: 'PLAZMA', royal: 'KRALİYET', frost: 'AYAZ', toxic: 'ZEHİR', void: 'BOŞLUK', ember: 'KOR', obsidian: 'OBSİDYEN', rosegold: 'ROZ ALTIN' };
  const RAR = { c: ['YAYGIN', '#c8d0d8'], r: ['NADİR', '#5ad0ff'], e: ['EFSANEVİ', '#ffcc33'] };

  // =====================================================================
  // VARYANT A — SPEEDRUN "6:42'de bitirdim, sen?"
  // =====================================================================
  const A = window.__A = {};
  // S1: hook — sayaç başlar, ilk düşmanlar patlar
  A.s1 = () => S.record('A1.webm', async () => {
    S.setStage(5, 'goldking');
    S.pre = () => { if (!R.showroom.active) S.camTight(48, 1.5, 7); };
    S.overlays.push((c, t) => {
      S.hud(1, Math.floor(t * 28), t);
      S.drawTimer(Math.min(21, t * 8.5), t, { pulse: t < 0.6 });
      S.card(t, 0.15, 2.05, () => { S.text('10 DALGA.', 0, 1000, 118, { grad: S.GOLD, stroke: 18 }); S.text('NE KADAR HIZLI?', 0, 1135, 96, { col: '#fff', stroke: 14 }); }, 1070);
    });
    R.touchCtl.move = 0.35;
    const stop = S.parade(5, 420, { dist: 10 });
    await S.wait(2600); stop();
  });
  // S2: montaj — 3 harita, dalga 3/6/8, sayaç uçuyor
  A.s2 = () => S.record('A2.webm', async () => {
    const cuts = [{ map: 2, wave: 3, t0: 58, t1: 100 }, { map: 6, wave: 6, t0: 150, t1: 200 }, { map: 3, wave: 8, t0: 245, t1: 290 }];
    let ci = 0, cutStart = 0;
    S.pre = () => { if (!R.showroom.active) S.camTight(48, 1.5, 7); };
    S.overlays.push((c, t) => {
      const cu = cuts[ci]; const lt = t - cutStart;
      S.hud(cu.wave, 300 + cu.wave * 90 + Math.floor(lt * 30), t);
      S.drawTimer(cu.t0 + Math.min(1, lt / 1.05) * (cu.t1 - cu.t0), t);
      S.card(t, cutStart + 0.05, cutStart + 0.8, () => { S.pill('DALGA ' + cu.wave, 0, 1020, 74, { bg: 'rgba(30,90,40,0.9)', col: '#dfffc8', border: '#8aff9a' }); }, 1020);
      S.flash(t, cutStart, 0.1);
    });
    for (ci = 0; ci < cuts.length; ci++) {
      cutStart = S.shotT;
      S.setStage(cuts[ci].map, 'goldking'); R.touchCtl.move = 0.4;
      const stop = S.parade(4, 330, { dist: 10, types: ['normal', 'scout', 'heavy', 'normal'] });
      await S.wait(1050); stop();
    }
  });
  // S3: boss dövüşü → ölüm → sayaç 6:42'de donar
  A.s3 = () => S.record('A3.webm', async () => {
    S.setStage(5, 'goldking');
    S.pre = () => { if (!R.showroom.active) S.camTight(46, 2.0, 7); };
    const boss = S.putEnemy('boss', 13, 0, { hp: 7, cool: 1.2, keep: 10 });
    boss.bossName = 'GENERAL KARA';
    let dead = 0, deathT = 0;
    S.overlays.push((c, t) => {
      S.hud(10, 1180 + Math.floor(t * 20), t);
      const secs = dead ? 402 : Math.min(401, 358 + t * 13);
      S.drawTimer(secs, t, dead ? { col: '#ffd24a', border: '#fff', pulse: true } : {});
      if (!dead) S.bossBar('GENERAL KARA', boss.hp / boss.maxHp, t, 330);
      S.card(t, 0.05, 0.9, () => S.pill('💀 BOSS DALGASI', 0, 1020, 70, { bg: 'rgba(120,20,20,0.92)', col: '#ffd9d0', border: '#ff7a5a' }), 1020);
      if (dead) S.card(t, deathT + 0.05, 99, () => { S.text('GENERAL DÜŞTÜ!', 0, 1040, 104, { grad: S.GOLD, stroke: 16 }); }, 1040);
    });
    R.touchCtl.move = 0.25;
    await S.until(() => !boss.alive, 7000);
    dead = 1; deathT = S.shotT; R.touchCtl.move = 0;
    R.slowmoT = 1.1; R.shake = 2.2;
    for (let i = 0; i < 4; i++) { R.explode(boss.x + (Math.random() - 0.5) * 3, 1 + Math.random() * 2, boss.z + (Math.random() - 0.5) * 3, true); R.sfxBoom(true); await S.wait(140); }
    await S.wait(1300);
  });
  // S4: zafer — konfeti + rekor kartı (arena devam eder)
  A.s4 = () => S.record('A4.webm', async () => {
    S.pre = () => { if (!R.showroom.active) S.camTight(40, 1.5, 4); };
    R.stingVictory();
    S.overlays.push((c, t) => {
      S.vignette(0.5);
      S.confetti(t, 0.05, 110);
      S.card(t, 0.05, 99, () => { S.text('🏆 ZAFER!', 0, 520, 140, { grad: S.GOLD, stroke: 20 }); }, 520);
      S.card(t, 0.45, 99, () => { S.pill('⏱ 6:42', 0, 720, 120, { bg: 'rgba(8,12,8,0.85)', col: '#fff', border: '#ffd64a' }); }, 720);
      S.card(t, 0.85, 99, () => { S.pill('YENİ REKOR!', 0, 900, 70, { bg: '#ff9a1e', col: '#1a1000', border: '#ffd88a' }); }, 900);
      S.brand(t, 1.3);
    });
    await S.wait(2600);
  });
  // S5: CTA — showroom Titan
  A.s5 = () => S.record('A5.webm', async () => {
    await S.openSR('titan', 'crown', 'gold');
    S.showroomDrive(t => -0.6 + t * 0.9, 0.8, 0.3, 0);
    S.overlays.push((c, t) => {
      S.topShade(700, 0.7);
      S.card(t, 0.05, 99, () => { S.text("6:42'DE BİTİRDİM.", 0, 260, 96, { grad: S.GOLD, stroke: 15 }); }, 260);
      S.card(t, 0.5, 99, () => { S.text('SEN KAÇTA', 0, 400, 92, { col: '#fff', stroke: 14 }); S.text('BİTİRİRSİN?', 0, 515, 92, { col: '#fff', stroke: 14 }); }, 460);
      S.brand(t, 0.9, 'ÜCRETSİZ OYNA · ŞİMDİ DENE');
    });
    await S.wait(2700);
  });

  // =====================================================================
  // VARYANT B — KOLEKSİYON "Hepsini topla"
  // =====================================================================
  const B = window.__B = {};
  // S1: hook — Altın Kral aksiyonu + "12 TANK. HANGİSİ SENİN?"
  B.s1 = () => S.record('B1.webm', async () => {
    S.setStage(2, 'goldking');
    S.pre = () => { if (!R.showroom.active) S.camTight(48, 1.5, 7); };
    S.overlays.push((c, t) => {
      S.hud(4, 640 + Math.floor(t * 30), t);
      S.card(t, 0.15, 2.0, () => { S.text('12 TANK.', 0, 1000, 124, { grad: S.GOLD, stroke: 18 }); S.text('HANGİSİ SENİN?', 0, 1135, 92, { col: '#fff', stroke: 14 }); }, 1070);
    });
    R.touchCtl.move = 0.35;
    const stop = S.parade(5, 400, { dist: 10 });
    await S.wait(2400); stop();
  });
  // S2: vitrin kesmeleri — 4 tank
  B.s2 = () => S.record('B2.webm', async () => {
    const list = [['titan', 'e', '💎 150'], ['mamut', 'e', '🪙 9500'], ['hover', 'e', '💎 75'], ['arty', 'r', '🪙 7000']];
    let ci = 0, cutStart = 0;
    S.overlays.push((c, t) => {
      const [id, r, price] = list[ci]; const lt = t - cutStart;
      S.topShade(500, 0.65); S.bottomShade(700, 0.8);
      S.text('12 TANK', W / 2, 200, 110, { grad: S.GOLD, stroke: 16 });
      S.card(t, cutStart + 0.05, 99, () => {
        S.text(TR[id] || id.toUpperCase(), 0, H - 420, 92, { col: '#fff', stroke: 14 });
        S.pill(RAR[r][0], 0, H - 300, 46, { bg: 'rgba(8,12,8,0.85)', col: RAR[r][1], border: RAR[r][1] });
        S.pill(price, 0, H - 190, 60, { bg: '#ff9a1e', col: '#1a1000', border: '#ffd88a' });
      }, H - 300);
      S.flash(t, cutStart, 0.1);
    });
    for (ci = 0; ci < list.length; ci++) {
      cutStart = S.shotT;
      await S.openSR(list[ci][0]);
      S.showroomDrive(t => -0.8 + (t - cutStart) * 1.6, 0.78, 0.32, 0);
      await S.wait(760);
    }
  });
  // S3: 32 kaplama — hızlı skin döngüsü
  B.s3 = () => S.record('B3.webm', async () => {
    const skins = ['gold', 'chrome', 'neon', 'inferno', 'plasma', 'royal', 'frost', 'toxic', 'void', 'ember'];
    let si = 0, swT = 0;
    await S.openSR('goldking', '', skins[0]);
    S.showroomDrive(t => -0.7 + t * 1.1, 0.8, 0.3, 0);
    S.overlays.push((c, t) => {
      S.topShade(500, 0.65); S.bottomShade(600, 0.8);
      S.text('32 KAPLAMA', W / 2, 200, 110, { grad: S.GOLD, stroke: 16 });
      const sk = R.skinById(skins[si]);
      S.card(t, swT, 99, () => {
        S.text(SKIN_TR[sk.id] || sk.id.toUpperCase(), 0, H - 330, 88, { col: '#' + sk.color.toString(16).padStart(6, '0'), stroke: 14 });
        S.pill(RAR[sk.r][0], 0, H - 210, 46, { bg: 'rgba(8,12,8,0.85)', col: RAR[sk.r][1], border: RAR[sk.r][1] });
      }, H - 270);
    });
    for (si = 0; si < skins.length; si++) {
      swT = S.shotT;
      R.profile.skin = skins[si]; R.buildShowroomTank(); R.sfxCoin();
      await S.wait(280);
    }
  });
  // S4: 10 aksesuar — döngü
  B.s4 = () => S.record('B4.webm', async () => {
    const accs = ['crown', 'wings', 'duck', 'jetpack', 'disco', 'tophat'];
    let ai = 0, swT = 0;
    await S.openSR('goldking', accs[0], 'gold');
    S.showroomDrive(t => -0.9 + t * 1.0, 0.8, 0.34, 0);
    S.overlays.push((c, t) => {
      S.topShade(500, 0.65); S.bottomShade(600, 0.8);
      S.text('10 AKSESUAR', W / 2, 200, 110, { grad: S.GOLD, stroke: 16 });
      const a = R.accById(accs[ai]);
      S.card(t, swT, 99, () => {
        S.text(a.icon + ' ' + a.name.tr.toUpperCase(), 0, H - 330, 84, { col: '#fff', stroke: 13 });
        S.pill(RAR[a.r][0], 0, H - 210, 46, { bg: 'rgba(8,12,8,0.85)', col: RAR[a.r][1], border: RAR[a.r][1] });
      }, H - 270);
    });
    for (ai = 0; ai < accs.length; ai++) {
      swT = S.shotT;
      R.showroom.accId = accs[ai]; R.buildShowroomTank(); R.sfxPower();
      await S.wait(430);
    }
  });
  // S5: koleksiyon ızgarası — 12 kart tek tek açılır, sayaç 12/12
  B.s5 = () => S.record('B5.webm', async () => {
    await S.openSR('titan', 'crown');
    S.showroomDrive(t => -0.6 + t * 0.5, 0.8, 0.3, 0);
    const ids = R.TANKS.map(t => t.id); let shown = 0; const revealT = [];
    S.overlays.push((c, t) => {
      cx.fillStyle = 'rgba(6,10,8,0.78)'; cx.fillRect(0, 0, W, H);
      const cnt = Math.min(shown, 12);
      S.text('KOLEKSİYONUN', W / 2, 190, 84, { col: '#fff', stroke: 13 });
      S.text(cnt + '/12', W / 2, 320, 130, { grad: S.GOLD, stroke: 18 });
      const cw = 300, ch = 250, gx = 30, x0 = (W - (3 * cw + 2 * gx)) / 2, y0 = 470;
      for (let i = 0; i < 12; i++) {
        const col = i % 3, row = Math.floor(i / 3), x = x0 + col * (cw + gx), y = y0 + row * (ch + 24);
        const on = i < shown, s = on ? S.popScale(t, revealT[i]) : 1;
        cx.save(); cx.translate(x + cw / 2, y + ch / 2); cx.scale(s, s);
        cx.fillStyle = on ? 'rgba(28,40,26,0.95)' : 'rgba(20,24,22,0.9)'; S.rr(-cw / 2, -ch / 2, cw, ch, 26); cx.fill();
        cx.lineWidth = 4; cx.strokeStyle = on ? '#ffd24a' : 'rgba(255,255,255,0.15)'; S.rr(-cw / 2, -ch / 2, cw, ch, 26); cx.stroke();
        const im = S.thumbs[ids[i]];
        if (im && on) cx.drawImage(im, -cw / 2 + 20, -ch / 2 + 14, cw - 40, (cw - 40) * 150 / 240);
        else { cx.fillStyle = 'rgba(255,255,255,0.25)'; cx.font = `90px ${'"Russo One"'}`; cx.textAlign = 'center'; cx.textBaseline = 'middle'; cx.fillText('🔒', 0, -20); }
        cx.fillStyle = on ? '#fff' : 'rgba(255,255,255,0.35)'; cx.font = `30px "Russo One"`; cx.textAlign = 'center'; cx.textBaseline = 'middle';
        cx.fillText(on ? R.tankById(ids[i]).name.tr.toUpperCase() : '???', 0, ch / 2 - 34);
        cx.restore();
      }
      if (shown >= 12) S.card(t, revealT[11] + 0.35, 99, () => S.pill('✓ HEPSİ TOPLANDI', 0, H - 190, 60, { bg: '#ff9a1e', col: '#1a1000', border: '#ffd88a' }), H - 190);
    });
    shown = 7; for (let i = 0; i < 7; i++) revealT[i] = -1;
    await S.wait(500);
    for (let i = 7; i < 12; i++) { revealT[i] = S.shotT; shown = i + 1; R.sfxCoin(); await S.wait(260); }
    await S.wait(1000);
  });
  // S6: CTA — "HEPSİNİ TOPLA"
  B.s6 = () => S.record('B6.webm', async () => {
    await S.openSR('titan', 'wings', 'royal');
    S.showroomDrive(t => -0.6 + t * 0.9, 0.8, 0.3, 0);
    S.overlays.push((c, t) => {
      S.topShade(700, 0.7);
      S.card(t, 0.05, 99, () => { S.text('HEPSİNİ', 0, 260, 120, { grad: S.GOLD, stroke: 18 }); S.text('TOPLA!', 0, 400, 120, { grad: S.GOLD, stroke: 18 }); }, 330);
      S.card(t, 0.5, 99, () => { S.text('12 TANK · 32 KAPLAMA · 10 AKSESUAR', 0, 530, 44, { col: '#fff', stroke: 8 }); }, 530);
      S.brand(t, 0.9, 'ÜCRETSİZ OYNA · ŞİMDİ İNDİR');
    });
    await S.wait(2500);
  });
  return 'ads ok';
})();
