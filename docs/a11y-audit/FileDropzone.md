# FileDropzone — a11y audit (2026-07-11)

**Status:** PARTIAL — every in-directory fix is applied; one root fix (issue 3,
exposing a `labelId` from FieldShell) is DEFERRED to a shared file this agent
does not own.

**APG pattern:** No single APG widget pattern — this is a **custom file-upload
control**: a native `<button>` drop target that opens a hidden
`<input type="file">` and doubles as a drag-drop surface, wrapped by the shared
`<FieldShell>` (which owns the `<label>`, required indicator, and error region).
The relevant APG guidance is the general *button* interaction (Enter/Space
activation, native — already correct) plus the *status message* technique for
async state (WCAG 4.1.3). Field labelling/error semantics are delegated to
FieldShell.

---

## Issues found

### 1. State ARIA rode the out-of-tree hidden input, not the operable button — SERIOUS, WCAG 1.3.1 / 3.3.1 / 4.1.2 — FIXED
`index.tsx` spread FieldShell's `inputAriaProps` (`aria-required`,
`aria-invalid`, and the `aria-describedby` → error-region link) **and**
`id={inputId}` onto the `<input type="file">`, which is `display:none`
(`FileDropzone.module.css` `.hiddenInput`) and therefore removed from the
accessibility tree. The element a screen-reader / keyboard user actually
operates — the `<button className={cssStyles.dropTarget}>` — carried **none** of
it, so on the control it operates the field's *required*, *invalid*, and
*error-message* state was never conveyed. This is the same shape the Dropdown
combobox already solves by spreading `inputAriaProps` onto its operable trigger
(`src/components/Field/Dropdown/Regular/index.tsx:246`).
- Before: `index.tsx` button at old line 231–241 had only
  `aria-describedby={\`${instanceId}-hint\`}`.
- **FIXED** — `index.tsx:271-273`: the button now spreads `{...inputAriaProps}`
  (giving it `aria-required` / `aria-invalid`), an `aria-describedby` that
  **merges** the drag-drop hint id with the shell's error/helper describedby
  (`index.tsx:224-227`), and `aria-busy` while uploading. The hidden input keeps
  its own attributes (additive; unchanged) so no existing selector contract is
  removed.

### 2. Async pick / uploading / selected status not announced — SERIOUS, WCAG 4.1.3 — FIXED
While `uploading`, the drop-target button is natively `disabled` and its label
swaps "Upload image" → "Uploading…"; a disabled control's label change is not
reliably announced, and a drag-drop pick never focuses the button at all — so
the entire pick → uploading → selected transition was silent to assistive tech.
- **FIXED** — added a visually-hidden `role="status" aria-live="polite"` region
  (`index.tsx:297-304`, `statusText` derived at `index.tsx:135-143`) that emits
  "Uploading image…" / "Image selected" (variant-aware), plus `aria-busy` on the
  button while uploading (`index.tsx:273`). Follows the existing SaveButton /
  CodeCopy `.srOnly` live-region convention; `.srOnly` copied verbatim into
  `FileDropzone.module.css`.

### 3. Field label associated only with the hidden input, not the operable button — MODERATE, WCAG 1.3.1 / 3.3.2 — PARTIALLY FIXED (root fix DEFERRED)
FieldShell renders `<label htmlFor={inputId}>` pointing at the hidden
(`display:none`, out-of-tree) file input, so the operable button gets no
programmatic tie to the visible field label ("Product Image", "Attach
contract"). The button's accessible name comes from its own text content
("Upload image" / "Change file" + the hint), which is descriptive and adequate,
and after issue 1 the button now conveys required/invalid/error — but the field
*name* itself still isn't on the operated control. The clean fix (expose a
`labelId` from the FieldShell render-prop slot so a button-based field can add
`aria-labelledby={labelId}`) lives in a file this agent does not own — see
Deferred. Left the hidden input as the `htmlFor` target so label-click still
opens the picker.

### 4. Transitions ignored prefers-reduced-motion — MINOR, WCAG 2.3.3 — FIXED
`.dropTarget` and `.removeButton` declare `transition: background-color/…` with
no reduced-motion guard.
- **FIXED** — added `@media (prefers-reduced-motion: reduce) { .dropTarget,
  .removeButton { transition: none; } }` to `FileDropzone.module.css`.

