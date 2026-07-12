# ComplexTextEditor — a11y audit (2026-07-11)

**Status: FIXED**

A multi-mode text editor (Simple textarea / Rich contentEditable / Markdown
textarea) with a formatting toolbar and a Simple/Rich/Markdown mode switch.

## APG pattern

Composite editor. The pieces map to three WAI-ARIA APG patterns:

- **Toolbar** (`role="toolbar"`) — the formatting-button row.
- **Textbox** (`role="textbox"` + `aria-multiline`) — the rich contentEditable
  surface (the two textareas are native `<textarea>` = implicit textbox).
- **Toggle buttons** (`aria-pressed`) — the mode switch (single-select) and the
  rich-text formatting toggles (bold/italic/underline/strikethrough/lists).

## Issues found

| # | Severity | WCAG | Location | Issue | Status |
|---|----------|------|----------|-------|--------|
| 1 | critical | 4.1.2 | Toolbars/Editor/index.tsx (all `CustomButton`, ~409–545) | 11 icon-only toolbar buttons had NO accessible name — SR announces bare "button". | FIXED |
| 2 | serious | 1.4.1, 4.1.2 | Toolbars/Editor/index.tsx `isFormatActive`/`getButtonStyles` (348–396) | Toggle buttons' active state was color-only AND its `isFormatActive` was permanently dead (gated on a Slate `editor` prop RichEditor never passes) → no `aria-pressed`. | FIXED |
| 3 | serious | 1.4.1, 4.1.2 | Toolbars/Complex/index.tsx mode switch (62–65) | Simple/Rich/Markdown selected mode conveyed only by the `.selected` class colour; no programmatic state, no group label. | FIXED |
| 4 | serious | 1.3.1, 4.1.2 | RichEditor/index.tsx contentEditable (116–123) | The `contentEditable` div had no `role="textbox"`, no `aria-multiline`, no accessible name. | FIXED |
| 5 | serious | 1.3.1, 3.3.2, 4.1.2 | index.tsx label (253–262) + all three editor inputs | The visible `<label>` had no `htmlFor`/`id` and didn't wrap any input → textareas/contenteditable were unlabeled. | FIXED |
| 6 | moderate | 1.3.1, 4.1.2 | Toolbars/Editor/index.tsx `.toolbarContainer` (398) | Toolbar was a plain `<div>` — no `role="toolbar"`, no `aria-label`. | FIXED |
| 7 | moderate | 4.1.2 | MarkdownEditor/index.tsx (98–100) | "Toggle Preview" `<button>` had no `aria-pressed`/`aria-controls`, and defaulted to `type="submit"` (would submit an enclosing goobs `<Form>`). | FIXED |
| 8 | serious | 2.3.3 | ComplexTextEditor.module.css (449) | Sacred markdown textarea has an INFINITE `markdownEditorCodeGlow` animation; no `prefers-reduced-motion` handling anywhere. | FIXED |
| 9 | minor | 2.4.7, 2.4.11 | ComplexTextEditor.module.css (`.richSurface` 352, textareas) | Editing surfaces set `outline: none` and relied only on a subtle border-colour change for focus. | FIXED |
| 10 | minor | 1.1.1 | Toolbars/Editor/index.tsx (all icon nodes) | Decorative toolbar SVG icons weren't hidden from AT. | FIXED |

## Hearing (WCAG 1.2.x, 1.4.2)

Clean — no `Audio`/`AudioContext`/`<audio>`/`<video>`/`navigator.vibrate` and no
audio-only status anywhere in the component (grep-verified). Nothing to fix.

## Reading & screen reader

- **Accessible names (issue 1, 10):** each icon-only `CustomButton` now passes an
  `aria-label` (Undo, Redo, Bold, Italic, Underline, Strikethrough, Code, Insert
  link, Numbered list, Bulleted list) and its SVG icon is `aria-hidden="true"`.
- **Toggle state (issues 2, 3):** the rich-text formatting toggles now carry
  `aria-pressed`. Crucially, `isFormatActive` was rewritten — the old guard
  `if (!editor …)` made it permanently return `false` (this component is never
  handed a Slate `editor`; rich mode uses `document.execCommand`). It now reads
  `document.queryCommandState` on the client via a `selectionchange` listener, so
  both the visual active state AND `aria-pressed` are truthful as the caret moves
  (SSR- and unsupported-command-safe via effect + try/catch). The mode switch now
  sits in a `role="group"` labelled "Editor mode" and each mode button reports
  `aria-pressed`.
- **contentEditable semantics (issue 4):** the rich surface is now
  `role="textbox" aria-multiline="true"` with the threaded accessible name.
- **Label association (issue 5):** a `useId`-based id links the visible `<label>`
  to the editing surface via `aria-labelledby`; in accordion mode (no visible
  label) it falls back to an `aria-label` derived from the label / accordion
  summary, defaulting to "Text editor" so no surface is ever unlabeled. Threaded
  index.tsx → ComplexToolbar → Simple/Rich/Markdown editors.
- **Toolbar landmark (issue 6):** `role="toolbar"` + `aria-label`
  ("Text formatting" / "Markdown formatting").
