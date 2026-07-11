import type { A11yLint, LintFile, Violation } from '../lint-a11y'

/**
 * The library's theme API is the `styles.theme` union (`'sacred' | 'light' |
 * 'dark'`), emitted as a `data-theme` attribute (see .claude/rules/goobs.md).
 * A handful of components predate that convention and still expose the legacy
 * boolean `sacredtheme` prop, which can only express sacred-vs-light and
 * carries no IntelliSense of the real theme choices.
 *
 * The legacy prop is PUBLIC API, so it is kept working (additive deprecation):
 * each surviving declaration is marked `@deprecated` in its JSDoc and mapped to
 * the modern theme resolution internally. This lint therefore flags only NEW
 * introducers — an undeprecated `sacredtheme` prop declaration, or a callsite
 * that hardcodes the legacy boolean in JSX. The encoded escape hatch is a
 * `@deprecated` tag on (or in the JSDoc immediately above) the declaration.
 *
 * NOT flagged (deliberately, encoded — not an ignore-list):
 *  - a declaration marked `@deprecated` (the sanctioned deprecation shape),
 *  - a JSX pass-through of the local deprecated prop (`sacredtheme={sacredtheme}`),
 *  - internal render-helper params with a default (`sacredtheme: boolean = false`
 *    in DataGrid/Table/Rows — a private function arg, not a public prop).
 */

/** Replace every comment with same-length whitespace so line numbers survive. */
function blankComments(text: string): string {
  return text
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '))
    .replace(/\/\/[^\n]*/g, (m) => m.replace(/[^\n]/g, ' '))
}

/** Optional interface/type member: `sacredtheme?: …`. */
const OPTIONAL_MEMBER = /\bsacredtheme\s*\?\s*:/
/** Required member `sacredtheme: boolean` that is NOT a defaulted fn param. */
const REQUIRED_MEMBER = /\bsacredtheme\s*:\s*boolean\b(?!\s*=)/

/**
 * Does the JSDoc on, or directly above, line `i` carry an `@deprecated` tag?
 * Walks up through the contiguous comment block immediately preceding the
 * declaration; stops at the first code/blank line so a far-away tag can't leak.
 */
function isDeprecated(lines: string[], i: number): boolean {
  if (/@deprecated/.test(lines[i])) return true
  for (let j = i - 1; j >= 0; j--) {
    const t = lines[j].trim()
    const isComment =
      t.startsWith('*') ||
      t.startsWith('//') ||
      t.startsWith('/*') ||
      t.endsWith('*/')
    if (!isComment) break
    if (/@deprecated/.test(lines[j])) return true
  }
  return false
}

const lint: A11yLint = {
  name: 'legacy-sacredtheme-prop',
  // House-API convergence wall rather than a WCAG criterion; 4.1.x (robust —
  // consistent, discoverable component API) is the closest umbrella.
  wcag: '4.1.x',
  description:
    "legacy boolean `sacredtheme` prop introduced without @deprecated (or a JSX callsite hardcoding it) — use the `styles.theme` union ('sacred' | 'light' | 'dark'); mark surviving declarations @deprecated.",
  check(files: LintFile[]): Violation[] {
    const violations: Violation[] = []
    for (const { path, text } of files) {
      const lines = text.split('\n')

      // (1) Prop DECLARATIONS — an interface/type member exposing the prop.
      lines.forEach((line, i) => {
        const trimmed = line.trim()
        const isCommentLine =
          trimmed.startsWith('*') ||
          trimmed.startsWith('//') ||
          trimmed.startsWith('/*')
        // Skip prose-only comment lines (unless they carry the decl inline).
        if (isCommentLine && !OPTIONAL_MEMBER.test(line) && !REQUIRED_MEMBER.test(line))
          return
        if (OPTIONAL_MEMBER.test(line) || REQUIRED_MEMBER.test(line)) {
          if (isDeprecated(lines, i)) return
          violations.push({
            file: path,
            line: i + 1,
            message:
              'legacy boolean `sacredtheme` prop declared without @deprecated — expose the `styles.theme` union instead; mark surviving declarations @deprecated and map to theme internally',
          })
        }
      })

      // (2) JSX CALLSITES that hardcode the legacy boolean. A pass-through of
      // the deprecated prop (`={sacredtheme}`) is allowed; only literal
      // `={true}`/`={false}`/`="…"` or a bare boolean attribute is flagged.
      const code = blankComments(text)
      const JSX_HARDCODE =
        /<[A-Z][\w.]*(?:\s+[^<>]*?)?\bsacredtheme\b\s*(?:=\s*\{\s*(?:true|false)\s*\}|=\s*"[^"]*"|(?=\s|\/|>))/g
      let m: RegExpExecArray | null
      while ((m = JSX_HARDCODE.exec(code)) !== null) {
        const lineNo = code.slice(0, m.index).split('\n').length
        violations.push({
          file: path,
          line: lineNo,
          message:
            'JSX callsite hardcodes the legacy `sacredtheme` boolean — pass the `styles.theme` union instead (a `sacredtheme={sacredtheme}` pass-through of a deprecated prop is exempt)',
        })
      }
    }
    return violations
  },
  selftest: {
    bad: [
      // undeprecated optional member
      'export interface FooProps {\n  sacredtheme?: boolean\n}',
      // undeprecated required member
      'export interface BarProps {\n  sacredtheme: boolean\n}',
      // JSX callsite hardcoding true
      'export const X = () => <Card sacredtheme={true} />',
      // JSX callsite hardcoding false
      'export const Y = () => <Card sacredtheme={false} />',
      // bare boolean attribute
      'export const Z = () => <Card sacredtheme />',
    ],
    good: [
      // sanctioned deprecation shape — JSDoc @deprecated above the member
      'export interface OkProps {\n  /** @deprecated Use `styles.theme` (the "sacred" | "light" | "dark" union). */\n  sacredtheme?: boolean\n}',
      // inline @deprecated on the same line as the member
      'type T = Base & { /** @deprecated use styles.theme */ sacredtheme?: boolean }',
      // internal mapping of the deprecated prop to the modern union
      "const theme: 'sacred' | 'light' = sacredtheme ? 'sacred' : 'light'",
      // private render-helper param with a default (not a public prop)
      'function renderCard(row: Row, sacredtheme: boolean = false) { return sacredtheme }',
      // JSX pass-through of the deprecated prop
      'export const P = () => <ContentSection grids={grids} sacredtheme={sacredtheme} />',
      // the modern API itself
      "export interface NewProps {\n  styles?: { theme?: 'sacred' | 'light' | 'dark' }\n}",
    ],
  },
}
export default lint
