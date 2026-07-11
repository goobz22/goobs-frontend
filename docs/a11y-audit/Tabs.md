# Tabs — a11y audit (2026-07-11)

**Status:** FIXED

**APG pattern:** [Tabs](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/) — a
`role="tablist"` container of `role="tab"` buttons with roving tabindex and
**automatic activation**, paired with the exported `<TabPanel role="tabpanel">`.

**Component:** `src/components/Tabs/index.tsx` (default `Tabs`, plus exported
`Tab`, `TabPanel`, `tabPanelId`), `src/components/Tabs/Tabs.module.css`,
`src/components/Tabs/Tabs.stories.tsx`.

## Pattern-compliance baseline (already correct — no change)

The core tablist wiring was already sound and is preserved verbatim:

- `role="tablist"` + `aria-label` (default `"Workspace sections"`, overridable) — `index.tsx:259-260`.
- Each tab: native `<button type="button" role="tab">`, `aria-selected`, `aria-controls`,
  `id="tab-<id>"`, roving `tabIndex` (0 active / -1 inactive) — `index.tsx:386-402`.
- `<TabPanel>`: `role="tabpanel"`, `aria-labelledby="tab-<id>"`, `id` from the shared
  `tabPanelId()` helper so `tab.aria-controls === panel.id` by construction — `index.tsx:448-465`.
- Keyboard: ArrowLeft/ArrowRight roving, Home/End bounds, Enter/Space via native button —
  `index.tsx:177-198`. `preventDefault()` only on the handled keys.
- Leading string glyph is `aria-hidden` (decorative); ReactNode icon left to the caller — `index.tsx:403-411`.
- All `data-*` test selectors (`data-component`, `data-tab-id`, `data-tab-subject`,
  `data-tab-active`, `data-tab-count`, `data-state`, `data-tabs-appearance`) intact.

## Issues found

| # | Severity | WCAG | Location | Status |
|---|----------|------|----------|--------|
| 1 | Serious  | 2.4.7 Focus Visible (A) / 2.4.11 Focus Appearance (AA) | `Tabs.module.css:64` (`.tab { outline: none }`, no `:focus-visible`) | FIXED |
| 2 | Moderate | 2.3.3 Animation from Interactions (AAA) | `Tabs.module.css:61` (`transition: all 0.3s`) + theme transitions, no reduce block | FIXED |
| 3 | Moderate | 1.3.1 Info and Relationships (A) | `index.tsx:415` count badge `aria-hidden="true"` | FIXED |

### 1 — No keyboard focus indicator (Serious, 2.4.7)
`.tab` hardcoded `outline: none` and the module defined **no** `:focus-visible`
replacement. With roving tabindex + a *controlled* `activeTab`, keyboard focus can
land on a tab that is not the active one (host hasn't updated `activeTab`, or a
`route`/`onClick` tab whose host never does) — that tab has no active styling and,
with the UA outline suppressed, **no visible focus at all**. Pattern class:
`missing-focus-visible-style`.

### 2 — Motion not reduced (Moderate, 2.3.3)
`.tab` animates `transition: all 0.3s ease` and the light/dark variants add
`transition: var(--goobs-transition-medium)`; the module had no
`@media (prefers-reduced-motion: reduce)`. Pattern class: `missing-reduced-motion`.

### 3 — Count badge hidden from assistive tech (Moderate, 1.3.1)
The count badge (e.g. `5` on an "Inbox" tab, `12` on "Statements") was rendered
`aria-hidden="true"`, so screen-reader users got the label but never the count —
information conveyed only visually with no programmatic equivalent. Pattern class:
`status-not-announced`.

## Hearing (WCAG 1.2.x, 1.4.2)
N/A — no `Audio`/`AudioContext`/`<audio>`/`<video>`/`navigator.vibrate` in the
component (grep-verified). No information is conveyed by sound; activation state is
visual + programmatic (`aria-selected`, `data-tab-active`). No finding.

## Reading & screen reader (1.1.1, 1.3.1, 1.4.1, 2.1.x, 2.4.x, 4.1.2)
- Accessible names present on every tab (button text content; icons decorative-hidden).
- Full APG tablist roles/states/properties present (see baseline above).
- **Fix 1** restores a visible keyboard-focus ring per theme (sacred `--goobs-sacred-focus-ring`;
  light/dark use the SOLID `--goobs-{light,dark}-primary` per review R1 for ≥3:1 non-text contrast).
- **Fix 3** puts the count into the tab's accessible name ("Inbox 5"), matching the visual.
- Color is never the sole signal: selected state = `aria-selected` + `data-tab-active` +
  weight/underline/glow, not colour alone (1.4.1). No finding.

## SEO semantics (SSR)
- The component IS a tablist, not a heading/landmark — `role="tablist"` is correct; no
  heading text is rendered as a styled `<div>`, so no `nonsemantic-heading` issue.
- **DEFERRED (design):** `trigger: 'route'` tabs navigate via `window.location.assign()`
  on a `<button>` rather than a crawlable `<a href>` — see Deferred.

## Fixes applied
1. **Focus-visible ring** (`Tabs.module.css`): added `.tab:focus-visible { outline: 2px
   solid var(--goobs-sacred-focus-ring); outline-offset: 2px }` plus
   `[data-theme='light']`/`[data-theme='dark']` `outline-color` overrides. The base
   `outline: none` is kept so pointer users see no ring. **Corrected in the review
   follow-up** (see below): the light/dark overrides now use the SOLID primary tokens
   (`--goobs-{light,dark}-primary`), not the translucent `--goobs-{light,dark}-focus-ring`
   tokens, which fail non-text contrast — matching Button.
