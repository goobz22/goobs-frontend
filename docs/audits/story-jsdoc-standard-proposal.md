# goobs-frontend — Story + JSDoc Canonical Standard (Proposal)

**Date:** 2026-07-01
**Status:** PROPOSAL — companion to `docs/audits/story-jsdoc-audit-2026-07-01.md` (cited below as "audit §N")
**Audience:** any contributor or agent writing a story or documenting a component. Follow this document verbatim; every rule cites the audit evidence that motivated it and the repo file it was synthesized from.

The repo's contract is "no unit tests — stories + Chromatic ARE the regression net" (`scripts/test-impact-map.ts:5-9`). This standard exists so that net is uniform, truthful, and machine-enforceable. Three principles run through everything below:

1. **A story is a claim.** If the story name, JSDoc, or args say a thing happens, the rendered snapshot must show that thing happening (kills audit §6-B).
2. **One fact, one home.** A prop is documented once — on its interface, where react-docgen-typescript reads it — not re-typed into argTypes, banners, or READMEs (kills audit §6-D/§5.2 drift).
3. **Every rule here has a gate.** If a rule in §1/§2 has no enforcement hook in §4, it will rot exactly like the last convention did (audit §7: every deviation class exists because nothing fires).

---

## 1. THE STORY TEMPLATE

### 1.1 Decisions, one per drifting dimension

