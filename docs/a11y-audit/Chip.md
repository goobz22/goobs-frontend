# Chip — a11y audit (2026-07-11)

**Status:** FIXED (initial pass) + two rounds of adversarial-review fixes
applied — see "Adversarial-review fixes" and "Adversarial-review round 2"
below. All findings are now resolved in-component. The focus-ring contrast gap
(previously deferred to `src/styles/global.css`) is now fixed with a Chip-local
`--chip-focus` override (in-scope, in `Chip.module.css`); a matching upstream
token recommendation is still recorded in "Deferred" so the shared tokens can be
raised for the other consumers too.

**Component:** `src/components/Chip/index.tsx` (+ `Chip.module.css`, `Chip.stories.tsx`)

## APG pattern

The interactive chip (`onClick` set) is the **WAI-ARIA Button pattern**
(`role="button"`, tab stop, Enter/Space activation, `aria-pressed` for the
toggle-filter use-case). There are two structural cases (see R4):

- **Clickable only** (`onClick`, no `onDelete`): rendered as a focusable
  `div[role="button"]` (the root). A native `<button>` root is not used because
  the `ref` type is `HTMLDivElement` and consumers/stories rely on the root
  being the button. The div-button implements the full keyboard contract
  (`handleKeyDown` → Enter/Space with `preventDefault`), so it is a legitimate
  pattern — provided the focus indicator exists (fixed).
- **Clickable AND deletable** (`onClick` + `onDelete`): rendered as a
  `role="group"` root holding two sibling native `<button>`s — the primary
  action (`aria-pressed`) and the delete control. This avoids nesting the
  focusable delete `<button>` inside a `role="button"` (an ARIA
  presentational-children conflict — R4), which the earlier div-button rationale
  had introduced. Native buttons give Enter/Space activation for free.

The read-only pill (`variant="pill"`, no `onClick`) resolves to `role="status"`,
a live-region status indicator with optional `aria-live` politeness — the
intended replacement for the deleted StatusPill/StatusBadge. That default is
part of the machine-test selector contract (`getAllByRole('status')` in the
PillTones story) and was left unchanged.

## Issues found

### 1. No visible keyboard focus indicator — SERIOUS
- **WCAG:** 2.4.7 Focus Visible (AA), 2.4.11 Focus Appearance (AA, 2.2)
- **Where:** `Chip.module.css` (entire file — no `:focus-visible` rule existed);
  affects the focusable interactive root (`index.tsx:311` `tabIndex={0}`) and the
  delete `<button>` (`index.tsx:336`).
- **Detail:** An interactive chip is keyboard-focusable and a deletable chip
  carries a focusable button, but the module defined no `:focus-visible`
  treatment. Keyboard/switch users had no reliable indication of which chip (or
  the delete control) held focus — especially where a host app resets the UA
  default outline.
- **Pattern:** `missing-focus-visible-style`
- **Status:** FIXED — added a per-theme `--chip-focus` token
  (`--goobs-{sacred,light,dark}-focus-ring`) and a
  `.root[data-chip-clickable='true']:focus-visible, .closeButton:focus-visible`
  rule (`outline: 2px solid var(--chip-focus); outline-offset: 2px`), matching
  the ListItemCard/Card focus convention.

### 2. Transitions ignore prefers-reduced-motion — MODERATE
- **WCAG:** 2.3.3 Animation from Interactions (AAA)
- **Where:** `Chip.module.css` — `.root` transition (`background-color`,
  `border-color`, `box-shadow`, `color` at 180ms) and `.closeButton` transition
  (`background-color`, `opacity`).
- **Detail:** No `@media (prefers-reduced-motion: reduce)` block existed, so
  hover/active/focus color+shadow transitions animated even for users who opt out
  of motion. Sibling components (Checkbox, ListItemCard) already honor the
  preference.
- **Pattern:** `missing-reduced-motion`
- **Status:** FIXED — added `@media (prefers-reduced-motion: reduce) { .root,
  .closeButton { transition: none } }`.

