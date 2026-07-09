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
- **4.2 "minimum functionality":** Oyun cihaza gömülü (sadece URL yükleyen wrapper değil) +
  haptik/tam ekran native hisler var → savunulabilir. Yine de açıklamada 3B/çok-oyunculu vurgula.
- **IAP:** iOS'ta bir şey **satarsan Apple IAP zorunlu (%30)**. Şu an satış yok (temiz).
- **Gizlilik beyanı (nutrition label):** Analitik anonim (PII yok) — "Kimliksiz kullanım
  verisi" olarak beyan et.

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

## 5. Zorunlu belgeler (ikisi için de)
- **Gizlilik politikası** (bir URL gerekli). Basit bir sayfa yeter; analitik dışında veri
  toplamadığını, PII olmadığını belirt. İstersen Render'da `/privacy` olarak yayınlayabiliriz.
- **Yaş derecelendirmesi:** "Karikatür/fantezi şiddet (hafif)" → genelde 7+/9+.
- **Destek e-postası:** berhankiyanus123@gmail.com

## 6. Sürüm numarası artırma (güncelleme yüklerken)
- iOS: Xcode → Target → General → Version + Build.
- Android: `android/app/build.gradle` → `versionCode` (tam sayı, her yüklemede +1) + `versionName`.

---
**Özet akış:** web değiştir → `git push` (web/sunucu canlı) → `npm run sync` → Xcode/Android
Studio'da derle → mağazaya yükle.
