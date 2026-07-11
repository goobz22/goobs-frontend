import type { A11yLint, LintFile, Violation } from '../lint-a11y'

/**
 * CLASS: clickable-noninteractive-element (WCAG 2.1.1 Keyboard, 4.1.2 Name/Role/Value).
 *
 * A NON-interactive intrinsic element (`<div>`, `<span>`, `<li>`, `<tr>`, `<header>`,
 * …) that carries an `onClick` but is NOT keyboard-operable is a pointer-only
 * control: a keyboard or assistive-tech user can neither focus nor activate it.
 * Native interactive elements (`<button>`, `<a href>`, `<input>`, …) get focus +
 * Enter/Space activation for free; a "clickable div" gets none of it unless the
 * author adds ALL of: focusability (`tabIndex`) AND key activation
 * (`onKeyDown`/`onKeyUp`). This class was found in the 2026-07 audit as Accordion
 * header rows, BigCalendar day/hour cells + event chips, the CalendarFilters
 * clear-all control, and Breadcrumb crumbs — each fixed by rendering the
 * semantically-correct native element (`<button>` / `<a href>`) or by supplying a
 * full role + roving-tabindex + Enter/Space keyboard model.
 *
 * ── THE SHAPE (why "tabIndex AND onKeyDown", not "role") ─────────────────────
 * Keyboard operability (2.1.1) is what this gate enforces: an `onClick` element
 * is operable iff it is focusable (`tabIndex`) AND activatable by key
 * (`onKeyDown`/`onKeyUp`). A `role` alone does the opposite of fixing it — a bare
 * `role="button"` with no `tabIndex`/keydown announces an interactive control the
 * keyboard user cannot reach (a 4.1.2 lie). Note `onKeyPress` is deliberately NOT
 * accepted: it is deprecated and (the Breadcrumb finding) never prevented Space
 * from scrolling the page — an element relying on it is still broken.
 *
 * ── ESCAPE HATCHES (encoded in the check, NEVER a file ignore-list) ──────────
 *  1. Guard / focus-forwarder onClick. The handler's effective body performs only
 *     non-activating calls — `stopPropagation`/`preventDefault` (a click-guard that
 *     stops a parent from reacting) or `focus`/`blur`/`select` (a label-like
 *     wrapper that forwards focus to the native control it contains). Neither is a
 *     real "activation", so keyboard operability is not required. Resolves BOTH
 *     inline arrows (`e => e.stopPropagation()`) AND locally-declared named
 *     handlers (`onClick={handleContainerClick}` → `const handleContainerClick =
 *     () => inputRef.current?.focus()`).
 *  2. Decorative / hidden — `aria-hidden="true"|{true}`. Removed from the AT tree;
 *     its pointer affordance duplicates a control the keyboard user reaches
 *     elsewhere (e.g. a decorative expand twisty whose state + arrow-key handling
 *     live on the owning `treeitem`), or a backdrop that is a sibling of its panel.
 *  3. `role="presentation"` / `role="none"` — explicitly non-semantic.
 *  4. Non-widget role — a landmark / structural / live-region / document role
 *     (`banner`, `navigation`, `dialog`, `region`, `list`, `listitem`, `row`,
 *     `rowgroup`, `table`, `grid`, `toolbar`, `status`, …). The element is a
 *     container/passthrough, not an activated control: its interactive DESCENDANTS
 *     (or the composite widget's own roving-tabindex keyboard model, e.g. a data
 *     grid's row/cell navigation) carry keyboard operability. An INTERACTIVE
 *     widget role (`button`, `link`, `menuitem`, `option`, `tab`, `treeitem`,
 *     `checkbox`, `gridcell`, …) does NOT exempt — those MUST be keyboard-operable.
 *  5. Self-declared backdrop / overlay / scrim (its own `className` or a `data-*`
 *     attribute names it). A modal dismiss surface whose keyboard path is Escape
 *     (WAI-ARIA modal pattern); click-outside is an optional pointer convenience,
 *     not a control. (The library's Dialog + DataGrid ManageColumns backdrops both
 *     wrap their dialog — so aria-hidden is impossible — and both close on Escape.)
 *  6. `<label>` is not in the tag set — a label is natively associated with the
 *     control it wraps; clicking it focuses that control.
 *
 * Comments (JSDoc `@example` snippets, the selector-doc prose above) are blanked
 * before scanning, so a `<div onClick>` mentioned in a comment is never flagged.
 */

