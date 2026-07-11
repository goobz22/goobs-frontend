# Field/Date — a11y audit (2026-07-11)

**Status:** PARTIAL (all in-directory issues fixed; one Shell-rooted edge case deferred)

> **Re-audit note (2026-07-11, second pass):** the first pass fixed issues #1–#4 below and
> *deferred* the end input's `aria-describedby` as needing a `Field/Shell` change. This pass
> found it is fixable **entirely within `DateRange/index.tsx`** and fixed it (issue #5). The
> only remaining item is a genuine form-engine edge case (see *Deferred*).

**Scope:** the composite `Field/Date` area — two sub-fields:
- `src/components/Field/Date/DateField` — a single `<input type="date">`.
- `src/components/Field/Date/DateRange` — a paired start/end `<input type="date">` range.

Both render their native date input(s) through the shared **`Field/Shell`**
(`FieldShell` + `useFieldBinding`), which is owned by a later serial pass and was
**not modified** here. Anything whose root cause is in Shell is listed under *Deferred*.

## APG pattern

Not a custom widget pattern — these use the **native HTML date input** (`<input type="date">`),
which is the semantically correct, keyboard-complete, screen-reader-supported control. The
accessibility contract is therefore the **WAI-ARIA form-field** contract, delivered by
`FieldShell`:

- real `<label htmlFor>` ↔ `id` association (accessible name),
- `aria-required` from the required flag,
- `aria-invalid` + `aria-describedby` → a `role="alert"` / `aria-live="polite"` helper region
  when an error is present.

`DateRange` additionally composes two related controls into one logical unit, so it takes on the
**grouped-controls** shape (`role="group"` + accessible name), the same pattern the repo already
uses for multi-input fields (`ConfirmationCodeInput`, `FieldGrid`).

No dialog/combobox/listbox/menu is involved, so no focus-trap / arrow-key / Escape table applies
here — native date-picker keyboard behaviour is the browser's.

## Issues found

| # | Severity | WCAG | Where | Issue | Status |
|---|----------|------|-------|-------|--------|
| 1 | Serious | 1.3.1 Info & Relationships (A) | `DateRange/index.tsx:210` (outer wrapper `<div>`) | The two related date inputs were wrapped in a plain `<div>` with no grouping semantics, so assistive tech announced two unrelated `Start Date` / `End Date` fields with no programmatic tie that they form one range. | **FIXED** |
| 2 | Moderate | 4.1.2 Name/Role/Value (A); 1.3.1 | `DateRange/index.tsx` (end shell) | A cross-field range error (e.g. *end before start*, passed via the top-level `error` prop) set `aria-invalid` on the **start** input only — the end input, often the one actually in error, had no programmatic error state. | **FIXED** |
| 3 | Moderate | 1.4.1 Use of Color (A) | `DateField.module.css`, `DateRange.module.css` | On error, the date **input itself showed no visual cue** — the red helper text below was the only indicator. FieldShell's error-border rule targets `.inputSlot`, a class these inputs don't use, so it never reached them. Users relying on an on-field state cue had none. | **FIXED** |
| 4 | Minor | 2.3.3 Animation from Interactions (AAA) | `DateField.module.css:50`, `DateRange.module.css:73` | The `.input` `transition` (border/box-shadow on hover/focus) had no `prefers-reduced-motion` guard. This is the established repo convention (≥30 components ship the media query); the two Date modules were the omission. | **FIXED** |
| 5 | Minor | 1.3.1 Info & Relationships (A); 3.3.1 Error Identification (A) | `DateRange/index.tsx` (end input) | After #2 both inputs are `aria-invalid`, but only the **start** input was `aria-describedby` the shared error/helper region. A screen-reader user landing on the **end** input heard "invalid" with no reason — the message was not programmatically available on that control. | **FIXED** (this pass) |

No hearing/media issues (checklist A): grep of the directory for `new Audio` / `AudioContext` /
`<audio>` / `<video>` / `navigator.vibrate` returned nothing — the components emit no sound and
convey no information via audio. No SEO/heading/landmark issues (checklist C): the components
render form controls only (no headings, links, or landmark content); all markup is SSR-present.

## Fixes applied

**Hearing** — none required (no audio surface).

**Reading & screen reader**

- **#1 group semantics** (`DateRange/index.tsx`): the outer wrapper is now
  `role="group"` with `aria-label={ariaLabel ?? 'Date range'}`. Added an **additive**
  `ariaLabel?: string` prop (JSDoc'd) so consumers can name the group; default `'Date range'`.
  Mirrors the repo precedent `ConfirmationCodeInput` (`role="group"` + `aria-label={ariaLabel || 'Confirmation Code'}`).
  No existing attribute renamed/removed — `data-field` / `data-field-name` are untouched, so the
  Playwright selector contract is preserved.
- **#2 both inputs invalid** (`DateRange/index.tsx`): the end input now sets
  `aria-invalid={hasError || undefined}` (where `hasError = Boolean(error)`), directly, merged
  after `{...inputAriaProps}`. A range error now marks **both** controls invalid. `|| undefined`
  guarantees `aria-invalid="false"` is never emitted, preserving the field-selector contract
  (same discipline FieldShell uses for `aria-disabled`). The single visible message stays under
  the start shell (no duplicate `role="alert"`).
- **#5 end input described by the shared region** (`DateRange/index.tsx`, this pass): the end
  input now sets `aria-describedby={startHelperRendered ? startHelperIdRef.current : undefined}`,
  pointing at the **same** helper/error region the start input is described by. The start
  `FieldShell` generates that region's id (`useId`) and exposes it only through its render-prop
  slot, so the start render-prop stashes it into a `useRef` (`startHelperIdRef`); React evaluates
  the start shell's render-prop before the end shell's in the same render, and the `useId` is
  stable across renders, so the ref holds the correct id by the time the end input renders. Gated
  on `startHelperRendered = hasError || helperText != null` (the region only exists in the DOM
  then), so no dangling `aria-describedby` is emitted — the test-selector contract is preserved
  (additive attribute, only present with an error/helper). This closes the first pass's deferred
  item **without touching `Field/Shell`**.

**On-field error cue (Use of Color)**

- **#3** (`DateField.module.css`, `DateRange.module.css`): added
  `.input[aria-invalid='true'] { border-color: var(--field-border-error); }`. The
  `--field-border-error` custom property is defined per-theme on the FieldShell `.shell`
  ancestor and **inherits** down to the descendant date input, so the invalid input now shows a
  themed danger border in sacred/light/dark automatically. Placed after the theme blocks so it
  wins the equal-specificity tie with the `[data-theme] .input` rules; the more-specific themed
  `:focus` rule intentionally still wins while the field is focused (focus affordance takes over
  during editing, while `aria-invalid` + red helper text keep the error programmatically
  conveyed throughout). Base `--goobs-danger` (#ef4444) clears the 3:1 non-text-UI contrast
  threshold on all three surfaces (per the FieldShell token notes).

**Motion**

- **#4** (both `.module.css`): added
  `@media (prefers-reduced-motion: reduce) { .input { transition: none; } }`.

## Stories updated

Stories are the only regression tests in this repo; each new behaviour is now pinned:

- `DateField.stories.tsx` → **`ErrorAssociated`** (new): passes a real `error` string and a
  `play` function asserting the input has `aria-invalid="true"`, the message renders in a
  `role="alert"` region, and `aria-describedby` points at exactly that region's id. Guards the
  form-error-association wiring (and, via the new CSS, the on-field border). Added the
  `within, expect` import from `storybook/test`.
- `DateRange.stories.tsx` → **`GroupSemanticsAndError`**: `play` asserts the wrapper is a
  `role="group"` named `Trip dates`, that a range error marks **both** the start and end inputs
  `aria-invalid="true"`, and that the alert region carries the message. **Extended this pass** to
  also assert **both** the start *and* the end input have `aria-describedby === alert.id` (issue
  #5 regression guard — reverting the describedby wiring re-fails this story). → **`DefaultGroupLabel`**:
  asserts the group is named `Date range` when no `ariaLabel` is passed. The pre-existing
  `InteractionTest` (label ↔ input association) is retained.

## SEO semantics

Nothing to change. These are form controls, not heading/landmark/list/link/table content; there
is no client-only content injection (labels, inputs, and helper text are all in the SSR'd HTML).

## Deferred

- ~~**End input not `aria-describedby` the error message.**~~ **RESOLVED this pass** (issue #5) —
  fixed inside `DateRange/index.tsx` by capturing the start shell's render-prop `helperId` into a
  ref and threading it onto the end input's `aria-describedby`, with no change to `Field/Shell`.
  The first pass's suggested Shell seam (optional `helperId`/`describedById` on `FieldShellProps`)
  is a valid future refactor if a *cleaner* multi-input describedby API is ever wanted, but is no
  longer required for correctness here.

- **Form-engine-derived range error on the end input (still deferred — Shell-rooted).** The end
  input's `aria-invalid` **and** `aria-describedby` (fixes #2/#5) both key on
  `hasError = Boolean(error)` / `startHelperRendered` — i.e. the **explicit** `error` prop, which
  is the documented cross-field channel (the `DateRange.error` JSDoc states range errors are
  computed by the caller and passed top-level). If a `DateRange` is instead bound inside a `<Form>`
  with **no explicit `error`**, and the engine derives the error for `name` on the *start* shell,
  the start input is marked (Shell derives it via `useOptionalFormContext`) but the **end** input
  is not (it has no `name`, and `DateRange` doesn't read the engine). In practice range validation
  is always passed explicitly, so this is an edge case.
  - **Why not fixed in-directory:** closing it means `DateRange` calling
    `useOptionalFormContext()` + `ctx.engine.getError(name)` itself, which **duplicates**
    `FieldShell`'s error-derivation logic (`Field/Shell/index.tsx:298-327`) — exactly the kind of
    duplicated-Shell-logic the repo conventions discourage.
  - **Suggested change (Shell owner):** expose the resolved `hasError`/`helperId` (or an optional
    `describedById`) from `FieldShell` back to the composite consumer — e.g. add a
    `describedById?: string` prop to `FieldShellProps` (`Field/Shell/index.tsx:~141`) and/or return
    the resolved `hasError` in the render-prop slot, so `DateRange` can mirror the engine-derived
    error onto the end input without re-deriving it. Low risk, additive, back-compatible.
  - Severity: minor — the primary explicit-`error` path is fully covered; this only affects the
    rarely-used form-engine-derived range-error case.
