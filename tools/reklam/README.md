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

## v2 (2026-09-20): araştırmaya dayalı C/D varyantları (`BRIEF.md`, `ads2.js`, `build2.sh`)
- Kurallar `BRIEF.md`'de (kanca 0-3 sn, ilk 5 sn'de 2+ kesme, 9:16 ana + 16:9/1:1/4:5 türev, metinler y∈[430,1490], marka sol üstte, CTA alt %20'nin üstünde, sessiz izlenebilir altyazı, 7-14 günde tazeleme).
- Yükleme: `_reclib.js` + `_ads.js` (yardımcılar: setStage/parade/showroomDrive/openSR/flash/card) + `_ads2.js` (window.__C, window.__D). Çekim sırası:
  `await __C.prep()` (sonda mermiyle gerçek 2 sekmeli MEGA SEKME yolu bulur) → `__C.s1..s4` (15 sn) · `__C.s2(3,'C2b.webm')` + `__C.s5..s7` (30 sn) · `__D.s1..s4` (14 sn).
- Kurgu: `build2.sh ~/Desktop/tank-reklam-2026/tank-C15-9x16.mp4 C1 C2 C3 C4` · `... tank-C30-9x16.mp4 C1 C2b C3 C5 C6 C7` · `... tank-D14-9x16.mp4 D1 D2 D3 D4` → `build2.sh --deriv <mp4>` (16:9 blur-pad, 1:1 ve 4:5 kırpma).
- Ders: pane'de rAF ~4 fps'ye düşerse (dosya paneli öne geçince) `resize_window` desktop → 540×960 yeniden ayarı uyandırır; kayıt 3 kare kalmışsa boyut <1 MB'tan anlaşılır. Sandık kartı `S.card` içinde çizildiği için koordinatlar merkeze görelidir (0 = W/2).

