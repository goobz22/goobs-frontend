# Production audit and W-977 severity justification

Library implementation complete (2026-10-03), release 0.302.5: resumed W-977
epoch 2 in native Codex seat eb94 after all four sessions agreed their lanes.
Saved the paused implementation as `5b0415d8`; fixed the board permission defect
as `1a357d86`. Requirements live in [the ticket severity spec](docs/specs/ticket-severity-justification.md).

One shared customer/staff `onSetSeverity({taskId,severityId,reason})` editor handles
both directions and requires a trimmed 20..2000-character justification. Pending
saves block duplicates; errors retain drafts; success clears them; unchanged
severity is a no-op. Option refreshes preserve drafts, and task identity keys the
editor. The customer `onRaiseSeverity` remains compatible. All three board variants
forward the setter for write access and withhold it for read-only access. Generic
`onEdit` no longer writes severity; other customer field restrictions remain.

Evidence: the read-only regression failed in all three variants before the fix.
`bun run test:browser` now passes 7 form/editor cases, 14 severity cases and 6 actual
CSF severity plays. `bun run typecheck`, `bun run lint:all` (including 54 unit tests),
`bun run build`, `bun run build-storybook`, `bun run lint:package`, `bun run lint:api`
and `bun run lint:budget` all exit 0. CI runs the browser cases and severity plays.
The new literal-payload severity guard catches 3 planted bypasses, allows 2 clean
edits, and finds 0 violations over 13 files / 5 generic ticket-edit object literals.
It is included in lint:all; it does not claim to analyze arbitrary payload dataflow.

ESM entry: 1,555,974 B, 327.29 KB gzip; UMD: 3,027,555 B; CSS: 444,344 B.
Existing library budgets pass without changes. The operator's 170KB-gzip consumer
first-load ceiling still applies to ThothOS and must be measured in that lane.
Storybook builds with its existing asset-size warnings; tracked output is refreshed.
No cloud Chromatic run was performed. Automatic reviews of the two earlier commits
were inconclusive because remote workers lacked this repo's SHAs; independent pool
verification remains required.

Next: submit the library evidence for pool verification and hand off 0.302.5 to
ThothOS seat c0bf, which owns server enforcement, consumer wiring and full-stack
acceptance. Publishing belongs to the operator. Codex did not publish or push.

Broader audit stays active. Security portion is posted as W-976 for the required
Opus/Sonnet 5+ seat. Initial census: 660 source assets, 529 TSX and 94 CSS.
React 19.3.0 is current per official docs/npm. Compiler is not enabled in Vite
despite source comments. Stricter purity lint finds exactly two render-time
Math.random calls in Stepper's story. QRCode memoizes viewport width without
resize subscription. CI does not explicitly run all Storybook play functions.
Existing drift checks retain recorded exceptions, so green is not full consistency.
Official docs were fetched directly after the shared hook rejected the web tool.

Broader audit scratch: `%TEMP%/goobs-deep-audit-01a0ffac`. W-801 dropdown work now
belongs to the d87c session by the four-seat agreement; do not duplicate it here.
W-929 is verified and must not be repeated. W-976 security work requires its
qualified reviewer seat and is separate from this library implementation.

## Prior seven-issue audit — 0.302.4

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

Committed as `ed9edccb`. Automatic source review was inconclusive due to remote
workers lacking this repo's SHA. Publishing remains the operator's step.
Release: bump, build and commit. The operator publishes; leave the ThothOS pin unchanged.
