# Field/Slider — a11y audit (2026-07-11)

**Status:** FIXED

**Component:** `src/components/Field/Slider/index.tsx` — a single-thumb numeric
slider backed by a native `<input type="range">`, composed inside the shared
`FieldShell` (label / helper / error / theme chrome).

## APG pattern

**WAI-ARIA APG "Slider"** — satisfied by a **native `<input type="range">`**
rather than a `role="slider"` div. Native range is the accessible-by-default
choice: it carries the implicit `slider` role, exposes value/min/max to the
accessibility tree from `value`/`min`/`max`, and ships the **complete APG
keyboard interaction table for free**:

| Key | Action | Source |
|---|---|---|
| Arrow Right / Up | increase by `step` | native UA |
| Arrow Left / Down | decrease by `step` | native UA |
| Home | jump to `min` | native UA |
| End | jump to `max` | native UA |
| Page Up / Page Down | larger step | native UA |

No custom keyboard JS is needed or present — correct. `index.tsx:121-125`
also sets `aria-valuemin` / `aria-valuemax` / `aria-valuenow` /
`aria-orientation` explicitly; these are redundant on a native range input but
are part of the preserved machine-test/attribute contract, so they were **kept
untouched** (the ownership rule forbids removing existing aria-* attributes,
and they cannot drift because they derive from the same `min`/`max`/value
props).

## Issues found

### 1. No `aria-valuetext` — value meaning (units/scale) not conveyed to AT — FIXED
- **Severity:** moderate · **WCAG:** 1.3.1 Info and Relationships (A),
  4.1.2 Name, Role, Value (A) · **Pattern:** `missing-aria-valuetext`
- **Where:** `src/components/Field/Slider/index.tsx:121-124` (input aria-value* block)
- The component announced only the bare number. For the library's own use
  cases — the shipped stories include **Temperature °C** (`CustomRange`),
  **Percentage 0–1 step 0.05**, and **Rating 1–5** — a screen reader read
  "20", "0.5", "3" with the unit/scale living only in the visual label. APG
  says exactly these cases (units, bounded scale, fractional-as-percent)
  require `aria-valuetext`, and the component provided **no way** for a
  consumer to supply it.
- **Fix:** added an additive optional prop
  `formatValueText?: (value: number) => string`
  (`index.tsx:21-30`). When supplied it maps the current value to a
  human-readable string set on `aria-valuetext` (`index.tsx:64-70`,
  `index.tsx:125`); when omitted, `aria-valuetext` is left unset and AT falls
  back to the numeric `aria-valuenow` exactly as before (zero back-compat
  impact — purely additive, no existing prop renamed/retyped).

### 2. No keyboard `:focus-visible` indicator in the module CSS — FIXED
- **Severity:** moderate · **WCAG:** 2.4.7 Focus Visible (AA),
  2.4.11 Focus Appearance (AA) · **Pattern:** `missing-focus-visible-style`
- **Where:** `src/components/Field/Slider/Slider.module.css:7-9` (the only rule
  was `.input { width: 100% }`)
- Unlike the shell's other inputs, the range input is rendered as a **direct
  child of `.shell`, not inside `.inputSlot`**, so it receives **none** of
  FieldShell's `:focus-within` border/ring treatment. Its only focus
  indication was the native UA ring, which is inconsistent across browsers
  (thumb-only in some, easily suppressed by a page reset) — a fragile focus
  indicator for keyboard users. Every other interactive field control in the
  library (Checkbox, Switch) paints an explicit `:focus-visible` ring; the
  slider was the outlier.
- **Fix:** added `.input:focus-visible { outline: 2px solid
  var(--field-border-focus); outline-offset: 2px; }`
  (`Slider.module.css:11-24`). Keyboard-only (`:focus-visible`, not `:focus`),
  theme-aware via the inherited `--field-border-focus` token
  (blue on light/dark, gold on sacred), matching the Checkbox/Switch
  convention. Outline (not box-shadow) so it never collides with the native
  control's own rendering.

## Hearing (WCAG 1.2.x, 1.4.2)

**CLEAN.** Grepped the whole directory for `Audio` / `AudioContext` / `<audio>`
/ `<video>` / `navigator.vibrate` — none. The slider conveys no information by
sound; there is no media playback surface. Value/error/required state is all
visual + programmatic. Nothing to fix.

## Reading & screen reader (1.1.1, 1.3.1, 1.4.1, 2.1.x, 2.4.x, 3.3.x, 4.1.2)

- **Accessible name:** the label renders as a real `<label htmlFor={inputId}>`
  in FieldShell (`Shell/index.tsx:395`), linked to the input via
  `id={inputId}`. `getByLabelText` and SR announcement both work. **Label-less
  usage is now covered locally** (finding R3): a new optional `ariaLabel` prop
  is applied as `aria-label` on the range input when no visible `label` is
  present, so a bare slider still has an accessible name. A visible `<label>`
  always wins (`aria-label` is only set when `label` is falsy), so the prop can
  never override the visible name (WCAG 2.5.3 Label in Name).
