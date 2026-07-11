# Checkbox — a11y audit (2026-07-11)

**Status:** FIXED

**APG pattern:** [Checkbox](https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/) —
specifically the **tri-state (mixed) checkbox** variant. This component is built on a
native `<input type="checkbox">` wrapped in a `<label>`, which is the preferred
"semantic HTML first" implementation of the pattern (no `role="checkbox"` div needed).
The tri-state is expressed via the native `indeterminate` DOM property (set in a
`useEffect`, index.tsx:326-330) plus `aria-checked="mixed"` (index.tsx:357).

## Issues found

| # | Severity | WCAG | Location | Status |
|---|----------|------|----------|--------|
| 1 | Critical | 2.4.7 Focus Visible (AA), 2.4.11 Focus Appearance (AA), 1.4.11 Non-text Contrast (AA) | `Checkbox.module.css` (`.input`, lines 130-141, no focus rule anywhere in file) | **FIXED** |
| 2 | Moderate | 1.1.1 Non-text Content (A), 4.1.2 Name, Role, Value (A) | `index.tsx:375-399` (the `.icon` div) and `:366-374` (the `.box` div) | **FIXED** |
| 3 | Minor (by design — consumer responsibility) | 4.1.2 Name, Role, Value (A) | `index.tsx:403-405` (label only rendered when `children` present) | **DEFERRED (documented, not a defect)** |

### Issue 1 — No visible keyboard focus indicator (Critical)

The native `<input type="checkbox">` is visually hidden with `opacity: 0`
(`Checkbox.module.css:130-141`) so it can sit on top of the styled `.box`/`.icon`
divs and receive clicks. Because `opacity: 0` also paints the browser's default focus
outline invisible, and **the module contained no `:focus-visible` / `:focus-within`
rule of any kind**, a keyboard user tabbing through a form had **zero visual indication**
of which checkbox held focus. This fails WCAG 2.4.7 (a visible focus indicator must
exist) and 2.4.11 / 1.4.11 (the indicator must be perceivable / meet non-text contrast).

**Root cause:** the focus state lived on an invisible element and was never mirrored
onto the visible box.

### Issue 2 — Decorative check/indeterminate SVG not hidden from assistive tech (Moderate)

The `.icon` div renders a `CheckIcon` / `IndeterminateCheckBoxIcon` SVG
(`index.tsx:384-398`). Those SVGs (`src/components/Icons/Check.tsx`,
`IndeterminateCheckBox.tsx`) render `<svg>` with no `role`/`aria-label`/`aria-hidden`.
The graphic is a *decorative duplicate* of state the native input already exposes
programmatically (`checked` / `indeterminate` DOM prop / `aria-checked="mixed"`).
Sitting inside the `<label>`, an unhidden decorative graphic risks screen-reader noise
and, depending on the AT, leaking into the computed accessible name. The sibling `.box`
div is likewise pure presentational chrome.

## Hearing

No audio, video, `Audio`, `AudioContext`, `<audio>`/`<video>`, or `navigator.vibrate`
usage anywhere in the component (grep clean). No information is conveyed by sound, so
WCAG 1.2.x / 1.4.2 do not apply. **No issues.**

## Reading & screen reader

- **Semantic HTML:** uses a real native `<input type="checkbox">` inside a real
  `<label>` — the ideal APG implementation. No `role`-annotated div. Good.
- **Accessible name:** the wrapper `<label htmlFor={stableId}>` (index.tsx:340-341) is
  associated with the input `id={stableId}`; visible `children` text becomes the
  accessible name (index.tsx:403-405). **Fixed** the decorative-icon leakage (Issue 2)
  so the name is now exactly the label text — verified by the `A11y/Accessible Name`
  story resolving the control via `getByRole('checkbox', { name: 'Accept terms…' })`.
- **Tri-state:** `aria-checked="mixed"` (index.tsx:357) + native `indeterminate` DOM
  property (index.tsx:326-330) correctly announce the mixed state. Verified by the
  `A11y/Indeterminate Announced` story. Good (kept as-is).
- **Focus visible:** **Fixed** (Issue 1) — added a `:focus-visible` outline mirrored
  onto the visible box, per-theme.
