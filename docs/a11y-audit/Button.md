# Button — a11y audit (2026-07-11)

**Status:** FIXED

**APG pattern:** [Button](https://www.w3.org/WAI/ARIA/apg/patterns/button/) — built on a
real native `<button>` (`index.tsx:635`), the preferred "semantic HTML first"
implementation (no `role="button"` div). Two sub-patterns are also in play:

- **[Toggle Button](https://www.w3.org/WAI/ARIA/apg/patterns/button/#toggle-buttons)** — a
  `Button` with the `selected` prop (and every child inside a `ButtonGroup`) now exposes
  `aria-pressed`, making it a proper toggle button.
- **Group of toggle buttons** — `ButtonGroup` is an exclusive single-select segmented
  control; the container now exposes `role="group"` + an accessible name, and each member
  reports its pressed state. (A `radiogroup` with roving-tabindex arrow-key navigation is the
  theoretical ideal for single-select; the toggle-button-group choice is the *additive*,
  native-`<button>`-preserving, selector-contract-preserving improvement — see Deferred.)

`SaveButton` is a thin `<CustomButton>` wrapper (fixed `action="save"` + `variant="primary"`)
adding a `valid`/`pending` gate and a pending spinner.

## Issues found

| # | Severity | WCAG | Location | Status |
|---|----------|------|----------|--------|
| 1 | Serious | 2.4.7 Focus Visible (AA), 2.4.11 Focus Appearance (AA), 1.4.11 Non-text Contrast (AA) | `Button.module.css:48` (`outline: none` with **no** `:focus-visible` rule anywhere in the file) | **FIXED** |
| 2 | Serious | 1.4.1 Use of Color (A), 4.1.2 Name Role Value (A) | `index.tsx` selected state was class-only (`.selected`, `Button.module.css:78`) — no `aria-pressed` | **FIXED** |
| 3 | Moderate | 1.1.1 Non-text Content (A) | `index.tsx` icon slot rendered decorative goobs `<svg>` (no `aria-hidden`) even alongside a text label | **FIXED** |
| 4 | Moderate | 1.3.1 Info & Relationships (A), 4.1.2 Name Role Value (A) | `index.tsx` `ButtonGroup` container was a plain `<div>` — no `role="group"`, no accessible name | **FIXED** |
| 5 | Moderate | 4.1.3 Status Messages (AA) | `SaveButton.tsx` pending state (spinner + "Saving…") not programmatically announced; button is natively `disabled` so its label change is not reliably read | **FIXED** |
| 6 | Moderate | 2.3.3 Animation from Interactions (AAA) | `Button.module.css` had a hover `transform` + 180ms transitions with **no** `prefers-reduced-motion` guard | **FIXED** |
| 7 | Serious | 4.1.2 Name Role Value (A), 1.1.1 (A) | Icon-only stories (`IconOnly`, `InteractiveGroupDemo`) shipped buttons with **no** accessible name | **FIXED (stories)** |

### Issue 1 — No visible keyboard focus indicator (Serious)

`.button` set `outline: none` (`Button.module.css:48`) to drop the UA focus ring for pointer
users, but **no `:focus-visible` (or `:focus`) rule existed anywhere in the module**. A
keyboard user tabbing through a toolbar of buttons had *zero* visual indication of which
button held focus. Fails 2.4.7 (a visible focus indicator must exist) and 2.4.11 / 1.4.11
(it must be perceivable / meet non-text contrast). Root cause: the ring was removed and never
restored.

### Issue 2 — Selected/pressed state conveyed by colour alone (Serious)

The `selected` prop (and `ButtonGroup`'s per-child selection) rendered only a background/border
colour shift via the `.selected` class (`Button.module.css:78-81`, `165-168`, `199-202`). No
`aria-pressed` / `aria-current` / `aria-checked` was emitted, so the selected member of a
segmented control was distinguished **only by colour** — invisible to a screen-reader user and
failing 1.4.1, and the toggle state was never in the accessibility tree (4.1.2).

### Issue 3 — Decorative icon not hidden from assistive tech (Moderate)

When a button has both an `icon` and a text label, the icon is decorative. The goobs icon
components (e.g. `Icons/Send.tsx:45-57`) render a bare `<svg fill="currentColor">` with **no**
`role`/`aria-label`/`aria-hidden`. Wrapped in the button's `.iconWrapper` span with no
`aria-hidden`, that graphic risks screen-reader noise and, on some AT, leaking into the
computed accessible name. Fails 1.1.1 (decorative content must be hidden). The icon must NOT be
hidden on an icon-*only* button (it would leave the button nameless) — see Issue 7.

### Issue 4 — ButtonGroup has no group semantics (Moderate)

`ButtonGroup` rendered a plain `<div className={buttonGroup}>` (`index.tsx`). A segmented
single-select control should be a labelled group so AT announces the set (e.g. "View mode,
group") before its members. No `role="group"` and no accessible-name mechanism existed. Fails
1.3.1 / 4.1.2.

### Issue 5 — Pending/busy state not announced (Moderate)

While `pending`, `SaveButton` swaps its label to "Saving…" + a spinner and sets the underlying
button `disabled` to block a double-submit (`SaveButton.tsx`). But a **natively disabled
control's label change is not reliably announced**, and there was no `aria-busy` and no live
region — a screen-reader user who triggered the save got no confirmation the async operation
started. Fails 4.1.3.

### Issue 6 — No reduced-motion guard (Moderate)

`.button` animates a 180ms transition and a hover `transform` (`Button.module.css:52-56,69`)
with no `@media (prefers-reduced-motion: reduce)` block. Users who request reduced motion still
got the animated hover lift. Fails 2.3.3. (The `SaveButton` spinner already had its guard —
`SaveButton.module.css:27` — but `Button` itself did not.)

### Issue 7 — Icon-only buttons shipped with no accessible name (Serious)

The `IconOnly` and `InteractiveGroupDemo` stories rendered `<Button icon={…} />` with no
`text`, no `children`, and no `aria-label`, producing a button announced only as "button".
Fails 4.1.2 / 1.1.1. The component **API already supports** the fix (`aria-label` passes
through to the native `<button>` via the `filteredProps` spread) — the defect was the shipped
stories modelling the inaccessible pattern.

## Hearing

No `Audio`, `AudioContext`, `<audio>`/`<video>`, or `navigator.vibrate` anywhere in the
component (grep clean across `index.tsx`, `SaveButton.tsx`). No information is conveyed by
sound, so WCAG 1.2.x / 1.4.2 do not apply. The one dynamic status (`SaveButton` pending) is
visual (spinner + label) **and** now programmatic (Issue 5). **No hearing-specific issues.**

## Reading & screen reader

- **Semantic HTML:** real native `<button>` (`index.tsx:635`) — full keyboard behaviour
  (`Tab`/`Shift+Tab` focus, `Enter`/`Space` activation) is provided by the platform; no custom
  key handling needed or added. Good.
- **Accessible name:** text/children render into a `<span>` label slot (`index.tsx:611`); for
  icon-only buttons the caller-supplied `aria-label` passes through. **Fixed** the decorative-
  icon leakage (Issue 3): when a label is present the icon wrapper is `aria-hidden`
  (`index.tsx:625`), so the name is exactly the label text.
- **Toggle state:** **Fixed** (Issue 2) — `aria-pressed={selected}` emitted only when `selected`
  is defined (`index.tsx:641`), so plain command buttons stay un-pressed and toggle buttons /
  group members announce their state. Verified by the `A11y/Selected → aria-pressed`,
  `A11y/Plain button (no aria-pressed)`, and `A11y/Group role + pressed` stories.
- **Group semantics:** **Fixed** (Issue 4) — `role="group"` + `aria-label`/`aria-labelledby`
  passthrough on the container (`index.tsx:85-87`). Verified by `A11y/Group role + pressed`
  resolving `getByRole('group', { name: 'View mode' })`.
- **Focus visible:** **Fixed** (Issue 1) — per-theme `:focus-visible` outline
  (`Button.module.css:82, 175, 213`); inside a `ButtonGroup` the outline is drawn inset
  (`:278`) so the group's `overflow: hidden` can't clip it.
- **Status announcement:** **Fixed** (Issue 5) — `aria-busy` while pending (`SaveButton.tsx:107`)
  + a visually-hidden `role="status"` `aria-live="polite"` region (`SaveButton.tsx:119`); the
  spinner stays `aria-hidden` (`SaveButton.tsx:74`).
- **Never colour-alone (1.4.1):** selected → `aria-pressed` (programmatic) + colour; disabled →
  native `disabled` attribute (programmatic) + colour; pending → `aria-busy` + text "Saving…"
  + spinner. None are colour-only. Good.
- **Motion:** **Fixed** (Issue 6) — `@media (prefers-reduced-motion: reduce)` zeroes the
  transition and the hover transform (`Button.module.css:310`); state colour changes still apply
  instantly. WCAG 2.3.3 satisfied.

## Adversarial review — remaining issues fixed (2026-07-11)

A follow-up adversarial review of the pass above found three residual issues. All fixed at root
cause within Button ownership (one shared-token improvement deferred to `global.css`).

- **R1 (moderate, 1.4.11 / 2.4.11) — focus ring below 3:1 in light + dark.** The `:focus-visible`
  ring added in Issue 1 was the *sole* focus indicator, but its light/dark colour came from the
  translucent `--goobs-light-focus-ring` (rgba(59,130,246,**0.4**)) / `--goobs-dark-focus-ring`
  (rgba(96,165,250,**0.45**)) tokens. Composited over the button surface those land ~1.6:1 (light)
  and ~2.0–2.3:1 (dark) — **below** the 3:1 non-text-contrast floor, so Issue 1's "1.4.11 FIXED"
  claim did not hold on 2 of 3 themes. **Fixed** (`Button.module.css:183, 225`) by pointing the
  light/dark `outline-color` at the **solid, opaque** `--goobs-light-primary` (#2563eb → **5.17:1**
  vs white) and `--goobs-dark-primary` (#60a5fa → **~4.8–5.8:1** vs the dark surface / raised
  surface / page). An opaque ring's contrast is backdrop-independent, so it holds regardless of
  page colour. Sacred (gold-a60, ~5.3:1) already passed and is unchanged. *No `global.css` edit —
  references existing `:root` tokens; the underlying token defect is Deferred.*
- **R2 (minor, T4) — decorative-icon `aria-hidden` not pinned.** No story failed if the
  `aria-hidden` on `.iconWrapper` (`index.tsx:625`) were reverted, because the goobs `<svg>` has no
  role/name so `getByRole('button',{name})` resolves identically either way. **Fixed** with a new
  regression story `A11y/Decorative icon hidden` (`Button.stories.tsx`) that reads the attribute
  directly and pins **both** branches of the `hasLabel` conditional: a labelled button's icon
  wrapper *has* `aria-hidden="true"`; an icon-only button's wrapper does *not*. Reverting either
  branch now fails the story.
- **R3 (minor, 4.1.3) — busy lifecycle announced start but not completion.** The `role="status"`
  region announced `'Saving…'` on `pending:false→true` but cleared to `''` silently on
  `true→false`, so AT heard the save begin but never that it concluded. **Fixed**
  (`SaveButton.tsx:118-125`) by tracking the `pending` transition (React adjust-state-during-render
  pattern — previous value in state, no ref/effect, so the strict `react-hooks/refs` +
  set-state-in-effect rules don't fire) and announcing a new additive `completedLabel`
  (default `'Save complete'`) on the completion edge. Success-vs-failure is genuinely caller-owned
  (SaveButton only observes `pending`), documented in the prop JSDoc: a caller whose save can fail
  announces the error itself and may override/suppress `completedLabel`. Pinned by the new
  `Busy lifecycle announced (start + completion)` story.

## Second adversarial review — remaining issues fixed (2026-07-11)

A follow-up adversarial review of the first review-fix pass (R1–R3 above) found three residual
issues. All fixed at root cause within Button ownership; no unowned files touched.

- **R4 (moderate, 1.4.11 / 2.4.11) — sacred focus ring left translucent.** R1 switched light/dark
  to opaque `--goobs-*-primary` but left the SACRED (default) `:focus-visible` ring sourced from the
  translucent `--goobs-sacred-focus-ring` (= gold-a60, `rgba(255,215,0,0.6)`, `Button.module.css:83`).
  A translucent ring composites against its backdrop, so its contrast is backdrop-DEPENDENT: ~5.5:1
  over the theme's dark surfaces but only ~1.2–1.5:1 over a light page, and — inside a ButtonGroup,
  where the ring is drawn INSET (`Button.module.css:290`) over the button's own translucent
  `--goobs-sacred-control-bg` — below 3:1. Since sacred is the component-wide DEFAULT, that fails the
  backdrop-independence R1 claimed. **Fixed** (`Button.module.css:83`) by pointing
  `.button:focus-visible` at the SOLID, opaque `--goobs-sacred-primary` (= `--goobs-gold`, #ffd700) —
  the sacred analogue of the `--goobs-light-primary`/`--goobs-dark-primary` R1 used. Opaque gold is
  backdrop-independent and holds well above 3:1 on sacred's intended dark surfaces (~12:1 on #0e0e0e).
  *Residual, honestly noted:* a gold ring on a PURE-WHITE page is inherently ~1.3:1 because the sacred
  accent colour itself is light — no gold token can clear 3:1 there. That is a theme-appropriateness
  matter (sacred is a dark-designed theme), not a translucency defect; it is now no worse and, being
  opaque, strictly clearer than the a60 ring. Pinned by the new `A11y/Sacred focus ring is opaque`
  story. *No `global.css` edit — references the existing `:root` token.*
- **R5 (minor, 1.3.1 / 4.1.2) — `role="group"` emitted unconditionally / nameless.** `ButtonGroup`
  emitted `role="group"` even with NO `aria-label`/`aria-labelledby` (`index.tsx:85`), producing a
  contextless group announcement in AT; and the three theme-group stories shipped no name, modelling
  that unlabelled pattern. **Fixed** (`index.tsx`) by gating `role="group"` on a supplied accessible
  name (`aria-label` OR `aria-labelledby`) — an unlabelled group now stays a plain `<div>` with its
  buttons announced individually, and a NAMED group still resolves `getByRole('group', {name})`. The
  three theme-group stories (`Group/Light|Dark|Sacred Theme`) now pass `aria-label="Content actions"`,
  modelling the correct named pattern. Pinned by the new `A11y/Unnamed group has no role` story
  (asserts no `group` role when unnamed) alongside the existing `A11y/Group role + pressed`
  (asserts a NAMED group still resolves). Additive/gating only — no attribute renamed or removed, and
  no ThothOS selector keys on a nameless ButtonGroup `role="group"` (it was introduced in this very
  a11y pass, not yet published).
- **R6 (minor, T4 / 2.3.3) — reduced-motion block unpinned.** The `@media (prefers-reduced-motion:
  reduce)` guard (Issue 6, `Button.module.css:321`) had no story, so reverting it failed no
  regression test. **Fixed** with the new `A11y/Reduced motion zeroes transition` story: a play
  function that can't force the media query instead reads `document.styleSheets`, locates the
  reduced-motion `@media` rule, and asserts it carries a rule zeroing the button class's `transition`
  AND a hover rule zeroing `transform`. Removing or un-zeroing the guard block now fails the story.

## SEO semantics

`Button` is an interactive control, not a heading/landmark/link/list/table, so the SEO-semantic
checklist items (real `<h1-6>`, landmarks, `<a href>`, `<ul>/<ol>`, `<table>`) do not apply.
The control renders as a real `<button>` in SSR HTML — the label and every `data-*` selector are
present server-side, no client-only injection of primary content. `ButtonGroup` now emits a
`role="group"` grouping semantic (`index.tsx:85`). **No SEO-semantic issues.**

## Fixes applied

All changes are additive — no prop renamed/removed/retyped, no export changed. The only rendered-
DOM changes are additive attributes (`aria-pressed`, `aria-hidden`, `role="group"`, `aria-busy`,
`aria-label`/`aria-labelledby`) and one additive visually-hidden `role="status"` span in
SaveButton. Every existing `data-component`/`data-action`/`data-subject`/`data-variant`/
`data-save-*` selector is preserved.

1. **Keyboard focus ring (Issue 1)** — added `.button:focus-visible` (`Button.module.css:82`)
   using `outline` (not box-shadow, so it never fights the hover glow) + `outline-offset: 2px`.
   Sacred is coloured via `--goobs-sacred-focus-ring` (gold-a60, ~5.3:1). Light/dark now use the
   **solid** `--goobs-light-primary` (#2563eb) / `--goobs-dark-primary` (#60a5fa) — see the
   review-fix note below; the earlier translucent `--goobs-light/dark-focus-ring` tokens
   composited below the 3:1 non-text-contrast floor. Inside a group the offset is inverted to
   `-2px` (`:278`) so the `overflow: hidden` container can't crop it.
2. **Toggle state (Issue 2)** — emit `aria-pressed={selected}` when `selected` is defined
   (`index.tsx:641`). `ButtonGroup` already sets `selected` on every child, so the whole segmented
   control becomes a group of toggle buttons.
3. **Decorative-icon hiding (Issue 3)** — computed `hasLabel` and, when a label is present, set
   `aria-hidden` on the `.iconWrapper` span (`index.tsx:613, 625`); icon-only buttons keep the
   icon exposed.
4. **Group role + name (Issue 4)** — added `role="group"` and additive `'aria-label'` /
   `'aria-labelledby'` props forwarded onto the container (`index.tsx:85-87`, interface at
   `:22-35`).
5. **Busy announcement (Issue 5)** — `aria-busy` while pending + visually-hidden
   `role="status" aria-live="polite"` region (`SaveButton.tsx:107, 116-121`), backed by a
   `.srOnly` class (`SaveButton.module.css:38`).
6. **Reduced motion (Issue 6)** — `@media (prefers-reduced-motion: reduce)` block zeroing the
   transition + hover transform (`Button.module.css:310`).
7. **Icon-only accessible name (Issue 7)** — fixed the `IconOnly` and `InteractiveGroupDemo`
   stories to pass `aria-label` (and `aria-label` on the group), modelling the correct pattern.

Per-file gate: `bun lint:file` on `index.tsx`, `SaveButton.tsx`, `Button.stories.tsx`,
`SaveButton.stories.tsx` — **exit 0**.

## Stories updated

`Button.stories.tsx`:
- **`Icon/Only`** — now passes `aria-label="Send"` and a `play` asserting the button resolves by
  its accessible name (proving icon-only naming works).
- **`Group/Interactive Demo`** — icon-only members now carry `aria-label`, and the group carries
  `aria-label="Action"`.
- **`A11y/Selected → aria-pressed`** (new) — asserts `aria-pressed` `true`/`false` on
  selected/unselected buttons and `userEvent.tab()`s to drive the focus ring into the Chromatic
  snapshot.
- **`A11y/Plain button (no aria-pressed)`** (new) — asserts a non-toggle button emits *no*
  `aria-pressed` (no leaked toggle semantics).
- **`A11y/Group role + pressed`** (new) — asserts `role="group"` + name, per-child
  `aria-pressed`, and that clicking another member moves the pressed state.
- **`A11y/Decorative icon hidden`** (new, review-fix R2) — reads `aria-hidden` on the icon wrapper
  directly and pins both branches of `hasLabel`: labelled → hidden, icon-only → exposed. Fails if
  the `index.tsx:625` fix is reverted.
- **`Group/Light|Dark|Sacred Theme`** (review-fix R5) — now pass `aria-label="Content actions"`, so
  they model the correct named-group pattern and render `role="group"` under the new name-gate.
- **`A11y/Sacred focus ring is opaque`** (new, review-fix R4) — keyboard-focuses a sacred button and
  asserts the computed `outline-color` is the opaque `rgb(255, 215, 0)`; reverting to the translucent
  `--goobs-sacred-focus-ring` (`rgba(…, 0.6)`) fails it.
- **`A11y/Unnamed group has no role`** (new, review-fix R5) — asserts a ButtonGroup with no
  `aria-label`/`aria-labelledby` exposes NO `group` role while its buttons stay reachable; reverting
  the gate (unconditional `role="group"`) fails it.
- **`A11y/Reduced motion zeroes transition`** (new, review-fix R6) — reads the stylesheet's
  `@media (prefers-reduced-motion: reduce)` block and asserts it zeroes the button `transition` and
  the hover `transform`; removing the guard block fails it.

`SaveButton.stories.tsx`:
- **`Pending (spinner)`** — added a `play` asserting `aria-busy="true"`, `toBeDisabled()`, and a
  `role="status"` region containing "Saving…".
- **`Busy lifecycle announced (start + completion)`** (new, review-fix R3) — toggles `pending`
  in both directions and asserts the `role="status"` region announces "Saving…" on start **and**
  "Save complete" on completion. Fails if the completion edge regresses to a silent clear.

## Deferred

- **`radiogroup` pattern for `ButtonGroup`.** For an *exclusive* single-select, the strict APG
  ideal is `role="radiogroup"` with `role="radio"` children, `aria-checked`, roving tabindex, and
  arrow-key navigation. That would (a) change each child's role away from `button`, (b) add a
  roving-tabindex keyboard model, and (c) risk the ThothOS Playwright selector contract that keys
  on `<button>`/`data-*`. The **toggle-button-group** implementation (native `<button>` +
  `aria-pressed` + `role="group"`) is the additive, contract-preserving improvement chosen here
  and is a valid accessible pattern; a radiogroup refactor is a larger, non-additive change left
  for a dedicated pass. *No unowned files involved — recorded as a design note, not a cross-file
  fix.*
- **Icon components could also self-`aria-hidden` (`src/components/Icons/*`).** The goobs icon
  `<svg>`s render with no `aria-hidden` (`Icons/Send.tsx:45`). Hiding decorative icons at the
  Button `.iconWrapper` (owned) fully resolves this component, so no unowned edit is required; but
  an `aria-hidden`/`role="img"`+title convention on the Icons themselves would harden every
  consumer. **Suggested owner change:** `src/components/Icons/*.tsx` — add `aria-hidden="true"` by
  default on the `<svg>` (overridable when an icon is used as standalone content). Not edited
  (outside Button ownership).
- **Shared focus-ring tokens are below 3:1 (review-fix R1 + R4 root cause).** The translucent
  `--goobs-light-focus-ring: rgba(59,130,246,0.4)` (`src/styles/global.css:305`),
  `--goobs-dark-focus-ring: rgba(96,165,250,0.45)` (`src/styles/global.css:336`), and
  `--goobs-sacred-focus-ring: var(--goobs-gold-a60)` (`src/styles/global.css:251`) composite below
  the 3:1 non-text-contrast floor over one or more of their host surfaces. Button was fixed locally
  for ALL THREE themes by switching its `:focus-visible` to the solid `--goobs-*-primary` tokens
  (light/dark in R1, sacred in R4), but the shared focus-ring tokens are **still consumed by other
  components** (`Accordion`, `Breadcrumb`, `Chip`, `BigCalendar` `.module.css`), which remain below
  threshold. **Suggested owner change (unowned file):** in `src/styles/global.css`, redefine
  `--goobs-light-focus-ring: #2563eb` and `--goobs-dark-focus-ring: #60a5fa` (solid), and reconsider
  `--goobs-sacred-focus-ring` (an opaque gold clears 3:1 only on dark surfaces — the sacred theme's
  intended context), or raise the alpha until each composite clears 3:1 on its host surface — then
  those components (and, optionally, Button reverted back to the tokens) all pass. Not edited
  (outside Button ownership; `src/styles/**` is off-limits).
- **`styles.outline` can override the focus ring.** If a consumer sets `styles.outline` (inline
  CSS `outline`), that inline style beats the stylesheet `:focus-visible` outline. This only
  affects consumers who explicitly opt into a custom persistent outline; the default path (no
  `styles.outline`) leaves the inline outline unset so `:focus-visible` applies. Documented, no
  code change — treating a caller's explicit outline override as intentional.
