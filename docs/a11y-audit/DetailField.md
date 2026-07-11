# DetailField — a11y audit (2026-07-11)

**Status:** FIXED

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

## Deferred

None. The single issue was fully fixable inside the owned DetailField directory —
the `--goobs-{light,warn,dark}-text` tokens already exist in `src/styles/global.css`
(not edited). No shared util / FieldGrid / Shell / barrel change was required
(`data-theme` rides through `FieldGrid`'s existing `restProps` spread, the same
path the pre-existing `data-detail-grid` attribute already used).

**Observation (not owned, not an a11y defect):** DetailField/DetailGrid emit their
bespoke `data-detail-*` selectors but not the universal `data-component="DetailField"`
attribute that the form-contract program adds to other components. This is a
test-selector-completeness gap, not an accessibility issue, and touching it would
race the form-contract migration — left alone.
