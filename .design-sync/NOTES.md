# design-sync NOTES — goobs-frontend

Durable learnings for future syncs. Symptom → root cause → fix.

## Build / config

- **[GENERAL] CSS not in JS bundle → `cfg.cssEntry: "dist/goobs-frontend.css"`.**
  Symptom: `[CSS_PLACEHOLDER]` / `[CSS_RUNTIME]`, `_ds_bundle.css` a 73-byte stub → everything unstyled.
  Root cause: vite lib build uses `cssCodeSplit:false` and emits a *separate* `dist/goobs-frontend.css`
  (also `export ./styles`); the ES entry `goobs-frontend.es.js` never `import`s it, so esbuild can't pull it in.
  Fix: `cfg.cssEntry` points at the compiled stylesheet (369KB; contains the `--goobs-*` token layer from
  `src/styles/global.css` + every component `.module.css`). Appended onto the stub bundle css.

- **Global / entry:** `globalName=GoobsFrontend` (vite `lib.name`), entry `dist/goobs-frontend.es.js`,
  `--node-modules ./node_modules`, `buildCmd="bun run build"` (= `tsc --noEmit && vite build`, ~10s).
  Reference storybook: `@storybook/nextjs`, built to `.design-sync/sb-reference` (646 stories / 72 titles).

- **react/react-dom externalized to window globals; everything else bundled** (incl. `next/link`,
  `next/image`). `next/*` use is tiny: `next/link` in Accordion + Content (Content excluded), `next/image` x1,
  zero `next/navigation`. WATCH whether Accordion's NextLink renders without a Next router context (no
  AppRouterContext on the preview side; storybook has @storybook/nextjs mocks). Re-sync risk if it regresses.

## titleMap — story-title segment → barrel export name

The converter matches a title segment against the package's public exports. These 14 titles use a segment
that differs from the export name:
Button→CustomButton, ComplexTextEditor→ComplexEditor, MACAddress→MACAddressField, VLAN→VLANField,
InternalIncrement→InternalIncrementNumberField, Password→PasswordField, Percentage→PercentageField,
PhoneNumber→PhoneNumberField, Search→SearchBar, Text→TextField, USD→USDField, Metric→MetricCard,
Toolbar→CustomToolbar, Tooltip→StyledTooltip.

Plus the components EXPORTED in this run's audit (see below): Address→IPAddressField, CIDR→CIDRField,
Subnet→SubnetField, Supernet→SupernetField, ExternalIncrement→ExternalIncrementNumberField, CVV→CVVField.
(Content, AccountNumber, CreditCardNumber, RoutingNumber export under names matching their title segment,
so no titleMap entry needed.)

## AUDIT-DRIVEN goobs IMPROVEMENTS executed this run (committed on branch `goobs-ds-readiness`, NOT pushed)

A design-system-readiness audit found these pure wins; all executed + verified (build+lint green, AI-review-hook PASS):
- **Exported 10 built-but-hidden components** from `src/index.ts` (were complete + storied but absent from the
  public barrel → invisible to `window.GoobsFrontend`): Content, IPAddressField, CIDRField, SubnetField,
  SupernetField, AccountNumber, **CVVField** (renamed from all-caps `CVV` — see below), CreditCardNumber,
  ExternalIncrementNumberField, RoutingNumber. They now sync. (Was the old "EXCLUDED" list — no longer excluded.)
- **CVV all-caps trap:** `isComponentName` (dts.mjs) excludes ALL-CAPS exports as constants
  (`/^[A-Z][A-Z0-9_]+$/`), so `export default as CVV` was filtered out (71 comps, 70 previews). Renamed the
  barrel export to `CVVField` (consistent with PasswordField/VLANField/etc.) + `titleMap CVV→CVVField`.
- **Alert fixes** (`src/components/Alert/index.tsx`): defensive guard for undefined-severity icon (prevented the
  "a6 is not a function" crash); icon theme now follows the container theme (was defaulting to sacred-gold).
- **JSDoc** on 14 foundational components → richer generated `.prompt.md`. **SnackbarProps** + **./umd** export added.

## [GENERAL] MetricCard empty-render — `./Card`/`./Accordion` filename false-positive

