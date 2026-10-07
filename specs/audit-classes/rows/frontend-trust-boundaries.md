---
slug: "frontend-trust-boundaries"
status: "**COVERED**"
proof: "lint:security self-test + full source scan; security unit and Chromium regressions"
---

# `frontend-trust-boundaries`

Original source: W-976, “Production goobs security audit and
regression-backed fixes” (operator/user request, 2026-10-07).

## Spec

The committed acceptance contract is
`docs/specs/security-boundaries.md`. It defines the complete source universe
and the access, audience, HTML, URL, CSV, diagnostics, storage, file, dependency,
and CI trust-boundary invariants for this frontend library.

## Executable proof

- `scripts/__tests__/security-boundaries.test.ts` exercises the pure URL,
  CSV, and diagnostics contracts with Bun.
- `scripts/test-security-regressions.ts` runs the real DOM/React boundary
  regressions in Chromium.
- `scripts/lint-security-boundaries.ts --selftest` plants every forbidden
  source shape before scanning the declared source universe.

The audit result and measured denominators are recorded in
`docs/security-audit-2026-10-07.md`, the canonical source document for this
work item. At closeout the guard reports 568 TypeScript/TSX files, 27 reviewed
sink sites, 11 detected planted defects, and zero live violations. The shipped
runtime dependency audit is clean; the report separately records the five
development-only advisories and their constraints.

## Boundary

This class covers library-side prevention and data minimisation. It does not
claim that a React affordance authorizes a host request. Host applications must
still enforce tenant/row ownership, operation authorization, field projection,
and upload validation on the server.
