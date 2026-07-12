# Drawer — a11y audit (2026-07-11)

**Status:** FIXED (two adversarial-review follow-up passes complete — all 10 findings fixed)
**APG pattern:** [Dialog (Modal)](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) for the
`temporary` variant (modal), a non-modal dialog for `persistent`, and an always-open inline panel
for `permanent`. The dismissible `temporary`/`persistent` variants render `role="dialog"`; the
always-open `permanent` variant now renders a `complementary` landmark (see Issue 6).

## Adversarial-review follow-up (2026-07-11)

A review of the first pass flagged two remaining items — both now fixed at root cause:

- **Issue 6 (moderate) — permanent variant was a nameless `role="dialog"`:** the always-open,
  never-dismissable `permanent` side panel is now exposed as a `role="complementary"` landmark
  instead of a modal-style dialog (WCAG 1.3.1 / 4.1.2). A landmark needs no required accessible
  name, so the nameless-dialog dev-warning no longer fires for it and the `PermanentVariant` story
  no longer ships an a11y violation.
- **Issue 7 (minor) — modal drawer did not lock body scroll or inert the background:** the
  `temporary` modal now locks body scroll (parity with the sibling `Dialog`) AND marks all
  background content `inert` + `aria-hidden` while open, so the page can't scroll behind the scrim
  and the background is unreachable even where an AT only imperfectly honours `aria-modal`.

## Second adversarial-review follow-up (2026-07-11)

A review of the follow-up pass flagged three more items — all now fixed at root cause:

- **Issue 8 (moderate) — closed `persistent` drawer leaked focusable off-screen content:** the
  null-render guard only unmounts `temporary`; a closed `persistent` drawer stays mounted with its
  `<a href>`/`<button>` children and `role="dialog"`, merely translated off-screen — so keyboard
  users could Tab into invisible controls and screen-reader users met a permanent off-screen dialog
  (WCAG 2.4.3, 2.4.7, 4.1.2). Fixed at root cause in `index.tsx`: the panel is now marked `inert`
  while a persistent drawer is closed (`inert={isPersistentClosed || undefined}`, where
  `isPersistentClosed = variant === 'persistent' && !safeOpen`). `inert` removes the whole subtree
  from BOTH the tab order and the accessibility tree, so the off-screen panel (and its dialog role)
  is unreachable until opened; opening lifts it. `temporary` still unmounts and `permanent` is
  always open, so neither is affected. Chose `inert` over unmounting because persistent must stay
  mounted for its slide animation + layout slot. Every `data-*` selector is unchanged.
