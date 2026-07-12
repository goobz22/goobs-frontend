# WorkspaceFilterShell — a11y audit (2026-07-11)

**Status:** FIXED

**Component:** `src/components/WorkspaceFilterShell/index.tsx` (+ `WorkspaceFilterShell.module.css`, `workspaceFilterShell.stories.tsx`)

## APG pattern

`WorkspaceFilterShell` is primarily a **presentational layout primitive** — it arranges
consumer-supplied slots (`metrics` / `nav` / `subNav` / `filter` / `children`) into a
consistently-spaced stack. Those slots bring their OWN roles (`<Tabs>` → tablist,
`<FilterSection>` → search/chips), so the shell wrapper itself needs no ARIA pattern; its
zone containers are correctly plain `<div data-shell-zone>` presentational elements.

The one interactive surface the shell owns is its **built-in pagination control**
(`ShellPagination`). Its applicable pattern is the WAI-ARIA APG **Pagination** example
(a `nav` landmark of page controls with `aria-current="page"` on the active page). The
audit is scoped to that control plus the shell's SSR semantics.

## Issues found

| # | Severity | WCAG | Location | Issue | Status |
|---|----------|------|----------|-------|--------|
| 1 | serious | 2.4.7 Focus Visible (A) | `WorkspaceFilterShell.module.css:104` (`.pageBtn` had `:hover`/`:disabled`/active only) | No `:focus-visible` treatment on the page-number / Prev / Next buttons. Every other interactive component in the library ships an explicit themed focus ring (Button, Breadcrumb, Chip, Accordion…); this control had none, so keyboard focus was left to the inconsistent (and, on the gold/dark surface, low-contrast) UA default. | FIXED |
| 2 | moderate | 1.3.1 Info & Relationships / 4.1.2 Name-Role-Value (A) | `index.tsx:104` (`<div role="navigation">`) | The pagination used a `<div role="navigation">` instead of the native `<nav>` landmark that the library's own Breadcrumb uses. Native element is the accessible-by-default (and SSR-crawlable) choice. | FIXED |
| 3 | moderate | 2.4.6 Headings & Labels / 4.1.2 (A/AA) | `index.tsx:121` (numbered `btn(p, p, …)`) | Numbered page buttons exposed only the bare digit as their accessible name ("5, button"). APG recommends a descriptive `"Page N"`. Added `aria-label="Page N"` — kept a superstring of the visible digit so it also satisfies **2.5.3 Label in Name**. | FIXED |
| 4 | moderate | 4.1.3 Status Messages (AA) | `index.tsx:129` (`.pageInfo` span) | Activating a page control changes the "X-Y of Z" range and the card content, but focus stays on Prev/Next — a screen-reader user got no confirmation the page changed. Made the range readout a polite, atomic live region (`aria-live="polite"` + `aria-atomic="true"`) so the new range is announced. | FIXED |
| 5 | minor | 1.3.1 Info & Relationships (A) | `index.tsx:117` (ellipsis `<span>…</span>`) | The decorative gap ellipsis was exposed to AT ("horizontal ellipsis"); the numbered buttons already convey the skipped range. Marked `aria-hidden="true"`. | FIXED |
| 6 | minor | 2.3.3 Animation from Interactions (AAA) | `WorkspaceFilterShell.module.css:101` (`.pageBtn { transition }`) | The page-button colour transition had no `prefers-reduced-motion` guard, unlike sibling components (Breadcrumb, Button, Chip…). Added an `@media (prefers-reduced-motion: reduce)` block dropping the transition. | FIXED |

*(Line numbers reference the pre-fix source.)*

## Hearing

No `Audio`/`AudioContext`/`<audio>`/`<video>`/`navigator.vibrate` usage anywhere in the
component (grepped) — nothing conveyed by sound, no media playback. No WCAG 1.2.x / 1.4.2
exposure. **CLEAN.**

## Reading & screen reader

- **Accessible names:** Prev/Next carry their visible text as accessible name (kept as-is,
  no `aria-label` — avoids a 2.5.3 mismatch). Numbered buttons now carry `"Page N"`
  (issue 3). The `nav` landmark is named "Pagination".
- **Semantic HTML:** pagination controls are native `<button type="button">`; the landmark
  is now a native `<nav>` (issue 2). No role-annotated divs used for interaction.
- **State:** active page uses `aria-current="page"` (present before the audit, retained);
  boundary Prev/Next use `aria-disabled="true"` (NOT the native `disabled` attribute — see
  review finding R1) so they stay focusable while still exposing the disabled state
  programmatically, not colour-only (satisfies 1.4.1). The active page is additionally
  distinguished by `font-weight:700` + background, not colour alone.
