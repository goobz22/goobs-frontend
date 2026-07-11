import type { A11yLint, LintFile, Violation } from '../lint-a11y'

/**
 * CLASS: form-label-not-associated (WCAG 1.3.1, 3.3.2, 4.1.2).
 *
 * A visible `<label>` element that is NOT programmatically tied to any form
 * control is a lie to assistive tech: sighted users see "Email *" above a box,
 * but a screen-reader user who focuses the box hears no name. A `<label>` only
 * names a control when it is associated one of three ways —
 *
 *   1. EXPLICIT id link — `<label htmlFor={id}>` + a control with `id={id}`.
 *   2. IMPLICIT nesting — the labelable control is a DESCENDANT of the `<label>`
 *      (`<label><input …/> Agree</label>`); the browser links them structurally.
 *   3. aria-labelledby TARGET — the `<label>` carries an `id` that another
 *      element references via `aria-labelledby` (used when the control is a
 *      composite widget or a child component that can't take `htmlFor`, e.g. the
 *      ComplexTextEditor editors and the RadioGroup group caption).
 *
 * A `<label>` that has NONE of these — no `htmlFor`, no `id`, and no labelable
 * descendant — is orphaned: the control it visually names (a sibling `<input>`
 * or a sibling goobs field component) gets no accessible name from it.
 *
 * This is the shape the 2026-07 audit found in ComplexTextEditor (a visible
 * `<label>` with neither `htmlFor` nor a wrapped input — fixed with an
 * id + aria-labelledby thread) and in DataGrid's mobile CardField (fixed with
 * `htmlFor` + a `useId()` id on the native control). The same shape recurred in
 * DataGrid's mobile AddCard, where the card label sat as a SIBLING of the goobs
 * field the label named — exactly the class-first payoff of this gate.
 *
 * ── ESCAPE HATCHES (encoded in the check, never a file ignore-list) ──────────
 *  #1 `htmlFor=` on the label opening tag (dynamic `{…}` counts — an explicit
 *     association attempt). #2 `id=` on the label opening tag (the label is an
 *     addressable aria-labelledby / aria-describedby target). #3 a labelable
 *     descendant control between the `<label …>` and its matching `</label>` —
 *     a native `<input>/<select>/<textarea>/<button>/<meter>/<output>/<progress>`
 *     OR a goobs field/interactive component (`<TextField>`, `<Checkbox>`,
 *     `<…Dropdown>`, `<…Editor>`, …). #4 `aria-hidden="true"` on the label
 *     (decorative, out of the a11y tree).
 *
 * `<label>` / `<input>` tokens that appear only inside comments (JSDoc examples)
 * or string / template literals (selector strings, docs) are masked before
 * scanning, so they never produce a false positive.
 */

// A `<label` opening tag: the word "label" immediately after `<`, then a
// whitespace / self-close / `>` boundary (never matches `<labelledby` etc.).
const LABEL_OPEN_RE = /<label(?=[\s/>])/g

// Native labelable controls (HTML spec: input, select, textarea, button, meter,
// output, progress) rendered as a DESCENDANT implicitly associate with a label.
const NATIVE_CONTROL_RE =
  /<(?:input|select|textarea|button|meter|output|progress)(?=[\s/>])/i

// goobs field / interactive component tags whose inner element is a real form
// control — wrapping one in a `<label>` is an implicit-association pattern too.
// Broad-but-anchored: an uppercase component whose name ends in a control-ish
// suffix. This only ADDS escapes (reduces false positives); a label wrapping
// only text or a decorative `<span>`/Icon is still flagged.
const GOOBS_CONTROL_RE =
  /<[A-Z][A-Za-z]*(?:Field|Dropdown|Select|Checkbox|Switch|Radio|Editor|Input|Picker|Slider|Toggle|Combobox|Autocomplete)(?=[\s/>])/

