# Pinned GitHub Actions audit (as of 2026-11-09)

Scope: every `uses:` line in `.github/workflows/*.yml` (ci, deploy-cloudflare,
deploy-pages, mutation). No `.github/actions/` directory exists. 25 uses,
7 distinct actions.

Method: `gh api repos/<owner>/<repo>/git/ref/tags/<tag>` (annotated tags
peeled through `git/tags/<sha>`), `commits/<sha>` for the committer date,
`releases/latest` for information only.

| Action | Pinned SHA (prefix) | Tag | Tag -> SHA | Commit date | Age (days) | < 7 days | Latest release | Uses |
|---|---|---|---|---|---|---|---|---|
| actions/checkout | 3d3c42e5 | v7.0.1 | match (lightweight) | 2026-07-17 | 114 | no | v7.0.1 (same) | 7 |
| pnpm/action-setup | 73e46992 | v6.1.1 | match (annotated, 9bbca1e9 peels to pinned SHA) | 2026-11-03 | 5 | **YES** | v6.1.1 (same) | 6 |
| actions/setup-node | 949feb24 | v7.1.0 | match (lightweight) | 2026-10-08 | 31 | no | v7.1.0 (same) | 6 |
| actions/upload-artifact | cf430e03 | v7.0.2 | match (lightweight) | 2026-10-07 | 32 | no | v7.0.2 (same) | 3 |
| actions/configure-pages | 45bfe019 | v6.0.0 | match (lightweight) | 2026-03-24 | 228 | no | v6.0.0 (same) | 1 |
| actions/upload-pages-artifact | fc324d35 | v5.0.0 | match (lightweight) | 2026-04-08 | 214 | no | v5.0.0 (same) | 1 |
| actions/deploy-pages | 368f8252 | v5.0.1 | match (lightweight) | 2026-09-01 | 67 | no | v5.0.1 (same) | 1 |

Full pinned SHAs:

- actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 (v7.0.1)
- pnpm/action-setup@73e46992e05b19abd31f2f3c20e0e7370d762115 (v6.1.1)
- actions/setup-node@949feb2413d6458794dcd2491c4babbbce0c15c1 (v7.1.0)
- actions/upload-artifact@cf430e030ddbb5b0abf93d22962f4752f3646cd9 (v7.0.2)
- actions/configure-pages@45bfe0192ca1faeb007ade9deae92b16b8254a0d (v6.0.0)
- actions/upload-pages-artifact@fc324d3547104276b827a68afc52ff2a11cc49c9 (v5.0.0)
- actions/deploy-pages@368f82528645a54fb793d4d04e342629a3f51346 (v5.0.1)

Findings:

- All 7 tags point at the pinned SHA. No mismatch.
- pnpm/action-setup v6.1.1 is 5 days old (commit and release both 2026-11-03).
  That is under the 7-day rule in AGENTS.md rule 10. The rule is written for
  dependencies; it is unclear whether it covers Actions, so this is flagged,
  not decided.
- For every action, the latest release (`releases/latest`) is the pinned tag.
  The check is information only. `releases/latest` excludes prereleases and
  is not the same as the highest tag.

## zizmor invocation

`.github/workflows/ci.yml` lines 112-120, job `zizmor`, runs on ubuntu-latest:

    pipx run zizmor==1.32.0 --offline .github/workflows/

- `--offline` is passed, so online audits (for example `known-vulnerable-actions`
  and `impostor-commit`) are disabled in CI. The job comment says so explicitly.
- The job sets no `GH_TOKEN` or `GITHUB_TOKEN`, and `grep` finds no token
  reference anywhere under `.github/`. So the online audits could not run
  even without `--offline`.
- Result: online audits are NOT enabled in CI. The ROADMAP item stays open.
- Not verified: zizmor's documentation for 1.32.0 was not consulted, and zizmor
  was not run, per the task. The `--offline` behaviour is taken from the
  invocation and the CI comment.

## Not checked

- Whether the tag ages or tag-to-SHA matches would be caught by any zizmor audit
  (this is a manual check).
- Whether `releases/latest` is the newest tag for any action.
- `.github/dependabot.yml` (not a workflow file).
