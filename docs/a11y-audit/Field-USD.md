# Field/USD — a11y audit (2026-07-11)

**Status: FIXED** (one root-cause item DEFERRED to Field/Shell)

Scope: `src/components/Field/USD/` — the editable `<USDField>` (`index.tsx`,
`USD.module.css`, `USDField.stories.tsx`), its read-only sibling `<MoneyText>`
(`MoneyText.tsx`, `MoneyText.module.css`, `MoneyText.stories.tsx`), and the
shared `formatCurrency.ts` parsing core. Shell chrome (label association,
`aria-invalid`/`aria-describedby` error wiring, `aria-required`) lives in
`src/components/Field/Shell` and is audited only for how this sub-field uses it.

## APG pattern

`<USDField>` is a **currency text input** (`type="text"` + `inputMode="decimal"`
for format-preserving entry, deliberately not `type="number"`) with an optional
**stepper** (increment/decrement buttons). There is no single APG pattern; the
relevant guidance is the **Spinbutton** interaction model applied to a text
field — Arrow Up/Down adjust the value, and the stepper buttons are ordinary
buttons that must be keyboard-operable. It is NOT a combobox/listbox, so the
dropdown selector contract does not apply here. `<MoneyText>` is a read-only
formatted `<span>` (no interactive pattern; just non-text-alternative concerns).

## Issues found

| # | Severity | WCAG | Issue | file:line | Status |
|---|----------|------|-------|-----------|--------|
| 1 | Serious | 2.1.1 Keyboard (A) | Stepper +/- buttons were wired to `onMouseDown` only. A keyboard user can Tab to them, but Enter/Space fire `click` (not `mousedown`) so they were **completely inoperable by keyboard** — no increment/decrement without a pointer. | index.tsx (buttons, was ~287/301) | FIXED |
| 2 | Serious | 2.4.7 Focus Visible (AA) | The `<input>` sets `outline: none` and neither `.inputWrapper` nor the buttons had any `:focus-visible`/`:focus-within` replacement. Shell's focus ring targets `.inputSlot`, which this field does not use (it renders its own `.inputWrapper`), so a focused field had **no visible focus indicator at all**. | USD.module.css:28 (`outline:none`), no `:focus-within` | FIXED |
| 3 | Moderate | 4.1.3 Status Messages (AA) | Activating a stepper button changes the amount, but focus stays on the button, so a screen-reader user got **no feedback** that the value changed (a spinbutton would announce `aria-valuenow`; this text input announces nothing). | index.tsx (increment/decrement handlers) | FIXED |
| 4 | Minor | 2.1.1 Keyboard (A) | Arrow Up/Down in the input did nothing when the stepper was enabled — the expected number-field affordance was missing, forcing keyboard users onto the tiny buttons. | index.tsx (input had no `onKeyDown`) | FIXED |
| 5 | Minor | 1.1.1 Non-text Content (A) | The decorative sacred glyph `𓊹` (U+13029) rendered as a bare `<span>` with no `aria-hidden`, so assistive tech tried to announce a lone Egyptian hieroglyph next to the field — noise with no meaning. | index.tsx (sacred glyph span, was :261) | FIXED |
| 6 | Minor | 2.3.3 Animation from Interactions (AAA) | `.inputWrapper` and `.button` carry `transition: all 0.3s ease` with no `@media (prefers-reduced-motion: reduce)` fallback. | USD.module.css:21, :85 | FIXED |
| 7 | Moderate | 1.3.1 / 4.1.2 (A) | A consumer-supplied `id` breaks label association: the input renders `id={id ?? inputId}` but Shell's `<label htmlFor={inputId}>` always points at Shell's own generated `inputId`. When `id` is passed the `<label>` no longer references the input. Root cause is in Shell (no custom-id passthrough). | index.tsx:325 (`id={id ?? inputId}`) + Shell/index.tsx:395 | DEFERRED |

No hearing/media issues, no color-only state defects, and no SEO/heading issues
were found (details below).

## Hearing (WCAG 1.2.x / 1.4.2)

Clean. Grepped the whole directory for `new Audio` / `AudioContext` /
`createOscillator` / `<audio>` / `<video>` / `navigator.vibrate` — **no matches**.
Nothing conveys information by sound; all state (error, disabled, filled, step
changes) is visual + programmatic. No media playback, so no caption/transcript
surface is needed.

## Reading & screen reader (WCAG 1.1.1, 1.3.1, 1.4.1, 2.1.x, 4.1.2, 4.1.3)

- **Accessible names.** The stepper buttons carry `aria-label="increment"` /
  `"decrement"` (adequate names — kept verbatim to avoid disturbing any external
  `getByRole(name)` machine test). The two caret icons (`ArrowDropUp`/
  `ArrowDropDown`) are decorative-by-default in the shared `resolveIconA11y`
  helper (`aria-hidden="true"` + `focusable="false"`) and correctly stay hidden
  because the wrapping button already names the action — verified in
  `Icons/iconA11y.ts:66`.
- **Keyboard (issues 1 & 4).** Added `onKeyDown` to both stepper buttons
  (Enter/Space → one step, `preventDefault` to suppress the synthesized click;
  native key-repeat covers hold-to-repeat) and to the input (Arrow Up/Down →
  step when `enableIncrement`, chained after any consumer `onKeyDown`, opt-out
  via `preventDefault`). The step logic is unified in one `stepValue(direction)`
  helper reused by pointer + keyboard so pointer behaviour is byte-for-byte
  unchanged.
