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

## Re-audit 2026-07-11 (two gaps the prior pass missed)

### 7. Input rest border invisible on dark & sacred themes — MODERATE, WCAG 1.4.11 Non-text Contrast (AA) — FIXED
`pattern: color-only-state` / non-text-contrast

Issue #1 restored a *focus* ring, but the **resting** border stayed hardcoded as
`1px solid var(--goobs-black-a20)` (`rgba(0,0,0,0.2)` — a **surface-independent**
fixed black alpha). Because these inputs have a `transparent` background, that
border is the input's only boundary. On the dark surface
(`--goobs-dark-surface #1e293b`) and sacred (near-black `--goobs-sacred-control-bg`),
black-at-20% composites *darker than the background* → ≈1.1:1, an effectively
**invisible input boundary** — visual information required to identify the
component under 1.4.11.

- `Address/Address.module.css:13`, `CIDR/CIDR.module.css:18`,
  `MACAddress/MACAddress.module.css:12`, `Subnet/Subnet.module.css:19`,
  `VLAN/VLAN.module.css:18`

**Fix:** switched the rest border to `var(--field-border-default)` — the same
per-theme token FieldShell's own `.inputSlot` uses, cascaded from the `.shell`
ancestor (the `:focus-visible` rule already relied on that cascade via
`--field-border-focus`, proving it resolves). Resolves to light `#e2e8f0` / dark
`#334155` / sacred gold-a30, so the boundary is theme-appropriate and consistent
with every other library field. Applied to all five module.css files.

### 8. Spinbutton inputs inert to Up/Down arrows — MINOR, WCAG 2.1.1 Keyboard (A) — FIXED
`pattern: missing-keyboard-arrow-nav`

Issue #2 made the +/- **buttons** keyboard-operable, but the numeric value
**input** itself still ignored `ArrowUp`/`ArrowDown`. A keyboard user who focuses
the value field and presses Up/Down (the universal spinner expectation) got
nothing — the only keyboard path to a step was Tab-ing away to the separate
buttons. Raw 2.1.1 was already met via the buttons, so this is spinbutton
keyboard-table *completeness* rather than a hard failure — hence MINOR.

- `CIDR/index.tsx`, `VLAN/index.tsx`, `Subnet/index.tsx` (internal mask field)

**Fix:** added a `handleInputKeyDown` on each numeric input mapping `ArrowUp` →
increment / `ArrowDown` → decrement, **reusing the existing clamped (and VLAN
skip-reserved) `handleIncrement`/`handleDecrement`** so range/reserved rules match
the buttons exactly. The caller's `onKeyDown` still runs first and may
`preventDefault()` to opt out (CIDR/Subnet). `role="textbox"` is unchanged, so the
machine-test selector contract and the existing `getByRole('textbox', …)`
play-tests keep passing. `Address`/`MACAddress` are plain text fields (no steppers)
and were untouched. This lands the arrow-stepping half of what issue #-Deferred had
recorded as the optional spinbutton enhancement — done the safe way (no role change).

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
| 7 | rest border → theme-aware `--field-border-default` (1.4.11) | all 5 `*.module.css` |
| 8 | ArrowUp/ArrowDown spinbutton stepping on the input (2.1.1) | CIDR / VLAN / Subnet `index.tsx` |

Per-file gate `bun lint:file` passed (exit 0) on every edited `.tsx`. Re-audit
commits: `c8968ef8` (border contrast) and `ccee34e8` (arrow-key stepping + stories).

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

**Re-audit (2026-07-11) extensions** — the three stepper a11y play-tests were
extended to also assert the new ArrowUp/ArrowDown input stepping (issue #8), all
still resolving the control via `getByRole('textbox', …)` so the selector contract
is proven intact:

- `CIDR/CIDR.stories.tsx` → *Keyboard Steppers + Live Readout (a11y)*: focus input,
  `{ArrowUp}` `/25`→`/26`, `{ArrowDown}` back to `/25`.
- `VLAN/VLAN.stories.tsx` → *Keyboard Steppers (a11y)*: focus input, `{ArrowUp}`
  `10`→`11`, `{ArrowDown}` back to `10`.
- `Subnet/Subnet.stories.tsx` → *Keyboard Steppers + Live Readout (a11y)*: focus
  mask input, `{ArrowUp}` `255.255.255.128`→`255.255.255.192` with the live readout
  tracking `Subnet CIDR: /26`, `{ArrowDown}` back.

The issue-#7 border change is a rest-state visual shift covered by every existing
Light/Dark/Sacred theme story (their Chromatic baseline shifts once, as expected
for a contrast fix).

## Deferred

All IPAM-local fixes (#1–#8) landed at root cause inside `Field/IPAM`. The
re-audit surfaced ONE item whose root cause is in files I do not own.

- **Systemic field-border contrast — MODERATE, WCAG 1.4.11 Non-text Contrast (AA).**
  Issue #7 routed IPAM inputs onto the correct shared token `--field-border-default`,
  but that token is itself a **low-contrast** border by library design: light
  `--goobs-light-border #e2e8f0` on white surface ≈ **1.25:1**; dark
  `--goobs-dark-border #334155` on `#1e293b` ≈ **1.4:1**; sacred `--goobs-gold-a30`
  similarly low — all below the 3:1 non-text-contrast threshold. This is a shared
  decision baked into **`src/styles/global.css`** (`--goobs-light-border` line 282,
  `--goobs-dark-border` line 322, sacred `--goobs-gold-a30`) and consumed by
  **`Field/Shell/FieldShell.module.css` `.inputSlot`** (border at line 149) — files
  outside my directory. Fixing it in IPAM alone would desync these fields from the
  whole library. **Suggested change (styles/Shell owner):** raise the resting
  field-border tokens to clear 3:1 against their surfaces (light →
  `--goobs-light-border-strong #cbd5e1` or darker; dark → a lighter grade than
  `#334155`; sacred → a higher gold alpha), once in `global.css`/`.inputSlot`; every
  field — including these IPAM inputs, which now consume `--field-border-default` —
  then benefits automatically.

**Non-blocking observations (no owner action required):**

- **Optional enhancement, partly DONE:** the arrow-stepping half of the ARIA
  `spinbutton` pattern is now implemented (issue #8 — `ArrowUp`/`ArrowDown` step the
  value with the input focused). The remaining, still-deferred half is the full
  `role="spinbutton"` + `aria-valuenow`/`valuemin`/`valuemax` value model, left
  as-is because the values are formatted strings, direct text entry already works,
  and switching the role off `textbox` would break the Playwright
  `getByRole('textbox', …)` / `data-field-name` text-input contract. Purely additive
  if ever pursued.
- **Architectural note (FieldShell, NOT changed):** `FieldShell` only supplies a
  focus ring / border for children that opt into its `.inputSlot` class; IPAM (and
  other bare-input fields) render the `<input>` directly, so each module owns its own
  `:focus-visible` and rest border (fixed locally in #1/#7). If the later Shell pass
  wants a single canonical treatment for bare-input fields, it would live in
  `FieldShell.module.css` — not required, nothing broken.
