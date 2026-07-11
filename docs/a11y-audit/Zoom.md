# Zoom — a11y audit (2026-07-11)

**Status:** FIXED

**APG pattern:** None (visual transition primitive). Zoom is a generic wrapper
`<div data-component="Zoom">` that scale/opacity-animates arbitrary `children` between a
visible and a hidden state via the `in` prop. It is NOT a named WAI-ARIA APG widget and
deliberately imposes no role — it spreads `...restProps` (`React.HTMLAttributes<HTMLDivElement>`)
so a consumer can add whatever `role`/`aria-*` the wrapped content needs. The applicable
guidance is therefore the visibility-utility a11y contract (WCAG 1.3.1 / 2.4.3 / 4.1.2 for the
hidden state) plus the motion criterion (WCAG 2.3.3). This mirrors the sibling `Fade` component,
Zoom's structural twin, which already carries the identical treatment.

## Issues found

### 1. No `prefers-reduced-motion` handling — SERIOUS — WCAG 2.3.3 (Animation from Interactions) — FIXED
`Zoom.module.css:20-72` (pre-fix) animated `transform: scale()` + `opacity` on every
show/hide with no reduced-motion guard anywhere in the module. Users who request reduced
motion (vestibular/migraine triggers) got the full scale animation regardless.
**Fix:** added `@media (prefers-reduced-motion: reduce) { .zoomRoot { transition: none } }`
(`Zoom.module.css:116-120`). Content still shows/hides and is still correctly added to /
removed from the a11y tree — it just snaps instead of zooming.
**Pattern:** `missing-reduced-motion`.

### 2. Zoomed-out content stays in the accessibility tree and tab order — SERIOUS — WCAG 1.3.1 / 2.4.3 / 4.1.2 — FIXED
`Zoom.module.css:56-59` (pre-fix) hid the exited state with `opacity: 0` + `transform: scale()`
ONLY. Neither removes content from the accessibility tree or the tab order, so with `in={false}`
any interactive children (buttons, links, inputs) remained keyboard-focusable and screen-reader-announced
while visually gone — a keyboard user Tabs onto an invisible control (2.4.3 Focus Order),
and AT announces content that is not perceivably present (1.3.1 / 4.1.2).
**Fix:** the hidden state now also sets `visibility: hidden` (`Zoom.module.css:92-96`), which
removes descendants from BOTH the a11y tree and the tab order. `visibility` rides in the
transition list as a discrete property (`Zoom.module.css:55`) so the swap is DEFERRED to the end
of the zoom-OUT (visible→hidden holds `visible` for the full duration, flips only at the end) and
happens INSTANTLY on zoom-IN — the animation is preserved. The visible state and the disabled
state both pin `visibility: visible` (`Zoom.module.css:80, 107`) so a disabled+hidden combination
still shows its documented dimmed treatment.
**Pattern:** `opacity-hidden-content-still-focusable`.

## Hearing
CLEAN. Grepped the component for `new Audio` / `AudioContext` / `<audio>` / `<video>` /
`navigator.vibrate` / `new Notification` — no matches. Zoom conveys nothing via sound; no
media playback, so no caption/transcript surface applies (WCAG 1.2.x, 1.4.2 N/A).

## Reading & screen reader
- **Hidden-state removal (Issue 2)** — fixed as above; the primary reading/AT defect.
- **Accessible name / roles** — N/A. Zoom is a presentational wrapper with no interactive
  elements, headings, icons, or images of its own; it forces no role and passes `...restProps`
  through so consumers attach the correct semantics to the wrapped content. Nothing to name.
- **Focus visible** — N/A. The root is not focusable (no `tabIndex`, no interactive role);
  focusable children carry their own `:focus-visible` treatment. No overlay/dialog semantics,
  so no focus trap / Escape / `aria-modal` obligations apply.
- **Dynamic-update announcement** — intentionally NOT imposed. Whether appearing content should
  be announced (`role="status"`/`alert`/`aria-live`) depends entirely on what the consumer wraps;
  forcing a live region on every Zoom would over-announce. Correct to leave to the consumer.
- **Reduced-motion timing lockstep** — the TSX now emits `--zoom-duration` (new
  `transitionRuntimeMs` helper parses a caller-supplied full `transition` override, else uses
  `timeout`/`transitionDuration`, `index.tsx`) so the deferred visibility swap always matches the
  real animation length and never drops content from the a11y tree early.

## SEO semantics
CLEAN. Zoom renders a single `<div>` wrapper whose children are the consumer's SSR content; it
injects no primary content client-only, adds no heading/landmark/list/link/table markup of its own,
and (with the fix) all content is present and correctly exposed in the SSR'd HTML. A transition
primitive owns no heading level or landmark, so the `headingLevel`/`linkComponent`/landmark
additive-prop guidance does not apply here.

## Fixes applied
1. `Zoom.module.css` — added the reduced-motion media query (Issue 1); added `visibility`
   handling to base/visible/hidden/disabled states + a deferred discrete `visibility` transition
   segment governed by a new `--zoom-duration` token (Issue 2). Set `--zoom-duration: 0.5s` on the
   sacred theme so the no-styles sacred default stays aligned.
2. `index.tsx` — ported the `transitionRuntimeMs` helper from `Fade` and now emit `--zoom-duration`
   in both transition branches (caller-`transition` override → parsed runtime; computed branch →
   the same duration baked into `--zoom-transition`). The existing `--zoom-transition` computation
   (including the legacy "any styles object → 0.3s ease default" quirk) is untouched, so the
   animation itself keeps exact visual parity.

## Stories updated
Both new stories carry a `play` test (runs in `@storybook/test-runner`, a real browser) — the only
regression tests in this repo — and each FAILS against the pre-fix component, so they truly protect
the fixes (Chromatic pixel-diffs cannot see either property: `visibility:hidden` vs `opacity:0` are
pixel-identical, and reduced-motion cannot be emulated in a snapshot).
- `FocusAndScreenReaderSafety` — Tab-order + a11y-tree proof for Issue 2: asserts the inner button
  is out of the a11y tree (`queryByRole` → null) and unfocusable while zoomed out, re-enters on
  zoom-in, and drops again on the deferred zoom-out.
- `ReducedMotion` — Issue 1 guard: walks the CSSOM to assert an
  `@media (prefers-reduced-motion: reduce)` rule zeroes the transition on `.zoomRoot`, plus a
  behavioral `transitionProperty === 'none'` check when the runner requests reduced motion.

## Deferred
- **`data-disabled` conveys nothing to AT (minor).** The `disabled` treatment is a purely-visual
  `opacity: 0.6` dim plus the `data-disabled` test attribute (`index.tsx`); it is NOT an ARIA
  attribute and Zoom does not actually disable child interactivity (no `pointer-events`/`inert`).
  This is consistent with the prop's documented "purely visual" contract and Zoom being a wrapper,
  not a form control, so no fix was applied. If a future consumer needs a genuinely inert disabled
  region, that is a semantic/API change (would need an owner decision on adding `inert` /
  `aria-disabled`), not an in-scope bug. No cross-file change required — nothing deferred to a
  file outside this component's ownership.
