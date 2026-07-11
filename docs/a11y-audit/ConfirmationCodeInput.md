# ConfirmationCodeInput — a11y audit (2026-07-11)

**Status:** FIXED (initial pass + adversarial-review follow-ups; no open WCAG gaps)

> **Adversarial-review follow-ups (2026-07-11, 2nd pass).** A review of the initial
> pass found five remaining issues; all are now fixed at root cause. Summary at the
> bottom (["Adversarial review follow-ups"](#adversarial-review-follow-ups)); the
> initial-pass sections below are updated inline where a follow-up superseded them.
> The formerly-Deferred Level-A **3.3.1 Error Identification** gap is now **closed**
> in the component itself (a linked `role="alert"` error region), so the header no
> longer overclaims.

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
  **visually-hidden `<span>`** child of the live region. The content mutation now fires a
  `role="status"` announcement.
  - **2nd-pass update:** the sr-only span now uses the `.srOnly` **CSS-module class**
    (not an inline-style object — follow-up F5), and the dot's `aria-label` was **dropped**
    (follow-up F4) so the content is the sole announcement source. `role` + `data-valid`
    are kept. `pattern: status-not-announced`.

### 3. Success state is silent to screen readers — FIXED
- **Severity:** serious · **WCAG:** 4.1.3 Status Messages (AA)
- **Where:** `index.tsx:330-364` (pre-fix)
- When `showSuccessState` flips true the component swaps to `.successContainer`. The
  Verify button the user activated is unmounted, so focus drops to `<body>` and the
  "Verification Successful" confirmation is never announced.
- **Fix:** added `role="status"` to the success container so the message is announced
  when the view appears.
  - **2nd-pass update (SUPERSEDED):** a region injected together with its content is
    unreliable (NVDA/JAWS miss it). Replaced by a **persistent, always-mounted** live
    region shared across both branches; the container's `role="status"` was **removed**
    (follow-up F1). `pattern: status-not-announced`.

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

### 6. Form-engine validation error not exposed on the inputs — FIXED (now fully, both halves)
- **Severity:** moderate · **WCAG:** 4.1.2 Name, Role, Value (A); 3.3.1 Error Identification (A)
- **Where:** `index.tsx:321-328, 396-398` (pre-fix)
- When form-bound, `engineError` surfaced only as `data-error='true'` on the root; the
  digit cells got `aria-invalid` **only** if the caller passed the prop, so a bound
  field's validation failure was invisible to AT.
- **Fix (initial pass):** the inputs derive `aria-invalid` from the engine error by
  default (`ariaInvalid ?? (engineError ? true : undefined)` — an explicit caller `false`
  is preserved).
- **Fix (2nd pass — the previously-deferred half, now done):** when form-bound and the
  engine reports an error, the component now renders its OWN visible, linked
  `role="alert"` error region (`.errorMessage`), and every digit cell references it via
  `aria-describedby`. This closes the Level-A **3.3.1** gap for the component's documented
  `useFieldBinding`-standalone mode WITHOUT depending on a `FieldShell` wrapper. See
  follow-up #2 below. `pattern: form-error-not-associated`.

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
Added four stories to `ConfirmationCodeInput.stories.tsx` (the repo's only regression
test — Storybook + Chromatic):
- **ValidState** — `isValid` true, non-success: exercises the green dot + checkmark glyph
  and the "Code is valid" live-region text.
- **DisabledState** — `styles.disabled`: exercises `data-disabled` + native `disabled`.
- **CustomHeadingLevel** — success state with `headingLevel: 2`: exercises the real
  `<h2>` render path.
- **FormBoundValidationError** (2nd pass) — wraps the component in a `<Form>` with a
  `.length(6)` schema and a submit button; a **play function** submits the empty field and
  asserts every digit cell flips `aria-invalid="true"`, a linked `role="alert"` message
  appears with the schema text, and each cell's `aria-describedby` points at that alert's
  `id`. Pins the whole engine-error → linked-error contract (follow-up #2/#3).

## Deferred
_None as WCAG gaps._ The initial-pass Deferred item (visible form-error text +
`aria-describedby`) is **now implemented in-component** (follow-up #2), so there is no
open Level-A gap. One non-blocking architectural note remains for the library owners:

- **Optional shared consolidation (not a gap):** the linked `role="alert"` + `aria-live`
  error region this component now renders itself is the same shape `FieldShell` already
  renders (`src/components/Field/Shell/index.tsx`, ~407-417). A future refactor *could*
  expose FieldShell's error/`aria-describedby` wiring to non-FieldShell primitives so it
  isn't duplicated per component — but that is a shared-architecture cleanup outside this
  directory, **not** a correctness gap. This component does **not** compose `FieldShell`
  and is not documented to be wrapped in one, so there is no double-error-render in its
  supported usage.
  - **File:** `src/components/Field/Shell/index.tsx`, `src/components/Form/*` — **not owned here.**

<a id="adversarial-review-follow-ups"></a>
## Adversarial review follow-ups (2026-07-11, 2nd pass)

All five review findings fixed at root cause, within this component's directory.

### F1. Success live region injected together with its content — FIXED (moderate, 4.1.3)
- The success branch mounted a fresh `<div role="status">` whose text was already inside
  it, which NVDA/JAWS frequently do **not** announce (a live region must pre-exist).
- **Fix:** both render branches now share a fragment root carrying a **persistent,
  always-mounted** visually-hidden `role="status" aria-live="polite"` region. The
  confirmation is written into that pre-existing region as a **content mutation** on the
  input→success transition (via React's adjust-state-during-render pattern — previous
  `showSuccessState` held in state, no effect — the exact mechanism `SaveButton` uses for
  its busy-state region). The success container's own `role="status"` was **removed**
  (markup change) so the announcement has one reliable source and does not double-announce.
  `index.tsx` persistent-announcer + `successAnnouncement`.

### F2. 3.3.1 Error Identification fails in form-bound-but-not-FieldShell mode — FIXED (moderate, 3.3.1)
- On a bound validation failure the cells got `aria-invalid="true"` with no
  `aria-describedby`/visible text — "invalid" six times with no explanation.
- **Fix:** the component now renders its own visible, linked error region
  (`role="alert" aria-live="polite"`, `.errorMessage`, theme-graded `--cci-error-color`
  ≥4.5:1) whenever the engine reports an error, and every digit cell gets
  `aria-describedby={errorRegionId}` (stable `useId()`). Closes the Level-A gap in the
  component's own supported mode. (This is the previously-Deferred half of finding 6.)

### F3. New engine-error → aria-invalid behavior had no story — FIXED (minor)
- **Fix:** added the **FormBoundValidationError** story with a `<Form>` + failing zod
  schema and a play function asserting `aria-invalid` on the cells, the `role="alert"`
  text, and the `aria-describedby` wiring (see Stories updated).

### F4. Status dot carried BOTH an `aria-label` and duplicate sr-only content — FIXED (minor)
- A live region with an `aria-label` fixes its accessible name and makes the inner
  content-mutation announcement inconsistent across AT.
- **Fix:** removed the dot's `aria-label` (markup change); the visually-hidden text
  content is now the sole name + announcement source. `role="status"` + the sr-only text
  child are kept.

### F5. sr-only text used an inline-style object instead of a CSS class + report overclaim — FIXED (minor)
- Commit `5dc240b3` had deleted the working `.statusText` CSS class and replaced it with
  a `STATUS_TEXT_SR_ONLY` inline-style object, deviating from the "style via `.module.css`
  + className" convention.
- **Fix:** restored a CSS-module class (`.srOnly`, matching `Button/SaveButton`'s name and
  `CodeCopy`'s modern `clip-path: inset(50%)` recipe — stylelint-clean, unlike the legacy
  `clip: rect()`), used by both the status-dot text and the persistent success announcer;
  deleted the inline-style object. The stale co-located `ConfirmationCodeInput.module.css.d.ts`
  (a gitignored build artifact present on only 2 of 91 components; it shadowed the ambient
  `Record<string,string>` typing from `src/vite-env.d.ts` and would have blocked the new
  class keys) was removed so the component types its CSS import the same way the other 89
  do. Report header overclaim ("Status: FIXED" while a Level-A gap was open) corrected —
  the gap is now genuinely closed (F2), so the header is accurate.

### Markup changes (per the additive-API rule, every DOM change noted)
- Component root is now a **Fragment** (`<>`) wrapping a persistent sr-only live region +
  the existing branch. No existing element/attribute was renamed or removed from the
  branch roots; `data-component`/`data-field-name`/`data-filled`/`data-error`/`role="group"`
  and all cell attributes are unchanged. The test-selector contract is intact.
- **Removed** `role="status"` from the success container (superseded by the persistent
  region) and `aria-label` from the status dot (finding F4). Both are a11y-improving
  replacements, not regressions, and neither is part of the Playwright selector contract.
- **Added** the `role="alert"` error region + per-cell `aria-describedby` (F2). No
  public prop was added, renamed, removed, or retyped.