## v3 (2026-09-20): TEK reklam videosu (`ads3.js`, window.__E) — yayındaki sürüm
- Neden: v1/v2 karanlık haritalar (lav/uzay/gece) + uzak/kuşbakışı kamera + küçük tank = zayıf görüntü. v3 parlak haritalar (Kar/Stadyum/Kanyon) + yakın takip kamerası (`S.camIso` yumuşatılmış yön, `S.camPair` oyuncu+iniş noktası, `S.camOrbit` kapanış).
- Akış (13,7 sn): E1 Kar kanca — gerçek 2 sekmeli vuruş, mermi 1.8× + `slowmoT 0.8` (mermi 0,35 sn'de sekiyor, ağır çekimsiz görünmez) → "MEGA SEKME!" · E2 Stadyum x4 seri (ateş + garantili yok etme) · E3 Kanyon GENERAL KARA (hp 5, otomatik ateş, 2,6 sn'de zorla) · E4 vitrin Ejderha Seti · E5 Stadyum orbit + logo + CTA.
- Çekim: `E.prep(3)` (Kar; koni probu bulamazsa eski prob — Stadyum'da iç duvar az, sekme yolu çıkmaz) → `E.s1..s5`. javascript_tool 45 sn sınırı: zinciri arka planda başlat (`window.__runP = (async()=>{...})()`), 38 sn'lik poll ile bekle; prep+E1 ≈ 20 sn, E3-E5 ≈ 9 sn.
- Kurgu: `build2.sh ~/Desktop/tank-reklam-2026/TankSavasi3D-reklam.mp4 E1 E2 E3 E4 E5` (−14,6 LUFS). Türev gerekirse `build2.sh --deriv`.

## v4 (2026-09-20): GERÇEK OYNANIŞ kaydı (`real.js`) — yayındaki sürüm
- Neden: v1-v3 kurgu (senaryolu düşmanlar, sahte HUD, her yerde yazı) kullanıcıya "yapay, gerçek hissi yok" geldi. v4 oyunun KENDİ arayüzüyle (kalpler, DALGA/skor, mini harita, joystick + ATEŞ) gerçek bir tur: otomatik ama kusurlu "başparmak" oyuncusu (yumuşak joystick, ıskalama, geri çekilme, mermiden kaçış, görüş yoksa duvara sekme denemesi, yükseltme kartını ~0,7 sn sonra seçer), joystick üstünde yarı saydam başparmak + ateşte dokunma halkası, sonda 2,3 sn DOM kapanış kartı (logo + ÜCRETSİZ OYNA).
- Teknik: headless Chrome for Testing (GPU: `--use-angle=metal`, ANGLE Metal M3, oyun ~110 fps) + CDP `Page.startScreencast` (JPEG 92) → kareler + zaman damgası → concat demuxer → 30 fps. 1080×1920 için viewport 1080×1920 @DSF 1 + `body > *:not(#game) { zoom: 2 }` (DSF 2 ile screencast 540×960 veriyor). Ses: sayfada `MediaRecorder(S.adest.stream)` (SFX + `startMusic()` müziği), ilk kareyle hizalanır. Sonra `loudnorm I=-14`.
- Çalıştırma: kanca main.js'te, `cp tools/reklam/rec-lib.js assets/_reclib.js`, `python3 -m http.server 8734`, sonra `NODE_PATH=<playwright-core dizini> node tools/reklam/real.js <outdir> <map> <sn> <seed> <başlangıç dalgası>`; 3-4 farklı seed çek, en iyisini seç (stats: shots/kills/mega/hp). Seçilen: Stadyum (map 1) seed 4 dalga 3, 13 sn + kapanış.
- Ders: `page.evaluate(dize)` fonksiyonu çağırmaz (dizeye `(args)` ekle); zsh'ta `set -- $cfg` sözcük bölmez; Chrome standart zoom'da getBoundingClientRect kök px (offsetWidth ile tespit).

## v5 (2026-09-20): 3 SAHNELİ gerçek oynanış (`real2.js`) — yayındaki sürüm
- Kullanıcı v4'ü "daha ilgi çekici olsun" dedi → aynı gerçek kayıt tekniği, 3 gerçek sahne + kapanış: **S1 Kar dalga 3** — kayıt dışı gerçek mermiyle 2 sekmeli yol bulunur, iniş noktasına düşman konur, otomatik oyuncu o yöne dönüp ateş eder → oyunun KENDİ ağır çekimi + "MEGA SEKME!" yazısı (altyazı "Bu atışı yapabilir misin? 👀", DOM `#advcap`); **S2 Stadyum dalga 4** kalabalık çatışma; **S3 Kanyon dalga 5 BOSS** — boss oyuncunun önünde görüş içinde başlatılır (`pointInWall`+`losClear` ile açık nokta), hp 9, otomatik oyuncu 1 sn sonra ateşe başlar (`preferBoss`), gerçek can barı/telegraf/"SAVUNMASIZ!"/x2 patlama; son 2,3 sn DOM kapanış kartı (HUD gizlenir).
- Sahneler ayrı mp4 (ses hizalı) → concat → müzik yatağı (`/tmp/v2-music.wav` 0.42) + oyun SFX → `loudnorm I=-14`. `SCENES=S3` ile yalnız bir sahne yeniden çekilir (diğer mp4'ler korunur; sonuç rastgele → 2-3 deneme, iyisini seç).
- Oyun düzeltmesi: `#wave { white-space: nowrap }` (4 haneli skorda "DALGA 5/10" alt satıra kayıp runcoins ile çakışıyordu; kayıtta fark edildi).

## Mağaza ekran görüntüleri (`shots.js`)
Headless Chromium (playwright-core + ~/Library/Caches/ms-playwright/chromium-1208) ile STORE.md §9'daki 6 kare, 3 boyut × TR/EN:
iPhone 6.7" 1290×2796 (430×932@3), iPhone 6.5" 1284×2778 (428×926@3), Android 1080×1920 (405×720@2.667).
1. `main.js` sonuna yukarıdaki GEÇİCİ `window.__R` köprüsünü ekle; sunucu 8734'te çalışsın.
2. `cd <scratch> && npm i playwright-core && node tools/reklam/shots.js <çıktı-klasörü> iphone67,iphone65,android tr,en`
3. Köprüyü sil. Çıktı Masaüstü'nde `tank-magaza-ss/` (2026-09-19 seti).
Notlar: günlük ödül toast'ı `profile.lastDaily=bugün` + `#toast display:none` ile bastırılır; `toastQ` const'tur (length=0 ile boşalt);
1. karede düşmanlar 5.5/8.2/10.8 birim öne konur ve ilk düşman `damageEnemy(e,99)` ile patlatılır (gerçek patlama/floater); zafer ekranı `soloRunStart=now-402` → "⏱ Süre 6:42 — YENİ REKOR!".
