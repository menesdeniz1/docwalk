# docwalk Roadmap durumu

Kaynak: `ROADMAP.md`, `main` = `77871a8`. Kapsam: tüm maddeler, sonsuz canvas fikri hariç (Roadmap'te yok). Site yayınlanmadı. İş 2026-11-09'da durduruldu ve devredildi; bu dosya o anki durumdur.

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
| N2 | Kod, görsel, tablo odak görünümü ve satır vurgusu | yapıldı | `a6540ab`, karar 87; CI `1a0b168`: WebKit'te 1 test kırık (`e2e/focus-view.spec.ts`, axe öncesi `AbortError`), kalan 5 iş yeşil; düzeltilmedi. Olası neden ve sonraki adım: `handoff/notes/fix-focus-axe.md` |
| N3 | Lazer, çizim ve odak aynalama | sürüyor | `6a68498`, `fbfef5c`, karar 88, `feat/roadmap-next-up` üzerinde. Kod, görsel, tablo odağı ve satır işaretleri aynalanmıyor; sunucu penceresi diyagram odağını göstermiyor. Opus incelemesi yapıldı: Critical ve High yok, `main`'den önce incelemenin M1 ve M2 bulguları düzeltilmeli (`handoff/notes/mirror-review.md`; bu kimlikler aşağıdaki Markdown satırları değildir). Düzeltme `wt/mirror-hardening` `ee0b406`: yalnız kırmızı testler. `e2e/app.spec.ts:138` düzeltildi (`aadee1b`) |
| N4 | Geri sayım, tempo çubuğu, Wake Lock | yapıldı | `632bb0b`, düzeltme `dad88c9`, CI yeşil |
| N5 | Palette tam metin arama | yapıldı | `313f7de`, CI `dad88c9` yeşil |
| N6 | Bölüm seçimi, URL'de | sürüyor | `wt/sections` `66a8226` wip, karar 100: kod yazıldı. Chromium e2e 16/19; 3 test düzeltildi, yeniden koşmadı. Firefox, WebKit, lint koşmadı. Birleşmedi |
| N7 | Kalıcı işaretler ve PDF/PNG dışa aktarma | bekliyor | Aynalama ile aynı dosyalar, inceleme sonrasına kaldı |
| N8 | Matematik ve emoji | sürüyor | `wt/math-emoji` `2fac1ca` wip, karar 101: render ve emoji yazıldı. Tarayıcı testleri 66/67 (kırık olan test hatası). e2e, perf, build, lint koşmadı; güvenlik incelemesi gerekir. Birleşmedi |
| N9 | Mermaid diyagram turu | bekliyor | Aynalama ile aynı dosyalar |
| N10 | Beyaz tahta, dikdörtgen ve elips, kalem algılama | bekliyor | Aynalama ile aynı dosyalar |

## Analizden gelen

| ID | Madde | Durum | Kanıt veya sebep |
|---|---|---|---|
| E1 | GFM görev kutularının slaytta kaybolması (`src/deck/purify.ts:12`) | yapıldı | `9805d0c`, karar 86, CI `19fcff0` yeşil |

## Later rounds

| ID | Alan | Madde | Durum | Kanıt veya sebep |
|---|---|---|---|---|
| W1 | Workspace | Safari 26 öncesi ve özel pencere yedeği | atlandı | Karar 89: bellek çalışma alanı sahte güven verir, worker yolu CSP ve precache ister. Birleşti |
| W2 | Workspace | OPFS'te başka sekme düzenlemesi izlenmiyor | yapıldı | `7a3250a`, karar 90, birleşti (`6f31dd6`). Chromium 15/15, Firefox 14 + 1 atlanan; WebKit Windows'ta OPFS yazamıyor, CI'a bağlı |
| W3 | Workspace | `FileSystemObserver` yokken dosya değişimi yalnız odakta | yapıldı | `6d4fcd4`, karar 91, birleşti |
| W4 | Workspace | `navigator.storage.persist()` istenmiyor | yapıldı | `4923f9d`, karar 91, birleşti |
| W5 | Workspace | Yorum ve çizimin diskteki veya 5000 sınırı ötesi taşınmayı izlemesi | yapıldı | `4fbf5af`, karar 92, birleşti; diskte adlandırma karar 92 ile sınırlı |
| A1 | Agents | e2e rölesi `worker/room.ts` kopyası, Miniflare ile çalıştırma | bekliyor | |
| A2 | Agents | Gerçek soket oturumu yalnız Node 24 (`engines` >=22) | bekliyor | Node 22 gerekir |
| A3 | Agents | Sunucudan önce katılan ajan veya telefon sayılmıyor | bekliyor | |
| A4 | Agents | `docwalk-mcp` npm'de yok | atlandı | İlk yayın sahip erişimi ister |
| M1 | Markdown | Sanitizer külliyatı üç motorda | bekliyor | Karar 42 |
| M2 | Markdown | Dipnot listesi devam sayfasında kalıyor | bekliyor | |
| M3 | Markdown | Çapalar yalnız üst seviye başlıkları kapsıyor | bekliyor | |
| C1 | Comments | Ölçeklenmiş slaytta işaretçi yok | sürüyor | `wt/comments` `501aab0` wip, karar 94: kod var, tarayıcı testi ve e2e yazılmadı. Birleşmedi |
| C2 | Comments | Silinen yorum için tombstone yok | sürüyor | Karar 95: kod var, birim 74 ve tarayıcı 34 test geçti; `src/workspace` testleri koşmadı |
| C3 | Comments | Diyagram yer değişince düğüm yorumları yetim kalıyor | sürüyor | Karar 96: kod var, e2e yok |
| C4 | Comments | Yazar adı yok | sürüyor | Karar 97, sahip onayı gerekir: kod var, e2e yok |
| K1 | Canvas | axe iki Excalidraw denetimini dışlıyor | sürüyor | `wt/canvas` `82ab879`, karar 98: kod bitti, axe dışlaması kalktı. Chromium e2e 7/7; Firefox ve WebKit koşmadı. Birleşmedi |
| K2 | Canvas | Library kenar çubuğu dış bağlantısı | sürüyor | Aynı branch: "Browse libraries" gizli, Publish formu kaldı |
| K3 | Canvas | Saklanan çizimler temizlenmiyor | sürüyor | Aynı branch: "Saved sketches" paneli; yeri ve metni sahip onayı ister |
| K4 | Canvas | Silindir dikdörtgene dönüşüyor | sürüyor | Üst paket sınırı, karar 98'de yazılı, kod gerekmez |
| O1 | Monaco | İmleç satırı editör değişiminde taşınmıyor | sürüyor | `wt/monaco` `293532e` wip: `initialLine` iki editörde var, `App.tsx` bağlantısı yok, 1 CodeMirror testi kırık. Birleşmedi |
| O2 | Monaco | Monarch 4 boşluklu liste devamını kod sayıyor | sürüyor | Kendi gramerimiz yazıldı, tarayıcı testleri geçiyor |
| O3 | Monaco | Paket 831 kB gzip | sürüyor | Kanıt ve karar 102 yazılmadı |
| O4 | Monaco | Palette editör seçimi yok | sürüyor | Komut ve metinler yazılmadı |
| P1 | PWA | F6 ile güncelleme bildirimine gitme doğrulanmadı | sürüyor | `wt/pwa` `751cee6`, karar 99: F6 çalışmıyordu, düzeltildi. e2e Chromium 12, Firefox 10 + 2 atlanan, WebKit 10 + 2 atlanan. Son düzenlemeden sonra birim, tarayıcı, typecheck koşmadı. Birleşmedi |
| P2 | PWA | `file_handlers` yok | sürüyor | Aynı branch; gerçek dosya açma denenmedi, yalnız e2e taklidi |
| P3 | PWA | Periyodik güncelleme denetimi yok | sürüyor | Aynı branch |
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
| H4 | zizmor çevrimiçi denetimleri, action etiket yaşları | sürüyor | Etiketlerin 7'si de SHA ile eşleşiyor (`handoff/notes/actions-audit.md`). `pnpm/action-setup` v6.1.1 tarihi 2026-11-03. Çevrimiçi denetimler kapalı (`--offline`, token yok) |
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
| X6 | `pnpm size` Windows'ta çıktısız exit 1 (`tooling/size-check.ts`) | sürüyor | `wt/pwa` `751cee6`: Windows'ta çalıştı, 415.2 kB gzip, çıkış 0. Birleşmedi |
| X7 | macOS'ta palet kısayolunun erişilebilir adı değiştirici tuş içermiyor | bekliyor | |
