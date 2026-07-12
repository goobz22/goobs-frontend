import type { DriftFile, DriftInstance, DriftLint } from '../lint-drift'

/**
 * INVARIANT CLASS: token-pair-contrast — a design-token whose color, as rendered
 * on the surface global.css DOCUMENTS it against, drops below its WCAG floor.
 *
 * THE INCIDENT THAT PROVED THE CLASS (2026-07-11 focus-ring fix): three shared
 * focus-ring tokens (--goobs-{sacred,light,dark}-focus-ring) were translucent
 * accents (gold-a60 / 40%-#3b82f6 / 45%-#60a5fa). A translucent ring COMPOSITES
 * over the surface behind it, and once composited each one landed BELOW the 3:1
 * non-text-contrast floor (WCAG 1.4.11) — ~1.6:1 on white, ~2.0–2.3:1 on dark.
 * The fix made them opaque. The lesson generalizes: a SINGLE token EDIT (retune
 * an alpha, lighten a gray, swap a hue) can silently break contrast for every
 * component that reads the token — an invisible, everywhere-at-once regression
 * that the old Playwright contrast sweep (too heavy to run in lint:all) caught
 * only after the fact, if at all.
 *
 * WHY THIS IS A COMPUTED INVARIANT, NOT A FROZEN CENSUS: the other drift modules
 * ratchet a COUNT of a syntactic shape. This one has no shape to count — the
 * defect is a NUMBER (a contrast ratio) that must hold. measure() therefore
 * recomputes every documented (foreground-token, surface, floor) pair from the
 * LIVE token values in src/styles/global.css and returns a violation for any
 * pair under its floor. Today it returns ZERO, so the auto-created baseline is
 * empty ({}). Any future token edit that pushes a documented pair under its
 * floor makes measure() emit a violation keyed to global.css → count 1 > baseline
 * 0 → the ratchet FAILS immediately, at lint speed, before it ships.
 *
 * THE DECLARED PAIR MAP (DECLARED_PAIRS below) is the heart of the check. Each
 * entry is a pair global.css itself DOCUMENTS as proven, with the surfaces and
 * ratios quoted from the token's own comment — NOTHING speculative:
 *   - each --goobs-<theme>-focus-ring vs its theme control/page surface at 3:1
 *     (WCAG 1.4.11 Non-text Contrast) — the focus-ring incident's exact class;
 *   - each --goobs-<theme>-{danger,warn,info,success}-text severity grade, and
 *     the documented muted/disabled text grades, vs the exact surfaces their
 *     global.css comment proves them against, at 4.5:1 (WCAG 1.4.3 text).
 * The surfaces are encoded as LITERAL hex because most of them (#f3f3f3, #fef2f2,
 * #f1fbf7, #e4f8ec, #f3f4f6, #0f172a, #111827, #273746, #040404) are the REAL
 * rendered backgrounds the contrast pass measured (translucent cards over a
 * canvas), not tokens — so only the FOREGROUND is resolved from the token layer.
 *
 * ALPHA COMPOSITING (required — the whole point of the focus-ring incident): a
 * token value like rgba(255,255,255,0.5) is composited over its opaque surface
 * BEFORE the ratio is computed (comp = fg·a + surface·(1−a)); an opaque hex/rgb
 * token composites to itself. contrast() then uses the standard sRGB
 * relative-luminance formula (exponent 2.4, 0.03928 knee) — verified to
 * reproduce every ratio quoted in global.css (e.g. danger #b91c1c 5.83–6.47 on
 * #ffffff/#f3f3f3/#fef2f2; #94a3b8 4.76 on #273746; muted-white-0.5 5.30 on
 * #0e0e0e) to two decimals, so the invariant holds with margin and never
 * false-flags a real token.
 *
 * DELIBERATE UNDER-MEASURES (false positives are poison):
 *   - Only tokens with an EXPLICITLY documented surface+ratio in global.css are
 *     paired. Plain --goobs-<theme>-text / -text-secondary (no documented ratio)
 *     are OMITTED rather than paired against a guessed surface.
 *   - dark-danger-text is paired ONLY on #1e293b / #111827 — its comment proves
 *     it is 4.41 (a FAIL) on the raised #273746 surface and says "keep danger
 *     text on -surface, not -surface-raised", so #273746 is intentionally NOT a
 *     declared surface for danger (it is for warn/info/success, which pass there).
 *   - If a foreground token is undefined or unresolvable (a var chain we can't
 *     follow) the pair is SKIPPED, never flagged — an unmeasurable pair is not a
 *     violation.
 */

