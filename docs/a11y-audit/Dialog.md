# Dialog — a11y audit (2026-07-11)

**Status:** FIXED
**APG pattern:** [Dialog (Modal)](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/), with additive opt-in for the [Alert Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/) specialization.

Component owner scope: `src/components/Dialog/` (`index.tsx`, `Dialog.module.css`, `Dialog.stories.tsx`).

## Summary

The Dialog was already a strong, largely-compliant implementation of the APG Modal Dialog
pattern: `role="dialog"` + `aria-modal="true"` (index.tsx:381-382), focus moved into the
dialog on open (index.tsx:171-173), a Tab / Shift+Tab focus trap with a deliberate,
documented exception for portalled goobs dropdowns (index.tsx:175-205), Escape-to-close
(index.tsx:176-179), focus restoration to the trigger on close (index.tsx:211), and body
scroll-lock (index.tsx:238-293). The consumer-supplied `ariaLabelledBy` / `ariaDescribedBy`
/ `ariaLabel` props are already wired (index.tsx:384-386).

Two real gaps were found and fixed; several checklist items are genuinely N/A for this
component and are recorded as such.

## Issues found

### 1. Modal can render with NO accessible name — FIXED
- **Severity:** moderate · **WCAG 4.1.2 Name, Role, Value (A)** (also 1.3.1)
- **Where:** `src/components/Dialog/index.tsx:381-386` — the accessible name is entirely
  consumer-supplied via `ariaLabelledBy` / `ariaLabel`; nothing enforced or warned when
  both are omitted. Evidence of the trap: **every one of the 15 pre-existing stories opened
  the dialog with no `ariaLabelledBy`/`ariaLabel`**, so each demo modal was nameless — a
  `role="dialog"` with no name gives screen-reader users no announcement of what opened.
- **Pattern:** `missing-accessible-name`
- **Fix:** added a development-only effect (index.tsx, after the diagnostics effect) that
  `console.warn`s when a dialog opens with neither `ariaLabelledBy` nor `ariaLabel`. Dev-only
  (`process.env.NODE_ENV !== 'production'` guard, compiles out of prod bundles), no DOM/API
  change. Matches the established Radix / React-Aria "warn the author at build time" pattern
  and the repo's existing bare-`console.warn` convention (Alert/index.tsx:438). The name
  itself must come from consumer content, so a warning — not a fabricated generic label that
  would mask the problem — is the correct accessible-by-default nudge.

### 2. No way to express the Alert Dialog pattern for destructive confirmations — FIXED
- **Severity:** minor · **WCAG 4.1.2 Name, Role, Value (A)**
- **Where:** `src/components/Dialog/index.tsx:381` — `role` was hardcoded to `"dialog"`. The
  component is prominently used for destructive confirmations ("Delete Account" —
  Dialog.stories.tsx `ConfirmationDialog`, `LightConfirmation` et al.), which per WAI-ARIA
  should be `role="alertdialog"` so AT announces the consequence text (`aria-describedby`)
  immediately on open. `alertdialog` is context-dependent (a settings/form dialog must NOT
  be one), so it cannot be defaulted — it must be caller-specified.
