# Avatar — a11y audit (2026-07-11)

**Status:** FIXED

## APG pattern

Avatar has no interactive WAI-ARIA APG pattern of its own — it is a presentational
circular container for an icon, image, or text initials. The relevant accessibility
model is the **image / text-alternative** pattern: a graphic that conveys identity needs
either an accessible name (`role="img"` + `aria-label`, or an inner `<img alt>`) or, when
purely decorative, removal from the accessibility tree (`aria-hidden`). Because the
component also spreads arbitrary `restProps`, callers routinely make the disc **focusable**
(onClick + tabIndex / role="button"), which brings the focus-visibility requirement into
scope.

## Issues found

| # | Severity | WCAG | Location | Status |
|---|----------|------|----------|--------|
| 1 | Moderate | 1.1.1 Non-text Content (A); 4.1.2 Name, Role, Value (A) | `src/components/Avatar/index.tsx:131` (rendered `<div>`) | FIXED |
| 2 | Minor | 2.4.7 Focus Visible (AA); 2.4.11 Focus Appearance (AA) | `src/components/Avatar/Avatar.module.css` (no `:focus-visible` rule) | FIXED |

### Issue 1 — No mechanism for an accessible name (`missing-accessible-name`)

The avatar rendered as a bare `<div data-component="Avatar">` with no way to supply an
accessible name. When children are initials ("MG"), a screen reader spells out a cryptic
"M G"; when children are a decorative glyph or a photo without alt text, nothing meaningful
is announced. An avatar that identifies a person/entity therefore had no reliable text
alternative. There was no additive hook for consumers to attach the human-meaningful name.

**Fix (root cause):** added an additive optional `label?: string` prop. When a non-empty
label is supplied, the disc is exposed as `role="img"` with `aria-label={label}`, so AT
announces the name **once** (and, via `role="img"`, does not additionally read the raw
initials). An unlabeled avatar deliberately stays a plain container with no role — its text
children still speak for themselves and no unnamed-`role="img"` violation is introduced.
The conditional role/aria-label is emitted **before** `{...restProps}` so a caller's own
`role`/`aria-label`/`aria-hidden` still win. All existing `data-*`/attribute selectors
(`data-component`, `data-theme`, `data-size`, `data-disabled`) are untouched.

### Issue 2 — No `:focus-visible` treatment (`missing-focus-visible-style`)

`restProps` are spread onto the root `<div>`, so callers commonly make the avatar
interactive (onClick + tabIndex, or role="button"). The module.css had **no**
`:focus-visible` rule, so a keyboard user focusing an interactive avatar saw no indicator.

**Fix (root cause):** added a theme-aware `:focus-visible` outline in the module.css.
`outline` (not `box-shadow`) is used deliberately — it is immune to the arbitrary inline
`border`/`box-shadow` overrides this component applies through the `style` prop, so the
indicator can never be clobbered by caller styling. Focus hues mirror the design system's
per-theme focus tokens (sacred = `var(--goobs-gold)`; light/dark = the focus-ring blues)
at full opacity for >= 3:1 non-text contrast against the surrounding surface. The rule only
matches when the element is actually focusable, so it is a no-op for the default
presentational avatar.

## Hearing

No sound, audio, video, `AudioContext`, or `navigator.vibrate` usage exists in the
component (grep-verified across `src/components/Avatar`). No hearing-impaired concerns
(WCAG 1.2.x / 1.4.2). **CLEAN.**

## Reading & screen reader

- Accessible name: FIXED via the additive `label` prop (Issue 1).
- Semantic HTML: a `<div>` is appropriate for a presentational avatar disc; there is no
  heading, control, or list semantic being faked. Interactive semantics are correctly left
  to the caller (via spread props) rather than hard-coded.
- Focus: FIXED via `:focus-visible` (Issue 2).
- Color-only state: the `disabled` treatment is **not** color-alone — it combines opacity
  (dark/sacred) or an explicit muted fill + `--goobs-light-text-disabled` text (light) with
  the programmatic `data-disabled="true"` attribute. The existing CSS comment documents that
  the light disabled path was tuned to keep the initials at >= 4.5 contrast, so this is a
  deliberate, contrast-aware pattern, not a defect. `disabled` is documented as "purely
  visual"; because the avatar is non-interactive, `aria-disabled` would be semantically
  inert and was intentionally not added.
- Motion (WCAG 2.3.3): the module.css contains **no** animations or transitions, so no
  `prefers-reduced-motion` block is required (adding one would be dead code). **CLEAN.**

## SEO semantics

Server-rendered markup is a single `<div>` with its text/graphic children inline — all
meaningful content is present in the SSR'd HTML with no client-only injection. The avatar
is not a heading, landmark, list, or link, so no heading-level/landmark/`<a href>` props
apply. **CLEAN.**

## Fixes applied

1. `src/components/Avatar/index.tsx` — added additive `label?: string` prop (JSDoc'd) and
   conditional `role="img"` + `aria-label` emission (before `{...restProps}` so caller ARIA
   still wins). Public API remains additive-only; no prop renamed/removed/retyped.
2. `src/components/Avatar/Avatar.module.css` — added theme-aware `.root:focus-visible`
   outline (light/dark/sacred), immune to inline border/box-shadow overrides.

## Stories updated

`src/components/Avatar/Avatar.stories.tsx` — the story (+ Chromatic baseline) IS this repo's
regression test, so every new a11y state must be *driven* by a `play` fn for the state to
actually appear in the baseline (a passive render of an interactive state is not gated —
`:focus-visible` only paints on genuine keyboard focus):

- **Accessibility/Labeled** — renders `label="Matthew Goluba"`; a `play` fn now asserts the
  disc is `role="img"` with `aria-label="Matthew Goluba"` while the visible content stays the
  initials, so the accessible-name wiring is regression-gated (previously covered only
  incidentally by the axe addon).
- **Accessibility/Focusable** — renders `tabIndex={0} role="button"` light + sacred avatars;
  a `play` fn now `userEvent.tab()`s real keyboard focus onto the light avatar and asserts
  `toHaveFocus()`, so the base `.root:focus-visible` ring paints and Chromatic captures it.
  It also asserts the sacred disc is keyboard-reachable (`tabindex="0"`).
- **Accessibility/Focusable (sacred)** — a single sacred avatar tabbed to focus, so the gold
  `[data-theme='sacred']:focus-visible` outline-color override is captured in the baseline.
- **Accessibility/Focusable (dark)** — a single dark avatar tabbed to focus, so the
  `[data-theme='dark']:focus-visible` outline-color override is captured in the baseline.

Together the three focus stories gate the *entire* `:focus-visible` CSS block (base outline
+ dark + sacred colour overrides) — deleting any of those rules now changes a snapshot.

## Adversarial-review follow-up (2026-07-11)

A review of the a11y pass found the added `Focusable` story had **no `play` function and
never moved keyboard focus**, so the `:focus-visible` ring it claimed to regression-test was
never rendered in the Chromatic baseline — deleting `.root:focus-visible` would have changed
no snapshot and passed silently. **Confirmed valid** and fixed at root cause by driving real
keyboard focus in `play` fns (matching the repo convention, e.g. `Button.stories.tsx` "drives
:focus-visible, which the Chromatic snapshot captures as the visible ring"), and by adding
per-theme focus stories so the sacred/dark outline-colour overrides are gated too. The
`Labeled` story likewise gained a `play` asserting `role="img"`/`aria-label`.

## Deferred

None. All findings were fixable inside the component directory. No shared-file changes
(package.json, src/styles/global.css, barrel, Field/Shell, shared utils) were required.
