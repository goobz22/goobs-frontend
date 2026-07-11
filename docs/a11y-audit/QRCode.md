# QRCode — a11y audit (2026-07-11)

**Status: FIXED**

## APG pattern

QRCode is not a single interactive APG widget — it is a **presentational image
panel** (a `<canvas>` QR bitmap in a themed frame) that composes existing goobs
widgets for its optional affordances:

- The QR bitmap → an **image** (WAI-ARIA `img` role with a text alternative,
  WCAG 1.1.1).
- The success pane arrival → a **status message** (APG *Alert and Message
  Dialogs* → live-region `status`, WCAG 4.1.3).
- The no-value fallback → an **alert** (`role="alert"`, already correct).
- The optional 6-digit input → delegated to `ConfirmationCodeInput` (its own
  APG compliance, already audited in that component).
- The Verify / Disable buttons → delegated to `Button` (native `<button>`,
  already accessible).

So the audit centres on the panel's own semantics: the image's name, the
heading semantics, the decorative graphics, and announcing the success
transition.

## Issues found

| # | Severity | WCAG | Location | Issue | Status |
|---|---|---|---|---|---|
| 1 | Serious | 4.1.3 Status Messages (AA) | `index.tsx` success branch (was ~L315-349) | Switching to the success pane replaced the whole panel with **no focus move and no live region**, so a screen-reader user got **no announcement** that verification succeeded. | **FIXED** |
| 2 | Serious | 1.3.1 Info & Relationships (A) / 2.4.6 Headings & Labels (AA) | `index.tsx` L317 (title) & L286-292 (success msg) | Both headings were **hard-coded `<h5>`**, so a consumer could not slot them into the page outline — dropping straight to h5 skips levels and breaks the heading hierarchy. | **FIXED** |
| 3 | Moderate | 1.1.1 Non-text Content (A) | `index.tsx` L284 | The decorative Egyptian glyph `𓊹` was **read aloud by screen readers** as a stray/unknown character (it carried no `aria-hidden`). | **FIXED** |
| 4 | Minor | 1.1.1 (A) / 4.1.2 Name, Role, Value (A) | `index.tsx` L327-332 canvas | The QR `<canvas>` had an `aria-label` but **no `role`**; some screen readers ignore an `aria-label` on a bare `<canvas>`, leaving the code's text alternative unexposed. | **FIXED** |
| 5 | Minor | 1.1.1 (A) | `index.tsx` L285 | Success check icon (`CheckCircle`) had no explicit `aria-hidden`. **Not a live defect** — goobs icons default to `aria-hidden` when unnamed (`iconA11y.ts`) — but made explicit for clarity/robustness. | **FIXED** |

No issues found for: **prefers-reduced-motion** (the module has zero
`transition`/`animation`/`@keyframes` — all glows are static `text-shadow`/
`box-shadow`/`drop-shadow`, so §B-motion does not apply and no spurious
reduced-motion block was added); **color-only state** (the verify button's
disabled state rides the programmatic `disabled` attribute, not colour);
**focus-visible** (QRCode renders no directly focusable elements of its own —
focus styling belongs to the composed `Button` / `ConfirmationCodeInput`);
**hearing-impaired / media** (grep found no `Audio`/`AudioContext`/`<audio>`/
`<video>`/`navigator.vibrate` — nothing conveyed by sound).

## Hearing

No sound, media, or vibration APIs are used (verified by grep of the component
directory). The success/error states are conveyed visually **and**
programmatically (live region / `role="alert"`), never by audio. No captions or
transcripts are applicable. **Nothing to fix.**

## Reading & screen reader

- **Success announcement (WCAG 4.1.3).** Restructured the three early-return
  branches into a single return that keeps a **persistent, always-mounted**
  `role="status"` `aria-live="polite"` region (`.srOnly`) mounted across every
  state. The success message is written into it as a **content mutation** via
  the adjust-state-during-render pattern (`inSuccessView` → `successAnnouncement`),
  which is the reliable announcement mechanism — a live region created together
  with its content is frequently missed by NVDA/JAWS. This mirrors the sibling
  `ConfirmationCodeInput` / `SaveButton` implementations exactly.
- **Heading semantics (WCAG 1.3.1 / 2.4.6).** Added an additive
  `headingLevel?: 1|2|3|4|5|6` prop (default `5`, preserving the historical
  `<h5>` DOM) matching the library-wide convention (Accordion, EmptyState,
  ConfirmationCodeInput). Both the `title` heading and the success message now
  render at the caller-controlled level via `` `h${headingLevel}` ``. The
  `.title` / `.successMessage` CSS keys off `className` + `data-theme`, not the
  element tag, so visuals are byte-identical at the default.