// Non-interactive intrinsic (lowercase) tags. Natively-interactive tags — a,
// button, input, select, textarea, option, optgroup, summary, details, label,
// area — are EXCLUDED (they are keyboard-operable by construction). Component
// tags (uppercase) are out of scope (their own render owns semantics).
const NONINTERACTIVE_TAGS = [
  'div', 'span', 'li', 'ul', 'ol', 'p', 'section', 'article', 'header', 'footer',
  'nav', 'aside', 'main', 'figure', 'figcaption', 'tr', 'td', 'th', 'tbody',
  'thead', 'tfoot', 'table', 'caption', 'colgroup', 'dl', 'dt', 'dd',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'small', 'strong', 'em', 'b', 'i', 'u', 's',
  'pre', 'code', 'blockquote', 'address', 'hgroup', 'form', 'fieldset', 'legend',
  'picture', 'img', 'svg', 'path',
]
// `(?=[\s/>])` so `<span` never matches `<Spanish` and `<p` never matches `<path`
// as `p`; the alternation lists `path` before `p` is irrelevant because of the
// lookahead + word alternation (each is a full name followed by a boundary).
const TAG_RE = new RegExp(`<(${NONINTERACTIVE_TAGS.join('|')})(?=[\\s/>])`, 'g')

// Landmark / structural / live-region / document roles — a container or
// passthrough, not an activated control (escape hatch #4). NOT interactive
// widget roles (button/link/menuitem/option/tab/treeitem/checkbox/radio/switch/
// gridcell/spinbutton/slider/combobox/searchbox/textbox/scrollbar), which MUST
// be keyboard-operable when clickable.
const NON_WIDGET_ROLES = new Set([
  'banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region',
  'search', 'form', 'dialog', 'alertdialog', 'document', 'application',
  'article', 'group', 'toolbar', 'tooltip', 'status', 'alert', 'log',
  'marquee', 'timer', 'note', 'definition', 'term', 'directory', 'feed',
  'figure', 'img', 'math', 'presentation', 'none', 'separator', 'heading',
  'list', 'listitem', 'table', 'row', 'rowgroup', 'rowheader', 'columnheader',
  'caption', 'cell', 'grid', 'treegrid', 'tablist', 'tabpanel', 'menu',
  'menubar', 'listbox', 'tree', 'radiogroup',
])

// Calls that do NOT constitute a real activation (escape hatch #1).
const NONACTIVATING_CALLS = new Set([
  'stopPropagation', 'preventDefault', 'focus', 'blur', 'select',
])
// JS keywords that read as `name(` but are not calls.
const CALL_KEYWORDS = new Set([
  'if', 'for', 'while', 'switch', 'return', 'function', 'catch', 'await',
  'typeof', 'void', 'new', 'else', 'do', 'in', 'of',
])

/**
 * Blank the CONTENT of `//` line and block comments, preserving every newline so
 * byte offsets / line numbers are unchanged. String-aware, so a `//` inside a
 * string literal (`https://…`) is not treated as a comment. String literals
 * themselves are PRESERVED (role/className/attribute values must stay readable).
 */
function blankComments(text: string): string {
  const out = text.split('')
  let str: string | null = null
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (str) {
      if (c === '\\') { i++; continue }
      if (c === str) str = null
      continue
    }
    if (c === "'" || c === '"' || c === '`') { str = c; continue }
    if (c === '/' && text[i + 1] === '/') {
      let j = i
      while (j < text.length && text[j] !== '\n') { out[j] = ' '; j++ }
      i = j - 1
      continue
    }
    if (c === '/' && text[i + 1] === '*') {
      let j = i
      while (j < text.length && !(text[j] === '*' && text[j + 1] === '/')) {
        if (text[j] !== '\n') out[j] = ' '
        j++
      }
      if (j < text.length) { out[j] = ' '; out[j + 1] = ' '; j += 1 }
      i = j
      continue
    }
  }
  return out.join('')
}

/**
 * Read a JSX opening tag from `<` (offset `tagStart`) to its closing `>`,
 * brace/string-aware so the `>` inside `onClick={() => f()}` or a template
 * literal is not mistaken for the terminator. Returns the body text or null.
 */
function readOpeningTag(text: string, tagStart: number): string | null {
  let depth = 0
  let str: string | null = null
  for (let i = tagStart; i < text.length; i++) {
    const c = text[i]
    if (str) {
      if (c === '\\') { i++; continue }
      if (c === str) str = null
      continue
    }
    if (c === "'" || c === '"' || c === '`') { str = c; continue }
    if (c === '{') { depth++; continue }
    if (c === '}') { if (depth > 0) depth--; continue }
    if (c === '>' && depth === 0) return text.slice(tagStart, i + 1)
  }
  return null
}

/** Extract the balanced `{ … }` starting at `openIdx` (a `{`), returning the
 *  INNER content (braces stripped), string/nested-brace aware. */
