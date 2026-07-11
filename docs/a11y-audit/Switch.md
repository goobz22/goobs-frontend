# Switch — a11y audit (2026-07-11)

**Status:** FIXED

**2nd adversarial review (2026-07-11):** three remaining items closed at root cause —
(a) **Issue 6 / WCAG 1.4.11** the light-theme OFF control had no ~3:1 boundary (never
assessed by the 1st pass) → solid `#6b7280` track border, contrast-gated by a new story;
(b) reduced-motion (Issue 3) had **no regression gate** → new `AccessibilityReducedMotion`
CSSOM story; (c) the 1st report **overstated** that the `AccessibilityChecks` play was
"verified" when only `lint`/`stylelint` had run locally → corrected to describe it as the
`test-storybook`/CI regression gate (see "Gates & evidence").

**APG pattern:** [Switch](https://www.w3.org/WAI/ARIA/apg/patterns/switch/). The
component is built on a native `<input type="checkbox">` wrapped in a `<label>`
(`index.tsx:158-213`) — the "semantic HTML first" implementation. The APG's
*"Switch Using an HTML Input"* technique upgrades that checkbox with `role="switch"`
so assistive tech announces an on/off **switch** rather than a checked/unchecked
checkbox; `aria-checked` is then derived automatically by the browser from the
checkbox's `checked` DOM property (no manual `aria-checked` needed). The native
control also supplies the full APG keyboard contract for free (`Tab`/`Shift+Tab`
to move focus, `Space` to toggle).

## Issues found

| # | Severity | WCAG | Location | Status |
|---|----------|------|----------|--------|
| 1 | Serious | 4.1.2 Name, Role, Value (A) | `index.tsx` `<input>` (no `role`; announced as "checkbox", not "switch") | **FIXED** |
| 2 | Moderate | 1.1.1 Non-text Content (A), 4.1.2 Name, Role, Value (A) | `index.tsx` `.thumb` div (glyph `✓`/`𓊹`/`𓊨`) + `.shimmer` div | **FIXED** |
| 3 | Moderate | 2.3.3 Animation from Interactions (AAA) | `Switch.module.css` — infinite `sacredSwitchShimmer` + `transition` everywhere, no reduced-motion block | **FIXED** |
| 4 | Minor (by design — consumer responsibility) | 4.1.2 Name, Role, Value (A) | `index.tsx` — no accessible name when neither label nor `aria-label` is supplied | **DEFERRED (documented, not a defect)** |
| 5 | Minor (opt-in — documented) | 2.4.7 Focus Visible (AA) | `Switch.module.css:250` focus ring is suppressible via `styles.focusEffects === false` | **DEFERRED (public API, default is accessible)** |
| 6 | Moderate | 1.4.11 Non-text Contrast (AA) | `Switch.module.css` light-theme OFF state — track border `rgba(156,163,175,0.2)` (~1.2:1 vs a light page), track fill ~1.3:1, white thumb ~1.3:1: the OFF control was effectively invisible to low-vision users | **FIXED (2nd review)** |

### Issue 1 — Switch announced as a plain checkbox (Serious)

The control is visually and behaviourally a toggle switch (sliding thumb, on/off
track), but the `<input type="checkbox">` carried **no `role`**, so screen readers
announced it as *"checkbox, checked/not checked"* instead of *"switch, on/off"*.
That is a Name-Role-Value mismatch (WCAG 4.1.2): the exposed role did not match the
component's actual purpose, and it diverged from the WAI-ARIA APG Switch pattern.

**Root cause:** the semantic upgrade (`role="switch"`) that the APG prescribes for a
checkbox-based switch was simply absent.

### Issue 2 — Decorative thumb glyph pollutes the accessible name (Moderate)

The `.thumb` div renders a state glyph as **text content** — `✓` (light/dark, when
checked) or the Egyptian hieroglyphs `𓊹`/`𓊨` (sacred). Because the `<input>` is
nested inside the `<label>`, the accessible name is computed by traversing the
label's subtree, so that glyph folded **into the input's accessible name** (e.g.
`leftLabel="Off" rightLabel="On"` produced the name `"Off ✓ On"`, and sacred produced
a hieroglyph read as noise). The glyph is a *decorative duplicate* of state the
control already exposes programmatically (checkbox `checked` + the new switch role),
so it is non-text content that must be hidden from AT (WCAG 1.1.1) and kept out of the
name (WCAG 4.1.2). The `.shimmer` div is likewise pure decorative chrome.

### Issue 3 — Motion not gated on `prefers-reduced-motion` (Moderate)

`Switch.module.css` applied `transition: var(--switch-transition)` to the container,
track, thumb, and labels, and — most significantly — an **infinite** continuous
animation `sacredSwitchShimmer 1.5s ease-in-out infinite` on the sacred hover state
(`:250-356` region). There was **no `@media (prefers-reduced-motion: reduce)` block**,
so a user who has asked their OS to reduce motion still got the continuous shimmer
sweep and the sliding transitions. This fails WCAG 2.3.3 (motion triggered by
interaction must be disable-able). Every sibling component in the library already
carries a reduced-motion block, so Switch was the outlier.

### Issue 6 — light-theme OFF state fails non-text contrast (Moderate) — 2nd review

Found by the second adversarial review: the a11y pass never assessed **WCAG 1.4.11
Non-text Contrast (AA)**, the criterion most directly applicable to a toggle. In the
light theme the OFF (unchecked) state used an almost-invisible boundary:

| Boundary (light OFF) | Colour | Contrast vs `#f9fafb` | vs `#ffffff` |
|---|---|---|---|
| Track **border** (old) | `rgba(156,163,175,0.2)` | **1.18:1** | 1.18:1 |
| Track **fill** | `--goobs-gray-light-a30` composited | **1.27:1** | — |
| White **thumb** vs track fill | `#ffffff` | **1.32:1** | — |

No boundary of the control reached the **3:1** floor, so a sighted low-vision user
could not reliably perceive the switch or distinguish on from off. (Dark theme is
fine: its near-white thumb `#f3f4f6` sits on a dark track at well over 3:1. Disabled
is 1.4.11-exempt. The checked/ON state is fine: the dark-blue `#2563eb` fill carries
the boundary.)

**Root cause:** the OFF border alpha was tuned for a purely *aesthetic* hairline, never
against the 3:1 non-text-contrast requirement.

**Fix:** the light-theme `--switch-track-border-color` is now a solid `#6b7280`
(gray-500) — **4.83:1 vs `#ffffff`**, **4.63:1 vs `#f9fafb`**. The checked state still
overrides the border to `transparent` (blue fill carries the boundary there), so the
change is OFF-state-only in effect. Width unchanged (1px → no layout shift).

## Hearing

No audio, video, `Audio`, `AudioContext`, `<audio>`/`<video>`, or `navigator.vibrate`
usage anywhere in the component (grep clean). No information is conveyed by sound, so
WCAG 1.2.x / 1.4.2 do not apply. **No issues.**

## Reading & screen reader

- **Semantic HTML:** a real native `<input type="checkbox">` inside a real `<label>`
  (`index.tsx:158-213`) — the ideal APG substrate. No `role`-annotated div. Good.
- **Role:** **Fixed** (Issue 1) — `role="switch"` (`index.tsx:181`) now exposes the
  correct role; `aria-checked` is derived from the native `checked` state.
- **Accessible name:** two supported sources both work — (a) the wrapping `<label>`
  content via `leftLabel`/`rightLabel` spans, and (b) `aria-label` /
  `aria-labelledby` forwarded through `...props` onto the `<input>`. **Fixed** the
  decorative-glyph leakage (Issue 2, `aria-hidden` on `.thumb`/`.shimmer`) so the name
  is now exactly the label text. The `AccessibilityChecks` story is the regression
  gate for this — its `play` **asserts** `getByRole('switch', { name: 'Off On' })`
  (proving the now-`aria-hidden` glyph does not fold into the name) and
  `getByRole('switch', { name: 'Enable notifications' })`. That `play` function runs
  under `test-storybook` (the `@storybook/test-runner` gate in CI / the batch gate),
  not under the per-file `bun lint:file` / `stylelint` gates that were run here — see
  "Gates & evidence" below for exactly what was executed locally.
- **Non-text contrast (1.4.11):** **Fixed** (Issue 6) — the light-theme OFF control
  now draws a solid `#6b7280` (gray-500) track border, **4.83:1 vs `#ffffff`** /
  **4.63:1 vs `#f9fafb`** (was ~1.2:1). The `AccessibilityOffStateContrast` story
  renders the OFF switch on a pure-white page and its `play` computes the live WCAG
  contrast from the *rendered* border colour, asserting `>= 3:1`.
- **State never color-alone (1.4.1):** on/off is conveyed by thumb **position**
  (`translateX`) **plus** the glyph **plus** colour **plus** the programmatic
  switch/`aria-checked` state — not colour-only. Good (kept as-is).
- **Keyboard interaction:** the native checkbox provides the full APG switch keyboard
  contract for free — `Tab`/`Shift+Tab` to move focus, `Space` to toggle. Verified by
  the new story (`kb.focus()` + `userEvent.keyboard(' ')` → `toBeChecked()`). No custom
  key handling needed or added. Good.
- **Focus visible:** a `:focus-visible` ring exists
  (`Switch.module.css:250`, `--switch-track-focus-shadow`, per-theme). It is only shown
  for keyboard focus (`:focus-visible`, not `:focus`). Good by default (see Deferred #5
  on the `focusEffects` opt-out).
- **Disabled:** conveyed by the native `disabled` attribute (programmatic) plus
  `data-disabled` styling — not visual-only. Good.
- **Motion:** **Fixed** (Issue 3) — added `@media (prefers-reduced-motion: reduce)`.
  Regression-gated by the new `AccessibilityReducedMotion` story: a play function
  cannot flip the OS media preference, so it inspects the **CSSOM** — scoped to
  Switch's own hashed CSS-module classes (so no sibling's reduced-motion block can
  false-green it) — and asserts Switch's `prefers-reduced-motion: reduce` block still
  exists and still sets both `animation: none` (kills the infinite shimmer) and
  `transition: none`.

