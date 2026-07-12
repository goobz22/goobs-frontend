# a11y campaign — live status (updated 2026-07-11 10:00pm)

**⭐ EVERY REPO GATE GREEN (verified runs, not agent claims):** `bun run typecheck` ✅ ·
**`bun run lint:all`** ✅ (eslint · stylelint · lint:stories · lint:styles-props ·
lint:coverage · **lint:a11y with all 24 class-lint modules, selftests OK, 0 violations /
464 files**) · **`bun run build`** ✅ (1391 modules, dist rebuilt) — i.e. the full
`prepublishOnly` chain passes. All 71 batch items are through audit → adversarial verify
(→ re-fix where the verifier objected). Wave-2 discovery gates 7/7 COMPLETE: data-component
roots, **data-action on 108 controls across 33 files**, overridable testids, SSR hydration
(locale formatting + useId), theme-literal token swaps, public-ref lint, 3 walls.

**Remaining (final wave, queued for subagent quota ~1am):** Field/Shell serial audit
(Form's auditor already verified its error/label ARIA correct read-only), the handful of
still-open cross-component deferred items (Tabs route-tab product decision, ListItemCard
composition restructure behind the Chromatic gate, Dropdown ariaLabel prop, shared
focus-ring token contrast), completeness critic vs the 59-dir matrix, npm version
bump + publish (operator-gated).

Rolling status of the full-repo accessibility retrofit (hearing / reading-screen-reader /
SEO-semantic) + class-first lint gating. Per-component detail: the sibling
`<Component>.md` files in this directory. Discovery-sweep gate plan:
`docs/audits/gateable-classes-discovery-2026-07-11.md`.

## Scoreboard

| Metric | Value |
|---|---|
| Issues found (WCAG-cited, file:line) | **297** |
| Fixed at root cause + story-pinned | **270** |
| Work items through audit → adversarial-verify → re-fix | **65 / 72** (7 re-running after the 5:50pm session-limit reset) |
| Self-testing class-lint modules landed in `scripts/a11y-lints/` | **23** |
| Class lints already driven green | 18 |
| Commits (pushing to GitHub as batches land) | 247+ |

## Per-batch

| Batch | Components | Issues | Fixed | State |
|---|---|---|---|---|
| 1 — Accordion→FileDropzone | 24/24 | 127 | 113 | 12 class lints green; DataGrid re-fix + 2 lints + gate loop re-running |
| 2 — Filter→Table | 21/24 | 73 | 69 | Pagination/RadioGroup/ProjectBoard audits + 7 re-fixes + gates re-running |
| 3 — Tabs→Zoom, Icons, Field subs | 20/23 | 97 | 88 | Field-Password/Tooltip/Field-Dropdown audits + 11 class lints + gates re-running |
| Wave-2 discovery gates | 3/7 green | — | — | data-component roots ✅, overridable testids ✅, 3 cheap walls ✅; data-action/SSR/token-leak/refs re-running |

## Top recurring issue classes (audit-found, cross-batch totals)

missing-reduced-motion (47) · missing-focus-visible-style (36) · missing-accessible-name (31) ·
icon-missing-aria-hidden (22) · status-not-announced (19) · nonsemantic-heading (13) ·
color-only-state (12) · clickable-noninteractive-element (6+) · missing-keyboard-arrow-nav (4) ·
form-error-not-associated (3) · toggle-missing-aria-pressed (3) — each is/becomes a permanent
self-testing module in `scripts/a11y-lints/`, wired into `lint:all` via `lint:a11y`.

## Remaining (in order)

1. Re-runs in flight: 6 audits, ~10 re-fixes, ~13 class-lint builders, 3×3 gate rounds, 4 wave-2 gates.
2. Final wave (shared files, serialized on purpose): Field/Shell audit + the 67 deferred
   cross-component items (Typography `as` prop, ToggleButtonGroup label, Tooltip focus-open,
   Button default `type`, Icons aria-hidden default…), global reduced-motion reset in
   `global.css`, full `typecheck` + `lint:all` + `build` green-loop, completeness critic
   (every dir has a report, every pattern has a lint), final push.
3. Known repo nit queued for the final wave: `bun typecheck:file` is broken (TS5112 — tsc
   won't load tsconfig with a file arg); agents fell back to `lint:file` + batch typecheck.
