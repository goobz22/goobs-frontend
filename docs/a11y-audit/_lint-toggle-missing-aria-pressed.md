# CLASS LINT: toggle-missing-aria-pressed (2026-07-11)

**Status: SHIPPED — gate green, 0 violations across 464 files**

WCAG **1.4.1** (Use of Color) / **4.1.2** (Name, Role, Value).

Class-first (T8) follow-up to the per-component a11y audit. The ComplexTextEditor
audit found "toggle button conveys active/selected state by color only, no
`aria-pressed`" in 3 places. Per T8 a bug is a CLASS until a script proves it a
one-off, so this owns the class across the WHOLE repo: a detection module + the
fix of every instance it reports.

Module: `scripts/a11y-lints/toggle-missing-aria-pressed.ts`
Runner: `bun scripts/lint-a11y.ts --only toggle-missing-aria-pressed`
(part of `lint:a11y` → `lint:all` — the permanent regression gate).

## The abstracted logical shape

A **button-like element** (`<button>`, or goobs `<Button>`/`<CustomButton>`/
`<IconButton>`) whose `onClick` **inline-flips a boolean React state** — the
self-evident toggle signature — but whose opening tag exposes **no programmatic
state signal**:

```
onClick={() => setShowPreview(!showPreview)}   // setX(!x)
onClick={() => setDark(v => !v)}               // setX(v => !v)
onClick={() => setOn(prev => !prev)}           // setX(prev => !prev)
```

A control that flips a boolean on click IS a toggle; with no state attribute the
on/off state is conveyed visually-only (color / class / icon), invisible to
screen-reader and color-blind users.

**Why the inline shape (not data-flow across handlers):** it is self-contained in
one opening tag — no cross-file guessing, so few false positives — and it is the
highest-frequency way the regression reappears when someone hand-writes a new
toggle. This is exactly the MarkdownEditor "Toggle Preview" bug.

## Escape hatches (encoded in the check, never a file ignore-list)

A flipping button is NOT flagged when its opening tag already conveys the state:

| Signal | Why it's legitimate |
|---|---|
| `aria-pressed` | the canonical toggle-button state (the audit's fix) |
| `aria-expanded` | a DISCLOSURE / combobox / menu / accordion correctly uses this, not aria-pressed |
| `aria-checked` / `role="switch"\|"checkbox"\|"menuitemcheckbox"` | switch / checkbox semantics |
| `aria-selected` / `role="tab"\|"option"\|"menuitemradio"\|"radio"` | selection within a composite widget |
| `aria-current` | "current item" state |
| state-dependent `aria-label`/`title` ternary (`aria-label={on ? … : …}`) | the accessible NAME changes with the state → fully conveyed non-visually (e.g. Field/Password's Show/Hide-password eye button) |
| a prop spread `{...rest}` | may supply a state attribute at runtime |

Comments are blanked before scanning, so a JSDoc `@example` toggle is never
flagged. Selftest: **6 bad / 10 good** (all pass).

## Instances

| # | Severity | File:line | Status | Note |
|---|----------|-----------|--------|------|
| 1 | serious | ComplexTextEditor/Toolbars/Editor/index.tsx (~348–413) | FIXED (per-component) | rich-text format toggles → `aria-pressed` via `getButtonA11y` + truthful `queryCommandState` |
| 2 | serious | ComplexTextEditor/Toolbars/Complex/index.tsx (62–90) | FIXED (per-component) | Simple/Rich/Markdown mode switch → `aria-pressed` per button + labelled group |
| 3 | moderate | ComplexTextEditor/MarkdownEditor/index.tsx (111–119) | FIXED (per-component) | "Toggle Preview" `<button>` → `type=button` + `aria-pressed` + gated `aria-controls` |
| 4 | serious | Field/Dropdown/SearchableHistory/index.tsx (321) | **FIXED (this pass)** | secondary arrow toggle for the listbox; open state was icon-rotation only |

**Instance 4** is the one the class-lint newly surfaced. The combobox `role` lives
on the search `<input>` (which had full `aria-expanded`/`aria-controls`); the arrow
`<button>` beside it is a second disclosure trigger for the same listbox that
flipped `setIsOpen(!isOpen)` but conveyed open/closed **only via the icon
rotation** (`transform: rotate(180deg)`) — visual-only. Fix (additive):

- `aria-expanded={isOpen}` — programmatic disclosure state (flips with the icon);
- `aria-controls={listboxId}` — links to the listbox (unconditional, matching the
  sibling combobox input and the Regular dropdown's own toggle);
- `aria-label="Toggle options"` — accessible name for the icon-only button.

No existing `data-*`/`role`/`aria` attribute was removed or renamed; the
`button[role="combobox"]` + `aria-expanded` + portalled `[role="listbox"]` test
contract is intact (the combobox role stays on the input; the arrow is additive).

## Sibling shapes intentionally NOT statically detected

Instances 1 and 2 share the CLASS but not this module's detectable signature, so
they are out of scope by design (already fixed by the per-component audit; no
generic low-false-positive static signature):

- **execCommand toolbar buttons** — onClick is `handleEditorAction('bold')` and
  active state comes from `document.queryCommandState`, not an inline boolean flip.
- **exclusive `<ButtonGroup>` children** — goobs `<Button value=…>` with no
  per-button onClick; detecting this needs cross-tag context and would false-flag
  ordinary button rows.

Documented in the module header so a future author knows the boundary rather than
re-deriving it. Both live behind `aria-pressed` today.

## Regression story

`SearchableHistory.stories.tsx` → **`A11y: arrow toggle exposes expanded state`**
(play function): resting = collapsed on both the combobox input and the arrow;
clicking the arrow opens the listbox and flips `aria-expanded` to `true` on both.
Matches the repo's `storybook/test` play-assertion pattern (cf. SearchableSimple
`InteractionTest`).

## Verification

- `bun scripts/lint-a11y.ts --only toggle-missing-aria-pressed` → **clean, 464 files**.
- `bun lint:file` on `SearchableHistory/index.tsx` and its story → exit 0.
- The detection module itself is under `scripts/` (outside the app eslint scope,
  like every sibling a11y-lint module); its own selftest is its gate and passes.

## Deferred (files not owned)

None. The only violation outside the seed component (SearchableHistory) is code the
class-lint owner is authorized to fix, and it was fixed here. No shared-util /
FieldShell / barrel change was required.
