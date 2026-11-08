# math-emoji (branch wt/math-emoji): handed off, unfinished

Roadmap item: "4. Math and emoji shortcodes, which GitHub renders natively." Not closed yet.

## State

Committed on the branch: decision row 101 (in "Markdown fidelity", after 86), parsing of the four math forms (remark-math plus Pandoc's dollar rules), and one wip commit with the rest below.

Written but only partly verified:
- `src/render/math.ts` (eager DOM step `renderMath`), `mathBuild.ts` (lazy: Temml 0.14.0 + `Temml-Local.css`), `mathAllow.ts` (element, attribute and class lists, no DOM), `mathRebuild.ts` (allowlist copy of Temml's tree).
- `src/render/emoji.ts` (eager `renderEmoji`) and `emojiMap.ts` (lazy, gemoji 8.1.0).
- Wiring in `Deck.tsx`, `PresenterView.tsx`, `DocumentView.tsx` (math and emoji run beside the diagrams, before the measure).
- `measure.ts` and `pages.ts`: a `math` overflow list for `.docwalk-math-display`, message `deck_overflow_math` (en, tr).
- `src/export/pages.ts`: DOMPurify `mathMl` profile, forbidden MathML elements, and an attribute hook that applies the same lists.
- `tooling/pwa.ts`: temml and gemoji are runtime-cached, not precached; case added to `tooling/pwa.test.ts`.
- CSS for `.docwalk-math-display` and `.docwalk-math-error` in `content.css`.

## Verified (commands, this worktree)

- `typecheck`: pass (before the last small edits to `mathRebuild.ts`; not rerun).
- `exec vitest run --project unit --maxWorkers=1 src/render src/sectioning tooling/pwa.test.ts`: 158 passed.
- `exec vitest run --project browser --maxWorkers=1 src/render/math src/render/emoji`: 66 of 67 passed on the last run. The one failure is a test bug: `:__proto__:` in Markdown becomes bold text, so the page text is `:proto:`. Fix the test (use `:constructor:` and `:toString:` only, or escape the underscores).

## Not verified

lint, fmt:check (the new files are unformatted), the deck/presenter/document/export browser tests, any e2e (no `e2e/math.spec.ts` yet; port 4291), perf.spec, the build, Firefox and WebKit, the size numbers, the PNG export of MathML, and a visual check of display equations.

## Not written yet

- Tests: a deck test (many display equations paginate whole and none is flagged, which proves math renders before the measure; a too-wide equation raises the "equations too wide" note); an export test (MathML kept, hostile attributes injected into a slide are removed); a document-mode test; `e2e/math.spec.ts` on three engines with counts.
- Measure the lazy chunk sizes (Temml, its CSS, gemoji) and the first-load total against the 979 kB baseline; fill the "Cost" sentence of row 101 (it says sizes are "in the changelog"; put the numbers in the row instead).
- Row 101 states "28 element names" and "28 attributes"; the lists have 28 and 33. Correct the row.
- CONTEXT.md glossary entries (math, emoji shortcode), Turkish included.
- Known gaps to list: slide titles, breadcrumbs and the outline show the shortcode text; formulas use the system math font (Temml's script font is 9 kB but its use is untested); `\boxed` and `\color` are kept through classes and `mathcolor`, other inline `style` Temml writes (padding in `aligned`, `\tag` width) is dropped; a formula never opened online shows its source offline; a raw `<code class="language-math">` written in HTML renders as math.

## Next step

Fix the emoji test, run `fmt` on the new files, rerun typecheck and the two vitest commands, then write the deck and export tests and the e2e spec, then build and measure.

## Every place document text reaches the DOM (math and emoji)

1. `nodesToHtml`: formula TeX becomes the text of `<code class="language-math">` (remark-rehype escapes it), then both sanitizers run. Text only.
2. `renderMath` (`src/render/math.ts`): reads `code.textContent`, passes it to `buildMath`, and inserts the returned `<math>` element. TeX goes to Temml as a string and comes back as a node tree.
3. `mathBuild.ts`: Temml's `toNode()` elements go through `rebuild` (`mathRebuild.ts`). Output is created with `createElementNS`, `setAttribute` (listed names, values matching `[\w.%+#, -]{0,64}`, classes from a fixed list, a style turned into `mathcolor`, `mathbackground` or `tml-fbox`) and `createTextNode`. No HTML string is parsed or assigned.
4. On failure the original `code` or `pre` stays and gets the class `docwalk-math-error`; the text is unchanged.
5. `renderEmoji`: assigns `Text.data` on existing text nodes outside code, pre, kbd, samp, script, style, textarea, math and diagrams. Replacement strings come only from gemoji's map.
6. Exports (`src/export/pages.ts`): the live slide DOM, now with MathML, goes through DOMPurify again; the hook keeps MathML attributes to the same lists.
7. Limits: 4,000 characters, nesting 24, 3,000 elements, depth 40, 500 formulas per call, Temml `trust` off, `maxExpand` 200, `maxSize` 20 em, a new `macros` object per formula.

## CHANGELOG entry (draft)

Math and emoji: GitHub's `$…$`, `` $`…`$ ``, `$$…$$`, a `math` fence and `:name:` shortcodes now render, in slides, document mode, the presenter's previews and the exports. The math engine and the emoji list are lazy chunks outside the precache. Numbers still to measure.

## MEMORY learnings

- A `$$x$$` on one line is inline math; display math needs `$$` on lines of their own.
- Setting a colour through CSSOM turns `#ff0000` into `rgb(255, 0, 0)` in the `style` attribute, so code reading Temml's `toNode()` output must parse `rgb()`.
- The Bash tool collapses doubled backslashes in heredocs and `node -e` strings; write TeX-heavy files with the Write or Edit tools.
