# SacredGlyphFrame — a11y audit (2026-07-11)

**Status:** FIXED

**APG pattern:** None. `SacredGlyphFrame` is a purely decorative *presentational
wrapper* — an animated gold-glow border plus an `aria-hidden` row of floating
Egyptian glyphs and optional `aria-hidden` corner ornaments, drawn around
arbitrary `children` (typically a sacred-themed `<Card>`). It renders no
interactive control, no heading, no landmark, and no live region of its own, so
it maps to no WAI-ARIA APG widget pattern. The correct semantic posture for a
frame like this is a *transparent* wrapper: the root `<div>` carries no ARIA role
so `children` supply all semantics, and every decorative subtree is removed from
the accessibility tree. That posture was already largely in place; this pass
verified it and closed the one remaining gap.

## Issues found

| # | Severity | WCAG | Location | Status | Summary |
|---|----------|------|----------|--------|---------|
| 1 | Minor | 2.4.7 Focus Visible (AA) | `src/components/SacredGlyphFrame/SacredGlyphFrame.module.css` `.root` (16) / `index.tsx:144` | FIXED | The public API `extends React.HTMLAttributes<HTMLDivElement>` and spreads `...restProps` onto the root (`index.tsx:144`), so a consumer can make the frame focusable (`tabIndex` / `role` / `onClick`), but the module.css defined **no `:focus-visible` treatment** — a keyboard user focusing the frame would get no visible focus indicator. 45 sibling components already ship a focus-visible rule; this one did not. |

### Pattern class
Issue 1 → `missing-focus-visible-style` (cross-component class: any component that
spreads `HTMLAttributes` onto a root element a consumer can make focusable, yet
ships no `:focus-visible` style).

## Non-issues verified (no action needed)

- **Hearing (WCAG 1.2.x, 1.4.2):** grep for `new Audio` / `AudioContext` /
  `<audio>` / `<video>` / `navigator.vibrate` / `.play()` returned nothing. No
  sound or media surface exists. CLEAN.
- **Decorative subtrees hidden from AT (WCAG 1.1.1, 4.1.2):** the floating glyph
  row (`index.tsx:187–212`) and the corner-ornament container (`index.tsx:146–185`)
  are both `aria-hidden="true"`. The Egyptian hieroglyph characters (`𓊵 𓋹 𓊹`
  …) and ornaments never leak into the screen-reader stream. The `content` wrapper
  carrying `children` (`index.tsx:214`) is *not* hidden, so real content stays
  exposed. This contract is regression-locked by the pre-existing
  `Accessibility/Decoration Hidden, Content Exposed` story. CLEAN.
- **Reduced motion (WCAG 2.3.3 / 2.2.2):** both animations honour
  `@media (prefers-reduced-motion: reduce)` — `.glow` freezes to a static glow
  (`SacredGlyphFrame.module.css:36–43`) and `.glyph` drops to `animation: none`
  (`:69–74`). The 6s glow pulse is far too slow to be a flash risk (WCAG 2.3.1),
  and reduced-motion is the accepted stop/hide mechanism for decorative infinite
  motion (WCAG 2.2.2); all motion is `aria-hidden` so no information is lost when
  it stops. CLEAN.
- **Semantic HTML / SEO (WCAG 1.3.1; SEO):** the component renders no heading,
  link, list, table, or landmark — it is a wrapper whose semantics belong to
  `children`. A plain `<div>` root with no role is the correct transparent
  wrapper here; forcing a `role` (e.g. `figure`/`group`) would inject unwarranted
  structure into the a11y tree. `children` render server-side with no client-only
  injection of primary content (only the decorative keyframes are client-injected).
  No `headingLevel` prop is warranted. CLEAN.
- **Colour-alone state (WCAG 1.4.1):** the glow/glyph decoration conveys no
  state a user must perceive; `data-sgf-glow` / `data-sgf-glyphs` (`index.tsx:142–143`)
  are machine-test selectors, not user-facing state. CLEAN.
- **Dynamic announcements (WCAG 4.1.3):** the only dynamic hook is `emitDiag`
  (`index.tsx:115–128`) onto the dev diagnostics bus — not user-facing content,
  so no live region is warranted. CLEAN.
- **Interactive `corners` misuse:** `corners` is documented decorative-only and
  rendered inside `aria-hidden` + `pointer-events:none`; passing an interactive
  node would be documented consumer misuse ("Decorative only … pass a glyph / SVG
  / emoji"), not a component defect. No change.

## Fixes applied

Added a defensive keyboard-focus indicator to the root
(`SacredGlyphFrame.module.css`):

```css
.root:focus-visible {
  outline: 2px solid var(--sgf-gold);
  outline-offset: 2px;
}
```

Rationale and safety:
- `:focus-visible` only matches once the element is *actually focusable and
  keyboard-focused*, so on a default decorative frame (non-focusable) the rule is
  a complete no-op — zero risk of a spurious ring on a non-interactive `<div>`.
- Uses `outline` (not `box-shadow`) so the ring survives Windows forced-colors /
  high-contrast mode, matching the outline-based focus treatment used across the
  library (e.g. `Card.module.css`).
- Uses the component's own `--sgf-gold` custom property (defined on `.root`), so
  no new token or dependency is introduced.
- Additive only — no existing prop, export, DOM element, `data-*`, `role`, or
  `aria-*` attribute was renamed, removed, or retyped; the machine-test selector
  contract (`data-component`, `data-sgf-*`) is untouched.

## Stories updated

- **Added `Accessibility/Focusable Frame Focus Ring`**
  (`SacredGlyphFrame.stories.tsx`) — renders the frame promoted to a focusable,
  labelled group (`tabIndex={0}`, `role="group"`, `aria-label`), then a `play`
  function asserts the root actually takes DOM focus (the precondition that
  activates the `:focus-visible` outline) and that the decorative glyph row stays
  `aria-hidden` even when the frame itself is focusable.
- **Pre-existing `Accessibility/Decoration Hidden, Content Exposed`** continues to
  lock the aria-hidden decoration contract (glyph row + corners hidden; content
  exposed). Storybook stories are this repo's only regression tests, so both
  stories together guard the a11y contract against future refactors.

## Deferred

None. Every finding was fixable at root cause inside the owned component
directory. No shared util, Field/Shell, `src/styles/global.css`, or barrel change
was required. The `sacredGlowPulse` / `sacredFloat` keyframes in
`src/utils/keyframes.ts` (not owned here) are pure decorative CSS with no
accessibility concern.
