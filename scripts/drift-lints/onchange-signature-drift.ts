import type { DriftLint, DriftFile, DriftInstance } from '../lint-drift'

/**
 * DRIFT CLASS: onChange / onSelectionChange callback signature drift.
 *
 * The 2026-07-11 census found four incompatible shapes across the exported
 * *Props of goobs components:
 *   - value-first  `(value) => void`            — the whole Field family + editors
 *                                                  + Filter + Tabs + Toolbar + DataGrid
 *                                                  selection + TransferList (~45 of ~52).
 *   - event-only   `(event) => void`            — RadioGroup (mirrors native <input>).
 *   - event-first  `(event, value) => void`     — Accordion / Button+ButtonGroup /
 *                                                  ToggleButton / Pagination (MUI parity).
 *   - REVERSED     `(value, event) => void`     — Card `CardSelectionCheckboxProps`
 *                                                  (index.tsx:657) ONLY. The aberrant shape.
 *
 * CANON (two sanctioned families, chosen from the counts + React/DOM/MUI
 * convention): if a callback accepts a React event, that event is the FIRST
 * parameter — `(event) => void` or `(event, value) => void` — the ecosystem
 * standard the composites already follow. If it accepts no event, it passes the
 * value(s) directly — `(value) => void` — the dominant Field-family convention.
 * A value placed BEFORE an event (`(value, event) => void`) matches NEITHER
 * family; it is the drift. Under this canon exactly one instance exists today
 * (Card), and the ratchet forbids any new one.
 *
 * DETECTION: within an exported onChange-family function-TYPE member
 * (`onChange?: (...) => void` / `onSelectionChange: (...) => void`), a parameter
 * typed as a React event (`React.<...>Event`) that is NOT the first parameter.
 * value-first (no event), event-only, and event-first `(event, value)` all pass.
 */

/** Blank `//` and block comment content (string-aware, newlines kept) so a
 *  reversed shape shown inside JSDoc is never itself a hit, and apostrophes in
 *  comment prose can't desync the quote walker. Pattern copied from
 *  scripts/a11y-lints/label-input-id-divergence.ts. */
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

/** A parameter type that is a React synthetic/DOM event. All event params in
 *  this repo are namespaced (`React.MouseEvent`, `React.ChangeEvent`,
 *  `React.SyntheticEvent`, …); matching only the namespaced form keeps a plain
 *  domain type ending in "Event" from being mistaken for a callback event. */
const EVENT_TYPE = /\bReact\.\w*Event\b/

/**
 * From the index just after an onChange-family member's `:`, extract the arrow
 * function-TYPE parameter list, or null when the member is not a direct
 * `(...) => void` function type (a runtime handler, an identifier reference, or
 * a union — unions in this codebase are value-first only, so skipping them is a
 * documented, safe under-measure). Return the raw text between the param parens.
 */
function extractArrowParams(text: string, afterColon: number): string | null {
  let i = afterColon
  while (i < text.length && /\s/.test(text[i])) i++
  // A union (`| ((value) => void) | …`) or a grouped fn type is value-first here.
  if (text[i] === '|') return null
  if (text[i] !== '(') return null
  const open = i
  let depth = 0
  for (let j = i; j < text.length; j++) {
    const c = text[j]
    if (c === '(') depth++
    else if (c === ')') {
      depth--
      if (depth === 0) {
        // Confirm the value is a function TYPE: `) => void` / `) => Promise<void>`.
        // Runtime arrows (block/expression bodies) end in `) => {` / `) => expr`
        // and are correctly ignored.
        let k = j + 1
        while (k < text.length && /\s/.test(text[k])) k++
        if (text[k] !== '=' || text[k + 1] !== '>') return null
        k += 2
        while (k < text.length && /\s/.test(text[k])) k++
        const rest = text.slice(k, k + 16)
        if (!/^void\b/.test(rest) && !/^Promise<\s*void/.test(rest)) return null
        return text.slice(open + 1, j)
      }
    }
  }
  return null
}

/** Split a parameter list on top-level commas (respecting <>, {}, (), []). */
function splitParams(params: string): string[] {
  const parts: string[] = []
  let depth = 0
  let start = 0
  for (let i = 0; i < params.length; i++) {
    const c = params[i]
    if (c === '<' || c === '{' || c === '(' || c === '[') depth++
    else if (c === '>' || c === '}' || c === ')' || c === ']') depth--
    else if (c === ',' && depth === 0) {
      parts.push(params.slice(start, i))
      start = i + 1
    }
  }
  parts.push(params.slice(start))
  return parts.map((p) => p.trim()).filter((p) => p.length > 0)
}

