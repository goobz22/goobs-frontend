# Drawer — a11y audit (2026-07-11)

**Status:** FIXED
**APG pattern:** [Dialog (Modal)](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) for the
`temporary` variant (modal), a non-modal dialog for `persistent`, and an always-open inline panel
for `permanent`. All three currently render `role="dialog"`.

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
| 6 | Moderate | 1.3.1 Info and Relationships; 4.1.2 | `index.tsx:579` (`permanent` variant) | An always-open, non-modal `permanent` side panel is exposed as `role="dialog"` where a complementary/`nav` landmark would be more correct. | DEFERRED (see below) |

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

## SEO semantics (SSR-crawled markup)

- All primary content is the consumer's `children`, rendered server-side inside the panel — no
  client-only injection of primary content. The only client-generated content is the decorative,
  now-`aria-hidden` glyph canvas (which additionally draws nothing under `prefers-reduced-motion`).
- **Landmark (Issue 6, DEFERRED):** the `permanent` variant would be more correctly exposed as an
  `<aside>`/`<nav aria-label>` complementary landmark than as `role="dialog"`. This was **not**
  changed because the task's hard rule forbids removing/renaming any existing `role`/`aria`
  attribute (ThothOS Playwright may key on `role="dialog"`), and changing the element/role for one
  variant would do exactly that. Mitigation in place today: because `{...other}` spreads **after** the
  explicit attributes, a consumer can already override `role` (e.g. `role="navigation"`) and pass
  `ariaLabel` on a permanent drawer. A proper fix (variant-aware landmark semantics) needs an owner
  decision on the selector contract — see Deferred.

## Motion (2.3.3)

- **CSS:** added an `@media (prefers-reduced-motion: reduce)` block to `Drawer.module.css` that
  removes the `.paper` slide transition (and the scrollbar-thumb transition). The 300ms exit delay is
  a JS timer, not this transition, so unmount timing is unaffected — the panel simply appears/leaves
  in place. Matches the repo pattern (Accordion, SacredGlyphFrame).
- **JS:** `SacredBackground` now checks `window.matchMedia('(prefers-reduced-motion: reduce)')` and,
  when set, clears the canvas once and skips the perpetual `requestAnimationFrame` loop entirely.

## Fixes applied

- `src/components/Drawer/index.tsx`
  - Added `ariaLabelledBy` / `ariaDescribedBy` / `ariaLabel` props (additive) + destructuring.
  - Added the modal focus-trap effect (temporary only): initial focus, `Tab`/`Shift+Tab` boundary
    cycling, focus restore to trigger; added `tabIndex={-1}` to the panel.
  - Rendered `aria-labelledby` / `aria-describedby` / `aria-label` on the panel (before `{...other}`
    so consumer passthrough still overrides).
  - Broadened the Escape handler from `variant === 'temporary'` to `variant !== 'permanent'`.
  - Added a dev-only nameless-dialog `console.warn`.
  - `SacredBackground`: `prefers-reduced-motion` guard skips the rAF loop; `aria-hidden="true"` on the
    decorative `<canvas>`.
- `src/components/Drawer/Drawer.module.css`
  - Added the `@media (prefers-reduced-motion: reduce)` block.
- `src/components/Drawer/Drawer.stories.tsx`
  - Added `AccessibleDrawerMenu` (real `<nav>` + `<a href>` links + native `<button>` so the trap has
    genuine tab stops, and a heading with an id for `ariaLabelledBy`).
  - Added `Accessibility/Accessible Name + Focus Trap` and `Accessibility/Accessible Sacred` stories.

**Selector contract preserved:** all existing `data-component` / `data-theme` / `data-variant` /
`data-anchor` / `data-open` / `data-state` attributes, `role="dialog"`, and `aria-modal` are unchanged;
every new attribute is additive.

## Stories updated

Yes. Added an accessible content component and two stories exercising the new behaviour
(`AccessibleNameAndFocusTrap`, `AccessibleSacred`) — the Storybook/Chromatic story is the repo's only
regression test.

## Deferred

- **`permanent` variant landmark semantics** — *not owned by another file; a contract decision.*
  `src/components/Drawer/index.tsx:579`. Suggested change (needs owner sign-off because it touches the
  `role` selector contract): make the rendered element/role variant-aware — render `permanent` as an
  `<aside>` (or `<nav>` when the content is navigation) complementary landmark instead of
  `role="dialog"`, keeping `role="dialog"` for `temporary`/`persistent`. Left unchanged to honour the
  "never remove/rename an existing role/aria attribute" rule.
