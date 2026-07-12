import type { DriftFile, DriftInstance, DriftLint } from '../lint-drift'

/**
 * DRIFT CLASS: css-px-font-size — the `font-size` property set to a raw px
 * literal (`font-size: 13px`) instead of the library's canonical scalable form.
 *
 * WHY IT IS DRIFT (census, .module.css + src/styles/*.css, 2026-07-11):
 *   rem  190  |  var(token: --goobs-* or component-local)  112  |  raw px  63  |
 *   clamp(rem)  40  |  em  5  |  keyword  4
 * rem is the single dominant form and beats raw px 3:1 (rem+token beats it
 * ~4.8:1) — raw px is the minority, so gating its GROWTH (not its existence) is
 * the honest ratchet. Two evidence strands pick the canon:
 *   1. `rem` scales with the reader's browser text-size setting; a hardcoded px
 *      font-size does NOT (WCAG 1.4.4 Resize Text). This is the accessibility
 *      principle behind the dominant form.
 *   2. The library exposes a central type scale in src/styles/global.css
 *      (`--goobs-text-xs … --goobs-text-3xl`, used in 68 declarations). Routing
 *      a size through a token single-sources the scale, so a future px→rem
 *      migration is ONE edit in global.css instead of chasing 63 scattered
 *      literals. (The tokens are px-valued TODAY — that migration is exactly why
 *      the indirection matters; a raw literal forecloses it.)
 * CANON for NEW code: `font-size: <n>rem` (preferred — scales) OR
 * `font-size: var(--goobs-text-*)` (the central token). A bare px literal is
 * neither and is what this ratchet freezes.
 *
 * WHAT IS AN INSTANCE: the CSS `font-size` PROPERTY whose value is a bare pixel
 * length — `font-size: 13px`, `font-size: 20px !important`. Comment-safe: a
 * `font-size: 13px` written inside a /* … *​/ comment is documentation, not code.
 *
 * DELIBERATELY EXCLUDED (documented under-measures — false positives are poison):
 *   - `var(--x, 16px)` — a custom-property USAGE with a px fallback. This IS a
 *     token usage (a canonical form); the px is only a default. 8 such today.
 *   - `--x-font-size: 10px` — a custom-PROPERTY DEFINITION (a local type token),
 *     not the `font-size` property. The `(?<![\w-])` lookbehind drops it (the
 *     char before "font-size" is a hyphen). 2 such today (Switch thumb).
 *   - `clamp(12px, 2vw, 16px)` — a px-anchored RESPONSIVE size. A rarer, distinct
 *     shape (only 2, SacredGlyphFrame); folding it in would require distinguishing
 *     clamp-px from the 40 clamp-REM sizes and risks noise. Left for a future
 *     ratchet. Any `clamp(…rem…)` is correctly NOT flagged.
 */

/** Blank `/* … *​/` comment content (string-aware, newline-preserving) so a
 *  `font-size: 13px` inside a comment is never itself a hit. Adapted from
 *  scripts/a11y-lints/label-input-id-divergence.ts for the CSS scope: CSS has NO
 *  `//` line comments (a `//` only appears inside `url(https://…)`), so that
 *  branch is intentionally dropped — blanking it would corrupt URL-bearing lines.
 *  String handling (' " `) is kept so a `content: "/* x *​/"` string cannot open a
 *  phantom comment and an apostrophe in a string cannot desync the walker. */
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
    if (c === "'" || c === '"' || c === '`') {
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

/**
 * The `font-size` PROPERTY assigned a bare pixel literal.
 *  - `(?<![\w-])` : "font-size" must not be preceded by a word char or hyphen,
 *    which excludes custom-property definitions like `--switch-thumb-font-size`.
 *  - `\s*:\s*`    : the property colon.
 *  - `-?\d*\.?\d+px\b` : the value must START with a pixel number, so `var(…)`,
 *    `clamp(…)`, `calc(…)`, `rem`/`em` values, and keywords never match.
 */
const BARE_PX = /(?<![\w-])font-size\s*:\s*(-?\d*\.?\d+px)\b/g

const lint: DriftLint = {
  name: 'css-px-font-size',
  scope: 'css',
  description:
    'A CSS `font-size` property is hardcoded to a raw px literal (e.g. font-size: 13px) instead of rem or a --goobs-text-* token. A px font-size ignores the reader browser text-size setting (WCAG 1.4.4) and dodges the central type scale.',
  canon:
    'font-size must be `rem` (scales with the browser text-size setting — WCAG 1.4.4 Resize Text) or a central `--goobs-text-*` token, never a raw px literal.\n' +
    'Evidence: rem (190) is the dominant form and beats raw px (63) 3:1 across .module.css/styles; the --goobs-text-* scale in src/styles/global.css single-sources sizing so a future px→rem migration is one edit. Custom-property px fallbacks (var(--x,16px)) and definitions (--x-font-size:10px) and clamp() responsive sizes are NOT this class.',
  measure(files: DriftFile[]): DriftInstance[] {
    const out: DriftInstance[] = []
    for (const { path, text: raw } of files) {
      const text = blankComments(raw)
      BARE_PX.lastIndex = 0
      let m: RegExpExecArray | null
      while ((m = BARE_PX.exec(text))) {
        const line = text.slice(0, m.index).split('\n').length
        out.push({ file: path, line, token: `font-size:${m[1]}` })
      }
    }
    return out
  },
  selftest: {
    bad: [
      '.title { font-size: 13px; }',
      '.big {\n  color: red;\n  font-size: 20px !important;\n}',
      '.tiny{font-size:9px}',
    ],
    good: [
      // rem — the preferred scalable form.
      '.title { font-size: 1.3rem; }',
      // the central type token.
      '.body { font-size: var(--goobs-text-md); }',
      // a custom-property USAGE with a px fallback — a token usage, not drift.
      '.usd { font-size: var(--usd-font-size, 16px); }',
      // a custom-property DEFINITION — a local token, not the font-size property.
      ':root { --switch-thumb-font-size: 10px; }',
      // clamp with rem anchors — scalable responsive size, not this class.
      '.card { font-size: clamp(0.7rem, 1.8vw, 0.85rem); }',
      // the broken shape inside a comment is documentation, not code.
      '/* legacy: font-size: 13px */\n.now { font-size: 0.8125rem; }',
      // a different property that happens to use px.
      '.spaced { letter-spacing: 2px; line-height: 24px; }',
    ],
  },
}

export default lint
