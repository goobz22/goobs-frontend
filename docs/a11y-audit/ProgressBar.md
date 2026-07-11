# ProgressBar — a11y audit (2026-07-11)

**Status:** FIXED

**Component:** `src/components/ProgressBar/index.tsx`,
`src/components/ProgressBar/ProgressBar.module.css`,
`src/components/ProgressBar/ProgressBar.stories.tsx`

## APG pattern

**Progressbar** (WAI-ARIA `progressbar` role). ProgressBar renders a `<div>`
with `role="progressbar"` on the track (`index.tsx:308`). This is the correct,
APG-sanctioned primitive for a styled/animated/themed progress indicator — the
native `<progress>` element cannot carry the gradient/stripe/pulse rendering or
the cross-theme treatment this component needs, and the div+role pattern is the
standard for exactly this case. No element change is warranted.

The ARIA value contract was already largely correct and is preserved:

- **Determinate** exposes `aria-valuemin={0}`, `aria-valuemax={100}`,
  `aria-valuenow={clampedValue}`, and `aria-valuetext="N percent"`
  (`index.tsx:310-313`). Value is clamped to 0–100 (`index.tsx:188`).
- **Indeterminate** correctly **omits** `aria-valuenow`/`aria-valuemin`/
  `aria-valuemax` (they resolve to `undefined`, so React drops the attributes) —
  this is the ARIA-defined signal for an unknown/indeterminate value — and sets
  `aria-valuetext="Loading"` for context (`index.tsx:291-299, 310-313`).
- An accessible **name** is always present: `aria-label` defaults to `'Progress'`
  when the consumer supplies none (`index.tsx:309`).

That correct core is why the findings below are motion + verbosity, not a broken
value/name contract.

## Issues found

### 1. Looping animations have no `prefers-reduced-motion` handling — SERIOUS
- **WCAG:** 2.3.3 Animation from Interactions (AAA); 2.2.2 Pause, Stop, Hide (A)
  — the indeterminate variant is auto-starting motion that lasts well over five
  seconds.
- **Where:** `ProgressBar.module.css` — auto-starting, **infinite** animations
  with no reduced-motion guard anywhere in the file (a grep for
  `prefers-reduced-motion` across the directory returned zero matches before this
  pass):
  - `progressIndeterminate` horizontal sweep — `.module.css:141` (base),
    inherited by every indeterminate/theme variant.
  - `progressStripes` scroll — `.module.css:282-285` (striped indeterminate),
    `:344` / `:350` (striped + animated determinate), and joined onto pulse at
    `:373-376`.
  - `progressPulse` rings — `.module.css:364-368`.
  - the determinate fill `transition: var(--goobs-transition-slow)`
    (`.module.css:94`) / `--goobs-transition-premium` (`:126`).
- **Detail:** A user with a vestibular disorder who has set "reduce motion" at
  the OS level still received the full horizontal sweep, scrolling stripes, and
  pulsing rings — the exact translation/movement `prefers-reduced-motion` exists
  to suppress. The indeterminate sweep in particular runs indefinitely while a
  load is in flight.
- **Pattern:** `missing-reduced-motion`
- **Status:** FIXED — added an `@media (prefers-reduced-motion: reduce)` block
  (`ProgressBar.module.css`, appended after the keyframes). It drops the fill
  transitions, turns the determinate decorative loops (stripe scroll, pulse
  rings) fully **off**, and — rather than leaving the indeterminate bar with no
  activity cue — replaces the vestibular sweep + stripe scroll with a new
  motion-free `progressReducedMotionPulse` opacity fade (0.55↔1), so a loading
  state is still perceivable without any movement (motion **replaced**, not just
  removed, per the WCAG technique). The reduced-motion selectors mirror the
  animated rules at equal-or-higher specificity and sit later in source order, so
  they win without `!important`.

### 2. Visible label is announced twice by screen readers — MINOR
- **WCAG:** 4.1.2 Name, Role, Value (A) — redundant/verbose exposure.
- **Where:** `index.tsx:327-336` (pre-fix) — the visible label `<div>` rendered
  the same text (`"65%"` / custom `label` / `"Loading..."`) that
  `aria-valuetext` already conveys on the progressbar, but was **not**
  `aria-hidden`, so it remained a separate node in the accessibility tree.
- **Detail:** In browse mode a screen reader announced the progressbar with its
  `aria-valuetext` value and then, immediately after, the standalone label text
  node with the same content — a duplicate read of the same information. The
  label is purely a visual reinforcement of the value.
- **Pattern:** `duplicate-sr-announcement`
- **Status:** FIXED — added `aria-hidden="true"` to the visible label
  (`index.tsx`), removing it from the accessibility tree while keeping it
  on-screen for sighted users. `aria-valuetext` remains the single programmatic
  source of the value. `data-testid="progress-bar-label"` is preserved (aria-hidden
  does not remove the node from the DOM), so the machine-test selector contract is
  intact.

## Deliberately NOT changed (informed decisions, not gaps)

- **No `aria-live` was added to the progressbar.** A determinate bar updates
  frequently (the `LoadingSimulation` / `FileUploadSimulation` stories step every
  ~2%). Wrapping it in a live region would flood assistive tech with
  "2 percent, 4 percent, 6 percent…" — an anti-pattern. The `progressbar` role
  with a changing `aria-valuenow`/`aria-valuetext` is precisely the ARIA-designed
  mechanism screen readers already handle (NVDA progress beeps, JAWS periodic
  announcements, both user-configurable). Adding `aria-live` here would be a
  regression, not a fix.
- **Element stays a `role="progressbar"` div**, not native `<progress>` — see APG
  pattern above.

