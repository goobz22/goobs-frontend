# Slide — a11y audit (2026-07-11)

**Status: FIXED**

## Component summary

`Slide` (`src/components/Slide/index.tsx`) is a purely presentational transform-based
transition wrapper. It renders a single `<div data-component="Slide">` around
`children` and slides them in from / out to one of four edges (up/down/left/right)
using a CSS `transform` transition. Visibility is toggled by the `.in` class
(`styles.in !== false`); theme (`light`/`dark`/`sacred`) only changes the default
transition timing; caller timing overrides pass through as the `--slide-duration` /
`--slide-timing` custom properties (or an inline `transition` shorthand). No interactive
controls, no roles, no icons, no forms, no audio/media of its own.

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
`Slide.module.css:33` (old) declared `transition: transform var(--slide-duration) var(--slide-timing)`
with **no** `@media (prefers-reduced-motion: reduce)` guard anywhere in the file. Every
show/hide animated a translate, ignoring a user's OS "reduce motion" preference — a
vestibular-disorder trigger. Every other animated component in the library
(Drawer/Alert/Accordion/Card/Button/…) already ships this guard; Slide was the gap.
Pattern: `missing-reduced-motion`.
**Fix:** appended a `@media (prefers-reduced-motion: reduce) { .root { transition: none !important } }`
block (`Slide.module.css`, after the disabled rule). `!important` is required here because
the caller-supplied full `transition` shorthand and `transitionDelay` are emitted as **inline**
styles from `index.tsx` and would otherwise beat a media query; `!important` guarantees the
preference wins in all cases. Content now snaps in/out instantly for reduced-motion users
while still toggling visibility correctly.

### 2. Slid-out content stays keyboard-focusable and screen-reader-announced — SERIOUS — WCAG 1.3.1, 2.4.3, 4.1.2 — FIXED
When `in={false}`, the old CSS hid content **only** via `transform: translate…(-/+100%)`
(`Slide.module.css:32,55-69`). A transform moves content off-screen visually but leaves it
fully in the DOM, in the **accessibility tree**, and in the **keyboard tab order**. A
keyboard user tabbing through a page with a slid-out `Slide` would land on invisible,
off-screen controls (e.g. a `<button>`/`<a>` inside the panel), and a screen reader would
announce hidden content — a classic focus-order / name-role-value defect. (Reproducible by
placing a focusable `<a>` inside a slid-out Slide and pressing Tab — the new
`HiddenContentIsInert` story pins exactly this.)
Pattern: `hidden-content-still-focusable`.
**Fix:** the hidden state now also carries `visibility: hidden` (removes content from both the
a11y tree and tab order), and `.root.in` carries `visibility: visible`. The `visibility`
transition is **delayed by `--slide-duration` on the way out** (`visibility 0s linear var(--slide-duration)`)
so the exit animation is still seen before the content becomes inert, and flips **instantly on
the way in** (`visibility 0s`) so it is exposed as it slides in. `visibility` preserves the
layout box, matching `transform`'s no-reflow behaviour — no visual regression for the common
`overflow:hidden` container usage. Semantically sound: `styles.in === false` means "hidden",
and hidden content should not be announced or focusable.

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
- `Slide.module.css` — added `@media (prefers-reduced-motion: reduce)` neutralizing the
  transition (`!important`, to beat inline `transition`/`transitionDelay`); added
  `visibility: hidden`+delayed transition to `.root` and `visibility: visible`+instant
  transition to the `.root.in` group so slid-out content is inert to AT and keyboard.
- Markup changes to rendered DOM: **none** — both fixes are CSS-only (no element, role,
  attribute, or prop changes; the public API and every existing `data-*`/`data-component`
  selector are untouched).

## Stories updated

`Slide.stories.tsx` — two new stories (repo convention: stories are the only regression tests):
- **`HiddenContentIsInert`** — wraps a real focusable `<a>` inside the Slide with an
  in/out toggle; documents and exercises that the inner link leaves the tab order and a11y
  tree when slid out (fails the old transform-only baseline, where the link stayed focusable).
- **`ReducedMotion`** — a 600ms slide that, under OS "reduce motion", snaps instead of sliding;
  documents the `prefers-reduced-motion` neutralization.

## Deferred

None. Both issues were root-caused and fixed entirely within the owned `src/components/Slide/`
directory. No shared-file (Field/Shell, `src/styles/global.css`, barrel) changes were required.
