import type { A11yLint, LintFile, Violation } from '../lint-a11y'

/**
 * CLASS: color-only-state (WCAG 1.4.1 Use of Color (A) + 4.1.2 Name Role Value (A)).
 *
 * A UI STATE — selected / active / current-page / pressed / checked — is painted
 * onto a native, ROLE- or HANDLER-bearing element purely through a CSS attribute
 * selector (`[data-selected]`, `[data-active]`, `[data-current]`, `[data-checked]`,
 * `[data-pressed]` → a colour/background/font-weight change), while NOTHING in the
 * accessibility tree carries that state. Colour-blind sighted users and screen-reader
 * users then cannot perceive which item is selected/active/current. This is the shape
 * the 2026-07 audit found in Accordion (active menu item → colour+weight only),
 * Button (selected → `.selected` colour class), BigCalendar (today/selection →
 * background only), and ConfirmationCodeInput (valid/invalid status dot → background
 * colour only). Every fix added the paired programmatic state (`aria-current` /
 * `aria-selected` / `aria-pressed` / `aria-checked`) — or, for a live status region,
 * a `role="status"` with visually-hidden text.
 *
 * ── DETECTED SHAPE ───────────────────────────────────────────────────────────
 * A LOWERCASE (native/host) JSX opening tag whose body sets a state-colour data-*
 * attribute — matched as a whole token so both the attribute form
 * (`data-selected={x}`) AND the spread-object form
 * (`{...(sel && { 'data-selected': 'true' })}`, which lives *inside* the opening
 * tag) are seen — but the SAME tag exposes no equivalent programmatic state.
 * Capitalised component tags are NOT scanned: forwarding `data-selected` to a
 * `<CustomButton>` is that component's internal responsibility, and the ARIA
 * state must live on whatever native element it finally renders (checking the
 * callsite would only cry wolf). The Accordion `React.createElement('a', {…})`
 * branch (an object literal, not a `<tag>`) is likewise out of the JSX-tag scan;
 * it already pairs `data-active` with `aria-current` in the same object.
 *
 * ── ESCAPE HATCHES (encoded in the CHECK, never a file ignore-list) ───────────
 *  1. The tag ALREADY carries a paired programmatic state:
 *     `aria-current` / `aria-selected` / `aria-pressed` / `aria-checked` /
 *     `aria-expanded`. (Accordion trigger, DataGrid card `<tr>`-mirror, TreeView
 *     treeitem, ToggleButton, ProjectBoard tabs + comment-toggle buttons.)
 *  2. Live-region status text: `role="status"` / `role="alert"` / `aria-live` —
 *     the state is announced as CONTENT, not colour (the CCI status dot pattern:
 *     `role="status"` + a `.srOnly` "Code is valid/invalid").
 *  3. Decorative chrome: `aria-hidden` — the element is removed from the a11y
 *     tree because the real state lives on a sibling native control (the Checkbox
 *     `.box` overlay next to its native `<input checked>`).
 *  4. Native `<option>`: the browser maps the parent `<select value>` selection
 *     to the a11y tree natively; author `aria-selected` is a "first rule of ARIA"
 *     violation (the MenuItem pattern).
 *  5. State carried in a DYNAMIC accessible name: `aria-label={…}` (a brace
 *     expression that can interpolate the state, e.g. `View article: …${sel ?
 *     ' (linked)' : ''}`) or `aria-labelledby` — the state reaches AT through the
 *     name, not colour. A STATIC `aria-label="…"` string does NOT escape (a fixed
 *     name cannot reflect a toggling state).
 *  6. Passive styling wrapper: a non-interactive host element
 *     (div/span/li/ul/label/tr/td/… — see PASSIVE_TAGS) that has NEITHER an event
 *     handler (`onClick`/`onKeyDown`/…) NOR a `role` delegates its state to a real
 *     child control that owns it (TransferList `<li>` → child native checkbox,
 *     Switch `<label>` → child native input, ListItemCard `<li>` → child select
 *     `<button aria-pressed>`, ProjectBoard meeting-type `<label>` → child native
 *     radio). Flagging these would false-positive on every state-styled container;
 *     the higher-signal targets (elements that THEMSELVES bear a role or handler)
 *     stay enforced. An interactive/role-bearing wrapper is NOT escaped here.
 */

