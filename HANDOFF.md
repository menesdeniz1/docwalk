# docwalk fork handoff

You are picking up work on the fork `menesdeniz1/docwalk`, based on `emindeniz99/docwalk` at `77871a8`. This branch holds notes only and starts from `main`, so it stays out of any later pull request.

## Hard rules

- No pull request, comment, push or message to `emindeniz99/docwalk` until the fork owner (`menesdeniz1`) asks for one in plain words. Nothing has gone there. To keep it that way, run `git remote set-url --push upstream no_push` and `gh repo set-default menesdeniz1/docwalk`, and pass `--repo menesdeniz1/docwalk` to every `gh` command. `gh pr create` targets the parent repository by default.
- Delete nothing: branches, worktrees, logs or pull requests. PRs #1 and #2 stay open inside the fork.
- The fork has no public site. The fork owner declined GitHub Pages for now, so ask before you turn it on.
- On a machine you share, run at most 4 test commands at once, each with one test worker (`--maxWorkers=1`, `--workers=1`) at below-normal priority. Run only the tests you changed and at most one e2e spec locally. Leave the three-engine run to CI.
- Follow `AGENTS.md`, `CONTRIBUTING.md` and `MEMORY.md`: a decision row, then a failing test, then code. No skipped or weakened tests, no retries, no `--no-verify`, no force-push.

## Where the branches stand

All branches live on `origin` (`menesdeniz1/docwalk`).

| Branch | Last commit | Contains | CI on the last commit |
| --- | --- | --- | --- |
| `main` | `77871a8` | Untouched upstream | Green, run 42501338111 |
| `feat/roadmap-next-up` | `fbfef5c` | Finished work plus laser and marks mirroring (25 commits ahead of `main`) | **Red**, run 42515099653: `check`, `lighthouse` and `zizmor` pass, e2e fails on all three engines. Last fully green commit: `19fcff0` |
| `ci-baseline` | `6edd5f8` | One empty commit, PR #1 | No run |
| `wt/workspace` | `0ff6835` | Code for most Workspace items, tested locally on Chromium; roadmap and changelog not written | No run |
| `wt/pwa` | `cd1326d` | WIP: code and tests, never run | No run on the last commit; run 42515180261 covers the tests-only commit `878fd34` |
| `wt/monaco` | `39889b0` | WIP: tests and a contract field, no code | No run |
| `wt/canvas` | `890d463` | WIP: decision row and tests, no code | No run |
| `wt/comments` | `43e6fb3` | WIP: decision rows and tests, no code; tests fail on purpose | No run |
| `wt/sections` | `b2ce91d` | WIP: decision row and tests, no code; tests fail on purpose | No run |
| `wt/math-emoji` | `9aded34` | WIP: dependencies and parsing, no rendering; may not compile | No run |

We merged no `wt/*` branch: none reached a green CI run. Expect any `wip(...)` commit to be broken.

CI runs on pull requests and on pushes to `main`. A push to a `wt/*` branch runs nothing until you dispatch it: `gh workflow run ci.yml --repo menesdeniz1/docwalk --ref <branch>`. Pushing to one pull request cancels its running CI, so batch your merges.

## Open problems on `feat/roadmap-next-up`

1. **Mirroring broke the presenter window test.** `e2e/app.spec.ts:138` ("the presenter window mirrors the deck and can drive it") fails on Chromium, Firefox and WebKit at line 152: `.docwalk-presenter-current .docwalk-presenter-canvas` now resolves to 2 elements. The mirroring commits landed on this branch directly, so this branch stays red until you fix it. Read `e2e/mirror.spec.ts` and the presenter changes in `6a68498` before you touch either the test or the markup.
2. **Mirroring has had no security review.** `6a68498` adds signed `mirror` messages to the encrypted rooms (decision 88). The plan required an Opus review before merging, and that review did not happen. Review it first, against the threat model in decision 88.
3. **Mirroring is partial.** Code, image and table focus views and line marks are not mirrored, and the presenter window does not show diagram focus.
4. **WebKit axe failures in the focus view.** `e2e/focus-view.spec.ts:187` fails with `page.evaluate: AbortError` during axe: the table view on `1a0b168`, the table and image views on `fbfef5c`. Nobody has investigated them. Treat them as a race and find the cause; do not add a retry.
5. **Decision numbers collide.** `wt/workspace`, `wt/pwa`, `wt/canvas`, `wt/comments` and `wt/sections` all start at row 89. Renumber them as you merge, and fix references such as "see 90".
6. **Merge notes.** `src/workspace/annotations.ts` must switch to the new tombstone-aware store call when `wt/comments` lands. `messages/*.json`, `ROADMAP.md`, `MEMORY.md` and `CHANGELOG.md` will conflict. `MEMORY.md` passed its 100-line pruning limit.

## Roadmap status

`handoff/roadmap-durum.md` tracks all 74 items, in Turkish: the 72 from the roadmap and the analysis, plus 2 this work added.

