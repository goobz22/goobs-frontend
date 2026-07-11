import type { A11yLint, LintFile, Violation } from '../lint-a11y'

/**
 * ── missing-accessible-name (WCAG 4.1.2 Name/Role/Value; 1.1.1 Non-text) ──
 *
 * An INTERACTIVE control whose only content is a bare icon/symbol GLYPH and
 * that carries no accessible-name mechanism computes to an EMPTY name — a
 * screen reader announces just "button"/"link" (or worse, reads the raw glyph
 * as "multiplication x", "black up-pointing triangle", …). This is the class
 * the 2026-07 audit found shipped in component SOURCE — e.g. the Alert close
 * `<button>✕</button>` (U+2715) and the CodeCopy copy button whose only child
 * was `⧉`/`✓`. Both announced nothing meaningful.
 *
 * ── THE LOGICAL SHAPE THIS MODULE DETECTS (crisp, near-zero false positive) ──
 * A NATIVE `<button>` (always interactive) or `<a href>` (interactive link)
 * whose STATIC child content is a NON-EMPTY run of ONLY glyph / symbol /
 * punctuation characters — no ASCII letters, no digits, no nested element, no
 * `{expression}` — AND whose opening tag supplies NO name mechanism
 * (`aria-label`, `aria-labelledby`, `title`) and NO prop spread (`{...x}` could
 * carry a name at runtime). Such a control's accessible name is provably empty.
 * HTML character entities (`&times;`, `&#x2715;`) count as glyphs, so an
 * entity-only control is caught too.
 *
 * ── ESCAPE HATCHES (encoded in the CHECK, never an ignore-list) ──
 *  1. `aria-label` / `aria-labelledby` / `title` on the tag → has a name.
 *  2. a prop spread `{...x}` on the tag → may inject a name at runtime.
 *  3. content with ASCII letters/digits (`<button>Close</button>`,
 *     `<button>5</button>`) → visible text IS the name.
 *  4. content containing a nested element (`<button><Icon/></button>`) or a
 *     `{expression}` (`<button>{icon}</button>`) → the name may come from the
 *     child's own label or the dynamic value; statically unknowable, so NOT
 *     flagged (this is the icon-COMPONENT-only shape, which the library
 *     correctly delegates to a caller `aria-label` — see the IconButton audit's
 *     dev-only warn, a runtime nudge rather than a static requirement).
 *  5. empty / whitespace-only content → a degenerate placeholder, not the
 *     icon-glyph shape; not flagged.
 *
 * WHY goobs `<Button>` / `<IconButton>` are NOT linted here: their name can
 * legitimately come from a `text=` / `children` prop, an `icon` + caller
 * `aria-label`, or a spread — flagging them statically is high false positive.
 * Their icon-only-name contract is enforced at runtime (dev `console.warn`) and
 * by stories, not by this source lint. This module guards the RAW-ELEMENT glyph
 * shape that actually shipped nameless in component source.
 */

// Opening-tag matchers. `(?=[\s/>])` stops `<button` matching `<buttonish`,
// `<a` matching `<article`/`<aside`, and `<a>`/`<button>` (no attrs) still match
// because `>` is in the lookahead class.
const BUTTON_OPEN_RE = /<button(?=[\s/>])/g
const ANCHOR_OPEN_RE = /<a(?=[\s/>])/g