/** Blank CSS `/* … *​/` block comments (string-aware, newline-preserving) so a
 *  documented ratio/pair written in prose is never itself parsed as a token
 *  definition, and an apostrophe inside a comment can't desync the walker.
 *  CSS-adapted from scripts/a11y-lints/label-input-id-divergence.ts: CSS has NO
 *  `//` line comments (a `//` only appears inside url(https://…)), so that branch
 *  is dropped; only '/" open strings. Copied verbatim per the module contract. */
function blankComments(text: string): string {
  const out = text.split('')
  let str: string | null = null
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (str) {
      if (c === '\\') {
        i++
        continue
      }
      if (c === str) str = null
      continue
    }
    if (c === "'" || c === '"') {
      str = c
      continue
    }
    if (c === '/' && text[i + 1] === '*') {
      let j = i
      while (j < text.length && !(text[j] === '*' && text[j + 1] === '/')) {
        if (text[j] !== '\n') out[j] = ' '
        j++
      }
      if (j < text.length) {
        out[j] = ' '
        out[j + 1] = ' '
        j += 1
      }
      i = j
      continue
    }
  }
  return out.join('')
}

/* ===========================================================================
   EXPORTED MATH — pure WCAG contrast, alpha compositing, and CSS-color parsing.
   Exported so the ratio logic is independently unit-testable (the selftest below
   drives it through measure(), but these are the load-bearing primitives).
   =========================================================================== */

export interface RGBA {
  r: number
  g: number
  b: number
  a: number
}

/** sRGB channel → linear-light, per WCAG 2.x relative-luminance (exponent 2.4,
 *  0.03928 knee). Input is 0–255. */
function linearize(channel8: number): number {
  const c = channel8 / 255
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
}

/** WCAG relative luminance of an opaque color. */
export function relativeLuminance({ r, g, b }: RGBA): number {
  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b)
}

/** Alpha-composite a (possibly translucent) foreground over an OPAQUE surface —
 *  the step the focus-ring incident hinged on. `comp = fg·a + surface·(1−a)`. */
export function composite(fg: RGBA, surface: RGBA): RGBA {
  const a = fg.a
  return {
    r: fg.r * a + surface.r * (1 - a),
    g: fg.g * a + surface.g * (1 - a),
    b: fg.b * a + surface.b * (1 - a),
    a: 1,
  }
}

/** WCAG contrast ratio between two luminances (order-independent). */
export function contrastFromLuminance(l1: number, l2: number): number {
  const hi = Math.max(l1, l2)
  const lo = Math.min(l1, l2)
  return (hi + 0.05) / (lo + 0.05)
}

/** Contrast of a foreground token (alpha-composited over the surface) against
 *  that opaque surface. The single ratio the invariant floors. */
export function contrastOnSurface(fg: RGBA, surface: RGBA): number {
  const composited = composite(fg, surface)
  return contrastFromLuminance(
    relativeLuminance(composited),
    relativeLuminance(surface)
  )
}

/** Parse a fully var()-expanded CSS color literal (#rgb, #rrggbb, rgb(), rgba())
 *  into RGBA. Returns null for anything else (e.g. a color we can't resolve),
 *  so the caller SKIPS rather than false-flags. */
export function parseColor(value: string): RGBA | null {
  const v = value.trim()
  let m = /^#([0-9a-f]{6})$/i.exec(v)
  if (m) {
    const n = parseInt(m[1], 16)
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255, a: 1 }
  }
  m = /^#([0-9a-f]{3})$/i.exec(v)
  if (m) {
    const [r, g, b] = m[1].split('').map((h) => parseInt(h + h, 16))
    return { r, g, b, a: 1 }
  }
  m = /^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i.exec(v)
  if (m) return { r: +m[1], g: +m[2], b: +m[3], a: 1 }
  m = /^rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d.]+)\s*\)$/i.exec(v)
  if (m) return { r: +m[1], g: +m[2], b: +m[3], a: parseFloat(m[4]) }
  return null
}

