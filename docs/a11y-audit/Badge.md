# Badge — a11y audit (2026-07-11)

**Status:** FIXED (incl. two adversarial-review follow-ups — Issues 3, 4 & 5 below)

**Component:** `src/components/Badge/index.tsx`, `Badge.module.css`,
`Badge.stories.tsx`

> An adversarial review of the first pass found two remaining issues: the sacred
> theme was never contrast-graded and failed (Issue 3), and defaulting every
> badge to a `role="status"` live region was over-reach while the unlabeled
> default still lacked meaning (Issue 4). A second adversarial review found the
> Issue-3 contrast fix was applied to the shipped default but NOT to the
> component's own `ColorVariantsSacred` demo story, which kept demonstrating the
> exact failing gold-on-translucent combos (Issue 5). All three are now fixed at
> root cause.

## APG pattern

There is no dedicated "badge" pattern in the WAI-ARIA APG. A badge is a small
count/status indicator overlaid on an anchor (notification count, cart count,
online dot, "NEW" flag). The correct semantic is the **status / live-region
pattern** (`role="status"`, an implicit `aria-live="polite"` region): it lets a
screen reader announce a value that changes without moving focus, while staying
silent on initial render. This matches the library's own precedent — the
read-only Chip **pill** resolves to `role="status"` (`Chip/index.tsx:194-203`),
and status regions are used across the repo (EmptyState, Field/Dropdown,
ConfirmationCodeInput).

Before this pass the badge chip was a bare `<span>` — no role, no labeling
mechanism, no live region. It rendered visible text but exposed none of the
status semantics the pattern requires.

## Issues found

### 1. Badge count has no programmatic meaning / accessible-name mechanism — SERIOUS
- **WCAG:** 1.3.1 Info and Relationships (A), 4.1.2 Name, Role, Value (A)
- **Where:** `index.tsx:87-98` (pre-fix) — the badge `<span>` rendered `content`
  with no `role` and no `aria-label` hook.
- **Detail:** A screen-reader user encountered the anchor's text followed by a
  context-free token — e.g. "Icon 5" — with no indication that "5" is a *count*,
  what it counts, or that it relates to the anchor. The relationship and meaning
  were conveyed only by the visual overlay position (a 1.3.1 failure), and there
  was no way for a consumer to give the bare number an accessible name (a 4.1.2
  gap for the common notification/cart use-case).
- **Pattern:** `missing-accessible-name`
- **Status:** FIXED — added an additive `ariaLabel?: string` prop applied to the
  badge span (`index.tsx:139-140`), so a consumer can pass
  `"5 unread notifications"`; and defaulted the span to `role="status"`
  (`index.tsx:138`) so the label/name is authoritatively exposed. When no
  `ariaLabel` is given, the visible text `content` remains the region's
  accessible name (real text, still announced).

### 2. Dynamic count changes are not announced — SERIOUS
- **WCAG:** 4.1.3 Status Messages (AA, 2.1)
- **Where:** `index.tsx:87-98` (pre-fix) — the badge span was an inert element
  with no live-region semantics.
- **Detail:** A badge overwhelmingly represents a *changing* count
  (notifications 5 → 6, cart items, unread messages). With no `role="status"` /
  `aria-live`, every such update was completely silent to assistive tech — the
  user was never told a new notification arrived unless they happened to
  re-navigate to the badge. This is the canonical status-message failure.
- **Pattern:** `status-not-announced`
- **Status:** FIXED — the default `role="status"` makes the chip a polite live
  region; added `aria-atomic="true"` when status (`index.tsx:143`) so the full
  value ("99+", "6") is re-read on change rather than a partial diff; and added
  an additive `ariaLive?: 'off' | 'polite' | 'assertive'` prop
  (`index.tsx:141-142`) so a consumer can escalate to `assertive` for urgent
  counts or `off` to suppress. A live region only announces *changes*, so static
  badges stay silent on initial render — no announcement spam.

### 3. Sacred-theme default badge fails contrast — MODERATE (adversarial-review finding)

