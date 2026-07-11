# Field/Time — a11y audit (2026-07-11)

**Status:** FIXED

**Scope:** the composite `Field/Time` area — two sub-fields:
- `src/components/Field/Time/TimeField` — a single `<input type="time">`.
- `src/components/Field/Time/TimeRange` — a paired start/end `<input type="time">` range.

Both render their native time input(s) through the shared **`Field/Shell`**
(`FieldShell` + `useFieldBinding`), which is owned by a later serial pass and was
**not modified** here. Anything whose root cause is in Shell is listed under *Deferred*.

The `Field/Date` twin (`DateField` / `DateRange`) had already been through this exact audit;
`Field/Time` is its structural mirror and was missing the same fixes **plus** a focus indicator
Date already shipped. The fixes below match the sanctioned Date pattern.

## APG pattern

Not a custom widget pattern — these use the **native HTML time input** (`<input type="time">`),
which is the semantically correct, keyboard-complete, screen-reader-supported control. The
accessibility contract is therefore the **WAI-ARIA form-field** contract, delivered by
`FieldShell`:

- real `<label htmlFor>` ↔ `id` association (accessible name),
- `aria-required` from the required flag,
- `aria-invalid` + `aria-describedby` → a `role="alert"` / `aria-live="polite"` helper region
  when an error is present.

`TimeRange` additionally composes two related controls into one logical unit, so it takes on the
**grouped-controls** shape (`role="group"` + accessible name), the same pattern the repo already
uses for multi-input fields (`DateRange`, `ConfirmationCodeInput`, `FieldGrid`).

No dialog/combobox/listbox/menu is involved, so no focus-trap / arrow-key / Escape table applies
here — native time-picker keyboard behaviour is the browser's.

## Issues found

| # | Severity | WCAG | Where | Issue | Status |
|---|----------|------|-------|-------|--------|
| 1 | Serious | 2.4.7 Focus Visible (AA) | `TimeField.module.css:23`, `TimeRange.module.css:40` (`.input`) | The `.input` set `outline: none` with **no `:focus`/`:focus-visible` replacement**. Unlike the generic FieldShell input, the time input is a *bare descendant* of `.shell` (not wrapped in `.inputSlot`), so it also inherited **no** `.inputSlot:focus-within` affordance. Result: keyboard users got **no visible focus indicator at all** on the time field. (This is the one gap the Date twin did not have — Date already shipped a `:focus` rule.) | **FIXED** |
| 2 | Moderate | 1.3.1 (A); 4.1.2 Name/Role/Value (A) | `TimeRange/index.tsx` (end shell) | A cross-field range error (e.g. *end before start*, passed via the top-level `error` prop) set `aria-invalid` on the **start** input only — the end input, often the one actually in error, had no programmatic error state. | **FIXED** |
| 3 | Moderate | 1.4.1 Use of Color (A) | `TimeField.module.css`, `TimeRange.module.css` | On error, the time **input itself showed no visual cue** — the red helper text below was the only indicator. FieldShell's error-border rule targets `.inputSlot`, a class these inputs don't use, so it never reached them. Users relying on an on-field state cue had none. | **FIXED** |
| 4 | Serious | 1.3.1 Info & Relationships (A) | `TimeRange/index.tsx:131` (outer wrapper `<div>`) | The two related time inputs were wrapped in a plain `<div>` with no grouping semantics, so assistive tech announced two unrelated `Start Time` / `End Time` fields with no programmatic tie that they form one range, and the group had no accessible name. | **FIXED** |
| 5 | Minor | 2.3.3 Animation from Interactions (AAA) | `TimeField.module.css:22`, `TimeRange.module.css:39` | The `.input` `transition: all 0.3s ease` (animating border/box-shadow on hover/focus) had no `prefers-reduced-motion` guard. This is the established repo convention (≥30 components ship the media query, incl. the Date twin); the two Time modules were the omission. | **FIXED** |

No hearing/media issues (checklist A): grep of the directory for `new Audio` / `AudioContext` /
`<audio>` / `<video>` / `navigator.vibrate` / `.play(` returned nothing — the components emit no
sound and convey no information via audio. No SEO/heading/landmark issues (checklist C): the
components render form controls only (no headings, links, or landmark content); all markup is
SSR-present.

## Fixes applied

**Hearing** — none required (no audio surface).

**Reading & screen reader**

- **#2 both inputs invalid** (`TimeRange/index.tsx`): the end input now sets
  `aria-invalid={hasError || undefined}` (where `hasError = Boolean(error)`), merged after
  `{...inputAriaProps}`. A range error now marks **both** controls invalid. `|| undefined`
  guarantees `aria-invalid="false"` is never emitted, preserving the field-selector contract
  (the same discipline FieldShell uses for `aria-disabled`). The single visible message stays
  under the start shell (no duplicate `role="alert"`). Mirrors the `DateRange` twin.