### 3. Disabled interactive chip drops its button role — MINOR
- **WCAG:** 4.1.2 Name, Role, Value (A)
- **Where:** `index.tsx` — `resolveRole` was gated on `isClickable`
  (`onClick && !disabled`), so a disabled chip that carries `onClick` rendered as
  a bare `<div>` with only `aria-label` + `aria-disabled` and no role.
- **Detail:** `aria-disabled` on an element with no interactive role is not
  reliably announced, so a screen-reader user was told the label text but not
  that this was a *disabled/unavailable button*. The visual disabled state
  (opacity 0.5) had no programmatic equivalent for the button semantics.
- **Pattern:** `role-not-exposed-when-disabled`
- **Status:** FIXED — added `hasButtonIntent = Boolean(onClick)` and drive the
  role + `aria-pressed` off it, so an `onClick` chip keeps `role="button"` even
  while disabled (announced as a dimmed button via `aria-disabled="true"`).
  Activation and focusability stay gated on `isClickable` (handlers inert,
  removed from the tab order — matching native `<button disabled>`).

### 4. Delete-button glyph not marked decorative — MINOR
- **WCAG:** 1.1.1 Non-text Content (A), 4.1.2
- **Where:** `index.tsx:347` — `<CloseIcon>` rendered inside the delete
  `<button aria-label="Remove …">` with no `aria-hidden`.
- **Detail:** The button already has a correct accessible name; the inner SVG
  glyph is purely decorative. Some AT announce a nameless `<svg>` as a stray
  graphic. (The chip's leading `icon`/`dot` spans were already `aria-hidden` —
  only the close glyph was missed.)
- **Pattern:** `icon-missing-aria-hidden`
- **Status:** FIXED — pass `aria-hidden="true"` to `<CloseIcon>` (forwarded onto
  the SVG via its `React.SVGProps` spread).

## Adversarial-review fixes (2026-07-11)

A second, adversarial review of the initial pass surfaced three further items.

### R1. WCAG 2.5.8 Target Size (Minimum) never assessed — MINOR (FIXED)
- **WCAG:** 2.5.8 Target Size (Minimum) (AA, WCAG 2.2)
- **Where:** `Chip.module.css` — the delete `.closeButton` rendered at ~16px
  (2px padding + a 0.9em glyph of the 13px chip font), and the `.pill` root was
  `min-height: 22px`. Both below the 24×24 CSS-px floor; for a chip that is BOTH
  clickable (`data-chip-clickable`) and deletable the two undersized targets sit
  adjacent and would not clear the undersized-target spacing exception.
- **Fix:**
  1. `.closeButton::before` — a transparent, absolutely-positioned, centered
     24×24 pseudo-element extends the delete control's *pointer target* to the
     minimum WITHOUT enlarging the visible glyph or stretching the row. A real
     `min-height:24px` on the button was rejected because it grows the 32px chip
     to 36px (24 + 10px padding + 2px border). This covers the delete target in
     **both** variants.
  2. `.pill[data-chip-clickable='true'] { min-height: 24px }` — a *clickable*
     pill is a pointer target, so it is bumped to 24px; the read-only status
     pill stays compact at 22px (it is not a target, so 2.5.8 does not apply).
     The default `.chip` root is already 32px (`--goobs-control-height`).
  With this, both the delete target and the clickable-chip/pill roots are ≥24px,
  so the clickable+deletable combination no longer relies on the spacing
  exception.
- **Pattern:** `target-size-below-minimum`
- **Coverage:** the `Deletable` story play now asserts the delete control's
  `::before` hit area is ≥24×24; the new `Variants/Interactive Pill` story
  asserts a clickable pill's rendered height is ≥24px.

### R2. New a11y fixes lacked regression coverage — MINOR (FIXED)
- **Where:** `Chip.stories.tsx` — the initial pass added `Interactive` /
  `DisabledInteractive` (covering issues 1 & 3) but left issue 2
  (prefers-reduced-motion) and issue 4 (close-glyph `aria-hidden`) unpinned in
  the repo's only test layer (Storybook play / Chromatic).
