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
| 1 | Serious | 2.4.7 Focus Visible (AA) | `TimeField.module.css`, `TimeRange.module.css` (`.input`) | The `.input` set `outline: none` with **no `:focus`/`:focus-visible` replacement**. Unlike the generic FieldShell input, the time input is a *bare descendant* of `.shell` (not wrapped in `.inputSlot`), so it also inherited **no** `.inputSlot:focus-within` affordance. Keyboard users got **no visible focus indicator at all** on the time field. | **FIXED** |
| 2 | Moderate | 1.3.1 (A); 4.1.2 Name/Role/Value (A) | `TimeRange/index.tsx` (end shell) | A cross-field range error (e.g. *end before start*, passed via the top-level `error` prop) set `aria-invalid` on the **start** input only — the end input, often the one actually in error, had no programmatic error state. | **FIXED** |
| 3 | Moderate | 1.4.1 Use of Color (A) | `TimeField.module.css`, `TimeRange.module.css` | On error, the time **input itself showed no visual cue** — the red helper text below was the only indicator. FieldShell's error-border rule targets `.inputSlot`, a class these inputs don't use, so it never reached them. | **FIXED** |
| 4 | Serious | 1.3.1 Info & Relationships (A) | `TimeRange/index.tsx` (outer wrapper `<div>`) | The two related time inputs were wrapped in a plain `<div>` with no grouping semantics, so assistive tech announced two unrelated `Start Time` / `End Time` fields with no programmatic tie that they form one range, and the group had no accessible name. | **FIXED** |
| 5 | Minor | 2.3.3 Animation from Interactions (AAA) | `TimeField.module.css`, `TimeRange.module.css` | The `.input` `transition: all 0.3s ease` (animating border/box-shadow on hover/focus) had no `prefers-reduced-motion` guard — the established repo convention on ≥30 components, incl. the Date twin. | **FIXED** |
| 6 | Minor | 1.3.1 (A); 3.3.1 (A) | `TimeRange/index.tsx:159-234` (end input) | The end input was `aria-invalid` (fix #2) but **not** `aria-describedby` the single shared helper/error region, so a screen-reader user who lands on the end input *after* an error appears wouldn't have the message re-read on focus (only the start input pointed at it). Was originally **Deferred** to the Shell owner; a subsequent in-directory change wired the two side-by-side `FieldShell`s to share one helper-region id via a render-prop ref (`startHelperIdRef`) — **no Shell change needed**. | **FIXED** |
| 7 | Moderate | 1.3.1 (A); 4.1.2 Name/Role/Value (A) | `TimeRange/index.tsx:160` (was `startHelperRendered = hasError \|\| helperText != null`) | **New finding.** The shared-describedby wiring from #6 gated the end input's `aria-describedby` on **`hasError`** — but FieldShell renders the helper region only when a **message string** exists (`errorMessage ?? helperText`), NOT for a boolean `error={true}` (styling-only invalid, no message). So `<TimeRange error />` (public, documented boolean-error value) emitted a **dangling `aria-describedby`** on the end input pointing at a `field-helper-*` element that never renders — a broken AT reference. | **FIXED** |

No hearing/media issues (checklist A): grep of the directory for `new Audio` / `AudioContext` /
`<audio>` / `<video>` / `navigator.vibrate` / `.play(` returned nothing — the components emit no
sound and convey no information via audio. No SEO/heading/landmark issues (checklist C): the
components render form controls only (no headings, links, or landmark content); all markup is
SSR-present.

## Fixes applied

**Hearing** — none required (no audio surface).

**Reading & screen reader**

- **#2 both inputs invalid** (`TimeRange/index.tsx`): the end input sets
  `aria-invalid={hasError || undefined}` (where `hasError = Boolean(error)`), merged after
  `{...inputAriaProps}`. A range error now marks **both** controls invalid. `|| undefined`
  guarantees `aria-invalid="false"` is never emitted, preserving the field-selector contract.
  The single visible message stays under the start shell (no duplicate `role="alert"`). Mirrors
  the `DateRange` twin.
- **#4 group semantics** (`TimeRange/index.tsx`): the outer wrapper is now `role="group"` with
  `aria-label={ariaLabel ?? 'Time range'}`. Added an **additive** `ariaLabel?: string` prop
  (JSDoc'd) so consumers can name the group; default `'Time range'`. No existing attribute was
  renamed/removed — `data-field` / `data-field-name` are untouched, so the Playwright selector
  contract is preserved. Mirrors `DateRange` (and the repo precedent `ConfirmationCodeInput`).
- **#6 end input described by the shared region** (`TimeRange/index.tsx:159-234`): the start
  `FieldShell` renders the ONE helper/error region for the pair; its render-prop slot exposes the
  region's `helperId`, which is stashed in a ref (`startHelperIdRef`) and threaded onto the end
  input's `aria-describedby`. React evaluates the start shell's render-prop before the end shell's
  (document order) in the same render, and `useId` is stable across renders, so the ref holds the
  correct id when the end input renders. A cross-field range error/helper describes **both**
  controls, so a screenreader that lands on the end input reads the reason instead of hearing an
  unexplained "invalid". Solved **without** the Shell composite-field seam that the original audit
  had deferred — no `Field/Shell` change.
- **#7 no dangling `aria-describedby` for a boolean error** (`TimeRange/index.tsx:160`): the gate
  that decides whether the end input points at the shared region was changed from
  `hasError || helperText != null` to mirror FieldShell's own `showHelper` logic exactly —
  `const startErrorMessage = typeof error === 'string' ? error : null;
  const startHelperRendered = (startErrorMessage ?? helperText) != null`. Now the end input's
  `aria-describedby` is emitted **iff the region actually renders** (a string `error` OR
  `helperText`), so a boolean `error={true}` — which marks the pair invalid but renders no region —
  no longer produces a reference to a non-existent element. Both inputs still read as invalid via
  their `aria-invalid`, so the error is still programmatically conveyed. `hasError` is retained
  where it belongs — driving the end input's `aria-invalid`.

**Focus indicator (Focus Visible)**

- **#1** (`TimeField.module.css`, `TimeRange.module.css`): added a themed `:focus-visible` ring
  to `.input` — one rule per theme (sacred / light / dark) so the border + box-shadow read
  correctly on each surface, using the existing focus tokens
  (`--field-border-focus` with per-theme fallback, and the `--goobs-focus-{sacred,light,dark}`
  ring presets). A `type="time"` text-entry control matches `:focus-visible` whenever focused
  (the keyboard-input heuristic), so the ring shows on both keyboard and pointer focus.

**On-field error cue (Use of Color)**

- **#3** (`TimeField.module.css`, `TimeRange.module.css`): added
  `.input[aria-invalid='true'] { border-color: var(--field-border-error); }` (one selector per
  theme scope so it out-specifies the `[data-theme] .input` default-border rules). The
  `--field-border-error` custom property is defined per-theme on the FieldShell `.shell`
  ancestor and **inherits** down to the descendant time input, so the invalid input now shows a
  themed danger border in sacred/light/dark automatically.

**Motion**

- **#5** (both `.module.css`): added
  `@media (prefers-reduced-motion: reduce) { .input { transition: none; } }`.

## Stories updated

Stories are the only regression tests in this repo; each new behaviour is now pinned:

- `TimeField.stories.tsx` → **`ErrorAssociated`**: passes a real `error` string and a `play`
  function asserting the input has `aria-invalid="true"`, the message renders in a `role="alert"`
  region, and `aria-describedby` points at exactly that region's id. → **`FocusRing`**: `play`
  focuses the input and asserts `toHaveFocus`, exercising the new `:focus-visible` ring.
- `TimeRange.stories.tsx` → **`GroupSemanticsAndError`**: `play` asserts the wrapper is a
  `role="group"` named `Meeting time range`, that a range error marks **both** the start and end
  inputs `aria-invalid="true"`, that the alert region carries the message, and that **both** the
  start AND end inputs are `aria-describedby` that region (guards the #6 shared-helper-id wiring).
  → **`DefaultGroupLabel`**: asserts the group is named `Time range` when no `ariaLabel` is passed.
  → **`BooleanErrorNoDanglingDescribedby`** (new, this pass): renders `<TimeRange error />`
  (boolean, no message) and `play`-asserts both inputs are `aria-invalid="true"`, that **no**
  `role="alert"` region renders, and that **neither** input carries an `aria-describedby` — the
  fail-first regression guard for issue #7 (before the fix the end input carried a dangling
  reference).

## SEO semantics

Nothing to change. These are form controls, not heading/landmark/list/link/table content; there
is no client-only content injection (labels, inputs, and helper text are all in the SSR'd HTML).
`TimeRange` is a semantic `role="group"`, the correct grouping for a composite field.

## Deferred

- **Bare-input fields don't inherit Shell's generic focus/error affordances.** Root cause of
  issues #1 and #3 is architectural: `FieldShell.module.css` delivers its `:focus-within` ring
  (`.inputSlot:focus-within`) and error border (`.shell[aria-invalid] .inputSlot`) **only** to
  inputs wrapped in `.inputSlot`. `Field/Time` and `Field/Date` render the native input as a
  *bare* child of `.shell`, so those rules never reach them and every such field must
  re-implement focus/error styling in its own module. Fixed locally here (matching Date), but the
  pattern recurs.
  - **Suggested change (Shell owner):** hoist a bare-input fallback into
    `src/components/Field/Shell/FieldShell.module.css` — e.g. a low-specificity
    `.shell > :where(input):focus-visible` focus ring and
    `.shell[aria-invalid='true'] > :where(input)` error border keyed on the `--field-*` tokens —
    so bare-input consumers get the affordance for free (per-field modules only override when they
    need bespoke chrome). Non-breaking; would let `Field/Time` and `Field/Date` drop their
    duplicated focus/error rules.

- **Form-engine-derived range error on the end input.** Fix #2 keys the end input's `aria-invalid`
  on the explicit `error` prop (the documented cross-field channel), and #6/#7 key its
  `aria-describedby` on the start shell's rendered region. If a `TimeRange` is bound inside a
  `<Form>` and its error is derived from the engine/schema on the start shell (via `name`) rather
  than passed explicitly, the end input won't mirror it (the end shell has no `name`, so the
  engine never sees it and `error`/`hasError` here stay falsy). Range validation is inherently
  cross-field and is passed explicitly in practice, so this is an edge case.
  - **Suggested change (Shell owner):** a first-class composite-field seam — let `FieldShell`
    accept an optional `helperId?: string` and/or expose the bound error to sibling controls — so
    a paired field can share one region id and one derived error across both inputs without the
    render-prop-ref workaround. File `src/components/Field/Shell/index.tsx`
    (`FieldShellProps` ~line 141; internal `helperId` at lines 292 / 349 / 409). Low risk,
    additive, back-compatible (falls back to `useId`). The render-prop ref used here (#6) is a
    faithful in-field stand-in until that seam exists.
