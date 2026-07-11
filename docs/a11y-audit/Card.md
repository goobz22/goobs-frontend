# Card — a11y audit (2026-07-11)

**Status: FIXED**

Card is a compound-component surface primitive (`Card` root + ~25 slot
subcomponents attached as static properties). It is not a single ARIA widget —
it is a **composition of small patterns**, each audited on its own:

| Sub-pattern | APG pattern | Verdict |
|---|---|---|
| `Card` root | `article` (labelled region) | FIXED (dangling label reconciled post-mount) |
| `Card.Title` block-link | link / button in a heading (Pickering block-link) | FIXED (focus parity) |
| `Card.Progress` | **progressbar** | FIXED (was nameless) |
| `Card.ConfirmDelete` | **alertdialog** | FIXED (was nameless, no focus/Escape) |
| `Card.DragHandle` | group + move buttons (reorder) | OK |
| `Card.SelectionCheckbox` | native checkbox | OK |
| `Card.Grid` | `ul role="list"` + `li` | OK |
| `Card.Banner` | status / alert live region | OK |

Primary APG references: **Progress Bar**, **Alert and Message Dialog
(alertdialog)**, and Heckman/Pickering "Inclusive Components — Cards" (block-link).

---

## Issues found

### 1. `Card.Progress` progressbar has no accessible name — SERIOUS — FIXED
- WCAG **1.3.1 Info and Relationships (A)**, **4.1.2 Name, Role, Value (A)**.
- `index.tsx:872-878` (pre-fix): `<div role="progressbar" aria-valuenow … aria-valuemin … aria-valuemax>` with **no** `aria-label`/`aria-labelledby`. The visible `label` ("Complete", "Quarter close", …) rendered in `.progressMeta` was never programmatically associated, so a screen reader announced only "62%, progress bar" — the user never learns *what* is progressing.
- Also: when a caller passed a custom `displayValue` (e.g. "3 of 10 steps") the bar still announced the raw `Math.round(value*100)` percentage, contradicting the visible text.
- **Fix (`index.tsx` CardProgress):** the visible `label` now gets an `id` and the progressbar references it via `aria-labelledby`; added an additive `ariaLabel?: string` prop for the label-less case (`aria-label`); and `aria-valuetext={display}` is emitted whenever `displayValue` is set so AT announces the meaningful text. Pattern: `status-not-announced` (nameless-status variant).

### 2. `Card.ConfirmDelete` alertdialog has no name, no focus management, no Escape — SERIOUS — FIXED
- WCAG **4.1.2 Name, Role, Value (A)**, **2.4.3 Focus Order (A)**; APG alertdialog keyboard contract.
- `index.tsx:1176-1183` (pre-fix): `<div role="alertdialog" aria-live="assertive">` with **no accessible name** (an `alertdialog` must be named by its message), **no focus moved into it** on appearance, and **no Escape-to-dismiss**. A keyboard/AT user who triggered the confirmation was left with focus on the (now-obscured) Delete trigger and no announcement of the dialog.
- **Fix (`index.tsx` CardConfirmDelete):** the message `<p>` gets an `id`; the pane sets `aria-labelledby={messageId}` (accessible name = the question) + `aria-modal="false"` (honest: inline, non-modal) + `tabIndex={-1}`. On mount focus moves into the pane (AT announces "alertdialog, Delete …?"); on close focus is **restored to the trigger** — but only if that trigger is still connected, so a confirmed delete that removes its own card doesn't yank focus. **Escape** now fires `onCancel`. Ref merging keeps any caller `ref` working. `aria-live="assertive"` retained (harmless, preserves existing selector/story contract). Pattern: `missing-dialog-focus-trap` (dialog-name-and-focus variant).

