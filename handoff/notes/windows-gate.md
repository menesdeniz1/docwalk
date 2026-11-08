# wt/windows-gate notes

## ROADMAP lines closed

The "Known gaps" list has no line for the Windows gate (only the `pnpm size`
one, which wt/pwa owns). Nothing to strike. Optional new line if the lead wants
the nested-pnpm gap on record:

- On Windows, a nested `pnpm` (inside `typecheck`, `check`, the Playwright
  web server) needs `pnpm` on PATH; with only `corepack pnpm` available the
  scripts fail with "'pnpm' is not recognized". `corepack enable` fixes it.

## CHANGELOG

No user-facing entry: the changes are tests, a dev script and tooling config.
Skip, or: "### Fixed - `pnpm check` runs on Windows: the design tests, the
Stryker config test and the MCP end-to-end spec resolve paths with
`fileURLToPath`, and `lint:design` calls the `designmd` bin."

## MEMORY learnings

1. `new URL(rel, import.meta.url).pathname` is wrong for file paths on Windows
   (`/C:/...`); use `fileURLToPath`. `readFileSync(new URL(...))` is fine.
   `import.meta.dirname` is fine.
2. `globSync` returns backslashes on Windows. `path.matchesGlob` accepts both
   separators there, so exclusions worked, but `not.toContain("a/b.ts")`
   assertions passed by accident. Normalize before comparing or emitting
   patterns for Stryker.
3. `design.md` as a bin name collides with the `.md` file association on
   Windows; use `designmd`.
