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
| 3 | Minor | 1.3.1 / 2.4.3 / 4.1.2 (the issue-1 criteria, via a timing edge case) | `src/components/Fade/Fade.module.css` (old two-value `transition-delay`) + `src/components/Fade/index.tsx` | FIXED (found in adversarial review) |

### 1 — Faded-out content stayed in the accessibility tree AND the tab order

The hidden state (`in: false` → `data-state="hidden"`) set **only** `opacity: 0`.
`opacity: 0` hides content *visually* but leaves it fully present in the
accessibility tree (screen readers still announce it) and in the tab order
(keyboard users still Tab into interactive descendants). So a `Fade` wrapping a
button/link/form control that is currently "faded out" exposed invisible,
unreachable-looking content to AT and keyboard users — a focus-order and
name/role/value defect (WCAG 2.4.3 / 4.1.2) and an info-and-relationships
mismatch (1.3.1: perceivable state differs between sighted and AT users).

**Fix (root cause, no API change):** the hidden state now also sets
`visibility: hidden`, which removes the subtree from *both* the accessibility
tree and the tab order. To avoid killing the component's whole reason to exist
(the fade-*out* animation), the `visibility` swap is **deferred to the end of the
fade-out**. It rides in the transition list as a **discrete-property transition
over the same `--fade-duration`** as opacity (`visibility var(--fade-duration)
linear var(--fade-delay)`): by CSS's special discrete-`visibility` semantics a
`visible`→`hidden` transition holds `visible` for the entire duration and flips
to `hidden` only at the very end, while `hidden`→`visible` becomes `visible`
immediately. So the node stays present for exactly the fade-out and is announced
immediately on fade-in. No DOM element, `data-*`, role, or aria attribute
changed, and no *public* prop changed.

