# Paper — a11y audit (2026-07-11)

**Status:** FIXED

## APG pattern

**None (generic surface primitive).** Paper is an elevated container that wraps
arbitrary children to group related content — analogous to MUI `Paper`. It maps
to no interactive WAI-ARIA APG widget pattern (not accordion/dialog/tabs/menu/
etc.), so there is no required role/state/keyboard interaction table. The
relevant a11y surface is therefore: **motion** (its `transition`), **document
semantics/SEO** (which element it renders), and **not regressing** the machine-
test selector contract (`data-component`/`data-form`/`data-subject`/`data-paper`
+ `data-theme`).

## Issues found

### 1. Root `transition` ignores reduced-motion — FIXED
- **Severity:** minor · **WCAG:** 2.3.3 Animation from Interactions (AAA);
  library convention treats it as required (30 components already comply).
- **File:** `src/components/Paper/Paper.module.css:34` — `.root` declares
  `transition: all 0.3s ease`, so every theme switch, elevation change, and
  caller-driven scalar override (width / padding / margin / opacity / border …)
  animates, with **no** `@media (prefers-reduced-motion: reduce)` block. The
  direct analogue `Card.module.css:169-173` and `Accordion.module.css:221-226`
  both disable their root transition under reduced-motion; Paper was the outlier.
- **Pattern:** `missing-reduced-motion`
- **Fix:** added a `@media (prefers-reduced-motion: reduce) { .root { transition:
  none } }` block at the end of `Paper.module.css`, matching the Card/Accordion
  convention. The surface now settles to its end state instantly for users who
  request reduced motion.

### 2. Surface locked to a non-semantic `<div>` (no sectioning/landmark escape hatch) — FIXED
- **Severity:** moderate · **WCAG:** 1.3.1 Info and Relationships (A); also SEO
  document-outline semantics (goobs SSRs inside Next.js, so this markup is the
  crawled HTML).
- **File:** `src/components/Paper/index.tsx:175` (pre-fix) — the surface always
  rendered a hardcoded `<div>`. Paper's own docs/stories describe it as "used to
  group related content", which is exactly what sectioning/landmark elements
  (`<section>`/`<article>`/`<aside>`/`<header>`/`<footer>`/`<main>`) express — yet
  a consumer that IS a document region had no way to emit the correct element.
  The result is invisible to landmark navigation and flattens the SSR'd document
  outline. The library already ships this escape hatch on `FieldGrid`
  (`src/components/FieldGrid/index.tsx:29` — `as?: ElementType`).
- **Pattern:** `nonsemantic-container-element`
- **Fix:** added an **additive** `as?: ElementType` prop (default `'div'`),
  matching the FieldGrid convention exactly (`const Element = (as ?? 'div') as
  ElementType`; `<Element ref={ref} …>`). Unlike FieldGrid, Paper adds **no**
  implicit role — the chosen element keeps its own native role (a generic surface
  is not a `group`); consumers name a landmark via `aria-label`/`aria-labelledby`
  forwarded through rest props. Backward compatible: the default `<div>` path and
  every `data-*`/`data-component="Paper"`/`data-theme` attribute + all rest props
  are emitted regardless of the element, so the Playwright selector contract is
  unchanged.

## Hearing
No audio, `AudioContext`, `<audio>`/`<video>`, or `navigator.vibrate` usage
exists in the component (grep-confirmed). Paper conveys no information by sound.
Nothing to fix (WCAG 1.2.x / 1.4.2 — N/A).

## Reading & screen reader
- Paper has no interactive elements of its own, so there is no accessible-name,
  keyboard-interaction, or focus-management obligation on the surface itself
  (it is not focusable by default — no `tabIndex`). `:focus-visible` was
  considered and deliberately **not** added to `.root`: matching the Card
  convention (which styles `:focus-visible` only on genuinely interactive
  children — anchors/buttons/drag-handle — never on its generic root), a focus
  ring on a normally-unfocusable surface would be convention-breaking. Consumers
  who make Paper interactive should use `Button`/`Card` or supply their own
  focus treatment.
- Theme variants (light/dark/sacred) are visual styling, **not** state — no
  color-alone (1.4.1) concern. Contrast is carried by `--goobs-*` tokens in
  `src/styles/global.css` (dark text `#e2e8f0` is documented 11.87:1 on the dark
  surface) which are outside this component's ownership.
- No dynamic content changes inside Paper that would require `role="status"`/
  `aria-live` (it is a static container; any live regions are the children's
  responsibility).

## SEO semantics
- Addressed by Fix #2 — consumers can now render the correct sectioning/landmark
  element via `as`, so the surface participates in the SSR'd document outline and
  landmark navigation instead of being a flat `<div>`.
- Paper is not a heading and carries no link/list/table content of its own, so
  the heading-level / real-`<a>` / list / `<table>` checks are N/A for the
  primitive itself. All content is server-rendered children — no client-only
  injection of primary content.

## Fixes applied
1. `Paper.module.css` — added `@media (prefers-reduced-motion: reduce)` block
   disabling the `.root` transition (WCAG 2.3.3).
2. `index.tsx` — added additive `as?: ElementType` prop (default `'div'`) with
   JSDoc, imported `ElementType`, resolved `const Element = (as ?? 'div')` and
   rendered `<Element>` in place of the hardcoded `<div>` (WCAG 1.3.1 / SEO).
   Machine-test selector contract preserved (all `data-*`/`role`/`aria`/rest
   props still emitted).

## Stories updated
`Paper.stories.tsx` — added:
- `Semantics/As Section (landmark)` — `as="section"` + `aria-label`.
- `Semantics/As Article` — `as="article"`.
- `Semantics/As Aside (complementary)` — `as="aside"` + `aria-label`.
- `Motion/Reduced Motion` — elevated surface whose `transition` is the target of
  the new reduced-motion rule (toggle OS "reduce motion" to verify the instant
  end state; Chromatic captures it).

These exercise the new rendered-DOM (`as`) path and the reduced-motion target.
Per-file lint gate (`bun lint:file`) passes on `index.tsx` and
`Paper.stories.tsx`. The polymorphic `as` typing mirrors the shipped FieldGrid
pattern verbatim.

## Deferred
None. Every finding was fixable inside the Paper directory. No shared-file
(`global.css`, barrel, Field/Shell, `src/index.ts`) change was required — the two
fixes live entirely in `Paper.module.css` and `Paper/index.tsx`.