- **WCAG:** 1.4.3 Contrast (Minimum) (AA)
- **Where:** `Badge.module.css` base `.badge` rule (the sacred default — there is
  no `.badge[data-theme='sacred']` override, so `theme='sacred'` falls through to
  the base). It rendered gold text (`--goobs-gold` = `#ffd700`) on a translucent
  red fill `rgba(220, 38, 38, 0.9)`.
- **Detail:** Gold-on-that-red is only **~3.44:1 solid**, and because the fill is
  translucent it composites with the backdrop — **as low as ~3.08:1 over a light
  backdrop** (best case ~4.10:1 over black). The badge text is 12px bold, which is
  NOT WCAG "large text", so 4.5:1 is required — the sacred default failed in every
  case. The gold text-shadow glow does not raise the ratio. The first pass graded
  only light/dark and wrongly generalized "contrast already addressed" to sacred.
  Exercised by the `SacredTheme` / `AllThemes` stories. (Ratios computed with the
  WCAG relative-luminance formula; verified in a script.)
- **Pattern:** `contrast-minimum`
- **Status:** FIXED — sacred fill changed to **opaque `#991b1b`** (red-800),
  lifting gold text to **~5.92:1** and removing the backdrop dependency. Gold
  glow box-shadow, gold border, and gold text-shadow are preserved so the sacred
  look is intact; `backdrop-filter` is kept for callers who override the
  background back to a translucent value. Light/dark defaults were already
  compliant and are unchanged. Pinned by a `SacredTheme` play function asserting
  the computed background is `rgb(153, 27, 27)` (fails on a revert). Commit
  `b1552e1f`.

### 4. `role="status"` on every badge = live-region verbosity; default count still unlabeled — MINOR (adversarial-review finding)

- **WCAG:** 4.1.3 Status Messages (AA) — over-application; 1.3.1 / 4.1.2 — the
  default meaning gap.
- **Where:** `index.tsx` — the first pass defaulted the chip to `role="status"`,
  which carries an implicit `aria-live="polite"`. So EVERY badge (including the
  ~20 static bare-count stories) became a polite live region, and a bare
  `<Badge content="5">` with no `ariaLabel` still announced only "5".
- **Detail:** Two problems. (a) **Verbosity / over-reach:** most badges are
  static, and a page or data-grid full of implicitly-polite status regions
  multiplies live regions and, on any bulk update, floods assistive tech with
  polite chatter — the badge library shouldn't opt every consumer into
  announcements. (b) **Default meaning gap:** the component cannot invent what
  "5" counts, so the un-labeled default still lacked context, and nothing beyond
  JSDoc nudged consumers to supply `ariaLabel`.
- **Pattern:** `live-region-overreach` + `missing-accessible-name`
- **Status:** FIXED —
  1. **Announcements are now OPT-IN.** A status badge defaults to
     `aria-live="off"` (`resolvedAriaLive`, `index.tsx`), so it keeps the
     `role="status"` identity but is MUTED: a static badge never announces and a
     grid of counts doesn't flood AT. A consumer escalates a genuinely dynamic
     count with `ariaLive="polite"`/`"assertive"`. (Resolves the tension in the
     original Issue 2: change announcement is the right behavior for a dynamic
     count, but it must not be the blanket default for every badge.)
  2. **Dev-time nudge.** A once-per-session, production-stripped `console.warn`
     fires when a non-decorative badge has a bare numeric `content` (a number or
     `"5"`/`"99+"`/`"1,234"`) but no `ariaLabel`, pointing the consumer to
     `ariaLabel` (or `role="none"`). Warn-once is module-scoped so a grid does
     not spam the console. Mirrors the existing `goobs Dialog` missing-name
     warning convention. Self-describing text (`"NEW"`, `"Error"`) does not warn.
  3. Stories: new `MutedByDefault` pins `role="status"` + `aria-live="off"` on a
     plain badge; `LabeledStatus` now also asserts `aria-live="off"`;
     `LiveCountUpdate` keeps the explicit `ariaLive="polite"` opt-in path. Commit
     `b1552e1f` (component) + `ef2ec54b` (stories).
