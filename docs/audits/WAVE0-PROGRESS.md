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

## IN FLIGHT
- Workflow `goobs-wave0-story-sweep` (run wf_b6668d5e-c21, task w963t0ird): 85 agents,
  one per tracked story file. Per file: `@storybook/react`→`@storybook/nextjs` import,
  remove per-meta autodocs tags, `parameters.backgrounds.default`→story `globals`,
  alert()→fn() spies, remove ONLY eslint-flagged redundant `name:` annotations.
  Each agent self-verifies `bunx eslint <file> --max-warnings=0` (no --fix) exits 0.

## NEXT (in order)
1. Sweep completes → central gates: grep guards = 0 (excl. 3 peer files),
   `bun run lint:stories`, `bun run lint`, `bun run typecheck`, `bun run lint:css`,
   `bun run build-storybook` → `storybook-static/index.json` must contain
   `"type": "docs"` entries > 0 (was 639 stories / 0 docs).
2. Commit 1 = setup core (package.json, bun.lock, .storybook/*, vercel.json).
   Commit 2 = 85-file sweep + eslint.config.mjs guards (guards land green with the sweep).
3. Chromatic full re-baseline run is USER-gated (needs project token; every snapshot
   changes deliberately). Note in final report.

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
