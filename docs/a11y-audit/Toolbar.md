# Toolbar — a11y audit (2026-07-11)

**Status:** FIXED

**APG pattern:** [Toolbar](https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/) — a
container that groups a set of controls (here: action Buttons, a filter Dropdown
combobox, and a Searchbar) and lets a keyboard user move between them with the
Arrow keys while the group occupies a single Tab stop.

The component is `src/components/Toolbar/index.tsx` — a horizontal action bar that
composes `Button`, `Field/Dropdown/Regular`, and `Field/Search`. Those child
components carry their own accessible name / role / focus semantics (audited under
their own owners); this audit covers the Toolbar container itself and how it
groups them.

---

## Issues found

| # | Severity | WCAG 2.2 | Location | Issue | Status |
|---|----------|----------|----------|-------|--------|
| 1 | Serious | 1.3.1 Info & Relationships (A), 4.1.2 Name, Role, Value (A) | `index.tsx:155-161` (pre-fix) | The toolbar rendered as a bare `<div data-component="Toolbar">` — no `role="toolbar"`, no accessible name, no `aria-orientation`. AT users got no signal that the controls form one group, and the group had no name. The WAI-ARIA APG Toolbar pattern requires `role="toolbar"` + an accessible name. | **FIXED** |
| 2 | Serious | 2.1.1 Keyboard (A) — APG Toolbar keyboard interaction | `index.tsx` (whole component, pre-fix) | With `role="toolbar"` the APG contract is that the control group is one Tab stop navigated with Arrow keys (roving tabindex). None of that existed; the div had no keyboard handling. Adding the role without the keyboard behavior would set a false AT expectation, so the keyboard pattern is implemented alongside the role. | **FIXED** |
| 3 | Moderate | 1.1.1 Non-text Content (A) | `index.tsx:162` (pre-fix) | The sacred-theme decorative glyph `<span class="glyph">𓊗</span>` (an Egyptian hieroglyph, explicitly "decorative" per the prop JSDoc) was exposed to assistive tech, which would announce the stray non-text character. | **FIXED** |
| 4 | Minor | 2.3.3 Animation from Interactions (AAA) | `Toolbar.module.css:90-94` (pre-fix) | The `prefers-reduced-motion: reduce` block suppressed the glyph rotation but not the root's `transition` (theme cross-fade). Completed the reduced-motion coverage for the container. | **FIXED** |

No sound/media issues (Section A): grep of the component for `new Audio` /
`AudioContext` / `<audio>` / `<video>` / `navigator.vibrate` returned nothing —
the Toolbar conveys nothing by sound. Nothing to fix.

No color-only-state, form-error-association, or non-semantic-heading issues in the
container: it renders no headings, no error text, and no state that is color-only
(the divider and glyph are decorative; interactive state lives in the child
components).

---

## Hearing (WCAG 1.2.x, 1.4.2)

CLEAN. The Toolbar plays no audio, uses no `navigator.vibrate`, and embeds no
media element — it conveys no information by sound, so there is no audio-only
channel to mirror visually. Verified by grep (no matches).

## Reading & screen reader (WCAG 1.1.1, 1.3.1, 1.4.1, 2.1.x, 2.4.x, 4.1.2)

- **APG Toolbar role + accessible name (Issue 1, WCAG 1.3.1 / 4.1.2).** The root now
  renders `role="toolbar"`, `aria-orientation="horizontal"`, and an accessible name.
  Two additive, public-API props feed the name:
  - `ariaLabel?: string` → `aria-label` (default `'Toolbar'` so an unconfigured
    toolbar is never nameless; JSDoc directs consumers to override for
    disambiguation when a page has more than one toolbar).
  - `ariaLabelledBy?: string` → `aria-labelledby`, which takes precedence over
    `aria-label` when supplied (so the two never collide).
  This mirrors the established library conventions: `AppBar` exposes an `ariaLabel`
  prop on its `role="banner"` root (`src/components/AppBar/index.tsx:120,272`), and
  `ComplexTextEditor/Toolbars/Editor` already ships a labelled `role="toolbar"`
  (`.../Editor/index.tsx:548-549`).