- **Fix:**
  - `Deletable` gained a play function asserting the delete glyph `<svg>` carries
    `aria-hidden="true"` (pins issue 4) and the 24×24 hit area (R1).
  - New `A11y/Reduced Motion` story: since a play function cannot force the OS
    preference, it introspects the CSSOM and asserts a
    `@media (prefers-reduced-motion: reduce)` rule targeting the chip root with
    `transition: none` exists — deleting the `@media` block fails the assertion
    (pins issue 2).
- **Pattern:** `a11y-fix-without-regression-test`

### R3. Focus-ring indicator contrast (light + dark themes) — MODERATE (FIXED — round 2)
- **WCAG:** 1.4.11 Non-text Contrast / 2.4.11 Focus Appearance (AA, WCAG 2.2)
- **Where:** the chip focus ring resolves through `--chip-focus`, which for the
  light theme pointed at `--goobs-light-focus-ring = rgba(59, 130, 246, 0.4)`
  (`src/styles/global.css:305`). Composited over a white / near-white surface
  that outline is ~1.7:1 — below the 3:1 non-text-contrast bar. The dark
  token `--goobs-dark-focus-ring = rgba(96, 165, 250, 0.45)`
  (`src/styles/global.css:336`) was also below threshold (~2.3:1 on dark
  surfaces). The sacred token (`--goobs-sacred-focus-ring = gold-a60`) is ~5.6:1
  and passes.
- **Initial disposition (round 1):** DEFERRED to the shared tokens for
  cross-component consistency. **Superseded:** the deferral was wrong to leave
  the ring shipping below AA in 2/3 themes when the override is in-scope. The
  `--chip-focus` custom property is declared and overridden *inside*
  `Chip.module.css` (`:root` light block, `:root` dark block), so a per-theme
  override is squarely within the component's ownership — deferring an
  in-scope AA gap to a token that "someone should raise later" left the ring
  non-conformant now.
