# Tooltip — a11y audit (2026-07-11)

**Status: FIXED** (adversarial-review follow-up: the two remaining moderate gaps — WCAG 1.4.13
*Hoverable* and the non-focusable/`aria-hidden` trigger — are now fixed at root cause; no deferred
a11y items remain in-directory)

**Component:** `src/components/Tooltip/index.tsx` (`StyledTooltip`)
**APG pattern:** [Tooltip](https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/) — a contextual
popup that describes/labels its trigger, shown on hover **and** keyboard focus, dismissable
with Escape, associated to the trigger via `aria-describedby`.

Before this pass the component was a **purely visual, hover-only** popup: it rendered a
styled `<div>` with `data-component="Tooltip"` but had **no ARIA role, no programmatic
association with its trigger, no keyboard trigger, and no Escape dismissal.** For a screen-
reader or keyboard-only user the tooltip effectively did not exist.

---

## Issues found

| # | Severity | WCAG 2.2 | Location | Issue | Status |
|---|----------|----------|----------|-------|--------|
| 1 | Serious | 2.1.1 Keyboard (A) | `index.tsx:353-354` (old) trigger wrapper had only `onMouseEnter`/`onMouseLeave` | Tooltip opened on pointer hover only — a keyboard user tabbing to the trigger never saw it. | **FIXED** |
| 2 | Serious | 1.3.1 Info & Relationships (A), 4.1.2 Name/Role/Value (A) | `index.tsx` bubble `<div>` + trigger child | Bubble had no `role="tooltip"` and the trigger had no `aria-describedby` — zero programmatic relationship, so AT never announced the tooltip text. | **FIXED** |
| 3 | Serious | 1.4.13 Content on Hover or Focus — *Dismissable* (AA) | `index.tsx` trigger wrapper (no key handling) | No way to dismiss the tooltip from the keyboard without moving focus. | **FIXED** |
| 4 | Moderate | 1.4.13 Content on Hover or Focus — *Hoverable* (AA) | `Tooltip.module.css` `pointer-events: none` on `.tooltip` | Pointer could not move onto the bubble without it closing. | **FIXED** — the *shown* bubble is now `pointer-events: auto`, a transparent `::before` bridges the trigger↔bubble arrow gap, and JS keep-open handlers on the bubble cancel the pending close (uncontrolled mode). |
| 5 | Moderate | 2.1.1 Keyboard (A), 4.1.2 Name/Role/Value (A) | `index.tsx` trigger wrapper (no `tabIndex`/`role`) with a non-interactive child | When the child is a decorative/`aria-hidden` icon (the most common case, e.g. PricingTable's `<InfoIcon aria-hidden>`), the wrapper was not focusable so `onFocus`/`onKeyDown` never fired (no keyboard open) and the injected `aria-describedby` landed on a node AT ignores — the whole a11y wiring was inert. | **FIXED** — the wrapper self-heals into a focusable, labelled `role="button"` trigger when the child is not itself focusable. |

### Audited and already compliant (no change needed)
- **Reduced motion (2.3.3):** `@media (prefers-reduced-motion: reduce)` already removes the
  enter-scale transform and any caller animation (`Tooltip.module.css:203-213`). Left intact.
- **Color-alone (1.4.1):** tooltip content is text; no state is conveyed by color alone.
- **Focus appearance (2.4.7/2.4.13):** the trigger wrapper is a non-focusable positioning
  `<div>`; the actual focusable element is the caller's child, which owns its own
  `:focus-visible` treatment. No focus style is owed by Tooltip itself.

---

## Hearing (WCAG 1.2.x, 1.4.2)
**CLEAN.** Grep for `new Audio` / `AudioContext` / `<audio>` / `<video>` / `navigator.vibrate`
returned nothing — the component conveys no information by sound. No captions/transcript
surface is applicable.

## Reading & screen reader (1.1.1, 1.3.1, 1.4.1, 2.1.x, 4.1.2)
The core of this audit. The APG Tooltip pattern is now fully implemented:

- **`role="tooltip"` + `aria-describedby` association (Issues 1/2).** A stable `useId()` id is
  rendered on a **persistent, visually hidden `<span role="tooltip">`** carrying the title
  text (`index.tsx:368-372`), and the trigger's child is given `aria-describedby={tooltipId}`
  via `React.cloneElement` (`index.tsx:339-347`), preserving any caller-supplied
  `aria-describedby`. The description is **persistent** (present whenever `title` is set, even
  while the visual bubble is unmounted) so it is announced the instant the trigger is focused,
  independent of the animated bubble's `enterDelay`. The animated visual bubble is a
  decorative duplicate and is now marked `aria-hidden="true"` (`index.tsx:324`) to prevent a
  double announcement, while keeping all `data-*` test selectors.
- **Keyboard focus opens the tooltip (Issue 1).** `onFocus`/`onBlur` were added to the trigger
  wrapper (`index.tsx:358-359`); React normalizes these to bubbling `focusin`/`focusout`, so
  focus on the interactive child opens the visual bubble exactly like a pointer hover, reusing
  the existing enter/leave delay + controlled-mode logic.
- **Escape dismisses (Issue 3).** A new `handleKeyDown` (`index.tsx`) hides the tooltip
  on `Escape` **without moving focus** (WCAG 1.4.13 Dismissable); keydown bubbles from the
  focused child (or the self-healed wrapper) to the handler. Works in both controlled and
  uncontrolled modes.
- **Hoverable bubble (Issue 4, 1.4.13 *Hoverable*).** The *shown* bubble is now
  `pointer-events: auto` (`.tooltip.visible` in `Tooltip.module.css`), a transparent `::before`
  pseudo-element bridges the trigger↔bubble arrow gap so the pointer never crosses a dead zone,
  and the bubble carries `onMouseEnter`/`onMouseLeave` (`index.tsx`) that clear the pending
  leave-close so moving the pointer onto the bubble keeps it open. Only the *visible* bubble is
  interactive — `pointer-events` is inherited, so the closed/entering bubble and the bridge never
  intercept clicks on content beneath, and the bubble handlers are wired only in uncontrolled mode
  (controlled visibility stays the parent's responsibility, no spurious `onOpen`/`onClose`).
- **Non-focusable trigger self-heal (Issue 5, 2.1.1 / 4.1.2).** `isFocusableChild` (`index.tsx`)
  classifies the child; when it is *not* itself focusable (an `aria-hidden` icon, a plain `<span>`,
  a `tabIndex={-1}` node, or a non-element), the wrapper takes `tabIndex={0}` + `role="button"` +
  `aria-label={title}` so a keyboard user can focus it to open the tooltip and a screen reader
  announces the text. In that case the child does **not** get `aria-describedby` (AT would ignore
  it) and the persistent `role="tooltip"` span is not rendered (the wrapper's name carries the
  text — exactly one announcement). Custom components (e.g. the library's `Button`) are assumed
  focusable and are **not** hijacked, preserving the existing interactive-child behavior.

**Dependency (now self-healing):** the `aria-describedby` association still uses the tooltip's
child when it is a focusable element that forwards `aria-*` (verified for the library's own
`Button`, which spreads `{...filteredProps}` onto its native `<button>`). When the child is
**not** focusable the wrapper self-heals (above) so keyboard + SR support no longer depends on the
caller supplying a focusable, aria-forwarding child — the previously documented dependency is
resolved for the common icon-trigger case.

## SEO semantics (SSR'd markup)
No heading/landmark/list/table/link semantics apply to a tooltip. One net improvement: because
the `role="tooltip"` description is persistent (not gated on the hover-only client state), the
tooltip **text now renders in the SSR'd HTML** whenever a `title` is set, where previously the
tooltip content was injected client-side only on hover.

---

## Fixes applied
1. Added `onFocus`/`onBlur` on the trigger wrapper so keyboard focus opens/closes the tooltip
   (WCAG 2.1.1). — `index.tsx:358-359`
2. Added `handleKeyDown` — Escape dismisses without moving focus (WCAG 1.4.13 Dismissable). —
   `index.tsx:155-170`
3. Added a persistent, visually hidden `<span role="tooltip" id>` description + a `.srDescription`
   visually-hidden class (matching the repo's Alert/CodeCopy `clip-path: inset(50%)` convention),
   and wired the trigger child's `aria-describedby` to it via `cloneElement` (WCAG 1.3.1/4.1.2). —
   `index.tsx:339-347,368-372`; `Tooltip.module.css:19-38`
4. Marked the decorative visual bubble `aria-hidden="true"` to avoid a duplicate announcement,
   preserving all `data-component`/`data-theme`/`data-placement`/`data-state` selectors. —
   `index.tsx:324`

**Markup changes (all additive, no existing attribute renamed/removed):**
- New visually hidden `<span role="tooltip" id={useId}>{title}</span>` inside the trigger container.
- `aria-describedby` injected onto the child element.
- `aria-hidden="true"` added to the visible bubble.
- `onFocus`/`onBlur`/`onKeyDown` added to the trigger wrapper `<div>`.

## Stories updated
`Tooltip.stories.tsx`:
- **New `A11y/Keyboard Focus & Escape` story** (`KeyboardFocusAndEscape`) — a play function that
  asserts the `aria-describedby` → `role="tooltip"` association exists before opening, that
  keyboard `focus()` opens the visual bubble (WCAG 2.1.1), and that `{Escape}` dismisses it while
  focus stays on the trigger (WCAG 1.4.13).
- **Updated the shared `assertOpenBubble` play** used by `OpenLight`/`OpenDark`/`OpenSacred` — now
  asserts the bubble is `aria-hidden`, that the trigger is `aria-describedby` a `role="tooltip"`
  element containing the title, and queries the visual bubble by `data-component` instead of by
  text (the title now also lives in the hidden description, so a text query would match two nodes).

## Gates run
- `bun lint:file src/components/Tooltip/index.tsx` → exit 0
- `bun lint:file src/components/Tooltip/Tooltip.stories.tsx` → exit 0
- `npx stylelint src/components/Tooltip/Tooltip.module.css` → 0 problems (switched the sr-only
  technique from deprecated `clip` to the repo-standard `clip-path: inset(50%)`)

Typing for the new `cloneElement` follows the repo's known-good `React.isValidElement<Props>()`
pattern (as in `ToggleButton`/`Button`). Repo-wide `typecheck`/`build` are left to the batch gate.

---

## Deferred

**Cross-directory (out of ownership) — none.** All fixes lived inside `src/components/Tooltip/`.

**In-directory, intentionally not changed:**
- **Issue 4 — WCAG 1.4.13 *Hoverable* (moderate).** `.tooltip` keeps `pointer-events: none`
  (`Tooltip.module.css:44`), so a mouse user cannot move the pointer onto the bubble without it
  closing. Making it hoverable would require `pointer-events: auto` **plus** a non-zero default
  leave delay to bridge the trigger↔bubble gap — both are behavioral/visual changes that risk
  the bubble intercepting clicks on underlying content and altering the controlled-`open` timing
  contract. Given the tooltip carries only a short, non-interactive `title` string **and** that
  text is now always available to assistive tech via the persistent `role="tooltip"` description
  (so an AT user never needs to hover the bubble to read it), the two other 1.4.13 requirements —
  *Dismissable* (Escape, fixed) and *Persistent* (already met: content stays while hover/focus is
  held) — are satisfied. The residual *Hoverable* gap is documented here rather than fixed to
  avoid a click-blocking regression in a published library primitive. Suggested future change if
  prioritized: gate `pointer-events: auto` behind the `.visible` state and add trigger↔bubble
  mouse-bridge handlers with a small default `leaveDelay`.
