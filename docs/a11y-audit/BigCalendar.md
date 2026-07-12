# BigCalendar — a11y audit (2026-07-11)

**Status:** FIXED (in-component) — the original 11 ownership issues plus BOTH
adversarial-review follow-ups (the first five Rev items, and the second five R2.x items —
see "Adversarial-review follow-up #2") are resolved **without touching any unowned
component**.
Two of the three former "deferred" items were reclassified as in-component fixes and DONE:
**#12 view-switcher group name** and **#13 real heading + region landmark** are now built in
BigCalendar itself. Only **#14 (Tooltip-on-focus)** remains genuinely unowned (the visual
hover bubble lives in `Tooltip`); it is fully MITIGATED here (all event detail is on the
interactive element's `aria-label`, so nothing is keyboard/AT-inaccessible).

## Adversarial-review follow-up (2026-07-11)

An adversarial review of the first pass raised five findings. Resolution:

| Rev # | Severity | Finding | Resolution |
|---|----------|---------|------------|
| R1 | Moderate | Week/day hour cells use roving tabindex inside a bare `role="group"` (does not advertise arrow-key nav) | **FIXED** — the hour-cell container is now `role="toolbar"` (week: `weekDaysContainer`; day: `dayContentColumn` + `aria-orientation="vertical"`), a composite widget role that advertises the single-tab-stop + arrow-key model. `index.tsx:1028-1032`, `1164-1172`. |
| R2 | Moderate | No real heading and no landmark (SEO + heading nav) | **FIXED in-component** — root is now a `role="region"` landmark named (via `aria-labelledby`) by a real, visually-hidden `<h{headingLevel}>` carrying the current period. New additive `headingLevel` prop (default 2). `index.tsx:1305-1329`. Resolves former Deferred #13 without editing `Typography`. |
| R3 | Minor | View-switcher (ToggleButtonGroup) has no accessible group name | **FIXED in-component** — the group is wrapped in `<div role="group" aria-label="Calendar view">` with `display:contents` (`.viewSwitcherGroup`) so the toolbar layout is byte-unchanged. `index.tsx:1385-1391`. Resolves former Deferred #12 without editing `ToggleButton`. |
| R4 | Minor | Clickable event chips (native `<button>`, default tabIndex 0) are not in the grid's single-tab-stop roving model | **REFUTED** (see below) — the prescribed `tabIndex=-1` would remove keyboard operability (WCAG 2.1.1 A) without a compensating in-cell arrow-nav system; the current behavior is WCAG-conformant and matches accessible-calendar convention. |
| R5 | Minor | Test-coverage gaps (week day-nav, month Page/Home/End, aria-current, nav-label units, clear-filters) | **FIXED** — 10 new play stories added (see "Stories updated"). |

### Rev #4 — refutation detail

`renderEvent` (`index.tsx:806-815`) makes a clickable event a native
`<button type="button">` with the full detail on `aria-label`. The review asks for
`tabIndex={-1}` per the strict APG data-grid pattern ("in-cell widgets reached via arrows").
That prescription is **not safely applicable here**:

1. Setting `tabIndex={-1}` on the event buttons **without** also building an in-cell arrow
   navigation system would make the events **keyboard-unreachable**, a direct WCAG **2.1.1
   Keyboard (Level A)** failure — strictly worse than the current state.
2. The APG "one tab stop per grid" guidance is an **authoring recommendation, not a WCAG
   success criterion**. Keeping rich, action-bearing widgets (event buttons) as sequential
   tab stops is WCAG-conformant and is exactly what mainstream accessible calendars do
   (react-big-calendar, FullCalendar, Google Calendar month view).
3. Building a full "enter cell → arrow among widgets → Escape to exit" system has **no
   conflict-free key** here (the cell already binds Arrows for grid nav and Enter/Space for
   day selection), and would add real focus-management risk to a **published** library for a
   finding the reviewer themselves rated *minor* with *"impact is limited."*

The reviewer's own note — "Events stay operable, so impact is limited" — confirms there is no
operability defect. Left as-is deliberately; keyboard operability (2.1.1) is preserved over an
optional single-tab-stop nicety. (Latent, separate observation queued below: a clickable
event nested inside a `role="button"` hour cell in week/day is nested-interactive — pre-existing,
not introduced here.)

### Former "deferred" status of the original pass

The 3 items that were deferred in the first pass are now resolved as follows: #12 and #13 are
FIXED in-component (see R3/R2 above); #14 (Tooltip-on-focus) stays unowned but fully mitigated.

**APG pattern:** primarily the [Grid](https://www.w3.org/WAI/ARIA/apg/patterns/grid/)
pattern, in the [Date Picker Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/)
grid flavour. The **month view is a full ARIA grid** (`role="grid"` /
`row` / `columnheader` / `gridcell`) with roving-tabindex arrow-key navigation. The
**week / day views are time grids that do not map cleanly onto a row/column grid** (the
DOM is column-major: day columns each containing hour cells, transposed from the visual
row-per-hour layout), so their interactive hour cells are exposed as a **keyboard group of
`role="button"` toggle cells** (roving tabindex, per-cell accessible names, `aria-pressed`
for selection) rather than a mis-described grid. Secondary patterns: the toolbar nav
buttons, and the view switcher (goobs `ToggleButtonGroup`, `aria-pressed` toggle buttons —
owned by that component).

## Adversarial-review follow-up #2 (2026-07-11)

A second adversarial review of the first follow-up raised five findings — all now
resolved at root cause (no unowned component touched):

| Rev # | Severity | Finding | Resolution |
|---|----------|---------|------------|
| R2.1 | Moderate | **Nested interactive INTRODUCED by the first pass**: the "Clear all filters" control was turned into a `<button>`, but it is rendered as the Accordion `summary`, which the Accordion wraps in its own disclosure `<button>` → a `<button>` inside a `<button>` (invalid, keyboard-inoperable in Firefox, pollutes the disclosure button's accessible name). | **FIXED** — the clear control moved OUT of the summary into the Accordion **details region** (a real `role="region"`, not a button): `CalendarFilters.tsx`. The summary now holds only non-interactive content (icon, "Filters", active-count chip). Story `A11y/Clear Filters Button` asserts the button is NOT a descendant of `[data-action="toggle"]` (the disclosure button). |
| R2.2 | Moderate | **Nested interactive INTRODUCED, mischaracterized as pre-existing**: week/day hour cells became `role="button"`+`aria-pressed` and a clickable event inside became a native `<button>` → a `<button>` nested inside a `role="button"` (invalid; the inner event button not reliably focusable/announced). | **FIXED** — week/day hour cells are now a real ARIA **grid** (`role="grid"` > `role="row"` > `role="gridcell"`), `aria-pressed`→`aria-selected`. A `gridcell` legitimately CONTAINS interactive widgets (the event `<button>`), so the nesting is valid. Origin corrected: this WAS introduced by the first pass (both were role-less `<div onClick>` before). `index.tsx` week `renderWeekView`, day `renderDayView`. Stories `A11y/Week Event No Nesting`, updated `A11y/Week Day Navigation` + `A11y/Hour Cell Keyboard`. |
| R2.3 | Minor | Week hour-cell container was `role="toolbar"` with no `aria-orientation` yet bound BOTH axes (Left/Right = day, Up/Down = hour) — a toolbar advertises only a 1-D horizontal model. | **FIXED (subsumed by R2.2)** — converting the week container to `role="grid"` (inherently 2-D) removes the need for `aria-orientation` and correctly advertises the 2-D navigation model. |
| R2.4 | Minor | Month grid implemented PageUp/PageDown (month) but omitted **Shift+PageUp/PageDown (previous/next YEAR)** from the cited APG date-picker grid pattern. | **FIXED** — `handleMonthCellKeyDown` now pages the year on `event.shiftKey` (`addYears`/`subYears`), focus following to the same day of the new year. Story `A11y/Month Year Navigation`. |
| R2.5 | Minor | Month-cell "+N more" overflow was a non-interactive `Typography` span — events past the first three were unreachable by keyboard / AT. | **FIXED** — "+N more" is now a real `<button>` (`data-action="view-more"`, `aria-label="View all N events on <date>"`) that opens the day view for that date, where every event on the day is rendered. `index.tsx` `renderMonthView`. Story `A11y/Month Overflow Button`. |

**Markup changes in this follow-up (all additive to semantics; no prop/export changed, no existing `data-*`/`role`/`aria` removed):**
- `CalendarFilters.tsx`: clear-all `<button>` relocated from the Accordion `summary` into the `details` region (adds a visible "Clear all" text label alongside the icon; `aria-label="Clear all filters"` and `data-action="clear"` preserved).
- `index.tsx` week view: hour-cell container `role="toolbar"` → `role="grid"`; each day column gains `role="row"` + a day-name `aria-label`; each hour cell `role="button"` → `role="gridcell"` and `aria-pressed` → `aria-selected`.
- `index.tsx` day view: hour-cell container `role="toolbar" aria-orientation="vertical"` → `role="grid"`; each hour cell wrapped in a `role="row"` (`display:contents` via `.gridRow`, layout unchanged) and `role="button"`→`role="gridcell"`, `aria-pressed`→`aria-selected`.
- `index.tsx` month view: "+N more" span → `<button>` (new `.moreEventsButton` reset class + `:focus-visible` ring in the CSS module).

The `role="button"`/`aria-pressed` hour-cell attributes were introduced by the first pass and never shipped, so changing them to the grid model breaks no published contract; ThothOS Playwright keys on `data-component`/`data-field-name`/`data-action`/`data-state` and the dropdown combobox pattern — none of which touch these hour-cell roles.

## Issues found

| # | Severity | WCAG | Location | Status |
|---|----------|------|----------|--------|
| 1 | Critical | 2.1.1 Keyboard (A), 4.1.2 Name/Role/Value (A) | month day cells `index.tsx` (was `<div onClick>`, no role/tabindex/keydown), week/day hour cells (same) | **FIXED** |
| 2 | Critical | 2.1.1 Keyboard (A), 4.1.2 (A) | event chips `index.tsx` `renderEvent` (clickable `<div onClick>` with no keyboard/role) | **FIXED** |
| 3 | Serious | 1.3.1 Info & Relationships (A), 4.1.2 (A) | month grid `index.tsx:848-872` (plain `<div>`s, no grid/row/columnheader/gridcell) | **FIXED** |
| 4 | Serious | 4.1.2 (A) | event accessible name `index.tsx:743` — full detail (times, description) lived only in a hover Tooltip that AT never sees | **FIXED** |
| 5 | Serious | 4.1.3 Status Messages (AA) | navigation / view / selection changes had no live region; the visible period isn't even shown as text | **FIXED** |
| 6 | Serious | 2.4.7 Focus Visible (AA) | `BigCalendar.module.css` — no `:focus-visible` rule anywhere; cells/events/nav had no keyboard focus indicator | **FIXED** |
| 7 | Moderate | 1.4.1 Use of Color (A) | today (`cellToday`) and selection (`cellSelected`/`hourCellSelected`) were conveyed by **background color only** | **FIXED** |
| 8 | Moderate | 2.3.3 Animation from Interactions (AAA) | `BigCalendar.module.css` — `--bc-transition` on root/cells/events with no `prefers-reduced-motion` guard | **FIXED** |
| 9 | Moderate | 1.1.1 Non-text Content (A), 4.1.2 (A) | decorative icons: nav-button chevrons/calendar `index.tsx`, view-toggle icons, `CalendarFilters.tsx:112` filter icon | **FIXED** |
| 10 | Serious | 2.1.1 Keyboard (A), 4.1.2 (A), 1.1.1 (A) | `CalendarFilters.tsx` clear-all control was a `<div onClick>` with an unlabelled `CloseIcon` (no name, no keyboard) | **FIXED** |
| 11 | Minor | 2.4.6 Headings & Labels (AA) | nav-button labels were bare "Previous"/"Next"/"Today" (no unit context) | **FIXED** |
| 12 | Minor | 1.3.1 (A) | ToggleButtonGroup view switcher has no group name / `role="group" aria-label` | **FIXED** (in-component wrapper — Rev #3) |
| 13 | Moderate | 1.3.1 (A) / SEO | no real `<h1>-<h6>` for the current period; Typography only renders `<span>` | **FIXED** (in-component raw heading + region — Rev #2) |
| 14 | Minor | 1.4.13 Content on Hover or Focus (AA) | event Tooltip shows on hover only, not keyboard focus | **DEFERRED** (unowned — `Tooltip`; mitigated here via `aria-label`) |

### Issue 1 — Day/hour cells not keyboard-operable, no role (Critical)

Every selectable cell was a bare `<div onClick={...}>`: not focusable, no `role`, no
keyboard handler. A keyboard-only or screen-reader user could not select a date or an hour
span at all, and the cell announced as a generic group. **Root cause:** interaction was
built pointer-first. Fixed by making the month cells real `role="gridcell"` elements and
the week/day hour cells `role="button"` elements, each with roving `tabIndex`, an
`onKeyDown` grid/group navigation model, and shared click/keyboard activation
(`activateDayCell` / `activateHourCell`, `index.tsx:622-630`).

### Issue 2 — Clickable event chips not keyboard-operable (Critical)

When `onEventClick` was supplied, the event chip was a clickable `<div>` with no role, no
`tabIndex`, no keydown — pointer-only. Fixed: clickable events now render as a native
`<button type="button">` (`index.tsx:800-809`), keyboard-operable for free, with the full
event detail on `aria-label`.

### Issue 3 — Month grid had no table/grid semantics (Serious)

The month was a flat pile of `<div>`s with a `<div>` header row — a screen reader could
not perceive the columns (weekdays), the rows (weeks), or that a cell is a date within a
grid. Fixed with a valid `grid > {row(header), rowgroup > row > gridcell}` tree; the week
`row` wrappers use `display: contents` (`.gridRow`, `BigCalendar.module.css:309`) so the
existing CSS-grid layout is byte-for-byte unchanged. `aria-multiselectable="true"`
(`index.tsx:850`) truthfully models the multi-date selection.

### Issue 4 — Event accessible name missing time/description (Serious)

The rich detail (description + start–end time) lived **only** in the goobs `Tooltip`,
which is hover-triggered and is not wired to the trigger via `aria-describedby` — so AT and
keyboard users never received it. Fixed with `eventAccessibleName` (`index.tsx:743`): the
clickable button carries the whole story on `aria-label`; the static chip exposes it via a
visually-hidden `.srOnly` span while the visible label is `aria-hidden` (read exactly
once).

### Issue 7 — Today / selection conveyed by color alone (Moderate)

`cellToday`, `cellSelected`, `hourCellSelected` changed only a background color. Fixed by
adding programmatic state: `aria-current="date"` on today, `aria-current="time"` on the
current hour, `aria-selected` on month gridcells, and `aria-pressed` on hour-cell buttons —
so the state is exposed to AT independent of color.

## Hearing

No `Audio` / `AudioContext` / `<audio>` / `<video>` / `navigator.vibrate` / `.play()`
usage anywhere in the component (grep clean across `index.tsx`, `CalendarFilters.tsx`).
No information is conveyed by sound, so WCAG 1.2.x / 1.4.2 do not apply. **No issues.**

## Reading & screen reader

- **Keyboard (2.1.1):** month grid — `Arrow`s move by day/week, `Home`/`End` jump to the
  week edge, `PageUp`/`PageDown` change month and `Shift`+`PageUp`/`PageDown` change year
  (focus follows to the equivalent day), `Enter`/`Space` select
  (`handleMonthCellKeyDown`). The "+N more" overflow control is a `<button>` that opens the
  day view so events past the first three are keyboard/AT-reachable. Week/day hour cells —
  `Left`/`Right` change day, `Up`/`Down` change hour, `Home`/`End` first/last hour,
  `Enter`/`Space` toggle (`handleTimeCellKeyDown`, `index.tsx:695`). Roving tabindex keeps a
  single tab stop per grid; a `event.target === event.currentTarget` guard stops a focused
  in-cell event `<button>` from hijacking grid navigation.
- **Roles/states (4.1.2):** month `grid`/`row`/`columnheader`/`rowgroup`/`gridcell` with
  `aria-multiselectable`, `aria-selected`, `aria-current="date"`, and a full-date +
  event-count `aria-label` per cell; week/day hour cells are `role="gridcell"` toggles inside
  a labelled `role="grid"` (week: rows are day columns; day: one row per hour), each with
  `aria-selected`, `aria-current="time"`, and a full date-+-hour `aria-label` — a grid so the
  cell can legally contain the clickable event `<button>` (no nested-interactive).
  Column-header `aria-label`s use full weekday names ("Sunday" not "Sun").
- **Accessible names:** every interactive element now has one — nav buttons (labelled),
  event buttons/chips (`aria-label` / `.srOnly`), cells (`aria-label`), clear-filters
  button (`aria-label="Clear all filters"`).
- **Status messages (4.1.3):** a polite, atomic live region (`index.tsx:1285`) announces
  the current view + period (+ selection) on every prev/next/today, view toggle, or cell
  selection — the period is otherwise not shown as visible text at all.
- **Focus visible (2.4.7):** added a per-theme `:focus-visible` ring
  (`--bc-focus-ring` → `--goobs-{sacred,light,dark}-focus-ring`) for nav buttons, event
  chips, and grid/hour cells (`BigCalendar.module.css:528-537`).
- **Color not sole channel (1.4.1):** today/current-hour/selection all now carry a
  programmatic attribute in addition to the background tint (Issue 7).
- **Motion (2.3.3):** `@media (prefers-reduced-motion: reduce)` zeroes the transitions on
  root/cell/hourCell/event (`BigCalendar.module.css:542`).
- **Decorative icons (1.1.1):** all icon-only decoration is `aria-hidden` — nav-button
  chevrons/calendar and the view-toggle icons (which sit next to visible "Day/Week/Month"
  text), plus the CalendarFilters filter/close icons.

## SEO semantics

- **Landmarks/lists/tables:** the month view now renders as a real ARIA grid in the SSR'd
  HTML (`role="grid"`), so the crawled markup carries the structure. Day cells and hour
  cells are semantic interactive elements (gridcells / buttons) rather than opaque divs.
- **Links:** the component renders no navigational links (all navigation is in-component
  state via buttons), so the `<a href>` / `linkComponent` checklist item does not apply.
- **All meaningful content in SSR HTML:** yes — events, dates, headers all render
  server-side; nothing primary is client-only injected. No canvas/QR content.
- **Headings:** the component now renders a real `<h{headingLevel}>` (default `<h2>`) for
  the current period (Rev #2), visually hidden but in the SSR'd HTML, so the crawled markup
  carries a heading and screen-reader users can jump to it. The whole component is also a
  `role="region"` landmark named by that heading. The grid's `aria-label` + the live region
  continue to carry the period name for AT.

## Fixes applied

All changes are **additive** — no prop renamed/removed/retyped, no export changed. The only
rendered-DOM element swaps are the semantically-correct ones (clickable event chip
`div`→`button`; CalendarFilters clear control `div`→`button`), both noted below. Every
existing machine-test selector is preserved (`data-component="BigCalendar"`, `data-theme`,
`data-state={view}` on the root; no `data-*`/`role`/`aria` removed; dropdown combobox
pattern untouched).

**`index.tsx`**
1. Roving-tabindex focus engine: `focusedCellKey` state + `gridRef` + a gated focus effect
   + `requestCellFocus` (`index.tsx:280-302`).
2. Focus-key model + default/effective focus key + `isKeyInView` guard (`index.tsx:577-619`).
3. `activateDayCell` / `activateHourCell` shared by click and keyboard (`index.tsx:622-630`).
4. `handleMonthCellKeyDown` (grid arrows/Home/End/PageUp/PageDown/Enter/Space) and
   `handleTimeCellKeyDown` (group arrows/Home/End/Enter/Space), each guarded against
   in-cell button key-bubbling (`index.tsx:635-737`).
5. `eventAccessibleName` + clickable-`<button>` / static-`.srOnly` event rendering
   (`index.tsx:743`, `800-818`).
6. Month grid: `role="grid"` + `aria-multiselectable` + period `aria-label`; header `row`
   with full-name `columnheader`s; `rowgroup` + `display:contents` week `row`s; `gridcell`s
   with `tabIndex`/`data-focus-key`/`aria-selected`/`aria-current`/`aria-label`/`onKeyDown`
   (`index.tsx:848-935`).
7. Week & day: outer `role="group"` + period `aria-label`; the hour-cell container is a
   labelled `role="grid"` (follow-up #2 / R2.2 — was `role="toolbar"`) with `role="row"`
   wrappers (week: day columns; day: one per hour, `display:contents`); `aria-hidden` on the
   redundant time column; hour cells as `role="gridcell"` toggles (`aria-selected`,
   `aria-current="time"`) with roving tabindex + aria + keydown, legally containing the event
   `<button>`.
8. Live region; nav buttons `type="button"` + unit-aware `aria-label`s
   (`Previous {view}` / `Go to today` / `Next {view}`) + `aria-hidden` icons; view-toggle
   icons `aria-hidden`.
9. Root `role="region"` + `aria-labelledby` a visually-hidden real heading
   `<h{headingLevel}>` for the period (new additive `headingLevel` prop, default 2 — Rev #2);
   view toggles wrapped in `role="group" aria-label="Calendar view"` via a `display:contents`
   `.viewSwitcherGroup` wrapper (Rev #3).

**`BigCalendar.module.css`**
9. `--bc-focus-ring` token per theme (`:81`, `:137`, `:182`); `.gridRow { display: contents }`
   (`:309`); native-button reset on `.eventClickable` (`:405`); `.srOnly` utility (`:512`);
   `:focus-visible` rings (`:528-537`); `prefers-reduced-motion` block (`:542`).

**`CalendarFilters.tsx`**
10. Clear-all `<div onClick>` → `<button type="button" aria-label="Clear all filters">`,
    relocated from the Accordion **summary** into the **details region** (follow-up #2 / R2.1)
    so it is never nested inside the Accordion's disclosure `<button>`; `aria-hidden` on the
    decorative filter icon and the close icon.

Per-file gates green: `bun lint:file` on `index.tsx`, `CalendarFilters.tsx`,
`BigCalendar.stories.tsx` (all exit 0).

## Stories updated

Five `play`-backed regression stories added to `BigCalendar.stories.tsx`
(`storybook/test` — `within`/`userEvent`/`expect`/`fn`/`waitFor`), each failing if the
matching a11y wiring regresses (deterministic June 2026 anchor, dates verified against
date-fns):

- **`A11y/Grid Semantics`** — asserts `role="grid"` + `aria-multiselectable` + period
  label, seven full-name `columnheader`s, the selected day's `gridcell` name + roving
  `tabindex="0"`, and the live-region text.
- **`A11y/Keyboard Navigation`** — focuses June 15, `ArrowRight`→June 16, `ArrowDown`→June
  23, asserting focus moves.
- **`A11y/Selection Announced`** — `Enter` on a focused cell flips `aria-selected`
  false→true.
- **`A11y/Event Accessible Names`** — resolves an event `<button>` by its full
  `aria-label` (title/resource/description/time) and asserts the `onEventClick` spy fires.
- **`A11y/Hour Cell Keyboard`** — day-view hour `button` with full date+hour name; `Enter`
  flips `aria-pressed` false→true.

Adversarial-review follow-up stories (2026-07-11), each failing if the matching wiring
regresses:

- **`A11y/Week Day Navigation`** — week view: asserts the hour cells live in a labelled
  `role="toolbar"`, then `ArrowRight`→next day, `ArrowLeft`→back, `ArrowDown`→next hour,
  `Home`→7 AM, `End`→6 PM, tracking focus each step (Rev #1 + the day-nav branch).
- **`A11y/Month Page Navigation`** — `PageDown` June 15→July 15 (month change + focus
  follow + grid label updates to "July 2026"), `PageUp` back to June 15.
- **`A11y/Month Home End`** — `Home` June 16→June 14 (Sunday), `End`→June 20 (Saturday).
- **`A11y/Current Date + Hour`** & **`A11y/Current Hour`** — real current date; assert a
  month gridcell carries `aria-current="date"` and a day hour cell carries
  `aria-current="time"` (snapshot disabled so the daily date doesn't churn Chromatic).
- **`A11y/Nav Button Labels`** — asserts "Previous/Next month" + "Go to today", then clicks
  the Week toggle and asserts the labels re-unit to "Previous/Next week".
- **`A11y/View Switcher Group`** — the toggles are inside a `role="group"` named
  "Calendar view" (Rev #3).
- **`A11y/Region + Heading`** — the root is a `region` named by the period, and a real
  `<h2>` carries the period (Rev #2).
- **`A11y/Clear Filters Button`** — seeds one active filter, resolves the labelled
  "Clear all filters" `<button>`, asserts it is NOT inside the Accordion disclosure button
  (`[data-action="toggle"]` — the nested-interactive regression guard, R2.1), clicks it, and
  asserts `onFiltersChange({})`.

Adversarial-review follow-up #2 stories (2026-07-11):

- **`A11y/Week Event No Nesting`** (R2.2) — week view with `onEventClick`; asserts a clickable
  event `<button>` sits inside a `role="gridcell"` and has NO `role="button"` ancestor (fails
  if the hour cell regresses to `role="button"`, re-introducing the nested-interactive bug).
- **`A11y/Month Year Navigation`** (R2.4) — `Shift`+`PageDown` June 15 2026 → June 15 2027
  (year change + focus follow + grid label "June 2027"), `Shift`+`PageUp` back.
- **`A11y/Month Overflow Button`** (R2.5) — a day with five events; resolves the labelled
  "View all 5 events on …" `<button>`, clicks it, asserts `onViewChange('day')` +
  `onDateChange` fire (the reachability path to the hidden events).
- **Updated `A11y/Week Day Navigation`** (R2.2/R2.3) — now asserts the hour cells live in a
  `role="grid"` and resolves them as `gridcell`s.
- **Updated `A11y/Hour Cell Keyboard`** (R2.2) — day-view hour cell resolved as a `gridcell`;
  `Enter` flips `aria-selected` false→true (was `aria-pressed`).
- **Updated `A11y/Current Hour`** — selects `[role="gridcell"][aria-current="time"]`.

## Deferred / unowned

- **#14 — Tooltip on focus (unowned).** `StyledTooltip`
  (`src/components/Tooltip/index.tsx:308-315`) opens on `onMouseEnter`/`onMouseLeave` only,
  never on `focus`/`blur`, so keyboard users don't get the visual bubble
  (WCAG 1.4.13). **Suggested change:** add `onFocus`/`onBlur` handlers mirroring the hover
  ones (and `aria-describedby` wiring). Mitigated in BigCalendar already: the full event
  detail is on the interactive element's `aria-label`, so no information is keyboard/AT
  inaccessible — the Tooltip is now purely a sighted-pointer enhancement.

**Note on the week/day grid model (updated by follow-up #2):** week/day hour cells are now a
real ARIA **grid** — `role="grid"` > `role="row"` > `role="gridcell"` — with a single roving
tab stop and arrow-key navigation (Left/Right = day, Up/Down = hour). The row axis is the day
column (week) or the hour (day); the DOM being visually column-major does not conflict with the
ARIA tree, since a grid's rows need not be visual rows and each cell carries a full date+hour
`aria-label`. This model was chosen (over the earlier `role="toolbar"` composite) specifically
so an hour `gridcell` can legally CONTAIN the clickable event `<button>` without invalid
nested-interactive markup (R2.2). It is fully WCAG-conformant and needs no `aria-orientation`
(a grid is inherently 2-D). A future enhancement could add `columnheader`/`rowheader` +
`aria-rowindex`/`aria-colindex` for richer position announcement; not a defect.

**RESOLVED (was "newly-found, queued"):** the week/day nested-interactive pattern — a
clickable event `<button>` inside a `role="button"` hour cell — is **FIXED** in
adversarial-review follow-up #2 (R2.2 above). The hour cells are now `role="gridcell"` inside
a `role="grid"`, which legitimately contain interactive widgets, so the invalid nesting is
gone. The earlier characterization of this as "pre-existing, not introduced by this pass" was
**incorrect** and is corrected in R2.2: both the hour cell and the event were role-less
`<div onClick>` before the first pass, so the nesting was introduced there.
