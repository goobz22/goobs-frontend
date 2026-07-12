# RadioGroup — a11y audit (2026-07-11)

**Status:** FIXED

**APG pattern:** [Radio Group](https://www.w3.org/WAI/ARIA/apg/patterns/radio/) —
implemented with **native `<input type="radio">`** controls (all sharing one `name`)
wrapped in per-option `<label>`s, inside a `<div role="radiogroup" aria-labelledby>`.
Native radios sharing a `name` provide the pattern's entire keyboard contract for free
(single tab-stop into the group, Arrow/Home/End roving selection, Space) and expose
role/checked/name to assistive tech automatically — provided they are **not removed from
the accessibility tree**, which was the dominant defect here.

## Issues found

| # | Severity | WCAG | Location | Pattern | Status |
|---|----------|------|----------|---------|--------|
| 1 | Critical | 2.1.1 Keyboard (A), 4.1.2 Name/Role/Value (A) | `RadioGroup.module.css` `.input { display: none }` (was lines 167-169) | `display-none-hides-native-control` | **FIXED** |
| 2 | Serious | 2.4.7 Focus Visible (AA), 2.4.11 Focus Appearance (AA) | `RadioGroup.module.css` — no `:focus-visible` rule anywhere in the file | `missing-focus-visible-style` | **FIXED** |
| 3 | Moderate | 1.3.1 Info & Relationships (A), 4.1.2 Name/Role/Value (A) | `index.tsx` — `aria-labelledby` always pointed at a `<label>` that is empty when neither `label` nor `labelText` is set (was line 241) | `missing-accessible-name` | **FIXED** |
| 4 | Minor | 1.3.1 Info & Relationships (A) | `index.tsx` — group heading rendered as an orphan `<label>` with no `htmlFor` (was line 238) | `orphan-label-element` | **FIXED** |
| 5 | Serious | 1.4.11 Non-text Contrast (AA) | `RadioGroup.module.css:46` — light `--rg-radio-border-color` was `var(--goobs-light-border-strong)` (#cbd5e1) | `low-contrast-control-boundary` | **FIXED** |
| 6 | Moderate | 3.3.1 Error Identification (A), 4.1.2 Name/Role/Value (A), 3.3.2 Labels or Instructions (A) | `index.tsx` — Tier-1 bound field rendered NO validation affordance: no `aria-invalid` / `aria-required` on `role="radiogroup"`, no error region, no required indicator | `bound-field-no-validation-affordance` | **FIXED** |

> **2026-07-11 re-audit (this pass):** issues 1–4 were fixed by prior commit `3f4be98f`
> and re-verified here (all pass). A first re-audit pass found and fixed **issue 5** (commit
> `25a01498`). This adversarial re-review found and fixed **issue 6** — the missing validation
> affordance that the prior pass had wrongly parked as "Deferred / needs edits outside the
> directory." The fix lives entirely in `index.tsx` (in-directory) and is now closed.

### Issue 5 — Unchecked radio ring below 3:1 in light theme (Serious)

The light-theme unchecked ring used the generic grey `--goobs-light-border-strong` (#cbd5e1),
which is only **1.48:1** against the white canvas — far below the **3:1** WCAG 2.2 1.4.11
threshold for a control's visual boundary. The unchecked ring is the *only* visual indicator
that an unselected radio exists and its state, so a low-vision user could not perceive the
unselected options. Verified with a relative-luminance script:

| ring color | surface | ratio | verdict |
|---|---|---|---|
| `#cbd5e1` (old, border-strong) | `#ffffff` | 1.48:1 | ✗ fails 1.4.11 |
| `#4b5563` (new, text-muted) | `#ffffff` | 7.56:1 | ✓ passes |
| `#94a3b8` dark ring | `#1e293b` / `#111827` | 5.71 / 6.92:1 | ✓ (already fine) |
| `#2563eb` checked fill / focus | `#ffffff` | 5.17:1 | ✓ (already fine) |

Dark (`--goobs-dark-text-muted` #94a3b8) and sacred (gold) unchecked rings already cleared 3:1,
as did the checked fill, hover border, and all focus outlines — only the **light** default was
non-compliant. Fix: point the light default `--rg-radio-border-color` at `--goobs-light-text-muted`
(#4b5563, 7.56:1). No change to dark/sacred or to any caller-override path.

### Issue 6 — Bound field renders no validation affordance (Moderate)

RadioGroup is a **Tier-1 bound form field**: inside a `<Form>` it auto-binds its value by
`name` via `useFieldBinding` (`index.tsx`). But unlike every sibling bound input that routes
through `Field/Shell` (which wires `aria-required` / `aria-invalid` / a `role="alert"` error
region / a required indicator from the form engine + schema), RadioGroup rendered a bare
`role="radiogroup"` with **none** of that. Consequences inside a `<Form>`:

- **Error Identification (3.3.1) / Name-Role-Value (4.1.2):** a required group that fails
  validation on submit gave the user **zero per-field feedback** — no `aria-invalid`, no error
  text, nothing announced. The engine knew the field was invalid; the field never surfaced it.
- **Labels or Instructions (3.3.2):** a required group had no required indicator and no
  `aria-required`, so neither sighted nor AT users could tell a selection was mandatory before
  submitting.

**Why not just wrap it in `Field/Shell`?** `FieldShell` renders a single `<label htmlFor={inputId}>`
that fronts ONE control — semantically wrong for a radiogroup, whose heading must be an
`aria-labelledby` target over *many* radios, and it would also emit a second, conflicting
`data-component`/`data-field-name` selector pair. So the affordance was built **directly into
RadioGroup**, deriving error/required the same way FieldShell does (explicit prop wins; else the
engine error + schema-required for this `name` when bound), and attaching them to the
semantically correct `role="radiogroup"` element.

**Root cause:** the component bound its *value* to the form engine but never bound its
*validation state*. Fix (all in-directory, `index.tsx` + `RadioGroup.module.css`): additive
`required` / `error` / `helperText` props; `aria-required` + `aria-invalid` +
`aria-describedby` on the radiogroup; an aria-hidden required indicator on the heading; and a
single error/helper region (`role="alert"` + `aria-live="polite"` while invalid) linked via
`aria-describedby`. The prior pass had parked this as "Deferred — needs edits outside the
directory," which was wrong: the fix is entirely in-directory.

### Issue 1 — `display: none` removes the radios from the a11y tree and keyboard order (Critical)

The native `<input type="radio">` was styled `display: none` (`.input`), used only so its
`:checked` sibling selector could drive the decorative ring/dot. `display: none` (like
`visibility: hidden`) **removes the element from the accessibility tree AND the tab order**.
Consequences:

- **Keyboard (2.1.1):** the group was **completely non-operable by keyboard** — you could
  not Tab to any radio, and Arrow/Space did nothing. The only way to change the selection
  was a mouse click on the label. A keyboard or switch-device user could not use the control
  at all.
- **Name/Role/Value (4.1.2):** with the inputs gone from the a11y tree, a screen reader saw
  **no radios** — no `radio` role, no checked state, no per-option name. The "selected"
  option was conveyed purely by the CSS-filled ring, i.e. **visually only**.

**Root cause:** the state that AT and keyboard depend on lived on an element that was
removed from the a11y tree. Fix: keep the native input in the tree (visually-hidden, still
focusable) instead of `display: none`.

### Issue 2 — No visible keyboard focus indicator (Serious)

A direct corollary of Issue 1: with the input `display:none` there was nothing to focus,
and the module contained **no `:focus-visible` rule of any kind**. Once the input is
restored to the tab order it is clipped to 1px, so its own browser focus ring is painted
off-screen — a keyboard user would still have zero indication of which radio held focus.
Fails 2.4.7 (a visible focus indicator must exist) and 2.4.11 (it must be perceivable).

### Issue 3 — Radiogroup can have no accessible name (Moderate)

`aria-labelledby={\`${name}-label\`}` was emitted **unconditionally**, pointing at the
`<label id>` whose content is `{labelText || label}`. Both props are optional, so a
consumer rendering `<RadioGroup name="x" options={…} />` produced an **empty** label
element → the group's computed accessible name was the empty string → the radiogroup was
effectively unnamed (1.3.1 / 4.1.2), while still emitting a dangling id reference.

### Issue 4 — Group heading was an orphan `<label>` (Minor)

The group heading was a real HTML `<label>` element with no `htmlFor`/wrapped control — an
orphan label. `<label>` semantically implies association with a single form control; for a
*group* heading the correct element is a plain text element referenced by the group's
`aria-labelledby`. Orphan `<label>`s are flagged by HTML/a11y validators and can confuse AT.

## Hearing

No `Audio`, `AudioContext`, `<audio>`/`<video>`, `navigator.vibrate`, or `speechSynthesis`
usage anywhere in the component (grep clean). No information is conveyed by sound, so WCAG
1.2.x / 1.4.2 do not apply. **No issues.**

## Reading & screen reader

- **Semantic HTML:** real native `<input type="radio">` inside real `<label>`s — the ideal
  APG implementation (no `role="radio"` divs). Kept as-is; the fix only stopped hiding them
  from the tree.
- **Accessible name (per option):** each `<input>` is wrapped by its `<label>`, whose text
  span (`option.label`) supplies the accessible name. The decorative ring/dot span is now
  `aria-hidden="true"` so it cannot leak into the name. Verified by the new story resolving
  each control via `getByRole('radio', { name: 'Option N' })`.
- **Accessible name (group):** `role="radiogroup"` + `aria-labelledby` → the visible group
  heading. **Fixed** (Issue 3) so `aria-labelledby` is only emitted when heading text
  actually exists.
- **Keyboard interaction:** restored to the full native radiogroup contract for free once
  the inputs are back in the tab order — single Tab stop into the group landing on the
  checked radio (or the first when none checked), Arrow keys roving selection, Home/End,
  Space. No custom key handling needed or added. Verified by the `A11y/Keyboard Navigation`
  story (Tab focuses the checked radio, ArrowDown moves the selection).
- **Focus visible:** **Fixed** (Issue 2) — `:focus-visible` outline mirrored onto the
  visible outer ring, per theme.
- **State never color-alone (1.4.1):** the checked option is conveyed by the native radio's
  programmatic `checked` state (now exposed to AT) **plus** the filled ring / inner dot —
  not color-only.
- **Validation (3.3.1 / 3.3.2 / 4.1.2):** **Fixed** (Issue 6) — when bound inside a `<Form>`
  (or given explicit `required`/`error` props), the `role="radiogroup"` exposes `aria-required`
  and `aria-invalid`, the heading shows a required indicator, and the validation message renders
  in a `role="alert"` + `aria-live="polite"` region the group references via `aria-describedby`.
  The invalid state is programmatic, not color-only. Verified by the two new bound/standalone
  stories.
- **Motion:** `@media (prefers-reduced-motion: reduce)` was already present and remains;
  the new focus treatment uses a static `outline` (not animated), so reduced-motion is
  unaffected. WCAG 2.3.3 satisfied.

## SEO semantics

RadioGroup is a form control group, not a heading/landmark/link/list/table, so the
SEO-semantic checklist items (real `<h1-6>`, landmarks, `<a href>`, lists/tables) do not
apply. A group *heading* is a label, not a document heading, so no `headingLevel` prop is
warranted — the APG `aria-labelledby` labelling is the correct mechanism and is now
correctly conditional. All controls render as real `<input>`/`<label>` in SSR HTML with no
client-only injection of primary content. **No issues.**

## Fixes applied

1. **Radios kept in the a11y tree + tab order (Issue 1)** — replaced `.input { display: none }`
   with the visually-hidden-but-accessible clip pattern (`position: absolute; width/height:
   1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; border: 0`). The input
   takes no layout space yet stays focusable and in the a11y tree; the `~` sibling selectors
   that drive the ring/dot are unaffected (general-sibling matching is DOM-order based, not
   layout based). Added `position: relative` to `.optionLabel` so the clipped input scopes to
   its own row. (Used `clip-path` alone — stylelint's `property-no-deprecated` rejects the
   legacy `clip` property, and `clip-path: inset(50%)` covers all modern targets.)
2. **Keyboard focus ring (Issue 2)** — added a `FOCUS-VISIBLE` section:
   `.input:focus-visible ~ .radioSpan .radioOuter` gets `outline: 2px solid` +
   `outline-offset: 2px`, using the solid theme primaries (`--goobs-light-primary` /
   `--goobs-dark-primary` / `--goobs-gold`) via per-theme overrides — matching the sibling
   Checkbox component's established pattern. `:focus-visible` (not `:focus`) shows the ring
   for keyboard users only; `outline` (not `box-shadow`) avoids colliding with the checked/
   hover background.
3. **Group name only when labelled (Issue 3)** — compute `groupLabel = labelText || label`
   once; render the heading element and emit `aria-labelledby` only when `groupLabel` is
   truthy, otherwise `aria-labelledby={undefined}` (no dangling empty reference).
4. **Orphan label → span (Issue 4)** — the group heading is now a `<span id>` (still
   `className={formLabel}`, still referenced by `aria-labelledby`) instead of a `<label>`.
   `.formLabel` already sets `display: block`, so the rendering is visually identical.
5. **Decorative ring/dot hidden (hardening)** — added `aria-hidden="true"` to the presentational
   `.radioSpan` so the graphic representation cannot add screen-reader noise or leak into the
   per-option name; the native input already conveys checked state.
6. **Light unchecked-ring contrast (Issue 5, 2026-07-11, commit `25a01498`)** — light default
   `--rg-radio-border-color` changed from `var(--goobs-light-border-strong)` (#cbd5e1, 1.48:1)
   to `var(--goobs-light-text-muted)` (#4b5563, 7.56:1). Dark/sacred unchanged (already ≥3:1);
   checked/hover/focus already use primary. No public API or markup change.
7. **Validation affordance (Issue 6, 2026-07-11)** — three ADDITIVE optional props on
   `RadioGroupProps`: `required?: boolean`, `error?: string | boolean`, `helperText?: ReactNode`.
   `index.tsx` now reads the optional form context (`useOptionalFormContext`) and derives
   `error` (from `engine.getError(name)`) and `required` (from `deriveRequiredFromSchema`) when
   bound and the prop is omitted — an explicit prop, including `false`/`''`, always wins,
   mirroring FieldShell's precedence exactly. Rendered additions: an aria-hidden
   `.requiredIndicator` (` *`) on the heading; `aria-required` / `aria-invalid` /
   `aria-describedby` on the `role="radiogroup"` (all emitted only when truthy — never
   `aria-*="false"`, matching the FieldShell selector discipline); `data-state="error"` on the
   root; and a single `.helper` region (`role="alert"` + `aria-live="polite"` while invalid,
   `data-helper-type="error"`) below the group. New CSS tokens `--rg-required-indicator-color`
   / `--rg-error-color` per theme point at the same audited `--goobs-{light,dark,sacred}-danger-text`
   grades FieldShell uses (light #b91c1c 6.47:1 on white; dark #f87171; sacred #ef4444 5.13:1 on
   near-black — all ≥4.5:1 as text on their theme surface).

No public API change (only additive props): no prop renamed/removed/retyped, no export changed.
The rendered markup changes are the group heading element (`<label>` → `<span>`, both
structural), an additive `aria-hidden` decorative span, the additive `aria-required` /
`aria-invalid` / `aria-describedby` (radiogroup) + `data-state` (root) attributes, and the new
error/helper region — every existing `data-*` test selector (`data-component`,
`data-field-name`, `data-filled`, `data-inner-dot`, `data-theme`, per-option `data-has-color`),
the `role="radiogroup"`, and the forwarded first-input `ref` are all preserved. **Note:** the
existing `Components/Form/BoundFields` stories (owned by `Form/`, not this directory) bind a
`contactMethod: z.string().min(1)` RadioGroup — with this fix that group now correctly renders a
required indicator + `aria-required`, a correct additive visual change to a story I do not own
(Chromatic re-baseline expected).

## Stories updated

Added one `play`-backed regression story to `RadioGroup.stories.tsx`, matching the repo's
`storybook/test` + `within`/`userEvent`/`expect` convention:

- **`A11y/Keyboard Navigation`** — the fail-first guard for Issue 1. It asserts the
  radiogroup exposes its accessible name, `getAllByRole('radio')` returns all three options
  (this query returns `[]` against the old `display:none` markup, so it fails before the
  fix), `userEvent.tab()` moves focus into the group onto the checked radio, and
  `{ArrowDown}` moves the native selection to the next option. The story therefore exercises
  the tree-membership, tab-order, and native-keyboard behaviours all at once.

The existing `Interaction and A11y Test` story (click-to-select) is retained.

**2026-07-11 re-audit added:** `Light/No Selection` (`LightNoSelection`) — renders the group
with **no `defaultValue`**, so every radio is unchecked. No prior story exercised the
all-unchecked initial state, making this the Chromatic visual baseline that pins the Issue-5
unchecked-ring contrast fix. Its `play` test asserts the radiogroup still exposes its accessible
name, all three options are reachable unchecked `radio` roles, and the root reports
`data-filled="false"`.

**2026-07-11 adversarial re-review added (Issue 6):** two `play`-backed stories exercising the
new validation affordance (both fail against the pre-fix markup, which emitted none of it):

- **`A11y/Required + Error`** (`RequiredWithError`) — standalone, explicit `required` + `error`
  props. Asserts the radiogroup exposes `aria-required` AND `aria-invalid`, a `role="alert"`
  region carries the message and is referenced by the group's `aria-describedby`, the heading
  shows the ` *` indicator (excluded from the accessible name because it is aria-hidden), and the
  root reports `data-state="error"`. This is the Chromatic baseline for the affordance.
- **`A11y/Form Validation Error`** (`FormValidationError`) — the real bound path: a required
  RadioGroup inside a `<Form schema>` deriving required (from the schema) and error (from the
  engine) with only `name`. Asserts the pristine group is `aria-required` but not yet invalid
  (engine touched-gating), that submitting empty surfaces the field's own `role="alert"` error
  (targeted by `#shippingSpeed-helper` id, since `<Form>` also renders a form-level status
  alert), and that selecting an option clears `aria-invalid`.

Gates run per-file and passing: `bun lint:file` on `index.tsx` + `RadioGroup.stories.tsx`
(exit 0), `stylelint` on `RadioGroup.module.css` (exit 0).

## Deferred

- **Group name when neither `label` nor `labelText` is supplied.** After Issue 3's fix, an
  unlabelled group emits no `aria-labelledby` rather than a broken empty one — but it then
  has *no* accessible name. This is **not fixable inside the component**: there is no human
  text to derive a name from, and the library must not fabricate one from the machine-key
  `name` prop (which would announce e.g. "basic-radio"). Accessible-by-default is met
  whenever `label`/`labelText` is provided (the intended usage, and the case in every story).
  Consumer responsibility; no code change.
- **The prior (issues 1–4) root-cause fixes lived entirely inside the RadioGroup directory.**
  Issue 5's fix is likewise fully in-directory (RadioGroup now points its own light default at a
  compliant token).
- **Shared control-border token fails 1.4.11 library-wide (cross-cutting; out of this directory).**
  `src/styles/global.css:283` (`--goobs-light-border-strong`) **and** `:304`
  (`--goobs-light-control-border`) are both `#cbd5e1` = **1.48:1 on white**, below the 3:1 WCAG
  2.2 1.4.11 threshold for a control's visual boundary. Any component that borders an *enabled*
  control with either token on a white surface has the same failure RadioGroup had (RadioGroup
  itself is now insulated — it points its own light ring token at `--goobs-light-text-muted`).
  **Not fixable in this directory** (owned by the `src/styles` owner). Suggested change: raise the
  control-boundary token(s) to a ≥3:1 grey — e.g. `#767676` (≈4.54:1 on white) or reuse
  `--goobs-light-text-muted` (#4b5563, 7.56:1) — after sweeping consumers so nothing relied on the
  lighter hairline for a purely decorative (non-boundary) divider.
- **Group name when neither `label` nor `labelText` is supplied — unchanged from the prior pass.**
  After Issue 3's fix an unlabelled group emits no `aria-labelledby` rather than a broken empty
  one, but then has no accessible name. Not fixable in-component (no human text to derive from;
  the library must not fabricate a name from the machine-key `name`). Consumer responsibility;
  accessible-by-default is met whenever `label`/`labelText` is provided (every story does).
