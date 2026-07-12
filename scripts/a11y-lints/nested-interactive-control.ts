import type { A11yLint, LintFile, Violation } from '../lint-a11y'

/**
 * ── nested-interactive-control (WCAG 4.1.2 Name/Role/Value; axe `nested-interactive`) ──
 *
 * An INTERACTIVE control nested INSIDE another interactive control — a `<button>`
 * inside a `<button>`, an `<a href>` inside a `<button>`, an `<input>` inside a
 * `role="button"` wrapper, a `role="link"` inside a `<button>` — is a broken widget:
 * the inner control is unreachable (a `<button>` / `role="button"` must hold NO
 * focusable descendants per the ARIA button-role contract) and the outer control's
 * accessible name is polluted by the inner control's label (double-announced). This
 * is the shape the 2026-07 audit found in ListItemCard's ORIGINAL design — the whole
 * row was `role="button"` and the reorder / remove / action `<button>`s were nested
 * INSIDE it. It was fixed by the SIBLING RESTRUCTURE (the `<li>` keeps its implicit
 * `listitem` role; only the non-interactive naming content is wrapped in the select
 * `<button>`; the controls render as SIBLINGS of that button, never descendants) —
 * see `docs/a11y-audit/ListItemCard.md` Issue 2. This lint is that class's permanent
 * regression gate.
 *
 * ── THE SHAPE THIS MODULE DETECTS (depth-walking, near-zero false positive) ──
 *
 * An interactive OUTER opening tag whose content window (from its `>` to its
 * depth-matched close) CONTAINS another interactive opening tag as a DESCENDANT.
 *
 * Interactive element (used for both outer and inner) =
 *   • a native interactive intrinsic tag: `<button>`, `<a href>` (link — bare `<a>`
 *     without href is NOT interactive), `<input>`, `<select>`, `<textarea>`; OR
 *   • ANY tag carrying a static leaf-widget `role` of `button` / `link` / `checkbox`
 *     / `switch` (an explicit `role` GOVERNS — a native `<button role="…">` is judged
 *     by its role, not its tag).
 *
 * ── ESCAPE HATCHES (encoded in the CHECK, never a file ignore-list) ──
 *
 *  1. SIBLINGS ARE FINE — only TRUE nesting counts. The content window is read by
 *     DEPTH-MATCHING the outer's own close tag (same-name nesting is depth-counted,
 *     self-closing same-name opens don't inflate depth), so an interactive element
 *     that is a SIBLING of the outer (after its close) is never in the window. This
 *     is exactly the ListItemCard FIX shape (select button + remove button as
 *     siblings of a `<li>`), which must stay green.
 *
 *  2. aria-hidden DECORATIVE WRAPPERS. Every `aria-hidden="true"` (or `{true}`, or
 *     the bare boolean `aria-hidden`) SUBTREE is blanked out before scanning, so an
 *     interactive control that is decorative-hidden itself — OR wrapped in an
 *     aria-hidden decorative wrapper — is removed from the accessibility tree and is
 *     neither an outer nor an inner (no double-announce). An aria-hidden OUTER also
 *     disappears entirely (its whole subtree is hidden from AT).
 *
 *  3. COMPOSITE-PATTERN EXCEPTIONS (where ARIA sanctions specific children). An
 *     explicit `role` governs interactivity, and only the LEAF widget roles
 *     (button/link/checkbox/switch) are treated as interactive:
 *       • A COMPOSITE-CONTAINER role — `combobox` (the ARIA 1.1 input-in-combobox
 *         pattern), `grid` / `row`, `listbox`, `menu` / `menubar`, `tablist`, `tree`,
 *         `radiogroup`, `toolbar`, `group`, … — is NOT an interactive OUTER, because
 *         ARIA sanctions it to OWN interactive children. So a `role="toolbar"` full of
 *         `<button>`s, or a `role="combobox"` wrapping an `<input>`, is never flagged.
 *       • A COMPOSITE-CHILD role — `menuitem`, `option`, `tab`, `radio`, `treeitem`,
 *         … — is NOT an interactive INNER, because it is the managed leaf of its owning
 *         composite (keyboard-driven by roving tabindex / aria-activedescendant), not a
 *         standalone control double-announced inside its parent.
 *       • `role="presentation"` / `role="none"` strips interactive semantics → neither
 *         outer nor inner.
 *
 * ── DELIBERATE UNDER-MEASUREMENTS (false positives are poison — under-measure) ──
 *  • Uppercase COMPONENT tags (`<Button>`, `<IconButton>`, `<Link>`) are NOT treated
 *    as interactive — their rendered DOM is statically unknowable (same convention as
 *    the sibling `clickable-noninteractive-element` / `missing-accessible-name` lints).
 *    A component with an explicit widget `role` attribute IS judged by that role.
 *  • Bare `tabIndex` / focusable-but-unroled containers are NOT treated as inner
 *    interactive controls (a roving-tabindex managed child or a focusable scroll region
 *    is ambiguous) — only the named interactive set above counts.
 *  • Comments (JSDoc `@example` snippets, this prose) are blanked before scanning, so a
 *    nested control shown in a comment is never flagged.
 */