- **Note (honest limitation):** the component fundamentally cannot supply the
  *meaning* of a bare count it wasn't given — the mechanism (`ariaLabel`), the
  dev nudge, and the demonstrative stories are the full extent of what the
  library can do; a consumer that ignores all three still ships an unlabeled
  count. This is a documented consumer responsibility, not a component defect.

### 5. `ColorVariantsSacred` demo story ships the exact failing gold-on-translucent contrast Issue 3 flagged — MINOR (second adversarial-review finding)

- **WCAG:** 1.4.3 Contrast (Minimum) (AA)
- **Where:** `Badge.stories.tsx` `ColorVariantsSacred` (was lines 601-696) — four
  sacred severity tiles rendered gold text (`#FFD700`) on translucent fills:
  `rgba(220,38,38,0.9)` (Error), `rgba(34,197,94,0.9)` (Success),
  `rgba(245,158,11,0.9)` (Warning), `rgba(59,130,246,0.9)` (Info).
- **Detail:** Issue 3 fixed the shipped sacred DEFAULT (base `.badge` →
  opaque `#991b1b`) but the component's own demo story still passed
  translucent low-contrast fills as `styles.backgroundColor` overrides. Gold on
  `rgba(220,38,38,0.9)` is only ~3.44:1 solid (the identical combo Issue 3
  calls out) and gold on amber `rgba(245,158,11,0.9)` is only **~1.7:1** — both
  fail 4.5:1 for the 12px-bold, non-large badge text. These are consumer-supplied
  override colors, so the *component* is not defective — but the story is the
  repo's only regression test AND its Chromatic baseline, so the audit was
  shipping a visual baseline that ratifies the very contrast failure it claims to
  have graded. (Ratios re-verified with the WCAG relative-luminance formula.)
- **Pattern:** `contrast-minimum`
- **Status:** FIXED — the four demo fills changed to OPAQUE, dark-enough colors
  that clear 4.5:1 against gold text while keeping the severity semantics:
  Error `#991b1b` red-800 (5.92:1, matches the shipped default), Success
  `#14532d` green-900 (6.50:1), Warning `#78350f` amber-900 (6.47:1), Info
  `#1e40af` blue-800 (6.22:1). Added a `ColorVariantsSacred` play function that
  pins each computed `background-color` (`rgb(153,27,27)` / `rgb(20,83,45)` /
  `rgb(120,53,15)` / `rgb(30,64,175)`), so a revert to a translucent
  low-contrast fill re-fails the story. No component/CSS change was needed — the
  defect was entirely in the demo. `styles.backgroundColor` remains a fully
  additive public override; only the demo's chosen values changed.
- **Re-review confirmation (this pass):** re-verified with the WCAG
  relative-luminance formula in a script — the four opaque fills compute to
  5.92 / 6.50 / 6.47 / 6.22:1 against gold `#FFD700` (all PASS), and the two
  fills the finding named (`rgba(220,38,38,0.9)` 3.44:1 solid / 3.07:1 over
  white; `rgba(245,158,11,0.9)` 1.53:1 solid) genuinely FAIL — so the finding
  was a valid observation against the pre-fix snapshot and is now resolved.
  **Hardened the regression test:** a 1.4.3 ratio depends on BOTH colors, but
  the play function pinned only the fill — a revert that kept an opaque fill yet
  changed the gold text to a low-contrast color would have slipped through. The
  play function now also asserts each chip's computed `color` is
  `rgb(255, 215, 0)` (gold `#FFD700`), so the full contrast PAIR is
  regression-locked. No component/CSS change.

## Hearing

No sound/media APIs are used — `grep` for `new Audio` / `AudioContext` /
`<audio>` / `<video>` / `navigator.vibrate` / `.play(` across the Badge
directory is empty. All state the badge conveys (a count, a status) is now both
visual (the rendered chip text/color) and programmatic (`role="status"` +
`aria-label` + `aria-live`), never audio-only. WCAG 1.2.x / 1.4.2 not
applicable. No hearing-related issue.

## Reading & screen reader