/* ===========================================================================
   TOKEN RESOLUTION — read every `--name: value;` DEFINITION out of the CSS and
   follow var() chains to a concrete color (so var(--goobs-gold) → rgb(255,215,0)
   and rgba(var(--goobs-gold-rgb),0.4) resolve).
   =========================================================================== */

interface Def {
  value: string
  file: string
  line: number
}

/** A custom-property DEFINITION is `--name : value ;`. A USAGE `var(--name)` has
 *  a `)`/`,` after the name, never a `:`, so requiring the colon excludes usages
 *  automatically — no leading-delimiter anchor needed. Values may span newlines
 *  (the multi-line rgba() token defs) but never contain `;`/`{`/`}`. */
const DEF_RE = /(--[\w-]+)\s*:\s*([^;{}]+);/g

function collectDefs(files: DriftFile[]): Map<string, Def> {
  const defs = new Map<string, Def>()
  for (const { path, text: raw } of files) {
    const text = blankComments(raw)
    DEF_RE.lastIndex = 0
    let m: RegExpExecArray | null
    while ((m = DEF_RE.exec(text))) {
      const name = m[1]
      // First definition wins (global.css defines each once; a same-named local
      // token in a component file would not shadow the design token here).
      if (defs.has(name)) continue
      const line = text.slice(0, m.index).split('\n').length
      defs.set(name, { value: m[2].replace(/\s+/g, ' ').trim(), file: path, line })
    }
  }
  return defs
}

const VAR_RE = /var\(\s*(--[\w-]+)\s*(?:,[^()]*)?\)/g

/** Expand every var(--x) in a value to --x's (recursively expanded) value. */
function expand(value: string, defs: Map<string, Def>, seen: Set<string>): string {
  return value.replace(VAR_RE, (whole, ref: string) => {
    if (seen.has(ref)) return whole
    const d = defs.get(ref)
    if (!d) return whole
    return expand(d.value, defs, new Set(seen).add(ref))
  })
}

/** Resolve a token name to a concrete RGBA, or null if undefined/unparseable. */
function resolveColor(name: string, defs: Map<string, Def>): RGBA | null {
  const d = defs.get(name)
  if (!d) return null
  return parseColor(expand(d.value, defs, new Set([name])))
}

/* ===========================================================================
   THE DECLARED PAIR MAP — every pair global.css DOCUMENTS as proven. Surfaces
   and the (comment-quoted) ratios are copied from each token's own comment.
   =========================================================================== */

interface Pair {
  /** foreground token name (resolved from the live token layer). */
  fg: string
  /** opaque surfaces it is DOCUMENTED to render on (literal hex). */
  surfaces: string[]
  /** WCAG floor: 3 for focus rings (1.4.11), 4.5 for text (1.4.3). */
  floor: number
}