- **State never color-alone (1.4.1):** checked → filled box **plus** a checkmark icon;
  indeterminate → **plus** a dash icon; disabled → the native `disabled` attribute
  (programmatic) plus `data-disabled` styling. Not color-only. Good.
- **Keyboard interaction:** the native checkbox provides the full APG keyboard contract
  for free — `Tab`/`Shift+Tab` to move focus, `Space` to toggle. No custom key handling
  needed or added. Good.
- **Forms:** label association is programmatic (via `htmlFor` + wrapping label). This is
  a single control; error/required wiring is handled upstream by FieldShell when the
  checkbox is used inside a goobs `<Form>` (out of this component's scope).
- **Motion:** `@media (prefers-reduced-motion: reduce)` already present
  (`Checkbox.module.css`) and now also covers the focus outline's fade (the box's `all`
  transition is zeroed there). Good — WCAG 2.3.3 satisfied.

## SEO semantics

Checkbox is a form control, not a heading/landmark/link/list/table, so the SEO-semantic
checklist items (real `<h1-6>`, landmarks, `<a href>`, lists/tables) do not apply. The
control renders as a real `<input>`/`<label>` in SSR HTML (no client-only injection of
primary content). **No issues.**

## Fixes applied

1. **Keyboard focus ring (Issue 1)** — added a `FOCUS-VISIBLE` section to
   `Checkbox.module.css`: `.input:focus-visible ~ .box` gets `outline: 2px solid` +
   `outline-offset: 2px`, using the solid, high-contrast theme primaries
   (`--goobs-light-primary` #2563eb / `--goobs-dark-primary` #60a5fa / `--goobs-gold`
   #ffd700) via per-theme overrides. `:focus-visible` (not `:focus`) shows the ring for
   keyboard users only; `outline` (not `box-shadow`) avoids colliding with the box's
   state-dependent `box-shadow`. Covered by the existing `prefers-reduced-motion` block.
2. **Decorative graphics hidden (Issue 2)** — added `aria-hidden="true"` to both the
   `.box` and `.icon` presentational `<div>`s in `index.tsx`. Purely additive; every
   existing `data-*` test selector is preserved (aria-hidden does not affect
   attribute/CSS locators, only the a11y tree).

No public API change: no prop renamed/removed/retyped, no export changed, no rendered
DOM element swapped. All changes are additive CSS + additive attributes.

## Stories updated

Added three `play`-backed stories to `Checkbox.stories.tsx` (new
`Accessibility Stories` section), matching the repo's `storybook/test` +
`within`/`userEvent`/`expect` convention:

- **`A11y/Accessible Name`** — renders with a visible label and asserts the checkbox
  resolves by its exact accessible name (proving the now-`aria-hidden` icon does not
  leak into the name).
- **`A11y/Keyboard Focus Ring`** — `userEvent.tab()`s to the control (keyboard nav is
  what activates `:focus-visible`) so the new focus ring renders in the Chromatic
  snapshot, then asserts `toHaveFocus()`.
- **`A11y/Indeterminate Announced`** — asserts `aria-checked="mixed"` on the
  indeterminate control.

Gates run per-file and passing: `bun lint:file` (index.tsx + stories, exit 0),
`stylelint` on `Checkbox.module.css` (exit 0).

## Deferred

- **Issue 3 — accessible name when neither `children` nor `aria-label` is supplied.**
  When a consumer renders `<Checkbox name="foo" />` with no `children` and no
  `aria-label`/`aria-labelledby`, the control has no accessible name. This is **not
  fixable inside the component** — there is no text to derive a name from, and the
  library must not invent one. The component already forwards any `aria-label` /
  `aria-labelledby` the consumer passes (via `...rest` onto the `<input>`), so the
  correct name source is available. Documented as consumer responsibility;
  accessible-by-default is met whenever a label/children is provided (the common case,
  including all AutoFields usage which passes `children`). No code change.

**No cross-file (unowned) fixes were required** — both root-cause fixes lived inside the
Checkbox directory. The decorative SVGs in `src/components/Icons/Check.tsx` /
`IndeterminateCheckBox.tsx` could *additionally* carry `aria-hidden` at their own level,
but hiding them at the `.icon` wrapper (owned) fully resolves the issue for this
component, so no unowned edit is needed.
