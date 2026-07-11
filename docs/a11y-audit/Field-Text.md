# Field/Text — a11y audit (2026-07-11)

**Status:** FIXED

**Scope:** the `Field/Text` sub-field — `src/components/Field/Text/index.tsx`, a
single-line `<input>` or (when `multiline`) `<textarea>` rendered through the shared
**`Field/Shell`** (`FieldShell` + `useFieldBinding`). Shell is owned by a later serial pass
and was **not modified** here; anything whose root cause is in Shell is listed under
*Deferred*.

Files reviewed: `index.tsx`, `TextField.module.css`, `TextField.stories.tsx` (and, read-only
for grounding, `Field/Shell/index.tsx`, `Field/Shell/types.ts`,
`Field/Shell/FieldShell.module.css`).

## APG pattern

Not a custom widget — this is the **native HTML text input** (`<input>` / `<textarea>`),
the semantically correct, keyboard-complete, screen-reader-supported control. The
accessibility contract is therefore the **WAI-ARIA form-field** contract, delivered mostly by
`FieldShell`:

- real `<label htmlFor>` ↔ input `id` association (accessible name) — Shell,
  `Field/Shell/index.tsx:395`;
- `aria-required` + native `required` from the required flag — Shell `inputAriaProps` +
  `index.tsx` native attrs;
- `aria-invalid` + `aria-describedby` → a `role="alert"` / `aria-live="polite"` helper region
  when an error is present — Shell, `Field/Shell/index.tsx:345-349, 407-417`.

No dialog/combobox/listbox/menu is involved, so no focus-trap / arrow-key / Escape keyboard
table applies — native text-editing keyboard behaviour is the browser's.

## Issues found

| # | Severity | WCAG | Where | Issue | Status |
|---|----------|------|-------|-------|--------|
| 1 | Moderate | 2.4.7 Focus Visible (AA) | `TextField.module.css:55-66,84-95` (`outline:none`) + `:42` (`.focused`) driven by `index.tsx:118` JS state | The inner input/textarea carry `outline: none`, and the ONLY focus indicator was the wrapper `.inputWrapper.focused` class toggled from React `isFocused` state (`onFocus`/`onBlur`). The visible focus ring was therefore contingent on JS: no CSS-native fallback existed, despite an in-code comment (`index.tsx:116-117`) claiming inputs "use `:focus-visible` selectors" — no such selector was present. | **FIXED** |
| 2 | Minor | 2.3.3 Animation from Interactions (AAA) | `TextField.module.css:33` (`transition: all 0.3s ease`) | The wrapper animates border-color + focus-glow box-shadow over 0.3s with no `prefers-reduced-motion` guard. This is the established repo convention (Field/Date, Slider, ≥30 components ship the media query); Text was an omission. | **FIXED** |
| 3 | Serious | 4.1.2 Name/Role/Value (A); 3.3.2 Labels or Instructions (A) | `index.tsx` input `:305-327` / textarea `:283-303` | When used without a visible `label` (the `LabelsAndPlaceholders` "Placeholder Only" story, `TextField.stories.tsx:366-369`, and any bare/table/toolbar usage) the field had **no accessible name** — a placeholder is not exposed as one to assistive tech and disappears on input. There was no `aria-label` / `aria-labelledby` passthrough, so such a field was impossible to name without a visible `<label>`. | **FIXED** |

No hearing/media issues (checklist A): a grep of the directory for `new Audio` / `AudioContext`
/ `<audio>` / `<video>` / `navigator.vibrate` / `speechSynthesis` returned nothing — the
component emits no sound and conveys no information via audio. No SEO/heading/landmark issues
(checklist C): it renders a form control only (no headings, links, or landmark content); the
`<label>`, input, and helper text are all SSR-present, and the `useEffect` native-input
listener (`index.tsx:168-181`) is a progressive enhancement that injects no content.

## Fixes applied

**Hearing** — none required (no audio surface).

**Focus visibility (checklist B — Focus)**

- **#1** (`TextField.module.css`): every `.inputWrapper.focused` rule now also matches
  `.inputWrapper:focus-within` — base (sacred), `[data-theme='light']`, and
  `[data-theme='dark']` blocks. The focus ring is now **pure CSS and
  hydration-independent**, matching FieldShell's own `.inputSlot:focus-within` pattern
  (`Field/Shell/FieldShell.module.css:155`). `:focus-within` fires on any focus (mouse or
  keyboard), identical to the pre-existing JS `.focused` behaviour, so there is **no visual
  regression** — it just guarantees the ring even if JS state never applies. The JS
  `onFocus`/`onBlur` handlers are retained (they also run the consumer callbacks and
  `bindingOnBlur`); both paths resolve to the same declarations, so they are idempotent.

