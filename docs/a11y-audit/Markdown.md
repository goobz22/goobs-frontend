# Markdown — a11y audit (2026-07-11)

**Status: FIXED**

## APG pattern

**No interactive WAI-ARIA APG pattern.** `Markdown` is a read-only content
renderer: it converts a markdown string to HTML via `mdToHtml`
(`src/components/ComplexTextEditor/utils/conversion.ts`) and injects it with
`dangerouslySetInnerHTML` into a single wrapper `<div>` (`index.tsx:58-67`).
Accessibility is therefore a matter of **document semantics + reflow + focus**,
not a widget keyboard-interaction table. The rendered output uses real native
elements from the converter — `<h1>`–`<h4>`, `<p>`, `<ul>/<ol>/<li>`,
`<blockquote>`, `<pre><code>`, `<a href>`, `<img alt>`, `<strong>/<em>/<del>` —
so heading/list/link/emphasis semantics are correct and crawlable in the SSR'd
HTML (the `useMemo` conversion at `index.tsx:47` runs on the server, so primary
content is present in the initial HTML — no client-only injection).

The one class of interactive element the renderer can emit is the native
`<a href>` link, which is keyboard-focusable and self-labelled by its link text —
so the audit centred on **keyboard focus visibility** and **reflow**.

## Issues found

| # | Severity | WCAG 2.2 | Location | Issue | Status |
|---|----------|----------|----------|-------|--------|
| 1 | Moderate | 2.4.7 Focus Visible (A) / 2.4.13 Focus Appearance (AAA) | `Markdown.module.css:59-62` (links, pre-fix) | Rendered `<a>` links had **no `:focus-visible` treatment**. The component styles links (`color: inherit; text-decoration: underline`) and is deliberately theme-less, but on a dark/sacred surface the inherited light text sits against a UA-default focus outline that can be near-invisible. Keyboard/AT users could not reliably see which link was focused. | **FIXED** |
| 2 | Moderate | 1.4.10 Reflow (AA) | `Markdown.module.css` (no `img` rule pre-fix) | Rendered `<img>` had **no width constraint** despite the component JSDoc (`index.tsx:33-35`) explicitly promising "image responsiveness". A wide image overflowed the content box and forced a two-dimensional page scroll at narrow viewports / high zoom. | **FIXED** |
| 3 | Moderate | 1.4.10 Reflow (AA) | `Markdown.module.css` (no `pre` rule pre-fix) | Rendered `<pre><code>` code blocks were **not scroll-contained**. A long unbroken code line overflowed the container and widened the page instead of scrolling inside its own box. | **FIXED** |
| 4 | Minor | 1.4.4 Resize Text (AA) | `Markdown.module.css:25` (pre-fix `font-size: 16px`) | Body copy was a **fixed `16px`**, so the block did not scale with a reader's larger browser default-font-size preference (browser zoom still worked, but user-set base font size was ignored). | **FIXED** |

### Hearing-impaired (WCAG 1.2.x / 1.4.2) — CLEAN

Grepped the component for `new Audio` / `AudioContext` / `<audio>` / `<video>` /
`navigator.vibrate` / `.play()` / sound — **no audio, media, or vibration usage.**
Nothing conveys information by sound, so no visual-equivalent or caption/transcript
work is required. No status is audio-only.

### Motion (WCAG 2.3.3) — CLEAN

Grepped for `animation` / `transition` / `@keyframes` / `prefers-reduced-motion` —
**the module has no CSS animation or transition**, so a `prefers-reduced-motion`
guard would be inert. Nothing to fix.

### Color-alone state (WCAG 1.4.1) — CLEAN

Links deliberately inherit the surrounding text color (`color: inherit`, not a
distinct hue) and rely on the **underline** (`text-decoration: underline`,
`Markdown.module.css:61`) as the non-color affordance that separates them from
body text. State is not conveyed by color alone.

## Fixes applied

