# FileDropzone — a11y audit (2026-07-11)

**Status:** FIXED — all audit issues plus the two adversarial-review follow-ups
are resolved in-directory. Issue 3 (field-label association) was previously
PARTIAL/deferred; it is now fully fixed within the component via `aria-labelledby`
(see below). A DRY refactor of that fix into FieldShell remains an OPTIONAL
improvement (Deferred), but the shipped code no longer has the gap.

**Adversarial-review follow-up (2026-07-11):** a review of the first pass raised
two remaining items — (a) the visible field label still wasn't tied to the
operable button [moderate], and (b) focus was dropped to `<body>` after Remove
[minor]. Both are now fixed at root cause in `index.tsx` + pinned by story play
functions. Details folded into issues 3 and 6 below.

**Second adversarial-review follow-up (2026-07-11):** a further review noted that
the two SERIOUS fixes (issue 1 state-ARIA on the operable button; issue 2 the
`role="status"` live region) were only *visually* rendered by `WithError` /
`Uploading` — no `play()` asserted the ARIA, and Chromatic diffs pixels, not ARIA
attributes, so a regression dropping `{...inputAriaProps}` or `role="status"`
would ship silently. **Fixed:** `WithError` and `Uploading` now each carry a
`play()` that pins the exact attributes (`aria-required`/`aria-invalid`/
`aria-describedby`→error-region+hint-merge, and `role="status"`/`aria-live`/text/
`aria-busy`/`disabled` respectively) and fail the old baseline. See "Stories
updated". No source (`index.tsx`/CSS) change was needed — the runtime behavior was
already correct; the gap was purely test coverage.

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

### 3. Field label associated only with the hidden input, not the operable button — MODERATE, WCAG 1.3.1 / 3.3.2 — FIXED (in-directory)
FieldShell renders `<label htmlFor={inputId}>` pointing at the hidden
(`display:none`, out-of-tree) file input, so the operable button got no
programmatic tie to the visible field label ("Product Image", "Attach
contract"). On a form with several upload fields a screen-reader user tabbing to
the button couldn't tell which field it belonged to.
- **FIXED** — `index.tsx`: the operable `<button>` now carries
  `aria-labelledby={`${labelId} ${browseLabelId}`}` (`index.tsx:316-318`),
  referencing **(1)** a visually-hidden, `aria-hidden` mirror of the field label
  rendered inside the component (`index.tsx:337-345`, `id={labelId}`) and
  **(2)** the button's own visible action-text span (`index.tsx:322-324`,
  `id={browseLabelId}`). The result is an accessible name of "Product Image
  Upload image" (field + action) instead of a context-free "Upload image".
- **Why `aria-labelledby` and not `aria-label`:** the Dropdown combobox names its
  trigger with `aria-label={label}` (`Field/Dropdown/Regular/index.tsx:221`),
  but its visible text is the *selected value*. FileDropzone's visible text is
  the *action* ("Upload image"), so an `aria-label={label}` would OVERRIDE it and
  break WCAG 2.5.3 Label-in-Name. Referencing the visible action-text span keeps
  it inside the name, so Label-in-Name holds.
- **Why `aria-hidden` on the label mirror:** a directly-referenced hidden element
  still contributes to the accessible name (accname spec), so the mirror works as
  a labelledby target while `aria-hidden` prevents browse-mode from reading the
  label text a *third* time (the visible FieldShell `<label>` + the button name is
  the normal labeled-control pattern; the mirror should not add a third read).
- The hidden input remains the `<label htmlFor>` target, so label-click still
  opens the picker; the `aria-labelledby` is only emitted when a `label` is set
  (label-less usage is unchanged). A DRY version — FieldShell exposing a real
  `labelId` so button-fields reference the *actual* visible label without a
  mirror — is recorded in Deferred as an optional cleanup, but is no longer
  required to close this gap.

### 4. Transitions ignored prefers-reduced-motion — MINOR, WCAG 2.3.3 — FIXED
`.dropTarget` and `.removeButton` declare `transition: background-color/…` with
no reduced-motion guard.
- **FIXED** — added `@media (prefers-reduced-motion: reduce) { .dropTarget,
  .removeButton { transition: none; } }` to `FileDropzone.module.css`.

### 5. "Remove" control lacked field context — MINOR, WCAG 2.4.6 / 2.5.3 — FIXED
The remove button read as a bare "Remove". Added
`aria-label={\`Remove ${noun}\`}` → "Remove image" / "Remove file"; the visible
"Remove" text stays inside the accessible name so WCAG 2.5.3 Label-in-Name holds.

### 6. Focus dropped to `<body>` after Remove — MINOR, WCAG 2.4.3 — FIXED
The Remove button renders only while `hasValue && onRemove`. Clicking it clears
the value host-side, `hasValue` flips false, and the currently-focused Remove
control unmounts — so keyboard / screen-reader focus fell to `<body>`, losing the
user's place. (The first pass overlooked this: its "no overlay, so no focus
obligations" note missed the conditional unmount of a *focused* control.)
- **FIXED** — `index.tsx`: a `browseButtonRef` (`index.tsx:154`) + a
  `pendingRemoveFocusRef` flag (`index.tsx:157`). The Remove `onClick` is now a
  local `handleRemove` (`index.tsx:226-229`) that sets the flag and calls
  `onRemove()`; a `useEffect` keyed on `hasValue` (`index.tsx:231-236`) moves
  focus to the always-mounted browse button once the value has actually cleared.
