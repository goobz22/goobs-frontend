# DataGrid — a11y audit (2026-07-11)

**Status: PARTIAL** (round 1 in-directory issues fixed; round 2 adversarial-review
findings D2–D6 + the footer-menu keyboard model + WCAG 4.1.3 status messages are now
FIXED at root cause; **only D1 remains deferred** — its root cause is `FieldShell`, a
shared component outside DataGrid ownership, recorded below with an exact recommendation.
See "Review round 2" for the per-finding resolution.)

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

### Deferred (root cause is outside DataGrid ownership)

- **D1 — Inline/creation/composite/AddCard field inputs have no accessible name** — serious —
  WCAG 1.3.1 / 4.1.2 — **STILL DEFERRED (root cause outside ownership).** `EditableCell`,
  `CreationRow`, `CompositeFieldEditModal`, and `MobileCardView/AddCard` render every goobs
  Field component with `label=""` and paint their own visual label separately, so the
  underlying `<input>` gets no programmatic name. Verified in round 2 that there is **no
  in-directory fix**: `FieldShell` (`src/components/Field/Shell/index.tsx:345`) builds
  `inputAriaProps` with only required/disabled/invalid/describedby — **no `aria-label`
  passthrough** — and the leaf Field components (e.g. `Field/Text/index.tsx`) render a fixed
  prop list onto the input and do **not** spread arbitrary DOM props, so a caller-supplied
  `aria-label` cannot reach the input from the DataGrid side. An implicit `<label>`-wrapping
  hack was rejected: it would break the combobox/dropdown test contract (button + portalled
  listbox) and mis-associate composite IPAM fields. **Recommended fix (Field/Shell owner):**
  add an `ariaLabel` prop to `FieldShell` + `FieldStyleOverrides` mapping to
  `inputAriaProps['aria-label']` when no visible label is rendered, and forward it from the
  leaf Field components onto the input. Then thread
  `ariaLabel={column.headerName || fieldConfig.label}` from the four DataGrid callers (all in
  this directory, ready to adopt immediately once the Shell prop exists). See `deferred` in the
  structured result for the exact file:line + change.

_(D2–D6 from round 1 are now FIXED — see "Review round 2" below.)_

## Review round 2 (adversarial) — fixes

Each finding from the adversarial review, with its root-cause resolution. Markup changes are
noted explicitly. Every new behaviour is exercised by a new play story (see "Stories updated").

- **D1 — field editors have no accessible name** — serious — WCAG 1.3.1 / 4.1.2 — **DEFERRED**
  (root cause `FieldShell`, outside ownership; see "Deferred" above + the structured `deferred`).
- **D2 — no APG Grid keyboard model** — moderate — WCAG 2.1.1 — **FIXED.** New
  `utils/useGridKeyboardNav.tsx` gives the data cells a roving-tabindex model wired into
  `Table/Rows`: exactly one cell is tabbable, Arrow/Home/End/PageUp/PageDown move focus
  (Ctrl+Home/End jump to the grid corners), **Space** selects the row and **Enter/F2** edits
  an editable cell of a selected row (mirroring the click contract: select-then-edit); focus
  returns to the cell when an inline editor closes. `.cell:focus-visible` ring added.
  **Markup:** data `<td>`s gain `tabindex` (0/-1), `onKeyDown`, `onFocus`; no attribute removed.
- **D3 — invalid grid ownership (role=grid on the outer wrapper)** — moderate — WCAG 1.3.1 —
  **FIXED.** Relocated `role="grid"` + `aria-rowcount`/`aria-colcount` off the outer wrapper
  (which also wrapped the mobile view, toolbar, filters and footer — an invalid grid) **onto
  the real `<table>`** (`Table/index.tsx`), with `role="rowgroup"` on `<thead>`/`<tbody>`, so
  the grid → rowgroup → row → cell ownership chain is valid. The mobile `cardsContainer` gained
  `role="grid"` + counts so its `role="row"` cards are owned too. **Markup:** `role="grid"` and
  the two aria-count attributes MOVED elements (not deleted); `role="rowgroup"` added.
  Test-contract review flagged: no ThothOS selector in the stated contract keys on the outer
  `role="grid"`; the `[role="grid"]`/`th[scope]`/`aria-sort` story assertions still pass
  (the first `[role="grid"]` in the DOM is now the mobile card grid, which carries the counts).
- **D4 — keyboard column resize + reorder** — moderate — WCAG 2.1.1 — **FIXED.** Resize handle
  is now a focusable `role="separator"` (`aria-orientation="vertical"`, `aria-label`) whose
  ←/→ nudge width 10px (50px with Shift) via a new `useColumnResize.resizeColumnBy`. Reorder
  is now keyboard-operable via **"Move column left/right"** items in the column-actions menu
  (`handleColumnMove` in `index.tsx`, additive `onColumnMove` prop through Table →
  ColumnHeaderRow). **Markup:** resize `<div>` gains separator role + tabindex + keydown; two
  new `data-action="move-left|move-right"` menu items.
