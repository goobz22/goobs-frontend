# Snackbar — a11y audit (2026-07-11)

**Status:** FIXED

**APG pattern:** [Alert](https://www.w3.org/WAI/ARIA/apg/patterns/alert/) — Snackbar is a
transient "toast": a fixed-position container that surfaces a time-sensitive status message and
auto-dismisses. It is deliberately NOT a dialog — it must not steal focus and must not trap
focus (that would violate the toast pattern). The live-region semantics (`role="alert"`,
implicit `aria-live="assertive"` + `aria-atomic`), the accessible Close-button name, the
visually-hidden severity prefix, and the decorative-icon hiding are all owned by the **inner
`Alert`** that Snackbar wraps (see `docs/a11y-audit/Alert.md`). Snackbar itself owns ONLY fixed
positioning and the open/auto-hide lifecycle — so this audit focuses on the lifecycle/timing
dimension of the pattern.

Component files: `src/components/Snackbar/index.tsx`, `src/components/Snackbar/Snackbar.module.css`,
`src/components/Snackbar/Snackbar.stories.tsx`. Renders `src/components/Alert` inside a plain
positioning `<div>` (no competing role). Consumers: `DataGrid`, plus the public barrel `src/index.ts`.

## Issues found

### 1. Auto-hide timer never pauses on hover or focus — SERIOUS — FIXED
- **WCAG:** 2.2.1 Timing Adjustable (Level A). Also serves reading-impaired / cognitive users
  who need more time to read (the criterion's "extend" allowance).
- **Pattern:** `timed-content-no-pause`
- **Where:** `src/components/Snackbar/index.tsx:73-83` (pre-fix) — the auto-hide `useEffect`
  scheduled a single `setTimeout(autoHideDuration)` (default 6000ms) that ran unconditionally
  while open, with the ONLY dependencies `[isOpen, autoHideDuration, onClose]`. Nothing in the
  component observed hover or focus, so:
  - a pointer user who moves onto the snackbar to read a long message can have it vanish
    mid-sentence, and
  - a keyboard / AT user who Tabs toward the Close button can have the button (and the whole
    toast) disappear from under them before they can activate it.
  The auto-hide countdown is a content-imposed time limit on both reading and operating the
  control, which 2.2.1 requires the user be able to pause / extend. (The consumer CAN disable
  auto-hide via `autoHideDuration={0}`, but the END user viewing the page had no way to pause or
  extend an active countdown — and 2.2.1 is about the end-user experience.)
- **Failure scenario (pinned by story):** `open`, `autoHideDuration=1200`; pointer hovers the
  toast at ~200ms; under the old code the toast is removed at 1200ms while still hovered.
- **Fix:** track hover and focus-within independently (`isHovered` / `isFocusWithin`) and pause
  the countdown whenever `isPaused = isHovered || isFocusWithin`. `isPaused` is now an effect
  dependency (`index.tsx` auto-hide effect), so the timer is suppressed while the user interacts
  and a FRESH full-duration countdown is scheduled once both release — the user always gets the
  complete reading window after they stop interacting. Handlers `onMouseEnter` / `onMouseLeave` /
  `onFocus` / `onBlur` are wired on the root `<div>`; `onBlur` uses
  `currentTarget.contains(relatedTarget)` so focus moving BETWEEN descendants keeps it paused and
  only focus LEAVING the snackbar resumes it. This is the standard MUI/Radix snackbar behavior.
  The additive `data-paused` attribute exposes the pause state for tests/observability without
  altering semantics.

### 2. Pause flags never reset across the open→close→open lifecycle — MODERATE — FIXED
- **WCAG:** 2.2.1 Timing Adjustable (Level A) — regression introduced by fix #1.
- **Pattern:** `stale-lifecycle-state`
- **Where:** `src/components/Snackbar/index.tsx` — the fix #1 `isHovered` / `isFocusWithin` are
  component state, and the parent almost always keeps the Snackbar MOUNTED and merely toggles
  `open` (we `return null` when `!isOpen`, so React state PERSISTS across an open→closed→open
  cycle for the same instance). The only resets were the DOM release handlers (`onMouseLeave` /
  `onBlur`), which do NOT fire when the toast is dismissed WHILE paused:
  - keyboard/AT path — Enter/Space on the focused Close button runs Alert's 200ms exit, then
    `onClose` → parent sets `open=false` → the node unmounts while the button still holds focus;
    a native blur on an element removed during React's own commit is not reliably delivered to
    the delegated focus listener, so `handleBlur` never runs and `isFocusWithin` stays `true`;
  - pointer path — clicking the inner Close X while still hovering unmounts the node under the
    pointer, so no `mouseleave` fires and `isHovered` stays `true`.
  Either way the pause flag is STUCK `true`. On the NEXT `open` for that instance the auto-hide
  effect (`if (isOpen && !isPaused && autoHideDuration > 0)`) never schedules a timer, so the
  reused toast never auto-dismisses — silently breaking the documented auto-hide contract on the
  a11y-critical dismiss path.
- **Failure scenario (pinned by story):** open a toast, hover it (`data-paused="true"`), dismiss
  it via its own Close button while still hovered, then reopen the SAME instance — pre-fix the
  reopened toast carries `data-paused="true"` and never auto-hides.
- **Fix:** a dedicated `useEffect` keyed on `isOpen` clears `isHovered` and `isFocusWithin`
  whenever the snackbar is closed (`if (!isOpen) { setIsHovered(false); setIsFocusWithin(false) }`).
  Keying off `isOpen` (the render gate) rather than the `open` prop covers every close path
  (parent toggle, internal auto-hide, Close button), so every reopen starts unpaused with a fresh
  full-duration countdown. Public API unchanged (fully additive).

### 3. No Escape-key dismissal when focus is within the toast — MINOR — FIXED
- **WCAG:** 2.1.1 Keyboard (Level A) — keyboard-interaction completeness for a dismissible
  notification. (WCAG 2.1.1 was already technically met — the Close button is Tab-reachable and
  Enter/Space-activatable — so this is a keyboard-completeness enhancement, not a bare failure.)
- **Pattern:** `missing-escape-dismiss`
- **Where:** `src/components/Snackbar/index.tsx` (root `<div>`, pre-fix) — the root wired
  `onMouseEnter/Leave/Focus/Blur` but no `onKeyDown`, so a keyboard user who had Tabbed into the
  toast could dismiss it ONLY by landing Enter/Space precisely on the small Close button. Escape —
  the library-wide dismiss key for overlays — did nothing.
- **Rationale (reverses the prior audit's stance):** the prior report treated Escape as "a dialog
  affordance" not expected on a non-modal toast. But the library itself exposes Escape-to-dismiss
  on its NON-modal overlay too — `Popover/index.tsx:169` — and modern dismissible-toast patterns
  (Radix Toast, react-aria `useToast`) implement scoped Escape dismissal. Escape is a general
  overlay-dismiss affordance here, not a modal-only one.
- **Failure scenario (pinned by story):** `open`, `autoHideDuration=0` (auto-hide disabled); focus
  the Close button, press Escape — pre-fix the toast stays visible (no handler); the assertion that
  the message is removed fails.
- **Fix:** a delegated `onKeyDown` on the root closes on `Escape` (`src/components/Snackbar/index.tsx`
  `handleKeyDown`). Scoping is deliberate for a NON-modal toast: because it is a delegated handler
  on the root, it fires ONLY when a descendant (the Close button) is focused and the keydown
  bubbles up — it can never hijack Escape for a user typing elsewhere on the page (that is why a
  document-level listener, correct for the just-opened Popover, is wrong here). `stopPropagation`
  prevents the same Escape from ALSO dismissing an ancestor overlay (e.g. a Dialog the snackbar
  renders inside). Dismissal mirrors the auto-hide path exactly (`setIsOpen(false)` + `onClose`, no
  exit animation) so a reused/remounted instance closes consistently. Fully additive — no prop,
  markup, role, or `data-*`/machine-selector change.

## Hearing (WCAG 1.2.x, 1.4.2)
CLEAN. Grepped the directory for `new Audio` / `AudioContext` / `<audio>` / `<video>` /
`navigator.vibrate` — zero matches. The snackbar conveys status purely visually (severity
icon + colour, from Alert) and programmatically (the inner Alert's `role="alert"` live region +
visually-hidden "Error:/Warning:/…" severity prefix). No information is audio-only, so no caption
or transcript affordance is required.

## Reading & screen reader (1.1.1, 1.3.1, 1.4.1, 2.1.x, 2.4.x, 3.2.x, 4.1.2, 4.1.3)
- **Announcement (4.1.3 Status Messages):** handled — the inner Alert renders `role="alert"`
  (assertive live region) containing the message, so mounting the snackbar announces it without
  moving focus (`src/components/Alert/index.tsx:475`). Snackbar deliberately adds NO `aria-live`
  of its own; doing so would double-announce.
- **Accessible name on the Close button:** handled by Alert (`aria-label="Close"`).
- **Color-alone severity (1.4.1):** handled by Alert's visually-hidden severity prefix.
- **Decorative icon (1.1.1):** handled by Alert (`aria-hidden` on the severity `<svg>`).
- **Focus management (2.1.x / 2.4.3):** CORRECT for the pattern — a toast must NOT trap focus or
  auto-focus; the Close button is reachable in normal Tab order and its `:focus-visible` ring is
  owned by Alert. Focus restoration on dismiss is the consumer's responsibility (documented on
  `AlertProps.onClose`), which is the correct division for the APG Alert pattern (the alert does
  not own focus). The new pause-on-focus behavior additionally guarantees the keyboard user can
  actually reach and operate Close before dismissal.
- **Keyboard:** the only interactive descendant is the native `<button>` Close (Enter/Space
  activate natively). No arrow/Home/End interaction applies to a single-toast pattern. **Escape**
  now dismisses the toast when focus is within it (issue #3, FIXED) — matching the library's
  overlay-dismiss convention (incl. the non-modal `Popover`) and Radix/react-aria toast patterns —
  scoped via delegation so it only acts while the user is interacting with the toast, and
  `stopPropagation`'d so it never leaks to an ancestor overlay.

## SEO semantics
CLEAN / N/A. A snackbar is a transient status notification, not a heading, landmark, list, link,
table, or figure — so no `<h1-6>` / `<nav>` / `<ul>` / `<a href>` obligation applies, and there is
no primary crawlable content to expose. The correct machine-readable semantic for this component is
the `role="alert"` live region, which is present in the SSR'd HTML via the inner Alert. The
positioning wrapper is appropriately a plain `<div>`.

## Motion (2.3.3)
N/A in this directory — `Snackbar.module.css` contains only static fixed-position rules
(`position/bottom/left/transform/z-index`), no `@keyframes`, `animation`, or `transition`. The
200ms Alert exit fade lives in `Alert.module.css` (that component's audit owns its reduced-motion
handling).

## Fixes applied
- `src/components/Snackbar/index.tsx` — (fix #1) pause the auto-hide countdown while the snackbar
  is hovered or contains focus (WCAG 2.2.1); resume with a fresh full-duration timer on release;
  additive `data-paused` observability attribute. Public API unchanged (fully additive; no prop
  renamed/removed/retyped). No rendered element type changed.
- `src/components/Snackbar/index.tsx` — (fix #2, review) reset the `isHovered` / `isFocusWithin`
  pause flags whenever the snackbar closes (dedicated `useEffect` keyed on `isOpen`), so a REUSED
  Snackbar instance (parent keeps it mounted, toggles `open`) that was dismissed while paused
  cannot carry a stuck pause into its next open and lose auto-hide. Fully additive; no markup or
  API change.
- `src/components/Snackbar/index.tsx` — (fix #3) delegated `onKeyDown` on the root dismisses the
  toast on `Escape` when focus is within it (WCAG 2.1.1), scoped by event delegation and
  `stopPropagation`'d. Fully additive; no prop, markup, role, or machine-selector change.

## Stories updated
`src/components/Snackbar/Snackbar.stories.tsx`:
- **`Behavior/Pause On Hover (WCAG 2.2.1)`** — hovers the toast, asserts `data-paused="true"`,
  asserts it is STILL visible well past `autoHideDuration`, then unhovers and asserts it dismisses.
  Fails against the pre-fix always-run timer (toast vanishes while hovered).
- **`Behavior/Pause On Focus (WCAG 2.2.1)`** — focuses the Close button, asserts the countdown
  pauses (`data-paused="true"`) and the toast stays visible past `autoHideDuration`, then blurs
  and asserts the countdown resumes. Exercises the keyboard/AT path.
- **`Behavior/Pause Flag Resets On Reopen (WCAG 2.2.1)`** (NEW, review fix #2) — opens a REUSED
  Snackbar, hovers it to pause, dismisses it via its own Close button while still hovered (node
  unmounts under the pointer → no `mouseleave`), reopens the same instance, and asserts the
  reopened toast is NOT paused and auto-dismisses again. Fails against the pre-fix stuck-flag code
  (the reopened toast keeps `data-paused="true"` and never auto-hides).
- **`Behavior/Dismiss On Escape (WCAG 2.1.1)`** (NEW, fix #3) — `autoHideDuration={0}` so auto-hide
  cannot confound the result; focuses the Close button, presses Escape, and asserts the message is
  removed. Fails against code with no Escape handler (the toast stays visible).
- Added `waitFor` to the `storybook/test` imports.

## Deferred
- **Alert `role="alert"` (assertive) for non-urgent severities** — `src/components/Alert/index.tsx:475`
  applies `role="alert"` (implicit `aria-live="assertive"`) to ALL severities, so a success/info
  toast interrupts whatever the screen reader is currently announcing; `role="status"` (polite) is
  the conventional choice for non-error/warning toasts. This is owned by the shared **Alert**
  component (outside this directory's editable scope) — recorded here for completeness and flagged
  for the Alert audit (`docs/a11y-audit/Alert.md`), where it is currently documented as a
  deliberate convention-backed choice. Suggested change (Alert-side): derive
  `role = severity === 'error' || severity === 'warning' ? 'alert' : 'status'` and set the matching
  `aria-live` (`assertive` vs `polite`) on the container `<div>` at `src/components/Alert/index.tsx`
  (the `role="alert"` on line 475 and the fallback on line 459). Not a Snackbar-side blocker.