- **Fix (round 2):** override `--chip-focus` per theme with opaque,
  high-contrast blues that already exist as role tokens:
  - light → `--goobs-light-primary-strong` (`#1d4ed8` ≈ 6.7:1 on white; it is
    already the light chip's `--chip-text`, so the ring stays palette-cohesive).
  - dark → `--goobs-dark-primary` (`#60a5fa` ≈ 5.8–7:1 on `#1e293b` / `#111827`).
  - sacred unchanged (gold-a60 already passes).
  These replace the two `--chip-focus: var(--goobs-*-focus-ring)` lines in the
  light/dark theme blocks. The upstream token fix is still recommended (see
  "Deferred") for Card / ListItemCard etc., but Chip no longer waits on it.
- **Pattern:** `focus-ring-contrast-below-3to1`
- **Coverage:** new `A11y/Focus Ring Contrast` story resolves the effective
  `--chip-focus` color per theme (via an inheriting probe element) and asserts
  it is opaque AND clears 3:1 against the theme surface — a revert to the
  translucent shared token fails the assertion.

## Adversarial-review round 2 (2026-07-11)

A third review surfaced two structural issues plus the R3 upgrade above.

### R4. Focusable delete `<button>` nested inside `role="button"` — MODERATE (FIXED)
- **WCAG:** 4.1.2 Name, Role, Value (A); ARIA 1.2 presentational-children /
  APG author guidance.
- **Where:** `index.tsx` — when a chip has BOTH `onClick` and `onDelete` (a
  combination reachable through the public API), the old markup was
  `<div role="button" tabindex=0 aria-label>…<button>×</button></div>`. `role="button"`
  makes its subtree presentational; a focusable/interactive descendant inside it
  is discouraged and yields inconsistent AT announcement of the delete control.
  The initial pass justified the div-button *specifically* by needing to nest
  the delete `<button>` — but never evaluated the a11y cost of that nesting, and
  no story exercised the `onClick`+`onDelete` combination.
- **Root cause:** the button semantics were placed on the *root* even when the
  chip is a composite of two controls.
- **Fix:** introduce a `role="group"` for the clickable+deletable case. The root
  becomes a named `role="group"`; the primary action moves onto a real inner
  `<button class="actionButton">` that is a **sibling** of the delete `<button>`
  (never nested), so there is no interactive-descendant-in-`role="button"`
  conflict. Native `<button>` semantics give Enter/Space activation for free
  (no keydown shim), carry `aria-pressed` for the toggle state, and use native
  `disabled` for the out-of-tab-order/inert behaviour. The **clickable-only**
  chip is unchanged (root stays `role="button"` — the documented ref/`getByRole`
  contract and the `Interactive`/`InteractivePill` stories rely on it); the
  restructure fires **only** for the composite case. `ref` still lands on the
  root `<div>` (type unchanged); `getByRole('button', { name })` now resolves to
  the inner action button; `data-*` selectors stay on the root.
  - New CSS: `.actionButton` (UA-button reset inheriting the chip box) +
    `.actionButton:focus-visible` added to the shared focus-ring rule so the
    composite's primary action has a visible keyboard focus indicator.
  - **Markup change (noted per convention):** clickable+deletable chip root
    `role` changes `button → group`; a new inner `<button data-chip-action>`
    wraps the label. No prop/export changed (additive-only preserved).
  - **Edge case:** if a caller passes an explicit `role` prop AND `onClick`+`onDelete`,
    the explicit role still wins (public-API contract), so they own that
    semantics; the default (no explicit role) yields the correct `group`.
- **Pattern:** `interactive-descendant-in-presentational-role`
- **Coverage:** new `State/Clickable + Deletable` story asserts the root is
  `role="group"`, the action + delete controls are real sibling `<button>`s
  (neither nested in the other, both direct children of the root), each fires
  only its own handler, and the action activates on Enter.

### R5. `aria-label` emitted on a generic (roleless) chip — MINOR (FIXED)
- **WCAG:** 4.1.2; ARIA 1.2 (`aria-label` prohibited on the generic role).
- **Where:** `index.tsx` — for `variant="chip"` with no `onClick` / `onDelete`
  / explicit role, `resolveRole` returns `undefined` (generic `<div>`) but the
  root still received `aria-label` (the string label, or an explicit `ariaLabel`
  for a ReactNode label). For a string label it was a harmless duplicate of the
  visible text; for a ReactNode label with an explicit `ariaLabel` the intended
  accessible name landed on a generic element and may not be announced.
  In-repo this affected the plain label chips in `DataGrid/Table/Rows` and
  `BigCalendar/CalendarFilters` (redundant `aria-label`) and the deletable
  chips in `MultiSelect` (a generic wrapper with an `aria-label`).
- **Fix:** gate the root `aria-label` on the resolved role supporting a name
  (`rootAriaLabel = resolvedRole !== undefined ? resolvedAriaLabel : undefined`),
  and give an explicitly-named otherwise-roleless chip a name-bearing role:
  - purely decorative + explicit `ariaLabel` → `role="img"` (a single named
    token; safe because there are no interactive descendants for `img`'s
    presentational children to hide).
  - deletable-only + explicit `ariaLabel` → `role="group"` (keeps the real
    delete `<button>` in the a11y tree, which `img` would hide).
  - unnamed decorative chip → stays roleless with NO `aria-label`; its visible
    text is the accessible name.
  The delete button's own `aria-label` ("Remove …") is unaffected (it is a real
  `<button>`, which supports naming).
- **Pattern:** `aria-label-on-generic-role`
- **Coverage:** new `A11y/Decorative Labeling` story asserts a plain decorative
  chip has neither `role` nor `aria-label`, and an explicitly-named decorative
  chip exposes `role="img"` + the `aria-label`.

## Hearing

No sound/media APIs are used (`grep` for `Audio`/`AudioContext`/`<audio>`/
`<video>`/`navigator.vibrate` in the component is empty). All state — active,
disabled, tone/status — is conveyed visually AND programmatically
(`data-chip-active`, `aria-pressed`, `aria-disabled`, `role="status"` +
optional `aria-live`), never by sound. No hearing-related issue. WCAG
1.2.x / 1.4.2 not applicable.

## Reading & screen reader

