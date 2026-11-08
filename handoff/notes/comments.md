# wt/comments: handoff note

Branch `wt/comments`, worktree `<worktree>`. Pushed to origin. Not finished.

## Done
- Merged `origin/feat/roadmap-next-up`; the only conflict was `docs/decisions.md`. This branch's rows 89-92 are now 94-97, placed after row 65; row 65's status points at 94, 95, 96.
- C2 tombstones: `types.ts`, `schema.ts` (`mergeSets`, `tombstoneFor`, trusted times, `deleted` in file and link), `payload.ts`, `store.ts` (`read`, `merge` in one transaction, `remove`), `useComments.ts` (delete writes a tombstone, adopts other tabs' changes, a failed load is never saved over and retries on the next change), `src/workspace/annotations.ts` (read, merge, remove). `link.ts` takes several link values, fullest first, so deletions never cost a link its comments.
- C3: `diagramSig`, `currentAnchor`, `currentKey` in `anchors.ts`; node anchors written by the panel carry `sig`; counts, groups and markers use the current key.
- C4: `author.ts`, `Your name` field in the panel, author shown as text in a `<bdi>`, export and share notes. The owner must approve C4 before release (row 97 says so).
- C1: `slideMarkers.ts` and CSS in `controls.css`, wired in `useCommentsUi.tsx`.
- Messages added to `messages/en.json` and `messages/tr.json`.

## Verified
- `exec vitest run --project unit --maxWorkers=1 src/comments`: 3 files, 74 tests pass (run before the store, hook and panel edits).
- `exec vitest run --project browser --maxWorkers=1 src/comments`: 4 files, 34 tests pass.
- `typecheck` passed except one error in `CommentsPanel.browser.test.ts`, fixed afterwards and not re-run.

## Not verified or not done
- typecheck after the last edits, lint, fmt:check (run `fmt` first; `docs/decisions.md` and new files may need it).
- `src/workspace` browser tests (annotations.ts changed).
- No browser test for `slideMarkers.ts` yet: scaled stage at 0.4 and 2, button on screen at least 24 CSS px, click calls the open handler, removed on destroy.
- No e2e: C1 marker on a scaled slide, C4 name flow, delete then older sidecar, swapped diagrams keep their node comments. Build, chromium, firefox and webkit counts not run.
- No unit test for the link fallback in `payload.test.ts`.
- The commit is `wip(comments)`; replace it with normal commits once the above passes.

## Next step
Run `typecheck`, `lint`, `fmt:check`, fix what they report, then write the slide marker browser test and the e2e cases.