- **APG Toolbar keyboard interaction / roving tabindex (Issue 2, WCAG 2.1.1).**
  Implemented to match the in-repo precedent
  (`ComplexTextEditor/Toolbars/Editor/index.tsx:446-541`):
  - The enabled controls (`<button>` elements — the action buttons AND the filter
    combobox; `role="option"` excluded) share ONE Tab stop: exactly one has
    `tabindex="0"`, the rest `tabindex="-1"`.
  - **Left/Right Arrow** move between controls (wrapping), **Home/End** jump to the
    first/last (`handleToolbarKeyDown`).
  - The tab stop follows mouse focus (`handleToolbarFocus`) so Shift+Tab returns to
    the last-used control, and it re-seeds when the control set changes
    (`controlSignature` + `useEffect` — buttons added/removed, a `disabled` toggles,
    or the dropdown/searchbar mount).
  - **Guards so the toolbar never steals keys it shouldn't:** a focused text field
    (the searchbar `<input>` — `isTextEntryElement`) keeps Arrow/Home/End for caret
    motion, and an open combobox (`aria-expanded="true"`) keeps them for its option
    navigation. Native Enter/Space button activation is untouched.
  - All of this runs client-only (refs + event handlers) — SSR-safe. On the server
    every control renders normally focusable and degrades gracefully until the
    hydration effect installs the roving tab stop.

- **Decorative glyph hidden (Issue 3, WCAG 1.1.1).** `aria-hidden="true"` on the
  sacred `𓊗` span (`index.tsx`), so screen readers skip the purely decorative
  hieroglyph.

- **Focus visibility.** The Toolbar container renders no focusable element of its
  own; the visible `:focus-visible` treatment for each control lives in the child
  components' module CSS (Button, Dropdown, Searchbar) and is unchanged. No overlay
  is owned by the Toolbar, so focus-trap / Escape / `aria-modal` are N/A here.

- **Selector contract preserved.** `data-component="Toolbar"`, `data-theme`, the
  child combobox's `role="combobox"` + `aria-expanded`, and FieldShell's
  `data-field-name` semantics are all untouched — only additive `role` / `aria-*`
  attributes and roving `tabindex` were added.

## SEO semantics (Section C)

The Toolbar is an interactive control group, not document content: it has no heading
text (so no non-semantic-heading risk and no `headingLevel` prop is warranted), no
crawlable link text of its own (links, if any, come from the child Buttons), and its
primary content is server-rendered markup (the `<div role="toolbar">` and its
children render in SSR; only the roving-tabindex focus management is client-side,
which is a progressive enhancement, not content). `role="toolbar"` is the correct
ARIA widget role for this container; it is not one of the document landmark roles, so
no `<nav>`/`<header>`/`<aside>` wrapper applies. No SEO-semantic issues.

## Fixes applied

1. **`role="toolbar"` + `aria-orientation="horizontal"` + accessible name** on the
   root, with additive `ariaLabel` (default `'Toolbar'`) and `ariaLabelledBy` props
   (`index.tsx`).
2. **Full APG Toolbar roving-tabindex keyboard navigation** (Left/Right/Home/End)
   with guards for the focused searchbar text field and open filter combobox
   (`index.tsx`).
3. **`aria-hidden="true"`** on the decorative sacred glyph span (`index.tsx`).
4. **`prefers-reduced-motion: reduce`** now also sets `.root { transition: none }`
   (`Toolbar.module.css`).

All additive — no prop renamed/removed/retyped, no existing `data-*`/`role`/`aria`
attribute removed, no new dependency, no wrapper component, styling still via the
CSS module + `data-*` attribute selectors.

## Stories updated

Added to `Toolbar.stories.tsx` (Storybook stories are this repo's regression tests):

- **`AccessibleName`** — renders two light-theme toolbars, one with
  `ariaLabel="Records toolbar"` and one with the default name, pinning the
  `role="toolbar"` + `aria-orientation` + `aria-label` output and the
  multiple-toolbar disambiguation use-case.
- **`KeyboardRovingTabIndex`** — sacred-theme toolbar with buttons + filter
  Dropdown + Searchbar; JSDoc pins the roving-tabindex Arrow/Home/End interaction,
  the "don't hijack keys from the searchbar / open combobox" guards, and the
  `aria-hidden` decorative glyph.

The existing `FilterDropdown` story already exercises the combobox-inside-toolbar
branch that the roving set now includes.

## Deferred

None. Every issue was fixed at root cause inside the component directory. The child
components (`Button`, `Field/Dropdown/Regular`, `Field/Search`) own their own
accessible-name/focus/error semantics and are audited under their own owners; this
audit made no changes outside `src/components/Toolbar/`.
