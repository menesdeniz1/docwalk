# docwalk Roadmap durumu

Kaynak: `ROADMAP.md`, `main` = `77871a8`. Kapsam: tüm maddeler, sonsuz canvas fikri hariç (Roadmap'te yok). Site yayınlanmadı. İş devredildi, bu dosya devir anındaki durumdur.

Durumlar: `yapıldı` (commit), `sürüyor` (bir branch'te yarım), `bekliyor` (başlanmadı), `atlandı` (sebep).
`yalnız CI`: yerelde koşulmadı. "Birleşmedi": `feat/roadmap-next-up` içinde değil.

## Still open in v1

| ID | Madde | Durum | Kanıt veya sebep |
|---|---|---|---|
| S1 | Karar 8: uzaktan kumandanın v1'e taşınması | yapıldı | `3dbca03`, karar 82 |
| S2 | Karar 39: ekran görüntüsü ve ARIA testleri | yapıldı | `b5beba9` ARIA, CI yeşil; görüntü testi yazılmadı, Ubuntu PNG üretilemiyor, karar 85 ile daraltıldı |
| S3 | Karar 43: açılış bütçesini yeniden ölç | yapıldı | `8ad129b`; yerel ortanca 1774 ms, CI 2559 ms, bütçe 1500 ms tutmuyor; iyileştirme yapılmadı, sahip kararı |
| S4 | Round-1 refinement karar satırları | yapıldı | `3dbca03`, karar 83 ve 84 |

## Next up

| ID | Madde | Durum | Kanıt veya sebep |
|---|---|---|---|
| N1 | Konuşmacı notları | yapıldı | `9642add`, CI yeşil |
| N2 | Kod, görsel, tablo odak görünümü ve satır vurgusu | yapıldı | `a6540ab`, karar 87; CI `1a0b168`: WebKit'te 1 test kırık (`e2e/focus-view.spec.ts:187`, axe `AbortError`), kalan 5 iş yeşil; düzeltilmedi |
| N3 | Lazer, çizim ve odak aynalama | sürüyor | `6a68498`, `fbfef5c`, karar 88, `feat/roadmap-next-up` üzerinde. Kod, görsel, tablo odağı ve satır işaretleri aynalanmıyor; sunucu penceresi diyagram odağını göstermiyor. **Zorunlu Opus incelemesi yapılmadı.** CI kırmızı: run 42515099653, `e2e/app.spec.ts:138` üç motorda (aynalamanın kırdığı test) ve WebKit `e2e/focus-view.spec.ts:187` |
| N4 | Geri sayım, tempo çubuğu, Wake Lock | yapıldı | `632bb0b`, düzeltme `dad88c9`, CI yeşil |
| N5 | Palette tam metin arama | yapıldı | `313f7de`, CI `dad88c9` yeşil |
| N6 | Bölüm seçimi, URL'de | sürüyor | `wt/sections` `b2ce91d` wip: karar ve testler, kod yok. Birleşmedi, CI koşmadı |
| N7 | Kalıcı işaretler ve PDF/PNG dışa aktarma | bekliyor | Aynalama ile aynı dosyalar, inceleme sonrasına kaldı |
| N8 | Matematik ve emoji | sürüyor | `wt/math-emoji` `9aded34` wip: bağımlılıklar ve ayrıştırma var, render ve emoji yok; `src/sectioning` testleri yerelde geçti, kalanı kırık olabilir. Birleşmedi, CI koşmadı |
| N9 | Mermaid diyagram turu | bekliyor | Aynalama ile aynı dosyalar |
| N10 | Beyaz tahta, dikdörtgen ve elips, kalem algılama | bekliyor | Aynalama ile aynı dosyalar |

## Analizden gelen

| ID | Madde | Durum | Kanıt veya sebep |
|---|---|---|---|
| E1 | GFM görev kutularının slaytta kaybolması (`src/deck/purify.ts:12`) | yapıldı | `9805d0c`, karar 86, CI `19fcff0` yeşil |

## Later rounds

| ID | Alan | Madde | Durum | Kanıt veya sebep |
|---|---|---|---|---|
| W1 | Workspace | Safari 26 öncesi ve özel pencere yedeği | atlandı | `wt/workspace` karar 89: bellek çalışma alanı sahte güven verir, worker yolu CSP ve precache ister. Birleşmedi |
| W2 | Workspace | OPFS'te başka sekme düzenlemesi izlenmiyor | sürüyor | `7a3250a`; yerel testler geçti, son e2e düzeltmesi `0ff6835` koşmadı, CI koşmadı. Birleşmedi |
| W3 | Workspace | `FileSystemObserver` yokken dosya değişimi yalnız odakta | sürüyor | `6d4fcd4`; yerel testler geçti, CI koşmadı. Birleşmedi |
| W4 | Workspace | `navigator.storage.persist()` istenmiyor | sürüyor | `4923f9d`; yerel testler geçti, CI koşmadı. Birleşmedi |
| W5 | Workspace | Yorum ve çizimin diskteki veya 5000 sınırı ötesi taşınmayı izlemesi | sürüyor | `4fbf5af` 5000 sınırı düzeldi; diskte adlandırma karar 92 ile sınırlı. CI koşmadı. Birleşmedi |
| A1 | Agents | e2e rölesi `worker/room.ts` kopyası, Miniflare ile çalıştırma | bekliyor | |
| A2 | Agents | Gerçek soket oturumu yalnız Node 24 (`engines` >=22) | bekliyor | Node 22 gerekir |
| A3 | Agents | Sunucudan önce katılan ajan veya telefon sayılmıyor | bekliyor | |
| A4 | Agents | `docwalk-mcp` npm'de yok | atlandı | İlk yayın sahip erişimi ister |
| M1 | Markdown | Sanitizer külliyatı üç motorda | bekliyor | Karar 42 |
| M2 | Markdown | Dipnot listesi devam sayfasında kalıyor | bekliyor | |
| M3 | Markdown | Çapalar yalnız üst seviye başlıkları kapsıyor | bekliyor | |
| C1 | Comments | Ölçeklenmiş slaytta işaretçi yok | sürüyor | `wt/comments` `43e6fb3` wip: karar 89, kod yok. Birleşmedi, CI koşmadı |
| C2 | Comments | Silinen yorum için tombstone yok | sürüyor | Karar 90 ve kasıtlı kırık testler, kod yok |
| C3 | Comments | Diyagram yer değişince düğüm yorumları yetim kalıyor | sürüyor | Karar 91 ve kasıtlı kırık testler, kod yok |
| C4 | Comments | Yazar adı yok | sürüyor | Karar 92, sahip onayı gerekir, kod yok |
| K1 | Canvas | axe iki Excalidraw denetimini dışlıyor | sürüyor | `wt/canvas` `890d463` wip: karar 89 ve testler, kod yok. Birleşmedi, CI koşmadı |
| K2 | Canvas | Library kenar çubuğu dış bağlantısı | sürüyor | Karar 89 ve testler, kod yok |
| K3 | Canvas | Saklanan çizimler temizlenmiyor | sürüyor | Karar 89, sahip onayı gerekir, kod yok |
| K4 | Canvas | Silindir dikdörtgene dönüşüyor | sürüyor | Üst paket sınırı, karar 89'da yazılı, kod yok |
| O1 | Monaco | İmleç satırı editör değişiminde taşınmıyor | sürüyor | `wt/monaco` `39889b0` wip: testler ve sözleşme alanı, kod yok. Birleşmedi, CI koşmadı |
| O2 | Monaco | Monarch 4 boşluklu liste devamını kod sayıyor | sürüyor | Yalnız test |
| O3 | Monaco | Paket 831 kB gzip | sürüyor | Ölçüldü, çıkarılabilir parça bulunmadı; karar satırı yazılmadı |
| O4 | Monaco | Palette editör seçimi yok | sürüyor | Yalnız test |
| P1 | PWA | F6 ile güncelleme bildirimine gitme doğrulanmadı | sürüyor | `wt/pwa` `cd1326d` wip: kod ve testler, hiç koşmadı, yalnız CI. Birleşmedi |
| P2 | PWA | `file_handlers` yok | sürüyor | Aynı commit, koşmadı |
| P3 | PWA | Periyodik güncelleme denetimi yok | sürüyor | Aynı commit, koşmadı |
| Q1 | CI | Mutasyon artıkları, `fragment.ts` şema reddi testi | bekliyor | |
| Q2 | CI | Lighthouse SEO 0.82, bütçesiz | bekliyor | |
| Q3 | CI | `e2e/app.spec.ts` WebKit bir kez kırıldı, `App.tsx` `?? 1` ipucu | bekliyor | |
| Q4 | CI | Sunucu axe testinin 90 sn bütçesi CI'da ölçülmedi | bekliyor | |
| Y1 | Erişilebilirlik | Fill çerçevede odak halkası kararı | bekliyor | Sahip onayı |
| Y2 | Erişilebilirlik | Firefox'ta Present sonrası odak görünmüyor | bekliyor | |
| L1 | Layout | Yorum paneli açıkken araç çubuğu iki satır | bekliyor | |
| L2 | Layout | Telefonda açık dosya paneli anahattı sıkıştırıyor | bekliyor | |
| L3 | Layout | Genel bakış küçük resimleri id'leri tekrar ediyor | bekliyor | |
| R1 | Kod renkleri | Zaman aşımından sonra yüklenen dil yeniden boyamıyor | bekliyor | |
| R2 | Kod renkleri | İlk yükleme 979 kB, Shiki önderlemeli gramer | bekliyor | |
| R3 | Kod renkleri | 24 dil dışı düz kalıyor | bekliyor | Sahip onayı olası |
| R4 | Kod renkleri | Kod bloğunda Markdown kalın/italik renksiz | bekliyor | |
| F1 | Sunum | Tam ekranda diyalog açıkken Escape, Keyboard Lock ödünü | bekliyor | Sahip onayı; "Needs the owner" ile aynı madde |
| I1 | Sunum | Gerçek iPhone denemesi | atlandı | Bu makinede cihaz yok |
| D1 | Sunum | En boy uyarlamalı slaytlar | bekliyor | Sahip onayı |
| D2 | Sunum | Takip ekranında fill çerçeve | bekliyor | |

## Later

| ID | Madde | Durum | Kanıt veya sebep |
|---|---|---|---|
| T1 | Weblate ile yeni diller | atlandı | Weblate hesabı sahip erişimi ister |
| T2 | Sağdan sola destek, CSS mantıksal özellikler | bekliyor | Tüm CSS'e dokunur, birleştirmeler sonrasına kaldı |

## Needs the owner

| ID | Madde | Durum | Kanıt veya sebep |
|---|---|---|---|
| H1 | Repo ayarları (zafiyet bildirimi, secret scanning, ruleset, konu etiketleri) | atlandı | Sahip erişimi |
| H2 | `v0.1.0` etiketi | atlandı | Sahip kararı ve erişimi |
| H3 | Cloudflare yayını | atlandı | Sahibin gizli anahtarları |
| H4 | zizmor çevrimiçi denetimleri, action etiket yaşları | bekliyor | Etiket yaşları `gh` ile denetlenebilir |
| H5 | Gerçek diskte `showDirectoryPicker` | atlandı | Gerçek kullanıcı izni diyaloğu otomasyonla sınanamıyor |
| H6 | `vite-plugin-pwa` dışarıda kalıyor | atlandı | Yapılacak iş değil, `trustPolicy` kararı |

## Bu çalışmanın eklediği sınırlar

Yeni özellikler ROADMAP'e bunları ekledi.

| ID | Madde | Durum | Kanıt veya sebep |
|---|---|---|---|
| X1 | İlk başlık üstündeki yorum boş slayt açıyor | bekliyor | |
| X2 | Notlar dışa aktarılmıyor (handout, PDF) | bekliyor | |
| X3 | Hedef süre çalışırken değişmiyor; pencere kapanınca geri sayım bitiyor | bekliyor | Karar 80 ile bilinçli |
| X4 | Telefon ve takip sayfasında saat ve çubuk yok | bekliyor | |
| X5 | Arama: diyagram etiketleri, Türkçe aksan, tek ifade | bekliyor | Karar 81 ile bilinçli |
| X6 | `pnpm size` Windows'ta çıktısız exit 1 (`tooling/size-check.ts`) | sürüyor | `wt/pwa` `cd1326d`, koşmadı, Windows'ta denenmedi |
| X7 | macOS'ta palet kısayolunun erişilebilir adı değiştirici tuş içermiyor | bekliyor | |
