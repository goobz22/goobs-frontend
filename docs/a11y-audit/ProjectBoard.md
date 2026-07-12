# ProjectBoard — a11y audit (2026-07-11)

**Status:** PARTIAL (all found in-directory issues fixed at root cause; two large,
design-level items deferred with recommendations)

**Component:** `src/components/ProjectBoard/` — a themed Kanban board plus two inline
task views (`InlineAddTask`, `InlineShowTask`) reached by view-state transitions
(Wolken-style), not dialogs.

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
2. **serious — 4.1.2 / 1.3.1** `board/index.tsx:70` task-selection `<input type="checkbox">`
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
    "list, N items". Column/task headings already render as real `<h3>`/`<h4>`.

### Motion
15. **moderate — 2.3.3** No `prefers-reduced-motion` handling anywhere (infinite sacred
    glow/float on `.container`, expand-from-origin overlay, card hover lift, column drag-over
    scale, tab transitions, smooth-scroll). **FIXED** — a `@media (prefers-reduced-motion:
    reduce)` block in each of the three module CSS files disables animations/transitions/scale
    and makes the board scroll jump instantly.

## Fixes applied (by file)
- `ProjectBoard.module.css` — remove `.breadcrumbButton{outline:none}`; add `:focus-visible`
  rings (breadcrumb button, task checkbox/buttons/inputs); `.breadcrumbList`/`.breadcrumbItem`
  list-reset; `prefers-reduced-motion` block.
- `Breadcrumb.tsx` — `<nav>`/`<ol>`/`<li>` landmark, `aria-current="page"`, `aria-hidden`
  `focusable="false"` icon.
- `board/index.tsx` — checkbox `aria-label`; edit-input `aria-label`s; `type="button"`;
  task `role="list"`/`role="listitem"`.
- `forms/AddTask/inline.tsx` — ARIA tablist + keyboard; `role="alert"` validation; keyboard
  article cards + chip-label button + `aria-label`ed remove; decorative `aria-hidden`;
  `type="button"`.
- `forms/AddTask/AddTask.module.css` — chip-label button reset; `:focus-visible` rings;
  `prefers-reduced-motion`.
- `forms/ShowTask/inline.tsx` — ARIA tablist + keyboard; associated meeting/resolution labels
  + `aria-required`; textarea `aria-label`s; `role="alert"` banners; `radiogroup`; collapse
  button name/state; section-toggle `aria-pressed`; keyboard cards; decorative `aria-hidden`;
  `type="button"`.
- `forms/ShowTask/ShowTask.module.css` — `:focus-visible` rings; `prefers-reduced-motion`.

## Stories updated
`board/ProjectBoard.stories.tsx` and `InlineForms.stories.tsx` (goobs' only regression tests):
- **BoardAccessibility** (new, play) — asserts every task checkbox is named, columns expose
  named `role="list"`, and opening Create Task surfaces the Breadcrumb `<nav>` landmark.
- **AddTaskAccessibleTabs** (new, play) — `role="tablist"`, two `role="tab"`s, `aria-selected`
  toggles under ArrowRight, panel `aria-labelledby` follows the active tab.
- **AddTaskValidationError** (extended) — also asserts the banner is a `role="alert"`.
- **ShowTaskAccessibleTabs** (new, play) — six `role="tab"`s, keyboard nav to Comments, and the
  add-comment textarea reachable by its accessible name.
- **ShowTaskMeetingFormLabels** (new, play) — opens the meeting form and asserts the fields are
  reachable by their associated labels, required fields carry `aria-required`, and the
  meeting-type radios form a named `radiogroup`.

## Deferred (design-level; not fixable without an API/UX decision — left in-directory untouched)
- **serious — 2.1.1 (keyboard) — drag-and-drop reordering.** `board/index.tsx` columns
  (`.columnHeader`, `draggable`) and task cards are reorderable by **mouse drag only** — no
  keyboard path. All task *data* is still reachable/operable by keyboard (select via checkbox →
  Manage), so this is a missing *enhancement*, not lost content, but reordering itself is
  inaccessible. A full fix is a sizeable feature (roving grab/move/drop keyboard model, live-region
  announcements) that changes the interaction contract — recommend a dedicated task. Suggested
  shape: a per-card/column "move" affordance with Space-to-grab, Arrow-to-move, Space-to-drop,
  and an `aria-live` region announcing position, mirroring the DnD kit keyboard sensor pattern.
- **moderate — 2.4.3 (focus order) — focus is not moved on view transition.** In `index.tsx`,
  clicking Create Task / Manage unmounts the board and mounts the form inside a
  `position:fixed` `.animationOverlay`; keyboard focus is left on the now-removed trigger and
  falls to `<body>`. The breadcrumb gives textual context, but focus should move to the new
  view's heading/breadcrumb on entry and be restored to the board on Back. Deferred because the
  correct focus target and its interaction with the 400ms expand animation is a UX call; it is
  fixable in-directory (a `useEffect` on `viewState` focusing a ref) and recommended as a
  follow-up.

## Out-of-band (non-a11y) note
`forms/AddTask/inline.tsx` renders knowledgebase `fieldValues` via
`dangerouslySetInnerHTML`. Not an a11y issue and out of scope for this audit, but flagged as a
potential stored-XSS surface if `fieldValues` can carry untrusted HTML — worth a security look
by the owner of the KB data path.
