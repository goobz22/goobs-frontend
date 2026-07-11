import type { A11yLint, LintFile, Violation } from '../lint-a11y'

/**
 * theme-literal-in-js — JS-side design-token leak.
 *
 * The `src/styles/global.css` `--goobs-*` custom properties are the single
 * source of truth for the library's palette (brand gold ladder, severity
 * bases + per-theme text grades, per-theme surface/text/border palettes, and
 * the black/white/blue alpha ladders). The stylelint token gate enforces this
 * in `.css`, but it never scans `.ts`/`.tsx`. So a hardcoded color literal in
 * component JS — `color: '#FFD700'`, `backgroundColor: 'rgba(0,0,0,0.12)'` —
 * silently re-introduces the drift the token layer was built to kill: the same
 * conceptual color duplicated in dozens of ad-hoc spellings, unable to retune
 * from one place, and invisible to a theme switch.
 *
 * This lint flags TWO provable-leak shapes:
 *
 *   1. A color literal whose value EXACTLY duplicates a known `--goobs-*` token.
 *      That is literally a token's value copied into JS, with a mechanical fix:
 *      replace the literal with `var(--goobs-…)` (directly in an inline
 *      `style={{}}`, inside a CSS-value string such as a gradient/shadow, or by
 *      moving the styling into the component's `.module.css`).
 *
 *   2. ANY raw brand-gold triplet (`255, 215, 0` at any alpha, or `#ffd700`).
 *      Gold is the library's signature accent — there is no legitimate reason
 *      to hardcode it in shipped JS at ANY alpha, so it is a leak even when its
 *      alpha does not land on the `--goobs-gold-a**` ladder (`rgba(255,215,0,
 *      0.03)`); the fix rounds to the nearest ladder rung. This mirrors the
 *      stylelint token gate, which already forbids the `255,215,0` triplet at
 *      every alpha in `.css` — this rule carries that same guarantee into JS.
 *
 * Non-gold colors that do NOT match any token (arbitrary grays, one-off MUI
 * leftovers, and — deliberately — the DataGrid/status data-driven SEVERITY
 * palette at off-ladder alphas that `.claude/rules/goobs.md` keeps on purpose)
 * are a separate, fuzzier concern and are intentionally NOT flagged here — zero
 * false positives is the whole value of a gate that stays in `lint:all`.
 *
 * Escape hatches (encoded in the check, never a file ignore-list):
 *   - comments (JSDoc `@param`/inline `//`) are stripped before scanning;
 *   - `rgb()/rgba()/hsl()` whose channel args are NOT numeric literals are
 *     color CONSTRUCTORS (`rgba(${r}, ${g}, ${b}, ${o})` in the `alpha()`
 *     util) — they build a color from data, they don't hardcode one;
 *   - canvas 2D-context colors (`fillStyle`/`strokeStyle`/`shadowColor`)
 *     cannot resolve a CSS `var()`, so a concrete color there is legitimate
 *     (this also covers the canvas gold defaults `ctx.fillStyle = '#FFD700'`);
 *   - a pure black/white DEFAULT PARAM value (`bgColor = '#FFFFFF'`) is a
 *     theme-independent canvas/QR/signature default the consumer overrides.
 */

// ---- normalize a color string to a canonical comparison key ------------------
function normalizeColor(raw: string): string | null {
  const s = raw.trim().toLowerCase()
  const hex = s.match(/^#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/)
  if (hex) {
    let h = hex[1]
    if (h.length === 3 || h.length === 4)
      h = h
        .split('')
        .map((c) => c + c)
        .join('')
    return '#' + h
  }
  const fn = s.match(/^(rgba?|hsla?)\(([^)]*)\)$/)
  if (fn) {
    const kind = fn[1].replace(/a$/, '')
    const parts = fn[2]
      .split(/[,/]/)
      .map((p) => p.trim())
      .filter(Boolean)
    // constructor (interpolated / identifier channels) — NOT a hardcoded color
    if (parts.length < 3 || !parts.every((p) => /^-?\d*\.?\d+%?$/.test(p)))
      return null
    const nums = parts.map((p) => (p.endsWith('%') ? p : String(parseFloat(p))))
    const [c1, c2, c3, a = '1'] = nums
    return `${kind}:${c1},${c2},${c3},${a}`
  }
  return null
}