Symptom: MetricCard preview rendered only card chrome (no icon/value/label/trend). Root cause: the story
`import MetricCard from './Card'` (+ `MetricsAccordion from './Accordion'`) — `exportedComponentFor` matched the
filenames "Card"/"Accordion" to the TOP-LEVEL `Card`/`Accordion` exports and shimmed to those WRONG components.
Fix: `cfg.storyImports.bundle += "/components/Metric/"` → compile Metric's Card/Accordion from source.

## [GENERAL] Popover/RadioGroup `DarkBasic` pairing collision

Symptom: Popover "Dark/Basic Popover" unpaired; RadioGroup "Dark/Basic" rendered a different story's content.
Root cause: each had a `Dark` story NAMED "Dark/Basic" whose squash ("darkbasic") collides with the separate
`DarkBasic` export → the converter's name-pairing mis-paired/dropped one. Fix: renamed the `Dark` story's display
name → "Dark/Default" in both story files (committed). Story-name only.

## Snackbar preview — position:fixed self-dismissing toast

Snackbar is `position:fixed; bottom:20px` (window-anchored) + auto-closes via `setTimeout(autoHideDuration)`.
The card captured it mid-dismiss/off-frame. OWNED preview `.design-sync/previews/Snackbar.tsx` forces every story
`open:true` + `autoHideDuration:600000`, and `cfg.overrides.Snackbar.viewport:"900x240"` frames the bottom toast.
⚠️ LESSON: `autoHideDuration` (or any setTimeout delay) > 2147483647 (32-bit max) OVERFLOWS → fires immediately →
toast closes → blank card. Use ≤ ~600000. Also: a `transform` ancestor did NOT contain the fixed toast in the
capture context (tried + reverted) — the short capture viewport is what frames it.

## [GENERAL] next/* bundled → `process is not defined` → window.GoobsFrontend never set

Symptom: validate `[BUNDLE_EXPORT] 61/61 not a component` + mass `[RENDER] root empty` +
`ReferenceError: process is not defined`. Root cause: the dist externalizes `next/*`, so the
converter's esbuild bundled REAL next/link + next/image from node_modules; those read
`process.env.__NEXT_*` at MODULE SCOPE (unguarded), throwing in the IIFE (no `process` global) →
the whole bundle init throws → nothing on `window.GoobsFrontend`. (jspdf's `process.platform/.hrtime`
are GUARDED by `typeof process` — harmless.)
Fix: `cfg.tsconfig: ".design-sync/bundle-tsconfig.json"` aliases `next/link`/`next/image` to local
stubs (`.design-sync/next-stubs/{link,image}.tsx` — plain `<a>`/`<img>`, matching @storybook/nextjs's
mocks). Can't fork bundle.mjs (app-contract); cfg.tsconfig→tsconfigPathsPlugin is the seam.
⚠️ tsconfig parse gotcha: the converter strips `//` line-comments with a regex that ALSO eats a
`"//"` JSON key → keep bundle-tsconfig.json comment-free, or the paths plugin silently returns null.

## [GENERAL] icon imports → undefined (Icons is a sub-namespace)

Symptom: Breadcrumb `Element type is invalid ... got undefined`; Icons showcase root empty.
Root cause: stories import icons via `../Icons` / `./index` / `../Icons/Send`. The Icons barrel's
last segment matches the EXPORTED namespace `Icons`, so story-imports shimmed it to the top-level
global — but icons live under `window.GoobsFrontend.Icons.<Name>`, so named icon imports came back
undefined. Fix: `cfg.storyImports.bundle: ["/components/Icons/"]` → icon imports compile from source
(tree-shaken). Fixes Icons showcase + Breadcrumb + every icon-importing story.

## [GENERAL] Form `useFormContext` context-identity

Symptom: 3 Form stories `useFormContext must be used inside <Form>`. Root cause: stories import
`useFormContext` from `./context` (a non-component file → bundled from source = a SEPARATE context
instance), while `<Form>` comes from the global bundle → contexts don't share identity. Fix:
`cfg.storyImports.shim: ["/components/Form/context"]` — `useFormContext` IS on the global
(barrel-exported, just camelCase so not in the PascalCase "component" set); the shim's `export *`
re-exposes it from the global, reuniting it with the global Form's context.

