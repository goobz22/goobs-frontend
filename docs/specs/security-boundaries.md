# Security boundary contract

Status: implementation target for W-976 (2026-10-07).

## Declared universe

This audit covers every tracked `src/**/*.ts` and `src/**/*.tsx` file, with
explicit checks for:

- HTML rendering sinks and rich-editor input/output sanitization;
- programmatic navigation and URL-scheme validation;
- permission-bearing DataGrid and ProjectBoard render/action boundaries;
- CSV generation and spreadsheet-formula neutralization;
- diagnostics payloads that cross into a host-owned global sink;
- browser storage, object-URL, file-picker, and messaging boundaries;
- runtime/development dependency advisories and package/CI trust boundaries.

The audit does not claim that a frontend permission gate authorizes a server
operation. Hosts must independently authorize every request and validate every
uploaded file. The library contract is that denied capabilities are neither
rendered nor invoked through library UI.

## Invariants

1. `no-access` renders neither DataGrid nor ProjectBoard content.
2. `ProjectBoard.variant` is the single audience discriminator; ProjectBoard
   and InlineShowTask expose no independent `viewerRole` override. A customer
   variant cannot render staff-private company/customer notes, internal
   comments, case history, resolution editing, workflow-metadata editors, or
   knowledge-base linking, even if a stale JavaScript caller supplies data and
   handlers for them.
3. ProjectBoard `read` withholds task-owned mutation affordances: creation,
   edit, delete, comment, severity/status, resolution, KB-link, and drag. Notes
   and meetings belong to independent host RBAC axes: notes require their
   optional handler, while meetings require an explicit per-capability write
   grant or fall back to writable task access.
4. Strings written to CSV are quoted, quote-escaped, and prefixed when a
   spreadsheet could interpret their first effective character as a formula.
5. A route may reach programmatic navigation only after centralized validation
   accepts an HTTP(S) or relative URL. Executable/data schemes are rejected.
6. Rich-editor DOM is sanitized before it is emitted to callers. HTML paste is
   intercepted and sanitized before insertion, and toolbar-created links pass
   URL sanitization.
7. Form diagnostics expose field names and validation rule categories, not
   submitted values or error text. Diagnostic events must not copy secrets/PII
   into `window.__diag`.
8. SearchableHistory and DataGrid column visibility persist nothing unless the
   caller supplies a namespaced storage key. Search history stores item IDs
   only, never routes, labels, descriptions, icons, or metadata. Rich-editor
   draft persistence remains explicit and requires a user/tenant-scoped key.
9. Every object URL created by the library is revoked. File `accept` remains a
   picker hint; host upload validation is explicitly required.

## ThothOS relationship mapping

- `variant="administrator"`: platform staff working across tenant companies.
- `variant="company"`: company/employee staff working inside one tenant.
- `variant="customer"`: the authenticated customer self-service experience.

ThothOS independently enforces company/customer ownership and mutation
allowlists on the server. These component gates are a second wall and an honest
UI contract; they are not an authorization substitute. The pre-audit ThothOS
employee task board used `variant="customer"` while expecting staff behavior.
The companion fix migrates that board to `variant="company"` and routes all
task surfaces through a compatibility boundary whose public input is only
`variant`; while ThothOS remains pinned to goobs 0.302.5, the legacy
`viewerRole` is derived internally and cannot disagree.

Hosts must also project customer comment payloads before serialization:
internal comments, revision history, visibility metadata, and raw comment IDs
must never reach a customer client. The ThothOS companion fix enforces this on
single reads, batched reads, and mutation responses. Component filtering is
defense in depth, not an API authorization boundary.

## Executable proof

- `bun scripts/lint-security-boundaries.ts --selftest` plants each forbidden
  shape and proves a compliant fixture stays clean.
- `bun scripts/lint-security-boundaries.ts` scans the declared source universe
  and prints file/site denominators.
- `bun test scripts/__tests__/security-boundaries.test.ts` pins the pure URL,
  CSV, and diagnostic-redaction contracts.
- `bun scripts/test-security-regressions.ts` exercises the real React/DOM
  permission and rich-editor boundaries in Chromium.
- Existing `lint:a11y` owns the complete `dangerouslySetInnerHTML` source scan;
  its `dsih-unsanitized-source` rule remains the XSS sink fence.
