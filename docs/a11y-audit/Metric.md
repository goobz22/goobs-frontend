# Metric — a11y audit (2026-07-11)

**Status:** FIXED

The `components/Metric/` directory is a namespace, not one component. It exports two
things, audited together:

- **`MetricCard`** (`Card/index.tsx`) — a compact single-KPI display card.
- **`MetricsAccordion`** (`Accordion/index.tsx`) — the collapsible shell that renders an
  array (or labelled groups) of those cards.

## APG pattern

- **`MetricsAccordion` → Disclosure** (single toggle button + single collapsible panel),
  named "accordion" but structurally a disclosure. Correctly implemented core: native
  `<button>` with `aria-expanded`, `aria-controls={panelId}`, panel `role="region"`
  `aria-label={title}`, panel unmounted while collapsed, chevron `aria-hidden`. Keyboard
  Enter/Space/Tab work natively. Gaps were focus visibility, motion, and the missing
  heading wrapper the WAI-ARIA accordion pattern recommends.
- **`MetricCard` → non-interactive display** (`role="group"` labelled `"<label>: <value>"`).
  Already sound: decorative icon `aria-hidden`, trend conveyed by arrow glyph + text +
  `aria-label` + `data-metric-trend` (not colour-alone), all content in the SSR'd HTML.

## Issues found

| # | Severity | WCAG | Location | Issue | Status |
|---|----------|------|----------|-------|--------|
| 1 | serious | 2.4.7 Focus Visible / 2.4.11 Focus Appearance | `Accordion/Accordion.module.css` `.toggle` (was line ~65) | The disclosure toggle `<button>` had **no `:focus-visible` rule** and relied on the UA default outline — every other goobs interactive component (Button, Chip, sibling Accordion) defines an explicit per-theme ring. | FIXED |
| 2 | minor | 2.3.3 Animation from Interactions | `Accordion/Accordion.module.css` `.chevron` (`transition: transform 0.2s`, line ~93) | Chevron 180° rotate transition had **no `prefers-reduced-motion` handling**. | FIXED |
| 3 | moderate | 1.3.1 Info and Relationships (+ SEO) | `Accordion/index.tsx` toggle (was line ~254) | The section header ("Metrics Summary" / "Automation Metrics") rendered only as a `<span>` inside a bare `<button>` — **not a heading**, and no way for a consumer to place it in the document outline. The WAI-ARIA accordion pattern wraps each header button in a heading. | FIXED |
| 4 | minor | 1.3.1 Info and Relationships | `Accordion/index.tsx` `renderCard` / `metricsRow` (was line ~191, ~223) | In `metrics` mode the KPI strip rendered as sibling `<div>`s in a flex `<div>` — **no list semantics**, so screen readers got no "list, N items" affordance; grouped-mode card rows were not programmatically tied to their visible group label. | FIXED |
| 5 | minor | 2.3.3 Animation from Interactions | `Card/Card.module.css` `.card` (`transition: border-color 0.2s`, line ~42) | Card border-colour transition had **no `prefers-reduced-motion` handling**. | FIXED |
| 6 | moderate | 1.3.1 Info and Relationships | `Accordion/index.tsx` grouped `<ul>` (line ~247) + flat `<ul>` (line ~258) | **Adversarial-review follow-up to Issue 4.** Both new metric `<ul>`s carried NO explicit `role="list"` while `.metricsRow` sets `list-style:none` (`Accordion.module.css:145`). WebKit removes the implicit `list` role from any bulletless `<ul>`, so VoiceOver (primary iOS/macOS SR) would NOT announce "list, N items" — silently defeating Issue 4's own fix. The library already documents this exact convention (`List/index.tsx:85`, `Card/index.tsx`, `ListItemCard`, `ProjectBoard/board/index.tsx`). | FIXED |

## Hearing

CLEAN. Grepped the whole `Metric/` tree for `new Audio` / `AudioContext` /
`navigator.vibrate` / `<audio>` / `<video>` / `autoplay` — no matches. No information is
conveyed by sound; the expand/collapse and trend states are all visual + programmatic
(`aria-expanded`, `data-state`, `aria-label`, `data-metric-trend`). No 1.2.x/1.4.2 surface.

## Reading & screen reader

- **Accessible names present** — the toggle's name comes from its visible `<span>{title}</span>`
  (chevron is `aria-hidden`); `MetricCard` is a `role="group"` with `aria-label`; the trend
  pill and decorative icon are handled (`aria-label` / `aria-hidden`). No icon-only control
  lacks a name.
- **Focus (Issue 1)** — added a per-theme `.toggle:focus-visible` ring
  (`outline: 2px solid var(--goobs-<theme>-focus-ring)`, inset `outline-offset: -2px` so an
  open accordion's ring doesn't overlap the panel butting up beneath it), mirroring the
  sibling `Accordion` and `Button`. No overlay/focus-trap concerns — the panel is inline,
  not modal.
