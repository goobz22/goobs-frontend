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
 *     ConfirmationCodeInput, Metric/Accordion, Form/{DataGrid,ProjectBoard},
 *     ProjectBoard all do this — most note "was previously a hardcoded `<hN>`").
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
 * DETECTION — whole-text, lexer-masked (README: prefer scanning joined text over
 * line-by-line so a multi-line construct can neither hide nor fabricate a match).
 * A single left-to-right pass (`maskNonCode`) blanks the INTERIOR of every
 * comment, string/template literal, and regex literal to spaces (newlines and
 * byte length preserved, so offset→line is exact). After that pass, any remaining
 * `<h1>`–`<h6>` is a genuinely rendered JSX heading tag; the scan then also finds
 * `<p …>` openers carrying a `*Title`/`*Heading` className.
 *
 * WHAT IS NOT FLAGGED (escape hatches encoded in the check, never an ignore-list):
 *   - Any `<h1>`–`<h6>` mention inside a `/* … *​/` block comment / JSDoc or a
 *     `//` line comment, or wrapped in backticks (`` `<h1>` `` / `` `h${x}` ``) —
 *     documentation of the pattern, not a rendered tag (comment/template interiors
 *     are masked, INCLUDING when they span multiple lines).
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

/**
 * Blank the INTERIOR of every comment, string/template, and regex literal to
 * spaces, preserving newlines and total length so byte offsets → line numbers
 * are unchanged. After this pass, any remaining `<hN`/`<p` is real JSX. A single
 * left-to-right scan tracks the lexical context; a `/` is treated as a regex
 * start only when the previous significant token is one after which a regex (not
 * a division) can legally appear — enough to blank the markdown converter's
 * `/<h1>…/` without misreading `width / 2`.
 */
function maskNonCode(text: string): string {
  const out = text.split('')
  let i = 0
  let prevSig = '' // last non-space, non-comment char — decides regex vs divide
  const blank = (from: number, to: number) => {
    for (let k = from; k < to && k < text.length; k++)
      if (text[k] !== '\n') out[k] = ' '
  }
  const regexCanFollow = (c: string) =>
    c === '' || '(,=:[!&|?{};<>+-*%^~'.includes(c)

  while (i < text.length) {
    const c = text[i]
    // line comment
    if (c === '/' && text[i + 1] === '/') {
      let j = i + 2
      while (j < text.length && text[j] !== '\n') j++
      blank(i, j)
      i = j
      continue
    }
    // block comment (may span many lines — newlines are preserved by blank())
    if (c === '/' && text[i + 1] === '*') {
      let j = i + 2
      while (j < text.length && !(text[j] === '*' && text[j + 1] === '/')) j++
      j = Math.min(j + 2, text.length)
      blank(i, j)
      i = j
      continue
    }
    // string / template literal. Backtick is treated as an opaque string: its
    // whole interior (incl. any ${…} and any newlines) is blanked, which is safe
    // here because the library never embeds a literal heading inside a template
    // interpolation, and masking errs toward a false NEGATIVE (never a positive).
    if (c === '"' || c === "'" || c === '`') {
      let j = i + 1
      while (j < text.length) {
        if (text[j] === '\\') {
          j += 2
          continue
        }
        if (text[j] === c) break
        j++
      }
      blank(i + 1, j) // keep the quote chars, blank the interior
      i = j + 1
      prevSig = c
      continue
    }
    // regex literal (only where a regex can legally start; never spans a line)
    if (c === '/' && regexCanFollow(prevSig)) {
      let j = i + 1
      let inClass = false
      let ok = false
      while (j < text.length) {
        const d = text[j]
        if (d === '\\') {
          j += 2
          continue
        }
        if (d === '\n') break
        if (d === '[') inClass = true
        else if (d === ']') inClass = false
        else if (d === '/' && !inClass) {
          ok = true
          break
        }
        j++
      }
      if (ok) {
        blank(i + 1, j) // keep the slashes, blank the pattern interior
        i = j + 1
        prevSig = '/'
        continue
      }
      // not actually a regex — fall through and treat `/` as a normal char
    }
    if (!/\s/.test(c)) prevSig = c
    i++
  }
  return out.join('')
}

function newlineIndex(text: string): number[] {
  const out: number[] = []
  for (let i = 0; i < text.length; i++) if (text[i] === '\n') out.push(i)
  return out
}
function offsetToLine(nl: number[], offset: number): number {
  let lo = 0
  let hi = nl.length
  while (lo < hi) {
    const mid = (lo + hi) >> 1
    if (nl[mid] < offset) lo = mid + 1
    else hi = mid
  }
  return lo + 1
}

/** Real numbered-heading opening tag: `<h1`–`<h6` immediately followed by a tag
 * boundary (whitespace, `/`, or `>`) — so `<header>`/`<html>`/`<hgroup>` and a
 * `<h1x` typo never match, and a closing `</h1>` (which starts `</`) is excluded
 * because we anchor on `<h`. Global so we can enumerate every occurrence. */
const HEADING_TAG = /<h[1-6](?=[\s/>])/g

