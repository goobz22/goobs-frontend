# Global-usability assessment — is goobs-frontend set up for the entire world? (2026-07-12)

Researched against: WCAG 2.2 AA (W3C), the European Accessibility Act (enforced since
2025-06-28; EN 301 549 harmonized standard, presumption of conformity via Article 15),
and the industry bar for world-scale component libraries (Adobe React Aria/Spectrum:
30+ locale string translations, Intl-based date/number formatting, 13 calendar systems,
direction-aware interactions).

## Verdict: STRONG on the accessibility axis, NOT YET on the internationalization axis.

### What IS world-ready now (the 2026-07 campaign's work)
- **WCAG 2.2-grade accessibility**, gated permanently: 28 self-testing a11y class lints +
  12 drift ratchets in `lint:all` — accessible names, APG keyboard patterns, focus-visible,
  reduced motion, live regions, semantic/SEO markup, label association, error association,
  SSR/hydration safety. This is the EAA/EN 301 549 axis; EN 301 549 currently references
  WCAG 2.1 AA (2.2 incorporation pending), and the campaign targeted 2.2 — ahead of the
  harmonized baseline.
- **RTL at the CSS layer**: 204 physical directional declarations converted to logical
  properties; `lint:rtl` gates regressions. Logical properties render identically in LTR
  and flip automatically under `dir="rtl"`.
- **String override seams**: hardcoded aria-labels got override props; the
  `non-overridable-user-string` ratchet freezes the remaining 26 and blocks new ones.
- **Reduced payload risk**: bundle budgets gated (`lint:budget`).

### What "the entire world" still requires (the honest gap list)

**P0 — WCAG 2.2 AA criteria not yet audited/gated here:**
1. **Target Size (Minimum) 2.5.8 — 24×24 CSS px** for every pointer target (spacing
   exception allowed). Probe found real candidates: Chip `min-height: 22px`
   (interactive chips), Stepper step dots `20×20px`. → needs a census + fixes + a
   `target-size-minimum` gate.
2. **Dragging Movements 2.5.7** — every drag interaction needs a single-pointer,
   non-drag alternative. ListItemCard passes (Move up/down buttons); **ProjectBoard
   column/card drag has no keyboard/button alternative** (already flagged owner-gated —
   under 2.5.7 it is not optional for EAA-scope buyers).

**P1 — the internationalization layer (the React Aria bar):**
3. **No locale/translation mechanism.** Strings are per-prop overridable (good seam),
   but a consumer localizing the library must override dozens of props per tree. The
   bar is a locale provider + bundled translations for builtin strings (30+ locales at
   Adobe). Proposal: a `GoobsI18nProvider` supplying the ~60 builtin strings, defaults
   = today's English.
4. **Locale-aware formatting.** Date/Time fields are Gregorian/`en` shaped; the money
   field is `USD`-only by name and design ($ adornment, dollar formatting). World bar:
   `Intl.DateTimeFormat`/`NumberFormat` with a locale from context, currency as a prop
   (`CurrencyField` generalization), 12/24h from locale. (17 existing `Intl/toLocale`
   usages are mount-gated post-SSR-fix — the plumbing exists.)
5. **RTL interactions, not just CSS.** Direction awareness in JS: arrow-key flipping in
   composition widgets (Tabs/Slider/TransferList/Tree), icon mirroring (back/next
   chevrons), JS-anchored overlay positioning honoring `dir` — CSS logical properties
   don't cover any of these. Needs a `dir` context + `useDirection()`.
6. **`lang`/`dir` passthrough** — components should accept/forward both (1 `lang=`
   usage repo-wide today, in the demo layout).

**P2 — world-conditions hardening:**
7. Font-scaling: `css-px-font-size` ratchet frozen at 61 — shrink campaign (browser
   text-size settings scale rem, not px; vision-impaired users worldwide rely on it).
8. Low-bandwidth: es bundle ~2.6MB (budgeted, not reduced); heavy deps (jspdf,
   html2canvas) are code-split — verify consumers only pay on use.

### Legal context (why this matters commercially)
The EAA is **in enforcement since June 28, 2025** for e-commerce/banking/transport/etc.
services sold into the EU; EN 301 549 conformance grants presumption of compliance.
ThothOS selling to EU client companies inherits this through the UI library. The
accessibility axis above is the compliance surface; the i18n axis is the market-reach
surface (RTL alone ≈ 500M+ users: Arabic, Hebrew, Farsi, Urdu).

### Recommended execution order
1. Target-size census + fixes + gate (small, WCAG 2.2 AA, closes the last 2.2 gap).
2. ProjectBoard single-pointer/keyboard drag alternative (2.5.7).
3. `GoobsI18nProvider` + builtin-string extraction (unblocks translations).
4. Locale formatting in Date/Time/Money fields; `CurrencyField` generalization.
5. `dir` context + interaction flipping + icon mirroring; then extend `lint:rtl`
   from CSS to the JS layer.
