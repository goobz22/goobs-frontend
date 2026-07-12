# a11y campaign — live status (updated 2026-07-11 10:00pm)

**⭐ EVERY REPO GATE GREEN (verified runs, not agent claims):** `bun run typecheck` ✅ ·
**`bun run lint:all`** ✅ (eslint · stylelint · lint:stories · lint:styles-props ·
lint:coverage · **lint:a11y with all 24 class-lint modules, selftests OK, 0 violations /
464 files**) · **`bun run build`** ✅ (1391 modules, dist rebuilt) — i.e. the full
`prepublishOnly` chain passes. All 71 batch items are through audit → adversarial verify
(→ re-fix where the verifier objected). Wave-2 discovery gates 7/7 COMPLETE: data-component
roots, **data-action on 108 controls across 33 files**, overridable testids, SSR hydration
(locale formatting + useId), theme-literal token swaps, public-ref lint, 3 walls.

**Field/Shell SERIAL PASS DONE (in-context, 96486d1c):** Shell gained the additive
`ariaLabel` (label-less naming, gated off visible labels per 2.5.3), consumer-`id`
threading (label↔input association can no longer diverge), and `describedById` seams;
the **label-input-id-divergence class was fixed at all 13 leaf instances and gated as
lint module #25**; the 3 shared `--goobs-*-focus-ring` tokens went opaque (WCAG 1.4.11 —
promoted from Button/Typography's per-component workarounds); Button now defaults
`type="button"` (accidental-submit class; ThothOS verified explicit: 104 `type="submit"`
+ 99 SaveButton files). Gates re-verified green after all of it (typecheck · lint:all
with 25 modules · build).

**Remaining (verified by the completeness critic, 2026-07-12 — EXACT truth):**
- **`Field/IPAM/Address` + `Field/IPAM/Supernet` never got the `ariaLabel` prop** the serial pass
  added to their 4 sibling IPAM leaves — the ONLY genuinely-unlanded refix. Blocks label-less
  naming (WCAG 4.1.2) on those two fields AND keeps `DataGrid.md` PARTIAL (its `ipAddress` /
  `supernet` editor branches stay unnamed). Fix: add `ariaLabel?: string` + forward it exactly as
  `Field/IPAM/{CIDR,Subnet,VLAN,MACAddress}` do (Supernet forwards into the wrapped `SubnetField`),
  then adopt the one-liner in the two DataGrid `case` branches.
- **Gate gap: `form-error-not-associated` has NO lint module** despite being a recurring class
  (`Field-USD.md` issue 10 + `ConfirmationCodeInput.md` follow-up #2; listed as "(3)" in Top
  recurring classes). Shape to detect: a consumer `{...rest}`/`aria-describedby` spread AFTER
  `{...inputAriaProps}` that drops the shell's error link, or an error region with no id referenced
  by the input's `aria-describedby`.
- **VERIFIED DONE (were listed remaining, confirmed landed in code):** ariaLabel leaf-forwarding
  sweep — done for all leaves + DataGrid's `CompositeFieldEditModal` callsites *except* the two IPAM
  leaves above; TreeView focus-on-collapse (`preserveFocusOnCollapse`, `index.tsx:479,652,1720` —
  chevron + apiRef paths fixed, `*` proven a non-issue); Dropdown type-ahead (`useTypeahead` in
  `Shell/keyboard.ts`, consumed by Regular + MultiSelect); Field/Shell serial pass
  (`ariaLabel`/`id`/`describedById`/opaque focus-ring tokens) — now documented in `Field-Shell.md`.
- **STALE cross-reference (already fixed):** `PricingTable.md` Deferred item 1 (Tooltip trigger
  keyboard-inaccessible at `Tooltip/index.tsx:308-315`) — the Tooltip pass self-heals the trigger
  into `tabIndex:0, role:"button", aria-label` (`index.tsx:425,438-439`); PricingTable's line
  numbers are stale.

**OWNER decisions (not agent-executable):** Tabs route-tab semantics (crawlable `<a href>`
vs button-tab that navigates on arrow-key — WCAG 3.2.2/SEO); ListItemCard composition
restructure (needs the Chromatic visual gate); Chromatic run over the whole campaign
(~300 fixes shipped without visual-parity verification); npm version bump + publish +
ThothOS pin update so consumers get the accessible build.

Rolling status of the full-repo accessibility retrofit (hearing / reading-screen-reader /
SEO-semantic) + class-first lint gating. Per-component detail: the sibling
`<Component>.md` files in this directory. Discovery-sweep gate plan:
`docs/audits/gateable-classes-discovery-2026-07-11.md`.

