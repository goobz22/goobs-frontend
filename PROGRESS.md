# Audit fixes — 0.302.4

Base: `baa76090` (0.302.3). The operator requested all seven audit findings fixed.

Scope: HTML sanitization, batched form updates, immutable array moves, parsed submit
values, nested validation errors, concurrent submits, and editor entity round trips.

Before: 43 existing tests and typecheck passed; browser probes reproduced all seven.
Evidence: session scratch `goobs-audit-01a0ffac/results.json`.

Done: form browser regressions went from 0/5 to 5/5; editor tests went from
9 failing / 2 passing to 11/11 passing. Expanded browser coverage passes 7/7.
Typecheck, full lint, all 54 unit tests, library build, Storybook build,
package exports and API-surface checks pass. State guard: 3 findings to 0
across 3 files, with a passing planted-defect selftest.

Build tradeoff: parser-based sanitization raises the ESM entry to 1,556,571 B
(327 KB gzip) and UMD to 3,027,979 B. The size registry records this explicit
dependency cost with its existing ~10% headroom policy; eager-payload checks
remain intact. Storybook emits asset-size warnings. No Chromatic token is
available, so a cloud visual comparison cannot run in this session.

Final verification: the budget gate and its planted-defect selftest pass.
The built ESM package passes parsed-submit, safe-HTML and formatting checks
in Chrome. All 5 selected Storybook plays pass with 0 browser errors and 0
axe violations after correcting the story fixtures' theme and decorative alt.
Source diff whitespace check passes; generated Storybook bundles retain their
upstream formatting. The tracked Storybook output is included in the release.

Next: commit the verified 0.302.4 change. Publishing remains the operator's step.
Release: bump, build and commit. The operator publishes; leave the ThothOS pin unchanged.
