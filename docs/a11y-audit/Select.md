# Select — a11y audit (2026-07-11)

**Status:** FIXED

**APG pattern:** Native HTML `<select>` form control (NOT a custom combobox). This
component wraps a real `<select>` element with `<option>` children (supplied as `MenuItem`),
so it inherits the browser's native listbox/combobox semantics, keyboard interaction
(Tab / Arrows / Home / End / typeahead / Enter / Escape), focus management, and screen-reader
support for free. This is the "semantic HTML first" ideal — no ARIA `role="combobox"` /
`role="listbox"` re-implementation is needed or wanted (adding roles to a native select would
be harmful). The native element is exposed with the implicit `combobox` role, which the
existing Storybook `InteractionTest` already keys on via `getByRole('combobox')`.

## Issues found

### 1. No visible keyboard-focus indicator — SERIOUS (WCAG 2.4.7 Focus Visible, 2.4.13 Focus Appearance) — FIXED
- **File:** `src/components/Select/Select.module.css:86` — the base `.select` rule sets
  `outline: none;` to suppress the native focus ring so the custom border reads cleanly, but
  **no replacement `:focus-visible` treatment existed anywhere in the module** (verified by
  grep: zero `:focus`/`:focus-visible` rules). A keyboard user tabbing to the control saw no
  focus indicator at all (hover changed the border colour, but focus did not).
- **Fix:** Added a `.select:focus-visible` rule with a `2px solid var(--select-border-focused)`
  outline at `outline-offset: 2px`, plus a `.root[data-error='true'] .select:focus-visible`
  override that switches the ring to `var(--select-error)` so it stays meaningful in the
  invalid state. Scoped to `:focus-visible` (keyboard / programmatic focus) so pointer clicks
  keep the clean borderless look. The pseudo-class raises specificity above the base
  `outline: none`, so the ring wins when keyboard focus is present.
- **Pattern:** `missing-focus-visible-style`

### 2. Error state not conveyed programmatically — SERIOUS (WCAG 4.1.2 Name/Role/Value, 3.3.1 Error Identification, 1.4.1 Use of Color) — FIXED
- **File:** `src/components/Select/index.tsx:99-101, 177-186` — `hasError` (from the `error`
  prop OR the bound form engine's error) drove only the CSS `data-error` attribute and the red
  border/text colour. Nothing set `aria-invalid` on the `<select>`, so assistive tech never
  announced the field as invalid — the error was conveyed by **colour alone** to sighted users
  and was **invisible** to screen-reader users.
- **Fix:** Added `aria-invalid={hasError ? true : undefined}` to the `<select>`, placed before
  the `{...props}` spread so a caller-supplied `aria-invalid` still wins (additive, back-compat).
  When there is no error the attribute is omitted entirely (not `aria-invalid="false"`).
- **Pattern:** `status-not-announced`
- **Note (out of scope, architectural):** the *visible* error **message text** is rendered by
  the surrounding `Field/Shell` (FieldShell), not by this primitive — Select only exposes the
  invalid state. `aria-invalid` is the correct in-primitive conveyance; associating the error
  text via `aria-describedby` is FieldShell's responsibility and lives outside this directory.

### 2b. Second error-styling path (`helperTextType:'error'`) not announced — MODERATE (WCAG 1.4.1 Use of Color, 4.1.2 Name/Role/Value) — FIXED (2026-07-11, adversarial-review follow-up)
- **File:** `src/components/Select/index.tsx:166, 195` — the Issue-2 fix closed the boolean/engine
  `hasError` path but **not** the *second, independent* error-styling path. `hasHelperError =
  styles?.helperTextType === 'error'` (index.tsx:166) paints a red "this field is invalid" border
  via CSS (`Select.module.css` `.root[data-helper-error='true'] .outlined/.standard { border-*-color:
  var(--goobs-danger) }`), yet `aria-invalid` keyed only on `hasError` (which excludes
  `hasHelperError`). So a Select with `styles={{ helperTextType:'error' }}` and no `error` prop
  showed the invalid border **by colour alone** with zero programmatic conveyance. The state is
  reachable and exercised standalone by the `ErrorState` story (`Select.stories.tsx:212`).
- **Fix:** OR'd `hasHelperError` into the condition —
  `aria-invalid={hasError || hasHelperError ? true : undefined}` (index.tsx:195). Both red-border
  invalid paths now announce; a caller-supplied `aria-invalid` still wins (set before `{...props}`);
  a select with neither signal still omits the attribute entirely (never `aria-invalid="false"`).
- **Also (visual coherence):** extended the invalid-state focus ring so the `data-helper-error`
  path switches the `:focus-visible` outline to `var(--select-error)` too — matching the
  established Issue-1 principle that the keyboard focus ring "stays meaningful in the invalid
  state" (`Select.module.css` — added `.root[data-helper-error='true'] .select:focus-visible`
  to the existing `data-error` focus-ring rule). Additive, no attribute/markup removed.
- **Pattern:** `status-not-announced`

### 3. Animated transition ignores reduced-motion preference — MINOR (WCAG 2.3.3 Animation from Interactions) — FIXED
- **File:** `src/components/Select/Select.module.css:88` — `.select` carries
  `transition: all 0.2s ease;` (animates the hover/focus border-colour shift) with no
  `@media (prefers-reduced-motion: reduce)` guard.
