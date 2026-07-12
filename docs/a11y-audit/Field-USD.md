# Field/USD — a11y audit (2026-07-11)

**Status: PARTIAL** — every issue inside this directory is FIXED (issues 1–6, 8,
and the two second-pass findings 9–10 below); one finding (issue 7) has its root
cause in `Field/Shell` and is DEFERRED to that serial pass.

**Adversarial-review pass (2026-07-11):** two findings raised — (a) the
consumer-`id` label-association break (already tracked as issue 7, root cause in
Shell, remains DEFERRED with a precise suggested change below) and (b) the
min/max range not being exposed to assistive tech (now tracked + FIXED as issue
8, entirely within this directory via `aria-describedby`).

**Second audit pass (2026-07-11, fresh review):** two additional findings the
earlier passes missed, both FIXED within this directory — **(9)** the stepper
+/- buttons were operable by pointer (`onMouseDown`) and keyboard (`onKeyDown`)
but **not by a synthetic `click`**, so assistive-tech activation, voice control,
a mobile screen-reader double-tap, and programmatic `.click()` never stepped the
value (issue 1's keyboard fix covered Enter/Space but not the AT-click path);
and **(10)** in the no-range configuration a consumer-supplied `aria-describedby`
spread through `{...rest}` **clobbered** the Shell's error/helper `aria-describedby`,
silently un-linking the validation message from the input (the `hasRange` path
already merged correctly; the no-range path did not).

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
| 7 | Moderate | 1.3.1 / 4.1.2 (A) | A consumer-supplied `id` breaks label association: the input renders `id={id ?? inputId}` but Shell's `<label htmlFor={inputId}>` always points at Shell's own generated `inputId`. When `id` is passed the `<label>` no longer references the input. Root cause is in Shell (no custom-id passthrough). | index.tsx:349 (`id={id ?? inputId}`) + Shell/index.tsx:395 | DEFERRED |
| 8 | Minor | 1.3.1 / 4.1.2 (A) | min/max range was not exposed to assistive tech. The field is a free-form currency text input (`type="text"` + `inputMode="decimal"`, deliberately NOT `role="spinbutton"`), so it carries no `aria-valuemin`/`aria-valuemax`/`aria-valuenow`; when `min`/`max` were set a screen-reader user had **no programmatic knowledge of the allowed range** unless the consumer manually wrote helperText. (Adversarial-review finding — the value-CHANGE announcement (issue 3) was addressed but the range-EXPOSURE gap was not.) | index.tsx (input had no range wiring) | FIXED |
| 9 | Moderate | 2.1.1 (A) / 4.1.2 (A) | Stepper +/- buttons responded to `onMouseDown` (pointer) and `onKeyDown` (Enter/Space) but had **no `onClick`**. Assistive-tech activation, voice control ("click increment"), a mobile screen-reader double-tap, and programmatic `.click()` all dispatch a bare `click` event (no `mousedown`), so those users could focus the buttons but never step the value. Pattern class `activation-mousedown-not-click`. | index.tsx:372 / :390 (buttons, `onMouseDown` only) | FIXED |
| 10 | Moderate | 1.3.1 / 3.3.1 / 4.1.2 (A) | In the no-range path a consumer-supplied `aria-describedby` (spread via `{...rest}` **after** `{...inputAriaProps}`) **overrode** the Shell's error/helper `aria-describedby`, dropping the programmatic link between the validation message and the input. The `hasRange` path already merged all three sources; the no-range path did not. Pattern class `form-error-not-associated`. | index.tsx (describedby applied only when `hasRange`) | FIXED |

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
- **Min/max range exposure (issue 8).** The field is intentionally a free-form
  currency **text** input (documented above under APG pattern; endorsed by the
  adversarial review as "defensible"), so `role="spinbutton"` with native
  `aria-valuemin`/`aria-valuemax` was **not** adopted — that would reverse the
  documented design decision and double-announce with the issue-3 live region
  (the sibling `Number/InternalIncrement` IS a spinbutton, but it is a numeric
  stepper, not a formatted-currency field). Instead, whenever `min`/`max` is
  set the input references a **visually-hidden `<span>`** (WCAG technique ARIA1)
  via `aria-describedby` that spells out the bounds ("Value must be between $0
  and $1000." / "…at least $0." / "…at most $1000."). The id is merged into
  `aria-describedby` **without dropping** Shell's helper/error id or any
  consumer-supplied `aria-describedby` (union of all three), so error text and
  range bounds are both announced. Exposed on both the stepper and no-stepper
  configurations; the range BOUNDS (describedby, read on focus) and the value
  CHANGES (issue-3 live region, read on step) are complementary, not redundant.
- **Stepper click-operability (issue 9, second pass).** Added `onClick` to both
  stepper buttons via a `handleButtonClick` factory. It is gated on
  `event.detail === 0`: a real pointer click (`detail >= 1`) already stepped
  through `onMouseDown` and is skipped to avoid double-stepping, while a
  `detail === 0` click — the signature of a synthetic activation from assistive
  tech, voice control, a mobile screen-reader double-tap, or a programmatic
  `.click()`, which has no preceding `mousedown` — performs one step. Keyboard
  Enter/Space still runs through `handleButtonKeyDown` (which `preventDefault`s
  the synthesized click, so it never reaches `onClick`). Net effect: every
  activation method (pointer, keyboard, touch, AT, voice, programmatic) steps
  exactly once; the mouse press-and-hold repeat is untouched. WCAG 2.1.1 / 4.1.2.
- **aria-describedby merge (issue 10, second pass).** The describedby derivation
  is now computed **unconditionally** as the union of the Shell helper/error id
  (`inputAriaProps['aria-describedby']`), any consumer `aria-describedby` (from
  `rest`), and the range id when a range is set — falling back to `undefined`
  (attribute omitted) when nothing describes the field. It is applied after
  `{...rest}` so it wins, meaning a consumer who adds their own `aria-describedby`
  no longer clobbers the Shell's error/helper link (both are kept). No behaviour
  change in the common no-describedby case. WCAG 1.3.1 / 3.3.1 / 4.1.2.
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
  - **Range exposure (issue 8):** a `hasRange`/`rangeDescription` derivation
    plus a visually-hidden `<span id={`${inputId}-range`}>` describing the
    min/max bounds, its id merged into the input's `aria-describedby`.
    No `role`/`type` change — the field stays a currency textbox.
  - **Stepper click-operability (issue 9):** a `handleButtonClick(handler)`
    factory wired as `onClick` on both stepper buttons, gated on
    `event.detail === 0` so synthetic AT/voice/touch/programmatic clicks step
    once and real mouse clicks (already handled by `onMouseDown`) do not
    double-step. Additive — `onMouseDown`/`onKeyDown` paths unchanged.
  - **aria-describedby merge (issue 10):** the describedby union is now computed
    unconditionally (Shell helper/error id + consumer `aria-describedby` + range
    id when set, else `undefined`) and applied after `{...rest}`, so a consumer
    `aria-describedby` can no longer drop the Shell error/helper link. The
    `{...(hasRange ? …)}` conditional became `{...(describedBy ? …)}`.
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
- **`RangeExposedToAT`** (name "Min/max range (aria-describedby)") — renders
  `min: 0`, `max: 1000` and **no** helperText; the `play` function reads the
  input's `aria-describedby`, resolves the referenced node(s), and asserts the
  text matches `/between $0 and $1000/`. Failing-first for issue 8: against the
  pre-fix component `aria-describedby` is `undefined` (no helper/error, no range
  wiring), so the `toBeTruthy()` assertion fails.
- **`ClickOperableSteppers`** (name "Click-operable steppers (AT / voice)",
  second pass) — a `play` function that drives BOTH activation paths: a bare
  `fireEvent.click` on each button (the AT/voice/mobile path, `detail === 0`,
  must step `10 → 11 → 10`) and a full `userEvent.click` (a real pointer press,
  `detail >= 1`, must step exactly once `10 → 11`, never twice). Failing-first
  for issue 9: against the pre-fix `onMouseDown`/`onKeyDown`-only buttons the
  bare `fireEvent.click` produces no step, so the first assertion fails.
- **`DescribedByComposition`** (name "aria-describedby merge (error + external)",
  second pass) — renders `error` plus a consumer `aria-describedby="usd-external-hint"`
  and an external `<p id="usd-external-hint">`. The `play` function asserts the
  input's `aria-describedby` both contains the consumer id AND (resolving every
  referenced node) still surfaces the error text. Failing-first for issue 10:
  against the pre-fix no-range path `{...rest}` overrode the Shell describedby,
  so the error message was no longer referenced and the error-text assertion
  fails.

`MoneyText.stories.tsx` unchanged — no `<MoneyText>` defects found.

## Deferred

- **Consumer `id` breaks `<label>` association (issue 7).** Root cause is in the
  Shell-owned file, not this directory:
  - `src/components/Field/USD/index.tsx:349` renders `id={id ?? inputId}` on the
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
