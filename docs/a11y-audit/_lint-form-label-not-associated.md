# CLASS LINT: form-label-not-associated (2026-07-11)

**Status: SHIPPED — gate green, 0 violations across 464 files**

WCAG **1.3.1** (Info and Relationships) / **3.3.2** (Labels or Instructions) /
**4.1.2** (Name, Role, Value).

Class-first (T8) follow-up to the per-component a11y audit. The audit found a
visible `<label>` with no programmatic tie to its control in **2 components**:
ComplexTextEditor (label had no `htmlFor`/`id` and wrapped no input → the
textareas/contenteditable were unlabeled) and DataGrid's mobile CardField
(inline-edit native `<input>`/`<select>` named by an unassociated `<label>`).
Per T8 a bug is a CLASS until a script proves it a one-off, so this owns the
class across the WHOLE repo: a detection module + the fix of every instance it
reports.

Module: `scripts/a11y-lints/form-label-not-associated.ts`
Runner: `bun scripts/lint-a11y.ts --only form-label-not-associated`
(part of `lint:a11y` → `lint:all` — the permanent regression gate).

## The abstracted logical shape

A visible **`<label>` element** that provides **no programmatic association** to
any form control. A `<label>` only names a control when it is tied one of three
ways; the class is a `<label>` with **none** of them:

1. **Explicit id link** — `<label htmlFor={id}>` + a control with `id={id}`.
2. **Implicit nesting** — the labelable control is a DESCENDANT of the `<label>`
   (`<label><input …/> Agree</label>`); the browser links them structurally.
3. **aria-labelledby target** — the `<label>` carries an `id` that another
   element references via `aria-labelledby` (used when the control is a composite
   widget / child component that can't take `htmlFor` — the ComplexTextEditor fix
   and the RadioGroup group caption both do exactly this).

A `<label>` with no `htmlFor`, no `id`, and no labelable descendant is orphaned:
the control it visually names (a sibling `<input>` or a sibling goobs field
component) gets no accessible name from it. Sighted users read "Email *"; a
screen-reader user focusing the box hears nothing.

**Why these three, statically:** each is a self-contained signal in the label's
opening tag or its immediate subtree — no cross-file dataflow, so few false
positives. Parsing is brace/string-aware (the tag terminator inside `style={{…}}`
is not mistaken for `>`) and finds the label's MATCHING `</label>` (nesting-aware)
to inspect descendants across multi-line JSX.

## Escape hatches (encoded in the check, never a file ignore-list)

| Signal (on the `<label>` opening tag / subtree) | Why it's legitimate |
|---|---|
| `htmlFor=` (incl. dynamic `htmlFor={…}`) | explicit association attempt — FieldShell, Checkbox, SearchableHistory, CardField, most ProjectBoard labels |
| `id=` (incl. dynamic `id={…}`) | the label is an addressable `aria-labelledby`/`aria-describedby` target — ComplexTextEditor label, RadioGroup group caption |
| a **native** labelable descendant `<input>/<select>/<textarea>/<button>/<meter>/<output>/<progress>` | implicit association — Card/Checkbox/Switch/RadioGroup option labels wrap their `<input>` |
| a **goobs** field/interactive descendant (`<…Field>`, `<…Dropdown>`, `<…Editor>`, `<Checkbox>`, `<Switch>`, `<Radio…>`, …) | implicit-style association through a component that renders a real control |
| `aria-hidden="true"` on the label | decorative, out of the a11y tree |

The `id=` / `htmlFor=` matchers require a leading whitespace boundary, so
`data-grid-id="…"` does **not** satisfy the `id` hatch (a real attribute must).
Attribute-value checks (e.g. `aria-hidden="true"`) read the RAW opening tag
because the mask blanks string contents; the label discovery and descendant scan
run on a comment/string-masked copy so a `<label>`/`<input>` inside a JSDoc
example or a selector string is never flagged. Selftest: **4 bad / 10 good**
(all pass).

## Instances

