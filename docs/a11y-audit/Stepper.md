# Stepper — a11y audit (2026-07-11)

**Status:** FIXED
**APG pattern:** No dedicated WAI-ARIA APG "stepper" pattern exists; a step/progress indicator
is conventionally built as the [Breadcrumb](https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/)
shape — a labelled `<ol>`/`<li>` list of steps where reachable steps are real links, the current
step carries `aria-current="step"`, and each step's status has a text equivalent. This audit
aligns Stepper's `navigation` mode with that pattern (mirroring the already-audited sibling
`Breadcrumb`); `wizard` mode reuses the same list semantics without a `nav` landmark (its steps
are non-navigating buttons) and adds a completion status message.

Before this pass the component rendered every step as a stack of `<div>`s with a JS-navigating
`<button>` label, no list semantics, no current-step ARIA, and status conveyed **only** by a
decorative (already `aria-hidden`) status icon plus background colour — invisible to screen
readers.

## Issues found

| # | Severity | WCAG | Location (pre-fix) | Issue | Status |
|---|----------|------|--------------------|-------|--------|
| 1 | Serious | 1.3.1 Info & Relationships (A) | `index.tsx:284-330` | Steps rendered as `<div class="stepperContainer">` › `<div class="stepContainer">` — **no list semantics**. AT never announced "list, N items" / "step X of N"; the step set had no programmatic grouping. In navigation mode there was also no landmark. | FIXED (`<nav aria-label="Progress">` › `<ol role="list">` › `<li>`; wizard mode uses a self-labelled `<ol role="list">`). **Explicit `role="list"` added in the 2026-07-11 review follow-up — see below.** |
| 2 | Serious | 4.1.2 Name, Role, Value (A); 1.4.1 Use of Color (A) | `index.tsx:299` (`iconContainer[data-status]`) | The **current/active step carried no `aria-current`** — which step is "current" was conveyed only by the active icon shape + background colour, so a screen-reader user could not tell where they are. | FIXED (`aria-current="step"` on the active step's control) |
| 3 | Serious | 1.1.1 Non-text Content (A); 1.4.1 Use of Color (A); 1.3.1 (A) | `index.tsx:299-311` | A step's **status (completed / error / locked) had no text or programmatic equivalent**. The status icons are decorative-by-default (`resolveIconA11y` → `aria-hidden`), so status reached sighted users through icon+colour but reached AT users through *nothing*. | FIXED (visually-hidden `.srOnly` status word — "Completed"/"Error"/"Locked" — appended to each control's accessible name; active uses `aria-current`) |
| 4 | Serious | 4.1.2 Name, Role, Value (A); 1.3.1 (A) / SEO | `index.tsx:198-199, 304-311` | Reachable navigation-mode steps were `<button>`s that navigated via **`window.location.assign()`** on click — wrong role (button, not link), **not crawlable** in the SSR'd HTML, and no middle-click / open-in-new-tab / status-bar URL. | FIXED (reachable navigation steps are real `<a href>` anchors that navigate natively; `onClick` now only emits the diagnostic) |
| 5 | Moderate | 1.3.1 Info & Relationships (A) | `index.tsx:312-316` | The secondary `description` was a sibling `<div>` **not associated** with its step control — a screen reader read the label and the description as disconnected text. | FIXED (`aria-describedby` on the control → the description's `id`, via `React.useId`) |
| 6 | Moderate | 2.4.7 Focus Visible (AA) | `Stepper.module.css:173-195` (`.stepButton`, no `:focus-visible`) | The module had `:hover` and `:disabled` rules but **no `:focus-visible` treatment** — keyboard focus fell back to the UA default outline, easily lost against the sacred gold-on-dark and themed surfaces. | FIXED (`.stepButton:focus-visible` 2px ring using the per-theme `--goobs-*-focus-ring` tokens) |
| 7 | Minor | 2.3.3 Animation from Interactions (AAA) | `Stepper.module.css:139, 182` | `.iconContainer` and `.stepButton` use `transition: all 0.3s ease` with **no `prefers-reduced-motion` guard**. | FIXED (`@media (prefers-reduced-motion: reduce)` drops both transitions) |
| 8 | Moderate | 4.1.3 Status Messages (AA) | `index.tsx:227-229` | The wizard's **"All steps completed!"** pane appears (conditionally mounted) with **no live region**, so a screen-reader user gets no announcement that the wizard finished. | FIXED (announcement now via a **persistent, initially-empty** `role="status"` region at the component root; the visible title carries no role — hardened in the 2026-07-11 review follow-up, see below) |
| 9 | Moderate | 4.1.3 Status Messages (AA) | `index.tsx` wizard-mode step transition (Continue/Back) | **Wizard step transitions were not announced.** Advancing (Continue) or retreating (Back) swaps the rendered `content` and moves the active step **without moving focus** (focus stays on the Continue/Back button), so a screen-reader user got no signal they had navigated to a new step — only the terminal completion was announced (Issue 8), never the intermediate step moves. | FIXED (RF-3 — a **persistent, initially-silent** `aria-live="polite"` region announces the compact position "Step X of N: <label>" on each change; see the 2026-07-11 follow-up below) |
| 10 | Serious | 2.4.3 Focus Order (A) | `index.tsx:255` (completion branch of `renderWizardNavigation`) | **Keyboard focus was lost on wizard completion.** Activating **Finish** advances into the completion pane, which renders **instead of** the nav row holding the Finish button — so the focused Finish button **unmounts** and the browser drops focus to `<body>`. A keyboard user is stranded at the top of the document with no focus path to the pane's "Start Over"/`finalActions` buttons except tabbing from scratch. (Found in the 2026-07-11 second pass — distinct from the step-content focus nuance the original pass left to consumers: here the library's OWN control that held focus disappears.) | FIXED (focus is moved to the completion pane on the not-completed → completed transition; see the second-pass section below) |

