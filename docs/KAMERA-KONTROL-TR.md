# Yön farkındalığı olan savaş kamerası

26 Eylül 2026. Kullanıcının iPhone 15 denemesinde aşağı ilerlerken rakibi geç görmesi üzerine solo, bot antrenmanı ve 1v1 kamerası ortak davranışa geçirildi.

## Sorun

Eski perspektif, tank yüksekliğindeki kullanılabilir ekran bandında yukarıya yaklaşık 10,4; aşağıya 5,2 dünya birimi gösteriyordu. Solo kameradaki sürekli nişan ofseti ve takip gecikmesi aşağı görüşünü daha da azaltıyordu. Arena kamerasında hareket yönüne bakış payı yoktu.

## Yeni davranış

- Haritanın yönü sabit; tank veya kule döndüğünde kamera dönmez.
- Bakış açısı zemine göre yaklaşık 53° yerine 66°. Yakın tank ölçeği ve 50° görüş açısı korunur; hareket sırasında uzaklaştırma yapılmaz.
- Perspektifin aşağı görüş kaybı, nötr odak merkezinde telafi edilir.
- Hareket varsa yol önceliklidir. Aynı anda ateş edilirken yön payının %85'i harekete, %15'i nişana ayrılır; geriye ateş etmek kamerayı yolun tersine çekmez.
- Dururken etkin nişan/ateş yönüne bakılır. Sağ çubuk bırakılınca eski kule yönü kamerayı çekmez; odak yavaşça merkeze döner.
- Takip ve yön ofseti ayrı yumuşatılır. Patlama sarsıntısı takip konumuna birikmez. Yeniden doğma veya ışınlanmada arena boyunca kamera uçuşu olmaz.
- Azaltılmış hareket ayarında bakış kayması azalır. Rekabetçi cihazlar aynı 16:9 dünya görüşünü kullanır.

## Kontroller

Kamera testleri; dört yönde 8,5 birim öndeki hedefin görünürlüğünü, yukarı/aşağı dengeli görüşü, ters yöne ateşi, boştaki kule yönünü, 30/120 FPS karşılaştırmasını, yön değişimini, harita sınırını ve yeniden doğmayı kapsar. Hareket sırasında kullanılabilir yukarı/aşağı görüş 8,8 birimin üzerinde dengelendi. Bu sayılar kamera izdüşümü ölçümüdür; siper arkasındaki hedefin çizileceği garantisi değildir.

Tüm testler: 69 test, 67 başarılı; mevcut PostgreSQL gerektiren 2 test atlandı. iPhone 15 boyutunda tarayıcı antrenmanı açıldı; yeni açı görüntülendi, çalışma hatası görülmedi. Karşılaştırma görüntüleri `review-2026-09-26/camera-before-direction.png` ve `camera-after-direction.png`.

Telefon denemesi: **TREAD Ses Testi → ANTRENMAN**. Açık alanda önce aşağı/yukarı git; sonra aşağı giderken yukarı ateş et; son olarak durup sağ çubukla farklı yönleri nişanla. Kontrolün rahatlığı için son fiziksel cihaz değerlendirmesini kullanıcı yapacak.

## Son mesafe ayarı

Kullanıcının yakın görüş geri bildiriminden sonra kamera mesafesi %12 artırıldı: yatay yükseklik 12,5 → 14. FOV ve bakış açısı korunur, tank ölçeği hâlâ telefon testlerindeki alt sınırın üzerinde. Bu sürüm 26 Eylül 2026 20:00’da iPhone 15 kişisel test uygulamasına kuruldu.
