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
 * ── THE LOGICAL SHAPES THIS MODULE DETECTS (crisp, near-zero false positive) ──
 *
 * SHAPE 1 — glyph-only interactive element. A NATIVE `<button>` (always
 * interactive) or `<a href>` (interactive link) whose STATIC child content is a
 * NON-EMPTY run of ONLY glyph / symbol / punctuation characters — no ASCII
 * letters, no digits, no nested element, no `{expression}` — AND whose opening
 * tag supplies NO name mechanism (`aria-label`, `aria-labelledby`, `title`) and
 * NO prop spread (`{...x}` could carry a name at runtime). Such a control's
 * accessible name is provably empty. HTML character entities (`&times;`,
 * `&#x2715;`) count as glyphs, so an entity-only control is caught too.
 *
 * SHAPE 2 — named `<canvas>` with no role. A `<canvas>` whose opening tag DOES
 * carry a naming intent (`aria-label` / `aria-labelledby`) but supplies NO
 * `role` (and no prop spread that could inject one) leaves that name UNEXPOSED —
 * some screen readers ignore an accessible name on a bare `<canvas>` because it
 * has no name-bearing role. This is the QRCode audit shape (the QR `<canvas>`
 * had an `aria-label` but no `role`, so the code's text alternative was never
 * announced). The fix is `role="img"` (or the appropriate graphics role), which
 * makes the supplied name authoritative. A canvas with NO naming intent is
 * decorative (its home is the `decorative-content-not-hidden` class, which wants
 * `aria-hidden`), not this class — so it is NOT flagged here.
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
// SHAPE 2: `<canvas>` (self-closing or with fallback children). The lookahead
// stops `<canvas` matching a longer identifier; only the opening tag is read.
const CANVAS_OPEN_RE = /<canvas(?=[\s/>])/g

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
// SHAPE 2 predicates: an explicit `role` makes the supplied name authoritative;
// a naming intent (`aria-label`/`aria-labelledby`) is what a role must expose.
const hasRole = (body: string) => /\brole\s*=/.test(body)
const hasAriaNamingIntent = (body: string) =>
  /\baria-label\b/.test(body) || /\baria-labelledby\b/.test(body)

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
  wcag: '4.1.2, 1.1.1',
  description:
    'Two static shapes of the missing-accessible-name class. SHAPE 1: a native <button> or <a href> whose only child content is a bare icon/symbol glyph (e.g. ✕, ⧉, ‹, or an HTML entity) and that carries no aria-label / aria-labelledby / title (and no prop spread that could inject one) computes to an EMPTY accessible name — screen readers announce nothing meaningful. Add a text label or aria-label (and mark the glyph aria-hidden). SHAPE 2: a <canvas> that carries a naming intent (aria-label / aria-labelledby) but no role (and no prop spread) leaves that name UNEXPOSED — some screen readers ignore a name on a bare canvas; add role="img" so the name is authoritative (the QRCode audit shape). Escape hatches encoded in the check: any name mechanism or spread on a glyph tag, letters/digits in the content, a nested element or {expression} child (icon-component shape, delegated to a caller aria-label), empty content, an explicit role on the canvas, and a decorative canvas with no naming intent (its home is the decorative-content-not-hidden class). goobs <Button>/<IconButton> and role="dialog" surfaces (Popover/Drawer/Dialog) are intentionally not linted here (their name may come from text=/children/icon+aria-label/spread/a runtime prop); their name contract is enforced by a dev warn + stories.',
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

      // SHAPE 2: a `<canvas>` with a naming intent but no role. Only the opening
      // tag matters (the name/role live there), so no content read is needed.
      CANVAS_OPEN_RE.lastIndex = 0
      let cm: RegExpExecArray | null
      while ((cm = CANVAS_OPEN_RE.exec(text))) {
        const opened = readOpeningTag(text, cm.index)
        if (!opened) continue
        const { body } = opened
        if (hasSpread(body)) continue // a spread may inject role at runtime
        if (hasRole(body)) continue // an explicit role exposes the name
        if (!hasAriaNamingIntent(body)) continue // decorative — different class
        violations.push({
          file: path,
          line: offsetToLine(nl, cm.index),
          message:
            'named <canvas> has no role — it carries an aria-label/aria-labelledby but no role, so some screen readers ignore the name and leave it unexposed; add role="img" (or the appropriate graphics role) so the accessible name is authoritative (missing-accessible-name)',
        })
      }
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
      // SHAPE 2: named canvas, no role (the shipped QRCode shape) — self-closing
      'export const Q = () => <canvas aria-label="QR Code for MFA Setup" />',
      // SHAPE 2: named-by-id canvas, no role, with fallback children
      `export const R = () => (
        <canvas ref={ref} aria-labelledby="cap">Your browser lacks canvas.</canvas>
      )`,
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
      // SHAPE 2 fixed: role="img" makes the aria-label authoritative (QRCode fix)
      'export const S = () => <canvas role="img" aria-label="QR Code" />',
      // SHAPE 2: decorative canvas, no naming intent — belongs to the
      // decorative-content-not-hidden class, not this one; not flagged
      'export const T = () => <canvas ref={r} className={styles.bg} aria-hidden="true" />',
      // SHAPE 2: a spread may inject role at runtime — not flagged
      'export const U = () => <canvas {...canvasAriaProps} aria-label="Signature pad" />',
      // SHAPE 2: bare decorative canvas (TreeView background) — no name intent
      'export const V = () => <canvas ref={r} className={styles.sacred} />',
    ],
  },
}

export default lint
