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

### Adversarial-review round (2026-07-11) — 2 remaining issues, both FIXED

| # | Severity | WCAG 2.2 | Location | Issue | Status |
|---|----------|----------|----------|-------|--------|
| 4 | Minor | 4.1.2 Name, Role, Value (A) / axe `aria-allowed-attr` | `src/components/Divider/index.tsx:142` (pre-fix) | `aria-orientation` (and `aria-labelledby`) were rendered **unconditionally**, before `{...restProps}`. The documented decorative escape hatch is `role="presentation"`, but a `restProps` override of `role` cannot remove the separately-keyed `aria-orientation`, so `role="presentation"` **alone** produced `<div role="presentation" aria-orientation="horizontal">` — an axe `aria-allowed-attr` violation (`aria-orientation` is not allowed on `role="presentation"`). The `DecorativeOverride` story only avoided it because it *also* passed `aria-hidden`. | FIXED |
| 5 | Minor | 1.4.4 Resize Text (AA); 1.4.10 Reflow (AA) | `src/components/Divider/Divider.module.css:134-145` (pre-fix) | The labeled-separator overlay `.content` used `white-space: nowrap` on a `position: absolute` centered element with no width bound → a long label, or a short label at 200% text zoom, overflowed its container and forced a horizontal scrollbar. Never assessed in the first pass (ARIA-only). | FIXED |

**Fix #4 (root cause — `index.tsx`):** destructure `role` out of props and derive
`effectiveRole = role ?? 'separator'` + `isSeparator = effectiveRole === 'separator'`. The
root now renders `role={effectiveRole}` and **gates the separator-only ARIA** —
`aria-orientation={isSeparator ? orientation : undefined}` and
`aria-labelledby={isSeparator && children ? contentId : undefined}`. A decorative override
(`role="presentation"`/`"none"`) therefore drops those attributes automatically, so
`role="presentation"` **alone** is now `aria-allowed-attr`-clean — no `aria-hidden` needed.
The default separator case is unchanged (still emits `role="separator"` +
`aria-orientation`), so the machine-test contract and prior stories are preserved. Component
JSDoc updated to document the escape hatch.

**Fix #5 (root cause — `Divider.module.css`):** removed the blanket `white-space: nowrap`
from `.content`; added `text-align: center` + `box-sizing: border-box`. Scoped
resize/reflow behavior by orientation: `.horizontal > .content` gets
`max-width: calc(100% - 2 * var(--goobs-space-lg))` + `overflow-wrap: break-word` so a long
label **wraps** within the rule width as a centered chip instead of overflowing;
`.vertical > .content` keeps `white-space: nowrap` because the ~2px-wide vertical rule cannot
bound the label (a `%` max-width would collapse it). Short labels like `"OR"` render
identically (single centered line) — zero visual regression.

**Stories added/extended (regression tests):**
- `A11y/Decorative Override` (`DecorativeOverride`) — now renders `role="presentation"`
  **alone**, `role="none"` alone, AND the redundant `role="presentation" aria-hidden` form;
  JSDoc pins the exact axe expectation (no `aria-orientation` on the presentation/none rules).
- `A11y/Long Label Reflow` (`LongLabelReflow`) — a long label in a narrow 240px wrapper,
  proving the label wraps within the rule instead of overflowing horizontally.

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
