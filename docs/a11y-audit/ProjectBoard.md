# ProjectBoard — a11y audit (2026-07-11)

**Status:** PARTIAL — every in-directory issue from both passes is fixed at root cause
**except** the design-level keyboard drag-and-drop reorder, which remains deferred with a
recommendation.

**Component:** `src/components/ProjectBoard/` — a themed Kanban board plus two inline
task views (`InlineAddTask`, `InlineShowTask`) reached by view-state transitions
(Wolken-style), not dialogs.

> Update log: an earlier pass (this file, 12:56) fixed items 1–15 below and deferred two
> items. This pass (20:xx) **resolves the deferred 2.4.3 focus-management item** (now item
> 16, FIXED), closes a reduced-motion gap on the Manage view (item 17), and adds a
> view-transition-focus regression story. Only the keyboard drag-and-drop reorder stays
> deferred.

## APG patterns present

| Surface | WAI-ARIA APG pattern | Compliance after fixes |
|---|---|---|
| Breadcrumb (`Breadcrumb.tsx`) | **Breadcrumb** | `<nav aria-label="Breadcrumb">` + `<ol>/<li>`, `aria-current="page"`, decorative icon `aria-hidden`. Full. |
| AddTask / ShowTask tab strips | **Tabs (manual activation via roving tabindex)** | `role="tablist"`/`role="tab"`, `aria-selected`, `aria-controls`→`role="tabpanel"`, `tabIndex` roving, Arrow/Home/End keyboard. Full. |
| Task-selection checkbox, meeting radios | native checkbox / **radiogroup** | Named checkbox; radios wrapped in `role="radiogroup"` with an associated label. Full. |
| Board columns/tasks | (no formal APG — list semantics) | Tasks exposed as named `role="list"`/`role="listitem"`. Keyboard **reordering** deferred (see below). |

## Issues found

Severity / WCAG 2.2 SC / `file:line` (post-edit) / disposition.

### Hearing-impaired (1.2.x / 1.4.2)
- **CLEAN.** Grepped the whole directory for `new Audio`, `AudioContext`, `<audio>`,
  `<video>`, `navigator.vibrate` — none. No information is conveyed by sound; all status
  (validation, meeting state, comment sections) is visual + textual. No captions/transcript
  surface is needed.

### Reading-impaired / screen-reader / cognitive
1. **serious — 4.1.2 / 2.4.7** `ProjectBoard.module.css` `.breadcrumbButton` set
   `outline: none`, removing the keyboard focus indicator for the back control. **FIXED** —
   removed the reset and added a `:focus-visible` outline; added `:focus-visible` rings for
   every interactive control across all three module CSS files (task checkbox/inputs/buttons,
   tab buttons, cards, toggles, meeting inputs, textareas).
2. **serious — 4.1.2 / 1.3.1** `board/index.tsx` task-selection `<input type="checkbox">`
   had **no accessible name** (screen readers announced a bare "checkbox"). **FIXED** —
   `aria-label={`Select task: ${title}`}`.
3. **serious — 4.1.2 / 2.1.1** AddTask (`forms/AddTask/inline.tsx`) & ShowTask
   (`forms/ShowTask/inline.tsx`) tab strips were `onClick` `<div>`s: not focusable, not
   keyboard-operable, no role/selected state. **FIXED** — converted to a real `role="tablist"`
   of native `role="tab"` buttons with `aria-selected`, roving `tabIndex`, Arrow/Home/End
   nav, and `aria-controls`→`role="tabpanel"` wiring. `data-active`/`data-mobile` preserved.
4. **serious — 1.3.1 / 4.1.2** Meeting-scheduling form (`ShowTask`) `<label>`s were not
   associated with their inputs (Meeting Title, Location, Attendee Name/Email, Notes) and the
   resolution write-up label likewise; the comment / company-notes / customer-notes / edit-comment
   textareas had only a placeholder. **FIXED** — `htmlFor`/`id` pairs on the meeting/resolution
   labels; `aria-label` on the placeholder-only textareas.
5. **serious — 3.3.2 / 3.3.1** Required meeting fields were signalled only by a visual `*`.
   **FIXED** — `aria-required="true"` on the required inputs; the `*` is wrapped `aria-hidden`
   so AT relies on the programmatic flag, not a spoken "asterisk".
6. **serious — 4.1.3** Status/error messages were plain `<div>`s that AT never announced:
   AddTask validation banner (`validationError`) and ShowTask meeting `errorBanner` (form +
   reschedule views). **FIXED** — `role="alert"` on all three.
7. **serious — 2.1.1 / 4.1.2** Clickable **card `<div>`s** (AddTask article grid + selected-chip
   label; ShowTask meeting-list cards, KB linked + search-result cards) were mouse-only.
   **FIXED** — the chip label became a real `<button>`; the block-content cards got
   `role="button"` + `tabIndex={0}` + an Enter/Space `onKeyDown` (shared `activateOnKey`
   helper) + a descriptive `aria-label`.
