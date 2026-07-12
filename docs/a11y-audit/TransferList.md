# TransferList — a11y audit (2026-07-11)

**Status: FIXED** — every issue resolved in-directory (17 of 17). The second
adversarial review's three findings all landed here at root cause: destination-
named transfer buttons (16), the `multipleSelection` combobox name fallback +
its first-ever play coverage (15, formerly deferred — now fixed in-component),
and a `forced-colors` / Windows High Contrast block (17). Nothing is deferred.

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

### Fresh owner-pass (2026-07-11, second owner)

| # | Severity | WCAG | Location | Issue | Status |
|---|----------|------|----------|-------|--------|
| 14 | Minor | 2.4.3 Focus Order / 2.4.7 Focus Visible | `index.tsx` transfer handlers + the four `<button>`s | Activating a transfer arrow can flip that same button to `disabled` — "move all right" empties the left list so its own precondition (`currentLeft.length === 0`) becomes true; the three other arrows disable the same way at their saturating move. When a **focused** element becomes disabled the browser blurs it and focus falls to `<body>`, so a keyboard user is silently dropped out of the control (every transfer button exhibits this at its saturating case). Issue 3 fixed focus *visibility* (the ring); it did not address focus *retention*. | FIXED |
| 15 | Minor | 4.1.2 Name, Role, Value | `index.tsx` `renderLeftColumn` (`multipleSelection`, L~471) | In the `multipleSelection` variant the category `Dropdown` is given `label={dropdownLabel \|\| ''}`; the empty string leaves the `role="combobox"` with only a weak content-derived name (its display text, "Select…") when a consumer omits `dropdownLabel`. The paired list already falls back to `aria-label="Available items"`, but the combobox got no equivalent fallback. Compounded: the whole `multipleSelection` variant had **no story/play coverage**. | FIXED |

### Second adversarial review (2026-07-11, review-fixes owner-pass)

| # | Severity | WCAG | Location | Issue | Status |
|---|----------|------|----------|-------|--------|
| 16 | Moderate | 1.3.3 Sensory Characteristics / 2.4.6 Headings & Labels | `index.tsx` (pre-fix L529/537/546/554) | The four transfer buttons were named SOLELY by spatial direction — hardcoded `aria-label="move all right"` / `"move selected right"` / `"move selected left"` / `"move all left"` — never referencing the destination LIST. A screen-reader user with no visual left/right mapping cannot tell, at point of activation, that "right" = the Assigned list; only the after-the-fact `role="status"` announcement disclosed it. The labels were also hardcoded, so they did NOT adapt to consumer `leftTitle`/`rightTitle`: in the `AccessibleStructure` story the group name ("Transfer items between Available and On team") and the button names ("right"/"left") disagreed. Not in the original 15-issue table. | FIXED |
| 17 | Minor | 1.4.1 Use of Colour / 1.4.11 Non-text Contrast / 2.4.7 | `TransferList.module.css` (no `@media (forced-colors: active)`) | No forced-colors / Windows High Contrast handling while sibling components (Switch, Field/Text, Field/Search) received it in the same sweep. In HC mode the checked-row selection tint (`.listItem[data-checked='true']` background + glow box-shadow) is dropped and the 4px accent left border repaints to the same system colour as every other row, collapsing the row-level "selected" cue. Mitigated (the native checkbox carries selection natively; the button focus outline auto-adapts) so this is a robustness/consistency gap, not a hard Level-A failure — but the auditor never evaluated forced-colors. | FIXED |

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

#### Fresh owner-pass (2026-07-11, second owner)
- **Keyboard focus retained across a transfer (issue 14).** A `buttonGroupRef`
  on the `.buttonGroup` div plus a `transferNonce` bumped by every transfer
  handler (`noteTransfer()`) drive a `useEffect` that, after each move, redirects
  focus to the **first still-enabled transfer button** when the just-activated
  button became disabled (jsdom keeps it as `activeElement`) or when focus
  already fell to `<body>` (real DOM blur-on-disable). A move always leaves the
  reciprocal "move all …" button enabled (the destination list is now
  non-empty), so focus never drops out of the control. `focus({ preventScroll:
  true })` keeps the viewport steady; `:focus-visible` stays keyboard-gated, so a
  pointer user gets no spurious ring from the programmatic focus. Purely additive
  — no prop, DOM, `data-*`/`role`/`aria` change; the machine-test selector
  contract is untouched.

#### Second adversarial review (2026-07-11, review-fixes owner-pass)
- **Destination-named transfer buttons (issue 16).** The four arrow buttons now
  build their `aria-label` from the destination LIST title rather than a spatial
  direction: `move all to ${rightTitle}` / `move selected to ${rightTitle}` /
  `move selected to ${leftTitle}` / `move all to ${leftTitle}`. This references
  the same titles the group's own name uses, so the group name and the control
  names can never disagree, and both adapt to consumer `leftTitle`/`rightTitle`.
  **Markup note:** the human-facing `aria-label` text changed on all four
  buttons; the direction-keyed `data-action` machine selectors
  (`move-all-right` / `move-selected-right` / `move-selected-left` /
  `move-all-left`, derived from the unchanged `name` prop) are **preserved** —
  the test contract is untouched.