- **Preview toggle (issue 7):** `type="button"` (no accidental submit) +
  `aria-pressed={showPreview}` + `aria-controls` → the preview region's id.
- **Focus (issue 9):** added a theme-aware `:focus-visible` outline on the rich
  surface and both textareas (the border-colour change is retained too).

## SEO semantics

The visible label renders as a real `<label>` (unchanged). No headings, links, or
landmark misuse in the component's own markup; the markdown *preview* renders real
`<h1-6>`/`<ul>`/`<a>` via `mdToHtml` (pre-existing, correct). No client-only
injection of primary content — the textareas/contenteditable SSR their value.
Nothing to change.

## Motion (WCAG 2.3.3)

Added `@media (prefers-reduced-motion: reduce)` disabling the infinite sacred
markdown glow animation and the container/editor/label transitions.

## Fixes applied

- `Toolbars/Editor/index.tsx` — `aria-label` on every button; `aria-pressed` on
  toggle formats via `getButtonA11y`; rewrote `isFormatActive` to truthful
  client-side `queryCommandState` tracking; `role="toolbar"` + `aria-label`;
  `aria-hidden` on all icons.
- `Toolbars/Complex/index.tsx` — `role="group"` + `aria-label="Editor mode"`;
  `aria-pressed` on each mode button; threads accessible name to the editors.
- `index.tsx` — `useId` label id + accessible-name resolution; `id` on the label;
  threads `ariaLabel`/`ariaLabelledBy` into every editor.
- `SimpleEditor/index.tsx`, `RichEditor/index.tsx`, `MarkdownEditor/index.tsx` —
  accept + apply the accessible name; RichEditor adds `role="textbox"` +
  `aria-multiline`; MarkdownEditor fixes the preview `<button>`.
- `ComplexTextEditor.module.css` — `:focus-visible` outlines + reduced-motion block.

All additive: no existing prop/export/`data-*`/`role`/`aria` was renamed or
removed; the `data-component`/`data-field-name`/`data-state`/`role="combobox"`
test contract is untouched.

## Stories updated

Six play-function regression stories in `ComplexTextEditor.stories.tsx`:

- `ToolbarAccessibility` — every button's accessible name, `role="toolbar"`,
  `aria-pressed` on toggles (absent on command buttons), labelled multiline textbox.
- `ModeToggleAccessibility` — `role="group"` label + `aria-pressed` tracks the
  active mode across a click.
- `LabelAssociation` — the simple textarea resolves by its visible label name.
- `MarkdownPreviewAccessibility` — preview button is `type="button"` and its
  `aria-pressed` flips on toggle; markdown textarea is labelled.
- `ToolbarRovingTabIndex` (2026-07-11 review) — the toolbar is a single Tab stop
  (`tabindex` 0 on one control, `-1` on the rest) and Left/Right Arrow + Home/End
  move focus and the tab stop between controls.
- `MarkdownPreviewAriaControls` (2026-07-11 review) — `aria-controls` is present
  only while the preview region is rendered (no dangling IDREF when collapsed).

## Deferred (not owned)

- ~~**`src/components/Button/index.tsx` / ButtonGroup:** the `selected` prop styled
  the pressed state visually but did not emit `aria-pressed`.~~ **RESOLVED** (Button
  now emits `{...(selected !== undefined && { 'aria-pressed': selected })}` at
  `Button/index.tsx:641`, and ButtonGroup sets `selected` on every child), so the
  mode switch gets programmatic pressed state from ButtonGroup automatically. The
  explicit `aria-pressed` on the mode Button children (Toolbars/Complex) is kept as
  a belt-and-suspenders, callsite-explicit signal. Nothing outstanding here.

## Notes / non-issues

- The Text Type / Alignment dropdowns use `Field/Dropdown/Regular`, which already
  implements the full combobox+listbox APG pattern with `aria-label` and renders
  each option's text (`String(option.value)`); the `icon` field on those options
  is ignored by that dropdown, so there is no icon-only-option problem. No change.
- Full APG **roving-tabindex / arrow-key** toolbar navigation is now implemented
  (see the 2026-07-11 review-fix pass below). `role="toolbar"` is a single Tab
  stop; Left/Right Arrow + Home/End move focus between all enabled controls
  (icon buttons AND the rich-text dropdown comboboxes).

## Review fixes (2026-07-11 adversarial review)

An adversarial review of the first a11y pass found four remaining items. All
fixed at root cause; all additive (no existing prop/export/`data-*`/`role`/`aria`
renamed or removed).

