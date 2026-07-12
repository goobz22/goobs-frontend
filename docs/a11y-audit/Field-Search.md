# Field/Search — a11y audit (2026-07-11)

**Status:** FIXED

**Component:** `src/components/Field/Search` (the `Searchbar` search input, built on
`Field/Shell` `FieldShell`).

## APG pattern

There is no dedicated "search bar" pattern in the WAI-ARIA APG; a search field is a
**text input with search semantics**. The correct native element is
`<input type="search">` (implicit role `searchbox`), optionally sitting inside a
`search` landmark. The relevant obligations are therefore the generic **Name, Role,
Value** (4.1.2), **Info & Relationships** (1.3.1), **Focus Visible** (2.4.7), and the
label/error wiring that `FieldShell` already provides (`<label htmlFor>`,
`aria-describedby` → helper/error region, `aria-invalid`, `aria-required`). This audit
verifies the sub-field's *use* of Shell and fixes what lives in the Search directory.

## Issues found

| # | Severity | WCAG | Location | Status |
|---|----------|------|----------|--------|
| 1 | Serious | 2.4.7 Focus Visible (AA) | `Search.module.css:83` (`.input { outline: none }` with no replacement) | FIXED |
| 2 | Serious | 4.1.2 Name, Role, Value (A); 3.3.2 Labels/Instructions (A) | `index.tsx` (`label` optional; input named only by placeholder) | FIXED |
| 3 | Moderate | 1.3.1 Info & Relationships (A); 4.1.2 (A) | `index.tsx` input `type="text"` on a search field | FIXED |
| 4 | Minor | 1.1.1 Non-text Content (A) | `index.tsx` magnifier `<svg>` had no `aria-hidden`/`focusable` | FIXED |
| 5 | Minor | 1.4.1 Use of Color (A) — robustness | `Search.module.css` — error state gave the field no visual border feedback | FIXED |
| 6 | Minor | 2.3.3 Animation from Interactions (AAA) | `Search.module.css:24` wrapper `transition` had no reduced-motion guard | FIXED |
| 7 | Moderate | 1.4.3 Contrast (Minimum) (AA) | `Search.module.css` `.input` set no `::placeholder` color → UA-default gray | FIXED |
| 8 | Serious | 2.4.7 Focus Visible (AA); 1.4.11 Non-text Contrast (AA) | `Search.module.css` — `.input { outline: none }` + box-shadow-only `:focus-within` ring; no forced-colors fallback | FIXED |
| 9 | Minor | 3.3.2 Labels or Instructions (A) | `index.tsx` input — comment claimed a "search" enter-key hint but `enterKeyHint` was never emitted | FIXED |
| 10 | Minor | 4.1.2 Name, Role, Value (A) | `index.tsx` — `ariaLabel ?? placeholder` could emit `aria-label=""` when the placeholder is blanked | FIXED |

> Issues 1–7 were closed by prior a11y passes and are documented in full below.
> **Issues 8–10 are the 2026-07-11 follow-up audit** (commit `e8400fc9`) and are
> detailed after Issue 7.

### 1. No visible focus indicator (Serious, 2.4.7)

The inner `.input` sets `outline: none` (`Search.module.css:83`) but nothing replaced it.
Search renders its own `.inputWrapper`/`.input` chrome and does **not** use FieldShell's
generic `.inputSlot` class, so the `.inputSlot:focus-within` ring in `FieldShell.module.css`
never applied. Result: tabbing to the search input produced **zero** visible focus change —
a keyboard user cannot see where focus is. FIXED by adding a `:focus-within` treatment on
`.inputWrapper` (themed focus border via `--field-border-focus` + a per-theme focus-ring
box-shadow using the `--goobs-focus-{sacred,light,dark}` tokens).

### 2. No accessible name when `label` is omitted (Serious, 4.1.2 / 3.3.2)

`label` is optional and `FieldShell` only renders a `<label htmlFor>` when `label` is a
non-empty string. A very common search-bar usage is placeholder-only ("Search..."). A
placeholder is **not** an accessible name (it is not exposed as the control's name and
disappears on input), so a label-less Search was an **unnamed** control for screen-reader
and voice-control users. FIXED by adding an additive `ariaLabel?: string` prop and applying
`aria-label` **only** when no visible label is present: explicit `ariaLabel` wins, otherwise
the `placeholder` string becomes the name. When a visible label exists, `aria-label` is left
undefined so it can never override the `<label htmlFor>` association.

