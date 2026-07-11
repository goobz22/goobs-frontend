# CodeCopy — a11y audit (2026-07-11)

**Status:** FIXED

**Component:** `src/components/CodeCopy/index.tsx` — a code-snippet display block with
syntax highlighting (highlight.js), an optional line-number gutter, a language label, and a
copy-to-clipboard button. Consumes the shared goobs `Button` for the copy control.

## APG pattern

Not a composite widget. It is a **static region containing a single "copy" action button plus
a status message**. The relevant WAI-ARIA guidance is therefore the **Button** pattern (for
the copy control) + the **live-region / status message** technique (WCAG 4.1.3) for the copy
confirmation. There is no menu/listbox/dialog/grid keyboard model to implement — the only
interactive element is the copy button, reachable by Tab and activated by Enter/Space
(native `<button>` semantics, provided by the goobs `Button`).

## Issues found

| # | Severity | WCAG | Location | Issue | Status |
|---|----------|------|----------|-------|--------|
| 1 | Critical | 1.1.1, 4.1.2 (A) | `index.tsx:173` | Copy button's only content is a bare `⧉` / `✓` glyph → **no accessible name**. Screen readers announce nothing meaningful. | **FIXED** |
| 2 | Serious | 4.1.3 (AA) | `index.tsx:126-128` | Copy success is conveyed **only** by the visual glyph swap `⧉`→`✓`; no live region, so assistive tech is never told the copy happened. | **FIXED** |
| 3 | Serious | 2.4.7 (AA) | `index.tsx` copy `<Button>` | Copy button has **no visible keyboard-focus indicator**. Root cause was library-wide (shared `Button` had `outline: none` with no `:focus-visible`). **The shared `Button` now ships its own complete, theme-aware focus-visible outline ring** (Button.module.css `:focus-visible` sacred/light/dark, commits `5f4ce6a7`+`21fb5db6`), so the copy button is covered upstream. | **FIXED upstream** (local redundant ring removed — see Issue 10) |
| 4 | Moderate | 1.3.1 (A) | `index.tsx:206-212` | Decorative line-number `<div>`s ("1 2 3 4 …") are read into the code's reading order, polluting it for screen-reader users. | **FIXED** |
| 5 | Minor | 2.3.3 (AAA) | `CodeCopy.module.css:25` | `.container` has an `all` `transition` with no `prefers-reduced-motion` opt-out. | **FIXED** |
| 6 | Minor | 3.2.2 (A) robustness | `index.tsx:172` | Copy `<button>` had no explicit `type`; inside a `<form>` it would default to `type="submit"` and submit the form on copy. | **FIXED** (set `type="button"`) |
| 7 | Moderate | 2.1.1 (A) | `CodeCopy.module.css:264` / `index.tsx` `<pre>` | Adversarial-review find: the `<pre>` is an `overflow:auto` horizontal-scroll container (wide lines clip) with no `tabindex`, so the scroll region is **not keyboard-focusable** — a keyboard-only user cannot scroll to read clipped code (axe `scrollable-region-focusable`). | **FIXED** |
| 8 | Minor | 4.1.3 (AA) failure branch | `index.tsx:130-131` | Adversarial-review find: `navigator.clipboard.writeText(...).then(markCopied)` had **no `.catch`**; a rejected write fired neither the ✓ glyph nor a live-region announcement, so a screen-reader user is falsely told nothing failed. | **FIXED** |
| 9 | Housekeeping | — | `CodeCopy.module.css:180` | Pre-existing stylelint error in the owned file: `.srStatus` used the deprecated `clip: rect()` (would block the `lint:css` gate). | **FIXED** (→ `clip-path: inset(50%)`) |
| 10 | Moderate | 2.4.7 (AA) | `CodeCopy.module.css` `.copyButtonSlot button:focus-visible` | Adversarial-review-2 find: after the shared `Button` gained its own `:focus-visible` **outline** ring, the CodeCopy-local `.copyButtonSlot button:focus-visible` **box-shadow** ring became REDUNDANT — the copy button rendered a **DOUBLED** focus indicator (outline + box-shadow). | **FIXED** (local ring removed; Button's ring is the single source) |
| 11 | Minor | 4.1.2 (A) noise | `index.tsx` `<pre>` | Adversarial-review-2 find: the `<pre>` was UNCONDITIONALLY `tabIndex=0` + `role="group"` + `aria-label`, so EVERY snippet — including narrow ones that never overflow — was a keyboard tab stop and announced "group, `<lang>` code". Over-application of the Issue-7 scroll-region fix. | **FIXED** (attrs gated to measured horizontal overflow) |

## Hearing

Grepped the component for `new Audio`, `AudioContext`, `<audio>`, `<video>`, and
`navigator.vibrate` — **none present**. No information is conveyed by sound. The copy result
is now conveyed three ways (visual glyph, programmatic live-region text, and a stable button
name), so there is no audio-only channel. **No hearing-impaired issues.**

## Reading & screen reader

- **Accessible name (Issue 1, WCAG 1.1.1 / 4.1.2):** the copy button now carries a stable
  `aria-label="Copy code"`. The goobs `Button` forwards native/ARIA attributes to the
  rendered `<button>` (`Button/index.tsx:292-295`, `398-402`, spread at `602`), so the
  label lands on the element and overrides the glyph for the accessible-name computation.
  The name is intentionally kept **stable** (not mutated to "Copied") so it doesn't shift
  under a screen reader's virtual cursor — the confirmation goes through the live region
  instead.
- **Status announcement (Issue 2, WCAG 4.1.3):** added a visually-hidden
  `role="status" aria-live="polite"` region (`index.tsx`, `.srStatus` in the module CSS) that
  renders `"Copied to clipboard"` while `copied` is true. It is always mounted (empty when
  idle) so the live region is registered before its text changes.
- **Focus visibility (Issue 3 / Issue 10, WCAG 2.4.7):** the copy control is a shared
  `<Button>`, and `Button` now ships a complete, theme-aware `:focus-visible` **outline** ring
  of its own (`Button.module.css` — `.button:focus-visible { outline: 2px solid … }` sacred,
  with `[data-theme='light']`/`[data-theme='dark']` colour overrides refined to meet the 3:1
  non-text-contrast floor). CodeCopy passes `theme` to the button in light/dark and leaves the
  sacred default, so the button receives that ring in **all three** themes. The earlier
  CodeCopy-local `.copyButtonSlot button:focus-visible` box-shadow ring is therefore **removed**
  — keeping it would render a **doubled** indicator (outline + box-shadow) on the same element
  (Issue 10). The button's `outline` (offset 2px) fits within the header's 1rem horizontal
  padding and the ~6px vertical clearance, so the header's `overflow: hidden` does not clip it.
  A code comment in the CSS documents why no local ring is (re-)defined, so a future pass does
  not reintroduce the duplication.
- **Decorative line numbers (Issue 4, WCAG 1.3.1):** the `.lineNumbers` gutter now has
  `aria-hidden="true"`; the readable content stays in the `<pre><code>`.
- **Keyboard-scrollable code region (Issue 7 / Issue 11, WCAG 2.1.1):** the `<pre>` is an
  `overflow:auto` scroll container for wide code. When the code **actually overflows
  horizontally** it carries `tabIndex={0}` so it is keyboard-focusable and arrow-scrollable
  (the axe `scrollable-region-focusable` fix), plus `role="group"` + `aria-label={`${language}
  code`}` for an accessible name. `role="group"` is chosen over `role="region"` on purpose: it
  is a **naming-capable** role (so `aria-label` on the otherwise-generic `<pre>` is not an
  `aria-prohibited-attr` violation) but is **not a landmark**, so it adds no landmark noise /
  `landmark-unique` risk when many snippets share a language, and it is not a name-from-content
  role so the code text inside stays readable. **These three attributes are now GATED to the
  scrollable case (Issue 11):** a `ResizeObserver` measures `scrollWidth > clientWidth`
  client-side (overflow is unknowable at SSR) and sets `isPreScrollable`; a narrow snippet that
  never overflows gets **none** of them, so it stays out of the tab order and is not announced
  as an empty group — removing tab-stop / screen-reader noise on the common narrow case while
  still satisfying `scrollable-region-focusable` when the region truly scrolls. A theme-aware
  **inset** `:focus-visible` ring on `.pre` (`inset` so the container's `overflow:hidden`
  cannot clip it) gives that focus a visible indicator (WCAG 2.4.7); it only shows once the pre
  is focusable, i.e. only when it scrolls.
- **Copy-failure announcement (Issue 8, WCAG 4.1.3 failure branch):** `handleCopy` now models
  three states (`idle`/`copied`/`error`). The async `writeText` gains a `.catch` that falls
  back to the `execCommand` path; when **both** fail it settles to `error`, which drives both
  a visible `✕` glyph and a `"Copy failed"` announcement through the same `role="status"` live
  region — so a rejected copy (permission/focus loss) is never silently read as a success.
- **Disabled state (WCAG 1.4.1):** disabled is conveyed programmatically — `data-disabled`
  on the container + the native `disabled` attribute on the copy `<button>` — not by
  colour/opacity alone. No change needed; now covered by the new `Disabled` story.

## SEO semantics

- Code renders as a real, crawlable `<pre><code class="language-…">` with the code present in
  the SSR'd HTML (`{code}` is a child, not client-injected) — highlight.js only re-tokenizes
  the already-present text on the client. **No client-only primary content.**
- No heading is emitted for the snippet, which is correct — a code block is not a document
  heading, so there is no non-semantic-heading defect and no `headingLevel` prop is warranted.
- The language label is presentational text in a `<span>`; the code region is a native
  landmark-free block, appropriate for an inline snippet. No landmark/list/table semantics are
  applicable.

## Fixes applied

All within the owned directory:

1. `index.tsx` — copy `<Button>` gains `aria-label="Copy code"` + `type="button"`.
2. `index.tsx` — added visually-hidden `role="status" aria-live="polite"` copy-confirmation
   region.
3. `index.tsx` — `aria-hidden="true"` on the `.lineNumbers` gutter.
4. `CodeCopy.module.css` — added the `.srStatus` visually-hidden utility and a
   `@media (prefers-reduced-motion: reduce)` block disabling the container transition. (The
   copy-button `:focus-visible` ring that was originally added here was **removed** in the
   review-2 pass — see item 8 / Issue 10.)
5. `index.tsx` — the `<pre>` gains `tabIndex` + `role="group"` + `aria-label` so the wide-code
   scroll region is keyboard-focusable and named (Issue 7), **now gated to real horizontal
   overflow** (Issue 11).
6. `index.tsx` — `handleCopy` refactored to a three-state model with a `.catch` fallback and an
   `error` status; the live region + glyph announce `"Copy failed"` / `✕` (Issue 8).
7. `CodeCopy.module.css` — added an inset `.pre:focus-visible` ring (dark/light/sacred) and
   modernized `.srStatus`'s deprecated `clip` to `clip-path: inset(50%)` (Issue 9).
8. `CodeCopy.module.css` — **removed** the redundant `.copyButtonSlot button:focus-visible`
   box-shadow ring (all three themes) now that the shared `Button` owns a `:focus-visible`
   outline ring; replaced with a comment explaining why no local ring is defined (Issue 10).
9. `index.tsx` — the `<pre>`'s `tabIndex` / `role="group"` / `aria-label` are gated behind an
   `isPreScrollable` state fed by a `ResizeObserver` overflow measurement, so only genuinely
   scrollable code becomes a focusable, named region (Issue 11).

No existing `data-*`, `role`, or `aria-*` attribute was removed or renamed; the
`data-component="CodeCopy"` / `data-theme` / `data-disabled` selector contract is preserved.
Changes are additive to the public API (no prop renamed/removed/retyped).

## Stories updated

`CodeCopy.stories.tsx`:

- **`Disabled`** (new) — exercises `styles.disabled`: dimmed container + a real disabled copy
  button; `play` asserts the button is found by its accessible name and is `disabled`.
- **`AccessibilityChecks`** (new) — `play` regression-guards the non-visual a11y additions:
  the copy button resolves by accessible name `"Copy code"` and has `type="button"`; a
  `role="status"` `aria-live="polite"` region exists; the line-number column is
  `aria-hidden="true"` (and holds the digit "1", proving it's out of the readable path); and
  the copy button is keyboard-focusable (renders the `:focus-visible` ring).
- **`WideScrollableCode`** (new) — renders over-wide code inside a narrow (`max-width:480px`)
  wrapper so the `<pre>` becomes a horizontal-scroll container; `play` asserts the `<pre>` has
  `tabindex="0"`, `role="group"`, `aria-label="typescript code"`, and actually accepts focus
  (Issue 7 regression guard).
- **`CopyFailure`** (new) — stubs `navigator.clipboard.writeText` to reject **and**
  `document.execCommand` to return `false`, clicks copy, and asserts the `role="status"` region
  announces `"Copy failed"` and the button shows the `✕` glyph — the failure branch of Issue 8.
  Both the clipboard descriptor and `execCommand` are restored in a `finally` block.
- **`WideScrollableCode`** (updated in review-2) — its `play` now wraps the
  `tabindex`/`role`/`aria-label` assertions in `waitFor`, because those attributes are applied
  asynchronously after the client-side overflow measurement (Issue 11) rather than at first
  render.
- **`NarrowCodeNotFocusable`** (new, review-2) — renders normal-width code (fits its
  container), waits for the client mount + overflow measurement, and asserts the `<pre>` has
  **no** `tabindex`, `role`, or `aria-label` — the regression guard for Issue 11 (narrow code
  must not become a tab stop or an announced group).

All pass `bun lint:file`; `CodeCopy.module.css` passes `stylelint`.

## Deferred

_None._

The prior pass's two deferrals are both now **resolved, not deferred**:

- **Shared `Button` `:focus-visible` (WCAG 2.4.7) — RESOLVED upstream, not by us.** A parallel
  `Button` a11y audit added a complete, theme-aware `:focus-visible` **outline** ring to
  `src/components/Button/Button.module.css` (`.button:focus-visible { outline: 2px solid
  var(--goobs-sacred-focus-ring); outline-offset: 2px }`, with `[data-theme='light']` →
  `--goobs-light-primary` and `[data-theme='dark']` → `--goobs-dark-primary` colour overrides
  chosen to clear the 3:1 non-text-contrast floor; commits `5f4ce6a7` then `21fb5db6`). All
  tokens resolve. Because the copy control **is** a `Button`, it now inherits this ring in all
  three themes — so the earlier CodeCopy-local ring was removed as redundant (Issue 10). The
  previously-suggested `box-shadow: var(--goobs-focus-*)` fix is **stale and must NOT be
  applied**: `Button` deliberately uses an `outline` (comment: "so it never fights the hover
  glow"), and layering a `box-shadow` ring on top would both fight that choice and re-create the
  doubled-indicator regression. Nothing owned by CodeCopy is deferred.
- The prior pass's "robustness note" about the missing `.catch` is **resolved** — see Issue 8.

## Commit history

The CodeCopy a11y work shipped across several commits, not one:

- `90db9547` — accessible copy-button name (`aria-label` + `type`), copy-status live region,
  aria-hidden line numbers, the (later-removed) copy-button focus ring, reduced-motion.
- `3223d2eb` — review-1 fixes: focusable `<pre>` scroll region + copy-failure status/`.catch`.
- `84cc208e` — review-1 stories: `WideScrollableCode` + `CopyFailure`.
- `72866311` — review-2 fixes (Issues 10 + 11): removed the redundant copy-button focus ring;
  gated the `<pre>` scroll-region a11y attributes to measured horizontal overflow.
- `933d987b` — review-2 stories: `NarrowCodeNotFocusable` guard + `waitFor` for the now-async
  `WideScrollableCode` assertions.

(A blanket "clip-path modernization" was folded into the same work; the deprecated `clip: rect()`
→ `clip-path: inset(50%)` change is Issue 9.)

## Adversarial-review-2 notes

- The review's citation of a false focus comment at **`index.tsx:211-214`** is a mis-cite: that
  range is the `aria-label` justification comment and contains **no** claim about the shared
  `Button`'s focus indicator. The only false "the shared `Button` … would show NO focus
  indicator" text lived in `CodeCopy.module.css` (the removed `.copyButtonSlot button:focus-
  visible` block); it is gone. No index.tsx comment change was needed for that sub-point.
- Issue 11 (gating) was accepted rather than refuted: the reviewer flagged it as "defensible but
  an over-application." Since CodeCopy is already a `'use client'` component with effects, gating
  the attributes to a measured-overflow signal is a clean root-cause improvement (less AT noise
  on the common case) with no downside — so it was implemented, not just noted.