| # | Severity | File | Issue | Fix |
|---|----------|------|-------|-----|
| R1 | critical | SimpleEditor + RichEditor + MarkdownEditor + Toolbars/Complex | The new `ariaLabel?: string` / `ariaLabelledBy?: string` props were declared as non-`\|undefined` optionals while the callers pass `string \| undefined`; under `tsconfig.exactOptionalPropertyTypes: true` that is `TS2375` (7 errors at index.tsx:225/236/249/262 + Toolbars/Complex:95/106/117). `tsc --noEmit` failing meant `vite build` never ran → the fix could never reach `dist/`/npm. | Widened all four prop pairs to `?: string \| undefined`, so the explicit-`undefined` callers are assignable. Runtime behaviour unchanged. |
| R2 | moderate | Toolbars/Editor | `role="toolbar"` set an AT arrow-key expectation the buttons didn't fulfil — no roving tabindex (every icon button an independent Tab stop), no Left/Right/Home/End. Incomplete APG Toolbar pattern. | Implemented the pattern: the toolbar is a single Tab stop (roving tabindex over the live set of enabled `<button>`s incl. the dropdown comboboxes, `role="option"` excluded); a container `onKeyDown` handles Left/Right (wrapping) + Home/End and moves both focus and the tab stop; `onFocus` keeps the stop on the last-used control; a combobox that is open (`aria-expanded="true"`) keeps its own Arrow/Home/End nav. Kept `role="toolbar"` (the correct role) rather than dropping it. |
| R3 | minor | MarkdownEditor | `aria-controls={previewId}` was set unconditionally, but the `id={previewId}` preview element renders only while `showPreview` — dangling IDREF when collapsed (ARIA 1.2). | `aria-controls` is now spread only when `showPreview` is true. |
| R4 | minor | Toolbars/Complex | The mode switch wrapped goobs `ButtonGroup` (which emits its own `<div role="group">`) inside another `<div role="group" aria-label="Editor mode">` — a labelled group directly containing an unlabelled group (double announcement). | Removed the outer `role`/`aria-label`; passed `aria-label="Editor mode"` to `ButtonGroup` (which accepts it and applies it to its own `role="group"`). One labelled group. The `getByRole('group', { name: /editor mode/i })` story still resolves. |

Regression coverage: added `ToolbarRovingTabIndex` (R2) and
`MarkdownPreviewAriaControls` (R3) play stories; the existing
`ModeToggleAccessibility` story still asserts the labelled group name (R4) and
`LabelAssociation` / the toolbar stories still compile against the R1-typed props.
`bun lint:file` clean on all six edited files.

## Review fixes (2026-07-11 adversarial review, second pass)

A second adversarial review found two remaining minor items. Both fixed at root
cause; all additive (no existing prop/export/`data-*`/`role`/`aria` renamed or
removed; the `data-component`/`data-field-name`/`data-action`/`data-state` test
contract is untouched).

| # | Severity | File | Issue | Fix |
|---|----------|------|-------|-----|
| R5 | minor | index.tsx label (`~284`) + SimpleEditor / RichEditor / MarkdownEditor / Toolbars/Complex | The visible `<label id=labelId>` had NO `htmlFor` and wrapped no control — the accessible name was supplied via `aria-labelledby` (so no 1.3.1/4.1.2 failure), but the `<label>` was semantically inert and clicking it no longer focused the editor (lost native label-to-control click affordance). | Wired the house `<label htmlFor>` pattern (matches `Field/Shell`): index.tsx derives a stable `editorId` from its `useId` and threads it — alongside the existing `ariaLabel`/`ariaLabelledBy` props — through `ComplexToolbar` to each editing surface, where it is applied as the element `id`. Only one surface renders at a time, so `htmlFor={editorId}` always resolves to the live surface. Native click-to-focus is restored for the textarea modes (simple/markdown); the rich contentEditable keeps its `aria-labelledby` name and degrades gracefully. |
| R6 | minor | Toolbars/Complex/index.tsx (mode switch) + MarkdownEditor/index.tsx (preview toggle) | Switching editing mode (`handleModeChange`) and toggling the markdown preview each swap the visible surface/context with no `role="status"`/`aria-live` announcement — the pressed-states satisfy 4.1.2, but an AT user got no notification the editing surface itself changed (WCAG 4.1.3 Status Messages; enhancement, not a failure). | Added a visually-hidden polite `role="status" aria-live="polite"` live region in each spot (matching the library's `Field/Password` idiom + a local `.srOnly` module class): the toolbar announces `"<surface> selected"` on mode change; the markdown editor announces `"Markdown preview shown/hidden"` on toggle. Both `announcement` states start empty, so nothing is announced on mount. |

Markup changes (per the additive-only contract): the `<label>` gains a `htmlFor`
attribute; each editing surface (`SimpleEditor`/`MarkdownEditor` textarea,
`RichEditor` contentEditable) gains an `id` (new optional `editorId?: string |
undefined` prop, threaded through `ComplexToolbar`); two visually-hidden
`<span role="status">` live regions were added. No element type changed; nothing
was renamed or removed.

Regression coverage: added three play stories — `LabelClickFocus` (R5:
`label.for === textbox.id`, and clicking the label focuses the textarea),
`ModeSwitchAnnouncement` and `PreviewToggleAnnouncement` (R6: the polite status
region starts empty and updates on each mode switch / preview toggle). The
existing `LabelAssociation`, `MarkdownPreviewAccessibility`, and
`MarkdownPreviewAriaControls` stories still pass (accessible name, `aria-pressed`,
conditional `aria-controls` all unchanged). `bun lint:file` clean on all six
edited files (five components + the stories).