- **Accessible name:** interactive chips get their name from `ariaLabel` →
  string `label` fallback (`resolveAriaLabel`, `index.tsx:212-220`); the delete
  button composes `"Remove <label>"` (`index.tsx:285-287`). ReactNode labels
  without an explicit `ariaLabel` are a documented caller responsibility
  (`ChipProps.label` / `ariaLabel` JSDoc, `index.tsx:74-91`) — left as-is (TS
  can't enforce it and adding a runtime warning is out of scope for a
  presentational library primitive).
- **Roles/states:** button role + `aria-pressed` (toggle), `role="status"` +
  `aria-live` (pill), `aria-disabled` — all exposed, including the disabled
  interactive case (issue 3). A clickable+deletable chip is a `role="group"` of
  two sibling buttons rather than a `role="button"` wrapping the delete button
  (R4). `aria-label` is only ever placed on a role that supports a name — a
  roleless decorative chip carries none, and an explicitly-named decorative /
  deletable chip is promoted to `role="img"` / `role="group"` (R5).
- **Keyboard:** Enter/Space activation with `preventDefault` already present;
  now backed by a visible focus ring (issue 1) and pinned by the new
  `Interactive` story play function.
- **Decorative graphics:** leading `icon`/`dot` and the close glyph are all
  `aria-hidden` (issue 4).
- **Color-alone (1.4.1):** tone/status is always accompanied by the text label
  (e.g. "Paid", "Overdue") and the programmatic `data-chip-tone` / `role`
  attributes — never color-only. No fix needed.
- **No overlay/dialog surface** — no focus-trap/Escape concerns.

## SEO semantics

Chip is a compact inline label/token, not a heading, landmark, link, or list —
so no heading-level, `<nav>`, `<a href>`, or `<ul>` obligations apply. The
delete control is a real semantic `<button type="button">` (not an onClick div).
The label text renders directly in the SSR'd markup (no client-only injection).
No SEO-semantic issue.

## Fixes applied

1. `Chip.module.css` — per-theme `--chip-focus` token + `:focus-visible` outline
   on the interactive root and the delete button (issue 1).
2. `Chip.module.css` — `@media (prefers-reduced-motion: reduce)` zeroing
   transitions on `.root` and `.closeButton` (issue 2).
3. `index.tsx` — `hasButtonIntent` drives `role`/`aria-pressed` so a disabled
   `onClick` chip keeps `role="button"` + `aria-disabled` (issue 3).
4. `index.tsx` — `aria-hidden="true"` on the delete-button `<CloseIcon>`
   (issue 4).

All in commit `4b63040c`. Per-file gates green: `bun lint:file` on both `.tsx`
files (0 warnings), `stylelint` on the module (exit 0).

Adversarial-review round 2 (`63009e2b`):

5. `Chip.module.css` — per-theme `--chip-focus` override: light →
   `--goobs-light-primary-strong`, dark → `--goobs-dark-primary` (opaque,
   ≥3:1) so the keyboard focus ring passes WCAG 2.4.11 / 1.4.11 in every theme
   (R3).
6. `index.tsx` + `Chip.module.css` — a clickable+deletable chip renders as a
   `role="group"` with an inner `.actionButton` sibling to the delete
   `<button>`, removing the interactive-descendant-in-`role="button"` conflict;
   `.actionButton:focus-visible` gives it a visible focus ring (R4).
7. `index.tsx` — `aria-label` is gated on a name-bearing role; an
   explicitly-named otherwise-roleless chip is promoted to `role="img"`
   (decorative) or `role="group"` (deletable), never `aria-label` on a generic
   element (R5).

Round-2 gates: scoped `tsc --noEmit` over `index.tsx` + `Chip.stories.tsx`
(exit 0), `bun lint:file` on both `.tsx` files (0 warnings).

## Stories updated

`Chip.stories.tsx` (the only regression tests in this repo — goobs has no unit
tests):

- **`Interactive` (State/Interactive (button))** — new. A clickable chip;
  play function asserts `role="button"`, `tabindex="0"`, `aria-pressed="false"`,
  keyboard focus (`toHaveFocus`), and that Enter + Space + pointer click each
  fire `onClick` (3 activations). Pins the button/keyboard/focus a11y contract
  that previously had **zero** story coverage.