## Hearing

No sound/media APIs are used — a grep for `new Audio` / `AudioContext` /
`<audio>` / `<video>` / `navigator.vibrate` / `.play(` across the ProgressBar
directory is empty. All progress/loading state is conveyed visually (the fill
width, the label, the animation) and programmatically (`role="progressbar"` +
`aria-valuenow`/`aria-valuetext`), never via audio. WCAG 1.2.x / 1.4.2 not
applicable. No hearing-related issue.

## Reading & screen reader

- **Accessible name:** always present — `aria-label` defaults to `'Progress'`
  and accepts a consumer override (`index.tsx:184, 309`). The `aria-label`
  argType is already documented in the stories.
- **Roles/states/values:** correct progressbar contract — determinate exposes
  min/max/now + valuetext; indeterminate omits the numeric values (ARIA's
  indeterminate signal) and sets `aria-valuetext="Loading"`. Value clamped
  0–100. Unchanged except the label-hiding fix.
- **Semantic HTML:** the progressbar is not a heading, link, list, or form
  control — a `role="progressbar"` div inside the `<div data-component="ProgressBar">`
  grouping wrapper is the correct construction; no native-element substitution
  applies (native `<progress>` cannot render the themed/animated treatment).
- **Keyboard:** a progressbar is a read-only status indicator — non-interactive,
  not in the tab order, no keyboard interaction table applies, and no
  `:focus-visible` treatment is needed (there is nothing focusable). No fix.
- **Color-alone (1.4.1):** progress value is conveyed by the fill **width** and
  the text label + `aria-valuenow`/`aria-valuetext`, never by color alone. The
  `disabled` visual (opacity 0.5, `.module.css:77-80`) is on a non-interactive
  indicator and is additionally exposed programmatically via `data-disabled`.
  No fix.
- **Dynamic updates:** handled by the `progressbar` role's native value-change
  announcement — see "Deliberately NOT changed" for why an explicit `aria-live`
  would be harmful here.
- **Motion (2.3.3 / 2.2.2):** was the primary gap — now fixed (Issue 1).
- **Label duplication (4.1.2):** fixed (Issue 2).
- **No overlay/dialog surface** — no focus-trap / Escape / `aria-modal`
  concerns.

## SEO semantics

ProgressBar is a status indicator, not a heading, landmark, link, list, table,
or figure — so no `<h1-6>`, `<nav>`, `<a href>`, `<ul>`, `<table>`, or
`<figure>` obligation applies. Under Next.js SSR the `role="progressbar"` and
its `aria-*`/`data-*` attributes are static and render server-side into the
crawled HTML; there is no client-only injection of primary content (the visible
label and the ARIA values are present on first render). No SEO-semantic issue.

## Fixes applied

1. `ProgressBar.module.css` — added a `@media (prefers-reduced-motion: reduce)`
   block plus a new `progressReducedMotionPulse` keyframe: drops the fill
   transitions, turns off the determinate stripe/pulse loops, and replaces the
   indeterminate horizontal sweep + stripe scroll with a motion-free opacity
   pulse so a loading state stays perceivable. (Issue 1.)
2. `index.tsx` — added `aria-hidden="true"` to the visible label so its text is
   not announced a second time on top of `aria-valuetext` (with a JSDoc comment
   explaining the rationale and that `data-testid` is preserved). (Issue 2.)
3. `ProgressBar.stories.tsx` — new `AccessibilityShowcase` story (below).

No existing `data-*` / `role` / `aria` attribute was removed or renamed; the
public prop API is unchanged (no new props were needed — both fixes are internal
markup/CSS). The machine-test selector contract (`data-component`,
`data-testid`, `data-theme`, `data-variant`, `data-striped`, `data-animated`,
`data-pulse`, `data-disabled`, `role="progressbar"`, the `aria-value*`
attributes) is fully preserved. Per-file gate green: `bun lint:file` on
`index.tsx` + `ProgressBar.stories.tsx` (0 warnings). **CSS changed this pass** —
under an OS "reduce motion" setting the `Indeterminate` / `StripedAnimated` /
`PulseEffect` / `SacredIndeterminate` Chromatic baselines render motion-free;
that is the intended fix (default-motion baselines are unaffected).

## Stories updated

`ProgressBar.stories.tsx` (Storybook stories are the only regression tests in
this repo — goobs has no unit tests):

- **`AccessibilityShowcase`** — new. Renders three blocks on a pinned light
  canvas: a **determinate** bar (value exposed via `aria-valuenow` +
  `aria-valuetext`, with an explicit `aria-label="Upload progress"`), an
  **indeterminate** bar (`aria-valuenow` omitted, `aria-valuetext="Loading"`),
  and a **pulse + striped + animated** bar. Its JSDoc documents the ARIA
  contract and that all looping effects are neutralized under
  `prefers-reduced-motion`. This anchors the reduced-motion-affected states
  (indeterminate sweep, stripe scroll, pulse) and the aria-hidden label as a
  Chromatic regression baseline.

The existing `Indeterminate`, `StripedAnimated`, `PulseEffect`, and
`SacredIndeterminate` stories already exercise each animated state, so the
reduced-motion CSS is covered by them under an OS reduce-motion setting.

## Deferred

None. Both issues were fixable entirely inside the owned ProgressBar directory
(`index.tsx`, `ProgressBar.module.css`, `ProgressBar.stories.tsx`). No shared
util / Field / Shell / `global.css` / barrel change was required — the
reduced-motion CSS uses plain `none`/`transform` values and a local keyframe
(matching the file's three existing local keyframes), and the label fix is a
single attribute. No `--goobs-*` token addition in `global.css` (out of scope)
was needed.
