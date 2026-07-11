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
  `id={inputId}` (`index.tsx:110`). `getByLabelText` and SR announcement both
  work. (Label-less usage caveat → Deferred.)
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
2. `.input:focus-visible` outline (Slider.module.css) — WCAG 2.4.7 / 2.4.11.

Both landed in commit `ced6ed21`. `bun lint:file` clean on `index.tsx` and
`Slider.stories.tsx`; `stylelint` clean on `Slider.module.css`.

## Stories updated

- **`WithValueText`** — exercises `formatValueText` → `aria-valuetext` for
  Temperature ("20 degrees Celsius"), Rating ("3 of 5"), and Opacity
  ("50 percent"), each with a helper explaining the announced string. This is
  the regression baseline for the new aria-valuetext path (the formatted string
  is rendered into the DOM attribute).
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

## Deferred (root cause outside my directory — Field/Shell, owned by a later serial pass)

- **Label-less accessible name.** When a consumer omits `label`, FieldShell
  renders no `<label>` (`Shell/index.tsx:389-403`) and there is no
  `aria-label` passthrough, so a label-less slider would have **no accessible
  name** (WCAG 4.1.2). This affects *every* field, not just Slider, and the fix
  belongs in the shared shell.
  - **Suggested change:** add an optional `ariaLabel?: string` to
    `FieldShellProps` (`src/components/Field/Shell/index.tsx:77`) that, when
    `label` is absent, is merged into the `inputAriaProps` bag as
    `'aria-label'` (build alongside the existing bag at
    `Shell/index.tsx:345-349`). Field sub-components (Slider included) would
    then forward a new optional `ariaLabel` prop into FieldShell. Additive,
    back-compat.
  - Pattern: `missing-accessible-name`. Not fixable inside `Field/Slider`
    without duplicating shell wiring, so deferred rather than worked around.
