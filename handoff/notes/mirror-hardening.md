# mirror-hardening (handed off, unfinished)

Branch `wt/mirror-hardening` in `<worktree>`, head `ee0b406` (pushed). Task: fix the
mirror security review (M1, M2, M3, L1, L2) under decision row 103.

## Status

| Item | State |
| --- | --- |
| M2 (resync cuts a live stroke, ghost after cancel) | Tests written and failing. Fix not written. |
| M1 (non-destructive resync, scaled gap, view signature) | Feed tests written and failing. Nothing else written. |
| M3 (coalesce hello-triggered states) | Not started. |
| L1 (bridge resync gap) | Not started. |
| L2 (wording only) | Not started. |
| Decision row 103, SECURITY.md, mirrorTypes.ts:28 wording | Not started. |

Only `src/annotate/mirrorFeed.test.ts` changed. Run once, unit project, that file:
11 failed, 23 passed (the failures are the intended red tests). Nothing else was run:
no typecheck, lint, fmt, browser, e2e or worker test. The install did run (`install --frozen-lockfile`, ok).

## Design decided (not yet implemented)

- New op `{op:"keep", slide, ids}` (ids 0..200, strict schema, `MAX_KEEP_IDS = MAX_SLIDE_STROKES`).
  Store: delete strokes of the slide not in `ids`; no-op on an unknown slide.
- Resync sends `keep` FIRST (ids = strokes it will send plus live strokes with `sent > 0`), then the
  strokes from 0. Deviation from the brief's "closing op": keep-first lets a receiver full of stale
  strokes (200 cap) accept the new ones, and an interrupted resync leaves no stale marks. Flag it to the owner.
- `fit(strokes, maxStrokes, maxPoints)` reserves room for live strokes so `keep` never exceeds 200 ids.
- M2: resync sends `live.points.slice(0, live.sent)` and skips live strokes with `sent === 0`.
- Store: a `stroke` from 0 identical to the held one returns "unchanged" (still touches LRU), so a
  repeat resync notifies nobody.
- View (`mirrorView.ts:142`): compare points as well as tool, colour and length (reference first, then
  element-wise), so a same-id same-length replacement redraws.
- Gap: move `RESYNC_MIN_GAP_MS` to `mirrorTypes.ts`; add a plaintext byte rate (about 40 KB/s, roughly
  64 KB/s of sealed frames; measure the ratio, a full chunk is about 1.3 KB JSON and 2.1 KB framed);
  `resyncGapMs(bytes) = max(2000, bytes / rate)`. Host counts `JSON.stringify(op).length` in a wrapper
  around `sendOp`. Bridge uses the minimum gap with a trailing deferred resync (not a drop), and
  clears its timer on stop.
- M3 in `host.ts`: hello-triggered `sendState` runs at once, then at most one trailing state per 250 ms.
- Old receiver given a `clear`-style resync still works (`clear` stays in the schema). An old follower
  given `keep` drops it on the schema check; strokes still replace by id, only stale marks stay. Same build
  serves presenter and followers, so no version negotiation. Say this in row 103.
- Slides limit wording: the code is right (the 17th evicts the least recently touched); fix the text in
  row 88's replacement claims and `mirrorTypes.ts:28`.

## Remaining tests to write (all red first)

`mirrorStore.test.ts` (keep, unchanged resend), `crypto.test.ts` (keep in MESSAGES, hostile keep cases,
keep frame size, worst-case resync cost with real encryption), `mirrorView.browser.test.ts` (same-length
replacement redraws), `bridge.test.ts` (flood gives one immediate and one trailing resync; the
"second presenter window" test now needs a 2 s advance), `remote.browser.test.ts` (the two tests that
count `clear` become `keep`; hello flood state coalescing; scaled gap, about 5 s real time).

## Exact next step

Write the decision row 103 after row 88 in `docs/decisions.md` (mark row 88 "accepted; refined by 103"),
run `oxfmt docs/decisions.md`, then write the remaining red tests, then the code in the order
mirrorTypes, mirrorSchema, mirrorStore, mirrorFeed, mirrorView, host, bridge, then SECURITY.md lines 56
and 65 to 71. Gate commands are in the task: unit and browser vitest for `src/annotate src/remote
src/presenter`, a build, `e2e/mirror.spec.ts` on chromium, firefox, webkit (port 4301), `test:worker`,
typecheck, lint, fmt:check. Prove the new tests fail without the fix by running them on the red commit.

## CHANGELOG / ROADMAP / MEMORY

Nothing to add until the work lands.