/** A `<p …>` opening tag (bounded to the tag by `[^>]`, so it spans multiple
 * lines correctly). We test the captured tag separately for a capitalised
 * `*Title`/`*Heading` className and the absence of `aria-hidden`. */
const P_OPEN_TAG = /<p(?=[\s/>])[^>]*>/g
const TITLE_CLASSNAME = /className[^>]*\b[A-Za-z]*(?:Title|Heading)\b/

const lint: A11yLint = {
  name: 'nonsemantic-heading',
  wcag: '1.3.1, 2.4.6',
  description:
    'A heading-role element rendered non-semantically: a hardcoded literal <h1>-<h6> (locks the consumer to a fixed outline level, risking skips) or a <p> styled as a *Title/*Heading (no heading in the a11y tree / crawled HTML). Derive the level from a headingLevel prop via `h${headingLevel}`. Literal <hN> inside comments, strings, or regex literals (e.g. an HTML→markdown converter) is masked out and not flagged.',
  check(files: LintFile[]): Violation[] {
    const violations: Violation[] = []
    for (const { path, text: raw } of files) {
      const text = maskNonCode(raw)
      const nl = newlineIndex(text)

      // Shape A — hardcoded literal heading tag.
      HEADING_TAG.lastIndex = 0
      let m: RegExpExecArray | null
      while ((m = HEADING_TAG.exec(text))) {
        const tag = raw.slice(m.index, m.index + 3) // e.g. "<h5"
        violations.push({
          file: path,
          line: offsetToLine(nl, m.index),
          message: `hardcoded literal heading ${tag}> — a fixed level skips levels in the consumer outline; derive it from a headingLevel prop via \`h\${headingLevel}\` (nonsemantic-heading)`,
        })
      }

      // Shape B — a component TITLE rendered as a <p> (flow content), not a heading.
      P_OPEN_TAG.lastIndex = 0
      while ((m = P_OPEN_TAG.exec(text))) {
        const tag = m[0]
        if (TITLE_CLASSNAME.test(tag) && !/aria-hidden/.test(tag)) {
          violations.push({
            file: path,
            line: offsetToLine(nl, m.index),
            message:
              'component title rendered as a <p> (flow content), not a heading — unreachable by heading navigation and absent from the crawled outline; render `h${headingLevel}` instead (nonsemantic-heading)',
          })
        }
      }
    }
    return violations
  },
  selftest: {
    bad: [
      // Shape A — hardcoded heading tag with a className.
      'export const A = () => <h3 className={s.title}>Manage Columns</h3>',
      // Shape A — hardcoded heading across a returned JSX block.
      'export const B = () => (\n  <h2 id={titleId}>Create New Task</h2>\n)',
      // Shape A — a MULTI-LINE opening tag (one attribute per line — the real
      // code layout). The `<h2` token must still be found on the joined text.
      'export const B2 = () => (\n  <h2\n    className={s.heading}\n    id={id}\n  >\n    {title}\n  </h2>\n)',
      // Shape A — self-closing hardcoded heading.
      'export const B3 = () => <h1 className={s.rule} />',
      // Shape B — a title-classed paragraph (the EmptyState archetype).
      'export const C = () => <p className={s.emptyStateTitle}>{title}</p>',
      // Shape B — a MULTI-LINE <p> title tag.
      'export const C2 = () => (\n  <p\n    className={s.cardTitle}\n    id={id}\n  >\n    {title}\n  </p>\n)',
    ],
    good: [
      // Derived tag from headingLevel — the sanctioned fix (no literal <hN>).
      'export const G1 = () => {\n  const HeadingTag = `h${headingLevel}` as ElementType\n  return <HeadingTag className={s.title}>{title}</HeadingTag>\n}',
      // createElement form of the same derivation.
      'export const G2 = () =>\n  React.createElement(`h${headingLevel}`, { className: s.title }, title)',
      // Typography upgraded to a real heading via the `component` prop.
      'export const G2b = () => <Typography component="h2" variant="titlemedium">{title}</Typography>',
      // JSDoc that documents the pattern (block comment — never a rendered tag).
      '/**\n * Renders a real `<h1>`–`<h6>` element (not a styled <p>) so SR users\n * can navigate to it. Was previously a hardcoded `<h5>`.\n */\nexport const G3 = () => <div className={s.title}>{title}</div>',
      // `//` line comment mentioning a bare heading tag.
      'export const G4 = () => {\n  // replacing the hardcoded <h5> that skipped levels\n  return <div>{title}</div>\n}',
      // <header>/<html>/<hgroup> — name starts with h but is not a numbered heading.
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
      // A heading tag inside a MULTI-LINE template literal — the case a line-by-
      // line scanner would false-positive on; whole-text masking blanks it.
      'export const G10 = () => {\n  const html = `\n    <h1>Docs</h1>\n    <p>body</p>\n  `\n  return <div dangerouslySetInnerHTML={{ __html: html }} />\n}',
      // A title-classed <p> that is decorative (aria-hidden) — out of the a11y tree.
      'export const G11 = () => <p className={s.cardTitle} aria-hidden="true">{deco}</p>',
    ],
  },
}

export default lint