## SEO semantics

Switch is a form control, not a heading/landmark/link/list/table, so the SEO-semantic
checklist items (real `<h1-6>`, landmarks, `<a href>`, lists/tables) do not apply. The
control renders as a real `<input>`/`<label>` in SSR HTML — no client-only injection of
primary content. **No issues.**

## Fixes applied

1. **`role="switch"` (Issue 1)** — added `role="switch"` to the `<input>`
   (`index.tsx:181`), placed before `{...props}` so a consumer could still override it.
   Purely additive; `aria-checked` is derived by the browser from the native `checked`
   state, so no manual state attribute is introduced.
2. **Decorative graphics hidden (Issue 2)** — added `aria-hidden="true"` to the
   `.thumb` div (`index.tsx:203`) and the `.shimmer` div (`index.tsx:195`). This keeps
   the glyph out of the accessible name and out of the AT tree, without touching any
   `data-*`/CSS locator (aria-hidden affects only the a11y tree).
3. **Reduced motion (Issue 3)** — added a `@media (prefers-reduced-motion: reduce)`
   block to `Switch.module.css` (`:405`) that zeroes the container/track/thumb/label
   `transition` and sets the sacred shimmer `animation: none; opacity: 0`. Matches the
   library's existing reduced-motion convention (e.g. `Alert.module.css`). Now
   regression-gated by `AccessibilityReducedMotion` (2nd review — see below).
