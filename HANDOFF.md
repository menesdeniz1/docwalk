# docwalk fork handoff

You are picking up work on the fork `menesdeniz1/docwalk`, based on `emindeniz99/docwalk` at `77871a8`. This branch holds notes only and starts from `main`, so it stays out of any later pull request.

Last updated 2026-11-09. The fork owner stopped the work that day and asked for this handoff. No worker is running. Every branch below is pushed to `origin`, and no worktree holds uncommitted changes.

## Hard rules

- No pull request, comment, push or message to `emindeniz99/docwalk` until the fork owner (`menesdeniz1`) asks for one in plain words. Nothing has gone there. To keep it that way, run `git remote set-url --push upstream no_push` and `gh repo set-default menesdeniz1/docwalk`, and pass `--repo menesdeniz1/docwalk` to every `gh` command. `gh pr create` targets the parent repository by default.
- Delete nothing: branches, worktrees, logs or pull requests. PRs #1 and #2 stay open inside the fork.
- The fork has no public site. The fork owner declined GitHub Pages for now, so ask before you turn it on.
- The fork is public. Keep personal data and machine paths out of what you push. `handoff/notes/mirror-review.md` leaves out the attack details of code that is also on `emindeniz99/docwalk`'s `main`, because `SECURITY.md` asks for private reports. The fork owner keeps the full text.
- On a machine you share, run at most 4 test commands at once, each with one test worker (`--maxWorkers=1`, `--workers=1`) at below-normal priority. Run only the tests you changed and at most one e2e spec locally. Leave the three-engine run to CI.
- Follow `AGENTS.md`, `CONTRIBUTING.md` and `MEMORY.md`: a decision row, then a failing test, then code. No skipped or weakened tests, no retries, no `--no-verify`, no force-push.

## Where the branches stand

All branches live on `origin` (`menesdeniz1/docwalk`). The fork owner's machine has a worktree for each `wt/*` branch in a `docwalk-wt/` folder beside the clone, with `node_modules` installed.

| Branch | Last commit | Contains | Verified |
| --- | --- | --- | --- |
| `main` | `77871a8` | Untouched upstream | CI green, run 42501338111 |
| `feat/roadmap-next-up` | `0862aaa` | Finished work, mirroring, the three merges below, a docs commit | CI run 42530981038 was still running when this was written, so read it first. The previous run, 42529916333 on `3e756b4`, passed `check`, `lighthouse`, `zizmor`, e2e Chromium and e2e Firefox. Its e2e WebKit job had not finished when `0862aaa` was pushed |
| `ci-baseline` | `6edd5f8` | One empty commit, PR #1 | No run |
| `wt/fix-presenter` | `aadee1b` | Merged. The marks overlay has its own class | `app.spec` and `mirror.spec`: 12 of 12 on each engine, locally |
| `wt/windows-gate` | `6df9b60` | Merged. `pnpm check` runs on Windows | Full `check` exit 0 locally |
| `wt/workspace` | `d1497e4` | Merged. Rows 89 to 93 | `workspace.spec`: Chromium 15 passed, Firefox 14 passed and 1 skipped. WebKit needs CI (see Windows traps) |
| `wt/pwa` | `751cee6` | Code and tests finished, no `wip` commit | `pwa.spec`: Chromium 12, Firefox 10 and 2 skipped, WebKit 10 and 2 skipped. Unit, browser and typecheck not rerun after the last edits |
| `wt/canvas` | `82ab879` | Code and tests finished, no `wip` commit | Chromium e2e 7 of 7, unit 10, browser 25. Firefox and WebKit not run |
| `wt/sections` | `66a8226` | `wip`: code written | Chromium e2e 16 of 19; 3 test defects fixed and not rerun. Lint, Firefox and WebKit not run |
| `wt/comments` | `501aab0` | `wip`: code for C1 to C4; slide marker test and e2e not written | Unit 74, browser 34. Typecheck not rerun; lint, `src/workspace` tests and e2e not run |
| `wt/math-emoji` | `2fac1ca` | `wip`: rendering and emoji written; deck, export and e2e tests not written | Unit 158, browser 66 of 67 (the failure is a wrong test). Lint, build and perf not run |
| `wt/monaco` | `293532e` | `wip`: `initialLine` and the grammar; `App.tsx` wiring, palette command and row 102 not written | Browser 53 of 54. Lint, build and e2e not run |
| `wt/mirror-hardening` | `ee0b406` | `wip`: red tests only, no code | Unit: 11 fail on purpose, 23 pass |
| `wt/fix-focus-axe` | `6023bdb` | `wip`: diagnosis and a probe spec, no fix | See open problem 1 |

Each unmerged branch contains `fbfef5c` and none of the three merges. Merge `origin/feat/roadmap-next-up` into a branch before you finish it. No unmerged branch has had a CI run, and any `wip(...)` commit may be broken.

