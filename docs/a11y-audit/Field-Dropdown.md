# Field/Dropdown — a11y audit (2026-07-11)

**Status:** FIXED (all in-directory defects fixed) — 2 items **deferred**
(D1 root-caused in `Field/Shell`, D2 a cross-cutting listbox-structure decision
that is load-bearing for the ThothOS Playwright contract and needs an owner call).

**Component:** `src/components/Field/Dropdown/*` — four select-style sub-fields.
Three (`Regular`, `SearchableSimple`, `MultiSelect`) compose inside the shared
`FieldShell` (label / helper / error / theme chrome) via a render-prop and bind
through `useFieldBinding`; the fourth (`SearchableHistory`) is a bespoke
navigation/search widget that renders its own chrome (no FieldShell).

| Sub-field | File | Shape |
|---|---|---|
| Regular | `Regular/index.tsx` | single-select; `button[role="combobox"]` + inline (absolute) `[role="listbox"]` of `button[role="option"]` |
| SearchableSimple | `SearchableSimple/index.tsx` | single-select with a filter input; body-portalled `[role="listbox"]`, focus moves to the search input |
| SearchableHistory | `SearchableHistory/index.tsx` | navigation search (`input[role="combobox"]` + Overview/History tabs); body-portalled `[role="listbox"]`; persists history to localStorage |
| MultiSelect | `MultiSelect/index.tsx` | multi-select chips; `div[role="combobox"]` + body-portalled `[role="listbox"][aria-multiselectable]` of checkbox options |

The **headline finding is in MultiSelect**: its arrow-key roving highlight was
half-implemented — the `activeOptionId`/`optionDomId` values were computed but
never attached to the DOM (no `aria-activedescendant`, no option `id`, no
`data-active`) and the `.option.active` CSS rule + the trigger's `:focus-visible`
ring did not exist. The dead `activeOptionId` was even an active `bun lint`
failure (`@typescript-eslint/no-unused-vars`), confirming the wiring was never
finished. The other three variants had received the full a11y treatment in a
prior pass; MultiSelect had not, and had **no** interaction/a11y stories at all.

## APG patterns

- **All four → WAI-ARIA APG "Combobox" (select-only / list-filter variants),
  keyboard model 1.2** — DOM focus stays on the combobox (or, for the two search
  variants, on the filter input) while the Arrow keys rove a highlight through a
  `[role="listbox"]` of `[role="option"]`, exposed via `aria-activedescendant`.

  | Key | Action | Where |
  |---|---|---|
  | Enter / Space / ArrowDown / ArrowUp (closed) | open the listbox | each `onKeyDown` |
  | ArrowDown / ArrowUp | rove highlight (wraps) | `Shell/keyboard.ts` `useArrowKeyNav` |
  | Home / End | first / last option | `useArrowKeyNav` |
  | Enter / Space (open) | activate highlighted option (select; MultiSelect toggles & stays open) | `useArrowKeyNav` `onActivate` |
  | Escape | close + restore focus to trigger | `Shell/keyboard.ts` `useEscape` |

  Home/End/Arrow/Enter/Space all resolve in the shared `useArrowKeyNav`
  (`Shell/keyboard.ts:79-125`). The listbox/option roles, `aria-expanded`,
  `aria-controls`, `data-action`, and the scroll-reposition behavior (the two
  portalled search variants + MultiSelect anchor and reposition their menu on
  scroll/resize rather than dismissing) are the deliberate, load-bearing ThothOS
  Playwright contract and were **preserved unchanged**.

## Issues found

### 1. MultiSelect roving highlight was invisible to assistive tech — FIXED
- **Severity:** serious · **WCAG:** 4.1.2 Name/Role/Value (A), 2.1.1 Keyboard (A) · **Pattern:** `missing-keyboard-arrow-nav`
- **Where:** `MultiSelect/index.tsx` — `activeOptionId`/`optionDomId` were built
  (`:248-251`) but the trigger carried **no** `aria-activedescendant` and the
  option `<button>`s carried **no** `id` and **no** `data-active`.
- **Failure:** a keyboard user arrowing through the options moved an internal
  `activeIndex`, but nothing was exposed — a screen reader announced no active
  option and could not track the highlight; the dead `activeOptionId` also failed
  `bun lint`. The three sibling variants all wire this; MultiSelect did not.
- **Fix:** added `aria-activedescendant={activeOptionId}` to the
  `div[role="combobox"]` trigger (`MultiSelect/index.tsx:261`), and
  `id={optionDomId(index)}` (`:359`) + `{...(isActive && { 'data-active': 'true' })}`
  (`:363`) to each option. AT now announces the active option as the user arrows;
  this also consumes the previously-dead variables, clearing the lint error.

