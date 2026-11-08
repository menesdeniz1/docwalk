# wt/workspace notes

## ROADMAP lines this work closes

The "Later rounds" Workspace bullet (quote):

> - Workspace: no fallback for Safari before 26 (no `createWritable`) or
>   private windows (panel hidden); OPFS edits in another tab are not watched
>   (last write wins); without `FileSystemObserver` new or removed files show
>   on window focus only; `navigator.storage.persist()` is not requested;
>   comments and sketches follow a rename or delete made in docwalk, not
>   one made on disk or past the listing's 5000-entry cap.

Replace it with what is left:

> - Workspace: no fallback for Safari before 26 (no `createWritable`) or
>   private windows; the panel stays hidden there (decision 89, revisit when
>   the Safari-before-26 share justifies a `createSyncAccessHandle` worker).
>   A rename or move made on disk, outside docwalk, does not carry comments
>   and sketches: a file's identity is its folder and path (65), and a guess
>   from size, time or text would hand one file's annotations to another
>   (decision 92). They stay under the old path and return if the file is
>   renamed back. A rename in another tab reads as a deletion in this one
>   (decision 90). Without `FileSystemObserver` the folder tree is listed
>   every 3 s, so a change shows up to about 3 s late (or up to 20 times the
>   duration of a very slow listing).

Closed: W2 (decision 90), W3 and W4 (decision 91), W5 (decision 92). W1 is a
decision only (89), no code.

Also closed, not on the roadmap (decision 93): Save to a local folder wrote
over a file it could not read; the zip export dropped files past the listing
cap without saying so.

## CHANGELOG entry

Format is Keep a Changelog; the file has only `[Unreleased]` ("The first
release") so add under `### Added` / `### Fixed` there:

- Added: The browser workspace follows edits made in another tab, and does
  not write a file another tab deleted or changed without asking. The tree of
  a local folder is listed again every few seconds in browsers without
  `FileSystemObserver`. The browser is asked to keep the workspace after the
  first save; the panel says when it has not promised to.
- Fixed: Renaming or deleting a folder in a workspace with more than 5000
  entries moves or drops the comments and sketches of every file in it. Save
  no longer writes over a local file it cannot read, and the zip export
  refuses instead of leaving out files past the listing cap.

## MEMORY learnings

1. `e2e/helpers.ts` `ready()` waits for a plural "slides" in the status line,
   so a one-slide file ("1 slide") never satisfies it. A second tab that
   reopens a Blank-template file must `goto("/")` and wait for the title.
2. On Windows a nested `pnpm` inside a script (`typecheck`, the Playwright
   web server) fails with "'pnpm' is not recognized" unless a `pnpm.cmd` shim
   that runs `corepack pnpm %*` is first on PATH, in Windows form
   (`cygpath -w`), not `C:/...`.
3. `FileSystemObserver` exists in Chromium only. In the e2e the stub
   "disk" is an OPFS directory, so the polling and observer paths are both
   exercised there; the observer test skips itself on Firefox and WebKit.

## What renames made on disk still cannot do (decision 92)

A file or folder renamed or moved outside docwalk (a file manager, an agent,
`git mv`) does not take its comments and sketches along. Annotations are keyed
by folder and path, nothing in the file says which path it came from, and
matching by size, time or text hash would give one file's annotations to
another (two stub READMEs; an edit plus a move). The file opens as new; the old
annotations stay under the old path and come back if it is renamed back.
`FileSystemObserver` reports moves in Chromium only and no real disk was
available to test it, so moves are not followed even there.

## WebKit e2e on this Windows machine

Playwright's WebKit here reports Safari 27.2 and has `createWritable`, but a
write through it leaves the OPFS file empty (probe: write "hello", close, read
back size 0). Every workspace e2e test that saves a file fails on it (9 of 15),
base branch included (verified on `origin/feat/roadmap-next-up`, "a project
made from a template" fails there too). The tests that write nothing pass
(refuse-OPFS, keyboard tree, 390 px targets, axe). Run the spec on WebKit
in CI (Ubuntu) before trusting it there.