### 5. "Remove" control lacked field context — MINOR, WCAG 2.4.6 / 2.5.3 — FIXED
The remove button read as a bare "Remove". Added
`aria-label={\`Remove ${noun}\`}` → "Remove image" / "Remove file"
(`index.tsx:288`); the visible "Remove" text stays inside the accessible name so
WCAG 2.5.3 Label-in-Name holds.

---

## Hearing
No audio, `<audio>`/`<video>`, `AudioContext`, or `navigator.vibrate` usage
(grep-verified) — nothing is conveyed by sound, so no hearing-impaired gap.
Feedback is visual (drop highlight, uploading copy, error) and — after issue 2 —
also programmatically announced. WCAG 1.2.x / 1.4.2 N/A.

## Reading & screen reader
- **Names:** the decorative placeholder SVG and its wrapper span are correctly
  `aria-hidden="true"` (`index.tsx:246`, `placeholderGlyph` at `index.tsx:74-106`).
  The button is named by its own action text; the remove button now has explicit
  variant context (issue 5).
- **State on the operated control:** `aria-required` / `aria-invalid` /
  `aria-describedby`→error now ride the button (issue 1); `aria-busy` while
  uploading (issue 2).
- **Status:** async transitions announced via the polite `role="status"` region
  (issue 2). Errors were already announced by FieldShell's `role="alert"` region.
- **Keyboard:** the drop surface is a real native `<button>` — Tab focus,
  Enter/Space activation (→ opens the picker), and a visible `:focus-visible`
  outline (`FileDropzone.module.css:125-128`) are all already correct. No
  overlay/dialog, so no focus-trap/Escape obligations.
- **Colour-alone:** drag-active state changes border-*style* (dashed→solid) in
  addition to colour (`FileDropzone.module.css:136-140`), so WCAG 1.4.1 holds;
  disabled uses native `disabled` + opacity; error uses text + `aria-invalid`.

## SEO semantics
Real `<button>` and `<input type="file">` elements (no click-div), label
rendered as a real `<label>` by FieldShell. Not a heading/landmark/list/table/
link surface, so no `headingLevel`/`<nav>`/`<a href>` obligations. The
host-supplied `preview` node is the host's responsibility to caption (e.g. a
Next `<Image alt>`); the component itself injects no client-only primary
content. No SEO-semantic gaps.

## Fixes applied
- `index.tsx` — spread `inputAriaProps` + merged `aria-describedby` + `aria-busy`
  onto the operable button; added the derived `statusText` + visually-hidden
  `role="status"` live region; variant-aware `aria-label` on the remove button;
  updated component JSDoc.
- `FileDropzone.module.css` — added `.srOnly` visually-hidden live-region class
  and a `prefers-reduced-motion` transition guard.
- `FileDropzone.stories.tsx` — see below.

## Stories updated
- **`Uploading`** (new) — `uploading: true` with a value/preview: exercises the
  natively-disabled button, `aria-busy`, and the "Uploading image…" status
  region.
- **`WithValueRemovable`** (new) — value present + `onRemove`: exercises the
  remove control's `aria-label="Remove image"` and the "Image selected" status.
- **`WithError`** (JSDoc extended) — now documents that the operable button
  carries `aria-required` / `aria-invalid` / `aria-describedby`→error.
- Reduced-motion (issue 4) is a CSS media query and is not separately
  story-assertable (Chromatic does not drive the reduce-motion preference); it is
  visually inert under normal rendering.

## Deferred
- **FieldShell should expose `labelId` in its render-prop slot** (issue 3 root
  fix). File: `src/components/Field/Shell/index.tsx` — the `<label>` at line 395
  has no `id`, and the `FieldShellSlot` interface (lines 48–75) exposes only
  `inputId` / `helperId` / `inputAriaProps`. Suggested change: give the label
  `id={labelId}` (e.g. `field-label-${reactId}`) and add `labelId` to the slot,
  so button-based fields (FileDropzone, and the Dropdown family) can set
  `aria-labelledby={labelId}` to tie the visible field label to the operable
  control rather than relying on an out-of-tree input or an `aria-label` that
  overrides the control's own text. Not editable from this component's directory.
