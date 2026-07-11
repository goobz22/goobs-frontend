import type { A11yLint, LintFile, Violation } from '../lint-a11y'

/**
 * decorative-content-not-hidden — screen-reader reading-order hygiene (WCAG 1.3.1).
 *
 * A purely-DECORATIVE element that renders visible TEXT/GLYPH content into the
 * accessibility tree without `aria-hidden="true"` pollutes the reading order for
 * assistive-tech users. The audit found this shape twice:
 *   - Breadcrumb `renderSeparator`: the "/" (or custom-icon) delimiter between
 *     crumbs announced "slash" / the icon name between every item.
 *   - CodeCopy line-number gutter: the "1 2 3 4 …" column was read inside the
 *     code's reading order, ahead of the real <code> content.
 * Both were fixed by adding `aria-hidden="true"` to the decorative element (the
 * readable content stays in a sibling that is NOT hidden).
 *
 * LOGICAL SHAPE (not the literal string from one file): a JSX element whose
 * CSS-module className names a purely-presentational affordance — an item
 * delimiter, a line-number gutter, an ornamental glyph/shimmer/adornment — that
 * (a) actually renders content (text, a glyph, or a child expression), yet
 * (b) is neither `aria-hidden` itself nor nested inside an `aria-hidden`
 * ancestor. Such an element leaks decorative noise into the AT reading order.
 *
 * WHY className-SCOPED matching (a precision requirement, not a convenience):
 * decorative intent in this library is encoded ONLY by the CSS-module class name
 * (`cssStyles.separator`, `cssStyles.lineNumbers`, `cssStyles.glyph`, …). A
 * `role="separator"` or `data-component="Divider"` on a MEANINGFUL element (the
 * Divider root carries a real, sometimes-labelled thematic break) must never be
 * mistaken for decoration — so the token scan reads the `className` value only,
 * never the whole tag.
 *
 * ESCAPE HATCHES (encoded in the check, never an ignore-list of files):
 *  - EMPTY decorative elements leak nothing, so an element with no content
 *    (self-closing `<div className={s.shimmer} />` or `{/* comment *\/}`-only)
 *    is never flagged. This is why the many empty shimmer/connector overlay divs
 *    are silent.
 *  - `aria-hidden` INHERITANCE: an element inside an `aria-hidden` ancestor is
 *    already hidden (SacredGlyphFrame hides the `.glyphRow`/`.corners` container,
 *    not each inner glyph) — such inner decorative content is not flagged.
 *  - OUTERMOST-only: when decorative content nests inside a decorative ancestor,
 *    only the outermost is reported (fixing it with `aria-hidden` hides the
 *    subtree), so one logical leak is one finding.
 *  - A conditional `aria-hidden={cond ? 'true' : undefined}` counts as hidden
 *    (only an explicit `aria-hidden="false"` / `{false}` does not) — leniency
 *    keeps false positives down; false positives get a lint deleted.
 */

/**
 * className tokens that denote a STANDALONE decorative element (its whole reason
 * to exist is visual chrome), matched as a camelCase segment inside the
 * className value. Deliberately excludes MODIFIER tokens that ride on meaningful
 * elements (e.g. `glow`, applied to the SacredGlyphFrame content root) and
 * ambiguous ones that can carry meaning (`divider` — a Divider may hold a real
 * "OR" label; `ellipsis`/`badge`/`count`).
 */
const DECORATIVE_TOKENS = [
  'separator', // item/crumb delimiters
  'lineNumbers', // code-gutter line-number column (container)
  'glyph', // ornamental sacred glyphs / glyph rows
  'adornment', // decorative field adornments
  'shimmer', // animated overlay chrome (usually empty)
  'connector', // stepper connector lines (usually empty)
  'ornament', // decorative frame ornaments
  'sparkle', // decorative sparkle chrome
  'decorative', // explicitly-decorative elements
]

/** True when `token` occurs in `classText` as a whole camelCase segment. */
function classNameHasToken(classText: string): boolean {
  const lower = classText.toLowerCase()
  for (const token of DECORATIVE_TOKENS) {
    const needle = token.toLowerCase()
    let from = 0
    for (;;) {
      const idx = lower.indexOf(needle, from)
      if (idx < 0) break
      from = idx + 1
      const before = classText[idx - 1]
      const matchedFirst = classText[idx]
      const after = classText[idx + needle.length]
      // Segment START: string start, a non-alphanumeric delimiter before, or an
      // uppercase first char (a camelCase boundary, e.g. `breadcrumbSeparator`).
      const startsSegment =
        idx === 0 ||
        before === undefined ||
        !/[A-Za-z0-9]/.test(before) ||
        /[A-Z]/.test(matchedFirst)
      // Segment END: the token is not continued by a lowercase letter (which
      // would make it part of a longer word, e.g. `separatorless`).
      const endsSegment = after === undefined || !/[a-z]/.test(after)
      if (startsSegment && endsSegment) return true
    }
  }
  return false
}

