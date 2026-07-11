# Field/Password — a11y audit (2026-07-11)

**Status:** FIXED

**Scope:** the `Field/Password` sub-field — `src/components/Field/Password/index.tsx`, a
masked `<input>` with an overlaid show/hide **eye toggle button**, rendered through the shared
**`Field/Shell`** (`FieldShell` + `useFieldBinding`). Shell is owned by a later serial pass and
was **not modified**; anything whose root cause is in Shell is listed under *Deferred*.

Files reviewed: `index.tsx`, `Password.module.css`, `PasswordField.stories.tsx` (and, read-only
for grounding, `Field/Shell/index.tsx`, `Field/Shell/FieldShell.module.css`,
`Icons/ShowHideEye.tsx`, `Icons/iconA11y.ts`, plus the sibling `Field/USD` and `Field/Percentage`
CSS and `Field/Signature` live-region pattern for convention parity).

## APG pattern

Two combined patterns:

1. The field itself is the **native HTML password input** (`<input type="password">`) — the
   semantically correct, keyboard-complete, screen-reader-supported control. Its contract is the
   **WAI-ARIA form-field** contract delivered mostly by `FieldShell`: real `<label htmlFor>` ↔
   input `id` (accessible name, `Field/Shell/index.tsx:395`), `aria-required` + native `required`,
   and `aria-invalid` + `aria-describedby` → a `role="alert"` / `aria-live="polite"` helper region
   on error (`Field/Shell/index.tsx:345-349, 407-417`).
2. The show/hide eye is a **toggle button** (WAI-ARIA APG *Button > Toggle*): a native `<button>`
   that flips a boolean and must expose that on/off state via **`aria-pressed`**, plus a stable
   accessible name. No dialog/combobox/listbox/menu is involved, so no focus-trap / arrow-key /
   Escape table applies — native text editing and native button Enter/Space are the browser's.

## Issues found

| # | Severity | WCAG 2.2 | Where | Issue | Status |
|---|----------|----------|-------|-------|--------|
| 1 | Serious | 2.4.7 Focus Visible (AA); 2.4.11 Focus Appearance (AAA) | `Password.module.css:25` (`.input { outline:none }`) + `:54` (`.eyeButton { outline:none }`) | **Neither** the input nor the eye toggle had ANY keyboard-focus indicator. The input carries its own border but the native outline was reset with **no `:focus-visible` replacement anywhere in the module**; the eye button reset its outline too. A keyboard user tabbing input → toggle saw no focus move at all. | **FIXED** |
| 2 | Moderate | 4.1.2 Name, Role, Value (A); 1.4.1 Use of Color (A) | `index.tsx` toggle `<button>` (pre-fix ~185–197) | The show/hide button flipped `passwordVisible` but exposed **no programmatic toggle state** — on/off was conveyed only by the eye-icon shape and the inverting `aria-label`. AT that doesn't describe the (decorative, `aria-hidden`) SVG, and any consumer relying on a state attribute, could not read the current state as a machine value. | **FIXED** |
| 3 | Moderate | 4.1.3 Status Messages (AA) | `index.tsx` (toggle handler + wrapper) | Toggling visibility changed the input's masking **silently** for screen-reader users — no live region announced "shown/hidden". | **FIXED** |
| 4 | Moderate | 1.3.5 Identify Input Purpose (AA) | `index.tsx` `<input>` | No `autoComplete` seam existed, so the field could not advertise `current-password` / `new-password` to browsers and password managers — the single biggest usability aid for cognitive and motor-impaired users on a password field. | **FIXED** |
| 5 | Minor | 4.1.2 Name, Role, Value (A); 3.3.2 Labels or Instructions (A) | `index.tsx` `<input>` | A label-less usage (`label=""`, e.g. a compact/table context) had **no way to supply an accessible name** — no `aria-label` / `aria-labelledby` passthrough. Edge case since `label` defaults to `'Password'`, but impossible to name otherwise. | **FIXED** |
| 6 | Minor | 2.3.3 Animation from Interactions (AAA) | `Password.module.css` `.input` | The focus/border transition added for #1 needed a `prefers-reduced-motion` guard to match the Field family convention (USD/Percentage/Text all ship it). | **FIXED** |

## Hearing (WCAG 1.2.x, 1.4.2)

Nothing to change. A grep of the directory for `new Audio` / `AudioContext` / `<audio>` /
`<video>` / `navigator.vibrate` / `speechSynthesis` / `.play(` returned **nothing** — the
component emits no sound and conveys no information via audio. The new visibility feedback is
delivered visually (the eye icon flips shape + the input unmasks) **and** programmatically (the
`role="status"` live region + `aria-pressed`), never audio-only.

