# CLASS LINT: missing-accessible-name (2026-07-11)

**Status: SHIPPED — gate green, 0 violations across 464 files**

WCAG **4.1.2** (Name, Role, Value) / **1.1.1** (Non-text Content).

Class-first (T8) follow-up to the per-component a11y audit. The audit found the
"interactive/graphic element with no computable accessible name" shape in **five**
components (IconButton, ListItemCard, Popover, QRCode, Switch), plus the raw
glyph-only buttons the seed module was built from (Alert close `✕`, CodeCopy
`⧉`/`✓`). Per T8 a bug is a CLASS until a script proves it a one-off, so this owns
the class across the WHOLE repo: a detection module + confirmation that every
instance it can statically enumerate is fixed.

Module: `scripts/a11y-lints/missing-accessible-name.ts`
Runner: `bun scripts/lint-a11y.ts --only missing-accessible-name`
(part of `lint:a11y` → `lint:all` — the permanent regression gate).

## The two abstracted logical shapes (statically detectable, near-zero FP)

The class is broad, but only two of its shapes have a low-false-positive STATIC
signature. The module detects exactly those; the rest are runtime-warned or
consumer-owned (see "Sibling shapes" below).

**SHAPE 1 — glyph-only interactive element.** A native `<button>` or `<a href>`
whose STATIC child content is a non-empty run of ONLY glyph / symbol / punctuation
characters (no ASCII letters, no digits, no nested element, no `{expression}`) and
whose opening tag supplies no name mechanism and no prop spread:

```
<button onClick={close}>✕</button>       // U+2715 — the shipped Alert shape
<button onClick={copy}>⧉</button>        // the shipped CodeCopy shape
<a href="#top">↑</a>                      // icon-only link
<button onClick={x}>&times;</button>      // HTML entity counts as a glyph
```

Its computed accessible name is provably empty → a screen reader announces bare
"button"/"link" (or reads the raw glyph as "multiplication x").

**SHAPE 2 — named `<canvas>` with no role.** A `<canvas>` whose opening tag
carries a naming INTENT (`aria-label` / `aria-labelledby`) but supplies no `role`
(and no spread):

```
<canvas aria-label="QR Code for MFA Setup" />   // the shipped QRCode shape
```

Some screen readers ignore an accessible name on a bare `<canvas>` because it has
no name-bearing role, so the text alternative is never announced. The fix is
`role="img"` (or the appropriate graphics role), which makes the supplied name
authoritative. A canvas with NO naming intent is decorative — its home is the
`decorative-content-not-hidden` class (wants `aria-hidden`), not this one — so it
is deliberately NOT flagged here.

## Escape hatches (encoded in the check, never a file ignore-list)