- **`multipleSelection` combobox name fallback (issue 15).** The category
  `Dropdown` now gets `label={dropdownLabel || 'Category'}` (was `|| ''`), so
  when a consumer omits `dropdownLabel` the `role="combobox"` is named "Category"
  instead of the weak content-derived "Select…". This is the same fallback shape
  the paired list already uses (`|| 'Available items'`). **Markup note:** because
  `Field/Dropdown` derives both the visible FieldShell label AND the trigger's
  `aria-label` from `label`, this now renders a *visible* "Category" floating
  label in the no-`dropdownLabel` case (previously unlabeled) — an improvement
  (a visible label out-ranks an invisible one under WCAG) and consistent with the
  labeled case. The variant is now exercised end-to-end by the new
  `MultipleSelection` story, which had zero coverage before.

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
- **`@media (forced-colors: active)` block (issue 17)** — in Windows High
  Contrast the checked-row tint + glow box-shadow are dropped and the accent left
  border repaints to the shared system colour, so the row-level selection cue
  collapses. The block restores a system `highlight` outline on
  `.listItem[data-checked='true']` (`highlight` = the system colour that denotes
  a *selected* item, carrying the right meaning rather than a mere focus ring)
  and pins the transfer buttons' `:focus-visible` outline to the system focus
  colour. Selection is still carried non-visually by the native checkbox; this
  reinstates the row-level cue for parity with the normal-mode tint. Mirrors the
  outline-based forced-colors repair used across the library (Switch /
  Field/Search / SacredGlyphFrame / SignatureField); lowercase `highlight` per
  the repo's `value-keyword-case: lower` stylelint rule.

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
- **`FocusRetainedAfterTransfer`** (new, fresh owner-pass, issue 14): starts with
  a full left list and empty right list, clicks "move all to Assigned" (which
  disables itself), then asserts focus landed on the now-enabled "move all to
  Unassigned" — not on the disabled button and not on `<body>`. jsdom does not
  auto-blur a disabled element, so pre-fix the assertion fails with focus trapped
  on the disabled button; it also fails against a real browser's fall-to-`<body>`.

#### Second adversarial review (2026-07-11)
- **`InteractiveDemo` / `FocusRetainedAfterTransfer`** (updated, issue 16): now
  query the transfer buttons by their destination-derived names ("move selected
  to Assigned", "move all to Assigned" / "move all to Unassigned"); a regression
  to the old spatial `right`/`left` labels fails the lookups.
- **`AccessibleStructure`** (extended, issue 16): with custom titles
  `leftTitle="Available"` / `rightTitle="On team"`, asserts all four buttons are
  findable by their title-derived names ("move all to On team", "move selected to
  Available", …) so the button names AGREE with the group name, and asserts the
  old "move all right"/"move all left" names no longer exist.
- **`MultipleSelection`** (new, issue 15): renders the `multipleSelection`
  variant WITHOUT `dropdownLabel`, asserts the category combobox is findable by
  the "Category" fallback name, then drives the whole path end-to-end — opens the
  dropdown, picks a category, confirms the Available list populates, transfers an
  item to Assigned, and confirms the `role="status"` announcement. This variant
  had zero coverage before.
- **`AccessibilityForcedColors`** (new, issue 17): checks a row, then walks the
  CSSOM — scoped to TransferList's own hashed CSS-module class tokens so another
  component's block can't false-green it — to assert TransferList's
  `@media (forced-colors: active)` block exists and restores BOTH the checked-row
  selection cue (an outline/border on a `data-checked` rule) and the button focus
  outline. A play function can't flip the OS forced-colors preference, so this
  CSSOM presence gate is the regression anchor (the established Switch/Search
  pattern); the visual result is verified under Chromatic.

---

## Commits
- `f58af4d1` — runtime + CSS a11y fixes
- `a759e90c` — stories exercising the new states
- `7b651e37` — review follow-ups: explicit list/listitem roles, named group, whole-row-clickable toggle
- `4fa192fb` — stories pinning the review follow-ups
- `72a5f77f` — fresh owner-pass: retain keyboard focus when a transfer button self-disables (issue 14) + `FocusRetainedAfterTransfer` story
- `747309dc` — second review-pass: destination-named transfer buttons (16), `multipleSelection` combobox name fallback (15), `@media (forced-colors: active)` block (17)
- `427be482` — second review-pass stories: `MultipleSelection` + `AccessibilityForcedColors` + destination-named button assertions

---

## Deferred

**Nothing is deferred.** All three second-review findings (15, 16, 17) were
fixable at root cause inside this component directory and are FIXED above. Issue
15 (formerly deferred to `Field/Dropdown`) is now resolved in-component with the
`label={dropdownLabel || 'Category'}` fallback plus the new `MultipleSelection`
story that validates it — the review correctly noted the gap "still lives in THIS
component."

**Optional future refinement (NOT required, NOT a blocker).** `Field/Dropdown`
derives the combobox `aria-label` from its visible `label`, so naming the
category selector currently also renders a visible label. If a consumer ever
wants to name it *without* a visible label, `Field/Dropdown/Regular`
(`src/components/Field/Dropdown/Regular/index.tsx`, ~L233 where
`aria-label={label}` is emitted on the `<button role="combobox">`) could accept
an optional `ariaLabel?: string` and emit `aria-label={ariaLabel ?? label}`.
That file is outside this component's ownership and the current in-component fix
is fully accessible (a visible label out-ranks an invisible one under WCAG), so
this is a nicety, not a gap.

Everything landed inside the component directory. The row checkboxes reuse
`../Checkbox` (`CustomCheckbox`) unchanged — its own `:focus-visible` ring,
themed label, and `prefers-reduced-motion` handling already satisfy the
per-checkbox requirements, so no shared file needed editing.

### Note (not a defect)
The `CustomCheckbox` label text now comes from the sibling `<label>` styled by
TransferList's `.label` (preserving the sacred gold treatment). This keeps the
prior visual while removing the nested `<input>`; verify under Chromatic that the
row spacing reads identically across light/dark/sacred.
