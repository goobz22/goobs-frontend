import type { A11yLint, LintFile, Violation } from '../lint-a11y'

/**
 * ── missing-autocomplete-purpose (WCAG 1.3.5 Identify Input Purpose, AA) ──
 *
 * An input that collects a user's own PERSONAL data must expose the matching
 * `autocomplete` token so browsers, password managers and assistive tech can
 * identify the field's purpose and offer the user's stored value (WCAG 1.3.5).
 * For a field whose purpose the COMPONENT already knows — a phone field, a
 * card-number field, a card-CSC field, a password field, or ANY input that
 * declares `type="email"`/`type="tel"` — the token must be present BY DEFAULT,
 * not left to whether a consumer happened to pass an `autoComplete` prop. A bare
 * pass-through (`autoComplete={autoComplete}` with no fallback) emits NOTHING
 * when the consumer omits the prop, so the purpose goes undeclared for every
 * default callsite. This is the class the 2026-07 audit found: the fixes largely
 * existed (PhoneNumber defaults `'tel'`, CreditCardNumber `'cc-number'`, CVV
 * `'cc-csc'`) but the gate that keeps them from regressing did not.
 *
 * ── THE TWO SHAPES THIS MODULE DETECTS ──
 *
 * SHAPE 1 — a personal-data COMPONENT (detected by file path) whose rendered
 * `<input>`/`<textarea>` lacks a GUARANTEED autocomplete token. The four goobs
 * Field leaves whose entire domain is personal data are PhoneNumber, Password,
 * Number/CreditCardNumber and Number/CVV. Password's `type` is a
 * `passwordVisible ? 'text' : 'password'` ternary — not a literal — so only the
 * file-path signal catches it; it must default to a password autocomplete token
 * (`'current-password'`, or a caller `'new-password'` on signup).
 *
 * SHAPE 2 — ANY JSX element that declares a literal `type="email"` or
 * `type="tel"` (raw `<input>` OR a goobs input primitive like `<TextField>`)
 * whose opening tag lacks a guaranteed autocomplete token. Declaring the input's
 * purpose via `type` but not via `autocomplete` is precisely the 1.3.5 gap.
 *
 * A "GUARANTEED token" = an `autoComplete` attribute whose value is a STRING
 * LITERAL (`autoComplete="cc-number"`) or an expression with a string-literal
 * fallback (`autoComplete={autoComplete ?? 'tel'}` / `{autoComplete || 'email'}`)
 * — the consumer prop still wins, but a default is always emitted. A bare
 * `autoComplete={autoComplete}` (no literal) or a missing attribute is the gap.
 *
 * ── ENCODED EXEMPTIONS (in the CHECK, never an ignore-list) ──
 *  1. Bank account / routing numbers (Number/AccountNumber, Number/RoutingNumber)
 *     have NO standard WHATWG autocomplete token — there is simply no
 *     `account-number`/`routing-number` value in the spec — so they are NOT in
 *     the personal-data file set and their inputs (`type="text"`) are NOT
 *     flagged. Documented here as the intentional exemption.
 *  2. The generic TextField / IPAM leaves render `type={type}` (a variable, not a
 *     literal email/tel) and expose an `autoComplete` prop for the consumer to
 *     set the purpose they alone know. Not a fixed-purpose input → not flagged.
 *     Under-measuring this component-inferred ambiguity is deliberate: false
 *     positives poison the gate.
 *  3. Any expression whose autocomplete value contains a string literal is
 *     treated as guaranteed (we do not try to prove the literal is a real token)
 *     — under-measuring toward "has a default" keeps the false-positive rate at
 *     zero.
 */

/** Personal-data component files whose input MUST default an autocomplete token. */
const PERSONAL_DATA_FILE =
  /\/Field\/(PhoneNumber|Password|Number\/(CreditCardNumber|CVV))\//

/** A literal `type="email"` / `type='tel'` attribute (declared input purpose). */
const EMAIL_TEL_TYPE = /\btype\s*=\s*(["'])(email|tel)\1/

/**
 * Blank the CONTENT of `//` and block comments to spaces (newlines preserved so
 * offsets/line numbers are unchanged), string-aware so a `//` inside an
 * `https://` value or a JSDoc `type="email"` example is never scanned as code.
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
 * inclusive index of the tag-closing `>` and the opening-tag body. Brace- and
 * string-aware so a `>` inside `onChange={a > b}` or a template literal is not
 * mistaken for the terminator. Returns null if unterminated.
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
    if (c === '>' && depth === 0)
      return { end: i, body: text.slice(tagStart, i + 1) }
  }
  return null
}

/** Every JSX opening tag in `text`: its name, `<` offset, and opening-tag body.
 *  String-aware so `<input` inside a string literal is not read as a tag; the
 *  `(?=[\s/>])` guard stops `a<b` / `Array<string>` generics from matching. */
function enumerateTags(
  text: string
): { name: string; start: number; body: string }[] {
  const tags: { name: string; start: number; body: string }[] = []
  const NAME = /^<([A-Za-z][A-Za-z0-9.]*)(?=[\s/>])/
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
    if (c === '<') {
      const nameMatch = NAME.exec(text.slice(i))
      if (nameMatch) {
        const opened = readOpeningTag(text, i)
        if (opened) {
          tags.push({ name: nameMatch[1], start: i, body: opened.body })
          i = opened.end // skip the opening tag's attributes; resume after `>`
          continue
        }
      }
    }
  }
  return tags
}

/** Capture the content between `rest[0] === '{'` and its matching `}` (string-
 *  and brace-aware). Returns '' if unbalanced. */
function captureBraces(rest: string): string {
  let depth = 0
  let str: string | null = null
  for (let i = 0; i < rest.length; i++) {
    const c = rest[i]
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
      if (depth === 0) return rest.slice(1, i)
    }
  }
  return ''
}