const MEMBER = /\b(onChange|onSelectionChange)\s*\??\s*:/g

const lint: DriftLint = {
  name: 'onchange-signature-drift',
  scope: 'ts',
  description:
    'onChange/onSelectionChange callback signatures drifted into four shapes (value-first, event-only, (event,value), reversed (value,event)). A React event, when present, must be the FIRST parameter; a value placed before an event is the drift.',
  canon:
    'An onChange-family callback that accepts a React event takes the event FIRST — `(event) => void` or `(event, value) => void` (RadioGroup / Accordion / Button / ToggleButton / Pagination, the MUI/DOM ecosystem standard); with no event it passes the value(s) directly — `(value) => void` (the dominant goobs Field-family convention). A value BEFORE an event — `(value, event) => void` — matches neither family and is the drift.\n\n' +
    'Evidence that picked it: value-first dominates the census (~45 of ~52 exported onChange-family signatures — the entire Field family, ComplexTextEditor, Filter/Section, Tabs, Toolbar, Checkbox, DataGrid selection, TransferList); event-first `(event, value)` is the sanctioned ecosystem-parity minority on the composites that mirror MUI (Accordion, Button/ButtonGroup, ToggleButton, Pagination); event-only `(event)` (RadioGroup) mirrors native `<input onChange>`. Both families put a React event first, so both are canon. The ONLY signature that places a value before an event is Card `CardSelectionCheckboxProps.onChange` (index.tsx:657) — 1 instance, frozen and forbidden to grow. New code: if you take the native event, it comes first; otherwise pass the value directly.',
  measure(files: DriftFile[]): DriftInstance[] {
    const instances: DriftInstance[] = []
    for (const { path, text: raw } of files) {
      const text = blankComments(raw)
      if (!/\b(onChange|onSelectionChange)\b/.test(text)) continue
      MEMBER.lastIndex = 0
      let m: RegExpExecArray | null
      while ((m = MEMBER.exec(text))) {
        const prop = m[1]
        const params = extractArrowParams(text, m.index + m[0].length)
        if (params === null) continue
        const parts = splitParams(params)
        if (parts.length < 2) continue // event-only or single value — no ordering to reverse
        const eventIdx = parts.findIndex((p) => EVENT_TYPE.test(p))
        if (eventIdx > 0) {
          const line = text.slice(0, m.index).split('\n').length
          instances.push({
            file: path,
            line,
            token: `${prop} reversed (value, React event) — event must come first`,
          })
        }
      }
    }
    return instances
  },
  selftest: {
    bad: [
      // Card's shape: value first, React event second.
      'export interface P {\n  onChange: (next: boolean, event: React.ChangeEvent<HTMLInputElement>) => void\n}',
      // onSelectionChange reversed, multiline params.
      'export interface Q {\n  onSelectionChange?: (\n    ids: string[],\n    e: React.SyntheticEvent\n  ) => void\n}',
    ],
    good: [
      // value-first (the dominant Field convention) — no event at all.
      'export interface A {\n  onChange?: (value: string) => void\n}',
      // event-first (event, value) — the sanctioned composite/MUI-parity form.
      'export interface B {\n  onChange: (event: React.MouseEvent<HTMLElement>, newValue: string | null) => void\n}',
      // event-only — mirrors native <input onChange>; event is first.
      'export interface C {\n  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void\n}',
      // multi-value, no event (TransferList shape).
      'export interface D {\n  onChange: (left: string[], right: string[], dropdownValue?: string) => void\n}',
      // A runtime handler assignment is not a function-TYPE member (block body).
      'const opts = {\n  onChange: (value: string, event: React.ChangeEvent) => { setV(value) },\n}',
      // Value-first union (DataGridFilter shape) — no event, matches the value family.
      'export interface F {\n  onChange:\n    | ((value: DropdownOption | null) => void)\n    | ((value: { start: Date | null; end: Date | null }) => void)\n}',
      // The reversed shape shown inside a comment is documentation, not code.
      '/** legacy onChange: (value, event) — reversed; now fixed */\nexport interface G {\n  onChange?: (value: string) => void\n}',
    ],
  },
}

export default lint
