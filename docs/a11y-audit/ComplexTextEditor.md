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

Four new play-function regression stories in `ComplexTextEditor.stories.tsx`:

- `ToolbarAccessibility` — every button's accessible name, `role="toolbar"`,
  `aria-pressed` on toggles (absent on command buttons), labelled multiline textbox.
- `ModeToggleAccessibility` — `role="group"` label + `aria-pressed` tracks the
  active mode across a click.
- `LabelAssociation` — the simple textarea resolves by its visible label name.
- `MarkdownPreviewAccessibility` — preview button is `type="button"` and its
  `aria-pressed` flips on toggle; markdown textarea is labelled.

## Deferred (not owned)

- **`src/components/Button/index.tsx` (~line 590) / ButtonGroup (~line 46):** the
  `selected` prop styles the pressed state visually but does not emit
  `aria-pressed`. Suggested: when `selected` is set (or when ButtonGroup marks a
  child selected), emit `aria-pressed` — then every single-select `ButtonGroup`
  across the library gets programmatic selection state without each callsite
  adding it manually. (Worked around here by passing `aria-pressed` on the mode
  Button children directly.)

## Notes / non-issues

- The Text Type / Alignment dropdowns use `Field/Dropdown/Regular`, which already
  implements the full combobox+listbox APG pattern with `aria-label` and renders
  each option's text (`String(option.value)`); the `icon` field on those options
  is ignored by that dropdown, so there is no icon-only-option problem. No change.
- Full APG **roving-tabindex / arrow-key** toolbar navigation is intentionally not
  added: every toolbar button is individually Tab-focusable and Enter/Space
  operable, so keyboard access (WCAG 2.1.1) is fully satisfied; single-tab-stop
  arrow navigation is a future enhancement, not a barrier.
