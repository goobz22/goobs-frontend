# ListItemCard — a11y audit (2026-07-11)

**Status:** FIXED (all in-component issues resolved). One follow-up is out of this
directory's scope: the `dist/` bundle + `.d.ts` must be rebuilt and the package
republished so consumers receive these fixes (see **Deferred**).

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

When `onSelect` is supplied the row's NON-interactive naming content
(order / icon / content) is wrapped in a real native **`<button type="button">`**
(APG toggle-`button` pattern): `aria-pressed` reflects `selected`, and Enter/Space
activate it NATIVELY (no synthetic key handler, no `role`/`tabIndex` on the
`<li>`). The `<li>` keeps its implicit `listitem` role, and the reorder / remove /
`Actions` controls render as SIBLINGS of that button — never nested inside it — so
the button holds no focusable descendants (ARIA button-role contract) and a
`<ul role="list">` of these rows keeps valid `listitem` children. There is no single
monolithic APG pattern — the row is a composition, and its selectable form is the
native `button` toggle pattern.

Keyboard support is delegated to native semantics + the composed controls: Tab
reaches the select button and each nested control; the drag handle's ↑/↓ buttons
perform reorder; Enter/Space on the focused select button toggles selection (native
`<button>`). The reorder / remove / `Actions` wrappers `stopPropagation` on
click/keydown so a nested control never bubbles into row selection.

## Issues found

### 1. Selectable row had a garbled / polluted accessible name — SERIOUS — FIXED
- **WCAG:** 4.1.2 Name, Role, Value (A); 2.4.6 Headings and Labels (AA)
- **pattern:** `missing-accessible-name`
- **Where:** the selectable `<button>` select target + `ListItemCardContent`
  (title/subtitle spans).
- **Problem:** With the old whole-row `role="button"` and no explicit name, the
  row's accessible name was computed from the concatenated text of ALL descendants
  — folding the title, subtitle, AND every nested control label (reorder group,
  custom action, remove) into one unusable string.
- **Fix:** The root generates a `useId()` base, shares `titleId` / `subtitleId`
  through `ListItemCardContext`, and `ListItemCard.Content` stamps those ids on its
  title/subtitle spans. The selectable `<button>` emits `aria-labelledby` (title,
  or title + subtitle) in the SSR markup, and a post-mount reconciliation effect
  re-points it at whichever ids actually resolved (or clears it if none did — no
  dangling idref). The row now announces its real title (+ subtitle) — e.g. *"Draft
  proposal, Pricing + scope, toggle button, pressed"*.

### 2. `role="button"` on the `<li>` overrode `listitem` and nested focusable controls — MODERATE — FIXED
- **WCAG:** 1.3.1 Info and Relationships (A); 4.1.2 Name, Role, Value (A)
- **pattern:** `interactive-content-nesting`
- **Where:** the root render's `selectable` branch (`index.tsx`).
- **Problem (original):** the old design put `role="button"` + `tabIndex=0` on the
  `<li>` itself, which (a) replaced the `<li>`'s implicit `listitem` role so a
  `<ul role="list">` of selectable rows lost valid list children, and (b) nested
  the reorder/remove/action `<button>`s INSIDE the button role (an ARIA `button`
  must not contain focusable descendants).
- **Fix (the MUI-style split — shipped):** the `<li>` KEEPS its implicit
  `listitem` role (no `role` override, no `tabIndex`, no synthetic `handleKeyDown`).
  Only the non-interactive naming content (`Order` / `Icon` / `Content`) is wrapped
  in the select `<button>`; the `Actions` slot is partitioned out of the opaque
  `children` (`childArray.filter(child.type === ListItemCardActions)`) and rendered
  as a SIBLING of the button, and the reorder handle + remove control are likewise
  siblings. The button therefore holds NO focusable descendants, and the list keeps
  valid `listitem` children. This is the restructure the prior audit had deferred;
  it is now the shipped architecture. The `EditableReorderableList` story exercises
  the worst-case composition (selectable + reorder + remove + custom action) so the
  sibling structure stays visible in the Chromatic baseline.

