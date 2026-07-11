# AppBar — a11y audit (2026-07-11)

**Status:** FIXED

**APG pattern:** Landmark region — [`banner`](https://www.w3.org/WAI/ARIA/apg/patterns/landmarks/examples/banner.html)
(the site header / top app bar). Not an interactive widget pattern: the AppBar is a
presentational container whose children (nav links, search, actions) own their own roles and
keyboard behavior. There is therefore no arrow-key / roving-tabindex interaction table to
satisfy at the AppBar level; the accessibility obligations are (a) exposing the correct
landmark with a native element, (b) allowing that landmark to be named, and (c) respecting
reduced-motion for its decorative animation.

## Issues found

| # | Severity | WCAG 2.2 | Location | Issue | Status |
|---|----------|----------|----------|-------|--------|
| 1 | Moderate | 1.3.1 Info & Relationships (A); 4.1.2 Name, Role, Value (A) | `src/components/AppBar/index.tsx:233` (pre-fix) | Root rendered as a `<div role="banner">` instead of the native `<header>` element. The banner landmark reached AT via the explicit role, but the SSR/crawled HTML carried no semantic sectioning element — out of step with the library's own landmark convention (`Breadcrumb`/`Pagination` render native `<nav>`). | **FIXED** |
| 2 | Minor | 1.3.1 Info & Relationships (A); 2.4.1 Bypass Blocks (A) | `src/components/AppBar/index.tsx` props (pre-fix) | No way to give the `banner` landmark an accessible name. When a page renders more than one app bar/banner, assistive-tech users get identical, indistinguishable entries in the landmarks list. `Pagination` (`ariaLabel`) and `Breadcrumb` (`aria-label`) already expose this; AppBar did not. | **FIXED** |
| 3 | Minor | 2.3.3 Animation from Interactions (AAA) | `src/components/AppBar/AppBar.module.css:191` (pre-fix) | The `prefers-reduced-motion: reduce` block only neutralized `.shimmer`. The `.container` applies `animation: var(--appbar-container-animation)`, which a caller can set to a looping animation (e.g. a `sacredGlow`), and that was not suppressed for reduced-motion users. | **FIXED** |

### Audited and NOT a defect (no change)
- **Hearing-impaired (WCAG 1.2.x, 1.4.2):** CLEAN. No `Audio`/`AudioContext`/`<audio>`/`<video>`/
  `navigator.vibrate`/playback anywhere in the component; the sacred shimmer is purely visual and
  carries no information. Nothing is conveyed by sound.
- **Decorative shimmer** already carries `aria-hidden="true"` (`index.tsx:248`) — correctly hidden
  from AT.
- **Disabled state is not color-alone (1.4.1):** conveyed programmatically via `data-disabled` /
  `data-state="disabled"`, functionally via `pointer-events: none`, and visually via a per-theme
  muted text token that the CSS comments document as ≥4.5:1 on each theme surface (a prior audit
  already replaced a contrast-breaking container `opacity`). Left as-is.
- **`onClick` on the banner** is an optional convenience passthrough, not the primary interaction
  (the interactive children are the real controls). It is intentionally NOT made keyboard-focusable
  — adding `tabindex`/keydown to a landmark region would be semantically wrong. See Deferred.
- **`role="banner"` kept on the `<header>`:** intentionally redundant. Preserves the machine-test
  selector contract and guarantees the banner role even if a consumer nests the `<header>` inside
  sectioning content (where `<header>`'s implicit role degrades to generic). eslint (incl. the
  Next.js jsx-a11y set) does not flag it.

## Hearing
No audio/media/haptic output exists in this component (grep-verified). No captions/transcripts
apply. No status is ever conveyed audio-only. Section clean; no changes required.

## Reading & screen reader
- **Landmark now native:** root renders `<header role="banner" aria-label={ariaLabel}>`. Native
  sectioning element + preserved explicit role = the banner landmark is present for AT and in the
  raw SSR HTML.
- **Landmark is nameable:** new additive `ariaLabel?: string` prop maps to `aria-label`. Omitted →
  attribute is not emitted (React drops `undefined`), so single-banner pages are unaffected;
  multi-banner pages can now disambiguate.
- **No accessible-name gaps introduced:** the AppBar itself has no icon-only buttons or `<img>`/
  `<svg>`; children supply their own names.
- **Keyboard:** landmark pattern has no widget keyboard contract; children remain natively
  focusable and Tab order is untouched.

## SEO semantics
- App bar now emits a real `<header>` landmark element — crawled/SSR HTML gains the semantic
  sectioning element it previously lacked, matching `Breadcrumb`/`Pagination`'s native `<nav>`.
- The component renders no heading text of its own (headings/links are consumer-supplied children),
  so no `headingLevel`/`<a href>` obligations arise at this level.
- All meaningful markup is server-rendered; no client-only content injection (the shimmer is
  decorative and `aria-hidden`).

## Fixes applied
1. `index.tsx` — changed the root element from `<div>` to native **`<header>`** (markup change:
   `<div …>` → `<header …>`), keeping every existing `data-*`, `role="banner"`, `style`, and
   `onClick` attribute unchanged. Internal `handleClick` retyped to `React.MouseEvent<HTMLElement>`
   with a documented cast to the public `HTMLDivElement` event type, so the public `onClick` prop
   signature is unchanged (additive-only API).
2. `index.tsx` — added additive **`ariaLabel?: string`** prop (JSDoc'd), wired to
   `aria-label={ariaLabel}` on the header.
3. `AppBar.module.css` — extended the `@media (prefers-reduced-motion: reduce)` block to also set
   `.container { animation: none; }`, suppressing any caller-supplied looping container animation.
   State transitions left intact (short, non-distracting, out of scope for 2.3.3).

## Stories updated
- Added **`Accessibility/Labelled Landmarks`** (`AppBar.stories.tsx`) — renders two stacked
  AppBars with distinct `ariaLabel` values, exercising the new `ariaLabel` → `aria-label` behavior
  and the native `<header>` banner landmark. This is the regression test for issues #1 and #2.
- Reduced-motion (issue #3) is a media-query CSS rule with no rendered JS state to assert via a
  story; it is covered structurally by the CSS + Storybook's a11y addon running under a
  reduced-motion preference.

## Deferred
- **`onClick` keyboard/AT parity (component-owned, intentionally not "fixed").** The optional
  `onClick` fires on the whole banner region but the region is not keyboard-focusable. This is left
  as-is on purpose: the primary interactions are the AppBar's children (real buttons/links), and
  making a `role="banner"` landmark itself focusable+activatable would be a semantic anti-pattern.
  No change recommended unless the API is redefined to make the bar itself a control.
- **Disabled state not surfaced to AT (shared-concept, not AppBar-owned).** When `styles.disabled`
  is set, the bar suppresses its own `onClick` and dims inherited text, but children remain
  keyboard-focusable and activatable (only `pointer-events` is removed). There is no meaningful
  ARIA "disabled" for a landmark region, so no fix is applied. If a future requirement needs the
  whole bar inert for keyboard users too, that is a design decision (e.g. an `inert` attribute on
  the container) — out of scope for a non-breaking a11y pass.
