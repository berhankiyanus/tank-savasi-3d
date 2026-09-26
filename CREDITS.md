# Tank Savaşı 3D — Krediler / Credits

Bu oyunda kullanılan üçüncü taraf varlıklar ve lisansları. Third-party assets used in this game and their licenses.

## 3D Modeller / Models
- `assets/tank_guardian.glb` (Muhafız): "Tank" — Quaternius, CC0 (Poly Pizza, Animated Tank Pack). https://poly.pizza/m/jWS1CLA0RO
- `assets/tank_sniper.glb` (Nişancı): "Tank" — Quaternius, CC0 (Poly Pizza, Animated Tank Pack). https://poly.pizza/m/FA5daiyZQq
- `assets/tank_recruit.glb` (Acemi): "Tank" — Quaternius, CC0 (Poly Pizza, Animated Tank Pack). https://poly.pizza/m/cW3zvvkMOM
- `assets/tank_goldking.glb` (Altın Kral): "Tank" — Quaternius, CC0 (Poly Pizza, Animated Tank Pack). https://poly.pizza/m/uYHpj7lz1J
- `assets/tank_scout.glb` (Kaşif): "Tank" — Quaternius, CC0 (Poly Pizza, Toon Shooter Game Kit). https://poly.pizza/m/Dc4k4CooN3
- `assets/tank_phantom.glb` (Hayalet): "Tank" — Zsky, CC BY 3.0 (Poly Pizza, Low Poly Military Vehicles). https://poly.pizza/m/7GG1xDtc8l — kule ayrıldı, yeniden ölçek/yön, düz malzemeler, normalsiz GLB (modified)
- `assets/tank_lynx.glb` (Vaşak): "Light Tank" — Zsky, CC BY 3.0 (Poly Pizza). https://poly.pizza/m/S1jUTRmAjD — modified (aynı işlem)
- `assets/tank_boxer.glb` (Boksör): "Tank" — KolosStudios, CC BY 3.0 (Poly Pizza, Military Pack). https://poly.pizza/m/egcLMSGiuA — modified (aynı işlem)
  (Quaternius modellerinde yapılan değişiklikler: armature/animasyon kaldırıldı, kule `TankTurret` olarak ayrıldı, yeniden yönlendirme/ölçek, remove doubles + limited dissolve + decimate, düz Principled malzemeler `TankPaint/TankLight/TankDark/GunMetal/TankWheel`, normalsiz GLB export. Modified.)