No hearing/media issues: a grep of the component for `new Audio`/`AudioContext`/`<audio>`/
`<video>`/`navigator.vibrate`/`.play(` returned nothing — Stepper conveys no information by sound.

## Hearing

Clean. The component plays no audio and vibrates nothing. Every state (status, current step,
completion, hover, focus) is visual **and** now programmatic. No captions/transcript surface is
applicable.

## Reading & screen reader

- **List structure (Issue 1 / RF-1):** steps are a real `<ol role="list">`/`<li>`, so AT announces
  the count and position ("list, 4 items", "step 2 of 4"). The `role="list"` is explicit because
  `.stepperContainer` uses `list-style: none`, which makes WebKit strip the implicit list role
  (Safari/VoiceOver) — see RF-1. Navigation mode wraps the list in a `<nav aria-label="Progress">`
  landmark (its steps are genuine links); wizard mode omits the landmark (its steps do not
  navigate) and labels the `<ol>` itself `aria-label="Progress"`.
- **Current step (Issue 2):** the active step's control carries `aria-current="step"` — the state
  is now programmatic + icon-shape + colour, never colour alone (1.4.1 satisfied).
- **Status (Issue 3):** each control's accessible name ends with a visually-hidden status word
  ("… Completed" / "… Error" / "… Locked"). The active step relies on `aria-current="step"`
  ("current step") rather than a redundant word. So status is conveyed three ways — programmatic,
  icon shape (Check / Error / CircleOutline / Lock), and colour — never colour alone.
- **Real links (Issue 4):** reachable navigation-mode steps are `<a href>` anchors — crawlable,
  natively focusable, Enter-activatable, openable in a new tab. Locked (inactive) steps remain a
  disabled `<button>` (correctly not a link — nowhere to go). Wizard steps stay `<button>`s
  (disabled for not-yet-reached steps) since they fire a handler, not navigation.
- **Description association (Issue 5):** a step with a `description` links its control to the
  description text via `aria-describedby`, so the secondary text is announced with the step.
