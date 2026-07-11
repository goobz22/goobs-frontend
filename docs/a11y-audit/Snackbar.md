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

## Hearing (WCAG 1.2.x, 1.4.2)
CLEAN. Grepped the directory for `new Audio` / `AudioContext` / `<audio>` / `<video>` /
`navigator.vibrate` — zero matches. The snackbar conveys status purely visually (severity
icon + colour, from Alert) and programmatically (the inner Alert's `role="alert"` live region +
visually-hidden "Error:/Warning:/…" severity prefix). No information is audio-only, so no caption
or transcript affordance is required.

## Reading & screen reader (1.1.1, 1.3.1, 1.4.1, 2.1.x, 2.4.x, 3.2.x, 4.1.2, 4.1.3)
- **Announcement (4.1.3 Status Messages):** handled — the inner Alert renders `role="alert"`
  (assertive live region) containing the message, so mounting the snackbar announces it without
  moving focus (`src/components/Alert/index.tsx:466`). Snackbar deliberately adds NO `aria-live`
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
  activate natively). No arrow/Home/End interaction applies to a single-toast pattern. No Escape
  handler is expected on a non-modal toast (Escape is a dialog affordance).

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
- `src/components/Snackbar/index.tsx` — pause the auto-hide countdown while the snackbar is
  hovered or contains focus (WCAG 2.2.1); resume with a fresh full-duration timer on release;
  additive `data-paused` observability attribute. Public API unchanged (fully additive; no prop
  renamed/removed/retyped). No rendered element type changed.

## Stories updated
`src/components/Snackbar/Snackbar.stories.tsx`:
- **`Behavior/Pause On Hover (WCAG 2.2.1)`** — hovers the toast, asserts `data-paused="true"`,
  asserts it is STILL visible well past `autoHideDuration`, then unhovers and asserts it dismisses.
  Fails against the pre-fix always-run timer (toast vanishes while hovered).
- **`Behavior/Pause On Focus (WCAG 2.2.1)`** — focuses the Close button, asserts the countdown
  pauses (`data-paused="true"`) and the toast stays visible past `autoHideDuration`, then blurs
  and asserts the countdown resumes. Exercises the keyboard/AT path.
- Added `waitFor` to the `storybook/test` imports.

## Deferred
None. The remaining live-region / name / colour / icon semantics are all correctly implemented in
the shared `src/components/Alert` component (outside this directory) and are covered by
`docs/a11y-audit/Alert.md`. I evaluated whether the inner Alert's use of `role="alert"` (assertive)
for non-error severities (success/info) is over-assertive for a toast; the Alert audit documents
this as a deliberate, convention-backed choice for all severities, so it is NOT recorded here as a
defect.