## FONTS — shipped via cfg.extraFonts (goobs ships none; consumer provides them)

goobs declares 0 @font-face; `--goobs-font-{standard,sacred,mono}` = Inter / Cinzel / JetBrains Mono
(+ serif Crimson Text/Cormorant Garamond/Merriweather). The consuming app (ThothOS) loads these via
next/font. For a faithful sync I fetched them (Google Fonts, OFL, latin+latin-ext) into
`.design-sync/fonts/` (48 woff2 + fonts.css) and set `cfg.extraFonts`.
⚠️ The reference storybook ships ONLY Storybook's Nunito Sans, so it would render system-fallback while
the bundle shows real fonts → false mismatches. Fix: `.design-sync/inject-reference-fonts.mjs` copies the
woff2 into `sb-reference/goobs-fonts/` + injects @font-face into iframe.html. **RE-RUN IT after every
`storybook build` of the reference** (a rebuild wipes the injection). Verified: Typography renders Cinzel
+ Merriweather correctly on the bundle side.
- **Cascadia Code** ([FONT_MISSING] residual): ACCEPTED SUBSTITUTE — it's only a 4th-level mono fallback
  (`JetBrains Mono, SF Mono, ui-monospace, Cascadia Code, ...`); JetBrains Mono ships and is always used
  first, so Cascadia is never visually reached. Not on Google Fonts. Deliberate, not an oversight.

## [TOKENS_MISSING] --typography-* — BENIGN (verified)

60 `--typography-*` custom props flagged undefined. They're set at RUNTIME by the Typography component
(inline style). Verified visually: Typography renders perfectly (sizes/weights/colors/Cinzel/Merriweather).
Do NOT chase / do NOT set cfg.tokensPkg. Recorded so a future sync doesn't re-investigate.

## GRID_OVERFLOW overrides (presentation)

33 components → `cardMode: column` (stories wider than a grid cell, incl. Content); 5 overlay/portal →
`cardMode: single` (CustomToolbar, DataGrid, PricingTable, Snackbar, Tabs) with a primaryStory.
(The Alert undefined-icon guard committed this run also fixes the root `a6 is not a function` crash that
Snackbar's AllSeverities stories hit.)

## Multi-account targets (TWO claude.ai accounts share this DS)

`config.json.projectId` must be the project on the CURRENTLY logged-in account (the converter only
permits ONE projectId; a foreign-account id 404s). Both project ids live in `.design-sync/project-targets.json`.
RESOLVE at each sync start: `DesignSync(get_project)` each target id; the reachable one is the active
account → set `config.json` projectId to it and sync there. Each account's project updates only when that
account is logged in — switch accounts + re-sync to update the other. (account-A 02a71111… synced 2026-06-30;
account-B 61668feb… is the original, update it by switching accounts.)

## Re-sync risks (watch-list)
- **RE-RUN `node .design-sync/inject-reference-fonts.mjs` after any reference storybook rebuild** — else
  the oracle reverts to system fonts and typography grades go false.
- **Snackbar owned preview** (`.design-sync/previews/Snackbar.tsx`) forces open + `autoHideDuration:600000` +
  relies on `cfg.overrides.Snackbar.viewport "900x240"` to frame the position:fixed toast. If the toast's
  fixed offset or the viewport changes, re-verify the card frames it. NEVER set autoHideDuration > 2^31-1 (overflows→instant close).
- next/link/next/image stubs: if goobs starts using more `next/*` subpaths, add them to bundle-tsconfig.json.
- The 10 newly-exported components (Content + IPAM/Number fields incl. CVVField) are now in the public barrel;
  if a future goobs change removes any, drop its export/titleMap entry.
- Cascadia Code accepted as a system substitute (deep mono fallback); not shipped.
- TransferList "Interactive Demo" accepted as `close` (play-function moves one item; capture-timing, both render correct).
- cfg.cssEntry depends on vite keeping `cssCodeSplit:false` + the `goobs-frontend.css` filename.
- Fonts are latin+latin-ext only, normal style (no italics) — add weights/italics if grading shows gaps.
