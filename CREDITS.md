# Tank Savaşı 3D — Yayın kredileri / Release credits

Güncelleme: 26 Eylül 2026. Bu liste güncel web ve Capacitor mobil paketini kapsar. Tam lisans metinleri `licenses.html` içinde ve `legal/licenses/` klasöründedir. Dosya kaynakları ve SHA-256 kayıtları: `legal/asset-register.json`. Tarihsel modellerin atıfları: `legal/ARCHIVED-CREDITS.md` (güncel pakette kullanılmaz).

## Proje için oluşturulan tasarımlar

15 Mk2 tank: `design/armored-update/` ve `design/complete-fleet/` içindeki Blender üretim betikleri. Saha Telsizi: `design/build_field_radio.py`. Kurtarma çantası, yük sandıkları ve projektör: `design/armored-update/`. Altı atölye aksesuarı, sekiz mermi, dört kutu: `design/garage-expansion/`. Kodla çizilen kaplamalar: `garage-content.mjs`, `garage-visuals.mjs`. Şehir, liman, kanyon dekorları için kurtarılan üretim kayıtları denetim kanıtlarında listelidir. Ses ve müzik Web Audio ile sentezlenir; hazır ses dosyası paketlenmez.

Yeni keşif atölyesi arka planı ve uygulama simgesi: `design/identity/build_outpost.py`, `app-icon.svg`, `build_identity.cjs`. Geometri ve malzemeler bu proje için oluşturuldu. Arayüzdeki 22 SVG sembolü `index.html` içindedir. Bu üretim açıklaması, dünyada benzeri olmadığına veya hukuki tescile dair bir garanti değildir.

## Kenney — CC0 1.0

[Nature Kit 2.1](https://kenney.nl/assets/nature-kit), [Space Kit 2.0](https://kenney.nl/assets/space-kit), [Holiday Kit 2.0](https://kenney.nl/assets/holiday-kit), Kenney. Kaynak paketlerdeki lisans dosyaları korunur. Ticari kullanım ve değiştirme izni vardır; zorunlu atıf yoktur. Kenney logosu kullanılmaz.

- Doğa: `acc_mushroom.glb`; `decor_stadium`, `decor_desert`, `decor_lava` içindeki ağaç/kaktüs/kaya/palmiye parçaları.
- Uzay: `acc_rover`, `acc_speeder`, `decor_space`.
- Yılbaşı: `acc_gift`, `acc_xmas`, `acc_snowman`, `acc_sled`; `decor_snow` içindeki karlı ağaç/kaya/kardan adam parçaları.
- Değişiklikler: ölçekleme, birleştirme, yeniden adlandırma ve malzeme/palet uyarlaması. Tribün, harabe, kulübe ve bazalt parçaları proje üretimidir.

## Poly Haven — CC0 1.0

Bu altı PBR seti 26 Eylül 2026'da resmi dosya adreslerinden yeniden indirildi; API'deki MD5 kontrol edildi, kaynak ve çıktı SHA-256 değerleri kaydedildi. Önceki kaydı eksik dosyalar değiştirildi. JPEG renk haritaları 1024, normal/AO/pürüzlülük haritaları 512 piksele indirildi.

| Oyundaki önek | Kaynak set |
| --- | --- |
| asphalt | [Asphalt 03](https://polyhaven.com/a/asphalt_03) |
| ground | [Brown Mud Leaves 01](https://polyhaven.com/a/brown_mud_leaves_01) |
| grass | [Leafy Grass](https://polyhaven.com/a/leafy_grass) |
| sand | [Aerial Beach 01](https://polyhaven.com/a/aerial_beach_01) |
| snow | [Snow 02](https://polyhaven.com/a/snow_02) |
| wall | [Brick Wall 001](https://polyhaven.com/a/brick_wall_001) |

`env.hdr` ve `sky.jpg`: [Kloofendal 48d Partly Cloudy Puresky](https://polyhaven.com/a/kloofendal_48d_partly_cloudy_puresky). `env_studio.hdr`: [Studio Small 09](https://polyhaven.com/a/studio_small_09). Resmi 1K HDR dosyalarından yeniden üretildi; ortam ışığı 256×128, gökyüzü 1024×512. Sanatçı isimleri ilgili `legal/evidence/*-info.json` dosyalarında korunur. Web sitesi önizleme görselleri/logoları alınmadı. [Lisans koşulları](https://polyhaven.com/license).

## Yazı tipleri — SIL OFL 1.1

Barlow Semi Condensed SemiBold — Copyright 2017 The Barlow Project Authors. Resmi Google Fonts dosyası değiştirilmeden kullanılır. [Kaynak](https://github.com/google/fonts/tree/main/ofl/barlowsemicondensed).

Field Symbols — Noto Emoji'den bu oyunun sabit metinleri için altküme oluşturuldu ve adı değiştirildi. Copyright 2013 Google LLC. OFL lisansı ve üretim betiği korunur. [Kaynak](https://github.com/google/fonts/tree/main/ofl/notoemoji). Apple emoji resimleri veya Apple font dosyaları paketlenmez. Kullanıcının kendisinin girdiği ve altkümede bulunmayan karakterler işletim sisteminin yedeğine düşebilir.

## Yazılım

Three.js r160 ve yükleyicileri — Copyright 2010–2023 Three.js Authors, MIT. Yerel import yolları uyarlanmıştır. Capacitor ve eklentileri — MIT; iOS Cordova bileşenleri — Apache 2.0; npm çalışma bağımlılıkları — MIT, ISC ve 0BSD. Tam telif/lisans metinleri ile Apache bildirimi uygulamada bulunur. Ayrıntılı sürüm listesi: `legal/software-sbom.json`.

Projenin yeni sürümü için npm'deki genel ISC şablon etiketi kaldırıldı; bu işlem daha önce verilmiş olabilecek hakları geri almaz. Üçüncü tarafların kendi lisansları geçerlidir. Unity/Blender geliştirme araçları, sistem SDK'ları ve yerel kaynak arşivleri oyun paketine dahil değildir; bunların hesap/sözleşme durumları bu teknik varlık denetimiyle onaylanmış sayılmaz.