- `assets/hero.jpg`: oyunun kendi vitrininden alınmış render (bu proje için üretildi). Original screenshot of the game's own showroom.
- Tanklar (tank.glb, tank_heavy/twin/arty/mamut/hover/titan.glb) ve dekor setleri (decor_city/harbor/canyon.glb): Blender'da bu proje için özgün üretildi. Original, made in Blender for this project.
- `assets/decor_stadium.glb` (ağaçlar), `decor_desert.glb` (kaktüs, kaya, palmiye), `decor_lava.glb` (kaya): Kenney "Nature Kit" — CC0. https://kenney.nl/assets/nature-kit
- `assets/decor_space.glb` (anten, kubbe, roket kulesi, kristal kaya, meteor): Kenney "Space Kit" — CC0. https://kenney.nl/assets/space-kit
- `assets/decor_snow.glb` (karlı çamlar, kayalar, kardan adam): Kenney "Holiday Kit" — CC0. https://kenney.nl/assets/holiday-kit
- Aksesuarlar `assets/acc_gift.glb` (present-b-rectangle), `acc_xmas.glb` (tree-decorated), `acc_snowman.glb` (snowman), `acc_sled.glb` (sled): Kenney "Holiday Kit" — CC0; `acc_mushroom.glb` (mushroom_red): Kenney "Nature Kit" — CC0; `acc_rover.glb` (rover), `acc_speeder.glb` (craft_speederA): Kenney "Space Kit" — CC0.
  (Kenney modellerinde: ölçek/birleştirme, palet dokusu düz malzemelere çevrildi, normalsiz GLB export. Tribün/projektör/pano, harabe, kulübe, bazalt sütun/kalıntı parçaları bu proje için Blender'da özgün üretildi.)

## HDRI / Aydınlatma
- `assets/env.hdr`, `assets/sky.jpg`: "Kloofendal 48d Partly Cloudy (Pure Sky)" — Poly Haven, CC0. https://polyhaven.com/a/kloofendal_48d_partly_cloudy_puresky (256×128 HDR ışıklandırma + 1024×512 ön-eşlenmiş JPG gökyüzü olarak küçültüldü)
- `assets/env_studio.hdr`: "Studio Small 09" — Poly Haven, CC0. https://polyhaven.com/a/studio_small_09 (256×128; garaj vitrini ve kart görselleri)

## Dokular / Textures (assets/textures)
- asphalt_*: "asphalt_03" — Poly Haven, CC0. https://polyhaven.com/a/asphalt_03
- ground_*, grass_*, sand_*, snow_*, wall_*: Poly Haven PBR setleri, CC0 (1024/512 piksele küçültülmüş JPEG). https://polyhaven.com/textures

## İkonlar / Icons
- Arayüz stencil ikonları: Lorc, Delapouite & contributors — game-icons.net, CC BY 3.0. https://game-icons.net  https://creativecommons.org/licenses/by/3.0/

## Yazı tipi / Font
- Russo One — Jovanny Lemonad, SIL Open Font License 1.1. https://fonts.google.com/specimen/Russo+One

## Kod / Code
- three.js (r160) — MIT. https://threejs.org
- Capacitor — MIT. https://capacitorjs.com

Lisans metinleri: CC0 https://creativecommons.org/publicdomain/zero/1.0/ · CC BY 3.0 https://creativecommons.org/licenses/by/3.0/ (Zsky ve KolosStudios modelleri: atıf + değiştirildi notu) · OFL https://openfontlicense.org

## Yeni özgün aksesuar / Original accessory (2026-09-26)
- `assets/acc_fieldradio.glb`: Saha Telsizi, bu proje için Blender’da özgün modellendi. Düzenlenebilir kaynak: `design/Saha-Telsizi.blend`; üretim betiği: `design/build_field_radio.py`. Dış model veya doku kullanılmadı.

## Zırhlı filo güncellemesi / Armored fleet update (2026-09-26)
- `assets/tank_recruit_mk2.glb`, `tank_scout_mk2.glb`, `tank_heavy_mk2.glb`: bu proje için Blender’da özgün oluşturulan yeni gövde, palet/süspansiyon, kule, optik ve namlu tasarımları. Mevcut oynanış kimliklerini kullanır.
- `assets/acc_rescuepack.glb`, `acc_cargorack.glb`, `acc_searchlight.glb`: bu proje için özgün modellenmiş kozmetik ekipmanlar.
- Kaynak: `design/armored-update/Armored-Fleet.blend`; üretim ve GLB malzeme adlandırma betiği: `design/armored-update/build_armored_fleet.py`. Dış model/doku kullanılmadı.
# Tam filo güncellemesi — 26 Eylül 2026

Muhafız, Nişancı, Hayalet, Altın Kral, İkiz Namlu, Obüs, Mamut, Burç, Vaşak, Boksör, Hover Tank ve Titan için yeni özgün modeller Blender'da üretildi. Oyun `tank_*_mk2.glb` dosyalarını kullanır. Düzenlenebilir kaynak `design/complete-fleet/Complete-Fleet.blend`, üretim betiği ve manifest aynı klasördedir. Önceki üç Mk2 tank modeli `design/armored-update/` altında korunur. Eski üçüncü taraf modeller çalışma klasöründe tarihsel kaynak olarak tutulur; aşağıdaki atıflar bu kaynaklar için geçerliliğini korur.
# Garaj Atölyesi — 26 Eylül 2026

Altı yeni aksesuar, sekiz mermi modeli ve dört kutu Blender'da özgün olarak üretildi. Düzenlenebilir kaynak: `design/garage-expansion/Garage-Workshop.blend`; üretim betiği ve manifest aynı klasörde. Sekiz özgün vektör desen `garage-content.mjs` içinde bulunur. Yeni öğeler herhangi bir başka oyundan alınmış model, logo veya kaplama içermez.

### Command interface update (2026-09-26)
Original 24×24 line symbols, command emblem, hangar layout and menu styling authored for this project. Existing third-party asset credits above continue to apply.
