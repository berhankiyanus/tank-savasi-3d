# TREAD RIVALS — App Store hazırlık raporu

26 Eylül 2026 · hedef sürüm **1.1.0 (2)** · `com.berhankiyanus.tanksavasi`

**Durum: incelemeye göndermeye henüz hazır değil.** Yerel kaynak düzeltmeleri ve yayın hazırlık dosyaları tamamlandı; aşağıdaki dış koşullar doğrulanmadan uygulama App Store'a gönderilmemeli. Kabul garantisi verilmez. Bu rapor hukuki görüş veya marka tescil raporu değildir.

## Tamamlanan düzeltmeler

- Kamera mesafesi %12 artırıldı. Sabit dünya yönü, bağımsız nişan ve hareket yönüne bakış korunuyor. Dört yönde 8,5 birim öndeki hedef izdüşüm testinde görünür; tank küçük yatay telefonlarda okunabilirlik alt sınırında kalıyor. Kamera ve son hazırlık düzeltmeleri iPhone 15'teki **TREAD Ses Testi** uygulamasına 20:53'te kuruldu; bu özel Debug sürümü, dağıtım imzalı App Store paketi değildir.
- Kullanım ölçümü ve solo skor paylaşımı ayrı, varsayılan kapalı tercihler oldu. Eski kayıtlara sessizce izin verilmez. Ölçüm kapatılınca yeni olay gönderilmez, yerel ölçüm kimliği kaldırılır. Ölçüm kimliği solo sıralama kimliğinden ayrıdır.
- Yerel solo kayıt, geçiş yedeği ve tercihleri silme işlemi eklendi; ana menüde iki ayrı eylem gerektirir. Arena hesabının ayrı kaldığı açıklanır. Mevcut kayıtlar otomatik silinmedi.
- Türkçe/İngilizce destek sayfası, gizlilik politikası ve lisanslar uygulama içinde ve çevrimdışı erişilebilir. Destek adresi mevcut gizlilik politikasındaki geliştirici adresidir.
- iOS gizlilik manifesti eklendi. Kişiye/kuruluma bağlanabilen veriler yanlış biçimde anonim gösterilmez. Reklam takibi ve reklam kimliği kullanılmaz. Sürüm bilgileri eşitlendi; iPad yatay tam ekran bildirimi ve OS şifrelemesine ilişkin paket bilgisi eklendi.
- Çevrim içi istekler 10 saniye sonra hata ekranına geçer; süresiz bekleme önlenir. Gizli eski oda modları yayın istemcisinde davet bağlantısıyla açılamaz.
- Arena'da oyuncu bildirimi ve engelleme eklendi. Aynı gün aynı oyuncuya yinelenen bildirim çoğalmaz; oturum doğrulaması ve hız sınırı vardır. Engellenen oyuncular eşleştirilmez. Lig/sonuç/maç ayarlarında erişim vardır. Solo listelerinde takma ad gizleme ve kullanıcının gönderebileceği destek e-postası vardır.
- Bildirimler 90 günlük temizliğe tabi; hesap silinince bildirimin hesap bağlantısı kaldırılır. Moderatör aracı özel sunucu tarafındadır; halka açık yönetim uç noktası eklenmedi. Askıya alınan hesap yeniden oturum açamaz ve bağlı oturumu kapatılır.
- Günlük ölçüm/skor için 30 gün, haftalık skor için dönem sonu temizliği tanımlandı. Loglara oyuncu/oturum kimliği yazımı kaldırıldı.
- İlk açılış hatasının yükleme logosunun altında saklanması düzeltildi; uzun bekleme/hata halinde görünür açıklama ve yeniden deneme eylemi var. Tüm paketlenen JavaScript dosyaları paketleme öncesinde ayrıştırılıyor. Arşivin kaynak özeti güncel sürümle karşılaştırılıyor; eski paket yanlışlıkla başarılı sayılamıyor.
- 1024×1024 uygulama simgesi şeffaflık içermiyor. Yalnız incelenmiş varlıklar paketleniyor; kullanılmayan otomatik splash görselleri temizlendi.

## Doğrulama kanıtları

