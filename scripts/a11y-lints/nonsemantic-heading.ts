import type { A11yLint, LintFile, Violation } from '../lint-a11y'

/**
 * nonsemantic-heading
 * -------------------
 * A UI element that FUNCTIONS as a document heading must be rendered as a real,
 * consumer-level-controllable `<h1>`–`<h6>` — one whose level is derived from a
 * `headingLevel` prop, never a HARDCODED level and never a styled non-heading
 * element (a `<p>` "title"). Two failure modes, one class:
 *
 *   Shape A — HARDCODED heading level. A literal `<h1>`–`<h6>` opening tag in
 *     shipped component source. A reusable library component cannot know where
 *     it sits in the *consumer's* outline, so a fixed level silently skips a
 *     level (e.g. an `<h5>` under the host page's `<h1>`), breaking screen-reader
 *     heading navigation and the crawled outline (WCAG 1.3.1 / 2.4.6). The whole
 *     library has converged on the fix: expose `headingLevel?: 1|2|3|4|5|6` and
 *     render the tag via ``const Tag = `h${headingLevel}` `` /
 *     ``React.createElement(`h${headingLevel}`, …)`` (Accordion, EmptyState,
 *     Card, Panel, PricingTable, QRCode, TransferList, BigCalendar,
 *     ConfirmationCodeInput, Metric/Accordion, Form/{DataGrid,ProjectBoard} all
 *     do this — most note "was previously a hardcoded `<hN>`").
 *
 *   Shape B — a component TITLE rendered as a `<p>` (flow content), not a
 *     heading. A `<p>` whose className marks it a `*Title`/`*Heading` is
 *     semantically a paragraph: screen-reader users cannot reach it by heading
 *     navigation and the SSR'd/crawled HTML contains no heading (the EmptyState
 *     archetype — `.emptyStateTitle` documented + CSS-styled as a heading but
 *     rendered `<p>`). Fix: render `` `h${headingLevel}` `` instead.
 *
 * The sanctioned derived form ``<Tag>``/```h${level}` `` contains no literal
 * `<h1>`–`<h6>` JSX tag, so it is never flagged.
 *
 * WHAT IS NOT FLAGGED (escape hatches encoded in the check, never an ignore-list):
 *   - Any `<h1>`–`<h6>` mention inside a `/* … *​/` block comment / JSDoc or a
 *     `//` line comment, or wrapped in backticks (`` `<h1>` `` / `` `h${x}` ``) —
 *     documentation of the pattern, not a rendered tag.
 *   - `<h1>`–`<h6>` inside a STRING or REGEX literal — a heading tag that is
 *     text DATA, not JSX: e.g. ComplexTextEditor's markdown↔HTML converter
 *     ``md.replace(/<h1>([^<]*)<\/h1>/g, '# $1')`` parses heading tags out of an
 *     HTML string; it never renders one.
 *   - `<header>` / `<html>` / any tag whose name merely starts with `h` (only a
 *     real numbered heading `<h1>`–`<h6>` is a heading level).
 *   - A `<p>` that is NOT title/heading-classed (`.description`, `.subtitle`,
 *     `.subheading` — supporting text is legitimately a paragraph; note the
 *     capitalised-`Title`/`Heading` match excludes lowercase `subtitle`).
 *   - A decorative `<p>` explicitly `aria-hidden` (removed from the a11y tree).
 */

/** Real numbered-heading opening tag: `<h1>`–`<h6>` not followed by an alnum
 * (so `<h3 `, `<h2>`, `<h4/>`, `<h5`↵ all match; `<header>`/`<html>` never do). */
const HEADING_TAG = /<h[1-6](?![0-9A-Za-z])/

/** A `<p>` opener that also, on the same line, references a capitalised
 * `*Title`/`*Heading` className token (excludes lowercase `subtitle`/`subheading`
 * and the plain `description`). */
const PARAGRAPH_TITLE =
  /<p\b[^>]*className[^>]*\b[A-Za-z]*(?:Title|Heading)\b/

/**
 * Return `line` with comment + backtick spans blanked out, tracking multi-line
 * `/* … *​/` block state via `state.inBlock`. A line that is entirely inside a
 * block comment returns '' so nothing in it can match.
 */