8. **moderate — 4.1.2** ShowTask sidebar collapse toggle showed only a `»`/`«` glyph (no name)
   and no state. **FIXED** — `aria-label` (Expand/Collapse sidebar) + `aria-expanded`; the glyph
   is `aria-hidden`.
9. **moderate — 4.1.2** Comment external/internal section toggles conveyed active state by
   colour only. **FIXED** — `aria-pressed` reflects the active section.
10. **moderate — 1.1.1** Decorative glyph/emoji read out by AT (breadcrumb chevron; `✓`/`×`/`←`
    in buttons and cards; `🏢`/`📋` note headers; resolution `📋`). **FIXED** — `aria-hidden`
    on the decorative glyphs (and where a glyph sat inside a button, the text remains the name).
11. **minor — 1.4.1** Article/KB "linked" and task "selected" state also signalled by colour.
    **FIXED (defence-in-depth)** — the card `aria-label`s now include "(linked)"; selection is
    already a real checkbox state; tabs/toggles are programmatic. No state is colour-only for AT.
12. **minor — best practice** Bare `<button>`s defaulted to `type="submit"`. **FIXED** on every
    button I touched (`type="button"`). (No `<form>` wraps them, so there was no functional
    submit bug; corrected for correctness.)

### SEO / semantics
13. **moderate — 1.3.1 / 2.4.6** Breadcrumb rendered as flat `<div>`/`<span>`s (no landmark,
    no list, no current marker). **FIXED** — `<nav aria-label="Breadcrumb"><ol><li>…` with
    `aria-current="page"` — crawlable, landmarked, list-structured.
14. **moderate — 1.3.1** A column's tasks were an unstructured stack of `<div>`s. **FIXED** —
    `role="list"` (named `"<column> tasks"`) + `role="listitem"` per card, so AT announces
    "list, N items". Column/task headings render as real `<h3>`/`<h4>` via the consumer
    `headingLevel` prop.

### Motion
15. **moderate — 2.3.3** No `prefers-reduced-motion` handling anywhere (infinite sacred
    glow/float on `.container`, expand-from-origin overlay, card hover lift, column drag-over
    scale, tab transitions, smooth-scroll). **FIXED** — a `@media (prefers-reduced-motion:
    reduce)` block in each of the three module CSS files disables animations/transitions/scale
    and makes the board scroll jump instantly.

### Focus order (this pass)
16. **serious — 2.4.3 (A) — focus not moved on inline view transition.**
    `index.tsx`, `AnimationWrapper.tsx`. Clicking Create Task / Manage unmounts the board
    (incl. its toolbar button); clicking Back / Cancel unmounts the form control — so keyboard
    / screen-reader focus was left on the removed trigger and fell to `<body>`. `Breadcrumb.tsx`
    even had a `forwardRef` + a comment claiming it moved focus to the back button, but the ref
    was **never passed and `.focus()` was never called** (`index.tsx` had no `ref`/`useRef`/
    `.focus()` at all) — dead intent. **FIXED (root cause):**
    - `AnimationWrapper.tsx` — a `useEffect` on `isVisible` moves focus into the revealed
      inline view (its new `tabIndex={-1}` content region) with `preventScroll`, so users land
      at the top of the form and Tab straight in.
    - `index.tsx` — a `useEffect` on `viewState` moves focus to the board region (a new
      `tabIndex={-1}` wrapper around `<Board>`) on return, so neither direction strands focus
      on `<body>`. (Added `useRef` + `ViewState` imports.)
    - `ProjectBoard.module.css` — `.animationContent:focus` / `.toolbarContainer:focus
      { outline: none }` (non-interactive programmatic focus targets take no visible ring).
    - Pattern class: `missing-focus-management-on-view-change`. This resolves the item the
      prior pass had deferred.

### Motion (this pass)
17. **minor — 2.3.3 — reduced-motion gap on the Manage view.**
    `forms/ShowTask/ShowTask.module.css`. The `prefers-reduced-motion` block missed the
    sidebar collapse/expand (`width`/`padding` 0.3s), the collapse button, and the meeting-type
    radio-label transitions. **FIXED** — added `.sidebar`, `.collapseButton`,
    `.meetingRadioLabel` to the `transition: none` list. Pattern class: `missing-reduced-motion`.

## Fixes applied (by file)
- `ProjectBoard.module.css` — (prior) remove `.breadcrumbButton{outline:none}`; add
  `:focus-visible` rings; list-reset; `prefers-reduced-motion` block. (this pass)
  `.animationContent:focus` / `.toolbarContainer:focus { outline: none }` for the two
  programmatic view-transition focus targets.
- `Breadcrumb.tsx` — (prior) `<nav>`/`<ol>`/`<li>` landmark, `aria-current="page"`,
  `aria-hidden` `focusable="false"` icon. (unchanged this pass.)
