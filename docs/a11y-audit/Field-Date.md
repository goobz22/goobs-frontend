# Field/Date — a11y audit (2026-07-11)

**Status:** FIXED (all issues resolved entirely within `DateRange/index.tsx`; no `Field/Shell`
change required; nothing deferred).

> **Re-audit note (2026-07-11, second pass):** the first pass fixed issues #1–#4 below and
> *deferred* the end input's `aria-describedby` as needing a `Field/Shell` change. This pass
> found it is fixable **entirely within `DateRange/index.tsx`** and fixed it (issue #5).
>
> **Re-audit note (2026-07-11, third pass — adversarial review follow-up):** the second pass's
> #2/#5 fix RE-DERIVED the end input's ARIA from the explicit `error` prop (`Boolean(error)` /
> a helper-id gated on `hasError || helperText`). Review found this wrong twice over: (a) a
> boolean `error={true}` with no `helperText` renders NO message region, yet the end input still
> emitted a **dangling** `aria-describedby` at the non-existent region id (issue #6); and (b) a
> form-engine-derived range error (bound in a `<Form>` via `name`, no explicit `error`) left the
> end input neither `aria-invalid` nor described (the previously-*deferred* case). Both share one
> root cause — re-deriving from the explicit `error` prop instead of the start shell's resolved
> state. Fixed by **mirroring the start shell's already-resolved `inputAriaProps` bag** onto the
> end input (capture it in a ref from the start render-prop; copy its `aria-invalid` /
> `aria-describedby`). This closes #6 **and** the deferred form-engine case at once, with **no
> `Field/Shell` change** and **no duplicated engine logic**. Nothing remains deferred.

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
| 5 | Minor | 1.3.1 Info & Relationships (A); 3.3.1 Error Identification (A) | `DateRange/index.tsx` (end input) | After #2 both inputs are `aria-invalid`, but only the **start** input was `aria-describedby` the shared error/helper region. A screen-reader user landing on the **end** input heard "invalid" with no reason — the message was not programmatically available on that control. | **FIXED** (2nd pass) |
| 6 | Moderate | 4.1.2 Name/Role/Value (A) — invalid ARIA reference (axe `aria-valid-attr-value`) | `DateRange/index.tsx` (end input) | The 2nd-pass #5 fix gated the end input's `aria-describedby` on `hasError \|\| helperText != null`, but `hasError = Boolean(error)` is `true` for a **boolean** `error={true}` — a documented FieldShell mode that renders NO message region. So with `error={true}` and no `helperText`, the end input emitted `aria-describedby="field-helper-<id>"` pointing at a **non-existent element** (start input, correctly, emitted none → asymmetric + dangling). | **FIXED** (3rd pass) |
| 7 | Minor | 4.1.2 (A); 1.3.1; 3.3.1 | `DateRange/index.tsx` (end input) | A **form-engine-derived** range error (DateRange bound in a `<Form>` via `name`, no explicit `error`) is resolved on the start shell but was NOT mirrored to the end input, because the end input re-derived from `Boolean(error)` (false here). The end control was neither `aria-invalid` nor described. Previously listed under *Deferred* with an incorrect "duplicates Shell logic" justification. | **FIXED** (3rd pass) |

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
- **#2 / #5 / #6 / #7 — end input MIRRORS the start shell's resolved ARIA** (`DateRange/index.tsx`,
  3rd pass — supersedes the 2nd-pass re-derivation). The start `FieldShell` is the single source of
  the pair's error truth: it resolves `aria-invalid` and `aria-describedby` (into its render-prop
  `inputAriaProps` bag) from whichever channel actually applies — an explicit string `error`, a
  boolean `error={true}`, a `helperText`, **or** a `<Form>`-engine-derived error for `name`. The
  end shell is deliberately passed no `error`/`helperText`/`name` (so the one `role="alert"` message
  renders once, below the start). So instead of RE-DERIVING the end input's ARIA from the explicit
  `error` prop, the start render-prop now captures its resolved `inputAriaProps` into a
  `useRef<FieldShellSlot['inputAriaProps']>` (`startInputAriaRef`), and the end input copies that
  bag's `aria-invalid` / `aria-describedby` onto itself (merged after its own `{...inputAriaProps}`,
  which carries neither). React evaluates the start shell's render-prop before the end shell's in the
  same render (document order), so the ref is populated by the time the end input renders. Result:
  - both controls are `aria-invalid` on any range error (#2), and both point at the one message
    region (#5) — a screenreader on either end reads the reason (WCAG 1.3.1 / 3.3.1 / 4.1.2);
  - `aria-describedby` is present **iff** the shell actually rendered a region — so a boolean
    `error={true}` with no `helperText` (no region) emits **no** dangling describedby on the end
    input (#6);
  - a `<Form>`-engine-derived error (no explicit `error` prop) is now mirrored too, since it flows
    through the same start-shell `inputAriaProps` (#7 — the formerly-deferred case), with **no
    `Field/Shell` change** and **no re-implementation of the engine's error derivation**.

  `|| undefined` on the mirrored `aria-invalid` keeps `aria-invalid="false"` from ever being emitted
  (the shell only ever sets `true`), preserving the field-selector contract (same discipline
  FieldShell uses for `aria-disabled`). The single visible message stays under the start shell (no
  duplicate `role="alert"`).

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
  `role="group"` named `Trip dates`, that an **explicit string** range error marks **both** the
  start and end inputs `aria-invalid="true"`, and that **both** are `aria-describedby === alert.id`
  (issues #2/#5 regression guard — reverting the mirror re-fails this story). → **`DefaultGroupLabel`**:
  asserts the group is named `Date range` when no `ariaLabel` is passed.
- `DateRange.stories.tsx` → **`BooleanErrorNoMessage`** (new, 3rd pass — issue #6 guard): passes a
  boolean `error` (no message, no `helperText`). `play` asserts **both** inputs are
  `aria-invalid="true"`, that **no** `role="alert"` region exists, and that **neither** input has an
  `aria-describedby` — reverting the mirror to a `Boolean(error)`-gated describedby re-introduces a
  dangling reference on the end input and re-fails this story.
- `DateRange.stories.tsx` → **`FormEngineDerivedError`** (new, 3rd pass — issue #7 guard): binds a
  `DateRange` (by `name`, no explicit `error`) inside a `<Form>` whose zod schema `.refine`s the
  range to require both dates; the `play` submits, then asserts **both** inputs are
  `aria-invalid="true"` and **both** are `aria-describedby` the engine-derived helper region.
  Reverting the mirror leaves the end input unmarked/undescribed on this path. (Queries the message
  region by its text, not `role="alert"`, since `<Form>` also renders a form-level status alert.)
- The pre-existing `InteractionTest` (label ↔ input association) is retained.

## SEO semantics

Nothing to change. These are form controls, not heading/landmark/list/link/table content; there
is no client-only content injection (labels, inputs, and helper text are all in the SSR'd HTML).

## Deferred

Nothing is deferred. Both items previously listed here are now fixed inside `DateRange/index.tsx`.

- ~~**End input not `aria-describedby` the error message.**~~ **RESOLVED** (issue #5, 2nd pass;
  refined in the 3rd-pass mirror). Fixed inside `DateRange/index.tsx` with no change to `Field/Shell`.

- ~~**Form-engine-derived range error on the end input (Shell-rooted).**~~ **RESOLVED** (issue #7,
  3rd pass). The 2nd-pass audit's justification for deferring this — that closing it would require
  `DateRange` to call `useOptionalFormContext()` + `ctx.engine.getError(name)` and thereby
  **duplicate** `FieldShell`'s error-derivation logic — was **incorrect**. `DateRange` never needs
  to touch the engine: the start `FieldShell` already resolves the engine-derived error and exposes
  the result through its render-prop `inputAriaProps` bag. Mirroring that resolved bag onto the end
  input (see *Fixes applied* #2/#5/#6/#7) covers the form-engine path with **zero** re-derivation and
  **no `Field/Shell` change**. The suggested Shell seam (an optional `describedById` on
  `FieldShellProps`) remains a *possible future ergonomics refactor* but is **not required for
  correctness** — recorded below only as an optional nicety, not a defect.

## Notes for the `Field/Shell` owner (optional — not a defect)

- **Optional ergonomics only (no action required):** multi-input composites like `DateRange` mirror
  the start shell's resolved `inputAriaProps` bag (captured from the render-prop) onto their extra
  inputs. This works today and needs no Shell change. If a *cleaner* first-class multi-input
  describedby API is ever wanted, `FieldShell` could expose the resolved `aria-invalid` (in addition
  to the already-exposed `helperId`) in `FieldShellSlot` (`Field/Shell/index.tsx:48-75`), so
  consumers wouldn't have to read it back out of `inputAriaProps`. Additive, back-compatible, low
  priority.
