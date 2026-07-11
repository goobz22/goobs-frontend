# Field/Percentage — a11y audit (2026-07-11)

**Status:** FIXED (all in-directory issues fixed; one root-cause-in-Shell issue DEFERRED)

**APG pattern:** [Spinbutton](https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/) — an
auto-sizing numeric percentage input with stacked +/- stepper buttons. The correct semantics
are `role="spinbutton"` on the value-bearing input, `aria-valuenow/valuemin/valuemax/valuetext`,
and ArrowUp/ArrowDown stepping (matching a native `<input type="number">`, which browsers expose
as an implicit spinbutton). This component previously rendered a bare textbox with mouse-only
steppers.

Component composes `FieldShell` (owned by a later serial pass — NOT edited here): FieldShell
already provides the `<label htmlFor>` association, `aria-describedby` → helper/error region,
`aria-invalid`, `aria-required`, and `role="alert"`/`aria-live` on the error text. Those parts
were verified compliant. The stepper icons (`ArrowDropUp`/`ArrowDropDown`) are already
`aria-hidden="true" focusable="false"` decorative-by-default via `resolveIconA11y`, and each
button carries an `aria-label`, so the icons add no name noise (WCAG 1.1.1 — PASS, no change).

---

## Issues found

### 1. +/- stepper buttons are keyboard-inoperable — CRITICAL — WCAG 2.1.1 (Keyboard, A) — FIXED
`src/components/Field/Percentage/index.tsx:367,379` (pre-fix) — both buttons wired **only**
`onMouseDown={() => handleMouseDown(...)}`. A native `<button>` fires a `click` on Enter/Space
but **never** fires `mousedown` from keyboard activation, so a keyboard/switch/AT user who
tabbed to a stepper and pressed Enter or Space got **nothing** — the increment/decrement
affordance was completely inert without a mouse.
**Fix:** split the handler into `handlePressStart` (pointer press-and-hold auto-repeat) and
`handleActivate` (canonical single step, wired to `onClick`, which fires for BOTH mouse click
and keyboard Enter/Space). A `didAutoRepeatRef` guard suppresses the trailing release-`click`
after a hold so press-and-hold doesn't double-count. Mouse press-and-hold auto-repeat is
preserved unchanged.
**Pattern:** `mousedown-only-activation`

### 2. No visible focus indicator on the input — SERIOUS — WCAG 2.4.7 (Focus Visible, AA) — FIXED
`src/components/Field/Percentage/Percentage.module.css:28` — `.input` sets `outline: none` with
**no** `:focus-visible`/`:focus-within` replacement. FieldShell's focus treatment
(`.inputSlot:focus-within`) does not apply because Percentage renders its own `.inputWrapper`,
not `.inputSlot`. Result: focusing the field by keyboard showed no indication at all.
**Fix:** added `.inputWrapper:focus-within` (theme-aware focus-coloured border, mirroring
FieldShell) plus explicit `.input:focus-visible` and `.button:focus-visible` outline rings using
the theme-switched `--field-border-focus` custom property, so each interactive element shows a
precise, clearly-visible ring.
**Pattern:** `missing-focus-visible-style`

### 3. Incomplete spinbutton semantics (no role/value, no arrow-key stepping) — SERIOUS — WCAG 4.1.2 (Name, Role, Value, A) + 2.1.1 — FIXED
`src/components/Field/Percentage/index.tsx` input (pre-fix) — the input was an unadorned
`type="text"` textbox: screen readers announced no value/range, and the field had **no**
`onKeyDown`, so ArrowUp/ArrowDown (the universally-expected spinner keys, and the primary path
for users who never use the +/- buttons) did nothing.
**Fix:** added `role="spinbutton"` + `aria-valuenow` (parsed number) + `aria-valuemin`/`max`
(from `min`/`max` props) + `aria-valuetext` (the human-readable `"75%"` form, only when the %
symbol is shown), all omitted while the field is empty. Added an `onKeyDown` handler mapping
ArrowUp → increment and ArrowDown → decrement (with `preventDefault`), reusing the existing
clamp/step logic. Home/End/Left/Right are intentionally left to native caret movement so
multi-digit text editing is not broken (matching native `<input type=number>`, which also does
not map Home/End to min/max).
**Markup change note:** the input now carries `role="spinbutton"` (previously the implicit
`textbox` role) plus the four `aria-value*` attributes. No existing `data-*`/`role`/`aria`
attribute was removed or renamed; `[data-field-name]` on both the shell and the input is
unchanged, so the Playwright selector contract is preserved.
**Pattern:** `incomplete-spinbutton-pattern`

