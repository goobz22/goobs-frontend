# Filter — a11y audit (2026-07-11)

**Status:** FIXED

**Component:** `FilterSection` (`src/components/Filter/Section/index.tsx`) — a fully
prop-driven filter / search row (search box, action buttons, dropdowns, date ranges, boolean
toggles, labelled chip clusters), optionally wrapped in a collapsible shell. The Filter
directory contains only the `Section` subcomponent.

## APG pattern

Two patterns compose here:

1. **Disclosure** (WAI-ARIA APG *Disclosure*, and the *Accordion* header pattern for a single
   collapsible section) — the `collapsible` shell: a native `<button>` toggle with
   `aria-expanded` + `aria-controls`, revealing a `role="region"` panel. Keyboard interaction
   (Enter/Space to toggle) is handled natively by the `<button>`; the Disclosure pattern does
   **not** require Escape or arrow keys, so none are missing.
2. **Grouped toggle buttons** — each chip cluster is a set of related filter chips. The shared
   `Chip` renders as `role="button"` + `aria-pressed` (verified `src/components/Chip/index.tsx:265,318`),
   so a cluster is a *group of toggle buttons*, correctly exposed with `role="group"` (a
   `role="radiogroup"` would be invalid — it requires `role="radio"` children the Chip does not emit).

The field subcomponents (`Field/Search`, `Field/Dropdown/*`, `Field/Date/DateRange`, `Switch`,
`Button`, `Chip`) are **separate components outside this directory** and carry their own
combobox/switch/button ARIA; FilterSection only composes them and forwards `label` /
`dataField` / `theme`. Their internal semantics were not in scope and were left untouched.

## Issues found

| # | Severity | WCAG 2.2 | Location | Issue | Status |
|---|----------|----------|----------|-------|--------|
| 1 | Serious | 1.3.1 Info & Relationships (A); 4.1.2 Name, Role, Value (A) | `src/components/Filter/Section/index.tsx:489` (pre-fix) | Each chip cluster rendered a visible dimension label (`<span>Status:</span>`) with **no programmatic association** and the chip row had **no group role**. A screen-reader user heard the chips as loose, context-free toggle buttons — the "Status" / "Level" / "Tags" dimension was conveyed visually only. | **FIXED** |
| 2 | Serious | 2.4.7 Focus Visible (AA); 2.4.11 Focus Appearance (AA) | `src/components/Filter/Section/Section.module.css:77` (pre-fix `.toggle`) | The collapsible toggle `<button>` had **no `:focus-visible` treatment**. It is a fully custom-styled button with its own border on a themed background; the default UA outline is inconsistent/low-contrast and visually competes with the button border. Keyboard users could lose the focus location. | **FIXED** |
| 3 | Minor | 2.3.3 Animation from Interactions (AAA; repo convention) | `src/components/Filter/Section/Section.module.css:102` (`.chevron`) | The chevron `transition: transform 0.2s ease` (rotates on open/close) had **no `prefers-reduced-motion` guard**, unlike sibling components (Accordion, +22 modules repo-wide). | **FIXED** |
| 4 | Minor | 1.3.1 Info & Relationships (A); SEO document outline | `src/components/Filter/Section/index.tsx:553` (pre-fix toggle) | In collapsible mode the section title ("Filters") rendered as a bare `<span>` inside the toggle button, with **no way for a consumer to place it in the document outline / heading navigation**, unlike the APG Accordion pattern (trigger wrapped in a heading) and ~10 sibling goobs components that expose a `headingLevel` prop. | **FIXED** |
| 5 | Minor | 1.3.6 Identify Purpose (AAA); WAI-ARIA landmark best practice | `src/components/Filter/Section/index.tsx` (root `role="search"`, pre-review-fix) | The non-collapsible `role="search"` landmark was placed on the section **root**, so it enclosed the entire toolbar — including the right-aligned action button(s) rendered from `visibleButtons` (e.g. the `+ Create Course` CTA). A create/CTA action is **not part of a search facility**, so a non-search control sat inside the search landmark. (Adversarial-review follow-up.) | **FIXED** |
| 6 | Minor | (test integrity — no direct WCAG SC) | `src/components/Filter/Section/filterSection.stories.tsx` (`AccessibleHeading`, `AccessibleChipGroups`) | The two new a11y-state stories were **render-only** — no `play` assertions. goobs' only regression gate is the Chromatic **visual** diff, and both fixes are pixel-invisible (ARIA `role`/`aria-labelledby` aren't screenshot; the `<h2>` wrapper is `font:inherit;margin:0` so it's identical to a bare button). A regression that dropped `role="group"` or the heading wrapper would pass Chromatic + typecheck + lint silently. (Adversarial-review follow-up.) | **FIXED** |