- **#4 group semantics** (`TimeRange/index.tsx`): the outer wrapper is now `role="group"` with
  `aria-label={ariaLabel ?? 'Time range'}`. Added an **additive** `ariaLabel?: string` prop
  (JSDoc'd) so consumers can name the group; default `'Time range'`. No existing attribute was
  renamed/removed — `data-field` / `data-field-name` are untouched, so the Playwright selector
  contract is preserved. Mirrors `DateRange` (and the repo precedent `ConfirmationCodeInput`).

**Focus indicator (Focus Visible)**

- **#1** (`TimeField.module.css`, `TimeRange.module.css`): added a themed `:focus-visible` ring
  to `.input` — one rule per theme (sacred / light / dark) so the border + box-shadow read
  correctly on each surface, using the existing focus tokens
  (`--field-border-focus` with per-theme fallback, and the `--goobs-focus-{sacred,light,dark}`
  ring presets). A `type="time"` text-entry control matches `:focus-visible` whenever focused
  (the keyboard-input heuristic), so the ring shows on both keyboard and pointer focus. The
  themed selectors out-rank the `[data-theme] .input` default-border rules; ordered after the
  error rules so focus takes over during editing.

**On-field error cue (Use of Color)**

- **#3** (`TimeField.module.css`, `TimeRange.module.css`): added
  `.input[aria-invalid='true'] { border-color: var(--field-border-error); }` (one selector per
  theme scope so it out-specifies the `[data-theme] .input` default-border rules). The
  `--field-border-error` custom property is defined per-theme on the FieldShell `.shell`
  ancestor and **inherits** down to the descendant time input, so the invalid input now shows a
  themed danger border in sacred/light/dark automatically. Base `--goobs-danger` (#ef4444)
  clears the 3:1 non-text-UI contrast threshold on all three surfaces (per the FieldShell token
  notes). While focused, the more-specific `:focus-visible` rule intentionally takes over
  (`aria-invalid` + red helper text keep the error programmatically conveyed throughout).

**Motion**

- **#5** (both `.module.css`): added
  `@media (prefers-reduced-motion: reduce) { .input { transition: none; } }`.

## Stories updated

Stories are the only regression tests in this repo; each new behaviour is now pinned
(added the `within, expect` import from `storybook/test` to both files):

- `TimeField.stories.tsx` → **`ErrorAssociated`** (new): passes a real `error` string and a
  `play` function asserting the input has `aria-invalid="true"`, the message renders in a
  `role="alert"` region, and `aria-describedby` points at exactly that region's id. Guards the
  form-error-association wiring (and, via the new CSS, the on-field border). → **`FocusRing`**
  (new): `play` focuses the input and asserts `toHaveFocus`, exercising the new `:focus-visible`
  ring in Storybook / Chromatic.
- `TimeRange.stories.tsx` → **`GroupSemanticsAndError`** (new): `play` asserts the wrapper is a
  `role="group"` named `Meeting time range`, that a range error marks **both** the start and end
  inputs `aria-invalid="true"`, and that the alert region carries the message and describes the
  start input. → **`DefaultGroupLabel`** (new): asserts the group is named `Time range` when no
  `ariaLabel` is passed. (TimeRange previously had **no** error/a11y story at all.)

## SEO semantics

Nothing to change. These are form controls, not heading/landmark/list/link/table content; there
is no client-only content injection (labels, inputs, and helper text are all in the SSR'd HTML).
`TimeRange` is now a semantic `role="group"`, the correct landmark-ish grouping for a composite
field.

## Deferred

- **Bare-input fields don't inherit Shell's generic focus/error affordances.** Root cause of
  issues #1 and #3 is architectural: `FieldShell.module.css` delivers its `:focus-within` ring
  (`.inputSlot:focus-within`, line 155) and error border (`.shell[aria-invalid] .inputSlot`,
  line 160) **only** to inputs wrapped in `.inputSlot`. `Field/Time` and `Field/Date` render the
  native input as a *bare* child of `.shell`, so those rules never reach them and every such
  field must re-implement focus/error styling in its own module. Fixed locally here (matching
  Date), but the pattern recurs.
  - **Suggested change (Shell owner):** hoist a bare-input fallback into
    `src/components/Field/Shell/FieldShell.module.css` — e.g. a low-specificity
    `.shell > :where(input):focus-visible` focus ring and
    `.shell[aria-invalid='true'] > :where(input)` error border keyed on the `--field-*` tokens —
    so bare-input consumers get the affordance for free (and per-field modules only override when
    they need bespoke chrome). Non-breaking; would let `Field/Time` and `Field/Date` drop their
    duplicated focus/error rules.

- **End input not `aria-describedby` the error message.** After fix #2 both inputs are
  `aria-invalid`, and the message is announced when it appears (`role="alert"` + `aria-live`),
  but only the **start** input is `aria-describedby` the helper region — so a screen-reader user
  who navigates to the **end** input *after* the error already exists won't have the message
  re-read on focus. A clean fix needs the two side-by-side `FieldShell`s to **share one helper
  region id**: each shell generates its own `helperId` internally via `useId`
  (`Field/Shell/index.tsx:290-292`), and the render-prop scoping makes it impractical for
  `TimeRange` to thread the start shell's `helperId` onto the end input.
  - **Suggested change (Shell owner):** let `FieldShell` accept an optional
    `helperId?: string` prop so a composite field can supply one stable id, render the single
    shared helper region with it, and spread it into *both* children's `aria-describedby`. File
    `src/components/Field/Shell/index.tsx` — add to `FieldShellProps` (~line 141) and use it in
    place of the internal `helperId` (lines 292 / 349 / 409). Low risk, additive, back-compatible
    (falls back to `useId`). Same seam noted by the Date audit.
  - Severity: minor — the live-region announcement + dual `aria-invalid` cover the primary need;
    this only improves *re-reading on late focus*.

- **Form-engine-derived range error on the end input.** Fix #2 keys the end input's
  `aria-invalid` on the explicit `error` prop (the documented cross-field channel). If a
  `TimeRange` is bound inside a `<Form>` and its error is derived from the engine/schema on the
  start shell (via `name`) rather than passed explicitly, the end input won't mirror it (the end
  shell has no `name`). Range validation is inherently cross-field and is passed explicitly in
  practice, so this is an edge case; a general fix again wants the Shell composite-field seam
  above.
