import type { A11yLint, LintFile, Violation } from '../lint-a11y'

/**
 * `console.log` / `console.debug` are debug scaffolding that ships to the
 * consumer's runtime console — noise in every app that installs the library.
 * They are banned in shipped component code.
 *
 * `console.error` / `console.warn` / `console.info` are DELIBERATELY allowed:
 * they are how a component surfaces a real error/warning path (an unexpected
 * state, a deprecation, a failed parse) to the consuming app's diagnostics.
 * Only the two pure-debug methods are flagged — that distinction is the
 * class boundary, encoded here rather than in an ignore-list.
 *
 * (`.stories.tsx` demos are already excluded by the runner.)
 */

const DEBUG_CALL = /\bconsole\s*\.\s*(log|debug)\s*\(/g

const lint: A11yLint = {
  name: 'no-debug-console',
  // Not a WCAG criterion per se — a shipped-code-hygiene wall; 4.1.x (robust)
  // is the closest umbrella for "don't ship debug noise to the AT/console".
  wcag: '4.1.x',
  description:
    'console.log / console.debug in shipped code ships debug noise to every consumer — remove it (console.error/console.warn/console.info for real error paths are allowed).',
  check(files: LintFile[]): Violation[] {
    const violations: Violation[] = []
    for (const { path, text } of files) {
      const lines = text.split('\n')
      let inBlockComment = false
      lines.forEach((line, i) => {
        // Track /* ... */ block comments so a commented-out log isn't flagged.
        let scan = line
        if (inBlockComment) {
          const end = scan.indexOf('*/')
          if (end === -1) return // whole line is inside a block comment
          scan = scan.slice(end + 2)
          inBlockComment = false
        }
        // Strip an inline `/* ... */` and note an unterminated opener.
        scan = scan.replace(/\/\*[\s\S]*?\*\//g, ' ')
        const openIdx = scan.indexOf('/*')
        if (openIdx !== -1) {
          inBlockComment = true
          scan = scan.slice(0, openIdx)
        }
        // Strip a line comment tail so `// console.log(x)` isn't flagged.
        const lineCommentIdx = scan.indexOf('//')
        if (lineCommentIdx !== -1) scan = scan.slice(0, lineCommentIdx)

        DEBUG_CALL.lastIndex = 0
        let m: RegExpExecArray | null
        while ((m = DEBUG_CALL.exec(scan)) !== null) {
          violations.push({
            file: path,
            line: i + 1,
            message: `console.${m[1]}(…) in shipped code — remove debug logging (console.error/console.warn are allowed for real error paths)`,
          })
        }
      })
    }
    return violations
  },
  selftest: {
    bad: [
      "export const f = () => { console.log('hi') }",
      'export const g = () => { console.debug(state) }',
      'export const h = () => {\n  console.log(\n    "multi",\n    arg\n  )\n}',
    ],
    good: [
      "export const a = () => { console.error('real failure', err) }",
      "export const b = () => { console.warn('deprecated path') }",
      "export const c = () => { console.info('one-time notice') }",
      "export const d = () => { /* console.log('disabled') */ return 1 }",
      "export const e = () => { return 1 } // console.log('x') left as a note",
      "const label = 'console.log is banned' // a string, not a call",
    ],
  },
}
export default lint
