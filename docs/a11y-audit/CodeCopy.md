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
| 3 | Serious | 2.4.7 (AA) | `Button/Button.module.css:48` (manifests on `index.tsx:172`) | Copy button has **no visible keyboard-focus indicator** — shared `Button` sets `outline: none` with no `:focus-visible` rule. | **FIXED locally** (+ shared root cause DEFERRED) |
| 4 | Moderate | 1.3.1 (A) | `index.tsx:206-212` | Decorative line-number `<div>`s ("1 2 3 4 …") are read into the code's reading order, polluting it for screen-reader users. | **FIXED** |
| 5 | Minor | 2.3.3 (AAA) | `CodeCopy.module.css:25` | `.container` has an `all` `transition` with no `prefers-reduced-motion` opt-out. | **FIXED** |
| 6 | Minor | 3.2.2 (A) robustness | `index.tsx:172` | Copy `<button>` had no explicit `type`; inside a `<form>` it would default to `type="submit"` and submit the form on copy. | **FIXED** (set `type="button"`) |

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
- **Focus visibility (Issue 3, WCAG 2.4.7):** added a theme-aware `:focus-visible` ring on
  `.copyButtonSlot button` using the library's `--goobs-focus-{dark,light,sacred}` tokens.
  The `.container` prefix raises specificity above `Button.module.css`'s
  `.button:hover:not(:disabled)` so the ring wins even when hovered+focused. The ~3–4px ring
  fits inside the header's horizontal padding and the button's vertical clearance, so the
  header's `overflow: hidden` does not clip it. (The underlying gap is in the shared `Button`
  and affects every `Button` usage — see Deferred.)
- **Decorative line numbers (Issue 4, WCAG 1.3.1):** the `.lineNumbers` gutter now has
  `aria-hidden="true"`; the readable content stays in the `<pre><code>`.
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
4. `CodeCopy.module.css` — added `.container .copyButtonSlot button:focus-visible` ring
   (dark/light/sacred via `--goobs-focus-*`), the `.srStatus` visually-hidden utility, and a
   `@media (prefers-reduced-motion: reduce)` block disabling the container transition.

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

Both pass `bun lint:file`.

## Deferred

- **Shared `Button` has no `:focus-visible` treatment (WCAG 2.4.7).**
  `src/components/Button/Button.module.css:48` sets `outline: none` on `.button` and the file
  defines **no** `:focus-visible` rule, so *every* goobs `Button` across the library lacks a
  visible keyboard-focus indicator. CodeCopy is patched locally, but the root cause is
  library-wide. **Suggested fix (in `Button/Button.module.css`):** add
  `.button:focus-visible { box-shadow: var(--goobs-focus-sacred); }` plus
  `.button[data-theme='light']:focus-visible { box-shadow: var(--goobs-focus-light); }` and
  `.button[data-theme='dark']:focus-visible { box-shadow: var(--goobs-focus-dark); }` (tokens
  already exist in `src/styles/global.css:388-390`). This is cross-component class
  `missing-focus-visible-style`.
- **Robustness note (not a WCAG failure):** `handleCopy` (`index.tsx:130-132`) calls
  `navigator.clipboard.writeText(...).then(markCopied)` with **no `.catch`** — if the write
  rejects (permission/focus), the success state never fires and the failure is silent. Not an
  a11y checklist item and left unchanged to avoid altering copy semantics, but worth a
  follow-up `.catch` that falls back to the `execCommand` path already present below it.
