# Typography — a11y audit (2026-07-11)

**Status:** FIXED

**Component:** `src/components/Typography/index.tsx` — a themeable text primitive
that renders text at heading / body / sacred-Cinzel / Merriweather variant sizes.

## APG pattern

**None (content primitive, not a widget).** Typography is a non-interactive text
element — no ARIA design pattern applies (it is not a dialog, menu, combobox,
etc.). Its accessibility obligations are therefore purely **semantic-markup / SEO**
(WCAG 1.3.1, 2.4.6, 2.4.10) rather than roles/keyboard-interaction. The relevant
question for a text primitive is: *does styled heading text become a real heading in
the accessibility tree and the crawled document outline?*

## Issues found

### 1. Heading variants render as non-semantic `<span>` — SERIOUS

- **WCAG:** 1.3.1 Info and Relationships (A), 2.4.6 Headings and Labels (AA),
  2.4.10 Section Headings (AAA).
- **Pattern class:** `nonsemantic-heading`
- **Location:** `src/components/Typography/index.tsx:508` (the `<span>` return) and
  the heading-variant resolution in `resolveVariant` (`index.tsx:153`–`314`,
  e.g. the `h1`–`h6` / `cinzelH1`–`cinzelH6` / `merri` heading branches).
- **Status:** FIXED.
- **Detail:** The component accepts heading `variant`s (`'h1'`–`'h6'`,
  `'cinzelh1'`…, `'merrih2'`…) and applies heading-scale font sizes/weights, but it
  ALWAYS emitted a `<span>` (the deliberate hydration/phrasing-content fix,
  documented at `index.tsx:483`). Consequently a caller using Typography as a
  section heading produced **no `<h1>`–`<h6>` in the SSR'd HTML**: screen-reader
  heading navigation (rotor / "next heading") found nothing, and search crawlers saw
  a flat outline. There was **no consumer-controllable way** to emit the correct
  semantic element — the checklist's core requirement ("headings render as REAL
  `<h1>`–`<h6>` with the level controllable by the consumer via an additive
  `component`/`headingLevel` prop").
- **Fix (additive, backward-compatible):** added a polymorphic
  `component?: React.ElementType` prop (`index.tsx`, MUI-Typography convention and
  the checklist's first-named option). The rendered element is now
  `const Element = component ?? 'span'` (`index.tsx:518`). A caller passes
  `component="h2"` for a real heading, `component="p"` for a paragraph,
  `component="label"` for a form label, etc. The **default stays `'span'`**, so the
  phrasing-content/hydration contract and every existing caller's markup are
  unchanged, and no widget auto-promotes its element (which would reintroduce the
  invalid-nesting hydration bug fixed in CF-185). All test-selector attributes
  (`data-component`, `data-theme`), `className`, and `style` ride the resolved
  element verbatim.

## Hearing (WCAG 1.2.x, 1.4.2)

**Clean — N/A.** Grepped the component for `new Audio` / `AudioContext` /
`navigator.vibrate` / `<audio>` / `<video>`: no matches. Typography conveys no
information by sound and plays no media, so there is nothing to caption/transcript
and no audio-only status.

## Reading & screen reader (1.1.1, 1.3.1, 1.4.1, 2.1.x, 2.4.x, 3.2.x, 3.3.x, 4.1.2)

- **Semantic markup:** the one real defect (heading variants → `<span>`) is fixed by
  the polymorphic `component` prop above (WCAG 1.3.1 / 2.4.6).
- **Accessible name:** N/A — Typography renders caller-supplied `text`/`children`;
  it is not an interactive control and has no icon-only affordance needing an
  `aria-label`.
- **Color-alone state (1.4.1):** none — Typography exposes no interactive
  selected/error/disabled state conveyed by color. The prior Merriweather
  helper/footer light-theme contrast bug is already fixed (light theme pins
  `--goobs-light-text-muted` #4b5563 = 7.56:1 on #ffffff; `index.tsx:218`,
  regression story `LightHelperText`).
- **Focus (`:focus-visible`):** N/A — the rendered element is a non-interactive
  `<span>` with no `tabindex`/`onClick`, so it is not in the tab order and needs no
  focus indicator. The `outline: true` opt-in (`.outlined`, `Typography.module.css:96`)
  is a *decorative* text outline keyed to `currentColor`, not a focus treatment, and
  is unaffected.
- **Dynamic updates / live regions:** N/A — Typography renders static content; it
  performs no async loading, validation, or content swapping that would need
  `role="status"`/`aria-live`. (A consumer that puts changing text inside Typography
  owns the live-region wrapper.)
- **Truncation (considered, not a defect):** `styles.overflow: 'hidden'` +
  `textOverflow: 'ellipsis'` clips text VISUALLY only — the full string remains in
  the DOM/accessibility tree, so screen readers still read the complete content. No
  fix required.

## SEO semantics

- **Headings:** fixed — real `<h1>`–`<h6>` are now emittable via `component`
  (see Issue 1); the SSR'd HTML gains a crawlable outline when consumers upgrade
  standalone heading text.
- **Landmarks / lists / tables / links:** N/A — Typography is a leaf text primitive,
  not a landmark, list, table, or link container. It has no `linkComponent`/`href`
  surface of its own (links are other components' concern).
- **SSR content:** all meaningful content is the caller-supplied `text`/`children`,
  present in the server-rendered HTML — no client-only injection of primary content,
  no canvas/QR text-alternative concern.

## Fixes applied

- Added `component?: React.ElementType` prop (default `'span'`), fully JSDoc'd with
  the a11y/SEO rationale — `src/components/Typography/index.tsx`.
- Render now uses the polymorphic `const Element = component ?? 'span'`, preserving
  `data-component`/`data-theme`/`className`/`style` on the resolved element —
  `src/components/Typography/index.tsx:518`.
- Updated the component-level and prop-level JSDoc to document the semantic-element
  polymorphism.
- Verified: `bun lint:file` clean on both edited files. Polymorphic-`ElementType`
  render pattern matches established, building code in `FieldGrid/index.tsx:65`.

## Stories updated

Three new stories in `src/components/Typography/Typography.stories.tsx` (the repo's
only regression tests), each with a `play` assertion:

- **`Semantics/Real Heading Element`** (`SemanticHeadingElement`) — `component="h2"`
  asserts `getByRole('heading', { level: 2 })`, `tagName === 'H2'`, and that the
  `data-component`/`data-theme` selector contract rides the polymorphic element.
- **`Semantics/Real Paragraph Element`** (`SemanticParagraphElement`) —
  `component="p"` asserts `tagName === 'P'` + `data-component` preserved.
- **`Semantics/Default Span (phrasing content)`** (`DefaultSpanElement`) — contract
  lock: with NO `component`, a `merrih1` heading variant still renders `<span>` and
  exposes NO heading role (`queryByRole('heading')` is null), guarding against a
  regression that would auto-promote the element and reintroduce the invalid-nesting
  hydration bug.

## Deferred

None. The one defect was fixable in-directory (additive prop). No shared-file or
peer-owned change was required.