// Label-opening-tag attribute escape hatches. `\s`-prefixed so `data-grid-id=`
// does NOT satisfy the `id=` hatch and only a real `id`/`htmlFor` attribute does.
const HAS_HTMLFOR_RE = /\shtmlFor\s*=/
const HAS_ID_RE = /\sid\s*=/
const HAS_ARIA_HIDDEN_TRUE_RE = /\saria-hidden\s*=\s*(?:['"]true['"]|\{true\})/

/**
 * Blank out block comments, line comments, and single/double/back-quoted string
 * literals (preserving every newline + length so byte offsets → line numbers
 * stay exact), so a `<label>`/`<input>` named in a JSDoc example or a selector
 * string is never matched as real JSX.
 */
function maskNonCode(text: string): string {
  let t = text.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '))
  t = t.replace(
    /(^|[^:])\/\/[^\n]*/g,
    (m, p1: string) => p1 + ' '.repeat(m.length - p1.length)
  )
  t = t.replace(
    /'(?:[^'\\\n]|\\.)*'/g,
    (m) => "'" + ' '.repeat(Math.max(0, m.length - 2)) + "'"
  )
  t = t.replace(
    /"(?:[^"\\\n]|\\.)*"/g,
    (m) => '"' + ' '.repeat(Math.max(0, m.length - 2)) + '"'
  )
  t = t.replace(
    /`(?:[^`\\]|\\.)*`/g,
    (m) => '`' + ' '.repeat(Math.max(0, m.length - 2)) + '`'
  )
  return t
}

/**
 * Read the JSX opening tag starting at `<` (offset `tagStart`), returning the
 * index just past the tag-closing `>` and the tag body. Brace- and string-aware
 * so a `>` inside `style={{…}}` or an arrow handler is not mistaken for the tag
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
    if (c === '>' && depth === 0) return { end: i + 1, body: text.slice(tagStart, i + 1) }
  }
  return null
}

/**
 * From `fromOffset` (just past a `<label …>` opening tag) find the inner content
 * up to that label's MATCHING `</label>`, honoring nested `<label` opens. If the
 * label self-closes (`<label … />`) or is never closed, returns '' (no
 * descendant control possible → the attribute hatches decide).
 */
function labelInnerContent(
  masked: string,
  openBody: string,
  fromOffset: number
): string {
  if (/\/>\s*$/.test(openBody)) return '' // self-closed <label … />
  let depth = 1
  let i = fromOffset
  while (i < masked.length) {
    const open = masked.indexOf('<label', i)
    const close = masked.indexOf('</label', i)
    if (close === -1) return masked.slice(fromOffset) // unterminated — scan rest
    if (open !== -1 && open < close && /[\s/>]/.test(masked[open + 6] ?? '')) {
      depth++
      i = open + 6
      continue
    }
    depth--
    if (depth === 0) return masked.slice(fromOffset, close)
    i = close + 7
  }
  return masked.slice(fromOffset)
}

function lineOf(masked: string, offset: number): number {
  let line = 1
  for (let i = 0; i < offset && i < masked.length; i++)
    if (masked[i] === '\n') line++
  return line
}

const lint: A11yLint = {
  name: 'form-label-not-associated',
  wcag: '1.3.1, 3.3.2, 4.1.2',
  description:
    'A visible <label> with no htmlFor, no id, and no labelable descendant is ' +
    'orphaned — the control it visually names gets no accessible name. Associate ' +
    'it: `<label htmlFor={id}>` + `id={id}` on the control (explicit), wrap the ' +
    'control inside the <label> (implicit), or give the <label> an `id` and point ' +
    'the control/group at it via aria-labelledby. Escape hatches: htmlFor, id, a ' +
    'wrapped native/goobs control, or aria-hidden="true".',
  check(files: LintFile[]): Violation[] {
    const violations: Violation[] = []
    for (const { path, text } of files) {
      const masked = maskNonCode(text)
      LABEL_OPEN_RE.lastIndex = 0
      let m: RegExpExecArray | null
      while ((m = LABEL_OPEN_RE.exec(masked))) {
        const tag = readOpeningTag(masked, m.index)
        if (!tag) continue
        const { body, end } = tag
        // #1 explicit htmlFor · #2 id (aria-labelledby target) · #4 aria-hidden
        if (
          HAS_HTMLFOR_RE.test(body) ||
          HAS_ID_RE.test(body) ||
          HAS_ARIA_HIDDEN_TRUE_RE.test(body)
        )
          continue
        // #3 a labelable control nested inside the label (implicit association)
        const inner = labelInnerContent(masked, body, end)
        if (NATIVE_CONTROL_RE.test(inner) || GOOBS_CONTROL_RE.test(inner)) continue
        violations.push({
          file: path,
          line: lineOf(masked, m.index),
          message:
            'visible <label> is not associated with any control — add htmlFor+id, ' +
            'nest the control inside the <label>, or give the label an id + ' +
            'aria-labelledby on the control (see form-label-not-associated header)',
        })
      }
    }
    return violations
  },
  selftest: {
    bad: [
      // bare label, text only
      'export const A = () => <label>Email</label>',
      // styled label naming a SIBLING control (the AddCard shape): input is
      // AFTER </label>, not a descendant
      'export const B = () => (<div><label className={styles.l}>Email<span>*</span></label><input /></div>)',
      // multi-line opening tag, no association, text child only
      'export const C = () => (\n  <label\n    style={{ color: red }}\n  >\n    {field.label}\n  </label>\n)',
      // label wrapping only a decorative span (no control)
      'export const D = () => <label className={c}><span aria-hidden="true">*</span>Amount</label>',
    ],
    good: [
      // explicit htmlFor (escape #1)
      'export const E = () => <label htmlFor={id}>Email</label>',
      'export const F = () => <label htmlFor="user-email">Email</label>',
      // id → aria-labelledby target (escape #2)
      'export const G = () => <label id={labelId} className={c}>Editor</label>',
      // implicit nesting — native input descendant (escape #3)
      'export const H = () => <label className={c}><input type="checkbox" />Agree</label>',
      // implicit nesting across lines — radio descendant
      'export const I = () => (\n  <label key={i}>\n    <input type="radio" name="x" />\n    <span>A</span>\n  </label>\n)',
      // implicit nesting — goobs field component descendant (escape #3)
      'export const J = () => <label className={c}><TextField label="x" /></label>',
      // decorative label out of the a11y tree (escape #4)
      'export const K = () => <label aria-hidden="true">deco</label>',
      // token only inside a string / comment — masked, not real JSX
      "export const L = () => <div data-sel={'<label>x</label>'}>{/* a <label> naming an <input> */}hi</div>",
      // data-*-id must NOT satisfy the id hatch, but a wrapped select still exempts it
      'export const M = () => <label data-grid-id="g"><select><option>a</option></select></label>',
    ],
  },
}

export default lint
