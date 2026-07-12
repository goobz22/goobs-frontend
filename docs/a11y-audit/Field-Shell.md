# Field/Shell (FieldShell) — a11y audit (2026-07-12)

**Status:** FIXED (serial in-context pass, commit `96486d1c`) — shared wrapper; per-field
a11y is verified in the 13 sibling `Field-<Sub>.md` reports.

**What it is:** `src/components/Field/Shell/` is the shared field wrapper every input leaf
renders through. It owns the `<label htmlFor>`, the required indicator, the error/helper
region, the `inputAriaProps` bag each leaf spreads onto its native control, and the
`form.validation.failed` diagnostic beacon. Because **all** field types (Text, Dropdown,
Date, Number, USD, IPAM, Signature, …) flow through it, an a11y fix here is a fix for the
whole field family — which is why the serial pass was run once, in-context, rather than
per-leaf. This report documents the Shell-owned contract + the additive fixes the serial
pass landed; the per-leaf application (and each leaf's own defects) live in the
`Field-<Sub>.md` reports.

Primary source: `src/components/Field/Shell/index.tsx`,
`src/components/Field/Shell/keyboard.ts` (shared arrow-nav + type-ahead),
`src/components/Field/Shell/useFieldBinding.ts`, `FieldShell.module.css`.

---

## Shell-owned a11y contract (verified in code)

| Concern | Mechanism | Location |
|---|---|---|
| Accessible name (label-less) | `ariaLabel` → `aria-label`, **gated off a visible label** (WCAG 2.5.3 Label in Name — never lets programmatic and visible names diverge) | `index.tsx:377,384-385` |
| Label↔input association | consumer `id` threads into BOTH `<label htmlFor>` and the slot `inputId` (`id ?? field-${reactId}`) so they can never diverge | `index.tsx:323,438,448` |
| Error message association | `aria-describedby` merges the helper/error region id **and** a consumer `describedById`, filtered/joined so a consumer value never *overrides* the error link | `index.tsx:389-392` |
| Error announcement | error region is `role="alert"` + `aria-live="polite"` only while erroring | `index.tsx:450-457` |
| Required | `aria-required` (programmatic) + a visible `aria-hidden` indicator glyph — never an asterisk alone | `index.tsx:386,440-444` |
| Invalid / disabled | `aria-invalid` / `aria-disabled` emitted only when true (omitted, not `="false"`, to keep the AT tree quiet); FieldShell **removes** `aria-disabled` when enabled (does not set `"false"`) — the ThothOS selector contract | `index.tsx:387-388,428-429` |
| Selector contract | `data-component="FieldShell"`, `data-field`, `data-field-name`, `data-filled`, `data-state` on the root | `index.tsx:422-427` |
| Validation diagnostics | edge-triggered `form.validation.failed` diag beacon on `error`, keyed on the stable `dataFieldName`/`name` (never the ReactNode label) | `index.tsx:402-417` |

## Serial-pass additive fixes (commit `96486d1c`)

- **`ariaLabel` prop** — label-less accessible naming (WCAG 4.1.2 / 2.5.3), gated so a visible
  `<label>` always out-ranks it. Leaves forward it (`TextField`, `USDField`, `PhoneNumberField`,
  the `Number/*`, `IPAM/{CIDR,MACAddress,Subnet,VLAN}`, `Date/*`, `Time/*`, `Dropdown/*`, …).
- **Consumer-`id` threading** — closed the `label-input-id-divergence` class at all 13 leaf
  instances (leaves historically rendered `id={id ?? inputId}` while the shell's `<label htmlFor>`
  used its own generated id). Now gated permanently as **lint module #25**
  `scripts/a11y-lints/label-input-id-divergence.ts`.
- **`describedById` seam** — lets a leaf/consumer add a description id without clobbering the
  shell's error/helper `aria-describedby` (the root cause of the `form-error-not-associated`
  finding in `Field-USD.md` issue 10).
- **Shared focus-ring tokens** — the 3 `--goobs-*-focus-ring` tokens were made opaque
  (WCAG 1.4.11 non-text contrast), promoted out of Button/Typography's per-component workarounds
  into the shared token layer.

## Known remaining (leaf-layer, additive — see structured critic result)

Two IPAM leaves never received the `ariaLabel` prop the serial pass added to their siblings, so
their label-less accessible name (WCAG 4.1.2) is still missing and DataGrid's `ipAddress` /
`supernet` editor branches remain unnamed (this is why `DataGrid.md` is PARTIAL):

- `src/components/Field/IPAM/Address/index.tsx` — `IPAddressFieldProps` (no `ariaLabel`).
- `src/components/Field/IPAM/Supernet/index.tsx` — `SupernetFieldProps` (add + forward into the
  wrapped `SubnetField`).

Fix shape: add `ariaLabel?: string` and render/forward it exactly as `Field/IPAM/CIDR`,
`.../Subnet`, `.../VLAN`, `.../MACAddress` already do; then the two DataGrid `case` branches adopt
the one-liner every other branch already uses.

## Hearing / Reading / SEO

No audio/media surface. The Shell renders a real `<label>` + native error region in SSR output
(no styled-div-as-heading, no onClick-div-as-control). ARIA wiring is the correct machine-readable
structure for a form control; no heading/landmark/link concerns apply to the wrapper itself.
