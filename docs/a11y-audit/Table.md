# Table — a11y audit (2026-07-11)

**Status:** FIXED
**APG pattern:** [Table](https://www.w3.org/WAI/ARIA/apg/patterns/table/) — a **static (non-interactive) data table**. Native `<table>` semantics are the whole pattern: `<table>` → `<thead>`/`<tbody>` rowgroups → `<tr>` rows → `<th scope="col">`/`<th scope="row">` header cells → `<td>` data cells, with an optional `<caption>` as the accessible name. It is NOT a `grid` (no focusable cells / arrow-key roving), so no `role="grid"`, `aria-rowindex`, or cell keyboard model is owed.

The component is a set of composable primitives — `TableContainer` (div), `Table` (table), `TableHead` (thead), `TableBody` (tbody), `TableRow` (tr), `TableCell` (td). The `<table>`/`<thead>`/`<tbody>`/`<tr>` bones were already real semantic elements (good for SSR + AT). The defect was the cell: **`TableCell` always rendered `<td>`**, so *header* cells were plain data cells with no column association — the single most important relationship in a data table was missing — and the one documented escape hatch (a raw `<th>` child) produced invalid `<td><th>` markup. Secondary gaps: the horizontal scroll region was not keyboard-operable, there was no way to give the table an accessible name, and the row hover transition ignored reduced-motion. The repo's own `DataGrid` (`Table/ColumnHeaderRow` `<th scope="col">` + `role="rowgroup"`) and `PricingTable` (`<th scope="col">`/`<th scope="row">` + `aria-labelledby`) are the accessible-table references this brings the primitive family up to.

## Issues found

| # | Severity | WCAG | Location | Issue | Status |
|---|----------|------|----------|-------|--------|
| 1 | Serious | 1.3.1 Info & Relationships (A); 4.1.2 Name, Role, Value (A) | `index.tsx` `TableCell` (pre-fix line ~310, `<td>` always) | Header-row cells rendered as `<td>`, not `<th scope="col">`. In every story (`<TableHead><TableRow><TableCell>ID…`) and any consumer, the column headers were plain data cells — screen readers got **no column-header↔data-cell association**, so navigating the table announced values with no column name. The defining relationship of a data table was absent. | FIXED |
| 2 | Serious | 1.3.1 (A); 4.1.1 Parsing / valid nesting | `index.tsx` `TableCell` `isHeader` branch (pre-fix ~315–326) | The documented header mechanism — pass a raw `<th>` child (`<TableCell><th>X</th></TableCell>`) — emitted `<td data-header-cell="true"><th>X</th></td>`: a `<th>` nested inside a `<td>`, **invalid table markup**, and STILL not a scoped column header (the outer element stayed a `<td>`; the inner `<th>` had no `scope`). | FIXED |
| 3 | Moderate | 2.1.1 Keyboard (A); 2.4.7 Focus Visible (AA) | `Table.module.css:27` `.container { overflow-x: auto }` | The container is the horizontal scroll viewport but had no focusable element and no focus style, so a keyboard-only user could **not scroll an overflowing table** (mouse/trackpad only) — axe `scrollable-region-focusable`. | FIXED |
| 4 | Moderate | 1.3.1 (A); 2.4.6 Headings & Labels (AA) | `index.tsx` `Table` (no caption support) | No way to give the `<table>` a `<caption>` or accessible name. Multiple tables on a page were indistinguishable to AT and the crawler; there was no programmatic summary of the table's purpose. | FIXED |
| 5 | Minor | 2.3.3 Animation from Interactions (AAA) | `Table.module.css:117` `.row { transition: background-color 0.2s ease }` | The row-hover background fade had **no `prefers-reduced-motion` guard**. | FIXED |
| 6 | Minor | 1.3.1 Info & Relationships (A) | `index.tsx` `TableCell` `renderAsHeader` (`component === 'th' \|\| section === 'head' \|\| childIsRawTh`) | The `component` prop was authoritative in ONE direction only: `component="th"` forced a header, but `component="td"` was **ignored inside a `TableHead`** because `section === 'head'` short-circuited the OR. A cross-tab layout's leading corner cell (an empty spacer, NOT a column header) was therefore rendered as a spurious `<th scope="col">` and announced by AT as a column header — a false info-&-relationships association, and the `component="td"` escape hatch documented on the prop was inert. Fixed to `component != null ? component === 'th' : section === 'head' \|\| childIsRawTh`, making an explicit `component` authoritative in BOTH directions (and suppressing the spurious `scope="col"` on the forced `<td>`). | FIXED |

No hearing/media issues: a grep of the component for `Audio`/`AudioContext`/`<audio>`/`<video>`/`navigator.vibrate` found nothing — a Table conveys no information by sound. No color-only-state issue: the only stateful styling is `hover` (a transient pointer affordance, not conveyed information — 1.4.1 N/A); there is no selected/error/disabled/current state on this primitive. No icon/svg/link/heading surface exists on the component, so accessible-name-on-control and crawlable-link checks are N/A.

## Hearing

Clean. The component plays no audio and vibrates nothing; the only feedback (row hover) is visual. No caption/transcript surface is applicable.

## Reading & screen reader

- **Column headers (Issues 1 & 2):** a `TableCell` now resolves to a real `<th scope="col">` **automatically** when it sits inside a `TableHead` — no prop required, accessible-by-default. The mechanism is an internal `TableSectionContext` provided by `TableHead` (`'head'`) and `TableBody` (`'body'`); `TableCell` reads it. The context provider renders no DOM node, so `<thead>`/`<tbody>` remain the direct `<table>` children. Screen readers now announce each value cell with its column name.
- **Row headers:** a leading body cell can be made that row's header with the additive `component="th" scope="row"` — so a row is announced by its name (e.g. the report name) alongside every value, matching `PricingTable`'s row-label pattern.
- **Legacy raw-`<th>` child (Issue 2):** `<TableCell><th>X</th></TableCell>` is now **unwrapped** — the child `<th>`'s content is hoisted onto a single valid `<th scope="col">` instead of the previously-invalid `<td><th>` nesting. The `data-header-cell="true"` styling attribute is preserved (now additionally emitted for context/`component`-resolved header cells, never removed).
- **Header appearance now matches header semantics:** before the fix, head cells were body-styled `<td>` (e.g. sacred `gold-a90` serif, non-bold) because `.cell`'s own `color`/`font` beat the `.head` cascade; only the `<thead>` background looked header-ish. Header cells now carry `data-header-cell="true"`, so the existing per-theme `.cell[data-header-cell='true']` rules apply (sacred gold uppercase on `gold-a10`; light `--goobs-light-text` on `light-surface-raised`; dark `--goobs-dark-text` on `dark-surface-raised`) — all previously contrast-validated. The Sacred/Light/Dark/StyleOverrides/BareTableThemed stories now render their described header styling (the fix makes the stories' own JSDoc true).
- **Accessible name (Issue 4):** the additive `Table` `caption` prop renders a real `<caption>` — the first thing AT announces for the table, and a crawlable summary. `TableContainer`'s additive `ariaLabel` names the scroll region.
- **Focus (Issue 3):** `TableContainer` is now `tabIndex={0}`; `.container:focus-visible` draws a 2px inset ring (`--goobs-light-primary` base, `--goobs-sacred-focus-ring` / `--goobs-dark-primary` per-theme overrides — the Pagination focus-ring convention), restricted to keyboard focus (`:focus:not(:focus-visible)` drops the pointer outline). Keyboard users can now focus the region and arrow-scroll an overflowing table.
- **Keyboard model:** a static table owes no roving/arrow-key cell navigation; Tab reaches the scroll region (to scroll), and that is the complete interaction. No keyboard trap.

