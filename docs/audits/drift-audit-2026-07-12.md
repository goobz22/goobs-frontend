# Systematic-Drift Audit — goobs-frontend

**Date:** 2026-07-12  ·  **Scope:** the whole component library (`src/**`)  ·  **Wall:** `bun run lint:drift`

This audit is the census + canon + unification record behind the **drift ratchet wall**. A
census-and-gate workflow measured 11 systematic-drift classes across the component source
(`ts` + `css` scope) and froze each one as a ratchet; a 12th ratchet (`story-jsdoc-missing`,
`stories` scope) rounds out the wall and pairs with the JSDoc backfill below. Every ratchet
holds green at baseline today (verification pass: typecheck ✅, build ✅, `lint:drift`
selftests + baselines ✅ across all 12 modules, 0 growth). **This workflow measures and gates
only — it made ZERO component/source edits.** Every actual *unification* named here is a
future campaign; the sections below tell an agent or the operator exactly which is safe to run
now and which needs a product/semver decision first.

---

## 1. The ratchet model

Each drift class is one concept spelled several rival ways across components (e.g. `onChange`
argument order, theme default literal, `ariaLabel` vs `'aria-label'`). Unlike an a11y defect,
the existing instances usually **can't be mass-fixed without breaking the public API** — but
drift *growth* is always preventable. So each class is a **ratchet**, wired into
`bun run lint:drift` (part of `lint:all`): a module's `measure()` enumerates every current
instance; a committed baseline JSON (`scripts/drift-lints/baselines/<name>.json`, a
`{ file: count }` map) **freezes today's drift**; the runner **FAILS the build when any file's
count grows or a new file appears**, printing the module's one-line `canon` so new code is
pushed onto the canonical form. A mandatory selftest (bad snippets must each flag ≥1, good must
each flag 0) blocks a broken detector from ever running. When a real unification *shrinks* a
class, the runner prints a tighten reminder and `bun scripts/lint-drift.ts --update` rewrites
the baselines down (a deliberate, reviewed commit) — the ratchet only ever tightens, never
loosens. Net effect: drift can only go **down**, and it goes down on purpose.

---

## 2. The 11 ratchets, per dimension

### Summary

| # | Ratchet | Scope | Instances | Files | Dominant form | Canon (new code) | Breaking to unify? | Track |
|---|---------|-------|-----------|-------|---------------|------------------|--------------------|-------|
| 1 | `onchange-signature-drift` | ts | 1 | 1 | value-first `(value)=>void` (~45/52) | event-first when an event is passed | **Yes** | Operator |
| 2 | `theme-default-resolution` | ts | 76 | 66 | `styles?.theme \|\| 'light'` (44) | `resolveTheme()` → `'sacred'` | **Yes** | Operator |
| 3 | `accessible-name-prop-spelling` | ts | 74 | 51 | camelCase `ariaLabel` (57/74) | camelCase `ariaLabel` family | **Yes** | Operator |
| 4 | `styles-key-synonym-drift` | ts | 3 | 3 | `transitionEasing` (14:3) | `transitionEasing` | **Yes** (via alias) | Operator |
| 5 | `component-classname-passthrough` | ts | 30 | 30 | no external `className` (30/55) | accept + merge `className` | No (additive) | Additive |
| 6 | `missing-uncontrolled-default` | ts | 27 | 27 | controlled-only (27/31) | add `defaultValue`/`defaultChecked` | No (additive) | Additive |
| 7 | `non-overridable-user-string` | ts | 26 | 10 | string threaded as a prop | user string = prop, default to today's literal | No (additive) | Additive |
| 8 | `css-px-font-size` | css | 61 | 24 | `rem` (190) | `rem` or `var(--goobs-text-*)` | No (mechanical) | Additive |
| 9 | `transition-all` | css | 47 | 21 | `transition: all` (43 + 4 tokens) | enumerate animated properties | No (mechanical) | Additive |
| 10 | `undocumented-public-props` | ts | 733 | 72 | per-member JSDoc (1507/2240) | `/** … */` on every member | No (additive) | Additive |
| 11 | `stateful-container-missing-diag` | ts | 3 | 3 | `emitDiag`-instrumented (~26) | emit `component.state`/`nav.change` | No (additive) | Additive |

