# Premium mobil sürüm — uygulama ve yayın durumu

26 Eylül 2026. Bu çalışma ticari yayın onayı değildir. Çalışan platform Three.js + Capacitor; Unity taşıması yapılmadı. Eski solo kayıtlar ve lisans dışı bırakılan dosyalar korunur.

## Bu sürümde uygulananlar

- Grafit/lime/bakır arayüz; beş ana gezinme bölümü; sahne içinde 3B ana üs; kompakt yatay garaj, beş kategori, üç kayıtlı kombin; yatay sezon yolu; ayrı Arena mağazası, lig, kuyruk ve sonuç ekranları.
- Bağımsız hareket ve kule nişanı; iki ayrı parmak kimliği, odak kaybı ve ayarlarda bırakma; solak düzeni, kontrol boyutu, azaltılmış hareket. Fare nişanı dünya düzlemine dönüştürülür.
- Blender MCP ile 15 mevcut Mk2 tanktan türetilmiş kenar/malzeme işçiliği geliştirilmiş garaj modeli. Savaşta Mk2 kullanılır. Ana Blender sahnesi korunarak ayrı Premium-Fleet.blend kopyası oluşturuldu. Her türevin kaynak ve çıktı özeti kayıtlıdır.
- Ortak deterministik savaş: 30 Hz, 3 can, 1 hasar, 5 imha, 180 saniye, 30 saniye uzatma, 2 sekme, 2 saniye doğma. Görünüm savaş parametresi değildir. Üç simetrik harita; rekabetçi sürümlerde çevresel hasar/güçlendirme yok. Açıkça işaretli bot aynı simülasyonu kullanır; ödül veya derece üretmez.
- Sunucu hareketi, mermiyi, hasarı, sonucu hesaplar. Eski sonuç bildirimleri kabul edilmez. 15 Hz durum gönderimi, yerel hareket tahmini ve rakip yumuşatması. Tek eşleştirme kuyruğu, beceri aralığı, gecikme kontrolü, 15 saniyelik yeniden bağlanma.
- PostgreSQL üzerinde sonuç + iki oyuncunun cüzdanı/ilerlemesi tek işlem; maç kimliğiyle tekrar koruması. Üretimde veritabanı yoksa Arena kapalıdır. Bellek deposu yalnız açıkça etkinleştirilmiş yerel testte kullanılır.
- Günlük üç davranış hedefi, ilk tamamlanan maç bonusu, haftalık hedef. Altı içeriği belirli kozmetik teklif, hedef sabitleme, sunucu envanteri. Eski altın/elmas kataloğu korunur. Gerçek para satışı ve zorunlu reklam kapalıdır.
- Tek kullanımlık hesap kurtarma, anahtar özeti saklama, oturum döndürme, hesap silme. iOS oturumu özel Keychain eklentisine taşınır. Solo kayıtlar cihazlar arasında taşınmaz.
- Sürümlü yerel kayıt geçişi ve önceki kaydın cihazda yedeği; tekrar geçiş envanter/bakiye üretmez.
- Gerçek kare süresiyle devamlı kalite kontrolü; savaş görüş oranı 16:9; görünür can çubukları/nişan çizgisi ve savaş efektleri.

## Doğrulama

- 51/51 otomatik test, geçici gerçek PostgreSQL dahil geçti; atlanan test yok.
- Gerçek yerel WebSocket eşleşme, sahte sonuç reddi, yeniden bağlanma, hükmen sonuç, 25 eşzamanlı maç + 2 bekleyen oyuncu, 50/100/150 ms ve değişken gecikmeli girdiler.
- Eşzamanlı 15 sonuç kaydı bir ödül; eşzamanlı 10 aynı kozmetik isteği bir ücret; kurtarma kodunu eşzamanlı kullanma tek başarı; hesap silmede kimlik temizleme.
- iOS Simulator Debug derlemesi başarılı; yatay ana menü görsel olarak incelendi. Bu fiziksel iPhone performans testi değildir.
- Lisans kapısı: 114 yayın kaydı doğrulanır, 20 dışlanmış kayıt yayınlanmaz. Yeni paket yaklaşık 15.4 MB; garaj modelleri tembel yüklenir.

## Henüz tamamlanmayan işler — yayın kapıları