2. **Reduced motion** (`Tabs.module.css`): added
   `@media (prefers-reduced-motion: reduce)` zeroing the transition on `.tab` and both
   theme variants (listed explicitly to match specificity); hover/active/focus remain
   instant, still-visible state changes.
3. **Count announced** (`index.tsx`): removed `aria-hidden="true"` from the count `<span>`
   so the number joins the tab's accessible name (WCAG 1.3.1). `data-tab-count` and the
   `.count` class are untouched, preserving the test contract and visual.

## Stories updated
- **New `KeyboardNavigation` story** (`Tabs.stories.tsx`): controlled tabs with a count on
  "Inbox". The play test pins: roving tabindex (`0`/`-1`), ArrowRight/End/Home moving focus
  *and* activating (`aria-selected`), focus landing on tabs (renders the new
  `:focus-visible` ring for the Chromatic snapshot), and the count appearing in the
  accessible name (`getByRole('tab', { name: /Inbox\s*5/ })`). Focus assertions use
  `waitFor` because `<Tabs>` moves focus in a `requestAnimationFrame`.
- Existing `ChipAppearance` still asserts the counted "Ledger 3" tab by `role`/text — the
  un-hidden badge keeps `/Ledger/` matching and `toHaveTextContent('3')` passing, so no
  regression. `WithPanelsAriaPairing` (aria-controls↔panel id) unchanged and still green.

## Deferred (out of this directory's ownership OR design decisions to escalate)

None require edits to files outside my directory. Two **design** observations left as-is to
avoid changing the public DOM/behavior contract without a product decision:

1. **`trigger: 'route'` tabs are not real anchors** (`index.tsx:167-169`,
   `window.location.assign`). A `<button role="tab">` that performs a full page navigation
   is (a) not crawlable as a link (SEO), (b) announced as "tab" not "link", and (c) under
   automatic activation, ArrowRight navigates away immediately (a context change on
   selection — WCAG 3.2.2 territory). A proper fix would render route tabs as `<a href>`
   (still `role="tab"`) and/or switch route tabs to **manual** activation (move-focus-only
   on arrow, activate on Enter/Space). This is a behavioral/API change touching the machine-
   test contract, so it is escalated rather than applied here. Pattern class:
   `clickable-noninteractive-element` (navigation-as-tab variant).
2. **`aria-controls` can dangle** when a consumer renders `<Tabs>` without matching
   `<TabPanel>`s (route/onClick tabs) — **RESOLVED in the review follow-up** (see below).
   `<Tab>` now reconciles the idref after mount, keeping `aria-controls` only while the
   referenced panel is actually in the DOM.

## Adversarial review follow-up (2026-07-11)

A review of the pass above found two remaining issues; both are now fixed.

| # | Severity | WCAG | Location | Status |
|---|----------|------|----------|--------|
| R1 | Serious | 1.4.11 Non-text Contrast / 2.4.11 Focus Appearance (AA) | `Tabs.module.css` light/dark `:focus-visible` `outline-color` | FIXED |
| R2 | Minor   | 4.1.2 / ARIA idref validity | `index.tsx` `<Tab aria-controls>` dangling for panel-less tabs | FIXED |

### R1 — Focus ring failed non-text contrast in light/dark (Serious)
The original Fix 1 set `outline-color: var(--goobs-light-focus-ring)`
(`rgba(59,130,246,0.4)`) and `var(--goobs-dark-focus-ring)` (`rgba(96,165,250,0.45)`).
Over the tab surface (with `outline-offset: 2px` exposing the backdrop) the translucent
rings composite to ~1.6:1 (light) and ~2.0–2.3:1 (dark) — both below the 3:1 non-text
floor. Only the sacred ring (`gold-a60`, ~5.3:1) passed. This is the identical defect
Button.md R1 documented; Button deliberately uses the SOLID primary. **Fix:** the light/dark
`:focus-visible` overrides now use `var(--goobs-light-primary)` (`#2563eb`, ~5.2:1) and
`var(--goobs-dark-primary)` (`#60a5fa`, ~4.8–5.8:1), matching Button. Sacred keeps its
focus-ring token (already ≥3:1). Pattern class: `translucent-focus-ring-below-3to1`
(shared with Button).

### R2 — `aria-controls` dangled for panel-less tabs (Minor)
Every `<Tab>` emitted `aria-controls="tabpanel-<id>"` unconditionally, but that panel only
exists when the consumer also renders `<TabPanel>` — which the majority (route/onClick)
usage never does, so the idref referenced a non-existent element. `trigger` does NOT
distinguish the two (the `WithPanelsAriaPairing` case uses `trigger:'onClick'` WITH panels),
so the only correct signal is whether the panel is actually in the DOM. **Fix:** mirrors the
established `<Card>` aria-labelledby reconciliation (`Card/index.tsx:354-363`) — the
attribute stays in the server markup (identical SSR/hydration output, no mismatch) and is
reconciled after mount by a `useEffect` that asserts `aria-controls` only while
`document.getElementById(panelId)` resolves, and removes it otherwise. `isActive` is an
effect dependency so consumers that mount only the active panel re-reconcile on activation.
A `role="tab"` with no `aria-controls` is valid ARIA. Pattern class: `dangling-aria-idref`
(shared with Card's `aria-labelledby`).

### Follow-up stories
- **New `AriaControlsRequiresPanel`** (`Tabs.stories.tsx`): renders the panel-less `onClick`
  tab set and asserts every tab ends up WITHOUT `aria-controls` (no dangling idref).
- **`WithPanelsAriaPairing`** now asserts the `aria-controls`↔panel links via `waitFor`
  (the attribute is set by a post-mount effect); with both panels rendered the links survive,
  pinning the opposite half of R2.
- R1 needs no new story — `KeyboardNavigation` already renders the focused `:focus-visible`
  ring for the Chromatic snapshot; the token swap is a colour change under the same state.
