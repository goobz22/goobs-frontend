# Alert — a11y audit (2026-07-11)

**Status:** FIXED

**APG pattern:** [Alert](https://www.w3.org/WAI/ARIA/apg/patterns/alert/) — a live-region
container (`role="alert"`, implicit `aria-live="assertive"` + `aria-atomic="true"`) that
surfaces an important, time-sensitive message. It does not take focus and is not a focus-trap
overlay. A dismissible variant adds a single close button (still within the `alert` role, per
the common MUI/React-a11y convention — no `alertdialog` required for a plain dismiss control).

Component files: `src/components/Alert/index.tsx`, `src/components/Alert/Alert.module.css`,
`src/components/Alert/Alert.stories.tsx`. Decorative severity icons come from
`src/components/Icons/{Info,Error,Warning,CheckCircle}.tsx` (each spreads `{...props}` onto its
inner `<svg>`). Consumers: `Snackbar` (wraps Alert in a plain `<div>` — no competing role) and
`Form/DataGrid/FormDataGrid` (renders Alert as a form success/error banner — this is why the
close-button `type` matters).

## Issues found

### 1. Icon-only close button has no accessible name — SERIOUS — FIXED
- **WCAG:** 4.1.2 Name, Role, Value (A); 1.1.1 Non-text Content (A)
- **Pattern:** `missing-accessible-name`
- **Where:** `src/components/Alert/index.tsx:452-456` (pre-fix) — the close `<button>` contained
  only the glyph `✕` (U+2715) as its text. Screen readers announce that as "multiplication x"
  / "times" or nothing meaningful — no "Close" action name.
- **Fix:** added `aria-label="Close"` to the button and wrapped the glyph in
  `<span aria-hidden="true">✕</span>` so the accessible name is the word "Close" and the glyph
  is never double-announced. (`index.tsx:478-485`)

### 2. Close button defaults to `type="submit"` inside a form — SERIOUS — FIXED
- **WCAG:** 3.2.2 On Input (A) — activating the control causes an unexpected context change
  (form submission).
- **Pattern:** `button-missing-type`
- **Where:** `src/components/Alert/index.tsx:453` (pre-fix) — a bare `<button>` has an implicit
  `type="submit"`. Alert is rendered as a success/error banner **inside** `FormDataGrid`'s form,
  so pressing the dismiss control would submit/re-submit the enclosing form instead of only
  dismissing the alert.
- **Fix:** added `type="button"`. (`index.tsx:479`)

### 3. Decorative severity icon not hidden from assistive tech — MODERATE — FIXED
- **WCAG:** 1.1.1 Non-text Content (A)
- **Pattern:** `icon-missing-aria-hidden`
- **Where:** `src/components/Alert/index.tsx:444-448` (pre-fix) — the severity `<Icon>` rendered
  an `<svg>` with no `aria-hidden`, no `<title>`, no label. It is purely decorative reinforcement
  of the severity that the text already carries, so it should be removed from the a11y tree.
- **Fix:** passed `aria-hidden="true"` to `<Icon>`; the Icon spreads `{...props}` onto its inner
  `<svg>`, so the SVG is hidden. (`index.tsx:463-469`)

### 4. Severity conveyed by icon + colour only, not to screen readers — SERIOUS — FIXED
- **WCAG:** 1.4.1 Use of Color (A); 1.3.1 Info and Relationships (A)
- **Pattern:** `color-only-state`
- **Where:** `src/components/Alert/index.tsx` render — the error/warning/info/success distinction
  was communicated exclusively by the icon shape and the `[data-severity]` colour scheme. With the
  icon (correctly) hidden from AT (issue 3), a screen-reader user hears only the arbitrary message
  text with no indication of severity. `role="alert"` conveys "assertive/important" but not the
  level.
- **Fix:** added a visually-hidden severity prefix — `<span class="severityLabel">Error: </span>`
  (mapped `error→Error`, `warning→Warning`, `info→Information`, `success→Success`) rendered before
  the message so the assertive announcement becomes e.g. "Error: An error occurred…". The
  `.severityLabel` class is the standard clip-path visually-hidden technique — present in the a11y
  tree, invisible to sighted users who read severity from the icon + colour.
  (`index.tsx:436-451` map + `472-473` markup; `Alert.module.css` `.severityLabel`). The
  `.severityLabel` uses the modern `clip-path: inset(50%)` visually-hidden technique (see R4).

### 5. No visible keyboard focus indicator on the close button — SERIOUS — FIXED
- **WCAG:** 2.4.7 Focus Visible (AA)
- **Pattern:** `missing-focus-visible-style`
- **Where:** `src/components/Alert/Alert.module.css` — `.closeButton` had `:hover` treatments
  (scale + background) but no `:focus-visible` rule; keyboard users got only the UA default ring
  over a custom-background control, and no equivalent of the rich hover affordance.
- **Fix:** added `.closeButton:focus-visible { outline: 2px solid currentColor; outline-offset:
  2px; }`. `currentColor` is the severity text colour, so the ring is automatically theme- and
  severity-aware and contrasts against the alert background; the 2px+2px offset stays inside the
  container's 20px padding so the root's `overflow: hidden` never clips it. Matches the
  Card/ListItemCard focus-ring convention.

### 6. Animations/transitions ignore prefers-reduced-motion — MODERATE — FIXED
- **WCAG:** 2.3.3 Animation from Interactions (AAA — required by this audit's checklist)
- **Pattern:** `missing-reduced-motion`
- **Where:** `src/components/Alert/Alert.module.css` — container hover lift (`translateY`), icon
  hover `scale`/`rotate`, close-button hover `scale(1.1)`, and the closing `scale()` exit all ran
  unconditionally; there was no `@media (prefers-reduced-motion: reduce)` block (peers Card /
  SaveButton / ProgressBar already have one).
- **Fix:** appended a reduced-motion block that collapses `transition` to `none` on the root +
  close button and sets `transform: none` on every hover/closing movement (opacity fade retained —
  not motion). Placed last so it wins on equal specificity, and overrides caller-supplied
  `hoverTransform` in favour of the user's OS preference.

### 7. Unknown-severity fallback dropped the live-region role — MINOR — FIXED
- **WCAG:** 4.1.2 Name, Role, Value (A)
- **Pattern:** `status-not-announced`
- **Where:** `src/components/Alert/index.tsx:427` (pre-fix) — the out-of-enum defensive branch
  returned a bare `<div>` with neither `role="alert"` nor `data-component`, so a fallback message
  would not be announced and broke the machine-test `data-component` contract.
- **Fix:** added `data-component="Alert"` and `role="alert"` to the fallback div.
  (`index.tsx:434-438`)

## Hearing

No audio, `<audio>`/`<video>`, `AudioContext`, `new Audio`, or `navigator.vibrate` in the
component (grepped). All feedback is visual + programmatic (`role="alert"` live region +
`emitDiag('toast.shown')` on the host diagnostic bus). No sound-only information exists, so
WCAG 1.2.x / 1.4.2 do not apply. No change needed.

## Reading & screen reader

- `role="alert"` (assertive live region) is present and preserved for all severities — the
  message is announced on insertion without stealing focus. (Kept `role="alert"` for info/success
  rather than switching to the politer `role="status"` to preserve the existing machine-test /
  consumer contract; noted under Deferred.)
- Severity is now in the a11y tree via the visually-hidden prefix (issue 4).
- The decorative icon is hidden (issue 3); the close button has a real name (issue 1) and is a
  native `<button>` (semantic, keyboard-operable, Enter/Space activate for free).
- Keyboard: the only interactive element is the close button — it is reachable via Tab, activates
  with Enter/Space (native), and now shows a visible focus ring (issue 5). The Alert pattern has
  no arrow/Home/End keyboard model (it is not a composite widget), so no roving-tabindex is
  required. Escape-to-dismiss is **not** part of the APG Alert pattern (that belongs to
  dialog/alertdialog) — not added.
- Message text renders in the SSR HTML (no client-only injection of primary content).

## SEO semantics

- No headings are rendered by this component — the message is body text, correctly a `<div>`, not
  a mis-levelled `<div>`-as-heading, so no `headingLevel` prop is warranted.
- The Alert is itself a live-region landless region; `role="alert"` is the correct role. It is not
  a `<nav>`/`<header>`/`<aside>` landmark and contains no list/table/link content, so no landmark
  or `<a href>` work applies.
- The close button is a real `<button>` (not an onClick div).

## Fixes applied

1. `aria-label="Close"` + `type="button"` on the close button; glyph wrapped in
   `aria-hidden="true"` span. (`index.tsx`)
2. `aria-hidden="true"` on the severity `<Icon>` (spreads to the inner `<svg>`). (`index.tsx`)
3. Visually-hidden severity prefix (`Error:`/`Warning:`/`Information:`/`Success:`) +
   `.severityLabel` clip-path utility. (`index.tsx`, `Alert.module.css`)
4. `.closeButton:focus-visible` outline ring. (`Alert.module.css`)
5. `@media (prefers-reduced-motion: reduce)` block neutralising all hover/closing motion.
   (`Alert.module.css`)
6. `role="alert"` + `data-component` restored on the unknown-severity fallback. (`index.tsx`)

All API changes are additive — no prop renamed/removed/retyped, no existing
`data-*`/`role`/`aria` attribute removed. The public `AlertProps`/`AlertStyles` contract is
unchanged. Per-file gate `bun lint:file` passes for `index.tsx` and `Alert.stories.tsx`, and
`stylelint src/components/Alert/Alert.module.css` exits 0 (the CSS lint gate — see R4).

## Stories updated

- `InteractionTest` — now resolves the close button by `getByRole('button', { name: 'Close' })`
  (was `getByText('✕')`), uses a `fn()` spy for `onClose`, and asserts `onClose` fires after the
  200ms exit delay via `waitFor`.
- New `AccessibilitySemantics` (`A11y/Semantics`) — asserts: `role="alert"` present; the
  visually-hidden `Error:` severity label is in the DOM but visually clipped out of view; the
  decorative severity `<svg>` carries `aria-hidden="true"`; the message is visible; the close
  button has accessible name "Close" and `type="button"`; and keyboard focus reaches the close
  button. Exercises every DOM-level semantic added in this audit so a regression fails the story.

## Adversarial-review follow-up (2026-07-11)

A post-audit adversarial review flagged three items; all addressed at root cause. A later review
found a fourth (R4 — a CSS lint-gate regression introduced by the audit); also fixed at root cause.

### R1. `AccessibilitySemantics` regression assertion was broken — SERIOUS — FIXED
- **Where:** `Alert.stories.tsx` — the story used `await expect(severityLabel).not.toBeVisible()`
  to prove the visually-hidden severity prefix (issue #4).
- **Why it was wrong:** jest-dom's `toBeVisible()` derives visibility ONLY from computed
  `display`/`visibility`/`opacity` and the `hidden`/`<details>` attributes — it never inspects
  `clip`, `width`/`height`, or `overflow`. `.severityLabel` hides via
  `position:absolute; width:1px; height:1px; overflow:hidden; clip-path:inset(50%)`
  (`Alert.module.css`; see R4), leaving `display!=none`, `visibility=visible`, `opacity=1`. jest-dom
  therefore reports the node VISIBLE, so `.not.toBeVisible()` THROWS when the play function runs
  (`@storybook/test-runner` / Chromatic interactions) — the headline severity-announcement fix had
  no working regression lock.
- **Fix:** replaced the assertion with a real visually-hidden check that passes — the node is in
  the DOM (`toBeInTheDocument`), and `window.getComputedStyle` confirms
  `position:absolute` + `overflow:hidden` while `getBoundingClientRect()` confirms the box is
  collapsed to ≤1px × ≤1px. This asserts the geometry that actually hides it from sighted users.

### R2. Story coverage gap — icon `aria-hidden` uncovered — MINOR — FIXED
- **Where:** `Alert.stories.tsx` — no assertion covered issue #3 (severity `<Icon>` carries
  `aria-hidden`), so a regression removing it would not fail the only regression net goobs has.
- **Fix:** added a cheap DOM assertion — the alert's single `<svg>` (the severity icon; the close
  glyph is a text `<span>`) must carry `aria-hidden="true"`.
- **Deliberately deferred (per the review):** issue #5 (`.closeButton:focus-visible` ring) and
  issue #6 (`prefers-reduced-motion`) are CSS pseudo-class / media-query states, not DOM
  attributes; they are verified by the Chromatic visual baseline rather than a play-function
  assertion. Noted in the `AccessibilitySemantics` header comment.

### R3. Focus is lost on dismiss — MINOR — DOCUMENTED (consumer responsibility)
- **Where:** `index.tsx` `handleClose` — activating Close runs a 200ms timeout then `onClose?.()`;
  the parent typically unmounts the Alert, dropping focus to `<body>` with no restoration.
- **Assessment:** not an APG Alert-pattern requirement (the Alert pattern does not own focus) and
  genuinely consumer-delegated — the component cannot know where focus should return. No code
  change to the runtime behaviour.
- **Fix:** documented as a consumer responsibility in the `onClose` prop JSDoc (`index.tsx`) — the
  consumer should move focus to a sensible element (e.g. the control that surfaced the alert) in
  `onClose` to keep a logical focus order (WCAG 2.4.3).

### R4. Audit CSS broke the `lint:css` stylelint gate — MODERATE — FIXED
- **Where:** `Alert.module.css` — two lines added by this audit failed stylelint. The pre-audit
  file was stylelint-clean (exit 0); the audit's additions made `bun run lint:css` / `lint:all`
  exit 2. The audit report only claimed `bun lint:file` passed for the two `.tsx` files and never
  ran the CSS lint gate, so the regression went unnoticed.
- **Errors:**
  1. `.severityLabel` (issue #4) used the deprecated `clip: rect(0, 0, 0, 0)` property
     (stylelint `property-no-deprecated`).
  2. `.closeButton:focus-visible` (issue #5) used uppercase `currentColor` in `outline`
     (stylelint `value-keyword-case`, which wants lowercase `currentcolor`).
- **Fix:** `clip: rect(0, 0, 0, 0)` → `clip-path: inset(50%)` (the modern visually-hidden clip;
  behaviourally + visually identical — both leave the layout box at the explicit `1px × 1px`, so
  the `AccessibilitySemantics` `getBoundingClientRect()` ≤1px assertion still holds), and
  `currentColor` → `currentcolor` in the focus ring (an identical keyword). `stylelint
  src/components/Alert/Alert.module.css` now exits 0.
- **Note on the pre-existing `currentColor` at `.closeButton` (`color: var(--alert-close-color,
  currentColor)`):** untouched — it is inside a `var()` fallback, was pre-existing in the
  stylelint-clean file, and stylelint does not flag it in that position (verified: the file lints
  clean without changing it). No behavioural change; left as-is to keep the diff minimal.
- **Story:** no new story is warranted — the change is a lint-clean CSS equivalence with no new
  a11y state or rendered-DOM change; the existing `AccessibilitySemantics` story remains the
  regression lock (its stale `clip`-property comment was updated to `clip-path:inset(50%)`).

## Deferred

None require another owner's file for a fix. One design note (no code change made — would alter
announcement semantics and risk the machine-test/consumer `role="alert"` contract):

- **Politeness level for non-critical severities.** `role="alert"` (assertive) is used for all four
  severities. For `info`/`success` a politer `role="status"` (`aria-live="polite"`) would be less
  interruptive and is arguably better UX, but assertive is not a WCAG failure and `role="alert"` is
  the existing, contract-relied-upon attribute. If the library ever wants per-severity politeness,
  the right shape is an **additive** prop (e.g. `live?: 'assertive' | 'polite'`) defaulting to the
  current assertive behaviour — an API decision for the component owner, not an accessibility
  defect. Left as-is.
