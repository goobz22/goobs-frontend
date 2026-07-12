# CLASS LINT: icon-missing-aria-hidden (2026-07-11)

**Status: SHIPPED — gate green, 0 violations across 464 files (selftest 6 bad / 13 good).**

WCAG **1.1.1** (Non-text Content, Level A).

Class-first (T8) ownership of the "decorative icon exposed to assistive tech"
class across the WHOLE repo: a detection module plus the fix of every instance it
reports. The per-component audit found this shape in 5 components (Form, Panel,
QRCode ×2, Switch) — but the *shape* recurs in two concrete forms, so the module
detects both.

Module: `scripts/a11y-lints/icon-missing-aria-hidden.ts`
Runner: `bun scripts/lint-a11y.ts --only icon-missing-aria-hidden`
(part of `lint:a11y` → `lint:all` — the permanent regression gate).

## The abstracted logical shape (two forms, one class)

A decorative icon that reaches the accessibility tree with no `aria-hidden` and no
accessible name — announced as stray noise, or double-announcing state already
exposed elsewhere:

- **(A) inline `<svg>`** — a hand-authored `<svg …>` (NOT a goobs `<Icon>`) whose
  opening tag exposes no a11y intent and which has no child `<title>`.
- **(B) decorative Unicode icon-GLYPH rendered as literal JSX TEXT** — an Egyptian
  hieroglyph (`𓊹 𓊗 𓊨`), a check/cross dingbat (`✓ ✕`), a geometric caret/shape
  indicator (`▲ ▼ ◆ ●`), a sparkle/star (`✦ ★`), or a UI symbol (`⚙ ⚡ ☰ ⧉`) sitting
  naked in the reading order.

Form (A) was already the pre-existing module (commit `ae579593`, the svg detector).
This pass **extended** it with form (B) — the glyph nature of the QRCode `𓊹` and
Switch `✓`/`𓊹` audit findings, which no existing lint enumerated repo-wide.

**Why (B) is content-scoped (by codepoint), not className-scoped:** the sibling
`decorative-content-not-hidden` lint catches decorative elements by their CSS-module
class name (`.glyph`, `.shimmer`, `.separator`, …). A glyph in an element whose class
is *not* a recognised decorative token (e.g. an ad-hoc inline-styled `<span>`) slips
past it. Matching the glyph CODEPOINT itself closes that gap and is complementary,
not duplicative.

**Directional arrows (`→ ← ↑ ↓ ↗ ↘ ⇄ …`) are DELIBERATELY EXCLUDED** from the
decorative set: they routinely appear as *meaningful* JSX text (e.g.
`ShowTask/inline.tsx:1740` renders `{oldValue} → {newValue}`), so flagging them
would cry wolf. The decorative arrows that do exist are already covered by the
escape hatches below.

## Escape hatches (encoded in the check, never a file ignore-list)

An icon is NOT flagged when it, **or any ANCESTOR element**, conveys intent — a
tag-stack walk propagates coverage down the whole chain (this is the common goobs
pattern: a decorative wrapper `aria-hidden`s a subtree, e.g. SacredGlyphFrame's
`.glyphRow`, RoutingNumber's `.adornment`, DataGrid MobileCardView's
`.selectionIndicator`):

| Signal | Why it's legitimate |
|---|---|
| `aria-hidden` (any value except explicit `false`) | decorative — the standard fix |
| `aria-label` / `aria-labelledby` | a real accessible name (meaningful icon, or a labelled host whose name suppresses the glyph — Card `↑↓`, ListItemCard `✕`) |
| `{...svgA11y}` spread | the goobs Icon resolver (`resolveIconA11y`) owns aria-hidden/role at runtime — the whole 261-icon family passes with no ignore-list |
| `role="img\|presentation\|none"` and interactive roles (`button\|link\|menuitem\|tab\|option\|checkbox\|radio\|switch`) | named / presentational / a naming host |
| host element `<button>` / `<a>` | the glyph is suppressed by the host's real name, or IS the intended name (a *missing-accessible-name* concern, not this one) |
| child `<title>` (svg only) | the correct inline-SVG accessible-name mechanism |