### 3. A Content-less selectable row could ship a nameless `<button>` — MINOR — FIXED
- **WCAG:** 4.1.2 Name, Role, Value (A)
- **pattern:** `missing-accessible-name`
- **Where:** the selectable `<button>` + `nameIds` computation (`index.tsx`).
- **Problem:** a selectable row (`onSelect` set) rendered WITHOUT a
  `ListItemCard.Content` child yields `contentChild === undefined` → `nameIds`
  undefined → no SSR `aria-labelledby`; the post-mount effect then finds neither
  `titleId` nor `subtitleId` in the DOM and removes `aria-labelledby`, leaving a
  `<button>` whose only descendants are the `aria-hidden` Order/Icon glyphs — an
  accessible name of the empty string. Every documented usage includes `Content`,
  but the misuse was unguarded.
- **Fix (two parts):**
  1. **Escape hatch (accessible-by-default):** added an additive `selectLabel?:
     string` prop. When a selectable row has no nameable `Content`, `selectLabel` is
     applied as `aria-label` on the select button (in SSR markup and re-applied by
     the reconciliation effect as the id-resolution fallback). A `Content` title
     still wins (`aria-labelledby` beats `aria-label`). This gives genuinely
     text-less selectable rows (e.g. an icon-only swatch) a real name.
  2. **Guard (surfaces misuse):** a dev-only `useEffect` (gated on
     `process.env.NODE_ENV !== 'production'`, compiled out of prod bundles, mirrors
     the goobs Panel / IconButton nudge) checks the button's FINAL naming state —
     resolved `aria-labelledby`, non-blank `aria-label`, or any non-`aria-hidden`
     visible text (via the `hasNonHiddenText` TreeWalker probe that skips
     `aria-hidden` subtrees) — and `console.warn`s when a selectable row would ship
     a nameless button, telling the author to add `Content` or `selectLabel`.
- **Note:** a selectable row with plain-text children (no `Content`, but real
  visible text wrapped in the button) was already correctly named by the browser
  from that text; the probe recognizes it and does NOT false-warn.

### 4. Selection uses toggle-button (`aria-pressed`) semantics — EVALUATED — NO CHANGE (correct for a container-less primitive)
- **WCAG:** none failed (2.1.1 / 4.1.2 satisfied by the native `<button>`).
- **Where:** the selectable `<button>`'s `aria-pressed` (`index.tsx`);
  `SelectableAccessibleName` / `MultiSelectToggle` stories.
- **Concern raised:** `aria-pressed` toggle-button semantics do not convey mutual
  exclusivity, so a single-select (one-`selectedId`) list is less precisely
  described than a `radiogroup` / `listbox` would describe it.
- **Evaluation / resolution:** `aria-pressed` is a correct, valid, independent
  toggle-button state — the right choice for a GENERIC selectable primitive and for
  multi-select. Rendering `role="radio"` + `aria-checked` (or `role="option"` +
  `aria-selected`) would require the row to sit inside a `role="radiogroup"` (or
  `role="listbox"`) container — but this component renders a LONE `<li>`; the list
  container (`<ul>`) is the CONSUMER's. Emitting a `role="radio"` from inside a
  single `<li>` whose parent is a `role="list"` would produce ORPHAN, INVALID ARIA
  (a radio with no radiogroup ancestor) — strictly worse than a valid toggle
  button. So single-select grouping is correctly the container's responsibility, and
  the row ships the valid toggle-button semantics. This is now documented in the
  `onSelect` JSDoc + the file-header SELECTION block, and made explicit + tested by
  the new `MultiSelectToggle` story (multiple rows pressed at once, each reporting
  its own `aria-pressed`) alongside the single-select `SelectableAccessibleName`
  presentation built on the same toggle buttons.