## SEO semantics

Already correct and preserved: real `<table>`/`<thead>`/`<tbody>`/`<tr>` elements rendered server-side (this markup is what Next.js SSR ships to the crawler), plus `data-component="Table"` and the `data-theme`/`data-hover`/`data-header-cell` selectors — all untouched. The fix upgrades the crawled markup where it was weakest: column headers are now `<th scope="col">` (was `<td>`), an optional `<caption>` gives the table a name, and row headers can be `<th scope="row">`. No heading level is semantically owed by a data table — `<caption>` is the correct labelling element, so no `headingLevel` prop was added.

## Fixes applied

All at root cause, inside the component directory, additive-only (no prop or export renamed/removed/retyped; no `data-*`/`role`/`aria` selector removed):

- `index.tsx`
  - Added internal `TableSectionContext` (`'head' | 'body' | undefined`); `TableHead` provides `'head'` and `TableBody` provides `'body'` (provider wraps rows *inside* the `<thead>`/`<tbody>`, emitting no DOM node).
  - `TableCell` now renders `<th scope="col">` when it is inside a `TableHead`, when `component="th"`, or when a raw `<th>` child is passed (that child is unwrapped to content); otherwise `<td>`. Header cells emit `data-header-cell="true"` and an appropriate `scope` (default `'col'`, or the passed value). New additive props: `component?: 'td' | 'th'`, `scope?: 'col' | 'row' | 'colgroup' | 'rowgroup'`.
  - `Table` gained an additive `caption?: React.ReactNode` prop rendering a `<caption>` as the first table child.
  - `TableContainer` gained `tabIndex={0}` (keyboard-scrollable region) and an additive `ariaLabel?: string` that promotes it to a labelled `role="region"` when supplied (unlabelled otherwise, to avoid an unnamed landmark).
