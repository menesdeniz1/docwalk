# docwalk-fork taban ölçümü (değişiklikten önce)

Koda dokunulmadı. Ölçüm sonunda `git status --porcelain` boş. Loglar: `<work>/logs/baseline/`.

## 1. Ortam

| Alan | Değer |
|---|---|
| Repo / branch / commit | docwalk-fork, `main`, `77871a8` |
| İşletim sistemi | Windows 11 Pro 10.0.26300 |
| Node | v24.18.0 (repo 24.22.2 ister, uyarı modu; her komutta `[WARN]` basar) |
| pnpm | 12.16.1 (corepack shim) |
| Playwright | 1.64.1 (chromium full 1248 + headless shell 1248) |
| Vitest | 5.0.5 |
| Tarih | 2026-11-08 (ölçüm 18:54 - 19:14, TST) |
| Satır sonu | `core.autocrlf=false`; `git ls-files --eol`: 358 dosya `i/lf w/lf`, 6 ikili. `index.html` = `i/lf w/lf`. CRLF yok. |
| Kalıntı süreç | Başlangıçta node, chrome-headless-shell, 4173/4174/4175 portlarında süreç yoktu. Yalnızca kullanıcının normal `chrome.exe` süreçleri vardı (dokunulmadı). |

## 2. Adım tablosu

Adımlar `pnpm check` sırasıyla ve ayrı ayrı çalıştırıldı (her biri `timeout 900` altında). Süre saniye.