- **Focus (Issue 6):** `.stepButton:focus-visible` draws a 2px outline (per-theme focus-ring
  token, 2px offset) on both the `<a>` and `<button>` variants across sacred/light/dark.
- **Completion (Issue 8 / RF-2):** the wizard-completion announcement rides a **persistent,
  initially-empty** polite `role="status"` region at the component root; when the wizard finishes
  it is populated with "All steps completed!" and announced without stealing focus. The visible
  heading carries no role, so the message is announced exactly once (RF-2 hardening).
- **Step transitions (Issue 9 / RF-3):** a **separate** persistent `aria-live="polite"
  aria-atomic="true"` region announces the compact step position "Step X of N: <label>" on every
  Continue/Back move. Its initial content is silent (a polite region present at mount is not
  announced), each later change is announced, and it clears to `''` at completion so it never
  competes with the `role="status"` completion announcer. It reports only the POSITION, not the
  consumer's `content` — so a screen-reader user is told they navigated without the whole step body
  being read aloud, and without any focus move (see the RF-3 note below for why this replaces the
  earlier "left as-is" observation).
- **Keyboard model:** a stepper needs no arrow-key roving (like breadcrumb, it is an ordinary set
  of links/buttons) — Tab/Shift+Tab move between the real `<a>`/`<button>` step controls and the
  wizard Back/Continue/Finish/Start-Over `<button>`s; Enter (and Space on buttons) activate them
  natively. No keyboard trap; wizard mode is inline (no overlay/focus-trap surface).
- **Completion focus (Issue 10):** activating Finish unmounts the focused Finish button, so focus is
  moved to the completion pane (`role="group"` labelled "All steps completed!", `tabIndex={-1}`) on
  the not-completed → completed transition, instead of being dropped to `<body>` (WCAG 2.4.3). It fires
  only on that transition — never on initial mount — so a Stepper that renders already-completed does
  not steal focus on load (WCAG 3.2.1). `.wizardCompleted:focus-visible` shows the ring for keyboard
  completion only.

## SEO semantics

Now SSR-crawlable and correctly structured: `<nav aria-label="Progress">` → `<ol>` → `<li>` →
real `<a href>` step anchors (navigation mode). Previously the reachable steps were client-only
`window.location.assign()` buttons that a crawler could not follow; the anchors expose the same
destinations (`statusLink` ?? `stepLink` ?? `#`) in the server-rendered HTML. The decorative
connector lines are `aria-hidden`. `data-component="Stepper"`, `data-theme`, `data-status`, and
`data-action="goto-step"` machine-test selectors are all preserved. No heading is semantically
owed by a progress indicator, so no `headingLevel` prop was added; the wizard-completion title is
a status message (`role="status"`), not a document heading.

## Fixes applied

All at root cause, inside the component directory, additive-only (no prop renamed/removed/retyped;
no existing `data-*`/`role`/`aria` selector removed):

- `index.tsx`
  - Root now renders `<nav aria-label="Progress"><ol>…</ol></nav>` (navigation) or a self-labelled
    `<ol aria-label="Progress">` (wizard); each step is an `<li>`.
  - Reachable navigation steps render as `<a href={getStepLink(step)}>`; locked navigation steps
    and all wizard steps render as `<button type="button" disabled={!clickable}>`. Both variants
    keep `data-action="goto-step"` and gain `aria-current="step"` (active) + `aria-describedby`.
  - Added a `React.useId()` base and a `getStatusLabel()` helper; a `.srOnly` status `<span>` is
    appended inside each control.
  - `handleStepClick` no longer calls `window.location.assign` (the anchor navigates natively); it
    only emits the `nav.change` diagnostic, unchanged.
  - Decorative connectors gained `aria-hidden="true"`; the wizard-completion title gained
    `role="status"`.
  - Step controls gained `type="button"` (was an implicit `type="submit"` — a latent
    form-submission hazard if a Stepper were placed inside a `<form>`).
