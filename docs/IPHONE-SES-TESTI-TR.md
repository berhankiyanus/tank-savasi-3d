# iPhone 15 — TREAD Ses Testi

26 Eylül 2026. Yeni AudioHero seslerini kişisel cihazda değerlendirmek için ayrı bir geliştirme uygulaması hazırlandı. Adı **TREAD Ses Testi**; mevcut TREAD RIVALS uygulamasıyla farklı kimlik kullanır. Mevcut kayıtları değiştirmez; test uygulaması ayrı kayıtla açılır.

Xcode 26.5 ile fiziksel iPhone 15 için Debug derlemesi başarılı oldu; imza ve 14 gömülü ses doğrulandı. Uygulama 26 Eylül 2026 saat 19:22'de bağlı iPhone 15'e başarıyla kuruldu. Telefonda işitsel değerlendirmeyi kullanıcı yapacak.

Aynı test uygulamasına yön farkındalığı olan kamera güncellemesi 26 Eylül 2026 saat 19:36'da başarıyla kuruldu. Kameranın davranışı ve deneme adımları `docs/KAMERA-KONTROL-TR.md` dosyasında.

Kameranın %12 daha uzak sürümü 26 Eylül 2026 20:00’da aynı uygulamaya kuruldu.

## Telefonda kısa deneme

1. Ana ekrandan **TREAD Ses Testi** uygulamasını aç. Medya sesini rahat bir seviyeye getir; bir düğmeye dokun.
2. Ana üste 20–30 saniye bekle, sonra garaja geç. Parça değişirken ani kesilme veya iki müziğin sürekli üst üste çalması olmamalı.
3. **ANTRENMAN** ile bot maçına gir. Kendi ateşini, yakındaki sekmeleri ve isabetleri müziğin üzerinden ayırt edebilmelisin. Motor sesi savaş efektlerini bastırmamalı.
4. Ayarlarda müziği %0 yap: efektler kalmalı. Ardından **Tüm sesler** düğmesini kapat: tamamen sessiz olmalı. Yeniden açınca seçtiğin seviyeler korunmalı.
5. Uygulamayı arka plana al ve geri dön. Arka planda çalmamalı; dönüşte veya sonraki dokunuşta ses geri gelmeli.
6. Önce telefon hoparlöründe, sonra varsa kulaklıkta birkaç dakika dene. Fazla tiz, patlak, zayıf veya tekrarlı gelen sesin hangi olayda duyulduğunu not et.

Başlangıç dengesi: müzik %65, efektler %80, motor %35. Ses dosyaları uygulamanın içindedir; bu deneme Mac'in 8738 portundaki sayfasına bağlanmaz.

## Sonraki kurulumu yenileme

`npm run preview:ios:audio` mevcut oyun kaynaklarıyla özel test kopyasını tekrar hazırlar. Xcode projesi:

`.local-audio/ios-preview/App/App.xcodeproj`

Xcode'da **App** şemasını ve bağlı **Berhan İphone’u / iPhone 15** cihazını seçip **Run (⌘R)** kullan. Otomatik imzalama için mevcut kişisel geliştirme takımı kullanılır. Derleme yapılandırması **Debug** olmalıdır.

Bu projenin Release/arşiv derlemesi bilerek kapalıdır. Standart `ios/App/App.xcodeproj`, `www/`, Render ve yayın varlık listesine AudioHero sesleri eklenmez. Ticari lisans cevabı geldikten sonra yayın yolu ayrıca hazırlanacak.

Resmi kurulum rehberi: [Apple — Running your app on simulated or physical devices](https://developer.apple.com/documentation/xcode/running-your-app-on-simulated-or-physical-devices).