### 4. Transitions ignore prefers-reduced-motion — MINOR — WCAG 2.3.3 (Animation from Interactions, AAA) — FIXED
`src/components/Field/Percentage/Percentage.module.css:22,72` — `.inputWrapper` and `.button`
declare `transition: var(--goobs-transition-slow)` with no reduced-motion guard.
**Fix:** added `@media (prefers-reduced-motion: reduce)` disabling the transitions on both.
**Pattern:** `missing-reduced-motion`

### 5. Custom `id` prop breaks label association — MODERATE — WCAG 1.3.1 / 4.1.2 — DEFERRED (root cause in Shell)
`src/components/Field/Percentage/index.tsx:349` — the input renders `id={id ?? inputId}`, but
FieldShell renders `<label htmlFor={inputId}>` using its own `useId`-generated `inputId`
(`src/components/Field/Shell/index.tsx:291,395`). When a consumer passes the public `id` prop,
the input's `id` diverges from the label's `htmlFor`, silently **breaking** the programmatic
label association. The **default** path (no `id` prop) is fully associated and accessible — only
the custom-`id` edge is affected. The root cause is Shell owning the `<label>` with a generated
id that a sub-field cannot redirect from its own directory, so this is deferred (see below).

---

## Hearing (WCAG 1.2.x, 1.4.2)
No audio, `<audio>`/`<video>`, `AudioContext`, or `navigator.vibrate` usage — grepped the
directory, none present. All state (value, error, disabled, focus) is conveyed visually and
programmatically; nothing is audio-only. No action needed.

## Reading & screen reader (1.1.1, 1.3.1, 1.4.1, 2.1.x, 2.4.x, 3.3.x, 4.1.2)
- Accessible name: input named via FieldShell's `<label htmlFor>` (default path); both stepper
  buttons have `aria-label` ("increment"/"decrement"); stepper icons are decorative
  `aria-hidden`. PASS.
- Semantic HTML: real `<input>` and real `<button type="button">` throughout — no role-annotated
  divs. PASS.
- Spinbutton role/state/keyboard: added `role="spinbutton"` + `aria-value*` + ArrowUp/Down
  stepping (Issue 3). The +/- buttons made keyboard-operable (Issue 1). FIXED.
- Focus visible: added (Issue 2). FIXED.
- Error/required: FieldShell links the error text via `aria-describedby` + `role="alert"` +
  `aria-live="polite"` and sets `aria-invalid`; required is programmatic via `aria-required`
  (not asterisk-only). PASS (Shell-provided, verified).
- Colour-alone: error state is conveyed by the described-by error text + `aria-invalid`, not
  colour alone; disabled by the native `disabled` attribute (+ `aria-disabled` from Shell), not
  colour alone. PASS.
- Motion: reduced-motion guard added (Issue 4). FIXED.

## SEO semantics
Not a heading/landmark/link/list/table component — it is a form field. The value-bearing element
is a real `<input>` present in SSR HTML (the field is `'use client'` but renders its input on the
server); no client-only injection of primary content. No `<a>`/heading/nav semantics apply. No
action needed.

## Fixes applied
- `index.tsx`: `role="spinbutton"` + `aria-valuenow/valuemin/valuemax/valuetext`; `onKeyDown`
  ArrowUp/ArrowDown stepping; `handlePressStart`/`handleActivate` split with `onClick` on both
  steppers (keyboard-operable) + `didAutoRepeatRef` double-count guard.
- `Percentage.module.css`: `.inputWrapper:focus-within` focus border; `.input:focus-visible` and
  `.button:focus-visible` focus rings; `@media (prefers-reduced-motion: reduce)` transition-off.

## Stories updated
Added two play-function regression stories to `PercentageField.stories.tsx`:
- `KeyboardStepping` — asserts `role="spinbutton"` + `aria-valuemin/max/now/valuetext`, then
  ArrowUp/ArrowDown adjust the value and keep `aria-valuenow` in sync.
- `ButtonKeyboardActivation` — Tab reaches the increment button, Enter activates it; Tab reaches
  the decrement button, Space activates it (regression guard for the mousedown-only bug).
Existing `InteractionTest` (decimal-typing) still passes with the added role.

## Deferred
- **Custom `id` prop breaks the label association** (Issue 5).
  - File: `src/components/Field/Shell/index.tsx:291` (id generation) and `:395` (`<label
    htmlFor={inputId}>`).
  - Suggested change: give `FieldShell` an optional `inputId?: string` prop (or expose the
    consumer's id through the render-prop slot) so a sub-field that accepts a public `id` can make
    the shell's `<label htmlFor>` point at that same id. Then `Field/Percentage` would pass its
    `id` prop into the shell instead of overriding only the input's `id`. Cannot be fixed from the
    Percentage directory because the `<label>` and its `htmlFor` live entirely in Shell.