- `Stepper.module.css`
  - `.stepperContainer` (now an `<ol>`) gained `list-style:none; margin:0; padding:0` so the
    row/column layout is byte-for-byte unchanged.
  - Added `.stepButton { display:inline-block }` so the `<a>` variant boxes identically to the
    `<button>`; a `.stepButton:focus-visible` ring with per-theme override rules; a repo-standard
    `.srOnly` utility; and a `@media (prefers-reduced-motion: reduce)` block.

### Markup changes (per the API contract note)

- Container `<div>` → `<ol>` (+ a `<nav aria-label="Progress">` wrapper in navigation mode); each
  step `<div>` → `<li>`.
- Reachable navigation-mode step: `<button onClick=assign>` → **`<a href>`** (role button → link;
  now crawlable). Locked navigation steps and wizard steps stay `<button>` (unchanged element),
  gaining `type="button"`.
- New attributes only (nothing removed/renamed): `aria-current="step"`, `aria-describedby`,
  `aria-label="Progress"`, **`role="list"` on the `<ol>` (RF-1)**, `role="status"` on the
  persistent completion live region (RF-2), `aria-hidden` on connectors. `data-component`,
  `data-theme`, `data-status`, and `data-action="goto-step"` are all preserved on their prior
  elements (the peer-added `data-action="goto-step"` now rides on both the `<a>` and `<button>`
  variants).

## Stories updated

- **`NavigationSemantics`** (new; extended in the 2026-07-11 follow-up) — navigation mode with a
  `play` function that pins: the `<nav aria-label="Progress">` landmark, the `<ol>`/`<li>` list
  with the right item count **plus the explicit `role="list"` attribute on the `<ol>` (RF-1 — the
  Safari/VoiceOver guard)**, the completed step as a real `<a href>` whose accessible text includes
  "Completed", the active step as a link with `aria-current="step"` wired to its description via
  `aria-describedby`, and the locked step as a disabled `<button>` reading "Locked". These fail if
  any of Issues 1–5 or RF-1 regress.
- **`WizardCompletionAnnouncement`** (new; extended in the 2026-07-11 follow-up) — drives the
  wizard to completion (Continue → Finish) and asserts the completion announcement uses a
  **persistent, initially-empty `role="status"` region** (RF-2): the region exists and is empty
  before completion, is populated with "All steps completed!" after, and exactly two nodes carry
  the text (sr-only region + visible heading) — plus the "Start Over" reset. Fails if the
  completion live region regresses to a conditionally-mounted / already-populated form. **Extended in
  the second pass (Issue 10):** it now also `waitFor`-asserts that the completion pane
  (`getByRole('group', { name: 'All steps completed!' })`) `toHaveFocus()` after Finish — the
  regression that re-fails if focus falls back to `<body>` instead of the pane.