### 3. Non-semantic input type (Moderate, 1.3.1 / 4.1.2)

The input used `type="text"` for what is semantically a search field. FIXED → `type="search"`,
which gives the native `searchbox` role, correct AT announcement, and a "search" mobile
enter-key hint. The webkit-only, mouse-only, unstyled clear button that `type="search"`
introduces is stripped in CSS (`::-webkit-search-cancel-button`/`-decoration`) for consistent
cross-browser appearance — no a11y regression, since the field ships no bespoke clear control
and clearing remains possible from the keyboard.

### 4. Decorative icon not hidden from AT (Minor, 1.1.1)

The leading magnifier `<svg>` had no text alternative and no `aria-hidden`. It is purely
decorative (the input is already named), so it should be hidden from the accessibility tree.
FIXED by adding `aria-hidden="true"` and `focusable="false"`.

### 5. Error state not visually reflected on the field (Minor, 1.4.1 robustness)

Because Search doesn't use `.inputSlot`, the FieldShell error-border rule never reached the
field: on error the label + helper text turned red but the input border did **not**. Error is
still conveyed non-visually (the error message text + `aria-invalid`), so this was a
robustness gap rather than a hard failure. FIXED by adding a wrapper error-border rule keyed
on the shell's `[data-state='error']`/`[aria-invalid='true']`; it is more specific than
`:focus-within`, so a focused invalid field keeps the danger border while still showing the
focus ring.

### 6. No reduced-motion guard (Minor, 2.3.3)

`.inputWrapper` animates `transition: var(--goobs-transition-slow)` (border/background, and
now the focus box-shadow). FIXED with an `@media (prefers-reduced-motion: reduce)` block that
drops the transition; state changes still apply instantly.

### 7. Placeholder text had no adequate-contrast color (Moderate, 1.4.3)