1. **Ticari ödeme:** StoreKit ürünleri, Apple sunucu doğrulaması, bildirimler/iade ve geri yükleme henüz uygulanmadı. Kodda satış kapısı kapalı kalır. Hesap kurtarma mevcut olsa da Apple ile Giriş veya doğrulanmış e-posta bağlama yoktur.
2. **Sanat standardının tamamı:** Yeni tank modelleri mevcut geometrinin iyileştirmesidir; 15 tankın her birine ayrı sanat yönetimi, özel animasyon, savaş LOD optimizasyonu ve bütün 16 solo çevre setinin yeniden tasarımı tamamlanmış değildir. Rakip kozmetik kombinlerinin ağ üzerinden tam gösterimi, rekabetçi efekt sadeleştirme seçeneği ve bütün kozmetiklerin birlikte karşılaştırılması henüz eksiktir.
3. **Sezon:** Mevcut solo sezon korunmuştur ve açıkça etiketlidir. Sunucuda doğrulanan yeni kozmetik sezon bileti ve ücretli kozmetik ödül yolu henüz yoktur. Eski kaydı ücretli doğrulanmış bakiye gibi kabul etmeyin.
4. **Kontroller/eğitim:** Boyut ve solak düzeni mevcut; serbest konum düzenleme ve ayrı nişan hassasiyeti editörü eksiktir. Eğitim metni yeni kontrole uyarlandı; siper odaklı yeni eğitim alanı ve ilk kozmetik seçimi akışı tamamlanmadı.
5. **Canlı altyapı:** Uyumayan ücretli hizmet ve kalıcı canlı PostgreSQL bu çalışmada satın alınmadı. Maliyet uyarısı, gerçek bölge/cihaz gecikmesi, yük altında veritabanıyla 25 maç ve sunucu arıza operasyonları canlı ortamda doğrulanmalıdır. Yerel yük testi üretim kapasite garantisi değildir.
6. **Saha testi:** Fiziksel iPhone 13 ve eski hedef cihazda 20 dakika, 60/30 FPS, bellek, pil/ısınma ve iki parmak hissi ölçülmedi. TestFlight imzalama/dağıtım ve 10 yeni oyuncuyla eğitim testi yapılmadı. D1/D7 hakkında başarı iddiası yoktur.
7. **Son sunum turu:** Tüm alt ekranlar ve metinler/ikonlar ortak bileşenlere bütünüyle ayrıştırılmadı. Erişilebilirlik, VoiceOver ve bütün iPad oranları için ayrı cihaz turu gerekir. Ana dosya küçültülmeye başlandı; tüm ekonomi ve arayüz modülerleşmesi tamamlanmadı.

## Çalıştırma / işletim

Yerel demo: `PORT=8736 RANKED_DEV=1 node server.js`. Test hesapları bellek içindedir; yeniden başlatılınca kaybolur. Bu bayrağı canlıya taşımayın.

Üretim: `NODE_ENV=production`, `DATABASE_URL`, `RANKED_ENABLED=1`. TLS sertifikası doğrulanır; özel CA gerekiyorsa `DATABASE_CA` sağlanır. `DATABASE_SSL=disable` yalnız üretim dışında kabul edilir. Eski oda sunucusu varsayılan kapalıdır; `LEGACY_ROOMS=1` rekabetçi yayın için kullanılmamalıdır.

Arena'yı kapatmak: `RANKED_ENABLED=0` ve yeniden başlatma. Gerçek satış zaten derleme içinde kapalıdır. Render'ın mevcut ücretsiz hizmet ayarı bu çalışmada ücretliye çevrilmedi.

`npm run audit:release` ve `npm run build:www`; iOS için `npm run sync:ios`. Native kaynak `native/ios/ArenaVault.swift`, tekrarlanabilir proje hazırlığı `tools/prepare-ios.cjs`; üretilen ios/ depoya eklenmez.

`npm test` veritabanı testlerini bağlantı verilmediyse atlar. Ayrı, geçici test veritabanıyla `ARENA_TEST_DATABASE_URL=... npm test`. Canlı veritabanını testlere vermeyin.

## Yayın kararı

Bu sürüm **inceleme ve beta geliştirme sürümüdür**. Planın tamamlanmış sayılma ölçütü henüz karşılanmamıştır. Mağaza, dereceli ticari yayın ve başarı/oyuncu tutma iddiaları yukarıdaki kapılar geçilmeden açılmamalıdır.