*(12th ratchet on the wall: `story-jsdoc-missing`, `stories` scope — 552 undocumented story
exports across 68 files; folds into the JSDoc backfill campaign, §4.)*

---

### 1 · `onchange-signature-drift`  — argument order of `onChange`/`onSelectionChange`

| | |
|---|---|
| Instances / Files | **1 / 1** |
| Ratchet state | green, at baseline |
| Breaking to unify | **Yes** (positional public-API change) |
| Commit | `5c19b256` |

**Minority breakdown**

| Form | Count | Example |
|---|---|---|
| value-first `(value) => void` — dominant, sanctioned | ~45 / ~52 | the entire Field family (`Text`/`Password`/`USD`/`Slider`/…), `Checkbox(checked)`, `Tabs(index)`, DataGrid `onSelectionChange` |
| event-first `(event, value) => void` — sanctioned MUI-parity minority | 5 | `Pagination.onChange: (event, page) => void`; Accordion, Button/ButtonGroup, ToggleButton |
| event-only `(event) => void` — sanctioned, mirrors native `<input>` | 1 | `RadioGroup.onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void` |
| **reversed `(value, event) => void` — THE DRIFT** | **1** | `Card` `CardSelectionCheckboxProps.onChange: (next: boolean, event) => void` (`index.tsx:657`) |

**Canon + evidence.** *If a React event is passed, it comes first* — `(event) => void` or
`(event, value) => void` (the MUI/DOM standard, followed by RadioGroup/Accordion/Button/
ToggleButton/Pagination); with no event, the value(s) pass directly — `(value) => void` (the
dominant goobs Field convention). Both sanctioned families put the event first, which isolates
exactly one aberrant shape: a boolean value placed *before* a `ChangeEvent`. That single
reversed signature is the frozen instance.

---

### 2 · `theme-default-resolution`  — the per-component default theme literal

| | |
|---|---|
| Instances / Files | **76 / 66** (67 baseline keys — key is `path::literal`) |
| Ratchet state | green, at baseline |
| Breaking to unify | **Yes** (default surface changes light → sacred) |
| Commit | `db20faf1` |

**Minority breakdown**

| Form | Count | Example |
|---|---|---|
| `styles?.theme \|\| 'light'` — numerically dominant | 44 | `Alert/index.tsx:279 const containerTheme = styles?.theme \|\| 'light'` |
| `styles?.theme ?? / \|\| 'sacred'` — **recommended unification target** | 30 | `Field/Shell/index.tsx:351 styles?.theme ?? 'sacred'` (shared field chrome); Card, Button, Chip |
| `styles?.theme \|\| 'dark'` — dark-by-design, exempt from unification | 2 | `CodeCopy/index.tsx:89`; `Switch/index.tsx:94` |