### 2. MultiSelect roving highlight had no visual treatment — FIXED
- **Severity:** serious · **WCAG:** 2.4.7 Focus Visible (AA) · **Pattern:** `missing-focus-visible-style`
- **Where:** `MultiSelect/MultiSelect.module.css` — the markup applied a
  `.active` class to the arrow-key-highlighted option, but **no `.option.active`
  rule existed**. Because DOM focus stays on the trigger, that class is the
  option's *only* possible highlight — so keyboard navigation showed nothing.
- **Fix:** added `.option.active` (`:169`) with an inset outline + subtle
  background, plus light (`:277`) and dark (`:358`) theme variants, mirroring the
  sibling variants' `.option.active` rules (distinct from pointer `:hover` and the
  persistent `.selected` row).

### 3. MultiSelect trigger had no designed keyboard-focus ring — FIXED
- **Severity:** moderate · **WCAG:** 2.4.7 Focus Visible (AA) · **Pattern:** `missing-focus-visible-style`
- **Where:** `MultiSelect/MultiSelect.module.css` — the trigger is a focusable
  `div[role="combobox"]` (`tabIndex={0}`). The intended focus treatment lived in a
  `.chipContainer.focused` class that the TSX **never applies**, leaving keyboard
  focus reliant on the faint/inconsistent UA default outline while the three
  sibling triggers each have a `:focus-visible` ring.
- **Fix:** added `.chipContainer:focus-visible` (sacred `:66,:77`; light `:226,:231`;
  dark `:307,:312`) reusing the designed border/box-shadow ring plus an explicit
  2px outline, matching the sibling variants.

### 4. SearchableHistory error state was color-only + not programmatic — FIXED
- **Severity:** moderate · **WCAG:** 1.4.1 Use of Color (A), 3.3.1 Error Identification (A), 4.1.2 (A) · **Pattern:** `color-only-state`
- **Where:** `SearchableHistory/index.tsx` — `styles.helperTextType === 'error'`
  (`isError`) reddened the border/label/footer via CSS only; the
  `input[role="combobox"]` never received `aria-invalid`, so the invalid state was
  conveyed by color alone and was invisible to screen readers.
- **Fix:** added `aria-invalid={isError || undefined}` to the combobox input
  (`SearchableHistory/index.tsx:368`). (`aria-describedby`→helper was already
  wired.)

### 5. SearchableHistory error message was not announced — FIXED
- **Severity:** minor · **WCAG:** 4.1.3 Status Messages (AA) · **Pattern:** `status-not-announced`
- **Where:** `SearchableHistory/index.tsx` — the footer region holds the
  validation message in the error state but was a plain `<div>` with no live-region
  semantics, so it was never announced when validation flipped.
- **Fix:** the footer now becomes `role="alert"` + `aria-live="polite"` **only**
  when `isError` (`SearchableHistory/index.tsx:554`), matching FieldShell's own
  error-region pattern (`Shell/index.tsx:412-413`). Plain helper text stays silent.

### 6. SearchableHistory arrow rotation ignored reduced-motion (+ file had no reduced-motion guard) — FIXED
- **Severity:** minor · **WCAG:** 2.3.3 Animation from Interactions (AAA) · **Pattern:** `missing-reduced-motion`
- **Where:** `SearchableHistory/index.tsx` — the disclosure arrow's
  `transition: 'transform 0.3s'` was an **inline** style on the icon, which a CSS
  `@media (prefers-reduced-motion)` query cannot reach; and
  `SearchableHistory.module.css` (unlike the other three variants) had **no**
  reduced-motion block at all despite several `transition: all 0.2s` rules.
- **Fix:** moved the rotation onto a wrapper `<span className={styles.toggleArrow}
  data-open>` (`index.tsx:424`), with the transition + rotated end-state now in CSS
  (`SearchableHistory.module.css:145,151`); added a
  `@media (prefers-reduced-motion: reduce)` block (`:358`) that neutralizes the
  arrow, label, search-box, tab, and item transitions. State end-points are kept
  as static indicators.

## Hearing (WCAG 1.2.x, 1.4.2)

**CLEAN.** Grepped the whole `Field/Dropdown` tree for `Audio` / `AudioContext` /
`<audio>` / `<video>` / `navigator.vibrate` — none. Open/close, selection,
validity and the empty/"no results" states are conveyed visually **and**
programmatically (`aria-expanded`, `aria-selected`, `aria-invalid`,
`role="status"` empty regions), never by sound. Nothing to fix.

