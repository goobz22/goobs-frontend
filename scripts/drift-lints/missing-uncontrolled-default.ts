import type { DriftFile, DriftInstance, DriftLint } from '../lint-drift'

/**
 * DRIFT CLASS: controlled/uncontrolled asymmetry
 * (a stateful input Props declares `value`/`checked` + `onChange` but NOT the
 * matching `defaultValue`/`defaultChecked`).
 *
 * The React-ecosystem controlled-input triad is `value`/`checked` (the current
 * value), `onChange` (the change signal), and `defaultValue`/`defaultChecked`
 * (the UNCONTROLLED counterpart, letting a consumer render fire-and-forget with
 * NO useState boilerplate). Native React DOM elements ship all three, and every
 * mature library (MUI, Radix, React-Aria) mirrors the pair. In this repo the
 * asymmetry is the norm: of the exported `*Props` that declare value/checked +
 * onChange, only FOUR declare the default counterpart — CheckboxProps
 * (defaultChecked), DropdownProps / SearchableSimpleProps / RadioGroupProps
 * (defaultValue). Those four are the canonical exemplars; the rest force full
 * controlled usage. This ratchet freezes the drifted majority and requires NEW
 * stateful-input Props to ship the uncontrolled counterpart.
 *
 * QUALIFYING SHAPE (an input, not a display prop): an exported `*Props`
 * interface/type that declares, as an OWN top-level member, `value` or `checked`
 * AND the React-canonical `onChange` member. Presence of the literal `onChange`
 * is the discriminator that separates a controlled input (value paired with a
 * change signal) from a display-only `value` label (Card/Metric/DetailField/
 * MoneyText/ProgressBar — no onChange, correctly ignored).
 *
 * INSTANCE (the drift): a qualifying Props MISSING the matching default —
 * `defaultValue` when it declares `value`, `defaultChecked` when it declares
 * `checked`. The four exemplars above declare it and are NOT instances.
 *
 * DELIBERATELY EXCLUDED (ambiguous — under-measured, false positives are poison):
 *   - Inherited members (SwitchProps/SelectProps `extends *HTMLAttributes`) — the
 *     value/checked/onChange/default* come from React's types, not own members;
 *     a lexical own-member census can't see them, so these are simply out of the
 *     value/checked set.
 *   - `value` present but NO literal `onChange`: FileDropzoneProps
 *     (onFileSelect/onRemove — a file widget that can't be `defaultValue`-
 *     controlled), QRCodeProps (`value` is the QR content to render; its handlers
 *     drive a separate confirmation-code sub-input), ToggleButtonProps (`value` is
 *     the button's identity in a group; `onClick`, not a change signal — the GROUP,
 *     ToggleButtonGroupProps, is the controlled one and IS counted).
 *   - Tabs uses `activeTab` (not `value`) as its selection index → not in the
 *     value/checked set.
 *
 * FIX SHAPE (additive, non-breaking): add an optional `defaultValue?` /
 * `defaultChecked?` member and thread it as the initial state when the controlled
 * prop is undefined. It only widens the public API.
 */

/** Blank `//` and block comment content (string-aware, newlines preserved) so a
 *  JSDoc mentioning `value`/`onChange`/`defaultValue` is never itself a hit —
 *  apostrophes in comments desync naive quote walkers (proven in this repo's
 *  a11y modules). Mirrors scripts/a11y-lints/label-input-id-divergence.ts. */
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

/** Blank the INTERIOR of every '…' / "…" / `…` string (delimiters + newlines
 *  kept, escapes honored) so a string-literal type member — e.g. an
 *  `Omit<…, 'type' | 'value' | 'onChange'>` extends clause — can never trip the
 *  header guard's keyword/char tests (`\btype\b` etc. ignore quotes) or expose a
 *  phantom member. Run AFTER blankComments. */
function blankStrings(text: string): string {
  const out = text.split('')
  let str: string | null = null
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (str) {
      if (c === '\\') {
        if (text[i + 1] !== '\n') out[i + 1] = ' '
        out[i] = ' '
        i++
        continue
      }
      if (c === str) {
        str = null
        continue
      }
      if (c !== '\n') out[i] = ' '
      continue
    }
    if (c === "'" || c === '"' || c === '`') {
      str = c
      continue
    }
  }
  return out.join('')
}