- **Fix:** Added a `@media (prefers-reduced-motion: reduce)` block setting `.select { transition: none; }`.
  State changes still apply instantly; only the animation is dropped for users who opt out.
- **Pattern:** `missing-reduced-motion`

## Hearing

No audio, `<audio>`/`<video>`, `AudioContext`, `new Audio`, or `navigator.vibrate` usage
(grep-verified). No information is conveyed by sound. **Nothing to fix** — WCAG 1.2.x / 1.4.2
N/A for this component.

## Reading & screen reader

- **Native semantics (strong):** real `<select>` + `<option>` — full native keyboard model,
  focus management, and typeahead handled by the browser. The implicit `combobox` role is
  correct; no ARIA roles were added or needed.
- **Accessible name:** this low-level primitive does not hardcode a label (it cannot invent
  one). `aria-label` / `aria-labelledby` / `aria-describedby` all pass through the
  `{...props}` spread (the interface extends `React.SelectHTMLAttributes<HTMLSelectElement>`),
  so consumers — and the `Field/Shell` wrapper — supply the name. **No action** (correct for a
  composable primitive); documented here so consumers know the responsibility.
- **Required:** the native `required` attribute passes through `{...props}` and is
  programmatically exposed by the browser. **No action.**
- **Disabled:** uses the native `disabled` attribute (fully programmatic), not `aria-disabled`.
  Correct — preserves the machine-test contract (FieldShell removes `aria-disabled` on enable;
  this primitive never emits `aria-disabled="false"`).
- **Decorative arrow:** the custom `▼` arrow `<div>` is correctly `aria-hidden="true"`
  (`index.tsx:195`) and `pointer-events: none`, so it is not announced and does not intercept
  clicks. **No action.**
- **Error state:** now announced via `aria-invalid` for **both** invalid paths — the boolean/engine
  `hasError` (Issue 2) and the `helperTextType:'error'` styling path (Issue 2b).
- **Focus visibility:** now provided via `:focus-visible` (Issue 1).

## SEO semantics

- Renders real `<select>`/`<option>` (via `MenuItem`) — crawlable, SSR-present semantic form
  markup. No `onClick` divs, no client-only injection of the control or its options.
- The component *is* a form control, not a heading/landmark/list/table/link, so the
  heading-level / landmark / `<a href>` checklist items are **N/A**.
- The decorative arrow is a presentational glyph correctly hidden from the a11y tree.
- **Nothing to fix.**

## Fixes applied

1. `Select.module.css` — added `.select:focus-visible` ring (+ error-colour override) restoring
   a visible keyboard-focus indicator that `outline: none` had removed.
2. `index.tsx` — added `aria-invalid={hasError ? true : undefined}` to the native `<select>` so
   the error state is announced to assistive tech and not conveyed by colour alone.
3. `Select.module.css` — added `@media (prefers-reduced-motion: reduce)` disabling the
   `transition` for users who opt out of motion.
4. `index.tsx` — OR'd `hasHelperError` into the `aria-invalid` condition
   (`aria-invalid={hasError || hasHelperError ? true : undefined}`) so the *second* error-styling
   path (`helperTextType:'error'`) is announced, not just the boolean/engine `hasError` path
   (Issue 2b — adversarial-review follow-up).
5. `Select.module.css` — extended the invalid-state `:focus-visible` error-colour override to the
   `data-helper-error` path so the keyboard focus ring stays meaningful in that invalid state too.

All changes are additive and preserve the public API and the machine-test selector contract
(`data-component="Select"`, `data-field-name`, `data-error`/`data-filled`/`data-disabled`,
implicit `combobox` role). No prop was renamed, removed, or retyped; no existing `data-*`,
`role`, or `aria-*` attribute was removed.

## Stories updated

Added to `Select.stories.tsx` (Storybook stories are this repo's only regression tests):
- **`KeyboardFocus` ("Keyboard Focus (a11y)")** — `play` fn tabs to the control and asserts
  `toHaveFocus()`, exercising keyboard reachability (WCAG 2.1.1) and the new `:focus-visible`
  ring (visible in the Chromatic baseline when focused).
- **`ErrorAnnounced` ("Error Announced (aria-invalid)")** — `play` fn asserts **both** error
  paths expose `aria-invalid="true"` (the boolean `error` prop AND the
  `styles.helperTextType:'error'` styling path) while the sibling valid select has **no**
  `aria-invalid` attribute, pinning the programmatic error conveyance for both red-border paths
  (WCAG 1.4.1 / 4.1.2). Extended 2026-07-11 to add the `helperTextType:'error'` case — this
  assertion **fails against the pre-fix code** (the helper-error select carried no `aria-invalid`)
  and passes after Issue 2b's fix, so it is the regression gate for the class.

Existing `InteractionTest` (native combobox role + controlled value) remains green and
continues to validate the native semantics.

## Deferred

None inside this component. One cross-component observation recorded for context only (no
change requested in a file I do not own):
- The **visible error message text** and its `aria-describedby` association to the control are
  the responsibility of `src/components/Field/Shell` (FieldShell), which is outside this
  directory. Select correctly exposes only the invalid *state* via `aria-invalid`; the
  describedby linkage should be verified in the FieldShell audit, not here.