| Kontrol | Sonuç / sınır |
|---|---|
| Birim, ağ ve gerçek PostgreSQL testleri | 81/81 başarılı; atlanan test yok. Geçici yerel veritabanı kullanıldı; canlı oyuncu verisine dokunulmadı. |
| Kamera | Yönler, ters nişan, 30/120 FPS takibi, doğma, sınır, telefon/tablet görüş eşitliği test edildi. |
| Ağ | İki gerçek yerel WebSocket, sahte sonuç reddi, tekrar bağlanma, 25 eşzamanlı maç ve değişken girdi gecikmesi. Gerçek internet ve operatör testi yerine geçmez. |
| Kayıt | Tekrarlanan sonuç, eşzamanlı satın alma (kazanılmış kredi), tek kullanımlık kurtarma, hesap silme ve rapor anonimleştirme PostgreSQL ile test edildi. |
| Lisans kapısı | 115 onaylı, 20 yayın dışı varlık; dosya bütünlüğü ve bağımlılık kilidi denetleniyor. Yeni AudioHero dosyaları bu onaya dahil değildir. |
| iOS Release | Yerel iOS arşivi oluşturuldu. Dağıtım imzası/Apple sunucu doğrulaması değildir. |
| iOS simulator | iPhone 17 Pro Max üzerinde native ana menü açıldı; gerçek 2868×1320 görüntü JPEG olarak kaydedildi. iPad simülatörü açılışta takıldı; iPad native doğrulaması tamamlanmadı. Tarayıcı ekranları App Store görseli sayılmaz. |
| Render önizlemesi | `517ca24` yayımlandı; ana oyun, kamera, gizlilik, destek ve servis çalışanı dosyaları yerel kaynakla aynı. Özel ses manifesti HTTP 404. |
| Canlı Arena | 26 Eylül kontrolü HTTP 200, `available:false`, `development:false`, kapasite 25. **Yayın engeli.** |
| App Store Connect | Tarayıcı giriş sayfası açıldı; hesap oturumu olmadığı için üyelik, kayıt ve ad rezervasyonu doğrulanamadı. |

## Gönderimden önce kalanlar

1. **Çevrim içi hizmet:** Mevcut Render planı ücretsiz/uyuyabilir ve Arena kapalı. Kalıcı PostgreSQL, TLS, yedek/geri yükleme, uyumayan sunucu, maliyet sınırı ve uyarı kurulmalı. Harcama kararı sahibine aittir. `NODE_ENV=production`, `RANKED_ENABLED=1`; `RANKED_DEV` ve `AUDIO_PREVIEW` kapalı. Gerçek iki cihazla eşleştirme, kopma, 15 saniyelik dönüş, sonuç ve hesap silme tekrarlanmalı. Geçerli sertifika doğrulaması kapatılmamalı.
2. **Apple hesabı:** Üyelik, App Store Connect uygulaması, kesin ad rezervasyonu, bundle ID, dağıtım sertifikası ve profil. Geliştirme sertifikasıyla telefona kurulum bunları kanıtlamaz.
3. **Son ses seçimi:** AudioHero/Humble ticari iOS kullanım yanıtı bekleniyor. Özel ses deneme uygulaması Debug ile sınırlı; App Store/TestFlight paketi değildir. Standart arşiv yalnız proje seslerini kullanır. Yeni kayıtlarla çıkılacaksa yazılı lisans, kapsam ve atıf incelenmeli; onaylı varlık kaydı güncellenmeli.
4. **İlk sürüm kapsamı:** Şu anda gerçek satış, reklam, ücretli rastgele kutu yok. Mağaza kazanılan oyun kaynaklarını kullanır. Gerçek satış istenirse StoreKit ürünleri, doğrulama, iptal/bekleme/iade/geri yükleme uçtan uca tamamlanmadan açılmaz.
5. **Mağaza beyanları:** Gizlilik etiketi, yaş anketi, ihracat beyanı, geliştirici iletişim telefonu, hedef ülkeler ve gerekiyorsa AB tacir bilgisi. Bunlar sahibin doğruladığı bilgilerle doldurulur; adres/telefon/şirket bilgisi tahmin edilmez.
6. **Cihaz kabulü:** Son imzalı Release sürümüyle iPhone 15, daha eski hedef iPhone ve iPad üzerinde ilk açılış, uçak modunda açılış, kayıt devamı, iki parmak, kenar kontrolleri, arka plana geçiş, ses kesintisi/kulaklık, 20 dakika maç döngüsü, bellek ve ısınma. Kullanıcı ve gerçek beta oyuncuları henüz bu kabulü vermedi.
7. **Mağaza görselleri:** Son sürümden gerçek iPhone 6,9 inç ve iPad 13 inç görüntüleri. Önerilen 5 ekran: üs, garaj, savaş, ilerleme, sonuç. Telefon simülatörü 2868×1320; iPad 13 inç 2752×2064 yatay. Alfa kanalı olmayacak. Özel ses testinin adı veya tarayıcı çubuğu görünmeyecek.
8. **Moderasyon işletimi:** Bildirim kuyruğu ve destek posta kutusunu düzenli inceleyecek kişi belirlenmeli. Şikâyeti yalnız veritabanına yazmak tek başına işletim değildir. Yanıt ve hesap işlemlerinin kaydı tutulmalı.
9. **Son Apple kontrolü:** Xcode Organizer ile Validate, dağıtım imzalama, App Store Connect işlem sonucu, gizlilik/SDK uyarıları; önce TestFlight kabulü, ardından inceleme. Yayın seçeneği ilk sürüm için elle yayın olarak değerlendirilebilir.

## Yaş derecelendirmesi için içerik envanteri