/** From the opening `{` at `openIdx`, return the interior text (between the
 *  matched braces) and the index of the closing `}`. String-aware. */
function braceBody(text: string, openIdx: number): [string, number] {
  let depth = 0
  let str: string | null = null
  for (let i = openIdx; i < text.length; i++) {
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
    if (c === '{') depth++
    else if (c === '}') {
      depth--
      if (depth === 0) return [text.slice(openIdx + 1, i), i]
    }
  }
  return [text.slice(openIdx + 1), text.length]
}

/**
 * Blank every character NOT at the interface's top level (brace/paren/bracket
 * depth > 0) plus all string contents, so a member scan sees ONLY top-level
 * member declarations. Tracks `{ ( [` up / `} ) ]` down but NOT `< >`: TS
 * arrows (`=>`) and generics make angle brackets desync a depth counter into
 * negative territory, which would re-expose a function-param `value` (e.g.
 * `onEditingValueChange: (value: string) => void`) as a phantom top-level
 * member. Parens/braces/brackets are always balanced, so this masking is safe.
 */
function topLevelOnly(body: string): string {
  const out = body.split('')
  let depth = 0
  let str: string | null = null
  for (let i = 0; i < body.length; i++) {
    const c = body[i]
    if (str) {
      out[i] = ' '
      if (c === '\\') {
        if (body[i + 1] !== '\n') out[i + 1] = ' '
        i++
        continue
      }
      if (c === str) str = null
      continue
    }
    if (c === "'" || c === '"' || c === '`') {
      str = c
      out[i] = ' '
      continue
    }
    if (c === '{' || c === '(' || c === '[') {
      if (depth > 0) out[i] = ' '
      depth++
      continue
    }
    if (c === '}' || c === ')' || c === ']') {
      depth--
      if (depth > 0) out[i] = ' '
      continue
    }
    if (depth > 0 && c !== '\n') out[i] = ' '
  }
  return out.join('')
}

const PROPS_DECL = /export\s+(?:interface|type)\s+(\w*Props)\b/g
const MEMBER = /(?:^|[{;,\n])\s*(?:readonly\s+)?([A-Za-z_$][\w$]*)\s*\??\s*:/g

/**
 * The `{` after a `*Props` declaration is its body ONLY when the between-text is
 * a pure interface/type header (generics, `extends`, `= <intersection>`). A bare
 * type alias (`export type CardEmptyStateProps = EmptyStateProps`, `export type
 * ProjectBoardProps = A | B | C`) has NO body brace — the next `{` in the file
 * belongs to a later declaration or a component body. Reject when the gap
 * contains a statement boundary or a new declaration keyword, so we never
 * mis-attribute another block's members.
 */
function isBodyBrace(gap: string): boolean {
  if (/[;()}]/.test(gap)) return false
  if (/=>/.test(gap)) return false
  if (/\b(?:export|interface|const|function|class|type|return)\b/.test(gap))
    return false
  return true
}

function measure(files: DriftFile[]): DriftInstance[] {
  const instances: DriftInstance[] = []
  for (const { path, text: raw } of files) {
    const text = blankStrings(blankComments(raw))
    PROPS_DECL.lastIndex = 0
    let decl: RegExpExecArray | null
    while ((decl = PROPS_DECL.exec(text))) {
      const propsName = decl[1]
      const afterHeader = decl.index + decl[0].length
      const braceIdx = text.indexOf('{', afterHeader)
      if (braceIdx < 0) continue
      if (!isBodyBrace(text.slice(afterHeader, braceIdx))) continue

      const [body] = braceBody(text, braceIdx)
      const top = topLevelOnly(body)
      const members = new Set<string>()
      MEMBER.lastIndex = 0
      let mm: RegExpExecArray | null
      while ((mm = MEMBER.exec(top))) members.add(mm[1])

      // Qualifying shape: a controlled input = value/checked + the canonical
      // `onChange` change signal. No onChange ⇒ a display-only `value` label.
      if (!members.has('onChange')) continue
      const hasValue = members.has('value')
      const hasChecked = members.has('checked')
      if (!hasValue && !hasChecked) continue

      const missing: string[] = []
      if (hasValue && !members.has('defaultValue')) missing.push('defaultValue')
      if (hasChecked && !members.has('defaultChecked'))
        missing.push('defaultChecked')
      if (missing.length === 0) continue

      const line = text.slice(0, decl.index).split('\n').length
      instances.push({
        file: path,
        line,
        token: `${propsName} missing ${missing.join('+')}`,
      })
    }
  }
  return instances
}