- **`DisabledInteractive` (State/Disabled (interactive))** — new. A disabled
  `onClick` chip; play function asserts `role="button"` is still exposed with
  `aria-disabled="true"`, no `tabindex` (out of tab order), and that clicking
  does not fire `onClick`. Pins issue 3.

Added in the adversarial-review pass (2026-07-11):

- **`Deletable`** — extended with a play function pinning the delete-button
  accessible name (`"Remove Deletable Chip"`), the close-glyph
  `aria-hidden="true"` (issue 4), and the ≥24×24 `::before` target size (R1).
- **`ReducedMotion` (A11y/Reduced Motion)** — new. Asserts the
  `@media (prefers-reduced-motion: reduce)` rule zeroing the chip's transitions
  exists in the CSSOM (issue 2 regression pin).
- **`InteractivePill` (Variants/Interactive Pill)** — new. A clickable pill;
  play function asserts `role="button"`, `data-chip-clickable="true"`, and a
  ≥24px rendered target height (R1 pill-root).

Added in adversarial-review round 2 (2026-07-11):

- **`ClickableDeletable` (State/Clickable + Deletable)** — new. Exercises the
  previously-untested `onClick`+`onDelete` combination; asserts the root is
  `role="group"`, the action + delete controls are real sibling `<button>`s
  (neither nested in the other, both direct children of the root), each fires
  only its own handler, and the action activates on Enter (R4).
- **`DecorativeLabeling` (A11y/Decorative Labeling)** — new. Asserts a plain
  decorative chip has neither `role` nor `aria-label`, and an explicitly-named
  decorative chip exposes `role="img"` + the `aria-label` (R5).
- **`FocusRingContrast` (A11y/Focus Ring Contrast)** — new. Resolves the
  effective `--chip-focus` color per theme via an inheriting probe element and
  asserts it is opaque and clears 3:1 against the theme surface (R3).

## Deferred

**Focus-ring token contrast — upstream token improvement (NOT blocking; Chip is
already fixed locally).** Chip's own focus ring now passes AA via the Chip-local
`--chip-focus` override (finding R3, FIXED). The **shared** tokens in
`src/styles/global.css` are still below threshold and used by other components
(Card / ListItemCard / …), so raising them upstream would fix those consumers
too and let Chip's override eventually collapse back onto the shared token. That
file is outside this component's ownership, so the concrete recommendation is
recorded here for whoever owns `src/styles/global.css`:

- `src/styles/global.css:305` — `--goobs-light-focus-ring: rgba(59, 130, 246, 0.4);`
  reads ~1.7:1 as a focus outline over white / near-white → fails
  WCAG 1.4.11 / 2.4.11 (needs ≥3:1). **Suggested:** raise to an opaque,
  high-contrast blue, e.g. `#2563eb` (`--goobs-light-primary`, ~5.2:1 on white)
  or `#1d4ed8` (`--goobs-light-primary-strong`, ~6.7:1).
- `src/styles/global.css:336` — `--goobs-dark-focus-ring: rgba(96, 165, 250, 0.45);`
  is also marginal (~2.3:1 on the dark surfaces). **Suggested:** raise to an
  opaque/lighter blue meeting ≥3:1 on `#1e293b`/`#111827` (e.g. `#60a5fa`
  = `--goobs-dark-primary`, or `#93c5fd`).
- No change needed for `--goobs-sacred-focus-ring` (gold-a60, ~5.6:1).

Once the shared tokens meet ≥3:1, the two Chip-local `--chip-focus` overrides in
`Chip.module.css` (light/dark) can be reverted to inherit the shared token again
with no loss of contrast — but they are correct to keep until then.

Note (not a defect, no change needed): `resolveAriaLabel` returns `undefined`
for a ReactNode `label` with no `ariaLabel`. Enforcing an accessible name for
icon-only/ReactNode chips is a documented consumer responsibility; a
type-level `ariaLabel`-required-for-ReactNode constraint is not expressible
without breaking the public additive-only API, so it stays documented rather
than enforced.