| Status | Count | Items |
| --- | --- | --- |
| Done | 9 | S1-S4, N1, N2, N4, N5, E1 |
| In progress on a branch | 23 | N3, N6, N8, W2-W5, C1-C4, K1-K4, O1-O4, P1-P3, X6 |
| Not started | 33 | N7, N9, N10, A1-A3, M1-M3, Q1-Q4, Y1, Y2, L1-L3, R1-R4, F1, D1, D2, T2, H4, X1-X5, X7 |
| Skipped | 9 | W1 (reasoned), A4, I1, T1, H1, H2, H3, H5, H6 |

Skipped items need owner access, hardware this machine lacks, or no action: repository settings, the `v0.1.0` tag, Cloudflare secrets, the first npm publish, a Weblate account, a real iPhone, a real disk permission dialog.

## Decisions the repository owner must approve

- Row 80: the countdown lives in `sessionStorage`, where `docs/feature-gaps.md` suggested the URL.
- Row 85: decision 39 narrows to ARIA snapshots. Nobody here can produce Ubuntu PNGs for screenshot assertions.
- Row 43 budget: the 1.5 s open budget fails (local median 1774 ms, CI 2559 ms). We kept the threshold and did no performance work.
- Row 86: task list marks draw after the sanitizers, and the schema drops `input`.
- Row 88: the mirroring threat model.
- `wt/comments` row 92: an optional display name, stored in the browser, which travels with shared comments.
- `wt/canvas` row 89: a "Saved sketches" panel in place of automatic pruning, and hiding "Browse libraries".
- `wt/sections` row 89: followers ignore `?sections=` and count every slide.
- `wt/pwa` row 89: `file_handlers` and an hourly update check.
- Not yet decided: Y1 (focus ring in the fill frame), F1 (Escape and Keyboard Lock), D1 (aspect-adaptive slides), R3 (languages beyond the 24).

Attribution: the first 7 commits on `feat/roadmap-next-up` name Claude Opus 5.5. A Sonnet worker wrote them under an instruction to use that line, and pushed history stays as it is. Later worker commits name the model that wrote them.

## Setup

- Toolchain: pnpm 12.16.1 through corepack, Playwright 1.64.1. The repository pins Node 24.22.2.
- Node mismatch: set `pnpm_config_runtime_on_fail=warn` to run on another Node version. `--runtime-on-fail=download` breaks `--frozen-lockfile`.
- Local Chromium paths: set `DOCWALK_CHROMIUM_PATH` (headless shell) and optionally `DOCWALK_CHROMIUM_FULL_PATH` (full Chrome). CI uses the headless shell, and the wake lock tests behave differently between the two.
- `DOCWALK_E2E_PORT` picks the e2e port. Port 4190 is restricted in Firefox and WebKit.

## Windows traps

- **Line endings:** clone with `core.autocrlf=false`. The repository has no `.gitattributes`, and CRLF breaks the CSP hash of the inline script in `index.html`.
- **`pnpm lint:design` and `pnpm check` hang:** `cmd` opens the `design.md` bin in the program registered for `.md` files, here VS Code. Run `pnpm exec designmd lint DESIGN.md` and the other `check` steps one at a time.
- **Never run `chrome.exe --version`:** it opens a visible browser window. Read the file's version metadata instead.
- **Stale previews:** Playwright can leave `vite preview` running. Locally `reuseExistingServer` is on, so a spec reuses that server and tests whatever `dist` holds. Build before you run a spec, and give each worktree its own port.
- **`pnpm size`:** it exits 1 with no output on Windows. `wt/pwa` holds an untested fix.

## Known Windows failures

CI on `main` passes these six, so they come from Windows path handling. They are unrelated to your change.

1. `src/design/contrast.test.ts`: suite fails to load (`URL.pathname`).
2. `src/design/tokens.test.ts`: same cause.
3. `tooling/stryker-config.test.ts`: `globSync` returns backslashes.
4. `e2e/mcp.spec.ts`: "the presenter's switch gates agent writes, and the notice says which agent tried".
5. `e2e/mcp.spec.ts`: "an agent's tool calls rewrite and steer the presenter's deck, a long doc included".
6. `e2e/mcp.spec.ts`: "an agent's write to a workspace file edits that file and autosaves it".

`handoff/baseline.md` holds the measurement, in Turkish. Local Chromium e2e at `1a0b168` showed 204 passed, 4 skipped, and the 3 failures above. The 4 skips need `DOCWALK_SHOTS_DIR`.

## Next steps

1. Fix `e2e/app.spec.ts:138`, and review mirroring (`6a68498`) with a security focus.
2. Fix the WebKit failures in `e2e/focus-view.spec.ts:187`, then get `feat/roadmap-next-up` green.
3. Finish `wt/workspace`: dispatch CI, write its docs commit, merge with `--no-ff`.
4. Finish the other `wt/*` branches, one at a time or in parallel where their files do not overlap.
5. Start N7, N9 and N10, which share files with mirroring, then the items marked "Not started".
6. Write the pull request text when the fork owner asks. No draft exists yet, and it must list the approvals above.
