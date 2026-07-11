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
| 4 | Minor | 2.1.1 Keyboard (A) | `src/components/AppBar/AppBar.module.css:138`; `index.tsx:268` | Disabled-state keyboard/AT asymmetry. `styles.disabled` applied only `pointer-events: none` (blocks pointer + the bar's own onClick), but children stayed Tab-focusable and keyboard-activatable — a "disabled" bar was fully operable by keyboard/AT users while dead to mouse users (the pointer-events anti-pattern). **Fixed** by adding `inert={isDisabled \|\| undefined}` to the root `<header>` (same `inert` isolation precedent as `Drawer`), so disabled means disabled-for-everyone. (Was previously Deferred as a "design decision"; now fixed — additive, non-breaking.) | **FIXED** |
| 5 | Minor | 1.3.1 Info & Relationships (A); 4.1.2 Name, Role, Value (A) | `src/components/AppBar/index.tsx` props/render | `role="banner"` was emitted unconditionally with no opt-out. For a secondary/nested app bar this forces a banner landmark exactly where the native `<header>` would (correctly) degrade to generic, yielding duplicate/nested banner landmarks (axe `landmark-banner-is-top-level` / `landmark-no-duplicate-banner`) that `ariaLabel` only partly mitigates. **Fixed** with a new additive `landmark?: 'banner' \| 'none'` prop; `'none'` drops the explicit role so the native `<header>` degrades. Default `'banner'` preserves existing behavior + the machine-test role contract. | **FIXED** |

### Audited and NOT a defect (no change)
- **Hearing-impaired (WCAG 1.2.x, 1.4.2):** CLEAN. No `Audio`/`AudioContext`/`<audio>`/`<video>`/
  `navigator.vibrate`/playback anywhere in the component; the sacred shimmer is purely visual and
  carries no information. Nothing is conveyed by sound.
- **Decorative shimmer** already carries `aria-hidden="true"` (`index.tsx:248`) — correctly hidden
  from AT.
- **Disabled state is not color-alone (1.4.1):** conveyed programmatically via `data-disabled` /
  `data-state="disabled"`, functionally via `pointer-events: none` **plus `inert`** (issue #4), and
  visually via a per-theme muted text token that the CSS comments document as ≥4.5:1 on each theme
  surface (a prior audit already replaced a contrast-breaking container `opacity`).
- **`onClick` on the banner** is an optional convenience passthrough, not the primary interaction
  (the interactive children are the real controls). It is intentionally NOT made keyboard-focusable
  — adding `tabindex`/keydown to a landmark region would be semantically wrong. See Deferred.
- **`role="banner"` is the DEFAULT, now with an opt-out (issue #5):** emitted by default
  (`landmark='banner'`) — intentionally redundant with the native `<header>`, preserving the
  machine-test selector contract and guaranteeing the banner role even if a consumer nests the
  `<header>` inside sectioning content. A secondary/nested bar can pass `landmark='none'` to drop the
  explicit role and let the native element degrade, avoiding duplicate/non-top-level banner
  landmarks. eslint (incl. the Next.js jsx-a11y set) does not flag it.

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
4. `index.tsx` — added **`inert={isDisabled || undefined}`** to the root `<header>` (issue #4): the
   disabled state now removes the whole subtree from the tab order and from pointer/AT reach, so a
   "disabled" AppBar is disabled for keyboard/AT users too, not only for the mouse. `undefined` (not
   `false`) is rendered when enabled so the attribute is simply absent. No existing attribute removed;
   markup change is the added `inert` attribute only. `AppBar.module.css` disabled-block comment
   updated to note `inert` provides the keyboard/AT half of the symmetry.
5. `index.tsx` — added additive **`landmark?: 'banner' | 'none'`** prop (JSDoc'd, default `'banner'`)
   and made the role conditional: `role={landmark === 'none' ? undefined : 'banner'}` (issue #5).
   `'none'` suppresses the explicit banner role for a secondary/nested bar so the native `<header>`
   degrades instead of forcing a duplicate/non-top-level banner landmark. The landmark state is also
   exposed as an additive `data-landmark` attribute (consistent with the component's other `data-*`
   state hooks). Default `'banner'` keeps every existing consumer — and the machine-test `role`
   contract — byte-for-byte unchanged.

## Stories updated
- Added **`Accessibility/Labelled Landmarks`** (`AppBar.stories.tsx`) — renders two stacked
  AppBars with distinct `ariaLabel` values, exercising the new `ariaLabel` → `aria-label` behavior
  and the native `<header>` banner landmark. This is the regression test for issues #1 and #2.
- Added **`Accessibility/Container Animation (Reduced Motion)`** (`AppBar.stories.tsx`) — renders an
  AppBar with `styles.containerAnimation` set to a looping gold glow (a global `@keyframes` declared
  in the story, since CSS-module keyframe names are scoped and callers supply their own). This
  exercises the previously-storyless `containerAnimation` code path and is the regression test for
  issue #3: under an emulated reduced-motion preference the `.container { animation: none }` rule
  suppresses the glow, and reverting that CSS line would change this story's reduced-motion baseline.
  (Supersedes the earlier note that issue #3 had "no rendered JS state to assert" — the
  container-animation prop path is now explicitly rendered.)
- Added **`Accessibility/Disabled Is Inert`** (`AppBar.stories.tsx`) — stacks an enabled and a
  disabled AppBar, each with REAL interactive `<button>` children. Regression test for issue #4:
  the disabled bar's buttons are removed from the tab order and pointer/AT reach via `inert`, while
  the enabled control bar's buttons remain focusable. Removing `inert={isDisabled || undefined}` in
  `index.tsx` would make the disabled buttons Tab-reachable again and change this baseline.
- Added **`Accessibility/Secondary Bar (No Banner Landmark)`** (`AppBar.stories.tsx`) — a default
  `banner` primary bar plus a `landmark='none'` secondary bar nested inside `<main>`. Regression test
  for issue #5: the page exposes exactly one banner landmark; reverting the conditional `role` would
  re-emit `role="banner"` on the secondary bar (axe duplicate-banner) and change this baseline.

## Deferred
- **`onClick` keyboard/AT parity (component-owned, intentionally not "fixed" — now documented).**
  The optional `onClick` fires on the whole banner region but the region is not keyboard-focusable,
  so a handler wired there is pointer-only (WCAG 2.1.1). The landmark is left non-focusable on
  purpose: the primary interactions are the AppBar's children (real buttons/links), and making a
  `role="banner"` landmark itself focusable+activatable would be a semantic anti-pattern. The
  residual limitation is now surfaced to consumers via an explicit ⚠️ JSDoc warning on the `onClick`
  prop (`index.tsx`), directing must-be-keyboard-operable actions to a real interactive child and
  reserving `onClick` for redundant pointer conveniences. No DOM/behavior change (non-breaking); the
  API would need to be redefined to make the bar itself a control before `onClick` could be made
  keyboard-operable.
- ~~**Disabled state not surfaced to AT.**~~ **RESOLVED as issue #4** — the disabled bar now carries
  `inert` on the root `<header>`, so children are removed from the tab order and from pointer/AT reach
  ("disabled" is disabled-for-everyone). This was the previously-deferred "design decision"; the fix
  is additive and non-breaking, so it was taken.
