import type { A11yLint, LintFile, Violation } from '../lint-a11y'

/**
 * dangerouslySetInnerHTML (dSIH) is a raw-HTML sink: whatever string reaches
 * `__html` is parsed as markup, so any interpolated value that is NOT
 * HTML-escaped or sanitized first is a stored/reflected XSS vector (a source
 * `<img src=x onerror=…>` executes instead of rendering as text).
 *
 * This lint enforces the ONE safe provenance shape verified during the
 * 2026-07-11 dSIH audit: every `__html` expression must flow through an
 * allow-listed local escaping / sanitizing pipeline whose definition-site file
 * ESTABLISHES the escaping — either as a direct call
 * (`__html: mdToHtml(x)` / `__html: sanitizeHtml(x)`), or as a bare local
 * variable whose in-file assignment roots in such a call
 * (`const html = post(mdToHtml(x)); … __html: html`). A raw interpolation
 * (`__html: value`), a member access (`__html: props.body`), a concatenation,
 * or a template literal (`` __html: `<p>${x}</p>` ``) is flagged.
 *
 * ESCAPE HATCH (encoded, not a file ignore-list): to legitimise a new sink,
 * route it through one of the allow-listed pipelines — or, when you add a new
 * escaping/sanitizing function whose file establishes the escaping, add its
 * name to `ALLOW_FNS` below. The provenance shape is the gate, so the code has
 * to actually flow through an escaping seam; you cannot silence a raw sink.
 */

// Local functions whose definition-site file establishes HTML escaping /
// sanitization (see src/components/ComplexTextEditor/utils/conversion.ts):
//   escapeHtml  — entity-escapes &<>"' (mdToHtml runs it over the whole source)
//   mdToHtml    — markdown → HTML, source-escaped + URL-scheme-restricted
//   sanitizeHtml— strips <script>/<style>/<iframe>/on*=/javascript: from raw HTML
const ALLOW_FNS = ['mdToHtml', 'sanitizeHtml', 'escapeHtml'] as const
const ALLOW_CALL_SRC = `(?:${ALLOW_FNS.join('|')})\\s*\\(`
const ALLOW_CALL = new RegExp(`\\b${ALLOW_CALL_SRC}`)
const BARE_IDENT = /^[A-Za-z_$][\w$]*$/

// dSIH object literal: `dangerouslySetInnerHTML={{ __html: <EXPR> }}`. The
// capture is lazy up to the object/attribute close `}<ws>}`, which tolerates a
// trailing comma and multi-line formatting; a `}` inside a `${…}` template
// substitution is not followed by a second `}` so it does not close early.
const DSIH = /dangerouslySetInnerHTML\s*=\s*\{\{\s*__html\s*:\s*([\s\S]*?)\}\s*\}/g

/**
 * Replace comment bodies with spaces (newlines preserved) so a comment that
 * mentions `dangerouslySetInnerHTML` or contains an apostrophe cannot desync
 * the scanner — a proven a11y-lint failure mode (README). Length and every
 * newline offset are preserved so match indices still map to source lines.
 * String / template-literal contents are left intact (we only care that a `//`
 * or `/* *\/` inside a string is not mistaken for a comment).
 */
function blankComments(text: string): string {
  const out = text.split('')
  const n = text.length
  let i = 0
  type Mode = 'code' | 'line' | 'block' | 'sq' | 'dq' | 'tpl'
  let mode: Mode = 'code'
  while (i < n) {
    const c = text[i]
    const c2 = i + 1 < n ? text[i + 1] : ''
    if (mode === 'code') {
      if (c === '/' && c2 === '/') {
        out[i] = ' '
        out[i + 1] = ' '
        mode = 'line'
        i += 2
        continue
      }
      if (c === '/' && c2 === '*') {
        out[i] = ' '
        out[i + 1] = ' '
        mode = 'block'
        i += 2
        continue
      }
      if (c === "'") mode = 'sq'
      else if (c === '"') mode = 'dq'
      else if (c === '`') mode = 'tpl'
      i += 1
      continue
    }
    if (mode === 'line') {
      if (c === '\n') mode = 'code'
      else out[i] = ' '
      i += 1
      continue
    }
    if (mode === 'block') {
      if (c === '*' && c2 === '/') {
        out[i] = ' '
        out[i + 1] = ' '
        mode = 'code'
        i += 2
        continue
      }
      if (c !== '\n') out[i] = ' '
      i += 1
      continue
    }
    // string / template modes: honor escapes, exit on the matching quote.
    const quote = mode === 'sq' ? "'" : mode === 'dq' ? '"' : '`'
    if (c === '\\') {
      i += 2
      continue
    }
    if (c === quote) mode = 'code'
    i += 1
  }
  return out.join('')
}

