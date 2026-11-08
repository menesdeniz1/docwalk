# fix-presenter notes

ROADMAP lines closed: none (test/markup fix under decision 88 mirroring).
New known gaps: none.

CHANGELOG: Fixed: the presenter window's marks overlay no longer shares the slide canvas class, so queries for the current slide's canvas find one element.

MEMORY learnings:
- A class names one role: the mirror overlay reused `docwalk-presenter-canvas`, which made "the canvas" ambiguous for tests and queries. Give an overlay its own class and list both in shared CSS.
- On this machine `pnpm` is not on PATH for child processes. Playwright's webServer (`pnpm build && pnpm preview`) needs a `pnpm` shim dir first on PATH (use `cygpath -u` for the PATH entry in Git Bash).
