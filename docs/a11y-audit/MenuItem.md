# MenuItem — a11y audit (2026-07-11)

**Status:** FIXED

## APG pattern

MenuItem renders a **native `<option>`** element (`src/components/MenuItem/index.tsx:88`)
and is consumed as a child of the `Select` component, which renders a real native
`<select>` (`src/components/Select/index.tsx:177`). The applicable WAI-ARIA APG pattern is
therefore the **Listbox / native combobox**, delivered through native HTML semantics rather
than a custom role-annotated widget.

This is the most accessible possible implementation: the browser supplies the full keyboard
interaction table (Tab/Shift+Tab to the control, Up/Down/Home/End/type-ahead to move between
options, Enter/Space/Escape to open/commit/dismiss), focus management, and the "selected"/
"disabled" announcements natively. No custom keyboard handling, focus trap, or `role`/`tabindex`
scaffolding is needed or appropriate for an `<option>`. Consequently several checklist items
(arrow-key nav, focus trap, focus restoration, Escape handling) are **owned by the browser and
the parent `<select>`** — MenuItem must not re-implement them.

Accessible name is present: it comes from the option's text content (`children`), so no
`aria-label` gap. `disabled` is forwarded to the **native `disabled` attribute**
(`index.tsx:99`), so the disabled state is programmatic and browser-announced (not color-alone).

## Issues found

| # | Severity | WCAG | Location | Issue | Status |
|---|----------|------|----------|-------|--------|
| 1 | Moderate | 1.4.1 Use of Color (A); 4.1.2 Name, Role, Value (A) | `src/components/MenuItem/index.tsx:96` | The custom `selected` prop was conveyed **only** by a tinted background + accent text color, plus a `data-selected` attribute that is a machine-test hook a screen reader never reads. No programmatic selected state was exposed to assistive tech. | **FIXED** |
| 2 | Minor | 2.3.3 Animation from Interactions (AAA); supports 2.2.2 | `src/components/MenuItem/MenuItem.module.css:55` | `.root` declares `transition: var(--goobs-transition-medium)` (and a parity keyframe) with no `prefers-reduced-motion` guard. | **FIXED** |

No other defects found. Specifically **not** flagged (intentional / not applicable):

- **Native `selected` attribute is deliberately NOT set.** The `selected` prop drives only the
  visual/AT highlight; the actual selection is controlled by React via `<select value>`
  (`Select/index.tsx:182`). Forwarding the native `selected` content attribute would trigger
  React's controlled-select warning and fight the value binding — so `aria-selected` (additive)
  is the correct exposure, not native `selected`.
- **No `:focus-visible` rule added.** A native `<option>` is not an independent tab stop and its
  rendering is OS-controlled; the visible focus ring lives on the `<select>` combobox, owned by
  the `Select` component. A `:focus-visible` rule on `.root` would be inert dead CSS.
- **Test-selector contract preserved.** `data-component`, `data-action`, `data-subject`,
  `data-dense`, `data-divider`, `data-selected`, `data-disabled`, and native `disabled` are all
  untouched. No existing prop/attribute was renamed, removed, or retyped.

## Hearing (WCAG 1.2.x, 1.4.2)

**CLEAN.** Grepped the component directory for `new Audio`, `AudioContext`, `navigator.vibrate`,
`<audio>`, `<video>`, `.play(`, `beep`, `sound` — **no matches**. The only side-effect on
activation is `emitDiag({ type: 'action.invoke', ... })` (`index.tsx:59`), a silent diagnostic
event, not audio feedback. No information is conveyed by sound; nothing to remediate.

## Reading & screen reader (1.1.1, 1.3.1, 1.4.1, 2.1.x, 2.4.x, 3.3.x, 4.1.2)

- **Accessible name:** present via `children` text content — no icon-only/`aria-label` gap.
- **Semantic HTML:** uses native `<option>` (correct element for a `<select>` child) — no
  role-annotated `div`.
- **Keyboard:** fully native via the parent `<select>` — nothing to build.
- **Disabled:** programmatic (native `disabled` + `data-disabled` + opacity/color) — not
  color-alone. Correct before this audit.
- **Selected:** was color-alone → **fixed** by mirroring the `selected` prop to
  `aria-selected="true"` (valid on the option's implicit `role="option"`; additive; placed
  before `{...props}` so a caller-supplied `aria-selected` still wins). `data-selected` retained
  as the test hook.
- **Divider:** decorative grouping only (bottom border); not a stateful/semantic distinction —
  no programmatic exposure required.

## SEO / semantics (SSR)

**CLEAN.** The component emits a real `<option>` with its text `children` present in the SSR'd
HTML — all meaningful content is server-rendered, no client-only injection. MenuItem is not a
landmark, heading, link, or table, so those checklist items do not apply. No `headingLevel`/
`linkComponent`/list-semantics obligations for an `<option>`.

## Fixes applied

1. **`aria-selected` programmatic exposure** — `src/components/MenuItem/index.tsx`: added
   `aria-selected={selected ? 'true' : undefined}` to the rendered `<option>`, before the
   `{...props}` spread (caller override preserved). Removes the color-only reliance for the
   `selected` highlight and exposes it to assistive tech. Additive; no DOM element change; no
   existing attribute altered.
2. **`prefers-reduced-motion` guard** — `src/components/MenuItem/MenuItem.module.css`: added an
   `@media (prefers-reduced-motion: reduce)` block that sets `transition: none; animation: none`
   on `.root`, so users requesting reduced motion get instant state changes.

## Stories updated

Added `SelectedStateAnnounced` to `src/components/MenuItem/MenuItem.stories.tsx` — a controlled
`Select` with a `selected` TypeScript item and a `play` assertion that pins the new contract:
`aria-selected="true"` **and** `data-selected="true"` on the selected option, and **no**
`aria-selected` on non-selected options (guards against false-positive announcements). This is
the regression test for fix #1. (The `prefers-reduced-motion` fix #2 is a media-query CSS change
not exercisable via a play assertion; it is verified structurally in the module.css.)

## Deferred

None. Both findings were fixable at root cause inside the MenuItem directory. No changes were
required in files outside my ownership (Select, Field/Shell, global.css, the barrel).