- **Issue 9 (minor) — the 8 pre-existing `InteractiveDrawer` stories were nameless dialogs:**
  `LightTheme`/`DarkTheme`/`SacredTheme`, `AnchorLeft`/`Right`/`Top`/`Bottom`, `TemporaryVariant`,
  and `PersistentVariant` all render through the shared `InteractiveDrawer` wrapper, which passed no
  `ariaLabelledBy`/`ariaLabel` — so each opened as a nameless `role="dialog"` (tripping the
  component's own dev-warning + an axe dialog-name check). Fixed at the wrapper: `DrawerMenu` now
  takes an optional `headingId` rendered on its `<h3>`, and `InteractiveDrawer` mints a `useId`
  heading id, wires `ariaLabelledBy` to it, and passes it to the menu — naming all 8 stories at
  once.
- **Issue 10 (minor) — the `prefers-reduced-motion` fix had no regression coverage:** no story
  emulated the media feature, so neither the CSS `@media` block nor the `SacredBackground` rAF-skip
  was exercised by the Chromatic snapshot. Added the `Accessibility/Reduced Motion` story following
  the repo's established `Content` pattern: `parameters.chromatic.prefersReducedMotion: 'reduce'`
  makes Chromatic capture the reduced-motion path, and a `play` function scans the CSSOM (scoped to
  the panel's hashed class) to assert the `@media (prefers-reduced-motion: reduce)` block still
  neutralises the slide transition — failing deterministically the instant that block is removed. It
  renders a sacred, open drawer so the decorative `aria-hidden` glyph canvas + its rAF-skip path are
  exercised in the same snapshot.

The Drawer's `temporary` variant is a modal overlay (`aria-modal`, backdrop scrim) but implemented
**none** of the Dialog pattern's focus/keyboard obligations, while the sibling `Drawer` sibling
`Dialog` component (`src/components/Dialog/index.tsx`) already implements the full pattern. This audit
brought Drawer to parity with that established library convention.

---

## Issues found

| # | Severity | WCAG 2.2 | Location | Issue | Status |
|---|----------|----------|----------|-------|--------|
| 1 | Serious | 2.4.3 Focus Order; 2.1.2 No Keyboard Trap (correct trapping) | `index.tsx` (temporary variant, `role="dialog"` + `aria-modal`) | Modal drawer had **no focus management**: focus never moved into the panel on open, Tab was not trapped inside the modal, and focus was never restored to the trigger on close. | FIXED |
| 2 | Serious | 4.1.2 Name, Role, Value | `index.tsx:579` (`role="dialog"`) | The dialog surface had **no accessible-name wiring** — no `aria-labelledby`/`aria-label` props and no author-time signal, so a nameless modal shipped silently to screen readers. | FIXED |
| 3 | Moderate | 2.3.3 Animation from Interactions | `Drawer.module.css` (`.paper` transition) + `index.tsx` `SacredBackground` rAF | The slide transition and the perpetual `requestAnimationFrame` glyph-canvas animation **ignored `prefers-reduced-motion`**. | FIXED |
| 4 | Moderate | 2.1.1 Keyboard | `index.tsx` Escape handler (old line 315) | Escape closed **only** the `temporary` variant; the dismissible non-modal `persistent` variant (which also exposes `onClose`) could not be closed from the keyboard. | FIXED |
| 5 | Minor | 1.1.1 Non-text Content | `index.tsx` sacred `<canvas>` (old line 207) | The decorative glyph canvas had no programmatic-hidden treatment, so AT could surface an empty, meaningless `canvas`. | FIXED |
| 6 | Moderate | 1.3.1 Info and Relationships; 4.1.2 | `index.tsx` (`permanent` variant) | An always-open, non-modal `permanent` side panel was exposed as `role="dialog"` where a complementary landmark is correct — and shipped nameless from the `PermanentVariant` story. | FIXED |
| 7 | Minor | APG Dialog(Modal) completeness; parity | `index.tsx` (temporary modal effect) | The modal `temporary` drawer set `aria-modal` but did **not** lock body scroll (the sibling `Dialog` does) and did **not** inert/aria-hide sibling page content, so the page scrolled behind the scrim and a virtual cursor could reach background content. | FIXED |
| 8 | Moderate | 2.4.3 Focus Order; 2.4.7; 4.1.2 | `index.tsx` (persistent variant) | A closed `persistent` drawer stayed mounted with its focusable `<a>`/`<button>` children and `role="dialog"`, only translated off-screen — leaking off-screen tab stops and a permanent invisible dialog into the accessibility tree. | FIXED |
| 9 | Minor | 4.1.2 Name, Role, Value | `Drawer.stories.tsx` (`InteractiveDrawer`) | The 8 pre-existing stories built on `InteractiveDrawer` passed no `ariaLabelledBy`/`ariaLabel`, so each opened as a nameless `role="dialog"` (tripping the component's own dev-warning + an axe dialog-name check). | FIXED |
| 10 | Minor | 2.3.3 (regression coverage) | `Drawer.stories.tsx` | The `prefers-reduced-motion` fix (CSS `@media` + `SacredBackground` rAF-skip) had no story emulating the media feature, so it was never exercised by the Chromatic regression snapshot. | FIXED |

---

## Hearing (WCAG 1.2.x, 1.4.2)

No issues. Grepped the component for `new Audio` / `AudioContext` / `<audio>` / `<video>` /
`navigator.vibrate` — none present. No information is conveyed by sound. The open/close lifecycle is
surfaced visually (the slide + backdrop) and programmatically (the `emitDiag` `component.state`
beacon and the `data-open`/`data-state` attributes) — never audio-only.

## Reading & screen reader (1.1.1, 1.3.1, 1.4.1, 2.1.x, 2.4.x, 4.1.2)

- **Focus trap + initial focus + restore (Issue 1, FIXED).** Added a `temporary`-variant-only focus
  effect (`index.tsx`) mirroring the sibling `Dialog`: on open it records `document.activeElement`
  and moves focus to the first focusable child (or the panel container, which now carries
  `tabIndex={-1}`); while open, `Tab`/`Shift+Tab` cycle at the boundaries only; on close the cleanup
  restores focus to the trigger. The boundary-only design deliberately omits an "active outside the
  drawer → recapture" branch because goobs overlays (SearchableSimple, Popover, MultiSelect, Tooltip)
  portal their menus to `document.body`; recapturing would orphan an open dropdown inside the drawer.
  Non-modal `persistent` and inline `permanent` correctly do **not** trap focus.
- **Accessible name wiring (Issue 2, FIXED).** Added additive `ariaLabelledBy` / `ariaDescribedBy` /
  `ariaLabel` props (same names/semantics as `Dialog`), rendered as `aria-labelledby`,
  `aria-describedby`, and `aria-label` (label suppressed when `ariaLabelledBy` is set, so the two
  never collide). A **dev-only** `console.warn` fires when an active drawer (open, or any `permanent`)
  has no accessible name from any source (props or the `...other` passthrough), so a nameless dialog
  surfaces at author time; it compiles out of production bundles.
- **Escape parity (Issue 4, FIXED).** The Escape handler now closes any dismissible drawer
  (`variant !== 'permanent'`), covering both `temporary` and `persistent`.
- **Color-alone (1.4.1):** Not applicable — the component conveys no selected/error/disabled *state*
  by color; `styles.disabled` dims opacity but is a caller styling hint, not a semantic state the
  component owns.
- **Semantic HTML / native controls:** The component owns no interactive controls of its own (the
  backdrop is `aria-hidden` scrim, dismiss is keyboard-served by Escape). All interactive content is
  consumer-provided `children`. No role-annotated `div` stands in for a native control.
- **Decorative canvas (Issue 5, FIXED):** the sacred `<canvas>` now has `aria-hidden="true"`.
- **Closed persistent inerting (Issue 8, FIXED):** a `persistent` drawer stays mounted when closed
  (it slides off-screen rather than unmounting like `temporary`), so the panel is now marked `inert`
  while closed (`inert={isPersistentClosed || undefined}`). `inert` removes the whole subtree — its
  focusable children AND its `role="dialog"` — from both the tab order and the accessibility tree, so
  keyboard/AT users cannot reach the invisible off-screen panel until it is opened; opening lifts
  `inert`. This reuses the exact `inert={x || undefined}` pattern already shipped in `AppBar`.

## SEO semantics (SSR-crawled markup)

- All primary content is the consumer's `children`, rendered server-side inside the panel — no
  client-only injection of primary content. The only client-generated content is the decorative,
  now-`aria-hidden` glyph canvas (which additionally draws nothing under `prefers-reduced-motion`).
- **Landmark (Issue 6, FIXED):** the `permanent` variant is now exposed as a `role="complementary"`
  landmark (equivalent to `<aside>`) instead of `role="dialog"`, which is correct for an always-open,
  never-dismissable inline side panel (WCAG 1.3.1 / 4.1.2). Screen-reader users can jump to it via
  landmark navigation. The role is chosen by variant
  (`role={variant === 'permanent' ? 'complementary' : 'dialog'}`); `temporary`/`persistent` keep
  `role="dialog"`. Because a complementary landmark needs no required accessible name, the
  nameless-dialog dev-warning was scoped to exclude `permanent`, and the `PermanentVariant` story now
  passes `ariaLabelledBy` at its heading so the landmark carries a name anyway (best practice).

## Modal completeness / Dialog parity (Issue 7, FIXED)

- **Body scroll-lock.** While the `temporary` (modal) drawer is open, `document.body.style.overflow`
  is set to `hidden` and restored to its prior value on close — parity with the sibling `Dialog`
  (`Dialog/index.tsx`). The previous value is saved/restored (not blindly cleared) so nesting inside
  another scroll-locking overlay is safe.
- **Background inerting.** On open, the effect walks from the panel up to `<body>` and marks every
  sibling off the panel's ancestor path `inert` + `aria-hidden`, restoring prior values on close. This
  enforces the `aria-modal` intent for AT that honours it imperfectly, and blocks pointer/virtual-cursor
  access to background content. Deliberate carve-outs: the **backdrop scrim is skipped** (it must stay
  clickable to dismiss), and only elements present **at open time** are touched — so a goobs overlay
  (SearchableSimple, Popover, MultiSelect, …) opened from inside the drawer, which portals its menu to
  `document.body` after open, is **not** inerted and stays interactive (the same portal exception the
  focus-trap makes).
- **Ordering.** Scroll-lock + inert are merged into the single modal effect (not a second effect) so
  the trigger is captured **before** inerting (inerting the focused trigger would blur it and lose the
  restore target) and the background is un-inerted **before** focus is restored (a still-inert trigger
  can't be focused). This keeps the Issue-1 focus-restore behaviour intact.
- Exceeds `Dialog`'s coverage (Dialog scroll-locks but does not inert siblings); this is the
  accessible-by-default direction, kept safe by the portal carve-out above.

## Motion (2.3.3)

- **CSS:** added an `@media (prefers-reduced-motion: reduce)` block to `Drawer.module.css` that
  removes the `.paper` slide transition (and the scrollbar-thumb transition). The 300ms exit delay is
  a JS timer, not this transition, so unmount timing is unaffected — the panel simply appears/leaves
  in place. Matches the repo pattern (Accordion, SacredGlyphFrame).
- **JS:** `SacredBackground` now checks `window.matchMedia('(prefers-reduced-motion: reduce)')` and,
  when set, clears the canvas once and skips the perpetual `requestAnimationFrame` loop entirely.
- **Regression coverage (Issue 10, FIXED):** added the `Accessibility/Reduced Motion` story. Because
  the media feature is OFF by default, it is guarded two ways (matching the repo's `Content`
  reduced-motion story): `parameters.chromatic.prefersReducedMotion: 'reduce'` makes Chromatic
  capture the reduced-motion path as the real baseline, and a `play` function scans the CSSOM (scoped
  to the panel's own hashed class) to assert the `@media (prefers-reduced-motion: reduce)` block
  still sets `transition: none` — failing deterministically (with or without Chromatic) the instant
  that block is deleted. The story renders a sacred, open drawer so the `aria-hidden` glyph canvas +
  its rAF-skip path are exercised in the same snapshot.

## Fixes applied

- `src/components/Drawer/index.tsx`
  - Added `ariaLabelledBy` / `ariaDescribedBy` / `ariaLabel` props (additive) + destructuring.
  - Added the modal focus-trap effect (temporary only): initial focus, `Tab`/`Shift+Tab` boundary
    cycling, focus restore to trigger; added `tabIndex={-1}` to the panel.
  - Rendered `aria-labelledby` / `aria-describedby` / `aria-label` on the panel (before `{...other}`
    so consumer passthrough still overrides).
  - Broadened the Escape handler from `variant === 'temporary'` to `variant !== 'permanent'`.
  - Added a dev-only nameless-dialog `console.warn`; **follow-up:** scoped it to the dialog variants
    only (`variant === 'permanent' || !open` returns early) since permanent is now a landmark.
  - **Follow-up (Issue 6):** role is now variant-aware —
    `role={variant === 'permanent' ? 'complementary' : 'dialog'}`. `temporary`/`persistent` unchanged.
  - **Follow-up (Issue 7):** merged body scroll-lock + background `inert`/`aria-hidden` into the modal
    (temporary) focus effect, with capture-before-inert and un-inert-before-focus-restore ordering, the
    backdrop-skip and open-time-only carve-outs described above.
  - `SacredBackground`: `prefers-reduced-motion` guard skips the rAF loop; `aria-hidden="true"` on the
    decorative `<canvas>`.
  - **Second follow-up (Issue 8):** the panel now carries `inert={isPersistentClosed || undefined}`
    (`isPersistentClosed = variant === 'persistent' && !safeOpen`) so a closed persistent drawer
    leaves the tab order + accessibility tree. Additive, no selector change.
- `src/components/Drawer/Drawer.module.css`
  - Added the `@media (prefers-reduced-motion: reduce)` block.
- `src/components/Drawer/Drawer.stories.tsx`
  - Added `AccessibleDrawerMenu` (real `<nav>` + `<a href>` links + native `<button>` so the trap has
    genuine tab stops, and a heading with an id for `ariaLabelledBy`).
  - Added `Accessibility/Accessible Name + Focus Trap` and `Accessibility/Accessible Sacred` stories.

**Selector contract preserved:** all existing `data-component` / `data-theme` / `data-variant` /
`data-anchor` / `data-open` / `data-state` attributes and `aria-modal` are unchanged; every new
attribute is additive.

**Markup change (noted per the API rules — "changing the rendered element to the semantically correct
one is allowed when required, but note every markup change"):** the `role` attribute *value* on the
panel is now variant-dependent — the `permanent` variant renders `role="complementary"` (was
`role="dialog"`); `temporary` and `persistent` are unchanged at `role="dialog"`. The `role` attribute
itself is neither removed nor renamed, and no `data-*` selector changed, so the machine-test selector
contract ThothOS keys on (`data-component`, `data-*`, the combobox/listbox dropdown pattern) is intact.
Playwright does not key on `role="dialog"` for the permanent Drawer.

**Second markup change (Issue 8):** the panel now conditionally carries the native boolean `inert`
attribute (`inert={isPersistentClosed || undefined}`) — present only while a `persistent` drawer is
closed, absent otherwise. This is purely additive (a new standard HTML attribute; the same pattern
already ships in `AppBar`), removes no attribute, and changes no `data-*`/`role`/`aria` selector, so
the machine-test selector contract is unaffected.

## Stories updated

Yes. First pass added an accessible content component and two stories
(`AccessibleNameAndFocusTrap`, `AccessibleSacred`). Follow-up pass:
- Extended `PermanentVariant` to render the accessible menu with `ariaLabelledBy`, so it exercises the
  `permanent` variant as a *named `complementary` landmark* (Issue 6 regression).
- Added `Accessibility/Modal Background Isolation` (`ModalBackgroundIsolation`) — a tall page with a
  focusable background link and an open modal drawer, exercising the body scroll-lock + background
  inerting (Issue 7 regression).

Second follow-up pass:
- Wired `ariaLabelledBy` (a `useId` heading id) through the shared `InteractiveDrawer` wrapper +
  `DrawerMenu`, naming all 8 pre-existing stories at once (Issue 9). No new story needed — the fix
  removes the nameless-dialog violation from the existing stories.
- Added `Accessibility/Persistent Inert When Closed` (`PersistentInertWhenClosed`) — a closed-by-
  default persistent drawer with a toggle; its `play` function asserts the panel is `inert` while
  closed, that opening lifts `inert`, and that closing re-applies it (Issue 8 regression, fails the
  instant the `inert` guard is removed).
- Added `Accessibility/Reduced Motion` (`ReducedMotion`) — a sacred open drawer with
  `parameters.chromatic.prefersReducedMotion: 'reduce'` + a CSSOM-scanning `play` gate (Issue 10
  regression).
The Storybook/Chromatic story is the repo's only regression test.

## Deferred

None. All five adversarial-review findings across both follow-up passes are fixed in-tree. No fix
required a file outside the Drawer directory — the `role` correction, scroll-lock, inert isolation,
and the closed-persistent `inert` are all internal to `src/components/Drawer/index.tsx`, and the
accessible-name wiring + regression coverage are internal to `src/components/Drawer/Drawer.stories.tsx`.