// ---- the known --goobs-* token values (single source: src/styles/global.css)-
// Built by family so the ladders stay transcription-safe. Value → suggested
// token name. Some values back several tokens; the suggestion is one valid
// choice (a fixer may pick a semantic alias with the same value).
function buildTokenMap(): Map<string, string> {
  const map = new Map<string, string>()
  const put = (key: string | null, token: string) => {
    if (key && !map.has(key)) map.set(key, token)
  }

  // brand gold — hex + full alpha ladder (CSS spells these rgba(var(--gold-rgb),a))
  put('#ffd700', '--goobs-gold')
  const gold: [string, string][] = [
    ['0.02', 'a02'],
    ['0.05', 'a05'],
    ['0.08', 'a08'],
    ['0.1', 'a10'],
    ['0.12', 'a12'],
    ['0.15', 'a15'],
    ['0.2', 'a20'],
    ['0.25', 'a25'],
    ['0.3', 'a30'],
    ['0.4', 'a40'],
    ['0.5', 'a50'],
    ['0.6', 'a60'],
    ['0.7', 'a70'],
    ['0.8', 'a80'],
    ['0.9', 'a90'],
  ]
  for (const [a, rung] of gold) put(`rgb:255,215,0,${a}`, `--goobs-gold-${rung}`)
  put('rgb:255,215,0,1', '--goobs-amber-a100')

  // severity — bases + shared translucent fill/border + per-theme text grades
  put('#ef4444', '--goobs-danger')
  put('#f59e0b', '--goobs-warn')
  put('#3b82f6', '--goobs-info')
  put('#22c55e', '--goobs-success')
  put('rgb:239,68,68,0.12', '--goobs-danger-bg')
  put('rgb:239,68,68,0.35', '--goobs-danger-border')
  put('rgb:245,158,11,0.12', '--goobs-warn-bg')
  put('rgb:245,158,11,0.35', '--goobs-warn-border')
  put('rgb:59,130,246,0.12', '--goobs-info-bg')
  put('rgb:59,130,246,0.35', '--goobs-info-border')
  put('rgb:34,197,94,0.12', '--goobs-success-bg')
  put('rgb:34,197,94,0.35', '--goobs-success-border')
  put('#b91c1c', '--goobs-light-danger-text')
  put('#b45309', '--goobs-light-warn-text')
  put('#1d4ed8', '--goobs-light-primary-strong')
  put('#15803d', '--goobs-light-success-text')
  put('#f87171', '--goobs-dark-danger-text')
  put('#fbbf24', '--goobs-dark-warn-text')
  put('#60a5fa', '--goobs-dark-info-text')
  put('#4ade80', '--goobs-dark-success-text')

  // per-theme role palettes
  put('#ffffff', '--goobs-light-surface')
  put('#f8fafc', '--goobs-light-surface-raised')
  put('#e2e8f0', '--goobs-light-border')
  put('#cbd5e1', '--goobs-light-border-strong')
  put('#1f2937', '--goobs-light-text')
  put('#374151', '--goobs-light-text-secondary')
  put('#4b5563', '--goobs-light-text-muted')
  put('#646e7e', '--goobs-light-text-disabled')
  put('#2563eb', '--goobs-light-primary')
  put('#1e293b', '--goobs-dark-surface')
  put('#273746', '--goobs-dark-surface-raised')
  put('#334155', '--goobs-dark-border')
  put('#475569', '--goobs-dark-border-strong')
  put('#e2e8f0', '--goobs-light-border') // dark-text shares this value
  put('#94a3b8', '--goobs-dark-text-muted')
  put('#0b1220', '--goobs-dark-primary-contrast')
  put('rgb:10,10,10,0.9', '--goobs-sacred-surface')
  put('rgb:18,18,18,0.92', '--goobs-sacred-surface-raised')
  put('rgb:10,10,10,0.95', '--goobs-sacred-primary-contrast')
  put('rgb:255,255,255,0.6', '--goobs-sacred-text-secondary')

  // §4.1 alpha primitives — black / white / blue / blue-light / misc ladders
  const black: [string, string][] = [
    ['0.04', 'a04'],
    ['0.05', 'a05'],
    ['0.1', 'a10'],
    ['0.12', 'a12'],
    ['0.15', 'a15'],
    ['0.2', 'a20'],
    ['0.23', 'a23'],
    ['0.24', 'a24'],
    ['0.3', 'a30'],
    ['0.38', 'a38'],
    ['0.4', 'a40'],
    ['0.5', 'a50'],
    ['0.6', 'a60'],
    ['0.7', 'a70'],
    ['0.8', 'a80'],
    ['0.87', 'a87'],
    ['0.9', 'a90'],
    ['0.98', 'a98'],
  ]
  for (const [a, rung] of black) put(`rgb:0,0,0,${a}`, `--goobs-black-${rung}`)
  const white: [string, string][] = [
    ['0.1', 'a10'],
    ['0.15', 'a15'],
    ['0.2', 'a20'],
    ['0.3', 'a30'],
    ['0.5', 'a50'],
    ['0.9', 'a90'],
    ['0.95', 'a95'],
  ]
  for (const [a, rung] of white)
    put(`rgb:255,255,255,${a}`, `--goobs-white-${rung}`)
  const blue: [string, string][] = [
    ['0.05', 'a05'],
    ['0.08', 'a08'],
    ['0.1', 'a10'],
    ['0.12', 'a12'],
    ['0.15', 'a15'],
    ['0.2', 'a20'],
    ['0.25', 'a25'],
    ['0.3', 'a30'],
    ['0.4', 'a40'],
  ]
  for (const [a, rung] of blue) put(`rgb:59,130,246,${a}`, `--goobs-blue-${rung}`)
  const blueLight: [string, string][] = [
    ['0.1', 'a10'],
    ['0.15', 'a15'],
    ['0.2', 'a20'],
    ['0.3', 'a30'],
    ['0.4', 'a40'],
  ]
  for (const [a, rung] of blueLight)
    put(`rgb:96,165,250,${a}`, `--goobs-blue-light-${rung}`)
  put('rgb:75,85,99,0.3', '--goobs-gray-a30')
  put('rgb:156,163,175,0.3', '--goobs-gray-light-a30')
  put('rgb:74,222,128,0.4', '--goobs-green-a40')
  put('rgb:31,41,55,0.95', '--goobs-slate-a95')
  put('rgb:96,165,250,0.45', '--goobs-dark-focus-ring')

  return map
}