4. **Non-text contrast (Issue 6, 2nd review)** — changed the light-theme
   `--switch-track-border-color` from `rgba(156,163,175,0.2)` (~1.2:1) to a solid
   `#6b7280` gray-500 (4.83:1 vs white). A block comment on the token records the WCAG
   1.4.11 rationale + the measured ratios so a future editor cannot silently weaken it.
   Regression-gated by `AccessibilityOffStateContrast`, which asserts `>= 3:1` computed
   from the live border colour. `#6b7280` is a raw literal (allowed — it is not one of
   the brand literals stylelint forbids, and the file already carries per-theme
   literals) because no `--goobs-*` token sits in the required 4–5:1 band; see Deferred
   for the token that should own this.

**Markup change note (required disclosure):** the only DOM change is the **addition**
of `role="switch"` (and two `aria-hidden` attributes). No element was swapped, and no
existing attribute was renamed/removed. Because `role="switch"` changes the computed
role from `checkbox` to `switch`, the stories' role queries were updated from
`getAllByRole('checkbox')` to `getAllByRole('switch')` (7 call sites). ThothOS
Playwright resolves this control by `[data-field-name]`/`data-component="Switch"` (both
preserved, unchanged), not by ARIA role, so the machine-test selector contract is
intact.

**No public API change:** no prop renamed/removed/retyped, no export changed. All
changes are additive attributes + additive CSS.

## Stories updated

- Updated all 7 `play`-function role queries from `getAllByRole('checkbox')` to
  `getAllByRole('switch')` to match the new exposed role (the one native checkbox in
  `InteractiveDemoRenderer`, the "Show Outline" toggle, is never queried, so this is a
  faithful update).
- Added a new **`AccessibilityChecks`** story (`Accessibility - Role, Name & Keyboard`),
  matching the repo's `storybook/test` + `within`/`userEvent`/`expect` convention, which
  asserts: `role="switch"` on all controls; accessible name via `aria-label`
  (`'Enable notifications'`) and via the wrapping `<label>` (`'Off On'`, proving the
  now-`aria-hidden` glyph does not leak); `aria-checked` tracking after a click
  (`toBeChecked()`); and keyboard toggle via `Space` on a focused switch.
- **(2nd review)** Added **`AccessibilityOffStateContrast`**
  (`Accessibility - Off-State Contrast (WCAG 1.4.11)`): renders two OFF light switches
  on a pure-white page; its `play` reads each track's computed `border-top-color`,
  computes the WCAG contrast ratio against white, and asserts `>= 3:1` (plus that a
  non-`none`, non-zero-width border is actually drawn). This re-fails if
  `--switch-track-border-color` is weakened.