All fixes are pure CSS on the component's own `.module.css` (no `index.tsx` /
API change, no new element, no new dependency) — the rendered DOM contract and
all `data-*` test selectors are untouched.

- **Focus ring (issue 1)** — added `.root a:focus-visible` with
  `outline: 2px solid currentcolor; outline-offset: 2px; border-radius: 2px`
  (`Markdown.module.css:70-74`). `currentcolor` is the correct choice for this
  intentionally theme-less component: the ring is drawn in the same inherited
  text color that is already required to contrast the surface, so it is
  guaranteed visible on light **and** dark **and** sacred backgrounds without
  hardcoding a theme token. Applies to keyboard/AT focus only, never a pointer
  click; the UA outline is not removed, so this only strengthens the indicator.
- **Image reflow (issue 2)** — added `.root img { max-width: 100%; height: auto }`
  (`Markdown.module.css:86-89`). Clamps any rendered image to the content width
  and preserves aspect ratio; fulfils the "image responsiveness" the JSDoc
  always promised.
- **Code-block reflow (issue 3)** — added `.root pre { max-width: 100%;
  overflow-x: auto }` (`Markdown.module.css:91-94`). Long code lines now scroll
  inside their own box instead of widening the page.
- **Fluid font size (issue 4)** — changed `font-size: 16px` → `font-size: 1rem`
  (`Markdown.module.css:24-27`). Visually identical at the UA-default 16px root,
  but now scales with a reader's browser font-size preference.

## Stories updated

Stories are this repo's only regression tests. Added two to
`Markdown.stories.tsx`, matching the file's JSDoc-per-story convention:

- **`A11y/Reflow-safe media`** (`ReflowSafeMedia`) — renders a deliberately
  1200px-wide inline-SVG data-URI image (self-contained, renders offline) plus a
  fenced code block with one very long unbroken line, inside a narrow 360px
  frame. Exercises `.root img { max-width: 100% }` and
  `.root pre { overflow-x: auto }`; a regression (removing either rule) makes the
  360px frame scroll horizontally.
- **`A11y/Focusable links (dark)`** (`FocusableLinks`) — three markdown links on
  the dark canvas (inherited light text). Tabbing shows the `currentcolor`
  `:focus-visible` ring; exercises `.root a:focus-visible` on the exact surface
  where a UA-default dark outline would disappear.

The existing `LightTheme` / `DarkTheme` / `SacredTheme` stories already render
links, headings, lists, code, and emphasis across all three surfaces and remain
valid coverage for the semantic output.

## Deferred

None of the following are fixable inside the `Markdown/` directory without
touching a file this agent does not own; recorded for the owner of that file.

- **`mdToHtml` drops the fenced-code language hint** —
  `src/components/ComplexTextEditor/utils/conversion.ts:82-94` emits
  `<pre><code>…</code></pre>` and discards the ` ```ts ` language tag. Not an a11y
  defect (bare `<pre><code>` is announced correctly), but adding
  `class="language-<lang>"` / a `lang` hint would help future syntax-highlight and
  language-announcement. *Suggested change: capture the fence info-string in the
  code-block branch and emit it as a class on the `<code>`.* **File not owned —
  deferred.**
- **Heading-outline offset for embedded blocks** — a Markdown block whose source
  starts with `#` produces an `<h1>` (`conversion.ts:114-124`). Embedded mid-page
  this can create multiple `<h1>`s / a broken document outline. Headings **are**
  real and consumer-controllable via markdown syntax today (so the SEO-semantics
  checklist item is satisfied), but a purely additive `headingOffset?: number`
  prop on `Markdown` that demotes levels would let a consumer slot a block under an
  existing page heading. Implementing it correctly means rewriting heading tags in
  the converter output, which is fragile string-surgery on `mdToHtml` HTML this
  agent does not own — recorded as an **enhancement idea**, not a defect. *If
  pursued, the cleanest home is a `headingOffset` option on `mdToHtml` in
  `conversion.ts` (not owned), consumed by an additive `Markdown` prop.*