## Reading & screen reader (1.1.1, 1.3.1, 1.4.1, 2.1.x, 2.4.x, 3.3.x, 4.1.2, 4.1.3)

- **Accessible name:** the three FieldShell variants get a real
  `<label htmlFor={inputId}>` (`Shell/index.tsx:395`); SearchableHistory renders
  its own `<label htmlFor={inputId}>` (`SearchableHistory/index.tsx:334`).
  Icon-only / decorative bits are handled: the arrow chevrons are `aria-hidden`
  (Regular `:261`, MultiSelect icon-wrapper `aria-hidden`), the SearchableHistory
  toggle arrow button carries `aria-label="Toggle options"`, and the MultiSelect
  option checkboxes are `aria-hidden` decoration (selection state rides on
  `aria-selected`, not the checkbox).
- **Semantic HTML / roles:** real `button[role="combobox"]` (Regular,
  SearchableSimple), `input[role="combobox"]` (SearchableHistory), and — where a
  focusable non-button container is required for the chip layout —
  `div[role="combobox"][tabIndex=0]` (MultiSelect). Options are real
  `button[role="option"]` (or `div[role="option"]` rows in SearchableHistory) with
  `aria-selected`.
- **Combobox states/props:** `aria-haspopup="listbox"`, `aria-expanded`,
  `aria-controls`→listbox, and now `aria-activedescendant` on **all four**
  (MultiSelect fixed here). Listboxes carry `aria-labelledby` back to the
  combobox; MultiSelect adds `aria-multiselectable="true"`.
- **Keyboard:** full APG table via `useArrowKeyNav` + open-on-Arrow/Enter/Space +
  `useEscape` (close + focus restore). Home/End included.
- **Focus visible:** now present on all four — Regular/SearchableSimple/MultiSelect
  triggers via `:focus-visible` rings (MultiSelect fixed here); SearchableHistory
  via `.searchBox:focus-within` border, and its tab/toggle/clear buttons keep the
  UA outline (none set `outline:none`).
- **Roving highlight visible:** `.option.active` (Regular/SearchableSimple/
  MultiSelect — MultiSelect fixed here) and `.item[data-active]` (SearchableHistory)
  all render a distinct highlight.
- **Forms / error / required:** the three FieldShell variants get
  `aria-invalid` + `aria-describedby` + `aria-required` from `inputAriaProps`
  (`Shell/index.tsx:345-349`) with a `role="alert"`+`aria-live="polite"` error
  region; SearchableHistory now matches (`aria-invalid` fix 4 + live error fix 5).
- **Color-alone (1.4.1):** selected = `aria-selected` + background + (MultiSelect)
  a chip; active = `data-active` + outline; error = `aria-invalid` + text + red
  border; disabled = native `disabled`/`aria-disabled` + dimming. No state relies
  on color alone.
- **Dynamic updates announced:** the "No options" / "No results" empty regions use
  `role="status"` + `aria-live="polite"` (Regular `:277-280`, SearchableSimple
  `:369-373`); SearchableHistory's error message is now a live `role="alert"`.

## SEO semantics (Next.js SSR)

**CLEAN.** These are form controls, not headings / landmarks / links, so no
`<h1-6>`/`headingLevel`, `<nav>`, `<ul>`, `<table>`, or `<a href>` markup applies.
Each SSRs its real combobox + `<label>`; options render server-side inside their
listbox (the three portalled listboxes mount client-side only while **open**,
which is correct — a closed menu is not primary content). No styled-div-as-heading,
no onClick-div-as-link, no client-only injection of primary content. No SEO/semantic
markup change applicable.

## Motion (WCAG 2.3.3)

All four `*.module.css` now carry a `@media (prefers-reduced-motion: reduce)`
block neutralizing the chevron rotation and control transitions (Regular
`:414`, SearchableSimple `:478`, MultiSelect `:365`, SearchableHistory `:358` —
the last added in fix 6). The SearchableHistory arrow's formerly-inline transition
is now CSS-driven so the guard reaches it. Rotated/active end-states are retained
as static indicators.

## Fixes applied

1. MultiSelect: wired `aria-activedescendant` on the trigger + `id`/`data-active`
   on options (also clears the dead-variable lint error) — WCAG 4.1.2 / 2.1.1.
2. MultiSelect: added `.option.active` roving-highlight rule (sacred/light/dark) —
   WCAG 2.4.7.
3. MultiSelect: added `.chipContainer:focus-visible` ring (sacred/light/dark) —
   WCAG 2.4.7.