// State-colour attribute tokens. The leading `\b` and the trailing `(?![-\w])`
// pin the WHOLE attribute name: this matches the attribute form
// (`data-selected=`) and the object-literal-key form (`'data-selected'`) alike,
// but NOT a longer compound name whose meaning differs — `data-selection-mode`,
// `data-selectable`, or `data-selected-count` (a selection COUNT, not a
// per-element selected STATE) all fail the trailing lookahead.
const STATE_TOKEN_RE =
  /\bdata-(?:active|selected|current|checked|pressed)(?![-\w])/

// Escape-hatch predicates (all read the comment-blanked opening-tag body).
const hasAriaState = (body: string) =>
  /\baria-(?:current|selected|pressed|checked|expanded)\b/.test(body)
const hasLiveRegion = (body: string) =>
  /\brole\s*=\s*['"](?:status|alert)['"]/.test(body) || /\baria-live\b/.test(body)
const hasAriaHidden = (body: string) => /\baria-hidden\b/.test(body)
const hasDynamicName = (body: string) =>
  /\baria-label\s*=\s*\{/.test(body) || /\baria-labelledby\b/.test(body)
const hasHandler = (body: string) => /\bon[A-Z][A-Za-z]+\s*=/.test(body)
const hasRole = (body: string) => /\brole\s*=/.test(body)

// Roles that CANNOT carry the paired selection state — ARIA forbids
// aria-selected/aria-checked/aria-pressed on listitem/presentation/none, so a
// wrapper with one of these roles legitimately leaves the state on a descendant
// native control (escape hatch #7). role="option"/"row"/"tab" support
// aria-selected and are deliberately NOT here — they must carry it themselves.
const STATE_FORBIDDEN_ROLE_RE = /\brole\s*=\s*['"](listitem|presentation|none)['"]/

// A descendant native state control inside the element's forward window: a raw
// checkbox/radio input, a *Checkbox/*Radio/*Switch component (goobs
// CustomCheckbox renders a native input), or an element carrying its own
// aria-checked/aria-selected.
const DESCENDANT_STATE_CONTROL_RE =
  /<input\b[^>]*type\s*=\s*['"](?:checkbox|radio)['"]|<[A-Z][\w]*(?:Checkbox|Radio|Switch)\b|\baria-(?:checked|selected)\s*=/

// Non-interactive host elements that legitimately style a child control's state
// (escape hatch #6, only when they carry neither a handler nor a role).
const PASSIVE_TAGS = new Set([
  'div',
  'span',
  'li',
  'ul',
  'ol',
  'dl',
  'dd',
  'dt',
  'tr',
  'td',
  'th',
  'label',
  'section',
  'article',
  'aside',
  'nav',
  'header',
  'footer',
  'main',
  'p',
  'figure',
  'figcaption',
])

// Native/host opening tags only (lowercase first letter). The `(?=[\s/>])`
// lookahead requires a complete tag name so `<a` never matches `<article` short
// and the name is fully captured.
const NATIVE_TAG_RE = /<([a-z][a-z0-9-]*)(?=[\s/>])/g

/**
 * Blank the CONTENT of `//` line comments and block comments (JSDoc included) to
 * spaces, preserving every newline so line numbers are unchanged. String- and
 * template-literal-aware so a `//` inside a string (e.g. an `https://` URL) is
 * not mistaken for a comment. This stops JSDoc `@example` JSX and prose that
 * mentions `data-selected` / `aria-pressed` from affecting detection.
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
 * Read a JSX opening tag starting at `<` (offset `tagStart`), returning the
 * inclusive index of the tag-closing `>` and the tag body. Brace- and
 * string-aware so a `>` inside `onClick={() => f()}` (arrow inside `{}`), inside
 * a `` `template ${x}` `` literal, or inside a spread `{...(x && { … })}` is not
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
    if (c === '>' && depth === 0) {
      return { end: i, body: text.slice(tagStart, i + 1) }
    }
  }
  return null
}

function newlineIndex(text: string): number[] {
  const out: number[] = []
  for (let i = 0; i < text.length; i++) if (text[i] === '\n') out.push(i)
  return out
}

function offsetToLine(newlineOffsets: number[], offset: number): number {
  let lo = 0
  let hi = newlineOffsets.length
  while (lo < hi) {
    const mid = (lo + hi) >> 1
    if (newlineOffsets[mid] < offset) lo = mid + 1
    else hi = mid
  }
  return lo + 1
}

const lint: A11yLint = {
  name: 'color-only-state',
  wcag: '1.4.1, 4.1.2',
  description:
    'A selected/active/current/pressed/checked UI state is painted onto a native, role- or handler-bearing element only through a state-colour data-* attribute (a CSS colour/background selector) while nothing in the a11y tree carries that state — so colour-blind and screen-reader users cannot perceive it. Add the paired programmatic state (aria-current / aria-selected / aria-pressed / aria-checked), or a role="status" live region with visually-hidden text. Escape hatches (encoded in the check): the tag already has a paired aria-* state; a role="status"/"alert"/aria-live announcement; aria-hidden decorative chrome; a native <option> (browser-mapped selection); state carried in a dynamic aria-label={…}/aria-labelledby; or a passive styling wrapper (no handler + no role) that delegates its state to a child native control. See the module header for the per-component mapping.',
  check(files: LintFile[]): Violation[] {
    const violations: Violation[] = []
    for (const { path, text: raw } of files) {
      // Scan a comment-blanked copy so prose / JSDoc examples never affect
      // detection; offsets and line numbers are identical to the raw source.
      const text = blankComments(raw)
      if (!STATE_TOKEN_RE.test(text)) continue // fast reject
      const nl = newlineIndex(text)

      NATIVE_TAG_RE.lastIndex = 0
      let m: RegExpExecArray | null
      while ((m = NATIVE_TAG_RE.exec(text))) {
        const tagName = m[1]
        const tag = readOpeningTag(text, m.index)
        if (!tag) continue
        const { body } = tag
        // Only tags that paint a state-colour attribute are candidates.
        if (!STATE_TOKEN_RE.test(body)) continue
        // #4 native <option>: browser maps <select value> selection natively.
        if (tagName === 'option') continue
        // #1 paired programmatic state already present.
        if (hasAriaState(body)) continue
        // #2 live-region status text; #3 decorative; #5 dynamic accessible name.
        if (hasLiveRegion(body) || hasAriaHidden(body) || hasDynamicName(body))
          continue
        // #6 passive styling wrapper (no handler + no role) — state lives on a
        // child native control it wraps.
        if (PASSIVE_TAGS.has(tagName) && !hasHandler(body) && !hasRole(body))
          continue
        // #7 structural wrapper whose role FORBIDS the paired state
        // (listitem/presentation/none can't take aria-selected/checked/pressed)
        // delegating to a descendant native state control (the TransferList
        // row: <li role="listitem" data-checked> wrapping a native checkbox —
        // a row onClick is a pointer convenience over the accessible control).
        if (
          PASSIVE_TAGS.has(tagName) &&
          STATE_FORBIDDEN_ROLE_RE.test(body)
        ) {
          const closeIdx = text.indexOf(`</${tagName}>`, tag.end)
          const windowEnd =
            closeIdx >= 0 ? closeIdx : Math.min(text.length, tag.end + 2500)
          if (DESCENDANT_STATE_CONTROL_RE.test(text.slice(tag.end, windowEnd)))
            continue
        }

        // Anchor the violation at the state-colour token for a precise fix site.
        const tokenMatch = STATE_TOKEN_RE.exec(body)
        const tokenOffset = m.index + (tokenMatch ? tokenMatch.index : 0)
        violations.push({
          file: path,
          line: offsetToLine(nl, tokenOffset),
          message: `<${tagName}> conveys a selection/active/current state via a state-colour data-* attribute with no equivalent in the a11y tree — add the paired aria-* state (aria-current/aria-selected/aria-pressed/aria-checked) or a role="status" + visually-hidden text (WCAG 1.4.1 / 4.1.2; see color-only-state header)`,
        })
      }
    }
    return violations
  },
  selftest: {
    bad: [
      // toggle button: selected → colour class only, no aria-pressed
      'export const A = () => <button data-selected={sel} onClick={pick}>X</button>',
      // role="option" selection by colour only (needs aria-selected)
      'export const B = () => <div role="option" data-selected={sel} onClick={pick}>X</div>',
      // tab active by colour only (needs aria-selected)
      'export const C = () => <button role="tab" data-active={active} onClick={sel}>Tab</button>',
      // spread-object form inside the opening tag, no aria state
      "export const D = () => <button {...(sel && { 'data-selected': 'true' })} onClick={t}>X</button>",
      // current-page link conveyed by colour only (needs aria-current)
      'export const E = () => <a href="/x" data-current={here}>Home</a>',
      // multi-line tag, arrow handler, checked state colour-only
      `export const F = () => (
        <button
          data-checked={on ? 'true' : undefined}
          onClick={(e) => toggle(e)}
        >
          Opt
        </button>
      )`,
      // role="listitem" with state but NO descendant native control — the #7
      // hatch requires a real delegation target, not just the structural role
      "export const F2 = () => <li role='listitem' data-selected={s} onClick={pick}>text</li>",
    ],
    good: [
      // paired aria-pressed
      'export const G = () => <button data-selected={sel} aria-pressed={sel} onClick={pick}>X</button>',
      // paired aria-selected on a tab
      'export const H = () => <button role="tab" data-active={a} aria-selected={a} onClick={s}>Tab</button>',
      // paired aria-current on a nav link
      "export const I = () => <a href='/x' data-current={h} aria-current={h ? 'page' : undefined}>Home</a>",
      // native <option> — browser-mapped selection, author aria-selected forbidden
      "export const J = () => <option value='a' data-selected={sel}>A</option>",
      // live-region status text (the CCI status-dot pattern)
      'export const K = () => <div role="status" data-valid={ok} data-checked={ok}><span className={sr}>{ok ? "valid" : "invalid"}</span></div>',
      // decorative chrome — real state on a sibling native control
      "export const L = () => <div aria-hidden='true' {...(on && { 'data-checked': 'true' })} />",
      // state carried in a dynamic accessible name
      'export const M = () => <div role="button" data-selected={sel} aria-label={`View ${t}${sel ? " (linked)" : ""}`} onClick={o}>x</div>',
      // passive styling wrapper (no handler, no role) → child native control owns state
      'export const N = () => <label data-selected={sel}><input type="radio" checked={sel} /></label>',
      // passive <li> wrapper delegating to a child native checkbox
      "export const O = () => <li data-checked={c}><input type='checkbox' checked={c} /></li>",
      // #7 structural role forbidding the paired state + row-click delegation to
      // a descendant native checkbox (the TransferList row shape)
      "export const R = () => <li role='listitem' data-checked={c} onClick={e => { if (e.target === e.currentTarget) toggle() }}><input type='checkbox' checked={c} /></li>",
      // #7 with a *Checkbox component (goobs CustomCheckbox renders native input)
      "export const S = () => <li role='listitem' data-checked={c} onClick={h}><CustomCheckbox checked={c} onChange={h} /></li>",
      // no state-colour token at all (data-selection-mode is not data-selected)
      'export const P = () => <div data-selection-mode="multi" data-selectable="true">x</div>',
      // compound COUNT attribute on a toolbar — data-selected-count is not the
      // per-element data-selected state (trailing-lookahead boundary guard)
      'export const Q = () => <div role="toolbar" data-has-selection={n>0} data-selected-count={n} aria-label="Row actions">x</div>',
    ],
  },
}

export default lint
