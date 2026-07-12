# ToggleButton — a11y audit (2026-07-11)

**Status: FIXED**

## APG pattern

- **`ToggleButton`** — WAI-ARIA APG **Button pattern (toggle button)**: a native
  `<button>` carrying `aria-pressed` to expose its on/off state. Correct base
  semantics were already present (`<button aria-pressed={selected}>`, `disabled`,
  optional `aria-label`).
- **`ToggleButtonGroup`** — a **segmented group of toggle buttons**. Correct APG
  treatment is a labelled `role="group"` container (matching the sibling
  `Button`/`ButtonGroup` convention), NOT a radiogroup/toolbar — so the existing
  native-button + `aria-pressed` child semantics and the machine-test selector
  contract (`data-component`, `data-field-name`, `data-filled`, `data-value`,
  `aria-pressed`, `data-selected`) are preserved unchanged. Tab moves between the
  buttons (no arrow-key model is required for a plain button group).

## Issues found

### 1. No keyboard focus indicator — SERIOUS (WCAG 2.4.7 Focus Visible, 2.4.11) — FIXED
`ToggleButton.module.css:41` set `outline: none` on `.button` with **no**
`:focus-visible` replacement anywhere in the module. Keyboard/AT users had zero
visible focus indication on any toggle button, in any theme.
`pattern: missing-focus-visible-style`

**Fix:** added a `:focus-visible` ring mirroring the `Button` component — solid
per-theme outline (`--goobs-light-primary` / `--goobs-dark-primary` / `--goobs-gold`,
`outline-offset: 2px`) that only paints for keyboard focus. Grouped buttons get
`outline-offset: -2px; z-index: 1` (via `.group .button:focus-visible`) because the
`.group` wrapper is `overflow: hidden` and would otherwise clip an outset ring.
(`ToggleButton.module.css` new KEYBOARD FOCUS section.)

### 2. Group had no grouping semantics or accessible name — SERIOUS (WCAG 1.3.1 Info & Relationships, 4.1.2 Name/Role/Value) — FIXED
`ToggleButtonGroup` rendered a bare `<div>` (`index.tsx:233`) — assistive tech had
no way to know the toggle buttons form one related set, and there was no way to name
the set (no label prop existed). `pattern: missing-accessible-name`

**Fix:** added additive, API-safe `'aria-label'` / `'aria-labelledby'` props
(identical shape to `ButtonGroup`), wired onto the container. `role="group"` is
**gated on an accessible name** (`hasAccessibleName = Boolean(ariaLabel ||
ariaLabelledby)`) — the container emits `role="group"` ONLY when a name is
supplied; an unlabelled group stays a plain `<div>` so assistive tech never
gets a contextless nameless "group" announcement. This mirrors the sibling
`ButtonGroup` gate (`Button/index.tsx:91-97`) exactly. Every existing
prop/attribute (`data-component`, `data-field-name`, `data-filled`,
`data-theme`) is untouched, so it is a purely additive change. (`index.tsx`
group interface + destructure + `hasAccessibleName` gate + container element.)

**Review follow-up (2026-07-11):** the initial fix emitted `role="group"`
UNCONDITIONALLY, which diverged from the `ButtonGroup` convention it claimed to
mirror and would have exposed a nameless `role="group"` to every existing
callsite (the name prop is new, so none pass one). Gated it identically and
added the guarding `UnnamedGroupHasNoRole` story.

### 3. No reduced-motion handling — MINOR (WCAG 2.3.3 Animation from Interactions) — FIXED
`.button` animates via `transition: var(--goobs-transition-medium)` (`:50`) and the
sacred pressed state applies `transform: translateY(1px)` (`:184`); no
`prefers-reduced-motion` media query suppressed them. `pattern: missing-reduced-motion`

**Fix:** added `@media (prefers-reduced-motion: reduce)` that zeroes the transition
and the sacred active transform (state changes still apply, just instantly).
(`ToggleButton.module.css` new REDUCED MOTION section.)

