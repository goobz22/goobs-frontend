# Popover — a11y audit (2026-07-11)

**Status:** FIXED
**APG pattern:** [Dialog (Modal)](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) for the default `role="dialog"` surface (the component also passes through `menu` / `listbox` / `tooltip` / `grid` / `region` roles, whose interior semantics are consumer-managed).

Component owner scope: `src/components/Popover/` (`index.tsx`, `Popover.module.css`, `Popover.stories.tsx`).

## Summary

Popover is a portalled floating surface that **defaults to `role="dialog"` + `aria-modal="true"`** (index.tsx:289-290). It already had Escape-to-close (index.tsx:169-173), outside-click dismissal (index.tsx:145-163), reposition-on-scroll to stay anchored (index.tsx:193-202), and consumer name props (`ariaLabel` / `ariaLabelledBy`, index.tsx:291-292).

The headline defect: the surface **asserted `aria-modal="true"` but implemented NONE of the modal focus contract** — no focus move-in, no focus trap, no focus restore, and the container was not programmatically focusable. `aria-modal="true"` without a focus trap is a false promise to screen-reader / keyboard users: the component tells assistive tech the background is inert while keyboard focus and the reading cursor can still wander straight out of it. The sibling Drawer/Dialog overlays implement the full pattern; Popover was the odd one out. Fixed by adding the modal focus-management effect (scoped to `role="dialog"`), plus reduced-motion, a focus-visible treatment for the now-focusable surface, and a dev-time nameless-dialog warning.

## Issues found

### 1. `aria-modal` dialog with NO focus management (no move-in / no trap / no restore) — FIXED
- **Severity:** serious · **WCAG 2.4.3 Focus Order (A), 2.1.2 No Keyboard Trap (A), 4.1.2 Name, Role, Value (A)**
- **Where:** `src/components/Popover/index.tsx:289-290` — `role={role}` (default `"dialog"`) with `aria-modal={role === 'dialog' ? true : undefined}`, but no effect anywhere moved focus into the surface on open, trapped Tab within it, or restored focus to the trigger on close. Only Escape (index.tsx:169-173) existed. The surface also had no `tabIndex`, so it could not receive programmatic focus when it held no focusable child.
- **Failure:** a screen-reader user opens the popover; because `aria-modal="true"` is asserted, AT announces a modal, yet Tab immediately leaves the "modal" into the page behind it, and on close focus is stranded wherever it landed instead of returning to the trigger. The APG Modal Dialog focus contract is entirely unmet.
- **Pattern:** `missing-dialog-focus-trap`
- **Fix:** added a modal focus-management effect (index.tsx, gated `open && role === 'dialog'`) mirroring the sibling Drawer/Dialog: capture the trigger, move focus to the first focusable child (else the container), trap Tab/Shift+Tab with wrap-around at the boundaries, and restore focus to the trigger on close. The "no recapture when focus is outside the surface" branch is preserved deliberately (documented) so a goobs dropdown portalled to `document.body` from inside the popover is not orphaned. Added `tabIndex={role === 'dialog' ? -1 : undefined}` to the surface (index.tsx) so the empty-content focus fallback works.
  - **Deliberately NOT copied from Drawer/Dialog** (documented in-code so a later "restore parity" pass does not regress it): the isolation uses **`aria-hidden`, NOT `inert`** (see issue 5), and there is **no body scroll-lock** — the popover repositions on scroll to stay anchored, which a scroll-lock would fight. A consumer needing hard pointer-level background isolation (a true scrim) should use Drawer or Dialog.
  - **Follow-up (adversarial review):** the original fix left the background in the accessibility tree, so the `aria-modal="true"` contract was only half-met (focus containment, not virtual-cursor containment) — see issue 5, now fixed.

### 2. No `prefers-reduced-motion` handling — FIXED
- **Severity:** moderate · **WCAG 2.3.3 Animation from Interactions (AAA)**
- **Where:** `src/components/Popover/Popover.module.css:40` (`transition: var(--goobs-transition-medium)` on `.popover`), `:53` (dark), `:68` (sacred `--goobs-transition-premium`). No `@media (prefers-reduced-motion: reduce)` block existed to neutralise the enter/exit transition for motion-sensitive users.
- **Pattern:** `missing-reduced-motion`
- **Fix:** added a `@media (prefers-reduced-motion: reduce)` block setting `transition: none` on `.popover` **and** the `[data-theme='dark']` / `[data-theme='sacred']` overrides explicitly — the theme overrides are more specific than `.popover`, so each had to be named to win the cascade (matching the Drawer.module.css reduced-motion pattern).