CI runs on pull requests and on pushes to `main`. A push to a `wt/*` branch runs nothing until you dispatch it: `gh workflow run ci.yml --repo menesdeniz1/docwalk --ref <branch>`. Pushing to one pull request cancels its running CI, so batch your merges.

`handoff/notes/<branch>.md` holds each branch's finished work, commands, gaps and exact next step. In those notes, `RUN` means `corepack pnpm --dir <worktree>` at low priority, and `$SCRATCH` and `dw-run.sh` belonged to a session that has ended.

## Decision rows

Rows are reserved so the branches do not collide. Take new rows from 104.

| Rows | Branch | State |
| --- | --- | --- |
| 89 to 93 | `wt/workspace` | Merged |
| 94 to 97 | `wt/comments` | Written |
| 98 | `wt/canvas` | Written |
| 99 | `wt/pwa` | Written |
| 100 | `wt/sections` | Written |
| 101 | `wt/math-emoji` | Written. It says 28 attributes, and the list has 33 |
| 102 | `wt/monaco` | Reserved, not written |
| 103 | `wt/mirror-hardening` | Reserved, not written |

## Open problems

1. **WebKit race in the focus view.** `e2e/focus-view.spec.ts:195` can fail with `AbortError` in its settle line, before axe starts. That line awaits `Animation.finished` for every animation, and entering present mode makes WebKit cancel and restart the transitions on reveal.js's arrows for about 200 ms. A forced-gap probe reproduced the error on Windows WebKit, but the unchanged spec passed 30 of 30 there, and nobody measured the timing on Ubuntu. Treat the cause as likely, not proven. `handoff/notes/fix-focus-axe.md` holds the fix to try. Delete `e2e/zz-probe.spec.ts` before you merge that branch.
2. **Mirroring review findings.** The review of `6a68498` found no Critical or High issue, and mirroring can stay on the branch. Fix M1 and M2 before it reaches `main`. M2 is an ordinary bug: a follower who joins during a pen stroke cuts that stroke on every follower. M1 makes each resync clear and redraw followers' marks. M3 predates mirroring. L1 and L2 are low. These IDs are the review's, and they differ from the Markdown and Layout items in `handoff/roadmap-durum.md`. The review also corrects claims in row 88. `handoff/notes/mirror-hardening.md` holds the design and the remaining tests.
3. **Mirroring is partial.** Code, image and table focus views and line marks are not mirrored, and the presenter window does not show diagram focus.
4. **Math needs a security review.** `wt/math-emoji` puts document text through Temml and into the DOM, and nobody has reviewed it. `handoff/notes/math-emoji.md` lists each place text reaches the DOM. Review it before you merge, and measure it against the 1 MB first-load limit (979 kB used before math).
5. **Merge notes.**
   - `docs/decisions.md` conflicts on five branches. `wt/canvas` re-padded the Workspace table, so run `oxfmt` after you resolve it.
   - `messages/*.json` conflicts on four branches. `tooling/pwa.ts` and its test change on both `wt/pwa` and `wt/math-emoji`.
   - `wt/sections` fixes `ready()` in `e2e/helpers.ts`, which rejected "1 slide".
   - `wt/comments` moved `src/workspace/annotations.ts` to the tombstone-aware store call. Run the `src/workspace` browser tests after you merge it.
   - Workers did not edit `ROADMAP.md`, `MEMORY.md` or `CHANGELOG.md`. Write those when each branch merges, from its note.
   - `MEMORY.md` passed its 100-line pruning limit.

## Roadmap status

`handoff/roadmap-durum.md` tracks all 74 items, in Turkish: the 72 from the roadmap and the analysis, plus 2 this work added.

| Status | Count | Items |
| --- | --- | --- |
| Done | 13 | S1-S4, N1, N2, N4, N5, E1, W2-W5 |
| In progress on a branch | 20 | N3, N6, N8, C1-C4, K1-K4, O1-O4, P1-P3, X6, H4 |
| Not started | 32 | N7, N9, N10, A1-A3, M1-M3, Q1-Q4, Y1, Y2, L1-L3, R1-R4, F1, D1, D2, T2, X1-X5, X7 |
| Skipped | 9 | W1 (reasoned), A4, I1, T1, H1, H2, H3, H5, H6 |

Skipped items need owner access, hardware this machine lacks, or no action: repository settings, the `v0.1.0` tag, Cloudflare secrets, the first npm publish, a Weblate account, a real iPhone, a real disk permission dialog.

## Decisions the repository owner must approve