`.input` set no `::placeholder` rule, so the hint rendered in the **UA-default** placeholder
color — a translucent tint of the input `color` (and Firefox reduces its opacity further).
That is ungoverned and, on a light surface, drifts below the 4.5:1 minimum; every sibling
Field component (`Field/Text`, `Field/PhoneNumber`, `Dropdown/SearchableSimple`) already sets
an explicit muted-token placeholder, so Search was also the odd one out. This matters *more*
for Search than for most fields: a **label-less** search bar exposes the placeholder string
as its `aria-label` (Issue 2), so the hint is doing accessible-name duty and must be legible.
FIXED by setting `.input::placeholder` to the per-theme muted-text tokens the rest of the
library uses — sacred `--goobs-sacred-text-muted` (rgba(255,255,255,0.5) ≈ 5.30:1 on #0e0e0e),
light `--goobs-light-text-muted` (#4b5563 ≈ 6.17:1), dark `--goobs-dark-text-muted`
(#94a3b8 ≈ 4.76:1) — all ≥ 4.5:1, with `opacity: 1` to reset Firefox's placeholder dimming so
the proven ratio isn't silently eroded. The hint stays visibly lighter than entered text.

### 8. Focus indicator disappears in forced-colors / Windows High Contrast (Serious, 2.4.7 / 1.4.11)

`pattern: missing-forced-colors-focus`. Issue 1 restored a visible focus ring — but it is
implemented purely as a `box-shadow` (`--goobs-focus-*`) on `.inputWrapper:focus-within`, while
the inner `.input` still clears its native outline (`outline: none`). In **forced-colors mode**
(Windows High Contrast) the UA drops every `box-shadow` and repaints all borders with the system
palette, so the focused border becomes indistinguishable from the resting border — keyboard focus
vanishes for exactly the low-vision users who depend on that mode. This is the same class the
library already repaired on Switch / SignatureField / SacredGlyphFrame. FIXED by adding a
`@media (forced-colors: active)` block that restores a system-colour-safe focus outline on
`.inputWrapper:focus-within` (a transparent outline is promoted to the system focus colour by the
UA). Error state needs no forced-colors repair — it is already conveyed non-visually by the
`role="alert"` error text + `aria-invalid`, not by border colour alone.

### 9. Documented "search" enter-key hint was never emitted (Minor, 3.3.2)

`pattern: missing-enterkeyhint`. The input's comment claimed a "'search' mobile enter-key hint",
but no `enterKeyHint` attribute was ever set — the field relied on each browser's per-UA default
for `type="search"`, which is inconsistent across mobile browsers. FIXED by adding
`enterKeyHint="search"`, so the on-screen keyboard's Enter key is explicitly labelled as a search
action at the point of input (WCAG 3.3.2), and by correcting the comment to match reality.

### 10. Blank placeholder could emit an empty `aria-label=""` (Minor, 4.1.2)

`pattern: empty-accessible-name-fallback`. The label-less accessible-name fallback used
`ariaLabel ?? placeholder`. If a consumer blanks the placeholder (`placeholder=""`) with no
`label` and no `ariaLabel`, `??` resolves to the empty string and the input renders
`aria-label=""` — a broken, empty accessible name that some assistive tech announces as an
unlabelled control. FIXED by switching to a `||` chain (`ariaLabel || placeholder || undefined`)
so empty strings are skipped: the field emits a real name or omits the attribute entirely, never
an empty one. (The default `placeholder='Search...'` means this only triggers when a consumer
deliberately blanks every name source; the guard makes that degenerate case fail safe.)

## Hearing

No audio, video, `AudioContext`, `navigator.vibrate`, or any media API is used anywhere in
the component (grep-verified across `index.tsx`, `Search.module.css`, and the stories). No
information is conveyed by sound. **Nothing to fix** for WCAG 1.2.x / 1.4.2. Status/feedback
(search results, "no results", "searching…") in the demo story is entirely visual + textual.

## Reading & screen reader

- **Accessible name** now guaranteed in every configuration (visible `<label>` → labels the
  input; label-less → `aria-label` from `ariaLabel` or the placeholder). (Issue 2)
- **Role**: native `type="search"` → `searchbox` role (Issue 3). Verified by a story that
  finds the input via `getByRole('searchbox', { name })`.
- **Error/validation** wiring is inherited correctly from `FieldShell`: string `error` →
  helper region with `role="alert"` + `aria-live="polite"`, linked via `aria-describedby`,
  and `aria-invalid="true"` on the input. The Search field forwards `error` straight through.
  Error is conveyed by text + programmatic attribute, never colour alone; the new border
  (Issue 5) is an additional visual channel.
- **Required** is conveyed programmatically: FieldShell sets `aria-required` and renders the
  ` *` indicator as `aria-hidden` decoration — not asterisk-only.
- **Decorative icon** hidden from AT (Issue 4).
- **Placeholder legibility**: the hint now carries a per-theme muted-token colour at full
  opacity that holds ≥4.5:1 on each surface (Issue 7) — critical because the placeholder is
  the field's accessible name in the label-less configuration.
- **Focus** is now visible for keyboard users (Issue 1) and honours reduced-motion (Issue 6).
- **Keyboard operability**: the input is a native text control — Tab/Shift+Tab to focus,
  standard text editing, no custom key handling needed or removed. The extra native-`input`
  listener (`index.tsx`) only mirrors programmatic value sets for browser-automation tools;
  it does not affect keyboard users.

## SEO semantics

- The input renders server-side as a real `<input type="search">` with its `<label>` (when
  provided) present in the SSR'd HTML — no client-only injection of primary content.
- No heading text is rendered by the component, so no `<div>`-as-heading concern applies (the
  `<h3>` elements in the stories are demo scaffolding, not shipped component markup).
- Considered wrapping the field in a `search` landmark / `<search>` element. Deliberately
  **not** forced: this is a generic, reusable search *field* (frequently used as a table/list
  filter, of which a page may have several), so emitting a `search` landmark on every instance
  would create redundant, indistinguishable landmarks. See Deferred.

## Fixes applied

All in `src/components/Field/Search`:

- `index.tsx`: added additive `ariaLabel` prop (JSDoc'd); compute `resolvedAriaLabel`
  (label-less → `ariaLabel ?? placeholder`, else undefined); `aria-label` on the input;
  `type="text"` → `type="search"`; `aria-hidden="true"` + `focusable="false"` on the
  magnifier svg.
- `Search.module.css`: `.inputWrapper:focus-within` themed focus border + per-theme focus-ring
  box-shadow (`--goobs-focus-{sacred,light,dark}`); wrapper error-border keyed on the shell's
  error state; `::-webkit-search-cancel-button`/`-decoration` reset; `@media
  (prefers-reduced-motion: reduce)` guard; `.input::placeholder` per-theme muted-token colour +
  `opacity: 1` (Issue 7).

Per-file gate: `bun lint:file` exits 0 on the stories file; `Search.module.css` is absent from
the repo stylelint report (the only failures are pre-existing debt in other components).

## Stories updated

`SearchBar.stories.tsx`:

- **`InteractionTest`** (extended): asserts the input is reachable via
  `getByRole('searchbox', { name: 'Test Search Input' })` and that this element is the same
  input — proving `type="search"` yields the `searchbox` role and the visible label names it
  (an `aria-label` does not override it). The play function focuses the input, so the Chromatic
  snapshot also captures the new focus ring.
- **`AccessibleNameFallback`** (new, "Accessible Name (No Visible Label)"): two label-less
  fields — one placeholder-only, one with an explicit `ariaLabel` — with a play function that
  asserts each is found by `getByRole('searchbox', { name })`, exercising the placeholder-
  fallback and the explicit-`ariaLabel` paths.
- Existing **`ErrorStates`** story now also serves as the visual regression for the new error
  border (Chromatic).
- **`PlaceholderContrastTest`** (new, "Placeholder Contrast (WCAG 1.4.3)"): three placeholder-
  only fields, one per theme, each on its theme-matched surface (Chromatic baseline for the
  hint colour). The play function reads the resolved `::placeholder` computed style on the light
  field and asserts `color === rgb(75, 85, 99)` (#4b5563, the muted token) and `opacity === '1'`
  — i.e. the field no longer falls back to the UA-default placeholder colour (Issue 7).

## Deferred

- **Nothing is blocked on `Field/Shell`.** Shell's label association, `aria-describedby`
  error/helper wiring, `aria-invalid`, `aria-required`, and the `aria-hidden` required
  indicator are all correct for this field; no Shell change is required for Search's a11y.
- **Optional future enhancement (not a defect, not owned elsewhere):** an opt-in `search`
  landmark. If a consumer wants the field to be a page-level search landmark, an additive
  prop (e.g. `landmarkLabel?: string`) could wrap the field in `<search aria-label={…}>`.
  Left out by default to avoid redundant landmarks on filter-style usages; can be added
  additively later if a consumer needs it.

## 2026-07-11 follow-up (Issues 8–10) — fixes, stories, commit

**Fixes applied** (all in `src/components/Field/Search`, commit `e8400fc9`):

- `Search.module.css`: added a `@media (forced-colors: active)` block restoring an outline
  on `.inputWrapper:focus-within` (Issue 8).
- `index.tsx`: added `enterKeyHint="search"` on the input and corrected the misleading
  comment (Issue 9); changed the label-less accessible-name fallback from `ariaLabel ??
  placeholder` to `ariaLabel || placeholder || undefined` to prevent `aria-label=""`
  (Issue 10).

Per-file gates: `bun lint:file` exits 0 on `index.tsx` and `SearchBar.stories.tsx`;
scoped `stylelint` exits 0 on `Search.module.css`.

**Stories updated** (`SearchBar.stories.tsx`):

- **`AccessibilityForcedColors`** (new, "Accessibility - Forced Colors (WCAG 2.4.7)"):
  CSSOM regression gate mirroring the Switch pattern — scoped to Search's own hashed
  CSS-module class, it asserts a `forced-colors: active` block exists and restores an
  `outline` on `:focus-within`. Re-fails if a future edit drops the block (Issue 8).
- **`InteractionTest`** (extended): now also asserts the input carries
  `enterkeyhint="search"` (Issue 9).
- **`AccessibleNameFallback`** (extended): added a third field with every name source
  blank (`placeholder=""`, no label, no `ariaLabel`) and asserts it emits **no**
  `aria-label` attribute — never `aria-label=""` (Issue 10).

**Deferred (follow-up):** none — all three root causes lived inside the Search directory.

## Commits

- `e8400fc9` — a11y(Field/Search): forced-colors focus, enterKeyHint, empty aria-label guard