## Hearing

No audio/media APIs used (`new Audio`, `AudioContext`, `<audio>`, `<video>`,
`navigator.vibrate` all absent). Selected/disabled state is conveyed programmatically
(`aria-pressed`, native `disabled`) and visually — never audio-only. No hearing-axis
issue. **CLEAN.**

## Reading & screen reader

- Accessible name: single `ToggleButton` already supports `aria-label`; the group now
  supports `aria-label`/`aria-labelledby` (fix #2). Children provide the name for
  text/emoji buttons.
- Semantic HTML: native `<button>` throughout (not role-annotated divs). Group is now
  a labelled `role="group"` (fix #2).
- State: `aria-pressed` (toggle state) + native `disabled` are programmatic — state is
  not colour-only, satisfying WCAG 1.4.1 (`aria-pressed="false"` is the correct,
  expected value here, distinct from the forbidden `aria-disabled="false"`).
- Focus: visible `:focus-visible` ring added (fix #1). No overlay/dialog, so no
  focus-trap/Escape requirements apply.
- Keyboard: native buttons are Tab-reachable and Enter/Space-operable; a plain toggle
  button group needs no arrow-key model. No gap.

## SEO semantics

Component SSRs real `<button>` elements with visible text children (crawlable, present
in server HTML — no client-only content injection). The group is now a semantic
labelled `role="group"`. No heading/landmark/link/table responsibilities apply to this
component, so no `headingLevel`/`linkComponent`-style additions are warranted. **CLEAN.**

## Fixes applied

1. `ToggleButton.module.css` — added `:focus-visible` ring (base + dark + sacred + inset
   grouped variant) restoring a keyboard focus indicator (WCAG 2.4.7).
2. `ToggleButton.module.css` — added `@media (prefers-reduced-motion: reduce)` block
   (WCAG 2.3.3).
3. `index.tsx` — added `role="group"` + additive `aria-label`/`aria-labelledby` props on
   `ToggleButtonGroup` (WCAG 1.3.1 / 4.1.2).

## Stories updated

Added to `ToggleButton.stories.tsx` (Storybook stories are this repo's only regression
tests; each new state is keyboard-driven so it actually renders for the Chromatic
baseline):

- `A11y/Focus Ring (Light, Keyboard)` — `userEvent.tab()` drives the light `:focus-visible`
  ring; asserts focus + `aria-pressed="false"`.
- `A11y/Focus Ring (Dark, Keyboard)` — gates the `[data-theme='dark']:focus-visible`
  override.
- `A11y/Focus Ring (Sacred, Keyboard)` — gates the `[data-theme='sacred']:focus-visible`
  gold override.
- `A11y/Labelled Group + Grouped Focus` — asserts the group is queryable by
  `getByRole('group', { name: 'Text alignment' })`, tabs onto the first grouped button
  (drives the inset ring), and asserts the selected member's `aria-pressed="true"`.
- `A11y/Unnamed Group Has No Role` (added 2026-07-11) — renders a group with NO
  `aria-label`/`aria-labelledby` and asserts `queryByRole('group')` is `null` while both
  member buttons stay individually reachable. Guards the `hasAccessibleName` gate — reverting
  it (unconditional `role="group"`) makes `queryByRole('group')` resolve and fails this story.
- `A11y/Reduced Motion Zeroes Transition` (added 2026-07-11) — reads `document.styleSheets`,
  finds the `@media (prefers-reduced-motion: reduce)` block, and asserts it zeroes `transition`
  on the button class and `transform` on the sacred `:active` rule. Guards fix #3 — removing or
  un-zeroing the reduced-motion block fails this story. Mirrors `Button`'s equivalent.

## Deferred

None. All findings were fixable inside the component directory. No shared-file
(`Field/Shell`, `global.css`, barrel) changes were required — the focus tokens
(`--goobs-light-primary`, `--goobs-dark-primary`, `--goobs-gold`) already exist in
`src/styles/global.css`.