/**
 * True when the opening-tag body supplies a GUARANTEED autocomplete token: a
 * string-literal value, or an expression carrying a string-literal fallback.
 * `autoComplete={autoComplete}` (bare, no literal) and a missing attribute are
 * NOT guaranteed.
 */
function hasGuaranteedAutocomplete(body: string): boolean {
  const m = /\bautoComplete\s*=\s*/.exec(body)
  if (!m) return false
  const rest = body.slice(m.index + m[0].length)
  const first = rest[0]
  if (first === '"' || first === "'") return true // string-literal token
  if (first === '{') return /['"]/.test(captureBraces(rest)) // literal fallback?
  return false
}

const lint: A11yLint = {
  name: 'missing-autocomplete-purpose',
  wcag: '1.3.5',
  description:
    "A fixed-purpose personal-data input must default the matching autocomplete token (WCAG 1.3.5 Identify Input Purpose). SHAPE 1: a goobs Field leaf whose whole domain is personal data (PhoneNumber, Password, Number/CreditCardNumber, Number/CVV) whose rendered <input>/<textarea> lacks a guaranteed autoComplete default (string literal, or an expression with a string-literal fallback like autoComplete={autoComplete ?? 'tel'}). SHAPE 2: any element declaring a literal type=\"email\"/type=\"tel\" whose tag lacks a guaranteed autoComplete token. A bare autoComplete={autoComplete} (no literal fallback) emits nothing by default and is the gap — add an additive default; the consumer prop still wins. Encoded exemptions: bank AccountNumber/RoutingNumber have NO standard WHATWG token so they are not flagged; the generic TextField/IPAM leaves render type={type} (not a literal email/tel) and delegate purpose to a consumer autoComplete prop.",
  check(files: LintFile[]): Violation[] {
    const violations: Violation[] = []
    for (const { path, text: raw } of files) {
      const text = blankComments(raw)
      // Fast skip: only files that could hold a personal-data-purpose input.
      const personalFile = PERSONAL_DATA_FILE.test(path)
      if (!personalFile && !EMAIL_TEL_TYPE.test(text)) continue

      const lineAt = (offset: number) =>
        text.slice(0, offset).split('\n').length

      for (const tag of enumerateTags(text)) {
        const nameLc = tag.name.toLowerCase()
        const rawInput = nameLc === 'input' || nameLc === 'textarea'
        const declaresEmailTel = EMAIL_TEL_TYPE.test(tag.body)

        const shape1 = personalFile && rawInput
        const shape2 = declaresEmailTel
        if (!shape1 && !shape2) continue
        if (hasGuaranteedAutocomplete(tag.body)) continue

        const message = shape2
          ? `input declares type="email"/"tel" but its rendered input lacks a guaranteed autocomplete token — add autoComplete (WCAG 1.3.5 Identify Input Purpose), e.g. autoComplete="email"/"tel" or a default like autoComplete={autoComplete ?? 'email'} so the purpose is exposed on every default callsite`
          : `personal-data Field input has no default autocomplete token — this component's purpose is known, so default the matching token (WCAG 1.3.5), e.g. autoComplete={autoComplete ?? 'current-password'} (consumer prop still wins). A bare autoComplete={autoComplete} emits nothing when the prop is omitted`
        violations.push({ file: path, line: lineAt(tag.start), message })
      }
    }
    return violations
  },
  selftest: {
    bad: [
      // type="tel" input with no autocomplete at all.
      '<input type="tel" value={v} onChange={f} />',
      // type="email" input with a BARE pass-through (no literal fallback).
      '<input type="email" value={v} autoComplete={autoComplete} />',
      // component primitive declaring an email input, no autocomplete.
      '<TextField type="email" value={v} onChange={f} label="Email" />',
      // multi-line tel input, attributes spanning lines, no autocomplete.
      'const X = () => (\n  <input\n    type="tel"\n    name="phone"\n    value={v}\n  />\n)',
    ],
    good: [
      // defaulted token — consumer prop wins, literal fallback guarantees a value.
      "<input type='tel' autoComplete={autoComplete ?? 'tel'} />",
      // literal token.
      '<input type="email" autoComplete="email" />',
      // logical-OR literal fallback is also a guaranteed default.
      "<input type='email' autoComplete={autoComplete || 'email'} />",
      // a plain text input (the AccountNumber/RoutingNumber bank-field exemption
      // shape) declares no email/tel purpose and is not a personal-data file →
      // not flagged.
      '<input type="text" value={v} onChange={f} />',
      // the broken shape inside a comment is documentation, not code.
      "/* example: <input type='tel' /> with no autocomplete */\nconst Y = () => <input type='email' autoComplete='email' />",
    ],
  },
}

export default lint