No hearing-impaired issues (A / WCAG 1.2.x, 1.4.2): grep for `new Audio` / `AudioContext` /
`navigator.vibrate` / `<audio>` / `<video>` / `.play()` across the directory returned **zero
matches** — nothing conveys information by sound.

No color-only-state issue (1.4.1): the per-option chip accent color (`opt.color`,
`index.tsx:371`) is decorative on top of the Chip's programmatic `aria-pressed` state and its
`data-chip-active` attribute; the open/closed chevron state is mirrored by `aria-expanded` +
`data-state`. State is never color-alone.

## Hearing

CLEAN — no audio, media, or vibration APIs used; no status conveyed by sound. Nothing to fix.

## Reading & screen reader

- **Issue 1 (fixed):** each labelled chip cluster now exposes its chip row as
  `role="group"` with `aria-labelledby` pointing at the visible dimension label (which received
  a stable generated id, `filter-cluster-label-<reactId>-<ci>`). Screen-reader users hear
  "Status, group" / "Level, group" / "Tags, group" and traverse the chips as one named set.
  Unlabelled clusters intentionally stay plain containers (an unnamed group only adds AT
  verbosity). `index.tsx:489-541`.
- **Issue 2 (fixed):** the collapsible toggle now has a `:focus-visible` ring
  (`2px` outline in the per-theme `--goobs-*-focus-ring` token, `outline-offset:-2px` so it
  clears the button border and never overlaps the panel below), mirroring `Accordion.module.css`'s
  `.summary` treatment. `Section.module.css:99-118`.
- **Disclosure semantics were already correct** and preserved: `<button type="button">` with
  `aria-expanded={isExpanded}`, `aria-controls={panelId}`; the panel is `role="region"` +
  `aria-label={title}` with the matching `id`. The chevron glyph is `aria-hidden="true"`.
  Enter/Space activation is native. No focus trap / Escape is required for a disclosure
  (it is not a modal overlay), so none was added.

### Landmarks — `role="search"` (Issue 5, review follow-up)

- A FilterSection with a search box is a *search facility*, so in **non-collapsible** mode the
  **search box** is exposed as a named `role="search"` landmark (`aria-label` = `landmarkLabel`
  → `title`, default "Filters") for landmark navigation. Filter-only rows (no search box) get no
  landmark — an unnamed/ambiguous one only adds noise. Collapsible mode already exposes its panel
  as a named `role="region"`, so the search landmark applies to non-collapsible mode only.
- **Adversarial-review fix:** the landmark originally sat on the section **root**, so it enclosed
  the whole toolbar, including the right-aligned action button(s) (`visibleButtons`, e.g. the
  `+ Create Course` CTA). A create/CTA action is not part of a search facility. The landmark was
  moved onto the **`searchCell`** (the search box wrapper) — a canonical, tightly-scoped search
  landmark that structurally **excludes** the sibling `buttonsCell`. The fix is **pixel-identical**:
  `searchCell` keeps its class and `flex: 1 1 min(320px,100%)` sizing, and `role`/`aria-label` do
  not affect layout, so the Chromatic baseline is unchanged. `index.tsx` searchCell (in
  `filterContent`) + non-collapsible root. The `landmarkLabel` and `ref` prop JSDoc were updated to
  reflect that the landmark is the search box, not the root.

## SEO semantics

