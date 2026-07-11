# Field/IPAM — a11y audit (2026-07-11)

**Status: FIXED**

`Field/IPAM` is a family of six IP-address-management sub-fields, all built on
the shared `FieldShell` render-prop wrapper:

| Sub-field | Shape | APG pattern |
|---|---|---|
| `Address` (`IPAddressField`) | single text input, plus a `renderAsRange` dual start/end layout | text field (WAI-ARIA "textbox" / native input) |
| `MACAddress` | single text input | text field |
| `CIDR` | text input + press-and-hold `+`/`-` stepper buttons + live subnet readout | text field with custom stepper controls |
| `Subnet` (+ internal mask stepper) | dotted-mask text input + `+`/`-` steppers + live readout | text field with custom stepper controls |
| `Supernet` | thin wrapper delegating entirely to `Subnet` (/8–/23 bracket) | — (inherits Subnet) |
| `VLAN` | text input + `+`/`-` steppers | text field with custom stepper controls |

**APG pattern note.** These are *text fields* with an auxiliary stepper, not the
formal ARIA `spinbutton` pattern. They were intentionally left as editable
`type="text"` inputs (values are formatted strings — `/24`, `255.255.255.0`,
`AA:BB:…`) with the numeric-only ones exposing `inputMode="numeric"`. Direct
keyboard entry is the primary interaction; the `+`/`-` buttons are a
convenience. I did **not** convert them to `role="spinbutton"` (it would
retype the value model and risk the machine-test contract that keys on these as
text inputs via `data-field-name`); instead I made the existing controls fully
operable and observable. This is recorded under Deferred as an optional future
enhancement.

`FieldShell` (owned by a later serial pass — not edited here) correctly provides
label association (`<label htmlFor>`), `aria-required` / `aria-invalid` /
`aria-describedby`, and the `role="alert"` + `aria-live="polite"` error region.
Every sub-field wires error/required through it properly, so form-error
association and required semantics were already sound.

---

## Issues found

### 1. No visible keyboard-focus indicator on any IPAM input — SERIOUS, WCAG 2.4.7 Focus Visible (AA) — FIXED
`pattern: missing-focus-visible-style`

Every IPAM input sets `outline: none` and renders a bare `<input>` directly in
the `FieldShell` render-prop **without** the shell's `.inputSlot` wrapper — so
`FieldShell.module.css`'s `.inputSlot:focus-within` ring never applies, and the
shell's `[data-state='focus']` hook is never set by these fields. Result:
focusing any IPAM input produced **zero** visual change (border stayed at the
resting `--goobs-black-a20`), leaving keyboard users unable to see focus.

- `Address/Address.module.css:12` (`.input { outline: none }`) — single + range inputs
- `MACAddress/MACAddress.module.css:11`
- `CIDR/CIDR.module.css:17`
- `Subnet/Subnet.module.css:18`
- `VLAN/VLAN.module.css:17`

**Fix:** added `.input:focus-visible` to all five modules — border shifts to the
per-theme `--field-border-focus` token (cascaded from `.shell`) plus the
`--goobs-focus-*` glow, sacred default with `[data-theme='light'|'dark']`
overrides (house pattern). Also added `.button:focus-visible` rings for the
stepper buttons in CIDR/Subnet/VLAN, matching the library `Button` pattern.

### 2. Stepper `+`/`-` buttons were keyboard-inoperable — SERIOUS, WCAG 2.1.1 Keyboard (A) — FIXED
`pattern: mouse-only-activation`

The increment/decrement buttons wired **only** `onMouseDown` (to drive the
press-and-hold repeat). A keyboard `Enter`/`Space` on a `<button>` dispatches a
`click`, never a `mousedown`, so the focusable buttons did **nothing** for
keyboard-only users.

- `CIDR/index.tsx` — "Increase/Decrease CIDR" buttons
- `Subnet/index.tsx` — "Increase/Decrease subnet mask" buttons
- `VLAN/index.tsx` — "Increase/Decrease VLAN ID" buttons

