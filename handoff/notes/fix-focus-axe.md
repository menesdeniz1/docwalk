# fix-focus-axe: handoff note

Branch `wt/fix-focus-axe`, head `6023bdb`, pushed to `origin`. Stopped on request
before the fix was written.

## State

- Finished: root-cause investigation, as far as it can go locally.
- Not finished: the fix. `e2e/focus-view.spec.ts:195` is unchanged and still races.
- The only commit is `wip(deck)`, which adds `e2e/zz-probe.spec.ts`. It is a diagnostic
  with no assertions, and CI would run it if it merged. Delete it before merging.
- The task's done criteria are not met: no fix, no three-engine run of the fixed spec,
  and typecheck, lint and fmt:check were not run.

## Root cause

The failure is in the test's settle line, before axe starts; the task's "while axe
runs" is slightly off:

    await page.evaluate(() => Promise.all(document.getAnimations().map((a) => a.finished)));

`Animation.finished` rejects with `AbortError` when the animation is cancelled, and
`Promise.all` passes the first rejection on.

Entering present mode changes the colour of reveal.js's arrows
(`.docwalk-app[data-frame="fill"] .reveal .controls`). `.reveal .controls button` fades
`color` over 200 ms, and the arrow's `::before` and `::after` have `transition: all .15s`.
On WebKit, each frame of the button's fade cancelled the pseudo-elements' `color`
transitions and started new ones. Any of them captured in that window rejects.

The code view has never failed in CI. Its extra click on a line is a plausible reason,
because the click delays the settle line. This was not tested.

## Evidence

Forced-gap probe, in `e2e/zz-probe.spec.ts` at `6023bdb`. It runs the spec's steps with
DOM `click()` in one `evaluate`, a chosen gap after present mode begins, then the
unchanged settle line. Gaps 0, 50, 100, 150, 200, 250, 300 and 400 ms, once each, table
and image views, 48 of 48 tests completed (the probe logs outcomes, asserts nothing):

| Engine | Gap under 200 ms | Gap 200 ms and over |
| --- | --- | --- |
| WebKit (Windows) | `AbortError: The operation was aborted.` at all 4 gaps, both views | ok |
| Chromium | ok | ok |
| Firefox | ok | ok |

- The message matches CI's. Every WebKit abort came with 16 to 64 `transitioncancel`
  events after the settle line, all `controls-arrow::before/color` or `::after/color`.
  Chromium and Firefox logged none.
- An earlier event log on WebKit showed the sequence: button `color` transitions start
  at the Present click, then the pseudo-elements cancel and restart about every 15 ms
  until the button's fade ends.

## Reproduction

- The unchanged spec did NOT reproduce locally:
  `exec playwright test e2e/focus-view.spec.ts --project webkit --workers=1 --repeat-each=10 -g "passes axe"`
  gave 30 passed. In a probe run of the real Playwright flow, the settle line came about
  400 ms after the Present click, outside the window.
- The AbortError reproduces locally only with the forced gap.

## Not verified

- The link to CI. For CI to fail this way, the settle line must land within about 200 ms
  of Present (the local figure), and that timing was never measured on Ubuntu. It is the
  best-supported cause, not a proven one. CI could also have cancelled a different
  transition. The trace in the `docwalk-e2e-webkit` artifact of run 42515099653
  (57 MB) should show the action timing. It was not downloaded.
- Why only WebKit restarts the transitions. My reading is that it inherits the parent's
  animated value where the other engines use its end value. That comes from memory of the
  CSS Transitions spec and was not checked.
- Probe results come from one run per gap, on Windows WebKit.

## Next step

1. Replace the settle line with one that jumps transitions to their end and never awaits
   `.finished`, so a cancellation cannot reject. `e2e/markdown.spec.ts:62` already does
   this, and its comment explains why waiting is not enough on Firefox. Consider a loop,
   because finishing a button's fade can start a new pseudo-element transition. Untested
   sketch:

       await page.evaluate(() => {
         const running = () => document.getAnimations().filter((a) => a instanceof CSSTransition);
         for (let list = running(); list.length > 0; list = running()) for (const a of list) a.finish();
       });

   Check that the loop terminates on all three engines. Also correct the comment at
   line 194: it blames the focus ring, but the CSS search found no transition on the
   view's own controls. The fault looks like the test's, so `src/deck/focus.ts` should
   not need a change.
2. Delete `e2e/zz-probe.spec.ts`. Before that, run the settle replacement in its forced
   gaps on WebKit: this is the direct check that the fix closes the window.
3. Run `exec playwright test e2e/focus-view.spec.ts --workers=1` on chromium, firefox and
   webkit, webkit with `--repeat-each=10`, then typecheck, lint and fmt:check. Push.
4. CI's Ubuntu WebKit confirms after merge. Until then that part stays unverified.

## Running e2e on Windows

`vite build` passes but `pnpm build` then fails with "'pnpm' is not recognized", because
`pnpm` is not on PATH (only `corepack` is). Put a `pnpm.cmd` calling `corepack pnpm %*`
on PATH, in `/c/...` form: a `C:/...` entry breaks at the colon.

## Report items

- ROADMAP lines closed: none. ROADMAP was not checked.
- CHANGELOG entry: none until the fix lands.
- MEMORY learning, once the fix lands: never await `Animation.finished` across
  `document.getAnimations()` in a test. On WebKit an inherited property's fade cancels
  child transitions every frame, so the promise rejects with `AbortError`.