/**
 * Blank the CONTENT of `//` and `/* … *\/` comments (JSDoc included) to spaces,
 * preserving every newline so byte offsets / line numbers are unchanged. String-
 * and template-aware so a `//` inside an `https://` attribute value is not eaten.
 * This is what stops a JSDoc `@example` `<button>✕</button>` from being flagged.
 */
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
    if (c === '/' && text[i + 1] === '/') {
      let j = i
      while (j < text.length && text[j] !== '\n') {
        out[j] = ' '
        j++
      }
      i = j - 1
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
 * Read a JSX opening tag starting at `<` (offset `tagStart`); return the
 * inclusive index of the tag-closing `>` and the tag body. Brace- and string-
 * aware so a `>` inside `onClick={() => f()}` or a `` `${x}` `` literal is not
 * mistaken for the tag terminator. Returns null if unterminated.
 */
function readOpeningTag(
  text: string,
  tagStart: number
): { end: number; body: string } | null {
  let depth = 0
  let str: string | null = null
  for (let i = tagStart; i < text.length; i++) {
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
    if (c === '{') {
      depth++
      continue
    }
    if (c === '}') {
      if (depth > 0) depth--
      continue
    }
    if (c === '>' && depth === 0) return { end: i, body: text.slice(tagStart, i + 1) }
  }
  return null
}

/**
 * From the `>` of an opening `<tag>` (index `openEnd`), return the raw content
 * up to the matching `</tag>`, honouring nested same-name opens with a depth
 * counter (defensive — nesting a native button/anchor is invalid HTML, but this
 * keeps the scan correct if it occurs). Returns null if never closed.
 */
function readElementContent(
  text: string,
  tag: string,
  openEnd: number
): string | null {
  const openRe = new RegExp(`<${tag}(?=[\\s/>])`, 'g')
  const closeRe = new RegExp(`</${tag}\\s*>`, 'g')
  let depth = 0
  let i = openEnd + 1
  const contentStart = i
  while (i < text.length) {
    openRe.lastIndex = i
    closeRe.lastIndex = i
    const nextOpen = openRe.exec(text)
    const nextClose = closeRe.exec(text)
    if (!nextClose) return null
    if (nextOpen && nextOpen.index < nextClose.index) {
      depth++
      i = nextOpen.index + 1
      continue
    }
    if (depth === 0) return text.slice(contentStart, nextClose.index)
    depth--
    i = nextClose.index + 1
  }
  return null
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

const hasNameMechanism = (body: string) =>
  /\baria-label\b/.test(body) ||
  /\baria-labelledby\b/.test(body) ||
  /\btitle\s*=/.test(body)
const hasSpread = (body: string) => /\{\s*\.\.\./.test(body)
const hasHref = (body: string) => /\bhref\s*=/.test(body)
const isSelfClosing = (body: string) => /\/\s*>$/.test(body.trimEnd())

/**
 * Is `content` a bare-glyph-only child run — i.e. it announces no name?
 * True when, after collapsing HTML entities to a placeholder glyph, the content
 * has at least one non-whitespace character and contains NONE of: ASCII letter,
 * ASCII digit, `<` (nested element) or `{` (dynamic expression).
 */
function isGlyphOnly(content: string): boolean {
  // Collapse HTML entities (&times; &#x2715; &#10003;) to a single glyph so an
  // entity-only control still reads as glyph-only (and letters inside a named
  // entity aren't mistaken for real text).
  const collapsed = content.replace(/&#?[0-9a-zA-Z]+;/g, '•')
  if (!/\S/.test(collapsed)) return false // empty / whitespace only
  return !/[A-Za-z0-9<{]/.test(collapsed)
}

const lint: A11yLint = {
  name: 'missing-accessible-name',
  wcag: '4.1.2',
  description:
    'A native <button> or <a href> whose only child content is a bare icon/symbol glyph (e.g. ✕, ⧉, ‹, or an HTML entity) and that carries no aria-label / aria-labelledby / title (and no prop spread that could inject one) computes to an EMPTY accessible name — screen readers announce nothing meaningful. Add a text label or aria-label (and mark the glyph aria-hidden). Escape hatches encoded in the check: any name mechanism or spread on the tag, letters/digits in the content, a nested element or {expression} child (icon-component shape, delegated to a caller aria-label), and empty content. goobs <Button>/<IconButton> are intentionally not linted here (their name may come from text=/children/icon+aria-label/spread); their icon-only-name contract is enforced by a dev warn + stories.',
  check(files: LintFile[]): Violation[] {
    const violations: Violation[] = []
    for (const { path, text: raw } of files) {
      const text = blankComments(raw)
      const nl = newlineIndex(text)

      const scan = (
        re: RegExp,
        tag: string,
        requireHref: boolean,
        label: string
      ) => {
        re.lastIndex = 0
        let m: RegExpExecArray | null
        while ((m = re.exec(text))) {
          const opened = readOpeningTag(text, m.index)
          if (!opened) continue
          const { body, end } = opened
          if (isSelfClosing(body)) continue
          if (requireHref && !hasHref(body)) continue // <a> without href isn't a link
          if (hasNameMechanism(body) || hasSpread(body)) continue
          const content = readElementContent(text, tag, end)
          if (content == null) continue
          if (!isGlyphOnly(content)) continue
          violations.push({
            file: path,
            line: offsetToLine(nl, m.index),
            message: label,
          })
        }
      }

      scan(
        BUTTON_OPEN_RE,
        'button',
        false,
        'icon-only <button> has no accessible name — its only content is a bare glyph; add a text label or aria-label and mark the glyph aria-hidden (missing-accessible-name)'
      )
      scan(
        ANCHOR_OPEN_RE,
        'a',
        true,
        'icon-only <a href> has no accessible name — its only content is a bare glyph; add link text or aria-label and mark the glyph aria-hidden (missing-accessible-name)'
      )
    }
    return violations
  },
  selftest: {
    bad: [
      // bare close glyph, no name mechanism (the shipped Alert shape)
      'export const A = () => <button onClick={close}>✕</button>',
      // multi-line, glyph on its own line, className/handler present
      `export const B = () => (
        <button className={styles.close} onClick={onClose}>
          ✕
        </button>
      )`,
      // icon-only link
      'export const C = () => <a href="#top">↑</a>',
      // HTML entity glyph only
      'export const D = () => <button onClick={x}>&times;</button>',
      // chevron nav glyph
      'export const E = () => <button onClick={prev}>‹</button>',
    ],
    good: [
      // named via aria-label (the fix): glyph wrapped aria-hidden, name on button
      'export const F = () => <button aria-label="Close" onClick={close}><span aria-hidden="true">✕</span></button>',
      // spread may carry a name at runtime
      'export const G = () => <button {...rest} onClick={close}>✕</button>',
      // real text label
      'export const H = () => <button onClick={close}>Close</button>',
      // dynamic expression child — statically unknowable, not flagged
      'export const I = () => <button onClick={t}>{icon}</button>',
      // nested icon component — delegated to a caller aria-label, not flagged
      'export const J = () => <button onClick={edit}><EditIcon /></button>',
      // numeric label has a name (e.g. a page button)
      'export const K = () => <button onClick={go}>5</button>',
      // aria-labelledby name mechanism
      'export const L = () => <button aria-labelledby="lbl" onClick={close}>✕</button>',
      // title name mechanism
      'export const M = () => <button title="Close" onClick={close}>✕</button>',
      // text link
      'export const N = () => <a href="/home">Home</a>',
      // empty / whitespace-only content — degenerate placeholder, not the glyph shape
      'export const O = () => <button onClick={x}>   </button>',
      // <a> without href is not an interactive link — not flagged
      'export const P = () => <a>↑</a>',
    ],
  },
}

export default lint
