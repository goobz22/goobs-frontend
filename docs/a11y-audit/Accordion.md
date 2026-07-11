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
| 8 | Moderate (SEO) | 1.3.1 | `index.tsx` (absent) | An accordion header is semantically a **heading**, but the component offered no way to render a real `<h1>`–`<h6>` — so SSR'd/crawled markup and SR heading-navigation saw no heading for each section. | FIXED (additive `headingLevel` prop) |

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
- All summary/details content remains in the SSR'd markup (no client-only injection).

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

Existing `InteractionTest` (click to expand/collapse) continues to pass against the native button.

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
