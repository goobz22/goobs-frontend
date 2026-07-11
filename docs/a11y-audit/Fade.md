# Fade — a11y audit (2026-07-11)

**Status:** FIXED

**APG pattern:** None strictly — `Fade` is a generic presentational transition
wrapper (an opacity animation container), not an interactive widget. No ARIA
Authoring Practices widget pattern applies. It has no role, no interactive
semantics of its own, and imposes no roles on its children; it renders a plain
`<div>` with `data-component="Fade"` plus `data-theme` / `data-state` /
`data-disabled` state hooks. The relevant a11y obligations are therefore the
cross-cutting ones (motion, and keeping visually-hidden content out of the
accessibility tree), not a widget keyboard-interaction table.

## Issues found

| # | Severity | WCAG | Location | Status |
|---|----------|------|----------|--------|
| 1 | Serious | 1.3.1 Info & Relationships (A), 2.4.3 Focus Order (A), 4.1.2 Name/Role/Value (A) | `src/components/Fade/Fade.module.css:57` (old hidden-state block) | FIXED |
| 2 | Moderate | 2.3.3 Animation from Interactions (AAA) + best practice | `src/components/Fade/Fade.module.css` (whole file — no reduced-motion handling) | FIXED |

### 1 — Faded-out content stayed in the accessibility tree AND the tab order

The hidden state (`in: false` → `data-state="hidden"`) set **only** `opacity: 0`.
`opacity: 0` hides content *visually* but leaves it fully present in the
accessibility tree (screen readers still announce it) and in the tab order
(keyboard users still Tab into interactive descendants). So a `Fade` wrapping a
button/link/form control that is currently "faded out" exposed invisible,
unreachable-looking content to AT and keyboard users — a focus-order and
name/role/value defect (WCAG 2.4.3 / 4.1.2) and an info-and-relationships
mismatch (1.3.1: perceivable state differs between sighted and AT users).

**Fix (root cause, CSS-only, no API change):** the hidden state now also sets
`visibility: hidden`, which removes the subtree from *both* the accessibility
tree and the tab order. To avoid killing the component's whole reason to exist
(the fade-*out* animation), the `visibility` swap rides in the transition list
and is **deferred by the full fade duration** via a new internal
`--fade-visibility-delay` custom property: the node stays `visibility: visible`
for the entire fade-out, then flips to `hidden` the instant it is fully
transparent. Fade-*in* keeps `--fade-visibility-delay: 0s` so content becomes
visible/announced immediately and then fades in. No DOM element, `data-*`, role,
or aria attribute changed; no prop changed.

### 2 — No `prefers-reduced-motion` handling

`Fade`'s sole purpose is a CSS opacity transition, yet the module had no
`@media (prefers-reduced-motion: reduce)` rule, so users who requested reduced
motion still got the animated fade (WCAG 2.3.3).

**Fix:** added a `@media (prefers-reduced-motion: reduce)` block that sets
`transition: none` on `.container` (matching the repo convention used by Button,
Accordion, Alert, etc.). Under reduced motion the opacity/visibility now switch
instantly — content still shows/hides and is still correctly added to / removed
from the a11y tree, just without the animation.

## Hearing (WCAG 1.2.x, 1.4.2)

Clean. Grepped the component for `new Audio` / `AudioContext` / `navigator.vibrate`
/ `<audio>` / `<video>` — no matches. `Fade` conveys nothing by sound; it has no
media playback surface. No captions/transcript props needed.

## Reading & screen reader (1.1.1, 1.3.1, 1.4.1, 2.1.x, 2.4.x, 3.2.x, 3.3.x, 4.1.2, 4.1.3)

- **Accessible name:** N/A — `Fade` renders no interactive element and no
  icon/image of its own; it is a transparent wrapper. Consumers can still pass
  `role`/`aria-*` through `...restProps` (`FadeProps extends
  Omit<React.HTMLAttributes<HTMLDivElement>, 'style'>`) when they need to label
  the container. No change required.
- **Semantic HTML:** a plain `<div>` is the correct element for a generic
  transition container — it must not impose heading/list/landmark semantics on
  arbitrary children. No change.
- **Focus / `:focus-visible`:** `Fade` is not focusable and takes no `tabIndex`,
  so no focus-visible treatment belongs on the wrapper; focusable children carry
  their own. The real focus defect here was that hidden content *remained*
  focusable — fixed via issue 1.
- **Color-alone state (1.4.1):** the visible/hidden/disabled states are conveyed
  programmatically via `data-state` / `data-disabled` (not color), and the hidden
  state is now also conveyed by removal from the a11y tree. No color-only state.
- **Dynamic updates / live regions:** N/A — `Fade` is a passive wrapper that does
  not itself emit status/async content; announcing wrapped content is the
  consumer's responsibility (Alert/Snackbar own that). No `aria-live` belongs on
  a generic fade primitive.

## SEO semantics

Clean / not applicable as a defect. `Fade` always renders its `children` into the
SSR'd HTML (it never conditionally unmounts primary content), so wrapped content
is crawlable. `visibility: hidden` in the hidden state (issue 1 fix) keeps the
content in the DOM — search engines still receive the markup, matching the
author's intent that `in: false` content is not currently shown. `Fade` is not
itself a heading/landmark/list/link, so no `headingLevel`/landmark/`linkComponent`
prop is warranted; forcing any such semantics onto a generic wrapper would be
wrong.

## Fixes applied

- `src/components/Fade/Fade.module.css`
  - `.container`: added `visibility: visible`, a new internal
    `--fade-visibility-delay` custom property, folded `visibility 0s linear` into
    the transition list, and made `transition-delay` a two-value list
    (`var(--fade-delay), var(--fade-visibility-delay)`) so opacity and visibility
    each get the correct delay.
  - `.container[data-state='visible']`: added `visibility: visible`.
  - `.container[data-state='hidden']`: added `visibility: hidden` and
    `--fade-visibility-delay: calc(var(--fade-delay) + var(--fade-duration))` so
    the node leaves the a11y tree/tab order only after the fade-out completes.
  - Added `@media (prefers-reduced-motion: reduce) { .container { transition: none } }`.

## Stories updated

Added two stories to `src/components/Fade/Fade.stories.tsx` (Storybook stories are
this repo's only regression tests):

- **`FocusAndScreenReaderSafety`** — a `Fade` (togglable `in`) wrapping a real
  `<button>`, flanked by "Before"/"After" buttons, demonstrating that when faded
  out the inner button is dropped from the tab order and the screen-reader tree
  (Tab skips it). Exercises the issue-1 `visibility` behavior and pins a Chromatic
  baseline for the hidden state.
- **`ReducedMotion`** — a deliberately slow (1500ms) fade documenting that under
  `prefers-reduced-motion: reduce` the transition is dropped and the toggle snaps.
  Exercises the issue-2 media query.

## Deferred

None. Both issues were fixed at root cause entirely within the owned directory
(`src/components/Fade/`). No shared/util/Field/Shell/global.css/barrel change was
required.