- **Focus:** added a visible themed `:focus-visible` ring for sacred/light/dark (issue 1).
  The component owns no overlay/dialog/drawer, so focus-trap / Escape / focus-restore
  requirements do not apply.
- **Dynamic updates:** the range readout is now a live region (issue 4).
- **Motion:** reduced-motion guard added (issue 6).

## SEO semantics

- The shell renders no heading text of its own, so no `<div>`-as-heading violation exists
  and no `headingLevel` prop is warranted — heading semantics belong to the consumer's
  slotted content (e.g. `MetricsAccordion`). No change needed.
- The pagination is now a real `<nav aria-label="Pagination">` landmark (issue 2), so it
  is present and correctly labelled in the SSR'd HTML.
- All shell content is server-rendered from props — no client-only injection of primary
  content; `'use client'` is only for the `onPageChange` interactivity. No canvas/QR
  alt-text concern.
- The zone wrappers (`data-shell-zone="metrics|nav|sub-nav|filter|content"`) are
  intentional presentational containers + test selectors — left untouched.

## Fixes applied

All fixes are at root cause and confined to the component directory:

1. **`index.tsx`** — `<div role="navigation">` → native `<nav>` (dropped the now-redundant
   `role`, kept `aria-label`, `data-shell-zone`, `className`).
2. **`index.tsx`** — added an `ariaLabel` option to the internal `btn()` helper; numbered
   buttons now pass `ariaLabel="Page N"`.
3. **`index.tsx`** — decorative ellipsis span marked `aria-hidden="true"`.
4. **`index.tsx`** — range readout span given `aria-live="polite"` + `aria-atomic="true"`.
5. **`WorkspaceFilterShell.module.css`** — added `.pageBtn:focus-visible` with the
   per-theme focus-ring tokens (`--goobs-sacred/light/dark-focus-ring`), matching the
   Breadcrumb pattern.
6. **`WorkspaceFilterShell.module.css`** — added `@media (prefers-reduced-motion: reduce)`
   dropping the `.pageBtn` transition.

**Preserved contract (unchanged):** `data-component="WorkspaceFilterShell"`,
`data-workspace-shell-field`, all `data-shell-zone="*"`, the pagination
`data-action="prev"/"next"`, `aria-current="page"`, and every existing prop/export. No
prop was renamed, removed, or retyped; the only additive change is the internal helper's
optional `ariaLabel`. Gates: `bun lint:file` on both `.tsx` files → exit 0; `stylelint`
on the module.css → exit 0.

## Stories updated

- **New story `PaginationA11y`** (`workspaceFilterShell.stories.tsx`) — renders a 200-item /
  10-per-page range so Prev / numbered / **ellipsis** / Next all appear, then a `play` test
  pins the whole pagination a11y contract:
  - the pagination is a real `<nav aria-label="Pagination">` (`tagName === 'NAV'`);
  - a numbered control resolves by accessible name `"Page 4"`;
  - the active page carries `aria-current="page"`;
  - the ellipsis is `aria-hidden`;
  - the range readout is `aria-live="polite"` + `aria-atomic="true"` and reads `"21-30 of 200"`;
  - clicking "Page 4" moves `aria-current` AND updates the live region to `"31-40 of 200"`.
- Added `userEvent` to the `storybook/test` import for the paging interaction.
- The pre-existing `Sacred` play test (tab count, zone presence, `data-shell-zone="pagination"`)
  still holds — the div→nav change keeps the `data-shell-zone` selector intact.

## Adversarial-review follow-ups (2026-07-11)

A fresh adversarial review of the pass above found three remaining minor issues. All fixed at
root cause inside the component directory.

| # | Severity | WCAG | Issue | Status |
|---|----------|------|-------|--------|
| R1 | minor | 2.4.3 Focus Order (A) | Keyboard focus was silently lost to `<body>` at the pagination boundaries: Prev/Next were rendered with the native `disabled` attribute, and because they carry stable keys the SAME focused DOM node became `disabled` after an activation that reached page 1 / the last page (e.g. Tab to Prev on page 2, activate → page 1 → Prev disables). Browsers blur a control that becomes disabled, dropping focus to `document.body`, so the next Tab restarts from the top of the page. | FIXED |
| R2 | minor | (regression coverage) | Two shipped a11y states were unexercised by any story: nothing keyboard-focused a `.pageBtn` to render/capture the `:focus-visible` ring, and nothing rendered under `prefers-reduced-motion`; the sole pagination story was sacred-only so the light/dark focus-ring token overrides were also visually unpinned. | FIXED |
| R3 | minor | 2.4.6 Headings & Labels (AA) | Inconsistent accessible-name treatment: numbered buttons got a descriptive `"Page N"` name but Prev/Next kept only the abbreviated visible text with no "page" context, unlike the WAI-ARIA APG Pagination example. | FIXED |

