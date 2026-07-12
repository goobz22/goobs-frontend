import type { DriftFile, DriftInstance, DriftLint } from '../lint-drift'

/**
 * DRIFT CLASS: undocumented public prop members.
 *
 * goobs-frontend ships NO prose API docs and NO generated site — the JSDoc on a
 * public prop IS the library's documentation: it is what a consumer sees in
 * editor IntelliSense/hover, and the dominant repo convention is a `/** … *​/`
 * block immediately above every member of an exported `…Props` / `…Styles`
 * interface (see Accordion/Alert/AppBar/Badge, whose Styles + Props members are
 * fully documented). At the discovery census ~412 of ~1349 top-level members
 * (~30%) still lacked that block — a systematic gap. New/edited exported
 * surface must document what it adds, so the gap can only shrink.
 *
 * DETECTION: for every `export interface X {…}` and `export type X = {…}` whose
 * name ends in `Props` or `Styles`, each TOP-LEVEL member (a property or method
 * signature at the interface's own brace depth) that does NOT have a `/** … *​/`
 * doc block on the line immediately above it (or ending on its own line) is an
 * instance. Only the interface's OWN members are scanned:
 *   - members of a NESTED inline object type (e.g. an inline `styles?: {…}`) sit
 *     one brace level deeper and are NOT counted — they belong to an anonymous
 *     type, and the dedicated `…Styles` interfaces cover the style surface;
 *   - inherited members from an `extends`/intersection clause are NOT counted —
 *     they are documented upstream on the base interface (only the `{…}` body is
 *     scanned, never the heritage clause);
 *   - index signatures (`[key: string]: …`) and unnamed call signatures are
 *     skipped — they have no prop name to document.
 *
 * CANON (what new code must do): every public prop member carries a JSDoc block.
 *
 * COMMENT-SAFETY: comment interiors AND string/template-literal interiors are
 * blanked (string-aware, newlines preserved) before any structural scan, so an
 * apostrophe in prose can't desync quote tracking, a `` `${x}px` `` template
 * type can't inject phantom braces into depth counting, and a member-shaped
 * phrase inside a JSDoc can't be read as a real member. The doc-block line set
 * is recorded during that same pass (a `/**`-opened block), which is what a
 * member's documentation status is checked against.
 */

/** Blank `//`, `/* … *​/` comment interiors AND '…'/"…"/`…` string interiors
 *  (newlines preserved), while recording the 1-indexed lines covered by a
 *  `/**`-opened doc block. Structural scanning runs on the returned `masked`;
 *  documentation status is checked against `docLines`. */
function analyze(text: string): { masked: string; docLines: Set<number> } {
  const out = text.split('')
  const docLines = new Set<number>()
  let line = 1
  let i = 0
  const n = text.length
  while (i < n) {
    const c = text[i]
    // string / template literal — blank the interior, keep the quotes
    if (c === "'" || c === '"' || c === '`') {
      const quote = c
      i++
      while (i < n) {
        const d = text[i]
        if (d === '\n') {
          line++
          i++
          continue
        }
        if (d === '\\') {
          out[i] = ' '
          i++
          if (i < n && text[i] !== '\n') {
            out[i] = ' '
            i++
          }
          continue
        }
        if (d === quote) {
          i++
          break
        }
        out[i] = ' '
        i++
      }
      continue
    }
    // line comment
    if (c === '/' && text[i + 1] === '/') {
      while (i < n && text[i] !== '\n') {
        out[i] = ' '
        i++
      }
      continue
    }
    // block comment (JSDoc when it opens with `/**`)
    if (c === '/' && text[i + 1] === '*') {
      const isDoc = text[i + 2] === '*'
      const startLine = line
      out[i] = ' '
      out[i + 1] = ' '
      i += 2
      while (i < n && !(text[i] === '*' && text[i + 1] === '/')) {
        if (text[i] === '\n') line++
        else out[i] = ' '
        i++
      }
      if (i < n) {
        out[i] = ' '
        out[i + 1] = ' '
        i += 2
      }
      if (isDoc) for (let L = startLine; L <= line; L++) docLines.add(L)
      continue
    }
    if (c === '\n') line++
    i++
  }
  return { masked: out.join(''), docLines }
}