**Canon + evidence.** Declare a component's theme default **once** via a shared
`resolveTheme`/`DEFAULT_THEME` helper; do not add a new root literal or flip an existing frozen
default. The unification target is **`'sacred'`** — a *minority* count (30 < 44 `'light'`)
chosen against raw dominance for three architectural reasons: (1) the CSS-modules system makes
`'sacred'` the hard-coded base class with `[data-theme='light'|'dark']` layered as overrides,
so a component defaulting to `'light'` is drifting from its own stylesheet; (2) `Field/Shell` —
the chrome all 34 inputs compose on — resolves `?? 'sacred'`; (3) the primary branded surfaces
(Card, Button, Chip, Select, Tabs, Stepper, every Dropdown/IPAM field) already resolve
`'sacred'`, while the `'light'` plurality is inflated by internal sub-components (Fade/Zoom/
Slide wrappers, CTE/DataGrid-table/ProjectBoard internals, List's 4 sub-roots) that inherit
context rather than stand alone. The per-literal baseline key makes a light→sacred flip read as
old-key-shrinks + new-key-grows, so the ratchet catches a *changed* default, not just a new one.

---

### 3 · `accessible-name-prop-spelling`  — `ariaLabel` vs `'aria-label'`

| | |
|---|---|
| Instances / Files | **74 / 51** |
| Ratchet state | green, at baseline |
| Breaking to unify | **Yes** (rename/deprecate public props) |
| Commit | `8ae58bd7` |

**Minority breakdown**

| Form | Count | Example |
|---|---|---|
| camelCase `ariaLabel` family — dominant (~77%) | 57 / 74 | `Field/Text/index.tsx:47 ariaLabel?: string`; `Dialog/index.tsx:109` |
| native quoted-kebab `'aria-label'` — DOM-passthrough / prop-bag; sanctioned for native-spread bags, **not** the default for new props | 17 | `Button/index.tsx:31 'aria-label'?: string`; `Icons/iconA11y.ts:31` (svgA11y bag); `Field/Shell/index.tsx:70` (inputAriaProps bag) |
| casing sub-drift within camelCase: uppercase `-By` | 10 | `Dialog/index.tsx:98 ariaLabelledBy?`; `Drawer/index.tsx:129 ariaDescribedBy?` |
| casing sub-drift within camelCase: lowercase `-by` (native React casing) | 3 | `Field/Text/index.tsx:54 ariaLabelledby?`; `Field/Password/index.tsx:44` |

**Canon + evidence.** Use camelCase for a goobs-facing accessible-name prop
(`ariaLabel`/`ariaLabelledby`/`ariaDescribedby`). camelCase wins 57:17 (~77%) — goobs
deliberately exposes `ariaLabel` as its own documentable, defaultable, `getByRole`-name-testable
prop rather than a raw DOM attribute (the 2026-07 a11y campaign standardized on this). Quoted
kebab stays only where the component spreads a prop bag verbatim onto a native element.

---

### 4 · `styles-key-synonym-drift`  — synonymous `*Styles` keys for one visual concept

| | |
|---|---|
| Instances / Files | **3 / 3** |
| Ratchet state | green, at baseline |
| Breaking to unify | **Yes** (public `*Styles` key — do non-breaking via alias) |
| Commit | `3adfbcb1` |

**Minority breakdown**

| Form | Count | Example |
|---|---|---|
| `transitionEasing` — dominant, 14:3 | 14 | Alert, AppBar, DataGrid, Field/Shell, Popover, Tooltip, TreeView, … |
| `transitionTimingFunction` — **the drift** | **3** | `Fade/index.tsx:33`; `Slide/index.tsx:39`; `Zoom/index.tsx:90` |

**Canon + evidence.** Spell the CSS timing-function key `transitionEasing`. It outnumbers
`transitionTimingFunction` **14:3 (4.67:1)**, clearing the ≥3:1 dominance bar; both map to the
identical `transition-timing-function` with no behavioural difference (pure spelling drift), and
`easing` is the shorter, React-animation-ecosystem term (framer-motion / react-spring). Only the
three transition-wrapper components (Fade/Slide/Zoom) drift. *Two further concepts were measured
but deliberately NOT gated (below the ≥3:1 bar / ambiguous): content color `color` (9) vs
`textColor` (4) = 2.25:1; background fill `…BackgroundColor` (~42) vs `…Background` (~16) = ~2.6:1
and ambiguous because `background` legitimately carries gradients.*

---

### 5 · `component-classname-passthrough`  — top-level components that reject an external `className`

| | |
|---|---|
| Instances / Files | **30 / 30** (of 55 top-level components) |
| Ratchet state | green, at baseline |
| Breaking to unify | No — purely additive |
| Commit | `659e9d38` |

**Minority breakdown (the compliant forms — the canon)**

| Form | Count | Example |
|---|---|---|
| `extends React.HTMLAttributes<T>` (brings `className?`/`style?` + `...rest` onto root) — preferred accept-form | 18 | `Card` (`CardProps extends React.HTMLAttributes<HTMLDivElement>`); Paper, Divider, Panel |
| explicit `className?: string` merged via the AppBar `mergeClassNames` idiom | 6 | `AppBar/index.tsx` (`mergeClassNames(cssStyles.container, className)`); Markdown, Form, TransferList, WorkspaceFilterShell |
| `style?: React.CSSProperties` only (compound sub-part) | 1 | `Tabs` (`TabPanelProps.style`; primary `TabsProps` has neither) |

**Canon + evidence.** Every top-level component accepts and merges an external `className` (via
`extends React.HTMLAttributes<T>` or an explicit `className?` merged with `mergeClassNames`).
Without it, `<Chip className="mt-2">` type-errors or no-ops — passthrough is the universal
design-system composition convention. 25 of 55 components already accept it, so the canon is
additive. The 30 that lack it (Accordion, Alert, Badge, Breadcrumb, Chip, DataGrid, Dialog,
Drawer, EmptyState, List, Pagination, Popover, ProgressBar, ProjectBoard, RadioGroup, Snackbar,
Stepper, Table, ToggleButton, Toolbar, Tooltip, TreeView, …) rely on a bespoke `styles?: XStyles`
theming object, which is config — **not** passthrough.

---

### 6 · `missing-uncontrolled-default`  — controlled input Props with no `defaultValue`/`defaultChecked`

| | |
|---|---|
| Instances / Files | **27 / 27** (of 31 stateful-input Props) |
| Ratchet state | green, at baseline |
| Breaking to unify | No — purely additive |
| Commit | `9674c085` |

**Minority breakdown**

| Form | Count | Example |
|---|---|---|
| declares `default*` alongside `value`/`checked` + `onChange` — the canonical counterpart (NOT drift) | 4 | `CheckboxProps→defaultChecked`; `DropdownProps`/`SearchableSimpleProps`/`RadioGroupProps→defaultValue` |
| declares `value`/`checked` but no literal `onChange` → display-only, correctly excluded | 9 | ButtonProps, CardMetricProps, DetailFieldProps, MoneyTextProps, ProgressBarProps |
| declares handlers but no literal `onChange` — ambiguous, deliberately under-measured | 3 | FileDropzoneProps, QRCodeProps, ToggleButtonProps (individual) |

**Canon + evidence.** A stateful input Props that declares `value`/`checked` + `onChange` must
also declare the matching `defaultValue`/`defaultChecked` — React's controlled-input triad, which
native React DOM, MUI, Radix, and React-Aria all ship. This is the minority 4-exemplar form new
code must follow; the 27 instances (each in its own file, so the ratchet only holds growth at
zero) force full controlled usage with `useState` boilerplate. The fix is additive.

---

### 7 · `non-overridable-user-string`  — baked-in user-visible copy with no override prop

| | |
|---|---|
| Instances / Files | **26 / 10** |
| Ratchet state | green, at baseline |
| Breaking to unify | No — purely additive |

**Dominant vs drift.** The dominant, compliant form is a user-visible string **threaded through
Props** with today's text as the default (every Field leaf that exposes `placeholder`/`ariaLabel`;
Markdown's `data-testid`; Search's `placeholder`). The drift is a string a consumer cannot
localize, rebrand, or right-size — two shapes: (1) a bare-literal `placeholder="…"` in a file
whose Props declare no `placeholder` prop; (2) empty/status/error copy rendered as bare JSX text
(`<div className={s.emptyState}>No options found</div>`). Concentrated in the Dropdown family and
ProjectBoard forms — `ProjectBoard/forms/ShowTask/inline.tsx` alone carries 12 of the 26.