const lint: DriftLint = {
  name: 'missing-uncontrolled-default',
  description:
    'An exported *Props that declares a controlled value/checked + onChange but omits the matching defaultValue/defaultChecked — forcing full controlled usage (a consumer wanting fire-and-forget must wire useState). 27 of 31 stateful-input Props are asymmetric; only CheckboxProps/DropdownProps/SearchableSimpleProps/RadioGroupProps declare the counterpart.',
  canon:
    'A stateful input Props that declares value/checked + onChange must also declare the matching defaultValue/defaultChecked (the React uncontrolled counterpart) so consumers can use it uncontrolled without useState boilerplate.\n\n' +
    'EVIDENCE — React-ecosystem standard: the controlled-input triad is value/checked + onChange + default* (native React DOM elements ship all three; MUI, Radix, React-Aria all mirror the pair). It is NOT the dominant in-repo form (the drift is): the canon is the 4-exemplar minority — CheckboxProps (defaultChecked), DropdownProps/SearchableSimpleProps/RadioGroupProps (defaultValue) — that new stateful-input components must follow. The fix is additive (add an optional default* member threaded as initial state), so this ratchet only needs to hold growth at zero.',
  scope: 'ts',
  measure,
  selftest: {
    bad: [
      // value + onChange, no defaultValue → 1 instance
      'export interface FooProps {\n  value: string\n  onChange: (v: string) => void\n}',
      // checked + onChange, no defaultChecked → 1 instance
      'export interface BarProps {\n  checked: boolean\n  onChange: (next: boolean) => void\n}',
      // type-literal form, value + onChange, no defaultValue → 1 instance
      'export type BazProps = {\n  value?: string\n  onChange?: (v: string) => void\n}',
      // `Omit<…, 'type'|'value'|'onChange'>` header: string-literal keywords in
      // the extends clause must NOT make the guard skip the body (USDFieldProps).
      "export interface QuxProps\n  extends Omit<\n    React.InputHTMLAttributes<HTMLInputElement>,\n    'onChange' | 'value' | 'type'\n  > {\n  value?: string\n  onChange?: (v: string) => void\n}",
    ],
    good: [
      // Declares the uncontrolled counterpart → canonical, not an instance.
      'export interface OkProps {\n  value?: string\n  defaultValue?: string\n  onChange?: (v: string) => void\n}',
      'export interface OkCheckProps {\n  checked?: boolean\n  defaultChecked?: boolean\n  onChange?: (e: unknown) => void\n}',
      // `value` present but NO onChange → a display-only label, not an input.
      'export interface LabelProps {\n  value: string\n  mono?: boolean\n}',
      // Arrow/desync boundary: `value` is only a function PARAM, never a
      // top-level member — must stay masked (the `=> void` must not desync depth).
      'export interface GridProps {\n  onCellSave: (rowId: string, value: string) => void\n  onEditingValueChange: (value: string) => void\n}',
      // Not a *Props-named export → out of scope.
      'export interface FilterState {\n  value: string\n  onChange: (v: string) => void\n}',
      // Bare type alias with no body brace → must not grab the following block.
      'export type AliasProps = OtherProps\n\nexport interface SafeProps {\n  value: string\n  defaultValue?: string\n  onChange: (v: string) => void\n}',
      // The broken shape described in a comment is documentation, not code.
      '/** declares value + onChange but no defaultValue — historical */\nexport interface DocProps {\n  value: string\n}',
    ],
  },
}

export default lint