| Adım | Çıkış | Geçen / Kalan / Atlanan | Süre | Log |
|---|---|---|---|---|
| typecheck | 0 | tüm tsc projeleri temiz | 5 s | `logs/baseline/typecheck.log` |
| lint (oxlint) | 0 | 0 bulgu | 1 s | `logs/baseline/lint.log` |
| lint:design | 124 (timeout, 900 s) | TAKILDI, sonuç yok | 900 s | `logs/baseline/lint-design.log` |
| fmt:check | 0 | 336 dosya biçimli | 0 s | `logs/baseline/fmt-check.log` |
| test (unit) | 1 | 974 / 1 / 0 test; 38 geçen + 3 kalan dosya (2'si yüklenemedi) | 5 s | `logs/baseline/test.log` |
| test:browser | 1 (ilk), 0 (tek yeniden) | ilk: hiç test koşmadı; yeniden: 610 / 0 / 0, 45 dosya | 2 s / 16 s | `logs/baseline/test-browser.log`, `logs/baseline/test-browser-rerun1.log` |
| test:worker | 0 | 36 / 0 / 0, 3 dosya | 3 s | `logs/baseline/test-worker.log` |
| build | 0 | vite build 3.35 s, mcp build dahil | 5 s | `logs/baseline/build.log` |
| test:e2e --project chromium | 1 | bkz. bölüm 3 | 137 s | `logs/baseline/e2e-chromium.log`, `logs/baseline/e2e-chromium.json` |

Ek tanı çalıştırması (taban sayılmaz): `pnpm exec designmd lint DESIGN.md` çıkış 0, 0 hata 0 uyarı (`logs/baseline/lint-design-diag-designmd.log`).

Unit notu: `contrast.test.ts` ve `tokens.test.ts` modül yüklenirken patladığı için içindeki testler sayıma girmedi; gerçek unit test sayısı 975'ten fazladır.

## 3. E2E özeti (chromium, 158 test)

| Geçen | Kalan | Atlanan | Flaky |
|---|---|---|---|
| 151 | 3 | 4 | 0 |

- Atlanan 4 test `markdown.spec.ts:189` ekran görüntüsü testleri; `DOCWALK_SHOTS_DIR` yoksa tasarım gereği atlanır (kusur değil).
- Kalan 3 test `mcp.spec.ts` içinde, hepsi 60 s test zaman aşımı. Takılma değil, test başına sınırlı zaman aşımı; süit tamamlandı, takılı süreç kalmadı.
- Yapılandırma `webServer` ile `pnpm build && pnpm preview --port 4174` çalıştırdı; sub-path sunucusu açılmadı (yalnızca static-subpath projesinde açılır).

## 4. Kalan testler ve sınıflandırma

### 4.1 `windows-kaynakli`: `lint:design` takılması
- Adım: `pnpm lint:design` (`design.md lint DESIGN.md`).
- Belirti: 900 s'de çıktısız takıldı, `timeout` 124 verdi. Süreç ağacı: `pnpm-native` > `cmd /d /s /c "design.md lint DESIGN.md"` > `Code.exe node_modules\.bin\design.md`.
- Kök neden: `package.json:23` bin adı `design.md`, `.md` ile bitiyor. Windows `cmd`, `node_modules/.bin/` içindeki uzantısız `design.md` dosyasını (4469 bayt, sh betiği) bulur ve PATHEXT yerine dosya ilişkisiyle açar. `.md` ilişkisi VS Code, o da arka planda bir VS Code penceresi başlatır ve komut bitmez. Ubuntu'da sh doğrudan betiği çalıştırır, sorun olmaz.
- Kanıt: `logs/baseline/lint-design.log` (yalnızca `$ design.md lint DESIGN.md` satırı), yan etki olarak 18:54:26'da VS Code süreçleri başladı. Aynı linter `designmd` takma adıyla çalışınca temiz geçti (çıkış 0, tanı logu).
- Yan etki: masaüstünde VS Code örneği açıldı. Takılan ağacı `taskkill` ile sonlandırmaya çalıştım, izin sistemi reddetti; ben de aşmadım ve `timeout` süresini bekledim. Ölçüm sonunda Code süreci kalmamıştı.
- `package.json` değiştirilmedi. Düzeltme önerisi (bu görev kapsamı dışı): script'i `designmd lint DESIGN.md` yapmak.

### 4.2 `windows-kaynakli`: `src/design/contrast.test.ts` ve `src/design/tokens.test.ts` (suite yüklenemedi)
- Hata: `ENOENT: no such file or directory, open 'C:\C:\<clone>\DESIGN.md'`.
- Kök neden: `new URL("../../", import.meta.url).pathname` Windows'ta `/C:/Users/...` verir; `join(root, "DESIGN.md")` bunu `C:\C:\...` yapar.
- Kanıt: `src/design/contrast.test.ts:7` ve `:9`, `src/design/tokens.test.ts:8` ve `:9`; `logs/baseline/test.log`.

### 4.3 `windows-kaynakli`: `tooling/stryker-config.test.ts` > "the node-tested code, the MCP server's included"
- Hata: `expected [ 'src\workspace\commands.ts', …(93) ] to include 'src/share/fragment.ts'`.
- Kök neden: `node:fs` `globSync` Windows'ta ters eğik çizgili yol döner; test `/` ile yazılmış yolları arar.
- Kanıt: `tooling/stryker-config.test.ts:18` (globSync) ve `:38-41` (toContain); `logs/baseline/test.log`. Bu dosyadaki ilk test (`:24`) geçiyor ama `matchesGlob` ile dışlama da ters eğik çizgiyle çalışmadığı için orada da zayıflamış olabilir (kanıt yok, yalnızca not).

### 4.4 `windows-kaynakli`: `e2e/mcp.spec.ts` 3 test
- Testler:
  - `mcp.spec.ts:130` the presenter's switch gates agent writes, and the notice says which agent tried
  - `mcp.spec.ts:184` an agent's tool calls rewrite and steer the presenter's deck, a long doc included
  - `mcp.spec.ts:251` an agent's write to a workspace file edits that file and autosaves it
- Hata: `Test timeout of 60000ms exceeded.`
- Kök neden: `e2e/mcp.spec.ts:76` `spawn(process.execPath, [BIN.pathname, link])`. `BIN.pathname` Windows'ta `/C:/Users/.../mcp/dist/docwalk-mcp.js`; node `Cannot find module 'C:\C:\Users\...\docwalk-mcp.js'` ile hemen çıkar. İstemci `initialize` yanıtını hiç almaz (`:95`), `rpc` promise'i sonsuza bekler, test 60 s sonra zaman aşımına düşer.
- Kanıt: aynı çağrıyı elle denedim: `status 1`, `Cannot find module 'C:\C:\<clone>\mcp\dist\docwalk-mcp.js'`. `mcp/dist/docwalk-mcp.js` build'den sonra mevcut ve dolu. `logs/baseline/e2e-chromium.log` satır 182-184.

### 4.5 `belirsiz`: `test:browser` ilk çalıştırma
- Belirti: `page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:63315/__vitest_test__/...`, 45 dosya `no tests`, çıkış 1, 175 ms.
- Yeniden çalıştırma (tek sefer, sınıflandırma için): 45 dosya, 610 test geçti, çıkış 0.
- Denenen: aynı komutu bir kez daha çalıştırdım; yapılandırma (`vitest.config.ts`) ve tarayıcı yolu (`DOCWALK_CHROMIUM_PATH`) doğru. Kalıcı bir yol/CRLF/env sorunu bulunmadı. Olası neden: Vitest browser sunucusu hazır olmadan Chromium bağlanmaya çalıştı (soğuk başlangıç yarışı), kanıt yetmiyor.
- Taban kararı: "bilinen kırık" listesine girmedi, çünkü yeniden çalıştırmada geçti. Sonraki worker bu adım ilk seferde bağlantı hatası verirse bir kez yeniden çalıştırıp farkı raporlamalı.

### Sınıf başına kalan sayısı
- `windows-kaynakli`: 7 öğe (lint:design adımı, 2 yüklenemeyen unit suite, 1 unit test, 3 e2e test)
- `ortam-eksik`: 0
- `gercek-hata`: 0
- `belirsiz`: 1 (test:browser ilk çalıştırma, yeniden çalıştırmada geçti, listeye girmedi)

## 5. Bilinen kırık liste

Makinece okunur sürüm: `<work>/baseline-failures.txt` (satır başına bir kayıt, biçim `proje | dosya > test adı`).

1. `unit | src/design/contrast.test.ts` (suite yüklenemedi)
2. `unit | src/design/tokens.test.ts` (suite yüklenemedi)
3. `unit | tooling/stryker-config.test.ts > what Stryker mutates > the node-tested code, the MCP server's included`
4. `chromium | e2e/mcp.spec.ts > the presenter's switch gates agent writes, and the notice says which agent tried`
5. `chromium | e2e/mcp.spec.ts > an agent's tool calls rewrite and steer the presenter's deck, a long doc included`
6. `chromium | e2e/mcp.spec.ts > an agent's write to a workspace file edits that file and autosaves it`

Test dosyasında olmayan bilinen kırık adım: `pnpm lint:design` (Windows'ta takılır, dosyaya yazılmadı).

## 6. Sonraki worker'lar için en kısa doğrulama komutları

Her komutun önüne `source <work>/env.sh` koyun; `pnpm --dir <clone> <script>` kullanın.

| Amaç | Komut | Ölçülen süre |
|---|---|---|
| Tür kontrolü | `typecheck` | ~5 s |
| Lint | `lint` | ~1 s |
| Biçim | `fmt:check` | <1 s (yalnızca denetler, dosya yazmaz) |
| Unit | `test` (tek dosya: `exec vitest run --project unit <yol>`) | ~5 s; beklenen: yalnızca bölüm 5'teki 3 unit kalan |
| Gerçek tarayıcı | `test:browser` (tek dosya: `exec vitest run --project browser <yol>`) | ~16 s; beklenen 610 geçer |
| Worker | `test:worker` | ~3 s; beklenen 36 geçer |
| Build | `build` | ~5 s |
| Tasarım lint (takılmaz) | `exec designmd lint DESIGN.md` | ~2 s; `pnpm lint:design` KULLANMAYIN, VS Code açıp takılır |
| E2E tek spec | `exec playwright test e2e/<dosya>.spec.ts --project chromium` | spec başına 5-30 s; webServer `pnpm build` çalıştırır, +~10 s |
| E2E chromium tam | `test:e2e --project chromium --reporter=list,json` (`PLAYWRIGHT_JSON_OUTPUT_NAME` ile) | ~137 s; beklenen 151 geçer, 4 atlanır, 3 mcp kalır |

Beklenen taban: yukarıdaki 6 kayıt dışında yeni kırık varsa o değişikliğin eseridir. mcp.spec ve unit yol hatalarını düzeltmek ayrı bir iş (bu görevde yapılmadı).

## 7. Fork CI ile karşılaştırma (Ubuntu, aynı commit)

Run [42501338111](https://github.com/menesdeniz1/docwalk/actions/runs/42501338111), `main` = `77871a8`, `workflow_dispatch`: `check`, `e2e (chromium)`, `e2e (firefox)`, `e2e (webkit)`, `lighthouse`, `zizmor` hepsi `success`.

Sonuç: `check` işi `pnpm check`'i (`lint:design`, unit ve `tooling/stryker-config.test.ts` dahil) çalıştırıyor, e2e işi `mcp.spec.ts`'i içeriyor. Hepsi Ubuntu'da geçtiğine göre yereldeki tüm kalanlar bu makineye özgü, `windows-kaynakli` sınıflaması doğrulandı:

| Yerelde kalan | Ubuntu CI | Sonuç |
|---|---|---|
| `lint:design` (takıldı) | `check` geçti | Windows kaynaklı |
| `src/design/contrast.test.ts`, `src/design/tokens.test.ts` | `check` geçti | Windows kaynaklı |
| `tooling/stryker-config.test.ts` | `check` geçti | Windows kaynaklı |
| 3 `e2e/mcp.spec.ts` testi | `e2e (chromium)` geçti | Windows kaynaklı |
| `test:browser` ilk çalıştırma bağlantı hatası | `check` geçti | Yerel başlangıç yarışı olabilir, nedeni kesinleşmedi |

Sonraki doğrulamada yerel kapı ile fork CI birlikte kullanılıyor: yerel kapı yalnızca Chromium koşar, Firefox ve WebKit ayrıca çalıştırılır. Yerel geçip CI'da kırılan ilk örnek: `e2e/wake-lock.spec.ts` (commit `632bb0b`).