> **Correction to an earlier draft** (which claimed this was "fully clean / no
> prop interaction"): the first implementation deferred the swap with an internal
> `--fade-visibility-delay` custom property fed by a two-value `transition-delay`
> list, which desynced when the public `styles.transition` shorthand override was
> used. That edge case is issue 3 below; the discrete-`visibility` mechanism
> above replaced the fragile delay-list and, together with the issue-3 JS change,
> fixes it.

### 2 — No `prefers-reduced-motion` handling

`Fade`'s sole purpose is a CSS opacity transition, yet the module had no
`@media (prefers-reduced-motion: reduce)` rule, so users who requested reduced
motion still got the animated fade (WCAG 2.3.3).

**Fix:** added a `@media (prefers-reduced-motion: reduce)` block that sets
`transition: none` on `.container` (matching the repo convention used by Button,
Accordion, Alert, etc.). Under reduced motion the opacity/visibility now switch
instantly — content still shows/hides and is still correctly added to / removed
from the a11y tree, just without the animation.

### 3 — Visibility deferral desynced when the public `transition` override was used

Found by adversarial review of the issue-1 fix. The original deferral put
`visibility 0s linear` in the transition list and timed the swap with a two-value
`transition-delay: var(--fade-delay), var(--fade-visibility-delay)` — a
**position-mapped** list. Two things broke it when the public `styles.transition`
full-shorthand override was in play:

1. `--fade-visibility-delay` was `calc(var(--fade-delay) + var(--fade-duration))`,
   but the `transition` prop populates `--fade-transition` and bypasses
   `--fade-duration`. So `styles.transition: 'opacity 2s ease'` (with
   `--fade-duration` still at the 0.3s theme default) flipped `visibility: hidden`
   at 0.3s — chopping the 2s fade-out and dropping content from the a11y tree
   while it was still visibly fading.
2. A multi-segment override (e.g. `'opacity 1s, transform 1s'`) made the
   transition list length 3 while `transition-delay` had only 2 values, so the
   delay list **cycled** and `visibility` received `var(--fade-delay)` (0s)
   instead of `var(--fade-visibility-delay)` — defeating the deferral entirely
   (content left the a11y tree immediately, before the fade-out finished).

Real-world impact was low (no shipped consumer uses the raw `transition` prop;
`timeout` / `transitionDuration` stayed in sync), which is why issue 1 shipped —
but the earlier report's blanket "no prop changed / fully clean" claim overlooked
this interaction. **Fix (two parts, root cause):**

- **CSS:** replaced the `visibility 0s linear` + position-mapped `transition-delay`
  list with a discrete-`visibility` transition over `--fade-duration`, with each
  segment carrying its own duration + delay **inline**
  (`visibility var(--fade-duration) linear var(--fade-delay)`). A multi-segment
  override can no longer shift the visibility timing onto the wrong list position.
  Removed the now-obsolete `--fade-visibility-delay` custom property and the
  hidden-state `calc(...)`.
- **JS (`index.tsx`):** new `transitionRuntimeMs()` best-effort-parses the
  override's real running time (max of duration + delay across comma segments,
  erring long) and feeds it into `--fade-duration`, so the visibility deferral
  tracks the actual fade length instead of the theme-default token. The
  default path (no `transition` prop) is byte-for-byte unchanged, so no existing
  consumer's behavior moves.

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
- **Color-alone state (1.4.1):**
  - *Visible / hidden* — not conveyed by color at all. The hidden state removes
    the subtree from the accessibility tree + tab order (`visibility: hidden`),
    which is a genuine programmatic, non-visual signal. `data-state` mirrors it
    for styling/tests but is not what carries the state to AT.
  - *Disabled* — **correction to an earlier draft of this report**, which said the
    disabled state is "conveyed programmatically via `data-state` / `data-disabled`
    (not color)." That overstates AT coverage that does not exist. The `disabled`
    prop is a **purely-visual dimming** (`opacity: 0.6`, and its own JSDoc says
    "purely visual"); `data-disabled` is a non-ARIA `data-*` attribute — a
    CSS/test hook invisible to assistive tech — so it must NOT be described as
    programmatic a11y coverage. Fade is a role-less presentational wrapper that
    cannot know whether its children are interactive, so it deliberately sets no
    `aria-disabled` and no `pointer-events: none`: "disabled" content stays
    focusable/clickable and only appears dimmed. This is acceptable **only**
    because `disabled` is explicitly documented as a visual affordance and real
    disabling is the consumer's responsibility (disable the actual control); it is
    not a claim of AT coverage, and it is not a color-*only* state defect in the
    1.4.1 sense because dimming an inert wrapper conveys no information that AT
    users are missing. If a caller needs a genuinely-disabled control, that
    belongs on the interactive child (native `disabled` / `aria-disabled`), not on
    this generic wrapper — logged as a non-blocking note below, not changed here
    (additive-only public API; the prop's visual-only contract predates the audit).
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
  - `.container`: added `visibility: visible` and folded a **discrete-`visibility`
    transition over `--fade-duration`** into the transition list
    (`visibility var(--fade-duration) linear var(--fade-delay)`), with each
    segment carrying its own duration + delay **inline**. This defers the
    `visibility: hidden` swap to the end of the fade-out with no separate,
    position-fragile `transition-delay` list (issues 1 + 3). Removed the earlier
    `--fade-visibility-delay` custom property and the two-value `transition-delay`.
  - `.container[data-state='visible']`: added `visibility: visible`.
  - `.container[data-state='hidden']`: added `visibility: hidden` (the deferral is
    now handled by the discrete transition on `.container`, so no `calc(...)` here).
  - Added `@media (prefers-reduced-motion: reduce) { .container { transition: none } }`.
- `src/components/Fade/index.tsx`
  - Added `transitionRuntimeMs()` and wired it so a full `styles.transition`
    override's real running time drives `--fade-duration`, keeping the visibility
    deferral matched to the actual fade length (issue 3). No public API / prop /
    DOM / `data-*` / role / aria change; the no-`transition`-prop path is
    byte-for-byte unchanged.

## Stories updated

Extended `src/components/Fade/Fade.stories.tsx`. Storybook is this repo's
regression net **in two forms**: Chromatic visual diff *and* `play()` interaction
tests executed by `@storybook/test-runner` (a real browser). Because a Chromatic
pixel-diff cannot see either fix (`visibility: hidden` and the old `opacity: 0`
are pixel-identical, and Chromatic can't emulate `prefers-reduced-motion`), both
a11y stories now carry `play()` tests that assert the behavior directly:

- **`FocusAndScreenReaderSafety`** — a `Fade` (togglable `in`) wrapping a real
  `<button data-testid="fade-inner-button">`, flanked by "Before"/"After" buttons.
  Its `play()` asserts that when faded out the inner button is (a) absent from the
  accessibility tree (`queryByRole` → `null`) and (b) unfocusable (`.focus()` is a
  no-op), that it re-enters the tree + becomes focusable on fade-in, and that on
  fade-out it is dropped **only after** the deferred discrete-visibility swap
  completes. This FAILS against an `opacity: 0`-only Fade, so it genuinely gates
  the issue-1 fix rather than merely documenting it.
- **`ReducedMotion`** — a deliberately slow (1500ms) fade. Its `play()` asserts,
  via a CSSOM walk, that a `@media (prefers-reduced-motion: reduce)` rule setting
  `transition: none` on the container class exists (fails if the guard is removed),
  plus a computed-style check when the runner itself requests reduced motion. This
  replaces the earlier report's inaccurate "pins a Chromatic baseline" claim — the
  guard is now gated structurally, which is what a visual diff could not do.

## Deferred

None owned-directory work remains, and no shared/util/Field-Shell/global.css/barrel
change was required — all three review findings were fixed at root cause inside
`src/components/Fade/`.

**Non-blocking note (not a defect, no owner change):** the `disabled` prop is a
purely-visual dim with no interaction/AT effect (see "Color-alone state" above).
This is intentional and documented, and changing it would be a behavior change to
a public, additive-only prop. If a truly-disabled affordance is ever wanted, the
correct home is the interactive child (native `disabled` / `aria-disabled`), not
this role-less wrapper — so there is nothing to defer to another component owner.
