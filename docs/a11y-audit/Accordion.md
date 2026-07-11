# Accordion — a11y audit (2026-07-11)

**Status: FIXED**

## APG pattern

Two patterns in one component (switched on `type`):

- **`type="accordion"` (default)** → WAI-ARIA **Accordion / Disclosure**. A header button
  toggles an adjacent content region; state exposed via `aria-expanded`, the region wired
  via `aria-controls` ⇄ `id` (+ `role="region"` / `aria-labelledby`). Keyboard: Tab to the
  header, Enter/Space toggles.
- **`type="menu"`** → a **navigation item** (a real link when `href` is given, otherwise an
  action button). Active item is the current page (`aria-current="page"`). Keyboard: Tab,
  Enter activates.

The library's own `MetricsAccordion` (`src/components/Metric/Accordion/index.tsx`) already
implements this pattern correctly (native `<button aria-expanded aria-controls>`, `aria-hidden`
chevron, `role="region"` panel, `useId`); this component was the outdated `<div role="button">`
version and has been brought up to that same standard.

## Issues found

| # | Severity | WCAG | Location (pre-fix) | Issue | Status |
|---|----------|------|--------------------|-------|--------|
| 1 | **Critical** | 2.1.1 Keyboard; 4.1.2 | `index.tsx:220-235` | Header row was a `<div role="button" tabIndex=0 onClick>` with **no `onKeyDown`** — focusable but **could not be activated by keyboard** (a div does not synthesise click on Enter/Space). Keyboard/AT users could not open or close an accordion. | FIXED |
| 2 | Serious | 4.1.2; 1.3.1 | `index.tsx:229, 263-265` | Disclosure was under-wired: `aria-expanded` on the div but **no `aria-controls`**, and the details panel had **no `id`/`role`/label** — nothing programmatically tied the trigger to the region it controlled. | FIXED |
| 3 | Serious | 1.1.1 | `index.tsx:208-218` | Decorative chevron `<svg>` had **no `aria-hidden`** (and was focusable in IE/edge cases) — announced as an unlabelled graphic that merely duplicates `aria-expanded`. | FIXED |
| 4 | Serious | 2.4.7 Focus Visible | `Accordion.module.css` (absent) | **No `:focus-visible` treatment.** The interactive row had no explicit keyboard-focus indicator (and the `styles.outline` escape hatch could remove the UA ring). Every other interactive goobs component (Button, Chip, Checkbox, …) defines one. | FIXED |
| 5 | Serious | 4.1.2; 2.1.1 | `index.tsx:253-261` | **Interactive-in-interactive** for `type="menu"` + `href`: an `<a href>` wrapped a nested `<div role="button" tabIndex=0>` → invalid nesting, **two tab stops for one item**, conflicting roles. | FIXED |
| 6 | Moderate | 1.4.1; 4.1.2 | `index.tsx:224` (`data-active`) | Active menu item was conveyed by **colour + font-weight only** — no programmatic "current" state, so AT users got no signal for the current page. | FIXED |
| 7 | Moderate | 2.3.3 Animation from Interactions | `Accordion.module.css:159` (icon) + `:56` (container) | The 0.3s chevron rotation and container/summary transitions had **no `prefers-reduced-motion` guard**. | FIXED |
| 8 | Moderate (SEO) | 1.3.1 | `index.tsx` (absent) | An accordion header is semantically a **heading**, but the component offered no way to render a real `<h1>`–`<h6>` — so SSR'd/crawled markup and SR heading-navigation saw no heading for each section. | FIXED for the Disclosure default via additive `headingLevel`; see review follow-up R3 for the honest scope |

## Hearing (WCAG 1.2.x, 1.4.2)

No audio, `AudioContext`, `<audio>`/`<video>`, or `navigator.vibrate` usage anywhere in the
component (verified by grep). State/feedback is entirely visual + programmatic (`aria-expanded`,
`aria-current`, `data-state`, plus the `emitDiag('component.state')` bus). **Nothing is
conveyed by sound — clean.**

## Reading & screen reader (1.1.1, 1.3.1, 1.4.1, 2.1.x, 2.4.x, 4.1.2)

- **Keyboard operability restored (issue 1):** the header row now renders as the semantically
  correct native element per mode — `<button>` for accordion + menu-without-href, `<a href>`
  for menu-with-href — so Enter/Space (button) and Enter (link) activation, tab order, and
  disabled semantics come from the platform. The old `<div role="button">` with an onClick and
  no key handler is gone.
- **Disclosure ARIA (issue 2):** the trigger carries `aria-expanded` (accordion only) and, while
  open, `aria-controls={panelId}`; the panel is `id={panelId} role="region" aria-labelledby={triggerId}`.
  `useId()` generates the stable id pair. `aria-controls` is emitted **only when the panel is in
  the DOM** to avoid a dangling IDREF.
