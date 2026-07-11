# Field/PhoneNumber — a11y audit (2026-07-11)

**Status:** PARTIAL (4 issues fixed in-directory; 1 deferred to the serial Field/Shell pass)

> **Update 2026-07-11 (adversarial-review pass):** placeholder contrast (issue 5) fixed
> in-directory; the label/custom-`id` divergence (issue 4) re-confirmed as genuinely Shell-owned
> and correctly deferred (the reviewer verified `FieldShellProps` exposes no `id` prop).

**Component:** `src/components/Field/PhoneNumber` — a US phone-number text input built on
`FieldShell` with a fixed, non-interactive `+1` prefix glued to the left of a `type="tel"`
input. Typing is masked to `NNN-NNN-NNNN`; `onChange` emits `'+1 555-123-4567'`.

**APG pattern:** No composite-widget pattern applies — this is a **single labeled text input**
(APG "text field" / native form-control guidance), not a combobox/dialog/etc. There is no
arrow/Home/End keyboard interaction table to satisfy; the relevant surface is native input
operability + Forms (labels, errors, required, input-purpose) + Focus Visible. The `+1` prefix
is presentational chrome (same intentional adornment pattern as `Field/USD`'s `$`), not an
interactive control.

---

## Issues found

| # | Severity | WCAG 2.2 | Location | Status |
|---|----------|----------|----------|--------|
| 1 | Serious  | 2.4.7 Focus Visible (AA); 1.4.11 Non-text Contrast (AA) | `PhoneNumber.module.css:97` (`outline: none`) + no focus rule on `.inputWrapper` | **FIXED** |
| 2 | Moderate | 1.3.5 Identify Input Purpose (AA) | `index.tsx:251` (`autoComplete={autoComplete}` — undefined by default) | **FIXED** |
| 3 | Minor    | 2.3.3 Animation from Interactions (AAA) | `PhoneNumber.module.css:24` (`transition: var(--goobs-transition-slow)`) | **FIXED** |
| 4 | Moderate | 1.3.1 Info & Relationships (A); 4.1.2 Name, Role, Value (A); 3.3.2 Labels or Instructions (A) | `index.tsx:241` (`id={id ?? inputId}`) — root cause `Field/Shell/index.tsx:291,395` | **DEFERRED** |
| 5 | Minor    | 1.4.3 Contrast — Minimum (AA) | `PhoneNumber.module.css` (no `::placeholder` rule → UA-default gray) | **FIXED** |

### 1 — No visible keyboard focus indicator (Serious) — FIXED
`.input` sets `outline: none` (`PhoneNumber.module.css:97`), removing the UA focus ring. Unlike
`Field/Text` (which nests its input in FieldShell's `.inputSlot`, whose `:focus-within` rule
supplies the ring), PhoneNumber renders its **own** `.inputWrapper`, which had **no**
`:focus-within` / `:focus-visible` treatment. Result: a keyboard user Tab-focusing the field
got **zero** visible focus indication in all three themes. (The identical shape exists in the
peer `Field/USD` — flagged as a cross-component class, not fixed here.)

**Fix:** added `.inputWrapper:focus-within { border-color + box-shadow ring }` using the shell's
per-theme `--field-border-focus` token (light-primary / dark-primary / gold), matching the
established `Number/InternalIncrement` wrapper-focus convention (`PhoneNumber.module.css`).

### 2 — Phone input has no programmatic input purpose (Moderate) — FIXED
The input is a telephone-number field but shipped with `autoComplete` undefined, so its purpose
was not programmatically determinable (fails WCAG 1.3.5 for this field, and denied users the
browser/password-manager phone autofill that aids cognitive and motor-impaired users).

**Fix:** default `autoComplete` to `'tel'` (`index.tsx` — `autoComplete={autoComplete ?? 'tel'}`);
a caller-supplied token still overrides it. Additive, no API change; JSDoc added to the prop.

### 3 — Transition not gated on prefers-reduced-motion (Minor) — FIXED
`.inputWrapper` animates `transition: var(--goobs-transition-slow)` (an `all` transition that also
animates the new focus ring's box-shadow) with no reduced-motion guard.

**Fix:** added `@media (prefers-reduced-motion: reduce) { .inputWrapper { transition: none } }`
(`PhoneNumber.module.css`). The focus ring still appears instantly for reduced-motion users.

### 4 — Label association breaks when a consumer passes a custom `id` (Moderate) — DEFERRED
FieldShell renders `<label htmlFor={inputId}>` where `inputId` is its own `useId()` value
(`Field/Shell/index.tsx:291,395`) and hands that same `inputId` to the slot. PhoneNumber sets
`id={id ?? inputId}` (`index.tsx:241`). In the **default** path (no `id`) the label is correctly
associated. But when a consumer passes a custom `id`, the input's id becomes that value while the
label's `htmlFor` still points at Shell's `inputId` — the two diverge, so the `<label>` is no
longer programmatically associated with the input (no accessible name on focus; `getByLabelText`
fails). The default is accessible; only the opt-in custom-`id` path is broken.

**Why deferred:** the root cause is in `Field/Shell` (owned by a later serial pass). Shell owns
the `<label>` and provides no way for a consumer id to reach both the label and the slot; nothing
in PhoneNumber's directory can keep them in sync without either (a) silently dropping the public
`id` prop's effect on the input (a runtime API regression) or (b) editing Shell. The identical
shape exists in every wrapper field that forwards an `id` (e.g. `Field/USD:268`).

**Suggested fix (in `Field/Shell/index.tsx`):** add an optional `id?: string` prop to
`FieldShellProps`; compute `const inputId = idProp ?? \`field-${reactId}\`` (line ~291) so the
auto-rendered `<label htmlFor={inputId}>` (line ~395) and the `inputId` passed to the slot both
use the consumer id when supplied. Then each field spreads `id={inputId}` from the slot and drops
its own `id ?? inputId` override. This fixes the whole class in one place.

**Re-confirmed by the 2026-07-11 adversarial review** as genuinely Shell-owned and correctly
deferred: `FieldShellProps` exposes no `id` prop (grep of `Field/Shell/index.tsx` returns none),
so it cannot be resolved inside this directory without either dropping the public `id` prop's
effect on the input (a runtime API regression) or editing Shell (owned by a later serial pass).
Same class in the peer `Field/USD:302`.

### 5 — Placeholder contrast not addressed (Minor) — FIXED
There was no `::placeholder` color rule in `PhoneNumber.module.css` (nor in FieldShell/global.css),
so the placeholder (`'555-555-5555'`) rendered in the UA-default gray regardless of theme — which
can fall below 4.5:1, notably on the sacred (#0e0e0e) and dark surfaces this field ships on. This
is an uncovered text-contrast gap in the field's own markup (WCAG 1.4.3).

**Fix:** added per-theme `.input::placeholder` rules (`PhoneNumber.module.css`) mirroring the
existing `.input` theme structure, each pointing at that theme's already-AA-tuned muted-text token
(the same tokens the disabled text uses): sacred `--goobs-sacred-text-muted` (`rgba(255,255,255,0.5)`
≈ 5.30:1 on #0e0e0e), light `--goobs-light-text-muted` (`#4b5563`, 6.17–7.56:1), dark
`--goobs-dark-text-muted` (`#94a3b8`, 4.76–8.19:1). `opacity: 1` resets Firefox's default
placeholder opacity so the token's proven contrast isn't silently reduced. The muted token keeps
the hint visibly lighter than entered text (`--field-text`) while staying legible. No API change.

---

## Hearing (WCAG 1.2.x, 1.4.2)
No audio, video, `AudioContext`, `<audio>/<video>`, or `navigator.vibrate` anywhere in the
component. No information is conveyed by sound. **Clean — nothing to fix.**

## Reading & screen reader (1.1.1, 1.3.1, 1.4.1, 2.1.x, 2.4.x, 3.3.x, 4.1.2)
- **Accessible name:** provided by FieldShell's real `<label htmlFor>` (default `'Phone Number'`).
  Correct in the default path; broken only via the deferred custom-`id` case (issue 4).
- **Semantic HTML:** native `<input type="tel">` — correct element and virtual-keyboard hint.
- **Required:** conveyed programmatically (`aria-required` via `inputAriaProps`) **and** visually
  (the indicator span) — not asterisk-only. Good.
- **Error text:** linked via `aria-describedby` + `aria-invalid` and announced through Shell's
  `role="alert"` + `aria-live="polite"` region. Good (spread of `inputAriaProps` verified at
  `index.tsx:253`).
- **Color-alone (1.4.1):** error state also carries text + `aria-invalid`; disabled carries native
  `disabled` + `aria-disabled` + dimming. Not color-only. Good.
- **Keyboard (2.1.1):** single native input, fully Tab-reachable and typeable; now with a visible
  focus ring (issue 1). New `FocusIndicatorTest` story Tab-reaches it and asserts the ring.
- **`+1` prefix:** a presentational `<div>` (matches `Field/USD`'s `$` adornment convention). It
  is redundant visual context, not the field's accessible name or value; left readable (not
  `aria-hidden`) so its meaning isn't stripped. Considered acceptable — no counted issue.

## SEO semantics (SSR)
- No heading text rendered (no styled `<div>`-as-heading) — nothing to promote to `<h1-6>`.
- No links, nav, lists, tables, or images/SVG/canvas in the component — no landmark/`<a href>`/
  alt-text obligations.
- All markup (label, prefix, input, helper region) is present in the SSR'd HTML; the input value
  is client state, which is correct for a form control. **Clean.**

## Fixes applied
- `PhoneNumber.module.css`: added `.inputWrapper:focus-within` themed focus ring (WCAG 2.4.7 /
  1.4.11); added `@media (prefers-reduced-motion: reduce)` guard (WCAG 2.3.3); added per-theme
  `.input::placeholder` rules using each theme's AA-tuned muted-text token + `opacity: 1`
  (WCAG 1.4.3).
- `index.tsx`: `autoComplete` now defaults to `'tel'` (WCAG 1.3.5); added prop JSDoc.

## Stories updated
- `FocusIndicatorTest` (new): Tab-reaches the input (keyboard operability) and asserts the wrapper
  box-shadow ring is absent before focus and present while focused — regression guard for issue 1.
- `AutocompleteDefault` (new): asserts the default input renders `autocomplete="tel"` and that a
  caller `autoComplete="off"` still overrides — regression guard for issue 2.
- `PlaceholderContrastTest` (new): renders the placeholder in all three themes on their matched
  surfaces (Chromatic baseline) and asserts the light field's resolved `::placeholder` color is the
  explicit muted token `rgb(75, 85, 99)` at `opacity: 1`, not the UA default — regression guard for
  issue 5.

## Deferred
- **Issue 4** (label association breaks with a custom `id`) → `Field/Shell/index.tsx:291,395`.
  Suggested change above: add `id?: string` to `FieldShellProps` and derive `inputId` from it so
  the label `htmlFor` and the slot id stay in sync. Fixes the whole wrapper-field class (also
  `Field/USD:268` and any other field forwarding `id ?? inputId`).