**Canon + evidence.** Every user-visible string is a prop defaulting to today's literal —
`placeholder={placeholder ?? 'Search…'}`, `emptyLabel = 'No options found'`. Establishes the
same additive-prop pattern the aria-label campaign used; makes the default free and the override
possible.

---

### 8 · `css-px-font-size`  — `font-size` set to a raw px literal

| | |
|---|---|
| Instances / Files | **61 / 24** |
| Ratchet state | green, at baseline |
| Breaking to unify | No — mechanical px→rem at equal size (Chromatic visual review) |

**Census (416 `font-size` declarations across 94 CSS files)**

| Form | Count | Example |
|---|---|---|
| `rem` — single dominant form | 190 | `font-size: 0.8125rem` |
| `var(--goobs-text-*` / component token) | 112 | central type scale (`--goobs-text-xs … 3xl`, 68 decls) |
| **raw px literal — THE DRIFT** | **61** | `DataGrid.module.css: font-size: 11px` (12 in this file) |
| `clamp()` responsive (40 rem-anchored + 2 px-anchored) | 42 | `Card.module.css` |
| `em` | 5 | `DetailField.module.css: clamp(0.65em, 1.5vw, 0.7em)` |
| global keyword (inherit/initial) | 4 | |

**Canon + evidence.** `font-size` must be `rem` (scales with the reader's browser text-size
setting — WCAG 1.4.4 Resize Text) or a central `--goobs-text-*` token, never a raw px literal.
`rem` beats raw px 3:1 (scalable + tokenized forms beat it ~4.8:1). The tokens are px-valued
*today*, which is exactly why the indirection matters — a raw literal forecloses a future
one-edit px→rem migration in `global.css`.

