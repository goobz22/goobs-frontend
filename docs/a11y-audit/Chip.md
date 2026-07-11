# Chip — a11y audit (2026-07-11)

**Status:** FIXED (initial pass) + adversarial-review fixes applied — see
"Adversarial-review fixes" below. One finding (focus-ring token contrast) is a
shared `src/styles/global.css` palette token and is **deferred** (out of the
Chip directory's ownership), with a precise recommendation recorded.

**Component:** `src/components/Chip/index.tsx` (+ `Chip.module.css`, `Chip.stories.tsx`)

## APG pattern

The interactive chip (`onClick` set) is the **WAI-ARIA Button pattern**
(`role="button"`, tab stop, Enter/Space activation, `aria-pressed` for the
toggle-filter use-case). It is rendered as a focusable `div[role="button"]`
rather than a native `<button>` **on purpose**: a deletable chip nests a real
`<button>` (the `×` delete control), and a native `<button>` cannot contain
another `<button>` (invalid HTML). The div-button already implements the full
keyboard contract (`handleKeyDown` → Enter/Space with `preventDefault`,
`index.tsx:272-278`), so this is a legitimate pattern, not a defect — provided
the focus indicator exists (fixed below).

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

### R3. Focus-ring indicator contrast (light theme) — MINOR (DEFERRED — shared token)
- **WCAG:** 1.4.11 Non-text Contrast / 2.4.11 Focus Appearance (AA)
- **Where:** the chip focus ring resolves through `--chip-focus`, which for the
  light theme points at `--goobs-light-focus-ring = rgba(59, 130, 246, 0.4)`
  (`src/styles/global.css:305`). Composited over a white / near-white surface
  that outline is ~1.6–1.8:1 — below the 3:1 non-text-contrast bar. The dark
  token `--goobs-dark-focus-ring = rgba(96, 165, 250, 0.45)`
  (`src/styles/global.css:336`) is also marginal (~2.3:1 on dark surfaces). The
  sacred token (`--goobs-sacred-focus-ring = gold-a60`) is ~5.6:1 and passes.
- **Disposition:** DEFERRED. These are **shared design-system tokens** consumed
  by Card / ListItemCard / Chip and others, and `src/styles/global.css` is
  outside this component's ownership. Fixing the token centrally corrects every
  component's focus ring at once and preserves the intentional cross-component
  focus-ring consistency the initial pass established; a Chip-local override
  would fix only Chip while diverging its focus indicator from every sibling, so
  it was **not** applied. See "Deferred" below for the precise recommendation.
- **Pattern:** `focus-ring-contrast-below-3to1`

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
  `aria-live` (pill), `aria-disabled` — all now exposed, including the disabled
  interactive case (issue 3).
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

## Deferred

**Focus-ring token contrast (finding R3)** — `src/styles/global.css` (NOT owned
by this component).

- `src/styles/global.css:305` — `--goobs-light-focus-ring: rgba(59, 130, 246, 0.4);`
  reads ~1.6–1.8:1 as a focus outline over white / near-white → fails
  WCAG 1.4.11 / 2.4.11 (needs ≥3:1). **Suggested:** raise to an opaque,
  high-contrast blue, e.g. `#2563eb` (`--goobs-light-primary`, ~5.2:1 on white)
  or `#1d4ed8` (`--goobs-light-primary-strong`, ~6.7:1).
- `src/styles/global.css:336` — `--goobs-dark-focus-ring: rgba(96, 165, 250, 0.45);`
  is also marginal (~2.3:1 on the dark surfaces). **Suggested:** raise to an
  opaque/lighter blue meeting ≥3:1 on `#1e293b`/`#111827` (e.g. `#93c5fd`).
- No change needed for `--goobs-sacred-focus-ring` (gold-a60, ~5.6:1).

These are shared tokens consumed by Card / ListItemCard / Chip; fixing them in
`global.css` corrects every consumer at once. Once fixed, Chip's `--chip-focus`
already tracks the token per-theme, so no Chip change is needed to inherit it.
A Chip-local override was deliberately NOT applied to preserve cross-component
focus-ring consistency (the reviewer's own framing: "a cross-cutting palette
question, not a Chip-local defect").

Note (not a defect, no change needed): `resolveAriaLabel` returns `undefined`
for a ReactNode `label` with no `ariaLabel`. Enforcing an accessible name for
icon-only/ReactNode chips is a documented consumer responsibility; a
type-level `ariaLabel`-required-for-ReactNode constraint is not expressible
without breaking the public additive-only API, so it stays documented rather
than enforced.
