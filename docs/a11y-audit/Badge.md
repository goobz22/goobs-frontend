# Badge — a11y audit (2026-07-11)

**Status:** FIXED

**Component:** `src/components/Badge/index.tsx` (+ `Badge.module.css` unchanged,
`Badge.stories.tsx`)

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

## Hearing

No sound/media APIs are used — `grep` for `new Audio` / `AudioContext` /
`<audio>` / `<video>` / `navigator.vibrate` / `.play(` across the Badge
directory is empty. All state the badge conveys (a count, a status) is now both
visual (the rendered chip text/color) and programmatic (`role="status"` +
`aria-label` + `aria-live`), never audio-only. WCAG 1.2.x / 1.4.2 not
applicable. No hearing-related issue.

## Reading & screen reader

- **Accessible name:** `ariaLabel` gives a bare count meaning
  (`index.tsx:139-140`); when omitted, the visible text `content` is the region
  name. I deliberately did **not** auto-derive `aria-label` from `content`
  (unlike Chip's `resolveAriaLabel`): on a live region a static/duplicated
  `aria-label` would *suppress* the raw-count announcement, so leaving the text
  content as the fallback name is the correct live-region behavior. A decorative
  dot/icon `content` with no text is a documented caller responsibility to label
  (`BadgeProps.ariaLabel` JSDoc) or to opt out via `role="none"`.
- **Roles/states:** default `role="status"` + `aria-atomic="true"`, optional
  `aria-live` — all exposed. `role="none"`/`"presentation"` cleanly strips
  semantics (and its guard drops `aria-label`) for a purely decorative badge.
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
- **Contrast (1.4.3):** already addressed before this pass — the light/dark
  theme defaults were darkened to red-700 grades (`#d32f2f` 4.98:1, `#b91c1c`
  6.47:1 on white) with explanatory comments in `Badge.module.css:50-75`. Left
  unchanged.
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

No existing `data-*` / `role` / `aria` attribute was removed or renamed; every
change is additive. The public API gained three optional props only. Per-file
gates green: `bun lint:file` on both `.tsx` files (0 warnings). Module CSS
untouched (no visual/Chromatic delta — `role`/`aria` do not affect rendering).

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

## Deferred

None. Both issues were fixable inside the owned Badge directory with additive
props; no shared util / Field / Shell / `global.css` / barrel change was
required.
