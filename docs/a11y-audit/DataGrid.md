# DataGrid — a11y audit (2026-07-11)

**Status: PARTIAL** (all in-directory issues fixed; several root-cause fixes live in
shared components outside DataGrid ownership and are deferred with exact recommendations)

## APG pattern

The component renders a **real native `<table>`** (`<thead>/<tbody>/<tr>/<th>/<td>`) and
additionally carries interactive-grid ARIA (`role="grid"` on the root, `role="row"`,
`role="gridcell"`, `role="columnheader"`). It is an **editable data grid** — the applicable
WAI-ARIA APG pattern is [Grid](https://www.w3.org/WAI/ARIA/apg/patterns/grid/). Because it is
built on a real table, it also benefits from native table semantics (scope, header
association). The audit strengthened the native-table layer (which every screen reader
supports today) and completed the low-risk grid-state properties; the full roving-tabindex
keyboard grid pattern is a larger, test-contract-affecting effort and is deferred.

Overlays involved: **Dialog** (Manage Columns, CompositeFieldEditModal) and **Menu** (column
header actions popover, footer export menu).

## Issues found

Severity · WCAG · file:line · status

1. **Column headers had no `scope`** — serious — WCAG 1.3.1 —
   `Table/ColumnHeaderRow/index.tsx:69,94` — **FIXED**. Added `scope="col"` to both the
   select-all header cell and every data-column `<th>` so AT associates each cell with its
   column header. (pattern: `missing-th-scope`)
2. **Select-all checkbox had no accessible name** — serious — WCAG 4.1.2 —
   `Table/ColumnHeaderRow/index.tsx:70` — **FIXED**. Added `aria-label="Select all rows"`
   (goobs `Checkbox` forwards it to the underlying `<input>`). (pattern:
   `missing-accessible-name`)
3. **Sort state never exposed (`aria-sort` deliberately omitted)** — serious — WCAG 1.3.1 /
   4.1.2 — `Table/ColumnHeaderRow/index.tsx:112` (old comment) — **FIXED**. The grid now
   tracks `sortState` (`index.tsx`), threads `sortField`/`sortDirection` through `Table` →
   `ColumnHeaderRow`, and emits `aria-sort="ascending"|"descending"` on the sorted header.
   (pattern: `sort-state-not-announced`)
4. **No keyboard focus indicator on any custom control** — serious — WCAG 2.4.7 —
   `DataGrid.module.css` (all interactive classes were `:hover`-only) — **FIXED**. Added a
   themed `--dg-focus-ring` token per theme + a consolidated `:focus-visible` rule set
   covering header-menu, pagination, export cog, export menu items, dropdown menu items,
   Manage-Columns Done, mobile expand/action/field buttons, ManageRow action/add buttons, and
   mobile field inputs. (pattern: `missing-focus-visible-style`)
5. **Animations ignored `prefers-reduced-motion`** — moderate — WCAG 2.3.3 —
   `DataGrid.module.css` (sacred `datagridFloat` infinite float) + `Table/Rows/index.tsx`
   (inline currency pulse/shimmer infinite keyframes) — **FIXED**. Added a
   `@media (prefers-reduced-motion: reduce)` block that neutralizes animation duration/
   iteration and transitions; the stylesheet `!important` also overrides the non-important
   inline `animation` on the currency formatter spans. (pattern: `missing-reduced-motion`)
6. **Manage Columns modal was not a dialog** — serious — WCAG 4.1.2 / 2.1.2 / 2.4.3 —
   `ManageColumnsSimple/index.tsx:59` — **FIXED**. Added `role="dialog"`,
   `aria-modal="true"`, `aria-labelledby` (heading id via `useId`), Escape-to-close, initial
   focus into the dialog, a Tab focus trap, and focus restoration to the trigger on close.
   (pattern: `missing-dialog-semantics`)
7. **Column-visibility checkboxes had no accessible name** — moderate — WCAG 1.3.1 / 4.1.2 —
   `ManageColumnsSimple/index.tsx:86` — **FIXED**. Each toggle now has
   `aria-label="Show <column> column"` (the column name was only a sibling `<span>`, not a
   `<label>`). (pattern: `missing-accessible-name`)
8. **Export menu was not a menu; cog button lacked state** — moderate — WCAG 4.1.2 / 2.1.2 —
   `Footer/index.tsx:556,581` — **FIXED**. Cog button gained `aria-haspopup="menu"` +
   `aria-expanded`; the portalled menu gained `role="menu"` + `role="menuitem"` items +
   Escape-to-close (restoring focus to the cog). (pattern: `missing-menu-semantics`)
9. **Decorative footer SVG icons exposed to AT** — minor — WCAG 1.1.1 — `Footer/index.tsx`
   (Settings/Download/Pdf/4× chevron icons) — **FIXED**. Added `aria-hidden="true"` +
   `focusable="false"` (each button already carries an `aria-label`). (pattern:
   `icon-missing-aria-hidden`)
10. **Mobile card inline-edit inputs had no label association** — moderate — WCAG 1.3.1 /
    4.1.2 — `MobileCardView/CardField.tsx:227,181–222` — **FIXED**. The visible `<label>` now
    has `htmlFor` linked to a `useId` `id` on each native `<input>`/`<select>`. (pattern:
    `form-label-not-associated`)
11. **Mobile card Save/Cancel icon buttons had no name** — moderate — WCAG 4.1.2 —
    `MobileCardView/CardField.tsx:232,241` — **FIXED**. Added `aria-label="Save <field>"` /
    `"Cancel editing <field>"`, `type="button"`, and wrapped the `✓`/`✕` glyphs in
    `aria-hidden` spans. (pattern: `missing-accessible-name`)
12. **Card expand/collapse toggle missing state** — minor — WCAG 4.1.2 —
    `MobileCardView/Card.tsx:220` — **FIXED**. Added `aria-expanded`, `type="button"`, and
    `aria-hidden` on the `▼` glyph; the selection indicator (redundant with row
    `aria-selected`) is now `aria-hidden`. (pattern: `nonsemantic-state-toggle`)

### Deferred (root cause is outside DataGrid ownership, or needs a coordinated redesign)

- **D1 — Inline/creation/composite/AddCard field inputs have no accessible name** — serious —
  WCAG 1.3.1 / 4.1.2. `EditableCell`, `CreationRow`, `CompositeFieldEditModal`, and
  `MobileCardView/AddCard` render every goobs Field component with `label=""` and paint their
  own visual label separately, so the underlying `<input>` gets no programmatic name.
  `FieldShell` only renders an associated `<label htmlFor>` when a non-empty `label` is passed
  and exposes **no `aria-label` passthrough** (`inputAriaProps` in
  `src/components/Field/Shell/index.tsx:345` only sets required/disabled/invalid/describedby).
  **Recommended fix (Field/Shell owner):** add an `ariaLabel` prop to `FieldShell` +
  `FieldStyleOverrides` that maps to `inputAriaProps['aria-label']` when no visible label is
  rendered; then thread `ariaLabel={column.headerName || fieldConfig.label}` from the four
  DataGrid callers above. All four callers are in my directory and can adopt it immediately
  once the Shell prop exists.
- **D2 — Full keyboard grid pattern (roving tabindex, Arrow/Home/End/PageUp-Down cell nav,
  Enter/F2 to edit, Escape to exit edit)** — moderate — WCAG 2.1.1. The grid is mouse/tap
  driven; cell selection/edit is only reachable by pointer. Implementing the APG Grid keyboard
  model requires a roving `tabindex` scheme across `Rows`/`ColumnHeaderRow` and coordination
  with the ThothOS Playwright selector contract, so it is out of scope for an additive audit
  pass. Owner-visible today only because the native table is still readable/announced.
- **D3 — `role="grid"` on the root wrapper vs. the inner real `<table>`** — moderate — WCAG
  1.3.1. `index.tsx` puts `role="grid"` + `aria-rowcount`/`aria-colcount` on the outer
  container that wraps *both* the mobile card view and the desktop `<table>`; the real table
  keeps its implicit `role="table"`, so the grid's `role="row"`/`role="gridcell"` descendants
  are not "owned" by a grid per spec. The rule forbids removing existing role/aria attributes,
  so the correct resolution (move grid semantics onto the `<table>` element, or drop the
  wrapper `role="grid"`) needs owner sign-off + a test-contract review. Recommend: relocate
  `role="grid"`/`aria-rowcount`/`aria-colcount` onto the `<table>` and mark `<thead>/<tbody>`
  `role="rowgroup"`, once the Playwright keying is confirmed to tolerate it.
- **D4 — Keyboard column resize + keyboard column reorder** — minor — WCAG 2.1.1. The resize
  handle (`ColumnHeaderRow` `.resizeHandle` div) and the `draggable` header reorder are
  pointer-only. A `:focus-visible` rule is pre-staged for `.resizeHandle`; making it operable
  needs a `role="separator"` + arrow-key handler (new interaction design). Deferred.
- **D5 — Column-actions popover has no arrow-key roving among `menuitem`s** — minor — WCAG
  2.1.1. The menu has correct `role="menu"`/`menuitem` but arrow-key navigation lives in the
  shared `src/components/Popover` component (not owned). Recommend the Popover owner add the
  Menu keyboard model.
- **D6 — Mobile card tap/long-press not keyboard operable** — minor — WCAG 2.1.1. The card is
  a `role="row"` clickable `<div>` (`MobileCardView/Card.tsx`) with pointer/touch handlers
  only. Keyboard operability conflicts with the `role="row"` test contract; deferred pending
  the D2/D3 grid-keyboard redesign.

## Hearing

Grepped the whole directory for `Audio`/`AudioContext`/`<audio>`/`<video>`/
`navigator.vibrate` — **none present.** No information is conveyed by sound. All status/feedback
is visual + programmatic (validation via `role="alert"` Snackbar and `role="alert"` inline
error in `AddCard`; loading/empty via `data-grid-status` + visible text). No hearing-specific
gaps.

## Reading & screen reader

- Native table semantics strengthened: `scope="col"` on all headers, `aria-sort` on the sorted
  header, accessible names on the select-all + column-visibility checkboxes, `aria-colcount`
  added alongside the existing `aria-rowcount`.
- Overlays: Manage Columns is now a labelled modal dialog with Escape + focus trap + focus
  restore; the CompositeFieldEditModal already used the goobs `Dialog` with
  `role="dialog"`/`aria-modal`/`aria-label`. Export control is now a real menu button + menu.
- Icon-only controls named: select-all, column-visibility toggles, mobile Save/Cancel; footer
  icon buttons already had `aria-label`, ManageRow action buttons already had `aria-label` +
  `role="toolbar"`.
- Validation errors use `role="alert"`. `aria-invalid`/`aria-describedby` association for field
  errors is handled inside `FieldShell` (out of scope) — see D1 for the missing field *name*.
- Color-alone: currency/expiration/status formatters pair color with a text value and an icon
  glyph (▲/✓/⏳/✕), and selection/editing state is mirrored by `aria-selected` +
  `data-row-state`/`data-cell-state`, so state is not color-only.
- Remaining SR gap: field inputs inside the editors lack a programmatic name → **D1**.

## SEO semantics

- Content renders as a **real SSR'd `<table>`** with `<thead>/<tbody>/<th>/<td>` — crawlable,
  no client-only injection of primary content. Header text is real `<th>` text.
- The Manage Columns heading is a real `<h3>`; the dialog is now programmatically labelled by
  it.
- No fake links/headings introduced. Export/pagination controls are real `<button>`s. No
  canvas/QR primary content (the PDF export is a user action, not page content).
- Landmark note (not changed): the grid does not sit inside a `<nav>`/`<section>` landmark, but
  a data table is not itself a landmark; the native `<table>` role is the correct exposure.

## Fixes applied

See Issues 1–12 above. Touched only files inside `src/components/DataGrid/**` plus this report:
`Table/ColumnHeaderRow/index.tsx`, `Table/index.tsx`, `types/index.ts`, `index.tsx`,
`DataGrid.module.css`, `Footer/index.tsx`, `ManageColumnsSimple/index.tsx`,
`MobileCardView/CardField.tsx`, `MobileCardView/Card.tsx`, `DataGrid.stories.tsx`.

All edited `.ts/.tsx` pass `bun lint:file` (eslint `--fix --max-warnings=0`, exit 0);
`DataGrid.module.css` passes `stylelint`.

## Stories updated

`DataGrid.stories.tsx` gained two regression stories with `play` assertions (goobs has no unit
tests — stories are the regression net):

- **`A11y — Header Semantics & Sort`** — asserts `role="grid"` + `aria-rowcount`/`aria-colcount`
  on the root, `scope="col"` + `role="columnheader"` on headers, the select-all checkbox
  accessible name, `aria-haspopup` on the header menu trigger, and that sorting via the header
  menu emits `aria-sort="ascending"` on the sorted header.
- **`A11y — Dialog & Menu Overlays`** — opens Manage Columns via the header menu and asserts
  `role="dialog"` + `aria-modal` + `aria-labelledby`→"Manage Columns", that Escape closes it,
  and that the export cog button toggles `aria-expanded` and opens a `role="menu"`.

## Deferred

See D1–D6 under "Issues found". The single highest-value follow-up is **D1** (add an
`ariaLabel` passthrough to `FieldShell`), which unblocks accessible names for every inline /
creation / composite / mobile field editor from the DataGrid side in one small follow-up.