## Hearing (WCAG 1.2.x, 1.4.2)

CLEAN. No `Audio` / `AudioContext` / `<audio>` / `<video>` / `navigator.vibrate`
usage anywhere in the component (grep verified). Nothing is conveyed by sound; the
selection-diagnostic beacon (`emitDiag`) is a silent programmatic event, not audio.
No captions/transcripts applicable.

## Reading & screen reader (1.1.1, 1.3.1, 1.4.1, 2.1.x, 2.4.x, 4.1.2)

- **Accessible names:** Fixed for the selectable row (Issues 1 & 3) — named from
  its `Content` title/subtitle (`aria-labelledby`) or from `selectLabel`
  (`aria-label`); a dev warning guards the residual nameless case. The remove
  control is named by `removeLabel` (default `'Remove'`) via IconButton's
  `aria-label`; the reorder group is labelled by `reorderLabel` with hard-labelled
  `Move up` / `Move down` buttons. Icon-only glyphs (`✕`, order badge, leading icon)
  are `aria-hidden` so they don't pollute names.
- **Semantic HTML:** Native `<li>` root (implicit `listitem`, never role-overridden)
  and native `<button>`s throughout (select target, reorder, remove) — no
  role-annotated divs standing in for interactive elements.
- **List integrity (1.3.1):** the split (Issue 2) keeps the interactive controls as
  SIBLINGS of the select button, so the `<li>` stays a valid `listitem` and the
  button holds no focusable descendants.
- **Selection state (1.4.1 — not color-alone):** `selected` is conveyed
  programmatically via `aria-pressed` + `data-selected`, AND visually via a
  box-shadow ring + border-color change (a shape/weight change, not hue-only).
- **Focus visibility:** `.root:focus-visible` and `.select:focus-visible` render a
  2px solid outline with `outline-offset: 2px` (module.css). The focusable target on
  a selectable row is the select `<button>` (`.select:focus-visible`).
- **Keyboard:** Enter/Space activate the native `<button>` select target (no custom
  key handler needed); nested reorder/remove/`Actions` `stopPropagation` on
  click/keydown so they never toggle the row. No custom arrow-key nav is required
  (reorder is button-driven).
- **No overlay/dialog/form** surface in this component → no focus-trap / aria-modal /
  error-association obligations.
- **Dynamic updates:** the only dynamic surface is selection, conveyed via
  `aria-pressed`; no snackbar/alert/async region needs `aria-live`.

## SEO semantics (SSR)

- **Headings:** The Content title renders as a `<span>`, NOT a heading — correct for
  a list-row label (forcing `<h1>-<h6>` per row would inject a bogus outline entry).
  No `headingLevel` prop is warranted.
- **Landmarks / lists:** The component renders the `<li>`; the surrounding
  `<ul>`/`<ol>` container is the consumer's responsibility (documented in the JSDoc
  usage example with `<ul role="list">`). All row text is real SSR'd DOM (the
  `aria-labelledby` is emitted server-side referencing ids a `Content` child stamps
  — no client-only injection of the primary name), no canvas/QR needing a text
  alternative.
- **Links:** No links in this component; nothing to convert to `<a href>`.

## Motion (WCAG 2.3.3)

- **FIXED:** `pattern: missing-reduced-motion`. The `.root` transition
  (background/border/shadow) was unconditional, and the hover-background rule was
  gated behind `@media (prefers-reduced-motion: no-preference)` — which incorrectly
  stripped the hover *affordance* (not just its animation) from reduced-motion users.
  Fixed: the hover background applies unconditionally (it is an affordance, not
  motion), and a `@media (prefers-reduced-motion: reduce) { .root { transition:
  none } }` block suppresses only the tween while preserving every state (hover wash,
  selected ring, focus outline).

## Fixes applied

