# MenuItem — a11y audit (2026-07-11)

**Status:** FIXED

## APG pattern

MenuItem renders a **native `<option>`** element (`src/components/MenuItem/index.tsx:88`)
and is consumed as a child of the `Select` component, which renders a real native
`<select>` (`src/components/Select/index.tsx:177`). The applicable WAI-ARIA APG pattern is
therefore the **Listbox / native combobox**, delivered through native HTML semantics rather
than a custom role-annotated widget.

This is the most accessible possible implementation: the browser supplies the full keyboard
interaction table (Tab/Shift+Tab to the control, Up/Down/Home/End/type-ahead to move between
options, Enter/Space/Escape to open/commit/dismiss), focus management, and the "selected"/
"disabled" announcements natively. No custom keyboard handling, focus trap, or `role`/`tabindex`
scaffolding is needed or appropriate for an `<option>`. Consequently several checklist items
(arrow-key nav, focus trap, focus restoration, Escape handling) are **owned by the browser and
the parent `<select>`** — MenuItem must not re-implement them.

Accessible name is present: it comes from the option's text content (`children`), so no
`aria-label` gap. `disabled` is forwarded to the **native `disabled` attribute**
(`index.tsx:99`), so the disabled state is programmatic and browser-announced (not color-alone).

## Issues found

| # | Severity | WCAG | Location | Issue | Status |
|---|----------|------|----------|-------|--------|
| 1 | Moderate | 1.4.1 Use of Color (A); 4.1.2 Name, Role, Value (A) | `src/components/MenuItem/index.tsx:96` | The custom `selected` prop was conveyed **only** by a tinted background + accent text color, plus a `data-selected` attribute that is a machine-test hook a screen reader never reads. | **FIXED** (see review-fix R1 below — the fix method was corrected) |
| 2 | Minor | 2.3.3 Animation from Interactions (AAA); supports 2.2.2 | `src/components/MenuItem/MenuItem.module.css:55` | `.root` declares `transition: var(--goobs-transition-medium)` (and a parity keyframe) with no `prefers-reduced-motion` guard. | **FIXED** |

### Adversarial-review findings (2026-07-11) — both fixed

| # | Severity | Location | Finding | Status |
|---|----------|----------|---------|--------|
| R1 | Moderate | `src/components/MenuItem/index.tsx:106` | The first-pass fix mirrored the `selected` prop into `aria-selected="true"` on the native `<option>`. Premise was wrong (native `<select value>` **already** exposes the selected option to AT) and it introduced a **decoupling hazard**: MenuItem can't see the parent's `value`, so `selected` on option A while `value` selects option B would emit a FALSE/conflicting second "selected" announcement. | **FIXED** |
| R2 | Minor | `src/components/MenuItem/MenuItem.stories.tsx:154` | The regression story only exercised the aligned/safe path (`selected` == value), so it never guarded the decoupled case where the false announcement occurs. | **FIXED** |

### Adversarial-review round 2 (2026-07-11) — both fixed

| # | Severity | Location | Finding | Status |
|---|----------|----------|---------|--------|
| R3 | Minor | `src/components/MenuItem/MenuItem.stories.tsx` | The `prefers-reduced-motion` fix (`MenuItem.module.css` `@media` block) shipped with **zero regression coverage** — goobs has no unit tests, so the Storybook story (+ Chromatic baseline) IS the regression test, and no story exercised the reduced-motion behavior. | **FIXED** |
| R4 | Minor | `src/components/MenuItem/index.tsx` | The decoupled `selected` visual state was a **color-only affordance** (tinted bg + accent text via `.root[data-selected='true']`, WCAG 1.4.1) — distinguishable by color alone, with nothing preserving the state for grayscale / color-vision-deficiency users, especially in the decoupled (`selected` != value) misuse case. | **FIXED** |

**R3 resolution — the story that was missing.** Added **`ReducedMotionGuard`** (`A11y — Reduced-Motion Guard`). It renders a MenuItem, reads the option's hashed CSS-module root class, and walks the CSSOM (`document.styleSheets` → `CSSMediaRule` with `prefers-reduced-motion` + `reduce` → `CSSStyleRule` on the root class with `transition: none`) asserting the guard rule exists — so a rebuild that ever drops the `@media (prefers-reduced-motion: reduce)` block fails the play regardless of the runner's OS motion setting. A behavioral gate (`window.matchMedia(...).matches` → `transitionProperty === 'none'`) also fires when the runner emulates reduced motion. This is the repo's established reduced-motion regression pattern (mirrors `Fade`/`PercentageField`/`ToggleButton`). (The auditor's aside that native `<option>` CSS transitions are largely ignored by Chrome/Safari is correct — the guard is defensive/near-no-op in rendering, but the convention requires a story for every state/fix and the guard is harmless + free.)