/**
 * True when a bare identifier's in-file assignment roots in an allow-listed
 * escaping call, e.g. `const html = makeAccessible(mdToHtml(src))`. The bounded
 * lookahead keeps the match inside the same assignment/statement (the real
 * intermediate — Markdown's `useMemo` — reaches `mdToHtml` within a few dozen
 * chars). `=(?![=>])` avoids matching `==`, `===`, and arrow `=>`.
 */
function hasSafeAssignment(ident: string, blanked: string): boolean {
  return new RegExp(
    `\\b${ident}\\b\\s*=(?![=>])[\\s\\S]{0,300}?${ALLOW_CALL_SRC}`
  ).test(blanked)
}

const lint: A11yLint = {
  name: 'dsih-unsanitized-source',
  // Not a WCAG a11y criterion — this is the security sibling of the reflow /
  // injected-HTML a11y lints; CWE-79 is the canonical XSS identifier.
  wcag: 'CWE-79',
  description:
    'A dangerouslySetInnerHTML __html value that does not flow through an allow-listed HTML-escaping/sanitizing pipeline (mdToHtml/sanitizeHtml/escapeHtml) is an XSS sink — it renders unescaped source as live markup.',
  check(files: LintFile[]): Violation[] {
    const violations: Violation[] = []
    for (const { path, text } of files) {
      const blanked = blankComments(text)
      DSIH.lastIndex = 0
      let match: RegExpExecArray | null
      while ((match = DSIH.exec(blanked)) !== null) {
        const raw = match[1] ?? ''
        const expr = raw.trim().replace(/,\s*$/, '').trim()
        const safe =
          // (a) a direct call to an allow-listed escaping/sanitizing pipeline.
          ALLOW_CALL.test(expr) ||
          // (b) a bare local variable whose assignment roots in such a call.
          (BARE_IDENT.test(expr) && hasSafeAssignment(expr, blanked))
        if (safe) continue
        const line = (text.slice(0, match.index).match(/\n/g) ?? []).length + 1
        violations.push({
          file: path,
          line,
          message: `dangerouslySetInnerHTML __html value \`${expr.slice(0, 60)}\` is not escaped/sanitized — route it through an allow-listed pipeline (mdToHtml/sanitizeHtml/escapeHtml) so injected HTML/script cannot execute (XSS)`,
        })
      }
    }
    return violations
  },
  selftest: {
    bad: [
      // Raw prop/variable straight into the sink.
      'export const A = ({ value }: { value: string }) => <div dangerouslySetInnerHTML={{ __html: value }} />',
      // String concatenation is not an escaping pipeline.
      "export const B = ({ html }: { html: string }) => <div dangerouslySetInnerHTML={{ __html: '<b>' + html + '</b>' }} />",
      // Template-literal interpolation (the `}` inside `${x}` must not fool the
      // extractor into closing early).
      'export const C = ({ x }: { x: string }) => <div dangerouslySetInnerHTML={{ __html: `<p>${x}</p>` }} />',
      // Member access with no escaping provenance.
      'export const D = (props: { body: string }) => <div dangerouslySetInnerHTML={{ __html: props.body }} />',
    ],
    good: [
      // Direct calls to allow-listed pipelines.
      'export const E = ({ value }: { value: string }) => <div dangerouslySetInnerHTML={{ __html: mdToHtml(value) }} />',
      'export const F = ({ value }: { value: string }) => <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(value) }} />',
      'export const G = ({ value }: { value: string }) => <div dangerouslySetInnerHTML={{ __html: escapeHtml(value) }} />',
      // Bare variable whose in-file assignment roots in an allow-listed call
      // (the Markdown intermediate-`html` shape), incl. multi-line dSIH.
      'export const H = ({ value }: { value: string }) => {\n  const html = wrapAccessible(mdToHtml(value))\n  return (\n    <div\n      dangerouslySetInnerHTML={{\n        __html: html,\n      }}\n    />\n  )\n}',
      // A comment mentioning dangerouslySetInnerHTML must not be counted.
      'export const I = () => (\n  // dangerouslySetInnerHTML={{ __html: evil }} is only a comment\n  <div>safe</div>\n)',
    ],
  },
}

export default lint