**Fix:** added an `onClick` handler guarded by `event.detail === 0`
(`CIDR/index.tsx:178`, `Subnet/index.tsx:185`, `VLAN/index.tsx:201`, and the
decrement twins). A keyboard-synthesised click has `detail === 0` → it performs
exactly one step; a real pointer click has `detail >= 1` and its step already
fired on `mousedown` → the guard skips it, so mouse stepping stays single. The
press-and-hold repeat is unchanged.

### 3. Range-mode inputs lose their accessible name when empty — SERIOUS, WCAG 4.1.2 / 1.3.1 / 3.3.2 (A) — FIXED
`pattern: missing-accessible-name`

In `Address` `renderAsRange` mode the two inputs pass
`label={startIPValue ? label : ''}` / `label={endIPValue ? label : ''}` to their
FieldShells — an **empty** string renders no `<label>`, so an empty range input
had **no programmatic name at all**. Even when named, both inputs announced
identically ("IP Address"), giving no start/end distinction.

- `Address/index.tsx` — `renderAsRange` branch, start and end `<input>`

**Fix:** each range input now carries a stable `aria-label` derived from the
field label (`"<label> range start"` / `"<label> range end"`,
`Address/index.tsx`). Both inputs are always named, start/end are
distinguishable, and because the label text is contained in the accessible name
WCAG 2.5.3 (Label in Name) is preserved.

### 4. Live subnet/CIDR readout not announced to screen readers — MODERATE, WCAG 4.1.3 Status Messages (AA) — FIXED
`pattern: status-not-announced`

The CIDR and Subnet fields render a summary (subnet mask, total/usable hosts,
networks, available range) that **recomputes** as the value changes but sits
outside the input's focus, so screen-reader users never heard the new values.

- `CIDR/index.tsx` — `showSubnetInfo` readout `<div>`
- `Subnet/index.tsx` — subnet-info readout `<div>`

**Fix:** the readout containers are now `role="status"` + `aria-live="polite"`
(`CIDR/index.tsx:324`, `Subnet/index.tsx:660`) so the recomputed values are
announced without interrupting typing.

### 5. Decorative caret icons not hidden from assistive tech — MINOR, WCAG 1.1.1 (A) / 4.1.2 — FIXED
`pattern: icon-missing-aria-hidden`

The `ArrowDropUp`/`ArrowDropDown` SVGs inside the labelled stepper buttons were
exposed to the accessibility tree. The buttons already carry an `aria-label`, so
the glyph is purely decorative and should be hidden to avoid redundant or
ambiguous output.

- `CIDR/index.tsx:290,302`, `Subnet/index.tsx:295,307`, `VLAN/index.tsx:298,309`

**Fix:** `aria-hidden` passed to each icon (spread onto the `<svg>`), leaving the
button `aria-label` as the sole accessible name.

### 6. Stepper button transition ignores reduced-motion — MINOR, WCAG 2.3.3 Animation from Interactions (AAA) — FIXED
`pattern: missing-reduced-motion`

`.button { transition: all 0.3s ease }` had no reduced-motion guard.

- `CIDR/CIDR.module.css`, `Subnet/Subnet.module.css`, `VLAN/VLAN.module.css`

**Fix:** added `@media (prefers-reduced-motion: reduce) { .button { transition: none } }`.

---

## Hearing

No `Audio`/`AudioContext`/`<audio>`/`<video>`/`navigator.vibrate`/
`speechSynthesis` usage anywhere in `Field/IPAM` (grep-verified). No
information is conveyed by sound; all validation/state is visual +
programmatic. **Clean** — no WCAG 1.2.x / 1.4.2 concerns.

## Reading & screen reader

- Label association, `aria-invalid`, `aria-describedby` error linkage, and
  required semantics are all provided correctly by `FieldShell` — verified sound
  for every sub-field.