---

### 9 · `transition-all`  — animating every property instead of an explicit list

| | |
|---|---|
| Instances / Files | **47 / 21** |
| Ratchet state | green, at baseline |
| Breaking to unify | No — mechanical (enumerate animated properties) |

**Minority breakdown**

| Form | Count | Example |
|---|---|---|
| `transition: all …` raw declarations — **the drift** | 43 | across the `.module.css` files |
| `--goobs-transition-{fast,medium,slow,premium}: all …` token definitions (measured once at the definition, not at ~80 `var()` usages) | 4 | `src/styles/global.css` |

**Canon + evidence.** Transition an explicit property list
(`transition: background-color 0.2s ease, box-shadow 0.2s ease` / `transition-property: …`),
never `all`. `all` layout-thrashes on the main thread when a geometric property mutates, silently
animates any property added later, and defeats `prefers-reduced-motion` precision (you cannot keep
a colour fade while killing a layout animation when the target is `all`). Canon picked by
principle (MDN/CSS-WG performance + WCAG 2.3.3), not by the 43-vs-4 count.

---

### 10 · `undocumented-public-props`  — public prop members with no JSDoc

| | |
|---|---|
| Instances / Files | **733 / 72** |
| Ratchet state | green, at baseline |
| Breaking to unify | No — additive comments (no type/runtime change) |
| Commit | `de07d8fb` (+ hook auto-save `7047dca7`) |

**Dominant vs drift.** 1507 of 2240 top-level `*Props`/`*Styles` members (~67%) already carry a
`/** … */` block immediately above them — that is the canon. The undocumented ~33% (733 across 72
files) is the drift; two shapes: a bare member (`AccordionProps.summary`) and a member whose only
preceding comment is a non-doc `//` section comment (`TreeViewStyles.theme` under
`// Theme selection`). Densest files: TreeView (93), ComplexTextEditor/theme.ts (64),
ProjectBoard/forms/ShowTask/inline.tsx (51), Field/Shell/types.ts (46).

**Canon + evidence.** Every public prop member carries a `/** … */` JSDoc block. goobs publishes
no prose docs and no generated doc site, so the JSDoc surfaced in editor IntelliSense/hover **is**
the only documentation a consumer reads; fully-documented exemplars (Accordion, Alert, AppBar,
Avatar, Badge) set the standard.

---

### 11 · `stateful-container-missing-diag`  — the most stateful containers emit no diagnostics

| | |
|---|---|
| Instances / Files | **3 / 3** |
| Ratchet state | green, at baseline |
| Breaking to unify | No — additive instrumentation |

**Dominant vs drift.** ~26 components already honour the dependency-free diagnostic seam
(`emitDiag`, `src/utils/diag.ts`) — Accordion, Dialog, Drawer, Popover, Snackbar, Tabs,
Pagination, Stepper, Tooltip, BigCalendar, Form — emitting `component.state`/`nav.change`. The
coverage is **inverted**: the three most stateful containers are dark to the bus —
**DataGrid** (60 `useState`: sort/filter/page/selection/inline-edit/column-reorder),
**ProjectBoard** (88: task-select/search/status-filter/card-drag), **TreeView** (7:
expand/collapse/select/focus). Instance criterion: `stateHooks ≥ 4 AND !hasEmitDiag AND
!pureInput` (the `pureInput` filter deliberately excludes heavily-stateful field components like
ComplexTextEditor/TransferList that instrument via their field-binding beacon).

