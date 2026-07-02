# Wave 0 — setup re-baseline — PROGRESS

Spec: `docs/audits/story-jsdoc-standard-proposal.md` §1.2 + §3 Wave 0 + §4.3.
Audit: `docs/audits/story-jsdoc-audit-2026-07-01.md`.

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