// Leaf interactive-widget roles — these are the ONLY roles that make an element an
// interactive control (outer or inner). A composite-container role (combobox/menu/
// listbox/grid/toolbar/radiogroup/…) is NOT here, so it is a sanctioned parent, not an
// interactive leaf (hatch 3). A composite-child role (menuitem/option/tab/radio/…) is
// NOT here, so it is a managed leaf, not a standalone control (hatch 3).
const WIDGET_ROLES = new Set(['button', 'link', 'checkbox', 'switch'])

const isIdentChar = (c: string | undefined) => c !== undefined && /[A-Za-z0-9_$]/.test(c)

/**
 * Blank the CONTENT of `//` and block comments to spaces, preserving every newline so
 * byte offsets / line numbers are unchanged. String- and template-aware so a `//`
 * inside an `https://` attribute value is not eaten; string literals are preserved so
 * role / href / attribute values stay readable. (Copied verbatim from the sibling
 * lints — apostrophes in comments desync a naive walker, so this string-aware pass is
 * mandatory before any JSX scan.)
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
 * Read a JSX opening tag starting at `<` (offset `tagStart`); return the inclusive
 * index of the tag-closing `>` (`end`) and the tag body. Brace- and string-aware so a
 * `>` inside `onClick={() => f()}` or a `` `${x}` `` literal is not mistaken for the
 * terminator. Returns null if unterminated.
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

const isSelfClosing = (body: string) => /\/\s*>$/.test(body.trimEnd())
const hasHref = (body: string) => /\bhref\s*=/.test(body)

const staticRole = (body: string): string | null => {
  const m = /\brole\s*=\s*['"]([a-zA-Z]+)['"]/.exec(body)
  return m ? m[1]!.toLowerCase() : null
}

/** aria-hidden that is provably TRUE: `="true"`, `={true}`, or the bare boolean
 *  attribute `aria-hidden` (JSX treats a bare boolean prop as `true`). A dynamic
 *  `aria-hidden={expr}` is NOT provably true, so it does not hide the subtree. */
