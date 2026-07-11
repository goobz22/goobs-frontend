# Panel — a11y audit (2026-07-11)

**Status:** FIXED (initial pass + adversarial-review follow-up + description-association pass, 2026-07-11)

## 2026-07-11 follow-up pass — subtitle is the panel's description (finding #8)

A re-audit against the APG dialog "description" contract surfaced one remaining gap on top of
the seven already fixed below.

| # | Severity | WCAG | Location (pre-fix) | Pattern class | Status |
|---|----------|------|--------------------|---------------|--------|
| 8 | Minor | 4.1.2 Name, Role, Value (A) / APG Dialog description | `index.tsx` root (`aria-describedby` absent) + subtitle span (no `id`) | `missing-accessible-description` | FIXED |

### 8 — Header `subtitle` was not associated as the panel's description (Minor, 4.1.2)
`Panel.Header`'s `subtitle` rendered as a visible `<span data-panel-subtitle>` with no `id`,
and the root `<section>`/`<dialog>` exposed only `aria-labelledby` (the title). For the
`fullscreen` **dialog** variant especially, a screen reader announced the title on open but
never the subtitle — the line that explains the takeover's purpose (e.g. "Edit the wholesale
buyer's details"). The library's own `Dialog` wires exactly this via `ariaDescribedBy`
(`Dialog/index.tsx:415`); Panel's dialog/region had no equivalent. Pattern class:
`missing-accessible-description`. **Fixed** (root cause, additive) by:
- adding `subtitleId` (a second `useId()`) to `PanelContext`;
- `PanelInner` now captures the header child element and derives
  `hasSubtitle = headerChild?.props.subtitle !== undefined`, so `aria-describedby` is gated on
  the subtitle genuinely rendering (never a dangling IDREF — mirrors the fix-#2 labelledby guard);
- emitting `aria-describedby={hasSubtitle ? subtitleId : undefined}` on the root, placed
  **before** `{...restProps}` so a consumer can override it;
- `Panel.Header` tagging its subtitle span with `id={subtitleId}`.
No prop/export renamed, removed, or retyped; the `data-panel-subtitle` selector is preserved
(the span merely gained an `id`). Commit `b0ac3787`.

**Stories added for finding #8** (`Panel.stories.tsx`, commit `b0ac3787`):
- `A11y/Subtitle is the description (aria-describedby)` — asserts the root's `aria-describedby`
  resolves to the real `data-panel-subtitle` element with the expected text.
- `A11y/No subtitle → no aria-describedby` — asserts a subtitle-less header emits no dangling
  `aria-describedby`.
- Extended `A11y/Fullscreen Modal (focus trap + Escape)` — now also asserts the dialog exposes
  both `aria-labelledby` (name) and an `aria-describedby` resolving to the subtitle.

---


**APG pattern:** Two patterns apply depending on variant. For `sacred`/`standard`, `Panel`
is a **landmark [region](https://www.w3.org/WAI/ARIA/apg/practices/landmark-regions/)** —
but the explicit `role="region"` is now emitted **only when the panel has an accessible
name** (header title, or a consumer `aria-label`/`aria-labelledby`); a nameless panel
degrades to a plain `<section>` (never an unnamed landmark). The `fullscreen` variant is a
`position:fixed; inset:0` viewport takeover over an opaque backdrop — semantically a
**modal**, so it now follows the [dialog (modal)
APG pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/): `role="dialog"` +
`aria-modal="true"`, focus moved in on mount, Tab trapped, `Escape` → `onClose`, focus
restored on unmount. Otherwise `Panel` is a stateless shell-surface primitive (compound root
+ `Panel.Header` / `Panel.Body` / `Panel.Footer`). The one always-present interactive control
is the optional back **`<button>`** (via `IconButton`), which already carries an accessible
name.

**Component:** `src/components/Panel/index.tsx` (default `Panel`, plus exported
`PanelHeader`, `PanelBody`, `PanelFooter`), `src/components/Panel/Panel.module.css`,
`src/components/Panel/Panel.stories.tsx`.

## Pattern-compliance baseline (already correct — no change)

- Root is a real `<section role="region">` with `aria-labelledby` → the panel is a named
  landmark, announced by its title (`index.tsx:135-158`).
- Back button is a native `<button>` (IconButton → CustomButton) with `aria-label`
  (`backLabel`, default `"Back"`) — accessible name present, keyboard-operable
  (`index.tsx:239-251`).
- The `standard` variant already routes to a light-theme header text/icon while
  `sacred`/`fullscreen` stay gold-on-dark — a deliberate WCAG-contrast decision documented
  in-code (`index.tsx:212-219`).
- All `data-*` machine-test selectors intact and unchanged: `data-component="Panel"`,
  `data-panel`, `data-panel-variant`, `data-panel-header`, `data-panel-title`,
  `data-panel-subtitle`, `data-panel-header-actions`, `data-panel-back`,
  `data-action="cancel"`, `data-panel-body`, `data-panel-footer`.
- No `Audio`/`AudioContext`/`<audio>`/`<video>`/`navigator.vibrate` (grep-verified).

## Issues found

| # | Severity | WCAG | Location (pre-fix) | Pattern class | Status |
|---|----------|------|--------------------|---------------|--------|
| 1 | Serious  | 1.3.1 Info & Relationships (A) / 2.4.6 Headings & Labels (AA) | `index.tsx:226-239` — title rendered via `Typography` (a `<span>`) | `nonsemantic-heading` | FIXED |
| 2 | Moderate | 1.3.1 (A) / 4.1.2 Name, Role, Value (A) | `index.tsx:144` — root always emits `aria-labelledby={titleId}` | `dangling-aria-labelledby` | FIXED |
| 3 | Serious  | 2.1.1 Keyboard (A) | `index.tsx:275` + `Panel.module.css:120` — `Panel.Body` `overflow:auto`, not focusable | `scrollable-region-not-keyboard-accessible` | FIXED |
| 4 | Minor    | 1.1.1 Non-text Content (A) / 4.1.2 (A) | `index.tsx:218` — `ArrowBackIcon` `<svg>` had no `aria-hidden` | `icon-missing-aria-hidden` | FIXED |
| 5 | Moderate | 2.4.3 Focus Order (A) / 1.3.1 (A) / 4.1.2 (A) | `Panel.module.css:67-73` + `index.tsx` root — `fullscreen` takeover was an unmanaged modal (no focus trap/restore, no Escape, background not inert) | `unmanaged-modal-takeover` | FIXED |
| 6 | Minor    | 1.3.1 (A) / best-practice `region` | `index.tsx:156` — header-less panel kept a hardcoded `role="region"` with no accessible name | `unnamed-landmark` | FIXED |
| 7 | Minor    | 2.4.3 Focus Order (A) | `index.tsx:311` — `Panel.Body` got `tabIndex={0}` unconditionally (redundant tab stop / scrolls-nothing focus target) | `over-broad-scrollable-focusable` | FIXED |

### 5 — Fullscreen takeover was an unmanaged modal (Moderate, 2.4.3 / 1.3.1 / 4.1.2)
`.fullscreen` renders `position:fixed; inset:0; z-index:1300` over an opaque backdrop
(`--panel-bg` = near-black `goobs-black-a98`), completely obscuring the page — a modal
takeover in everything but its ARIA. The root was only `role="region"` with **no focus
trap, no focus restoration, no Escape-to-close, and no inert/aria-hidden on the obscured
background**, so a keyboard or AT user could Tab straight from the panel into the now-invisible
page content behind it (WCAG 2.4.3 Focus Order / 1.3.1). Pattern class:
`unmanaged-modal-takeover`. **Fixed** by giving the `fullscreen` variant the full APG dialog
contract, mirroring the library's `Dialog` (`Dialog/index.tsx`): the root now renders
`role="dialog"` + `aria-modal="true"` (so AT treats the background as inert without touching
the consumer's arbitrary sibling DOM) + `tabIndex={-1}`; a variant-gated effect moves focus
into the takeover on mount, traps Tab at the boundaries (boundary-only cycling — deliberately
no "recapture" branch, so a portalled dropdown opened inside stays operable, matching
`Dialog`), closes on `Escape` via a new additive optional **`onClose`** prop, and restores
focus to the opener on unmount. A dev-only warning fires if a fullscreen panel mounts with no
accessible name (no header title and no consumer `aria-label`/`aria-labelledby`), mirroring
`Dialog`'s nameless-modal warning (WCAG 4.1.2).

### 6 — Header-less panel was an unnamed landmark (Minor, 1.3.1 / best-practice)
Fix #2 correctly dropped the dangling `aria-labelledby` on a header-less panel, but the root
still hardcoded `role="region"`. An explicit `region` landmark with **no accessible name** is
a nameless landmark (axe best-practice `region`; APG: a region should be labelled). Pattern
class: `unnamed-landmark`. **Fixed** by making the role conditional on the panel actually
having a name: `role="region"` is emitted when a `Panel.Header` title **or** a consumer
`aria-label`/`aria-labelledby` supplies one; otherwise the explicit role is dropped and the
element is a plain `<section>` (which is a landmark **only** when named — so a nameless
header-less panel registers no landmark at all). The named case (every real ThothOS usage
composes a `Panel.Header`) still emits `role="region"` exactly as before.

### 7 — `Panel.Body` was an unconditional tab stop (Minor, 2.4.3)
Fix #3 made the body focusable to remediate the keyboard-scroll trap, but did so
**unconditionally** (`tabIndex={0}` always). The canonical scrollable-region-focusable
remediation is conditional: a scroll container should be a tab stop **only when it actually
overflows AND holds no focusable descendants**. The primitive's own reference use case
(`InlineManageContact` — a form-filled body) has focusable fields, so an always-focusable
container becomes a redundant extra tab stop *before* the fields; and when content doesn't
overflow it is a focusable element that scrolls nothing — both are focus-order noise (WCAG
2.4.3). Offloading this to "consumers set `tabIndex={-1}`" (as the initial report did) is not
realistic. Pattern class: `over-broad-scrollable-focusable`. **Fixed** by measuring at runtime
in `Panel.Body`: a `ResizeObserver` + `MutationObserver`-driven check sets `tabIndex={0}` only
when `scrollHeight > clientHeight` **and** there are no visible focusable descendants, and
omits the attribute otherwise (re-measuring when overflow or interactive content changes). A
consumer-passed `tabIndex` still overrides (it is spread after). The `:focus-visible` outline
from fix #3 is retained for the cases where the body is genuinely a tab stop.

### 1 — Panel title is not a real heading (Serious, 1.3.1 / 2.4.6)
The title was rendered by `Typography variant="cinzelh5"`, and `Typography` **always
renders a `<span>`** (verified `Typography/index.tsx:482-491` — deliberately a span so it is
valid phrasing content inside buttons/headings). So the panel's visual heading was a styled
non-heading: screen-reader heading navigation skipped it and the SSR document outline was
flat. There was also no way for the consumer to set the heading level. The `id` used by the
root's `aria-labelledby` sat on the `headerTitleBlock` **div** that wraps *both* the title
and the subtitle, so the region's accessible name over-included the subtitle text. Pattern
class: `nonsemantic-heading`.

### 2 — Dangling `aria-labelledby` on a header-less Panel (Moderate, 1.3.1 / 4.1.2)
The root unconditionally set `aria-labelledby={titleId}`, but the element carrying `titleId`
lives in `Panel.Header`, which is optional. A Body-only composition
(`<Panel><Panel.Body/></Panel>`) therefore produced a `role="region"` whose
`aria-labelledby` referenced an **id that never renders** — an invalid IDREF that leaves the
landmark with no accessible name and trips AT/validators. Pattern class:
`dangling-aria-labelledby`.

### 3 — Scroll body not keyboard-accessible (Serious, 2.1.1)
`Panel.Body` is the `flex:1; overflow:auto` scroll region (its whole purpose). When its
content overflows but holds **no focusable children** — the read-only "inline show" case,
and exactly what every non-form story renders (12 `<p>` rows) — a keyboard-only user cannot
scroll it (no focusable element inside, container not focusable). This is axe-core
`scrollable-region-focusable` / WCAG 2.1.1. Pattern class:
`scrollable-region-not-keyboard-accessible`.

### 4 — Decorative back-arrow glyph not hidden (Minor, 1.1.1 / 4.1.2)
`ArrowBackIcon` renders a bare `<svg>` with no `aria-hidden`. The button's `aria-label`
already supplies the name (so there is no *broken* state today), but marking the purely
decorative glyph `aria-hidden="true"` is the correct belt-and-suspenders so the icon can
never leak a redundant node into the accessibility tree. Pattern class:
`icon-missing-aria-hidden`.

## Hearing (WCAG 1.2.x, 1.4.2)
N/A — grep found no `Audio`/`AudioContext`/`<audio>`/`<video>`/`navigator.vibrate`. No
information is conveyed by sound. No finding.

## Reading & screen reader (1.1.1, 1.3.1, 1.4.1, 2.1.x, 2.4.x, 4.1.2)
- **Fix 1** makes the title a real `<h1>`–`<h6>` (new additive `headingLevel` prop, default
  `2`) and moves the `titleId` onto that heading, so the region's accessible name is now
  precisely the title (subtitle no longer folded in) and the title participates in heading
  navigation.
- **Fix 2** gates `aria-labelledby` on a `Panel.Header` actually being composed in, so a
  header-less region degrades to un-named (or a consumer's own `aria-label` via restProps)
  rather than a broken reference.
- **Fix 3** makes the scroll body focusable (`tabIndex={0}`, overridable via restProps) and
  adds a `:focus-visible` outline so it is keyboard-scrollable *and* has a visible focus
  indicator (2.4.7) on both the sacred-gold and standard-blue surfaces.
- **Fix 4** hides the decorative glyph.
- Color is never the sole state signal: the `standard`/`sacred`/`fullscreen` variants are
  cosmetic archetypes, not interactive state; the variant is also exposed programmatically
  via `data-panel-variant` (1.4.1). No finding.
- **Motion (2.3.3):** the module has **no** CSS `transition`/`animation` (grep-verified), and
  the focus outline I added is instant — no `prefers-reduced-motion` block needed. No finding.

## SEO semantics (SSR)
- The panel title now emits a real, consumer-levelled `<h1>`–`<h6>` in the SSR HTML (was a
  `<span>`) — the primary SEO/outline win.
- The root is a real `<section>`; the header/footer remain `<div>`s. Promoting them to
  `<header>`/`<footer>` would require **retyping the public
  `forwardRef<HTMLDivElement>` / `HTMLAttributes<HTMLDivElement>` surface** of
  `PanelHeader`/`PanelFooter` (a `<header>` is `HTMLElement`, not `HTMLDivElement`), which
  violates the additive-only API rule. Left as `<div>` — not a WCAG failure (the region
  landmark + real heading already carry the structure). Noted in Deferred.
- All primary content is caller-provided children rendered server-side — no client-only
  injection of primary content. No finding.

## Fixes applied
1. **Real heading title + `headingLevel`** (`index.tsx`, `Panel.module.css`): added the
   additive `headingLevel?: 1|2|3|4|5|6` prop (default `2`), render the title inside
   `<h${headingLevel} id={titleId} className={headerHeading}>` wrapping the existing
   `Typography` (span stays valid phrasing content inside the heading). New `.headerHeading`
   class neutralises the heading's UA margin/size/weight so the visual chrome is unchanged.
   `data-panel-title` stays on the block div (test contract preserved); the `id` moved from
   the block div to the heading so `aria-labelledby` names only the title.
2. **Gate `aria-labelledby`** (`index.tsx`): the root detects a direct `Panel.Header` child
   (`React.Children` + `child.type === PanelHeader`) and emits `aria-labelledby` only then,
   eliminating the dangling IDREF on header-less panels.
3. **Keyboard-scrollable body** (`index.tsx`, `Panel.module.css`): `Panel.Body` defaults to
   `tabIndex={0}` (placed before `{...restProps}` so a consumer can override, e.g. `-1`,
   when the body already contains focusable content), plus a `.body:focus-visible` outline
   keyed to the shared `--panel-accent` token (visible on sacred + standard).
4. **Decorative icon hidden** (`index.tsx`): passed `aria-hidden="true"` to `ArrowBackIcon`
   at the Panel callsite (props spread onto its `<svg>`); the Icons component itself was not
   touched.
5. **Fullscreen modal focus management** (`index.tsx`): new additive optional `onClose?:
   () => void` prop; the `fullscreen` variant renders `role="dialog"` + `aria-modal="true"` +
   `tabIndex={-1}` and runs a variant-gated APG dialog effect (focus-in on mount, boundary Tab
   trap, `Escape` → `onClose`, focus restore on unmount) plus a dev-only nameless-modal warning.
   Shared `FOCUSABLE_SELECTOR` / `getFocusableWithin()` helpers mirror `Dialog`. No CSS change
   (the existing `.fullscreen` fixed/inset/z-index rules are unchanged and correct).
6. **Named-landmark gating** (`index.tsx`): `role="region"` is now computed
   (`hasAccessibleName = hasHeader || consumer aria-label/aria-labelledby`) — emitted only when
   named, dropped (plain `<section>`) otherwise, and set to `"dialog"` for `fullscreen`.
7. **Conditional body tab stop** (`index.tsx`): `Panel.Body` measures overflow + focusable
   descendants at runtime (`ResizeObserver` + `MutationObserver`) and sets `tabIndex={0}` only
   when it is genuinely an unfocusable scroll trap; the attribute is omitted otherwise. Consumer
   `tabIndex` still overrides.

## Markup / attribute changes (public DOM — noted per additive-only policy)
All are additive or correctness-gating; **no existing `data-*` selector, and no `role`/`aria`
in the machine-test contract, is removed or renamed for the normal (header-composed) case**:
- **`fullscreen` root `role`: `region` → `dialog`** + new `aria-modal="true"` + `tabIndex="-1"`.
  A fullscreen takeover genuinely *is* a modal; this is the semantically correct role and is
  required for `aria-modal` to make the background inert for AT. Sacred/standard roots are
  unaffected.
- **Header-less, unnamed panel: `role="region"` is no longer emitted** (plain `<section>`).
  Any named panel — i.e. every panel with a `Panel.Header` (all real ThothOS usages) or a
  consumer `aria-label`/`aria-labelledby` — still emits `role="region"` exactly as before.
- **`Panel.Body` `tabindex` is now conditional** (present only when the body is an unfocusable
  scroll trap) rather than always `"0"`. The `data-panel-body="true"` selector is unchanged.
- **New optional prop `onClose`** on `Panel` (additive; ignored by non-fullscreen variants).

## Stories updated
- **`InteractionTest` play extended:** now pins that `aria-labelledby` resolves to a real
  heading element (`tagName` matches `/^H[1-6]$/`, default `H2`), that `Panel.Body` has
  `tabindex="0"`, and that the back button's `<svg>` is `aria-hidden="true"` — so reverting
  any of the four fixes fails this story.
- **New `HeadingLevel` story** (`A11y/Heading Level`): renders `headingLevel={3}` and the
  play test asserts the title is an `<h3>` carrying the `aria-labelledby` id with the right
  text — pins the consumer-controllable-level behavior.
- **`HeaderlessRegion` story** (`A11y/Header-less (no dangling label, no unnamed landmark)`):
  a Body-only panel whose play test asserts the region has **no** `aria-labelledby`, **no**
  explicit `role` (finding #6), and the body is still `tabindex="0"` (it overflows with no
  focusable children).
- **New `HeaderlessLabelledRegion` story** (`A11y/Header-less but aria-label (named
  landmark)`): a header-less panel with a consumer `aria-label` — play asserts it **still**
  emits `role="region"` (role is gated on a name, not on the header). Pins finding #6's gate.
- **New `BodyWithInteractiveContent` story** (`A11y/Body — interactive content is not a tab
  stop`): a body containing focusable buttons — play asserts the body has **no** `tabindex`
  (no redundant stop). Pins finding #7.
- **New `BodyShortNoOverflow` story** (`A11y/Body — non-overflowing is not a tab stop`): a
  body with a single non-overflowing line — play asserts **no** `tabindex`. Pins finding #7.
- **New `FullscreenModal` story** (`A11y/Fullscreen Modal (focus trap + Escape)`): drives the
  modal contract — asserts `role="dialog"` + `aria-modal="true"`, that focus is moved into the
  takeover on mount, that Shift+Tab at the boundary stays trapped inside (never escapes to the
  obscured page), and that `Escape` invokes `onClose`. Pins finding #5.
- **`Fullscreen` story play extended:** now also asserts `role="dialog"`, `aria-modal="true"`,
  and `tabindex="-1"` alongside the existing `position:fixed` + `data-panel-variant` checks.
- Existing `Sacred` / `Standard` / `NoBackButton` / `BodyOnly` / `HeadingLevel` /
  `InteractionTest` stories remain valid (`InteractionTest`'s body-`tabindex` assertion is now
  wrapped in `waitFor` to allow the post-mount measurement to settle).

## Deferred (out of this directory's ownership OR design decisions to escalate)

None of the seven fixed issues (initial 1–4 or adversarial-review 5–7) required edits outside
`src/components/Panel/` — all were fixed at root cause in `index.tsx` (+ stories). The
`fullscreen`-modal background-inert guarantee is delivered via `aria-modal` + focus trap
rather than mutating the consumer's sibling DOM, because `Panel` is rendered inline in an
arbitrary consumer tree (it is not portalled), so it cannot safely mark unknown siblings
`inert` — that half stays a consumer responsibility and is now documented on the `variant`
prop. Two observations are recorded rather than changed:

1. **`Panel.Header` / `Panel.Footer` are `<div>`, not `<header>`/`<footer>`**
   (`index.tsx:203-208`, `299-319`). Promoting them to semantic sectioning elements would
   improve the SSR outline but requires **retyping the public `forwardRef<HTMLDivElement>`
   and `extends React.HTMLAttributes<HTMLDivElement>`** on both subcomponents (a `<header>`
   is typed `HTMLElement`), which is a breaking change to the exported prop/ref types — out
   of bounds for an additive-only pass. Suggested change (if the API is ever allowed a major
   bump): change both to `forwardRef<HTMLElement, …>` and render `<header>`/`<footer>`.
   Not a WCAG violation as-is. Pattern class: `nonsemantic-landmark`.
2. **`ArrowBackIcon` decorative SVGs library-wide** (`src/components/Icons/*.tsx`) emit no
   default `aria-hidden` and no `role="img"`+title path. I hid it at my callsite; a
   library-wide default (decorative-by-default `aria-hidden`, opt-in labelling) belongs in
   the shared `Icons` component, which I do not own. Suggested change: in each icon's
   `<svg>`, default `aria-hidden="true"` unless an `aria-label`/`role="img"` is passed.
   Pattern class: `icon-missing-aria-hidden`.
