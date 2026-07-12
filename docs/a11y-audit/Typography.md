# Typography — a11y audit (2026-07-11)

**Status:** FIXED

**Component:** `src/components/Typography/index.tsx` — a themeable text primitive
that renders text at heading / body / sacred-Cinzel / Merriweather variant sizes.

## APG pattern

**None (content primitive, not a widget).** Typography is a text element with no ARIA
widget pattern (it is not a dialog, menu, combobox, etc.). Its obligations are mainly
**semantic-markup / SEO** (WCAG 1.3.1, 2.4.6, 2.4.10) — *does styled heading text become
a real heading in the accessibility tree and the crawled outline?* — PLUS, because it is
polymorphic via `component` and forwards `tabIndex`/`href`/handlers, a **focus-visibility**
obligation (WCAG 2.4.7 / 2.4.11 / 1.4.11) whenever a caller renders it as a focusable
interactive element.

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
  `const Element = component ?? 'span'`. A caller passes
  `component="h2"` for a real heading, `component="p"` for a paragraph,
  `component="label"` for a form label, etc. The **default stays `'span'`**, so the
  phrasing-content/hydration contract and every existing caller's markup are
  unchanged, and no widget auto-promotes its element (which would reintroduce the
  invalid-nesting hydration bug fixed in CF-185). All test-selector attributes
  (`data-component`, `data-theme`), `className`, and `style` ride the resolved
  element verbatim.

### 2. Polymorphic element dropped `id`/`htmlFor`/attribute pass-through — MODERATE

- **WCAG:** 1.3.1 Info and Relationships (A), 3.3.2 Labels or Instructions (A),
  4.1.2 Name, Role, Value (A).
- **Pattern class:** `polymorphic-no-attr-passthrough`
- **Location:** `src/components/Typography/index.tsx` — the render (previously only
  `className`/`data-component`/`data-theme`/`style` were forwarded to `<Element>`;
  no `...rest`).
- **Status:** FIXED (adversarial-review follow-up to Issue 1).
- **Detail:** Issue 1 delivered a real heading element for outline/rotor navigation,
  but the render forwarded ONLY a fixed set of attributes — there was no
  `...rest`/`id` pass-through. Two consequences the semantic fix left unusable:
  (1) `component="h2"` could not be given an `id`, so a Typography heading could NOT
  serve as an `aria-labelledby`/`aria-describedby` target — the standard pattern
  where a heading supplies the accessible NAME of a dialog/landmark/region;
  (2) the prop JSDoc advertised `component="label"`, but the resulting `<label>`
  could not be programmatically associated with a control (`htmlFor` was neither a
  typed prop nor forwarded), making that advertised affordance non-functional.
- **Fix (additive, backward-compatible):** `TypographyProps` now
  `extends React.HTMLAttributes<HTMLElement>` (standard `id`/`role`/`tabIndex`/
  `title`/`aria-*`/event-handler/`className`/`style` surface) plus an explicit
  `htmlFor?: string` (not part of `HTMLAttributes`, needed for the `component="label"`
  case → renders as the `for` attribute). The render destructures
  `className`/`style` and spreads the remaining `...rest` onto the element. Ordering
  is deliberate: `{...rest}` is spread FIRST, then `data-component`/`data-theme`/the
  resolved `className`/`style` are written AFTER, so pass-through props can NEVER
  clobber the machine-test selector contract. A caller `className` is MERGED into
  the resolved class list (via the existing `[…].filter(Boolean).join(' ')` helper);
  a caller `style` is merged UNDER the resolved `dynamicStyle` (resolved CSS-vars /
  margins keep precedence). Fully additive — no existing prop renamed/removed/retyped;
  existing callers (which passed none of these) are unaffected.
- **Markup change:** none to the rendered element choice — same `const Element =
  component ?? 'span'`. The only DOM difference is that consumer-supplied standard
  attributes (`id`, `htmlFor`→`for`, `aria-*`, `role`, `tabIndex`, event handlers,
  merged `class`/`style`) now appear on the element when passed; nothing is emitted
  when they are absent.

### 3. Interactive Typography has no keyboard focus indicator (UA ring suppressed) — SERIOUS

- **WCAG:** 2.4.7 Focus Visible (AA), 2.4.11 Focus Appearance (AA),
  1.4.11 Non-text Contrast (AA — the ring colour).
- **Pattern class:** `missing-focus-visible-style`
- **Location:** `src/components/Typography/Typography.module.css:81` (the
  `.root { outline: var(--typography-outline) }` declaration); no `:focus-visible`
  rule existed anywhere in the module.