| Dimension | Audit evidence of drift | **Decision** | Why this variant (not just majority) |
|---|---|---|---|
| **File naming** | 60 lowercase / 25 PascalCase / 3 camelCase; mixed *within* Button and Field; 3 basename mismatches (`editor.stories.tsx`, `codeinput.stories.tsx`, two different `Address.stories.tsx`) — audit §6-J | **`<ComponentName>.stories.tsx`, PascalCase, basename === the default-exported component's name, verbatim.** One file per exported component. | Lowercase is the majority (60) but it is the *worse* argument: it cannot encode word boundaries (`bigcalendar`, `pricingtable`), and it is exactly the convention that produced all three basename mismatches — "lowercase something related" is unfalsifiable. `ComponentName.stories.tsx` is mechanically checkable (basename must equal the component symbol), matches the directory name (`src/components/Badge/`), and matches the sibling convention that already won inside the same dirs: the CSS modules are PascalCase (`Badge.module.css`, `Switch.module.css`, `FieldShell.module.css`). One rule kills both the casing split and the mismatch class. ⚠️ Windows/macOS are case-insensitive: renames must be two-step (`git mv badge.stories.tsx tmp && git mv tmp Badge.stories.tsx`). |
| **meta.title** | 83 `Components/*`, 3 `Primitives/*`, 1 `Icons/`, 1 `ProjectBoard/Board`; Metric documents MetricsAccordion under two flat titles (duplicate Chromatic baselines); Field-tree orphans — audit §6-J | **`Components/<path mirroring src/components>`**, exactly one meta per component, titles nest where the filesystem nests: `Components/Metric/Accordion`, `Components/Field/Dropdown/SearchableSimple`. No `Primitives/`, no bare `Icons/` (→ `Components/Icons`). No two metas may share a title. | `Components/*` is both the majority *and* the better argument: the `Primitives/` split is already incoherent (EmptyState/FileDropzone/ListItemCard are "Primitives" while the equivalent DetailField/Panel/FieldGrid are "Components" — audit §6-J), so the taxonomy carries no information. Mirroring the filesystem makes the title derivable — and therefore lintable. Nesting fixes the Metric duplicate-baseline bug structurally. |
| **Story `name:` grouping** | ~249 slash-grouped `name:` overrides are documented house style; flagged only where they pretend to nest — audit §6-J | **Keep** slash-grouped names from this closed set of group prefixes: `Themes/`, `States/`, `Variants/`, `Position/`, `Colors/`, `Sizes/`, `Use Cases/`, `Composition/`, `Interaction/`, `Edge Cases/`. Know that they render as **flat labels**, not folders — real hierarchy belongs in `title`. | Established house style with real navigational value (`badge.stories.tsx:52,79,107`); the only failure mode found was authors *believing* they nest. A closed prefix set makes drift greppable. |
| **autodocs tag** | Redundant per-meta tag in 55/88 files, one additionally misplaced inside `parameters` (`metric.stories.tsx:70`); actively propagating (12 of the 13 newest files) — audit §6-I, P3 | **NEVER write `tags: ['autodocs']` in a story file.** The single global tag at `.storybook/preview.tsx:18` is the only one, and it only means anything once `@storybook/addon-docs` is installed (audit P1-1). | Zero information at meta level; the misplaced-inside-`parameters` variant proves copy-paste propagation. Grep guard in §4.3. |
| **`@fileoverview` story header** | Present in most files, absent in 13 — audit §3 FO column | **Required** on every `.stories.tsx`: what the file pins, and the sentence "These stories are the `<X>` regression spec — goobs has no unit tests." | The Badge header (`badge.stories.tsx:1-4`) is the pattern; the trailing sentence encodes the repo contract where the next contributor will actually read it. |
| **Per-story JSDoc** | all 19 / some 11 / none 28 dirs; Tabs/Toolbar/TransferList have "JSDoc" that is contentless numbered labels (`1) Light Theme Variants`) — audit §3, footnotes | **Required on every exported story**: ≥1 sentence stating the *observable state the snapshot pins* ("Badge anchored bottom-left with content '12'"), never a restatement of the story name and never a bare number. | This line is what a Chromatic reviewer reads to decide whether a diff is a regression. Contentless labels are worse than nothing — they signal a doc that lies. Badge (`badge.stories.tsx:50,77,105`) is the pattern. |
| **argTypes** | full 8 / partial 40 / none 10; Controls panels advertise dead knobs in ~18 dirs (audit §6-H); descriptions duplicated between argTypes and props JSDoc (Badge) | **argTypes configure controls only** — control type, `control: false`, `table.category`, `action:`. **They do NOT carry `description`.** Prop descriptions live once, on the props interface (§2.2), and react-docgen-typescript fills the docs table from there. A story that cannot honor a control (render-only closure state) must set `control: false` on the args it ignores, or use `args` + component-driven state so the control works. | One-fact-one-home: Badge currently maintains descriptions in two places (`badge.stories.tsx:14-26` duplicating `index.tsx`); Switch already does it right — control config only, `table: { category: 'Styling' }` (`switch.stories.tsx:14-24`). Docgen makes the duplication strictly redundant once P1-1 lands. |
| **Theme stories** | 20/58 dirs partial; **6 dirs have no real sacred baseline despite sacred being the repo default**; Snackbar's 12 theme stories set no theme; theme backdrops faked with hardcoded hexes — audit §6-F, §6-B, footnotes | **Every themable component ships exactly three dedicated stories — `Themes/Sacred`, `Themes/Light`, `Themes/Dark` — that (a) pass the component's real theme prop (`styles: { theme: 'x' }`) and (b) pin the matching canvas via `globals` (§1.2 decorator), never via `parameters.backgrounds.default` (dead SB8 API, audit P1-2) and never via a hand-painted hex wrapper (the Paper `#1f2937` fake).** Components whose theme is sacred-only by design (SacredGlyphFrame) ship the sacred story plus a JSDoc note saying so. | Sacred is the library's default and its most complex rendering (glyphs, shimmer, gold alpha ladder) — it is exactly the surface Chromatic must own. The three-story shape is already the plurality pattern (38 dirs nominally full); the standard fixes the *mechanism*, which was dead in all 51 files that used `backgrounds.default`. |
| **Play functions** | 40 plays / 28 files, none executed by any runner; several assertion-free; `window.alert` in 5 dirs wedges any future runner — audit §6-G, P2-1 | **Required** for any component with an interactive contract a static snapshot cannot pin (open/close, keyboard nav, value entry, form binding, dismissal). Every play **must** import `expect` from `storybook/test` and make ≥1 assertion. Callbacks use `fn()` from `storybook/test` (assertable spies) — **`window.alert`/`confirm`/`prompt` are banned in story code.** Interaction stories live under `name: 'Interaction/…'`. | Alert's play (`alert.stories.tsx:224-237`) is the house pattern — visible-assert, act, assert; Snackbar/TransferList/Tabs are the anti-pattern (click, assert nothing). The alert() ban is a precondition for ever wiring a runner (§4.5). |
| **Decorator / layout** | Badge decorator + `layout: 'centered'` house style; theme backdrops faked in decorators; Markdown decorator hexes drift from tokens — audit §3, §6-K | `parameters: { layout: 'centered' }` for atoms, `'padded'` for wide composites (DataGrid, Form, ProjectBoard). Meta-level decorators only for *spacing/anchoring context* (the Badge pattern, `badge.stories.tsx:32-40`) — never for theme backdrops (that is the global decorator's job) and never re-implementing component CSS. | Splits the two jobs the audit found conflated: layout chrome (per-meta, fine) vs theme surface (global, was broken). |
| **Inline styles in demos** | Story-only inline styles are documented house policy (~1009 tolerated); but hand-picked hexes silently diverge from token retunes under Chromatic — audit §6-K | Inline styles in stories stay **allowed** for demo scaffolding, with one tightening: anything representing a *themed surface or themed text* uses `var(--goobs-*)` tokens (`--goobs-sacred-surface`, `--goobs-light-text`, `--goobs-gold-a30`…), not literals like `#FFD700`/`#1f2937`. Layout numbers (widths, gaps) may stay literal. | Preserves the ratified policy while closing the one real failure mode: a token retune should move the story baselines with it, not leave fossilized hexes. |

### 1.2 Preconditions this template assumes (the audit's P1 re-baseline, one commit)

The exemplar below only works after the setup fixes land together (audit §2, appendix step 1):

```tsx
// .storybook/preview.tsx  (target state)
import type { Preview } from '@storybook/react'
import React from 'react'
import '../src/styles/global.css' // --goobs-* tokens (already present)
import '../fonts/goobs-fonts.css' // P1-3: Cinzel/Inter actually load

const preview: Preview = {
  parameters: {
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/ } },
    backgrounds: {
      // SB10 API: options + globals. `parameters.backgrounds.default` is DEAD (audit P1-2).
      options: {
        sacred: { name: 'sacred', value: '#0e0e0e' },
        light: { name: 'light', value: '#ffffff' },
        dark: { name: 'dark', value: '#111827' },
      },
    },
  },
  globalTypes: {
    theme: {
      description: 'goobs data-theme',
      toolbar: { title: 'Theme', icon: 'paintbrush', items: ['sacred', 'light', 'dark'] },
    },
  },
  initialGlobals: { theme: 'sacred', backgrounds: { value: 'sacred' } }, // sacred is the repo default
  decorators: [
    (Story, { globals }) => (
      <div data-theme={globals.theme ?? 'sacred'}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'], // the ONLY autodocs tag in the repo; requires @storybook/addon-docs installed (P1-1)
}
export default preview
```

Plus: `@storybook/addon-docs` installed and registered in `.storybook/main.ts` (P1-1); `storybook`/`@storybook/addon-links` moved to `devDependencies` (P2-6); `addon-onboarding` removed (P3). Every Chromatic snapshot changes once — land deliberately as a single re-baseline commit.

### 1.3 The exemplar — copy this file

Synthesized from the repo's best existing patterns: structure, section banners, per-story JSDoc, meta decorator, and play skeleton from `src/components/Badge/badge.stories.tsx`; assertive play body from `src/components/Alert/alert.stories.tsx:224-237`; control-config-only argTypes from `src/components/Switch/switch.stories.tsx:14-24` — with the audit's corrections applied (no per-meta autodocs tag, live `globals` instead of dead `backgrounds.default`, `fn()` instead of `alert()`, tokens instead of hexes, docgen-owned descriptions).

```tsx
/**
 * @fileoverview Storybook stories for the Badge component.
 * Pins the three theme baselines (sacred/light/dark), all four anchor
 * positions, custom colors and offsets, and one asserted interaction.
 * These stories are the Badge regression spec — goobs has no unit tests;
 * this file + Chromatic ARE the safety net (see scripts/test-impact-map.ts).
 */
import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { expect, fn, userEvent, within } from 'storybook/test'
import Badge from './index'

/**
 * Shared demo anchor the badge attaches to. Themed surfaces use --goobs-*
 * tokens so a token retune moves these baselines with it (audit §6-K).
 */
const DemoAnchor = ({ label = 'Icon' }: { label?: string }) => (
  <div
    style={{
      width: 60,
      height: 60,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 'var(--goobs-radius-md)',
      background: 'var(--goobs-sacred-surface-raised)',
      color: 'var(--goobs-sacred-text)',
      border: '1px solid var(--goobs-gold-a30)',
    }}
  >
    {label}
  </div>
)

const meta: Meta<typeof Badge> = {
  title: 'Components/Badge', // Components/<path mirroring src/components>
  component: Badge,
  parameters: { layout: 'centered' },
  // argTypes configure CONTROLS ONLY. Descriptions come from the props
  // interface via react-docgen-typescript — never duplicated here (§2.2).
  argTypes: {
    content: { control: 'text' },
    children: { control: false },
    styles: { control: 'object', table: { category: 'Styling' } },
  },
  // NO tags: ['autodocs'] — the global tag in .storybook/preview.tsx is the only one.
  decorators: [
    // Meta decorators are for spacing/anchoring context ONLY — theme
    // backdrops are the global theme decorator's job (§1.2).
    Story => (
      <div style={{ padding: '2rem', display: 'flex', justifyContent: 'center' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof meta>

// ---------------------------------------------------------------------------
// THEMES — mandatory trio. Each passes the REAL theme prop AND pins the
// matching canvas via globals (never parameters.backgrounds.default — dead
// API, audit P1-2; never a hand-painted hex wrapper — the Paper fake).
// ---------------------------------------------------------------------------

/** Sacred-theme badge (repo default): gold-on-dark chip anchored top-right. */
export const SacredTheme: Story = {
  name: 'Themes/Sacred',
  args: { content: '5', styles: { theme: 'sacred' }, children: <DemoAnchor /> },
  globals: { theme: 'sacred', backgrounds: { value: 'sacred' } },
}

/** Light-theme badge: filled chip on a light anchor, light canvas. */
export const LightTheme: Story = {
  name: 'Themes/Light',
  args: { content: '5', styles: { theme: 'light' }, children: <DemoAnchor /> },
  globals: { theme: 'light', backgrounds: { value: 'light' } },
}

/** Dark-theme badge: high-contrast chip on the dark canvas. */
export const DarkTheme: Story = {
  name: 'Themes/Dark',
  args: { content: '5', styles: { theme: 'dark' }, children: <DemoAnchor /> },
  globals: { theme: 'dark', backgrounds: { value: 'dark' } },
}

// ---------------------------------------------------------------------------
// VARIANTS
// ---------------------------------------------------------------------------

/** Default badge: content '5' anchored top-right of its child. */
export const Default: Story = {
  args: { content: '5', children: <DemoAnchor /> },
}

/** Badge anchored bottom-left, pinning the offset math for that corner. */
export const BottomLeft: Story = {
  name: 'Position/Bottom Left',
  args: { content: '12', styles: { position: 'bottom-left' }, children: <DemoAnchor /> },
}

/** All four anchor positions side-by-side for one comparative baseline. */
export const AllPositions: Story = {
  name: 'Position/All Positions',
  render: () => (
    <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
      {(['top-right', 'top-left', 'bottom-right', 'bottom-left'] as const).map(position => (
        <Badge key={position} content="3" styles={{ position }}>
          <DemoAnchor label={position} />
        </Badge>
      ))}
    </div>
  ),
}

// ---------------------------------------------------------------------------
// INTERACTION — every play imports expect and asserts (audit §6-G). Spies via
// fn(); window.alert is BANNED in story code (it wedges any runner).
// ---------------------------------------------------------------------------

const onAnchorClick = fn()

/** Clicking the anchor fires the caller's handler; badge content stays visible. */
export const InteractionTest: Story = {
  name: 'Interaction/Click Anchor',
  args: {
    content: 'NEW',
    children: (
      <div role="button" tabIndex={0} onClick={onAnchorClick} style={{ cursor: 'pointer' }}>
        <DemoAnchor />
      </div>
    ),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText(String(args.content))).toBeVisible()
    await userEvent.click(canvas.getByText('Icon'))
    await expect(onAnchorClick).toHaveBeenCalledOnce()
  },
}
```

### 1.4 Hard rules recap (each is gated in §4)

1. Basename `<ComponentName>.stories.tsx` (PascalCase, = exported symbol).
2. `title: 'Components/<fs-mirrored path>'`; unique across the repo.
3. No `tags: ['autodocs']` anywhere outside `.storybook/preview.tsx`.
4. `@fileoverview` header + per-story JSDoc stating the pinned observable state.
5. argTypes = control config only; no `description` keys.
6. Themes trio via args `styles.theme` + `globals` — never `parameters.backgrounds.default`, never hex-faked backdrops.
7. Plays import `expect` and assert; `fn()` spies; no `window.alert`/`confirm`/`prompt`.
8. Stories typecheck (`tsconfig.stories.json`, §4.1) — a story may not pass a prop the component doesn't declare (kills audit §6-B at the gate).
9. Story-demo themed surfaces use `var(--goobs-*)` tokens.
10. A story must not *demonstrate* a knob that is inert (audit §6-A) — if you catch yourself writing one, the fix is in the component (delete or implement the knob, §2.3), not the story.

---

## 2. THE JSDOC STANDARD

What react-docgen-typescript (configured in `.storybook/main.ts:12`) actually renders, once addon-docs exists: the JSDoc block **directly above the exported component**, and `/** */` blocks on **members of the props interface**. `//` comments render nothing — which is why the entire `styles?: XStyles` theming surface is docgen-opaque today (audit §5.2). This standard writes for that renderer.

### 2.1 Component block — required on every exported component

Tag-less prose (the house style — audit §5.1: "tag-less prose is the house style, correctly so for docgen"), 2–5 sentences, **immediately above the exported declaration** — never above the imports (the detached-banner anti-pattern in 10 dirs, audit §6-D: Card, Chip, EmptyState, FieldGrid, FileDropzone, Filter, SacredGlyphFrame, both Metrics, DetailField). Content, in order: what it renders; the key behavioral contracts (theming, form binding, controlled/uncontrolled); anything surprising. Every claim must be true — audit §6-M catalogues ten stale/overclaiming blocks (Table claiming theme support it doesn't read, AppBar citing a deleted file); an overclaiming doc is a §6-B lie in doc form.

The house-reference example, verbatim from `src/components/Switch/index.tsx:81-86`:

```tsx
/**
 * Toggle switch with optional left/right labels and light/dark/sacred theming
 * (the sacred variant renders glyph thumb content plus a shimmer). Auto-binds
 * its boolean value by `name` inside a goobs `<Form>`; otherwise controlled via
 * `checked`.
 */
const Switch: React.FC<SwitchProps> = ({ ... }) => {
```

### 2.2 Props interfaces — every member of every exported `*Props` / `*Styles` interface

One `/** */` line per member (multi-line when there's a real contract to state). This is the **single home** for prop descriptions — argTypes never duplicate them (§1.1). Reference pattern: `SwitchStyles`/`SwitchProps` (`src/components/Switch/index.tsx:15-75`) and the DataGrid types module (`src/components/DataGrid/types/index.ts` — audit §5.3 item 5, "the counter-example: 26/26 public props documented").

Rules:

- **`/** */`, never `//`** — docgen renders only the former (audit §5.2). Converting the styles interfaces' `//` section comments to doc blocks is the single highest-leverage documentation change in the repo.
- Say what the prop does **in the component**, defaults included: `/** Theme selection: light, dark, or sacred (default). */`. If the code's default differs from the doc, fix whichever is wrong — audit §6-A found Switch/RadioGroup claiming a sacred default the code doesn't implement (Switch actually defaults `'dark'`, `index.tsx:96`).
- **An inert prop may not carry a plain description.** Default action: delete it or implement it (audit §6-A, ~170 offenders). If a key must survive one release for compat, it must be marked so docgen shows the truth: `/** @deprecated No-op since the CSS-module migration — scheduled for removal. */`. ⚠️ Phrase it exactly like that: eslint's `no-warning-comments` rule (`eslint.config.mjs:49-61`) errors on the literal phrase "backward(s) compatibility" in any comment.
- Interface-level JSDoc (one sentence on the interface itself) when the interface is exported from the barrel — audit §6-E establishes sibling-type barrel export as convention, and an exported type with no doc is a bare name in consumers' IDEs.

### 2.3 Hooks and non-component utilities — the one place `@param`/`@returns` is house style

Audit §5.1: 9 files use `@param`, "mostly DataGrid subtree + utils" — keep that split. Components: prose only. Hooks/utils: a prose contract paragraph, then tags. Exemplar shape (condensed from the gold standard, `src/components/Field/Shell/useFieldBinding.ts:3-24`, which leads with the back-compat contract and the exact gating expression):

```ts
/**
 * useFieldBinding — auto-bind a goobs field to the form engine, by name.
 *
 * Returns the caller's { value, onChange, onBlur } UNCHANGED unless the field
 * is inside a <Form>, has a `name`, AND no explicit `value` was passed
 * (gate: `Boolean(ctx && name && value === undefined)`).
 *
 * @param args - Binding inputs; see UseFieldBindingArgs member docs.
 * @returns Bound (or passed-through) value/onChange/onBlur for the field.
 * @example
 * const { value, onChange } = useFieldBinding<boolean>({ name, value: checked })
 */
```

Args/result **interfaces** still document per-member as in §2.2 (`UseFieldBindingArgs` at `useFieldBinding.ts:40-55` is the pattern).

### 2.4 File headers

Two conventions compete today: 20 `@fileoverview` files vs 29 `===`-banner files (audit §5.1). **Decision: the file's doc-of-record is a JSDoc block opening with `@fileoverview`** — it is the only form `eslint-plugin-jsdoc` and other tooling can recognize and require; a `//`-banner is invisible to every gate. Decorative `====` rules *inside* a `/** */` block (the DataGrid `types/index.ts:1-45` architecture header, the `useFieldBinding` header) are compliant and encouraged for module-level architecture prose. Required on: every story file (§1.4), every multi-export module (`types.ts`, `utils.ts`, hook files). Optional on a single-component `index.tsx`, where the component block (§2.1) is the doc-of-record.

### 2.5 Fully-worked exemplar component

The target shape, end to end (this is `Switch/index.tsx` tightened to standard — its existing docs are already ~90% compliant):

```tsx
'use client'

import React, { type CSSProperties } from 'react'
import cssStyles from './Switch.module.css'
import { useFieldBinding } from '../Field/Shell/useFieldBinding'

/** Styling contract for the `styles` prop. Theme variants live in Switch.module.css as [data-theme] overrides; scalar overrides ride in as CSS custom properties. */
export interface SwitchStyles {
  /** Theme selection: 'light', 'dark' (default), or 'sacred'. */
  theme?: 'light' | 'dark' | 'sacred'
  /** Renders the focus outline treatment when true. */
  outline?: boolean
  /** Track width override, any CSS length (default from the theme CSS). */
  trackWidth?: string
  /** @deprecated No-op since the CSS-module migration — scheduled for removal. */
  hoverEffects?: boolean
}

export interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Label rendered to the left of the track. */
  leftLabel?: string
  /** Label rendered to the right of the track. */
  rightLabel?: string
  /** Styling options — theme plus per-part overrides. See SwitchStyles. */
  styles?: SwitchStyles
}

/**
 * Toggle switch with optional left/right labels and light/dark/sacred theming
 * (the sacred variant renders glyph thumb content plus a shimmer). Auto-binds
 * its boolean value by `name` inside a goobs `<Form>`; otherwise controlled via
 * `checked`.
 */
const Switch: React.FC<SwitchProps> = ({ disabled, checked, styles, onChange, leftLabel, rightLabel, ...props }) => {
  /* ... */
}
export default Switch
```

### 2.6 Explicitly OUT of scope

- **No `@param` spam on component props.** A component's props are documented on the interface (§2.2); repeating them as `@param` on the component block is banned duplication. `children`, standard DOM passthroughs, and `className` need no doc unless the component does something non-obvious with them.
- **No doc requirement on obvious one-word truths already carried by the type.** `/** Whether the switch is disabled. */ disabled?: boolean` adds nothing over `disabled?: boolean` when behavior is the standard one — document defaults, side effects, and interactions, not tautologies. (Rule of thumb: if the sentence is the prop name re-inflected, delete the sentence or say something real.)
- **Internal-only files** (not exported from `src/index.ts`, never docgen-rendered): component block encouraged, per-member interface docs **not required** — e.g. the `Content/Structure/use*` family. The moment a symbol is added to the barrel, §2.2 applies in the same commit.
- **Stories' local demo helpers** (like `DemoAnchor`) need one line, not a contract.
- **`.d.ts`/`.d.ts.map` residue** (1,044 untracked files, audit §6-L) is never edited or documented — sweep it and narrow the ignore glob per audit §6-L; docs live in `.tsx`/`.ts` sources only.

---

## 3. THE MIGRATION PLAN

Waves ordered by **(consumer impact × current-state badness)** from the audit's matrix (§3) and severity classes (§6). Scope is stated in **files**, never duration. Each wave is committable per reviewable concern; each wave that makes a §4 gate satisfiable **lands that gate in the same wave** so the class it fixes cannot regrow.

### Wave 0 — the setup re-baseline (one deliberate commit; every Chromatic snapshot changes once)

Fixes: audit P1-1/P1-2/P1-3, P2-3, P2-6, P3 dead weight. Files: `.storybook/main.ts`, `.storybook/preview.tsx` (per §1.2), `package.json` (+lockfile), `vercel.json` (build-on-deploy instead of serving the stale Jun-11 `storybook-static/`), plus the mechanical migration of the **51 story files** using dead `parameters.backgrounds.default` → `globals` (grep-driven, one pattern). **~55 files.** Gates landed with it: §4.3 autodocs-tag grep guard (sweep the 55 redundant tags in the same pass), §4.3 dead-API grep guard.

### Wave 1 — close the type gate, then fix everything it flags

Fixes: audit §6-C (root cause) + §6-B (false stories) + the 4 component bugs found alongside (Tabs `aria-controls` mismatch `Tabs/index.tsx:263` vs `:449`, Snackbar `autoHideDuration: 0`, Typography `outline:true → 'none'`, TreeView hardcoded empty glyph). Files: `tsconfig.stories.json` (new) + `package.json` typecheck script + the ~16 story files in the §6-B list (DataGrid, Snackbar, Typography, Tabs, Chip, Popover, ProjectBoard, ComplexTextEditor, RadioGroup, Switch, Pagination, MenuItem, BigCalendar, Panel, TransferList, List) + 4 component files. **~22 files.** Gate: stories typecheck in `typecheck` (§4.1) — the phantom-prop class dies permanently.

### Wave 2 — kill the documented-but-inert API (audit §6-A, ~170 props / 24 dirs)

Wholesale surfaces first (worst badness): Toolbar (~34/35), ConfirmationCodeInput (~56/74), QRCode (17/27), TreeView (11); then the per-dir dead knobs (AppBar, Switch, Stepper — incl. the *required* dead `step.stepNumber` — BigCalendar, Fade/Slide/Zoom, MenuItem, Pagination, Alert, Table, ProgressBar, RadioGroup, CTE, CodeCopy, Metric, PricingTable, Avatar, List, Tabs). Delete-or-implement per §2.2; each deletion is a breaking-change candidate — batch removals per component and note them for the next version bump. **~30 component/type files + their stories.** Gate: §4.4 styles-key-is-read lint lands when the wholesale four are clean.

### Wave 3 — coverage holes (audit §4)

(a) Commit the 3 untracked story files **in coordination with the peer agent that authored them (repo rule R13 — do not adopt or rewrite them unilaterally)**: Card, FilterSection, MetricsAccordion. (b) Stories for the 13 zero-coverage barrel exports (FormDataGrid, FormProjectBoard, InlineAddTask, InlineShowTask — fixing the required-args crash at `ProjectBoard/index.tsx:541` on the way — TabPanel+tabPanelId, CardBanner/BigValue/ConfirmDelete/Grid, SACRED_GLYPHS, shipped `alpha`) and delete-or-decide the C3 candidates (`css`, `formatters.ts`, `SACRED_GLYPHS` if truly consumerless). (c) Zero-coverage surfaces: Stepper wizard mode, Chip `pill`+6 tones, DataGrid composite-field subsystem + `permissions`, the 8 Tier-1 form-binding paths, Panel fullscreen, Toolbar filterDropdown, Tooltip open bubble, TreeView sacred. **~25–30 new/edited story files + ~4 component fixes.** Gate: §4.2 story-coverage script lands here (it fails today; after this wave it passes and stays).

### Wave 4 — theme completion + taxonomy normalization (audit §6-F, §6-J)

(a) The 6 no-real-sacred dirs first (Popover, RadioGroup, Stepper, TreeView, Accordion, Snackbar), then the ~14 other partial-theme dirs; component-side theme debt tracked but separate (DetailField/FieldGrid/Panel no `[data-theme]` CSS; Dialog unreachable dark). (b) Rename all story files to `<ComponentName>.stories.tsx` (two-step `git mv` on this case-insensitive box) and normalize titles (3 `Primitives/*`, `Icons/`, `ProjectBoard/Board`, Metric duplicate titles, Field-tree orphans). Renames + title moves relocate Chromatic baselines — batch with the theme additions so the re-baseline is reviewed once. **~40 story files (mostly renames), ~20 with content edits.** Gate: §4.3 naming/title checks flip from warn to error.

### Wave 5 — JSDoc debt, worst consumer impact first (audit §5.3)

Order: Button (ButtonStyles ~100 props + ButtonProps) → Typography (+ document the `includes('h')` and outline traps) → Field/ (30 components; core props; kill the duplicate `InternalIncrementNumberFieldProps` export) → Table/Stepper/Toolbar/List/Badge/BigCalendar/QRCode/Divider (zero-member-doc high-traffic) → the 10 detached banners reattached (§6-D list) → styles-interface `//`→`/** */` conversion repo-wide (§5.2) → barrel type exports for the ~25 missing sibling types (§6-E) + the two naming mismatches (`ComplexEditor`, `ConfirmationCodeInput` singular/plural) noted for the next major. **~60–70 source files, mechanical majority.** Gate: §4.4 jsdoc lint ratchets to error as each dir lands.

### Wave 6 — interaction net (audit §6-G, P2-1)

Remove `window.alert` from Alert/Badge/Chip/ConfirmationCodeInput/Tabs stories (→ `fn()` spies); make the assertion-free plays assert (Snackbar, TransferList, Tabs, Panel's impossible onBack claim); then add plays to the interactive zero-play dirs in impact order: DataGrid, Dialog, Drawer, Stepper, Toolbar, Tooltip, ConfirmationCodeInput, Pagination, BigCalendar. **~20 story files.** Gate: §4.5 play runner + a11y addon land here, plus Chromatic CI trigger if not already wired in Wave 0.

---

## 4. ENFORCEMENT

Repo realities this section respects: flat eslint config at `eslint.config.mjs` (the `package.json` `eslintConfig` block is dead — delete it, audit §7.8); `scripts/**` is eslint-ignored, and repo lint scripts are standalone bun TS files (`scripts/test-impact-map.ts` is the house pattern: `#!/usr/bin/env bun`, self-contained, forward slashes); gates run via `package.json` scripts (`lint:all`, `typecheck`, `build`), and `prepublishOnly` is currently build-only (audit §7 meta-gap).

### 4.1 Stories enter the type gate (kills §6-B/§6-C at the root)

```jsonc
// tsconfig.stories.json  (new file, repo root)
{
  "extends": "./tsconfig.json",
  "compilerOptions": { "noEmit": true, "incremental": false, "types": ["node"] },
  "include": ["src/**/*.stories.tsx", ".storybook/**/*.ts", ".storybook/**/*.tsx"],
  "exclude": ["node_modules", "dist"]
}
```

```jsonc
// package.json scripts (changed lines only)
"typecheck": "tsc --noEmit && tsc -p tsconfig.stories.json",
"lint:stories": "eslint \"src/**/*.stories.tsx\" \".storybook/**/*.{ts,tsx}\" --max-warnings=0",
"lint:coverage": "bun scripts/lint-story-coverage.ts",
"lint:jsdoc-surface": "bun scripts/lint-styles-props-read.ts",
"lint:all": "npm run lint && npm run lint:css && npm run lint:stories && npm run lint:coverage && npm run lint:jsdoc-surface",
"chromatic": "chromatic",
"test-storybook": "test-storybook --url http://127.0.0.1:6006",
"prepublishOnly": "npm run typecheck && npm run lint:all && npm run build"
```

(The orphaned `tsconfig.metricstory.tmp.tsbuildinfo` at repo root — audit §6-C — is the fossil of exactly this config; this revives it properly.)

### 4.2 Story-coverage lint — barrel export ⇒ story exists (kills §7.2)

`scripts/lint-story-coverage.ts`, following the `test-impact-map.ts` house pattern (audit §7.2: "test-impact-map.ts already contains the detection logic but never exits non-zero"). Sketch:

```ts
#!/usr/bin/env bun
/**
 * @fileoverview lint-story-coverage — every VALUE export in src/index.ts must be
 * rendered by at least one story. goobs has no unit tests; an unstoried barrel
 * export is a shipped component with zero regression coverage (audit §4).
 * Exit 1 on any uncovered export. Allowlist (with reasons) lives inline below.
 */
import { readFileSync } from 'node:fs'
import { walkSources } from './lib/walk' // extract walk() from test-impact-map.ts

// Symbols that legitimately need no story, each with a WHY — reviewed, not silent.
const allowlist = new Map<string, string>([
  ['commonKeyframes', 'module-load side effect, exercised by SacredGlyphFrame stories'],
])

const barrelSource = readFileSync('src/index.ts', 'utf8')
// value exports only: `export { default as X, Y } from ...` — `export type {...}` excluded
const exportedValueNames = [...barrelSource.matchAll(/export\s*\{([^}]+)\}\s*from/g)]
  .flatMap(match => match[1].split(','))
  .map(name => name.trim().replace(/^default as\s+/, ''))
  .filter(name => name && !name.startsWith('type '))

const storyFiles = walkSources('src').filter(file => file.path.endsWith('.stories.tsx'))
const failures: string[] = []
for (const exportName of exportedValueNames) {
  if (allowlist.has(exportName)) continue
  const renderedSomewhere = storyFiles.some(
    story => new RegExp(`<${exportName}[\\s/>]`).test(story.text) ||
             new RegExp(`\\b${exportName}\\b`).test(story.text) // hooks/utils: imported+called
  )
  if (!renderedSomewhere) failures.push(exportName)
}
if (failures.length > 0) {
  console.error(`story-coverage: ${failures.length} barrel export(s) with no story:\n  ${failures.join('\n  ')}`)
  process.exit(1)
}
console.log(`story-coverage: OK — ${exportedValueNames.length} value exports covered (${allowlist.size} allowlisted).`)
```

The allowlist is the anti-rot mechanism the stylelint exemptions lack (audit §7.10): every entry carries a reason and shows up in review; the script fails if an allowlisted symbol *gains* a story (stale entry) — add that check when extracting.

### 4.3 eslint-plugin-storybook + custom story bans (kills §6-I, P1-2 recurrence, alert(), naming)

Install `eslint-plugin-storybook` as a devDependency; delete the dead `eslintConfig` block from `package.json`; remove `.storybook/**` from `globalIgnores` in `eslint.config.mjs`; append:

```js
// eslint.config.mjs (appended)
import storybook from 'eslint-plugin-storybook'

...storybook.configs['flat/recommended'], // includes, at error where marked:
//   storybook/await-interactions            error
//   storybook/context-in-play-function      error
//   storybook/default-exports               error
//   storybook/hierarchy-separator           error
//   storybook/no-redundant-story-name       warn → raise to error (below)
//   storybook/prefer-pascal-case            error  (story export names)
//   storybook/story-exports                 error
//   storybook/use-storybook-expect          error  (plays must assert — §1.4-7)
//   storybook/use-storybook-testing-library error
{
  files: ['src/**/*.stories.tsx'],
  rules: {
    'storybook/no-redundant-story-name': 'error',
    'no-restricted-properties': ['error',
      { object: 'window', property: 'alert',   message: 'Banned in stories — wedges any interaction runner. Use fn() from storybook/test.' },
      { object: 'window', property: 'confirm', message: 'Banned in stories — use fn().' },
      { object: 'window', property: 'prompt',  message: 'Banned in stories — use fn().' },
    ],
    'no-restricted-globals': ['error',
      { name: 'alert', message: 'Banned in stories — use fn() from storybook/test.' },
    ],
    'no-restricted-syntax': ['error',
      { selector: "Property[key.name='backgrounds'] Property[key.name='default']",
        message: 'parameters.backgrounds.default is a dead SB8 API (audit P1-2). Pin the canvas via story globals.' },
      { selector: "Property[key.name='tags'] Literal[value='autodocs']",
        message: 'autodocs is global (.storybook/preview.tsx). Never re-tag per meta (audit §6-I).' },
      { selector: "Property[key.name='argTypes'] Property[key.name='description']",
        message: 'Prop descriptions live on the props interface (docgen renders them). argTypes configure controls only (§1.1).' },
    ],
  },
},
{
  files: ['.storybook/**/*.{ts,tsx}'],
  rules: { 'storybook/no-uninstalled-addons': 'error' },
},
```

File naming + unique titles are not expressible in eslint — fold both checks into `lint-story-coverage.ts` (it already walks every story file): assert basename is PascalCase and equals the component dir's exported symbol, and assert no duplicate `title:` values (Wave 4 flips these from warn to error).

### 4.4 eslint-plugin-jsdoc + the styles-key-is-read guard (kills §5.2/§6-A recurrence)

Install `eslint-plugin-jsdoc`; scope to non-story source. Deliberately minimal rule set — the goal is presence + non-emptiness on the public surface, not tag ceremony (tag-less prose is house style, §2.1):

```js
// eslint.config.mjs (appended)
import jsdoc from 'eslint-plugin-jsdoc'

{
  files: ['src/**/*.{ts,tsx}'],
  ignores: ['src/**/*.stories.tsx', 'src/**/*.d.ts'],
  plugins: { jsdoc },
  rules: {
    // Presence on the docgen-rendered surface: members of exported Props/Styles interfaces.
    'jsdoc/require-jsdoc': ['error', {
      publicOnly: true,
      require: { FunctionDeclaration: false, ClassDeclaration: false },
      contexts: [
        'ExportNamedDeclaration > TSInterfaceDeclaration[id.name=/(Props|Styles)$/] TSPropertySignature',
      ],
      exemptEmptyConstructors: true,
    }],
    'jsdoc/require-description': ['error', { contexts: ['any'], descriptionStyle: 'body' }], // no empty blocks
    'jsdoc/no-types': 'error',            // TS owns types; `{string}` annotations banned
    'jsdoc/check-tag-names': ['error', { definedTags: ['fileoverview'] }],
    'jsdoc/check-alignment': 'error',
    'jsdoc/require-param': 'off',         // components: prose only (§2.6)
    'jsdoc/require-returns': 'off',
  },
},
{
  // Hooks + utils: the one place @param/@returns is required (§2.3).
  files: ['src/utils/**/*.ts', 'src/**/use*.ts', 'src/**/use*.tsx'],
  ignores: ['src/**/*.stories.tsx', 'src/**/*.d.ts'],
  plugins: { jsdoc },
  rules: {
    'jsdoc/require-param': 'error',
    'jsdoc/require-returns': 'error',
    'jsdoc/require-example': 'off', // encouraged (§2.3), not gated — examples rot fastest
  },
},
```

Rollout: land at `warn` in Wave 0, ratchet to `error` per directory as Wave 5 completes it (a shrinking `ignores` list in the config block, reviewed in each Wave-5 PR — shrink-only, unlike the expiry-less stylelint exemptions the audit flagged in §7.10).

`scripts/lint-styles-props-read.ts` (the §6-A structural guard, audit §6-A "fix direction"): for each exported `*Styles` interface, collect member keys; grep the owning component dir for `styles?.<key>`, `styles.<key>`, or a destructure of that key; any key never read and not tagged `@deprecated` ⇒ exit 1 listing `Component.styles.<key>`. Same bun/house pattern as §4.2. Lands after Wave 2 makes it green.

### 4.5 Where each gate hooks in

| Gate | Command | Hooks into | Lands in wave |
|---|---|---|---|
| Story typecheck | `tsc -p tsconfig.stories.json` | `typecheck` (and thus `build`'s tsc step + `prepublishOnly`) | 1 |
| Storybook eslint rules + bans | `lint:stories` | `lint:all`, `prepublishOnly` | 0 (bans) / 4 (naming to error) |
| JSDoc lint | in `lint` (same eslint run) | `lint:all`, `prepublishOnly` | 0 warn → 5 error |
| Story coverage | `lint:coverage` | `lint:all`, `prepublishOnly` | 3 |
| Styles-key-is-read | `lint:jsdoc-surface` | `lint:all`, `prepublishOnly` | 2 |
| Autodocs-tag / dead-API grep | inside `lint:stories` (eslint `no-restricted-syntax`) | `lint:all` | 0 |
| Chromatic | `chromatic` script + CI workflow on push (drop `onlyChanged` for the Wave-0 full re-baseline run, restore after) | CI (new `.github/workflows/chromatic.yml`; also fixes the stale-deploy §7.6 by rebuilding `storybook-static/` in `vercel.json` buildCommand) | 0 |
| Play runner + a11y | `test-storybook` (`@storybook/test-runner`) + `@storybook/addon-a11y` | CI after Chromatic; blocked until the alert() ban is enforced | 6 |

The meta-gap (audit §7: no CI at all) closes as a side effect: one workflow running `typecheck && lint:all && build && chromatic` makes every gate above real instead of conventional.

---

*Every numeric claim above is the audit's (recounted 2026-07-01); file citations were re-read from the working tree while drafting this standard: `badge.stories.tsx`, `switch.stories.tsx`, `alert.stories.tsx:224-237`, `Switch/index.tsx`, `DataGrid/types/index.ts`, `Field/Shell/useFieldBinding.ts`, `.storybook/{main,preview}.tsx`, `eslint.config.mjs`, `tsconfig.json`, `chromatic.config.json`, `package.json`, `scripts/test-impact-map.ts`, `src/styles/global.css` (token names), `src/index.ts`.*