- **Decorative icon hidden (issue 3):** `aria-hidden="true" focusable="false"` on the chevron.
- **Focus indicator (issue 4):** `.summary:focus-visible` draws a 2px per-theme outline
  (sacred/light/dark focus-ring tokens). It is **inset** (`outline-offset: -2px`) because the
  container clips with `overflow: hidden`, which would crop an outset ring.
- **Menu semantics (issue 5):** the link/button is now the single interactive element (one tab
  stop, one role). A disabled menu item drops its `href` and gains `aria-disabled="true"`.
- **Current page (issue 6):** `aria-current="page"` is set on the active menu item (and never
  emitted as `"false"` on inactive items — attribute is simply absent, consistent with the
  library's "never emit aria-*='false'" contract).
- **Disabled state (accordion):** now uses the native `disabled` attribute on the `<button>`
  (removed from tab order + not clickable + announced), while `data-disabled` still drives the
  `not-allowed` cursor styling.

## SEO semantics

- **Real heading (issue 8):** the new optional `headingLevel?: 1|2|3|4|5|6` prop wraps the
  accordion trigger in a real `<h1>`–`<h6>` (opt-in, so existing consumers' DOM is unchanged;
  ignored for `type="menu"`). This puts a crawlable, SR-navigable heading in the SSR'd HTML for
  each collapsible section.
- **Real links:** `type="menu"` + `href` renders a genuine `<a href>` (crawlable), preserving
  the `linkComponent` override for Next.js consumers. Previously the `<a>` wrapped a `role=button`
  div; the anchor is now the crawlable, correctly-roled element itself.
- **Collapsed panels stay in the SSR'd markup (review follow-up R1):** an accordion-type section
  with `details` renders its panel **even while collapsed**, hidden from AT + layout via the native
  `hidden` attribute rather than being conditionally omitted. So all summary AND details content is
  in the server-rendered HTML and crawlable for every section — no client-only injection, and no
  collapsed-section content missing from the SSR'd output. (Earlier this section overclaimed: a
  collapsed default section omitted its panel entirely; that gap is now closed.)

## Fixes applied

**`src/components/Accordion/index.tsx`**
- Import `useId`; generate `panelId` / `triggerId`.
- Header row rendered as native `<button>` (accordion + menu/onClick) or `<a href>` (menu/href)
  instead of `<div role="button">` — the root-cause keyboard fix.
- Accordion button: `aria-expanded`, `aria-controls` (when open), native `disabled`, `id`.
- Panel: `id`, `role="region"`, `aria-labelledby`.
- Chevron `<svg>`: `aria-hidden="true"`, `focusable="false"`.
- Menu item: `aria-current="page"` when active; `aria-disabled` + dropped `href` when disabled.
- New additive `headingLevel` prop wrapping the accordion trigger in a real heading.
- Preserved every existing `data-*` selector (`data-component`, `data-state`, `data-menu`,
  `data-active`, `data-disabled`, icon `data-expanded`) and the `emitDiag` bus.

**`src/components/Accordion/Accordion.module.css`**
- `.summary`: native-element reset (`appearance:none; border:0; margin:0; width:100%;
  box-sizing:border-box; text-align:left`) so button/link/menu render identically to the old div.
- `.summary:focus-visible` + per-theme `outline-color` overrides (WCAG 2.4.7).
- `.heading` structural reset for the new heading wrapper.
- `@media (prefers-reduced-motion: reduce)` disabling container/summary/icon transitions (2.3.3).

### Markup changes (noted per contract)
- Root interactive element changed from `<div role="button">` to a native `<button>`/`<a>`.
  The explicit `role="button"` *attribute string* is gone, but the **button role is preserved
  implicitly** (`getByRole('button')` still matches) and the element is now genuinely
  keyboard-operable. `aria-expanded` and all `data-*` selectors are retained.
- `type="menu"` + `href` collapsed from `<a><div role=button></div></a>` to a single `<a>`
  that carries both `.link` and `.summary` classes (one focus stop instead of two).
- Component-controlled a11y attributes (`id`, `aria-expanded`, `aria-controls`, `aria-current`,
  `disabled`) are now applied **after** any spread `{...rest}` so a consumer cannot accidentally
  clobber the disclosure wiring (previously `{...rest}` won). No story/consumer passes these.

## Stories updated

