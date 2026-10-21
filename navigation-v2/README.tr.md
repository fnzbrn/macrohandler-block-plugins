# Navigation V2 — referans harita ile mini harita takibi

Bu paket, Macro Handler içindeki Navigation native API 2 motorunu açar. İndirilen eklenti kendi başına yeni bir görüntü motoru kurmaz; **API 2 destekleyen güncel uygulama gerekir**. Eski uygulama paketi içe aktarırken güncelleme ister. Navigation Stop için mevcut ayrı `navigation_stop.mhblock` kullanılmaya devam eder.

## Kurulum

Blok kartında önce **Haritadan takip** veya **Mini haritadan takip** seç. **Harita ve rota kurulumu** yalnız seçilen kaynağın adımlarını gösterir. Mini harita modunda **Referans harita** ve **Mini harita kurulumu** ayrı adımlardır; büyük haritanın canlı ekran alanı ve imleç ayarları görünmez. Kaynağı değiştirmek için blok kartına dön; kayıtlı iki kaynağın ayarları korunur.

1. Mevcut makronun bir kopyasında V2 paketini içe aktar. Yeni blok mini harita ve canlı yön takibiyle başlar; mevcut V1 bloklarının ayarları değiştirilmez.
2. **Harita ve rota kurulumu → Referans harita**: oyunun büyük haritasını referans olarak kaydet/seç. Yalnız harita dokusunu al; pencere başlığı ve düğmeleri referansa dahil etme.
3. **Harita ve rota kurulumu → Rotalar**: bu referansın üzerine sırayla rota çiz ve kaydet. Referansa sonradan çizilmiş ekran görüntüsünü yeni harita olarak yüklemek yerine uygulamanın rota düzenleyicisini kullan.
4. Büyük haritayı kapat. **Mini harita kurulumu** içinde mini haritanın görünür alanını seç ve onayla; aynı kurulum panelinden imleç öğretimine devam et. Mini harita ayarlarını da kaydet. Haritan daireselse daire seç. Dekoratif çerçeveyi kenar payıyla, sabit düğmeleri hariç tutma alanlarıyla dışarıda bırak.
5. Mini haritadaki oyuncu okunu ayrı öğret; ok üzerindeki konum noktasını ve baktığı yönü gösteren ucunu belirt. Büyük harita okunun görüntüsünü mini harita için yeniden kullanma.
6. Ok mini haritanın ortasında sabitse **Merkezde sabit** seç. Merkez arama yarıçapı, mini haritanın kısa kenarının yüzdesidir. Ok bu alanın içinde kalmalıdır. Merkez dışındaki benzer işaretler oyuncu sayılmaz. Oyuncu mini harita içinde yer değiştiriyorsa **Mini haritada hareketli** seç.
7. **Joystick** alanını ayarla. **Gözlem ve kalibrasyon** bölümündeki hareket etmeyen testte konum ve yön doğrulanmadan gerçek hareketi başlatma. Canlı testte oyun açık, mini harita görünür ve ekran çözünürlüğü kurulumla aynı olmalıdır.

## Davranış ve sınırlar

- Konum, o anki mini harita dokusunun kayıtlı büyük haritadaki eşleşmesinden; yön, öğretilen okun yönünden hesaplanır. Dönen mini harita için yön referans harita koordinatlarına dönüştürülür.
- Merkez seçimi oyuncunun varlığını varsaymaz: gerçek ok ve harita eşleşmesi yine gerekir. Kayıp, belirsiz veya eski görüntü mevcut hareket durdurma denetimlerinden geçemez.
- Merkezde sabit mini harita okunun yönü dönüş sırasında kısa süre belirsizleşirse önce joystick bırakılır. Sınırlı yeniden gözlemde yeni konum ve yön doğrulanırsa rota sürer; belirsizlik devam ederse durur. Önceki yön tahmin olarak kullanılmaz.
- Joystick ile yön arasındaki ilişki henüz doğrulanmadıysa en fazla iki sınırlı yön değişimiyle tepki aranır. Bunlar hareket veya varış kanıtı sayılmaz; gerçek tepki görülmezse durur. Hedefte başlayan yeni bir çalıştırma, önceki çalıştırmanın hareket kanıtını devralmaz.
- **Haritadan takip** seçeneği korunur. Kaynak değiştirmek kayıtlı haritayı, rotaları veya büyük harita imleci öğretimini silmez. Ölçülmüş kalibrasyon farklı kaynaklar arasında taşınmaz.
- Bu özellik çizilmiş rotayı izler; duvarları keşfeden veya engellerin etrafından kendisi yeni yol çizen bir yol bulucu değildir. Farklı harita stili, çok az ayrıntı, örtülen mini harita ve benzer bölgeler eşleşmenin reddedilmesine yol açabilir.

## Geri dönüş

Yayımlanmış V1 paketinin `v1.1.0` varlığı değiştirilmedi:
https://github.com/fnzbrn/macrohandler-block-plugins/releases/tag/v1.1.0

Eski makro/kurulum kopyasını sakla. V2, kitaplıkta aynı yerleşik navigasyon kimliğinin (`com.macrohandler.navigation`) ayrı **2.0.0** sürümüdür; mevcut V1 bloklarını kendiliğinden değiştirmez. İki sürüm de kurulu uygulamanın motorunu kullanır.

## İndirme ve uyumluluk

[Navigation-V2.mhblock indir](https://github.com/fnzbrn/macrohandler-block-plugins/releases/download/navigation-v2.0.0/Navigation-V2.mhblock)

Dosyayı Android cihazına indir. **Blok ekle → İçe aktar (.mhblock)** yoluyla içe aktar; **Pluginler → Navigation V2** girişini seç. GitHub kaynak ZIP dosyasını içe aktarma. Gerekirse [Navigation Stop paketini](https://github.com/fnzbrn/macrohandler-block-plugins/releases/download/v1.1.0/navigation_stop.mhblock) ayrıca ekle.

Bu ayrı V2 önizleme yayını, **21 Ekim mini harita kurulum düzeltmelerini içeren Navigation API 2 uygulamasını** gerektirir. Yalnız `1.0.52` sürüm yazısı yeterli değildir; aynı sürüm numaralı eski uygulamalar bu desteği içermeyebilir. Bu yayın APK içermez ve Google Play uygulamasını güncellemez. Uyumlu uygulama kaynak kaydı [manifest.json](manifest.json) içindedir.

## Doğrulama kapsamı

Güncel uygulamadaki mini harita alanı kaydetme/geri dönüş düzeltmesi 625 JVM testi ve 8 Android arayüz senaryosuyla kontrol edildi. Alan/hariç bölge kaydetme ve iptal, kayıtlı alanı yeniden açma, imleç seçimine devam etme, yatay/dikey görünüm ve iki takip kaynağı kapsandı. Normal LDPlayer kullanımında da seçilen alanın korunduğu görüldü.

Bu sonuçlar her oyunda tam rota veya fiziksel cihaz doğrulaması değildir. Önceki canlı oyun kontrolü sınırlı bir rota bölümünü kapsar; kendi rotanı önce kısa bir denemeyle doğrula.

[SHA256SUMS](SHA256SUMS) indirme bütünlüğünü denetlemek içindir. Depodaki MIT lisansı eklenti tanımını ve kılavuzları kapsar; Android motorunun veya üçüncü taraf oyun varlıklarının lisansını değiştirmez.