- **Heading (Issue 3)** — added an additive, optional `headingLevel?: 1|2|3|4|5|6` prop.
  When set, the toggle button is wrapped in a real `<h1>`–`<h6>` (`React.createElement`),
  keeping every disclosure attribute + test selector on the inner button. Deliberately
  **default-omitted** (bare button, no DOM change for existing consumers) — a
  context-agnostic primitive cannot know the correct outline depth, so a hardcoded level
  would itself be a 1.3.1 defect. This matches the established sibling-`Accordion`
  convention.
- **List semantics (Issues 4 + 6)** — `metrics`-mode rows now render as `<ul>`/`<li>` with the
  UA list chrome reset in CSS so the flex layout is unchanged. Because that reset sets
  `list-style:none`, both `<ul>`s carry an **explicit `role="list"`** (WebKit/VoiceOver strip
  the implicit list role from a bulletless `<ul>`, defeating the "list, N items" announcement) —
  matching the established library convention (`List/index.tsx:85`, `Card`, `ListItemCard`,
  `ProjectBoard/board`). In grouped mode each `<ul>` is additionally `aria-labelledby` its
  visible group label (`id` derived from `useId`), tying the list to its label programmatically.
  Children-mode and standalone `MetricCard` are untouched (caller owns that markup).
- **Colour is never the only signal** — trend direction is arrow glyph (↗/↘) + percentage
  text + `aria-label` + `data-metric-trend`; open/closed is `aria-expanded` + `data-state` +
  the (decorative) chevron rotation. Confirmed no colour-alone state (1.4.1).
- **Motion (Issues 2, 5)** — both module CSS files now have
  `@media (prefers-reduced-motion: reduce)` blocks zeroing the chevron and card transitions.

## SEO semantics

- Real `<button>` (not an onClick div), real `<h1>`–`<h6>` when `headingLevel` is set, real
  `<ul>`/`<li>` for the metric list, panel `role="region"` landmark labelled by the title.
- All primary content (titles, values, labels, trend text) is plain text present in the
  SSR'd HTML — no client-only injection, no canvas/QR alternative needed.
- No `linkComponent`/`<a>` surface in this component (no links to make crawlable).

## Fixes applied

1. `Accordion/Accordion.module.css`: per-theme `.toggle:focus-visible` outline (sacred base
   + `[data-theme='light']` + `[data-theme='dark']` colour overrides).
2. `Accordion/Accordion.module.css`: `.heading { margin:0; font:inherit }` for the optional
   heading wrapper; list-reset (`list-style/margin/padding`) on `.metricsRow`; a
   `@media (prefers-reduced-motion: reduce)` block for `.toggle`/`.chevron`.
3. `Accordion/index.tsx`: additive `headingLevel` prop (JSDoc'd); toggle button extracted +
   optionally wrapped in `<hN>`; `renderCard` now returns `<li>`; flat + grouped rows now
   `<ul>` **with explicit `role="list"`** (Issue 6); grouped rows `aria-labelledby` their group
   label; `reactId` added to the `renderedMetrics` `useMemo` deps.
4. `Card/Card.module.css`: `@media (prefers-reduced-motion: reduce)` block for `.card`.

No existing prop, export, `data-*`, `role`, or `aria-*` attribute was renamed or removed;
all changes are additive. Machine-test selectors preserved
(`data-component`, `data-metrics-accordion`, `data-state`, `data-testid`,
`data-metric-*`, `data-metrics-group`, `aria-expanded`/`aria-controls`).

## Stories updated

Yes. `Accordion/metricsAccordion.stories.tsx`:
- `A11y/Heading Level` — `headingLevel: 3` (exercises the `<h3>` wrapper + flat list markup).
  Now carries a **`play` regression assertion** (`storybook/test` `expect`) that the flat
  `<ul>` has `role="list"` and exactly `sampleMetrics.length` `<li>` children — fails if the
  role (Issue 6) is dropped.
- `A11y/Grouped List Semantics` — grouped metrics + `headingLevel: 3`. Now carries a **`play`
  regression assertion** that EVERY grouped `<ul>` has both `role="list"` and an
  `aria-labelledby` — pinning both the Issue 4 label association and the Issue 6 explicit role.

`MetricCard.stories.tsx`:
- `Accordion/Heading Level` — array-mode accordion with `headingLevel={3}`.

`:focus-visible` and `prefers-reduced-motion` are CSS states on already-storied elements
(the toggle is reachable by Tab in every expanded story; reduced-motion is environmental) —
no separate story needed to reach them.

## Deferred

None. Every issue was fixable inside the owned `Metric/` directory. No shared-file
(`src/styles/global.css`, barrel, FieldShell) change was required — the focus-ring tokens
(`--goobs-{sacred,light,dark}-focus-ring`) already exist in `global.css`.
