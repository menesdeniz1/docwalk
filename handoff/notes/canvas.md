# wt/canvas: handoff note

Branch `wt/canvas`, worktree `<worktree>`, e2e port 4261. Decision row is now **98** (was 89; rows 89-93 belong to another branch). It sits in the "Workspace, editors and agents" section after row 64. The tests that cite it were renumbered.

## Finished (all committed)
- Merged `origin/feat/roadmap-next-up` (only conflict: `docs/decisions.md`).
- K1: `src/canvas/controls.ts` names `.main-menu-trigger` ("Canvas menu", message `sketch_menu_label`) and keeps `.reset-zoom-button`'s `aria-label` = Excalidraw's title + visible percentage (MutationObserver). The axe exclusion in `e2e/canvas.spec.ts` is gone and the spec passes.
- K2: `.docwalk-sketch .library-menu-browse-button { display: none }` in `canvas.css`. The Publish library form stays (a roadmap limit, as the row says).
- K3: "Saved sketches" panel (`SavedSketches.tsx`): lists key, size, date; delete one; "Delete all others" with an inline question; the open sketch is never offered. Placement (overlay at the top-right of the canvas, button in the header) and wording need the owner's approval, as the row says.
- Save errors: `full` state ("storage is full"), `unkept` state (no `crypto.subtle`), unreadable stored sketch shows a message and is left untouched, unchanged scene writes nothing, export names via `names.ts`.
- K4: nothing to do; the row says cylinders stay rectangles (upstream limit).

## Test finding
The row and tests agree. One cause found while making "unchanged scene writes nothing" pass: the header's title block had `flex: 1 1 auto`, so the longer save note moved the buttons to a second row on a narrow screen, which resized the canvas, so Excalidraw called onChange, which rewrote the note: a loop. Fixed with `flex: 1 1 8rem` (a latent bug that predates this branch).

## Verified (Windows, via dw-run.sh with a pnpm shim on PATH; nothing found pnpm otherwise)
- `exec vitest run --project unit --maxWorkers=1 src/canvas`: 10 passed.
- `exec vitest run --project browser --maxWorkers=1 src/canvas`: 25 passed (3 files).
- `typecheck`, `fmt:check`: pass. `lint`: no errors (warnings only, in tests, mostly not ours).
- `build`, then `playwright test e2e/canvas.spec.ts --project chromium --workers=1` on port 4261: 7 passed.

## Not verified
- `e2e/canvas.spec.ts` on firefox and webkit (not run).
- Turkish strings not reviewed by a native speaker.
- Sub-path build not tried.

## Next step
Run `DOCWALK_E2E_PORT=4261 RUN exec playwright test e2e/canvas.spec.ts --project firefox --workers=1`, then `--project webkit`, after a fresh `build`. If a Quota-error check fails on one engine, see `isQuotaError` in `SketchDialog.tsx`.

## For the lead
- Adding row 98 widened the Workspace table, so `oxfmt` re-padded every row of it (whitespace only, commit `docs(decisions): pad the workspace table ...`). Other branches editing rows 53-74 may conflict; re-run oxfmt to resolve.
- ROADMAP lines to close: "Later rounds, Canvas": K1, K2 (Browse libraries link; the Publish form remains), K3 (panel instead of pruning). K4 stays open as a limit.
- CHANGELOG: "Canvas: the sketch menu and zoom buttons have names, the Library no longer links to excalidraw.com, a Saved sketches panel deletes stored sketches, and a full storage or missing crypto.subtle is reported as such."
- MEMORY: (1) a status text whose width changes the header's wrap can loop through Excalidraw's onChange; keep flex bases independent of text. (2) Excalidraw offers no props for the menu and zoom names; they are set on its DOM by observer. (3) vitest browser iframe is 414px wide unless a test calls `page.viewport`.
