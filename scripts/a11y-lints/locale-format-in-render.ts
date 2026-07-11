import type { A11yLint, LintFile, Violation } from '../lint-a11y'

/**
 * locale-format-in-render
 * -----------------------
 * `date.toLocaleString()` / `.toLocaleDateString()` / `.toLocaleTimeString()`
 * with an AMBIENT locale (no locale argument, an empty `[]` locale, or an
 * explicit `undefined`) and no `timeZone` option — and a bare
 * `new Intl.DateTimeFormat()` — resolve the locale AND the time zone from the
 * runtime. The server (UTC / its own locale) and the browser (the viewer's
 * locale + zone) therefore produce DIFFERENT text for the same value, which
 * corrupts hydration and shows the wrong wall-clock time / number grouping.
 *
 * The rule is simply: format with an EXPLICIT locale (and, for dates, a
 * `timeZone`) so the output is deterministic across server and client — or,
 * when the viewer's own locale/zone is genuinely wanted, resolve it after mount
 * and pass it explicitly (a hydration-safe formatter). The escape hatches are
 * encoded in the check (never an ignore-list):
 *   - an explicit non-empty locale string / identifier as the first argument
 *     (e.g. 'en-US', or a `locale` variable resolved post-mount),
 *   - a `timeZone` key present in the options object,
 *   - `new Intl.DateTimeFormat` called with any argument.
 */

const LOCALE_METHODS = /\.(toLocaleString|toLocaleDateString|toLocaleTimeString)\s*\(/g
const BARE_INTL_DTF = /new\s+Intl\.DateTimeFormat\s*\(\s*\)/g

/** Index of the matching `)` for the `(` at openIdx, skipping quoted strings. */
function matchParen(text: string, openIdx: number): number {
  let depth = 0
  let quote = ''
  for (let i = openIdx; i < text.length; i++) {
    const c = text[i]
    if (quote) {
      if (c === '\\') {
        i++
        continue
      }
      if (c === quote) quote = ''
      continue
    }
    if (c === "'" || c === '"' || c === '`') {
      quote = c
      continue
    }
    if (c === '(') depth++
    else if (c === ')') {
      depth--
      if (depth === 0) return i
    }
  }
  return -1
}

/** First top-level argument text (up to the first depth-0 comma). */
function firstArg(args: string): string {
  let depth = 0
  let quote = ''
  for (let i = 0; i < args.length; i++) {
    const c = args[i]
    if (quote) {
      if (c === '\\') {
        i++
        continue
      }
      if (c === quote) quote = ''
      continue
    }
    if (c === "'" || c === '"' || c === '`') {
      quote = c
      continue
    }
    if (c === '(' || c === '[' || c === '{') depth++
    else if (c === ')' || c === ']' || c === '}') depth--
    else if (c === ',' && depth === 0) return args.slice(0, i)
  }
  return args
}

function lineOf(text: string, index: number): number {
  let line = 1
  for (let i = 0; i < index && i < text.length; i++) {
    if (text[i] === '\n') line++
  }
  return line
}

/** True when a `.toLocale*` argument list uses an ambient locale + no timeZone. */
function isAmbient(args: string): boolean {
  const first = firstArg(args).trim()
  const ambientLocale =
    first === '' || /^\[\s*\]$/.test(first) || first === 'undefined'
  if (!ambientLocale) return false
  const hasTimeZone = /\btimeZone\s*:/.test(args)
  return !hasTimeZone
}

const lint: A11yLint = {
  name: 'locale-format-in-render',
  wcag: '4.1.1',
  description:
    'Ambient-locale date/number formatting (.toLocaleString()/.toLocaleDateString()/.toLocaleTimeString() with no explicit locale and no timeZone, or a bare new Intl.DateTimeFormat()) resolves the locale/zone at runtime and mismatches between the SSR server and the browser — format with an explicit locale (+ timeZone for dates).',
  check(files: LintFile[]): Violation[] {
    const violations: Violation[] = []
    for (const { path, text } of files) {
      LOCALE_METHODS.lastIndex = 0
      let m: RegExpExecArray | null
      while ((m = LOCALE_METHODS.exec(text))) {
        const openIdx = m.index + m[0].length - 1
        const close = matchParen(text, openIdx)
        if (close < 0) continue
        const args = text.slice(openIdx + 1, close)
        if (isAmbient(args)) {
          violations.push({
            file: path,
            line: lineOf(text, m.index),
            message: `${m[1]}() with an ambient locale and no timeZone — server/client hydration mismatch; pass an explicit locale (+ timeZone for dates)`,
          })
        }
      }

      BARE_INTL_DTF.lastIndex = 0
      let d: RegExpExecArray | null
      while ((d = BARE_INTL_DTF.exec(text))) {
        violations.push({
          file: path,
          line: lineOf(text, d.index),
          message:
            'bare new Intl.DateTimeFormat() resolves the ambient locale + time zone — pass an explicit locale (and timeZone for deterministic output)',
        })
      }
    }
    return violations
  },
  selftest: {
    bad: [
      // No locale argument at all.
      'export const A = ({ d }: { d: Date }) => <span>{d.toLocaleString()}</span>',
      // Empty `[]` ambient locale with options but no timeZone.
      "export const B = ({ d }: { d: Date }) => <span>{d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>",
      // Number formatting with an ambient locale (non-deterministic grouping).
      'export const C = ({ n }: { n: number }) => <span>{n.toLocaleString()}</span>',
      // Bare Intl.DateTimeFormat().
      'export const D = ({ d }: { d: Date }) => <span>{new Intl.DateTimeFormat().format(d)}</span>',
      // Explicit `undefined` locale is still ambient.
      'export const E = ({ d }: { d: Date }) => <span>{d.toLocaleDateString(undefined)}</span>',
    ],
    good: [
      // Explicit locale string.
      "export const G1 = ({ d }: { d: Date }) => <span>{d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>",
      // Ambient locale but an explicit timeZone makes it deterministic.
      "export const G2 = ({ d }: { d: Date }) => <span>{d.toLocaleTimeString([], { timeZone: 'UTC', hour: '2-digit' })}</span>",
      // A resolved-locale identifier passed explicitly (hydration-safe formatter).
      'export const G3 = ({ d, locale, zone }: { d: Date; locale: string; zone?: string }) => <span>{d.toLocaleString(locale, { timeZone: zone })}</span>',
      // Intl.DateTimeFormat with an explicit locale.
      "export const G4 = ({ d }: { d: Date }) => <span>{new Intl.DateTimeFormat('en-US', { timeZone: 'UTC' }).format(d)}</span>",
      // A number with an explicit locale.
      "export const G5 = ({ n }: { n: number }) => <span>{n.toLocaleString('en-US')}</span>",
    ],
  },
}

export default lint
