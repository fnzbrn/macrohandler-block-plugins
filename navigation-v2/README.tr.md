# Navigasyon V2 · 2.0.1

[Navigation-V2.mhblock indir](https://github.com/fnzbrn/macrohandler-block-plugins/releases/download/navigation-v2.0.1/Navigation-V2.mhblock) · [English guide](README.md) · [Sürüm sayfası](https://github.com/fnzbrn/macrohandler-block-plugins/releases/tag/navigation-v2.0.1)

**Uyumluluk:** 22 Ekim rota yönetimi, joystick salınımı ve grup seçimi güncellemelerini içeren Android uygulaması gerekir. Doğrulanan kaynak kaydı [manifest.json](manifest.json) içindedir. **1.0.52 sürüm adı tek başına yeterli değildir.** Bu yayın APK içermez ve Google Play uygulamasını güncellemez. İndirme sonrası Blok ekle → İçe aktar (.mhblock) yolunu kullanın; GitHub kaynak ZIP dosyasını seçmeyin.

Bu paket, Macro Handler içindeki Navigation native API 2 motorunu açar. İndirilen eklenti kendi başına yeni bir görüntü motoru kurmaz; **API 2 destekleyen güncel uygulama gerekir**. Eski uygulama paketi içe aktarırken güncelleme ister. Navigation Stop için mevcut ayrı `navigation_stop.mhblock` kullanılmaya devam eder.

## Kurulum

Blok kartında önce **Haritadan takip** veya **Mini haritadan takip** seç. **Harita ve rota kurulumu** yalnız seçilen kaynağın adımlarını gösterir. Mini harita modunda **Referans harita** ve **Mini harita kurulumu** ayrı adımlardır; büyük haritanın canlı ekran alanı ve imleç ayarları görünmez. Kaynağı değiştirmek için blok kartına dön; kayıtlı iki kaynağın ayarları korunur.

1. Mevcut makronun bir kopyasında V2 paketini içe aktar. Yeni blok mini harita ve canlı yön takibiyle başlar; mevcut V1 bloklarının ayarları değiştirilmez.
2. **Harita ve rota kurulumu → Referans harita**: oyunun büyük haritasını referans olarak kaydet/seç. Yalnız harita dokusunu al; pencere başlığı ve düğmeleri referansa dahil etme.
3. **Harita ve rota kurulumu → Rotalar ve noktalar → Yeni rota**: bu referansın üzerine sırayla rota çiz ve kaydet. Referansa sonradan çizilmiş ekran görüntüsünü yeni harita olarak yüklemek yerine uygulamanın rota düzenleyicisini kullan.
4. Büyük haritayı kapat. **Mini harita kurulumu** içinde mini haritanın görünür alanını seç; bu örnekte daire kullan. Dekoratif çerçeveyi kenar payıyla, sabit düğmeleri hariç tutma alanlarıyla dışarıda bırak.
5. Mini haritadaki oyuncu okunu ayrı öğret; ok üzerindeki konum noktasını ve baktığı yönü gösteren ucunu belirt. Büyük harita okunun görüntüsünü mini harita için yeniden kullanma.
6. Ok mini haritanın ortasında sabitse **Merkezde sabit** seç. Merkez arama yarıçapı, mini haritanın kısa kenarının yüzdesidir. Ok bu alanın içinde kalmalıdır. Merkez dışındaki benzer işaretler oyuncu sayılmaz. Oyuncu mini harita içinde yer değiştiriyorsa **Mini haritada hareketli** seç.
7. **Joystick** alanını ayarla. **Gözlem ve kalibrasyon** bölümündeki hareket etmeyen testte konum ve yön doğrulanmadan gerçek hareketi başlatma. Canlı testte oyun açık, mini harita görünür ve ekran çözünürlüğü kurulumla aynı olmalıdır.

## Davranış ve sınırlar

### Kayıtlı rotaları yönetme

**Harita ve rota kurulumu → Rotalar ve noktalar** bölümünde **Yeni rota**, **Rota ön izlemesi** ve **Seçili rota** alt alta yer alır. Yeni rota, referans harita üzerinde çizim açar. Ön izleme hareket göndermez. Seçili rota, aynı harita kurulumuna kaydedilmiş rotaları nokta ve grup çağrısı sayılarıyla listeler.

Listede rotaya dokunup **Rotayı seç** ile seçimi uygula. **Rota çiz veya düzenle** seçilen rotayı düzenler. **Sil**, rota adını gösteren onaydan sonra yalnız o rotayı ve ona ait nokta atamalarını kaldırır; harita, kalibrasyon, diğer rotalar ve makrodaki gruplar korunur. Seçili rota silinirse seçim boşalır; başka rota kendiliğinden seçilmez. Aynı rotayı kullanan diğer bloklarda da yeni rota seçilmelidir. Silme işlemi için liste açıkken değişen eski bir kaydın üzerine yazılmaz.

### Joystick salınımı

**Harita ve rota kurulumu → Joystick → Joystick salınımı ve şiddeti** bölümünde isteğe bağlı sağa-sola salınım açılabilir. Şiddet, takip yönünün iki yanında en fazla kaç derece sapılacağını belirler (0–15°); süre bir tam salınım döngüsüdür (400–10000 ms). Başlangıçta kapalıdır ve eski makroların hareketini değiştirmez. Salınım joystick itme mesafesini artırmaz.

İki harita kaynağı ve iki hareket kontrol modu aynı ayarları kullanır. Yön öğrenimi, rota düzeltmesi ve varış yaklaşımı salınımdan önceliklidir. Salınım ayrı bir dokunma döngüsü başlatmaz; yalnız güncel konumla kabul edilmiş hareket komutlarına uygulanır. Kalibrasyon hareketleri salınımla değiştirilmez. Dar geçişlerde düşük şiddet seçin; mevcut rota, zaman aşımı ve durdurma kontrolleri geçerlidir.

### Sabit kamerayla yönlendirme

Kamera karakterin arkasına kendiliğinden dönmüyorsa **Harita ve rota kurulumu → Hareket modu ve ayarları → Canlı yön ayarları → Sabit kamera** seçilebilir. Açık bir alanda joystick'i yukarı ittiğinde karakterin **referans haritada** hangi yöne gittiğini belirle: sağ 0°, aşağı 90°, sol 180°, yukarı 270°. Ara açılar da girilebilir. Yatay yön ters çalışıyorsa ilgili seçeneği kullan. Kamera açısını değiştirirsen eşleşmeyi tekrar ayarla; başka bir oyunun veya kamera açısının değerini kopyalama.

Bu seçenek ilk yön ilişkisini öğrenmek için yapılan hareketleri kaldırır. Gerçek mini harita eşleşmesi, imleç yönü, hareket ve rota sınırı denetimleri devam eder. Oyun dönüşü tamamlamadan hedef komutu sürekli değiştirilmez; yönün doğrulanması mevcut süre sınırını aşarsa joystick bırakılır. Yanlış kamera ayarı sessizce başka bir yöne dönüştürülmez. Varsayılan **Çalışırken öğren** ve mevcut tam harita ayarları korunur. Sabit kamera seçimi bir hız veya durma mesafesi kalibrasyonu değildir.

Bu ayarlar güncel uygulama motorunu gerektirir; eski `.mhblock` dosyasını yeniden içe aktarmak motoru güncellemez. Kurulumun kaydedildiği kadar çalıştırılan makroya da aktarılması gerekir; uygulama eski derlenmiş makro önbelleğini otomatik yeniler.

### İki takip modunda grup çağrıları

Önce aynı makronun çalışma alanında bir grup oluşturup çalıştırılacak blokları içine ekleyin. **Grup çağrıları → Periyodik grup** ekranının üstündeki **Çağrılacak grubu seç** alanında grup adını seçin; seçili ad ana grup ekranında da gösterilir. Grup bulunmuyorsa seçim listesi boş kalır ve grup oluşturma açıklaması görünür.

Nokta çağrısı düğmesi rota düzenleyicisini doğrudan nokta seçme modunda açar. Haritada bir noktaya dokununca panel o noktanın grup seçim alanına kayar; grup adını ve yarıçapı seçip rotayı kaydedin. Atanmış noktaların grup adları ana grup ekranında listelenir.

Blok üzerindeki **Grup çağrıları** düğmesi veya **Harita ve rota kurulumu → Grup çağrıları** ortak ayarları açar.

- **Nokta işlemi ekle**: seçili rotanın düzenleyicisinde nokta işaretleme aracını kullanıp o noktaya grubu ata. Noktaya ulaşılınca joystick bırakılır; grup tamamlanır ve yeni konum doğrulanarak devam edilir. Aynı noktadaki işlem her geçişte bir kez çalışır.
- **Periyodik grup → Hareket sırasında tara**: navigasyon sürerken resim/renk gibi gözlem işlemlerini çalıştırır. Önceki çağrı bitmeden yenisi başlamaz. Ekrana dokunacak bir işlem öncesinde **Navigasyonu durdur** gerekir; bu seçenek navigasyonu sonlandırır.
- **Periyodik grup → Duraklat, grubu çalıştır, devam et**: seçilen aralıkta joystick bırakılır, grup çalışır ve güncel konum doğrulandıktan sonra rota sürer. Tıklama gibi ekran işlemleri için bu modu seç. Grubun ekranı veya karakter konumunu değiştirmesi takip koşullarını bozarsa hareket güvenli biçimde durur.

Periyodik çağrılar birikmez. Rota noktasındaki işlem aynı anda zamanı gelen periyodik çağrıdan önce çalışır. Durdurma, zaman aşımı veya grup hatası sonrasında eski konuma dayanarak hareket başlatılmaz. Bu özellikler güncel uygulamanın gömülü motorundadır; `.mhblock` dosyasını yeniden içe aktarmak tek başına uygulamayı güncellemez.

### İmleç öğretimi ve harita kenarı

Şeffaf kesilmiş bir okun konum noktası koyu kenarına denk gelmişse, AUTO modu yalnız aynı bağlı nesnenin çoğunluğu ile belirtilen yön ucu aynı rengi doğruladığında oku o renkten tanır. Konum/yön işaretleri yer değiştirmez ve kayıtlı profil yeniden yazılmaz. Gerçek siyah imleçler, opak kırpmalar ve açıkça seçilmiş diğer algılama modları bu düzeltmeye dahil değildir. Referansın çok ince dış çerçevesi mini harita karşılaştırmasına katılmaz; dört bölgedeki arazi doğrulaması korunur.

- Konum, o anki mini harita dokusunun kayıtlı büyük haritadaki eşleşmesinden; yön, öğretilen okun yönünden hesaplanır. Dönen mini harita için yön referans harita koordinatlarına dönüştürülür.
- Referans haritanın ve mini harita alanının piksel boyutlarının aynı olması gerekmez. Aynı arazinin ölçek ve dönüş farkı görüntüden hesaplanır; dosyaları aynı boyuta getirmen gerekmez. Koyu haritalarda da yeterli ortak yol/zemin ayrıntısı gerekir; düz veya belirsiz görüntüyle konum üretilmez.
- Küçük hizalama hatalarında yalnız doğrulanmış eşleşmenin yakın çevresi hassaslaştırılır. Dairesel alanın kenar dokusu gereksiz silinmez; eşleşme yine dört ayrı bölgede doğrulanır. Mini haritadaki başka bir işaret oyuncu okunu örtüyorsa yön tahmin edilerek hareket sürdürülmez.
- Merkez seçimi oyuncunun varlığını varsaymaz: gerçek ok ve harita eşleşmesi yine gerekir. Kayıp, belirsiz veya eski görüntü mevcut hareket durdurma denetimlerinden geçemez.
- Merkezde sabit mini harita okunun yönü dönüş sırasında kısa süre belirsizleşirse önce joystick bırakılır. Sınırlı yeniden gözlemde yeni konum ve yön doğrulanırsa rota sürer; belirsizlik devam ederse durur. Önceki yön tahmin olarak kullanılmaz.
- Küçük okun ara açılarda kaba taramadan kaçması daha hassas açı aramasıyla kontrol edilir. Dönüş sürerken joystick tepkisi öğrenilmiş sayılmaz; aynı komutta üç güncel yön ölçümünün birlikte tutarlı olması gerekir. Bu bekleme de süre ve rota sınırlarına tabidir.
- Merkezde sabit mini haritada joystick tepkisi doğrulandıktan sonra yönlendirme, çizilen rotanın ilerideki hedef noktasını kullanır. Dar geçişlerde rota merkezine dönüş, hız ayarının baskıladığı zayıf bir düzeltmeye dönüşmez. Rota koridoru ve durma sınırları korunur.
- Yön ilişkisi öğrenildikten sonra hedef yön güncel konuma göre yenilenir; dönüşün bitmesi beklenirken eski hedefte takılı kalmaz. Yeni hedefler doğrulama süresini sonsuza kadar uzatamaz; yön ilişkisi yeniden doğrulanamıyorsa joystick bırakılır.
- Joystick ile yön arasındaki ilişki henüz doğrulanmadıysa en fazla iki sınırlı yön değişimiyle tepki aranır. Bunlar hareket veya varış kanıtı sayılmaz; gerçek tepki görülmezse durur. Hedefte başlayan yeni bir çalıştırma, önceki çalıştırmanın hareket kanıtını devralmaz.
- **Haritadan takip** seçeneği korunur. Kaynak değiştirmek kayıtlı haritayı, rotaları veya büyük harita imleci öğretimini silmez. Ölçülmüş kalibrasyon farklı kaynaklar arasında taşınmaz.
- Bu özellik çizilmiş rotayı izler; duvarları keşfeden veya engellerin etrafından kendisi yeni yol çizen bir yol bulucu değildir. Farklı harita stili, çok az ayrıntı, örtülen mini harita ve benzer bölgeler eşleşmenin reddedilmesine yol açabilir.

## Denetim, sınırlar ve geri dönüş

22 Ekim denetiminde 680 uygulama + 200 çekirdek birim testi ve LDPlayer'da 60 Android testi geçti. İki harita kaynağı, gerçek native görüntü eşleştirme yolu, grup çağrıları, durdurma, kayıt aktarımı ve düzenleyici yaşam döngüsü kontrol edildi. Yayımlanan dosyanın içe aktarma kontrolü manifestte ayrıca kayıtlıdır.

Bunlar her oyunda tam rota tamamlanması veya fiziksel cihaz doğrulaması değildir. Önceki Mobile2 denemelerinde sınırlı hareket doğrulandı; baştan sona ARRIVED sonucu elde edilmedi. Az ayrıntılı zemin konumu belirsiz bırakabilir. Ölçülen konum belirsizliği varış yarıçapından büyükse varış reddedilir; algılama eşikleri düşürülerek başarı sayılmaz.

Ekran yakalama ve erişilebilirlik izinleri, kullanılan eylemlerin üyelik kuralları geçerlidir. Gözlem hareket göndermez; hareket kalibrasyonu joystick kullanır ve açık alanda denenmelidir.

2.0.1, güncel motor desteğini açıklayan paket/rehber yenilemesidir. Yerleşik motordaki yeni özellikleri eski uygulamaya taşımaz. Aynı paket kimliği korunur; 2.0.1 ayrı kitaplık sürümüdür ve mevcut makroları değiştirmez.

[V2 2.0.0](https://github.com/fnzbrn/macrohandler-block-plugins/releases/tag/navigation-v2.0.0) ve [V1 v1.1.0](https://github.com/fnzbrn/macrohandler-block-plugins/releases/tag/v1.1.0) dosyaları korunur. Eski makro/kurulum kopyanızı saklayın. İndirmeleri [SHA256SUMS](SHA256SUMS) ile karşılaştırın. Depo lisansı paket ve rehberleri kapsar; Android motorunu veya üçüncü taraf oyun görsellerini kapsamaz.