**Motion (checklist B — Motion)**

- **#2** (`TextField.module.css`, end of file): added
  `@media (prefers-reduced-motion: reduce) { .inputWrapper { transition: none; } }`. The
  focus/error/disabled state changes still apply — they snap instead of animating.

**Accessible name (checklist B — Accessible NAME / Forms)**

- **#3** (`index.tsx`): added two **additive**, JSDoc'd props —
  `ariaLabel?: string` → forwarded as `aria-label`, and `ariaLabelledby?: string` → forwarded
  as `aria-labelledby` — on **both** the `<input>` and `<textarea>`. They are spread *before*
  `{...inputAriaProps}` so FieldShell's `aria-*` wiring (required/invalid/describedby) stays
  authoritative. Default `undefined` → React omits the attribute, so **every existing callsite
  renders byte-for-byte identically**; only label-less usages gain a name. No existing prop was
  renamed/removed/retyped; `data-field-name` / all `data-*` / role / aria attributes are
  untouched, preserving the Playwright selector contract.

**Markup change note:** the only rendered-DOM change is the two new `aria-label` /
`aria-labelledby` attributes, emitted **only** when the corresponding prop is set. No element
type changed; the input/textarea, wrapper `<div>`, and adornment `<div>`s are unchanged.

## Stories updated

Stories are the only regression tests in this repo; each new behaviour is now pinned
(`TextField.stories.tsx`):

- **`AccessibleNameWithoutLabel`** (new) — renders an `ariaLabel` field (no visible label) and
  an `ariaLabelledby` multiline field named by a sibling `<span id>`. The `play` test asserts
  each is reachable **by name** via `getByRole('textbox', { name })` (only passes when the
  accessible name is wired), checks the forwarded attributes, and confirms typing still works.
  This is the direct regression guard for fix #3.
- **`FocusVisibleIndicator`** (new) — focuses the input and asserts `toHaveFocus()` plus that
  the wrapper (`input.parentElement`) enters `:focus-within` via `wrapper.matches(':focus-within')`
  — the CSS-native focus-ring hook from fix #1.
- **`ReducedMotion`** (new) — renders sacred + light fields with JSDoc explaining the
  `prefers-reduced-motion` behaviour; the Chromatic baseline captures the rendered result (the
  media query itself can't be toggled inside a `play` function).

## SEO semantics

Nothing to change. This is a form control, not heading/landmark/list/link/table content; there
is no client-only injection of primary content — label, input, and helper text are all in the
SSR'd HTML.

## Deferred

Root cause outside `Field/Text` (in `Field/Shell`, owned by a later serial pass). Nothing here
is a functional gap for the common (labelled) case — these are Shell-level hardening items.

- **`aria-describedby` only set when a helper/error message is present.**
  `Field/Shell/index.tsx:349` adds `aria-describedby` only when `showHelper` is true. A field
  with persistent *instructions* passed some other way, or a description that should always be
  announced, has no seam here. This is by design for the current API, but a composite/consumer
  wanting a permanent description can't supply one through Text today.
  - **Suggested change (Shell owner):** accept an optional `describedById?: string` on
    `FieldShellProps` (`Field/Shell/index.tsx:~141`) and merge it into the
    `aria-describedby` built at line 349. Additive, back-compatible.

- **`aria-disabled` + native `disabled` both applied to the input when disabled.** Shell's
  `inputAriaProps` sets `aria-disabled` (`Field/Shell/index.tsx:347`) and Text also sets the
  native `disabled` attribute (`index.tsx:293,317`). A natively disabled input is already
  removed from the a11y tree, so `aria-disabled` on the same element is redundant (harmless, but
  noise). Not fixable from this directory without changing Shell's `inputAriaProps` contract —
  and the contract note says Shell deliberately omits `aria-disabled="false"`, so the value is
  never wrong, only redundant.
  - **Suggested change (Shell owner):** omit `aria-disabled` from `inputAriaProps` for elements
    that also receive the native `disabled` attribute (or document that consumers pass one or the
    other). Low priority — cosmetic only.

- **`autoComplete` / `inputMode` not forwardable (WCAG 1.3.5 Identify Input Purpose, AA).**
  Text has no `autoComplete` passthrough, so a consumer collecting name/email/etc. cannot set the
  autofill token needed for 1.3.5. This one *is* in my directory to add, but it is a value only
  the consumer can supply correctly (the component can't infer purpose) and is orthogonal to the
  accessible-by-default fixes above; flagged as a follow-up additive prop rather than fixed in
  this pass to keep the change surface focused. **Suggested change (this directory, follow-up):**
  add `autoComplete?: string` + `inputMode?: string` passthrough props on the input/textarea.
