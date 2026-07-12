# Pagination — a11y audit (2026-07-11)

**Status:** FIXED
**APG pattern:** No dedicated APG *widget* pattern — pagination is a
[navigation landmark](https://www.w3.org/WAI/ARIA/apg/patterns/landmarks/) (`<nav aria-label>`)
wrapping a **list** (`<ul>`/`<li>`) of independent page/direction controls, the active page carrying
`aria-current="page"`. It is NOT a composite widget (tabs/radiogroup/grid): each control is a native
`<button>` reached by Tab/Shift+Tab and activated with Enter/Space, so no arrow-key roving or roving
`tabindex` is owed. Icon-only direction buttons carry a text `aria-label`; decorative glyphs are
`aria-hidden`.

The component arrived with the structural bones already correct (a prior committed a11y pass had
landed the `<nav>` landmark, the `<ul>/<li>` list, `aria-current="page"`, per-button `aria-label`s,
and `aria-hidden` direction icons), plus an **uncommitted in-flight** pass adding the `:focus-visible`
ring, `prefers-reduced-motion` guard, list-item CSS, an accessibility story, and a root `ref` prop.
This audit **committed that in-flight work** (save-the-spot, `9f…`→ commit 1) and then closed the
remaining gaps: page-change **announcement**, **focus retention** across window shifts, and the
**ellipsis text contrast**.

## Issues found

| # | Severity | WCAG | Location | Issue | Status |
|---|----------|------|----------|-------|--------|
| 1 | Serious | 4.1.3 Status Messages (AA) | `index.tsx` root `<nav>` (no live region) | Selecting a page changes which page button owns `aria-current="page"`, but that attribute change is **not announced** by screen readers when focus stays on the just-clicked control (and the old current page loses `aria-current` silently). A screen-reader user got no confirmation of the new active page. | FIXED |
| 2 | Moderate | 2.4.3 Focus Order (A) | `index.tsx` `items.map((item, index) => <li key={index}>` | Page items were **keyed by array index**. When the visible window shifts on navigation, the DOM `<button>` at a given index is reused for a *different* page number, so keyboard/AT focus drifts to whatever page now occupies that slot instead of following the page the user activated. | FIXED |
| 3 | Moderate | 1.4.3 Contrast (Minimum) (AA) | `Pagination.module.css` `.ellipsis` | The skipped-range ellipsis used `--goobs-black-a38` = `rgba(0,0,0,0.38)` ≈ `#9e9e9e` → **~2.6:1** on white. The `…` is real informational text (indicates omitted page ranges), so it must meet 4.5:1. | FIXED |
| 4 | Moderate | 2.4.7 Focus Visible (AA) | `Pagination.module.css` `.button` (in-flight) | No dedicated `:focus-visible` treatment — keyboard focus relied on the UA default outline, easily lost against the sacred gold-on-dark and dark surfaces. | FIXED (committed from in-flight) |
| 5 | Minor | 2.3.3 Animation from Interactions (AAA) | `Pagination.module.css` `.button` `transition: all 0.3s ease` (in-flight) | The 0.3s state transition had **no `prefers-reduced-motion` guard**. | FIXED (committed from in-flight) |

**Verified already-correct (prior committed pass — no regression, not re-fixed):** `<nav>` landmark
with `aria-label` (WCAG 1.3.1 / 4.1.2), the `<ul>/<li>` list structure (1.3.1), `aria-current="page"`
on the selected page button (4.1.2), an `aria-label` accessible name on every control — numbered
`"Go to page N"` (or `"page N"` once current — see Issue 7; satisfies 2.5.3 Label in Name, the visible
"N" is contained either way), direction `"Go to first/previous/next/last page"` (4.1.2) — decorative
direction icons `aria-hidden="true"` (1.1.1), and non-colour-alone selected state (background +
weight-600 + `aria-current`, so 1.4.1 holds).

## Post-review pass (2026-07-11) — adversarial review follow-ups

An adversarial review of the pass above surfaced two remaining focus-order / accessible-naming gaps.
Both fixed at root cause inside the component directory; commit `ee790f24`.

| # | Severity | WCAG | Location | Issue | Status |
|---|----------|------|----------|-------|--------|
| 6 | Minor | 2.4.3 Focus Order (A) | `index.tsx` `PaginationButton` (first/prev/next/last) | Direction buttons used the **native `disabled` attribute** (`page <= 1` / `page >= count`). A keyboard user pressing Enter on "Next"/"Last" to reach the final page (or "Prev"/"First" to reach page 1) activates a control that **disables itself on the re-render**, so it drops out of the focus order and focus falls to `document.body` — the disabled-focused-element anti-pattern. A sighted keyboard user loses their place (the live region only helps AT users). | FIXED |
| 7 | Minor | 2.5.3 Label in Name (A) / naming quality | `index.tsx` `PaginationItem` (numbered button) | The current page kept `aria-label="Go to page N"` while **also** carrying `aria-current="page"`, so a screen reader announced the mildly contradictory "Go to page 5, current page" — a "Go to" call-to-action verb for the page already active. The MUI reference differentiates ("page N" when current vs "Go to page N" otherwise). Not a hard SC failure (aria-current mitigates it), but a naming nicety the prior pass glossed as "names verified correct". | FIXED |

## Hearing

Clean. Grep of the component for `new Audio`/`AudioContext`/`<audio>`/`<video>`/`navigator.vibrate`/
`.play()` found nothing — Pagination conveys no information by sound and plays no media. All state
(current page, hover, disabled, page-change) is visual + programmatic. No captions/transcript surface
is applicable.

## Reading & screen reader

- **Page-change announcement (Issue 1):** the `<nav>` now renders a visually-hidden
  `role="status" aria-live="polite" aria-atomic="true"` region reading **"Page N of M"** as its first
  child. A live region never announces its initial value, so it speaks only on a user-driven change —
  the reliable confirmation channel that the silent `aria-current` swap could not provide.
- **Focus retention (Issue 2):** list items are now keyed on their **content** (`page-${n}`, or the
  unique `start-ellipsis`/`end-ellipsis` token) rather than the array index. The activated page is
  always still in the window (it becomes the current page), so its `<button>` keeps DOM identity and
  keyboard/AT focus stays on it — now carrying `aria-current="page"` — instead of drifting to a
  renumbered neighbour.
- **Ellipsis (Issue 3):** lifted to `--goobs-black-a60` (`#666` → ~5.7:1 on white), still visibly
  muted against the `a87` page numbers so it never reads as an interactive control. The dark
  (`--goobs-dark-text-muted`, ~6.9:1) and sacred (`--goobs-gold-a60`) ellipses already passed.
- **Focus (Issue 4):** `.button:focus-visible` draws a 2px solid outline with a 2px offset, using
  `--goobs-light-primary` by default and per-theme overrides (`--goobs-sacred-focus-ring`,
  `--goobs-dark-primary`) — clearly visible on page and direction buttons in all three themes, and it
  never fights the hover/selected glow (`outline`, not `box-shadow`).
- **Keyboard model:** Tab/Shift+Tab move between the native `<button>`s; Enter/Space activate them.
  Boundary buttons (`first`/`prev` at page 1, `next`/`last` at last page) and every direction button
  under `styles.disabled` are disabled via **`aria-disabled="true"` (not the native `disabled`
  attribute)** so they stay focusable — a keyboard user who activates one to reach a boundary keeps
  focus on that control instead of dropping to `<body>` (Issue 6); their handler is neutralised so an
  aria-disabled button never navigates (and can never step to page 0 / count+1). The disabled state is
  programmatically conveyed (aria-disabled) and visually dimmed — not colour-alone. No arrow-key roving
  is owed for this list-of-controls pattern; no keyboard trap.
- **Current-page name (Issue 7):** the active numbered button now reads `"page N"`; every other reads
  `"Go to page N"`. The "Go to" verb no longer contradicts the `aria-current="page"` on the current
  control, and 2.5.3 Label in Name holds either way (the visible "N" is contained).

## SEO semantics

Preserved and correct for a controlled (callback-driven) pager: `<nav aria-label="pagination
navigation">` landmark → `<ul>` → `<li>`, all server-rendered (this markup is what Next.js SSR ships
to the crawler). Because the component is `onChange`-controlled (not URL navigation), the default
controls are `<button>`s, not `<a href>`; consumers who need crawlable page **links** use the existing
`renderItem` prop (its `PaginationRenderItemParams` already exposes `page`/`type`/`onClick`) to render
real anchors — the established, additive escape hatch, so no default markup change was warranted. No
heading is semantically owed by a pager, so no `headingLevel` prop was added. All machine-test
selectors (`data-component="Pagination"`, `data-action` verbs, `data-pagination-*`, `aria-current`,
`data-theme`) are untouched.

## Fixes applied

All at root cause, inside the component directory, additive-only (no prop renamed/removed/retyped):

- `index.tsx` — added the visually-hidden `role="status"` live region ("Page N of M") as the first
  `<nav>` child; changed the page-item `key` from the array index to a content-based key
  (`typeof item === 'number' ? \`page-${item}\` : item`).
- `Pagination.module.css` — added a `.visuallyHidden` clip-rect helper for the live region; raised
  `.ellipsis` colour `--goobs-black-a38` → `--goobs-black-a60` (contrast fix). Committed from the
  in-flight pass: the `.button:focus-visible` ring (+ per-theme overrides), the `outline:none`
  pointer-state base, the `.listItem` flex rule, and the `@media (prefers-reduced-motion: reduce)`
  transition-drop.
- `Pagination.stories.tsx` — added the `PageChangeAnnouncement` accessibility story; committed the
  in-flight `AccessibleStructure` story.

**Post-review pass (commit `ee790f24`):**

- `index.tsx` — `PaginationButton` now renders **`aria-disabled={disabled || undefined}`** in place of
  the native `disabled` attribute and neutralises its own click handler when disabled (Issue 6), so a
  boundary/globally-disabled direction button stays focusable and never navigates past a boundary. The
  numbered `PaginationItem` `aria-label` is now `isSelected ? \`page ${item}\` : \`Go to page ${item}\``
  (Issue 7).
- `Pagination.module.css` — the three `.navButton` disabled rules (default / sacred / dark) key off
  `[aria-disabled='true']` instead of `:disabled`, and the three hover rules use
  `:hover:not([aria-disabled='true'])`. Identical rendered output (same tokens, same specificity), just
  driven by the attribute the button now carries.
- `Pagination.stories.tsx` — added the `BoundaryFocusRetention` accessibility story (two pagers, one at
  each boundary, so both aria-disabled ends render); refreshed the `AccessibleStructure` JSDoc for the
  new aria-disabled boundary model and the differentiated current-page name.

### Markup changes (per the API contract note)

- The root `<nav>` **gains one new visually-hidden child** `<div role="status" aria-live="polite"
  aria-atomic="true">` (new element; nothing removed or renamed). It is `.visuallyHidden` (clip-rect),
  so it is absent from the visual layout and does not affect the flex row or any Chromatic snapshot.
- Page-item React `key`s changed from index to content-based. **Keys are a React-internal
  reconciliation hint — no rendered DOM attribute, role, or selector changes.**
- No `data-*`/`role`/`aria` attribute in the machine-test selector contract is removed or renamed; the
  `button[role="combobox"]`/`[role="listbox"]` dropdown contract is not involved in this component.

**Post-review pass:**

- Direction buttons **swap the native `disabled` attribute for `aria-disabled="true"`** (present only
  when disabled — never emitted as `"false"`, matching the library's FieldShell aria-disabled
  contract). The `data-action` verbs (`first`/`prev`/`next`/`last`) and every other attribute are
  unchanged; the buttons are now focusable at a boundary (intended focus-retention change). No goobs or
  ThothOS test keyed on the native `disabled` state of these buttons (verified: no Pagination story uses
  `toBeDisabled`; ThothOS keys on `data-action`).
- The current numbered page button's `aria-label` value changes from `"Go to page N"` to `"page N"`
  (text only; the attribute itself and all `data-pagination-*`/`aria-current` selectors are unchanged).

## Stories updated

- `PageChangeAnnouncement` — **new**: `count={30}`, `initialPage={15}` (mid-range, so both ellipses and
  the first/last buttons render). Exercises the `role="status"` live region — clicking through pages
  updates its "Page N of M" text so assistive tech announces each new active page while focus stays on
  the clicked control — and renders the higher-contrast ellipses (Issue 3).
- `AccessibleStructure` (committed from in-flight) — exercises the `<nav>`/`<ul>/<li>` structure,
  `aria-current="page"`, the accessible names, the `aria-hidden` direction icons, the
  `:focus-visible` ring, and the aria-disabled boundary buttons.
- `BoundaryFocusRetention` — **new** (post-review): two interactive pagers, one at page 1 and one at the
  last page, so both aria-disabled boundary ends (`first`/`prev` and `next`/`last`) render together.
  Confirms the dimmed boundary buttons still accept and hold keyboard focus (Issue 6) and that
  activating them never navigates past the boundary.
- Existing `Default`/`DarkTheme`/`SacredTheme`/`WithFirstLastButtons`/`HiddenPrevNext`/
  `ManyPagesWithEllipsis`/`SiblingAndBoundaryCount`/`Disabled` stories continue to cover the palettes,
  button options, ellipsis rendering, and the disabled state across all three themes.

## Deferred

None inside owned scope. Every fix lived in the Pagination directory; no shared-file
(Field/Shell, `src/styles/global.css`, barrel, `index.ts`) change was required. The
`--goobs-black-a38`/`-a60` tokens already exist in `global.css`, so the contrast fix was a
local token swap.

**Non-blocking observations (not WCAG failures, left as-is):**

- **`renderItem` is only invoked for numbered page items, not the first/prev/next/last direction
  buttons**, even though `PaginationRenderItemParams.type` already enumerates `'first'|'last'|'next'|
  'previous'`. A consumer building fully link-based (crawlable) pagination therefore cannot re-render
  the direction controls as `<a href>`. Extending `renderItem` to the direction buttons would be a
  useful **additive** enhancement but risks a behavioural surprise for existing consumers whose
  `renderItem` does not branch on those `type`s, so it is left for a deliberate API decision rather
  than folded into an a11y pass. (Owned file `index.tsx` — recorded, not changed.)
- The `role="navigation"` attribute on `<nav>` is redundant with the implicit landmark role but is
  harmless and part of the existing selector surface, so it is left untouched.
