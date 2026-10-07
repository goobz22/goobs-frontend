# Security audit — 2026-10-07

Scope: the complete tracked `src/**/*.ts` and `src/**/*.tsx` surface, package
and lockfile, published-package contents, and GitHub Actions workflow. The audit
also traced the real company/employee/customer usage in ThothOS so component
boundaries match the host's entity and RBAC model.

This report records known findings and executable defenses. It is not a claim
that client-side checks authorize server operations: every ThothOS request must
still enforce tenant scope, viewer ownership, field allowlists, and file
validation on the server.

## Results

| Class                        | Pre-audit condition                                                                                                                                                                 | Resolution                                                                                                                                                                |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ProjectBoard/DataGrid access | `no-access` still rendered data; ProjectBoard `read` exposed task mutation controls                                                                                                 | Both components now render nothing for `no-access`; task-owned write affordances and drag state are absent for `read`                                                     |
| Customer/staff audience      | `ProjectBoard.variant` and `viewerRole` independently encoded the same security fact and could disagree                                                                             | Removed the ProjectBoard/InlineShowTask `viewerRole` override. `variant` is the single required discriminator and customer mode fails closed                              |
| Customer-private split       | Customer mode could render internal company notes, internal comments, case history, resolution editing, staff workflow editors, and KB link actions if data/handlers leaked through | Those staff-private surfaces are structurally absent in customer mode; customer edits emit only customer-owned title/description fields                                   |
| Independent RBAC axes        | Task, customer-note, company-note, and scheduling writes risked being collapsed into one permission                                                                                 | Task writes use `taskAccess`; notes require their own optional handlers; meetings use explicit capability grants or writable task access as a safe fallback               |
| Rich-text XSS                | Loaded values were sanitized, but edited DOM was emitted raw; paste and toolbar-created links bypassed the output boundary                                                          | Sanitization now runs before every emitted value, HTML paste is sanitized, and link schemes are restricted                                                                |
| Route injection              | Tabs passed arbitrary route strings to programmatic navigation and anchor `href`                                                                                                    | One centralized validator permits only relative and HTTP(S) destinations                                                                                                  |
| CSV injection                | Export quoted cells but did not neutralize spreadsheet formulas                                                                                                                     | Headers and values now neutralize `=`, `+`, `-`, `@`, controls, BOM, and leading whitespace before RFC-style quoting                                                      |
| Diagnostics privacy          | Form submit diagnostics copied all validated values, and failure diagnostics copied error text                                                                                      | Diagnostics expose field names/rule categories and boolean sentinels only                                                                                                 |
| Browser storage              | Search history stored complete navigation objects under one global key; DataGrid used one global visibility key                                                                     | Persistence is opt-in and caller-namespaced. Search history stores IDs only; DataGrid stores field/boolean preferences only                                               |
| File/object URL handling     | File picker `accept` could be mistaken for validation; CSV object URL lifecycle needed a permanent guard                                                                            | API docs require server-side signature/size/auth checks; static audit requires every created object URL to be revoked                                                     |
| CI supply chain              | Actions used mutable major tags and default token permissions                                                                                                                       | Actions are pinned to commits, token permission is read-only, checkout credentials are not persisted, Bun is pinned, and production dependency audit is a release/CI gate |

## ThothOS relationship review

Most of the host boundary has the right server-side shape: `companyId` is the
tenant boundary; customer task queries verify customer ownership; customer
routes have a customer-only audience; customer task reads strip staff-internal
task fields; and customer mutations use customer-specific field allowlists.
Company employees use company routes and independently resolved permissions for
task management, customer records, company records, and scheduling. Those
controls remain the authorization authority.

The trace also found a separate critical host defect: the customer comment
queries verified ticket ownership and then serialized every comment, including
`[INTERNAL]` staff notes and full revision histories. That private text reached
the customer browser. The library now omits those surfaces in customer mode as
defense in depth, but UI hiding is not authorization. ThothOS must filter the
customer comment thread before serialization, omit revision history from the
customer projection, and keep the staff projection unchanged. Both its single
thread and batched thread paths must share that server-side projection.

The library defect was the UI's duplicate audience decision. The customer help
board correctly selected the customer variant, but the employee task board also
selected `variant="customer"` while relying on the implicit staff role. That
invalid combination is no longer representable in the public ProjectBoard API
and fails closed at runtime.

Required ThothOS consumer migration when adopting 0.302.8:

1. Customer help: keep `variant="customer"`; remove `viewerRole="customer"`.
2. Employee tasks: change `variant="customer"` to `variant="company"`.
3. Direct `InlineShowTask` mounts: replace `viewerRole` with the single
   `variant="customer" | "employee"` value and pass explicit
   `taskAccess="read" | "write"`.
4. Apply the server-side customer comment projection described above. The
   ProjectBoard filter does not make an unfiltered API response safe.

## Dependency audit

`bun audit fix` upgraded `pbkdf2` to 3.1.7, `sharp` to 0.35.5, and
`source-map-js` to 1.2.2. `bun audit --production --json` now returns `{}`:
there are no known advisories in the shipped runtime graph.

Five advisories remain in development-only tooling and are not packed into the
library:

- `braces` through Storybook/stylelint — high, no published fix in the current
  dependency graph ([GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm)).
- `elliptic` through Storybook's browser polyfills — low, no published fix
  ([GHSA-848j-6mx2-7j84](https://github.com/advisories/GHSA-848j-6mx2-7j84)).
- `sprintf-js` through Storybook test-runner/NYC — moderate, no published fix
  ([GHSA-hp3w-g68c-fv3c](https://github.com/advisories/GHSA-hp3w-g68c-fv3c)).
- `uuid` 8 through Storybook test-runner — moderate; the parent range blocks
  the fixed major ([GHSA-w5hq-g745-h8pq](https://github.com/advisories/GHSA-w5hq-g745-h8pq)).
- `webpack-dev-middleware` 6 through `@storybook/nextjs` — high; the parent
  range blocks the fixed major ([GHSA-g84c-rxfj-3j2c](https://github.com/advisories/GHSA-g84c-rxfj-3j2c)).

Mitigation: these packages are dev-only, the production graph is gated clean,
Storybook is not a production service, and untrusted glob/config inputs are not
accepted by CI. Recheck on every lockfile update and move as soon as upstream
ranges admit fixed versions.

## Executable evidence

- `bun run lint:security` — self-tests 11 planted defects, then scans all source
  files and reports source/sink denominators.
- `bun run test:security` — pure helper tests plus real Chromium regressions for
  denied access, read-only mutation absence, customer-private surfaces,
  rich-text output, route schemes, and ID-only history storage.
- `bun run typecheck`
- `bun run lint:all`
- `bun run test:browser`
- `bun run build`
- `bun run build-storybook`
- `bun run audit:production`

The canonical invariant list lives in
[`docs/specs/security-boundaries.md`](specs/security-boundaries.md).
