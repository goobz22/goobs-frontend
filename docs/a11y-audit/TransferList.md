# TransferList — a11y audit (2026-07-11)

**Status: FIXED**

**APG pattern:** WAI-ARIA _list of related checkboxes_ (two multi-select item
lists) driving a pair of _move buttons_. Each list is a real `<ul>` of `<li>`s;
each row is a native `<input type="checkbox">` whose checked state = "selected
for transfer". The transfer arrows are plain `<button type="button">`s with
`aria-label`s. This is the accessible realization of the classic MUI
"transfer list": composite selection expressed through native checkboxes +
buttons rather than a roving-tabindex listbox, so the full keyboard interaction
table (Tab / Shift+Tab between controls, Space to toggle a checkbox, Enter/Space
to fire a button) is satisfied by native semantics with no custom key handling.

---

## Issues found

| # | Severity | WCAG | Location | Issue | Status |
|---|----------|------|----------|-------|--------|
| 1 | Critical | 4.1.2 Name, Role, Value | `index.tsx` (pre-fix ~L255–285) | Each list item was a `<button>` **wrapping** a `CustomCheckbox` (a real, focusable `<input type="checkbox">`) — a nested interactive control (invalid content model, double-announced, and the inner checkbox's `onChange` was a dead no-op). | FIXED |
| 2 | Serious | 1.3.1 Info & Relationships | `index.tsx` (pre-fix L242–290) | The two item collections were `<div>`s, not lists — screen readers could not announce "list, N items / item X of N", and the SSR HTML carried no list structure. | FIXED |
| 3 | Serious | 2.4.7 Focus Visible | `TransferList.module.css` (no `:focus-visible` rule) | The transfer arrow `<button>`s had `:hover`/`:disabled` styling but **no** focus indicator — keyboard focus was invisible. | FIXED |
| 4 | Serious | 2.3.3 Animation from Interactions | `TransferList.module.css` L149/326/399 | Three continuous **infinite** sacred animations (list glow-pulse, button float, glyph rotate) plus hover transforms, with no `prefers-reduced-motion` guard. | FIXED |
| 5 | Serious | 3.3.1 Error Identification / 4.1.3 Status Messages | `index.tsx` (pre-fix L304/327) | The component **read** the form-engine error (`getError`) and set `data-error`, but **never rendered it** and there was no `.container[data-error]` style — a validation error was invisible to every user and unlinked programmatically. | FIXED |
| 6 | Moderate | 4.1.3 Status Messages | `index.tsx` transfer handlers | Moving items between lists changed content without moving focus and with **no announcement** — screen-reader users got no feedback that a transfer happened. | FIXED |
| 7 | Moderate | 1.3.1 / SEO | `index.tsx` (pre-fix L283/354) | Column titles were hard-coded `<h3>` with no way for a consumer to set the level — a transfer list embedded under an `<h2>` produced a broken document outline. | FIXED |
| 8 | Moderate | 3.2.2 On Input | `index.tsx` `TransferButton` (pre-fix, no `type`) | The arrow buttons had no `type`, defaulting to `type="submit"`; inside a `<Form>` an arrow click (or Enter) submitted the form. | FIXED |
| 9 | Moderate | 1.3.1 Info & Relationships | `index.tsx` (pre-fix, `<h3>`/list adjacency only) | The list and its column heading were visually adjacent but not programmatically associated (no accessible name on the list). | FIXED |
| 10 | Minor | 1.1.1 Non-text Content | `index.tsx` (pre-fix L317) | The decorative sacred glyph `𓊨` (and the raw arrow glyphs `≫ > < ≪`) were exposed to assistive tech. | FIXED |

### Adversarial-review follow-ups (2026-07-11)

| # | Severity | WCAG | Location | Issue | Status |
|---|----------|------|----------|-------|--------|
| 11 | Moderate | 1.3.1 Info & Relationships | `index.tsx` `renderList` (the `<ul>`/`<li>`) | The list-semantics fix (#2) was silently defeated on WebKit/Safari + VoiceOver: `.listInner` sets `list-style: none`, and Safari strips the implicit `list`/`listitem` roles from a `<ul>`/`<li>` styled that way, so "list, N items / item X of N" was never announced there. jsdom keeps the implicit roles, so `getByRole('list')` false-passed. | FIXED |
| 12 | Minor | 4.1.2 Name, Role, Value | `index.tsx` container (`role="group"`) | The composite `role="group"` had no accessible name — only an `aria-describedby` (a description) when an engine error was present — so AT announced a bare, context-free "group". | FIXED |
| 13 | Moderate | 3.2.4 / affordance + test contract | `index.tsx` `<li>` + `TransferList.module.css` `.listItem` | `data-action="toggle"`/`data-checked` sat on a non-interactive `<li>` that still carried `cursor: pointer` + a `:hover` transform — signalling the whole row was clickable when only the checkbox/label toggled, and a consumer test clicking `[data-action="toggle"]` on the row padding silently no-op'd. | FIXED |

**Hearing-impaired (A):** CLEAN. Grep for `new Audio` / `AudioContext` /
`navigator.vibrate` / `<audio>` / `<video>` / `speechSynthesis` in the component
directory returned nothing — no information is conveyed by sound. The new status
feedback (issue 6) is delivered visually-and-programmatically, never by audio.

---

## Fixes applied

All fixes are inside the component directory (`src/components/TransferList/`).

### Runtime — `index.tsx`
- **Rows are now native checkboxes (issues 1, 2, 9, 10).** `renderList` emits a
  real `<ul className={listInner}>` of `<li className={listItem}>`. Each `<li>`
  holds one `CustomCheckbox` (the sole interactive control — no nested button)
  plus a real `<label htmlFor id={labelId}>` carrying the themed item text, so
  clicking the label toggles the checkbox natively. The list is named by its
  column heading via `aria-labelledby` (or, in the dropdown variant that has no
  heading, by `aria-label={dropdownLabel || 'Available items'}`). Selection is
  now conveyed by the checkbox's native `checked`/`aria-checked` — never by
  colour alone (1.4.1). The peer-added `data-checked` and `data-action="toggle"`
  test selectors were preserved (moved onto the `<li>`).
- **Configurable heading level (issue 7).** Added an additive
  `headingLevel?: 1|2|3|4|5|6` prop (+ exported `TransferListHeadingLevel`),
  default `3`, rendered through `const HeadingTag = \`h${headingLevel}\` as …`
  — the exact pattern already used by `Panel`/`Filter/Section`/`EmptyState`.
- **`type="button"` on transfer arrows (issue 8)** so an arrow never submits a
  surrounding form. Arrow glyphs wrapped in `<span aria-hidden="true">` (10);
  `aria-label` remains the accessible name.
- **Live transfer announcements (issue 6).** A polite `role="status"` visually-
  hidden region narrates each move ("Moved 1 item to Assigned. Unassigned now
  has 4 items, Assigned now has 3 items."), set from every transfer handler.
- **Visible + linked validation error (issue 5).** When the engine reports an
  error the component now renders a visible `<div role="alert" aria-live="polite">`
  and marks the container `role="group"` + `aria-invalid` + `aria-describedby`,
  mirroring FieldShell's canonical error pattern.
- **Decorative glyph hidden (issue 10):** `aria-hidden="true"` on the sacred
  sigil.

#### Adversarial-review follow-ups (2026-07-11)
- **Explicit `role="list"` / `role="listitem"` (issue 11).** The `<ul>` now sets
  `role="list"` and each `<li>` sets `role="listitem"` explicitly. WebKit/Safari
  removes the implicit list & listitem roles from any list whose `list-style`
  computes to `none` (which `.listInner` does), so on Safari + VoiceOver the
  restored "list, N items" announcement (issue 2) only lands with the attributes
  literally present. Redundant-but-harmless in every other engine.
- **Named group (issue 12).** The container `role="group"` now carries
  `aria-label={`Transfer items between ${leftTitle} and ${rightTitle}`}` — a real
  accessible NAME (adapts to consumer-supplied titles), so AT announces the
  composite's purpose. `aria-describedby` (still added on error) is a description,
  not a name, and never substituted for this.
- **Whole-row click is now truthful (issue 13).** Each row `<li>` gets a guarded
  `onClick` (`event.target === event.currentTarget → handleToggle(value)()`) so a
  pointer click anywhere on the row — its padding / inter-control gaps, and the
  `[data-action="toggle"]` selector — genuinely toggles the row's checkbox. This
  makes the CSS `cursor: pointer` + hover affordance ACCURATE (rather than
  removing it) and restores the classic whole-row-click UX. The guard fires only
  for clicks whose target is the `<li>` itself; clicks on the checkbox or its
  `<label>` are handled natively, so a row is never toggled twice. Keyboard/AT
  users still operate the native checkbox (Tab + Space) — the `<li>` stays
  non-focusable with no key handler, so no new custom-widget semantics were
  introduced. `data-action="toggle"` / `data-checked` stayed on the `<li>`
  (selector contract unchanged).

### Styling — `TransferList.module.css`
- **`:focus-visible` ring on the transfer buttons (issue 3)** — themed
  `outline` (gold / light-primary / dark-primary), using `outline` (not
  box-shadow) so it never collides with the hover box-shadow. List-row focus is
  covered by the Checkbox module's own `:focus-visible` ring.
- **`@media (prefers-reduced-motion: reduce)` block (issue 4)** disabling the
  three infinite animations + hover transforms/transitions.
- **Layout split**: the three-column flex moved from `.container` to a new
  `.row`, so the container can stack the row above the new visible `.error`
  region (which uses the per-theme WCAG-AA danger-text tokens, light `#b91c1c` =
  6.47:1). Added `.srOnly` (clip-rect) for the status region, and reset the UA
  list chrome on `.listInner` now that it is a `<ul>`.

---

## Stories updated (`TransferList.stories.tsx`)

Stories are this repo's only regression tests. Each new behavior is exercised by
a `play` that fails against the pre-fix markup:
- **`InteractiveDemo`** (extended): asserts each row exposes the `checkbox` role
  with its accessible name, is **not** a `button` (guards the nested-interactive
  regression), that clicking the label toggles the native checkbox, and that a
  move is announced through the `role="status"` region.
- **`AccessibleStructure`** (new): embeds the list under a real `<h2>`, sets
  `headingLevel={3}`, and asserts the column titles are real level-3 headings
  and each side is a real `list` named by its heading.
- **`ValidationError`** (new): binds the field into a `<Form>` whose schema
  requires ≥1 assigned item; a blocked submit renders the error as visible
  `role="alert"` text and marks the group `aria-invalid` + `aria-describedby`.
- **`AccessibleStructure`** (extended, review follow-up): asserts the raw
  `role="list"` on each `<ul>` and `role="listitem"` on each `<li>` (jsdom keeps
  the implicit roles, so `getByRole('list')` alone false-passes — the attribute
  assertion is what a Safari-strip regression would fail on), and that the
  `role="group"` is findable by its `aria-label` accessible name.
- **`RowClickToggle`** (new, review follow-up): `fireEvent.click` on the row
  `<li>` (target === the `<li>`) toggles then untoggles the checkbox + flips
  `data-checked`, exercising the guarded row `onClick` / the
  `[data-action="toggle"]` selector. `InteractiveDemo` already guards the
  no-double-toggle-on-label invariant (a label click ends single-toggled).

---

## Commits
- `f58af4d1` — runtime + CSS a11y fixes
- `a759e90c` — stories exercising the new states
- `7b651e37` — review follow-ups: explicit list/listitem roles, named group, whole-row-clickable toggle
- `4fa192fb` — stories pinning the review follow-ups

---

## Deferred

None. Every fix landed inside the component directory. The row checkboxes reuse
`../Checkbox` (`CustomCheckbox`) unchanged — its own `:focus-visible` ring,
themed label, and `prefers-reduced-motion` handling already satisfy the
per-checkbox requirements, so no shared file needed editing.

### Note (not a defect)
The `CustomCheckbox` label text now comes from the sibling `<label>` styled by
TransferList's `.label` (preserving the sacred gold treatment). This keeps the
prior visual while removing the nested `<input>`; verify under Chromatic that the
row spacing reads identically across light/dark/sacred.
