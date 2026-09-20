# Reklam kreatif briefi — Tank Savaşı 3D (2026-09-21)

Araştırma özeti (kaynaklar en altta) → bu brief → `ads2.js` (C/D varyantları) → `build2.sh` (9:16 + türevler).

## 1. Araştırmadan çıkan kurallar
| Kural | Neden | Uygulama |
|---|---|---|
| **İlk 3 saniye** performansın %60+'ını belirler; kanca = tatmin anı / başarısızlık / soru | Kaydırma refleksi; algoritma kitleyi ilk kareden seçer | C: gerçek 3 sekmeli vuruş (MEGA SEKME) 0-3 sn; D: "1 CAN KALDI…" |
| İlk 5 sn'de **2+ kesme** (Google App kampanyası önerisi) | Hareket, "içerik" hissi | C: kanca → montaj kesmeleri 3.4 sn'de başlar; D: 2.9 sn'de kesme |
| **9:16 evrensel varsayılan**; Meta Feed 4:5/1:1, YouTube in-stream 16:9 | Kanal başına yerleşim | Ana 1080×1920; türevler 16:9 (blur-pad), 1:1, 4:5 |
| Süre: TikTok 9-15 sn tatlı nokta; Meta Reels 15-30; AppLovin/Unity 15-30 (rewarded 30) | Kanal normu | C15 (~15 sn) + C30 (~27 sn) + D14 (~14 sn) |
| **Güvenli alan**: Stories üst %14 / alt %20 kapalı; TikTok sağ kenar ikonlar; Snap üst/alt 150 px | Metin okunmalı | Tüm metin y∈[430,1490]; CTA 1430'da (alt %25); sağ kenar boş |
| **Sesi kapalı izlenir** (Feed %80+ sessiz) → her şey altyazı; metin görselin %20'sinden az | Anlaşılırlık | Büyük kısa metinler (2-4 kelime), kartlar 1-2 sn |
| Oynanış > sinematik; UGC/"reklam gibi değil" görünüm yorulmayı %30-40 yavaşlatır | Doğru beklenti, yüksek niyet | Ham oyun görüntüsü + meme-stili metin; "🤯" gibi tepki dili |
| Marka erkenden görünür, logo sol üst; CTA kartı sonda, düğme alttan %20 | Hatırlanma + tık | `S.tag` sol üst sürekli; `S.brand2` CTA 1430 |
| Kazananlar 7-14 günde yorulur; ayda 4-6 konsept × 2-3 varyant test | CPI kayması | Bu paket 2 konsept × (15/30 sn, 4 ölçü); sonraki ay: "hangi tank?" seçim kancası, UGC tepki |
| Hybrid-casual: ilk oturum → ilerleme yolculuğunu 20-30 sn'de göster | Meta'yı satar | C30: boss → sandık → set → unvan |

## 2. Varyantlar ve çekim listesi
**C — "MEGA SEKME + Ejderha Seti"** (tatmin kancası)
| Seg | Süre | İçerik | Metin |
|---|---|---|---|
| C1 | 3.4 | Sonda mermi ile bulunan 2 sekmeli yol; düşman iniş noktasında; gerçek MEGA SEKME (oyun slow-mo) | "3 SEKME. / 1 VURUŞ." → "MEGA SEKME! 🤯" |
| C2 | 4.1 (30 sn: 6.2) | Harita kesmeleri (Çöl/Uzay/Gece), ejderha ateşi izi, geçit kill'leri | "DALGA 4 · ÇÖL", … |
| C3 | ~4 | Boss GENERAL KARA barı → düşer, ejderha patlaması | "GENERAL DÜŞTÜ! +🪙80 +🎰1" |
| C4 | 3.7 | Sandık ritüeli (pul deseni kartı) → vitrin ejderha tankı → CTA | "EJDERHA PULU · EFSANEVİ" → "ÜCRETSİZ OYNA" |
| C5 | 3.2 (30) | 15 tank thumb ızgarası | "15 TANK · 48 KAPLAMA" |
| C6 | 4.6 (30) | İki açılış: pul + kanat | |
| C7 | 3.8 (30) | Set takılı vitrin + konfeti + unvan → CTA | "SET TAMAMLANDI · EJDERHA EFENDİSİ" |

**D — "1 CAN KALDI"** (başarısızlık → geri dönüş kancası): D1 1 can/4 düşman (2.9) → D2 NEREDEYSE!/DEVAM ET/tam can (2.5) → D3 geri dönüş serisi (4.1) → D4 vitrin + "PES ETME. DEVAM ET." + CTA (3.7).

## 3. Teknik teslim
1080×1920 30 fps H.264 (yuv420p, CRF 19) + AAC 48 kHz 192 kb/s, faststart; ≤ 30 sn. Türevler: 1920×1080 (blur-pad), 1080×1080 (y 420-1500 kırpma), 1080×1350 (y 285-1635). Müzik: özgün 132 BPM synth (/tmp/v2-music.wav) + oyun SFX.
Adlandırma: `tank-C15-9x16.mp4`, `tank-C30-9x16.mp4`, `tank-D14-9x16.mp4` + `_16x9/_1x1/_4x5`.

## 4. Test planı
TikTok/Meta Reels: C15 vs D14 (kanca A/B), ilk 3 sn izlenme (hook rate) ve IPM; Google App: 9:16 + 16:9 + 1:1 seti; AppLovin/Unity rewarded: C30. 7-14 günde yorulan kazananı yeni kanca ile tazele (sonraki konseptler: "Hangi tankı seçersin?" 3'lü seçim, UGC tepki, "boss'u 6:42'de bitirdim" meydan okuma).

## 5. Kaynaklar
GameAnalytics "Mobile game ad formats 2026", Segwise "Ad Format Cheat Sheet 2026", AppAgent "Mobile Game Video Ads", Udonis "Mobile Game Ads 2026", Admiral Media, GGA "Ad creative strategy 2026", Liftoff 2025 Mobile Ad Creative Index (UGC), Business of Apps 2026 whitepaper, Maf.ad / CrazyLabs hybrid-casual creative guides, Matej Lancaric hybrid-casual UA playbook.
