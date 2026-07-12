# Markdown — a11y audit (2026-07-11)

**Status: FIXED** (incl. TWO adversarial-review follow-up passes — see
"Adversarial-review fixes" and "Adversarial-review fixes — pass 2" below)

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
| 5 | Minor | 1.4.10 Reflow (AA) | `Markdown.module.css:15-28` (no inline-wrap rule pre-fix) | `.root` had **no `overflow-wrap`/`word-break`**. The `<pre>`/`<img>` rules fixed code-block and media reflow, but a pathological unbroken **inline** string — a bare long URL used as link text, or a long inline `<code>` token from `mdToHtml` (`conversion.ts:19`) — is neither, and overflowed horizontally at a 320px viewport / 400% zoom (residual 1.4.10 failure). | **FIXED** |
| 6 | Minor | (test-integrity, not a WCAG item) | `Markdown.stories.tsx` (FocusableLinks, pre-fix) | The `FocusableLinks` story had **no `play`/interaction function**, so no link was ever focused and the `.root a:focus-visible` ring (issue 1's fix) never rendered in the Chromatic-captured state. Removing the focus-visible rule would have produced an identical snapshot — the a11y state was effectively **unexercised** by goobs' only regression net. | **FIXED** |

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

## Adversarial-review fixes (2026-07-11, follow-up pass)

An adversarial review of the pass above found two residual minor issues; both
fixed at root cause (all changes stay inside `Markdown/` — no un-owned file
touched, no DOM/API/`data-*` change):

- **Issue 5 — inline-text reflow** — added `overflow-wrap: break-word` to `.root`
  (`Markdown.module.css:15-28`). `break-word` introduces a soft-wrap opportunity
  *only* inside a word that would otherwise overflow, so normal prose wrapping is
  unchanged, but a pathological unbroken inline string (long bare-URL link text,
  long inline `<code>`) now wraps instead of widening the page at a 320px
  viewport / 400% zoom. Completes the 1.4.10 coverage the `<pre>`/`<img>` rules
  started (those handle only block-level code and media, not inline runs).
- **Issue 6 — `FocusableLinks` was unexercised** — added a `play` function
  (`storybook/test` `userEvent.tab()` + `expect(...).toHaveFocus()`, matching the
  `Avatar` `Accessibility/Focusable` template) that Tabs real keyboard focus onto
  the first rendered link, so `.root a:focus-visible` actually paints in the
  Chromatic baseline. Without it the ring never rendered and deleting the
  focus-visible rule would have passed silently. The play fn also asserts the
  second/third links' `href`s to confirm all three are keyboard-reachable.

## Adversarial-review fixes — pass 2 (2026-07-11, second follow-up)

A second adversarial review found two more issues; both fixed at root cause. Both
fixes are pure post-processing of the `mdToHtml` output string inside the owned
`index.tsx` (no `conversion.ts` / un-owned file touched, no element removed, no
existing `data-*`/role/aria attribute removed or renamed — the machine-test
selector contract is untouched):

- **Issue 7 (Moderate, WCAG 2.1.1 Keyboard) — keyboard-inaccessible code-block
  scroll region.** The pass-1 reflow fix `.root pre { overflow-x: auto }`
  (`Markdown.module.css:98-101`) turns a long code line into a horizontally
  *scrollable* region, but the `<pre>` `mdToHtml` emits
  (`conversion.ts:91` → `<pre><code>…`) has **no `tabindex`, no `role`, and no
  focusable children**. In a browser that does not auto-focus scroll containers
  (Safari; older Chromium) a keyboard-only user cannot scroll it to read the
  clipped code — the exact failure axe flags as `scrollable-region-focusable`
  (Serious). *This is the pass-1 auditor's own blind spot: its `ReflowSafeMedia`
  story rendered a keyboard-inaccessible scroll container as the demonstration.*
  **Fixed** by a `makeCodeBlocksAccessible` post-process in `index.tsx:44-53`
  that rewrites each converter-emitted `<pre>` to
  `<pre tabindex="0" role="region" aria-label="Code block">`:
  - `tabindex="0"` makes the box focusable so it is reachable and arrow-key
    scrollable — the actual WCAG 2.1.1 / `scrollable-region-focusable` fix.
  - `role="region"` + `aria-label` exposes it as a labelled, navigable region.
    The label is **numbered** (`Code block`, `Code block 2`, …) when one block
    emits multiple `<pre>`s so axe `landmark-unique` stays clean *within* the
    instance. A component cannot dedupe labels ACROSS sibling `Markdown`
    instances on a host page; that residual is a best-practice flag (not a WCAG
    failure) and is strictly better than the Serious keyboard failure it
    replaces. Kept `role="region"` per the reviewer's recommendation with this
    caveat documented.
  - Safe by construction: `mdToHtml` HTML-escapes the source, so a literal source
    `<pre>` arrives as `&lt;pre&gt;` and the `/<pre>/g` replace only ever matches
    the converter's own tags.
- **Issue 8 (Minor, document outline / SEO) — embedded-block heading offset.**
  `mdToHtml` maps a leading `#` to a literal `<h1>` (`conversion.ts:114-124`), so
  multiple Markdown blocks on one page each emit their own `<h1>` and a consumer
  had no way to demote a block's headings to slot it under an existing page
  heading. Pass 1 deferred this as a `headingOffset` enhancement citing
  `conversion.ts` is not owned — but a level-shifting regex over the `mdToHtml`
  *output* is feasible inside the owned `index.tsx` without touching
  `conversion.ts`, so the deferral was not fully forced. **Fixed** with an
  additive, backward-compatible `headingOffset?: number` prop
  (`index.tsx:88-96`, default `0` = no change) consumed by a `shiftHeadingLevels`
  post-process (`index.tsx:70-79`) that shifts every `<h1>`–`<h6>` down by
  `offset`, clamped to the legal `<h1>`–`<h6>` range (a source `#` renders `<h3>`
  at `headingOffset={2}`). The level digit lives in both the open and close tag,
  so one pass over `<hN>`/`</hN>` shifts both consistently; escaping again
  guarantees only real heading tags match (never `<hr>`/`<header>`/escaped
  literals). Heading level was already controllable via markdown syntax, so this
  is an outline/SEO refinement, not a blocker — now fully addressed.

## Stories updated

Stories are this repo's only regression tests. `Markdown.stories.tsx` now carries
FIVE a11y stories (matching the file's JSDoc-per-story convention):

- **`A11y/Reflow-safe media`** (`ReflowSafeMedia`) — renders a deliberately
  1200px-wide inline-SVG data-URI image (self-contained, renders offline) plus a
  fenced code block with one very long unbroken line, inside a narrow 360px
  frame. Exercises `.root img { max-width: 100% }` and
  `.root pre { overflow-x: auto }`; a regression (removing either rule) makes the
  360px frame scroll horizontally.
- **`A11y/Reflow-safe inline text`** (`ReflowSafeInlineText`, added in the review
  pass) — a long bare-URL link and a long inline `<code>` token inside a narrow
  320px frame (the WCAG reflow width). Exercises the new
  `.root { overflow-wrap: break-word }`; removing that rule makes the frame scroll
  sideways instead of wrapping the token.
- **`A11y/Focusable links (dark)`** (`FocusableLinks`) — three markdown links on
  the dark canvas (inherited light text), now with a `play` function that Tabs
  onto the first link so the `currentcolor` `:focus-visible` ring paints and is
  captured; exercises `.root a:focus-visible` on the exact surface where a
  UA-default dark outline would disappear.
- **`A11y/Keyboard-scrollable code`** (`KeyboardScrollableCode`, added in review
  pass 2) — a fenced block with one very long line in a narrow 360px frame, with
  a `play` function that asserts the injected `<pre>` carries `tabindex="0"` +
  `role="region"` (via `getByRole('region', { name: 'Code block' })`) and that a
  single `Tab` moves keyboard focus onto it. Regression-gates issue 7 (WCAG
  2.1.1); deleting the `index.tsx` post-process fails both assertions.
- **`A11y/Heading offset`** (`HeadingOffset`, added in review pass 2) — renders
  `#`/`##` headings with `headingOffset={2}` and a `play` function that asserts
  the demoted levels (`<h3>`/`<h4>`) and that **no `<h1>`** is emitted
  (`queryByRole('heading', { level: 1 })` is null). Regression-gates issue 8;
  removing the level-shift post-process re-emits an `<h1>` and fails the story.

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

> **Previously-deferred "heading-outline offset for embedded blocks" is now
> RESOLVED**, not deferred. Review pass 2 established that a level-shift over the
> `mdToHtml` *output* is feasible in the owned `index.tsx` without touching
> `conversion.ts`; implemented as the additive `headingOffset` prop (issue 8
> above). No un-owned file was required.
