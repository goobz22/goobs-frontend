# Icons — a11y audit (2026-07-11)

**Status:** FIXED

> **Pass 2 re-audit (2026-07-11).** Independently re-audited the whole pattern
> against the full checklist; every prior finding is confirmed and present at
> HEAD. Mechanically re-verified the invariant: **261/261** non-story icons
> import `resolveIconA11y`, spread `{...svgA11y}` after `{...rest}`, and render
> the `{title ? <title>…}` child — zero drift. The `icon-missing-aria-hidden`
> lint module (`scripts/a11y-lints/`, SHIPPED, 0 violations, in `lint:all`)
> already guards the shape repo-wide, so the invariant is enforced, not just
> documented. **One genuine gap closed this pass:** the regression story
> exercised `aria-label`, `title`, and forced-hidden, but three other *shipped*
> `resolveIconA11y` naming branches — `aria-labelledby`, explicit-`role`
> override, and force-**expose** (`aria-hidden={false}` on an unnamed icon) —
> had no play-assertion. For a published lib whose stories are the only tests,
> those branches could regress silently. Added the `Accessibility/NamingBranches`
> story (Issue 3 below).

**APG pattern:** No interactive APG pattern applies — icons are graphics, not
controls. The governing guidance is the
[WAI Images tutorial → Functional/Decorative images](https://www.w3.org/WAI/tutorials/images/decorative/)
and the SVG accessibility rules: a **decorative** icon must expose a *null* text
alternative (`aria-hidden="true"`, never a tab stop), and an **informative**
icon must expose `role="img"` + an accessible name. goobs icons are used
overwhelmingly as decoration inside an already-labelled control (Button,
IconButton, MenuItem, Chip…), so the correct default is **decorative**, with an
**opt-in** name for the rare standalone/informative case.

## Scope

Audited as a PATTERN, not 261 files individually. Every icon is generated from
one template: `'use client'` → `interface <Name>IconProps extends
React.SVGProps<SVGSVGElement> { styles?: IconStyles }` → a wrapper `<div
className={wrapper} data-theme data-disabled>` around `<svg className={svg} …
{...props}>` with one or more `<path>`/`<rect>` children. Shared styling lives
in `icon.module.css`; the caller override type in `types.ts`; the barrel in
`index.ts`. Verified uniformity mechanically: 261 non-story `*.tsx`, all sharing
the exact `style={svgStyle}` → `{...props}` → `>` svg tail (260 standard + the
one multi-branch `ShowHideEye.tsx`). Representative icons read in full:
`AccessTime`, `Account`, `Close`, `Warning`, `QrCode` (rect-based, `fill="none"`),
`Add`, `ShowHideEye` (stateful, 4 render branches).

## Issues found

### 1. Every icon `<svg>` is decorative but exposes no null text alternative — SERIOUS — WCAG 1.1.1 (Non-text Content, A), 4.1.2 (Name, Role, Value, A) — FIXED
- **Where:** the shared icon template — e.g. `src/components/Icons/Close.tsx:45-57`,
  `AccessTime.tsx:45-57`, `Warning.tsx:45-57`, `QrCode.tsx:47-72`,
  `ShowHideEye.tsx:69-83, 113-127` (pre-fix). The `<svg>` had **no `aria-hidden`,
  no `role`, no `focusable`, and no `<title>`/`aria-label`** — an anonymous,
  unlabelled graphic.
- **Problem:** an unlabelled inline `<svg>` is exposed inconsistently across
  assistive tech — some SRs announce a nameless "image"/"graphic", adding noise
  next to the icon's already-labelled parent control; in legacy IE/Edge the
  `<svg>` is also a keyboard tab stop with no name (an empty focus stop). Neither
  the decorative case (should be silent) nor the informative case (should have a
  name) was served. This was flagged cross-component by the IconButton audit as a
  deferred "Owner: Icons" item (`docs/a11y-audit/IconButton.md` Deferred §2).
- **Pattern class:** `icon-missing-aria-hidden` (a.k.a. `icon-missing-decorative-default`).
- **Fix:** introduced the shared resolver `src/components/Icons/iconA11y.ts`
  (`resolveIconA11y`) and wired it into all 261 icons. The contract is now
  **accessible by default**:
  - **Decorative default** (no name supplied) → `aria-hidden="true"` +
    `focusable="false"`; AT skips it entirely.
  - **Named opt-in** → passing `aria-label` / `aria-labelledby` (both already in
    `React.SVGProps` via `AriaAttributes`, so this is a typed, additive opt-in)
    flips the icon to `role="img"`, exposes the name, and drops `aria-hidden`. A
    `title` (honoured at runtime for spread/JS consumers) renders a child
    `<title>` element — the valid inline-SVG naming mechanism — and likewise
    flips to a named `role="img"`.
  - **Explicit `aria-hidden` always wins**, so an icon can be force-hidden even
    when named, or force-exposed even when unnamed.
  The transform is purely additive: consumers passing nothing get correct
  decorative semantics for free; consumers already passing `aria-label`/`role`
  keep their exact behaviour. `focusable="false"` is now always emitted so an
  icon can never be a stray tab stop. The Playwright selector contract
  (`data-theme`, `data-disabled`, `{...props}` passthrough) is fully preserved —
  the consumer's remaining props still spread onto the `<svg>` (as `{...rest}`)
  before the computed a11y attributes.

### 3. Three shipped `resolveIconA11y` naming branches had no regression coverage — MINOR — WCAG 4.1.2 (Name, Role, Value, A) — FIXED (pass 2)
- **Where:** `src/components/Icons/iconA11y.ts:82-104` (the resolver) vs
  `IconA11y.stories.tsx` before this pass — the `Contract` play function pinned
  `aria-label`, `title`, and the explicit-`aria-hidden`-wins branches, but not:
  (a) `aria-labelledby` → `role="img"` + reference kept + `aria-hidden` dropped
  (`iconA11y.ts:82-83, 100-103`); (b) an explicit consumer `role` surviving over
  the auto `role="img"` (the `role ?? …` at `:100`); (c) force-**expose**,
  `aria-hidden={false}` on an unnamed icon dropping `aria-hidden` without
  inventing a role/name (`:87-94`).
- **Problem:** these are documented, publicly-consumable accessible-name paths.
  goobs has no unit tests — the Storybook play function IS the regression test —
  so an untested branch can break (e.g. a refactor that stops honouring
  `aria-labelledby`) with nothing failing. The `icon-missing-aria-hidden` lint
  guards the *decorative default* structurally but does not assert the *named*
  branch outputs.
- **Pattern class:** `untested-a11y-contract-branch`.
- **Fix:** added the `Accessibility/NamingBranches` story to
  `IconA11y.stories.tsx` — a play function asserting all three branches on
  `CloseIcon` (`aria-labelledby` → role img + reference + no aria-hidden;
  `role="button"` preserved alongside `aria-label`; `aria-hidden={false}` unnamed
  → no `aria-hidden`, no `role`, no name, still `focusable="false"`). No
  implementation change — the branches already behave correctly; this locks them.

### 2. Hover motion has no `prefers-reduced-motion` guard — MINOR — WCAG 2.3.3 (Animation from Interactions, AAA) — FIXED
- **Where:** `src/components/Icons/icon.module.css` — dark-theme hover
  `transform: scale(1.05)` (was `:54-58`) and sacred-theme hover `transform:
  scale(1.1) rotate(2deg)` (was `:69-73`), driven by the 200ms/400ms
  medium/premium transitions (`.svg` `:40-44`, `[data-theme='sacred'] .svg`
  `:62-67`). No `@media (prefers-reduced-motion: reduce)` block existed.
- **Problem:** users who ask their OS for reduced motion still got the scale/rotate
  animation on icon hover (a vestibular-trigger risk).
- **Pattern class:** `missing-reduced-motion`.
- **Fix:** added an `@media (prefers-reduced-motion: reduce)` block to
  `icon.module.css` that sets `transition: none` on `.svg` (all themes) and
  `transform: none` on the dark/sacred `:hover`. The colour/glow feedback is
  retained (non-motion); only the movement and its timed animation are removed.

## Hearing (WCAG 1.2.x, 1.4.2)
No audio, `AudioContext`, `<audio>`/`<video>`, or `navigator.vibrate` anywhere in
`src/components/Icons` (grep — 0 matches). Icons convey nothing by sound. Nothing
to fix.

## Reading & screen reader
- **Accessible name / decorative default:** was the primary defect (Issue 1) —
  now decorative-by-default with a typed `aria-label`/`aria-labelledby` (and
  runtime `title`) opt-in, exercised by the new story.
- **Semantic role:** icons render a native inline `<svg>` graphic — the correct
  element; the wrapper `<div>` is a purely presentational container (no
  role-annotated div masquerading as a control). Correct.
- **Focus visible:** icons are never focusable (`focusable="false"`, no
  `tabindex`), so no `:focus-visible` treatment is required on the icon itself —
  keyboard focus belongs to the wrapping control (Button/IconButton), which
  supplies its own ring. Correct by design.
- **Disabled state:** `data-disabled='true'` on the wrapper dims to
  `opacity: 0.5` + `pointer-events: none`. An icon is decorative, so the
  *programmatic* disabled semantics correctly belong to the wrapping control
  (`aria-disabled`/native `disabled`), not the graphic — the dimming is a purely
  visual echo. Not colour-alone (opacity, plus the parent's real state). No
  change needed.
- **Dynamic updates:** icons are static; `ShowHideEye`'s show/hide is driven by a
  consumer `visible` prop and the *consumer's* control announces the state — the
  icon needs no `aria-live`. Correct.
- **Reduced motion:** was missing (Issue 2) — now guarded.

## SEO semantics
Icons are inline `<svg>` in the SSR'd HTML (Next.js) — fully crawlable, no
client-only injection of primary content. `QrCode` is an inline-SVG *icon glyph*
(decorative representation), not a functional scannable code or a `<canvas>`, so
decorative-by-default with an opt-in name is correct. Icons are not headings,
links, or landmarks, so no `headingLevel`/`<a href>`/landmark concerns apply.
Clean.

## Fixes applied
1. **`iconA11y.ts` (new)** — shared `resolveIconA11y(props)` helper implementing
   the decorative-default + named-opt-in + explicit-override contract (JSDoc'd).
2. **261 icon `*.tsx`** — each now calls `resolveIconA11y(props)` and spreads
   `{...rest} {...svgA11y}` on the `<svg>` (replacing the bare `{...props}`) plus
   renders `{title ? <title>{title}</title> : null}`. Applied by a one-off
   scratch codemod over the 260 standard icons; `ShowHideEye.tsx` migrated by
   hand across its four render branches (two `<svg>` + two sacred-glyph `<div>`;
   the glyph `<div>`s received the same decorative-default aria so the hieroglyph
   is not read as noise).
3. **`icon.module.css`** — added the `@media (prefers-reduced-motion: reduce)`
   block (Issue 2).

## Stories updated
- **`IconA11y.stories.tsx` (new)** — the regression spec (goobs has no unit
  tests; the story play function IS the test):
  - `Accessibility/Contract` — pins all four states on `CloseIcon`: decorative
    default (`aria-hidden="true"` + `focusable="false"`, no `role`/name/`<title>`),
    `aria-label` (→ `role="img"`, named, not hidden), `title` (→ `role="img"` +
    child `<title>` text, not hidden), and explicit `aria-hidden` winning over a
    supplied name.
  - `Accessibility/MultiBranchIcon` — pins the multi-branch `ShowHideEye` in both
    decorative and `aria-label` forms.
  - `Accessibility/NamingBranches` **(added pass 2)** — pins the remaining three
    documented naming branches on `CloseIcon`: `aria-labelledby` (→ `role="img"`,
    reference kept, not hidden), explicit `role="button"` surviving over the auto
    `role="img"` while `aria-label` is also present, and force-**expose**
    (`aria-hidden={false}` on an unnamed icon → no `aria-hidden`/`role`/name, still
    `focusable="false"`). Closes Issue 3.
- `AllIcons.stories.tsx` / `SacredGlyphs.stories.tsx` unchanged: both label their
  cells with visible text, so the icons being `aria-hidden` by default is correct
  there (no update needed).

## Deferred
None outside this directory. Cross-reference: this fix **resolves** the
IconButton audit's deferred "Icon `<svg>` not `aria-hidden` (Owner: Icons)" item
(`docs/a11y-audit/IconButton.md` Deferred §2) — an icon inside a labelled
IconButton is now `aria-hidden` by default (defense-in-depth; the button's
`aria-label` remains the accessible name).

### Design notes (in-scope, intentionally not changed)
- **`title` is not a typed prop on the icons.** React's `SVGProps<SVGSVGElement>`
  does not include `title`, so `aria-label`/`aria-labelledby` are the *typed*
  opt-in (fully sufficient for an accessible name); `title` is honoured at
  runtime (spread/JS consumers, tests) and renders a `<title>` child, but was not
  added to all 261 `<Name>IconProps` interfaces. Either name mechanism satisfies
  the contract, so the large 261-interface expansion was judged unwarranted.
- **`.svg { cursor: pointer }` kept.** Applying a pointer cursor to a
  decorative-by-default graphic is arguably misleading, but icons are
  predominantly rendered inside clickable controls where the affordance is
  desired, the value is inherited/overridable, and cursor style is not a WCAG
  conformance criterion. Changing it globally has broad blast radius across every
  consumer (ThothOS pins a published release) for no conformance gain, so it was
  left as-is.
