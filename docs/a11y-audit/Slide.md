# Slide — a11y audit (2026-07-11)

**Status: FIXED**

> Re-audit (2026-07-11, owner pass): re-verified the full checklist against the prior fixes
> (Issues #1–#3, all confirmed holding). Found and fixed one residual timing gap in the
> delayed-inert exit (Issue #4). Hearing / SEO-semantics / accessible-name / focus-visible /
> APG-pattern surfaces re-confirmed clean (see "Non-issues"). No deferred items.

## Component summary

`Slide` (`src/components/Slide/index.tsx`) is a purely presentational transform-based
transition wrapper. It renders a single `<div data-component="Slide">` around
`children` and slides them in from / out to one of four edges (up/down/left/right)
using a CSS `transform` transition. Visibility is toggled by the `.in` class
(`styles.in !== false`); theme (`light`/`dark`/`sacred`) only changes the default
transition timing. Caller timing overrides (`timeout` / `transitionDuration` /
`transitionTimingFunction` / `transition` / `transitionDelay`) pass through **only** as
CSS custom properties (`--slide-duration` / `--slide-timing` / `--slide-transition` /
`--slide-delay`) — never as inline `transition`/`transition-delay` properties (see Issue #3).
No interactive controls, no roles, no icons, no forms, no audio/media of its own.

## APG pattern

**None (no WAI-ARIA widget pattern applies).** Slide is a generic animation/transition
wrapper, not an interactive widget (accordion/dialog/tabs/etc.). The relevant standard is
therefore not an APG keyboard/role contract but **WCAG 2.3.3 (motion)** plus the
general perceivability/operability rules for content that is programmatically shown/hidden
(**1.3.1 / 2.4.3 / 4.1.2**). Because it wraps arbitrary consumer content, ARIA semantics
(role/aria-live/heading level) correctly remain the consumer's responsibility and are
forwarded via `...restProps` — Slide must not impose them. The `<div>` element is the
semantically correct neutral wrapper; no element change was warranted.

## Issues found

### 1. No reduced-motion support — SERIOUS — WCAG 2.3.3 (Animation from Interactions) — FIXED
`Slide.module.css` (old) declared `transition: transform var(--slide-duration) var(--slide-timing)`
with **no** `@media (prefers-reduced-motion: reduce)` guard anywhere in the file. Every
show/hide animated a translate, ignoring a user's OS "reduce motion" preference — a
vestibular-disorder trigger. Every other animated component in the library
(Drawer/Alert/Accordion/Card/Button/…) already ships this guard; Slide was the gap.
Pattern: `missing-reduced-motion`.
**Fix:** appended a `@media (prefers-reduced-motion: reduce) { .root { transition: none !important } }`
block (`Slide.module.css`, after the disabled rule). Content now snaps in/out instantly for
reduced-motion users while still toggling visibility correctly. The `!important` is kept so the
preference decisively wins over both the base `.root` transition and the higher-specificity
`.root[data-disabled='true']` rule regardless of source order. (Historical note: the `!important`
was originally required to beat the caller-supplied **inline** `transition`/`transitionDelay`
styles; those are no longer emitted inline — see Issue #3 — so it now only guards the CSS-rule
specificity cases, but is retained defensively.)

### 2. Slid-out content stays keyboard-focusable and screen-reader-announced — SERIOUS — WCAG 1.3.1, 2.4.3, 4.1.2 — FIXED
When `in={false}`, the old CSS hid content **only** via `transform: translate…(-/+100%)`.
A transform moves content off-screen visually but leaves it fully in the DOM, in the
**accessibility tree**, and in the **keyboard tab order**. A keyboard user tabbing through a
page with a slid-out `Slide` would land on invisible, off-screen controls (e.g. a
`<button>`/`<a>` inside the panel), and a screen reader would announce hidden content — a
classic focus-order / name-role-value defect. (Reproducible by placing a focusable `<a>`
inside a slid-out Slide and pressing Tab — the `HiddenContentIsInert` story pins exactly this.)
Pattern: `hidden-content-still-focusable`.
**Fix:** the hidden state now also carries `visibility: hidden` (removes content from both the
a11y tree and tab order), and `.root.in` carries `visibility: visible`. The `visibility`
transition is **delayed by `--slide-visibility-delay` (defaults to `--slide-duration`) on the
way out** so the exit animation is still seen before the content becomes inert, and the delay
flips to `0s` on the way in (`.root.in`) so it is exposed as it slides in. `visibility` preserves
the layout box, matching `transform`'s no-reflow behaviour — no visual regression for the common
`overflow:hidden` container usage.

### 3. Caller timing override (`styles.transition` / `styles.transitionDelay`) cut the exit animation short and defeated the delayed-inert exit — SERIOUS — WCAG 1.3.1, 2.4.3, 4.1.2 — FIXED
The Issue-#2 fix keeps slid-out content perceivable/announced during the exit by composing a
two-part transition in `.root`: the transform half **plus** `visibility 0s linear var(--slide-duration)`.
But a consumer supplying their own timing hit a defeat path: `index.tsx` emitted a full
`styles.transition` shorthand as an **inline `transition` property** (and `styles.transitionDelay`
as inline `transition-delay`). An inline `transition` shorthand *replaces the whole property*,
so it stripped the `visibility 0s linear var(--slide-duration)` half. Result for that override
path: on slide-OUT the content flipped to `visibility:hidden` **instantly** — the exit animation
was cut short (content vanished rather than sliding out) and the content left the a11y tree +
tab order immediately instead of after the animation, exactly the perceivability/inertness
regression Issue #2 was meant to prevent. Pattern: `hidden-content-still-focusable`
(same class — an animated hide whose "stay perceivable until done" guarantee is silently
stripped by a caller override).
**Fix:** caller timing overrides now feed **CSS custom properties instead of inline
`transition`/`transition-delay`** — a full shorthand → `--slide-transition`, and
`transitionDelay` → `--slide-delay`. The `.root` `transition` reads
`var(--slide-transition, transform … var(--slide-delay,0s)), visibility 0s linear var(--slide-visibility-delay)`,
so the stylesheet **always owns the visibility half** no matter what the caller overrides. The
exit animation now plays in full — and the inner content stays focusable/announced until it
finishes — for the base path, the per-token override path, AND the full-`transition`/`transitionDelay`
override paths. The `ExitAnimationSurvivesTimingOverride` story pins both override paths against
a real focusable `<a>`.

### 4. Delayed-inert exit went inert `delay` ms EARLY — content left the a11y tree while still visibly sliding — MINOR — WCAG 1.3.1, 4.1.2 — FIXED
The Issue-#2/#3 "delayed-inert" exit keeps slid-out content perceivable/announced until the exit
animation finishes by delaying the `visibility:hidden` flip via `--slide-visibility-delay`. That
delay was defined as `var(--slide-duration)` — the slide **duration** only. But the transform half
is `transform var(--slide-duration) var(--slide-timing) var(--slide-delay, 0s)`, so when a caller
supplies a `transitionDelay` the exit slide does not *complete* until `delay + duration`. With the
visibility flip pinned to `duration` alone, the content went `visibility:hidden` — i.e. left the
accessibility tree AND the keyboard tab order — `delay` ms **before** the slide visually finished.
For that window the content was still on-screen and mid-slide for sighted users but already gone
for screen-reader / keyboard users (a transient perceivability mismatch), and the
`ExitAnimationSurvivesTimingOverride` RIGHT panel (`timeout: 600, transitionDelay: '150ms'`, slide
completes at 750ms) flipped inert at 600ms — 150ms early — so its documented "animates fully before
the inner link leaves the tab order" claim was not actually met. Pattern: `hidden-content-inert-timing`
(a cross-component class: any animated-hide primitive — Drawer/Grow/Fade/Collapse/Zoom — whose
inert-flip must track the FULL transform completion time, not just its duration).
**Fix:** `--slide-visibility-delay` now equals `calc(var(--slide-duration) + var(--slide-delay, 0s))`,
so the inert flip tracks the full `delay + duration` completion. The RIGHT panel now goes inert at
exactly 750ms. The `.root.in` entrance override (`--slide-visibility-delay: 0s`) is unaffected
(content is exposed instantly on the way IN). No regression for the common no-delay case
(`calc(duration + 0s) === duration`). **Escape-hatch limitation (documented, not a defect):** a full
`transition` shorthand routed via `--slide-transition` carries its own opaque duration/delay that CSS
cannot read back, so for that path the inert timing falls back to the theme-default duration (the
delay still *survives* — Issue #3 — it just isn't the caller's exact value). The recommended per-token
override path (`timeout` / `transitionDuration` / `transitionDelay`) tracks exactly.

## Non-issues considered and dismissed

- **Disabled state uses `opacity: 0.6`** (`Slide.module.css`). This is a purely decorative
  "freeze the animation + dim" state on a non-interactive wrapper, not a form-control disabled
  state, and is also carried programmatically by `data-disabled="true"`. No AT-facing semantic
  (e.g. `aria-disabled`) is appropriate on a generic wrapper — imposing one would be wrong. Not
  a color-only-state defect. No change.
- **`<div>` wrapper / SEO semantics.** Slide wraps arbitrary content; a neutral `<div>` is
  correct. Heading levels, landmarks, and links belong to the wrapped content and are the
  consumer's responsibility (forwarded via `...restProps`). No `nonsemantic-heading` /
  landmark issue. No change.
- **Focus-visible.** Slide is not focusable itself (no `tabIndex`/handlers by default), so it
  needs no `:focus-visible` treatment; its children own their own focus styling. No change.
- **Hearing (WCAG 1.2.x / 1.4.2).** Grepped the directory for
  `new Audio|AudioContext|<audio|<video|navigator.vibrate` — no matches. No audio-conveyed
  information exists. N/A.
- **Status announcement / aria-live.** Slide is a generic wrapper; it must not impose an
  `aria-live` region (that would double-announce arbitrary content). A consumer using Slide for
  a snackbar/alert is responsible for the live region on their content. No change.

## Fixes applied

All within `src/components/Slide/` (owned):
- `Slide.module.css` —
  - added `@media (prefers-reduced-motion: reduce)` neutralizing the transition (Issue #1);
  - added `visibility: hidden` + delayed visibility transition to `.root` and
    `visibility: visible` (delay → `0s`) to the `.root.in` group so slid-out content is inert
    to AT and keyboard (Issue #2);
  - split the transition into a caller-overridable transform half
    (`var(--slide-transition, transform var(--slide-duration) var(--slide-timing) var(--slide-delay,0s))`)
    and a stylesheet-owned visibility half (`visibility 0s linear var(--slide-visibility-delay)`),
    with `--slide-visibility-delay` and flipping to `0s` in `.root.in`, so no caller timing
    override can strip the delayed-inert exit (Issue #3);
  - changed `--slide-visibility-delay` from `var(--slide-duration)` to
    `calc(var(--slide-duration) + var(--slide-delay, 0s))` so the inert flip tracks the FULL
    transform completion (delay + duration) instead of going inert `delay` ms early (Issue #4).
- `index.tsx` — caller timing overrides now emit CSS custom properties only: a full `transition`
  shorthand → `--slide-transition`; `transitionDelay` → `--slide-delay` (Issue #3). Previously
  these were emitted as inline `transition` / `transition-delay` properties.
- Markup changes to rendered DOM: **none** — all fixes are CSS + custom-property plumbing (no
  element, role, attribute, or prop changes; the public API and every existing
  `data-*`/`data-component` selector are untouched). `styles.transition` / `styles.transitionDelay`
  keep their exact public meaning; only the internal delivery mechanism (CSS var vs inline
  property) changed.

## Stories updated

`Slide.stories.tsx` — new stories (repo convention: stories are the only regression tests):
- **`HiddenContentIsInert`** — wraps a real focusable `<a>` inside the Slide with an
  in/out toggle; exercises that the inner link leaves the tab order and a11y tree when slid
  out (fails the old transform-only baseline, where the link stayed focusable) (Issue #2).
- **`ReducedMotion`** — a 600ms slide that, under OS "reduce motion", snaps instead of sliding;
  documents the `prefers-reduced-motion` neutralization (Issue #1).
- **`ExitAnimationSurvivesTimingOverride`** — two panels, each wrapping a real focusable `<a>`:
  the left overrides the full `transition` shorthand (800ms), the right overrides `transitionDelay`.
  Both keep their delayed-inert exit (a caller timing override no longer strips the visibility
  delay — Issue #3). Extended for Issue #4: its JSDoc + footer now pin that the per-token RIGHT
  panel (`timeout: 600, transitionDelay: '150ms'`) goes inert at **exactly** 750ms (its full
  `delay + duration` completion) rather than 150ms early at 600ms, and document that the
  full-`transition`-shorthand LEFT panel keeps a surviving delay at the theme default (the
  escape-hatch limitation). The RIGHT panel is the regression exercise for Issue #4.

## Deferred

None. All three issues were root-caused and fixed entirely within the owned `src/components/Slide/`
directory. No shared-file (Field/Shell, `src/styles/global.css`, barrel, `package.json`) changes
were required.