### 3. Focusable surface had no `:focus-visible` treatment — FIXED
- **Severity:** minor · **WCAG 2.4.7 Focus Visible (AA)**
- **Where:** `src/components/Popover/Popover.module.css` — the surface now receives programmatic focus (issue 1's `tabIndex={-1}`) but had no focus styling, so a keyboard user who genuinely tabs the container into focus would see nothing (or an inconsistent UA default outline).
- **Pattern:** `missing-focus-visible-style`
- **Fix:** added `.popover:focus { outline: none }` (suppresses a ring on the script-driven focus move so a just-opened dialog does not flash a stray ring) plus `.popover:focus-visible` per-theme `box-shadow` rings using the existing `--goobs-focus-light` / `--goobs-focus-dark` / `--goobs-focus-sacred` tokens (global.css:388-390) — a ring appears only for genuine keyboard focus of the container.

### 4. `role="dialog"` could render with no accessible name — FIXED
- **Severity:** minor · **WCAG 4.1.2 Name, Role, Value (A)**
- **Where:** `src/components/Popover/index.tsx:291-292` — the accessible name is entirely consumer-supplied (`ariaLabel` / `ariaLabelledBy`); nothing warned when both were omitted. A `role="dialog"` with no name gives screen-reader users no announcement of what opened.
- **Pattern:** `missing-accessible-name`
- **Fix:** added a development-only effect (index.tsx, gated `open && role === 'dialog'`) that `console.warn`s when a dialog opens with neither `ariaLabelledBy` nor `ariaLabel`. Dev-only (`process.env.NODE_ENV === 'production'` early-return, compiles out of prod bundles); no DOM/API change. Matches the sibling Drawer/Dialog nameless-dialog warning. A warning — not a fabricated generic label that would mask the gap — is the correct accessible-by-default nudge, since the real name must come from consumer content.

### 5. `aria-modal="true"` background never removed from the accessibility tree (contract half-met) — FIXED (adversarial review)
- **Severity:** minor · **WCAG 4.1.2 Name, Role, Value (A)** (APG Modal Dialog background-isolation expectation)
- **Where:** `src/components/Popover/index.tsx` — the surface asserts `aria-modal={role === 'dialog' ? true : undefined}` and the issue-1 fix trapped keyboard focus, but nothing removed the non-portal background from the accessibility tree. On AT that only partially honours `aria-modal` (the common case), a screen-reader **virtual cursor** (VoiceOver / NVDA browse mode) could still read into the background behind the dialog. The prior in-code rationale for skipping isolation was also **technically imprecise**: it conflated `inert` with `aria-hidden`, arguing that background isolation would swallow the document-level outside-click dismissal. That is true of `inert` (which blocks pointer events) but **NOT** of `aria-hidden` (which hides from AT without blocking pointer events, so outside-click dismissal is preserved).
- **Failure:** a VoiceOver user opens the dialog popover; keyboard Tab is trapped, but the virtual cursor swipes past the dialog into the page content behind it — the "modal" is not actually isolating the reading experience the `aria-modal="true"` claim promises.
- **Pattern:** `incomplete-aria-modal-isolation`
- **Fix:** the modal focus-management effect (gated `open && role === 'dialog'`) now also walks from the portalled surface up to `<body>` and marks every sibling off the surface's ancestor path `aria-hidden="true"` on open, restoring each element's prior `aria-hidden` value on close (before restoring focus, so focus never lands on a still-hidden trigger). Isolation deliberately uses **`aria-hidden`, not `inert`** — `aria-hidden` completes the virtual-cursor containment half of the `aria-modal` contract WITHOUT blocking pointer events, so the scrim-less popover's outside-click dismissal still fires. Elements portalled to `document.body` from *inside* the dialog after open (goobs SearchableSimple / MultiSelect / nested Popover menus) are untouched and stay announced — the same portal exception the Tab-trap makes. The in-code rationale block was rewritten to state the `aria-hidden`-vs-`inert` distinction correctly. No prop/DOM-contract change; no `data-*` / `role` / `aria-*` attribute removed or renamed.

## Hearing (WCAG 1.2.x, 1.4.2)
- **N/A / CLEAN.** Grepped the component for `new Audio` / `AudioContext` / `<audio>` / `<video>` / `navigator.vibrate` — none. The only emit is `emitDiag` (utils/diag.ts), a silent diagnostic bus, not sound. No information is conveyed by audio, so there is no audio-only status needing a visual equivalent.

## Reading & screen reader (1.1.1, 1.3.1, 1.4.1, 2.1.x, 2.4.x, 4.1.2)
- **Accessible name** — was a gap (issue 4); now dev-warned. `aria-label` is correctly suppressed when `ariaLabelledBy` is set (index.tsx:291). Fixed.
- **Roles/states/properties** — `role` passthrough with a correct default of `"dialog"`; `aria-modal="true"` only for the dialog role, now BACKED by `aria-hidden` background isolation so the modal claim is fully met for virtual-cursor users too (issue 5); `aria-labelledby` / `aria-label` present and conditional. The `data-component` / `data-state` / `data-popover` / `data-subject` / `data-theme` machine-test selectors are all preserved unchanged.
- **Background isolation (virtual cursor)** — on open, every `document.body` sibling of the portalled surface is marked `aria-hidden="true"` (restored on close), so a screen-reader browse-mode cursor cannot wander into the background. Uses `aria-hidden` (not `inert`) to preserve the scrim-less popover's outside-click dismissal. Fixed (issue 5).
- **Keyboard (APG dialog table)** — Escape closes (pre-existing, index.tsx:169-173); Tab wraps last→first and Shift+Tab wraps first→last within the dialog; the empty-content branch focuses the `tabIndex={-1}` container; the "no recapture when focus is outside" branch is a correct, documented choice for portalled goobs dropdowns. Fixed (issue 1).
- **Focus into/out** — first focusable focused on open; trigger restored on close via captured `previouslyFocused`. Fixed (issue 1).
- **Color-alone (1.4.1)** — the component conveys no state via colour; theming is decorative. N/A.
- **Outside-click / drag-select dismissal** — mousedown-inside tracking (index.tsx:145-167) already prevents a text drag-select that ends outside from closing the surface; Escape provides the keyboard-equivalent dismissal (2.1.1 satisfied). No change.

## SEO semantics
- The component renders no heading / landmark / link / list text of its own — all such content is consumer `children` (the stories use real `<h3>`/`<p>`). No non-semantic heading or `onClick`-div-link to fix here. When `open` (or `anchorEl`/`mounted`) is falsy the component returns `null` (index.tsx:~300), so a closed popover contributes nothing to SSR HTML; when open, `children` are rendered into the portal. The portal targets `document.body`, which is client-only by nature (positioning depends on a runtime `getBoundingClientRect`) — this is inherent to an anchored floating surface, not an SSR content-injection defect.

## Motion (WCAG 2.3.3)
- **FIXED** (issue 2). `Popover.module.css` transitions on all three themes are now gated behind `@media (prefers-reduced-motion: reduce)`. `backdrop-filter` blur and the sacred `background-image` gradient are static (not motion) and are intentionally left untouched.

## Fixes applied
- `index.tsx` — modal focus-management effect (move-in + Tab/Shift+Tab trap + restore) scoped to `role="dialog"` (WCAG 2.4.3 / 2.1.2 / 4.1.2); `tabIndex={role === 'dialog' ? -1 : undefined}` on the surface; dev-only nameless-dialog `console.warn` (WCAG 4.1.2).
- `index.tsx` (adversarial-review follow-up) — the same effect now `aria-hidden`s the background body-siblings on open and restores them on close, completing the `aria-modal="true"` contract for virtual-cursor users (issue 5, WCAG 4.1.2); the in-code rationale was rewritten to state the `aria-hidden`-vs-`inert` distinction correctly.
- `Popover.module.css` — `@media (prefers-reduced-motion: reduce)` block neutralising all three themes' transitions (WCAG 2.3.3); `:focus` / per-theme `:focus-visible` treatment for the now-focusable surface (WCAG 2.4.7).
- `Popover.stories.tsx` — new `A11y/Dialog Focus Management` story + play test; new `A11y/Dialog Background Isolation` story + play test (issue 5).
- Per-file gate: `bun lint:file` clean on `index.tsx` and `Popover.stories.tsx`.

## Stories updated
- New story **`A11y/Dialog Focus Management`** (`DialogFocusManagement`) with a `play` test asserting the full APG modal contract: (1) opening moves focus into the surface (first focusable child), (2) Tab from the last focusable wraps to the first and Shift+Tab from the first wraps to the last (focus trap), (3) Escape closes the dialog **and** restores focus to the trigger, (4) `ariaLabelledBy` gives the dialog an accessible name (`toHaveAccessibleName`). Uses native `<button>`s so it asserts real focusability without coupling to another component's internals.
- New story **`A11y/Dialog Background Isolation`** (`DialogBackgroundIsolation`) with a `play` test asserting issue 5's contract: before open the background has no `aria-hidden` ancestor; after open the background text gains an `aria-hidden="true"` ancestor (virtual-cursor containment) while the dialog surface itself is NOT hidden; after Escape the background is fully restored. A DOM walk from a background node up to `<body>` detects the isolated body-level sibling.
- Reduced-motion (issue 2) and the `:focus-visible` ring (issue 3) are CSS-only; they are covered by the existing visual stories under Chromatic's `prefers-reduced-motion` / focus snapshots rather than a `play` test (a media query cannot be asserted from a play step).

## Deferred
- **None inside owned scope.** No shared-util / Field / global.css change was required — the focus-ring tokens (`--goobs-focus-light`/`-dark`/`-sacred`) already exist in `src/styles/global.css`.
- **Observation (not a defect, no owner action):** consumers currently using the default `role="dialog"` as a lightweight, non-trapping popover will now get modal focus containment. This is the correct behaviour given the pre-existing `aria-modal="true"` assertion (reality now matches the ARIA claim); a consumer wanting an explicitly non-modal floating surface should pass `role="menu"` / `"listbox"` / `"tooltip"` / `"region"`, which are intentionally left untrapped. Recorded for awareness only.