### 3. Block-link `<button>` title lacked the `:focus-visible` treatment the `<a>` had — MINOR — FIXED
- WCAG **2.4.7 Focus Visible (AA)**, **2.4.11 Focus Appearance (AA)**.
- `Card.module.css:210-214` styled only `.title a:focus-visible` with the gold ring; the `onClick` variant renders `.title button.blockLink`, which fell back to the UA default ring — inconsistent with the anchor, and fragile if a consuming app resets outlines. (The card's `:focus-within` ring does provide *a* focus cue, so this is polish, not a hard failure.)
- **Fix (`Card.module.css`):** extended the `:focus-visible` rule to `.title button.blockLink` and set `outline: none` on its base so keyboard focus draws the shared gold ring (matching the anchor). Pattern: `missing-focus-visible-style`.

### 4. Default confirm/cancel buttons had no explicit `:focus-visible` — MINOR — FIXED
- WCAG **2.4.7 Focus Visible (AA)**.
- `Card.module.css` styled `:hover` for the built-in confirm/cancel buttons but no keyboard-focus ring; they relied on the UA default (present today — `global.css` has no outline reset — so not a current failure, but brittle in a consuming app that resets outlines).
- **Fix (`Card.module.css`):** added an explicit `:focus-visible` outline for both default buttons. Pattern: `missing-focus-visible-style`.

### 5. `.root` surface transitions not gated under reduced-motion — MINOR — FIXED
- WCAG **2.3.3 Animation from Interactions (AAA)**.
- The hover `translateY(-2px)` was already wrapped in `@media (prefers-reduced-motion: no-preference)`, but the base `transition: … transform 180ms` on `.root` (`Card.module.css:54-58`) was ungated.
- **Fix (`Card.module.css`):** added `@media (prefers-reduced-motion: reduce) { .root { transition: none } }`. Pattern: `missing-reduced-motion`.

### 6. Root `aria-labelledby` is a dangling idref when no `Card.Title` is composed — MINOR — FIXED (2026-07-11 review pass)
- WCAG **4.1.2** (automated tools flag "aria-labelledby must reference an existing element").
- `index.tsx` (CardInner) always sets `aria-labelledby={titleId}` on the root, but `Card.Title` (which owns that `id`) is optional. A title-less card (stat-only / banner-only) leaves the reference dangling.
- **Original audit disposition (overturned):** the first pass filed this as an accepted limitation, reasoning that any signal telling the root whether a `Title` mounted would flip the attribute between SSR and client → hydration mismatch. That justification was overstated: the mismatch only occurs if the *initial render* differs between server and client. Keeping the attribute in the SSR/first-client render (identical markup — no mismatch) and removing it **after** mount is an ordinary post-hydration DOM mutation, which React does not diff against the server output.
- **Fix (`index.tsx` CardInner):** the root now carries an internal `rootElementRef`, merged with the caller's `ref` via an `assignRootRef` callback (so the consumer keeps their ref while the effect gets the node — the same merge shape as `CardConfirmDelete`'s `setPaneRef`). A post-mount `useEffect` reads `document.getElementById(titleId)`: if no element owns the id (title-less card) it `removeAttribute('aria-labelledby')`; if a title element is present it (re)asserts the attribute. `children` is a dependency so a composition that conditionally mounts/unmounts its title re-reconciles in both directions. SSR markup is unchanged, so no hydration mismatch; a nameless non-landmark `<article>` is valid, so removal is safe. Applied to both the `<article>` and the `asChild` render paths. Pattern: `dangling-aria-idref`.
- **Markup change note:** no attribute/role/`data-*` was renamed or removed and no DOM element type changed — the only runtime change is that a title-less card's root loses `aria-labelledby` shortly after mount (it previously kept a dangling one). The `AsChildListItem` story (titled asChild card) still asserts `aria-labelledby` resolves to the title, confirming the titled path is unaffected.

---

## Hearing (WCAG 1.2.x / 1.4.2)

**CLEAN.** Grepped the directory for `new Audio`, `AudioContext`, `<audio>`,
`<video>`, `navigator.vibrate`, `.play(` — **no matches**. Card conveys nothing
by sound; all state (`selected` / `disabled` / `dragging`, banner tone,
progress) is visual + programmatic. `Card.Banner` maps severity to
`role="alert"` (danger/warn) vs `role="status"` (info/success/neutral) so status
is announced, never audio-only.

## Reading & screen reader (WCAG 1.1.1, 1.3.1, 1.4.1, 2.1.x, 2.4.x, 4.1.2)

- **Accessible names / decorative icons:** already correct before this audit —
  `Card.HeaderIcon`, `.metricIcon`, `.bannerIcon`, `.bigValueSwatch`, and the
  drag grip are all `aria-hidden="true"`; `Card.SelectionCheckbox` requires an
  `ariaLabel`; `Card.DragHandle` buttons carry `aria-label` "Move up"/"Move
  down"; block-link takes text content or `ariaLabel`. No `icon-missing-aria-hidden`
  or `missing-accessible-name` findings on interactive elements — **except** the
  two nameless-widget cases fixed above (progressbar, alertdialog).
- **Semantic HTML first:** heading via real `<h1..h6>` (`Card.Title as`),
  links via real `<a href>`, block-link button is a real `<button type="button">`,
  checkbox is a native `<input type="checkbox">`, grid is `<ul>`/`<li>`. Good.
