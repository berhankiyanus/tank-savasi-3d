# Reklam videosu boru hattı (tekrar üretilebilir)

Çıktılar: `tank-reklam-speedrun.mp4` ve `tank-reklam-koleksiyon.mp4` (1080×1920, 30fps, ~15.5s / ~16.5s).
Kod tarafında KALICI değişiklik yok; her şey geçici kanca + enjekte edilen betiklerle çalışır.

## Adımlar
1. `main.js` sonuna GEÇİCİ köprü ekle (bitince sil, commit ETME):
   ```js
   // __REC_HOOK_START
   let __setv;
   window.__R = new Proxy({}, {
     get: (_, k) => { if (typeof k !== 'string') return undefined; try { return eval(k); } catch (e) { return undefined; } },
     set: (_, k, v) => { __setv = v; eval(k + ' = __setv'); return true; },
   });
   // __REC_HOOK_END
   ```
   (Doğrudan `eval` modül kapsamındaki tüm değişken/fonksiyonlara erişir: `__R.player`, `__R.spawnEnemies(...)`, `__R.wave = 10` ...)
2. Alıcı: `node tools/reklam/recv.js` (9799; POST /<ad> → /tmp/ad-<ad>).
3. `cp tools/reklam/rec-lib.js assets/_reclib.js; cp tools/reklam/ads.js assets/_ads.js` (assets/ sunulur; bitince sil).
4. Tarayıcı pane'i 540×960 emülasyon (canvas 918×1632 = 9:16). Sayfaya bir kez tıkla (ses izni), sonra:
   ```js
   // script yükle
   for (const f of ['_reclib.js','_ads.js']) { const s=document.createElement('script'); s.src='assets/'+f+'?'+Date.now(); await new Promise(r=>{s.onload=r; document.head.appendChild(s)}); }
   const S=window.__S, R=window.__R; S.prepProfile(); await S.audioInit(); await document.fonts.load('80px "Russo One"');
   for (const m of Object.keys(R.MODEL_PATHS)) await R.ensureModel(m); await S.loadThumbs(); S.defFps=60;
   for (const k of ['s1','s2','s3','s4','s5']) await window.__A[k]();     // speedrun
   for (const k of ['s1','s2','s3','s4','s5','s6']) await window.__B[k](); // koleksiyon
   ```
5. `tools/reklam/build.sh A /tmp/tank-reklam-speedrun.mp4` ve `build.sh B /tmp/tank-reklam-koleksiyon.mp4` (müzik: /tmp/v2-music.wav — 132BPM synth, önceki oturumda OfflineAudioContext ile bestelendi; yoksa build.sh'ta MUSIC yolunu değiştir).
6. Kontrol: `tools/reklam/sheet.sh /tmp/ad-A1.webm sA1.png 6` (kontakt föyü).
7. Temizlik: kanca bloğunu sil (`sed -i '' '/^\/\/ __REC_HOOK_START/,/^\/\/ __REC_HOOK_END/d' main.js`), `assets/_*.js` sil, `cat main.js | node --input-type=module --check`.

## Dersler
- Pane odak kaybı → oyun `blur` ile DURAKLADI'ya girer; `S.record` 60ms'de bir `unpause()` ile korur. Kayıt sırasında başka araç çalıştırma (rAF kısılır).
- MediaRecorder VP9 yazılım kodlayıcı 1080×1920'de 7-14 fps'ye düşer → `video/webm;codecs=h264` (donanım) ~45 fps.
- Kamera sıkılaştırma render öncesi uygulanıp render sonrası GERİ ALINIR (`S.post`), yoksa lerp'e kalıcı sapma biner.
- Kart "pop" animasyonu kendi merkezinden ölçeklenmeli (`S.card(..., py)`), yoksa alt metinler zıplar.
- DOM overlay'ler captureStream'e girmez: HUD/kart/sayaç/boss barı kompozitör canvas'ında çizilir.
- Gerçek isabet: düşmanlar namlu önüne konur (`S.putEnemy`), oto-ateş vurur; nöbetçi düşman (`S.sentinel`) dalganın bitmesini engeller.

## Mağaza ekran görüntüleri (`shots.js`)
Headless Chromium (playwright-core + ~/Library/Caches/ms-playwright/chromium-1208) ile STORE.md §9'daki 6 kare, 3 boyut × TR/EN:
iPhone 6.7" 1290×2796 (430×932@3), iPhone 6.5" 1284×2778 (428×926@3), Android 1080×1920 (405×720@2.667).
1. `main.js` sonuna yukarıdaki GEÇİCİ `window.__R` köprüsünü ekle; sunucu 8734'te çalışsın.
2. `cd <scratch> && npm i playwright-core && node tools/reklam/shots.js <çıktı-klasörü> iphone67,iphone65,android tr,en`
3. Köprüyü sil. Çıktı Masaüstü'nde `tank-magaza-ss/` (2026-09-19 seti).
Notlar: günlük ödül toast'ı `profile.lastDaily=bugün` + `#toast display:none` ile bastırılır; `toastQ` const'tur (length=0 ile boşalt);
1. karede düşmanlar 5.5/8.2/10.8 birim öne konur ve ilk düşman `damageEnemy(e,99)` ile patlatılır (gerçek patlama/floater); zafer ekranı `soloRunStart=now-402` → "⏱ Süre 6:42 — YENİ REKOR!".
