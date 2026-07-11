# Field/Date — a11y audit (2026-07-11)

**Status:** FIXED

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
- `DateRange.stories.tsx` → **`GroupSemanticsAndError`** (new): `play` asserts the wrapper is a
  `role="group"` named `Trip dates`, that a range error marks **both** the start and end inputs
  `aria-invalid="true"`, and that the alert region carries the message and describes the start
  input. → **`DefaultGroupLabel`** (new): asserts the group is named `Date range` when no
  `ariaLabel` is passed. The pre-existing `InteractionTest` (label ↔ input association) is
  retained.

## SEO semantics

Nothing to change. These are form controls, not heading/landmark/list/link/table content; there
is no client-only content injection (labels, inputs, and helper text are all in the SSR'd HTML).

## Deferred

- **End input not `aria-describedby` the error message.** After fix #2 both inputs are
  `aria-invalid`, and the message is announced when it appears (`role="alert"` + `aria-live`),
  but only the **start** input is `aria-describedby` the helper region — so a screen-reader user
  who navigates to the **end** input *after* the error already exists won't have the message
  re-read on focus. A clean fix needs the two side-by-side `FieldShell`s to **share one helper
  region id**: each shell generates its own `helperId` internally via `useId`
  (`Field/Shell/index.tsx:290-292`), and the render-prop scoping makes it impractical for
  `DateRange` to thread the start shell's `helperId` onto the end input.
  - **Suggested change (Shell owner):** let `FieldShell` accept an optional
    `helperId?: string` / `describedById?: string` prop so a composite field can supply one
    stable id, render the single shared helper region with it, and spread it into *both*
    children's `aria-describedby`. File `src/components/Field/Shell/index.tsx` — add to
    `FieldShellProps` (~line 141) and use it in place of the internal `helperId`
    (line 292 / 349 / 409). Low risk, additive, back-compatible (falls back to `useId`).
  - Severity: minor — the live-region announcement + dual `aria-invalid` cover the primary
    need; this only improves *re-reading on late focus*.

- **Form-engine-derived range error on the end input.** Fix #2 keys the end input's
  `aria-invalid` on the explicit `error` prop (the documented cross-field channel). If a
  `DateRange` is bound inside a `<Form>` and its error is derived from the engine/schema on the
  start shell (via `name`) rather than passed explicitly, the end input won't mirror it (the end
  shell has no `name`). Range validation is inherently cross-field and is passed explicitly in
  practice, so this is an edge case. A general fix again wants Shell to expose the composite-field
  error/describedby seam above, or `DateRange` to read `useOptionalFormContext()` itself — the
  latter would duplicate Shell's derivation logic and is not worth it in this directory.
