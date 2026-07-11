# Breadcrumb — a11y audit (2026-07-11)

**Status:** FIXED
**APG pattern:** [Breadcrumb](https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/) — a `nav`
landmark labelled "breadcrumb" wrapping an ordered list of links, the last of which represents
the current page and carries `aria-current="page"`; separators are decorative and hidden from AT.

The component already had the structural bones right: `<nav aria-label>` + `<ol>`/`<li>` +
real `<a href>` links (crawlable, SSR-present). The gaps were the ARIA state on the current
page, decorative-separator exposure, a non-semantic interactive fallback, and missing
focus/motion affordances.

## Issues found

| # | Severity | WCAG | Location | Issue | Status |
|---|----------|------|----------|-------|--------|
| 1 | Serious | 4.1.2 Name, Role, Value (A) | `index.tsx:116-165` (active branch) | Current/active crumb rendered as a plain `<span>` with **no `aria-current="page"`** — screen readers could not identify which crumb is the current page. This is the defining state of the APG breadcrumb pattern. | FIXED |
| 2 | Moderate | 1.3.1 Info & Relationships (A) | `index.tsx:168-178` (separator) | `/` (or custom icon) separators had **no `aria-hidden`** — a screen reader announced "Home slash Category slash…" (or the icon's name) between every crumb, cluttering the accessible name of the trail. | FIXED |
| 3 | Moderate | 4.1.2 (A), 2.1.1 Keyboard (A) | `index.tsx:143-161` (span fallback) | A crumb with `onClick` but no `href` rendered as a `<span role="button" tabIndex={0}>` wired with the **deprecated `onKeyPress`**; `onKeyPress` never `preventDefault`ed Space, so activating with Space also scrolled the page. Non-semantic interactive element. | FIXED (now a native `<button type="button">`) |
| 4 | Moderate | 2.4.7 Focus Visible (AA) | `Breadcrumb.module.css` (no rule) | No `:focus-visible` treatment in the module — keyboard focus on a link/button relied entirely on the UA default, which is easily lost against the sacred gold-on-dark surface. | FIXED |
| 5 | Minor | 2.3.3 Animation from Interactions (AAA) | `Breadcrumb.module.css:101,110-116` | `.item` hover uses a 400ms transition + `translateY(-1px)` lift with **no `prefers-reduced-motion` guard**. | FIXED |

No hearing/media issues: grep of the component for `Audio`/`AudioContext`/`<audio>`/`<video>`/
`navigator.vibrate` found nothing — Breadcrumb conveys no information by sound.

## Adversarial-review findings (2026-07-11) — resolved

| # | Severity | Finding | Resolution | Status |
|---|----------|---------|------------|--------|
| R1 | Minor | The Issue-4 `:focus-visible` ring had **no automated coverage** — no story rendered a crumb in the focused state (no `play`/pseudo-state), so Chromatic would never capture the ring; the report's "exercising … focus-visible" was only a doc note. | Added `play` functions that Tab keyboard focus onto a crumb (`CurrentPageAndSeparators` → first link; `InteractiveCallback` → first button), matching the repo's established focus-ring capture convention (`Button.stories` `SelectedTogglePressed`). Keyboard-initiated Tab makes `:focus-visible` an actually-rendered, Chromatic-captured state, and `toHaveFocus()` pins it. | FIXED |
| R2 | Minor | Behavioral regression: an `isActive`+`onClick` crumb rendered as a mouse-only `<span aria-current onClick>` — clickable with a mouse but **not keyboard-focusable/operable** (a WCAG 2.1.1 gap vs. the pre-a11y-pass code, which made ANY `onClick` crumb keyboard-operable), and it was undocumented. | Root-cause fix in `index.tsx`: an `isActive` crumb WITH an `onClick` now renders as a native `<button type="button" aria-current="page">` — keyboard-focusable + Enter/Space-operable, matching its mouse operability, while preserving `aria-current="page"` and the `onClick` callback. An `isActive` crumb with no `onClick` stays non-interactive `<span aria-current="page">` (APG-ideal). New `ActiveCrumbWithOnClick` story + `play` pins keyboard activation; documented in Markup changes. | FIXED |

## Hearing

Clean. The component plays no audio and vibrates nothing; all state (current page, hover,
active) is visual + now programmatic. No captions/transcript surface is applicable.

## Reading & screen reader

- **Current page (Issue 1):** the active crumb now emits `aria-current="page"` and stays
  non-navigable text (parity with the previous behaviour — active crumbs were never links).
  Current-page state is therefore conveyed three ways: programmatic (`aria-current`), weight
  (semibold vs regular), and colour — never colour alone (1.4.1 satisfied).
- **Separators (Issue 2):** every separator span (text `/` or a custom `ChevronRightIcon`) is
  now `aria-hidden="true"`, so the trail reads as "Home, Category, Subcategory, Current Page,
  current page" without interstitial noise.
- **Interactive crumb (Issue 3):** an `onClick`-only crumb is now a native `<button>`, giving
  it an accessible name from its text, platform focusability, and Enter/Space activation — the
  deprecated `onKeyPress` hack (and its Space-scrolls-the-page bug) is gone.
- **Interactive current page (review Finding 2):** a crumb that is BOTH `isActive` AND has an
  `onClick` is a control the consumer opted the current page into — it now renders as a native
  `<button aria-current="page">` so keyboard users can focus and activate it (Enter/Space) exactly
  like mouse users (WCAG 2.1.1), instead of the earlier mouse-only `<span aria-current onClick>`.
  A current page with NO `onClick` stays non-interactive `<span aria-current="page">` text (the
  APG-ideal common case).
- **Focus (Issue 4):** `.item:focus-visible` draws a 2px outline using the per-theme focus-ring
  tokens (`--goobs-{sacred,light,dark}-focus-ring`) with a 2px offset — visible on links and
  buttons in all three themes.
- **Keyboard model:** breadcrumb needs no arrow-key roving (APG treats it as an ordinary set of
  links); Tab/Shift+Tab move between the real `<a>`/`<button>` crumbs, Enter/Space activate them
  natively. No keyboard trap.

## SEO semantics

Already correct and preserved: `<nav aria-label="breadcrumb">` landmark → `<ol>` → `<li>` →
real `<a href>` anchors, all rendered server-side (this markup is what Next.js SSR ships to the
crawler). The current page remains readable text inside the list. `data-component="Breadcrumb"`
and `data-theme` selectors are untouched. No heading is semantically owed by a breadcrumb, so no
`headingLevel` prop was added.

## Fixes applied

All at root cause, inside the component directory, additive-only (no prop renamed/removed/retyped):

- `index.tsx` — split `renderItem` into explicit branches: **active** (`<span aria-current="page">`,
  onClick preserved for diagnostic/callback parity), **link** (`<a href>`), **interactive**
  (`<button type="button">`, replacing the `role="button"`/`tabIndex`/`onKeyPress` span), and
  **plain text** (`<span>`). Separators gained `aria-hidden="true"`.
- `Breadcrumb.module.css` — added a `button.item` UA-chrome reset (`border:none; background:transparent;
  margin:0; text-align:inherit; cursor:pointer`) so the button matches the `<a>`/`<span>` crumbs;
  a `.item:focus-visible` outline with per-theme override rules; and a `@media (prefers-reduced-motion:
  reduce)` block that drops the crumb transition and the sacred lift transform.

### Markup changes (per the API contract note)

- The current crumb `<span>` **gains `aria-current="page"`** (new attribute; nothing removed).
- Separator `<span>` **gains `aria-hidden="true"`**.
- An `onClick`-without-`href` crumb changes element **`<span role="button">` → native `<button
  type="button">`**. The accessible role "button" is preserved (now implicit). No
  `data-*`/`role`/`aria` in the machine-test selector contract is removed or renamed — Breadcrumb
  items carry none of the `data-field-name`/combobox selectors, and the `data-component` /
  `data-theme` attributes on the root `<nav>` are unchanged.
- **An `isActive` crumb that ALSO has an `onClick` changes element `<span aria-current="page"
  onClick>` → native `<button type="button" aria-current="page">`** (review Finding 2). This
  makes the current-page control keyboard-focusable and Enter/Space-operable (WCAG 2.1.1) to match
  its mouse operability; `aria-current="page"` and the `onClick` callback are both preserved. An
  `isActive` crumb WITHOUT an `onClick` is unchanged (`<span aria-current="page">`); it also no
  longer wires a no-op click handler onto the non-interactive current page.

## Stories updated

- `InteractiveCallback` — crumbs with `onClick` and no `href` (using `fn()` spies) to exercise the
  native-`<button>` path and Enter/Space activation, ending in an `aria-current` current page. **Now
  has a `play` function** that tabs keyboard focus onto the first button crumb (driving — and
  Chromatic-capturing — the `:focus-visible` ring) and asserts `onClick` fires from Enter.
- `CurrentPageAndSeparators` — documents/exercises the `aria-current="page"` current crumb, the
  `aria-hidden` separators, and the `:focus-visible` ring (dark theme). **Now has a `play` function**
  (review Finding 1) that Tabs focus onto the first link so the focus ring is an actually-rendered
  state captured by the Chromatic snapshot — not merely a doc note — and asserts the current-page
  span carries `aria-current="page"` and that decorative separators are `aria-hidden`.
- `ActiveCrumbWithOnClick` — **new** (review Finding 2): an `isActive` crumb that also has an
  `onClick` renders as a native `<button aria-current="page">`; the `play` function Tabs onto it and
  activates it with **both Enter and Space**, pinning that keyboard activation fires `onClick`
  (`toHaveBeenCalledTimes` 1 → 2) — the regression that would re-fail if the crumb reverted to a
  mouse-only `<span>`.
- Existing `Light`/`Dark`/`Sacred`/`WithCustomSeparator`/`MaxItems` stories continue to exercise
  the current-page + hidden-separator states across all three themes and the custom-icon separator.

## Deferred

None inside owned scope. The correct fixes all lived in the Breadcrumb directory. No shared-file
(Field/Shell, global.css, barrel) change was required.

**Non-blocking observation (not a WCAG failure, left as-is):** the truncation ellipsis
(`index.tsx:108-114`) renders literal `...` text in a `<span>`; a screen reader reads it as
"dot dot dot". This is a conventional, acceptable breadcrumb-collapse pattern (the collapsed
items are non-interactive here, so no disclosure button is owed). Left unchanged to avoid
speculative API growth.