Apple anketi sonucu belirler; burada kesin bir yaş rozeti vaat edilmez. Tank ateşi, silah/namlu ve stilize patlamalar sık görülür. İnsan yaralanması, kan/gore, cinsel içerik, alkol/uyuşturucu, sağlık iddiası yok. Rekabetçi sıralama/yarışma vardır. Oyuncu takma adları kullanıcı içeriğidir; filtre, bildirim ve engelleme işlevleri beyan edilir. Sohbet, serbest web tarayıcısı veya reklam yoktur. Rastgele kozmetik kutuları bulunduğu için **rastgele ürün/loot box sorusu 'yok' diye geçilmemeli**; gerçek para kapalı olması bu içerik sorusunu ortadan kaldırmaz. Gerçek paraya çevrilebilir ödül/bahis yoktur. Uygulama Kids Category olarak sunulmayacak varsayımı mağaza sahibiyle doğrulanmalıdır.

## Gizlilik etiketi taslağı

| Apple veri türü | Amaç | Bağlantı | Takip |
|---|---|---|---|
| User ID | Takma ad, Arena hesabı, solo sıralama kimliği; işlevsellik | Evet | Hayır |
| Device ID | İzin verilen ölçüm için rastgele kurulum kimliği | Evet | Hayır |
| Gameplay Content | Maç, derece, envanter, hedef, paylaşılan skor | Evet | Hayır |
| Product Interaction | İzin verilen ekran/maç/işlem ölçümleri | Evet | Hayır |
| Performance Data | İzin verilen açılış zamanlaması | Evet | Hayır |
| Customer Support | Uygulama içi oyuncu bildirimi, destek talebi | Evet | Hayır |

Opsiyonel toplama da Apple beyanında değerlendirilir. Destek e-postasında gönüllü iletilen adres ve içeriğin istisna koşulları ayrıca kontrol edilmeli; otomatik e-posta toplandığı iddia edilmemeli. Sunucu IP/hosting log saklama ayarları doğrulanmalı. Bu taslak App Store Connect'e gönderilmedi.

Native kaynakta ve kurulu eklentilerde gerekli neden API kategorisi kullanan Preferences/Filesystem eklentisi yok; uygulama manifestinde erişilen API listesi boş bırakıldı. WKWebView localStorage'a sırf adına bakılarak UserDefaults nedeni eklenmedi. Xcode'un birleşik raporu ve Apple'ın yükleme tanılaması son doğrulamadır. Şifreleme uygulaması işletim sisteminin HTTPS/WSS ve Keychain hizmetleriyle sınırlı; `ITSAppUsesNonExemptEncryption=false` bunun teknik karşılığıdır, App Store beyanını sahibin onaylaması gerekir.

## Tekrar çalıştırılabilir kontroller

- `npm test`: temel testler; PostgreSQL testleri için ayrı, geçici `ARENA_TEST_DATABASE_URL` gerekir.
- `npm run audit:release`: varlık ve lisans bütünlüğü.
- `npm run sync:ios`: temiz standart iOS payload.
- `npm run audit:appstore`: teknik kontroller + açık gönderim koşulları. Çıkış 2 teknik olarak başarılı fakat dış koşullar eksik; çıkış 1 teknik hata; çıkış 0 tüm kayıtlı koşullar doğrulanmış demektir. `readiness.json` kanıt olmadan 'verified' yapılmamalı.
- `node tools/verify-app-store.cjs --live --app /ABSOLUTE/App.app`: aynı arşiv ve canlı destek/gizlilik/Arena denetimi.

## Resmî dayanaklar

Apple incelemede tam çalışan paket, erişilebilir sunucu, doğru mağaza bilgisi ve destek ister; beta dağıtımı için TestFlight kullanılır. [App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/) ve [App Review](https://developer.apple.com/app-store/review/).

Güncel yükleme SDK sınırı, yeni yaş anketi ve AB tacir doğrulaması zamanları ayrıca kontrol edildi. Bu bilgisayardaki Xcode 26.5 ve iOS 26.5 SDK mevcut alt sınırı karşılıyor. [Upcoming Requirements](https://developer.apple.com/news/upcoming-requirements/).

Gizlilik manifesti ve mağaza etiketi ayrı değerlendirmelerdir. [Apple privacy manifests](https://developer.apple.com/documentation/bundleresources/describing-data-use-in-privacy-manifests), [Capacitor privacy manifest](https://capacitorjs.com/docs/ios/privacy-manifest), [Manage App Privacy](https://developer.apple.com/help/app-store-connect/manage-app-information/manage-app-privacy/).

[Yaş kategorileri ve tanımları](https://developer.apple.com/help/app-store-connect/reference/app-information/age-ratings-values-and-definitions), [ekran görüntüsü boyutları](https://developer.apple.com/help/app-store-connect/reference/app-information/screenshot-specifications), [şifreleme beyanı](https://developer.apple.com/documentation/Security/complying-with-encryption-export-regulations).
