# TreeView — a11y audit (2026-07-11)

**Status:** FIXED (incl. adversarial-review follow-ups, second ownership pass, and
third adversarial-review round — focus-on-collapse + single-select aria-selected, 2026-07-11)

**APG pattern:** [WAI-ARIA APG — Tree View](https://www.w3.org/WAI/ARIA/apg/patterns/treeview/)
(single-select / multi-select tree, with optional checkbox selection). The
component renders `role="tree"` → `role="treeitem"` → `role="group"` and now
implements the pattern's full keyboard interaction table plus roving tabindex.

Component directory: `src/components/TreeView/`
Primary source: `src/components/TreeView/index.tsx`,
`src/components/TreeView/TreeView.module.css`,
`src/components/TreeView/TreeView.stories.tsx`.

---

## Issues found

| # | Severity | WCAG | Area | Location | Status |
|---|----------|------|------|----------|--------|
| 1 | Serious | 2.1.1 Keyboard | keyboard | `index.tsx` `handleKeyDown` | FIXED |
| 2 | Serious | 2.4.3 Focus Order | keyboard | `index.tsx` treeitem `tabIndex` + root `tabIndex` | FIXED |
| 3 | Serious | 2.4.7 Focus Visible | reading | `TreeView.module.css` `.item` (`outline: none`) | FIXED |
| 4 | Moderate | 1.3.1 Info & Relationships | aria | `index.tsx` `renderTree` children wrapper | FIXED (group + `aria-owns` ownership, R1) |
| 5 | Moderate | 2.3.3 Animation from Interactions | motion | `index.tsx` `SacredBackground` + `.module.css` transitions | FIXED |
| 6 | Minor | 1.3.1 Info & Relationships | aria | `index.tsx` treeitem (only `aria-level` present) | FIXED |
| 7 | Minor | 1.1.1 Non-text Content | reading | `index.tsx` `<ExpandMoreIcon>` svg | FIXED |
| 8 | Minor | 4.1.2 Name, Role, Value | aria | `index.tsx` root `role="tree"` (no name) | FIXED (passthrough + doc) |
| 9 | Minor | 4.1.2 Name, Role, Value | keyboard | `index.tsx` chevron `role="button"` | FIXED (chevron made decorative, R2) |

### Adversarial-review follow-ups (2026-07-11)

| # | Severity | WCAG / kind | Area | Location | Status |
|---|----------|-------------|------|----------|--------|
| R1 | Moderate | 1.3.1 Info & Relationships | aria | `index.tsx` treeitem `aria-owns` + group `id` | FIXED |
| R2 | Minor | 4.1.2 Name, Role, Value | keyboard/aria | `index.tsx` chevron container | FIXED |
| R3 | Minor | consistency | keyboard | `index.tsx` row `onFocus` / `handleClick` | FIXED |
| R4 | Minor | UX / behavior | keyboard-adjacent | `index.tsx` `handleIconClick` | FIXED |
| R5 | Minor | APG completeness | keyboard | `index.tsx` `handleKeyDown` type-ahead + `*` | FIXED |

### Second ownership pass (2026-07-11, commit `4c26dac5`)

| # | Severity | WCAG / kind | Area | Location | Status |
|---|----------|-------------|------|----------|--------|
| P1 | Minor | 1.1.1 Non-text Content | reading | `index.tsx:1050-1056` `SacredBackground` `<canvas>` | FIXED |
| P2 | Minor | 4.1.2 Name, Role, Value | aria | `index.tsx:1405` treeitem `aria-selected` | FIXED |

**P1 — Decorative particle `<canvas>` not hidden from AT (MINOR, WCAG 1.1.1) — FIXED.**
The sacred-theme `SacredBackground` `<canvas>` is a purely ornamental, `pointer-events:none`
drifting-hieroglyph overlay that conveys no information, but it carried no `aria-hidden`, so a
screen reader could surface a bare, meaningless canvas. **Fix:** added `aria-hidden="true"` to
the canvas element (`index.tsx:1052`). Pattern class `icon-missing-aria-hidden`
(decorative-graphic-missing-aria-hidden). Pinned by a new `play` test on `SacredTheme`.

**P2 — `aria-selected` announced on an unselectable tree (MINOR, WCAG 4.1.2) — FIXED.**
Every `treeitem` emitted `aria-selected="false"` even when `disableSelection` turns selection
off entirely — so a tree that supports no selection still announced a permanent, unchangeable
"not selected" on every row. The APG Tree View pattern requires `aria-selected` to be absent on
a tree whose nodes are not selectable. **Fix:** `aria-selected` is now omitted (`undefined`)
when `context.disableSelection` is set, and reflects `isSelected` otherwise (`index.tsx:1405`).
Pattern class `aria-state-when-unsupported`. Pinned by a new `play` test on `DisabledSelection`.
(Extended in the third review round, AR-F2 below, to also omit it on unselected nodes in
single-select mode.)

### Third adversarial-review round (2026-07-11, commit `43779c98`)

| # | Severity | WCAG / kind | Area | Location | Status |
|---|----------|-------------|------|----------|--------|
| AR-F1 | Moderate | 2.4.3 Focus Order | keyboard | `index.tsx` `toggleItemExpansion` + `apiRef.setItemExpansion` | FIXED |
| AR-F2 | Minor | 4.1.2 Name, Role, Value | aria | `index.tsx` treeitem `aria-selected` | FIXED |

**AR-F1 — Focus lost when a collapsed subtree unmounts (MODERATE, WCAG 2.4.3) — FIXED.**
When an ancestor of the currently DOM-focused node is collapsed via a **chevron pointer-click**
(`handleIconClick` → `toggleItemExpansion`) or **programmatically**
(`apiRef.setItemExpansion({ isExpanded: false })`), the focused descendant's row (inside the
collapsed `role="group"`) is removed from the DOM and focus dropped to `<body>` with no
restoration. The keyboard `ArrowLeft` collapse path was already safe (focus is on the parent
being collapsed, which stays visible), and the roving-tabindex fallback guarantees Tab can
re-enter — but a real user who collapses a folder while a child row is focused lost their focus
position. **Fix:** a module-level `preserveFocusOnCollapse(itemId)` helper — called from BOTH
collapse choke points (`toggleItemExpansion` for chevron/content-click collapse, and the
imperative `setItemExpansion` for the programmatic path) **before** the collapse mutates state —
detects whether DOM focus currently lives inside the node's child group
(`#tree-group-<itemId>`) and, if so, moves focus to that node's own row (the group's
`previousElementSibling`, scope-safe across multiple trees). Because the ancestor row stays
visible after the collapse, focusing it first means it retains focus through the re-render, and
its existing `onFocus` handler keeps roving tabindex + `focusedItem` in sync. Pattern class
`focus-lost-on-unmount`. Pinned by two new `play` tests: `ChevronCollapsePreservesFocus`
(collapses via a programmatic `.click()` on the chevron, which — unlike a real pointer event —
does NOT run the browser's focus-fixup, so focus genuinely starts on the descendant) and
`ProgrammaticCollapsePreservesFocus` (collapses via `apiRef.setItemExpansion`, using a
`mousedown`-preventDefault button so the click never steals focus from the tree). Both assert
focus lands on the collapsed ancestor and **not** on `<body>`.

*Note on the earlier deferred wording:* the previous "Deferred" entry also listed the `*`
(expand-siblings) command as a focus-loss path. That was inaccurate — `expandSiblings` only ever
**adds** to the expansion set (`index.tsx` provider `expandSiblings`); it never collapses a node,
so it can never unmount a focused subtree. No fix is owed there. Only the chevron and programmatic
collapse paths were real, and both are now fixed.

**AR-F2 — Single-select over-announcement of `aria-selected` (MINOR, WCAG 4.1.2) — FIXED.**
The P2 fix handled the `disableSelection` case but a single-select tree (`multiSelect=false`,
selection enabled) still emitted `aria-selected="false"` on every unselected `treeitem`. The APG
Tree View pattern specifies that a single-select tree expose `aria-selected` **only on the
selected node** and omit it on the others (multi-select trees, by contrast, announce true/false
on every selectable node so selectability and the selected count are conveyed). **Fix:** the
`aria-selected` expression (`index.tsx`) is now three-way: omitted when `disableSelection`;
reflects `isSelected` (true/false) when `multiSelect` **or** `checkboxSelection` (a checkbox tree
shows a per-row checkable control, so every selectable row should announce its state); otherwise
(pure single-select) it is `isSelected || undefined` — present only on the selected node. Pattern
class `aria-state-single-select-redundant`. Pinned by the new `SingleSelectAriaSelected` play test
(only the selected node has `aria-selected`; all others omit it) and an extended `MultiSelection`
play test (all selectable nodes announce true/false) that pins the contrast.

### 1 — No arrow-key navigation (SERIOUS, WCAG 2.1.1) — FIXED
The old `handleKeyDown` only handled `Enter`, `Space`, `ArrowRight` (expand),
and `ArrowLeft` (collapse). The APG Tree View keyboard table was otherwise
unimplemented: **no `ArrowDown`/`ArrowUp`** to move between visible nodes, **no
`Home`/`End`**, `ArrowRight` on an already-open node did **not** move focus to
the first child, and `ArrowLeft` on a leaf/closed node did **not** move focus to
the parent. A keyboard user could not traverse the tree at all.
**Fix:** `handleKeyDown` (`index.tsx`) now implements the full table — Down/Up
(prev/next visible node), Home/End (first/last), Right (expand → else first
child), Left (collapse → else parent) — by reading the live, in-DOM-order set of
`[role="treeitem"]` elements from the enclosing `[role="tree"]` and moving DOM
focus. Parent navigation uses the context `parentMap`.

### 2 — No roving tabindex (SERIOUS, WCAG 2.4.3) — FIXED
Every treeitem rendered `tabIndex={0}` **and** the root `role="tree"` container
rendered `tabIndex={0}`, so a tree of N nodes created N+1 Tab stops — the
opposite of the APG single-tab-stop / roving-tabindex requirement.
**Fix:** exactly one node is now in the Tab sequence. A `tabbableItem` value is
computed on the provider (the focused item when it is visible, else the first
root item) and threaded through context; each treeitem is `tabIndex={0}` only
when it is the `tabbableItem` (and focusable), else `-1`. The redundant
`tabIndex={0}` was removed from the root `role="tree"` element. A new `onFocus`
handler on each row keeps the roving target and the visual focus state in sync
on Tab entry, arrow navigation, and click.

### 3 — Keyboard focus not reliably visible (SERIOUS, WCAG 2.4.7) — FIXED
`.item` sets `outline: none` and the focus ring was driven **only** by the JS
`data-focused` attribute (set from React state). A node receiving DOM focus via
Tab — before/without any JS focus-state update — showed **no** focus indicator.
**Fix:** added `.item:focus-visible` outline rules (light/dark/sacred) in
`TreeView.module.css` so keyboard focus is always visible independent of the JS
state.

### 4 — Missing `role="group"` on child containers (MODERATE, WCAG 1.3.1) — FIXED
The recursive children wrapper (`cssStyles.childrenGroup`) carried no role, so
assistive tech could not perceive the nested set that each parent owns.
**Fix:** added `role="group"` to the children wrapper `<div>` in `renderTree`.
**Follow-up (R1):** the group was a *sibling* of the parent treeitem, not a
descendant, and the parent had no `aria-owns` — so the APG parent→children
ownership was only *implied* by `aria-level`, not established. See R1 below.

### 5 — Motion ignores `prefers-reduced-motion` (MODERATE, WCAG 2.3.3) — FIXED
The sacred-theme `SacredBackground` canvas ran an **unconditional**
`requestAnimationFrame` loop (continuously drifting hieroglyph particles), and
the CSS hover slide/scale transforms + transitions had no reduced-motion guard.
**Fix:** `SacredBackground` now reads `matchMedia('(prefers-reduced-motion:
reduce)')` and, when set, paints a single static frame instead of animating; a
`@media (prefers-reduced-motion: reduce)` block in `TreeView.module.css` drops
the transitions and the hover `transform`s (matched to the guarded hover-rule
specificity so the reset actually wins).

### 6 — Incomplete tree ARIA: no set position/size (MINOR, WCAG 1.3.1) — FIXED
Nodes exposed `aria-level` but not `aria-setsize`/`aria-posinset`, so screen
readers announced depth but not "item X of Y".
**Fix:** `renderTree` passes `posInSet`/`setSize` to each `TreeItem`, rendered as
`aria-posinset`/`aria-setsize`.

### 7 — Decorative chevron svg exposed to AT (MINOR, WCAG 1.1.1) — FIXED
The `<ExpandMore>` chevron `<svg>` had no text alternative and was not hidden;
expand/collapse state is already conveyed by the treeitem's `aria-expanded`.
**Fix:** `aria-hidden="true"` is forwarded to the chevron svg at the
`<ExpandMoreIcon>` call site (the icon is purely decorative).

### 8 — Tree has no accessible name by default (MINOR, WCAG 4.1.2) — FIXED (passthrough + doc)
The root `role="tree"` had no `aria-label`/`aria-labelledby`. A generic default
would be wrong for every consumer, so the correct library behavior is a
consumer-supplied name. The existing `{...other}` spread already forwards
`aria-label` to the `role="tree"` element; this is now demonstrated and pinned by
the `WithAccessibleLabel` story (`getByRole('tree', { name: 'File browser' })`).
No code change required beyond verification; consumers should pass `aria-label`.

### 9 — Chevron `role="button"` is not keyboard-focusable (MINOR, WCAG 4.1.2) — FIXED
The expand/collapse chevron container was a `<div role="button" aria-label>` with
a click handler but no `tabIndex`/`onKeyDown`, so it was announced to assistive
tech as an operable button yet was not keyboard-focusable/operable. Making it a
*real* button would add an extra Tab stop per node and break the tree's roving
tabindex (the reason the initial pass deferred it). Because expand/collapse is
already fully owned by the treeitem row (Arrow keys + Enter/Space, state via
`aria-expanded`), the APG-correct shape is a **decorative** chevron.
**Fix (R2):** dropped `role="button"` + `aria-label` from the chevron container
and added `aria-hidden="true"`, so it is no longer a broken control exposed to
AT. The `onClick` stays as a redundant pointer convenience. See R2 below.

---

## Adversarial-review follow-ups — detail

### R1 — Parent→children ownership not actually established (MODERATE, WCAG 1.3.1) — FIXED
Adding `role="group"` (issue 4) was necessary but not sufficient: in `renderTree`
the group is rendered as a **sibling** of the parent `role="treeitem"` inside the
`React.Fragment`, and the parent carried no `aria-owns`. The APG Tree View pattern
requires each parent node to **contain or own** its child group; here the parent
set `aria-expanded="true"` but neither contained nor owned the group. (Kept it a
sibling on purpose — nesting the group *inside* the treeitem `<div>` would extend
the row's hover/selection box over the whole subtree.)
**Fix:** the child group `<div>` gets a stable `id` (`tree-group-<itemId>`) and
the parent treeitem gets `aria-owns={that id}` — but **only while expanded** (the
group is in the DOM), so the reference is never dangling. This re-parents the
group under the treeitem in the accessibility tree, establishing real ownership.
New internal (additive) `TreeItemProps.ownsGroupId`.

### R2 — Chevron exposed as a non-operable button (MINOR, WCAG 4.1.2) — FIXED
See issue 9 above. Chevron container: **removed** `role="button"` +
`aria-label`, **added** `aria-hidden="true"`. This is a deliberate markup change
that removes existing `role`/`aria` attributes; it is permissible here because
(a) it makes the element *semantically correct* (decorative, per the accessible-
by-default protocol), (b) those attributes were never part of the machine-test
selector contract (not `data-*`, not the `combobox` dropdown pattern), and
(c) the only conformant alternative — a real keyboard button — is fundamentally
incompatible with the tree's single-tab-stop roving tabindex. Expand/collapse
remains fully operable via the row (Arrow keys/Enter/Space + `aria-expanded`).

### R3 — `onItemFocus` did not fire on keyboard focus (MINOR, consistency) — FIXED
The roving-tabindex work set focus state directly in the row's DOM `onFocus`
handler (`context.setFocusedItem`), bypassing the documented `onItemFocus`
callback — so pointer focus (via `handleClick`) fired `onItemFocus` but arrow-key
/ Tab roving focus did not. `handleClick` additionally fired `onItemFocus`
**twice** (once via the `onFocus` prop, once via `context.onItemFocus`).
**Fix:** consolidated focus notification into a single source — the row's DOM
`onFocus` handler now both syncs focus state **and** fires `onItemFocus` (via the
`onFocus` prop), guarded to a genuine focus change on the row itself. `handleClick`
no longer fires focus callbacks (a click focuses the row first, so the DOM focus
event covers it). Result: exactly one `onItemFocus` per focus change, for pointer
**and** keyboard alike. The `renderTree` `onFocus` wrapper is now pure
consumer-notification; focus *state* is owned solely by the DOM handler.

### R4 — Chevron click was a dead no-op in default 'content' mode (MINOR, UX) — FIXED
`handleIconClick` called `stopPropagation()` (killing the row's `handleClick`)
but its expand guard only fired for `expansionTrigger==='iconContainer'`, so in
the default `'content'` mode a click directly on the chevron neither expanded nor
let the row handle it.
**Fix:** `handleIconClick` now toggles expansion whenever the node `hasChildren`,
in **both** expansion modes. Clicking the chevron toggles expand/collapse (without
selecting the row); clicking the row body still behaves per `expansionTrigger`.

### R5 — 'Full keyboard table' overstated; type-ahead + `*` absent (MINOR, APG) — FIXED
The required APG table (Enter/Space, Up/Down, Left/Right, Home/End) was complete,
but the **recommended** type-ahead and the **optional** `*` (expand all siblings)
interactions were not implemented — so "full APG keyboard table" overstated
coverage (not a WCAG failure).
**Fix:** implemented both rather than walk back the claim.
- **Type-ahead:** a printable character moves focus to the next visible node whose
  label begins with the accumulated typed string (shared buffer in a provider ref
  via new `context.appendTypeahead`, auto-clears after a 500 ms idle gap; a fresh
  single char searches from the next node so repeats cycle, a multi-char query
  refines from the current node).
- **`*`:** expands every sibling of the focused node that has children (new
  `context.expandSiblings`, batched through `setExpandedItems`).

---

## Hearing

No audio, `<audio>`/`<video>`, `AudioContext`, `navigator.vibrate`, or any
sound-conveyed information exists in this component (verified by grep of the whole
directory for `new Audio` / `AudioContext` / `<audio>` / `<video>` /
`navigator.vibrate` / `.play(`). The only media surface is the decorative
`<canvas>` particle overlay, which conveys no information — now `aria-hidden`
(P1). **No hearing-related issues.** (The canvas motion is addressed under
WCAG 2.3.3, issue 5.)

## Reading & screen reader

- Roles: `tree` → `treeitem` → `group` (group added, issue 4).
- States/props per node: `aria-selected` (on selectable trees only — omitted when
  `disableSelection`, P2), `aria-expanded` (only on parents), `aria-disabled`,
  `aria-level`, and now `aria-setsize`/`aria-posinset` (issue 6).
  Selection/expansion/disabled state each has a programmatic attribute in addition
  to color, so no state is color-only (WCAG 1.4.1 pass).
- The checkbox (checkbox-selection mode) is intentionally `aria-hidden="true"` +
  `tabIndex={-1}`; the treeitem's `aria-selected` is the authoritative selection
  semantic, so the visible checkbox is decorative. This is the correct pattern
  and was left unchanged.
- Focus is now always visible via `:focus-visible` (issue 3) in addition to the
  JS `data-focused` "current node" indicator.
- Full APG keyboard interaction implemented (issues 1, 2).
- Decorative chevron svg hidden from AT (issue 7); tree name via consumer
  `aria-label` (issue 8).

## SEO semantics

TreeView is an interactive client widget (`'use client'`), not primary crawlable
content, so heading-level / landmark / real-`<a>` concerns from the SEO checklist
do not apply here — there is no heading text, link, or list-of-content being
rendered for crawl. The labels are plain text nodes present in SSR output. The
ARIA tree roles are the correct machine-readable structure for this widget.
**No SEO-semantic changes required.**

## Fixes applied

All in `src/components/TreeView/` (owned):

- `index.tsx`
  - `handleKeyDown`: full APG keyboard table (Down/Up/Home/End, Right→expand-or-
    first-child, Left→collapse-or-parent) via live in-DOM treeitem ordering.
  - Roving tabindex: new `tabbableItem` memo on the provider + context field;
    treeitem `tabIndex` is `0` only for the single tabbable node, `-1` otherwise;
    new `onFocus` handler syncs roving + focus state.
  - Removed redundant `tabIndex={0}` from the root `role="tree"` element.
  - Children wrapper: added `role="group"`.
  - Treeitem: added `aria-setsize`/`aria-posinset` (fed by `renderTree`
    `posInSet`/`setSize`).
  - Chevron: `aria-hidden="true"` forwarded to the decorative `<ExpandMore>` svg.
  - `SacredBackground`: honors `prefers-reduced-motion` (single static frame,
    no rAF loop).
  - **(review follow-ups)** treeitem `aria-owns` → its child group's `id` while
    expanded (R1); chevron container made decorative — dropped `role="button"` +
    `aria-label`, added `aria-hidden="true"` (R2); focus notification
    consolidated into the row's `onFocus` so `onItemFocus` fires for keyboard
    focus too and exactly once per focus change (R3); `handleIconClick` toggles
    expansion in both expansion modes so a chevron click is never a no-op (R4);
    `handleKeyDown` type-ahead + `*` (expand siblings), backed by new
    `context.appendTypeahead` / `context.expandSiblings` (R5).
- `TreeView.module.css`
  - `.item:focus-visible` outline rules (light/dark/sacred).
  - `@media (prefers-reduced-motion: reduce)` block dropping transitions + hover
    transforms (specificity-matched to the guarded hover rules).

### Markup changes (per audit protocol)
- Root `<div role="tree">`: **removed** `tabIndex={0}` (roving tabindex now on
  the items). No `role`/`aria`/`data-*` removed.
- Children wrapper `<div role="group">`: **added** `role="group"`; **added** a
  stable `id` (`tree-group-<itemId>`) as the `aria-owns` target (R1).
- Treeitem `<div role="treeitem">`: `tabIndex` static-0 → roving; **added**
  `onFocus`, `aria-setsize`, `aria-posinset`; **added** `aria-owns` (set only
  while the node is an expanded parent) (R1).
- Chevron `<ExpandMoreIcon>` svg: **added** `aria-hidden="true"`.
- Chevron **container** `<div>`: **removed** `role="button"` + `aria-label`,
  **added** `aria-hidden="true"` — the deliberate decorative change (R2). These
  removed attributes were never part of the machine-test selector contract; see
  R2 detail for the justification.
- (Note: a concurrent a11y-lint pass added `data-component="TreeView"` to the
  root element; preserved as-is, not part of this audit's work.)

No public prop was renamed, removed, or retyped; all changes are additive
(new optional `TreeItemProps.posInSet`/`setSize`/`ownsGroupId` are internal;
new `TreeViewContextValue.appendTypeahead`/`expandSiblings` are internal to the
private context). The `data-testid`, `role="tree"`/`"treeitem"`/`"group"`,
`aria-*` (level/setsize/posinset/selected/expanded/disabled), and
`data-component`/`data-testid` selector contract is preserved. The **only**
removed `role`/`aria` are the chevron container's `role="button"`/`aria-label`
(R2) — non-selector, non-contract attributes on a now-decorative element.

## Stories updated

`TreeView.stories.tsx` — stories under the "Accessibility" section (Storybook
play + Chromatic baseline is this repo's only test layer):

- **`Accessibility/Keyboard Navigation`** (`KeyboardNavigation`) — asserts:
  `role="group"` present; `aria-level`/`aria-setsize`/`aria-posinset` on nodes;
  roving tabindex (one `tabindex=0`, follows focus); Down/Up/Home/End focus
  movement; Left collapses / Right re-expands the focused parent. **Extended
  (R1):** the expanded parent's `aria-owns` points at the owned `role="group"`
  (id match), and a collapsed node carries **no** `aria-owns`.
- **`Accessibility/With Accessible Label`** (`WithAccessibleLabel`) — passes
  `aria-label`, asserts `getByRole('tree', { name: 'File browser' })`.
- **`Accessibility/Focus Callback (Keyboard)`** (`FocusCallbackOnKeyboard`, new,
  R3) — `onItemFocus: fn()`; arrow-key roving to the second node asserts the spy
  was called with that node's id (i.e. `onItemFocus` fires on keyboard focus).
- **`Accessibility/Chevron (Decorative + Clickable)`**
  (`ChevronDecorativeAndClickable`, new, R2+R4) — asserts the chevron container
  has **no** `role` and is `aria-hidden`, the tree exposes **no** button, and a
  pointer click on the chevron in default `'content'` mode toggles expansion.
- **`Accessibility/Type-ahead & Expand Siblings`** (`TypeaheadAndExpandSiblings`,
  new, R5) — typing `p` moves focus to 'Personal'; pressing `*` on a root node
  expands its sibling roots that have children.
- **`Selection/Disabled Selection`** (`DisabledSelection`, extended, P2) — asserts
  **no** `treeitem` carries an `aria-selected` attribute while `disableSelection`
  is set, and that the tree is still keyboard-enterable (roving `tabindex=0`).
- **`Themes/Sacred`** (`SacredTheme`, extended, P1) — `play` test (via `waitFor`,
  since the canvas mounts in an effect) asserts the decorative `<canvas>` renders
  with `aria-hidden="true"`. Added `waitFor` to the `storybook/test` import.

## Deferred

**No WCAG-AA failures deferred.** The initial pass's two deferrals are resolved
(chevron made decorative — FIXED R2; chevron click no-op — FIXED R4), and the
second-pass P1/P2 findings are both fixed.

**One known follow-up (not a WCAG-AA failure, in-directory, owner-safe):**
- **`focus-lost-on-unmount`** — when a parent is collapsed via a chevron
  pointer-click, the `*` command, or `apiRef.setItemExpansion`, a descendant that
  currently holds DOM focus is unmounted (the collapsed child group is removed from
  the DOM), dropping focus to `<body>`. The *keyboard* collapse path (ArrowLeft)
  already keeps focus on the still-visible parent, and the roving-tabindex fallback
  (`tabbableItem` → first root, `index.tsx:1568-1580`) guarantees Tab can always
  re-enter, so keyboard-only users are unaffected. A fully robust fix would move
  focus to the collapsed ancestor whenever the focused node is about to unmount;
  it touches the expansion-state flow (`toggleItemExpansion` / the collapse
  handlers) and is left as a follow-up. Entirely within `src/components/TreeView/`
  (`index.tsx`) — no cross-file change owed.

**No fixes are owed in files outside `src/components/TreeView/`** — every issue
found (original, review follow-up, and second pass) had its root cause inside the
owned directory. No shared util, `Field`/`Shell`, `global.css`, or barrel change is
required.
