# W-976 production security audit — 0.302.8

Implementation and local verification are complete on 2026-10-07. The public
ProjectBoard API now has one audience discriminator (`variant`), with no
independent `viewerRole` that can contradict it. `no-access` renders no
ProjectBoard/DataGrid data; read access removes task mutation and drag surfaces;
the customer variant structurally omits staff notes/comments, histories,
resolution/workflow editing and cross-ticket KB details. Notes and scheduling
remain independent, explicitly handler/grant-gated RBAC axes.

The audit also hardens rich-editor output and paste/link paths, route schemes,
CSV exports, form diagnostics, browser persistence, object-URL lifecycle,
dependency/CI supply chain, and file-validation documentation. The canonical
invariants and the full finding table live in
`docs/specs/security-boundaries.md` and `docs/security-audit-2026-10-07.md`.

Evidence: focused Chromium regressions pass 7/7; the security unit suite passes
5/5; the security source guard catches 11/11 planted defects and reports zero
violations over 568 TS/TSX files and 27 reviewed sink sites. `bun run
test:browser`, `bun run prepublishOnly`, the production dependency audit, package
and bundle gates, and the isolated Storybook build all exit 0. The Storybook
build retains its existing asset-size warnings. The full unit suite passes 66
tests / 168 assertions. The shipped dependency graph has zero known advisories;
five documented advisories remain in dev-only Storybook/stylelint tooling.

The ThothOS companion fix is implemented and regression-backed. Customer task
payloads no longer expose raw comment IDs; customer comment reads and mutation
responses exclude internal comments and full edit history; and reserved/internal
comments cannot be created or mutated by customers. Customer, employee, company,
and administrator task surfaces now make one audience decision and pass task
read/write capability separately. A compatibility boundary derives the legacy
0.302.5 `viewerRole` solely from `variant` until 0.302.8 is published, so host
call sites cannot create a contradictory pair. The bridge does not backport the
new `taskAccess` behavior: the library's read-only UI guarantee remains pending
the operator's 0.302.8 publication and ThothOS exact-pin update. Server RBAC and
handler gating remain the authority while that release handoff is outstanding.

Next: retain the exact goobs and ThothOS build/test receipts for independent pool
verification. The operator publishes and pushes; this lane does neither.

# W-1216 sanitizer loading and release 0.302.7

Implementation and publication checks pass in native Codex c0bf (2026-10-06,
epoch 3). The sanitizer/editor toolbar and authored article preview now load
through local React lazy boundaries. Markdown rendering uses the extracted,
unchanged lightweight conversion helpers. The sanitizer function and allowlist
are byte-for-byte unchanged (SHA256 `637a290fe65831a6535724cbf8e153f3d121290700b5bb80f7a81ef9a70f36f6`);
the existing 11 sanitization/conversion assertions remain green.

Initial ESM transfer follows every static import/re-export: 4 files total
251,548 B gzip9, down 70,205 B from the measured eager 321,753 B closure.
The frozen 0.302.3 baseline stays 255,167 B and the +10% ceiling is 280,683 B.
The strengthened gate rejects eager parser/decoder imports and oversized static
siblings while allowing deferred chunks. Seven planted/clean unit cases cover
that behavior. The deferred conversion chunk is 225,712 B raw / 65,801 B gzip9.
UMD still includes the parser because that format does not split modules.
This library measurement does not establish ThothOS route-budget compliance.

The authored preview measures overflow before exposing a named keyboard tab stop.
Its actual AddTask class previously created an inaccessible nested code scrollbar;
the browser regression failed 7/8 before the fix and passes 8/8 after it.
The scroll-container census records only this reviewed canonical addition; the
other drift baselines and the raw bundle ceilings are unchanged.

Evidence: `bun run prepublishOnly` exits 0 (61 unit tests, 134 assertions,
typecheck, full lint, production build, package exports, bundle budget and 423
public API names). `bun run test:browser` exits 0: 8 form/editor cases, 14 severity
cases, 6 severity Storybook plays and 1 comment-attribution play. Native receipts
and measurements are in `.runner/work-pool/W-1216/epoch3/release-evidence.json`;
the original attribution and fail-first evidence remain under epoch1 and A2961.

The isolated Storybook build also exits 0 (native e992b4), with its existing
asset-size warnings retained. Output and receipt are under epoch3/storybook and
epoch3/storybook-evidence.json. It started after the CPU governor admitted it.

Save state: all 15 owned paths are staged and the exact patch is conserved under
epoch3/staged.patch. The earlier normal commit refusal (172 ahead, cap 50) is
historical: the coordinator's A3038 confirms the push landed and the hold cleared.
A3042 requests removal of this item's stale pool block through its normal authority.

Next: save the tested implementation with a normal scoped commit and submit its
real test/build evidence after the existing pool item is unblocked.
Cloud Chromatic and independent review remain unmeasured. The operator publishes
0.302.7; ThothOS must update its pin and remeasure afterward. No publish or push.

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
