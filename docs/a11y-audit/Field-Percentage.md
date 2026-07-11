# Field/Percentage — a11y audit (2026-07-11)

**Status:** FIXED (all in-directory issues fixed, including the adversarial review-pass
findings below; one root-cause-in-Shell issue — custom `id` label association — remains
DEFERRED, and one out-of-directory scope-disclosure is recorded for the sibling owners)

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

---

## Adversarial review pass (2026-07-11)

A second, adversarial review of the first pass surfaced five findings. Resolution below.

### R1 (moderate) — Custom `id` prop STILL breaks label association — DEFERRED (root cause in Shell)
Same bug as Issue 5 above, re-confirmed OPEN at HEAD. The input renders `id={id ?? inputId}`
(`index.tsx`) while Shell's `<label htmlFor={inputId}>` uses its own `useId` value
(`src/components/Field/Shell/index.tsx:291,395`), so passing a public `id` diverges the two.
Verified from source that Shell's `FieldShellSlot` exposes only `inputId`/`helperId`/`inputAriaProps`
— there is **no** seam to redirect the `<label htmlFor>` from inside the Percentage directory, and
Shell is owned by a later serial pass (must not be edited here). The review itself concurs this is
"genuinely not fixable from inside the Percentage dir." **Stays DEFERRED** with the exact Shell
root-cause + suggested `inputId?: string` prop change in the Deferred section above. Not marked fixed.

### R2 (minor) — aria-valuenow could report a value outside [min, max] — FIXED — WCAG 4.1.2 / WAI-ARIA spinbutton
`index.tsx` — `numericForAria` was the raw display number, so an out-of-range seed/prop
(the `ErrorStates` story's `initialValue="150"` against `max=100`, or `"-25"` against `min=0`)
exposed e.g. `aria-valuenow="150"` alongside `aria-valuemax="100"`, violating the spinbutton range
constraint (aria-valuenow ∈ [aria-valuemin, aria-valuemax]).
**Fix:** added `clampedNumericForAria = Math.min(max, Math.max(min, numericForAria))` and bound
`aria-valuenow` to it. The **display value and `aria-valuetext` are intentionally left unclamped**
(the field still shows the truthful "150%"/"-25%" for the error state); only the numeric
`aria-valuenow` is constrained into range.
**Pattern:** `aria-valuenow-out-of-range`

### R3 (minor) — Generic stepper aria-labels are ambiguous with >1 field on a page — FIXED — WCAG 2.4.6 / 4.1.2
`index.tsx` — both steppers carried the bare `aria-label="increment"`/`"decrement"`, so multiple
Percentage/stepper fields on one page exposed indistinguishable controls to AT.
**Fix:** derived `incrementAriaLabel`/`decrementAriaLabel` that reference the field label
(`"Increase <label>"` / `"Decrease <label>"`), falling back to the bare verb when no label is set.
The `data-action="increment"/"decrement"` attributes the ThothOS Playwright suite keys on are
**unchanged** — only the AT-facing accessible name changed.
**Pattern:** `ambiguous-control-name`

### R4 (minor) — CSS-only a11y states not pinned by any story — FIXED
`.input`/`.button:focus-visible` rings (`Percentage.module.css:61-69`) and the
`@media (prefers-reduced-motion: reduce)` block (css:107-114) had no story exercising them, so the
Chromatic baseline — the only regression test here — couldn't catch a silent rebuild regression.
**Fix:** added `FocusVisibleAndReducedMotion` — a play function that Tabs (keyboard modality, so
`:focus-visible` applies) onto the input and the increment button and asserts a real `outline`
(`getComputedStyle(...).outlineStyle === 'solid'`) on each, and structurally asserts a
`@media (prefers-reduced-motion: reduce)` rule zeroing `transition` exists in the injected stylesheet
(engine-independent of the runner's OS motion setting). The keyboard-focused snapshot also gives
Chromatic a visible-ring baseline.
**Pattern:** `unpinned-css-a11y-state`

### R5 (minor) — Out-of-directory scope expansion (commit `3d16a9bb`) — DISCLOSED (not in this dir)
Commit `3d16a9bb` ("a11y-lint(missing-data-action-on-actions): add increment/decrement to Field
steppers (6 files)") added `data-action` to five SIBLING components —
`Field/Number/ExternalIncrement`, `Field/Number/InternalIncrement`, `Field/IPAM/CIDR`,
`Field/IPAM/Subnet`, `Field/IPAM/VLAN` — alongside the in-scope `Field/Percentage` change. Verified
via `git show --stat 3d16a9bb`: the edits are purely additive (a single `data-action` attribute each,
a class-first lint remediation) and **non-breaking**, but they fall outside the Percentage directory's
ownership boundary. There is **nothing to fix and nothing to revert here** (reverting is forbidden and
those files are not ours); this is a **disclosure** so the sibling-component owners are aware their
files were touched. Recorded in Deferred → sibling owners.

### Review-pass stories added / changed
- `OutOfRangeAriaClamp` — `initialValue="150"`, `max=100`: asserts `aria-valuenow="100"` while
  `value`/`aria-valuetext` stay `"150%"` (R2 regression guard).
- `BelowMinAriaClamp` — `initialValue="-25"`, `min=0`: asserts `aria-valuenow="0"` while
  `value`/`aria-valuetext` stay `"-25%"` (R2 below-min mirror).
- `FocusVisibleAndReducedMotion` — focus-ring + reduced-motion pins (R4).
- `ButtonKeyboardActivation` — updated its `getByRole('button', { name })` queries to the new
  label-scoped names (`"Increase Stepper Percentage"` / `"Decrease Stepper Percentage"`) and added an
  assertion that `data-action` is still `increment`/`decrement` (R3 + selector-contract guard).

### Deferred → sibling owners (out of this directory)
- **Custom `id` label association** (R1 / Issue 5): `src/components/Field/Shell/index.tsx:291` (id
  gen) + `:395` (`<label htmlFor={inputId}>`). Suggested: add an optional `inputId?: string` prop to
  `FieldShell` so a sub-field accepting a public `id` can point the shell `<label htmlFor>` at it.
- **Scope-expansion disclosure** (R5): commit `3d16a9bb` added an additive `data-action` to
  `Field/Number/ExternalIncrement/index.tsx`, `Field/Number/InternalIncrement/index.tsx`,
  `Field/IPAM/CIDR/index.tsx`, `Field/IPAM/Subnet/index.tsx`, `Field/IPAM/VLAN/index.tsx`. No change
  needed (additive/non-breaking); flagged for those owners' awareness.
