// TEK REKLAM VİDEOSU v3 (2026-09-20) — window.__E: parlak haritalar (Kar/Stadyum/Kanyon) + yakın takip kamerası, ~15,5 sn, 132 BPM (bar 1,818 sn)
// Akış: E1 kanca (Kar; gerçek 2 sekmeli vuruş → MEGA SEKME!) → E2 seri (Stadyum, x5) → E3 boss (Kanyon, GENERAL KARA düşer) → E4 ödül (vitrin Ejderha Seti) → E5 kapanış (Stadyum orbit + logo + CTA)
(() => {
  const R = window.__R, S = window.__S, W = S.W, H = S.H, cx = S.cx;
  const E = window.__E = {};
  // takip kamerası: oyuncunun arkasında/üstünde, yumuşatılmış yön (k), ileriye bakar; render sonrası geri alınır (oyun lerp'i bozulmaz)
  S.camIso = (dist, height, fov, ahead, k = 0.22) => {
    S.camA = null;
    S.pre = () => {
      if (R.showroom.active) return;
      const C = R.camera, P = R.player, sp = C.position.clone(), sq = C.quaternion.clone();
      if (S.camA == null) S.camA = P.a; const d = Math.atan2(Math.sin(P.a - S.camA), Math.cos(P.a - S.camA)); S.camA += d * k; const a = S.camA;
      C.fov = fov; C.updateProjectionMatrix();
      C.position.set(P.x - R.fwdX(a) * dist, height, P.z - R.fwdZ(a) * dist);
      C.lookAt(P.x + R.fwdX(a) * ahead, 1.0, P.z + R.fwdZ(a) * ahead);
      S.post = () => { C.position.copy(sp); C.quaternion.copy(sq); };
    };
  };
  // orbit kamera (kapanış): oyuncunun etrafında yavaş dönüş
  S.camOrbit = (radius, height, fov, a0, speed) => {
    S.pre = () => {
      if (R.showroom.active) return;
      const C = R.camera, P = R.player, sp = C.position.clone(), sq = C.quaternion.clone();
      const a = a0 + S.shotT * speed; C.fov = fov; C.updateProjectionMatrix();
      C.position.set(P.x + Math.sin(a) * radius, height, P.z + Math.cos(a) * radius); C.lookAt(P.x, 1.0, P.z);
      S.post = () => { C.position.copy(sp); C.quaternion.copy(sq); };
    };
  };
  // kanca kamerası: oyuncu + iniş noktası aynı karede — orta noktaya oyuncunun arkasından, yüksekten bakar
  S.camPair = (dist = 9, height = 11, fov = 55) => {
    S.pre = () => {
      if (R.showroom.active) return;
      const C = R.camera, P = R.player, h = E.hit || { ex: P.x + R.fwdX(P.a) * 6, ez: P.z + R.fwdZ(P.a) * 6 };
      const sp = C.position.clone(), sq = C.quaternion.clone();
      const mx = (P.x + h.ex) / 2, mz = (P.z + h.ez) / 2; let dx = mx - P.x, dz = mz - P.z; const L = Math.hypot(dx, dz) || 1; dx /= L; dz /= L;
      C.fov = fov; C.updateProjectionMatrix();
      C.position.set(mx - dx * dist, height, mz - dz * dist); C.lookAt(mx, 0.5, mz);
      S.post = () => { C.position.copy(sp); C.quaternion.copy(sq); };
    };
  };
  S.logo = (y = 470) => S.pill('TANK SAVAŞI 3D', 300, y, 44, { bg: 'rgba(8,12,8,0.72)', col: '#ffd76a', border: 'rgba(255,214,74,0.7)' });
  // takip kamerası için sekme yolu: iniş noktası ÖNDE (ahead>3) ve görüş konisinde (perp < 0.9*ahead), ilk ışın üzerinde değil (perp>1)
  S.probeBounce2 = async (tries = 24) => {
    const P = R.player;
    for (let k = 0; k < tries; k++) {
      const a = P.a + k * (Math.PI / 12); P.a = a; P.mesh.rotation.y = a; if (R.playerTurret) R.playerTurret.rotation.y = 0;
      P.cool = 0; const n0 = R.bullets.length; R.fire(P); const b = R.bullets[R.bullets.length - 1];
      if (!b || R.bullets.length === n0) continue;
      let hit = null;
      for (let i = 0; i < 160; i++) { await S.wait(16); if (!R.bullets.includes(b)) break; if (b.b0 - b.bounces >= 2) { hit = { x: b.mesh.position.x, z: b.mesh.position.z, vx: b.vx, vz: b.vz }; break; } }
      const idx = R.bullets.indexOf(b); if (idx >= 0) { R.scene.remove(b.mesh); R.bullets.splice(idx, 1); }
      if (hit) {
        const sp = Math.hypot(hit.vx, hit.vz) || 1, d = 3.2, ex = hit.x + hit.vx / sp * d, ez = hit.z + hit.vz / sp * d;
        const dp = Math.hypot(ex - P.x, ez - P.z), fx = R.fwdX(a), fz = R.fwdZ(a);
        const perp = Math.abs((ex - P.x) * fz - (ez - P.z) * fx), ahead = (ex - P.x) * fx + (ez - P.z) * fz;
        if (dp > 5 && dp < 15 && ahead > 3 && perp > 1.0 && perp < ahead * 0.9 && R.losClear(hit.x, hit.z, ex, ez)) return { a, ex, ez, dp: +dp.toFixed(2), perp: +perp.toFixed(2), ahead: +ahead.toFixed(2), k };
      }
    }
    return null;
  };
  E.prep = async (map = 3) => { // kayıt dışı: harita (varsayılan Kar: iç duvarlar sekme için gerekli) + sekme yolu + hedef
    S.dragonProfile(); S.setStage(map); S.godMode(); R.settings.autoFire = false; R.touchCtl.fire = false; R.touchCtl.move = 0;
    let r = await S.probeBounce2(24); E.mode = r ? 'cone' : 'any'; if (!r) r = await S.probeBounce(24); E.hit = r;
    if (r) { R.player.a = r.a; R.player.mesh.rotation.y = r.a; E.target = S.putAt('heavy', r.ex, r.ez, { hp: 1, speed: 0 }); }
    return r;
  };
  E.s1 = () => S.record('E1.webm', async () => { // 0-3.5 KANCA
    S.camPair(9, 11, 55); let hitT = 0; // oyuncu + iniş noktası ortalanır (E.hit)
    S.overlays.push((c, t) => {
      S.logo(); S.hud(3, 420, t);
      if (!hitT) S.card(t, 0.15, 99, () => S.pill('BUNU YAPABİLİR MİSİN? 👀', 0, 1240, 56, { bg: 'rgba(8,12,8,0.8)', col: '#fff', border: 'rgba(255,255,255,0.5)' }), 1240);
      if (hitT) { S.flash(t, hitT, 0.14); S.card(t, hitT + 0.04, 99, () => { S.text('MEGA SEKME!', 0, 1180, 128, { grad: S.GOLD, stroke: 20 }); S.pill('3 SEKME · 1 VURUŞ 🤯', 0, 1310, 60, { bg: '#ff9a1e', col: '#1a1000', border: '#ffd88a' }); }, 1240); }
    });
    await S.wait(380); R.player.cool = 0; R.fire(R.player); const b = R.bullets[R.bullets.length - 1]; if (b) b.mesh.scale.setScalar(1.8); R.slowmoT = 0.8; // mermi ~0.35 sn'de 2 sekme yapar: ağır çekim + büyük mermi ile görünür
    await S.until(() => E.target && !E.target.alive, 3000); if (E.target && E.target.alive) R.damageEnemy(E.target, 99);
    hitT = S.shotT; R.slowmoT = Math.max(R.slowmoT || 0, 0.9);
    await S.wait(1450);
  });
  E.s2 = () => S.record('E2.webm', async () => { // seri: Kar, her ~0.5 sn ateş + garantili yok etme
    S.setStage(1); S.godMode(); R.settings.autoFire = false; R.touchCtl.move = 0; S.camIso(9, 5.5, 50, 7); // Stadyum: yeşil çim + mavi gök
    let kills = 0, kT = 0, coins = 520;
    S.overlays.push((c, t) => {
      S.logo(); S.hud(5, coins, t);
      if (kills >= 1) S.card(t, kT, 99, () => S.pill(kills >= 2 ? `x${kills} SERİ 🔥` : 'İLK VURUŞ!', 0, 1200, 72, { bg: 'rgba(30,90,40,0.92)', col: '#dfffc8', border: '#8aff9a' }), 1200);
    });
    const types = ['normal', 'scout', 'normal', 'heavy', 'scout'], lat = [0, -2.4, 2.4, -1.2, 2.0];
    const q = types.map((ty, i) => S.putEnemy(ty, 8 + (i % 3) * 2.5, lat[i], { speed: 2.0, keep: 99 }));
    for (let i = 0; i < q.length; i++) {
      await S.wait(i ? 480 : 300); const e = q[i]; if (!e.alive) continue;
      R.player.a = Math.atan2(R.player.x - e.x, R.player.z - e.z); R.player.mesh.rotation.y = R.player.a;
      R.player.cool = 0; R.fire(R.player); await S.wait(120); R.damageEnemy(e, 99); kills++; coins += 100; if (kills === 1) kT = S.shotT;
    }
    await S.wait(500);
  });
  E.s3 = () => S.record('E3.webm', async () => { // boss: Kanyon
    S.setStage(11); S.godMode(); R.settings.autoFire = true; R.touchCtl.move = 0; S.camIso(11, 7, 50, 8);
    const boss = S.putEnemy('boss', 12, 0, { hp: 5, cool: 1.2, keep: 10 }); boss.bossName = 'GENERAL KARA';
    let dead = 0, deathT = 0;
    S.overlays.push((c, t) => {
      S.logo(); S.hud(10, 1180 + Math.floor(t * 20), t);
      if (!dead) S.bossBar('GENERAL KARA', Math.max(0, boss.hp) / boss.maxHp, t, 600);
      S.card(t, 0.05, 1.0, () => S.pill('💀 BOSS DALGASI', 0, 1200, 70, { bg: 'rgba(120,20,20,0.92)', col: '#ffd9d0', border: '#ff7a5a' }), 1200);
      if (dead) { S.flash(t, deathT, 0.12); S.card(t, deathT + 0.04, 99, () => { S.text('GENERAL DÜŞTÜ!', 0, 1180, 90, { grad: S.GOLD, stroke: 15 }); S.pill('+🪙80  +🎰1 SANDIK', 0, 1300, 58, { bg: 'rgba(8,12,8,0.85)', col: '#ffd76a', border: '#ffd64a' }); }, 1240); }
    });
    R.touchCtl.move = 0.25;
    await S.until(() => !boss.alive, 2600); if (boss.alive) R.damageEnemy(boss, 99);
    dead = 1; deathT = S.shotT; R.touchCtl.move = 0; R.slowmoT = 1.0; R.shake = 2.0;
    for (let i = 0; i < 4; i++) { R.explode(boss.x + (Math.random() - 0.5) * 3, 1 + Math.random() * 2, boss.z + (Math.random() - 0.5) * 3, true, R.playerExplPal); R.sfxBoom(true); await S.wait(140); }
    await S.wait(850);
  });
  E.s4 = () => S.record('E4.webm', async () => { // ödül: vitrin Ejderha Seti
    await S.openSR('goldking', 'dragonwings', 'dragon'); R.profile.track = 'tr_gold'; R.buildShowroomTank(); S.showroomDrive(t => 0.5 + t * 0.6, 0.78, 0.3, 0);
    S.overlays.push((c, t) => { // etiket yok: başlık üstte
      S.card(t, 0.1, 99, () => { S.text('EJDERHA SETİ', 0, 570, 88, { grad: S.GOLD, stroke: 14 }); S.pill('🐉 KAPLAMA · KANAT · ATEŞ · UNVAN', 0, 670, 44, { bg: 'rgba(60,16,8,0.9)', col: '#ffd0a0', border: '#ff9a3a' }); }, 620);
      S.card(t, 0.9, 99, () => { S.text('15 TANK · 48 KAPLAMA', 0, 1230, 66, { col: '#fff', stroke: 11 }); S.text('SANDIKLAR · AKSESUARLAR · UNVANLAR', 0, 1310, 46, { col: '#ffd76a', stroke: 9 }); }, 1270);
    });
    R.sfxPower(); await S.wait(2500);
  });
  E.s5 = () => S.record('E5.webm', async () => { // kapanış: Stadyum orbit + logo + CTA
    if (R.showroom.active) R.closeShowroom();
    S.setStage(1); S.godMode(); R.settings.autoFire = false; R.touchCtl.move = 0;
    S.camOrbit(9, 3.8, 50, Math.PI * 0.8, 0.4);
    S.overlays.push((c, t) => {
      S.topShade(420, 0.45); S.bottomShade(980, 0.82);
      const p = S.clamp01(t / 0.35); cx.save(); cx.globalAlpha = p;
      S.text('TANK SAVAŞI 3D', W / 2, 1210, 106, { grad: S.GOLD, stroke: 16 });
      S.text('15 TANK · 12 HARİTA · SANDIKLAR', W / 2, 1305, 44, { col: '#fff', stroke: 8 });
      const s = 1 + Math.sin(t * 5) * 0.035; S.scaled(W / 2, 1440, s, () => S.pill('▶  ÜCRETSİZ OYNA', 0, 0, 64, { bg: '#ff9a1e', col: '#1a1000', border: '#ffd88a' }));
      cx.restore();
    });
    await S.wait(2400);
  });
  return 'ads3 ok';
})();