const TOKEN_BY_VALUE = buildTokenMap()

// pure black/white — theme-independent canvas / QR / signature default colors
const ACHROMATIC = new Set(['#ffffff', '#000000'])

// ---- strip comments (space-preserving so line numbers survive) ---------------
function stripComments(text: string): string {
  const noBlock = text.replace(/\/\*[\s\S]*?\*\//g, (m) =>
    m.replace(/[^\n]/g, ' ')
  )
  return noBlock
    .split('\n')
    .map((line) => line.replace(/(^|[^:/])\/\/.*$/, '$1'))
    .join('\n')
}

const COLOR_RE =
  /#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{4}|[0-9a-fA-F]{3})\b|\b(?:rgba?|hsla?)\([^)]*\)/g

const lint: A11yLint = {
  name: 'theme-literal-in-js',
  wcag: '1.4.3',
  description:
    'A hardcoded color literal in JS whose value duplicates a --goobs-* design token (src/styles/global.css). The stylelint token gate only scans .css, so JS-side literals silently re-introduce palette drift and break theming — use var(--goobs-…) instead.',
  check(files: LintFile[]): Violation[] {
    const violations: Violation[] = []
    for (const { path, text } of files) {
      const stripped = stripComments(text)
      const lines = stripped.split('\n')
      lines.forEach((line, i) => {
        // canvas 2D-context colors can't resolve a CSS var() — legitimate.
        if (/\b(?:fillStyle|strokeStyle|shadowColor)\b/.test(line)) return
        let m: RegExpExecArray | null
        COLOR_RE.lastIndex = 0
        while ((m = COLOR_RE.exec(line))) {
          const raw = m[0]
          const key = normalizeColor(raw)
          if (!key) continue
          const token = TOKEN_BY_VALUE.get(key)
          if (!token) {
            // Brand-gold leak: any raw 255,215,0 triplet in JS is a leak even
            // when its alpha is off the --goobs-gold-a** ladder (round to the
            // nearest rung). #ffd700 itself is an exact token, handled above.
            if (/^rgb:255,215,0,/.test(key)) {
              violations.push({
                file: path,
                line: i + 1,
                message: `hardcoded brand-gold color '${raw}' — use the nearest var(--goobs-gold-a**) token (JS-side brand-gold leak; the stylelint gate forbids the 255,215,0 triplet at any alpha, but only scans .css)`,
              })
            }
            continue
          }
          // pure b/w DEFAULT PARAM (`ident = '#ffffff'`) — canvas/QR/signature
          // theme-independent default the consumer overrides.
          if (ACHROMATIC.has(key)) {
            const before = line.slice(0, m.index)
            if (/=\s*['"`]$/.test(before)) continue
          }
          violations.push({
            file: path,
            line: i + 1,
            message: `hardcoded color '${raw}' duplicates design token var(${token}) — use var(${token}) (JS-side token leak; the stylelint gate only scans .css)`,
          })
        }
      })
    }
    return violations
  },
  selftest: {
    bad: [
      "const s = { color: '#FFD700' }",
      "const s = { backgroundColor: 'rgba(255, 215, 0, 0.3)' }",
      // brand-gold at an OFF-LADDER alpha (no --goobs-gold-a03 token) is still a leak
      "const bg = { background: 'radial-gradient(circle, rgba(255, 215, 0, 0.03) 0%, transparent 50%)' }",
      "const s = { color: '#ef4444' }",
      "const bg = { background: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)' }",
      "const x = { borderColor: 'rgba(0, 0, 0, 0.12)' }",
      "const p = { backgroundColor: '#FFFFFF' }",
      "const g = { boxShadow: '0 0 6px rgba(59, 130, 246, 0.2)' }",
    ],
    good: [
      "const s = { color: 'var(--goobs-gold)' }",
      "const s = { background: 'var(--goobs-gold-a02)' }",
      'const c = `rgba(${r}, ${g}, ${b}, ${opacity})`',
      "// documented default color '#FFD700' lives here\nconst n = 1",
      "/** Light-module color drawn on the canvas. Default '#000000'. */\nconst n = 2",
      "function QR({ bgColor = '#FFFFFF', fgColor = '#000000' }) { return bgColor + fgColor }",
      "ctx.fillStyle = glyphColor ?? '#FFD700'",
      // canvas escape-hatch also covers the extended brand-gold rule (off-ladder alpha)
      "ctx.shadowColor = 'rgba(255, 215, 0, 0.03)'",
      "const s = { color: '#9ca3af' }",
    ],
  },
}

export default lint
