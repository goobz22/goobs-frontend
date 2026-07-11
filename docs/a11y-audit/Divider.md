# Divider — a11y audit (2026-07-11)

**Status:** FIXED

**APG pattern:** [Separator](https://www.w3.org/WAI/ARIA/apg/patterns/) — the ARIA
`separator` role (the role equivalent of a native `<hr>`). A goobs `Divider` is a
non-focusable, static separator (not a focusable window-splitter), so it needs the
`separator` role + `aria-orientation` but has **no keyboard interaction** and no
`aria-valuenow`/`min`/`max`.

Root element stays a `<div>` (the public API pins `forwardRef<HTMLDivElement>` and spreads
`HTMLAttributes<HTMLDivElement>`, so switching to `<hr>`/`HTMLHRElement` would be a breaking
retype — and `<hr>` is a void element that cannot host the centered label). Semantics are
added via `role="separator"` on the div, which is fully equivalent for AT.

## Issues found

| # | Severity | WCAG 2.2 | Location | Issue | Status |
|---|----------|----------|----------|-------|--------|
| 1 | Serious | 1.3.1 Info & Relationships (A) | `src/components/Divider/index.tsx:121` (pre-fix) | Root rendered as a bare `<div>` with `data-component`/`data-theme` but **no `role`** — a screen reader saw an anonymous group, not a thematic break. The component's entire semantic purpose (a separator between content) was invisible to AT. | FIXED |
| 2 | Moderate | 1.3.1 Info & Relationships (A) | `src/components/Divider/index.tsx:121` (pre-fix) | Vertical orientation was conveyed **only via CSS class** (`.vertical`) — no `aria-orientation`, so AT could not tell a vertical rule from a horizontal one. | FIXED |
| 3 | Moderate | 4.1.2 Name, Role, Value (A); 1.3.1 (A) | `src/components/Divider/index.tsx:129` (pre-fix) | The centered label (e.g. `"OR"`) had no programmatic association to the rule. Once `role="separator"` is applied, ARIA marks descendants **presentational** ("children presentational: true"), so the visible label would be dropped from the a11y tree unless it is wired as the separator's accessible name. | FIXED |

No other checklist categories applied:
- **Hearing (1.2.x / 1.4.2):** no `Audio`/`AudioContext`/`<audio>`/`<video>`/`navigator.vibrate` anywhere in the component (grep clean). No audio-only status. N/A.
- **Motion (2.3.3):** `Divider.module.css` contains **no `transition`, `animation`, or `@keyframes`** (grep clean), so `prefers-reduced-motion` is not needed. N/A.
- **Focus / keyboard (2.1.x, 2.4.x):** a Divider is non-interactive — no focusable descendants, no `onClick`, not in tab order. A static separator has no APG keyboard interaction. Correctly nothing to add.
- **Color-only state (1.4.1):** the `disabled` style is a decorative opacity dim on a non-interactive rule; it conveys no actionable information a user must perceive, so it is not a 1.4.1 violation. Left as-is (intentional visual styling).

## Fixes applied

All fixes are inside `src/components/Divider/` and are **additive** (no prop renamed/removed/retyped; existing `data-component`/`data-theme` and the CSS-var passthrough contract untouched):

`src/components/Divider/index.tsx`
- Imported `useId` and generate a stable `contentId = \`divider-content-${reactId}\`` (matches the repo's Accordion `useId()` id-wiring convention).
- Added **`role="separator"`** to the root `<div>` — accessible-by-default semantic; placed **before `{...restProps}`** so a consumer can still override to `role="presentation"` for a purely decorative rule.
- Added **`aria-orientation={orientation}`** (`'horizontal' | 'vertical'`) so the rule's direction is programmatically exposed.
- Added **`aria-labelledby={children ? contentId : undefined}`** and set `id={contentId}` on the label `<div>`, so a labeled separator's visible text ("OR", …) becomes its accessible name despite the presentational-children rule.
- Added **`data-orientation={orientation}`** to the root, mirroring the library's `data-*` test-selector convention (aids Playwright keying; harmless, additive). Pairs with `aria-orientation`.

No CSS changes were required (no motion, no color-only state, focus-visible N/A on a non-interactive element).

## Stories updated

`src/components/Divider/Divider.stories.tsx` (stories are this repo's only regression tests):
- **`A11y/Separator Semantics`** (`AccessibleSeparator`) — renders horizontal (unlabeled), labeled (`"OR"`), and vertical rules together; JSDoc states the exact a11y-tree expectations (role, `aria-orientation` per orientation, and the label surfacing as the accessible name via `aria-labelledby`).
- **`A11y/Decorative Override`** (`DecorativeOverride`) — passes `role="presentation"` + `aria-hidden` through, proving the pass-through override wins over the accessible default (escape hatch for purely decorative rules).

All existing stories (LightTheme/DarkTheme/SacredTheme/WithText/WithoutText/DisabledStates/VerticalOrientation/CustomColors/SpacingExamples) now also exercise `role="separator"` since it renders on every instance.

## Gates

- `bun lint:file src/components/Divider/index.tsx` → exit 0
- `bun lint:file src/components/Divider/Divider.stories.tsx` → exit 0
- Repo-wide typecheck/build intentionally NOT run (owned by the batch gate agent). New JSX props (`role`, `aria-orientation`, `aria-labelledby`, `data-orientation`, `aria-hidden` shorthand) are all valid members of `HTMLAttributes<HTMLDivElement>`.

## Deferred

None. All findings were fixable at root cause inside the owned component directory; no shared-file (`src/styles/global.css`, barrel, Field/Shell) changes were required.
