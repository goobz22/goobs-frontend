# CLASS LINT: missing-keyboard-arrow-nav (2026-07-11)

**Status: SHIPPED — gate green, 0 violations across 464 files**

WCAG **2.1.1** (Keyboard).

Class-first (T8) follow-up to the per-component a11y audit. The DataGrid audit
found the class twice: the desktop `role="grid"` had pointer-only cell
selection/edit (moderate, "full APG grid keyboard model absent"), and the
column-actions `role="menu"` popover had menu/menuitem roles but no arrow-key
roving (minor). Per T8 a bug is a CLASS until a script proves it a one-off, so
this owns the class across the WHOLE repo: a detection module + the fix of every
instance it reports.

Module: `scripts/a11y-lints/missing-keyboard-arrow-nav.ts`
Runner: `bun scripts/lint-a11y.ts --only missing-keyboard-arrow-nav`
(part of `lint:a11y` → `lint:all` — the permanent regression gate).

## The abstracted logical shape

A **composite-widget container role** advertises to assistive tech a keyboard
interaction model the WAI-ARIA APG requires: `menu` / `menubar` / `listbox` /
`tree` / `grid` / `treegrid` are navigated with the **ARROW keys** (roving
tabindex or `aria-activedescendant`), because the role pulls the widget's OWNED
ITEMS (menuitem / option / treeitem / gridcell) **out of the Tab sequence**. If
the container claims the role but no Arrow handler exists, keyboard-only and
screen-reader users can never reach or operate the items — a hard 2.1.1 failure,
not a mere APG nicety.

Two families, because they fail differently:

| Family | Roles | Satisfied by |
|---|---|---|
| **MENU** | `menu`, `menubar`, `listbox`, `tree` | Arrow nav ONLY — items are definitionally non-tabbable, so arrow roving is the only reach path |
| **GRID** | `grid`, `treegrid` | Arrow nav **OR** a Tab-focusable item model — a grid may rove cells with arrows (desktop DataGrid) OR make each `role="row"`/`gridcell` individually `tabIndex`-focusable (mobile DataGrid cards); both are operable |

**"Has Arrow nav" =** a *quoted* Arrow-key literal in a keydown comparison
(`'ArrowDown'`, `case 'ArrowLeft'` — quotes distinguish a KEY compare from an
icon identifier like `ArrowUpward`/`ArrowDropDown`), OR use of the shared library
primitives `useArrowKeyNav` (Field/Shell) / `useGridKeyboardNav` (DataGrid). A
component can delegate entirely to those hooks and spell no Arrow literal, so the
hook usage counts on its own.

**Satisfaction is component-subtree-scoped, not single-file.** The keyboard model
routinely lives in a CHILD of the element carrying the role: a
`<table role="grid">` (DataGrid/Table/index.tsx) delegates cell roving to its
`Rows` child (DataGrid/Table/Rows). So a container role is checked against every
non-story file in its OWN directory and below. The boundary is tight —
`Field/Dropdown/SearchableSimple/` does NOT satisfy a listbox in the sibling
`Field/Dropdown/SearchableHistory/` — so delegation is credited without an
unrelated component masking a real gap.

## Escape hatches (encoded in the check, never a file ignore-list)

| Signal | Why it's legitimate |
|---|---|
| role text inside a comment / JSDoc `@example` | comments are blanked before scanning — never real markup |
| GRID family + a `role="row"`/`gridcell` descendant carrying `tabIndex` | Tab-focusable rows/cells ARE keyboard-operable (the mobile card grid), distinguishing it from a genuinely dead grid |
| `role="toolbar"` / `role="tablist"` | **NON-TARGET**: buttons/tabs stay in the Tab order → operable without arrows; a roving toolbar/tablist is an APG SHOULD, not a 2.1.1 MUST |
| `role="radiogroup"` | **NON-TARGET**: a group of native `<input type="radio">` gets Arrow navigation from the browser for free |

Selftest: **5 bad / 7 good** (all pass).

## Instances (whole-repo enumeration)

