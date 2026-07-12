# Gateable issue classes — discovery sweep (2026-07-11)

Read-only, 7-lens + synthesis multi-agent sweep run in parallel with the component a11y
audit campaign. Goal: find LARGE, mechanically-enumerable issue classes beyond the
per-component a11y pass — candidates for permanent lint gates (`scripts/a11y-lints/` or
sibling `scripts/lint-*.ts`) per the class-first rule (T8).

Counts are grep-level snapshots taken while ~16 writer agents were editing
`src/components/**` — treat as approximate; each gate's builder re-enumerates.

**Execution plan:** P1 classes get built as gates (detection module + repo-wide fix +
green) in the **wave-2 gates workflow after batch 3** of the a11y campaign (building them
earlier would collide with the batch writers). P2 = regression wall now / campaign or
canon-decision later. P3 = monitor. Batch pattern agents may land some modules first —
wave-2 builders check `ls scripts/a11y-lints/` before creating (contract already requires it).

---

## P1 — build the gate + fix the class (wave 2)

| # | Class (slug) | ~Count | What / why it matters |
|---|---|---|---|
| 1 | `missing-data-component-root` | 4 | Tier-0 test contract: DataGrid, DetailField, ProjectBoard, TreeView roots emit NO `data-component` (55 others do). ThothOS resolvers can't select them. Examples: `DataGrid/index.tsx:1198`, `DetailField/index.tsx:82`, `ProjectBoard/index.tsx:556`, `TreeView/index.tsx:1612`. |
| 2 | `missing-data-action-on-actions` | ~100 | Tier-2: action buttons with `onClick` but no `data-action` (Pagination nav, TransferList moves, Tabs, Accordion/TreeView toggles, Stepper, CodeCopy's `<Button>` without `action=`, `ProjectBoard/forms/ShowTask/inline.tsx` alone has 38). Tests fall back to brittle text locators. Needs a small allowlist (spinners, chevrons). |
| 3 | `reduced-motion-no-guard` | 51 files | 66 module.css declare motion, only 15 guard it; **`src/styles/global.css` has NO global `prefers-reduced-motion` net**; 13 files run INFINITE animations unguarded (ProgressBar shimmer, Switch shimmer, DataGrid float). ARCHITECTURAL fix first: global reduced-motion reset in `global.css` (makes most of the class impossible), then lint infinite/unguarded animations. WCAG 2.3.3. |
| 4 | `outline-none-no-focus-replacement` | ~19 files | `outline:none` or styled `:hover` with zero focus treatment in the same module.css (Tabs, ToggleButton, MenuItem, Pagination). Keyboard users get no focus ring. Escape hatch: Field/* inputs delegate ring to FieldShell. WCAG 2.4.7. |
| 5 | `locale-timezone-format-in-render` | ~18 | `.toLocale*()`/`Intl` in render with ambient locale+TZ → server (UTC/en-US) ≠ client → hydration mismatches. Hotspot `ProjectBoard/forms/ShowTask/inline.tsx` (1451, 1635, 2161, 2278). |
| 6 | `random-id-in-render` | 3 | `Math.random()` DOM ids in render (`DataGrid/Table/Rows/index.tsx:271,495`) → guaranteed hydration mismatch; fix = `useId`. Also unstable fallback key `DataGrid/utils/rowComparison.ts:44`. |
| 7 | `aria-label-not-overridable` | 34 in 18 files | Hardcoded English `aria-label` literals on interactive controls with no prop override (Pagination 304/320/347/363, TransferList 323+, Field steppers — note `"Decrease value"` vs `"decrement"` wording drift). No i18n layer exists → consumers cannot localize what screen readers announce. Fix = additive label-override props with current defaults. |
| 8 | `theme-literal-in-js` | ~58 in 18 TS(X) files | Raw brand/severity hex literals in TSX/TS — the stylelint token-leak gate only scans `.css`, so the JS side is ungated (from the synthesis agent's independent sweep). |
| 9 | `static-non-overridable-data-testid` | ~13 | Fixed `data-testid` string literals (`progress-bar`, `app-bar`, `filter-section-toggle`, `metrics-accordion-toggle`…) — collide when the component renders twice; not consumer-overridable. |
| 10 | `interactive-components-drop-public-ref` | only 17/108 expose ref | Select/Switch/RadioGroup/Tabs/Stepper/ConfirmationCodeInput/most Field/* render real `<input>`/`<button>`/`<select>` but drop consumer refs — can't focus/measure imperatively. Additive fix (React 19 ref-as-prop), interactive components first. |

## P2 — regression wall now, or campaign/canon decision needed

- `dismissable-overlay-missing-escape` (~5) + `overlay-focus-not-restored` (~5) — DataGrid CompositeFieldEditModal/ManageColumnsSimple/Footer ExportMenu, Tooltip (WCAG 1.4.13). Batch-1 writers are fixing instances now; the lint lands as the wall. Shared idiom exists (`useEscape` in Field/Shell/keyboard.ts).
- `data-action-verb-drift` (~6) — commit family uses `save` / `save-creation` / `create` / `confirm`; needs a canonical verb vocabulary decision, then a value-set lint.
- `missing-diag-events-on-stateful-containers` (~8) — inverted coverage: the MOST stateful components (DataGrid 81 useState, ProjectBoard 93, TreeView, TransferList, ComplexTextEditor) emit ZERO `emitDiag` while 26 simpler ones instrument fine.
- `onchange-signature-drift` (~50) — four incompatible `onChange` shapes: value-only (Checkbox), event-only (RadioGroup — opposite of Checkbox), `(event,value)` (Button/Pagination), REVERSED `(value,event)` (Card:615). Unifying is a breaking change → gate freezes NEW drift; unification needs an operator/semver decision.
- `theme-default-resolution-drift` (~64) — ~34 components default `styles?.theme || 'light'`, ~30 default `'sacred'`. Canon decision, then behavior-changing fix.
- `no-classname-style-passthrough` (~90 of 108) — most components silently ignore consumer `className`/`style`. Additive DX campaign (own workflow), then a props-shape lint.
- `missing-jsdoc-on-public-props` (~412 of ~1349, 30%) — eslint-plugin-jsdoc already a devDep; mechanical docs campaign.
- String overrides: `hardcoded-input-placeholder-no-prop` (~15), `status-empty-and-announced-copy-hardcoded` (~12), `pagination-range-string-hardcoded` (4).
- `aria-name-prop-naming-drift` (~20) — camelCase `ariaLabel` props vs native `aria-label` passthrough, same intent two spellings.
- SSR leftovers: `new-date-now-in-render` (~11 — careful: calendars legitimately show "today"), `lazy-usestate-reads-browser-state` (3).
- `px-font-size-ignores-user-scaling` (~64) — verify the rem convention first.
- Cheap walls: `no-css-in-js-libs` (0 today), `no-debug-console` (2), `legacy-sacredtheme-boolean-prop` (5), `theme-union-shape-and-widening-drift` (5 — one `| string` widening kills IntelliSense).

## P3 — monitor / architectural notes

- `controlled-uncontrolled-asymmetry` (~53 accept `value`, only ~9 accept `defaultValue`).
- `missing-data-state-on-containers`, `live-region-no-shared-announcer` (7 bespoke live regions → shared announcer primitive candidate), `transition-all-overbroad` (43, incl. baked into `--goobs-transition-*` tokens), `use-client-prologue` (0 — wall only), `style-key-naming-drift-same-concept` (5), `aria-boolean-state-unguarded-false` (3).
- ⚠️ `projectboard-domain-strings-not-generic` (~150 hardcoded support-desk domain strings in ProjectBoard) — this is a PRODUCT question for the operator: ProjectBoard reads as ThothOS-domain-specific inside a general-purpose library.

## Dismissed (with reasons)

- `no-inline-style-objects` — too many INTENTIONAL data-driven patterns (DataGrid cells, BigCalendar `--bc-*`).
- `no-explicit-any` — eslint deliberately disables it ("too many existing usages"); mass cleanup is an owner call.
- `no-js-theming-module` — one real hit (PricingTable `getThemeStyles`); would false-positive on sanctioned ComplexTextEditor theme.ts. Fix the one instance instead.
- `styles-props-read` / story coverage — already gated (`lint:styles-props`, `lint:coverage`).
- Contrast render sweeps — Playwright-heavy, can't join `lint:all` cheaply.

## Round 2 (2026-07-12) — enterprise-library categories sweep

Prompted by "what do enterprise frontend libraries (Spectrum/Polaris/Carbon/MUI) gate
that we don't?" Verified against this repo, not listed from memory:

**Already covered here (verified):** strict react-hooks rules (immutability,
static-components, set-state-in-render) in eslint.config.mjs; `peerDependencies`
correct (react/react-dom/next as peers); `sideEffects: ["*.css"]` declared;
`target="_blank"` clean (0 hits; browsers also default noopener since 2021).

**BUILT + wired this round:**
| Gate | Where | Found / state |
|---|---|---|
| `lint:circular` — circular imports (init-order fragility; DFS over first-party value imports, type-only skipped) | `lint:all` | 1 real cycle found+fixed: Table↔Rows via `getRowId` (extracted to `DataGrid/utils/getRowId.ts`); 563 modules now 0 cycles |
| `lint:package` — exports-map integrity, peers, sideEffects (dependency-free publint/ATTW) | `prepublishOnly` (needs dist) | clean |
| `lint:budget` — bundle-size budgets (es/umd/css, baseline+10%; raising = deliberate commit with reason) | `prepublishOnly` | 89–90% of budget |

**CONFIRMED, queued (need a real campaign or careful checker — final-wave / follow-up):**
- `rtl-logical-properties` (~255 physical-property hits in module.css: margin-left/right,
  left:/right:, text-align) — the Spectrum/Polaris RTL category; migration to
  margin-inline-*/inset-inline-* + a stylelint plugin rule. LARGE.
- `effect-listener-missing-cleanup` (81 addEventListener sites to verify paired removal /
  AbortController in the same effect) — memory-leak class; needs effect-scope-aware checking.
- `dsih-sanitization-provenance` (5 dangerouslySetInnerHTML sites) — require `__html` to
  flow through an escaping/sanitizing pipeline (Markdown's mdToHtml escapes source;
  DOMPurify is already in the graph via jspdf); per-site pipeline reading needed first.
- Public API report (api-extractor-style `.api.md` diff gate over dist/index.d.ts) —
  catches accidental breaking changes; needs tooling decision.
- Interaction-test coverage: every interactive component ≥1 play function (extend
  lint:coverage) — counts exist in stories, needs an "interactive" classification.

## Method / provenance

Lenses: test-selector wiring · ARIA idiom drift · keyboard interaction · SSR safety ·
hardcoded strings · public-API drift · CSS a11y coverage (each an independent read-only
agent), plus a synthesis agent that independently verified the existing-gate landscape
(package.json, eslint/stylelint configs, the three `scripts/lint-*.ts`). Full structured
lens output with all examples: workflow `wf_c0074b65-1d3` (session
0ad612a9, 2026-07-11).