- **Accessible name:** `ariaLabel` gives a bare count meaning; when omitted, the
  visible text `content` is the region name. I did **not** auto-derive
  `aria-label` from `content` (unlike Chip's `resolveAriaLabel`): the component
  cannot invent what "5" counts, and a duplicated label adds nothing. Instead a
  dev-only `console.warn` (Issue 4) nudges the consumer to supply one. A
  decorative dot/icon `content` with no text is a documented caller
  responsibility to label (`BadgeProps.ariaLabel` JSDoc) or to opt out via
  `role="none"`.
- **Roles/states:** default `role="status"` + `aria-atomic="true"` +
  `aria-live="off"` (MUTED — announcements are opt-in via `ariaLive`, see Issue
  4). `role="none"`/`"presentation"` cleanly strips semantics (and its guard
  drops `aria-label` and `aria-live`) for a purely decorative badge.
- **Semantic HTML:** the badge is inline supplementary content — a `<span>`
  inside a grouping `<div data-component="Badge">` is the correct element; no
  interactive/native-element substitution is warranted (the badge itself is not
  a button/link).
- **Keyboard:** the badge is non-interactive (no `onClick`, no `tabindex`) — no
  keyboard interaction table applies and no `:focus-visible` treatment is needed
  on the chip. (The `Interactive` story wires `onClick` onto the *child* anchor
  the consumer passes in, which is the consumer's element and semantic
  responsibility, not the Badge's.)
- **Color-alone (1.4.1):** the badge's meaning is carried by its text `content`
  ("5", "NEW", "Error"/"Success"/"Warning"/"Info" in the variant stories) plus
  the programmatic `role`/`aria-label`, never by fill color alone. No fix needed.
- **Contrast (1.4.3):** the light/dark theme defaults were darkened to red-700
  grades (`#d32f2f` 4.98:1, `#b91c1c` 6.47:1 on white) with explanatory comments
  in `Badge.module.css`. **The sacred path was NOT graded in the first pass and
  FAILED** — see Issue 3 below; now fixed (opaque `#991b1b`, gold text 5.92:1).
- **Motion (2.3.3):** `Badge.module.css` defines no `animation`/`transition`
  (only a static `backdrop-filter`), so no `prefers-reduced-motion` block is
  required. No fix needed.
- **No overlay/dialog surface** — no focus-trap/Escape/`aria-modal` concerns.

## SEO semantics

Badge is a compact inline count/status indicator, not a heading, landmark,
link, or list — so no heading-level (`<h1-6>`), `<nav>`, `<a href>`, `<ul>`,
`<table>`, or `<figure>` obligations apply. Under Next.js SSR the badge's
`content` renders directly in the crawled HTML (no client-only injection of
primary content), and the new `role`/`aria-*` attributes are static and emitted
server-side. No SEO-semantic issue.

## Fixes applied

1. `index.tsx` — additive `ariaLabel?: string`, `role?: string`, and
   `ariaLive?: 'off' | 'polite' | 'assertive'` props (fully JSDoc'd); the badge
   span defaults to `role="status"` with `aria-atomic="true"`, applies
   `aria-label` when provided (and not decorative), and applies `aria-live` when
   it resolves to status — matching the Chip pill convention. Commit
   `2609687d`. (Issues 1 + 2 — one markup change closes both.)
2. `Badge.stories.tsx` — three new accessibility stories (below). Commits
   `bc7dd874` (auto-checkpoint of the story block by the shared-tree
   `save-work-checkpoint` hook) + `78cc85b6` (final).

### Adversarial-review follow-up (this pass)

3. `Badge.module.css` — sacred default fill `rgba(220,38,38,0.9)` → opaque
   `#991b1b` so gold text clears WCAG AA 4.5:1 (Issue 3). Commit `b1552e1f`.
4. `index.tsx` — status badges default to `aria-live="off"` (announcements
   opt-in via `ariaLive`) so static badges aren't announcing live regions; a
   dev-only once-per-session `console.warn` nudges consumers to add `ariaLabel`
   for a bare numeric count (Issue 4). Commit `b1552e1f`.
5. `Badge.stories.tsx` — `SacredTheme` play function pins the opaque fill;
   `MutedByDefault` (new) pins `aria-live="off"`; `LabeledStatus` asserts muted;
   `LiveCountUpdate` JSDoc clarified. Commit `ef2ec54b`.

### Second adversarial-review follow-up (this pass)

6. `Badge.stories.tsx` — `ColorVariantsSacred` demo fills changed from
   translucent gold-on-`rgba(...,0.9)` (~1.7–3.44:1, failing WCAG 1.4.3) to
   opaque red-800/green-900/amber-900/blue-800 (5.9–6.5:1); new play function
   pins the computed fills so a low-contrast revert re-fails (Issue 5). No
   component/CSS change — the failure was demo-only; `styles.backgroundColor`
   stays a fully additive public override.

No existing `data-*` / `role` / `aria` attribute was removed or renamed; every
API change is additive (still three optional props; `role="status"` is retained
and merely muted by default). Per-file gates green: `bun lint:file` on all three
`.tsx` files + `stylelint` on the CSS (0 warnings each). **CSS was changed this
pass** (sacred contrast) — the `SacredTheme`/`AllThemes`/`ColorVariantsSacred`
Chromatic baselines shift to the darker opaque red; that is the intended fix.
The `role`/`aria` changes do not affect rendering.

## Stories updated

`Badge.stories.tsx` (the only regression tests in this repo — goobs has no unit
tests):

- **`LabeledStatus` (Accessibility/Labeled Status)** — new. A count badge with
  `ariaLabel="5 unread notifications"`; play function asserts the chip is
  `getByRole('status')`, carries the `aria-label`, has `aria-atomic="true"`, and
  shows the visible "5". Pins issue 1.
- **`LiveCountUpdate` (Accessibility/Live Count Update)** — new. A stateful
  badge whose count increments on click; play function asserts
  `aria-live="polite"`, initial text "1", then after a click asserts the text
  updates to "2" *and* the `aria-label` updates to "2 unread notifications" —
  demonstrating the live-region announcement path. Pins issue 2.
- **`DecorativeBadge` (Accessibility/Decorative (role=none))** — new. A
  dot badge with `role="none"`; play function asserts `queryByRole('status')` is
  null and the span carries no `aria-label`/`aria-live` — pins the decorative
  opt-out.

Adversarial-review pass:

- **`SacredTheme` (Themes/Sacred Theme)** — extended with a play function
  asserting the badge's computed `background-color` is `rgb(153, 27, 27)` (opaque
  red-800). Fails if the fill regresses to the translucent low-contrast red.
  Pins Issue 3.
- **`MutedByDefault` (Accessibility/Muted By Default)** — new. A plain
  `<Badge content="5">`; play function asserts it is `getByRole('status')` yet
  carries `aria-live="off"` — a default badge is a status region but NOT an
  announcing live region. Pins Issue 4's verbosity fix.
- **`LabeledStatus`** — now also asserts `aria-live="off"` (a labeled static
  count is muted).
- **`LiveCountUpdate`** — JSDoc clarified that announcements are opt-in via the
  explicit `ariaLive="polite"` it already passes (its assertions are unchanged).

Second adversarial-review pass:

- **`ColorVariantsSacred` (Colors/Color Variants - Sacred Theme)** — the four
  translucent low-contrast fills replaced with opaque red-800/green-900/
  amber-900/blue-800 (all ≥5.9:1 against gold text); JSDoc now explains why
  sacred (gold-text) fills must be opaque + dark; NEW play function pins each
  computed `background-color` so a revert to the translucent ~1.7–3.44:1 demo
  re-fails. Pins Issue 5. **Re-review pass:** the play function now also pins
  each chip's computed `color` (`rgb(255, 215, 0)`), so both halves of the
  contrast pair are locked — a low-contrast text-color regression re-fails too,
  not just a fill change.

## Deferred

None. All five issues — including the three adversarial-review findings — were
fixable entirely inside the owned Badge directory (`index.tsx`,
`Badge.module.css`, `Badge.stories.tsx`). No shared util / Field / Shell /
`global.css` / barrel change was required. The sacred fill uses a local `#991b1b`
literal (matching the existing local `#d32f2f`/`#b91c1c` red literals in the same
file), so no `--goobs-*` token addition in `global.css` (which is out of scope)
was needed. Issue 5 was demo-only (the `ColorVariantsSacred` story's chosen
override colors) and required no component or CSS change.
