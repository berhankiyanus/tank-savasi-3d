# Tank Savaşı 3D — Playable Ad (oynanabilir reklam)

Tek dosyalık HTML5 mini oyun: sür + ateş, 2 sekmeli mermi (MEGA SEKME), dalga 1 (3 düşman) → dalga 2 (GENERAL KARA boss + 2 eskort) → kapanış kartı → mağaza. Dikey + yatay, dış istek yok, ses yalnız ilk dokunuştan sonra, MRAID `viewableChange` beklenir.

## Dosyalar
- `src/playable.js` — oyun (three.js ES modülü; mini GLB yükleyici, arena, AI, mermi sekmesi, HUD, joystick/ateş, MRAID/CTA).
- `src/shell.html` — kabuk (inline Russo One woff2, HUD/kontrol/kapanış DOM'u, `%%…%%` yer tutucular).
- `build.js` — esbuild ile paketler, GLB'leri (Altın Kral / tank / ağır tank) ve fontu base64 gömer → `dist/`:
  - `tank-savasi-playable.html` — **evrensel** (Unity Ads, AppLovin, ironSource/LevelPlay, Mintegral, Vungle, Meta): `mraid.open` → `FbPlayableAd.onCTAClick` → `dapi.openStoreUrl` → `install()` → `postMessage('download')` → `window.open` sırasıyla dener.
  - `tank-savasi-playable-google.html` / `.zip` — **Google App kampanyaları**: aynı dosya + `<head>`'de literal `exitapi.js` script'i (`ExitApi.exit()`), `ad.orientation` meta'sı; ZIP olarak yüklenir.
- Boyut ≈ 0,95 MB (sınır 5 MB; ironSource 4 MB).

## Derleme / test
```
npm i esbuild   # (repo dışı bir yerde de olabilir; ESBUILD=<yol>)
ESBUILD=<esbuild> node tools/playable/build.js          # STORE_URL=... ile mağaza linki değiştirilir
DEBUG=1 ESBUILD=<esbuild> node tools/playable/build.js  # küçültmesiz dist/tank-savasi-playable-debug.html
python3 -m http.server 8735 --directory tools/playable/dist   # tarayıcıda aç; #debug ile window.__pa test kancası
```
Otomatik testler (scratchpad'de yazıldı, repoda değil): playwright-core ile 540×960 ve 960×540 duman testi (hata yok, 120 fps), akış testi (dalga 2 boss barı → ZAFER kartı → CTA `window.open` mağaza linki; ölüm → NEREDEYSE kartı).

## Ağ şartları (2026-09, doğrulandı)
- Google App kampanyaları: ZIP ≤ 5 MB, ≤ 512 dosya, dış kaynak yok (yalnız Google barındırmalı kütüphaneler), `ExitApi` script'i literal `<script>` olarak head'de, `ad.orientation` meta; ses etkileşimden önce çalmamalı; doğrulayıcı: h5validator.appspot.com/adwords/asset ("App Campaigns" seçili).
- Unity Ads: tek `index.html` ≤ 5 MB, MRAID 3.0, `viewableChange` beklenir, CTA `mraid.open`, iki yön, XHR yok, kapatma tuşu engellenmez, otomatik yönlendirme yok.
- AppLovin: tek HTML ≤ 5 MB, varlıklar base64. ironSource/LevelPlay: ≤ 4-5 MB, DAPI. Meta: `FbPlayableAd.onCTAClick`, ≤ 5 MB (2 MB önerilir).
- Yayın: uygulama Play'de yayınlanmadan playable kampanyası açılamaz; mağaza linki `build.js` içindeki STORE_URL (paket: com.berhankiyanus.tanksavasi).

## Ayar noktaları
`GRID` (Kar düzeni; çit yeşili), `P` hızları, `spawnEnemy` konumları (dalga 1: (8,6) önde + (9,2)/(9,10) yanlar; dalga 2 boss (8,6)), boss hp 6, düşman ateşi 4 sn sonra başlar, süre tavanı 45 sn → "Devamı oyunda" kartı.
