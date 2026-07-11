# DetailField — a11y audit (2026-07-11)

**Status:** FIXED (initial pass + adversarial-review fix pass)

**Component:** `src/components/DetailField/index.tsx` (+ `DetailField.module.css`,
`DetailField.stories.tsx`). Exports `DetailField` (default) and `DetailGrid`.

## APG pattern

DetailField / DetailGrid are **read-only display primitives**, not an interactive
WAI-ARIA APG widget. The applicable standard is the **HTML Description List**
structure (WCAG 1.3.1 Info and Relationships): a `DetailGrid` renders a `<dl>`
laid out via `FieldGrid`, and each `DetailField` is a `<dt>` (term) / `<dd>`
(description) couplet wrapped in a `<div>` — valid `<dl>` grouping content per the
HTML spec ("one or more `dt` followed by one or more `dd`, optionally wrapped in a
`div`"), verified at `index.tsx:81-97`. The group takes an accessible name via
`DetailGrid`'s `ariaLabel` (forwarded to the `<dl>` as `aria-label`,
`index.tsx:169`).

There are **no interactive elements** (no buttons, links, inputs), **no focusable
elements**, **no overlays**, and **no animations** in this component. That removes
whole checklist categories from scope: keyboard interaction, focus management /
`:focus-visible`, focus trapping, Escape handling, and `prefers-reduced-motion`
are all **N/A** (confirmed: the module CSS has zero `transition`/`animation`
declarations, so there is nothing to gate behind a reduced-motion query).

## Issues found

### 1. Hardcoded sacred colors with no theme adaptation — MODERATE
- **WCAG:** 1.4.3 Contrast (Minimum) (AA)
- **Where:** `DetailField.module.css` — `.label { color: var(--goobs-amber-a60) }`
  (line 39) and `.value { color: #ffffff }` (line 52); the component (`index.tsx`)
  emitted **no** `data-theme` attribute and exposed **no** `theme` prop, so these
  colors were fixed regardless of the surface the block was placed on.
- **Detail:** Every sibling display primitive (ListItemCard, Card, EmptyState) is
  theme-aware via a `theme` prop → `data-theme` attribute with
  `[data-theme='light']` / `[data-theme='dark']` overrides. DetailField had none.
  The gold-60% label + pure-white value clear ≥4.5:1 only on the near-black sacred
  backdrop. On a **light** surface the `#ffffff` value text renders **invisible**
  (white-on-white, ~1:1) and the gold-60% label collapses to ~1.2:1 — a hard 1.4.3
  failure with no way for a consumer to correct it (no prop, no CSS inheritance
  hook). The `css-design-tokens` branch notes had already flagged DetailField as an
  un-tokenized component needing exactly this.