All exercise new behaviour with `play` assertions (the repo's only regression tests):

- **`A11y/Keyboard Toggle`** — focuses the trigger, toggles with Enter then Space, and asserts
  `aria-expanded` flips + the panel is wired via `aria-controls`⇄`id` + `role="region"` +
  `aria-labelledby`. Fails against the old keyboard-inoperable `<div>`.
- **`A11y/Menu Link Semantics`** — asserts menu items are real `<a href>` links and the active
  one has `aria-current="page"` while the inactive one does not.
- **`A11y/Heading Level`** — asserts `headingLevel={3}` renders a real `<h3>` containing the
  toggle button, which still toggles.
- **`A11y/Collapsed Panel In DOM (SEO)`** (review R1) — asserts a COLLAPSED accordion still has its
  panel in the DOM with the details text present + `role="region"` + `aria-labelledby` + `hidden`,
  and that expanding removes `hidden` and reveals it. Pins the SSR/SEO fix.
- **`A11y/Disabled Menu Link`** (review R2) — asserts a disabled `type="menu"` + `href` item drops
  its `href`, gains `aria-disabled="true"`, and is no longer exposed as a link role, while an
  enabled sibling stays a real `<a href>` with no `aria-disabled`.
- **`A11y/Default (No Heading Wrapper)`** (review R3) — asserts the default (no `headingLevel`)
  renders an operable disclosure button and NO `heading` role, pinning the deliberate no-default-
  heading behaviour.

Existing `InteractionTest` (click to expand/collapse) still passes; its collapsed assertions were
updated from "content absent from DOM" to "content present but not visible" to match the R1 fix
(the panel is now disclosed, not removed).

## Review follow-ups (adversarial re-review of the a11y pass — all fixed)

- **R1 — SSR/SEO overclaim + real gap (minor, 1.3.1).** The SEO section claimed all details content
  was in the SSR'd markup, but `hasPanel` gated the panel on `expanded`, so a default-collapsed
  section rendered NO panel — its content was absent from the SSR'd HTML and invisible to crawlers.
  **Root-cause fix:** `hasPanel = !isMenuType && Boolean(details)` (no longer gated on `expanded`);
  the panel renders whenever the section has content and toggles visibility with the native `hidden`
  attribute (`hidden={!expanded}`). Collapsed = in the DOM (crawlable) but out of the a11y tree and
  layout; expanded = visible. `aria-controls` is now emitted whenever the panel exists (present when
  collapsed too — never a dangling IDREF, since the panel is always in the DOM for a content-bearing
  section). Pinned by `A11y/Collapsed Panel In DOM (SEO)`; `InteractionTest` + `A11y/Keyboard Toggle`
  updated accordingly. NOTE (markup change per contract): the collapsed accordion panel now ships in
  the DOM with `hidden` instead of being omitted; no `data-*`/`role`/`aria` attribute was removed
  (`aria-controls` went from open-only to always-present-when-content-exists — an additive change).
- **R2 — story-coverage gap for the disabled menu-link state (minor).** The disabled `type="menu"` +
  `href` behaviour (drop `href` + `aria-disabled="true"`) had no story with assertions, so it was
  unpinned. **Fix:** added `A11y/Disabled Menu Link` with `play` assertions on both the disabled and
  enabled cases. No component change (the behaviour was already correct); this closes the regression-
  test gap.
- **R3 — APG accordion-heading default (minor, 1.3.1).** The default renders a bare disclosure
  `<button>` with no heading wrapper unless the consumer opts into `headingLevel`. **Resolution:** the
  opt-in is the correct design, not a gap to "fix" by forcing a default — a single `<Accordion>` is a
  valid WAI-ARIA **Disclosure** (which requires no heading), and a context-agnostic primitive cannot
  choose a correct heading LEVEL; hardcoding one (e.g. always `<h2>`) would corrupt the document
  outline (its own WCAG 1.3.1 defect) AND silently change every existing consumer's DOM, violating
  the additive-only public-API contract. The full multi-section Accordion heading pattern remains
  available and is now explicitly RECOMMENDED for accordion GROUPS via the strengthened `headingLevel`
  JSDoc, which tells consumers to pass the outline-appropriate level per section. Both modes are now
  pinned: `A11y/Heading Level` (with heading) and `A11y/Default (No Heading Wrapper)` (without). Issue
  #8 in the table above is amended to reflect this honest scope: closed for the Disclosure default,
  consumer-driven for the full Accordion pattern.

## Deferred

Same-class gaps in sibling components **outside this component's ownership** — not edited:

- `missing-focus-visible-style` + `missing-reduced-motion` — **`src/components/Metric/Accordion/Accordion.module.css`**
  (`.toggle` button, defined ~line 64): the `MetricsAccordion` toggle has correct ARIA but **no
  `:focus-visible` outline and no `prefers-reduced-motion` guard**. Suggested: add a
  `.toggle:focus-visible { outline: 2px solid var(--…-focus-ring); }` block + a reduced-motion
  media query mirroring the Accordion fix.
- `missing-focus-visible-style` + `missing-reduced-motion` — **`src/components/Filter/Section/index.tsx:553`**
  (collapsible `<button>`) and its module CSS: same missing `:focus-visible` / reduced-motion
  treatment as `MetricsAccordion` (it explicitly mirrors that component). Same suggested fix.