/**
 * Extract the raw `className` value expression from an opening tag's attribute
 * text. Returns the text inside `className={…}` / `className="…"` /
 * `className='…'` / `className={`…`}`, or '' if the tag has no className.
 */
function extractClassName(attrText: string): string {
  const key = /(^|[\s{])className\s*=\s*/g
  const keyMatch = key.exec(attrText)
  if (!keyMatch) return ''
  let i = key.lastIndex
  const open = attrText[i]
  if (open === '"' || open === "'") {
    const end = attrText.indexOf(open, i + 1)
    return end < 0 ? '' : attrText.slice(i + 1, end)
  }
  if (open === '{') {
    // Capture the balanced-brace expression, respecting strings/templates.
    let depth = 0
    let quote: string | null = null
    let out = ''
    for (; i < attrText.length; i++) {
      const c = attrText[i]
      if (quote) {
        out += c
        if (c === quote && attrText[i - 1] !== '\\') quote = null
        continue
      }
      if (c === '"' || c === "'" || c === '`') {
        quote = c
        out += c
        continue
      }
      if (c === '{') {
        depth++
        if (depth === 1) continue // skip the outermost opening brace
        out += c
        continue
      }
      if (c === '}') {
        depth--
        if (depth === 0) return out
        out += c
        continue
      }
      out += c
    }
    return out
  }
  return ''
}

/** True when the tag's attribute text sets aria-hidden to anything but false. */
function attrHidden(attrText: string): boolean {
  if (!/\baria-hidden\b/.test(attrText)) return false
  // Only an explicit false disables it.
  if (/\baria-hidden\s*=\s*(?:["']false["']|\{\s*false\s*\})/.test(attrText))
    return false
  return true
}

/**
 * Does content (text, glyph, or a child expression/element) follow the opening
 * tag's `>` at `contentStart`? Whitespace and `{/* … *\/}` JSX comments are
 * skipped; an immediate closing `</` means the element is empty.
 */
function hasVisibleContent(text: string, contentStart: number): boolean {
  let i = contentStart
  while (i < text.length) {
    const c = text[i]
    if (c === ' ' || c === '\t' || c === '\n' || c === '\r') {
      i++
      continue
    }
    if (c === '{') {
      if (text[i + 1] === '/' && text[i + 2] === '*') {
        const end = text.indexOf('*/}', i)
        if (end < 0) return true
        i = end + 3
        continue
      }
      return true // a real expression child
    }
    if (c === '<') {
      if (text[i + 1] === '/') return false // immediate close → empty
      return true // child element
    }
    return true // literal text / glyph
  }
  return false
}

/**
 * Advance from just after an opening tag's name to that tag's closing `>`,
 * tracking `{…}` depth and string/template quotes so `>` inside expressions or
 * strings (e.g. `=>`, `a > b`, `aria-label="a > b"`) does not end the tag.
 * Returns the index of the closing `>` and whether the tag self-closes.
 */
function readTagEnd(
  text: string,
  from: number
): { end: number; selfClosing: boolean } {
  let depth = 0
  let quote: string | null = null
  let lastNonSpace = ''
  for (let i = from; i < text.length; i++) {
    const c = text[i]
    if (quote) {
      if (c === quote && text[i - 1] !== '\\') quote = null
      continue
    }
    if (c === '"' || c === "'" || c === '`') {
      quote = c
      lastNonSpace = c
      continue
    }
    if (c === '{') {
      depth++
      lastNonSpace = c
      continue
    }
    if (c === '}') {
      depth--
      lastNonSpace = c
      continue
    }
    if (c === '>' && depth === 0) {
      return { end: i, selfClosing: lastNonSpace === '/' }
    }
    if (c !== ' ' && c !== '\t' && c !== '\n' && c !== '\r') lastNonSpace = c
  }
  return { end: text.length - 1, selfClosing: false }
}

interface StackFrame {
  name: string
  /** self or an ancestor is aria-hidden */
  hidden: boolean
  /** self or an ancestor is a decorative element */
  decorative: boolean
}

function checkFile(path: string, text: string): Violation[] {
  const violations: Violation[] = []
  const stack: StackFrame[] = []

  // Precompute line-start offsets for O(log n) line lookup.
  const lineStarts: number[] = [0]
  for (let i = 0; i < text.length; i++)
    if (text[i] === '\n') lineStarts.push(i + 1)
  const lineOf = (idx: number): number => {
    let lo = 0
    let hi = lineStarts.length - 1
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1
      if (lineStarts[mid] <= idx) lo = mid
      else hi = mid - 1
    }
    return lo + 1
  }

  const tagRe = /<(\/?)([A-Za-z][A-Za-z0-9.]*)/g
  let m: RegExpExecArray | null
  while ((m = tagRe.exec(text)) !== null) {
    const isClose = m[1] === '/'
    const name = m[2]
    const afterName = tagRe.lastIndex

    if (isClose) {
      // Close tag: consume to its `>` and pop to the nearest matching open.
      const gt = text.indexOf('>', afterName)
      tagRe.lastIndex = gt < 0 ? text.length : gt + 1
      for (let s = stack.length - 1; s >= 0; s--) {
        if (stack[s].name === name) {
          stack.length = s
          break
        }
      }
      continue
    }

    const { end, selfClosing } = readTagEnd(text, afterName)
    tagRe.lastIndex = end + 1
    const attrText = text.slice(afterName, end)

    const parent = stack[stack.length - 1]
    const parentHidden = parent?.hidden ?? false
    const parentDecorative = parent?.decorative ?? false

    const selfHidden = attrHidden(attrText)
    const isDecorative = classNameHasToken(extractClassName(attrText))
    const effectiveHidden = parentHidden || selfHidden

    // Evaluate a violation on THIS element (outermost decorative only).
    if (
      isDecorative &&
      !parentDecorative &&
      !selfClosing &&
      !effectiveHidden &&
      hasVisibleContent(text, end + 1)
    ) {
      violations.push({
        file: path,
        line: lineOf(m.index),
        message:
          'decorative element (className names a separator/line-number/glyph/ornament affordance) renders content into the AT reading order — add aria-hidden="true" to it (keep the readable content in a non-hidden sibling)',
      })
    }

    if (!selfClosing) {
      stack.push({
        name,
        hidden: effectiveHidden,
        decorative: parentDecorative || isDecorative,
      })
    }
  }

  return violations
}

const lint: A11yLint = {
  name: 'decorative-content-not-hidden',
  wcag: '1.3.1',
  description:
    'A purely-decorative element (className names a separator/line-number/glyph/ornament affordance) that renders visible content without aria-hidden="true" — nor inside an aria-hidden ancestor — pollutes the screen-reader reading order.',
  check(files: LintFile[]): Violation[] {
    const violations: Violation[] = []
    for (const { path, text } of files)
      violations.push(...checkFile(path, text))
    return violations
  },
  selftest: {
    bad: [
      // Separator delimiter with a visible glyph, not hidden.
      '<span className={s.separator}>{sep}</span>',
      // Line-number gutter rendering the "1 2 3 …" column, not hidden.
      '<div className={s.lineNumbers}>{nums.map((n) => (<div key={n}>{n}</div>))}</div>',
      // Ornamental glyph span with content, not hidden.
      '<span className={s.sacredGlyph}>{"\\u{13080}"}</span>',
    ],
    good: [
      // The separator, correctly hidden.
      '<span className={s.separator} aria-hidden="true">{sep}</span>',
      // The gutter hidden on its container; inner .lineNumber items inherit it.
      '<div className={s.lineNumbers} aria-hidden="true">{nums.map((n) => (<div key={n} className={s.lineNumber}>{n}</div>))}</div>',
      // Empty decorative overlay leaks nothing (self-closing).
      '<div className={s.shimmer} />',
      // Decorative element whose only content is a JSX comment.
      '<span className={s.separator}>{/* nothing readable */}</span>',
      // Decorative content inside an aria-hidden ancestor (inheritance).
      '<div aria-hidden="true"><span className={s.glyph}>{"\\u{13000}"}</span></div>',
      // A meaningful element — role/attr, not a decorative className token.
      '<div role="separator" data-component="Divider">{children}</div>',
      // Token as a substring of a longer lowercase word — not a segment match.
      '<div className={s.separatorlessLayout}>text</div>',
      // A plain content element with no decorative token.
      '<div className={s.label}>Name</div>',
    ],
  },
}

export default lint
