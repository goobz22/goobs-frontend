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
  disabled Prev/Next use the native `disabled` attribute — both are programmatic, not
  colour-only (satisfies 1.4.1). The active page is additionally distinguished by
  `font-weight:700` + background, not colour alone.
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

## Deferred

None. Every issue was fixable at root cause inside the component directory. No shared
util, Field/Shell, `src/styles/global.css`, or barrel change was required — the fixes only
*reference* the existing `--goobs-*-focus-ring` tokens already defined in
`src/styles/global.css` (not edited).