1. **aria-labelledby naming** (`index.tsx`) — context-shared `titleId`/`subtitleId`
   (via `React.useId`), stamped on the Content title/subtitle spans, referenced by
   the selectable button's `aria-labelledby` with a post-mount reconciliation
   effect. Merged root ref (`assignRootRef`) so the effect and the consumer ref both
   reach the `<li>`. (Issue 1)
2. **listitem-preserving split** (`index.tsx`) — `<li>` keeps its implicit role; only
   Order/Icon/Content are wrapped in the select `<button>`; `Actions` partitioned out
   of `children` and rendered as a sibling alongside reorder/remove. (Issue 2)
3. **`selectLabel` prop + nameless-button dev guard** (`index.tsx`) — additive
   `selectLabel` → `aria-label` fallback for Content-less selectable rows; a
   dev-only `console.warn` (with the `hasNonHiddenText` aria-hidden-aware probe)
   surfaces a would-be-nameless select button at author time. (Issue 3)
4. **selection-semantics documentation** (`index.tsx` JSDoc + file header) — records
   why the row ships valid toggle-button (`aria-pressed`) semantics rather than
   orphan `role="radio"`/`option`. (Issue 4)
5. **Reduced-motion** (`ListItemCard.module.css`, prior pass) — hover feedback
   un-gated; `prefers-reduced-motion: reduce` disables the `.root` transition.

Gates: `bun lint:file` on `index.tsx` + `ListItemCard.stories.tsx` → 0
errors/warnings. Repo-wide `typecheck` / `build` (which regenerates the `.d.ts` and
`dist/`) are run by the batch gate agent — see **Deferred**.

## Stories updated

- **`SelectableAccessibleName`** — corrected its JSDoc (was `role="button"`; now
  native `<button>` toggle target) and clarified that its single `selectedId` is a
  single-select PRESENTATION built on independent toggle buttons.
- **`MultiSelectToggle`** (NEW) — multiple rows pressed simultaneously, each
  reporting its own `aria-pressed`, making the toggle-button (multi-select)
  semantics explicit + tested (Issue 4).
- **`SelectableWithSelectLabel`** (NEW) — an icon-only, Content-less selectable list
  named via the new `selectLabel` prop; exercises the Issue 3 escape hatch (SSR
  `aria-label`, and MUST NOT trip the nameless-button dev warning).
- **`EditableReorderableList`** (existing) — continues to exercise the worst-case
  composition (selectable + reorder + remove + custom action) so the sibling
  structure from the Issue 2 split stays in the baseline.

## Deferred

Out-of-directory / out-of-scope for this per-component pass:

- **Rebuild `dist/` + regenerate `index.d.ts` / `index.d.ts.map` + republish the npm
  package.** The compiled `src/components/ListItemCard/index.d.ts` (and `dist/`) still
  carry the pre-a11y `role="button"` SELECTION header and prop JSDoc because they are
  build artifacts and were not regenerated. The SOURCE (`index.tsx`) is now correct,
  so `bun run build` (`tsc --noEmit && vite build`, plus the declaration emit that
  produces the `.d.ts`) will regenerate them from the fixed source; a version bump +
  `npm publish` then delivers every ListItemCard a11y fix (Issues 1–4) to ThothOS and
  other consumers. This owner/batch-gate step is intentionally NOT done here:
  `.d.ts`/`.d.ts.map` are build-generated (must not be hand-edited) and the repo-wide
  `bun run build` is the batch gate's responsibility, not a per-component task.
  - File: `src/components/ListItemCard/index.d.ts` (+ `.d.ts.map`), regenerated by the
    root `bun run build`.
  - Suggested change: none by hand — rebuild from source, bump the package `version`,
    `npm publish`, then bump the pinned `goobs-frontend` version in the consumer
    `package.json` and `bun install`.

No other cross-file (out-of-directory) fixes were required — all code fixes landed in
the owned component directory.