- **D5 — column menu has no arrow-key roving** — minor — WCAG 2.1.1 — **FIXED in-directory.**
  The Popover (role="dialog") already handles focus-in / Tab-trap / focus-restore; added
  APG-Menu Up/Down/Home/End roving among the menuitems in `ColumnHeaderRow.handleMenuKeyDown`
  (no edit to the shared Popover needed — the menu content is DataGrid-owned). Also named the
  Popover surface via `ariaLabel` (WCAG 4.1.2, silences its dev "nameless dialog" warning).
- **D6 — mobile card not keyboard operable** — minor — WCAG 2.1.1 — **FIXED.** The `role="row"`
  card `<div>` is now `tabIndex={0}` with an `onKeyDown` (Enter/Space select it — the keyboard
  equivalent of a tap); `.card:focus-visible` ring added. **Markup:** `tabindex` + `onKeyDown`
  added; `role="row"`/`data-*` unchanged.
- **Footer export menu keyboard model** (undisclosed) — moderate — WCAG 2.1.1 — **FIXED.** On
  open, focus moves INTO the portalled menu (first item); Arrow Up/Down roving (wrapping),
  Home/End, first-letter typeahead, and Tab closes the menu + returns focus to the trigger
  (menu-button pattern). Previously the portalled `menuitem`s fell to the end of the page tab
  order with no keyboard model — now consistent with the (previously disclosed) column menu.
- **WCAG 4.1.3 Status Messages** (undisclosed) — minor — **FIXED.** `role="status"` +
  `aria-live="polite"` on the desktop pagination count (`Footer`), the mobile pagination count
  and the mobile empty state (`MobileCardView`), and a `role="status"` span on the desktop
  empty state (`Rows`) — so a search/filter that changes or empties the result set is announced
  rather than passing silently. (`data-grid-status` remains a test hook, not an announced region.)
- **Test-coverage gap** (undisclosed) — minor — **FIXED.** Added six `play` stories (below)
  covering the mobile-card a11y (issues 10–12), the `:focus-visible` + `prefers-reduced-motion`
  CSS (issues 4–5, via a DataGrid-specific stylesheet scan), the column-visibility checkbox
  names (issue 7), and every new keyboard behaviour above.

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

`DataGrid.stories.tsx` — goobs has no unit tests, so these `play` stories ARE the regression
net. Round 1 added two (still passing after D3; the `[role="grid"]`/count assertions now resolve
against the mobile card grid, which carries the counts):

- **`A11y — Header Semantics & Sort`** — `role="grid"` + `aria-rowcount`/`aria-colcount`,
  `scope="col"` + `role="columnheader"` headers, select-all name, header-menu `aria-haspopup`,
  and `aria-sort="ascending"` after sorting.
- **`A11y — Dialog & Menu Overlays`** — Manage Columns `role="dialog"` + `aria-modal` +
  `aria-labelledby`, Escape closes, export cog toggles `aria-expanded` and opens `role="menu"`.

Round 2 added six more, one per fix cluster:

- **`A11y — Grid Keyboard Navigation`** — grid role/aria on the `<table>` + rowgroups, single
  roving tab stop, Arrow nav, Space-select + Enter-edit, `role="status"` pagination (D2/D3/4.1.3).
- **`A11y — Column Keyboard (Resize / Reorder / Menu)`** — `role="separator"` resize via Arrow
  (asserts width grows via `onColumnResize`), menu Arrow roving, keyboard reorder via
  "Move column right" (first header becomes `age`) (D4/D5).
- **`A11y — Footer Menu Keyboard`** — focus moves into the menu on open, Arrow roving between
  the portalled menuitems.
- **`A11y — Column Visibility Labels`** — the Manage Columns toggles expose
  `Show <col> column` names (issue 7).
- **`A11y — Mobile Card Semantics`** — card `role="row"` + `tabindex` (D6), field label
  `htmlFor` (10), expand `aria-expanded` (12), card-grid owner (D3), mobile `role="status"`.
- **`A11y — Focus-Visible & Reduced-Motion CSS`** — scans the injected stylesheet for the
  DataGrid `.cell:focus-visible` rule (issue 4) and the `prefers-reduced-motion` block (issue 5)
  so those CSS-only fixes can't silently regress.

## Files touched (round 2)

`index.tsx`, `Table/index.tsx`, `Table/ColumnHeaderRow/index.tsx`, `Table/Rows/index.tsx`,
`utils/useColumnResize.tsx`, `utils/useGridKeyboardNav.tsx` (new), `types/index.ts`,
`DataGrid.module.css`, `Footer/index.tsx`, `MobileCardView/index.tsx`, `MobileCardView/Card.tsx`,
`DataGrid.stories.tsx`, and this report. All in `src/components/DataGrid/**`. Each edited
`.ts/.tsx` passes `bun lint:file` (0/0).

## Deferred

Only **D1** remains — its root cause is `FieldShell` (a shared component outside DataGrid
ownership). Recommendation recorded above and in the structured `deferred` result: add an
`ariaLabel` prop to `FieldShell` (mapped into `inputAriaProps['aria-label']`) + forward it from
the leaf Field components onto the input, then thread
`ariaLabel={column.headerName || fieldConfig.label}` from `EditableCell`, `CreationRow`,
`CompositeFieldEditModal`, and `MobileCardView/AddCard` (all in this directory, ready to adopt).