- Row 80: the countdown lives in `sessionStorage`, where `docs/feature-gaps.md` suggested the URL.
- Row 85: decision 39 narrows to ARIA snapshots. Nobody here can produce Ubuntu PNGs for screenshot assertions.
- Row 43 budget: the 1.5 s open budget fails (local median 1774 ms, CI 2559 ms). We kept the threshold and did no performance work.
- Row 86: task list marks draw after the sanitizers, and the schema drops `input`.
- Row 88: the mirroring threat model, with the review's corrections.
- Rows 89 and 93 (merged): no fallback where OPFS cannot write; Save and the zip export refuse rather than overwrite or leave files out.
- `wt/comments` row 97: an optional display name, stored in the browser, which travels with shared comments.
- `wt/canvas` row 98: a "Saved sketches" panel in place of automatic pruning, its placement and wording, and hiding "Browse libraries".
- `wt/sections` row 100: followers ignore `?sections=` and count every slide. The row does not say whether a share link carries `?sections=`, and today it does not.
- `wt/pwa` row 99: `file_handlers` and an hourly update check.
- `wt/mirror-hardening` row 103: the design sends a `keep` op before the strokes, where the review suggested after, so a receiver full of stale strokes can accept new ones.
- Rule 10: `pnpm/action-setup` v6.1.1 dates from 2026-11-03, inside 7 days when audited. The rule names dependencies, so decide whether it covers actions. `handoff/notes/actions-audit.md` holds the table. zizmor's online audits stay off.
- Not yet decided: Y1 (focus ring in the fill frame), F1 (Escape and Keyboard Lock), D1 (aspect-adaptive slides), R3 (languages beyond the 24).

Attribution: the first 7 commits on `feat/roadmap-next-up` name Claude Opus 5.5. A Sonnet worker wrote them under an instruction to use that line, and pushed history stays as it is. Later worker commits name the model that wrote them.

## Setup

- Toolchain: pnpm 12.16.1 through corepack, Playwright 1.64.1. The repository pins Node 24.22.2.
- Node mismatch: set `pnpm_config_runtime_on_fail=warn` to run on another Node version. `--runtime-on-fail=download` breaks `--frozen-lockfile`.
- Local Chromium paths: set `DOCWALK_CHROMIUM_PATH` (headless shell) and optionally `DOCWALK_CHROMIUM_FULL_PATH` (full Chrome). CI uses the headless shell, and the wake lock tests behave differently between the two.
- `DOCWALK_E2E_PORT` picks the e2e port. Port 4190 is restricted in Firefox and WebKit. The sub-path build takes the next port, so leave gaps between worktrees.

## Windows traps

- **Line endings:** clone with `core.autocrlf=false`. The repository has no `.gitattributes`, and CRLF breaks the CSP hash of the inline script in `index.html`.
- **Nested `pnpm`:** `typecheck`, `build`, `check` and Playwright's web server call `pnpm` themselves and fail with "'pnpm' is not recognized" when only corepack is installed. Put a `pnpm.cmd` holding `corepack pnpm %*` first on PATH, in `/c/...` form, because a `C:/...` entry breaks at the colon. `corepack enable` should also work; nobody tried it here.
- **WebKit cannot write OPFS here:** Playwright's WebKit on Windows has `createWritable`, but a write leaves the file empty. 9 of 15 tests in `e2e/workspace.spec.ts` fail on that engine, base branch included. Trust CI's Ubuntu WebKit for those tests.
- **`pnpm lint:design` and `pnpm check` hang on old bases:** branches without `wt/windows-gate` still call the `design.md` bin, and `cmd` opens it in the program registered for `.md` files. Merge the base first.
- **Never run `chrome.exe --version`:** it opens a visible browser window. Read the file's version metadata instead.
- **Stale previews:** Playwright can leave `vite preview` running. Locally `reuseExistingServer` is on, so a spec reuses that server and tests whatever `dist` holds. Build before you run a spec, and give each worktree its own port. On 2026-11-09 the fork owner's machine still had a `vite preview --port 4174` process from 2026-11-08, started before this work. We left it alone.
- **`pnpm size`:** it exits 1 with no output on Windows until `wt/pwa` lands. That branch printed 415.2 kB gzip with exit 0.

`handoff/baseline.md` holds the first local measurement, in Turkish, at `77871a8`. `wt/windows-gate` fixed the six Windows failures it lists: `check` at `6df9b60` ran 1961 unit and browser tests and 36 Worker tests with exit 0, and `e2e/mcp.spec.ts` passed 3 of 3 on Chromium. Those counts predate the workspace merge.

## Next steps

1. Read the CI result of `feat/roadmap-next-up`, listed in the branch table.
2. Fix the WebKit race (open problem 1), then get the branch green.
3. Land `wt/mirror-hardening` with M1 and M2 fixed.
4. Land `wt/pwa` and `wt/canvas`, the two closest to done: merge the base, run what their notes list, write the docs, dispatch CI, and merge with `--no-ff`.
5. Finish `wt/sections`, `wt/comments` and `wt/monaco`, then `wt/math-emoji` with its security review. Their code overlaps only in the files listed under merge notes, so they can run in parallel.
6. Finish the mirroring remainder (N3). Then start N7, N9 and N10, which share files with it, and after them the items marked "Not started".
7. Write the pull request text when the fork owner asks. No draft exists yet, and it must list the approvals above.