function stripNonCode(rawLine: string, state: { inBlock: boolean }): string {
  let line = rawLine
  if (state.inBlock) {
    const end = line.indexOf('*/')
    if (end === -1) return ''
    line = line.slice(end + 2)
    state.inBlock = false
  }
  // Remove complete inline block comments, then open an unterminated one.
  line = line.replace(/\/\*[\s\S]*?\*\//g, '')
  const open = line.indexOf('/*')
  if (open !== -1) {
    line = line.slice(0, open)
    state.inBlock = true
  }
  // Strip a `//` line comment (a truncated URL only risks a false negative).
  const lineComment = line.indexOf('//')
  if (lineComment !== -1) line = line.slice(0, lineComment)
  // Strip backtick spans: JSDoc `` `<h3>` `` inline-code and template literals
  // such as `` `h${headingLevel}` `` must never read as a rendered heading tag.
  line = line.replace(/`[^`]*`/g, '')
  // Strip quoted-string literals, then regex literals: a heading tag inside a
  // string ('<h2>hi</h2>') or a regex (/<h1>([^<]*)<\/h1>/g, the ComplexTextEditor
  // markdown converter) is text DATA the code operates on, not a rendered tag.
  // Strings first so a `/` inside a string can't be read as a regex delimiter;
  // a mis-stripped division span only risks a false negative, never a positive.
  line = line.replace(/'(?:[^'\\]|\\.)*'/g, '')
  line = line.replace(/"(?:[^"\\]|\\.)*"/g, '')
  line = line.replace(/\/(?![*/])(?:\\.|[^/\n\\])+\/[a-z]*/g, '')
  return line
}

const lint: A11yLint = {
  name: 'nonsemantic-heading',
  wcag: '1.3.1, 2.4.6',
  description:
    'A heading-role element rendered non-semantically: a hardcoded literal <h1>-<h6> (locks the consumer to a fixed outline level, risking skips) or a <p> styled as a *Title/*Heading (no heading in the a11y tree / crawled HTML). Derive the level from a headingLevel prop via `h${headingLevel}`.',
  check(files: LintFile[]): Violation[] {
    const violations: Violation[] = []
    for (const { path, text } of files) {
      const state = { inBlock: false }
      const lines = text.split('\n')
      lines.forEach((rawLine, i) => {
        const code = stripNonCode(rawLine, state)
        if (!code) return
        if (HEADING_TAG.test(code)) {
          violations.push({
            file: path,
            line: i + 1,
            message:
              'hardcoded literal <h1>-<h6> heading — a fixed level skips levels in the consumer outline; derive it from a headingLevel prop via `h${headingLevel}`',
          })
        } else if (PARAGRAPH_TITLE.test(code) && !/aria-hidden/.test(code)) {
          violations.push({
            file: path,
            line: i + 1,
            message:
              'component title rendered as a <p> (flow content), not a heading — unreachable by heading navigation and absent from the crawled outline; render `h${headingLevel}` instead',
          })
        }
      })
    }
    return violations
  },
  selftest: {
    bad: [
      // Shape A — hardcoded heading tag with a className.
      'export const A = () => <h3 className={s.title}>Manage Columns</h3>',
      // Shape A — hardcoded heading across a returned JSX block.
      'export const B = () => (\n  <h2 id={titleId}>Create New Task</h2>\n)',
      // Shape B — a title-classed paragraph (the EmptyState archetype).
      'export const C = () => <p className={s.emptyStateTitle}>{title}</p>',
    ],
    good: [
      // Derived tag from headingLevel — the sanctioned fix (no literal <hN>).
      'export const G1 = () => {\n  const HeadingTag = `h${headingLevel}` as ElementType\n  return <HeadingTag className={s.title}>{title}</HeadingTag>\n}',
      // createElement form of the same derivation.
      'export const G2 = () =>\n  React.createElement(`h${headingLevel}`, { className: s.title }, title)',
      // JSDoc that documents the pattern (block comment — never a rendered tag).
      '/**\n * Renders a real `<h1>`–`<h6>` element (not a styled <p>) so SR users\n * can navigate to it. Was previously a hardcoded `<h5>`.\n */\nexport const G3 = () => <div className={s.title}>{title}</div>',
      // `//` line comment mentioning a bare heading tag.
      'export const G4 = () => {\n  // replacing the hardcoded <h5> that skipped levels\n  return <div>{title}</div>\n}',
      // <header>/<html> — name starts with h but is not a numbered heading.
      'export const G5 = () => <header className={s.title}>{title}</header>',
      // A paragraph of supporting text — legitimately flow content.
      'export const G6 = () => <p className={s.description}>{description}</p>',
      // A subtitle paragraph — lowercase `subtitle` is not a heading.
      'export const G7 = () => <p className={s.cardSubtitle}>{subtitle}</p>',
      // Heading tags inside regex literals — HTML→markdown parsing, not JSX
      // (the ComplexTextEditor conversion utility archetype).
      "function htmlToMd(html: string) {\n  let md = html\n  md = md.replace(/<h1>([^<]*)<\\/h1>/g, '# $1')\n  md = md.replace(/<h2>([^<]*)<\\/h2>/g, '## $1')\n  return md\n}",
      // A heading tag inside a string literal — template text data, not JSX.
      "export const G9 = () => {\n  const tpl = '<h2>Section</h2>'\n  return <div dangerouslySetInnerHTML={{ __html: tpl }} />\n}",
    ],
  },
}

export default lint
