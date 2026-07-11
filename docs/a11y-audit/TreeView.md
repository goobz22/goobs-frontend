# TreeView — a11y audit (2026-07-11)

**Status:** FIXED

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
| 4 | Moderate | 1.3.1 Info & Relationships | aria | `index.tsx` `renderTree` children wrapper | FIXED |
| 5 | Moderate | 2.3.3 Animation from Interactions | motion | `index.tsx` `SacredBackground` + `.module.css` transitions | FIXED |
| 6 | Minor | 1.3.1 Info & Relationships | aria | `index.tsx` treeitem (only `aria-level` present) | FIXED |
| 7 | Minor | 1.1.1 Non-text Content | reading | `index.tsx` `<ExpandMoreIcon>` svg | FIXED |
| 8 | Minor | 4.1.2 Name, Role, Value | aria | `index.tsx` root `role="tree"` (no name) | FIXED (passthrough + doc) |
| 9 | Minor | 4.1.2 Name, Role, Value | keyboard | `index.tsx` chevron `role="button"` | DEFERRED (known limitation) |

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

### 9 — Chevron `role="button"` is not keyboard-focusable (MINOR, WCAG 4.1.2) — DEFERRED (known limitation)
The expand/collapse chevron container is a `<div role="button" aria-label>` with
a click handler but no `tabIndex`/`onKeyDown`, so it is not reachable by a
keyboard-only user. It is **not removed** because (a) the ownership contract
forbids removing an existing `role`/`aria` attribute, and (b) making it a real
tab stop would add an extra Tab stop per node and break the tree's roving
tabindex. Crucially this is **not a functional barrier**: expand/collapse is
fully keyboard-operable at the treeitem level (Arrow keys + Enter/Space) and the
state is conveyed by `aria-expanded`, so the chevron is a supplementary pointer /
AT-click affordance only. See Deferred below for the recommended long-term shape.

---

## Hearing

No audio, `<audio>`/`<video>`, `AudioContext`, `navigator.vibrate`, or any
sound-conveyed information exists in this component (verified by grep of
`index.tsx`). The only media surface is the decorative `<canvas>` particle
overlay, which conveys no information. **No hearing-related issues.** (The canvas
motion is addressed under WCAG 2.3.3, issue 5.)

## Reading & screen reader

- Roles: `tree` → `treeitem` → `group` (group added, issue 4).
- States/props per node: `aria-selected`, `aria-expanded` (only on parents),
  `aria-disabled`, `aria-level`, and now `aria-setsize`/`aria-posinset`
  (issue 6). Selection/expansion/disabled state each has a programmatic
  attribute in addition to color, so no state is color-only (WCAG 1.4.1 pass).
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
- `TreeView.module.css`
  - `.item:focus-visible` outline rules (light/dark/sacred).
  - `@media (prefers-reduced-motion: reduce)` block dropping transitions + hover
    transforms (specificity-matched to the guarded hover rules).

### Markup changes (per audit protocol)
- Root `<div role="tree">`: **removed** `tabIndex={0}` (roving tabindex now on
  the items). No `role`/`aria`/`data-*` removed.
- Children wrapper `<div>`: **added** `role="group"`.
- Treeitem `<div role="treeitem">`: `tabIndex` static-0 → roving; **added**
  `onFocus`, `aria-setsize`, `aria-posinset`.
- Chevron `<ExpandMoreIcon>`: **added** `aria-hidden="true"` on its `<svg>`.
- (Note: a concurrent a11y-lint pass added `data-component="TreeView"` to the
  root element; preserved as-is, not part of this audit's work.)

No public prop was renamed, removed, or retyped; all changes are additive
(new optional `TreeItemProps.posInSet`/`setSize` are internal). The
`data-testid`, `role`, `aria-*`, and `data-component` selector contract is
preserved.

## Stories updated

`TreeView.stories.tsx` — two new stories under an "Accessibility" section:

- **`Accessibility/Keyboard Navigation`** (`KeyboardNavigation`) — `play` test
  that asserts: `role="group"` present; `aria-level`/`aria-setsize`/
  `aria-posinset` on nodes; roving tabindex (one `tabindex=0`, follows focus);
  Down/Up/Home/End focus movement; Left collapses / Right re-expands the focused
  parent.
- **`Accessibility/With Accessible Label`** (`WithAccessibleLabel`) — passes
  `aria-label` and asserts `getByRole('tree', { name: 'File browser' })`, pinning
  the accessible-name passthrough.

Both are the regression tests for the new behavior (Storybook play + Chromatic
baseline is this repo's only test layer).

## Deferred

**In-directory known limitation (issue 9) — no cross-file fix owed.**
Chevron `role="button"` (icon container in `index.tsx`, the
`<div className={cssStyles.iconContainer} role="button" aria-label=…>`) is not
keyboard-focusable. Recommended long-term shape (needs a design/API decision
outside this additive audit): make the chevron fully decorative
(`aria-hidden` + drop `role="button"`/`aria-label`) since the treeitem already
owns expand/collapse semantics and keyboard control — this removes an existing
aria attribute, which the ownership contract disallows here, so it is flagged
rather than applied.

**Secondary UX observation (not a11y-blocking):** in
`expansionTrigger='content'` mode, `handleIconClick` calls `stopPropagation()`
and then no-ops (its guard only fires for `expansionTrigger='iconContainer'`), so
a direct pointer click on the chevron in content mode neither expands nor lets
the row handle the click. Not a WCAG failure (keyboard + row-click both work);
noted for a future logic pass.

**No fixes are owed in files outside `src/components/TreeView/`** — every issue
found had its root cause inside the owned directory.