- **Status announcement (issue 3).** Added a visually-hidden
  `role="status" aria-live="polite"` region (mirrors the sibling
  `Field/Signature` pattern) that speaks the new `$amount` — set **only** from
  `stepValue`, so typing keystrokes are not announced (the input voices those).
- **Decorative glyph (issue 5).** `aria-hidden="true"` added to the `𓊹` span.
- **The `$` currency adornment (kept, by design).** The `$` renders as a plain
  `<span>` (not `aria-hidden`), so it stays in the accessibility tree as static
  text immediately before the input — a screen-reader user browsing the form
  encounters the currency indicator. Hiding it would remove the only in-field
  currency cue (the default label is the generic "Amount"), so it is
  intentionally left exposed rather than hidden.
- **Error / required / disabled (Shell-owned, verified correct).** `<USDField>`
  forwards `error`/`required`/`disabled` to `FieldShell` and spreads the
  resulting `inputAriaProps` onto the input, so error text is linked via
  `aria-describedby` + `role="alert"` + `aria-invalid="true"`, required is
  `aria-required` (not asterisk-only), and disabled is the native `disabled`
  attribute + `aria-disabled` on the wrapper. New `RequiredField` and
  `ErrorState` stories exercise these paths.
- **`<MoneyText>` (read-only).** Negative amounts are conveyed by the literal
  `-` sign in the rendered text (not colour alone — satisfies 1.4.1); the muted
  red and the `data-money-negative` attribute are supplementary. Empty/
  unparseable values render a visible placeholder dash. No interactive surface,
  no name required. No changes needed.

## SEO semantics (SSR-crawled markup)

Clean. `<USDField>` uses a real `<input>`, real `<button type="button">`, and a
real `<label htmlFor>` (via Shell) — all present in SSR HTML. `<MoneyText>` is a
semantically-appropriate inline `<span>` for a formatted figure (it is data, not
a heading or landmark), so no `<h1-6>`/`headingLevel` prop is warranted. No
links, lists, tables, or landmarks are implied by either component, and no
primary content is client-injected. No SEO fixes required.

## Fixes applied

- **index.tsx**
  - Unified `stepValue(direction)` reads the live value off the input ref and
    updates value + live-region text + `onChange` in one synchronous pass (no
    setState-in-effect); `handleIncrement`/`handleDecrement` now delegate to it.
  - `handleButtonKeyDown` factory → Enter/Space keyboard activation on both
    stepper buttons.
  - `handleKeyDown` on the input → Arrow Up/Down stepping (gated on
    `enableIncrement`, chains the consumer's `onKeyDown`, which is now
    destructured out of `...rest` so it can't clobber the handler).
  - `aria-hidden="true"` on the decorative sacred glyph.
  - Visually-hidden `role="status" aria-live="polite"` live region.
- **USD.module.css**
  - `.inputWrapper:focus-within` focus ring (themed via the `--goobs-focus-*`
    tokens, with `[data-theme='light'/'dark']` overrides driven by the ancestor
    Shell attribute) + `.button:focus-visible` outline.
  - `.srOnly` visually-hidden utility for the live region.
  - `@media (prefers-reduced-motion: reduce)` disabling the `.inputWrapper` /
    `.button` transitions.

All additive: no prop renamed/removed/retyped, no `data-*`/`role`/`aria`
attribute removed, and the mouse press-and-hold behaviour is preserved.

## Stories updated

`USDField.stories.tsx` (imports `userEvent`/`within`/`expect`/`waitFor` from
`storybook/test`, matching the repo convention):

- **`RequiredField`** — renders `required`; exercises the `*` indicator +
  `aria-required`.
- **`ErrorState`** — renders a string `error`; exercises `aria-invalid` +
  `role="alert"` error text + `aria-describedby`.
- **`KeyboardOperableSteppers`** — a `play` function that focuses the increment
  button and presses **Enter** (asserts `11.00`), the decrement button + Enter
  (asserts `10.00`), then Arrow Up ×2 / Arrow Down in the input (asserts
  `12.00` → `11.00`). This is a genuine failing-first regression test for
  issues 1 & 4 (it fails against the pre-fix `onMouseDown`-only component) and
  leaves focus in the field so the Chromatic snapshot also captures the new
  focus ring (issue 2).

`MoneyText.stories.tsx` unchanged — no `<MoneyText>` defects found.

## Deferred

- **Consumer `id` breaks `<label>` association (issue 7).** Root cause is in the
  Shell-owned file, not this directory:
  - `src/components/Field/USD/index.tsx:325` renders `id={id ?? inputId}` on the
    input.
  - `src/components/Field/Shell/index.tsx:395` renders
    `<label htmlFor={inputId}>` using Shell's own generated `inputId` with no way
    to accept a custom id.
  When a consumer passes `id`, the label's `htmlFor` no longer matches the
  input's `id`, breaking programmatic label association (WCAG 1.3.1 / 4.1.2) and
  label-click focus. Fixing it in this directory is not possible without either
  dropping the public `id` behaviour or leaving the label mismatched.
  **Suggested change (Shell):** add an optional `id`/`htmlFor` prop to
  `FieldShellProps`; when provided, use it for both `<label htmlFor>` and the
  slot's `inputId` so a consumer-supplied id drives both ends. Then `<USDField>`
  can pass its `id` through and the association holds. This shape is generic to
  every Shell-based field, so it belongs in the Shell serial pass.