- Fixed: focus visibility (#1), keyboard operability of steppers (#2), empty
  range-input names (#3), live-readout announcement (#4), decorative-icon hiding
  (#5).
- Not color-alone: the Subnet "outside supernet range" state surfaces a **text**
  error ("Subnet is outside the supernet range") through FieldShell's
  `role="alert"` region in addition to the red available-range line, so 1.4.1 is
  satisfied.
- Stepper buttons have text `aria-label`s ("Increase CIDR", etc.); icon-only
  controls are all named.

## SEO semantics

Form fields, not document structure. No heading text is rendered as styled
divs; the readouts are supplementary plain text (correctly *not* headings), and
the component is not itself a landmark/list/table/link, so no `heading` /
landmark / crawlable-`<a>` changes apply. All meaningful content (labels, helper
text, validation, readouts) is server-rendered — no client-only injection of
primary content. **Clean.**

## Fixes applied

| # | Fix | Files |
|---|---|---|
| 1 | `.input:focus-visible` themed ring (+ `.button:focus-visible`) | all 5 `*.module.css` |
| 2 | Keyboard activation of steppers (`onClick` w/ `detail===0`) | CIDR / Subnet / VLAN `index.tsx` |
| 3 | Always-present, start/end-distinct `aria-label` on range inputs | Address `index.tsx` |
| 4 | `role="status"` + `aria-live="polite"` on live readouts | CIDR / Subnet `index.tsx` |
| 5 | `aria-hidden` on decorative stepper caret icons | CIDR / Subnet / VLAN `index.tsx` |
| 6 | `@media (prefers-reduced-motion: reduce)` on `.button` | CIDR / Subnet / VLAN `*.module.css` |

Per-file gate `bun lint:file` passed (exit 0) on every edited `.tsx`.

## Stories updated

Stories are the only regression tests in this repo; each new behaviour is now
exercised (with `play` interaction tests via `storybook/test`):

- `Address/IPAddress.stories.tsx` → **Range Mode (accessible names)**: renders
  the empty `renderAsRange` layout and asserts both inputs resolve by their
  distinct accessible names (`IP Address range start` / `… range end`).
- `VLAN/VLAN.stories.tsx` → **Keyboard Steppers (a11y)**: focuses each stepper,
  activates with `{Enter}` alone, asserts the value steps 10→11→10, and asserts
  the caret `<svg>` is `aria-hidden`.
- `CIDR/CIDR.stories.tsx` → **Keyboard Steppers + Live Readout (a11y)**: asserts
  the readout is `role="status"` `aria-live="polite"`, that `{Enter}` steps
  `/24`→`/25`, and that the live region reflects the new `255.255.255.128` mask.
- `Subnet/Subnet.stories.tsx` → **Keyboard Steppers + Live Readout (a11y)**:
  same shape for the mask stepper (dotted-mask input → `255.255.255.128`,
  readout → `Subnet CIDR: /25`).

These fail against the pre-fix code (steppers inert to `{Enter}`, range inputs
unnamed, readouts without `role="status"`), so they lock in the regressions.

## Deferred

Nothing whose root cause is outside my directory blocks these fixes — all fixes
landed at root cause inside `Field/IPAM`. `FieldShell`, the barrel, and
`src/styles/global.css` were **not** modified.

**Non-blocking observations (no owner action required):**

- **Optional enhancement (not a violation):** the CIDR / Subnet / VLAN steppers
  could adopt the full ARIA `spinbutton` pattern (`role="spinbutton"` +
  `aria-valuenow`/`valuemin`/`valuemax` + native Up/Down arrow stepping on the
  input). Left as-is because the values are formatted strings, direct text entry
  already works, and re-typing the value model risks the Playwright
  `data-field-name` text-input contract. Purely additive if pursued later.
- **Architectural note (FieldShell, NOT changed):** `FieldShell` only supplies a
  focus ring for children that opt into its `.inputSlot` class; IPAM (and other
  bare-input fields) render the `<input>` directly, so each module owns its own
  `:focus-visible`. Fixed locally here (#1). If the later Shell pass wants a
  single canonical focus treatment for bare-input fields, that would live in
  `FieldShell.module.css` — but it is not required and nothing is broken.
