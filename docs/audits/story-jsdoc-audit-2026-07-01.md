# Storybook Story + JSDoc Consistency Audit — goobs-frontend

**Date:** 2026-07-01
**Scope:** `.storybook/` setup, all 59 directories under `src/components` + `src/utils`, the public barrel (`src/index.ts`), and the enforcement/tooling layer.
**Method:** 5 baseline audits (setup, story conventions, JSDoc conventions, barrel coverage, enforcement) reconciled against 59 per-directory audits, each of which was independently adversarially verified (corrected / refuted / missed). Where inputs contradicted each other, this synthesis re-checked the actual files (read-only) and records which input was right (§8). All headline numbers below were **recounted from the working tree on 2026-07-01**, not copied from the inputs.

---

## 1. Executive summary

The repo's stated contract is "no unit tests — stories + Chromatic ARE the regression net." This audit finds that net has **three broken load-bearing beams at the setup level** and a **systemic truth problem at the content level**:

1. **Autodocs is completely inert.** `@storybook/addon-docs` is not installed (verified: absent from `package.json`, `bun.lock`, and `node_modules/@storybook/`), so the global `tags:['autodocs']`, all 55 per-meta copies of it, and every line of props JSDoc in the repo currently render **zero documentation pages** — the built `storybook-static/index.json` contains 639 stories and **0 docs entries** (recounted). The enforcement baseline's claim that "autodocs plumbing works" is refuted.
2. **The dark-backdrop mechanism 51 story files rely on is a dead API.** `parameters.backgrounds.default` is silently ignored by the Storybook 10 runtime (verified in `node_modules/storybook/dist/preview/runtime.js`: `withBackgroundAndGrid` destructures only `{options, disable, grid}` and reads the active value from `globals`). Every "dark"/"sacred" story renders — and would Chromatic-baseline — on a white canvas.
3. **Brand fonts never load in Storybook** (no `@font-face` import in preview, no `staticDirs`), so all 639 stories render fallback serif instead of Cinzel/Inter.