- **Pattern:** `missing-theme-contrast-adaptation`
- **Status:** FIXED — added an additive `theme?: 'sacred' | 'light' | 'dark'` prop
  (exported type `DetailFieldTheme`, default `'sacred'`) to both `DetailField` and
  `DetailGrid`, emitted as `data-theme` on the couplet root (`index.tsx`, the
  `.field` div) and on the `<dl>` root, and threaded from a `DetailGrid`'s `fields`
  array into each generated `DetailField`. Added CSS overrides:
  `.field[data-theme='light'] .label, .grid[data-theme='light'] .label` →
  `var(--goobs-light-warn-text)` (dark amber, ~5:1 on white, keeps the eyebrow
  identity); `…light… .value` → `var(--goobs-light-text)` (#1f2937, ~15:1);
  `.field[data-theme='dark'] .value, .grid[data-theme='dark'] .value` →
  `var(--goobs-dark-text)` (#e2e8f0, ~11:1 on dark slate). Sacred stays the exact
  hardcoded default (zero visual change to the shipping surfaces). The
  DetailGrid-root selectors let a grid-level theme cascade to nested
  `DetailField` children (the escape-hatch path) without prop-drilling.
  Computed contrast for every theme/role now clears the 4.5:1 small-text bar.

### 2. Dark-theme label used a SEMI-TRANSPARENT token (backdrop-dependent contrast) — MODERATE
- **WCAG:** 1.4.3 Contrast (Minimum) (AA)
- **Where:** `DetailField.module.css` — the initial fix retargeted only the dark
  `.value` (lines 82-89) and deliberately LEFT the dark `.label` on the base
  `.label { color: var(--goobs-amber-a60) }` (line 39), i.e. `rgba(255,215,0,0.6)`.
- **Detail (adversarial-review catch that refutes issue 1's "every combination
  clears 4.5:1" claim):** `--goobs-amber-a60` is **semi-transparent**, so the
  label composites against whatever surface sits behind it and its effective
  contrast is backdrop-dependent. Composited over `--goobs-dark-surface` (#1e293b,
  the Themes-story surface) it is ~4.66:1 — a razor-thin pass — but composited over
  the **sibling** raised-card token `--goobs-dark-surface-raised` (#273746, the same
  palette's surface for raised cards) it falls to **~4.14:1**, FAILING the 4.5:1
  small-text bar. The light theme avoided this by using the OPAQUE
  `--goobs-light-warn-text` (#b45309); an opaque dark analogue
  `--goobs-dark-warn-text` (#fbbf24) already existed unused in `global.css:343`.
- **Pattern:** `semi-transparent-color-backdrop-dependent-contrast`
- **Status:** FIXED — added a `.field[data-theme='dark'] .label, .grid[data-theme='dark'] .label`
  override retargeting the dark label to `var(--goobs-dark-warn-text)`, mirroring
  the light theme's opaque treatment. The opaque token clears 4.5:1 on **every**
  dark surface in the palette with no backdrop dependency (~8.5:1 over #1e293b,
  ~7.1:1 over #273746). Removed the now-false trailing comment that claimed "dark
  theme keeps the gold-60% eyebrow — it clears 4.5:1". Sacred (the shipping default)
  is untouched.

## Hearing

No sound or media APIs are used. A grep of the component directory for
`Audio` / `AudioContext` / `<audio>` / `<video>` / `navigator.vibrate` returns
nothing. The component conveys no information by sound, and there is no media
playback needing captions or a transcript. All state (value emphasis via
`valueColor`, empty-row suppression via `hideWhenEmpty`) is visual + structural,
never audio. WCAG 1.2.x / 1.4.2 not applicable. No issue.

## Reading & screen reader

- **Semantic structure (1.3.1):** correct throughout — `<dl>` group, `<dt>` term,
  `<dd>` description, `<div>`-wrapped couplets are valid `<dl>` content
  (`index.tsx:81-97`, `141-176`). The `<dd>`'s UA `margin-inline` is reset
  (`.value { margin: 0 }`) so it doesn't visually mis-indent.
- **Accessible name (4.1.2):** the group is nameable via `DetailGrid ariaLabel`
  (`index.tsx:169`, exercised by the `getByRole`-reachable `dl` in the interaction
  tests). There are no interactive elements requiring their own names.
- **Color-alone (1.4.1):** `valueColor` (e.g. red `#EF4444` "Balance Due", green
  `#10B981` "Paid") is **redundant** emphasis — the meaning lives in the label +
  the value text itself ("$1,240.00", "Paid"), never in color alone. Not a 1.4.1
  violation; left as-is.
- **`valueColor` contrast (by design):** an arbitrary caller-supplied accent color
  can in principle fail contrast on a given surface, but it is an explicit consumer
  choice on a passthrough prop (inline `style={{ color }}`, `index.tsx`) and cannot
  be validated by a presentational library primitive. Documented, not enforced —
  the theme system (issue 1) governs the *default* colors, `valueColor` overrides
  them intentionally.
- **Standalone `<dt>`/`<dd>` (by design):** a bare `DetailField` used outside a
  `<dl>` emits `<dt>`/`<dd>` with no defined semantics. This is a documented
  consumer contract (the fileoverview + `DetailField` JSDoc state it must slot into
  a definition list; the `SingleField` story wraps it in `<dl>`). Not fixable
  without a breaking DOM/API change; left documented, mirroring the Chip
  ReactNode-label consumer-responsibility note.

## SEO semantics

goobs renders under Next.js SSR, so this markup is the crawled HTML. The couplet
uses real `<dl>`/`<dt>`/`<dd>` — the correct machine-readable term/description
relationship, not styled `<div>`s. Labels are `<dt>` **terms**, which is correct;
they are deliberately **not** headings (a field label is not an `<h1>-<h6>`), so no
`headingLevel` obligation applies. Values render directly in the couplet
(`{value}`), present in the SSR'd output — no client-only injection of primary
content. There are no links, so no `<a href>` / `linkComponent` obligation. No SEO
issue.

## Fixes applied

1. `index.tsx` — exported `DetailFieldTheme` union; added additive
   `theme?: DetailFieldTheme` (default `'sacred'`) to `DetailFieldProps` and
   `DetailGridProps`; emit `data-theme` on the `.field` couplet root and the `<dl>`
   root; thread the grid's theme into every `fields`-array `DetailField`.
2. `DetailField.module.css` — `[data-theme='light']` / `[data-theme='dark']`
   override blocks (scoped to both the field root and the grid root) retargeting
   label + value colors to existing `--goobs-{light,dark}-*` tokens for ≥4.5:1
   contrast; sacred left as the exact hardcoded default.

Commit `e9d012bc`. Per-file gates green: `bun lint:file` on `index.tsx` and
`DetailField.stories.tsx` (exit 0, 0 warnings). No `data-*`/`role`/`aria`
attribute was removed or renamed; the machine-test selector contract
(`data-detail-field`, `data-detail-label`, `data-detail-value`,
`data-detail-grid`) is preserved and `data-theme` is purely additive.

## Stories updated

`DetailField.stories.tsx` (goobs has no unit tests — the Storybook story +
Chromatic baseline is the only regression gate):

- **`Themes` (Theme/Sacred · Light · Dark)** — new visual story rendering the same
  `fields` set under all three themes, each on its own matching surface
  (`#0e0e0e` / `#ffffff` / `#1e293b`) so the Chromatic baseline captures the
  light/dark value text now being legible instead of invisible.
- **`ThemeInteractionTest` (Theme/Interaction Test)** — new play-function story
  asserting the `<dl>` carries `data-theme="light"`, that every `fields`-array
  couplet inherits that theme (not left sacred), and that the value text is still
  visible on the light surface. Pins issue 1's contract.

Review-fix pass (issue 2):

- **`Themes` (extended)** — added a fourth block rendering the dark theme on the
  raised-surface token `#273746` (`--goobs-dark-surface-raised`), the exact backdrop
  where the old semi-transparent label failed contrast, so the Chromatic baseline
  captures the opaque label staying legible there.
- **`DarkLabelContrast` (Theme/Dark Label Contrast (Raised Surface))** — new
  play-function story on the `#273746` raised surface asserting the dark `<dt>`
  label's computed color is the OPAQUE `rgb(251, 191, 36)` (#fbbf24), NOT the
  semi-transparent `rgba(255, 215, 0, 0.6)`. Fails against the pre-fix baseline
  (the translucent token), pinning issue 2's fix.

Second adversarial-review pass (coverage + DX):

### 3. Story-coverage gap — the grid-theme → CHILDREN cascade was unpinned — MINOR
- **WCAG:** 1.4.3 Contrast (Minimum) (AA) — regression coverage, not a live defect.
- **Where:** `DetailField.stories.tsx`; the CSS under test is the DetailGrid-root
  descendant selectors `DetailField.module.css:71-100`
  (`.grid[data-theme='light'] .label` / `.value`, and the dark analogues).
- **Detail:** The report's headline claim is that a DetailGrid-level `theme`
  cascades to nested `DetailField` **children** (the escape-hatch path) without
  prop-drilling, via the `.grid[data-theme=X] .label/.value` descendant selectors.
  Code traced functionally correct — a JSX child defaults to `data-theme='sacred'`
  (no sacred override block exists), and the `.grid[data-theme=X] .value`/`.label`
  rule (specificity 0,3,0) out-specifies the sacred base (0,1,0), so it wins with no
  conflicting rule. **But no story exercised that path.** Every themed story
  (`Themes`, `ThemeInteractionTest`, `DarkLabelContrast`) drives the `fields` array,
  where the theme is threaded into each child so the child independently carries
  `data-theme` and is styled by `.field[data-theme]` — the grid-descendant selectors
  are never the sole style source. `GridFromChildren` renders children but sets no
  theme. Net: the grid-descendant selectors could be deleted and zero stories would
  fail. In goobs (story + Chromatic baseline is the ONLY regression gate) the feature
  was unpinned.
- **Pattern:** `story-coverage-gap-unpinned-cascade`
- **Status:** FIXED — added **`GridThemeCascadeToChildren` (Theme/Grid Cascade To
  Children)**: two `DetailGrid`s (`theme="light"` and `theme="dark"`) populated with
  `DetailField` CHILDREN carrying no per-child theme, each on its matching surface
  (`#ffffff` / `#273746`). The play function asserts each child couplet is still
  `data-theme="sacred"` (proving the child does NOT carry the grid theme, so the
  grid-descendant selector is the sole style source) YET its computed label/value
  colors resolve to the themed tokens — light label `rgb(180, 83, 9)`
  (`--goobs-light-warn-text` #b45309) / value `rgb(31, 41, 55)`
  (`--goobs-light-text` #1f2937); dark label `rgb(251, 191, 36)`
  (`--goobs-dark-warn-text` #fbbf24) / value `rgb(226, 232, 240)`
  (`--goobs-dark-text` #e2e8f0). Deleting the `.grid[data-theme=X]` selectors now
  fails the test (the couplet would fall back to the sacred base color), so the
  cascade is pinned in the only regression gate goobs has.

### 4. Storybook Controls omitted the new `theme` prop (DX, not a11y) — MINOR
- **Where:** `DetailField.stories.tsx` — `meta.argTypes` listed
  `label/value/mono/valueColor/hideWhenEmpty` but not the additive `theme` prop, so
  the Controls panel on the default/`SingleField` story exposed no theme selector.
- **Detail:** Not an accessibility defect — a Storybook DX completeness gap. The
  `theme` prop was demonstrated by the `Themes` story but not interactively
  adjustable.
- **Pattern:** `argtypes-missing-new-prop`
- **Status:** FIXED — added
  `theme: { control: 'select', options: ['sacred', 'light', 'dark'] }` to
  `meta.argTypes`, so the Controls panel now exposes the theme selector on the
  single-field story. Purely a story/DX change; no rendered-DOM or API impact.

## Deferred

Both a11y contrast issues (issue 1 + the review's issue 2) were fully fixable
inside the owned DetailField directory — the `--goobs-{light,warn,dark}-*` tokens
already exist in `src/styles/global.css` (not edited). No shared util / FieldGrid /
Shell / barrel change was required (`data-theme` rides through `FieldGrid`'s
existing `restProps` spread, the same path the pre-existing `data-detail-grid`
attribute already used).

**Stale committed `index.d.ts` / `index.d.ts.map` (review finding, NOT an a11y
issue, NOT owner-editable):** `src/components/DetailField/index.d.ts` (+ `.map`),
dated May 30, predates the `theme` prop / `DetailFieldTheme` export and is now
stale. It is a build-generated declaration artifact — explicitly outside this
agent's ownership (the ownership rule forbids touching any `*.d.ts` / `*.d.ts.map`)
— and the review itself flags it as "out of a11y scope, flagged for completeness."
The current build (`tsc --noEmit && vite build`, per goobs.md §1) no longer emits
`.d.ts` files into `src/`, so these are orphaned leftovers from the pre-`ce86c83`
bare-`tsc` build. Low impact (consumers import the freshly-built `dist/`), but a
TS resolver that picked up this source-tree `.d.ts` over `index.tsx` would mis-type
the new prop. **Suggested change (for the owning/build agent):** delete the stale
`src/components/DetailField/index.d.ts` and `index.d.ts.map` (the vite build no
longer regenerates them in-tree). Recorded in `deferred`; left untouched here.

**Observation (not owned, not an a11y defect):** DetailField/DetailGrid emit their
bespoke `data-detail-*` selectors but not the universal `data-component="DetailField"`
attribute that the form-contract program adds to other components. This is a
test-selector-completeness gap, not an accessibility issue, and touching it would
race the form-contract migration — left alone.