- **Decorative glyph (WCAG 1.1.1).** The sacred `𓊹` now carries
  `aria-hidden="true"`.
- **Canvas text alternative (WCAG 1.1.1 / 4.1.2).** Added `role="img"` so the
  existing `aria-label` (`QR Code for {title}`) is authoritatively exposed as
  the image's accessible name.
- **Check icon.** Made the decorative success icon's `aria-hidden="true"`
  explicit (it was already hidden by the icon default).
- The no-value fallback keeps `role="alert"` (correct — announces on appearance).

## SEO semantics

goobs renders inside Next.js SSR, so this markup is the crawled HTML.

- The title is a **real heading element** whose level is now consumer-controlled
  — no styled-`<div>` heading (satisfies §C headings).
- The heading text and the canvas's `aria-label` text alternative are **static
  attributes present in the SSR'd HTML** (the bitmap itself is inherently
  client-drawn on a `<canvas>`, which no crawler can read regardless — the
  `role="img"` + `aria-label` is the standard text alternative for it).
- No landmark misuse — QRCode is a self-contained panel, not a `nav`/`header`/
  `aside`, and correctly does not claim one.
- Links/lists/tables are N/A for this component.

## Fixes applied

1. **Persistent `role="status"` success live region** — restructured the
   returns into one return + always-mounted `.srOnly` announcer; added the
   `successAnnouncement` / `prevInSuccessView` adjust-during-render state
   machine gated on `Boolean(qrValue) && showSuccessState`. (`index.tsx`)
2. **`headingLevel` prop** (additive, default 5) driving `HeadingTag` for both
   the title and success headings. (`index.tsx`)
3. **`aria-hidden="true"`** on the decorative sacred glyph. (`index.tsx`)
4. **`role="img"`** on the QR canvas. (`index.tsx`)
5. **Explicit `aria-hidden="true"` / `focusable="false"`** on the success check
   icon. (`index.tsx`)
6. **`.srOnly` visually-hidden class** added to the module (standard clip
   recipe matching `ConfirmationCodeInput`/`Button`). (`QRCode.module.css`)
7. Removed the **stale, orphaned, gitignored `QRCode.module.css.d.ts`** (the
   only such file among 93 `.module.css` — a May-30 build artifact that would
   shadow the ambient `declare module '*.css'` and fail typecheck on the new
   `.srOnly` key). All 92 other components rely on the ambient declaration; this
   aligns QRCode with them. (build artifact, not a tracked source file)

**Markup changes (per contract, noted here):**
- `title` and success-message elements changed from fixed `<h5>` to
  `` `h${headingLevel}` `` (default renders `<h5>` — identical DOM by default).
- Added `role="img"` to the canvas.
- Added `aria-hidden`/`focusable` on the glyph span and CheckCircle.
- Added a persistent `.srOnly` `role="status"` region as the first child of the
  component's root fragment.
- **Preserved** every machine-test selector: `data-component="QRCode"`,
  `data-theme`, `data-testid` (default still `'mfa-qrcode'`), and the delegated
  `role="alert"`. No existing prop/attribute was renamed, removed, or retyped.

**Note on the concurrently-added `data-testid` prop:** an external edit added a
`'data-testid'?: string` prop + destructure while this audit was in flight. It
was already wired to the canvas (`data-testid={dataTestId}`, default
`'mfa-qrcode'`); left intact and reconciled (it is a valid additive change that
preserves the machine-test selector default).

## Stories updated

`QRCode.stories.tsx` (goobs' only regression tests):
- Added `headingLevel` to `argTypes` (select 1–6).
- **`SemanticHeadingLevel`** — renders the title as `<h2>` to exercise the
  additive prop + the `role="img"`/`aria-label` canvas.
- **`SuccessAnnouncement`** — stateful; a button toggles `showSuccessState` so
  the QR→success swap exercises the persistent live-region announcement with no
  focus move.
- **`SacredSuccessAnnouncement`** — same toggle on the sacred theme, exercising
  the `aria-hidden` decorative glyph alongside the announcement.

## Deferred

None. Every issue was fixable at root cause inside the component directory.

### Cross-component observations (not QRCode defects — no change made)

- `ConfirmationCodeInput` requires an `isValid: boolean`; QRCode passes
  `isValid={false}` because it does not itself validate the code. Inside that
  component this drives a persistent `role="status"` "Code is invalid" text.
  That behaviour is owned by `ConfirmationCodeInput` (out of this directory) and
  is by design there; not altered.