| Shape | Signal | Why it's legitimate |
|---|---|---|
| 1 | `aria-label` / `aria-labelledby` / `title` on the tag | supplies an accessible name (the audit's fix) |
| 1 | prop spread `{...x}` on the tag | may inject a name at runtime |
| 1 | ASCII letters/digits in content (`<button>Close</button>`, `<button>5</button>`) | visible text IS the name |
| 1 | nested element (`<button><Icon/></button>`) or `{expression}` child | icon-component / dynamic shape — name may come from the child's own label; statically unknowable (this is the IconButton shape, delegated to a caller `aria-label` + dev warn) |
| 1 | empty / whitespace-only content | degenerate placeholder, not the glyph shape |
| 2 | explicit `role=` on the canvas | a name-bearing role exposes the name (the QRCode fix) |
| 2 | prop spread `{...x}` on the canvas | may inject a role at runtime |
| 2 | no `aria-label`/`aria-labelledby` | decorative canvas → `decorative-content-not-hidden` class, not this one |

Comments (JSDoc `@example` included) are blanked before scanning, so an example
glyph button is never flagged. String-/brace-aware tag reading means a `>` inside
`onClick={() => f()}` is not mistaken for the tag terminator. Selftest:
**7 bad / 16 good** (all pass).

## Instances (the audited class, across the repo)

| # | Severity | Component | Shape | Status | Note |
|---|----------|-----------|-------|--------|------|
| 1 | serious | Alert `index.tsx` close button | 1 (static) | FIXED (per-component) | `aria-label="Close"` + glyph wrapped `aria-hidden` |
| 2 | serious | CodeCopy copy button | 1 (static) | FIXED (per-component) | `⧉`/`✓` glyph → `aria-hidden`, name via `aria-label` |
| 3 | minor | QRCode `index.tsx` canvas | **2 (static)** | FIXED (per-component) | `role="img"` added so the `aria-label` is authoritative |
| 4 | serious | IconButton | icon-component (runtime) | FIXED (per-component) | JSDoc'd `aria-label`/`aria-labelledby` on props + dev-only `console.warn` when neither supplied |
| 5 | serious | ListItemCard selectable row | name-from-descendants | FIXED (per-component) | `aria-labelledby` → shared `titleId`/`subtitleId` via context |
| 6 | minor | Popover `role="dialog"` surface | role=dialog (runtime) | FIXED (per-component) | dev-only `console.warn` when neither `ariaLabel` nor `ariaLabelledBy` (mirrors Drawer/Dialog) |
| 7 | minor | Switch (no derivable text) | passthrough (consumer) | DOCUMENTED | `aria-label`/`aria-labelledby` passthrough via `...props`; library must not invent a name |

**All seven were fixed by the per-component audit before this class pass ran.** The
extended detection module confirms the whole class is clean: `check()` reports
**0 live violations across 464 files** for both static shapes.

## What this pass added

The seed module (commit `b964838c`) covered SHAPE 1 only. This pass **extended it to
SHAPE 2** (named-`<canvas>`-with-no-role), so the QRCode audit finding is now a
permanent static gate rather than an untested one-off. Verified there are no other
live SHAPE-2 instances: every other `<canvas>` in `src/` is already correct —
Field/Signature (`role="img"` + stateful `aria-label`), Drawer particle layer
(`aria-hidden="true"`), TreeView sacred background (decorative, no naming intent).

No source files required fixing in this pass (0 files) — the class was fully
remediated by the per-component agents; the value here is the permanent
class-detection gate.

## Sibling shapes intentionally NOT statically detected

Instances 4–7 share the CLASS but have no low-false-positive static signature, so
they are out of scope for the module BY DESIGN (already fixed by the per-component
audit). Documented here so a future author knows the boundary rather than
re-deriving it:

- **icon-component button** (IconButton) — the button's child is a nested icon
  element/`{expression}`, so the name may legitimately come from a caller
  `aria-label`; flagging statically would false-flag every correct icon button.
  Enforced instead by a dev-only `console.warn` at runtime + stories.
- **`role="dialog"` surface with no name** (Popover, and its siblings
  Drawer/Dialog) — the name legitimately comes from a runtime `ariaLabel` /
  `ariaLabelledBy` prop, so it is statically unknowable. Enforced by a dev-only
  `console.warn` when the dialog opens nameless.
- **name computed from all descendants** (ListItemCard's `role="button"` row) — a
  "name is too broad," not "name is absent," problem; not a static-signature bug.
  Fixed with `aria-labelledby` pointing at the title/subtitle via context.
- **no derivable text** (Switch) — a bare toggle with no labels has nothing to
  derive a name from; the library must not invent one. The `aria-label` passthrough
  is the correct source; documented as consumer responsibility.

goobs `<Button>`/`<IconButton>` are likewise not linted here (their name may come
from `text=` / `children` / `icon` + caller `aria-label` / a spread); their
name contract is enforced by the dev warn + stories, not this source lint.

## Verification

- `bun scripts/lint-a11y.ts --only missing-accessible-name` → **clean, 464 files**;
  selftest 7 bad / 16 good all pass.
- Both static shapes confirmed fixed in source: Alert (`aria-label="Close"` +
  `aria-hidden` glyph) and QRCode (`role="img"` + `aria-label`).
- The detection module is under `scripts/` (outside the app eslint scope, like
  every sibling a11y-lint module); its own selftest is its gate and passes.

## Deferred (files not owned)

None. Every statically-enumerable instance of the class was already fixed in code
this class-lint owner is authorized to touch, and the extended module reports zero
remaining. No shared-util / FieldShell / barrel / `src/styles` change was required.