- **Why keyed on the `hasValue` transition** (not a synchronous `focus()` in the
  click handler): the host may clear the value synchronously OR after an async
  round-trip. Keying the focus move off the real `hasValue → false` transition
  handles both — focus lands on the browse button exactly when the Remove control
  unmounts, never before. Refs (stable) are correctly omitted from the effect
  deps; only `hasValue` is a dep.

---

## Hearing
No audio, `<audio>`/`<video>`, `AudioContext`, or `navigator.vibrate` usage
(grep-verified) — nothing is conveyed by sound, so no hearing-impaired gap.
Feedback is visual (drop highlight, uploading copy, error) and — after issue 2 —
also programmatically announced. WCAG 1.2.x / 1.4.2 N/A.

## Reading & screen reader
- **Names:** the decorative placeholder SVG and its wrapper span are correctly
  `aria-hidden="true"` (`placeholderGlyph` at `index.tsx:74-106`). The button is
  named by its field label + own action text via `aria-labelledby` (issue 3); the
  remove button has explicit variant context (issue 5).
- **State on the operated control:** `aria-required` / `aria-invalid` /
  `aria-describedby`→error now ride the button (issue 1); `aria-busy` while
  uploading (issue 2).
- **Status:** async transitions announced via the polite `role="status"` region
  (issue 2). Errors were already announced by FieldShell's `role="alert"` region.
- **Keyboard & focus:** the drop surface is a real native `<button>` — Tab focus,
  Enter/Space activation (→ opens the picker), and a visible `:focus-visible`
  outline are all correct. No overlay/dialog, so no focus-trap/Escape
  obligations — but the conditionally-rendered Remove control DOES have a
  focus-management obligation: focus is moved to the browse button when Remove
  unmounts on removal (issue 6, WCAG 2.4.3).
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
  `role="status"` live region; variant-aware `aria-label` on the remove button
  (issues 1, 2, 5). **Adversarial-review follow-up:** `aria-labelledby` on the
  button referencing a hidden `aria-hidden` field-label mirror + the visible
  action-text span (issue 3); `browseButtonRef` + `pendingRemoveFocusRef` +
  a `hasValue`-keyed `useEffect` that moves focus to the browse button after
  Remove (issue 6); updated component JSDoc.
- `FileDropzone.module.css` — added `.srOnly` visually-hidden class (used by both
  the live region and the label mirror) and a `prefers-reduced-motion` transition
  guard (issues 2, 4). *(CSS unchanged in the follow-up pass — the existing
  `.srOnly` already covers the label mirror.)*
- `FileDropzone.stories.tsx` — see below.

## Stories updated
- **`WithError`** (issues 1 + error-region link) — **now carries a `play`
  function** (second adversarial-review follow-up, 2026-07-11): asserts the
  operable `[data-file-dropzone-browse]` button has `aria-required="true"` and
  `aria-invalid="true"` (spread from `inputAriaProps`), and that its
  `aria-describedby` resolves to BOTH the FieldShell `role="alert"` error region
  (whose id is one of the describedby targets and whose text is the failure
  message) AND the in-button drag-drop hint span (pinning the describedby MERGE).
  This FAILS the old baseline — a regression dropping `{...inputAriaProps}` from
  the button loses `aria-required`/`aria-invalid`, and one collapsing the
  describedby merge drops either the error-region or the hint id. (Chromatic is
  visual-only and does not diff ARIA, so this executable assertion is the real
  regression gate.)
- **`Uploading`** — `uploading: true` with a value/preview. **Now carries a `play`
  function** (second adversarial-review follow-up, 2026-07-11): asserts the
  visually-hidden `[data-file-dropzone-status]` region is `role="status"`
  `aria-live="polite"` with text "Uploading image…", and that the operable browse
  button is natively `disabled` and `aria-busy="true"`. FAILS the old baseline — a
  regression dropping `role="status"` (index.tsx) or `aria-busy` on the button
  goes uncaught by Chromatic but fails this block.
- **`WithValueRemovable`** — value present + `onRemove`. **Extended with a `play`
  function** (adversarial follow-up, issue 6): focuses the Remove control,
  activates it, and asserts focus lands on `[data-file-dropzone-browse]` (not
  `<body>`) and the Remove control has unmounted. This FAILS without the focus-move
  effect.
- **`AccessibleName`** (new, adversarial follow-up, issue 3) — asserts the browse
  button's `aria-labelledby` resolves to two elements whose concatenated text is
  exactly "Product Image Upload image" (field label + visible action), pinning the
  label association + Label-in-Name. FAILS without the `aria-labelledby` wiring.
- Reduced-motion (issue 4) is a CSS media query and is not separately
  story-assertable (Chromatic does not drive the reduce-motion preference); it is
  visually inert under normal rendering.

## Deferred
- **(Optional cleanup — no longer required) FieldShell could expose `labelId` in
  its render-prop slot.** File: `src/components/Field/Shell/index.tsx` — the
  `<label>` at line 395 has no `id`, and the `FieldShellSlot` interface (lines
  48–75) exposes only `inputId` / `helperId` / `inputAriaProps`. Suggested change:
  give the label `id={labelId}` (e.g. `field-label-${reactId}`) and add `labelId`
  to the slot. **Why still worth doing** even though issue 3 is now fixed
  in-directory: FileDropzone currently reaches the field name by rendering a
  *hidden mirror* of the `label` node and referencing that. A FieldShell-exposed
  `labelId` would let this (and the Dropdown family, which today uses
  `aria-label={label}`) reference the *actual* visible label element, dropping the
  mirror and de-duplicating the label ReactNode. Purely a DRY/robustness
  improvement now — the shipped a11y behavior is already correct without it. Not
  editable from this component's directory (owned by the Field/Shell agent).