| # | Severity | File:line | Status | Note |
|---|----------|-----------|--------|------|
| 1 | serious | ComplexTextEditor/index.tsx (~278) + editor inputs | FIXED (per-component) | label got `id={useId()}`, threaded as `aria-labelledby` (aria-label fallback in accordion mode) to all three editors via ComplexToolbar |
| 2 | moderate | DataGrid/MobileCardView/CardField.tsx (234) | FIXED (per-component) | inline-edit native `<input>`/`<select>` linked via `htmlFor` + a `useId()` `id` |
| 3 | moderate | DataGrid/MobileCardView/AddCard.tsx (436) | **FIXED (this pass)** | creation-card field label sat as a SIBLING of the goobs field control; no htmlFor/id/wrapped input |

**Instance 3** is the one the class-lint newly surfaced — the exact class-first
payoff. AddCard renders each field via goobs field components (TextField,
SearchableDropdown, PhoneNumberField, …) with `label=""`, and put the visible
name in a separate `<label style={cardStyles.label}>` **after** `</label>` from
the control (a sibling, not a descendant, with no `htmlFor`/`id`). Fix (additive,
uniform across every field type, **zero visual change**):

- one `useId()` base → each field's `<label>` carries `id={`${base}-${field}`}`;
- the per-field wrapper `<div>` becomes a labelled group: `role="group"` +
  `aria-labelledby={labelId}`, so the goobs control inside gets a programmatic
  accessible name via its group (WCAG 1.3.1) without per-component prop wiring.

This mirrors the in-repo group-labeling idiom (RadioGroup's `<label id>` +
`<div role="radiogroup" aria-labelledby>`, and ProjectBoard's meeting-type
radiogroup). No existing `data-*`/`role`/`aria` attribute was removed or renamed;
the `data-creation-card="true"` + `data-field-name="<field>"` test selectors are
intact (the two ARIA attributes are purely additive).

### Markup changes (per the additive-API note)

`AddCard.tsx` only: added `role="group"` + `aria-labelledby` to each field
wrapper `<div>`, and `id` to each field `<label>`; imported `useId`. No element
type changed, no prop added/removed on any public component, no visual style
touched (the label keeps `cardStyles.label`).

## Why the fix is a group label, not htmlFor+id

The controls AddCard names are **goobs field components**, not native inputs, so
CardField's `htmlFor` + `id`-on-native-input pattern doesn't apply uniformly (the
inner input's id is generated inside each component and isn't exposed). Threading
a per-field-type `ariaLabelledby` prop would name the control directly but only
TextField currently accepts it — inconsistent across the 7 field types AddCard
renders. The labelled-`role="group"` wrapper is uniform, valid for WCAG 1.3.1
(the finding's exact criterion), visually identical, and matches existing library
code, so it is the lowest-risk correct fix.

## Regression gate

The **committed lint module is the regression test** for this class (a11y-lints
README: "stays green forever after the class is fixed"; T8: "wire the detection
script into the gate"). It statically asserts label→control association across
all 464 `src/**` files every `lint:all` run — a stronger guarantee than a single
component story. No Storybook story was added: the AddCard fix is static ARIA
markup with no runtime behavior for a `play` function to exercise beyond what the
lint asserts repo-wide, and AddCard's only story surface is `DataGrid.stories.tsx`
(the DataGrid component owner's file, outside this role's directory ownership).
An optional play-function assertion on the mobile creation card is left to the
DataGrid owner — see Deferred.

## Verification

- `bun scripts/lint-a11y.ts --only form-label-not-associated` → **clean, 464 files**.
- `bun lint:file src/components/DataGrid/MobileCardView/AddCard.tsx` → exit 0.
- The detection module itself is under `scripts/` (outside the app eslint scope,
  like every sibling a11y-lint module); its own selftest is its gate and passes.

## Deferred (files not owned)

- **`DataGrid.stories.tsx`** (DataGrid component owner): optionally add a
  play-function that renders the mobile creation card and asserts each
  `[data-creation-card] [data-field-name]` wrapper has `role="group"` +
  `aria-labelledby` pointing at its `<label>`'s `id`. Not required — the class
  lint already gates the association; this would add a per-component visual/DOM
  witness. No shared-util / FieldShell / barrel change was needed for the fix.