const DECLARED_PAIRS: Pair[] = [
  // ---- FOCUS RINGS — WCAG 1.4.11 non-text contrast, floor 3:1 -------------
  // The focus-ring incident's exact class. Each ring is now opaque; each must
  // clear 3:1 on its theme's control/page surface.
  // sacred: opaque gold on the sacred dark page (the #0e0e0e the severity
  //   proofs use). light: #2563eb, "the ring Button/Typography standardized",
  //   on white (control-bg = surface = #ffffff). dark: #60a5fa "proves 4.8:1+
  //   on the dark control surfaces" (#1e293b).
  { fg: '--goobs-sacred-focus-ring', surfaces: ['#0e0e0e'], floor: 3 },
  { fg: '--goobs-light-focus-ring', surfaces: ['#ffffff'], floor: 3 },
  { fg: '--goobs-dark-focus-ring', surfaces: ['#1e293b'], floor: 3 },

  // ---- SACRED severity text — floor 4.5:1 ---------------------------------
  // Comment: "All proven against #0e0e0e/#040404: danger 5.13–5.45, warn 8.99,
  //   info 5.25, success 8.47."
  { fg: '--goobs-sacred-danger-text', surfaces: ['#0e0e0e', '#040404'], floor: 4.5 },
  { fg: '--goobs-sacred-warn-text', surfaces: ['#0e0e0e', '#040404'], floor: 4.5 },
  { fg: '--goobs-sacred-info-text', surfaces: ['#0e0e0e', '#040404'], floor: 4.5 },
  { fg: '--goobs-sacred-success-text', surfaces: ['#0e0e0e', '#040404'], floor: 4.5 },

  // ---- LIGHT severity text — floor 4.5:1 ----------------------------------
  // Comment: "danger #b91c1c 5.83–6.47 on #ffffff/#f3f3f3/#fef2f2; warn #b45309
  //   4.60–5.02; info #1d4ed8 5.84–6.70; success #15803d 4.52–5.02 on
  //   #ffffff/#f1fbf7/#e4f8ec." (danger's surface set covers warn/info too;
  //   success has its own green-tinted surfaces.)
  { fg: '--goobs-light-danger-text', surfaces: ['#ffffff', '#f3f3f3', '#fef2f2'], floor: 4.5 },
  { fg: '--goobs-light-warn-text', surfaces: ['#ffffff', '#f3f3f3', '#fef2f2'], floor: 4.5 },
  { fg: '--goobs-light-info-text', surfaces: ['#ffffff', '#f3f3f3', '#fef2f2'], floor: 4.5 },
  { fg: '--goobs-light-success-text', surfaces: ['#ffffff', '#f1fbf7', '#e4f8ec'], floor: 4.5 },

  // ---- DARK severity text — floor 4.5:1 -----------------------------------
  // Comment: "danger #f87171 5.29/6.41/4.41*; warn #fbbf24 8.76+; info #60a5fa
  //   4.80+; success #4ade80 7.00+" on #1e293b/#111827/#273746, with
  //   "*danger on the raised #273746 surface is 4.41 — keep danger text on
  //   -surface, not -surface-raised." → danger is declared ONLY on #1e293b/
  //   #111827 (it FAILS on #273746 by design intent, so #273746 is not one of
  //   danger's proven surfaces); warn/info/success are proven on all three.
  { fg: '--goobs-dark-danger-text', surfaces: ['#1e293b', '#111827'], floor: 4.5 },
  { fg: '--goobs-dark-warn-text', surfaces: ['#1e293b', '#111827', '#273746'], floor: 4.5 },
  { fg: '--goobs-dark-info-text', surfaces: ['#1e293b', '#111827', '#273746'], floor: 4.5 },
  { fg: '--goobs-dark-success-text', surfaces: ['#1e293b', '#111827', '#273746'], floor: 4.5 },

  // ---- MUTED / DISABLED text grades — floor 4.5:1 -------------------------
  // These are the other tokens the 2026-07 contrast pass retuned WITH an
  // explicit proven ratio, so they are documented pairs, not speculation.
  // sacred muted rgba(255,255,255,0.5): "composites ≈ #868686 → 5.30:1 on
  //   #0e0e0e, 5.32:1 on #000" — the alpha-composite case.
  { fg: '--goobs-sacred-text-muted', surfaces: ['#0e0e0e', '#000000'], floor: 4.5 },
  // light muted #4b5563: "holds 6.17–7.56:1 across #ffffff/#f8fafc/#f3f3f3/#e2e9f0".
  { fg: '--goobs-light-text-muted', surfaces: ['#ffffff', '#f8fafc', '#f3f3f3', '#e2e9f0'], floor: 4.5 },
  // light disabled #646e7e: "5.16 on #ffffff, 4.65 on #f3f3f3, 4.68 on #f3f4f6"
  //   (proven real text, not an axe-exempt disabled control).
  { fg: '--goobs-light-text-disabled', surfaces: ['#ffffff', '#f3f3f3', '#f3f4f6'], floor: 4.5 },
  // dark muted #94a3b8: "holds 4.76–8.19:1 on every dark surface incl. raised
  //   #273746" — surfaces #1e293b/#0f172a/#111827/#0e0e0e/#273746.
  { fg: '--goobs-dark-text-muted', surfaces: ['#1e293b', '#0f172a', '#111827', '#0e0e0e', '#273746'], floor: 4.5 },
]