- **Issue 4 (fixed):** added an additive, opt-in `headingLevel?: 1|2|3|4|5|6` prop. When set
  (collapsible mode), the toggle trigger is wrapped in a real `<h1>`–`<h6>`
  (`<hN class="heading"><button …></button></hN>`), placing the filter section in the SSR'd
  document outline and screen-reader heading navigation, matching the APG Accordion pattern and
  the ~10 sibling components that expose `headingLevel`. Opt-in (undefined → no wrapper, DOM
  byte-identical) because a single filter disclosure should not force a heading into a
  consumer's outline unless they choose the level for their hierarchy. `index.tsx:200-211,
  598-600, 615-619`; wrapper style `Section.module.css:120-128`.
- Real semantic elements are used throughout (native `<button>` for the toggle; field
  subcomponents render their own inputs). No `onClick` div is used as a control. No content is
  client-only injected — everything is present in the SSR'd HTML.

## Fixes applied

All fixes are inside the owned directory `src/components/Filter/Section/`.

1. **`index.tsx`** — chip cluster `.chipRow` now emits `role="group"` + `aria-labelledby`
   tied to the dimension label (id added to the label `<span>`), for labelled clusters.
2. **`index.tsx`** — new additive `headingLevel` prop; the collapsible toggle is optionally
   wrapped in a real heading element.
3. **`Section.module.css`** — `.toggle:focus-visible` ring with per-theme
   (`sacred`/`light`/`dark`) focus-ring color; inset offset.
4. **`Section.module.css`** — `@media (prefers-reduced-motion: reduce)` dropping the chevron
   transition.
5. **`Section.module.css`** — `.heading` transparent-wrapper reset (`margin:0; font:inherit`).
6. **`index.tsx`** (review follow-up, Issue 5) — moved the non-collapsible `role="search"` +
   `aria-label` off the section root onto the **`searchCell`**, so the right-aligned action
   button(s) are excluded from the search landmark. Zero visual change; `landmarkLabel` / `ref`
   JSDoc updated accordingly.
7. **`filterSection.stories.tsx`** (review follow-up, Issue 6) — added `play`-function assertions
   to `AccessibleHeading` and `AccessibleChipGroups` so the Chromatic-invisible ARIA/heading fixes
   are protected by an executable gate.

All preserve the machine-test selector contract: `data-component="FilterSection"`,
`data-filter-section`, `data-state`, `data-testid="filter-section-toggle"` /
`"filter-section-panel"`, `data-chip-cluster`, `data-subject` / `data-filter-section-field`,
and the Chip `data-chip-*` selectors are untouched. No existing prop/export was renamed,
removed, or retyped — every change is additive.

Per-file gates: `bun lint:file` passes clean (0 warnings) on `index.tsx` and
`filterSection.stories.tsx`. The dynamic-heading-tag typing matches the established repo
pattern (`EmptyState`, `Panel`, `Form/DataGrid`, `BigCalendar`, `ConfirmationCodeInput`, …).

## Stories updated

`filterSection.stories.tsx`:

- Added `headingLevel` to `argTypes` (number control 1–6) and threaded it through
  `FilterSectionDemo` / `DemoConfig`.
- **New story `A11y/Heading Level`** (`AccessibleHeading`) — collapsible with `headingLevel={2}`,
  exercising the `<h2>`-wrapped toggle.
- **New story `A11y/Chip Groups`** (`AccessibleChipGroups`) — three labelled chip clusters,
  exercising the `role="group"` + `aria-labelledby` grouping. (The `Default` and
  `All Controls` stories also render labelled clusters and now carry the group semantics.)
- The `:focus-visible` and reduced-motion behaviors are exercised by the existing
  `Collapsible (Open)` / `Collapsible (Closed)` stories (they render the toggle button whose
  keyboard focus ring and chevron transition are the changed surfaces).

**Review follow-up (Issue 6) — the two a11y stories are no longer render-only.** Both fixes are
invisible to the Chromatic visual gate, so each story now carries a `play` function that IS its
regression test (matching the `Collapsible (Open/Closed)` precedent):

- **`A11y/Heading Level`** (`AccessibleHeading`) — asserts a real `getByRole('heading', {level: 2,
  name: /Course Filters/})` exists, that it `toContainElement` the `filter-section-toggle` button,
  and that the toggle is `aria-expanded="true"`. A regression that drops the `headingLevel` wrapper
  (visually invisible — `.heading { font: inherit; margin: 0 }`) now fails here.
- **`A11y/Chip Groups`** (`AccessibleChipGroups`) — asserts each labelled cluster is exposed as
  `getByRole('group', { name: /Status|Level|Tags/ })` and that the Status group wraps its four
  `aria-pressed` toggle chips (`getAllByRole('button')` → length 4). A regression that drops
  `role="group"` or the `aria-labelledby` association now fails here.

## Deferred

- **True radio-group semantics for exclusive chip clusters** — when a cluster is
  `exclusive: true` (single-select, radio-like), the ideal ARIA is `role="radiogroup"` with
  `role="radio"` + `aria-checked` children. That requires the shared **`src/components/Chip/index.tsx`**
  to accept `role="radio"` + `aria-checked` (it currently emits `role="button"` + `aria-pressed`,
  `Chip/index.tsx:311,318`). FilterSection does not own that file. `role="group"` (applied here)
  is a complete, valid grouping for both exclusive and multi-select clusters; the radio upgrade is
  a nice-to-have.
  - *Suggested change (Chip, not owned):* add an optional `ariaChecked?: boolean` and let a
    `role="radio"` override drive `aria-checked` instead of `aria-pressed`, so a parent radiogroup
    can compose radios. Then FilterSection would set `role="radiogroup"` + per-chip `role="radio"`
    for exclusive clusters.
- **`aria-controls` references the panel id only while expanded** — the panel is unmounted when
  collapsed (`index.tsx:comment` / the `{isExpanded && …}` block), so `aria-controls={panelId}`
  points at a not-yet-rendered node while closed. This is an accepted Disclosure implementation
  (mount-on-open) and is required by the documented test contract
  (`[data-testid="filter-section-panel"]` exists only on the open panel), so it was intentionally
  **not** changed. No owned-file fix; noted for completeness.
