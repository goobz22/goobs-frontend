# Content — a11y audit (2026-07-11)

**Status: FIXED**

## What Content is

`Content` (`ContentSection`) is a **declarative layout composer / dispatcher**. It takes a
`grids` array where each grid is a bag of sub-component props (`typography`, `button`, `link`,
`image`, `dropdown`, `qrcode`, ...) and, via the `Structure/*/use*.tsx` hooks, renders the matching
goobs component in order inside a `<div data-component="Content">`
(`src/components/Content/index.tsx:337`).

**Ownership boundary that scopes this audit:** almost every `use*` hook is a *thin delegator* that
spreads its props onto a sibling goobs component living **outside** this directory — e.g.
`useButton` → `../Button` (`Structure/button/useButton.tsx:14`), `useTypography` → `../Typography`,
`useQRCode` → `../QRCode` (`Structure/qrcode/useQRCode.tsx:15`), and all Field/* wrappers. The a11y
of those rendered elements (button name/role, QR-code text alternative, field labels/errors/keyboard,
dropdown combobox pattern) is owned by **those** components' directories and is recorded under
*Deferred* below, not fixed here.

The only files in this directory that **originate rendered markup** are:
`index.tsx` (wrapper divs), `Structure/link/useLink.tsx` (`<a>`), `Structure/image/useImage.tsx`
(`<img>`), and `Structure/animations.tsx` + `animations.module.css` (`AnimatedElement`/`StuckElement`).
Those are the surfaces audited and fixed.

## APG pattern

No single WAI-ARIA APG widget pattern — `Content` is a **generic container / layout composer**, not
an interactive widget. It renders real links (`<a href>`) and images (`<img>`) directly and delegates
every interactive widget (combobox, accordion, stepper, checkbox, radiogroup, ...) to sibling
components that each own their own APG-pattern compliance.

## Issues found

### 1. Image forces a meaningless `alt` and makes decorative images impossible — FIXED
- **Severity:** serious · **WCAG 1.1.1 Non-text Content (A)** · pattern `img-alt-meaningless-fallback`
- **File:** `src/components/Content/Structure/image/useImage.tsx:31,41` (pre-fix)
- Pre-fix `const { url, alt = '', ...restProps }` + `alt={alt || 'image'}`: because `''` is falsy, an
  author could **never** set a decorative empty alt (it was rewritten to the literal string
  `"image"`), and every image with no alt announced the generic, information-free label `"image"` —
  screen-reader noise that fails 1.1.1.
- **Fix:** destructure without a default and render `alt={alt ?? ''}`. Explicit `alt` (including `''`
  for decorative) is now honored verbatim; an omitted `alt` defaults to a decorative empty string
  rather than a meaningless label. **Rendered-DOM change:** images with no author `alt` now emit
  `alt=""` instead of `alt="image"`.

### 2. Entrance slide/fade animations ignore reduced-motion — FIXED
- **Severity:** moderate · **WCAG 2.3.3 Animation from Interactions (AAA) / 2.2.2 (A)** · pattern `missing-reduced-motion`
- **File:** `src/components/Content/Structure/animations.module.css` (whole file, pre-fix had no media query)
- `AnimatedElement` applies `animation: slideInLeft/Up/Down/Right/fadeIn/fadeOut 0.6s ...` with
  `translateX/Y(±40px)` transforms. There was **no** `@media (prefers-reduced-motion: reduce)` block,
  so users who request reduced motion still get the transform-based movement.
- **Fix:** added a `prefers-reduced-motion: reduce` block that sets `animation: none` and jumps each
  variant to its stable end state — slides/`fadeIn` become instantly visible with `transform: none`
  (content is never left hidden), `fadeOut` jumps to its intended hidden end state
  (`animations.module.css`, appended after `@keyframes fadeOut`).

### 3. Link has no accessible name when `text` is omitted — FIXED
- **Severity:** moderate · **WCAG 2.4.4 Link Purpose (A) / 4.1.2 Name, Role, Value (A)** · pattern `missing-accessible-name`
- **File:** `src/components/Content/Structure/link/useLink.tsx:28,34` (pre-fix)
- `LinkProps` extends `TypographyProps`, so `text` is optional while `link` is required. When `text`
  is omitted, the anchor wraps an empty `<Typography>` and would announce as an **empty link** with no
  discernible name.
- **Fix:** compute `hasVisibleText`; when there is no visible text, spread `aria-label={link}` onto the
  anchor so it announces its destination URL instead of nothing. Purely additive; a link with text is
  unchanged.

### 4. Fix-3 accessible-name guard ignored children-rendered links (Label-in-Name) — FIXED (review)
- **Severity:** minor · **WCAG 2.5.3 Label in Name (A) / 4.1.2 Name, Role, Value (A)** · pattern `label-in-name-mismatch`
- **File:** `src/components/Content/Structure/link/useLink.tsx:38` (pre-review-fix)
- Adversarial review of Fix 3 found the guard was computed from ONLY the `text` prop
  (`hasVisibleText = typeof text === 'string' && text.length > 0`). But `LinkProps extends
  TypographyProps`, which carries `children` (Typography renders `content = text || children`,
  `Typography/index.tsx:455`), and `children` flows through `...restProps` (`useLink.tsx:28`) onto the
  rendered `<Typography>` (`useLink.tsx:55`). So a link with visible `children` but no `text` still had
  `aria-label={link}` applied — the raw destination URL **overriding** the visible child text. That is
  a Label-in-Name / accessible-name mismatch: a speech-input user cannot activate the link by its
  visible label, and the announced name differs from what is shown.
- **Fix:** recompute the guard to mirror Typography's own content resolution —
  `const hasVisibleText = Boolean(text || restProps.children)`. This is strictly more correct than a
  bare `children != null` check: when `children` renders nothing (`''`, `false`, `null`) it correctly
  still falls back to the URL `aria-label`, and when `children` is real visible content the URL label
  is not applied so the visible name wins. Purely additive; no DOM/attribute contract change.

## Hearing (WCAG 1.2.x, 1.4.2)

**CLEAN.** Grepped the whole directory for `new Audio`, `AudioContext`, `navigator.vibrate`,
`<audio>`, `<video>`, canvas — zero matches. No information is conveyed by sound anywhere in Content;
nothing to remediate.

## Reading & screen reader

- Image alt (Issue 1) and link accessible name (Issue 3) fixed above.
- Semantic HTML is already used for the markup this directory originates: real `<a href>`
  (`useLink.tsx:34`) and real `<img>` (`useImage.tsx:38`) — both crawlable and correctly typed, not
  `onClick` divs. The `linkComponent` / `imageComponent` escape hatches (`index.tsx:103-104`) let a
  Next.js consumer inject `NextLink`/`NextImage` while still receiving `href`/`src`, so SSR markup
  stays a real anchor/image.
- Focus: this directory adds no new focusable widget of its own (links/images inherit the native
  focus ring; interactive widgets are delegated). No `:focus-visible` gap to fix here.
- No color-only state, no forms, no dynamic live-region updates originate in this directory (all such
  behavior is inside the delegated sibling components).

## SEO semantics

- Links render as real crawlable `<a href>`; images as real `<img src>` present in the SSR'd HTML —
  no client-only injection of primary content in this directory.
- Heading text is **not** rendered by Content directly; it is delegated to the `Typography` component
  (`useTypography.tsx` → `../Typography`), which owns whether it emits a real `<h1>-<h6>`. Any
  non-semantic-heading concern belongs to Typography (see Deferred).

## Fixes applied

1. `useImage.tsx` — honor explicit `alt` (incl. `''` decorative); default omitted `alt` to `""` instead of `"image"`.
2. `animations.module.css` — added `@media (prefers-reduced-motion: reduce)` disabling the slide/fade motion and jumping to stable end states.
3. `useLink.tsx` — `aria-label={link}` fallback when the link has no visible text.

All three shipped in commit `f3471108`.

## Stories updated

Added to `Content.stories.tsx` (the repo's only regression surface):
- **`A11y/Image Alt Text`** — a meaningful-alt image next to an explicit `alt=""` decorative image,
  driven through the real `grids.image` API (exercises Issue 1's fix; uses a self-contained inline SVG
  data-URI, no network asset).
- **`A11y/Link Accessible Name`** — a link with visible text, a link named by its visible `children`
  (no `text`) whose child name must NOT be overridden by the URL `aria-label` (exercises Issue 4's
  Label-in-Name fix), and a fully text-less link that gets its name from the `aria-label` href fallback
  (exercises Issue 3's fix).
- **`A11y/Reduced Motion`** — renders `AnimatedElement` across the slide/fade entrance variants so the
  reduced-motion CSS path is exercised (Issue 2).

Committed in `f3471108`.

## Deferred (correct fix lives outside this directory — do not edit from here)

These surface through Content but are rendered by sibling components owned by other agents; each should
be audited/fixed in its own component directory:

- **`src/components/Typography`** — owns whether heading variants (`h1`-`h6`) render as real
  `<h1>-<h6>` elements with a consumer-controllable level (SEO / 1.3.1). Content delegates all heading
  text here (`Structure/typography/useTypography.tsx:16`).
- **`src/components/QRCode`** — a QR code needs a text alternative (WCAG 1.1.1); verify the QRCode
  component provides one. Content only delegates (`Structure/qrcode/useQRCode.tsx:15`).
- **`src/components/Button`** — accessible name / native `<button>` semantics
  (`Structure/button/useButton.tsx:14`).
- **`src/components/Field/*`** (Text, Dropdown, Number, Password, Search, IPAM, Date, PhoneNumber,
  etc.), **`Checkbox`, `RadioGroup`, `Accordion`, `Stepper`, `TransferList`, `PricingTable`,
  `ProjectBoard`, `ComplexTextEditor`, `ConfirmationCodeInput`, `CodeCopy`** — every widget's APG
  pattern (roles/states/keyboard), label association, error `aria-describedby`/`aria-invalid`,
  focus-visible, live-region announcements, and combobox `role="combobox"`+`aria-expanded`+portalled
  `[role="listbox"]` contract are owned by those directories. Content passes props through unchanged
  (`index.tsx:186-331`) and preserves the machine-test selector contract.

No shared-util / Field / global.css / barrel edit was required for the issues fixable within this
directory; the deferred items are whole-component audits, not one-line shared-file changes.