- **Status:** FIXED (2026-07-11 audit pass).
- **Detail:** `.root` declares `outline: var(--typography-outline)`. With no caller
  outline the custom property is unset, so `var(--typography-outline)` (no fallback) is
  a *guaranteed-invalid value*; per the CSS Custom Properties spec the whole `outline`
  declaration is **invalid at computed-value time** and computes to `outline` = initial
  = `outline-style: none`. Two consequences: (a) there was no `:focus-visible` rule to
  draw a ring, and (b) because the author `.root` declaration is the cascade winner it
  **also suppressed the user-agent `:focus-visible { outline: auto }`** the browser
  would otherwise draw. Typography renders a non-focusable `<span>` by default, but it
  is polymorphic via `component` and spreads standard DOM attributes
  (`extends React.HTMLAttributes<HTMLElement>` + `{...rest}`, `index.tsx:568`), so
  callers legitimately render it as a focusable interactive element (`component="a"`,
  `component="button"`, or any `tabIndex` carrier). **Failure scenario:**
  `<Typography component="a" href="…" text="Read more" />` — a keyboard user Tabs onto
  it and sees NO focus indicator, because `.root`'s `outline: none` overrode the UA
  ring and nothing replaced it.
- **Fix (in-directory):** added a per-theme keyboard focus ring after `.outlined`:
  `.root:focus-visible { outline: 2px solid var(--goobs-sacred-focus-ring);
  outline-offset: 2px }`, with `.root[data-theme='light']:focus-visible` →
  `--goobs-light-primary` and `.root[data-theme='dark']:focus-visible` →
  `--goobs-dark-primary`. Specificity `.root:focus-visible` (0,1,1) beats `.root`
  (0,1,0) and `.outlined` (0,1,0), so the keyboard ring wins over a decorative/string
  outline *while focused* and yields it back on blur; `:focus-visible` (not `:focus`)
  keeps pointer clicks ring-free. Opaque per-theme colours mirror the **Button**
  convention because the translucent `--goobs-*-focus-ring` tokens composite below the
  3:1 non-text floor on their surfaces (1.4.11): light → `--goobs-light-primary`,
  dark → `--goobs-dark-primary`, and the sacred/no-theme base → **`--goobs-sacred-primary`
  (#ffd700, opaque)** — see Review-follow-up A below, which corrected the base ring from
  the translucent `--goobs-sacred-focus-ring` it originally (incorrectly) used. No
  shared-file change — all tokens already exist in `global.css`.

## Review follow-up (2026-07-11 adversarial re-review)

A second adversarial pass on the completed a11y work found two remaining issues; both
fixed in-directory (commit `498df82b`).

### A. Base focus ring used the TRANSLUCENT sacred token — MODERATE (fixes Issue 3 regression)

- **WCAG:** 1.4.11 Non-text Contrast (AA).
- **Pattern class:** `focus-ring-translucent-default-theme`
- **Location:** `src/components/Typography/Typography.module.css:124-127` (the base
  `.root:focus-visible`).
- **Status:** FIXED.
- **Detail:** The Issue-3 fix keyed the base `.root:focus-visible` to
  `var(--goobs-sacred-focus-ring)` = `--goobs-gold-a60` (0.6 alpha; `global.css:75,251`),
  while its own comment and this report claimed it "mirrors the Button convention: opaque
  per-theme ring colours." Button — the cited reference — does the OPPOSITE for its default
  (`Button.module.css:83-95`): it rings with the **opaque** `--goobs-sacred-primary`
  (#ffd700) precisely because gold-a60 is backdrop-DEPENDENT — ~5.5:1 only over the
  canonical dark sacred surface, dropping to ~1.2-1.5:1 over a light page or a translucent
  sacred surface, i.e. below the 3:1 non-text floor. Because `sacred` is the component-wide
  DEFAULT theme, Typography reintroduced for its default path exactly the sub-3:1
  backdrop-dependence Button was fixed to avoid. The light/dark overrides were already
  correct (opaque `--goobs-*-primary`); only the base was wrong.
- **Fix:** base `.root:focus-visible` now uses `outline: 2px solid var(--goobs-sacred-primary)`
  (opaque #ffd700), matching Button. Comment rewritten to describe the convention accurately
  (opaque primary is backdrop-independent; the translucent `--goobs-*-focus-ring` tokens are
  deliberately NOT used). No shared-file change — `--goobs-sacred-primary` already exists in
  `global.css:247`.
- **Coverage gap it closed:** the only pre-existing focus story (`FocusVisibleIndicator`)
  rendered `theme='light'` (opaque, passing) and never exercised the weaker default/sacred
  path. New story `SacredFocusVisibleIndicator` pins the resolved `outline-color` to the
  opaque gold `rgb(255, 215, 0)` on the sacred path — it fails against the pre-fix CSS
  (which resolves to `rgba(255, 215, 0, 0.6)`).

### B. Polymorphic-interactive API was not type-safe (`href`/`type`/… rejected) — MINOR

- **WCAG:** supports 2.4.7 / 4.1.2 (typing the interactive polymorphic surface the
  focus-visible + semantic-element fixes are premised on).
- **Pattern class:** `polymorphic-props-too-narrow`
- **Location:** `src/components/Typography/index.tsx` — `TypographyProps` base clause.
- **Status:** FIXED.
- **Detail:** `TypographyProps extends React.HTMLAttributes<HTMLElement>`, which does NOT
  include element-specific attributes — `href`/`target`/`download` (anchor), `type`/`name`/
  `value` (button/input). So the report's own motivating scenario for the focus-visible fix,
  `<Typography component="a" href="…" text="Read more" />`, was a TypeScript excess-property
  error and did not compile; the advertised `component="a"`/`component="button"` usages were
  not type-safe (callers had to cast). The runtime CSS/spread already worked; only the typing
  was too narrow. (Note: `rel`/`color`/`content` were already covered — they live on
  `HTMLAttributes` itself, not just the element-specific interfaces.)
- **Fix (additive):** widened the base to `React.AllHTMLAttributes<HTMLElement>` — React's
  element-agnostic superset of `HTMLAttributes`. This adds `href`/`target`/`download`/`type`/
  `name`/`value`/… so all polymorphic-interactive usages typecheck, while remaining strictly
  additive (every prop valid before is still valid; verified compatible with the repo's
  `exactOptionalPropertyTypes: true` — the redeclared `color`/`width`/`htmlFor` all narrow to
  a subtype of the inherited type, which interface-extends permits). No public prop/export was
  renamed, removed, or retyped: `TypographyProps` stays an `interface`, `Typography` stays a
  `React.FC`. The explicit `htmlFor?: string` is retained for discoverability (now also
  inherited).
- **Chosen over a generic `OverridableComponent`/`TypographyProps<C>` pattern deliberately:**
  a per-element generic would tie props to the named element (`href` only for `component="a"`),
  but it would RETYPE the public `interface` export into a generic type alias and RETYPE
  `Typography` off `React.FC` into a generic function — exactly the "never retype an existing
  export" the additive-only public-API contract forbids, and unverifiable here (per-file lint
  only, no repo typecheck/build). `AllHTMLAttributes` resolves the concrete documented failure
  (the props typecheck) with zero retype risk. **Tradeoff, documented in the prop JSDoc:** an
  HTML attribute is now accepted regardless of which element `component` names (not
  element-narrowed); the runtime `{...rest}` spread forwards it verbatim, as before.
- **Markup change:** none. Only the accepted-prop TYPE surface widened; no change to the
  rendered element or emitted attributes.
- **Coverage:** new stories `InteractiveLinkElement` (`component="a" href` — the documented
  scenario, a type-level lock that won't build against the old `HTMLAttributes` base) and
  `InteractiveButtonElement` (`component="button" type`/`name`/`value`).

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
- **Focus (`:focus-visible`):** FIXED (Issue 3). The DEFAULT `<span>` is non-focusable,
  but Typography is polymorphic and forwards `tabIndex`/`component="a"`/etc., so
  interactive usages need — and previously lacked — a focus ring (the `.root` `outline`
  declaration was even suppressing the UA default). A per-theme `.root:focus-visible`
  ring was added. The `outline: true` opt-in (`.outlined`, `Typography.module.css:96`)
  remains a *decorative* text outline keyed to `currentColor`, distinct from the focus
  ring, and is superseded only while the element is keyboard-focused.
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
  `data-component`/`data-theme`/`className`/`style` on the resolved element.
- Updated the component-level and prop-level JSDoc to document the semantic-element
  polymorphism.
- **(Review follow-up, Issue 2)** `TypographyProps extends React.HTMLAttributes<HTMLElement>`
  + explicit `htmlFor?: string`; render destructures `className`/`style` and spreads
  `...rest` onto the element so `id`/`htmlFor`/`aria-*`/etc. reach the DOM. `{...rest}`
  is spread BEFORE the contract attributes; caller `className`/`style` are MERGED
  (resolved classes/vars keep precedence). Additive — no existing prop changed.
- Verified: `bun lint:file` clean on both edited files. Polymorphic-`ElementType`
  render pattern matches established, building code in `FieldGrid/index.tsx:65`; the
  `extends React.HTMLAttributes<HTMLElement>` + `...rest` spread pattern matches
  `Panel/index.tsx:97,126,161`.
- **(2026-07-11, Issue 3)** Added `.root:focus-visible` + `[data-theme='light'|'dark']`
  outline-colour overrides to `Typography.module.css` — a visible 2px per-theme keyboard
  focus ring for interactive (polymorphic/`tabIndex`) usage, overriding the `.root`
  `outline: none` that was suppressing the UA ring. Stylelint (token-leak) + ESLint clean.
- **(2026-07-11, Review-follow-up A)** Corrected the base `.root:focus-visible` ring from the
  translucent `--goobs-sacred-focus-ring` (gold-a60, backdrop-dependent, sub-3:1 off dark
  surfaces) to the opaque `--goobs-sacred-primary` (#ffd700), matching Button; comment
  rewritten to describe the convention accurately. Stylelint + ESLint clean.
- **(2026-07-11, Review-follow-up B)** Widened `TypographyProps` base from
  `React.HTMLAttributes<HTMLElement>` to `React.AllHTMLAttributes<HTMLElement>` so the
  polymorphic-interactive attributes (`href`/`target`/`type`/`name`/`value`/`download`)
  typecheck. Purely additive — no prop/export renamed/removed/retyped; `interface`+`React.FC`
  shape preserved. JSDoc updated. ESLint clean.

## Stories updated

Six stories in `src/components/Typography/Typography.stories.tsx` (the repo's only
regression tests) cover the a11y behaviors, each with a `play` assertion:

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
- **(New, Issue 2) `Semantics/Heading Names a Region (aria-labelledby)`**
  (`HeadingAsLabelledbyTarget`) — `component="h2" id="region-title"` inside
  `<section aria-labelledby="region-title">`; asserts `getByRole('region', { name:
  'Account Settings' })` resolves (the id pass-through makes the heading the region's
  accessible name) and the `<h2>` carries the `id` + `data-component`.
- **(New, Issue 2) `Semantics/Label Associates With Control (htmlFor)`**
  (`LabelAssociation`) — `component="label" htmlFor="email-input"` + an
  `<input id="email-input">`; asserts `getByLabelText('Email address')` returns the
  input (association works), the label is a real `<label>` with `for="email-input"`,
  and `data-component` preserved.
- **(New, Issue 2) `Semantics/Attribute Pass-Through (contract preserved)`**
  (`AttributePassThroughPreservesContract`) — `component="h3"` with `id`,
  `className="caller-added-class"`, and `aria-describedby`; asserts the attributes
  ride through, the caller class is MERGED (`>1` class on the element), and
  `data-component`/`data-theme` are NOT clobbered by the pass-through spread.
- **(New, Issue 3) `A11y/Keyboard Focus Indicator`** (`FocusVisibleIndicator`) —
  renders a focusable Typography (`tabIndex={0} role="button"`); asserts
  `outline-style: none` before focus, then `userEvent.tab()` (keyboard modality →
  engages `:focus-visible`) and asserts the focused element shows a `solid` `2px`
  outline. Fails against the pre-fix CSS (no `:focus-visible` rule → outline stays
  `none`), so it locks the regression.
- **(New, Review-follow-up A) `A11y/Keyboard Focus Indicator (Sacred default theme)`**
  (`SacredFocusVisibleIndicator`) — exercises the DEFAULT/sacred focus path the light-theme
  story never touched; Tabs onto a `theme='sacred'` focusable Typography and asserts the
  focused `outline-color` is the OPAQUE gold `rgb(255, 215, 0)` (`--goobs-sacred-primary`).
  Fails against the pre-fix CSS, which resolves to the translucent `rgba(255, 215, 0, 0.6)`.
- **(New, Review-follow-up B) `Semantics/Interactive Link (href typechecks)`**
  (`InteractiveLinkElement`) — `component="a" href="#read-more" rel="noopener"`; a type-level
  lock that will NOT compile against the old `HTMLAttributes` base (href excess-property error).
  At runtime asserts a real `<a>` resolves via `getByRole('link')`, carries `href`/`rel`/
  `data-component`, and Tab engages the focus ring.
- **(New, Review-follow-up B) `Semantics/Interactive Button (type/name typecheck)`**
  (`InteractiveButtonElement`) — `component="button" type="button" name="save" value="1"`;
  covers the button/input attribute class alongside the anchor `href`. Asserts a real
  `<button>` with `type`/`name` + `data-component` preserved.

## Deferred

None. All three defects were fixable in-directory (additive props + render change +
`:focus-visible` CSS). No shared-file or peer-owned change was required — the focus-ring
colour tokens (`--goobs-sacred-focus-ring`, `--goobs-light-primary`, `--goobs-dark-primary`)
already exist in `src/styles/global.css` and were consumed, not modified.

Informational (not owned here, no action needed for Typography): `global.css`
`--goobs-light-focus-ring` (rgba 0.4) / `--goobs-dark-focus-ring` (rgba 0.45) composite
below the 3:1 non-text floor on their surfaces — which is exactly why this component (like
Button) uses the opaque `--goobs-*-primary` tokens for its light/dark rings. Raising those
shared tokens is already tracked in `Button.md`'s Deferred section.