- **`WizardMode`** (extended in the 2026-07-11 RF-3 follow-up) — its `play` function now also pins
  the step-transition announcement (Issue 9 / RF-3): the polite `aria-live` region reads
  "Step 1 of 3: Plan" on mount, "Step 2 of 3: Build" after Continue (and no longer "Step 1 of 3:
  Plan"), and "Step 1 of 3: Plan" again after Back — matching the full unique "Step X of N: <label>"
  string, which targets the live region unambiguously (the step control itself carries only the bare
  label). Fails if the step-transition live region is dropped or stops tracking the active step.
- Existing `ThemeShowcase`, `SacredTheme`, `InteractiveDemo`, and the checkout / setup demo stories
  continue to exercise the status icons, themes, orientations, and wizard flow under the new markup.

## Adversarial review follow-up (2026-07-11)

A fresh adversarial review of the pass above found two remaining issues; both are now fixed at
root cause, additive-only, inside `src/components/Stepper/`.

### RF-1 (moderate) — Safari/VoiceOver list-role stripping was unguarded (WCAG 1.3.1)

`.stepperContainer` sets `list-style: none` (needed for the flex row/column layout). **WebKit
intentionally strips the implicit list role from any `<ul>`/`<ol>` whose computed `list-style`
is `none`** (documented WebKit behaviour; Scott O'Hara, "Fixing lists"). So on Safari + VoiceOver
— the default AT stack on macOS **and iOS** — the `<ol>` was NOT exposed as a list and the whole
"list, N items" / "step X of N" announcement (the headline promise of Issue 1) silently
regressed for a large screen-reader population. The `NavigationSemantics` story's
`getByRole('list')` gave false assurance because it runs under Chromium, where `list-style:none`
does **not** strip the role.

**Fix:** added an **explicit `role="list"`** to the `<ol>` (`index.tsx`, the `stepList` element).
Explicit `role="list"` overrides WebKit's implicit-role suppression, so the list is exposed on
Safari/VoiceOver again. The fix is additive (no attribute removed/renamed; machine-test
selectors untouched).

**Regression pin:** `NavigationSemantics` now asserts `list.tagName === 'OL'` **and**
`toHaveAttribute('role', 'list')` — the attribute assertion (not just the resolved role) fails if
the explicit `role` is dropped, so it actually protects the Safari path even though the play
function runs under Chromium.

### RF-2 (minor) — completion live region was injected already-populated (WCAG 4.1.3)

Issue 8's `role="status"` lived on the visible completion title, which is **conditionally mounted
already containing its text**. Live regions inserted into the DOM already populated are announced
inconsistently by some assistive tech; the robust pattern is a **persistent, initially-empty**
`role="status"` region that is populated later.

**Fix:** moved the announcement to a persistent, visually-hidden (`.srOnly`) `role="status"`
region declared **once at the component root** (rendered for the whole life of a wizard-mode
Stepper, empty until `activeStep >= steps.length && finalActions`, then populated with
"All steps completed!"). The visible completion heading now carries **no role**, so the message is
announced **exactly once** (no double-announcement) and always into an already-present live region.

**Regression pin:** `WizardCompletionAnnouncement` now asserts the live region exists and is
**empty before completion** (`getByRole('status')`, `textContent === ''`), is **populated after
completion** (`toHaveTextContent('All steps completed!')`), and that exactly **two** nodes carry
the text (`getAllByText(...).toHaveLength(2)` — the sr-only region + the visible heading), which
regresses to one if the persistent region is removed and would throw on `getByRole('status')` if
the visible title's role were re-added. Note this pin **still passes unchanged after RF-3**: the
new step-transition region is `aria-live="polite"` (NOT `role="status"`), so `getByRole('status')`
still uniquely resolves the completion region, and the region holds `''` at completion, so the
`getAllByText('All steps completed!')` count stays exactly two.

### RF-3 (moderate) — wizard STEP transitions were not announced (WCAG 4.1.3)

Issue 8 / RF-2 announced only the terminal "all steps completed" state. The **intermediate** step
moves — clicking Continue or Back — swap the rendered `content` and move the active step **without
moving focus** (focus stays on the Continue/Back button), so a screen-reader user got no signal
that they had advanced or gone back a step. This is the same 4.1.3 "content changes without focus,
not announced" shape as the completion gap, one level up (per-step, not just at the end).

The original pass's closing "non-blocking observation" had looked at this and declined **two heavy
options** — wrapping the arbitrary consumer `content` in an `aria-live` region (over-announces: the
content can be a whole form) and moving focus into the new content (an unexpected behaviour change).
RF-3 takes the **lighter, standard third path those two never considered**: announce only the
compact **step position**, not the content, and move no focus.

**Fix:** a **separate** persistent `aria-live="polite" aria-atomic="true"` visually-hidden
(`.srOnly`) region at the component root (`index.tsx`), rendered for the whole life of a wizard-mode
Stepper. It holds `Step ${activeStep + 1} of ${steps.length}: ${label}` while `activeStep <
steps.length` and `''` otherwise. Because it is present at mount its initial value is silent; each
later change is announced politely; and it clears at completion so it never overlaps the
`role="status"` completion announcer. It is deliberately **not** `role="status"` so it stays a
distinct region from the completion announcer (and so the RF-2 test's `getByRole('status')` stays
unambiguous). Additive-only — no prop, `data-*`, `role`, or `aria` attribute was removed or renamed;
machine-test selectors untouched.

**Regression pin:** `WizardMode`'s `play` function asserts the region reads "Step 1 of 3: Plan" on
mount, "Step 2 of 3: Build" after Continue, and "Step 1 of 3: Plan" again after Back (with the prior
string gone at each step), matching the full "Step X of N: <label>" string — unique to the live
region, so it can't accidentally match the bare step-control label.

## Second-pass follow-up (2026-07-11) — completion focus loss

A fresh audit pass over the (already strong) committed work above re-verified every prior claim
against the source and the icon subsystem — all correct — and found **one** remaining gap, now
fixed at root cause, additive-only, inside `src/components/Stepper/`.

### Issue 10 (serious) — keyboard focus lost on wizard completion (WCAG 2.4.3)

The wizard completion branch (`renderWizardNavigation`, `index.tsx:255`) renders the completion pane
**instead of** the nav row that holds the Continue/**Finish** button. So when a keyboard user
activates Finish, the button that held focus is unmounted and the browser drops focus to `<body>` —
the user is stranded at the top of the document, and the pane's `finalActions` / "Start Over" buttons
are only reachable by tabbing from scratch. This is the classic "the control I just activated
disappeared, and focus went nowhere sensible" Focus-Order failure. It is **distinct** from the
step-content focus nuance the original pass deferred to consumers (below): that concerns focusing the
consumer's arbitrary step `content` on ordinary transitions; this concerns the library's OWN
navigation button vanishing.

**Fix (`index.tsx`):** a component-level `showCompletionPane` boolean
(`isWizardMode && activeStep >= steps.length && Boolean(finalActions)`) drives a `useEffect` that
calls `.focus()` on the completion pane. It fires **only on the not-completed → completed
transition** — `prevShowCompletionRef` seeds to the first render's value, so the effect no-ops on
initial mount and a Stepper that renders already-completed does **not** steal focus on load (guards
WCAG 3.2.1 On Focus). The completion pane gained `ref`, `tabIndex={-1}` (programmatic-only focus
target, never a Tab stop), `role="group"`, and `aria-labelledby` → the completion title (which gained
a `useId`-based `id`), so the pane has the accessible name "All steps completed!" when focus lands.
The persistent `role="status"` announcer (RF-2) is **kept**, not replaced: the live region announces
regardless of focus, and the focus move restores keyboard operability. A same-tick focus change tends
to supersede the queued polite announcement, so real-world double-speak is minimal.

**Fix (`Stepper.module.css`):** added `.wizardCompleted:focus-visible` (2px outline) with per-theme
override rules (`--goobs-{sacred,light,dark}-focus-ring`), matching the existing
`.stepButton:focus-visible` pattern. `:focus-visible` (not `:focus`) keeps the ring off when the
wizard is completed by mouse/touch.

**Markup changes:** the completion pane `<div>` **gains** `role="group"`, `aria-labelledby`, and
`tabIndex={-1}`; its title `<div>` **gains** an `id`. All additive — nothing removed or renamed, and
no machine-test selector (`data-component`/`data-theme`/`data-orientation`/`data-status`/`data-action`)
is touched (those live on the root, list, and step controls, none of which changed).

**Regression pin:** `WizardCompletionAnnouncement`'s `play` now `waitFor`-asserts
`getByRole('group', { name: 'All steps completed!' }).toHaveFocus()` after Finish (imported `waitFor`
from `storybook/test`). It re-fails if the completion pane stops receiving focus (i.e. focus falls to
`<body>`). All prior assertions in that story (empty-then-populated `role="status"`, exactly-two "All
steps completed!" nodes, "Start Over" visible) still pass unchanged with the additive markup.

**Commit:** `283f7e0d` — `a11y(Stepper): move focus to completion pane on wizard finish (WCAG 2.4.3)`.

## Deferred

- **Breadcrumb (cross-component — same list-role class as RF-1).** `src/components/Breadcrumb/index.tsx:246`
  renders `<ol className={cssStyles.list}>` with **no explicit `role="list"`**, and
  `src/components/Breadcrumb/Breadcrumb.module.css:67` sets `list-style: none`. This is the exact
  WebKit implicit-list-role-stripping bug fixed for Stepper in RF-1, so Breadcrumb's list is not
  exposed on Safari/VoiceOver. **Suggested change:** add `role="list"` to the `<ol>` at
  `Breadcrumb/index.tsx:246` (`<ol role="list" className={cssStyles.list}>`) and pin it with a
  story assertion. Not fixed here because `src/components/Breadcrumb/` is outside this fix-owner's
  directory.

- **`"← Back"` glyph in the wizard Back button (Minor, shared file — NOT owned).** The Back button's
  text is `"← Back"`; the U+2190 arrow is decorative but part of the button's text string, so some AT
  may voice "left arrow, Back". The arrow is a useful visual affordance; aria-hiding *just* the glyph
  would require an icon/text split in the shared **Button** component (`src/components/Button/`) —
  outside this fix-owner's directory. **Suggested change:** give `CustomButton` a way to render a
  leading decorative icon marked `aria-hidden`, or pass `"Back"` as the accessible name with the arrow
  as a separate hidden node. Deferred (shared file).

The remaining Stepper fixes (original pass + both follow-ups) lived inside `src/components/Stepper/`.
No shared-file change (Icons, Button, `global.css`, barrel) was required for any FIXED issue: the
status icons were already correctly decorative via the shared `resolveIconA11y` contract, and the
focus-ring/`.srOnly` conventions reuse existing `--goobs-*` tokens and the repo-standard pattern.

### Non-blocking observations (not WCAG failures — left as-is)

- **Wizard-completion title is not a real heading (SEO/semantics).** `.wizardCompletedTitle` ("All
  steps completed!") is a `<div>`. Making it an `<h1>`–`<h6>` would aid heading navigation, but it is
  transient client-only wizard state (not crawled primary content), is already announced via
  `role="status"` and now reachable via the completion focus move + `aria-labelledby`, and the correct
  level depends on the consumer's outline — the additive fix would be a `headingLevel` prop, a broader
  API decision beyond hardcoding a possibly-mis-nested level. Left as a `<div>`; a `headingLevel` prop
  is the recommended future add.
- **Nav-mode dynamic status changes are not announced.** Navigation mode has no live region, so a
  consumer that flips a step to `error`/`completed` *in place* (as `InteractiveDemo` does) gets no SR
  announcement. Nav mode's model is page-navigation-based (statuses set by the server render per route,
  announced on load via `aria-current`/status text), so a live region here risks noise for little gain.
- **"Locked" wording for not-yet-reached wizard steps.** A wizard future step derives status
  `inactive` → SR-only word "Locked", which reads slightly stronger than "upcoming/not completed" for a
  step you simply haven't reached. The state (disabled, unreachable) is conveyed correctly, satisfying
  WCAG; the wording is a copy nuance, left as-is.

**Superseded observation (now RF-3, fixed):** the original pass left wizard step changes
unannounced, reasoning that wrapping the arbitrary consumer `content` in `aria-live` would
over-announce and moving focus would be an unexpected behaviour change. RF-3 keeps both of those
conclusions but adds the missing middle path — a compact position announcement ("Step X of N:
<label>") that reports neither the full content nor a focus move — so a screen-reader user is now
told they navigated. The remaining nuance (whether the consuming app should also own focus
management for its own step content) is genuinely the consumer's call and is left to them; the
per-step orientation announcement is the library's responsibility and is now provided.