function extractBraces(s: string, openIdx: number): string {
  let depth = 0
  let str: string | null = null
  for (let i = openIdx; i < s.length; i++) {
    const c = s[i]
    if (str) {
      if (c === '\\') { i++; continue }
      if (c === str) str = null
      continue
    }
    if (c === "'" || c === '"' || c === '`') { str = c; continue }
    if (c === '{') depth++
    else if (c === '}') { depth--; if (depth === 0) return s.slice(openIdx + 1, i) }
  }
  return s.slice(openIdx + 1)
}

/** The value expression of `onClick={…}` in a tag body (braces stripped), or null. */
function onClickExpr(body: string): string | null {
  const m = /\bonClick\s*=\s*/.exec(body)
  if (!m) return null
  const after = m.index + m[0].length
  if (body[after] === '{') return extractBraces(body, after)
  return null
}

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/** Balanced `{ … }` block from `braceIdx`, inner content (for handler bodies). */
function braceBlock(text: string, braceIdx: number): string {
  return extractBraces(text, braceIdx)
}

/**
 * Resolve a locally-declared handler NAME to its body text (for classifying a
 * named `onClick={handler}`). Handles `const/let/var NAME = (…) => { … }`,
 * `const NAME = useCallback((…) => { … }, […])`, `const NAME = () => expr`, and
 * `function NAME(…) { … }`. Returns null when the name is a prop/import (a
 * handler we cannot see) — the caller then treats it as a real activation.
 */
function resolveHandlerBody(text: string, name: string): string | null {
  const assign = new RegExp(`\\b(?:const|let|var)\\s+${escapeRe(name)}\\s*=`).exec(text)
  if (assign) {
    const arrow = text.indexOf('=>', assign.index)
    if (arrow >= 0) {
      let i = arrow + 2
      while (i < text.length && /\s/.test(text[i]!)) i++
      if (text[i] === '{') return braceBlock(text, i)
      const eol = text.indexOf('\n', i)
      return text.slice(i, eol < 0 ? text.length : eol)
    }
  }
  const fn = new RegExp(`\\bfunction\\s+${escapeRe(name)}\\s*\\(`).exec(text)
  if (fn) {
    const brace = text.indexOf('{', fn.index)
    if (brace >= 0) return braceBlock(text, brace)
  }
  return null
}

