import type { A11yLint, LintFile, Violation } from '../lint-a11y'

/**
 * CLASS: a JSX `data-testid` whose value is a BARE string literal
 * (`data-testid="progress-bar"`), rather than an expression derived from a
 * prop / `useId` / a root testid (`data-testid={testId ?? '...'}`,
 * `data-testid={`${base}-fill`}`).
 *
 * Why it's a defect:
 *   - Not overridable — a consumer that renders the component twice on one page
 *     (two ProgressBars, two FilterSections) gets DUPLICATE `data-testid`s, so a
 *     `[data-testid="progress-bar"]` selector is ambiguous and non-deterministic.
 *   - The fixed literal is baked in with no additive prop to disambiguate.
 *
 * The compliant shape is an additive `data-testid` prop (repo precedent:
 * `Markdown`) whose DEFAULT reproduces today's literal, and any sibling ids
 * derived from it (`${base}-fill`, `${base}-toggle`, …) — an EXPRESSION, so this
 * lint never fires on the fix.
 *
 * Detection: a `data-testid=` attribute immediately followed by a quote
 * (`"` / `'`) = bare literal (BAD). `data-testid={…}` = expression (GOOD).
 *
 * Escape hatches encoded in the check (never an ignore-list of files):
 *   - `data-testid={…}`               → expression, allowed.
 *   - `page.locator('[data-testid="x"]')` / any `[data-testid="x"]` selector
 *                                       → preceded by `[`, not a JSX attribute.
 *   - `rest['data-testid']`           → no `=`, not an attribute assignment.
 *   - comment / JSDoc lines (`* …`, `// …`, `/* …`) that document the contract
 *                                       → skipped (not rendered markup).
 */

// A JSX attribute `data-testid` is always preceded by whitespace (or SOL) and,
// when non-overridable, immediately assigned a quoted string literal. Requiring
// a whitespace/SOL boundary excludes selector strings (`[data-testid="…"]`,
// preceded by `[`) and property access (`rest['data-testid']`, no `=`).
const BARE_LITERAL_TESTID = /(?:^|\s)data-testid\s*=\s*["']/

function isCommentLine(trimmed: string): boolean {
  return (
    trimmed.startsWith('*') ||
    trimmed.startsWith('//') ||
    trimmed.startsWith('/*')
  )
}

const lint: A11yLint = {
  name: 'static-non-overridable-data-testid',
  wcag: '4.1.2',
  description:
    'A JSX data-testid with a bare string literal (data-testid="x") is fixed and non-overridable — two instances of the component on one page collide on the same test id. Expose an additive data-testid prop (default = the current literal) and derive any sibling ids from it.',
  check(files: LintFile[]): Violation[] {
    const violations: Violation[] = []
    for (const { path, text } of files) {
      const lines = text.split('\n')
      lines.forEach((line, i) => {
        const trimmed = line.trim()
        if (isCommentLine(trimmed)) return
        if (BARE_LITERAL_TESTID.test(line)) {
          violations.push({
            file: path,
            line: i + 1,
            message:
              'data-testid is a bare string literal — expose an additive data-testid prop (default = this literal) and use data-testid={…} so it is overridable and unique per instance',
          })
        }
      })
    }
    return violations
  },
  selftest: {
    bad: [
      'export const X = () => <div data-testid="progress-bar" />',
      "export const Y = () => <button data-testid='app-bar' />",
      'const z = (\n  <div\n    data-testid="metrics-accordion-toggle"\n  />\n)',
      '<canvas data-testid = "mfa-qrcode" />',
    ],
    good: [
      // Overridable expression with a default — the target fix shape.
      'export const A = () => <div data-testid={testId ?? "progress-bar"} />',
      // Sibling id derived from a root/base testid.
      'export const B = () => <div data-testid={`${base}-fill`} />',
      // Template literal derived from a useId / prop.
      'export const C = () => <div data-testid={`tree-item-${itemId}`} />',
      // Bare prop passthrough.
      'export const D = () => <div data-testid={dataTestId} />',
      // Repo precedent (Markdown): prop with a literal default, via rest.
      "export const E = () => <div data-testid={rest['data-testid'] ?? 'goobs-markdown'} />",
      // Query-selector string — not JSX markup.
      'const sel = page.locator(\'[data-testid="progress-bar"]\')',
      'const q = wrapper.querySelector("[data-testid=\'app-bar\']")',
      // Documentation of the contract in comments.
      ' * Test selector: `data-testid="metrics-accordion-toggle"`.',
      '// data-testid="progress-bar" is the stable test hook',
    ],
  },
}

export default lint