### R1 — boundary focus preservation (root-cause fix)

The internal `btn()` helper no longer emits the native `disabled` attribute. Boundary controls
now render `aria-disabled="true"` (omitted entirely when enabled — never `aria-disabled="false"`),
which keeps them in the tab order so focus is preserved across a boundary activation, and their
`onClick` is guarded to an inert no-op so an aria-disabled control cannot page past the range.
`index.tsx`. The two `:disabled` / `:not(:disabled, …)` selectors in `WorkspaceFilterShell.module.css`
(base + light + dark) were retargeted to `[aria-disabled='true']` so the muted/not-allowed boundary
styling and the hover-exclusion still apply. The `:focus-visible` ring now also (correctly) shows on
a focused boundary control, per the APG "aria-disabled stays focusable" pattern.

**Markup change (noted per contract):** boundary Prev/Next emit `aria-disabled="true"` instead of the
native `disabled` attribute. This is additive for assistive tech and preserves every existing
`data-action="prev"/"next"` / `aria-current` / `data-shell-zone` selector; the boundary state remains
machine-detectable (now via `aria-disabled` rather than `:disabled`). No prop or export changed.

### R3 — Prev/Next accessible names

Prev/Next now pass `ariaLabel="Previous page"` / `"Next page"` through the existing `btn()` `ariaLabel`
option (its JSDoc was generalised from "bare digit only" to cover both cases). Each accessible name is a
superstring of the visible `"Prev"`/`"Next"` text, so 2.5.3 Label in Name still holds.

### R2 — new/extended regression stories

- **`PaginationA11y` (sacred)** — extended: asserts Prev/Next resolve by the new `"Previous page"` /
  `"Next page"` names, then `userEvent.tab()` moves keyboard focus onto `Page 5` and asserts
  `toHaveFocus`, driving the **sacred** `:focus-visible` ring for the Chromatic baseline.
- **`PaginationBoundaryFocus` (new, sacred)** — the R1 regression: starts on page 2 of 3, clicks Prev,
  and asserts Prev goes `aria-disabled="true"` yet **still holds focus** (fails against the old native
  `disabled`), the live region updates to `1-10 of 30`, and a second click is an inert no-op.
- **`PaginationFocusLight` / `PaginationFocusDark` (new)** — Tab-focus a page control on the light and
  dark surfaces so the **`--goobs-light-focus-ring` / `--goobs-dark-focus-ring`** token overrides are
  each pinned.
- **`PaginationReducedMotion` (new)** — renders under the reduced-motion narrative (matching the sibling
  `Slide` reduced-motion story convention) and its `play` deterministically asserts the
  `@media (prefers-reduced-motion: reduce)` guard targeting `.pageBtn`'s `transition` shipped in the
  loaded stylesheet, so the guard cannot silently regress.
- A shared module-level `PaginationOnly` harness backs the new pagination-only stories.

## List-semantics follow-up (2026-07-11, second-owner pass)

A fresh audit of the shipped state above found one real remaining issue, fixed at root cause inside
the component directory.

| # | Severity | WCAG | Location | Issue | Status |
|---|----------|------|----------|-------|--------|
| L1 | minor | 1.3.1 Info & Relationships (A) | `index.tsx` `ShellPagination` `<nav>` (page controls were **direct children** of `<nav>`) | The pagination is a set of related controls (Prev + numbered + Next) that visually forms a list, but the set relationship / item count was NOT programmatically conveyed — the buttons sat as a flat run of direct `<nav>` children with no list wrapper. This is inconsistent with the library's **own Breadcrumb**, which the pagination code explicitly claims to match (`Breadcrumb/index.tsx:246-253` wraps its `<nav>` items in `<ol className={list}><li>`), and with the WAI-ARIA APG Pagination example. A screen-reader user heard a flat series of buttons instead of "list, N items". | FIXED |

**Fix (`index.tsx` + `WorkspaceFilterShell.module.css`):** the Prev / numbered / Next controls are now
wrapped in a `<ul role="list">` with each control in its own `<li>`, mirroring Breadcrumb's `<ol>/<li>`.
`role="list"` is set **explicitly** on the `<ul>` because the `list-style: none` a control strip needs
strips the implicit list semantics in Safari/VoiceOver — the role restores them. The decorative gap
ellipsis is now an `<li aria-hidden="true">` (the `aria-hidden` moved from the glyph `<span>` to the whole
`<li>`) so it is neither announced as an empty list item nor counted in the set size. The `X-Y of Z` range
readout stays **outside** the list (it is a status, not a page control) so it doesn't inflate the item
count. New `.pageList` (`<ul>`) / `.pageItem` (`<li>`) CSS carries the same flex row + `clamp(4px,1vw,8px)`
gap the flat layout used and is content-sized (no `flex-grow`), so the control strip + range readout stay
centred together as one group — **visually identical** to the pre-list markup.

