# ConfirmationCodeInput — a11y audit (2026-07-11)

**Status:** FIXED

**APG pattern:** There is no dedicated WAI-ARIA APG pattern for a segmented
one-time-code / PIN entry. The component is a **labelled group of single-character
text inputs** (`role="group"` + accessible name) with auto-advance keyboard behaviour,
paired with a **status live region** (`role="status"`) for validity, and a **success
confirmation** view. It is audited against the group-of-inputs semantics, the
`status` live-region pattern, forms guidance (3.3.x / 4.1.2), and the HTML
`autocomplete="one-time-code"` best practice.

The component was already largely well-built: `role="group"` with an accessible name,
a unique `aria-label` per digit cell, `inputMode="numeric"` + `pattern`, full keyboard
handling (Arrow Left/Right, Backspace, Delete, digit keys, Enter-to-verify, paste
distribution), a visible `:focus` treatment on every cell, and a
`@media (prefers-reduced-motion: reduce)` block that already neutralises the sacred
pulse animation and every transition. The findings below are the gaps that remained.

---

## Issues found

### 1. Status indicator conveys valid/invalid by COLOUR ALONE — FIXED
- **Severity:** serious · **WCAG:** 1.4.1 Use of Color (A)
- **Where:** `ConfirmationCodeInput.module.css:291-301` + `index.tsx:404-409` (pre-fix)
- The `.statusIndicator` dot differed between states only by `background-color`
  (`--cci-status-bg` red vs `--cci-status-valid-bg` green) driven by `[data-valid]`.
  A colour-blind sighted user could not tell valid from invalid.
- **Fix:** added a `.statusIndicator[data-valid='true']::before` checkmark glyph
  (`content: '✓'`, near-black `rgba(0,0,0,0.82)` — reads on every valid background
  across light/dark/sacred, above the 3:1 non-text floor). Valid now differs by SHAPE
  (presence of a checkmark), not hue alone. `pattern: color-only-state`.

### 2. Validity change not announced to screen readers — FIXED
- **Severity:** serious · **WCAG:** 4.1.3 Status Messages (AA)
- **Where:** `index.tsx:404-409` (pre-fix)
- The status region was an **empty** `<div role="status" aria-label=…>`. `role="status"`
  announces changes to the region's *text content*; here the only cue was a swapped
  `aria-label`, which screen readers do **not** reliably re-announce. When the code
  became valid, an AT user heard nothing.
- **Fix:** rendered the state string ("Code is valid" / "Code is invalid") as a
  **visually-hidden `<span>`** child of the live region (clip-rect sr-only inline style,
  since the library has no shared sr-only class and a new CSS-module class would need the
  build-generated `.module.css.d.ts` I may not edit). The content mutation now fires a
  `role="status"` announcement. Existing `role`, `data-valid`, and `aria-label` were
  **kept** (no attribute removed). `pattern: status-not-announced`.

### 3. Success state is silent to screen readers — FIXED
- **Severity:** serious · **WCAG:** 4.1.3 Status Messages (AA)
- **Where:** `index.tsx:330-364` (pre-fix)
- When `showSuccessState` flips true the component swaps to `.successContainer`. The
  Verify button the user activated is unmounted, so focus drops to `<body>` and the
  "Verification Successful" confirmation is never announced.
- **Fix:** added `role="status"` to the success container (matches the library's
  `EmptyState` pattern), so the message is announced when the view appears.
  `pattern: status-not-announced`.

### 4. Decorative success icon not hidden from assistive tech — FIXED
- **Severity:** minor · **WCAG:** 1.1.1 Non-text Content (A)
- **Where:** `index.tsx:341-347` (pre-fix)
- `CheckCircleOutline` renders an `<svg>` with no text alternative and no `aria-hidden`;
  the adjacent heading already says "Verification Successful", so the icon is decorative
  and adds SR noise.