| # | Role | File:line | Status | Note |
|---|------|-----------|--------|------|
| 1 | grid | DataGrid/Table/index.tsx (246) | FIXED (per-component) | `<table role="grid">` — cell roving in child `Rows` via `useGridKeyboardNav` (Arrow/Home/End/PageUp-Down, Enter/F2 edit); satisfied by subtree |
| 2 | menu | DataGrid/Table/ColumnHeaderRow/index.tsx (255) | FIXED (per-component) | column-actions popover — `handleMenuKeyDown` roves `[role="menuitem"]` |
| 3 | menu | DataGrid/Footer/index.tsx (669) | FIXED (per-component) | export menu — `handleMenuKeyDown` Arrow roving |
| 4 | listbox | Field/Dropdown/SearchableHistory/index.tsx (359) | **FIXED (this pass)** | options were pointer-only `<div onClick>`; no `role="option"`, no keyboard model |
| — | listbox | Field/Dropdown/{Regular,MultiSelect,SearchableSimple} | OK | already use `useArrowKeyNav` |
| — | tree | TreeView/index.tsx (1759) | OK | in-file Arrow roving over treeitems |
| — | grid | BigCalendar/index.tsx (863) | OK | in-file Arrow nav |

**Instance 4** is the one the class-lint newly surfaced and the only genuine
remaining violation. The combobox `role` lives on the search `<input>` (with
`aria-expanded`/`aria-controls`), but the `role="listbox"` options were plain
`<div onClick>`s — no `role="option"`, no `aria-activedescendant`, no Arrow
handler — so a keyboard user could open the listbox but never reach an option.
Fix (additive), matching the sibling `SearchableSimple` pattern:

- the shared `Field/Shell` **`useArrowKeyNav`** over a flat visible-option list
  (built in exact render order across the Overview categories / History tab):
  ArrowUp/Down/Home/End rove a highlight, Enter selects;
- each row becomes **`role="option"` + `aria-selected` + `id`**, with
  **`data-active`** mirroring the roving highlight (also set on hover so pointer
  and keyboard share one highlighted row);
- the input gains **`aria-activedescendant`** pointing at the active option;
- the highlight resets on open / focus / tab-switch / search / select.

No existing `data-*`/`role`/`aria` attribute was removed or renamed; the
`button[role="combobox"]` + `aria-expanded` + portalled `[role="listbox"]` test
contract is intact.

## Shapes considered and intentionally NOT flagged (why they're not 2.1.1 failures)

- **DataGrid `MobileCardView` `<div role="grid">`** — every `role="row"` Card is
  `tabIndex={0}` with an Enter/Space handler, and inner buttons/fields are
  Tab-reachable. The grid is fully keyboard-**operable** via Tab; it simply
  doesn't rove with arrows. That is an APG best-practice deviation, not a 2.1.1
  keyboard-reach failure, so the GRID-family Tab-focusable-item escape hatch
  correctly clears it. (If Card ever lost its `tabIndex`, the lint re-flags it.)
- **`RadioGroup` `role="radiogroup"`** — wraps native `<input type="radio">` that
  share a `name`; the browser supplies Arrow navigation natively. Out of scope.
- **`ManageRow`/`Toolbar`/`BigCalendar`/`ComplexTextEditor` `role="toolbar"`,
  `Tabs`/`ProjectBoard` `role="tablist"`** — controls stay in the Tab order and
  are individually operable; roving is a SHOULD. Out of scope.

Documented in the module header so a future author knows the boundary rather than
re-deriving it.

## Regression story

`SearchableHistory.stories.tsx` → **`A11y: arrow keys navigate listbox options`**
(play function): focusing the combobox opens the portalled listbox; ArrowDown
moves the roving highlight through the `role="option"` rows (asserting
`data-active` + the input's `aria-activedescendant`); a second ArrowDown advances
it; Enter selects the active option and closes the listbox. Matches the repo's
`storybook/test` play-assertion pattern (cf. the sibling toggle story).

## Verification

- `bun scripts/lint-a11y.ts --only missing-keyboard-arrow-nav` → **clean, 464 files**
  (was 1 violation before the fix; selftest 5 bad / 7 good passes).
- `bun lint:file` on `SearchableHistory/index.tsx` + its story → exit 0;
  `stylelint` on `SearchableHistory.module.css` → exit 0.
- The detection module is under `scripts/` (outside the app eslint scope, like
  every sibling a11y-lint module); its own selftest is its gate and passes.

## Deferred (files not owned)

None. The desktop grid + column-actions menus (instances 1–3) were already fixed
by the per-component DataGrid audit; the one violation the class-lint surfaced
(SearchableHistory, instance 4) is code the class-lint owner is authorized to fix,
and it was fixed here. No shared-util / FieldShell / barrel change was required —
the fix reuses the existing `Field/Shell` `useArrowKeyNav` primitive.
