# Production audit and W-977 severity justification

Active (2026-10-03): operator requested a deep security/React/memoization/design
audit with enforcing tests, then directed this seat to the other AI's goobs handoff.
Claimed and fully acknowledged W-977 epoch 1 after announcement A-1084.

W-977: one shared customer/staff severity setter; both directions need trimmed
20..2000-character justification. Pending blocks duplicates; errors retain draft;
success clears it; unchanged severity needs no reason. Proposed `onSetSeverity`
payload `{taskId,severityId,reason}` announced to the ThothOS owner seat. That seat
owns server/consumer changes; this seat owns goobs only. No publish/push.

Broader audit stays active. Security portion is posted as W-976 for the required
Opus/Sonnet 5+ seat. Initial census: 660 source assets, 529 TSX and 94 CSS.
React 19.3.0 is current per official docs/npm. Compiler is not enabled in Vite
despite source comments. Stricter purity lint finds exactly two render-time
Math.random calls in Stepper's story. QRCode memoizes viewport width without
resize subscription. CI does not explicitly run all Storybook play functions.
Existing drift checks retain recorded exceptions, so green is not full consistency.
Official docs were fetched directly after the shared hook rejected the web tool.

Next: agree the callback contract and add failing staff/customer severity stories
and browser tests, then implement W-977; resume the broader audit afterwards.
Scratch: `%TEMP%/goobs-deep-audit-01a0ffac`. Existing W-801 MultiSelectChip refresh
failure needs diagnosis later; W-929 is verified and must not be repeated. Preserve
the operator's 170KB-gzip consumer first-load ceiling.

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