- **Fix:** passed `aria-hidden="true"` + `focusable="false"` (spread onto the svg via the
  icon's `...props`). `pattern: icon-missing-aria-hidden`.

### 5. Success message heading level hardcoded (`<h3>`) — FIXED
- **Severity:** moderate · **WCAG:** 1.3.1 Info and Relationships (A), 2.4.6 Headings and Labels (AA); SEO
- **Where:** `index.tsx:348` (pre-fix)
- The success message was a fixed `<h3>`, which can produce a skipped heading level
  (e.g. `h1` → `h3`) in the consuming document outline, and the level was not
  controllable.
- **Fix:** added an additive optional `headingLevel?: 1|2|3|4|5|6` prop (default `3`,
  preserving the old `<h3>`), rendered via `` `h${headingLevel}` as ElementType `` — the
  same convention as `EmptyState`/`Card`/`Accordion`. Prop named `headingLevel` for
  library-wide consistency. `pattern: nonsemantic-heading`.

### 6. Form-engine validation error not exposed on the inputs — FIXED (programmatic half)
- **Severity:** moderate · **WCAG:** 4.1.2 Name, Role, Value (A); 3.3.1 Error Identification (A)
- **Where:** `index.tsx:321-328, 396-398` (pre-fix)
- When form-bound, `engineError` surfaced only as `data-error='true'` on the root; the
  digit cells got `aria-invalid` **only** if the caller passed the prop, so a bound
  field's validation failure was invisible to AT.
- **Fix:** the inputs now derive `aria-invalid` from the engine error by default
  (`ariaInvalid ?? (engineError ? true : undefined)` — an explicit caller `false` is
  preserved). The *visible error text + `aria-describedby`* half is intentionally out of
  scope (the component renders no error UI by contract) — see Deferred.
  `pattern: form-error-not-associated`.

### 7. No `autocomplete="one-time-code"` on the code cells — FIXED (enhancement)
- **Severity:** minor · **WCAG:** 1.3.5 Identify Input Purpose (AA, best-practice for OTP)
- **Where:** `index.tsx:382-401` (pre-fix)
- The inputs offered no platform SMS/authenticator autofill, raising manual-entry effort
  (a cognitive-load / mobile concern).
- **Fix:** first cell gets `autoComplete="one-time-code"` (the multi-char value is then
  distributed across cells by the existing `handleInputChange`); the remaining cells get
  `autoComplete="off"` so browsers don't surface unrelated suggestions per box.
  `pattern: null`.

### 8. Per-cell accessible name lacked total count — FIXED (enhancement)
- **Severity:** minor · **WCAG:** 4.1.2 Name, Role, Value (A)
- **Where:** `index.tsx:396` (pre-fix)
- Each cell was named "… digit N"; adding the total ("… digit N of M") aids orientation.
- **Fix:** `aria-label` is now `` `${label} digit ${index + 1} of ${codeLength}` ``.
  `pattern: null`.

### 9. Auto-focus of the first cell on mount — NOTED, no change
- **Severity:** minor · **WCAG:** 2.4.3 Focus Order / 3.2.1 On Focus (A)
- **Where:** `index.tsx:181-193`
- The component focuses the first cell ~100 ms after mount. For a dedicated code-entry
  surface this is a conventional, helpful affordance and the parent controls when the
  component mounts, so it is not treated as a defect. Left as-is (an opt-out prop would
  expand the API without clear demand). `pattern: null`.

---

## Hearing
Grepped the component for `Audio`/`AudioContext`/`<audio>`/`<video>`/`navigator.vibrate`
— **none present** (`SacredGlyphs` returns `null`; the only "media" is a CSS opacity
pulse on decorative dots, already gated by `prefers-reduced-motion`). No information is
conveyed by sound, so there is no hearing-impaired gap (1.2.x / 1.4.2 not implicated).
Validity/success feedback is visual (dot colour + checkmark, success screen) **and**
programmatic (`role="status"` live regions added in fixes 2–3).

## Reading & screen reader
- Group semantics: `role="group"` + accessible name (`aria-label` default "Confirmation
  Code") — good, unchanged.
- Every digit cell has a unique accessible name, now including the total (fix 8).
- Live regions: validity (fix 2) and success (fix 3) are now announced; the success icon
  is hidden (fix 4); form errors expose `aria-invalid` (fix 6).
- Colour independence: valid state now carries a checkmark shape (fix 1); disabled uses
  native `disabled` + `data-disabled`; these states are not colour-only.
- Focus: each cell has a strong visible `:focus` indicator (2px border + box-shadow +
  scale) with `outline:none` replaced by that treatment — an acceptable visible indicator
  (2.4.7). No overlay/dialog in this component, so no focus-trap/Escape obligations.
- Keyboard: full arrow/Backspace/Delete/Enter/paste handling was already present and
  correct; no gap.
- Motion: `@media (prefers-reduced-motion: reduce)` already neutralises the pulse
  animation and all transitions — no change needed (2.3.3).

## SEO semantics
- The success message renders as a **real heading** whose level is consumer-controllable
  (fix 5), so it participates correctly in the SSR'd document outline instead of being a
  fixed `<h3>` that could skip a level.
- No links, tables, lists, or landmark-worthy regions exist in this component, so no
  further landmark/`<a href>`/list conversions apply. All meaningful content
  (digit cells, status text, success message) is present in the server-rendered HTML —
  no client-only injection of primary content.

## Fixes applied
1. Checkmark glyph on the valid status dot (non-colour cue) — CSS.
2. Visually-hidden state text inside the `role="status"` dot so validity changes announce.
3. `role="status"` on the success container so the confirmation announces.
4. `aria-hidden="true"` + `focusable="false"` on the decorative success icon.
5. Additive `headingLevel?: 1|2|3|4|5|6` prop (default 3) for the success message.
6. Inputs derive `aria-invalid` from the form-engine error by default.
7. `autocomplete="one-time-code"` on cell 0, `off` on the rest.
8. Per-cell `aria-label` now includes "… of `codeLength`".

## Stories updated
Added three stories to `ConfirmationCodeInput.stories.tsx` (the repo's only regression
test — Storybook + Chromatic):
- **ValidState** — `isValid` true, non-success: exercises the green dot + checkmark glyph
  and the "Code is valid" live-region text.
- **DisabledState** — `styles.disabled`: exercises `data-disabled` + native `disabled`.
- **CustomHeadingLevel** — success state with `headingLevel: 2`: exercises the real
  `<h2>` render path.

## Deferred
- **Visible form-error text + `aria-describedby`** (WCAG 3.3.1 / 3.3.3): the component
  intentionally renders no error UI of its own (per the universal-form contract, error
  text is FieldShell's responsibility). This component uses `useFieldBinding` directly
  and is **not** wrapped in `FieldShell`, so a bound `engineError` has no visible/linked
  message — only the `aria-invalid` + `data-error` signals (fix 6). Fully closing this
  would require either wrapping the component in `FieldShell` or rendering a linked error
  region, a shared-architecture decision outside this component's directory.
  - **File:** `src/components/Field/Shell/index.tsx` (error region at lines ~407-417) and
    `src/components/Form/*` — **not owned here.**
  - **Suggested change:** expose the same helper/error region + `aria-describedby`
    wiring FieldShell already renders (`role="alert"` + `aria-live="polite"`) to
    non-FieldShell field primitives like this one, or document that
    ConfirmationCodeInput must be composed inside a FieldShell when form-bound so the
    engine error is surfaced and linked.
