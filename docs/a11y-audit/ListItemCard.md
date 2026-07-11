# ListItemCard — a11y audit (2026-07-11)

**Status:** PARTIAL (primary serious issue FIXED; one moderate architectural
tradeoff documented as a residual limitation)

**Component:** `src/components/ListItemCard/index.tsx`
(+ `ListItemCard.module.css`, `ListItemCard.stories.tsx`)

## APG pattern

ListItemCard is a **row primitive for ordered / editable / selectable lists**. It
renders a semantic `<li>` and composes:

- an optional reorder affordance (`Card.DragHandle` — a `role="group"` of two
  `Move up` / `Move down` `<button>`s, already accessible),
- an optional trailing remove control (`IconButton` — a native `<button>` with
  `aria-label`),
- optional custom action buttons in `ListItemCard.Actions`.

When `onSelect` is supplied the whole row becomes a **custom button widget**
(APG `button` pattern): `role="button"`, `tabIndex=0`, `aria-pressed` reflecting
`selected`, Enter/Space activation with `event.preventDefault()`. There is no
single monolithic APG pattern — the row is a composition, and its selectable form
is the `button` toggle pattern.

Keyboard support is otherwise delegated to the composed controls (Tab reaches the
row button and each nested control; the drag handle's ↑/↓ buttons perform reorder;
Enter/Space on the row toggles selection). The row's `handleKeyDown` correctly
guards `event.target !== event.currentTarget` so keystrokes inside nested controls
are not swallowed by row selection.

## Issues found

### 1. Selectable row had a garbled / polluted accessible name — SERIOUS — FIXED
- **WCAG:** 4.1.2 Name, Role, Value (A); 2.4.6 Headings and Labels (AA)
- **pattern:** `missing-accessible-name`
- **Where:** `index.tsx` `selectionProps` (was ~line 219; now line 274) +
  `ListItemCardContent` (title/subtitle spans, now lines 371–393).
- **Problem:** With `role="button"` and no explicit name, the row button's
  accessible name was computed from the concatenated text of ALL descendants.
  The order badge and icon are `aria-hidden`, but the title, subtitle, AND every
  nested control label (reorder group `aria-label`, custom action button, remove
  button) were folded into one string — e.g. a selectable + reorderable +
  removable row announced roughly *"Reorder Draft proposal … Draft proposal
  Pricing + scope Edit step Remove, button"*. Unusable as a name.
- **Fix:** Mirrored the sibling `Card` pattern — the root generates a `useId()`
  base, shares `titleId` / `subtitleId` through `ListItemCardContext`, and
  `ListItemCard.Content` stamps those ids on its title/subtitle spans. A
  selectable row emits `aria-labelledby={titleId}` in the SSR markup, and a
  post-mount reconciliation effect upgrades it to `titleId subtitleId` (whichever
  actually mounted) or removes it if no title element exists (so no dangling
  idref). The row now announces its real title (+ subtitle) — e.g. *"Draft
  proposal, Pricing + scope, toggle button, pressed"*.

### 2. `role="button"` on the `<li>` overrides `listitem` and nests focusable controls — MODERATE — NOT FIXED (residual design tradeoff)
- **WCAG:** 1.3.1 Info and Relationships (A); 4.1.2 Name, Role, Value (A)
- **pattern:** `interactive-content-nesting`
- **Where:** `index.tsx` line 276 (`role: 'button'`) with descendant `<button>`s
  from the reorder handle (Card, lines ~1365–1384), the remove `IconButton`
  (lines 316–333), and `ListItemCard.Actions` children.
- **Problem:** Two coupled ARIA concerns inherent to the documented
  "whole-row-is-the-select-target" design:
  (a) `role="button"` replaces the `<li>`'s implicit `listitem` role, so a
  `<ul role="list">` of selectable rows technically loses valid list children;
  (b) the ARIA `button` role SHOULD NOT contain focusable descendants, yet a
  fully-composed row nests the reorder/remove/action buttons inside it.
- **Why not fixed here:** The accessible-by-default remedy (the MUI-style split:
  keep the `<li>` a `listitem`, wrap ONLY the non-interactive order/icon/content
  in the select `<button>`, and render reorder/remove/actions as SIBLINGS outside
  it) requires separating the `Actions` slot out of the opaque, consumer-ordered
  `children` — a change to the public composition contract / DOM structure and a
  Chromatic-visible layout restructure that exceeds a non-breaking a11y patch and
  cannot be validated against the visual gate in this per-component pass. The
  Fix #1 `aria-labelledby` change neutralizes the primary *practical* harm (the
  name pollution); the nested-focusable controls remain individually operable and
  named, and each `stopPropagation`s so it never mis-toggles the row. Recorded as
  a residual limitation rather than a risky restructure. See **Deferred**.

## Hearing (WCAG 1.2.x, 1.4.2)

CLEAN. No `Audio` / `AudioContext` / `<audio>` / `<video>` / `navigator.vibrate`
usage anywhere in the component (grep verified). Nothing is conveyed by sound;
the selection-diagnostic beacon (`emitDiag`, `index.tsx` ~line 234) is a silent
programmatic event, not audio. No captions/transcripts applicable.

## Reading & screen reader (1.1.1, 1.3.1, 1.4.1, 2.1.x, 2.4.x, 4.1.2)