/** Meaningful call-names in a handler body (member + optional-chaining aware). */
function calledNames(body: string): string[] {
  const names: string[] = []
  const re = /([A-Za-z_$][\w$]*)\s*(?:\?\.\s*)?\(/g
  let m: RegExpExecArray | null
  while ((m = re.exec(body))) {
    if (!CALL_KEYWORDS.has(m[1]!)) names.push(m[1]!)
  }
  return names
}

/** True when every call the body makes is a guard / focus-forward (hatch #1). */
function bodyIsNonActivating(body: string): boolean {
  return calledNames(body).every((n) => NONACTIVATING_CALLS.has(n))
}

/** Classify an `onClick` value expression as a guard/focus-forwarder (skip) or a
 *  real activation (subject to the keyboard requirement). */
function onClickIsNonActivating(expr: string, text: string): boolean {
  const e = expr.trim()
  const arrow = e.indexOf('=>')
  if (arrow >= 0) return bodyIsNonActivating(e.slice(arrow + 2))
  if (/^[A-Za-z_$][\w$]*$/.test(e)) {
    const body = resolveHandlerBody(text, e)
    return body != null && bodyIsNonActivating(body)
  }
  // Ternary / member / call expression — cannot prove it is a guard.
  return false
}

const hasTabIndex = (body: string) => /\btabIndex\s*=/.test(body)
const hasKeyHandler = (body: string) => /\bonKey(?:Down|Up)\s*=/.test(body)
const isAriaHidden = (body: string) => /\baria-hidden\s*=\s*["'{]?\s*true\b/.test(body)
const staticRole = (body: string): string | null => {
  const m = /\brole\s*=\s*['"]([a-z]+)['"]/.exec(body)
  return m ? m[1]! : null
}
const isBackdrop = (body: string): boolean =>
  /class[nN]ame\s*=\s*[{"'][^}"']*(?:backdrop|overlay|scrim)/i.test(body) ||
  /data-[a-z-]*(?:backdrop|overlay|scrim)/i.test(body)

function offsetToLine(text: string, offset: number): number {
  let line = 1
  for (let i = 0; i < offset && i < text.length; i++) if (text[i] === '\n') line++
  return line
}

const lint: A11yLint = {
  name: 'clickable-noninteractive-element',
  wcag: '2.1.1, 4.1.2',
  description:
    'A non-interactive intrinsic element (<div>/<span>/<li>/<tr>/…) with an onClick but no keyboard operability (missing tabIndex AND onKeyDown/onKeyUp) is a pointer-only control — keyboard and AT users can neither focus nor activate it. Render the semantically-correct native element (<button>/<a href>) or add role + tabIndex + Enter/Space key handling. Escape hatches (encoded in the check): guard/focus-forwarder handlers (stopPropagation/preventDefault/focus), aria-hidden decorative elements, role=presentation/none, landmark/structural/live non-widget roles (container passthroughs), and self-declared backdrop/overlay/scrim dismiss surfaces (keyboard path is Escape). onKeyPress is NOT accepted (deprecated; never prevents Space-scroll).',
  check(files: LintFile[]): Violation[] {
    const violations: Violation[] = []
    for (const { path, text: raw } of files) {
      const text = blankComments(raw)
      TAG_RE.lastIndex = 0
      let m: RegExpExecArray | null
      while ((m = TAG_RE.exec(text))) {
        const body = readOpeningTag(text, m.index)
        if (!body) continue
        const expr = onClickExpr(body)
        if (expr === null) continue // no onClick — not a clickable element

        // Keyboard-operable already (focusable + key activation) → fine.
        if (hasTabIndex(body) && hasKeyHandler(body)) continue
        // Hatch 1 — guard / focus-forwarder handler (not a real activation).
        if (onClickIsNonActivating(expr, text)) continue
        // Hatch 2 — decorative / hidden.
        if (isAriaHidden(body)) continue
        // Hatch 3 & 4 — presentation/none or a non-widget (container) role.
        const role = staticRole(body)
        if (role && NON_WIDGET_ROLES.has(role)) continue
        // Hatch 5 — self-declared backdrop / overlay / scrim (Escape dismiss).
        if (isBackdrop(body)) continue

        violations.push({
          file: path,
          line: offsetToLine(text, m.index),
          message:
            `clickable <${m[1]}> is not keyboard-operable — a pointer-only onClick on a ` +
            'non-interactive element. Render a native <button>/<a href>, or add role + ' +
            'tabIndex + onKeyDown (Enter/Space); onKeyPress does not count',
        })
      }
    }
    return violations
  },
  selftest: {
    bad: [
      // classic clickable div acting as a button — no role/tabIndex/keydown
      'export const A = () => <div onClick={() => go()}>go</div>',
      // interactive role but NOT keyboard-operable (bare role="button" is a 4.1.2 lie)
      'export const B = () => <span role="button" onClick={activate}>x</span>',
      // multi-line <li> option, activating handler, no keyboard model
      'export const C = () => (\n  <li\n    className={s.item}\n    onClick={() => handleSelect(item)}\n  >\n    text\n  </li>\n)',
      // tabIndex alone is not enough — still missing key activation
      'export const D = () => <div role="option" tabIndex={0} onClick={() => pick()}>opt</div>',
      // onKeyPress does NOT count (deprecated; never prevents Space-scroll)
      'export const E = () => <div role="button" tabIndex={0} onKeyPress={k} onClick={go}>x</div>',
    ],
    good: [
      // native button — keyboard-operable by construction
      'export const F = () => <button onClick={() => go()}>go</button>',
      // full custom-widget keyboard model (role + tabIndex + onKeyDown)
      'export const G = () => <div role="button" tabIndex={0} onKeyDown={onKey} onClick={() => go()}>go</div>',
      // click-guard (stopPropagation only) — not a real activation
      'export const H = () => <div onClick={e => e.stopPropagation()}>x</div>',
      // self-declared backdrop — dismiss surface, keyboard path is Escape
      'export const I = () => <div className={s.backdrop} onClick={onClose} />',
      // landmark/container role (passthrough) — descendants carry keyboard
      'export const J = () => <div role="dialog" onClick={onClose}>x</div>',
      'export const K = () => <tr role="row" onClick={() => onRowClick(row)}>x</tr>',
      // decorative / hidden — duplicates a keyboard-reachable control
      'export const L = () => <div aria-hidden="true" onClick={toggle}>x</div>',
      // named focus-forwarder handler (label-like wrapper) — resolved + exempt
      'const focusInput = () => { inputRef.current?.focus() }\nexport const M = () => <div onClick={focusInput}>x</div>',
      // role="presentation" — explicitly non-semantic
      'export const N = () => <div role="presentation" onClick={h}>x</div>',
      // <label> is not in the tag set (native control association)
      'export const O = () => <label onClick={e => e.stopPropagation()}>x</label>',
    ],
  },
}

export default lint