const HEADER =
  /export\s+(interface|type)\s+([A-Za-z_$][\w$]*(?:Props|Styles))\b/g

/** After a `type X =`, the object body must open IMMEDIATELY (`= {`); anything
 *  else (a union, an alias, an `A & {…}` intersection) has no directly-declared
 *  members here — under-measure rather than risk grabbing an unrelated brace. */
const TYPE_ASSIGN_OBJECT = /^\s*=\s*\{/

/** A named property/method member start: optional `readonly`, then an
 *  identifier or quoted key, optional `?`/`!`, then `:` (property) or `(`/`<`
 *  (method). Index signatures and call signatures are excluded before this. */
const MEMBER = /^(?:readonly\s+)?(?:'[^']*'|"[^"]*"|[A-Za-z_$][\w$]*)\s*[?!]?\s*[:(<]/
const INDEX_OR_CALL = /^(?:readonly\s+)?[[(]/
const KEY = /^(?:readonly\s+)?('[^']*'|"[^"]*"|[A-Za-z_$][\w$]*)/

/** Find the object-body `{ … }` for a declaration whose header match ends at
 *  `afterHeader`. For an interface, skip the (possibly multi-line, generic)
 *  `extends` clause to the first brace at angle-depth 0. Returns null when there
 *  is no scannable object body (non-object type alias). */
function findBody(
  masked: string,
  kind: string,
  afterHeader: number
): { open: number; close: number } | null {
  const n = masked.length
  if (kind === 'type') {
    if (!TYPE_ASSIGN_OBJECT.test(masked.slice(afterHeader, afterHeader + 200)))
      return null
  }
  let angle = 0
  let open = -1
  for (let i = afterHeader; i < n; i++) {
    const c = masked[i]
    if (c === '<') angle++
    else if (c === '>') {
      if (angle > 0) angle--
    } else if (c === '{' && angle === 0) {
      open = i
      break
    } else if (c === ';' && angle === 0) {
      // statement ended before any body brace — nothing to scan
      return null
    }
  }
  if (open < 0) return null
  let depth = 0
  for (let i = open; i < n; i++) {
    const c = masked[i]
    if (c === '{') depth++
    else if (c === '}') {
      depth--
      if (depth === 0) return { open, close: i }
    }
  }
  return null
}

const lint: DriftLint = {
  name: 'undocumented-public-props',
  scope: 'ts',
  description:
    'A top-level member of an exported …Props/…Styles interface (or `type … = {…}`) has no /** … */ JSDoc block immediately above it. IntelliSense is this library\'s only API documentation, so every public prop member must carry JSDoc; add a doc block above the member.',
  canon:
    'Every public prop member carries a /** … */ JSDoc block on the line immediately above it.\n\n' +
    'Evidence: goobs-frontend publishes no prose/generated API docs — the JSDoc surfaced in editor IntelliSense IS the documentation a consumer reads. The dominant form across exported …Props/…Styles interfaces (Accordion, Alert, AppBar, Avatar, Badge, …) is a per-member doc block; at the census ~937 of ~1349 top-level members (~70%) already had one. New/edited surface must document what it adds; the baseline freezes today\'s per-file gap and can only shrink.',
  measure(files: DriftFile[]): DriftInstance[] {
    const instances: DriftInstance[] = []
    for (const { path, text } of files) {
      const { masked, docLines } = analyze(text)
      // Offset -> 1-indexed line, via cumulative newline count.
      const lineStarts: number[] = [0]
      for (let i = 0; i < masked.length; i++)
        if (masked[i] === '\n') lineStarts.push(i + 1)
      const lineOf = (off: number): number => {
        // binary search: largest index whose start <= off
        let lo = 0
        let hi = lineStarts.length - 1
        while (lo < hi) {
          const mid = (lo + hi + 1) >> 1
          if (lineStarts[mid] <= off) lo = mid
          else hi = mid - 1
        }
        return lo + 1
      }
      const rawLines = text.split('\n')
      const maskedLines = masked.split('\n')

      HEADER.lastIndex = 0
      let hm: RegExpExecArray | null
      while ((hm = HEADER.exec(masked))) {
        const kind = hm[1]
        const body = findBody(masked, kind, hm.index + hm[0].length)
        if (!body) continue
        // Brace/paren/bracket depth just after the body-opening `{`.
        // Members sit one level below the surrounding declaration.
        const openLine = lineOf(body.open)
        const closeLine = lineOf(body.close)
        // Depth relative to the body: 0 == this interface's own member level.
        // Start AFTER the opening `{` so top-level members sit at depth 0.
        let depth = 0
        let atLineStart = false
        let curLine = openLine
        for (let i = body.open + 1; i < body.close; i++) {
          const c = masked[i]
          if (c === '\n') {
            curLine++
            atLineStart = true
            continue
          }
          if (atLineStart) {
            atLineStart = false
            // Evaluate this line as a potential member only at member level.
            if (
              depth === 0 &&
              curLine > openLine &&
              curLine < closeLine
            ) {
              const mLine = maskedLines[curLine - 1] ?? ''
              const trimmed = mLine.replace(/^\s+/, '')
              if (
                trimmed &&
                MEMBER.test(trimmed) &&
                !INDEX_OR_CALL.test(trimmed)
              ) {
                const documented =
                  docLines.has(curLine) || docLines.has(curLine - 1)
                if (!documented) {
                  const rawTrimmed = (rawLines[curLine - 1] ?? '').replace(
                    /^\s+/,
                    ''
                  )
                  const key = KEY.exec(rawTrimmed)?.[1] ?? 'member'
                  instances.push({
                    file: path,
                    line: curLine,
                    token: `${hm[2]}.${key.replace(/['"]/g, '')}`,
                  })
                }
              }
            }
          }
          if (c === '{' || c === '(' || c === '[') depth++
          else if (c === '}' || c === ')' || c === ']') {
            if (depth > 0) depth--
          }
        }
      }
    }
    return instances
  },
  selftest: {
    bad: [
      // undocumented members in an exported Props interface
      'export interface FooProps {\n  value: string\n  onChange?: (v: string) => void\n}',
      // a Styles interface with one undocumented member
      'export interface FooStyles {\n  /** ok */\n  color?: string\n  padding?: string\n}',
      // type = { … } object literal with an undocumented member
      'export type BarProps = {\n  label?: string\n}',
      // nested inline object: the TOP-LEVEL `styles` member is undocumented
      'export interface BazProps {\n  styles?: {\n    /** documented nested */\n    theme?: string\n  }\n}',
      // a `//` line comment above a member is NOT a JSDoc doc block
      'export interface QuxProps {\n  // not jsdoc\n  size?: number\n}',
    ],
    good: [
      // every member documented with a /** … */ block (single + multi line)
      'export interface FooProps {\n  /** The current value. */\n  value: string\n  /**\n   * Change handler.\n   */\n  onChange?: (v: string) => void\n}',
      // extends/heritage members are documented upstream — body-only, none here
      'export interface FooProps extends Omit<\n  React.HTMLAttributes<HTMLDivElement>,\n  "color"\n> {\n  /** Accessible label. */\n  label: string\n}',
      // index signature is skipped (no prop name to document)
      'export interface MapProps {\n  [key: string]: string\n}',
      // nested object members are one level deeper; the top-level styles member
      // is documented and the nested member is not counted as this class
      'export interface BazProps {\n  /** Styling. */\n  styles?: {\n    theme?: string\n  }\n}',
      // a non-object type alias has no directly-declared members to scan
      'export type UnionProps = AProps | BProps',
      // an interface NOT ending in Props/Styles is entirely out of scope
      'export interface TaskMeeting {\n  id: string\n}',
      // the broken shape described inside a JSDoc is documentation, not code
      'export interface FooProps {\n  /** historically `value: string` was undocumented; now fixed */\n  value: string\n}',
      // a template-literal type carries braces; blanking keeps depth sane and
      // the documented member yields no instance
      'export interface SizeProps {\n  /** CSS length. */\n  width?: `${number}px`\n}',
    ],
  },
}

export default lint
