# SacredGlyphFrame — a11y audit (2026-07-11)

**Status: CLEAN** (no WCAG violations found; a regression story was added to lock in the
accessibility contract).

## Component role & APG pattern

`SacredGlyphFrame` is a **decorative wrapper / frame** — it renders an animated gold-glow
border, a top-centred row of floating decorative Egyptian glyphs, and optional decorative
corner ornaments around arbitrary `children` (typically a sacred-themed `<Card>`). It renders
**no interactive elements of its own** and conveys **no semantic information** beyond the
content passed as `children`.

**WAI-ARIA APG pattern: none applicable.** This is not an interactive widget (not a
dialog/menu/tabs/combobox/accordion/switch/etc.), so there is no required role, no state
machine, and no keyboard-interaction table to satisfy. The correct semantics for a purely
decorative frame are exactly what it renders: a generic `<div>` container whose decorative
subtrees are removed from the accessibility tree and whose `children` pass through untouched.
Its nearest cross-component class is a "decorative chrome wrapper" (like a card frame or a
glow border), not an ARIA pattern.

## Audit results by checklist

### A. Hearing-impaired (WCAG 1.2.x, 1.4.2) — PASS
- Grepped the component for `new Audio` / `AudioContext` / `<audio>` / `<video>` /
  `navigator.vibrate`: **none present**. No information is conveyed by sound; there is no
  media playback. Nothing to caption/transcript. Not applicable.

### B. Reading-impaired / screen-reader / cognitive (1.1.1, 1.3.1, 1.4.1, 2.1.x, 2.3.x, 4.1.2) — PASS
- **Accessible name / interactive elements:** the component renders **no** interactive
  elements (`button`/`a`/`input`), so there is no accessible-name, focus-order, or
  keyboard-interaction obligation. `restProps` is spread onto the root
  (`index.tsx:144`), which is the correct additive escape hatch: a consumer that uses the
  frame as a *meaningful* region can pass `role` + `aria-label` without an API change.
- **Decorative content hidden (1.1.1):** both decorative subtrees are `aria-hidden="true"`
  at the container level, which removes their entire subtrees from the accessibility tree:
  - the floating glyph row — `index.tsx:190` (`data-sgf-glyph-row`), which keeps the
    decorative Egyptian hieroglyphs (`𓊵 𓋹 𓊹 …`) out of the screen-reader stream;
  - the corner-ornaments container — `index.tsx:149` (`data-sgf-corners`).
  The content region (`index.tsx:214`, `data-sgf-content`) is **not** hidden, so `children`
  remain fully exposed to assistive tech. Correct.
- **Semantic HTML (1.3.1):** renders a generic `<div>` wrapper plus decorative `<span>`s —
  no role-annotated div masquerading as a semantic element, and no semantic element misused
  for decoration. Correct for a decorative frame.
- **Motion / reduced motion (2.3.3, 2.2.2):** both auto-playing infinite animations honor
  `prefers-reduced-motion: reduce` — the glow freezes to a static box-shadow
  (`SacredGlyphFrame.module.css:36-43`) and the floating glyphs freeze
  (`SacredGlyphFrame.module.css:69-74`). The static corner ornaments have no animation.
  This is the accepted mechanism for pausing/stopping decorative auto-motion, and it covers
  **every** animated element in the component. See "Considered & compliant" below.
- **Flash / seizure (2.3.1):** the glow pulse cycle is 6s (`.module.css:33`) — far below the
  3-flashes-per-second threshold; the float is smooth translation, not a flash. Safe.
- **Color-alone for state (1.4.1):** no user-facing state is conveyed by color. The
  decoration mode is exposed **programmatically** via `data-sgf-glow` / `data-sgf-glyphs`
  (`index.tsx:142-143`) for machine tests; there is no error/selected/disabled state to
  convey. Not applicable.
- **Dynamic-update announcement (4.1.3):** the only "dynamic" behavior is `emitDiag` on a
  decoration-mode change (`index.tsx:122`), which writes to a dev-only diagnostics bus
  (`window.__diag`) — it renders no user-facing content and needs no `aria-live`. The
  decoration mode is a controlled prop, not async content. Not applicable.
- **Overlays / focus trap / forms:** the component is not a dialog/drawer/popover and renders
  no form controls — none of the overlay-trap or form-association requirements apply.

### C. SEO-semantic (1.3.1, 2.4.x) — PASS
- **Headings:** the component renders **no** heading text of its own; headings come from
  `children` (e.g. `Card.Title`). There is no styled `<div>` standing in for a heading, so no
  `headingLevel` prop is warranted. Correct.
- **Landmarks:** a decorative frame is **not** a landmark (it is not a nav/header/aside by
  role), so no landmark element is appropriate; wrapping `children` in one would be incorrect.
- **Links:** none rendered — no `onClick`-div-as-link. Not applicable.
- **SSR content:** `children` (and the decorative spans) render server-side; there is no
  client-only injection of primary content, and no canvas/QR requiring a text alternative.

## Issues found

**None.** No WCAG 2.2 violation was identified. The component was already built
accessible-by-default: decorative subtrees are correctly `aria-hidden`, both animations honor
`prefers-reduced-motion`, it introduces no interactive elements needing names/roles/keyboard
handling, and it passes content through with correct semantics.

## Considered & compliant (documented, not defects)

- **WCAG 2.2.2 (Pause, Stop, Hide, Level A)** — the glow (6s infinite) and the floating
  glyphs (3–5.5s infinite, staggered via `--sgf-float-duration`) auto-start, last >5s, and run
  in parallel with content, which puts them in scope for 2.2.2. The mechanism to stop them is
  the `prefers-reduced-motion` media query, which fully freezes **both** animations
  (`.module.css:36`, `:69`). Honoring the OS-level reduced-motion setting is the accepted
  stop/hide mechanism for subtle decorative background motion, so this is treated as compliant
  rather than a finding. All motion is decorative and `aria-hidden`, so no information is lost
  when it stops.
- **Interactive `corners` misuse** — the `corners` prop is documented decorative-only and is
  rendered inside `aria-hidden` + `pointer-events:none`. If a consumer passed an *interactive*
  node it would be inaccessible, but that is documented consumer misuse (the JSDoc says
  "Decorative only" / "pass a glyph / SVG / emoji"), not a component defect.

## Fixes applied

None required — the component already satisfies the checklist.

## Stories updated

- Added **`AccessibilityContract`** (`Accessibility/Decoration Hidden, Content Exposed`) to
  `SacredGlyphFrame.stories.tsx`. Because Storybook stories are this repo's only regression
  tests, this story's `play` assertion locks in the accessibility contract so a future
  refactor cannot silently regress it. It renders the frame with glow + glyphs + corners all
  enabled and asserts:
  - the glyph row (`[data-sgf-glyph-row]`) has `aria-hidden="true"`;
  - the corners container (`[data-sgf-corners]`) has `aria-hidden="true"`;
  - the content region (`[data-sgf-content]`) does **not** have `aria-hidden`, and its text is
    reachable/visible through the accessibility tree.
  No public API, DOM element, `data-*`, `role`, or `aria-*` attribute was changed.

## Deferred (files outside my ownership)

None. No fix requires touching a shared util, Field/Shell, `global.css`, or the barrel. The
`sacredGlowPulse` / `sacredFloat` keyframes in `src/utils/keyframes.ts` (not owned here) are
pure decorative CSS with no accessibility concern.