- **Keyboard:** all actions reach via native focusable elements; disabled
  reorder directions use the native `disabled` attribute (removed from tab
  order + programmatically conveyed). `Card.ConfirmDelete` now also honors
  **Escape**. No `missing-keyboard-arrow-nav` gap (the reorder pattern uses
  explicit buttons, not a roving grid — appropriate here).
- **Color-alone (1.4.1):** `selected` = ring **plus** `data-card-selected` /
  `data-card-state`; when a real selection affordance is present it is the
  native checkbox (conveys state to AT). `disabled` = opacity **plus**
  `data-card-disabled`. Banner/BigValue tones pair color with an icon + text.
  No color-only state.
- **Dynamic updates:** `Card.Banner` (`role=alert|status`) and the
  now-named `Card.ConfirmDelete` (`role=alertdialog`, focus-moved) announce on
  appearance.

## SEO semantics (SSR'd markup)

- Heading text renders as a **real `<h1..h6>`** with the level consumer-controlled
  (`Card.Title as`) — never a styled div. Default `h3`.
- Block-link is a crawlable **`<a href>`** when `href` is set (button only for
  `onClick`).
- `Card.Grid` emits real `<ul role="list">` + `<li>` (list semantics survive
  `list-style:none`).
- All primary content is server-rendered; no client-only injection of meaningful
  text. No canvas/QR text-alternative gaps in this component.

## Fixes applied

1. `index.tsx` — `CardProgress`: `aria-labelledby`→visible label, additive
   `ariaLabel` prop, `aria-valuetext` for custom `displayValue`.
2. `index.tsx` — `CardConfirmDelete`: `aria-labelledby`→message, `aria-modal="false"`,
   `tabIndex=-1` + focus-in-on-mount + connected-guarded focus restore, Escape→`onCancel`,
   ref-merge to preserve caller `ref`.
3. `Card.module.css` — block-link `<button>` `:focus-visible` parity (+ `outline:none` base).
4. `Card.module.css` — explicit `:focus-visible` on default confirm/cancel buttons.
5. `Card.module.css` — `@media (prefers-reduced-motion: reduce)` gate on `.root` transitions.
6. `index.tsx` — `CardInner`: merged root `ref` (`rootElementRef` + `assignRootRef`) and a
   post-mount `useEffect` that removes the dangling root `aria-labelledby` when no
   `Card.Title` owns `titleId`, and (re)asserts it when a title is present — reconciling both
   render paths without an SSR/hydration mismatch (2026-07-11 review pass).

No existing prop/export/`data-*`/`role`/`aria` attribute was renamed or removed;
all changes are additive. Machine-test selectors preserved
(`data-card-progress`, `data-card-confirm="delete"`, `data-action`, block-link markup,
root `role="article"` + `data-card*`). The one runtime markup change is that a title-less
card's root drops its (dangling) `aria-labelledby` shortly after mount — noted with issue #6.

## Stories updated

Added to `CardFamily.stories.tsx` (goobs' only regression tests):
- **`Progress/Accessible Name`** — asserts one bar is named by its visible
  "Complete" label (`getByRole('progressbar', { name })`) with valuenow/min/max,
  and a label-less bar is named by `ariaLabel` with `aria-valuetext="3 of 10 steps"`.
- **`ConfirmDelete/Accessible Name, Focus, Escape`** — asserts the pane is found
  via `getByRole('alertdialog', { name: <message> })`, `toHaveFocus()` on mount,
  and Escape fires `onCancel` (not `onConfirm`).
- **`BlockLink/Keyboard Focus`** — one `Tab` lands focus on the labelled
  block-link `<button>` (the whole-card click target).
- **`Root/aria-labelledby Reconciliation`** (2026-07-11 review pass) — asserts a
  title-LESS card (stats + banner body, no `Card.Title`) ends with **no**
  `aria-labelledby` after mount while keeping `role="article"`, and a titled card
  keeps `aria-labelledby` resolving to its rendered `<h*>` title.

Existing `ConfirmDeleteFlow` / `BannerTones` / `GridOfCards` / `AsChildListItem` etc.
remain green (no role/selector changes touched their assertions; the titled asChild
card still resolves `aria-labelledby` to its title).

## Deferred

None. All six findings were fixed at root cause inside `src/components/Card/` — nothing
falls outside this component's ownership. Issue #6 (dangling `aria-labelledby` on a
title-less card), previously logged as an accepted limitation, was FIXED in the
2026-07-11 review pass via a post-mount reconciliation effect (no SSR/hydration mismatch);
see issue #6 above.