## Reading & screen reader (WCAG 1.1.1, 1.3.1, 1.4.1, 2.1.x, 2.4.x, 3.3.x, 4.1.2, 4.1.3)

- **Accessible name.** Input: from `FieldShell`'s real `<label htmlFor>` in the common case, now
  also nameable via the additive `ariaLabel` / `ariaLabelledby` props for label-less usages
  (#5). Toggle button: a **stable** `aria-label="Show password"`.
- **Toggle state — the show/hide button (#2, #3).** Now `aria-pressed={passwordVisible}` (pressed
  = currently shown). The name is deliberately kept **stable** rather than inverting to "Hide
  password": a *pressed* button labelled "Hide password" reads as "hiding is on" while the password
  is actually *shown* — a documented contradiction between a state-inverting name and `aria-pressed`.
  Stable name + `aria-pressed` + flipping (decorative) icon + the live region is the non-contradictory
  combination. State is therefore conveyed by **shape + programmatic attribute + spoken text**, never
  color alone (1.4.1). *(Note: the repo class-lint `toggle-missing-aria-pressed` explicitly lists this
  field's prior inverting-label pattern as a legitimate escape hatch, so the component was never a lint
  violation — this is a deliberate strengthening to the full toggle-button contract per the audit
  brief, and it still satisfies the lint via the `aria-pressed` hatch.)*
- **Announcement (#3).** A visually-hidden `role="status" aria-live="polite"` region (`.srOnly`,
  modern `clip-path` idiom mirroring `Field/Signature`) speaks "Password shown" / "Password hidden"
  on toggle. It starts **empty** so it never fires on mount.
- **Icon.** `ShowHideEyeIcon` is rendered with no text alternative, so `resolveIconA11y` makes it
  `aria-hidden="true"` (decorative) — correct; the button's `aria-label` is the sole name. No change.
- **Never block paste.** Verified: no `onPaste` / `onCopy` / `onCut` handler exists — paste is
  unimpeded (essential for password managers). Pinned by a story that pastes into the field.
- **Keyboard.** Input = native text editing; toggle = native `<button type="button">` (Enter/Space
  activate; excluded from form submit). No custom keyboard model needed; nothing traps focus.
- **Focus visible (#1).** Input now shows a themed border + soft glow via `.input:focus-visible`
  (+ `[data-theme='light'/'dark']` box-shadow variants); the eye toggle gets its own
  `.eyeButton:focus-visible` outline so keyboard users can tell input vs toggle apart.
- **Error / required / disabled** are all conveyed by `FieldShell` non-visually already
  (`role="alert"` text + `aria-invalid`; `aria-required` + native `required` + visible indicator;
  `aria-disabled` + native `disabled` + dimming) — not color/asterisk-alone.

## SEO semantics

Nothing to change. This is a form control, not heading / landmark / list / link / table content.
The `<label>`, `<input>`, eye `<button>`, and the (empty) live-region `<span>` are all present in
the SSR'd HTML — no client-only injection of primary content. The `useEffect` native-input listener
(`index.tsx:92-105`) is a progressive enhancement for automation tooling that injects no content.

## Fixes applied

All in `src/components/Field/Password/` (root cause, per conventions; no Shell change required).

**Focus visibility (#1)** — `Password.module.css`:
- `.input:focus-visible` restores a focus-coloured border + soft glow, themed via the
  `--field-border-focus` / `--goobs-focus-{sacred,light,dark}` tokens the parent `.shell[data-theme]`
  cascades in (base sacred + `[data-theme='light']` / `[data-theme='dark']` box-shadow blocks).
  `:focus-visible` matches on click for a text input, so the ring shows on mouse and keyboard focus.
- `.eyeButton:focus-visible` gives the overlaid toggle its own 2px outline ring (keyboard-only).

**Toggle state + announcement (#2, #3)** — `index.tsx`:
- Added `aria-pressed={passwordVisible}` and a stable `aria-label="Show password"` on the button.
- Added an `announcement` state (empty initially) set in `togglePasswordVisibility`, and a
  `role="status" aria-live="polite"` `.srOnly` `<span>` (with a `data-password-visibility` hook)
  rendering it.

**Identify input purpose (#4)** — `index.tsx`: additive `autoComplete?: string` prop → forwarded
as the input's `autoComplete`. Default `undefined` → attribute omitted → every existing callsite
renders byte-for-byte identically.

**Accessible name without label (#5)** — `index.tsx`: additive `ariaLabel?: string` and
`ariaLabelledby?: string` props → forwarded as `aria-label` / `aria-labelledby`, spread **before**
`{...inputAriaProps}` so Shell's ARIA wiring stays authoritative. Documented as "prefer the visible
label; for label-less usages" since `aria-label` overrides a visible `<label>`.

**Reduced motion (#6)** — `Password.module.css`: added `transition: var(--goobs-transition-slow)`
to `.input` (for the focus glow) plus `@media (prefers-reduced-motion: reduce) { .input {
transition: none } }`.

**Markup changes (all additive; no existing DOM element type / prop / export / `data-*` / role /
aria attribute renamed or removed — the Playwright selector contract `data-component` /
`data-field-name` / `data-action="toggle-password"` is intact):**
- `<input>` gains `autocomplete`, `aria-label`, `aria-labelledby` — emitted only when the
  corresponding prop is set.
- toggle `<button>` gains `aria-pressed` (always) and its `aria-label` changed from a
  state-inverting ternary to the stable `"Show password"`.
- a new visually-hidden `<span role="status" aria-live="polite" data-password-visibility>` inside
  the input wrapper.

## Stories updated

Stories are the only regression tests in this repo. Four new stories in `PasswordField.stories.tsx`,
each with a `play` assertion matching the file's `storybook/test` style:

- **`AccessibleToggleState`** — resting state (masked, `aria-pressed="false"`, empty status);
  clicking the toggle flips `type` → `text`, `aria-pressed` → `true`, announces "Password shown",
  and asserts the name stays `"Show password"`; a second click reverts and announces "Password
  hidden". Direct guard for #2 and #3.
- **`FocusVisibleIndicator`** — focuses the input and asserts `input.matches(':focus-visible')`,
  then Tabs to the toggle and asserts it has focus and `matches(':focus-visible')`. Guard for #1.
- **`AccessibleNameAndPurpose`** — a `label=""` field named via `ariaLabel`, with
  `autoComplete="current-password"`; asserts both attributes are forwarded, then **pastes** into it
  and asserts the value (the "never block paste" guard). Guard for #4, #5, and paste.
- **`ReducedMotion`** — a structural CSSOM guard: `@media (prefers-reduced-motion: reduce)` is
  engine-evaluated and can't be toggled from a `play` fn, so it walks `document.styleSheets`, finds
  the reduced-motion block, and asserts it sets `transition: none` on this field's hashed `.input`
  class. Guard for #6.

## Deferred (Shell-owned — root cause outside `Field/Password`)

Both are low-priority hardening items in `Field/Shell` (owned by a later serial pass). Neither is a
functional gap for the common case.

- **D1 [minor] `aria-disabled` is redundant with native `disabled` on the input.** Shell's
  `inputAriaProps` sets `aria-disabled` (`Field/Shell/index.tsx:347`) and Password also sets the
  native `disabled` attribute (`index.tsx:209`), both on the same `<input>`. A natively-disabled
  input is already removed from the a11y tree, so `aria-disabled` is redundant noise (harmless — the
  value is never wrong; Shell deliberately omits `aria-disabled="false"`).
  - **Suggested change (Shell owner):** omit `aria-disabled` from `inputAriaProps` for elements that
    also receive the native `disabled` attribute, or document that consumers pass one or the other.

- **D2 [minor] Persistent instructions are dropped from `aria-describedby` when an error is present.**
  Shell renders a **single** helper region and lets `error` replace `helperText`
  (`Field/Shell/index.tsx:331`), and only wires `aria-describedby` when that region is shown
  (`:349`). For a password field this matters: password-composition *requirements* passed as
  `helperText` stop being in the accessible description exactly when an error appears. Not fixable
  from this directory.
  - **Suggested change (Shell owner):** accept an optional always-present `describedById?: string`
    on `FieldShellProps` merged into the `aria-describedby` at `:349`, and/or keep the instruction
    text described alongside the error. Additive, back-compatible.

## Verification

- `bun lint:file src/components/Field/Password/index.tsx` → exit 0.
- `bun lint:file src/components/Field/Password/PasswordField.stories.tsx` → exit 0.
- `bunx stylelint src/components/Field/Password/Password.module.css` → exit 0 (no token leak).
- Repo-wide typecheck / build / Chromatic are the batch gate agent's job (not run here).