- **Pattern:** `missing-alertdialog-role`
- **Fix:** added an **additive** optional prop `role?: 'dialog' | 'alertdialog'` (interface
  index.tsx, JSDoc'd) defaulting to `'dialog'` — zero behavior change for existing consumers,
  preserves the `role="dialog"` machine-test contract by default — and rendered it as
  `role={role}` (index.tsx:381). Precedent: Card/index.tsx:1251 already uses
  `role="alertdialog"` for its inline confirm pane.

## Hearing (WCAG 1.2.x, 1.4.2)
- **N/A / CLEAN.** Grepped the component for `new Audio` / `AudioContext` / `<audio>` /
  `<video>` / `navigator.vibrate` — none. The only "emit" is `emitDiag` (utils/diag.ts), a
  silent diagnostic bus, not sound. No information is conveyed by audio, so there is no
  audio-only status to give a visual equivalent for.

## Reading & screen reader (1.1.1, 1.3.1, 1.4.1, 2.1.x, 2.4.x, 4.1.2)
- **Accessible name** — was the one real gap (issue 1); now dev-warned. Fixed.
- **Roles/states/properties** — `role="dialog"`/`"alertdialog"`, `aria-modal="true"`,
  `aria-labelledby`/`aria-describedby`/`aria-label` all present and correctly conditional
  (`aria-label` suppressed when `ariaLabelledBy` is set — index.tsx:386). Compliant.
- **Keyboard (APG dialog table)** — Tab wraps last→first, Shift+Tab wraps first→last, Escape
  closes (index.tsx:175-205). The empty-dialog branch focuses the container
  (`tabIndex={-1}`, index.tsx:383). The "no recapture when focus is outside dialogRef" branch
  is a *correct, documented* choice: goobs overlays (SearchableSimple/MultiSelect/Popover)
  portal to `document.body`, so a dropdown opened inside the dialog legitimately holds focus
  outside `dialogRef` (index.tsx:191-197). Compliant.
- **Focus into/out** — first focusable focused on open (index.tsx:171-173); trigger restored
  on close via captured `previouslyFocused` (index.tsx:158, 211). Compliant.
- **Color-alone (1.4.1)** — the component conveys no state via color; theming is decorative.
  N/A.
- **Backdrop click-to-dismiss** — mouse-only dismiss on a non-interactive backdrop div
  (index.tsx:370) is acceptable because Escape provides the keyboard-equivalent dismissal
  (2.1.1 satisfied); the backdrop is intentionally not tab-focusable. No change.

## SEO semantics
- The component renders no heading/landmark/link/list text of its own — all such content is
  consumer `children` (the stories correctly use real `<h2>`/`<h3>`/`<p>`). No non-semantic
  heading or `onClick`-div-link to fix here. When `open` is false the component returns
  `null` (index.tsx:295-297), so a closed dialog correctly contributes nothing to SSR HTML;
  when open, `children` are server-rendered. No SSR content-injection gap.

## Motion (WCAG 2.3.3)
- **N/A.** `Dialog.module.css` contains no `transition`, `animation`, or `@keyframes` (the
  only "state" style is an instant `::-webkit-scrollbar-thumb:hover` color swap).
  `backdrop-filter` is a static blur, not motion. There is nothing to gate behind
  `prefers-reduced-motion`; adding an empty media query would be noise.

## Fixes applied
- `index.tsx` — dev-only accessible-name `console.warn` effect (WCAG 4.1.2).
- `index.tsx` — additive `role?: 'dialog' | 'alertdialog'` prop (default `'dialog'`),
  rendered as `role={role}`; enables the APG Alert Dialog pattern for confirmations.
- Commit: `b3db5fba`.

## Stories updated
- `InteractiveDialog` wrapper extended to forward `ariaLabelledBy` / `ariaDescribedBy` /
  `dialogRole`.
- Stable ids added to the `UserProfileForm` heading (`dialog-profile-title`) and to the
  `ConfirmationDialog` heading/message (`dialog-confirm-title` / `dialog-confirm-desc`).
- New story **`AccessibleLabelledForm`** — dialog named via `ariaLabelledBy` (no dev warning),
  exercises the WCAG 4.1.2 name wiring + focus trap/restore.
- New story **`AccessibleAlertConfirmation`** — `role="alertdialog"` + `ariaLabelledBy` +
  `ariaDescribedBy` on a destructive confirmation (APG Alert Dialog pattern).
- Per-file gate: `bun lint:file` clean on both `index.tsx` and `Dialog.stories.tsx`.

## Deferred
- **None inside owned scope.** No shared-util / Field / global.css change was required for
  the fixes.
- **Observation (not a defect, no owner action):** background page content outside the modal
  is not marked `inert`/`aria-hidden` while the dialog is open. `aria-modal="true"` is present
  and is the accepted modern baseline for AT confinement; adding sibling-`inert` (as
  Radix/React-Aria do for belt-and-suspenders VoiceOver robustness) would require manipulating
  DOM the Dialog does not own and is intentionally out of scope here. Recorded for awareness
  only.