**R4 resolution — root cause, not a defer.** The "color-only" nature is eliminated at its source: `.root[data-selected='true']` now applies `font-weight: var(--goobs-weight-semibold)` in addition to the tint/accent color, so the selected item is distinguishable from its siblings **independent of hue/luminance** (WCAG 1.4.1) — in the aligned use AND the decoupled misuse case. Two plays pin it via `getComputedStyle(...).fontWeight` (the cascade applies the weight even though a native `<option>`'s painting is OS-controlled, so the assertion is deterministic): `SelectedStateAnnounced` asserts the selected option is `≥ 600` while an unselected sibling is `< 600`; `SelectedDecoupledFromValue` asserts the decoupled/highlighted option is `≥ 600`, directly proving the misuse-case affordance is no longer color-only. The **programmatic-AT** exposure of a *decoupled* highlight remains a consumer responsibility — MenuItem cannot see the parent `<select value>`, so emitting `aria-selected` off the visual prop would be a FALSE announcement (R1); the review's "no lint/type guard preventing it" cannot be satisfied inside MenuItem without either seeing the parent value (not available) or a false ARIA assertion, so the residual is by-design, and the 1.4.1 (Use of Color) concern the finding cited is now fully closed by the non-color affordance.

**R1 resolution — root cause, not a patch.** Removed the decoupled `aria-selected` entirely. The
correct programmatic exposure of "which option is selected" is the parent Select's native
`<select value>` binding (`Select/index.tsx:182`): the browser maps that native selection into the
accessibility tree and announces it to assistive tech with **no author ARIA required** ("first rule
of ARIA" — don't re-declare native semantics). The original audit's premise ("no programmatic
selected state was exposed to AT") was incorrect for a native `<select>`. The `selected` prop remains
a pure **visual** highlight (`data-selected` + tinted CSS); because MenuItem cannot observe the parent
`value`, it cannot know whether `selected` truly equals the selection, so it must not assert
`aria-selected`. A caller who owns the alignment can still pass their own `aria-selected` via `{...props}`.
Original finding #1's WCAG 1.4.1 concern is satisfied in the intended (aligned) use because the native
selection conveys the selected state non-visually; the decoupled use is a consumer-intent ambiguity
that MenuItem cannot responsibly label as "selected".

**R2 resolution.** `SelectedStateAnnounced` was rewritten to pin the corrected contract (native
`<select>` value == the value-selected option, `data-selected` hook preserved, and **no**
`aria-selected` on any option). Added **`SelectedDecoupledFromValue`** — a new story where the native
selection is `javascript` but the `selected` prop sits on the `typescript` item; its play asserts the
combobox value is `javascript`, the highlighted item still exposes only `data-selected`, and **no**
option emits `aria-selected` — directly guarding the false-announcement hazard R1 removed.

No other defects found. Specifically **not** flagged (intentional / not applicable):

- **Native `selected` attribute is deliberately NOT set.** The `selected` prop drives only the
  visual highlight; the actual selection is controlled by React via `<select value>`
  (`Select/index.tsx:182`). Forwarding the native `selected` content attribute would trigger
  React's controlled-select warning and fight the value binding.
- **No decoupled `aria-selected` on the `<option>`** — see R1 above. Native `<select value>` is the
  selected-state exposure; author ARIA on a native form-control option is redundant when aligned and
  a false announcement when not.
- **No `:focus-visible` rule added.** A native `<option>` is not an independent tab stop and its
  rendering is OS-controlled; the visible focus ring lives on the `<select>` combobox, owned by
  the `Select` component. A `:focus-visible` rule on `.root` would be inert dead CSS.
- **Test-selector contract preserved.** `data-component`, `data-action`, `data-subject`,
  `data-dense`, `data-divider`, `data-selected`, `data-disabled`, and native `disabled` are all
  untouched. No existing prop/attribute was renamed, removed, or retyped.

## Hearing (WCAG 1.2.x, 1.4.2)

**CLEAN.** Grepped the component directory for `new Audio`, `AudioContext`, `navigator.vibrate`,
`<audio>`, `<video>`, `.play(`, `beep`, `sound` — **no matches**. The only side-effect on
activation is `emitDiag({ type: 'action.invoke', ... })` (`index.tsx:59`), a silent diagnostic
event, not audio feedback. No information is conveyed by sound; nothing to remediate.

## Reading & screen reader (1.1.1, 1.3.1, 1.4.1, 2.1.x, 2.4.x, 3.3.x, 4.1.2)

- **Accessible name:** present via `children` text content — no icon-only/`aria-label` gap.
- **Semantic HTML:** uses native `<option>` (correct element for a `<select>` child) — no
  role-annotated `div`.
- **Keyboard:** fully native via the parent `<select>` — nothing to build.
- **Disabled:** programmatic (native `disabled` + `data-disabled` + opacity/color) — not
  color-alone. Correct before this audit.
- **Selected:** the selected state is exposed programmatically by the parent Select's native
  `<select value>` binding (`Select/index.tsx:182`) — the browser announces the value-selected
  option to assistive tech with no author ARIA. MenuItem does **not** emit a decoupled
  `aria-selected` off its visual `selected` prop (it can't see the parent value, so it can't know
  the prop equals the real selection — see review-fix R1). `data-selected` retained as the test hook.
- **Divider:** decorative grouping only (bottom border); not a stateful/semantic distinction —
  no programmatic exposure required.

## SEO / semantics (SSR)

**CLEAN.** The component emits a real `<option>` with its text `children` present in the SSR'd
HTML — all meaningful content is server-rendered, no client-only injection. MenuItem is not a
landmark, heading, link, or table, so those checklist items do not apply. No `headingLevel`/
`linkComponent`/list-semantics obligations for an `<option>`.

## Fixes applied

1. **Selected-state exposure via native selection (corrected)** — `src/components/MenuItem/index.tsx`:
   the first pass added `aria-selected={selected ? 'true' : undefined}` to the `<option>`; adversarial
   review (R1) showed that was redundant-when-aligned and a false announcement when the `selected`
   visual prop diverges from the parent's `<select value>`. **Removed the decoupled `aria-selected`.**
   The selected state is exposed programmatically by the native `<select value>` binding in the parent
   Select (`Select/index.tsx:182`), which the browser announces to AT natively. `data-selected` (test
   hook) and the tinted CSS (visual affordance) are retained. No DOM element change; no existing
   attribute renamed/removed/retyped.
2. **`prefers-reduced-motion` guard** — `src/components/MenuItem/MenuItem.module.css`: added an
   `@media (prefers-reduced-motion: reduce)` block that sets `transition: none; animation: none`
   on `.root`, so users requesting reduced motion get instant state changes. **(round 2, R3)** Now
   covered by the `ReducedMotionGuard` story below.
3. **Non-color selected affordance (WCAG 1.4.1)** — `src/components/MenuItem/MenuItem.module.css`
   **(round 2, R4)**: `.root[data-selected='true']` now adds `font-weight: var(--goobs-weight-semibold)`
   alongside the tint/accent color, so the selected state is conveyed by weight (shape), not color
   alone — in the aligned use and the decoupled misuse case. `index.tsx` carries a co-located comment
   next to `data-selected` recording the 1.4.1 rationale. No DOM element change; no attribute
   renamed/removed/retyped; `--goobs-weight-semibold` is a defined global token (no token leak).

## Stories updated

- **`SelectedStateAnnounced`** (rewritten) — controlled `Select` with `initialValue="typescript"` and a
  `selected` TypeScript item (aligned case). Play now pins the corrected contract: the combobox
  (`<select>`) value is `typescript` (native selection), `data-selected="true"` on the selected option,
  and **no** `aria-selected` on any option.
- **`SelectedDecoupledFromValue`** (new) — the hazard case R2 flagged: native selection is `javascript`
  while the `selected` prop sits on the `typescript` item. Play asserts the combobox value is
  `javascript`, the highlighted item exposes only `data-selected`, and **no** option emits
  `aria-selected` — the regression guard that the false-announcement hazard stays fixed.

- **`ReducedMotionGuard`** (new, round 2 / R3) — the reduced-motion regression net the review flagged
  as missing. Its play reads the option's hashed root class and walks the CSSOM to assert an
  `@media (prefers-reduced-motion: reduce)` rule sets `transition: none` on that class (fails if the
  guard is ever dropped, independent of the runner's OS motion setting), plus a behavioral gate when
  the runner emulates reduced motion. Mirrors the repo's `Fade`/`PercentageField`/`ToggleButton` pattern.
- **`SelectedStateAnnounced`** + **`SelectedDecoupledFromValue`** (extended, round 2 / R4) — both plays
  now assert the non-color affordance via `getComputedStyle(...).fontWeight`: the selected/highlighted
  option is `≥ 600` (an unselected sibling is `< 600` in the aligned story), proving the selected state
  is not conveyed by color alone — including in the decoupled misuse case.

(The earlier note that the `prefers-reduced-motion` fix was "not exercisable via a play assertion" is
superseded — the `ReducedMotionGuard` story now exercises it structurally via the CSSOM.)

## Deferred

None. All four adversarial-review findings (R1/R2, and R3/R4 from round 2) were fixable at root cause
inside the MenuItem directory. No changes were required in files outside my ownership.

Two by-design residuals (documented, not action items — they are structurally impossible to "fix"
inside MenuItem without regressing correctness, so they are NOT deferred to another owner):

- **Programmatic AT exposure of a *decoupled* `selected` highlight.** MenuItem cannot see the parent
  `<select value>`, so it cannot know whether the visual `selected` prop equals the real selection;
  emitting `aria-selected` off the decoupled prop would be a FALSE second announcement (R1). The
  intended (aligned) use is announced natively by the parent Select's `<select value>` binding
  (`src/components/Select/index.tsx:182`, already correct). The review's "no lint/type guard preventing
  the misuse" cannot be satisfied here without seeing the parent value or asserting false ARIA — a
  caller who owns the alignment can still pass their own `aria-selected` via `{...props}`. The **1.4.1
  Use-of-Color** half of the finding IS now closed for all cases by the non-color font-weight affordance.
- Native `<option>` painting is OS-controlled, so both the `transition` and the `font-weight` above may
  be visually ignored by some browsers on a closed native `<select>` — the CSSOM cascade still applies
  them (which is why the plays assert via `getComputedStyle` / CSSOM walk, and why the design-system
  affordance is correct for any listbox rendering of the component).
