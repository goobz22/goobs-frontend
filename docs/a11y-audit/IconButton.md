# IconButton — a11y audit (2026-07-11)

**Status:** FIXED

**APG pattern:** [Button](https://www.w3.org/WAI/ARIA/apg/patterns/button/) — an
icon-only variant. `IconButton` is a thin wrapper that delegates rendering to
`<Button>`, which emits a native `<button>` (correct role, keyboard, `disabled`
semantics built in). The wrapper adds a round, sized, themed control whose ONLY
content is an icon, so the whole audit reduces to: does the icon-only button
carry an accessible name, and is keyboard focus visible in every theme.

Because it delegates to `<Button>`, IconButton inherits (verified, not changed):

- Native `<button>` — real role/keyboard (Enter/Space activate), `disabled`
  attribute conveys disabled state programmatically (not colour-alone).
  (`src/components/Button/index.tsx:633-646`, `438`)
- `:focus-visible` keyboard focus ring, per-theme colours, WCAG 2.4.7/2.4.11.
  (`src/components/Button/Button.module.css:82-85, 182-184, 224-226`)
- `@media (prefers-reduced-motion: reduce)` disabling transition + hover lift,
  WCAG 2.3.3. (`src/components/Button/Button.module.css:321-329`)
- `data-component` is overridden to `"IconButton"` and reaches the DOM (spread
  after Button's own `data-component="Button"`), preserving the Playwright
  selector contract. (`src/components/IconButton/index.tsx:151` region)

## Issues found

### 1. Icon-only button has no accessible name — SERIOUS — WCAG 4.1.2 (Name, Role, Value), 1.1.1 (Non-text Content) — FIXED
- **Where:** `src/components/IconButton/index.tsx` (render delegates icon-only to
  `<Button icon={children}>`); the icon svg has no text alternative
  (`src/components/Icons/Edit.tsx:45-57` — no `role`/`<title>`/`aria-label`/
  `aria-hidden`); Button deliberately does NOT `aria-hidden` an icon-only
  button's icon, delegating the name to a caller `aria-label`
  (`src/components/Button/index.tsx:616-630`).
- **Problem:** every IconButton renders a `<button>` whose only content is a
  nameless `<svg>`, so its computed accessible name is EMPTY. Screen readers
  announce "button" with no purpose. `IconButtonProps` neither documented nor
  surfaced the `aria-label` mechanism, and NONE of the stories supplied one — so
  the library's own regression fixtures shipped nameless buttons.
- **Pattern class:** `missing-accessible-name`.
- **Fix:** (a) explicitly declared + JSDoc'd `aria-label` and `aria-labelledby`
  on `IconButtonProps` (additive — they already flowed through
  `React.ButtonHTMLAttributes`; this makes the requirement discoverable and
  documents it as required); (b) added a **development-only** `console.warn`
  (guarded by `process.env.NODE_ENV`, mirroring the goobs `Dialog` nudge at
  `src/components/Dialog/index.tsx:251-261`) that fires when an IconButton is
  rendered with neither name mechanism; (c) updated every story to pass a
  meaningful `aria-label`, and added an `Accessibility/Accessible name` story
  exercising both `aria-label` and `aria-labelledby`. The name still cannot be
  invented from an arbitrary icon node, so a required-name contract + author-time
  warning is the correct "accessible by default" measure.

### 2. Sacred-theme IconButton suppresses the keyboard focus ring — SERIOUS — WCAG 2.4.7 (Focus Visible), 2.4.11 (Focus Appearance) — FIXED
- **Where:** `src/components/IconButton/index.tsx` sacred override previously set
  `outline: false as const` (was line 123); `<Button>` maps `styles.outline ===
  false` to an inline `outline: 'none'` (`src/components/Button/index.tsx:463-468,
  522`), and an inline style outranks the `.button:focus-visible { outline: 2px
  solid … }` rule (`src/components/Button/Button.module.css:82-85`) because inline
  styles beat pseudo-class selectors without `!important`.
- **Problem:** every **sacred** IconButton rendered `style="…;outline:none"`, so
  when focused by keyboard the `:focus-visible` ring was defeated → NO visible
  keyboard-focus indicator. (Light/dark IconButtons were unaffected — they never
  set `outline`.) The forced `outline: false` was also redundant: the resting
  outline is already `none` from the base `.button` rule
  (`Button.module.css:48`), so it suppressed the focus ring while changing
  nothing about the resting appearance.
- **Pattern class:** `missing-focus-visible-style`.
- **Fix:** removed `outline: false` from the sacred override object. Resting
  appearance is unchanged (base CSS still `outline: none`); `:focus-visible` now
  restores the ring for keyboard users. Added an `Accessibility/Keyboard focus`
  story tabbing through sacred/dark/light so the behavior is documented and
  regression-visible.

## Adversarial-review follow-ups (2026-07-11)

### 3. Icon-only button submits its enclosing `<form>` (no default `type`) — MODERATE — WCAG 4.1.2 / functional-keyboard defect — FIXED
- **Where:** `src/components/IconButton/index.tsx` render — IconButton spread
  `{...restProps}` onto `<Button>` with no `type`, so the rendered native
  `<button>` (`src/components/Button/index.tsx:633-646`, `type` only ever present
  when a consumer passes one via `filteredProps`) inherited the HTML default
  `type="submit"`.
- **Problem:** an IconButton is an icon-only *auxiliary* control (delete-row,
  clear, expand). Placed inside a `<form>`, clicking it — or focusing it and
  pressing Enter — submitted the form. A real functional/keyboard defect that
  shipped for IconButton.
- **Pattern class:** `implicit-submit-button`.
- **Fix (root-cause, IconButton-scoped):** destructured `type` out of props and
  render `type={type ?? 'button'}`, so an unqualified IconButton is a
  non-submitting button by default (matches MUI's `IconButton`, which defaults
  `type="button"`). **Additive** — a caller may still pass `type="submit"` for a
  genuine submit control (exercised by the new story). The wider fix (defaulting
  `type="button"` in `<Button>` itself so plain `<Button>` gets the same safety
  and the two components can't diverge) lives in a file this owner cannot edit —
  see **Deferred**. Fixing IconButton here does not *cause* divergence: it makes
  the icon-only control correct now; when Button adopts the same default they
  converge.

### 4. Empty/whitespace `aria-label` slipped past the accessible-name guard — MINOR — WCAG 4.1.2 — FIXED
- **Where:** `src/components/IconButton/index.tsx` dev-only guard — the check was
  `ariaLabel == null && ariaLabelledby == null`.
- **Problem:** `aria-label=""` (or a blank/whitespace `aria-labelledby`) is not
  `== null`, so it suppressed the warning while still computing to an EMPTY
  accessible name — the exact failure the guard exists to catch.
- **Pattern class:** `empty-string-accessible-name`.
- **Fix:** the guard now treats an empty/whitespace-only value as unnamed —
  `hasAccessibleName = Boolean(ariaLabel?.trim()) || Boolean(ariaLabelledby?.trim())`
  — so `aria-label=""` and `aria-label="   "` now warn. A real id reference is
  always non-blank text, so `.trim()` on `aria-labelledby` is safe.

## Hearing (WCAG 1.2.x, 1.4.2)
No audio, `AudioContext`, `<audio>`/`<video>`, or `navigator.vibrate` in the
component (grep of `src/components/IconButton` — 0 matches). No sound-only
feedback. Nothing to fix.

## Reading & screen reader
- **Accessible name:** was the primary defect (Issue 1) — now required,
  documented, dev-warned, and exercised by stories.
- **Semantic role / keyboard:** native `<button>` via `<Button>` — role and
  Enter/Space activation are built in, no `role`-annotated div. Correct.
- **Focus visible:** was suppressed on sacred (Issue 2) — now fixed; light/dark
  already correct via inherited `:focus-visible`.
- **Disabled state:** conveyed programmatically by the native `disabled`
  attribute plus `:disabled` CSS, not colour alone (WCAG 1.4.1). Correct.
- **No dynamic content / overlays / forms** owned by IconButton — no
  `aria-live`, focus-trap, or error-association surface applies here.
- **Reduced motion:** inherited from Button; IconButton adds no new
  animation/transition. Correct.

## SEO semantics
Renders a real native `<button>` (not an `onClick` div). IconButton is a control,
not a heading/link/landmark, so no `headingLevel`/landmark/`<a href>` concerns
apply. An icon-only control that navigates should be authored as a link by the
consumer — outside this component's scope. Content is fully present in SSR HTML
(no client-only primary content). Clean.

## Fixes applied
1. `index.tsx` — declared + JSDoc'd `aria-label` / `aria-labelledby` on
   `IconButtonProps`; added dev-only `console.warn` when an IconButton renders
   with no accessible name; documented the requirement on the component JSDoc.
2. `index.tsx` — removed the `outline: false` sacred override that suppressed the
   keyboard `:focus-visible` ring.
3. `IconButton.stories.tsx` — added `aria-label` to every existing IconButton
   (LightTheme, DarkTheme, SacredTheme, Sizes ×4, Colors ×7, DisabledStates ×3).
4. `index.tsx` — default `type={type ?? 'button'}` on the passthrough so an
   icon-only auxiliary IconButton no longer submits its enclosing `<form>`
   (review finding 3). Additive: `type="submit"` still honored.
5. `index.tsx` — accessible-name dev guard now treats empty/whitespace-only
   `aria-label`/`aria-labelledby` as unnamed via `.trim()` (review finding 4).

## Stories updated
- Extended all existing stories with meaningful `aria-label`s (accessible-name
  regression coverage).
- New `Accessibility/Accessible name` — demonstrates `aria-label` and
  `aria-labelledby` (visible-caption-linked) name mechanisms; JSDoc now also
  documents that an empty/whitespace name warns.
- New `Accessibility/Keyboard focus` — sacred/dark/light row proving the
  `:focus-visible` ring renders in every theme (regression guard for Issue 2).
- New `Behavior/Form-submit safety` — a `<form onSubmit>` wrapping a default
  IconButton (must NOT submit) plus an explicit `type="submit"` IconButton and a
  real submit button (regression guard for review finding 3).

## Deferred
- **`type="button"` default in `<Button>` (SHARED — Button):** the IconButton
  instance of this defect is now **fixed in-directory** (finding 3 above —
  IconButton defaults `type="button"`). The remaining deferred work is defaulting
  `type="button"` in `<Button>` itself so a plain `<Button>` used as a non-submit
  action also gets the safe default, and so Button + IconButton can never diverge.
  - **File:** `src/components/Button/index.tsx`.
  - **Line:** destructuring block at `410-424` (add `type` to the destructure);
    the rendered `<button>` at `632-646` (currently receives `type` only via
    `{...filteredProps}` at line 645, i.e. only when a consumer passes one).
  - **Suggested change:** destructure `type` in the `Button` prop list and render
    `<button … type={type ?? 'button'} …>` (place the explicit `type` so it is
    not re-overridden by `{...filteredProps}`; since `type` is destructured out of
    `restProps`→`filteredProps`, a caller value still wins via the default). This
    is additive — `ButtonProps` already types `type` through
    `React.ButtonHTMLAttributes` — and consumers that need a submit button pass
    `type="submit"`. **Owner: Button.** Note: whoever fixes Button should verify
    no existing consumer relied on a bare `<Button>` implicitly submitting a form.
- **Icon `<svg>` not `aria-hidden` (SHARED — Icons + Button):** goobs icon
  components render an `<svg>` with no `aria-hidden`
  (`src/components/Icons/Edit.tsx:45-57`). Inside an IconButton this is harmless
  once `aria-label` is set (the label wins the accessible-name computation), but
  as a defense-in-depth measure the decorative icon in an icon-only button could
  be `aria-hidden`. This belongs in Button's icon-slot logic
  (`src/components/Button/index.tsx:621-630`, which currently hides the icon only
  when a text label is present) or in the Icons components — both outside this
  directory. **Owner: Button / Icons.** No user-facing defect remains after
  Issue 1's fix; noting for completeness.