### Telefon kadrajı düzeltmesi — 26 Eylül
- Önceki 18 birim yüksek kamera, kısa yatay telefon ekranında tankı gereğinden küçük gösteriyordu. Ortak kamera profili yatayda 12.5 birim; solo dikey önizlemede önceki 18 birim korunur. Arena bütün cihazlarda aynı 16:9 dünya kadrajını kullanır.
- Solo takipte konum ve bakış hedefi birlikte hareket eder; maça girişte kamera doğrudan yerleşir. Takip ağır çekimden bağımsız gerçek zaman kullanır.
- Savaş sırasında görev/ekonomi bildirimleri sırada bekler; güncelleme şeridi gizlenir. Küçük yatay ekranda mini harita ve dalga başlığı küçültülür. Ekran çevrilmesi ve boyut değişiminde girdiler sıfırlanır.
- Kamera izdüşüm testleri 844×390, 667×375 ve 852×320 boyutlarında standart 3 birim tank genişliğinin en az 65 CSS piksel kaldığını; rekabetçi kadrajın cihazdan bağımsız olduğunu doğrular. Tarayıcıda 844×390 solo ve 667×320 antrenman görsel olarak kontrol edildi.
- iOS simülatör derlemesi başarılı. Simülatör ana ekranı açıldı ancak dokunma otomasyonu pencere hatası verdi; bu kontrol fiziksel telefon oynanış testi sayılmaz.

### Mevcut haritalar ve mavi atölye paleti — 26 Eylül
- Yeni harita eklenmedi. 16 mevcut haritanın grid özeti sabit bir regresyon testiyle korunuyor; yollar, siper çarpışmaları ve doğma düzenleri değiştirilmedi.
- Her haritaya ayrı duvar/kapak/taban/işaret paleti verildi. Özgün kodla üretilen yüzey dokusu, üst kapak, servis paneli, taban şeridi, küçük ışık işaretleri ve düşük kontrastlı zemin lekeleri eklendi. Çöl, kanyon ve kar temalarında mat doğal yüzeyler kullanılıyor.
- Dekor katmanı en fazla 7 instanced çizim grubu ekler; ek dinamik ışık ve harici görsel dosya indirmez. Harita değiştirilince kendi geometri, malzeme ve dokularını serbest bırakır. Fiziksel cihaz performansı ayrıca ölçülmelidir.
- Menü ve garaj mevcut özgün atölye mimarisinde kaldı; lacivert/mavi yüzeyler, buz turkuazı gezinme ve sıcak turuncu ana eylem paletine geçti. Rakip oyundan görsel, logo, model veya arayüz dosyası alınmadı.
- 16 haritanın malzemeleri yerel kontrol galerisinde karşılaştırıldı. Yakın kamera korunarak oyun içi kontrol, telefon boyutunda menü/garaj kontrolü, lisans kapısı ve iOS derlemesi yapıldı. 55 test geçti; veritabanı gerektiren 2 test atlandı.

### TREAD RIVALS marka ve açılış — 26 Eylül
Kullanıcı, mevcut benzer mağaza adları nedeniyle War of Tanks yerine TREAD RIVALS adını seçti. Görünen uygulama adı, menü, paylaşım metinleri, web manifesti ve gizlilik sayfası güncellendi; bundle ID, kayıt anahtarları ve sunucu adresi korundu.

Yerleşik görsel üretim aracıyla tank simgesi ve şeffaf yazılı logo oluşturuldu. Kaynaklar, tam istemler ve üretim yöntemi `design/brand/PROVENANCE.md` içinde. 1024px opak iOS simgesi, web simgeleri ve yerel açılış görseli hazırlandı. Web logosu 177 KB; kaynak PNG'ler korunuyor. Yeni dosyalar varlık kayıtlarına dahil edildi. Marka tescili ve App Store adı rezervasyonu doğrulanmış değildir.

Gerçek yükleme katmanı artık logoyu ve tamamlanan 3 başlangıç varlığını gösterir; hata durumunda logo ile yeniden deneme kalır. Yerel ağ gecikmesi verilerek açılış ekranı ve ardından menüye geçiş doğrulandı. Telefon boyutunda logo yerleşimi kontrol edildi. iOS adı ve simge/açılış kataloğu `prepare-ios.cjs` ile her eşitlemede tekrar üretilir. Bu değişiklik App Store gönderimi, imzalama veya inceleme onayı anlamına gelmez.