**Canon + evidence.** A stateful container emits `component.state`/`nav.change` on its primary
transitions so a buyer's host test suite can observe them without mocking.

---

## 3. OPERATOR DECISIONS — unifications that need a product / semver call

These four ratchets **cannot be unified additively** — each changes public API or the default
visual identity. They belong in a coordinated release, not the measure-and-gate workflow. The
ratchet freezes each so it can't grow while the decision is pending.

### D1 — Theme default target (`theme-default-resolution`, 76 instances / 66 files) — PRODUCT + SEMVER

**The call:** adopt **`'sacred'` as the library-wide default theme** (recommended) — or ratify
`'light'` and re-point the canon. Choosing sacred is a *visible* change: the 44 `'light'`-
defaulting surfaces (Alert, Badge, Avatar, AppBar, Checkbox, RadioGroup, Tooltip, ProgressBar,
List, Toolbar, the CTE/DataGrid-table/ProjectBoard internals) render sacred when a consumer passes
no `theme` prop.

**Unify plan.** (1) Land a shared `DEFAULT_THEME = 'sacred'` + `resolveTheme(styles?.theme)`
helper (`src/styles/theme.ts`) with **no** behaviour change (both defaults still explicit).
(2) Flip minority→canon file-by-file, each flip re-pointing its ratchet key `path::light` →
`path::sacred` via a reviewed `bun scripts/lint-drift.ts --update` commit. (3) Chromatic
visual-parity review per flipped component (goobs has no unit tests — the story baseline **is** the
regression gate). (4) Operator sign-off on the sacred-everywhere visual identity. `CodeCopy` and
`Switch` stay `'dark'` (intentional; exempt from unification but still frozen).

### D2 — `onChange` canon adoption (`onchange-signature-drift`, 1 instance) — SEMVER (small blast radius)

**The call:** flip the single reversed signature to the event-first composite form.

**Unify plan.** Change `Card` `CardSelectionCheckboxProps.onChange` from
`(next: boolean, event: React.ChangeEvent<HTMLInputElement>) => void` to
`(event: React.ChangeEvent<HTMLInputElement>, next: boolean) => void` (event-first is the natural
target — the callback deliberately exposes the event for `stopPropagation`, i.e. it mirrors the
Checkbox/MUI `onChange`, not a bare Field value callback). Update the Card-internal callsite and
every consumer of `CardSelectionCheckboxProps` (search `onChange={(` around Card selection usage in
goobs stories + downstream repos), then typecheck/lint/build + Chromatic. Consumers destructure the
args positionally, so this is a breaking change → coordinated release.

### D3 — Accessible-name spelling (`accessible-name-prop-spelling`, 74 / 51) — SEMVER

Two sub-calls, both breaking: **(a)** for the genuinely consumer-facing kebab props (Button,
IconButton, Breadcrumb, ConfirmationCodeInput, ProgressBar, Tooltip, ToggleButton), add a camelCase
`ariaLabel`/`ariaLabelledby` alias that maps to the kebab attribute internally, deprecate the kebab
member, remove it on a major bump. **Do NOT** rename the internal native-spread bags (Icons
svgA11y, Field/Shell inputAriaProps, internal FC button types in Pagination/TransferList/
ToggleButton) — they spread verbatim onto native elements and must stay kebab. **(b)** Resolve the
camelCase casing sub-drift: pick lowercase `ariaLabelledby`/`ariaDescribedby` (native React casing,
matches Field/Shell + Pagination which already carry both spellings as migration exemplars) over
uppercase `-By`. Deprecation window + changelog + ThothOS migration required.

### D4 — Semver-major grouping (`styles-key-synonym-drift`, 3 instances) — SEMVER

Group the public `*Styles` key rename with D3 into one major bump so downstream migrates once.
Rename `transitionTimingFunction` → `transitionEasing` in `FadeStyles`/`SlideStyles`/`ZoomStyles`
**non-breaking**: add `transitionEasing`, keep `transitionTimingFunction` as a deprecated alias
(component reads `styles.transitionEasing ?? styles.transitionTimingFunction`) for one release, then
drop the alias and tighten the baseline to 0. The two below-threshold synonym concepts (`textColor`
vs `color`; `…Background` vs `…BackgroundColor`) stay measured-but-ungated until the team picks a
form, then extend the canon and re-baseline.