- **Accessible names:** Fixed for the selectable row (Issue 1). The remove
  control gets its name from `removeLabel` (default `'Remove'`) via IconButton's
  `aria-label`; the reorder group is labelled by `reorderLabel` and its two
  buttons are hard-labelled `Move up` / `Move down`. Icon-only glyphs (`✕`, order
  badge, leading icon) are `aria-hidden` so they don't pollute names — correct.
- **Semantic HTML:** Native `<li>` root and native `<button>`s throughout (no
  role-annotated divs standing in for interactive elements). Good.
- **Selection state (1.4.1 — not color-alone):** `selected` is conveyed
  programmatically via `aria-pressed` + `data-selected`, AND visually via a
  box-shadow ring + border-color change (a shape/weight change, not hue-only).
  Satisfied.
- **Focus visibility:** `.root:focus-visible` renders a 2px solid outline with
  `outline-offset: 2px` (module.css lines 85–88). Present and visible.
- **Keyboard:** Enter/Space toggle selection with `preventDefault`; the
  `target === currentTarget` guard keeps nested-control keystrokes with their
  controls; nested buttons `stopPropagation` on click/keydown so they never
  toggle the row. No custom arrow-key nav is required (reorder is button-driven).
- **No overlay/dialog/form** surface in this component → no focus-trap /
  aria-modal / error-association obligations.
- **Dynamic updates:** The only dynamic surface is selection, conveyed via
  `aria-pressed`; no snackbar/alert/async region needs `aria-live`.

## SEO semantics (SSR)

- **Headings:** The Content title renders as a `<span>`, NOT a heading — correct
  for a list-row label. A row title inside a list is a labelled list item, not a
  document section heading; forcing `<h1>-<h6>` here would inject a bogus outline
  entry per row. No `headingLevel` prop is warranted. (Contrast with genuine
  section headers, which the audit checklist targets.)
- **Landmarks / lists:** The component renders the `<li>`; the surrounding
  `<ul>`/`<ol>` list container is the consumer's responsibility (documented in the
  JSDoc usage example with `<ul role="list">`). All row text is real SSR'd DOM —
  no client-only injection of primary content, no canvas/QR needing a text
  alternative.
- **Links:** No links in this component; nothing to convert to `<a href>`.

## Motion (WCAG 2.3.3)

- **Issue (MINOR) — FIXED:** `pattern: missing-reduced-motion`. The `.root`
  `transition` (background/border/shadow, module.css lines 32–36) was
  unconditional, and the hover-background rule was gated behind
  `@media (prefers-reduced-motion: no-preference)` — which incorrectly stripped
  the hover *affordance* (not just its animation) from reduced-motion users.
  Fixed: the hover background now applies unconditionally (it is an affordance,
  not motion), and a new `@media (prefers-reduced-motion: reduce) { .root {
  transition: none } }` block suppresses only the tween while preserving every
  state (hover wash, selected ring, focus outline).

## Fixes applied

1. **aria-labelledby naming** (`index.tsx`, `ListItemCard.module.css` n/a) —
   context-shared `titleId`/`subtitleId` (via `React.useId`), stamped on the
   Content title/subtitle spans, referenced by the selectable row's
   `aria-labelledby` with a post-mount reconciliation effect (mirrors Card).
   Merged root ref (`assignRootRef`) added so the effect and the consumer ref
   both reach the `<li>`.
2. **Reduced-motion** (`ListItemCard.module.css`) — hover feedback un-gated;
   `prefers-reduced-motion: reduce` now disables the `.root` transition.

Gates: `bun lint:file` on `index.tsx` + `ListItemCard.stories.tsx` → 0
errors/warnings. `stylelint` on `ListItemCard.module.css` → clean.
(`bun typecheck:file` is unusable in this repo — `tsc` emits TS5112 when a file
is passed alongside a tsconfig; the batch typecheck gate covers it. The ref-merge
logic is copied structurally from the type-clean `Card.assignRootRef`.)

## Stories updated

- Added **`SelectableAccessibleName`** (`ListItemCard.stories.tsx`) — a light-theme
  single-select list of selectable rows (title + subtitle, order badge, icon) that
  exercises the new `aria-labelledby` naming path (both title and subtitle ids
  resolved) and the `aria-pressed` selected state. JSDoc documents the expected
  screen-reader announcement. The pre-existing `EditableReorderableList` continues
  to exercise the worst-case composition (selectable + reorder + remove + custom
  action) so the residual nesting shape stays visible in the baseline.

## Deferred

No cross-file (out-of-directory) fixes were required — all fixes landed in the
owned component directory. One in-directory issue is intentionally NOT fixed:

- **Issue 2 (`interactive-content-nesting`)** — the accessible-by-default
  restructure (keep the `<li>` a `listitem`; wrap only order/icon/content in the
  select `<button>`; move reorder/remove/`Actions` to siblings) is a
  public-composition-contract + DOM-layout change that needs the Chromatic visual
  gate and a decision on how to split the `Actions` slot out of opaque `children`
  (e.g. render `Actions`/reorder/remove strictly outside the select region, or add
  a boundary). Suggested change lives entirely within `index.tsx` but is a
  design-level restructure, not a patch — flagged for a dedicated follow-up so the
  visual regression can be verified. `aria-labelledby` (Issue 1) mitigates the
  primary practical harm in the meantime.