- **Semantic HTML:** native `<input type="range">` — the correct primitive, not
  a `role="slider"` div.
- **APG slider states/props:** role (implicit), valuemin/valuemax/valuenow
  present, **valuetext now supported** (fix #1), orientation set, full keyboard
  table native.
- **Focus visible:** now present (fix #2).
- **Forms / error / required:** error text is linked via `aria-describedby` +
  `aria-invalid` and required via `aria-required`, all wired by FieldShell's
  `inputAriaProps` bag (`Shell/index.tsx:345-349`), spread onto the input at
  `index.tsx:126`. Error region uses `role="alert"` + `aria-live="polite"`
  (`Shell/index.tsx:412-413`). Required is conveyed programmatically
  (`aria-required`) plus a visible indicator, not by an asterisk alone.
- **Dynamic updates announced:** value changes are announced natively by the
  slider role as the user arrows (new `aria-valuenow`/`aria-valuetext`); no
  aria-live plumbing needed.
- **Color-alone (1.4.1):** disabled = native `disabled` + `aria-disabled` on
  the wrapper + dimming; error = error text + `aria-invalid`; required =
  indicator text + `aria-required`. No state relies on color alone.

## SEO semantics (Next.js SSR)

**CLEAN.** The slider is a form control, not a heading, landmark, or link. It
SSRs as a real native `<input type="range">` with its `<label>` — no
client-only content injection, no styled-div-as-heading, no onClick-div
masquerading as a link. No SEO/semantic markup change applicable.

## Motion (WCAG 2.3.3)

**N/A.** `Slider.module.css` contains no `transition` / `animation` /
`@keyframes` (verified by grep), and the added `:focus-visible` rule is a
static outline with no motion. No `prefers-reduced-motion` guard is required.

## Fixes applied

1. `formatValueText` prop → `aria-valuetext` (index.tsx) — WCAG 1.3.1 / 4.1.2.
   (commit `ced6ed21`)
2. `.input:focus-visible` outline (Slider.module.css) — WCAG 2.4.7 / 2.4.11.
   (commit `ced6ed21`)
3. `:focus-visible` ring baseline-guarded via keyboard-focus `play` fns
   (`KeyboardFocusRing` + new `KeyboardFocusRingSacred`) — R1. (commit `92cd9136`)
4. **Prior pass** — non-visual ARIA state pinned by `play` assertions across
   `LightTheme` / `WithValueText` / `WithError` / `Required` / `DisabledStates`
   (R2) — WCAG 4.1.2 (+ 1.3.1 / 3.3.1 / 1.4.1). Stories-only; runtime unchanged.
5. **This pass (R3)** — local `ariaLabel` prop → `aria-label` on the range
   input for label-less sliders (`index.tsx`), closing the accessible-name gap
   that was previously only deferred to a shared-Shell pass. New
   `LabelLessAccessibleName` story with a `play` fn pinning both the fallback
   name and the visible-label-wins guard — WCAG 4.1.2 / 2.5.3.

`bun lint:file` clean on `index.tsx` and `Slider.stories.tsx`; `stylelint`
clean on `Slider.module.css`. No runtime WCAG defect remained at the start of
this pass — the component was already compliant (fixes 1–3); this pass closed
the invisible-attribute regression-coverage gap.

## Stories updated

- **`WithValueText`** — exercises `formatValueText` → `aria-valuetext` for
  Temperature ("20 degrees Celsius"), Rating ("3 of 5"), and Opacity
  ("50 percent"), each with a helper explaining the announced string. **Now
  carries a `play` fn** that asserts each slider's `aria-valuetext`
  (+ `aria-valuenow`) equals the formatted string. See finding R2: rendering the
  string into a *non-visual* attribute does **not** make it a Chromatic
  regression test — an explicit `play` assertion does.
- **`LightTheme`** — **now carries a `play` fn** pinning the base APG semantics
  (`aria-valuemin`/`valuemax`/`valuenow`) and the *fallback* branch
  (`aria-valuetext` **absent** when no `formatValueText`), guarding the
  back-compat path a snapshot can't see.
- **`WithError`** — **now carries a `play` fn** asserting the invisible error
  association on both threshold sliders: `aria-invalid="true"` plus
  `aria-describedby` resolving to the `role="alert"` region whose text is the
  error message. Guards WCAG 3.3.1 / 4.1.2 wiring a snapshot can't capture.
- **`Required`** — **now carries a `play` fn** asserting `aria-required="true"`
  (required conveyed programmatically, not by the visual asterisk alone).
- **`DisabledStates`** — **now carries a `play` fn** asserting all three sliders
  are natively `disabled` (removed from the tab order / not operable), not merely
  dimmed by color.
- **`LabelLessAccessibleName`** *(new)* — exercises finding R3. Renders a
  label-less slider named only by `ariaLabel` and a labelled slider that also
  passes `ariaLabel`. The `play` fn asserts (1) the label-less slider resolves
  by `getByRole('slider', { name: 'Zoom level' })` and carries
  `aria-label="Zoom level"` — the invisible accessible name a snapshot can't
  see; and (2) the labelled slider resolves by its visible label and carries
  **no** `aria-label`, proving the visible `<label>` always wins (WCAG 2.5.3).
- **`KeyboardFocusRing`** — renders the slider on light and sacred surfaces
  with instructions to Tab to it, documenting the new `:focus-visible` ring and
  the native keyboard operability. **Now carries a `play` fn** that moves real
  keyboard focus (`userEvent.tab()`) onto the first (light) slider, so the
  `:focus-visible` outline actually paints and is captured in the Chromatic
  baseline — deleting the `.input:focus-visible` rule now changes the snapshot
  (previously the story rendered unfocused and the rule was not baseline-guarded;
  see review-finding fix below). Asserts `toHaveFocus()` on the light slider and
  `toBeEnabled()` on the sacred one (keyboard-reachable). Matches the repo's
  established Avatar/Checkbox/Breadcrumb `KeyboardFocusRing` `play`-tab convention.
- **`KeyboardFocusRingSacred`** *(new)* — a single sacred-theme slider on the
  dark canvas, tabbed to via `play` so its **gold** `:focus-visible` outline
  paints in isolation and Chromatic gates the *sacred* value of the inherited
  `--field-border-focus` token (gold, not blue). Only one element can hold focus
  per snapshot, so the base story cannot also baseline this variant — mirrors the
  Avatar `Focusable` / `FocusableSacred` split.

## Adversarial-review findings (post-pass)

### R1. `:focus-visible` ring not regression-exercised by a story — FIXED
- **Severity:** minor · **WCAG:** 2.4.7 Focus Visible (AA) · **Pattern:**
  `focus-ring-not-baseline-guarded`
- **Where:** `src/components/Field/Slider/Slider.stories.tsx` (the
  `KeyboardFocusRing` story rendered the slider in its default *unfocused* state,
  with no keyboard-focus `play` fn).
- **Root cause:** in this repo the story **+ Chromatic baseline is the only
  regression test**, and `:focus-visible` only matches on keyboard focus. With no
  `play` fn to Tab into the control, the snapshot was identical whether or not
  `.input:focus-visible` existed — so the second new a11y state (the focus ring)
  was undefended: deleting the CSS rule would have changed no baseline and passed
  silently. (The aria-valuetext path was already truly exercised by
  `WithValueText`, which renders the formatted string into the DOM attribute.)
- **Fix:** added a `play` fn to `KeyboardFocusRing` (`userEvent.tab()` →
  `expect(light).toHaveFocus()`) that drives real keyboard focus onto the light
  slider so the ring paints in the baseline, plus a dedicated
  `KeyboardFocusRingSacred` story that tabs to a lone sacred slider to gate the
  gold token value in isolation (one element holds focus per snapshot). Uses the
  repo's established `storybook/test` `userEvent`/`within`/`expect` convention
  (identical to Avatar/Checkbox/Breadcrumb `KeyboardFocusRing`). No component or
  CSS change — the CSS rule was correct; only its baseline guard was missing.
- **Note (why no keyboard-operation assertions):** the `play` deliberately does
  **not** assert value changes from `{Home}`/`{End}`/arrow keys. A native
  `<input type="range">` moves its thumb only on **trusted** key events; the
  synthetic events `userEvent.keyboard` dispatches do not trigger the browser's
  default range behavior, so such assertions would be flaky/false. The keyboard
  table is native-UA-guaranteed (documented above) and does not need — and cannot
  soundly get — a synthetic-event regression test. The `play`'s sole job is to
  establish the keyboard-focus modality so `:focus-visible` renders.
  (Re-verified this pass: the claim holds — dispatched key events are
  `isTrusted:false`, and DOM default actions like range increment fire only for
  trusted events; asserting `aria-valuenow` changed after `userEvent.keyboard`
  would fail. Left correctly unasserted.)

### R2. Non-visual ARIA state (`aria-valuetext`, error linkage, `aria-required`, disabled) not regression-guarded — FIXED
- **Severity:** minor · **WCAG:** 4.1.2 Name, Role, Value (A) [+ 1.3.1 / 3.3.1 /
  1.4.1 for the specific attributes] · **Pattern:**
  `a11y-attribute-not-regression-tested`
- **Where:** `src/components/Field/Slider/Slider.stories.tsx` — `WithValueText`,
  `WithError`, `Required`, `DisabledStates`, and the base `LightTheme` story all
  rendered the correct ARIA but had **no `play`-fn assertions**.
- **Root cause:** identical in shape to R1, one level deeper. In this repo the
  regression net is the Storybook story **+ Chromatic visual baseline + `play`
  assertions**. Chromatic can only guard what is **visible**. `aria-valuetext`,
  `aria-invalid`, the `aria-describedby`→alert link, and `aria-required` are all
  **invisible** — a snapshot is byte-identical whether they are present or not.
  So the prior pass's statement that `WithValueText` guarded the aria-valuetext
  path *"because it renders the formatted string into the DOM attribute"* was
  **incorrect**: rendering into a non-visual attribute is not a visual regression.
  Dropping `aria-valuetext={valueText}`, or the `{...inputAriaProps}` spread that
  carries `aria-invalid`/`aria-describedby`/`aria-required`, would have passed
  every story silently.
- **Fix:** added `play` assertions (no component/CSS change — the runtime was
  already compliant; only the guards were missing):
  - `LightTheme` → base `aria-valuemin`/`valuemax`/`valuenow` + `aria-valuetext`
    **absent** on the no-formatter fallback branch.
  - `WithValueText` → each slider's `aria-valuetext` (+ `aria-valuenow`) equals
    the formatted string.
  - `WithError` → `aria-invalid="true"` + `aria-describedby` resolving to the
    `role="alert"` region containing the message, on both threshold sliders.
  - `Required` → `aria-required="true"`.
  - `DisabledStates` → all three sliders natively `disabled`.
  All assertions are static-attribute / DOM-query reads (no synthetic-keyboard
  default-action dependence — sound per the R1 note). `bun lint:file` clean.

### R3. Label-less accessible name — FIXED LOCALLY (previously deferred)

- **Severity:** moderate · **WCAG:** 4.1.2 Name, Role, Value (A) [+ 2.5.3 Label
  in Name (A) for the visible-label-wins guard] · **Pattern:**
  `missing-accessible-name`
- **Where:** `src/components/Field/Slider/index.tsx:126` (the range `<input>`
  Slider owns) — the accessible-name gap when a consumer omits `label`, which
  FieldShell renders no `<label>` for (`Shell/index.tsx:389-403`).
- **Root cause / re-assessment:** the prior pass deferred this entirely to a
  shared-Shell pass, calling it *"not fixable inside `Field/Slider`."* The
  adversarial review correctly refuted that phrasing: **Slider renders its own
  `<input>`** (`index.tsx:126-147`), and FieldShell's `inputAriaProps` bag
  contains only `aria-required`/`aria-disabled`/`aria-invalid`/
  `aria-describedby` (`Shell/index.tsx:345-349`) — **never `aria-label`** — so a
  local `aria-label` passthrough is possible with **zero** Shell edits and **no**
  conflict with the spread bag.
- **Fix (in my directory):** added an additive optional prop
  `ariaLabel?: string` (`index.tsx`, JSDoc'd) applied as `aria-label` on the
  input **only when `label` is falsy** (`const accessibleName = label ?
  undefined : ariaLabel`; mirrors FieldShell's own render-label condition at
  `Shell/index.tsx:389`). A visible `<label>` always wins, so `ariaLabel` can
  never override the visible name (WCAG 2.5.3). Purely additive — a slider with
  neither `label` nor `ariaLabel` is unnamed exactly as before. New
  `LabelLessAccessibleName` story + `play` fn regression-guards both the
  fallback name and the visible-label-wins branch (invisible to Chromatic, so it
  needs a `play` assertion, not a snapshot).

## Deferred (root cause outside my directory — Field/Shell, owned by a later serial pass)

- **Shared-Shell `ariaLabel` passthrough (optional consolidation, NOT a
  remaining Slider gap).** The Slider accessible-name gap is now closed locally
  (R3). The *general* fix — so **every** field (Text, Dropdown, Date, …), not
  just Slider, gets a label-less accessible name from one place — still belongs
  in the shared shell. This is an optional consolidation, not an open defect for
  Slider.
  - **Suggested change:** add an optional `ariaLabel?: string` to
    `FieldShellProps` (`src/components/Field/Shell/index.tsx:77`) that, when
    `label` is absent, is merged into the `inputAriaProps` bag as `'aria-label'`
    (build alongside the existing bag at `Shell/index.tsx:345-349`). Field
    sub-components would then forward `ariaLabel` into FieldShell instead of
    (Slider) applying it directly. Additive, back-compat. **If/when this lands,
    Slider should forward `ariaLabel` into FieldShell and drop its local
    `aria-label` line** to avoid a double source — but until then the local fix
    is correct and self-contained.
  - Pattern: `missing-accessible-name`.