- `AnimationWrapper.tsx` — (this pass) `tabIndex={-1}` content region + `useEffect` focus-on-open.
- `index.tsx` — (this pass) `tabIndex={-1}` board-region wrapper + `useEffect` focus-on-return;
  `useRef`/`ViewState` imports. (prior fixes were in `board/index.tsx`, a different file.)
- `board/index.tsx` — (prior) checkbox `aria-label`; edit-input `aria-label`s; `type="button"`;
  task `role="list"`/`role="listitem"`.
- `forms/AddTask/inline.tsx` — (prior) ARIA tablist + keyboard; `role="alert"` validation;
  keyboard article cards + chip-label button + `aria-label`ed remove; decorative `aria-hidden`;
  `type="button"`.
- `forms/AddTask/AddTask.module.css` — (prior) chip-label button reset; `:focus-visible` rings;
  `prefers-reduced-motion`.
- `forms/ShowTask/inline.tsx` — (prior) ARIA tablist + keyboard; associated meeting/resolution
  labels + `aria-required`; textarea `aria-label`s; `role="alert"` banners; `radiogroup`;
  collapse button name/state; section-toggle `aria-pressed`; keyboard cards; decorative
  `aria-hidden`; `type="button"`.
- `forms/ShowTask/ShowTask.module.css` — (prior) `:focus-visible` rings; `prefers-reduced-motion`.
  (this pass) extended the reduced-motion block (sidebar/collapse/radio-label).

## Stories updated
`board/ProjectBoard.stories.tsx` and `InlineForms.stories.tsx` (goobs' only regression tests):
- **BoardViewTransitionFocus** (new this pass, play) — clicking Create Task moves focus INTO
  the form's tablist container (not `<body>`); clicking Cancel moves focus back to the board
  region wrapping the task lists. Pins item 16.
- **BoardAccessibility** (prior, play) — every task checkbox named, columns expose named
  `role="list"`, opening Create Task surfaces the Breadcrumb `<nav>` landmark.
- **AddTaskAccessibleTabs** (prior, play) — `role="tablist"`, two `role="tab"`s, `aria-selected`
  toggles under ArrowRight, panel `aria-labelledby` follows the active tab.
- **AddTaskValidationError** (prior) — asserts the banner is a `role="alert"`.
- **ShowTaskAccessibleTabs** (prior, play) — six `role="tab"`s, keyboard nav to Comments, and the
  add-comment textarea reachable by its accessible name.
- **ShowTaskMeetingFormLabels** (prior, play) — meeting form fields reachable by their associated
  labels, required fields carry `aria-required`, meeting-type radios form a named `radiogroup`.

## Deferred (design-level; not fixed here)
- **serious — 2.1.1 (keyboard) / 2.5.7 (dragging movements) — drag-and-drop reordering.**
  `board/index.tsx` columns (`.columnHeader`, `draggable`) and task cards are reorderable by
  **mouse/touch drag only** — no keyboard path and no single-pointer alternative. All task
  *data* is still reachable/operable by keyboard (select via checkbox → Manage) and the reorder
  state is local-only and non-persisted (no `onReorder` prop; `columnState` resets from props),
  so this is a missing *enhancement*, not lost content — but reordering itself is inaccessible.
  A correct fix requires a **visible** move affordance on every column header / task card, which
  changes the rendered appearance of a **published** component for all consumers (and churns the
  Chromatic baselines) — a product-design decision for the library owner, not a mechanical a11y
  fix. Suggested shape: a per-card/column "move" handle button with Space-to-grab,
  Arrow-to-move, Space-to-drop, and an `aria-live` region announcing the new position (the
  dnd-kit keyboard-sensor pattern). Pattern class: `missing-keyboard-drag-alternative`.
- **minor — 2.4.7 — Breadcrumb occluded during form views.** The inline form renders in a
  `position: fixed`, opaque, full-cover `.animationOverlay` (z-index 1000) that visually
  occludes the container-level `<nav>` breadcrumb preceding it in the DOM. A keyboard user
  Shift-Tabbing off the first form control can reach the occluded back button (focus on an
  invisible element). A focus trap, or removing the occluded breadcrumb from the tab order
  during form views, would resolve it — a layout/redesign call beyond this sweep; the primary
  stranded-focus problem (item 16) is fixed.
- **minor — 1.3.1 — eyebrow `.sectionTitle` labels as `<div>`.** Tab-panel section labels
  ("User", "Details", "Case Updates", "Resolution Information", …) are styled `<div>`s rather
  than headings. They read fine as text; promoting the genuine section headings to real `<h*>`
  (keeping the small eyebrow labels as text) would aid SR heading navigation but risks
  heading-level drift and visual regression across a published component — recommend a dedicated
  pass with the owner.

## Out-of-band (non-a11y) note
`forms/AddTask/inline.tsx` renders knowledgebase `fieldValues` via
`dangerouslySetInnerHTML`. Not an a11y issue and out of scope for this audit, but flagged as a
potential stored-XSS surface if `fieldValues` can carry untrusted HTML — worth a security look
by the owner of the KB data path.
