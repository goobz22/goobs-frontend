# Story + JSDoc program — COMPLETE (2026-07-02)

Spec: `docs/audits/story-jsdoc-standard-proposal.md`.
Audit: `docs/audits/story-jsdoc-audit-2026-07-01.md`.

## ✅ PROGRAM COMPLETE — all six waves + guards, every gate green

**Final state:** typecheck (root + stories) 0 · lint 0 (incl. live
eslint-plugin-storybook + eslint-plugin-jsdoc rules) · lint:css 0 ·
lint:stories 0 · lint:styles-props 0 (33 interfaces, every key read or
@deprecated) · lint:coverage 0 (152 barrel exports, 95 story files, 0
uncovered, no duplicate titles) · vite dist build ✓ · storybook build ✓ at
**95 docs pages + 844 stories** (pre-program: 639 stories, 0 docs pages).

**Wave summary (commits on `production`):**
- **W0** setup re-baseline: addon-docs installed (autodocs was fully inert),
  brand fonts load, SB10 canvas/theme toolbar + global data-theme decorator,
  vercel builds on deploy, 85 story files migrated off 3 dead/banned APIs,
  eslint story guards. `5ecf864` `c9f63d4`
- **W1** stories entered the type gate (tsconfig.stories.json): 34 phantom-prop/
  handler errors fixed; 4 real component bugs fixed with regression stories
  (Tabs aria-controls, Snackbar autoHide-0, Typography outline+merri fonts,
  TreeView invisible sacred glyphs); 3 lying story files made truthful.
  `ce3291d` `06cbd75` `7a25616`
- **W2** documented-but-inert API made extinct: ~200 props deleted/implemented/
  @deprecated across 20+ dirs (all adversarially verified), incl. Button's
  outline inversion + IconButton/CodeCopy shipped phantom hovers; the
  styles-key-is-read guard now enforces it in lint:all. `e555afa`→`f9926b6`
- **W3** coverage closed: 7 new + 5 extended story files (Card compound family,
  Form wrappers, InlineForms, SacredGlyphs, form-binding regression net, …);
  4 more component bugs found+fixed (Card asChild crash, dead
  onCompositeFieldSave, read-permissions not blocking edit); coverage gate
  live. `4bcd8c0` `cf7716d` `ec1373a`