- `Table.module.css`
  - `.container:focus-visible` ring (+ `:focus:not(:focus-visible)` reset) with per-theme override rules.
  - `.caption` styling (themed like a header label; sacred default + light/dark cascade via container/table).
  - `@media (prefers-reduced-motion: reduce) { .row { transition: none } }`.

### Markup changes (per the API contract note)

- **Header cells: `<td>` → `<th scope="col">`** for cells inside a `TableHead` (and for `component="th"` / raw-`<th>`-child cells). This is the semantically-correct element the contract explicitly permits changing to; it is the fix. `data-header-cell="true"` is now emitted on these header cells (an existing attribute, now applied in more cases — never removed/renamed). The `.cell` class, `data-theme`, and `data-hover` selectors are unchanged.
- The legacy raw-`<th>` child renders as **one valid `<th>`** (content unwrapped) instead of nested `<td><th>`.
- `TableContainer` gains `tabIndex={0}`, plus `role="region"` + `aria-label` **only when `ariaLabel` is supplied**.
- `Table` renders a `<caption>` **only when `caption` is supplied** (default: none — backward-compatible).
- No machine-test selector was touched: Table cells carry none of the `data-field-name`/combobox/`data-action` selectors; `data-component="Table"` on the `<table>` is unchanged.

## Stories updated

The stories are this repo's only regression tests; the existing Sacred/Light/Dark/BareTableThemed stories now exercise the auto-`<th scope="col">` header path (their head cells become real header cells).

- `StyleOverrides` — the redundant per-cell `styles={{ color: '#fff' }}` on the header cells was removed: those cells are now real `<th>` inside `TableHead`, taking white from `--table-header-color` (set on the Table) over the teal `--table-header-bg` → white-on-teal 5.47:1, with no per-cell override. JSDoc updated to describe the `<th scope="col">` resolution.
- `SemanticDataTable` — **new**: pins full accessible semantics — `caption` → `<caption>`; container `ariaLabel` → labelled focusable scroll region; auto `<th scope="col">` column headers; and per-row `<th scope="row">` via `component="th" scope="row"`.
- `LegacyHeaderChild` — **new**: pins that `<TableCell><th>…</th></TableCell>` now renders a single valid `<th scope="col">` (child unwrapped), rendered outside a `TableHead` so the unwrap path is what produces the header cell.
- `CrossTabCornerCell` — **new** (Issue 6): pins the bidirectional `component` escape hatch. The leading corner cell of a cross-tab's header row uses `component="td"` to stay a plain `<td>` (no `data-header-cell`, no spurious `scope="col"`) even though it lives in the `<thead>`; the remaining head cells still auto-resolve to `<th scope="col">` and each body row's leading cell is a `<th scope="row">`. Fails the pre-fix baseline, where `section === 'head'` short-circuited the resolver and the corner cell rendered a spurious empty header.

## Deferred

None. Every fix lived inside the `Table` component directory; no shared file (Field/Shell, `src/styles/global.css`, the barrel, `src/index.ts`) needed changing. The focus/caption CSS reuses existing `--goobs-*` tokens already defined in `global.css` (`--goobs-light-primary`, `--goobs-sacred-focus-ring`, `--goobs-dark-primary`, `--goobs-space-sm/md`, `--goobs-tracking-sacred-wide`, `--goobs-font-sacred`, `--goobs-{light,dark}-text`, `--goobs-gold`).

**Non-blocking observation (not a WCAG failure, left as-is):** `tabIndex={0}` on the container makes it a tab stop even when the table does not overflow (there is no reliable SSR-time way to detect overflow). This matches the pragmatic responsive-table pattern (e.g. GOV.UK) and is preferable to leaving an overflowing table unscrollable by keyboard; documented rather than gated behind a prop.