At the content level, the most damaging repo-wide pattern is **documented-but-inert API**: roughly **170 typed, docgen-visible props across 24 of 59 directories do nothing at runtime** (from single dead knobs like `CodeCopy.animationDuration` up to wholesale-inert surfaces: ~56 of ~74 `ConfirmationCodeInputStyles` props, ~34 of 35 `ToolbarStyles` props, 17 of 27 `QRCodeStyles` props, 11 `TreeViewStyles` props). A second pattern — **stories that demonstrate false behavior** — appears in ~14 directories (Snackbar's 12 theme stories never set a theme; DataGrid stories pass two nonexistent props at 12 sites; Typography stories claim Merriweather while rendering Cinzel; Tabs stories advertise sticky behavior that has no CSS). The **root cause is structural**: `tsconfig.json` excludes `**/*.stories.tsx` from typecheck and `.storybook/main.ts` sets `typescript.check:false`, so story/API drift can never fail a gate.

Coverage is broad but has verified holes: **13 public barrel exports have zero story coverage** (including four whole Card subcomponents, both `Form*` wrappers, both ProjectBoard inline forms, and `TabPanel` — whose documented pairing with `Tabs` is additionally broken by an `aria-controls`/`id` mismatch). Three story files (**Card, FilterSection, MetricsAccordion**) exist only as untracked working-tree files, so at HEAD those components have **no committed regression coverage at all**. Interaction coverage is thin: the widely-quoted "528 play functions" is a grep artifact (matching `display:`); the true count is **40 play functions in 28 of 88 files**, none executed by any runner, several assertion-free or blocked by `window.alert()`. JSDoc is bimodal: DataGrid/Card/Form-hooks are reference-grade, while 32 of 58 story-bearing directories ship components with no component JSDoc and 9 with zero props-member docs — and the entire theming surface (`styles?: XStyles`) is docgen-opaque everywhere. Nothing enforces any of this: there is no CI, Chromatic has no trigger, the published Storybook is stale (built Jun 11), and the one lint block referencing `eslint-plugin-storybook` is dead config.

---

## 2. Storybook setup assessment (reconciled)

Verified state at audit time: Storybook 10.4.1, framework `@storybook/nextjs` (webpack5), addons = `addon-links` + `addon-onboarding` only, `reactDocgen: 'react-docgen-typescript'`, global `tags:['autodocs']` in `preview.tsx:18`, no decorators/globalTypes, no `staticDirs`, zero `.mdx` files.

### P1 — the net is graded on the wrong picture

| # | Finding | Verification ruling |
|---|---|---|
| **P1-1** | **Autodocs inert** — `@storybook/addon-docs` absent (docs moved out of core in SB9/10). All autodocs tags + the `*.mdx` glob half of `main.ts` do nothing. | **Confirmed by re-check**: `node_modules/@storybook/` contains no `addon-docs`; `grep addon-docs package.json bun.lock` = 0; `storybook-static/index.json` = 639 `"type":"story"`, **0** `"type":"docs"`. The enforcement baseline's contrary claim ("SB 10 core bundles docs … so this renders") is **wrong**. Every JSDoc fix recommended in §5 is invisible until this lands. |
| **P1-2** | **`backgrounds: { default: 'dark' }` is a dead SB8 API** — 51 story files use it (recounted); the SB10 runtime ignores it. | **Confirmed by re-check**: `withBackgroundAndGrid` in `node_modules/storybook/dist/preview/runtime.js` destructures only `{options, disable, grid}` from `parameters.backgrounds` and takes the active value from `globals.backgrounds`. The Divider per-dir verifier's counter-claim ("still a supported API — `default?: string` exists at csf/index.d.ts:809") checked only the **type**, which is back-compat residue; the runtime never reads it. Setup baseline **right**, Divider verifier **wrong**. |
| **P1-3** | **Brand fonts never load** — `@font-face` lives only in `fonts/goobs-fonts.css`, which nothing in `.storybook/` imports; `global.css` has token stacks only. All stories (and any Chromatic baseline) render Georgia/Times where Cinzel/Inter is intended. | Uncontested; consistent with per-dir stories hand-setting `fontFamily: '"Cinzel", serif'` inline (SacredGlyphFrame, TransferList). |

These three must land together as one intentional re-baseline — each changes every Chromatic snapshot.

### P2 — missing capability

- **P2-1 Play functions have no runner.** True count **40 play functions across 28 files** (recounted with `\bplay:`; the setup/enforcement baselines' "528 across 72 files" is the `display:` substring artifact — see §8). No `test-runner`, no vitest addon, no a11y addon in the lockfile. They execute only when a human opens a story or during a *manual* Chromatic run.
- **P2-2 No a11y addon** despite hand-rolled ARIA widgets — and this audit found a real ARIA bug no gate could catch (Tabs `aria-controls` mismatch, §4/§6-B).
- **P2-3 No theme toolbar/decorator.** Themes are `data-theme='sacred'|'light'|'dark'` but preview has no globalTypes/decorator; every file hand-builds theme variants and hand-sets the dead backgrounds param. A toolbar + decorator solves P1-2 structurally and enables Chromatic `modes`.
- **P2-4 Chromatic/CI is manual end-to-end.** `chromatic.config.json` is sane, but there is no workflow, no `chromatic` npm script, and `vercel.json` serves a **pre-built `storybook-static/`** whose `index.json` predates ~3 weeks of commits (built Jun 11).
- **P2-5 webpack (`@storybook/nextjs`) vs the library's vite build** — what-you-test ≠ what-you-ship at the bundler level. Caveat before switching to `react-vite`: components import `next/link`/`next/image` (externalized in `vite.config.ts`), which `@storybook/nextjs` mocks for free.
- **P2-6 Storybook leaks into consumers' installs** — `storybook` and `@storybook/addon-links` sit in `dependencies`, not `devDependencies`.

### P3 — dead weight
`addon-onboarding` (remove); `addon-links` registered but unused; `@chromatic-com/storybook` installed but never registered; per-meta autodocs tags redundant in **55/88 files** (recounted; 54 meta-level + 1 additionally misplaced *inside* `parameters` in `metric.stories.tsx:70`, where it is inert even if addon-docs existed); no viewport config; no MDX docs; prop-JSDoc coverage gaps (§5).

---

## 3. The consistency matrix

All 59 directories. Legend — **Naming**: lc = lowercase, PC = PascalCase, cml = camelCase, mix = mixed within dir. **Title**: ✓ = `Components/<Dir>`; otherwise actual prefix. **Tag**: ✓ = redundant per-meta `tags:['autodocs']` present. **FO** = story-file `@fileoverview`. **SJ** = per-story JSDoc (all/some/none). **AT** = argTypes (full/part/none). **Themes**: S/L/D = dedicated sacred/light/dark story coverage; † = caveat (see footnotes). **Play** = verified play-function count. **CJ/PJ** = component / props-interface JSDoc (all/some/none). ⚠ = story file **untracked at HEAD**.

| Dir | Naming | Title | Tag | FO | SJ | AT | Themes | Play | CJ | PJ |
|---|---|---|---|---|---|---|---|---|---|---|
| Accordion | lc | ✓ | ✓ | ✓ | some | part | L·D † | 1 | none | some |
| Alert | lc | ✓ | ✓ | ✓ | some | full | S·L·D | 1 | all | some |
| AppBar | lc | ✓ | ✓ | ✓ | none | part | S·L·D | 0 | all | some |
| Avatar | lc | ✓ | ✓ | ✓ | all | part | S·L·D | 0 | all | some |
| Badge | lc | ✓ | ✓ | ✓ | all | full | S·L·D | 1 | all | none |
| BigCalendar | lc | ✓ | ✓ | ✓ | none | part | S·L·D † | 0 | none | none |
| Breadcrumb | lc | ✓ | ✓ | ✗ | none | none | S·L·D | 0 | none | all |
| Button (2 files) | mix | ✓ | ✓ | ✓ | some | part | S·L·D † | 1 | some | some |
| Card ⚠ | lc | ✓ | ✓ | ✓ | some | part | S·L·D | 0 | none | some |
| Checkbox | lc | ✓ | ✗ | ✓ | all | part | S | 0 | all | some |
| Chip | lc | ✓ | ✗ | ✓ | all | part | S·L·D | 0 | none | some |
| CodeCopy | lc | ✓ | ✗ | ✓ | none | part | S·L·D | 0 | all | all |
| ComplexTextEditor | lc | ✓ | ✓ | ✓ | none | part | S·L·D | 3 | none | some |
| ConfirmationCodeInput | lc | ✓ | ✗ | ✓ | none | part | S·L·D | 0 | none | some |
| Content | lc | ✓ | ✓ | ✓ | all | none | S·L·D | 0 | none | some |
| DataGrid | lc | ✓ | ✗ | ✗ | none | part | S·L·D | 0 | some | all |
| DetailField | PC | ✓ | ✓ | ✓ | all | full | S | 1 | none | some |
| Dialog | lc | ✓ | ✗ | ✓ | none | part | S·L·D † | 0 | all | some |
| Divider | lc | ✓ | ✓ | ✓ | none | part | S·L·D | 0 | none | none |
| Drawer | lc | ✓ | ✗ | ✓ | some | part | S·L·D | 0 | none | some |
| EmptyState | PC | Primitives/ | ✗ | ✗ | none | part | S·L·D | 0 | none | all |
| Fade | lc | ✓ | ✓ | ✗ | none | full | S·L·D | 0 | all | some |
| Field (29 files) | mix | ✓ mixed † | 13/29 | 28/29 | some | part | S·L·D † | 12 | some | some |
| FieldGrid | PC | ✓ | ✓ | ✓ | some | part | — | 1 | none | some |
| FileDropzone | PC | Primitives/ | ✗ | ✗ | none | none | S | 0 | none | all |
| Filter ⚠ | cml | ✓ | ✓ | ✓ | all | part | S·L | 0 | none | some |
| Form | lc | ✓ | ✓ | ✓ | all | none | S·L·D † | 0 | some | some |
| IconButton | lc | ✓ | ✓ | ✓ | all | none | S·L·D | 0 | all | all |
| Icons | PC | Icons/ | ✗ | ✗ | none | none | S·L·D † | 0 | none | some |
| List | lc | ✓ | ✓ | ✓ | all | none | S·L·D | 0 | none | none |
| ListItemCard | PC | Primitives/ | ✗ | ✗ | none | none | S·D | 0 | some | some |
| Markdown | lc | ✓ | ✓ | ✓ | all | part | S·L·D † | 0 | all | all |
| MenuItem | lc | ✓ | ✓ | ✓ | none | part | S·L·D | 1 | none | some |
| Metric (2 files) ⚠ | lc+cml | ✓ ×2 † | ✓ † | ✓ | all | part | S·L·D | 0 | none | all |
| Pagination | lc | ✓ | ✓ | ✓ | none | part | S·D † | 0 | none | some |
| Panel | PC | ✓ | ✓ | ✓ | some | part | S | 1 | some | some |
| Paper | lc | ✓ | ✓ | ✓ | some | part | S † | 0 | none | some |
| Popover | lc | ✓ | ✓ | ✓ | none | part | L·D | 1 | none | some |
| PricingTable | lc | ✓ | ✗ | ✗ | none | part | S·L | 0 | none | some |
| ProgressBar | lc | ✓ | ✓ | ✗ | none | full | S·L·D | 0 | all | some |
| ProjectBoard | lc | ProjectBoard/ | ✗ | ✓ | none | part | S·L·D | 0 | none | some |
| QRCode | lc | ✓ | ✓ | ✓ | none | part | S·L·D | 0 | none | none |
| RadioGroup | lc | ✓ | ✓ | ✓ | none | part | L·D | 1 | all | some |
| SacredGlyphFrame | cml | ✓ | ✓ | ✓ | all | full | S (by design) | 1 | none | all |
| Select | lc | ✓ | ✓ | ✓ | none | part | S·L·D | 1 | none | some |
| Slide | lc | ✓ | ✓ | ✗ | none | full | L·S † | 0 | all | some |
| Snackbar | lc | ✓ | ✓ | ✓ | all | part | L † | 1 | none | some |
| Stepper | lc | ✓ | ✗ | ✗ | all | none | L·D | 0 | all | none |
| Switch | lc | ✓ | ✓ | ✗ | all | part | S·L·D | 7 | all | all |
| Table | PC | ✓ | ✓ | ✗ | none | none | S·L·D † | 0 | some | none |
| Tabs | lc | ✓ | ✗ | ✗ | all † | part | S·L | 1 | some | some |
| ToggleButton | lc | ✓ | ✓ | ✓ | some | part | S·L·D | 1 | some | some |
| Toolbar | lc | ✓ | ✗ | ✗ | all † | part | S·L·D | 0 | none | none |
| Tooltip | lc | ✓ | ✓ | ✗ | none | part | S·L | 0 | none | some |
| TransferList | lc | ✓ | ✗ | ✗ | all † | part | S·L | 1 | none | some |
| TreeView | lc | ✓ | ✓ | ✓ | some | part | L·D | 1 | none | some |
| Typography | lc | ✓ | ✓ | ✓ | none | part | S·L·D † | 1 | all | none |
| Zoom | lc | ✓ | ✓ | ✗ | none | full | S·L·D | 0 | all | some |
| utils (no stories) | — | — | — | — | n/a | n/a | — | 0 | n/a | n/a |

**Footnotes (†):** Accordion — sacred appears only inside composite stories, no dedicated baseline. BigCalendar — sacred/dark are month-view-only; the light WithFilters story ships a *sacred* filter panel (theme not forwarded). Button — SaveButton stories have no theme coverage. Dialog — theme 'dark' intentionally renders the light palette; the dark CSS blocks are unreachable dead code. Field — per-file gaps: ExternalIncrement no light, Dropdown/Regular no sacred, SearchableHistory no light, MoneyText no theme stories. Form — theme stories theme only the submit Button; `Form.AutoFields` has no theme prop, so field theming is hollow (the fileoverview's contrary claim is false). Icons — all three themes, but as one 261×3 grid in a single snapshot on a hardcoded light page. Markdown — decorator colors are hand-picked hexes that don't match the `--goobs-*-text` token values. Metric — MetricsAccordion is documented under two separate flat titles (duplicate baselines); one autodocs tag is inert inside `parameters`. Pagination — no explicit light story; CSS has only sacred overrides. Paper — light/dark stories are cosmetic (component special-cases only 'sacred'; DarkTheme fakes darkness with `backgroundColor:'#1f2937'`). Slide — dark reachable only by clicking buttons in-story (no static baseline). Snackbar — all 12 "Themes/*" stories never pass `styles.theme`; sacred/dark exist in names only. Table — theme stories pass a `styles` prop the component ignores. Tabs/Toolbar/TransferList — per-story JSDoc exists but is contentless numbered labels. Typography — Merriweather-named stories actually render Cinzel; sacred/dark real. Field titles — one orphan (`Components/SearchableHistory`), one component-named leaf (`SignatureField`), one group/leaf collision (`Components/Field/USD`).

**Matrix aggregates (58 story-bearing dirs):** redundant autodocs tag in 41 dirs / **55 of 88 files**; per-story JSDoc all 19 / some 11 / none 28; argTypes full 8 / partial 40 / none 10; themes: **38 nominally full / 20 partial** (6 dirs — Popover, RadioGroup, Stepper, TreeView, plus Accordion's non-dedicated and Snackbar's fake — have **no real sacred baseline despite sacred being the repo default**); play tests present in **21 dirs (40 functions / 28 files)**, absent in 37; component JSDoc all 17 / some 9 / **none 32**; props JSDoc all 10 / some 39 / **none 9**.

---

## 4. Coverage — uncovered and weakly-covered exports

### 4.1 Reconciliation with the barrel baseline

The barrel baseline counted **156 value exports** and said 89 story files; the on-disk count is **88 story files** (baseline conventions audit was right; barrel's 89 refuted by recount). Reconciliation of its zero-coverage list against the adversarially-verified per-dir audits:

| Export | Barrel baseline said | Per-dir verification | Final verdict |
|---|---|---|---|
| `FormDataGrid`, `FormProjectBoard` | zero coverage | Confirmed for the **wrappers**; inner DataGrid/ProjectBoard have their own stories | **ZERO (wrapper chrome + CSS modules unbaselined)** — P1 |
| `InlineAddTask`, `InlineShowTask` | zero (gated behind view-state, no plays) | Confirmed + strengthened: board stories omit required args, so reaching them interactively **crashes** (`meetings.filter` at ProjectBoard/index.tsx:541) | **ZERO** — P1 |
| `TabPanel`, `tabPanelId` | zero | Confirmed repo-wide + **new P1 bug**: Tabs emits `aria-controls="tabpanel-${reactId}-${tabId}"` (index.tsx:263) but TabPanel renders `id="tabpanel-${tabId}"` (index.tsx:449) — the documented pairing never links | **ZERO + broken as documented** — P1 |
| `CardBanner`, `CardBigValue`, `CardConfirmDelete`, `CardGrid` | zero | Confirmed | **ZERO** — P1 |
| `CardEmptyState` | zero | **Refuted** — verbatim re-export of `EmptyState`, which has its own stories | Weak/indirect (per-dir right) |
| `Card.Section`, `Card.DragHandle` | incidental-only | Confirmed (via SacredGlyphFrame / ListItemCard stories) | Weak/indirect |
| `Tab` | weakly covered | Confirmed (rendered inside Tabs; standalone/disabled/count/icon unexercised) | Weak/indirect |
| `alpha` | "runs indirectly (Chip/Divider/FilterSection/Tabs consume it)" | **Refuted by re-check**: Chip/FilterSection hits are comments; the only real consumer is Tabs, and it imports the **divergent hex-only `utils/index.ts` variant**, not the barrel-shipped `utils/alpha.ts` | **Shipped variant: ZERO coverage** (and two divergent implementations under one name — P2) |
| `css` | zero consumers, deprecation candidate | Confirmed (random per-call names defeat Chromatic by construction) | **ZERO — delete candidate (C3)** |
| `keyframes`, `commonKeyframes` | indirect via SacredGlyphFrame | Confirmed — module-load injection runs when the SGF story renders | Weak/indirect |
| `SACRED_GLYPHS` | zero | Confirmed + strengthened: **zero consumers anywhere** — even SacredGlyphFrame hardcodes its own glyph list (index.tsx:69) | **ZERO** — P2 |
| `FieldShell`, `useFieldBinding`, `useOptionalFormContext`, `useEscape`/`useArrowKeyNav`, `getRequiredProps`/`validateRequired`, `useTreeViewContext` | indirect-only | Confirmed (composed/executed by nearly every field story; no dedicated demo) | Weak/indirect |

**Final truly-zero barrel exports: 13** — FormDataGrid, FormProjectBoard, InlineAddTask, InlineShowTask, TabPanel, tabPanelId, CardBanner, CardBigValue, CardConfirmDelete, CardGrid, SACRED_GLYPHS, `css`, and the shipped `alpha` variant.

### 4.2 At-HEAD caveat: untracked story files

`git status` confirms three story files are **untracked working-tree files** (a peer agent's in-flight batch — per repo rule R13, flag, do not touch): `src/components/Card/card.stories.tsx`, `src/components/Filter/Section/filterSection.stories.tsx`, `src/components/Metric/Accordion/metricsAccordion.stories.tsx`. At HEAD, the shipped **Card compound family (25 barrel-exported subcomponents), FilterSection, and MetricsAccordion have zero committed story/Chromatic coverage**. Every coverage statement above describes the working tree; the committed net is strictly smaller.

### 4.3 Zero-coverage API *surfaces* (not in the barrel list, found per-dir)

- **Stepper wizard mode** — `mode='wizard'`, onNext/onBack/onReset, finalActions, step.content: the entire second half of the component has no story (P1 per-dir).
- **Chip `variant='pill'` and all 6 `tone` palettes** — the shipped replacements for StatusPill/StatusBadge have zero stories, while the CustomColors story teaches the hand-tuned pattern `tone` was built to eliminate.
- **DataGrid composite-field subsystem** — `CompositeFieldConfig`, `onCompositeFieldSave`, `CompositeFieldEditModal`: zero renders; also `permissions: 'read'/'no-access'` never exercised.
- **Form-engine (Tier-1) binding paths** with zero story coverage in: Select, Switch, TransferList, ConfirmationCodeInput, ComplexTextEditor, RadioGroup, ToggleButton(Group), Checkbox — `name`/`dataFieldName`/`useFieldBinding`/`data-error`/`data-filled` never appear in any snapshot for these components.
- **Panel `fullscreen` variant**; **Toolbar `filterDropdown`** (whole Dropdown branch); **Tooltip bubble itself** (no controlled-open story, no play — the component's entire visual output is unsnapshotted, P1); **TreeView sacred theme** (incl. the SacredBackground canvas, whose glyph is hardcoded `''` — invisible particles a story would have caught); **FileDropzone uploading/drag-active states** (transient-only, uncapturable).
- **Orphans (C3 delete-or-finish candidates):** `src/utils/formatters.ts` (14 exports, zero consumers — its "one source of truth" header describes a consolidation that never reached the callsites, which still carry duplicates); `Content/Structure/animations.tsx` (+ its module.css, zero importers); `ProjectBoard/utils/useComputeBoard.tsx` (`useComputeBoardResize`, zero consumers).

---

## 5. JSDoc state

### 5.1 Repo-wide numbers (recounted where cheap; awk-derived figures from the JSDoc baseline, corroborated per-dir)

| Metric | Value |
|---|---|
| `export interface \w+Props` declarations (non-story, non-`.d.ts`) | **153 across 104 files** (recounted — matches baseline exactly) |
| Props files with **zero** member JSDoc | **22 of 104 (21%)** — incl. Typography, Table, Stepper, Toolbar, List, Badge, BigCalendar, QRCode, Divider + the 10-file `Content/Structure/use*` family (baseline; per-dir audits independently confirmed every named file) |
| Component JSDoc directly above the export | present in only 17 of 58 story-bearing dirs ("all"), absent in 32 |
| Files using `@param` | 9 (mostly DataGrid subtree + utils) — tag-less prose is the house style, correctly so for docgen |
| Non-story `@fileoverview` files | 20 vs 29 `===`-banner files — two competing header conventions |
| Compiled residue under `src/` | **523 `.d.ts` + 521 `.d.ts.map` = 1,044** (recounted), **0 tracked** (recounted) — all gitignored local residue; incl. 12 orphan `.d.ts` for deleted icons and a stale `Icons/index.d.ts` exporting 12 phantom modules |

### 5.2 The single highest-leverage gap

**Every `styles?: XStyles` prop is docgen-opaque.** The styles interfaces are the components' primary API surface (~100 keys on ButtonStyles, ~90 on AlertStyles, 103 on TreeViewStyles, ~83 on ComplexTextEditorStyles, ~74 on ConfirmationCodeInputStyles…) and essentially all of them use `//` section comments, which react-docgen-typescript does not render. Even after P1-1 is fixed, the theming API of the entire library will document as a bare type name. This compounds with §6-A: many of those undocumented keys are also *inert*.

### 5.3 Worst offenders, ranked by consumer impact

1. **Button** — `ButtonStyles` (~100 props) zero JSDoc; `ButtonGroupProps` zero; `ButtonProps` half-documented; `variantDefaults` palette hardcoded as inline literals outside the token layer; secondary/destructive variants have zero story coverage while the fileoverview claims variants are showcased (P1 per-dir).
2. **Typography** — zero member docs on the most-rendered primitive, plus two behavioral traps documented nowhere: the `isHeading = variant.includes('h')` check forces Cinzel on any variant containing "h" (the root cause of the stories' false Merriweather claims), and `outline:true` maps to `outline:'none'`.
3. **Field/** (30 components) — core props (`value`, `onChange`, `label`, `placeholder`) bare on nearly every interface; only 5/30 components carry component JSDoc; the Shell layer is, ironically, the fully-documented gold standard the components don't meet. Duplicate exported symbol: `InternalIncrementNumberFieldProps` exported from both `IPAM/Subnet` and `Number/InternalIncrement`.
4. **Form/** — hooks and schema are reference-grade, but `ProjectBoard/index.tsx` is fully undocumented, the "8-method FormEngine seam" comment contradicts the 9-member interface (and is frozen into the stale local `.d.ts`), and `FormDataGrid`'s usage example documents an import path the `exports` map cannot resolve.
5. **DataGrid** — the counter-example: 26/26 public props documented, 120 JSDoc blocks in `types/index.ts`. Its gaps are story-side (phantom props, zero plays), not docs-side.
6. **Zero-member-doc primitives with high traffic** — Table (whose one component JSDoc also *overclaims* theme/styles support the component doesn't read), Stepper (bare interface + 4 dead props incl. a *required* one), Toolbar (bare + ~34/35 inert), List (bare + `dense` inert on 3 of 4 exports), Badge, BigCalendar (26 bare props + 4 dead/ignored).

---

## 6. Deviation catalogue (deduplicated across directories)

### A. Documented-but-inert API — "the docs lie" — **P1 class**

**~170 typed, docgen-visible props across 24 directories do nothing at runtime.** Wholesale-inert surfaces: ConfirmationCodeInput (~56 of ~74 styles keys; plus dead `identifier` prop), Toolbar (~34 of 35 — only `styles.theme` is read), QRCode (17 of 27 + dead `onSecretGenerated`), TreeView (11: 4 styles-level behavior flags + all 7 `sacred*` props). Individually verified dead knobs: AppBar 6 (glyph*/shimmer*/elevated), Switch 6 (hoverEffects, sacredGlyph L/R, shadowed styles.disabled/checked, `checkedThumbColor` — which a story actively demos), Stepper 4 (incl. **required** `step.stepNumber`), BigCalendar 4 (height/width ignored without `@deprecated`; availableEventTypes/availableStatuses never read), Fade/Slide/Zoom 3 each (`appear`/`enter`/`exit` preserved verbatim from the removed theme layer), MenuItem 3 (styles.dense/divider/selected), Pagination 3 (`color` phantom + styles.gap/padding), Alert 3 (borderColor/hoverBackgroundColor/iconHoverFilter), Table 2 (both `Table` and `TableBody` declare `styles` they never destructure), ProgressBar 2 (`aria-required`, styles.outline), RadioGroup 2 (+1 visually-inert `radioInnerColor`), CTE `showToolbar` (with matching dead CSS), CodeCopy `animationDuration`, Metric `styles.height`, PricingTable `defaultBilling`, Avatar `border`, List `dense` (on 3 subs), Tabs `TabProps.styles`. Doc-contract inversions in the same class: Switch and RadioGroup JSDoc claim a sacred default while the code defaults elsewhere; Typography `outline:true → 'none'`; `alpha`'s named-color claim.
**Common root:** styles shapes "preserved verbatim for back-compat" after the CSS-modules migration, with the disclaimer living in `//` comments docgen can't render. **Fix direction:** delete or implement each knob; where kept, per-prop JSDoc with explicit "reserved / no-op" annotations; a lint that diffs styles-interface keys against `styles?.<key>` reads.

### B. Stories that demonstrate false or nonexistent behavior — **P1 class** (~14 dirs)

- **DataGrid**: `allowRowCreation`/`creationRowPosition` passed at 12 sites — neither exists on `DatagridProps`; autodocs "Show code" teaches a phantom API.
- **Snackbar**: all 12 "Themes/*" stories never pass `styles.theme` (everything renders light); "Behavior/No Auto-Hide" sets `autoHideDuration: 0`, which the component treats as *hide after 0 ms* — the story and its JSDoc are both false.
- **Typography**: Merriweather-claiming stories render Cinzel (via the `includes('h')` trap); "With Outline" stories *remove* the outline.
- **Tabs**: meta + two stories claim sticky-tabs behavior with no `position:sticky` anywhere in the CSS; "Premium Theme" is `theme:'light'`.
- **Chip**: NoOutline story sets a nonexistent `styles.outline`.
- **Popover**: CustomPosition passes a `transform` that isn't a PopoverStyles field — the promised centering never happens (masked by `styles?: any` in the story wrapper).
- **ProjectBoard**: args include two props that don't exist (`onDuplicate`, `onRevisionHistory`), `rawCompanies` on variants whose union forbids it, and omit ~10 *required* props (clicking "Manage" crashes).
- **ComplexTextEditor**: ModeSwitching's external buttons demonstrably don't switch the mode (state captured once, no remount).
- Also: RadioGroup showGlyph stories (feature doesn't exist), Switch CustomColors (dead knob demoed), Pagination `color` control, MenuItem fileoverview claiming standalone bare-`<select>` coverage that no story provides, BigCalendar WithFilters passing a no-op arg while shipping a sacred filter panel under a light story, Panel's InteractionTest banner claiming an onBack assertion the play cannot even make (mock trapped in the render closure), TransferList's inert `itemLabelMap` demo, List stories passing `dense` to subcomponents that ignore it.

### C. Root cause: stories sit outside every type gate — **P1**

`tsconfig.json` excludes `**/*.stories.ts(x)`; `build` is `tsc --noEmit && vite build`; `.storybook/main.ts` sets `typescript: { check: false }`. A story can pass deleted/renamed/nonexistent props and every gate stays green — this is precisely how every §6-B phantom-prop story survived. **Fix:** a `tsconfig.stories.json` (extends root, includes stories, `noEmit`) wired into `typecheck`. The orphaned `tsconfig.metricstory.tmp.tsbuildinfo` at repo root suggests exactly this once existed and was lost.

### D. Empty autodocs surfaces — **P2**

32/58 dirs have no JSDoc attached to the exported component. Recurring sub-pattern: an excellent banner **detached from the export** (above imports, where docgen can't see it) — Card, Chip, EmptyState, FieldGrid, FileDropzone, Filter, SacredGlyphFrame, both Metric components, DetailField. Combined with §5.2 (styles interfaces using `//` comments) the library's docs pages would render mostly-empty even after P1-1 is fixed. Interface-level/per-prop doc inversions (one but not the other) noted in Checkbox, Zoom, Switch, PopoverStyles.

### E. Barrel type-export gaps — **P2**

`src/index.ts` exports sibling `*Styles`/prop types as an established pattern (ChipStyles, SelectStyles, MenuItemStyles, FormFieldStyles, SlideStyles, IconStyles, ConfirmationCodeInputStyles…), so omissions are proven convention deviations, not preferences. Missing across ~25 dirs: AppBarStyles, AvatarProps/Styles, BadgeStyles, BreadcrumbStyles, ButtonStyles/ButtonGroupProps/ButtonAction/ButtonVariant, CheckboxStyles, ChipTone, CodeCopyStyles, ComplexTextEditorStyles + EditorMode, DividerProps, DrawerStyles, FadeProps/Styles, ZoomProps/Styles, ListStyles, PaginationProps/RenderItemParams, PaperProps, PopoverStyles, PricingTable's Feature/SubFeature, ProgressBarProps/Styles, RadioGroupStyles, SwitchStyles, TableStyles/SimpleTableProps, ToggleButtonStyles/Theme, ToolbarStyles, TooltipStyles, TransferListVariant/DropdownDataMap (the story itself deep-imports it), TreeViewStyles/TreeItemProps (+ unexported TreeViewContextValue behind a shipped hook), ProjectBoard's InlineAddTaskProps/InlineShowTaskProps (components are public, their prop types aren't), Content's LinkProps/ImageProps. Naming mismatches in the same class: barrel `ComplexEditor` vs component `ComplexTextEditor`; barrel `ConfirmationCodeInput` (singular) vs component `ConfirmationCodeInputs` (plural).

### F. Theme-coverage gaps and default-theme drift — **P2**

20/58 dirs missing at least one theme story; **6 with no real sacred baseline** (sacred is the repo default): Popover, RadioGroup, Stepper, TreeView (zero), Accordion (composite-only), Snackbar (name-only). ~10 missing dark (Checkbox, DetailField, FileDropzone, Panel, PricingTable, Tabs, Tooltip, TransferList, Slide-static, Filter — the last two because the *component* has no dark). FieldGrid has no theme story at all. Component-level theme debt: the DetailField/FieldGrid/Panel batch ships **no `[data-theme]` CSS** (45 of 52 modules do); Dialog's dark CSS is unreachable; TransferList/Filter cap at sacred|light. Separately, a whole class of components defaults to `'light'` (or Switch's `'dark'`) against the repo's sacred default — Avatar, Badge, Checkbox (wrapper light vs icon sacred), CodeCopy (dark), ConfirmationCodeInput, List, Paper, ProgressBar, QRCode (JS light vs sacred CSS base), RadioGroup (code light vs JSDoc sacred), ToggleButton, TreeView (root light vs chevron sacred), BigCalendar (light vs CalendarFilters sacred) — several producing visible mixed-theme rendering that no story pins.

### G. Interaction-test poverty — **P2**

40 play functions / 28 files / 21 dirs; **37 of 58 dirs have zero**, including the most interactive components (DataGrid, Dialog, Drawer, BigCalendar, Stepper, Toolbar, Tooltip, ConfirmationCodeInput, Pagination). Of the plays that exist: several are assertion-free (Snackbar clicks and asserts nothing; TransferList imports no `expect`; Tabs asserts nothing *and* triggers `window.alert`), and `window.alert()` appears in story callbacks in Alert, Badge (inside its only play), Chip (×8), ConfirmationCodeInput, and Tabs — blocking dialogs that can wedge any future test-runner/Chromatic interaction pass. Newest files are regressing (only 2 of the 13 in `74ab22d` have a play).

### H. Inert controls — **P2/P3**

Fully-declared argTypes rendered dead by render-only/closure-state stories in ~18 dirs (Card, CTE, Dialog, Drawer, Filter, List, Popover, PricingTable, ProgressBar, Slide 3/4, Stepper, Switch (checked/onChange/styles), Table, Toolbar, Tooltip 2/4, Typography, ProjectBoard, IconButton showcases). The Controls panel advertises interactivity that does nothing — misleading in the same spirit as §6-B, lower stakes.

### I. Redundant per-meta autodocs tags — **P3**

**55 of 88 files** (recounted): 54 meta-level duplicates of the global `preview.tsx:18` tag + 1 misplaced *inside* `parameters` (metric.stories.tsx:70 — inert even once addon-docs exists). Actively propagating: 12 of the 13 newest files include it. Sweep after P1-1 lands; a one-line grep guard keeps it out.

### J. Naming & taxonomy drift — **P3**

Files: **60 lowercase / 25 PascalCase / 3 camelCase** (recounted; camel = filterSection, metricsAccordion, sacredGlyphFrame). Mixed casing *within* dirs: Button, Field (13 lc / 16 PC). Basename mismatches: `ComplexTextEditor/editor.stories.tsx`, `ConfirmationCodeInput/codeinput.stories.tsx`, and `IPAM/MACAddress/Address.stories.tsx` (copy-paste; two different components named `Address.stories.tsx` in the Field tree). Titles: 83 `Components/*`, 3 `Primitives/*` (EmptyState/FileDropzone/ListItemCard — while equivalent primitives DetailField/Panel/FieldGrid sit under `Components/`), 1 `Icons/`, 1 `ProjectBoard/Board` (only meta with no recognized top-level category). Field-tree anomalies: `Components/SearchableHistory` orphan, `SignatureField` component-named leaf, `Components/Field/USD` doubling as MoneyText's parent group. Metric documents MetricsAccordion under two flat titles (duplicate Chromatic baselines) instead of nesting `Components/Metric/Accordion`. Slash-grouped `name:` overrides (~249) are the established house style — flagged only where they *pretend* to nest (they render as flat labels).

### K. Token drift — **P2 in shipped code, P3 in stories**

Shipped-code violations of the `--goobs-*` system (invisible to stylelint's CSS-only guard): **Button `variantDefaults`** (whole variant palette as inline literals), **IconButton** colorMaps (11 hexes + ring), **BigCalendar/CalendarFilters** (entirely inline-styled with gold literals, no CSS module, + stray `console.log`), **PricingTable `getThemeStyles`** (a 246-line JS theming module of the exact class the migration removed, with no module.css), QRCode JS fallbacks duplicating token values, Dialog scrollbar hexes (+ dead dark blocks), Avatar/EmptyState/FileDropzone/ListItemCard/SacredGlyphFrame/Panel module.css literals (the last five are on the documented css-design-tokens to-tokenize list). Story-only hardcoded hexes (dozens of files, `#FFD700` et al.) are tolerated by repo policy — noted as polish, with the caveat that hand-painted sacred backdrops silently diverge from token retunes under Chromatic.

### L. Compiled `.d.ts` residue — **P3 (repo-wide, untracked)**

1,044 files (523 `.d.ts` + 521 maps) beside sources; **0 tracked** — all gitignored pre-`tsc --noEmit` residue. Not the ce86c83 `.js`-shadowing class (`.d.ts` cannot shadow `.tsx` in webpack/TS resolution). Real residual harms: 12 orphan icon `.d.ts` + a stale `Icons/index.d.ts` exporting **12 phantom icons** tooling can auto-import; stale `Form/index.d.ts` omitting the newer hooks and freezing the wrong "8-method" text; `src/vite-env.d.ts` caught by the same ignore glob (a fresh clone loses it). One local sweep + narrowing the ignore glob fixes all of it.

### M. Stale / self-contradictory doc claims — **P2/P3**

Form's "8-method FormEngine seam" vs the 9-member interface; `FormDataGrid`'s unresolvable documented import path + ghost `MetricSection` in its hierarchy diagram; AppBar's "lockstep with theme/appbar.ts" (file doesn't exist); Drawer's fileoverview claiming a TreeView integration that isn't in the component; `diag.ts` "(soon) form validation" (already shipped); SaveButton's rot-prone cross-repo `file:line` anchor; Alert's InteractionTest comment claiming the closing state can't be asserted (it can); `useCardContext`'s error text overstating its constraint (only 2 of 24 subcomponents enforce it); Panel's "mirrors Card conventions" (Card uses `--card-*`, not `--panel-*`; Panel has no data-theme support); Table's component JSDoc claiming theme/override support the component doesn't read; Tabs' documented `tabId` index-fallback being unreachable code and `TabsItem.id` claiming auto-wired panel ids that require manual wiring; `formatters.ts`'s "one source of truth" header over an orphan module.

---

## 7. Enforcement gaps

Ten verified gaps; every §6 category exists because nothing below fires:

1. **No story typecheck** (§6-C) — the highest-leverage single fix: `tsconfig.stories.json` in the `typecheck` script kills the entire §6-B phantom-prop class at the gate.
2. **No new-export-needs-a-story guard** — commit `74ab22d` (13 catch-up stories) proves detection is manual; `test-impact-map.ts` already contains the detection logic but never exits non-zero and nothing invokes it.
3. **No JSDoc lint** — `eslint-plugin-jsdoc` absent; an undocumented or inert prop ships silently. Pair with a "styles-key is actually read" script to guard §6-A.
4. **Play functions never execute in any gate** — 40 assertions that can be red for months (and `window.alert` calls that would wedge a runner when one arrives).
5. **Chromatic has no trigger** — no npm script, no CI, `onlyChanged` narrows even manual runs; the "regression net" runs only when someone remembers.
6. **Deployed docs drift** — `vercel.json` no-op build serves a `storybook-static/` stale since Jun 11 (verified: 639/0 index predating the token refactor and the 13-story batch).
7. **Token guard stops at `.css`** — stylelint never sees the shipped JS inline styles in §6-K nor story literals.
8. **Dead lint config** — `package.json`'s `eslintConfig: plugin:storybook/recommended` block is unread (flat config) and the plugin isn't installed; `.storybook/**` and `scripts/**` are eslint-ignored.
9. **No autodocs-tag dedup guard** (§6-I) — one-line grep in `lint:all`.
10. **Stylelint's 12 "in-flight" directory exemptions have no expiry** — standing holes in the token guard.

Plus the meta-gap: **there is no CI at all** (no `.github/`, `prepublishOnly` runs only `build`), so even the checks that exist run only by convention.

---

## 8. Refutation log

All **59 of 59** directories completed adversarial verification. **No 'VERIFIER DIED' directories** — every row in §3 is verified-confidence. What verification refuted, grouped (demonstrating the audit's error-correction rigor):

1. **"Compiled `.d.ts` artifacts COMMITTED next to source"** — the most-refuted claim, struck in ~25 directories. Ground truth (recounted): 1,044 files on disk, **0 tracked**, all matched by `.gitignore:50-51`. Also refuted the associated "shadowing risk" framing: the documented ce86c83 incident was stale `.js` (which webpack resolves); `.d.ts` never shadows `.tsx`.
2. **The play-count inflation trap** — the setup and enforcement baselines' "528 play functions across 72 files" and per-dir sibling claims ("Accordion 13, Dialog 18, Badge 50") were all the `display:` substring matching `play:`. Verified truth: **40 across 28 files** (`\bplay:` recount matches the conventions baseline and the per-dir dedicated audits: Accordion 1, Dialog 0, Badge 1, Switch 7, Field 12).
3. **Setup-level contradictions resolved by this synthesis (re-checked against files):**
   - *Autodocs*: enforcement baseline said docs render; setup baseline said inert. **Setup right** — addon-docs absent everywhere, index.json 639/0.
   - *`backgrounds.default`*: setup baseline said dead API; Divider's verifier said "still supported" citing the CSF **type**. **Setup right** — the runtime never reads `default` (verified in `withBackgroundAndGrid`); the type is back-compat residue. 51 files affected (recounted).
   - *Story-file count*: barrel baseline said 89; conventions said 88. **88 on disk** (85 tracked + 3 untracked).
   - *`alpha` coverage*: barrel baseline claimed 4 internal consumers; **re-checked — Chip/FilterSection hits are comments; only Tabs consumes it, and it consumes the divergent hex-only variant**, so the shipped export is uncovered.
4. **False sibling-comparison framings** — repeated claims that "Accordion documents every argType" (it documents exactly one: `styles`), that lowercase filenames or `Components/` titles are *the* convention (actual split 60/25/3; three title taxonomies), that slash-grouped story names or story-file inline styles are deviations (both are documented house style/policy).
5. **Arithmetic corrected everywhere** — story counts (Accordion 17 not 15, Drawer 10 not 12, RadioGroup 16 not 15, Typography 17 not 16, ProgressBar 15 not 14), prop counts (Dialog 11 not 12, Pagination dataField span, QRCode 19 not 18, AppBarStyles 37 not "40+", TreeViewStyles 103 not "~130", Panel 12 literals not 7, repo `.d.ts` 515→523 under src/components vs src), and severity downgrades where "zero coverage" was actually weak-indirect (Chip onClick via FilterSection, Button `primary` via SaveButton, useOptionalFormContext via FieldShell, Card.Section/DragHandle/EmptyState, keyframes via SacredGlyphFrame, useTreeViewContext on every render).
6. **Mechanism corrections** — Typography's font lie is caused by the `includes('h')` heading check, not the resolveVariant default (the original audit's claimed mechanism produced a wrong prediction — Crimson Text — that verification caught); Icons' missing prop tables are caused by no per-icon meta, not non-exported interfaces; Snackbar/EmptyState "`.d.ts` shadowing" claims corrected as above; Badge's "empty prop table" softened (argTypes descriptions fill the Storybook table; the gap is IDE/docgen-outside-storybook).
7. **Refuted "deviations" that were conformance** — Avatar's mixed flat/slash names, Checkbox's `State/` prefixes, Markdown's non-data-theme decorators (a data-theme wrapper would be a no-op for a `color:inherit` component), Toolbar/DataGrid inline demo wrappers, `@storybook/react` imports (uniform across all 88 files).

**Confidence note:** claims verified against files during synthesis (the recounts in §0/§2/§3 aggregates, §4 zero-coverage list, §8.3 rulings) are highest-confidence. Per-dir line-number citations are as corrected by each dir's adversarial verifier and were spot-consistent wherever this synthesis re-touched the same files.

---

## Appendix — recommended order of attack

1. **One re-baseline commit:** install+register `@storybook/addon-docs`; import the font CSS in preview; add the theme toolbar/decorator with `backgrounds.options` + `globals` and migrate the 51 dead `backgrounds.default` usages. (Every Chromatic snapshot changes once — do it deliberately.)
2. **Close the type gate:** `tsconfig.stories.json` in `typecheck`; fix the ~14 §6-B phantom/false stories it will immediately flag.
3. **Kill the lies:** delete-or-implement the ~170 inert props (§6-A), starting with the wholesale surfaces (Toolbar, ConfirmationCodeInput, QRCode, TreeView) and the four P1 setup-level component bugs found on the way (Tabs aria-controls mismatch, Snackbar autoHide 0, Typography outline inversion, TreeView empty glyph).
4. **Commit the untracked stories** (coordinate with the peer agent per R13), then close the 13 zero-coverage barrel exports (§4).
5. **Wire the net:** Chromatic script + CI, play-function runner (after removing `window.alert` from stories), rebuild-on-deploy for the docs site.
6. **Docs debt, worst-consumer-impact first:** Button/Typography/Field/Table/Stepper/Toolbar props JSDoc; attach detached banners to exports; per-prop docs on the styles interfaces; barrel type exports (§6-E).
