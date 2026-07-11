# PricingTable — a11y audit (2026-07-11)

**Status:** FIXED (all in-directory issues fixed; one keyboard gap DEFERRED to the shared `Tooltip` component)

**APG pattern:** This is not an interactive widget — it is a **data table** (a plan/feature
comparison). The governing spec is the native HTML table model plus WCAG 1.3.1 Info &
Relationships (columns/rows programmatically associated via `<th scope>`), not an ARIA composite
widget. The only interactive controls are the per-column CTA `<button>`s (delegated to the
accessible `Button` component) and hover info tooltips. There is no arrow-key/roving-tabindex
interaction to implement — Tab moves through the CTA buttons in DOM order, which is correct.

Files:
- `src/components/PricingTable/index.tsx`
- `src/components/PricingTable/PricingTable.module.css` (new — a11y-only CSS: visually-hidden
  utility + reduced-motion-guarded decorative animations)
- `src/components/PricingTable/PricingTable.stories.tsx` (stories = the repo's regression tests)

---

## Issues found

| # | Severity | WCAG 2.2 | Location | Issue | Status |
|---|----------|----------|----------|-------|--------|
| 1 | Critical | 1.3.1, 4.1.2 | index.tsx:372-542 (pre-fix) | Entire comparison built from a flat `display:grid` of `<div>`s — no `<table>`/`<th>`/`<td>`, so no programmatic row/column association. A screen-reader user hears an undifferentiated stream of text with no way to know which package a cell belongs to; crawlers see no table. | FIXED |
| 2 | Critical | 1.1.1, 1.4.1, 4.1.2 | index.tsx:472-485, 516-529 (pre-fix) | Feature inclusion conveyed **by check-icon presence alone** — an included cell renders a `CheckCircleIcon`, an excluded cell is an empty `<div>`. No text alternative; the icon carries no accessible name. SR users learn nothing about which plan includes which feature. | FIXED |
| 3 | Serious | 1.3.1, 2.4.6 | index.tsx:369 (pre-fix) | Table title hardcoded to `<h5>` — not consumer-controllable and skips h1–h4, corrupting the page heading outline. Table also had **no programmatic accessible name**. | FIXED |
| 4 | Serious | 2.3.3, 1.1.1 | index.tsx:158, 202, 346, 526 (pre-fix) | Sacred-theme decorative glyphs animate (`spin`/`float`) with **no `prefers-reduced-motion` guard** and are **not `aria-hidden`**, so a screen reader announces bare `✦`/`◆` ornament. (The referenced `spin`/`float` keyframes were also lost in the CSS-modules migration, so the animation was silently dead.) | FIXED |
| 5 | Moderate | 1.1.1, 3.3.2 | index.tsx:452-458, 487-502 (pre-fix) | A feature's `infopopuptext` is reachable **only** through the hover tooltip. The `StyledTooltip` trigger is a mouse-only `<div>` (`onMouseEnter`/`onMouseLeave`, not focusable, no ARIA), so keyboard and SR users cannot reach the info at all. | FIXED in-scope (text now exposed inline to AT); the tooltip's own keyboard support is DEFERRED (not my component). |
| 6 | Minor | 1.4.1 | index.tsx:391-393 | Highlighted ("Popular") column emphasised with a gold background. Verified NOT color-alone — the visible "Popular" text badge sits in that column's header and is read by AT. No change needed. | OK (verified) |

---

## Hearing (WCAG 1.2.x, 1.4.2)

No audio, video, `Audio`/`AudioContext`, `navigator.vibrate`, or any sound/media API anywhere in
the component or its subcomponents. Nothing conveyed by sound. **No hearing-related issues.**

## Reading & screen reader (1.1.1, 1.3.1, 1.4.1, 2.1.x, 2.4.x, 3.3.x, 4.1.2)

- **Semantic table (issue 1).** The grid-of-divs is now a real `<table>` with `<colgroup>`,
  `<thead>` (package names as `<th scope="col">`), `<tbody>` (price + feature rows, each row
  labelled by a `<th scope="row">`, values in `<td>`), and `<tfoot>` (CTA buttons). A screen
  reader now announces, e.g., "Pro, Advanced analytics, Included."
- **Cell text alternatives (issue 2).** Each included cell renders the (now `aria-hidden`) check
  icon plus a visually-hidden `Included`; each excluded cell renders a visually-hidden
  `Not included` instead of an ambiguous blank. Inclusion is conveyed programmatically, not by
  icon presence or colour.
- **Accessible name (issue 3).** The title is a consumer-controlled heading
  (`headingLevel`, default `2`, via `React.createElement` matching `Accordion`) with a stable
  `useId()` id, and the `<table>` is named by it via `aria-labelledby` (falling back to
  `aria-label="Pricing plans"` when there is no title).
- **Info text (issue 5).** Each `infopopuptext` is now also rendered as visually-hidden text
  inside the feature's `<th>`, so AT reads it even though the visual tooltip is mouse-only. The
  `InfoIcon` inside the tooltip is marked `aria-hidden` (the srOnly text carries the meaning).
- **Focus.** The only focusable elements are the CTA `<button>`s, supplied by the `Button`
  component, which already carries a `:focus-visible` treatment in `Button.module.css`. No
  custom focusable elements were added, so no new focus styling is required. No overlay/dialog
  is owned here (nothing to focus-trap/Escape/restore).
- **Not color-alone (issue 6).** Featured column = gold highlight **and** a "Popular" text badge
  in the header; disabled state = reduced opacity **and** `data-state="disabled"` **and** the
  native `disabled` attribute on every CTA button. Verified.
- **Motion (issue 4).** The decorative glyph animations moved out of inline styles into
  `PricingTable.module.css` (`.sacredGlyph` / `.sacredFooterGlyph`, with module-scoped
  `@keyframes` restoring the lost motion), gated by `@media (prefers-reduced-motion: reduce)`.
  The glyph containers are `aria-hidden`.

## SEO semantics (SSR-crawled markup)

- Real `<table>`/`<thead>`/`<tbody>`/`<tfoot>`/`<th scope>`/`<td>` — the crawled HTML now
  expresses the pricing comparison as a genuine data table.
- The title is a real, level-controllable `<h{n}>` heading (was a fixed `<h5>`), so it
  contributes correctly to the document outline.
- CTA buttons remain real `<button>`s. Navigation is via the existing `router.push` +
  `emitDiag('nav.change')` path (unchanged). Note: these CTAs are JS-navigation buttons, not
  crawlable `<a href>` links — see Deferred, as the public `PricingProps` API models targets as
  `buttonlinks: string[]` + a `router`, and adding link semantics would require an additive
  API/markup change beyond this audit's non-breaking scope.
- All primary content (names, prices, feature titles, inclusion state) is present in SSR output;
  no client-only injection of primary content.

---

## Fixes applied

1. **Semantic table restructure** — `<div style={{display:grid}}>` → `<table>` with
   `<colgroup>`, `<thead>`/`<tbody>`/`<tfoot>`, `<th scope="col">` (packages),
   `<th scope="row">` (price/feature/subfeature labels), `<td>` (values/CTAs). All theme inline
   styles preserved on the corresponding table elements (consistent with this file's existing
   inline-style pattern); `borderCollapse:'collapse'` + `<col minWidth>` preserve the responsive
   column layout inside the existing `overflow-x:auto` wrapper. **Markup change** — noted here.
2. **Cell text alternatives** — `renderPackageCells` helper: `aria-hidden` check icon +
   visually-hidden `Included`, or visually-hidden `Not included` for excluded cells.
3. **Additive `headingLevel?: 1|2|3|4|5|6` prop** (default `2`) — title rendered via
   `React.createElement(\`h${headingLevel}\`, …)` with a `useId()` id; `<table aria-labelledby>`
   points at it (or `aria-label="Pricing plans"` fallback). **Markup change** — the default
   heading tag changed `<h5>` → `<h2>`; visual size is unchanged (driven by the theme header
   style, not the tag).
4. **Decorative-glyph handling** — corner glyph + footer glyphs marked `aria-hidden="true"`;
   their animation moved to `PricingTable.module.css` behind
   `@media (prefers-reduced-motion: reduce)`; the dead inline `spin`/`float` references removed;
   per-glyph stagger passed as `--pt-float-duration`.
5. **Info text exposed to AT** — `renderInfoAffordance` helper keeps the hover tooltip for
   sighted users and adds a visually-hidden copy of `infopopuptext`; `InfoIcon` set `aria-hidden`.
6. **New `PricingTable.module.css`** — a11y-only: `.srOnly` visually-hidden utility (mirrors
   `Alert.module.css` `.severityLabel`) + the reduced-motion-guarded glyph animations.

**Preserved contract (unchanged):** `data-component="PricingTable"`, `data-subject`,
`data-state` on the root; the `Button` `data-action`/`data-subject` selectors; the `emitDiag`
`nav.change` beacon; all existing `PricingProps` (only additive `headingLevel` added — no rename,
retype, or removal).

**Gates:** `bun lint:file` clean on `index.tsx` and `PricingTable.stories.tsx`; scoped `tsc`
(project config, whole-src) reports **zero errors in `src/components/PricingTable/**`**.

## Stories updated

- `AccessibleComparison` ("Accessible Comparison (mixed inclusion)") — mixes included/excluded
  packages so both the `Included` and `Not included` cell states render; `headingLevel={2}`;
  exercises the semantic table + accessible name + inline info text.
- `CustomHeadingLevel` ("Configurable Heading Level (h3)") — exercises the additive
  `headingLevel` prop (`<h3>`).
- Existing stories (`PremiumTheme`, `SacredTheme`, `DarkTheme`, `InteractiveDemo`, `BothPrices`)
  retained; all now render the semantic-table markup.

## Deferred (outside my directory — do NOT edit here)

1. **`StyledTooltip` trigger is keyboard/AT-inaccessible.**
   `src/components/Tooltip/index.tsx:308-315` — the trigger is a `<div>` with only
   `onMouseEnter`/`onMouseLeave`; it is not focusable and exposes no ARIA, so the tooltip content
   is unreachable by keyboard or screen reader (WCAG 2.1.1, 1.4.13, 4.1.2). *Suggested change:*
   make the trigger a `<button type="button">` (or add `tabIndex={0}` + `role="button"`), wire
   `onFocus`/`onBlur` alongside the hover handlers and Escape-to-dismiss, give the bubble an `id`
   and set `aria-describedby` on the trigger. PricingTable already mitigates the *information
   loss* in-scope by rendering `infopopuptext` as visually-hidden text, but the tooltip itself
   remains mouse-only until fixed at the source.

2. **CTA columns are JS-navigation buttons, not crawlable links.**
   `src/components/PricingTable/index.tsx` CTA cells use `Button` + `router.push(buttonlinks[i])`.
   For SEO/crawlability the destinations would ideally be real `<a href>`. This is a public-API
   shape decision: `PricingProps` models targets as `buttonlinks: string[]` + a `router`.
   *Suggested change (additive, future):* accept an optional `linkComponent`/`as="a"` render path
   (mirroring the library's existing `linkComponent` pattern in Accordion/Breadcrumb) so consumers
   can render crawlable anchors while keeping the current button+router behaviour as default.
   Left as a deferred API proposal rather than a silent behavioural change.

## Note (not actionable by me)

A concurrent peer edit to `src/components/QRCode/index.tsx:441` references `cssStyles.srOnly`
without a matching class in `QRCode.module.css` (surfaced by my scoped typecheck). Outside my
ownership — flagged only so it is not mistaken for a regression from this audit.