4. SearchableHistory: `aria-invalid` on the combobox in the error state — WCAG
   1.4.1 / 3.3.1 / 4.1.2.
5. SearchableHistory: error footer becomes live `role="alert"` when in error —
   WCAG 4.1.3.
6. SearchableHistory: moved the arrow rotation to a CSS wrapper + added a
   `prefers-reduced-motion` block — WCAG 2.3.3.

Commits: `12a4ba7b` (MultiSelect index+css+stories), `9e964ee3` (SearchableHistory
index+css+stories). `bun lint:file` clean on every edited `index.tsx` and
`*.stories.tsx`.

## Stories updated

- **MultiSelect → `KeyboardArrowNavigation`** (new `play`, `storybook/test`) — the
  regression baseline for fixes 1–2. Opens via ArrowDown, asserts the portalled
  `role="option"` rows gain `data-active` and the combobox points
  `aria-activedescendant` at the active option's `id` as the highlight roves, and
  that Enter toggles the option `aria-selected` while the multi-select menu stays
  open. This exact assertion fails against the old unwired markup. (MultiSelect had
  **no** play stories before this pass.)
- **SearchableHistory → `ErrorState`** (extended with a `play`) — asserts the
  combobox now exposes `aria-invalid="true"`, that the message region is a
  `role="alert"` announcing the text, and that `aria-describedby` resolves to that
  same region — the regression guard for fixes 4–5.

(CSS-only behaviors — the new `.option.active`/`:focus-visible` rings and the
reduced-motion block — are not JSDOM-assertable; they are covered by the existing
Chromatic visual baseline plus the `data-active`/`aria-*` assertions above.)

## Deferred

### D1. Select-only combobox has no printable-character type-ahead (root cause: Field/Shell)
- **Severity:** minor · **WCAG:** none failed — APG-*recommended* for a select-only
  combobox, not required · **Pattern:** `missing-typeahead`
- The shared `useArrowKeyNav` (`Shell/keyboard.ts:79-125`) implements Arrow/Home/
  End/Enter/Space but not type-ahead (typing "j" to jump to the next option
  starting with "j"). The two search variants cover this via their filter input;
  the **Regular** select-only combobox has no such affordance.
- **Suggested change (Shell):** add an optional printable-character buffer to
  `useArrowKeyNav` (accumulate keys within a ~500ms window, move `activeIndex` to
  the first option whose label matches) gated behind an opt-in option so the
  search variants are unaffected. Additive, back-compat. Cannot be added inside
  `Field/Dropdown` without duplicating the shared keyboard hook (which
  `Field/Shell` owns).

### D2. Filter input / tabs nested inside `role="listbox"` (cross-cutting contract decision)
- **Severity:** minor · **WCAG:** 1.3.1 / 4.1.2 (A) — ARIA "required owned elements"
  (a `listbox` should own only `option`/`group`) · **Pattern:** `invalid-listbox-owned-element`
- SearchableSimple portals its search `<input>` **inside** the
  `div[role="listbox"]` (`SearchableSimple/index.tsx:330-365`), and
  SearchableHistory nests the Overview/History **tab buttons** + Clear-History
  button inside its `div[role="listbox"]` (`SearchableHistory/index.tsx:429-535`).
  Strictly, a listbox should not own a textbox/button; some AT may miscount or
  mis-announce. In practice the `aria-activedescendant` pattern keeps the options
  navigable, so this is a spec-purity deviation rather than a functional blocker.
- **Why deferred (not fixed here):** the portalled `[role="listbox"]` +
  `[role="option"]` structure is the **explicit, load-bearing ThothOS Playwright
  selector contract** ("preserve … portalled `[role="listbox"]`/`[role="option"]`").
  The correct fix restructures the DOM (e.g. the listbox wraps only the options,
  with the filter input / tabs as *siblings* linked via `aria-controls`) — a
  cross-variant change that would alter the mandated markup and must be an owner
  decision, not a unilateral in-directory edit. Recorded here for that owner.

**Considered and left (not a defect):** the **Regular** trigger always sets
`aria-label={label}` (`Regular/index.tsx:233`), so a screen reader may announce
only the label and not the selected value on the collapsed combobox, whereas the
search variants drop `aria-label` once a value is present so the value (button
content) is announced. This is a deliberate, reviewed naming choice that is also
load-bearing for `getByRole('combobox', { name })` queries; changing the
accessible-name computation risks regressing both AT behavior and the test
contract, so it was intentionally **not** altered. Noted for a future consistency
pass if desired.
