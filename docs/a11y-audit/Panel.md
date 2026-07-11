# Panel — a11y audit (2026-07-11)

**Status:** FIXED

**APG pattern:** No interactive-widget APG pattern applies — `Panel` is a
**landmark [region](https://www.w3.org/WAI/ARIA/apg/practices/landmark-regions/)**
(a `<section role="region">` named by its header title via `aria-labelledby`). It is a
stateless shell-surface primitive (compound root + `Panel.Header` / `Panel.Body` /
`Panel.Footer`), not a dialog/accordion/tabs widget, so it owns no roving-tabindex or
open/close keyboard contract of its own. The one interactive control it renders is the
optional back **`<button>`** (via `IconButton`), which already carries an accessible name.

**Component:** `src/components/Panel/index.tsx` (default `Panel`, plus exported
`PanelHeader`, `PanelBody`, `PanelFooter`), `src/components/Panel/Panel.module.css`,
`src/components/Panel/Panel.stories.tsx`.

## Pattern-compliance baseline (already correct — no change)

- Root is a real `<section role="region">` with `aria-labelledby` → the panel is a named
  landmark, announced by its title (`index.tsx:135-158`).
- Back button is a native `<button>` (IconButton → CustomButton) with `aria-label`
  (`backLabel`, default `"Back"`) — accessible name present, keyboard-operable
  (`index.tsx:239-251`).
- The `standard` variant already routes to a light-theme header text/icon while
  `sacred`/`fullscreen` stay gold-on-dark — a deliberate WCAG-contrast decision documented
  in-code (`index.tsx:212-219`).
- All `data-*` machine-test selectors intact and unchanged: `data-component="Panel"`,
  `data-panel`, `data-panel-variant`, `data-panel-header`, `data-panel-title`,
  `data-panel-subtitle`, `data-panel-header-actions`, `data-panel-back`,
  `data-action="cancel"`, `data-panel-body`, `data-panel-footer`.
- No `Audio`/`AudioContext`/`<audio>`/`<video>`/`navigator.vibrate` (grep-verified).

## Issues found

| # | Severity | WCAG | Location (pre-fix) | Pattern class | Status |
|---|----------|------|--------------------|---------------|--------|
| 1 | Serious  | 1.3.1 Info & Relationships (A) / 2.4.6 Headings & Labels (AA) | `index.tsx:226-239` — title rendered via `Typography` (a `<span>`) | `nonsemantic-heading` | FIXED |
| 2 | Moderate | 1.3.1 (A) / 4.1.2 Name, Role, Value (A) | `index.tsx:144` — root always emits `aria-labelledby={titleId}` | `dangling-aria-labelledby` | FIXED |
| 3 | Serious  | 2.1.1 Keyboard (A) | `index.tsx:275` + `Panel.module.css:120` — `Panel.Body` `overflow:auto`, not focusable | `scrollable-region-not-keyboard-accessible` | FIXED |
| 4 | Minor    | 1.1.1 Non-text Content (A) / 4.1.2 (A) | `index.tsx:218` — `ArrowBackIcon` `<svg>` had no `aria-hidden` | `icon-missing-aria-hidden` | FIXED |

### 1 — Panel title is not a real heading (Serious, 1.3.1 / 2.4.6)
The title was rendered by `Typography variant="cinzelh5"`, and `Typography` **always
renders a `<span>`** (verified `Typography/index.tsx:482-491` — deliberately a span so it is
valid phrasing content inside buttons/headings). So the panel's visual heading was a styled
non-heading: screen-reader heading navigation skipped it and the SSR document outline was
flat. There was also no way for the consumer to set the heading level. The `id` used by the
root's `aria-labelledby` sat on the `headerTitleBlock` **div** that wraps *both* the title
and the subtitle, so the region's accessible name over-included the subtitle text. Pattern
class: `nonsemantic-heading`.

### 2 — Dangling `aria-labelledby` on a header-less Panel (Moderate, 1.3.1 / 4.1.2)
The root unconditionally set `aria-labelledby={titleId}`, but the element carrying `titleId`
lives in `Panel.Header`, which is optional. A Body-only composition
(`<Panel><Panel.Body/></Panel>`) therefore produced a `role="region"` whose
`aria-labelledby` referenced an **id that never renders** — an invalid IDREF that leaves the
landmark with no accessible name and trips AT/validators. Pattern class:
`dangling-aria-labelledby`.

### 3 — Scroll body not keyboard-accessible (Serious, 2.1.1)
`Panel.Body` is the `flex:1; overflow:auto` scroll region (its whole purpose). When its
content overflows but holds **no focusable children** — the read-only "inline show" case,
and exactly what every non-form story renders (12 `<p>` rows) — a keyboard-only user cannot
scroll it (no focusable element inside, container not focusable). This is axe-core
`scrollable-region-focusable` / WCAG 2.1.1. Pattern class:
`scrollable-region-not-keyboard-accessible`.

### 4 — Decorative back-arrow glyph not hidden (Minor, 1.1.1 / 4.1.2)
`ArrowBackIcon` renders a bare `<svg>` with no `aria-hidden`. The button's `aria-label`
already supplies the name (so there is no *broken* state today), but marking the purely
decorative glyph `aria-hidden="true"` is the correct belt-and-suspenders so the icon can
never leak a redundant node into the accessibility tree. Pattern class:
`icon-missing-aria-hidden`.

## Hearing (WCAG 1.2.x, 1.4.2)
N/A — grep found no `Audio`/`AudioContext`/`<audio>`/`<video>`/`navigator.vibrate`. No
information is conveyed by sound. No finding.

## Reading & screen reader (1.1.1, 1.3.1, 1.4.1, 2.1.x, 2.4.x, 4.1.2)
- **Fix 1** makes the title a real `<h1>`–`<h6>` (new additive `headingLevel` prop, default
  `2`) and moves the `titleId` onto that heading, so the region's accessible name is now
  precisely the title (subtitle no longer folded in) and the title participates in heading
  navigation.
- **Fix 2** gates `aria-labelledby` on a `Panel.Header` actually being composed in, so a
  header-less region degrades to un-named (or a consumer's own `aria-label` via restProps)
  rather than a broken reference.
- **Fix 3** makes the scroll body focusable (`tabIndex={0}`, overridable via restProps) and
  adds a `:focus-visible` outline so it is keyboard-scrollable *and* has a visible focus
  indicator (2.4.7) on both the sacred-gold and standard-blue surfaces.
- **Fix 4** hides the decorative glyph.
- Color is never the sole state signal: the `standard`/`sacred`/`fullscreen` variants are
  cosmetic archetypes, not interactive state; the variant is also exposed programmatically
  via `data-panel-variant` (1.4.1). No finding.
- **Motion (2.3.3):** the module has **no** CSS `transition`/`animation` (grep-verified), and
  the focus outline I added is instant — no `prefers-reduced-motion` block needed. No finding.

## SEO semantics (SSR)
- The panel title now emits a real, consumer-levelled `<h1>`–`<h6>` in the SSR HTML (was a
  `<span>`) — the primary SEO/outline win.
- The root is a real `<section>`; the header/footer remain `<div>`s. Promoting them to
  `<header>`/`<footer>` would require **retyping the public
  `forwardRef<HTMLDivElement>` / `HTMLAttributes<HTMLDivElement>` surface** of
  `PanelHeader`/`PanelFooter` (a `<header>` is `HTMLElement`, not `HTMLDivElement`), which
  violates the additive-only API rule. Left as `<div>` — not a WCAG failure (the region
  landmark + real heading already carry the structure). Noted in Deferred.
- All primary content is caller-provided children rendered server-side — no client-only
  injection of primary content. No finding.

## Fixes applied
1. **Real heading title + `headingLevel`** (`index.tsx`, `Panel.module.css`): added the
   additive `headingLevel?: 1|2|3|4|5|6` prop (default `2`), render the title inside
   `<h${headingLevel} id={titleId} className={headerHeading}>` wrapping the existing
   `Typography` (span stays valid phrasing content inside the heading). New `.headerHeading`
   class neutralises the heading's UA margin/size/weight so the visual chrome is unchanged.
   `data-panel-title` stays on the block div (test contract preserved); the `id` moved from
   the block div to the heading so `aria-labelledby` names only the title.
2. **Gate `aria-labelledby`** (`index.tsx`): the root detects a direct `Panel.Header` child
   (`React.Children` + `child.type === PanelHeader`) and emits `aria-labelledby` only then,
   eliminating the dangling IDREF on header-less panels.
3. **Keyboard-scrollable body** (`index.tsx`, `Panel.module.css`): `Panel.Body` defaults to
   `tabIndex={0}` (placed before `{...restProps}` so a consumer can override, e.g. `-1`,
   when the body already contains focusable content), plus a `.body:focus-visible` outline
   keyed to the shared `--panel-accent` token (visible on sacred + standard).
4. **Decorative icon hidden** (`index.tsx`): passed `aria-hidden="true"` to `ArrowBackIcon`
   at the Panel callsite (props spread onto its `<svg>`); the Icons component itself was not
   touched.

## Stories updated
- **`InteractionTest` play extended:** now pins that `aria-labelledby` resolves to a real
  heading element (`tagName` matches `/^H[1-6]$/`, default `H2`), that `Panel.Body` has
  `tabindex="0"`, and that the back button's `<svg>` is `aria-hidden="true"` — so reverting
  any of the four fixes fails this story.
- **New `HeadingLevel` story** (`A11y/Heading Level`): renders `headingLevel={3}` and the
  play test asserts the title is an `<h3>` carrying the `aria-labelledby` id with the right
  text — pins the consumer-controllable-level behavior.
- **New `HeaderlessRegion` story** (`A11y/Header-less (no dangling label)`): a Body-only
  panel whose play test asserts the region has **no** `aria-labelledby` (no dangling ref) and
  the body is still `tabindex="0"`.
- Existing `Sacred` / `Standard` / `NoBackButton` / `BodyOnly` / `Fullscreen` stories are
  unchanged and still valid (the `Fullscreen` play test on `position:fixed` +
  `data-panel-variant` is untouched).

## Deferred (out of this directory's ownership OR design decisions to escalate)

None of the fixed issues required edits outside `src/components/Panel/`. Two observations
are recorded rather than changed:

1. **`Panel.Header` / `Panel.Footer` are `<div>`, not `<header>`/`<footer>`**
   (`index.tsx:203-208`, `299-319`). Promoting them to semantic sectioning elements would
   improve the SSR outline but requires **retyping the public `forwardRef<HTMLDivElement>`
   and `extends React.HTMLAttributes<HTMLDivElement>`** on both subcomponents (a `<header>`
   is typed `HTMLElement`), which is a breaking change to the exported prop/ref types — out
   of bounds for an additive-only pass. Suggested change (if the API is ever allowed a major
   bump): change both to `forwardRef<HTMLElement, …>` and render `<header>`/`<footer>`.
   Not a WCAG violation as-is. Pattern class: `nonsemantic-landmark`.
2. **`ArrowBackIcon` decorative SVGs library-wide** (`src/components/Icons/*.tsx`) emit no
   default `aria-hidden` and no `role="img"`+title path. I hid it at my callsite; a
   library-wide default (decorative-by-default `aria-hidden`, opt-in labelling) belongs in
   the shared `Icons` component, which I do not own. Suggested change: in each icon's
   `<svg>`, default `aria-hidden="true"` unless an `aria-label`/`role="img"` is passed.
   Pattern class: `icon-missing-aria-hidden`.