- **W4** themes + taxonomy: dedicated sacred/dark stories for every gap the
  component supports; titles normalized (Primitives/* gone, collisions
  resolved); all 62 story files renamed <ComponentName>.stories.tsx.
  `ca66496` `c53126a`
- **W5** JSDoc debt: member docs across the exported Props/Styles surfaces
  repo-wide, detached banners attached, ~45 barrel type exports added,
  truth-checked against code. `54a6261` `5df9be3` `3dc4646`
- **W6** the net wired: play assertions fixed, test-runner + addon-a11y,
  .github/workflows/chromatic.yml (typecheck→lint:all→build→storybook→
  chromatic), prepublishOnly gate, jsdoc lint live. `1d5da90` `142eed8` `ccb3f12`

**USER-GATED leftovers:**
1. **Push** — ~30 commits on local `production`; the auto-mode classifier
   blocks direct push for this repo. Say "push it" or push manually.
2. **Chromatic** — full re-baseline run needs CHROMATIC_PROJECT_TOKEN (repo
   Actions secret + local run; every snapshot deliberately changed in W0).
3. **Peer files** — 3 untracked story files (Card, FilterSection,
   MetricsAccordion) have documented carve-outs in eslint.config.mjs +
   tsconfig.stories.json; remove when their author commits + migrates them.
4. **Component-side theme debt** (honest gaps, NOT faked in stories):
   DetailField/Panel/FieldGrid have no theme system; TransferList caps at
   sacred|light; Dialog's dark CSS unreachable; MoneyText empty-state color
   invisible on light. Each needs component work before theme stories.
5. **C3 delete candidates kept pending owner decision:** utils `css` (zero
   consumers) + `formatters.ts` (zero consumers, now fully documented).
6. ThothOS side: dist was rebuilt several times — clear
   `ThothOS-production/.next-test` before the next seeded test-stack start.

---

# Wave 0 — setup re-baseline — PROGRESS (history)

## DONE
- Installed `@storybook/addon-docs@10.4.6` + `eslint-plugin-storybook@10.4.6` (devDeps).
- `package.json`: moved `storybook` + `@storybook/addon-links` deps→devDeps; removed
  `@storybook/addon-onboarding`; deleted dead `eslintConfig` block; added `lint:stories`
  + `chromatic` scripts; `lint:all` now includes `lint:stories`. Lockfile synced.
- `.storybook/main.ts`: addons = [addon-links, addon-docs] (docs pages now render).
- `.storybook/preview.tsx`: fonts import (`../fonts/goobs-fonts.css`), SB10
  `backgrounds.options` (sacred #0e0e0e / light #fff / dark #111827), theme toolbar
  (`globalTypes.theme`), `initialGlobals` sacred/sacred, global `data-theme` decorator.
- `vercel.json`: builds storybook on deploy (`bun install` + `bun run build-storybook`)
  instead of serving the stale pre-built `storybook-static/`.
- `eslint.config.mjs`: removed `.storybook/**` ignore; added storybook flat/recommended
  + Wave-0 bans (backgrounds.default, per-meta autodocs tag, alert/confirm/prompt) with a
  documented R13 carve-out for the 3 peer-owned untracked story files
  (Card/card.stories.tsx, Filter/Section/filterSection.stories.tsx,
  Metric/Accordion/metricsAccordion.stories.tsx — remove carve-out when peer commits).
- FAIL-FIRST evidence captured (pre-sweep): 88 files failing — 272 no-restricted-syntax,
  370 storybook/no-redundant-story-name, 88 storybook/no-renderer-packages,
  26 no-restricted-globals.

## WAVE 0 COMPLETE (2026-07-01) — commits on `production`
- `5ecf864` setup re-baseline (addon-docs, fonts, SB10 globals/toolbar, vercel, deps)
- `c9c32f5` 85-file story sweep + eslint guards (86 files, +443/−1145)
- storybook-static rebuild + docs/audits commits follow.
- Sweep execution note: 34 files by workflow agents (run wf_b6668d5e-c21; 51 agents
  died on session limit but ~11 had already written their edits), remainder by
  deterministic codemods (scratchpad wave0-codemod.ts / wave0-shapeb.ts /
  remove-redundant-names.ts) + 5 hand-edited alert()→fn() sites.
- VERIFIED: lint:stories 0, repo lint 0, tsc 0, build-storybook green,
  index.json = 88 docs + 780 stories (docs were 0), 48 woff2 font assets bundled,
  banned patterns grep = only the 3 peer files (carved out, documented).

## Known-open (not Wave-0 scope)
- `bun run lint:css` PRE-EXISTING red at HEAD: 138 stylelint errors
  (formatting class, 99 auto-fixable) across ~20 .module.css — untouched by
  Wave 0 (0 css files modified). Separate fix-forward commit candidate.
- Pre-commit AI review hook HANGS and fails open (nested claude hit the same
  session token limit) — commits landed unreviewed; re-review when limit resets.
- Chromatic full re-baseline run is USER-gated (needs project token; every
  snapshot changes deliberately).
- storybook-static remains git-tracked (rebuilt fresh); untracking is a later-wave
  decision now that Vercel builds on deploy.

## WAVE 1 — COMPLETE (2026-07-01 late evening) — commits on `production`
- `ce3291d` type gate (tsconfig.stories.json into typecheck) + all 34 flagged errors
  fixed (12 files; 1 justified widening: TextFieldProps.error includes undefined,
  mirroring FormFieldBinding).
- `06cbd75` four component bugs fixed + regression stories (Tabs aria-controls via
  shared tabPanelId + play assertion; Snackbar autoHideDuration 0 = never hide +
  Themes/* stories now really themed; Typography outline inversion + merri*→
  Merriweather; TreeView SACRED_GLYPHS particles + first Themes/Sacred story).
  All 7 verified CORRECT by adversarial agents, 0 repairs.
- `7a25616` story-truth fixes (Popover any-mask removed, ProjectBoard phantom args +
  required data so Manage doesn't crash, CTE ModeSwitching remounts per mode).
- VERIFIED: typecheck (both configs) 0, lint 0, lint:stories 0, vite dist build ✓
  (dist rebuilt for the ThothOS symlink — clear ThothOS .next-test on next test-stack
  restart), build-storybook ✓ (88 docs + 782 stories).
- INCIDENT during gates: the interrupted stylelint --fix pass had lowercased
  `composes: editorArea`→`editorarea` in ComplexTextEditor.module.css, breaking the
  vite build (working-tree only; HEAD was never broken). Repaired in-tree (one line);
  css pass remains uncommitted/deprioritized. Wave-2 note: Button outline-inversion
  (same class as Typography's, Button/index.tsx ~302-306) still open.

## WAVE 2 — COMPLETE (2026-07-02 ~01:00) — commits on `production`
Batches 1-5 (below) + `f1071e9` batch 6 (the 7 wholesale surfaces via workflow
wf_70e3b650-a4c — ALL 7 verified CORRECT: 95 del / 20 impl / 15 left-as-read)
+ the loop-until-dry final: the new styles-key-is-read guard found 40 more
definite-dead keys (FormFieldStyles+CTE mirror 9 each, CTE 10, DataGrid 4,
Drawer 4, Icons 2, BigCalendar 2) — deleted, guard now GREEN over all 33
exported *Styles interfaces and wired into lint:all as lint:styles-props.
lint:coverage script committed, wired into package.json but NOT lint:all yet
(goes live end of Wave 3). Total inert-API class: extinct + guarded.
NOTE: dist rebuilt during gates; ThothOS .next-test clear needed on next
test-stack restart. Chromatic re-baseline still user-gated.

## WAVE 3 — COMPLETE (2026-07-02 ~11:45) — commits on `production`
- `4bcd8c0` component bugs the coverage stories exposed: Card asChild context
  crash; DataGrid onCompositeFieldSave dead API wired end-to-end; read
  permissions now block desktop editing + write verbs gated.
- `cf7716d` 7 new story files + 5 extended (all adversarially verified;
  glyphs-and-utils repaired once): CardFamily (25 subcomponents),
  FormDataGrid/FormProjectBoard, InlineForms, SacredGlyphs, alpha, Chip pill
  tones, DataGrid composite + read-only, FormBoundFields (8 Tier-1 bindings in
  one <Form>), Panel fullscreen, Tooltip open bubbles, Stepper wizard.
- `ec1373a` coverage gate GREEN (152 exports / 95 files / 0 uncovered) and in
  lint:all; matcher handles default-alias/compound-dot/meta-title forms;
  storybook-static rebuilt: 95 docs + 834 stories (was 639/0 pre-program).
- NEXT: Wave 4 (themes + taxonomy renames), Wave 5 (JSDoc), Wave 6 (plays/CI).

## WAVE 2 — history (2026-07-01→02 overnight)
Program: delete-or-implement the audit's inert props per dir (verify inertness →
grep ThothOS consumers → delete/implement/@deprecate → story exercises implemented
keys → tsc both + eslint + stylelint). Session token limit killed 25/26 workflow
agents (resets 3:10am; resume: Workflow scriptPath goobs-wave2-inert-props +
resumeFromRunId wf_6b948823-532 — only TreeView + verifier cached).
- DONE (committed): `e555afa` batch 1 TreeView(46 keys, verified CORRECT) +
  AppBar(6) + Fade/Slide/Zoom(3 each); `28c3505` batch 2 Switch(5 del + JSDoc
  truth) / Pagination(color phantom del; gap/padding impl) / Alert(3 impl) /
  Avatar(border impl) / Metric(height impl); `be40516` batch 3 CodeCopy(phantom
  hovers fixed + clipboard API + animationDuration del) / CTE(showToolbar impl) /
  ProgressBar(aria-required + outline del). Also `b878b56` css pass green,
  `98a8aca` README truth, `ce3291d/06cbd75/7a25616/c9f63d4` Wave 1.
- REMAINING Wave-2 dirs (13): Toolbar(~34/35), ConfirmationCodeInput(~56/74),
  QRCode(17/27 + onSecretGenerated), Button(outline inversion + secondary/
  destructive stories), IconButton('&:hover' phantom), Table(styles ignored),
  Stepper(4, careful: required stepNumber), BigCalendar(height/width impl;
  availableEventTypes/Statuses del), MenuItem(dense/divider/selected impl),
  RadioGroup(showGlyph + sacred-default JSDoc lie), PricingTable(defaultBilling
  impl), List(dense on 3 subs), Tabs(TabProps.styles).
- Scripts READY, not yet wired: scripts/lint-story-coverage.ts (46 uncovered now;
  needs Card.X alias handling for compound usage) + scripts/lint-styles-props-read.ts
  (304 hits pre-Wave-2; wire as lint:jsdoc-surface AFTER Wave 2 + tune false
  positives). Wire into lint:all + package.json when green.
- THEN: Waves 3 (coverage), 4 (themes+taxonomy renames incl. PascalCase story
  files two-step git mv), 5 (JSDoc debt), 6 (interaction net + alert() removal
  done already + CI: .github/workflows chromatic + test-runner). Standing user
  order: FINISH EVERYTHING, don't stop. Push still user-gated (classifier).

## WAVE 1 — original plan (kept for context)
- DONE: `tsconfig.stories.json` created (stories + .storybook typecheck; 3 peer files
  excluded with R13 comment); `typecheck` script now runs both configs.
- FAIL-FIRST evidence: gate flags 34 errors across 12 story files (phantom props,
  e.target-on-string handlers, exactOptionalPropertyTypes, unchecked index).
- IN FLIGHT: workflow `goobs-wave1-typegate-fixes` (run wf_e2e83848-813, task wpskj3ld5):
  12 type-fix agents (one per broken file) + 7 bug/truth agents (Tabs aria-controls,
  Snackbar autoHide-0 + fake theme stories, Typography outline inversion + merri* font
  lie, TreeView empty sacred glyph, Popover CustomPosition, ProjectBoard phantom args +
  crash, CTE ModeSwitching) — each bug fix adversarially verified + repair round.
- THEN (central, after workflow): bun run typecheck (both configs) + lint + lint:stories
  + build-storybook + `bun run build` (component files changed → dist rebuild for the
  ThothOS symlink; remember ThothOS .next-test clear on next test-stack restart).
  Commits: (1) tsconfig.stories.json + typecheck script + type-fixed stories;
  (2) component bug fixes + their regression stories; (3) story-truth fixes.
- ALSO in working tree, UNCOMMITTED + deprioritized (user interrupted the pass):
  stylelint --fix leftovers across ~20 .module.css (pre-existing lint:css debt,
  partially auto-fixed, ~54 errors remained incl. :global pseudo-class and duplicate
  overflow-wrap). Do NOT stage css files into Wave-1 commits.

## Decisions already made (do not re-litigate)
- argTypes-description ban DEFERRED to Wave 5 (docgen descriptions must exist on props
  interfaces first, else docs get worse; one-fact-one-home needs the home built first).
- eslint-plugin-jsdoc DEFERRED (proposal says warn-in-Wave-0, but `--max-warnings=0`
  makes warn=fail; lands with Wave 5 per-dir ratchet instead).
- `storybook/no-renderer-packages` (88 files) folded into this sweep via the import swap;
  `@storybook/nextjs` re-exports all of `@storybook/react` (verified line 4 of its d.ts).
- Redundant `name:` removals folded in (behavior-neutral; eslint-flagged lines only).
- Peer files NEVER edited (R13); `.design-sync/config.json` modification is peer's — do
  not stage it.