**Masking:** block/line comments and single/double/back-quoted string literals are
blanked (length + newlines preserved) before scanning. So a glyph living in a
STRING (a `text` prop, a lookup-table value, a function's returned string) or a
comment never produces a finding — which is correct, because those are covered
elsewhere: CodeCopy `text={'✓'/'✕'/'⧉'}` rides a `<Button aria-label="Copy code">`;
Switch's `getThumbContent()` returns a string rendered inside an already-`aria-hidden`
`.thumb`; the DataGrid `valid:'✓'`/`expired:'✕'` lookup values render into hidden
cells. A JSX-text scan neither catches nor should catch those.

**Line-number fix:** extending the module surfaced a latent bug in the shared
`maskNonCode` — the template-literal mask blanked *inner newlines*, so a multi-line
`<style>{`…css…`}</style>` collapsed newlines and shifted every subsequent
glyph/svg line number (the DataGrid `▲` reported as :338 instead of :343). Fixed to
blank only non-newline characters. This also hardens the pre-existing (A) svg
line-reporting.

## Instances

| # | Form | Severity | File:line | Status | Note |
|---|------|----------|-----------|--------|------|
| 1 | (A) svg | minor–moderate | Accordion, Alert, BigCalendar, Button, Checkbox, Chip, ComplexTextEditor, ConfirmationCodeInput, DataGrid | FIXED (per-component, pre-existing module `ae579593`) | every hand-authored decorative `<svg>` → `aria-hidden`/name; goobs Icons structurally covered by `svgA11y` |
| 2 | (B) glyph | moderate | DataGrid/Table/Rows/index.tsx:343 | **FIXED (this pass)** | decorative `▲` "large-amount" value-indicator — announced "up-pointing triangle" before the amount; `aria-hidden="true"` added (the amount itself is rendered separately) |

**Instance 2 is the only live violation form (B) surfaced across the whole repo.**
The file uses the sanctioned DataGrid per-cell data-driven inline styles (see
`.claude/rules/goobs.md` §1), so the surgical fix is `aria-hidden="true"` on the
glyph span — no markup element changed, no `data-*`/`role`/`aria` attribute removed
or renamed; the machine-test selector contract is untouched.

## The 5 audit findings — verified already fixed

All fixes from the per-component audit are present and now guarded:

- **Form** — FormDataGrid `.shimmer` / FormProjectBoard `.topShimmer/.bottomShimmer/.underline`: EMPTY decorative divs (no text/glyph), leak nothing; `aria-hidden` added as hardening. Not form (A) or (B) (no svg, no glyph content).
- **Panel** — `ArrowBackIcon` (a goobs `<Icon>`): its inner `<svg>` is decorative-by-default via `svgA11y`; the callsite also passes `aria-hidden`. Covered.
- **QRCode** — `𓊹` in `<span className={cssStyles.glyph} aria-hidden="true">` (`index.tsx:334`) + `CheckCircle` icon with explicit `aria-hidden`. Covered by form (B)'s aria-hidden hatch AND by `decorative-content-not-hidden`'s `.glyph` token.
- **Switch** — `.thumb` glyph (`✓`/`𓊹`) and `.shimmer` both `aria-hidden` (`index.tsx:204,212`). Covered (see Deferred re: regression gate).

Confirmed at zero violations after the DataGrid fix.

## Regression gate

The **lint module itself is the regression test** for this class (per T8 —
script-first, wired into `lint:all`). Removing `aria-hidden` from the DataGrid `▲`
span re-fails `bun scripts/lint-a11y.ts` immediately (verified: it reported
`Rows/index.tsx:343` before the fix). This is stronger and cheaper than a Storybook
play-assertion for a static decorative-hide, and it enforces the invariant repo-wide
rather than for one rendered cell. The module's selftest (6 bad / 13 good) is its own
committed gate.

## Verification

- `bun scripts/lint-a11y.ts --only icon-missing-aria-hidden` → **clean, 464 files**, selftest OK.
- `bun lint:file src/components/DataGrid/Table/Rows/index.tsx` → exit 0.
- The detection module lives under `scripts/` (outside the app eslint scope, like
  every sibling a11y-lint module); its selftest is its gate and passes.

## Deferred (files I do not own)

1. **`scripts/a11y-lints/decorative-content-not-hidden.ts`** (peer-owned; currently
   in-flight / `M`) — recommend adding **`thumb`** to its `DECORATIVE_TOKENS`.
   Rationale: the Switch thumb glyph comes from `getThumbContent()` (a *returned
   string*, `Switch/index.tsx:158-162`), so it is NOT literal JSX text and form (B)
   here cannot see it; and `.thumb` is not currently a recognised decorative token,
   so `decorative-content-not-hidden` misses it too. The instance is fixed today
   (`aria-hidden` on the `.thumb` div, `index.tsx:212`) but has **no regression
   gate**. `thumb` is a purely-presentational affordance name (a switch/slider
   thumb), so it fits that module's className-scoped model. Suggested change: add
   `'thumb'` to the `DECORATIVE_TOKENS` array (~line 55) and a bad/good selftest pair.
   I did not edit it (not my module; peer has uncommitted edits).
