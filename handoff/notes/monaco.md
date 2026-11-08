# wt/monaco: handoff note (head 293532e, pushed to origin/wt/monaco)

Merged origin/feat/roadmap-next-up cleanly (no conflicts). `install --frozen-lockfile` was a no-op.

## Finished (in the wip commit)
- `initialLine` in MonacoEditor and SourceEditor (no echo through onCursorLine, clamped).
- Monaco: `showNotes()` runs after `setValue` on a documentId change.
- `src/editor/choice.ts`: module-level `storage` listener (key === EDITOR_KEY or null).
- `src/editor/monaco/markdown.ts` (+ `grammar.d.ts`): own Markdown Monarch grammar with
  states `item2`..`item16` (content offset of the list marker); registered by
  `registerMarkdown()` in MonacoEditor instead of the stock `register` import.
  Gotchas: use `String.raw` for RegExp sources; `cases` guard keys are `$1~.{N}`.
- oxfmt applied to src/editor and e2e/editor-choice.spec.ts.

## Verified
- `typecheck` passed (with the pnpm shim in scratchpad/shim on PATH; the script calls `pnpm`).
- `exec vitest run --project browser --maxWorkers=1 src/editor` (chromium): 53 of 54 passed on the last run.
  The failing one: CodeMirror "initialLine starts the cursor on that line and scrolls it into view".

## Left
1. Fix that test: cursor is on line 200 but it is not in view after two frames. `scrollTo` in the
   EditorView config and a dispatch right after creation both failed. Try dispatching the
   scroll inside requestAnimationFrame / after the first measure.
2. App.tsx: pass `initialLine` to `<Editor>`. Snapshot `cursor.current?.line` into state when
   `useEditorChoice()` changes (adjust-state-during-render, like `lastView`); check that lint
   accepts a ref read there.
3. Palette command "Editor: use Monaco" / "Editor: use CodeMirror" (`cmd_editor` in messages/en.json
   and tr.json, glossary in CONTEXT.md), hidden on touch (`COARSE_POINTER`). Small hunk in the
   `commands` array of App.tsx, built from `useStoredEditorChoice` + `setEditorChoice`.
4. Turkish for Monaco: before `import("./editor/monaco/MonacoEditor")` in App.tsx, await
   `import("monaco-editor/nls/lang/tr")` when the locale is tr (it sets
   `_VSCODE_NLS_MESSAGES`; must run before Monaco modules evaluate). Known limit: a language
   switch after Monaco loaded needs a reload.
5. O3 evidence: build, then inspect the Monaco chunk (3,262 kB raw, 831 kB gzip per the earlier look;
   hover/gotoSymbol/colorPicker/inlayHints/codeAction about 120 kB raw and clipboard/dropOrPasteInto/
   actionWidget about 75 kB raw cannot be split from the hover that shows the notes). Record the
   result in row 102.
6. Decision row 102 (section "Workspace, editors and agents", after row 74; refines 4 and 53):
   initial cursor line in the contract, storage sync, palette command, own grammar, Turkish
   table, chunk-size finding. Run stop-slop on it.
7. Gates: `lint`, `fmt:check`, e2e `editor-choice.spec.ts` on chromium (port 4251) after `build`,
   then firefox and webkit with counts.

## Not verified
Lint, fmt:check, any e2e, Firefox, WebKit, build.

## ROADMAP line this will close (when done)
"Monaco: the cursor line is not carried across an editor switch ...; the palette does not offer the editor choice."
CHANGELOG entry: to write when done.
