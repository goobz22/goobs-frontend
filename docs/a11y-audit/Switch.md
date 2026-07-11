# Switch — a11y audit (2026-07-11)

**Status:** FIXED

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
  is now exactly the label text — verified by the new `AccessibilityChecks` story
  resolving `getByRole('switch', { name: 'Off On' })` and
  `getByRole('switch', { name: 'Enable notifications' })`.
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
   library's existing reduced-motion convention (e.g. `Alert.module.css`).

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

Gates run per-file and passing: `bun lint:file` on `index.tsx` and `Switch.stories.tsx`
(exit 0), `stylelint` on `Switch.module.css` (exit 0).

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

**No cross-file (unowned) fixes were required** — all three root-cause fixes lived
inside the `src/components/Switch/` directory.