## Scoreboard

| Metric | Value |
|---|---|
| Issues found (WCAG-cited, file:line) | **297** |
| Fixed at root cause + story-pinned | **270** |
| Work items through audit → adversarial-verify → re-fix | **65 / 72** (7 re-running after the 5:50pm session-limit reset) |
| Self-testing class-lint modules landed in `scripts/a11y-lints/` | **23** |
| Class lints already driven green | 18 |
| Commits (pushing to GitHub as batches land) | 247+ |

## Per-batch

| Batch | Components | Issues | Fixed | State |
|---|---|---|---|---|
| 1 — Accordion→FileDropzone | 24/24 | 127 | 113 | 12 class lints green; DataGrid re-fix + 2 lints + gate loop re-running |
| 2 — Filter→Table | 21/24 | 73 | 69 | Pagination/RadioGroup/ProjectBoard audits + 7 re-fixes + gates re-running |
| 3 — Tabs→Zoom, Icons, Field subs | 20/23 | 97 | 88 | Field-Password/Tooltip/Field-Dropdown audits + 11 class lints + gates re-running |
| Wave-2 discovery gates | 3/7 green | — | — | data-component roots ✅, overridable testids ✅, 3 cheap walls ✅; data-action/SSR/token-leak/refs re-running |

## Top recurring issue classes (audit-found, cross-batch totals)

missing-reduced-motion (47) · missing-focus-visible-style (36) · missing-accessible-name (31) ·
icon-missing-aria-hidden (22) · status-not-announced (19) · nonsemantic-heading (13) ·
color-only-state (12) · clickable-noninteractive-element (6+) · missing-keyboard-arrow-nav (4) ·
form-error-not-associated (3) · toggle-missing-aria-pressed (3) — each is/becomes a permanent
self-testing module in `scripts/a11y-lints/`, wired into `lint:all` via `lint:a11y`.

## Remaining (in order) — verified 2026-07-12

**Matrix coverage: COMPLETE.** All 58 non-Field top-level component dirs + all 14 Field subdirs
have a report (`Field-Shell.md` was the one hole — now created). `src/app` (a trivial
`<html lang="en">` layout) and `src/utils` (pure formatter/alpha/diag/keyframe helpers, no rendered
output) carry no component surface and need no report. Index: `README.md`.

**Genuinely unresolved (agent-fixable, additive):**
1. `Field/IPAM/Address` (`IPAddressFieldProps`) — add `ariaLabel?: string`, render as
   `aria-label={ariaLabel}` on the input (mirror `Field/IPAM/CIDR`). WCAG 4.1.2.
2. `Field/IPAM/Supernet` (`SupernetFieldProps`) — add `ariaLabel?: string`, forward into the wrapped
   `SubnetField`. WCAG 4.1.2.
3. Once (1)/(2) land, adopt `ariaLabel={column.headerName || column.field}` (EditableCell) /
   `ariaLabel={fieldConfig.label || fieldConfig.field}` (CreationRow / CompositeFieldEditModal) in
   DataGrid's `ipAddress` + `supernet` `case` branches → flips `DataGrid.md` from PARTIAL to FIXED.
4. Build `scripts/a11y-lints/form-error-not-associated.ts` — the recurring class with no gate module.

**Owner-gated (design/API decisions — NOT interrupted refixes; correctly deferred):**
- `ProjectBoard` — keyboard drag-alternative for column/card reorder (`missing-keyboard-drag-alternative`)
  + breadcrumb occluded during form views (visible affordance + Chromatic churn = design call).
- `PricingTable` / cross-component — `Button` has no polymorphic `as`/`href`, so CTA columns are
  JS-nav buttons not crawlable `<a href>` (SEO). Shared-`Button` API decision.
- `Field-Dropdown` D2 — filter input / tabs nested inside `role="listbox"`
  (`invalid-listbox-owned-element`); the DOM restructure changes the mandated ThothOS
  `[role="listbox"]`/`[role="option"]` selector contract — owner decision.
- `ListItemCard` composition restructure; `Tabs` route-tab (`<a href>` vs button-tab) semantics.
- Chromatic visual-parity run over the whole campaign; npm version bump + publish + ThothOS pin.

**Known repo nit:** `bun typecheck:file` is broken (TS5112 — tsc won't load tsconfig with a file
arg); agents fall back to `lint:file` + batch typecheck.