- **(2nd review)** Added **`AccessibilityReducedMotion`**
  (`Accessibility - Reduced Motion (WCAG 2.3.3)`): renders the sacred checked switch
  (also a Chromatic baseline for the shimmer state); its `play` walks the CSSOM, scoped
  to Switch's own hashed track class, and asserts Switch's
  `@media (prefers-reduced-motion: reduce)` block exists and sets both `animation: none`
  and `transition: none`. This re-fails if the reduced-motion block is dropped.

## Gates & evidence

**Run locally, per-file (this is the complete list of what was executed here):**
- `bun lint:file src/components/Switch/Switch.stories.tsx` → exit 0.
- `bunx stylelint src/components/Switch/Switch.module.css` → exit 0 (token-leak clean;
  `#6b7280` is not a forbidden brand literal).
- `index.tsx` was **not** modified in the 2nd review, so it was not re-linted here.
- WCAG contrast figures above were computed with a standalone sRGB-luminance script and
  are additionally encoded as live assertions in the two new stories.

**NOT run locally (deliberately):** the `test-storybook` (`@storybook/test-runner`) run
that actually executes the `play` functions, and the full `bun run build` / Chromatic
snapshot. `test-storybook` requires a running Storybook that builds **every** component's
stories, and `build`/Chromatic are repo-wide — both are expensive and would race the
sibling components under concurrent edit (a peer's in-progress story could fail the run
and be misattributed here). Those play functions + the Chromatic baselines are the
regression gate; they execute in CI / the batch-gate agent's run. The 1st-review report's
phrasing "verified by the new story resolving `getByRole(...)`" **overstated** the local
evidence (the play was authored, not executed here) and has been corrected above to
"the story is the regression gate, asserting …".

## Deferred

- **Issue 4 — accessible name when neither a label nor `aria-label` is supplied.** A
  consumer rendering `<Switch name="foo" />` with no `leftLabel`/`rightLabel` and no
  `aria-label`/`aria-labelledby` gets a control with no accessible name (this is exactly
  the `Off State`/`On State` demo pattern, where the descriptive text is a **sibling**
  `<span>` outside the Switch, not passed in). **Not fixable inside the component** —
  there is no text to derive a name from and the library must not invent one. The
  component already forwards any `aria-label`/`aria-labelledby` the consumer passes (via
  `...props` onto the `<input>`), so the correct name source is available;
  accessible-by-default is met whenever a label/`aria-label` is provided. Documented as
  consumer responsibility; no code change.
- **Issue 5 — `styles.focusEffects === false` suppresses the focus ring.** The public
  `SwitchStyles.focusEffects` opt-out (`data-focus-effects='false'`) removes the
  keyboard focus indicator, which would fail WCAG 2.4.7 for that opt-in configuration.
  The default (`focusEffects` unset/true) is fully accessible, and removing the prop
  would be a breaking API change, so this is left as documented consumer risk rather
  than a defect. No code change.
- **`styles.outline === false` also removes the OFF-state boundary (2nd review).** Like
  `focusEffects`, `outline: false` (`data-outline='false'`) strips the track border
  entirely; in light OFF that leaves only the ~1.3:1 track fill, so a consumer who opts
  out re-loses 1.4.11. The default (`outline` unset/true) now passes. Documented as an
  opt-in consumer risk, same class as Issue 5 — not changed (removing the opt-out would
  be a breaking API change).

## Cross-file / unowned (deferred to file owners)

- **`src/styles/global.css` — add a `--goobs-light-control-border-strong` token.** The
  light-theme OFF border needs a solid gray in the **4–5:1-vs-white** band, but no
  existing `--goobs-*` token lives there (nearest are `--goobs-light-control-border`
  `#cbd5e1` @1.5:1 — too light — and `--goobs-light-text-muted` `#4b5563` @7.6:1 — text-
  heavy). I used the raw literal `#6b7280` in `Switch.module.css` (allowed by stylelint;
  the file is not in the config's in-flight ignore list). **Suggested change:** add
  `--goobs-light-control-border-strong: #6b7280;` to the light `:root`/theme block in
  `src/styles/global.css` (near line 304, beside `--goobs-light-control-border`), then
  Switch (and any sibling needing a 3:1 light control boundary) can route through it.
  I could not make this edit — `src/styles/**` is outside my ownership.

**No cross-file fix was *required* to close the findings** — the three review items were
all fixed at root cause inside `src/components/Switch/`. The token above is a
maintainability improvement, not a blocker (the literal already satisfies 1.4.11).