---

## 4. ADDITIVE CAMPAIGNS — safe sweeps an agent can run next

Every campaign below is **non-breaking** — it only widens Props with optional members, adds
comments, or swaps a CSS value for an equal-size scalable one. No release gate; each can start
immediately, and each ratchet tightens toward 0 with `bun scripts/lint-drift.ts --update` as its
count drops. Listed in leverage order (breadth × consumer value ÷ risk).

1. **JSDoc backfill — 1,285 members/stories (highest breadth, zero risk).**
   `undocumented-public-props` (733 members / 72 files) + `story-jsdoc-missing` (552 story exports
   / 68 files). Pure additive `/** … */` blocks — no type, runtime, or API change. Drive file-by-
   file, highest-count first: TreeView (93), ComplexTextEditor/theme.ts (64),
   ProjectBoard/forms/ShowTask/inline.tsx (51), Field/Shell/types.ts (46); borrow phrasing from the
   documented exemplars (AlertStyles for style members, Accordion for Props, Badge for stories).
   This is the single largest hardening of the library's *only* consumer-facing documentation
   (IntelliSense hover) and the Chromatic reviewer's story labels.

2. **`className` passthrough — 30 components (highest per-instance value).**
   For each of the 30, add passthrough with a pattern already proven in-repo: preferred
   `extends React.HTMLAttributes<HTMLXElement>` + spread `...rest` onto the root (18 components
   already do this); where a bespoke `styles?: XStyles` or non-DOM root makes extending awkward, add
   `className?: string` (+ optional `style?`) merged with `mergeClassNames(cssStyles.root, className)`
   (6 components already do this). All optional → every call site keeps compiling. Unblocks consumer
   composition (positioning/spacing without forking a component).

3. **`defaultValue` / `defaultChecked` counterparts — 27 Props.**
   Add an optional `defaultValue?`/`defaultChecked?` member to each of the 27 controlled-only Props
   and thread it into the component's initial state as the uncontrolled fallback (used when the
   controlled prop is undefined). Prefer routing input leaves through a single FieldShell/
   `useFieldBinding` path that natively accepts `default*` so the shape becomes structurally
   guaranteed. Removes `useState` boilerplate for fire-and-forget consumers.

4. **String overrides — 26 strings / 10 files.**
   Add an optional prop for each baked-in user-visible string, defaulting to today's literal
   (`placeholder={placeholder ?? 'Search…'}`, `emptyLabel = 'No options found'`). Start with
   `ProjectBoard/forms/ShowTask/inline.tsx` (12 of 26) and the Dropdown family. Enables
   localization / rebrand / context-fit with no behaviour change.

5. **`css-px-font-size` sweep — 61 declarations / 24 files (a11y win; needs Chromatic).**
   Mechanical px→rem at equal computed size (13px → 0.8125rem at the 16px base), or route through
   `var(--goobs-text-*)` where a scale step fits. Restores WCAG 1.4.4 text-scaling. Densest:
   DataGrid.module.css (12). Because it is a CSS value change, gate each file on Chromatic
   visual-parity — the sizes are identical at default zoom, so diffs should be empty.

6. **`transition-all` sweep — 47 declarations / 21 files (perf + reduced-motion).**
   Replace `transition: all …` with an enumerated property list (ideally compositor-only
   transform/opacity) at each of the 43 raw sites; redefine the 4 `--goobs-transition-*` tokens to
   name their properties (or split into per-property tokens) so the ~80 `var()` consumers inherit
   the fix. Mechanical, no visual change when done right.

7. **Diag instrumentation — 3 containers (small count, high observability value).**
   Add `emitDiag('component.state', …)` / `emitDiag('nav.change', …)` to the primary transitions of
   DataGrid (sort/filter/page/selection), ProjectBoard (task-select/status-filter/card-drag), and
   TreeView (expand/collapse/select). Unlocks host-suite observability of the three most stateful
   containers without mocking. Tighten the ratchet to 0 once all three are instrumented.