**Markup change (noted per contract):** the pagination controls gained a `<ul role="list">` / `<li>`
wrapper. This is **additive** — every existing selector is preserved: the `<nav data-shell-zone="pagination"
aria-label="Pagination">` landmark, each control's `data-action="prev"/"next"`, `aria-current="page"`,
`aria-disabled`, and the `aria-live` range readout are all unchanged and still resolve. No prop or export
changed. The buttons stay native `<button>`s (page changes are client-side via `onPageChange`, there is no
URL to make them `<a href>`), so button remains the semantically correct control.

**Story:** `PaginationA11y`'s `play` was extended to pin the list contract — it asserts the `<nav>` contains
a `<ul role="list">`, that `Page 4` / `Previous page` / `Next page` each resolve inside an `<li>` of that
list, and that the ellipsis `<li aria-hidden="true">` carries the `…`. These assertions FAIL against the
former flat markup, so the list semantics cannot silently regress.

**Also this pass:** an unrelated, coherent in-flight `ref`-forwarding addition to the shell root `<div>`
(React 19 ref-as-prop, matching the Breadcrumb/TreeView root-forwarding convention) was found uncommitted
in `index.tsx`; per the shared-tree model it was save-committed first (`c37affa1`) so it could not be lost,
then the a11y fix landed on top. It is not part of this a11y finding.

## Landmark-uniqueness follow-up (2026-07-11, adversarial-review pass)

A fresh adversarial review of the shipped state above found one real remaining issue, fixed at root cause
inside the component directory.

| # | Severity | WCAG | Location | Issue | Status |
|---|----------|------|----------|-------|--------|
| U1 | minor | ARIA11 landmark uniqueness (best practice) | `index.tsx` `ShellPagination` `<nav aria-label="Pagination">` | The pagination landmark's accessible name was HARDCODED as `aria-label="Pagination"` with no override prop (`WorkspaceFilterShellProps` exposed no `paginationLabel`/`ariaLabel`). Rendering more than one `WorkspaceFilterShell` with pagination on a single page — or a shell alongside any other paginated `<nav>` — produces multiple same-type navigation landmarks sharing the IDENTICAL accessible name, so assistive-tech landmark navigation cannot distinguish them (WAI-ARIA / WCAG technique ARIA11). Inconsistent with the library's own `Breadcrumb` (`Breadcrumb/index.tsx:52-53,73`) which the pagination code claims to mirror and which DOES accept a customizable `aria-label` prop. Minor: one paginated shell per page is the common case. | FIXED |

**Fix (`index.tsx`):** added an additive, optional `paginationLabel?: string` prop to
`WorkspaceFilterShellProps`, defaulting to `'Pagination'` (so existing consumers are byte-for-byte
unchanged). It is threaded to the internal `ShellPagination`'s new required `label` prop and rendered as
the `<nav aria-label={label}>`. Consumers put a distinct name on each paginated shell on a shared page
(e.g. `paginationLabel="Invoices pagination"` / `"Customers pagination"`) to restore landmark uniqueness.
This mirrors `Breadcrumb`'s `aria-label` prop; `paginationLabel` (not a bare `aria-label`) is the chosen
name because the shell ROOT is a plain `<div>`, not a landmark — the label targets specifically the
pagination `<nav>`, so a generic `aria-label` on the shell would be ambiguous.

**Markup change (noted per contract):** none — the `<nav>` still emits an `aria-label`; only its VALUE is
now consumer-overridable (default preserved). No DOM element, `data-*`, `role`, `aria-current`,
`aria-disabled`, `data-action`, or `data-shell-zone` selector changed. No existing prop or export was
renamed, removed, or retyped — the sole change is the ADDED optional `paginationLabel` prop (public API
grows additively).

**Story:** new `PaginationCustomLabel` (`workspaceFilterShell.stories.tsx`, story 8) renders TWO paginated
shells on one page with `paginationLabel="Invoices pagination"` and `"Customers pagination"`, then its
`play` asserts each `<nav>` resolves by its OWN unique accessible name AND that the shared default
`"Pagination"` name is no longer present. This FAILS against the pre-fix hardcoded `aria-label` (both navs
would have shared `"Pagination"`), so the regression is pinned. The `PaginationOnly` harness gained an
optional `paginationLabel` passthrough to back the story.

## Deferred

None. Every issue — original, review follow-up, list-semantics pass, and this landmark-uniqueness pass — was
fixable at root cause inside the component directory. No shared util, Field/Shell, `src/styles/global.css`,
or barrel change was required; the CSS fixes only *reference* the existing `--goobs-*-focus-ring` tokens
already defined in `src/styles/global.css` (not edited).
