# Field/Signature — a11y audit (2026-07-11)

**Status:** FIXED

**Component:** `src/components/Field/Signature/index.tsx` (+ `SignatureField.module.css`, `SignatureField.stories.tsx`)

## APG pattern

There is **no exact WAI-ARIA APG pattern** for a freehand signature pad — the drawing
surface is an inherently pointer/handwriting gesture (WCAG 2.1.1 does not require a
keyboard equivalent for path-based handwriting). The relevant obligations are therefore the
generic ones for a **custom form control**:

- an accessible **name** that also exposes the field's **state** (signed vs empty) and
  **required**-ness (WCAG 1.1.1, 1.3.1, 4.1.2),
- **status announcement** on signed/cleared (WCAG 4.1.3),
- **keyboard reachability** of the field and of its controls, with a visible focus
  indicator (WCAG 2.1.1, 2.4.7),
- programmatic **error** association (WCAG 3.3.1, 4.1.2), supplied by FieldShell.

The `<canvas>` keeps `role="img"` (it is a picture of a signature); the added semantics make
that image self-describing and reachable.

## Issues found

| # | Severity | WCAG | Location | Issue | Status |
|---|----------|------|----------|-------|--------|
| 1 | serious | 4.1.3 Status Messages (A) | `index.tsx` (endStroke ~L214, handleClear ~L226) | Signing or clearing was conveyed **only by pixels appearing/disappearing** — no programmatic announcement. A screen-reader user got zero feedback that their stroke or clear took effect. | **FIXED** |
| 2 | serious | 1.1.1 (A), 1.3.1 (A), 4.1.2 (A) | `index.tsx` L266 (old `aria-label`) | The canvas accessible name was **static** (`label` or `"Signature pad"`) — it never reflected signed vs empty, and did not convey `required` (the visible `*` is `aria-hidden`, and `aria-required` is dropped by AT on `role="img"`). A blind user could not tell an empty pad from a signed one. | **FIXED** |
| 3 | serious | 2.1.1 Keyboard (A), 4.1.2 (A) | `index.tsx` `<canvas>` L261 | The canvas had **no `tabIndex`**, so it was not focusable/reachable by keyboard or AT. Tab skipped straight past the field to the Clear button — the field's name, state, and associated error (`aria-describedby`) were never announced. | **FIXED** |
| 4 | serious | 2.4.7 Focus Visible (AA) | `SignatureField.module.css` (`.clearButton`, `.canvas`) | **No `:focus-visible` treatment** in the module for the Clear button (or the now-focusable canvas); keyboard focus relied solely on whatever UA default survives resets. | **FIXED** |
| 5 | minor | 2.3.3 Animation from Interactions (AAA) | `SignatureField.module.css` L56 | `.clearButton { transition: background 0.15s ease }` had **no `prefers-reduced-motion` guard**. | **FIXED** |
| 6 | minor | 4.1.2 (A) | `Field/Shell/index.tsx:346` (NOT my dir) | FieldShell spreads `aria-required` into `inputAriaProps`; on the Signature canvas that lands on `role="img"`, where **`aria-required` is not a supported attribute** (it is a widget property, not global) so AT ignores it. Root cause is in Shell. Mitigated in-component by conveying required through the accessible name (#2). | **DEFERRED** (see below) |

## Hearing (WCAG 1.2.x, 1.4.2)

CLEAN. Grepped the component for `new Audio` / `AudioContext` / `<audio>` / `<video>` /
`navigator.vibrate` — **none**. No information is conveyed by sound. The new signed/cleared
feedback is delivered **visually** (ink + placeholder + enabled/disabled Clear button) **and
programmatically** (the `role="status"` live region and the stateful accessible name) — never
audio-only.

## Reading & screen reader (1.1.1, 1.3.1, 1.4.1, 2.1.x, 2.4.x, 3.3.x, 4.1.2, 4.1.3)

- **State is now perceivable.** The canvas accessible name is computed live:
  `"<label>[, required], signature present | no signature, draw to sign"`. A screen reader
  reading/focusing the field announces both the field identity and its current state (#2).
- **Status announced.** A visually-hidden `role="status" aria-live="polite"` region (class
  `.srOnly`) announces `"Signature captured."` on stroke-end and `"Signature cleared."` on
  clear (#1). Announcements fire on **user action only** — not on programmatic/edit-mode
  value loads — to avoid noise on mount.
- **Keyboard reachable.** The canvas is `tabIndex={0}` when enabled (`-1` when disabled), so
  keyboard/AT users reach the field, hear its name/state, and receive the FieldShell-supplied
  `aria-describedby` error text; the freehand draw itself remains pointer-only (inherent
  gesture) (#3). The **Clear** control was already a real `<button>` with a visible-text
  accessible name and is keyboard-operable.
- **Focus visible.** Added `:focus-visible` rings for both the Clear button (outward) and the
  canvas (inset `outline-offset:-2px`, because the surface uses `overflow:hidden` to clip
  strokes) (#4).
- **Error association.** Handled by FieldShell: a string `error` renders in a `role="alert"`
  region and is linked to the canvas via `aria-describedby`, with `aria-invalid` on the
  canvas (`aria-invalid` IS global, so it is valid on `role="img"`). Exercised by the new
  `WithError` story. Not colour-alone — the message text carries the meaning (1.4.1).
- **Decorative duplication removed.** The `"Sign here"` placeholder overlay is now
  `aria-hidden="true"` — the same "draw to sign" instruction is in the canvas name, so the
  overlay is no longer read as a redundant second node.
- **Required.** Conveyed programmatically through the accessible name (see #2/#6); the visible
  FieldShell `*` indicator remains `aria-hidden` (unchanged, Shell-owned).

## SEO semantics (SSR'd markup)

Largely N/A for a canvas control — a signature is client-rendered pixels with **no crawlable
text content by nature**, which is exactly why the audit requires a text alternative. That
text alternative (the stateful `aria-label` + the status region) is now present in the SSR'd
markup. No heading/landmark/list/link concerns apply to this component: it renders a labelled
form control (`<label>` via FieldShell), a `<canvas>`, a native `<button>`, and a status
region — all semantic. No `onClick` divs, no nonsemantic headings, no fake links.

## Fixes applied

All in-directory, additive, no public-API prop removed/renamed/retyped; no existing
`data-*`/`role`/`aria-*` attribute removed or renamed (the machine-test contract —
`data-field-name`, `data-action="clear"`, `role="img"`, and FieldShell's
`data-component`/`data-field-name`/`data-state`/`aria-disabled`-removal — is untouched):

1. **Status live region** (`index.tsx`): new `announcement` state; `role="status"
   aria-live="polite"` visually-hidden region; set to `"Signature captured."` /
   `"Signature cleared."` on stroke-end / clear.
2. **Stateful accessible name** (`index.tsx`): `canvasAriaLabel` folds `required` + signed/empty
   into the canvas `aria-label`.
3. **Keyboard focusability** (`index.tsx`): `tabIndex={disabled ? -1 : 0}` on the canvas.
4. **`data-signed`** on the `.surface` (mirrors FieldShell's `data-filled` on the wrapper) — an
   additive programmatic + test hook for signed state.
5. **Placeholder** marked `aria-hidden="true"` (decorative).
6. **CSS** (`SignatureField.module.css`): `.canvas:focus-visible` (inset ring),
   `.clearButton:focus-visible` (outward ring), `.srOnly` visually-hidden utility, and a
   `@media (prefers-reduced-motion: reduce)` block dropping the Clear-button transition.

## Stories updated

New stories in `SignatureField.stories.tsx`, each exercising a new a11y state (stories are the
only regression tests in this repo):

- **`RequiredEmpty`** — required + empty: stateful name `"Signature, required, no signature,
  draw to sign"`, keyboard-focusable canvas with focus ring, disabled Clear.
- **`Prefilled`** — edit-mode signed value: name reads `"…, signature present"`, Clear enabled,
  placeholder hidden. (Uses a generated valid 1×1 PNG data-URL.)
- **`WithError`** — `error` string → `aria-invalid` on the canvas + associated `role="alert"`
  message.
- **`Disabled`** — canvas out of tab order (`tabIndex=-1`), inert drawing, disabled Clear.

## Deferred (root cause outside my directory)

- **`aria-required` on a `role="img"` element (WCAG 4.1.2)** — `src/components/Field/Shell/index.tsx:346`
  (`if (required) inputAriaProps['aria-required'] = true`). FieldShell builds a generic
  `inputAriaProps` bag assuming the consumer's element is a form-widget role; when spread onto
  the Signature canvas (`role="img"`), `aria-required` is not a supported (non-global) attribute
  and is ignored by AT. I intentionally keep spreading `inputAriaProps` (per the "never remove an
  existing aria attribute" contract) and mitigate by conveying required through the canvas
  accessible name instead. **Suggested Shell change:** either (a) expose the individual pieces
  (e.g. a `required` flag on the slot) so a non-widget consumer can convey required via its name
  rather than an unsupported attribute, or (b) omit `aria-required` when the consumer signals a
  non-form-widget role. Low severity — harmless-but-invalid; the real AT experience is already
  correct via the accessible name.