const isAriaHiddenTrue = (body: string) =>
  /\baria-hidden\s*=\s*(?:["']true["']|\{\s*true\s*\})/.test(body) ||
  /\baria-hidden(?=[\s/>])(?!\s*=)/.test(body)

/** A native interactive intrinsic tag (role absent). `<a>` counts only WITH href. */
function isNativeInteractive(tag: string, body: string): boolean {
  if (tag === 'button' || tag === 'input' || tag === 'select' || tag === 'textarea')
    return true
  if (tag === 'a') return hasHref(body)
  return false
}

/** Is this element an interactive control? An explicit `role` GOVERNS — only the leaf
 *  widget roles count (composite container/child + presentation roles do not, hatch 3);
 *  with no explicit role, native semantics decide. */
function isInteractive(tag: string, body: string): boolean {
  const role = staticRole(body)
  if (role !== null) return WIDGET_ROLES.has(role)
  return isNativeInteractive(tag, body)
}

/** Human-readable label for a violation message. */
function label(tag: string, body: string): string {
  const role = staticRole(body)
  return role ? `<${tag} role="${role}">` : `<${tag}>`
}

/**
 * From an opening tag's `>` (index `openEnd`), find the matching close `</tag>` at
 * depth 0, honouring nested same-name opens (self-closing same-name opens do NOT
 * increment depth). Returns the close's start + end offsets, or null if never closed.
 */
function matchingClose(
  text: string,
  tag: string,
  openEnd: number
): { closeStart: number; closeEnd: number } | null {
  const openRe = new RegExp(`<${tag}(?=[\\s/>])`, 'g')
  const closeRe = new RegExp(`</${tag}\\s*>`, 'g')
  let depth = 0
  let i = openEnd + 1
  while (i < text.length) {
    openRe.lastIndex = i
    closeRe.lastIndex = i
    const nextOpen = openRe.exec(text)
    const nextClose = closeRe.exec(text)
    if (!nextClose) return null
    if (nextOpen && nextOpen.index < nextClose.index) {
      const ot = readOpeningTag(text, nextOpen.index)
      if (ot && isSelfClosing(ot.body)) {
        i = ot.end + 1 // self-closing same-name open — no depth change
        continue
      }
      depth++
      i = nextOpen.index + 1
      continue
    }
    if (depth === 0) return { closeStart: nextClose.index, closeEnd: closeRe.lastIndex }
    depth--
    i = nextClose.index + nextClose[0].length
  }
  return null
}

/**
 * Blank every `aria-hidden="true"` subtree (open `<` → matching close, inclusive) to
 * spaces, preserving newlines. A void / never-closed aria-hidden element blanks only
 * its opening tag. `blankedUntil` skips descendants already inside a blanked subtree.
 */
function hideAriaHiddenSubtrees(text: string): string {
  const out = text.split('')
  const tagRe = /<([a-zA-Z][\w.-]*)(?=[\s/>])/g
  let m: RegExpExecArray | null
  let blankedUntil = -1
  while ((m = tagRe.exec(text))) {
    const start = m.index
    if (start < blankedUntil) continue
    if (isIdentChar(text[start - 1])) continue // `a<b` comparison / TS generic, not a tag
    const ot = readOpeningTag(text, start)
    if (!ot) continue
    if (!isAriaHiddenTrue(ot.body)) continue
    let endExclusive: number
    if (isSelfClosing(ot.body)) {
      endExclusive = ot.end + 1
    } else {
      const close = matchingClose(text, m[1]!, ot.end)
      endExclusive = close ? close.closeEnd : ot.end + 1
    }
    for (let k = start; k < endExclusive; k++) if (text[k] !== '\n') out[k] = ' '
    blankedUntil = endExclusive
  }
  return out.join('')
}

/** First interactive descendant opening tag in `content`, or null. */
function findInteractiveInner(
  content: string
): { index: number; label: string } | null {
  const tagRe = /<([a-zA-Z][\w.-]*)(?=[\s/>])/g
  let m: RegExpExecArray | null
  while ((m = tagRe.exec(content))) {
    const start = m.index
    if (isIdentChar(content[start - 1])) continue
    const tag = m[1]!
    const ot = readOpeningTag(content, start)
    if (!ot) continue
    if (isInteractive(tag, ot.body)) return { index: start, label: label(tag, ot.body) }
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
    if (nl[mid]! < offset) lo = mid + 1
    else hi = mid
  }
  return lo + 1
}

const lint: A11yLint = {
  name: 'nested-interactive-control',
  wcag: '4.1.2',
  description:
    'An interactive control nested INSIDE another interactive control (button inside button, <a href> inside button, <input> inside a role="button" wrapper, role="link" inside a button) is a broken widget — an ARIA button/link must hold NO focusable descendants, so the inner control is unreachable and the outer name is double-announced (axe nested-interactive). Restructure so the controls are SIBLINGS, not descendants (the ListItemCard fix — docs/a11y-audit/ListItemCard.md Issue 2). An interactive element = native <button>/<a href>/<input>/<select>/<textarea>, or any tag with a leaf-widget role button/link/checkbox/switch (an explicit role governs). Escape hatches encoded in the check: siblings are fine (the content window is depth-matched, so only true descendants count); aria-hidden subtrees are blanked (a decorative-hidden control or wrapper is out of the AT tree); composite-pattern exceptions — a composite-container role (combobox/menu/listbox/grid/toolbar/radiogroup/…) is a sanctioned parent (not an outer), a composite-child role (menuitem/option/tab/radio/…) is a managed leaf (not an inner), and role=presentation/none strips semantics. Uppercase component tags and bare-tabIndex containers are deliberately not counted (statically unknowable — under-measured to avoid false positives).',
  check(files: LintFile[]): Violation[] {
    const violations: Violation[] = []
    for (const { path, text: raw } of files) {
      const text = hideAriaHiddenSubtrees(blankComments(raw))
      const nl = newlineIndex(text)
      const tagRe = /<([a-zA-Z][\w.-]*)(?=[\s/>])/g
      let m: RegExpExecArray | null
      while ((m = tagRe.exec(text))) {
        const start = m.index
        if (isIdentChar(text[start - 1])) continue
        const tag = m[1]!
        const ot = readOpeningTag(text, start)
        if (!ot) continue
        if (isSelfClosing(ot.body)) continue // no content — no descendants
        if (!isInteractive(tag, ot.body)) continue
        const close = matchingClose(text, tag, ot.end)
        if (!close) continue
        const contentStart = ot.end + 1
        const content = text.slice(contentStart, close.closeStart)
        const inner = findInteractiveInner(content)
        if (!inner) continue
        const innerLine = offsetToLine(nl, contentStart + inner.index)
        violations.push({
          file: path,
          line: offsetToLine(nl, start),
          message:
            `interactive ${label(tag, ot.body)} nests an interactive ${inner.label} ` +
            `(line ${innerLine}) — a control inside a control is unreachable (an ARIA ` +
            `button/link must hold no focusable descendants) and double-announced; ` +
            `render them as SIBLINGS, not descendants (see docs/a11y-audit/ListItemCard.md)`,
        })
      }
    }
    return violations
  },
  selftest: {
    bad: [
      // native <button> nested in a native <button> (invalid + double-announced)
      'export const A = () => <button onClick={f}><button>x</button></button>',
      // the ListItemCard ORIGINAL shape: a role="button" wrapper nesting a native button
      `export const B = () => (
        <div role="button" onClick={select}>
          <span>Draft proposal</span>
          <button aria-label="Remove">x</button>
        </div>
      )`,
      // link nested in a button
      'export const C = () => <button onClick={f}><a href="/x">details</a></button>',
      // button nested in a link
      'export const D = () => <a href="/x"><button>Go</button></a>',
      // native input nested in a button
      'export const E = () => <button><input type="text" /></button>',
      // role="link" descendant nested inside a native button (role-based inner)
      'export const F = () => <button><span role="link">open</span></button>',
      // deep nesting through a non-aria-hidden wrapper (still a true descendant)
      `export const G = () => (
        <div role="button">
          <div className={s.row}>
            <button aria-label="Delete">x</button>
          </div>
        </div>
      )`,
    ],
    good: [
      // SIBLINGS — the ListItemCard FIX: select button + remove button are siblings of
      // the <li>, not descendants of one another (the container <li> is not interactive)
      `export const H = () => (
        <li className={s.row}>
          <button aria-labelledby="t">Select</button>
          <button aria-label="Remove">x</button>
        </li>
      )`,
      // two interactive siblings under a plain (non-interactive) wrapper
      'export const I = () => (\n  <div>\n    <button>A</button>\n    <a href="/x">B</a>\n  </div>\n)',
      // aria-hidden decorative WRAPPER around the inner control — out of the AT tree
      'export const J = () => <button aria-label="x"><span aria-hidden="true"><button>y</button></span></button>',
      // aria-hidden on the OUTER control — whole subtree hidden from AT
      'export const K = () => <div role="button" aria-hidden="true"><button>x</button></div>',
      // COMPOSITE container: role="toolbar" is a sanctioned parent of its buttons
      'export const L = () => <div role="toolbar"><button>A</button><button>B</button></div>',
      // COMPOSITE container: ARIA 1.1 combobox legitimately wraps its <input>
      'export const M = () => <div role="combobox"><input type="text" /></div>',
      // COMPOSITE child: role="menuitem" managed leaf is not a standalone inner control
      'export const N = () => <button aria-haspopup="menu"><span role="menuitem">x</span></button>',
      // uppercase component child — statically unknowable, deliberately not counted
      'export const O = () => <button aria-label="Edit"><EditIcon /></button>',
      // a normal button with only text/glyph content — no nested control
      'export const P = () => <button onClick={f}>Save</button>',
      // <label> wrapping an <input> — label is not an interactive control (correct HTML)
      'export const Q = () => <label>Name<input type="text" /></label>',
      // role="presentation" strips the outer semantics — not an interactive control
      'export const R = () => <a href="/x" role="presentation"><button>x</button></a>',
      // bare <a> without href is not an interactive link — the button is not nested in a control
      'export const S = () => <a><button>x</button></a>',
      // a nested control shown inside a JSDoc example must not be flagged
      '/** bad: <button><button>x</button></button> */\nexport const T = () => <button>ok</button>',
    ],
  },
}

export default lint