const lint: DriftLint = {
  name: 'token-pair-contrast',
  scope: 'css',
  description:
    'A design token (focus ring or severity/text grade) drops below its WCAG floor on the surface global.css documents it against — a token EDIT can silently break contrast everywhere (the 2026-07-11 focus-ring incident: 3 shared tokens composited below 3:1). This is a COMPUTED invariant, not a census: measure() alpha-composites each documented (token, surface) pair from the live global.css values and fails any focus ring under 3:1 (WCAG 1.4.11) or any text grade under 4.5:1 (WCAG 1.4.3). Baseline is empty (0 violations today); any regressing token edit fails at lint speed.',
  canon:
    'Every design token must clear its WCAG floor on the surfaces global.css documents it against — focus rings ≥3:1 (WCAG 1.4.11 Non-text Contrast), severity/muted/disabled text grades ≥4.5:1 (WCAG 1.4.3), computed with alpha compositing over the opaque surface.\n' +
    'Evidence: the 2026-07-11 focus-ring incident proved a single token edit (a translucent accent, an alpha retune, a lighter gray) can push a shared token below floor for every consumer at once — invisible until measured. The pairs+ratios are the ones global.css itself documents as proven (e.g. danger #b91c1c 5.83–6.47 on #ffffff/#f3f3f3/#fef2f2; focus rings made opaque because translucent ones composited ~1.6–2.3:1). Retune a token only if it still clears the floor for every declared pair; this ratchet recomputes them on every lint run.',
  measure(files: DriftFile[]): DriftInstance[] {
    const defs = collectDefs(files)
    const violations: DriftInstance[] = []
    for (const pair of DECLARED_PAIRS) {
      const fg = resolveColor(pair.fg, defs)
      if (!fg) continue // undefined / unresolvable → unmeasurable, not a violation
      const def = defs.get(pair.fg)!
      for (const surfaceHex of pair.surfaces) {
        const surface = parseColor(surfaceHex)
        if (!surface) continue
        const ratio = contrastOnSurface(fg, surface)
        if (ratio < pair.floor) {
          violations.push({
            file: def.file,
            line: def.line,
            token: `${pair.fg} on ${surfaceHex} = ${ratio.toFixed(2)}:1 < ${pair.floor}:1`,
          })
        }
      }
    }
    return violations
  },
  selftest: {
    // Each `bad` must yield >=1 violation; each `good` must yield 0. The runner
    // feeds these snippets to measure() as a single file, so each defines just
    // the foreground token(s) for the pair it exercises; the literal surfaces
    // come from DECLARED_PAIRS above. These drive the exported contrast math.
    bad: [
      // A light danger-text hex FAR too light for 4.5:1 on white/near-white —
      // fails all three declared light-danger surfaces.
      ':root { --goobs-light-danger-text: #ff6666; }',
      // A dark focus ring near-invisible on the dark control surface (well under
      // the 3:1 non-text floor) — the focus-ring incident's exact shape.
      ':root { --goobs-dark-focus-ring: #333333; }',
      // ALPHA COMPOSITING must be applied: a barely-there translucent white
      // muted grade composites to ~#32 on #0e0e0e and fails 4.5:1.
      ':root { --goobs-sacred-text-muted: rgba(255, 255, 255, 0.15); }',
    ],
    good: [
      // The real light danger grade — passes 4.5:1 on all three surfaces.
      ':root { --goobs-light-danger-text: #b91c1c; }',
      // The real dark focus ring — clears 3:1 on #1e293b.
      ':root { --goobs-dark-focus-ring: #60a5fa; }',
      // var() chain + opaque compositing: sacred focus ring resolves through
      // the gold chain to rgb(255,215,0) and clears 3:1 on the sacred page.
      ':root {\n  --goobs-gold-rgb: 255, 215, 0;\n  --goobs-gold: rgb(var(--goobs-gold-rgb));\n  --goobs-sacred-focus-ring: var(--goobs-gold);\n}',
      // The real sacred muted grade (translucent white) composites to ~#868686
      // and clears 4.5:1 — proves the good side of the compositing path.
      ':root { --goobs-sacred-text-muted: rgba(255, 255, 255, 0.5); }',
      // A token NOT in the pair map is never measured — no false positive.
      ':root { --goobs-gold-a40: rgba(255, 215, 0, 0.4); }',
      // The documented pair written in a COMMENT is prose, not a definition.
      '/* --goobs-light-danger-text: #ff0000 would fail; the real value is fine */\n:root { --goobs-light-danger-text: #b91c1c; }',
    ],
  },
}

export default lint
