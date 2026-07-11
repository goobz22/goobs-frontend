# Field/Number — a11y audit (2026-07-11)

**Status:** FIXED

**Component:** `src/components/Field/Number/*` — a family of six number-oriented
fields, each composed inside the shared `FieldShell` (label / helper / error /
theme chrome) and driven by `useFieldBinding`:

| Sub-field | File | Shape |
|---|---|---|
| InternalIncrement | `InternalIncrement/index.tsx` | integer stepper, +/- buttons stacked *inside* the frame with press-and-hold auto-repeat |
| ExternalIncrement | `ExternalIncrement/index.tsx` | integer stepper, − / + buttons flanking a centered input (single-step) |
| AccountNumber | `AccountNumber/index.tsx` | masked bank account number, `#` adornment |
| CVV | `CVV/index.tsx` | card security code, `type="password"`, 🔒 adornment |
| CreditCardNumber | `CreditCardNumber/index.tsx` | brand-detecting card number, 💳 adornment |
| RoutingNumber | `RoutingNumber/index.tsx` | ABA routing number, ⚡ (sacred-only) adornment |

## APG patterns

- **InternalIncrement / ExternalIncrement → WAI-ARIA APG "Spinbutton".** These
  are numeric steppers, so the spinbutton pattern applies: `role="spinbutton"` +
  `aria-valuenow`/`aria-valuemin`/`aria-valuemax`, plus the keyboard table
  (Up/Down step, Home/End to bounds). Before this pass **none** of that existed —
  the fields were bare `<input type="text">` whose value could only be changed by
  the mouse (InternalIncrement's +/- were *mouse-only*, see issue 1). Now
  compliant (fixes 1–3).

  | Key | Action | Where |
  |---|---|---|
  | Arrow Up | +1 step | `onKeyDown` (both) |
  | Arrow Down | −1 step (floor `min`/0) | `onKeyDown` (both) |
  | Home | jump to `min` (Internal) / 0 (External) | `onKeyDown` |
  | End | jump to `max` | `onKeyDown` (Internal, when `max` set) |
  | Enter / Space on +/- button | single step | native `<button>` + `detail===0` guard |

- **AccountNumber / CVV / CreditCardNumber / RoutingNumber → plain labelled text
  input.** No special widget role; correctness rests on FieldShell's real
  `<label htmlFor>`, `aria-invalid` + `aria-describedby` error wiring, and (for
  CVV/CC) `autocomplete`. Their only defects were the missing focus ring and the
  unhidden decorative adornments (fixes 4–5).

## Issues found

### 1. InternalIncrement +/- buttons were keyboard-inoperable (mouse-only) — FIXED
- **Severity:** critical · **WCAG:** 2.1.1 Keyboard (A) · **Pattern:** `pointer-only-activation`
- **Where:** `InternalIncrement/index.tsx:243,252` (old) — both buttons bound
  **only** `onMouseDown={() => handleMouseDown(handler)}`.
- **Failure:** `Enter`/`Space` on a focused `<button>` fires a `click` event, never
  `mousedown`. With no `onClick`/`onKeyDown`, a keyboard or AT user who tabbed to
  the increment/decrement button and pressed Enter got **nothing** — the entire
  stepper was operable by mouse only. (ExternalIncrement used `onClick` and was
  already keyboard-operable.)
- **Fix:** added `onClick={e => { if (e.detail === 0) handler() }}` to both
  buttons (`InternalIncrement/index.tsx`). A keyboard-activated click reports
  `detail === 0`; a pointer click reports `>= 1`. `onMouseDown` still owns the
  pointer path (immediate step + press-and-hold auto-repeat), so the guard makes
  the button respond to Enter/Space **without double-stepping** the mouse. The
  press-and-hold feel is byte-for-byte unchanged.

### 2. Increment inputs had no keyboard step (no Arrow/Home/End) — FIXED
- **Severity:** serious · **WCAG:** 2.1.1 Keyboard (A) · **Pattern:** `missing-keyboard-arrow-nav`
- **Where:** `InternalIncrement/index.tsx`, `ExternalIncrement/index.tsx` — the
  `<input>` had no `onKeyDown`; Up/Down did nothing.
- **Failure:** the expected spinbutton interaction (arrow to change the number)
  was absent; combined with issue 1 (Internal) the field could not be changed at
  all without a mouse.
- **Fix:** added an `onKeyDown` handler to both inputs — ArrowUp/ArrowDown step
  (reusing the clamped `handleIncrement`/`handleDecrement`), Home → floor, End →
  ceiling (Internal, when `max` is set). `preventDefault()` on handled keys.

### 3. Increment inputs exposed no spinbutton role/value semantics — FIXED
- **Severity:** moderate · **WCAG:** 4.1.2 Name/Role/Value (A), 1.3.1 Info & Relationships (A) · **Pattern:** `incomplete-aria-widget-pattern`
- **Where:** both increment `<input>`s were `role`-less text inputs; a screen
  reader announced "edit text" with no notion of a bounded numeric range.
- **Fix:** added `role="spinbutton"` + `aria-valuenow` (parsed current value,
  omitted while empty/non-numeric) + `aria-valuemin` + `aria-valuemax`
  (Internal: `min`/`max`; External: min 0, no max). AT now announces the field as
  a spinner with its current value and bounds; the value updates as the user
  arrows.

### 4. No visible focus indicator on any of the six inputs — FIXED
- **Severity:** serious · **WCAG:** 2.4.7 Focus Visible (AA) · **Pattern:** `missing-focus-visible-style`
- **Where:** all six `*.module.css` — every `.input` sets `outline: none` and
  **none** of them (nor the wrapper) provided a replacement. These fields render
  their input inside their own `.inputWrapper`/`.container`, **not** inside
  FieldShell's `.inputSlot`, so they receive none of the shell's
  `.inputSlot:focus-within` border treatment (`Shell/FieldShell.module.css:155`).
  Result: focusing any of these fields showed **no** focus ring.
- **Fix:** added a theme-aware focus ring:
  - wrapper-bordered fields (Internal, Account, CVV, CreditCard, Routing):
    `.inputWrapper:focus-within { border-color: var(--field-border-focus); box-shadow: 0 0 0 2px var(--field-border-focus) }`
  - External (input carries its own border): `.input:focus-visible { … }`, plus a
    `.button:focus-visible` outline on the +/- buttons (Internal buttons too).
  `--field-border-focus` cascades from FieldShell per theme (blue on light/dark,
  gold on sacred), matching the library's focus convention (Button.module.css).

### 5. Decorative adornments announced to screen readers — FIXED
- **Severity:** minor · **WCAG:** 1.1.1 Non-text Content (A) · **Pattern:** `icon-missing-aria-hidden`
- **Where:** the adornment `<div>` in each of AccountNumber (`#`,
  `index.tsx:225`), CVV (`🔒`, `index.tsx:208`), CreditCardNumber (`💳`,
  `index.tsx:335`), RoutingNumber (`⚡`, `index.tsx:218`).
- **Failure:** each emoji/glyph is purely decorative (it reinforces the visible
  label — "Account Number", "CVV", "Card Number", "Routing Number") but was read
  aloud as "lock" / "credit card" / "high voltage" / "number sign", adding noise
  before the actual field content.
- **Fix:** `aria-hidden="true"` on each adornment container.

### 6. Digit-only fields did not request a numeric soft keyboard — FIXED
- **Severity:** minor · **WCAG:** 1.3.5 Identify Input Purpose (AA, adjacent) / motor-cognitive ergonomics · **Pattern:** `missing-numeric-inputmode`
- **Where:** CVV, RoutingNumber, ExternalIncrement inputs (digits-only) had no
  `inputMode` (InternalIncrement and CreditCardNumber already set
  `inputMode="numeric"`).
- **Fix:** added `inputMode="numeric"`. On touch devices this surfaces the
  numeric keypad, reducing input effort for motor/cognitively-impaired users.
  (AccountNumber intentionally left as-is — it accepts formatting dashes, which a
  numeric-only keypad would hide.)

## Hearing (WCAG 1.2.x, 1.4.2)

**CLEAN.** Grepped the whole `Field/Number` tree for `Audio` / `AudioContext` /
`<audio>` / `<video>` / `navigator.vibrate` — none. No information is conveyed by
sound; value/validity/required/error state is entirely visual + programmatic.
Nothing to fix.

## Reading & screen reader (1.1.1, 1.3.1, 1.4.1, 2.1.x, 2.4.x, 3.3.x, 4.1.2)

- **Accessible name:** FieldShell renders a real `<label htmlFor={inputId}>`
  (`Shell/index.tsx:395`) linked to the input's `id={inputId}`. The four
  financial fields ship default labels; the increment fields require the consumer
  to pass one. Label-less usage caveat → **Deferred D1**; `id`-override caveat →
  **Deferred D2**.
- **Semantic HTML:** native `<input>` + native `<button>` throughout; the +/-
  controls are real `<button type="button">` with `aria-label` ("Increase value"
  / "Decrease value"), not clickable divs. The icon glyphs inside them are now
  `aria-hidden` (Internal) or covered by the button's `aria-label` (External `−`/`+`).
- **Spinbutton (increment fields):** role + valuenow/valuemin/valuemax present
  (fix 3); full keyboard table present (fixes 1–2).
- **Focus visible:** now present on all six (fix 4).
- **Forms / error / required:** error text is linked via `aria-describedby` +
  `aria-invalid` and required via `aria-required`, all wired by FieldShell's
  `inputAriaProps` bag (`Shell/index.tsx:345-349`) spread onto each input. The
  error region uses `role="alert"` + `aria-live="polite"`
  (`Shell/index.tsx:412-413`). Required is programmatic (`aria-required`) + a
  visible indicator, never an asterisk alone.
- **Dynamic updates announced:** stepper value changes announce natively via the
  new spinbutton role as `aria-valuenow` updates; per-keystroke validity flows to
  the consumer via `onValidityChange` and, when the consumer maps it to `error`,
  is announced by the shell's alert region. No component-owned live region needed.
- **Color-alone (1.4.1):** disabled = native `disabled` + `aria-disabled` +
  dimming; error = error text + `aria-invalid` + red border; required = indicator
  text + `aria-required`. Focus = border **color change plus a 2px ring** (not
  color alone). No state relies on color alone.

## SEO semantics (Next.js SSR)

**CLEAN.** These are form controls, not headings/landmarks/links. Each SSRs as a
real native `<input>` (+ `<button>`s for the steppers) with its `<label>` — no
styled-div-as-heading, no onClick-div-as-link, no client-only injection of
primary content. The masked default-value display is a presentation transform of
a value the consumer already owns, not crawlable primary content. No
SEO/semantic markup change applicable.

## Motion (WCAG 2.3.3)

**N/A.** None of the six `*.module.css` files contain `transition` / `animation`
/ `@keyframes` (verified by grep), and the focus rings added in fix 4 are static
(no transition). No `prefers-reduced-motion` guard is required. (The
press-and-hold auto-repeat in InternalIncrement is a JS timer, not CSS motion,
and is not an animation in the 2.3.3 sense.)

## Fixes applied

1. InternalIncrement +/- keyboard operability via `onClick` `detail===0` guard — WCAG 2.1.1.
2. Arrow/Home/End `onKeyDown` step on both increment inputs — WCAG 2.1.1.
3. `role="spinbutton"` + `aria-valuenow/valuemin/valuemax` on both increment inputs — WCAG 4.1.2 / 1.3.1.
4. Theme-aware `:focus-within`/`:focus-visible` rings across all six module CSS + the stepper buttons — WCAG 2.4.7.
5. `aria-hidden="true"` on the four decorative adornments — WCAG 1.1.1.
6. `inputMode="numeric"` on CVV / RoutingNumber / ExternalIncrement — WCAG 1.3.5-adjacent.

Code: commit `1cce0097` (12 files). Stories: commit `f7d74cb1`. `bun lint:file`
clean on all six `index.tsx` and both edited `*.stories.tsx`.

## Stories updated

- **InternalIncrement → `KeyboardAccessible`** (play fn, `storybook/test`) — the
  regression baseline for fixes 1–3. Asserts `role="spinbutton"` +
  `aria-valuemin/valuemax/valuenow`; drives Up/Down/Home/End on the input; and
  **critically** focuses the +/- buttons and presses Enter/Space, asserting the
  value steps — this exact assertion fails against the old `onMouseDown`-only
  wiring.
- **ExternalIncrement → `KeyboardAccessible`** (play fn) — asserts spinbutton
  semantics and drives Up/Down/Home on the input plus keyboard activation of the
  Increase button.

## Deferred (root cause in Field/Shell — owned by a later serial pass)

### D1. Label-less fields have no accessible name
- **Severity:** moderate · **WCAG:** 4.1.2 (A) · **Pattern:** `missing-accessible-name`
- When a consumer omits `label`, FieldShell renders no `<label>`
  (`Shell/index.tsx:389-403`) and there is no `aria-label` passthrough — so a
  label-less field (easy to hit on the increment fields, which have no default
  label) has **no** accessible name. Affects every Field, not just Number.
- **Suggested change (Shell):** add an optional `ariaLabel?: string` to
  `FieldShellProps` (`Shell/index.tsx:77`) that, when `label` is absent, is merged
  into `inputAriaProps` as `'aria-label'` (built alongside the bag at
  `Shell/index.tsx:345-349`); Field sub-components forward a new optional
  `ariaLabel` prop. Additive, back-compat. Cannot be fixed inside `Field/Number`
  without duplicating shell wiring.

### D2. Passing the `id` prop silently breaks label↔input association
- **Severity:** moderate · **WCAG:** 1.3.1 / 4.1.2 (A) · **Pattern:** `label-htmlfor-id-mismatch`
- FieldShell always renders `<label htmlFor={inputId}>` with its own generated
  `inputId` (`Shell/index.tsx:395`), but every Number sub-field sets the input's
  id to `id={id ?? inputId}` (e.g. `InternalIncrement/index.tsx`,
  `AccountNumber/index.tsx:231`). When a consumer passes an explicit `id`, the
  input's id becomes that value while the label's `htmlFor` stays `inputId` — the
  `<label>` now points at a non-existent element and the association is broken
  (no clickable label, degraded SR announcement). Latent across the whole Field
  family (all sub-fields use the same `id ?? inputId` idiom).
- **Suggested change (Shell):** have FieldShell accept the consumer `id` (e.g. an
  `inputId`/`id` prop on `FieldShellProps`) and use it as **both** the render-prop
  `inputId` and the `<label htmlFor>` target, so the two can never diverge. Then
  sub-fields pass their `id` into FieldShell instead of overriding the input's id
  locally. Additive; preserves the existing generated-id default. Not fixable
  inside `Field/Number` alone without the shell honoring the id.
