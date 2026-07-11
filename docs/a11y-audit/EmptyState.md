# EmptyState — a11y audit (2026-07-11)

**Status:** FIXED

**APG pattern:** [Status / live region](https://www.w3.org/WAI/ARIA/apg/patterns/alert/)
(the polite sibling of the Alert pattern). EmptyState is a non-interactive, zero-data
placeholder rendered with `role="status"` (implicit `aria-live="polite"` +
`aria-atomic="true"`) so assistive tech announces the empty condition when the placeholder
appears dynamically (e.g. a list becomes empty), without stealing focus. It is **not** a
composite widget — it has no roving-tabindex / arrow-key model, no focus trap, and no
interactive element of its own (the optional `actions` slot holds consumer-supplied
controls that carry their own semantics). This is intentional and correct for the pattern.

Component files: `src/components/EmptyState/index.tsx`,
`src/components/EmptyState/EmptyState.module.css`,
`src/components/EmptyState/EmptyState.stories.tsx`. `<Card.EmptyState>` is a thin re-export
of this component, so the fix reaches both the standalone use and `<Card.Grid empty={…}>`.

## Issues found

### 1. Title rendered as a styled `<p>`, not a real heading — SERIOUS — FIXED
- **WCAG:** 1.3.1 Info and Relationships (A); 2.4.6 Headings and Labels (AA); 2.4.10
  Section Headings (AAA — required by this audit's SEO-semantic checklist)
- **Pattern:** `nonsemantic-heading`
- **Where:** `src/components/EmptyState/index.tsx:67` (pre-fix) —
  `<p className={cssStyles.emptyStateTitle}>{title}</p>`. The prop's own JSDoc calls `title`
  the *"Primary heading"* and the CSS styles it as one (larger, 600-weight, accent colour),
  yet it was emitted as a `<p>`. Screen-reader users navigating by heading (`H` / rotor)
  could not reach the placeholder's heading, and the SSR'd/crawled HTML (goobs runs inside
  Next.js SSR) contained no heading for the empty-state title. This is the "styled non-heading
  carrying heading text" shape the checklist flags.
- **Fix:** added an **additive** `headingLevel?: 1 | 2 | 3 | 4 | 5 | 6` prop (default `2`) and
  render the title as a genuine `<h1>`–`<h6>` element:
  `const HeadingTag = \`h${headingLevel}\` as ElementType` →
  `<HeadingTag className={cssStyles.emptyStateTitle}>{title}</HeadingTag>`
  (`index.tsx:47,55,84`). The consumer controls the level so the placeholder slots into the
  surrounding document outline without breaking heading order. This mirrors the repo's
  established convention (Accordion's `headingLevel?: 1|2|3|4|5|6`; Card's
  `HeadingTag … as ElementType` render). `.emptyStateTitle` already sets `margin: 0` + explicit
  `font-size`/`font-weight`, so the heading element is visually identical to the old `<p>` — no
  CSS change was required.
- **Markup change (noted per audit rules):** the title element changes from `<p>` to
  `<h2>` by default (or `<h{headingLevel}>`). No `data-*`/`role`/`aria` attribute and no
  className changed, so the machine-test selector contract and visual output are preserved; the
  change is a semantic upgrade only.

## Hearing

No `<audio>`/`<video>`, `new Audio`, `AudioContext`, `.play()`, or `navigator.vibrate` exists
in the component (grepped `src/components/EmptyState/` — `NO_AUDIO_MEDIA_FOUND`). No information
is conveyed by sound. The empty condition is conveyed visually (icon + title + description) and
programmatically (`role="status"` live region + the `component.state: 'empty'` diagnostics
beacon). WCAG 1.2.x / 1.4.2 do not apply. No change needed.

## Reading & screen reader

- **Live-region announcement (correct, preserved):** `role="status"` on the root
  (`index.tsx:77`) means a placeholder that appears after load is announced politely without
  stealing focus. Kept as-is — this is the right, less-interruptive choice for an advisory
  empty state (vs the assertive `role="alert"`).
- **Decorative icon hidden (correct, preserved):** the icon wrapper carries
  `aria-hidden="true"` (`index.tsx:80`); the icon is pure reinforcement of the title, so hiding
  it from AT avoids emoji/`<svg>` noise. Already correct — no `icon-missing-aria-hidden` defect.
- **Heading now reachable:** the title is a real heading (issue 1), so heading navigation lands
  on it and its accessible name is the title text.
- **No colour-only state:** the empty condition is text-first (title + optional description);
  colour/border are decorative reinforcement only. No `color-only-state` defect (1.4.1).
- **Keyboard:** EmptyState itself is non-interactive and takes no tabindex, so it needs no
  `:focus-visible` treatment and no keyboard model; the Status pattern has no arrow/Home/End
  interaction table. Consumer-supplied `actions` (e.g. `<CustomButton>`) bring their own
  native-button semantics, focus ring, and Enter/Space handling — out of this component's scope.
  No `missing-focus-visible-style` or `missing-keyboard-arrow-nav` defect.
- **Primary content is SSR'd:** title, description, and icon are all rendered server-side; only
  the diagnostics beacon runs in `useEffect` (client-only) and carries no user-facing content.
  No client-only injection of primary content.

## SEO semantics

- **Heading:** FIXED — the title is now a genuine `<h1>`–`<h6>` (issue 1), with the level
  controllable by the consumer via the additive `headingLevel` prop, so the crawled HTML
  contains a real heading at a caller-chosen outline level.
- **Landmarks:** EmptyState is a `role="status"` region, not a `<nav>`/`<header>`/`<aside>`
  landmark, and holds no list/table/link content of its own — so no landmark, `<ul>`/`<ol>`,
  `<table scope>`, or `<a href>` work applies. Correct as-is.
- **Links:** the component renders no links; any links live in consumer `actions`.

## Fixes applied

1. Added additive `headingLevel?: 1 | 2 | 3 | 4 | 5 | 6` prop (default `2`) and render the
   `title` as a real `<h{level}>` heading instead of a styled `<p>`
   (`index.tsx:14-21,47,50-55,84`), with updated component/prop JSDoc. No CSS change needed —
   `.emptyStateTitle` already neutralises the heading element's default margin/size, preserving
   visual parity.

All API changes are additive — no prop renamed/removed/retyped, no existing
`data-*`/`role`/`aria` attribute removed, and the machine-test selector contract
(`data-component="EmptyState"`, `data-theme`, `data-empty-state="true"`, `role="status"`) is
untouched. Per-file gate `bun lint:file` passes for both `index.tsx` and
`EmptyState.stories.tsx`.

## Stories updated

- **`AccessibilitySemantics`** (new) — play function asserts the title is a real heading at the
  default level 2 (`getByRole('heading', { level: 2, name: 'No assignees yet' })`), the root is a
  `role="status"` live region, and the description content is present in the DOM. Locks issue 1 +
  the live-region behaviour so a regression (reverting to `<p>`, or dropping `role="status"`)
  fails the story.
- **`CustomHeadingLevel`** (new) — renders with `headingLevel={3}` and asserts
  `getByRole('heading', { level: 3, name: 'No results' })`, proving the level is genuinely
  consumer-controllable (a regression that hardcodes `h2` fails).

## Deferred

None. No fix required a file outside this component's directory — the single defect was fully
addressed inside `src/components/EmptyState/`. No shared-util, Field/Shell, `global.css`, or
barrel change was needed.
