# Tank Savaşı 3D — App Store & Google Play Gönderim Rehberi

Oyun **Capacitor** ile native uygulamaya paketlendi. Web kodu tek kaynak; iOS ve Android
aynı `www/` klasöründen üretilir. Çok oyunculu + analitik canlı Render sunucusuna bağlanır
(`tank-savasi-3d.onrender.com`) — yani mağaza sürümü de web sürümüyle **aynı odalarda** oynar.

---

## 0. Gerekenler (senin açman lazım — ben açamam)
- **Apple Developer Program** — $99/yıl → https://developer.apple.com/programs/
- **Google Play Console** — $25 tek sefer → https://play.google.com/console/signup
- **Xcode** (Mac App Store'dan, iOS için) + **Android Studio** (Android için)
- **Gizlilik politikası URL'si** (ikisinde de zorunlu — aşağıda)

## 1. Web'de değişiklik yaptıktan sonra (her seferinde)
```bash
npm run sync        # www/ yeniden üretir + iOS & Android'e kopyalar
```
> Not: Sunucu kodu (server.js) mağaza paketine girmez; o Render'da çalışmaya devam eder.
> Sadece `git push` ile web + sunucu güncellenir. Mağaza uygulaması güncellemesi için
> yeni sürüm derleyip mağazaya tekrar yüklemen gerekir.

## 2. Uygulama ikonu + açılış ekranı — HAZIR ✅
İkon (Blender'da render, tank) ve splash zaten üretildi:
- Kaynak: `resources/icon.png` (1024×1024), `resources/splash.png` (2732×2732).
- Tüm iOS/Android boyutları `ios/` ve `android/` içine yerleştirildi.

Değiştirmek istersen: `resources/icon.png`'yi değiştir, sonra:
```bash
npx @capacitor/assets generate --assetPath resources --iconBackgroundColor '#12160f' --splashBackgroundColor '#12160f'
```
> Not: `ios/`+`android/` git'te yok (yeniden üretilebilir). Projeyi başka makinede
> kurarsan `npx cap add ios android` sonra yukarıdaki generate komutunu tekrar çalıştır.

## 3. iOS → App Store
```bash
npm run open:ios          # Xcode'da açar
```
Xcode'da:
1. **Signing & Capabilities** → Team = Apple Developer hesabın (otomatik imzalama aç).
2. Bundle ID: `com.berhankiyanus.tanksavasi` (hazır).
3. Cihazda/simülatörde test et (▶). Gerçek çok oyunculu için Render uyanık olmalı.
4. **Product → Archive** → **Distribute App** → **App Store Connect** → yükle.
5. https://appstoreconnect.apple.com → uygulama oluştur, ekran görüntüleri + açıklama + gizlilik
   beyanı gir → **TestFlight** ile dene → **İncelemeye Gönder**.

### iOS'ta dikkat (reddedilmemek için)
- **SDK şartı (2026):** App Store gönderimlerinde güncel **Xcode 26 + iOS 26 SDK** ile derleme
  bekleniyor — Xcode'u App Store'dan güncel tut, eski Xcode'la arşiv yükleme.
- **4.2 "minimum functionality":** Oyun cihaza gömülü (sadece URL yükleyen wrapper değil) +
  haptik/tam ekran native hisler var → savunulabilir. Yine de açıklamada 3B/çok-oyunculu vurgula.
- **IAP:** iOS'ta bir şey **satarsan Apple IAP zorunlu (%30)**. Şu an gerçek satış YOK:
  elmas dükkânı arayüzü var ama üretimde satın alma kapalı ("yakında" mesajı döner, sahte
  başarı yok) → incelemede "IAP içermiyor" olarak temiz. StoreKit bağlanınca hem App Store
  Connect'te ürünleri tanımla hem aşağıdaki gizlilik beyanlarını güncelle.
- **Gizlilik beyanı (nutrition label):** aşağıdaki "8. Gizlilik beyanları" bölümünü aynen gir.

## 4. Android → Google Play
```bash
npm run open:android      # Android Studio'da açar
```
Android Studio'da:
1. **Build → Generate Signed Bundle / APK → Android App Bundle (.aab)**.
2. İlk seferde bir **imza anahtarı (keystore)** oluştur ve **GÜVENLE SAKLA** (kaybedersen
   güncelleme yayınlayamazsın).
3. https://play.google.com/console → uygulama oluştur → **.aab** yükle → mağaza kaydı
   (ekran görüntüleri, açıklama) → veri güvenliği formu → yayına gönder.

### Android'de dikkat (2026 şartları)
- **Hedef API 36 (Android 16):** yeni yüklemeler için hedef SDK güncel olmalı —
  `android/variables.gradle` içinde `targetSdkVersion = 36` (Capacitor güncellemeleri de bunu takip eder;
  `npx cap sync` sonrası kontrol et).
- **Kapalı test şartı (yeni kişisel hesaplar):** Play, üretime çıkmadan önce **en az 12 testçinin
  14 gün boyunca** kapalı testte kayıtlı olmasını ister. Planı: kapalı test parçası oluştur →
  test linkini arkadaşlara/aileye gönder (12+ kişi katılsın) → 14 gün beklet (bu sürede sürüm
  güncellemeleri yükleyebilirsin) → "üretime erişim başvur" butonu açılır.
- **Keystore yedeği:** anahtarı Google Play App Signing'e devret (önerilen) — kendi keystore'un
  sadece upload anahtarı olur, kaybolursa Play'den sıfırlatabilirsin.

## 5. Zorunlu belgeler (ikisi için de)
- **Gizlilik politikası** (bir URL gerekli). Basit bir sayfa yeter; analitik dışında veri
  toplamadığını, PII olmadığını belirt. İstersen Render'da `/privacy` olarak yayınlayabiliriz.
- **Yaş derecelendirmesi:** "Karikatür/fantezi şiddet (hafif)" → genelde 7+/9+.
- **Destek e-postası:** berhankiyanus123@gmail.com

## 6. Sürüm numarası artırma (güncelleme yüklerken)
- iOS: Xcode → Target → General → Version + Build.
- Android: `android/app/build.gradle` → `versionCode` (tam sayı, her yüklemede +1) + `versionName`.

---

## 7. Mağaza metinleri (kopyala-yapıştır hazır)

### Uygulama adı
- TR: **Tank Savaşı 3D** · EN: **Tank Battle 3D**

### Kısa açıklama (Play ≤80 karakter)
- TR: `3B tank savaşı! 10 dalgalık koşuyu bitir, garajını büyüt, botlara meydan oku.`
- EN: `3D tank battles! Beat the 10-wave run, grow your garage, challenge the bots.`

### Uzun açıklama (Play ≤4000 / App Store açıklama)
TR:
```
🎖 TANK SAVAŞI 3D — sür, ateş et, sektir!

Duvarların arkasına saklanan düşman tanklarını yok et, 10 dalgalık koşuyu tamamla,
boss'u devir ve zaferini kronometreye yazdır. Kısa maçlar, hızlı aksiyon, tek elle
oynanabilen kontroller.

⚔️ ÖZELLİKLER
• 10 dalgalık zafer koşusu + sonsuz mod
• 13 farklı tank: ağır zırhlılar, keskin nişancılar, sci-fi hover ve dev TITAN
• 3B garaj vitrini — tankını döndür, incele, kuşan
• 11 takılabilir aksesuar (sörf tahtası, taç, jetpack, radar...) + 36 kaplama
• 13 harita: çöl, kar, lav, uzay, şehir harabesi, liman, kanyon, fabrika...
• Bota karşı düello: Çaylak / Usta / Efsane zorlukları
• Arkadaşla oda kurup 1v1 düello (davet linkiyle tek dokunuş)
• Günlük görevler, sezon ödülleri, haftalık lider tablosu
• Mermiler duvardan seker — köşeden vurmayı öğren!

📶 Solo modlar internetsiz de çalışır; düello ve lider tablosu için bağlantı gerekir.
```
EN:
```
🎖 TANK BATTLE 3D — drive, shoot, ricochet!

Destroy enemy tanks hiding behind walls, finish the 10-wave run, take down the boss
and put your victory on the clock. Short matches, fast action, one-hand controls.

⚔️ FEATURES
• 10-wave victory run + endless mode
• 12 distinct tanks: heavy armor, snipers, sci-fi hovercraft and the giant TITAN
• 3D garage showroom — rotate, inspect, equip
• 11 mountable accessories (surfboard, crown, jetpack, radar...) + 36 skins
• 13 maps: desert, snow, lava, space, city ruins, harbor, canyon, factory...
• Bot duels: Rookie / Pro / Legend difficulty
• Create a room and duel a friend 1v1 (one-tap invite link)
• Daily quests, season rewards, weekly leaderboard
• Bullets bounce off walls — master the bank shot!

📶 Solo modes work offline; duels and leaderboard need a connection.
```

### App Store anahtar kelimeler (≤100 karakter, virgüllü)
`tank,savaş,3d,oyun,çok oyunculu,düello,arcade,battle,panzer,war,offline,aksiyon`

### Kategori / derecelendirme
- Kategori: **Oyunlar → Aksiyon** (ikincil: Arcade)
- İçerik: hafif karikatür/fantezi şiddet → Play: PEGI 7 civarı çıkar; App Store: 9+.
- Reklam yok, IAP yok (şimdilik) → formlarda "içermez" işaretle; AdMob/IAP açılınca güncelle.

## 8. Gizlilik beyanları (Data Safety / Nutrition Label cevap anahtarı)

Oyunun topladığı HER ŞEY şu üçü (hesap yok, e-posta yok, konum yok, reklam SDK'sı yok):
1. **Anonim analitik olayları** (oyun açıldı, mod başladı, maç bitti+nedeni, süre) → sunucuda
   yalnız SAYAÇ olarak tutulur, Render restart'ında silinir (kalıcı DB yok).
2. **Rastgele cihaz-içi kimlik** (`tankcid` — uygulamanın ürettiği rastgele dizi; kişiyle
   eşleştirilemez) → analitik tekilleştirme + lider tablosunda skorunu güncelleme için.
3. **Takma ad** (oyuncunun kendi yazdığı isim) → yalnız lider tablosunda gösterilir.

### Google Play "Veri güvenliği" formu böyle doldur:
- Veri toplanıyor mu? **Evet**.
- Toplananlar: **Uygulama etkileşimleri** (App interactions → Analytics),
  **Kullanıcı kimlikleri** (User IDs = rastgele takma kimlik → Analytics, App functionality),
  **Ad** (Name = takma ad → App functionality/lider tablosu). Hepsi: paylaşım YOK, satış YOK,
  amaç dışı kullanım YOK.
- Aktarımda şifreli mi? **Evet (HTTPS/WSS)**.
- Silme talebi: veriler kalıcı depolanmıyor (bellek-içi, periyodik sıfırlanır); takma ad/kimlik
  cihazdan uygulama verisi silinerek kaldırılır → "Geliştirici veri silme talebi mekanizması"
  olarak destek e-postasını göster.
- Konum / kişiler / dosyalar / sağlık / finans: **Hayır**.

### Apple "App Privacy" (nutrition label):
- **Data Not Linked to You**: Identifiers (User ID — rastgele), Usage Data (Product Interaction),
  User Content (takma ad). Tracking: **HAYIR** (üçüncü taraf yok, reklam yok → ATT gerekmez).

> ⚠️ AdMob veya IAP AÇILDIĞINDA bu bölüm geçersizleşir: AdMob eklersen "Advertising Data +
> Device ID (tracking olabilir)" beyanı ve Play'de reklam işareti zorunlu olur; IAP açarsan
> "Purchases" beyanı eklenir. O gün bu dosyayı güncellemem için bana söyle.

## 9. Ekran görüntüsü çekim planı (mağaza görselleri)
Önerilen 6 kare (telefonu yatay değil DİKEY tut; oyun portrait'te şık):
1. Aksiyon: lav haritasında patlama anı, 2. Garaj vitrini (Titan altın halkalı),
3. Garaj kart listesi (11 tank görselli), 4. Zafer ekranı (🏆 ZAFER! + süre rekoru),
5. Düello bot seçimi (Çaylak/Usta/Efsane), 6. Harita seçimi (12 harita).
iPhone: 6.7" (1290×2796) + 6.5" (1284×2778) setleri; Android: min 2 adet 16:9 veya 9:16.
✅ 2026-09-19: 6 kare × 3 boyut × TR/EN üretildi → Masaüstü `tank-magaza-ss/` (iphone-6.7 / iphone-6.5 / android klasörleri, `genel-bakis.png`). Yeniden üretim: `tools/reklam/shots.js` (README'de adımlar).

---
**Özet akış:** web değiştir → `git push` (web/sunucu canlı) → `npm run sync` → Xcode/Android
Studio'da derle → mağazaya yükle.
**Kapalı test özeti:** .aab yükle → kapalı test → 12+ testçi linkten katılsın → 14 gün →
üretim başvurusu. (Testçileri şimdiden ayarlamaya başla — süre saymaya katılımla başlıyor.)
