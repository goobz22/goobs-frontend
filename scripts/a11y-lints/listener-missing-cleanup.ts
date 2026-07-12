import type { A11yLint, LintFile, Violation } from '../lint-a11y'

/**
 * CLASS: listener-missing-cleanup (WCAG 1.4.13 / robustness — a11y-adjacent
 * memory-and-focus hygiene).
 *
 * SHAPE: a DOM `addEventListener` call inside a `useEffect` / `useLayoutEffect`
 * callback body whose SAME effect provides NO teardown for it. React runs an
 * effect's cleanup return on every re-run and on unmount; a listener registered
 * in an effect with no matching teardown is added AGAIN on every re-run and is
 * NEVER removed on unmount. The consequences are real accessibility/robustness
 * defects, not just leaks:
 *   • a `keydown`/`resize`/`scroll`/`click` handler on `document`/`window` that
 *     survives unmount keeps firing against a torn-down component — stale focus
 *     traps, "Escape closes a dialog that isn't there", ghost reposition math;
 *   • duplicate registration means the handler runs N times per event, so a
 *     focus-restore / announce / preventDefault fires repeatedly and fights the
 *     live UI.
 * A managed overlay's focus contract (move-in / trap Tab / Escape / restore)
 * only holds if its listeners are torn down deterministically — an un-cleaned
 * `document.addEventListener('keydown', …)` is exactly how a "focus trap" leaks
 * into sibling surfaces.
 *
 * ── What counts as a violation ──────────────────────────────────────────────
 * An `addEventListener(` call whose innermost enclosing `useEffect(` /
 * `useLayoutEffect(` CALL provides none of the recognised teardowns for it:
 *   1. a `removeEventListener` for the SAME event name anywhere in that effect
 *      (the returned cleanup — including a ref cleaned in the same return); OR
 *   2. the AbortController pattern — the listener is given a `signal` option AND
 *      the effect calls `.abort(` (the returned `ctrl.abort()` tears every
 *      signal-bound listener down at once); OR
 *   3. the listener is a ONE-SHOT — `{ once: true }` in the call's options — so
 *      the browser removes it after it fires once and no manual teardown is owed.
 * If the add event name is dynamic (a variable, not a literal), ANY
 * `removeEventListener` / abort / once in the effect clears it (lenient — a
 * false positive is worse than a missed edge, per the README).
 *
 * ── Escape hatches ENCODED in the check (never a file ignore-list) ───────────
 *   • `{ once: true }` — self-removing, teardown not owed (§3 above). This also
 *     covers the common "add a one-shot `mouseup`/`transitionend` inside an
 *     EVENT HANDLER" idiom.
 *   • AbortController `signal` + a returned `ctrl.abort()` (§2 above).
 *   • listeners on a captured ref/node cleaned in the same return (§1 — the
 *     `el.addEventListener('input', h); return () => el.removeEventListener(...)`
 *     shape).
 *   • listeners added OUTSIDE any effect — in an event handler, a module-scope
 *     guard (`if (typeof window !== 'undefined') window.addEventListener(…)`),
 *     or a `useCallback` — are NOT part of this class (their teardown, if any,
 *     lives in a separate unmount effect or the browser owns it). Only
 *     effect-registered listeners are in scope.
 *
 * Comment/JSDoc text is blanked before scanning (an apostrophe in a `//` note
 * desyncs a naive string walker — a proven incident), and every span is matched
 * brace/paren/string/template-aware so a `)` inside `` `${…}` `` or an arrow
 * body never terminates a span early.
 */

/**
 * Replace the CONTENT of `//` and block/JSDoc comments with spaces, preserving
 * every newline so byte offsets and line numbers are unchanged. String-aware so
 * a `//` inside a string (an `https://` URL) is not mistaken for a comment.
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
 * Given `text[openIdx]` is one of `(` `{` `[`, return the index of its matching
 * close delimiter, or -1 if unterminated. Fully string- and template-literal
 * aware: `${…}` interpolations re-enter code mode (so a `)` inside a template
 * expression is counted) while raw template text is skipped.
 */
function matchDelim(text: string, openIdx: number): number {
  const pairs: Record<string, string> = { '(': ')', '{': '}', '[': ']' }
  type Frame = { type: 'delim'; close: string } | { type: 'tmpl'; inExpr: boolean }
  const stack: Frame[] = []
  let strMode: string | null = null // "'" or '"' while inside a normal string
  for (let i = openIdx; i < text.length; i++) {
    const c = text[i]
    if (strMode) {
      if (c === '\\') {
        i++
        continue
      }
      if (c === strMode) strMode = null
      continue
    }
    const top = stack[stack.length - 1]
    // Raw template text (a `tmpl` frame not currently inside a `${…}` expr).
    if (top && top.type === 'tmpl' && !top.inExpr) {
      if (c === '\\') {
        i++
        continue
      }
      if (c === '`') {
        stack.pop()
        continue
      }
      if (c === '$' && text[i + 1] === '{') {
        top.inExpr = true
        stack.push({ type: 'delim', close: '}' })
        i++
        continue
      }
      continue
    }
    // Code mode.
    if (c === "'" || c === '"') {
      strMode = c
      continue
    }
    if (c === '`') {
      stack.push({ type: 'tmpl', inExpr: false })
      continue
    }
    if (c === '(' || c === '{' || c === '[') {
      stack.push({ type: 'delim', close: pairs[c] })
      continue
    }
    if (c === ')' || c === '}' || c === ']') {
      stack.pop()
      const newTop = stack[stack.length - 1]
      if (newTop && newTop.type === 'tmpl' && newTop.inExpr) newTop.inExpr = false
      if (stack.length === 0) return i
      continue
    }
  }
  return -1
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

/** Effect call spans: [openParen, closeParen] of every `useEffect(`/`useLayoutEffect(`. */
const EFFECT_RE = /(?<![A-Za-z0-9_$])(?:useEffect|useLayoutEffect)\s*\(/g
/** A DOM listener add/remove METHOD call (dot-invoked or bare), followed by `(`. */
const ADD_RE = /(?<![A-Za-z0-9_$])addEventListener\s*\(/g
const REMOVE_RE = /(?<![A-Za-z0-9_$])removeEventListener\s*\(/g

interface Span {
  open: number
  close: number
}

/** All effect call paren-spans in the file. */
function effectSpans(text: string): Span[] {
  const spans: Span[] = []
  EFFECT_RE.lastIndex = 0
  let m: RegExpExecArray | null
  while ((m = EFFECT_RE.exec(text))) {
    const open = m.index + m[0].length - 1 // index of the '('
    const close = matchDelim(text, open)
    if (close !== -1) spans.push({ open, close })
  }
  return spans
}

/** Innermost (smallest) span that strictly contains `offset`, or null. */
function innermostContaining(spans: Span[], offset: number): Span | null {
  let best: Span | null = null
  for (const s of spans) {
    if (offset > s.open && offset < s.close) {
      if (!best || s.close - s.open < best.close - best.open) best = s
    }
  }
  return best
}

/** The first top-level argument text of a call whose `(` is at `open`. */
function firstArg(text: string, open: number): string {
  const close = matchDelim(text, open)
  if (close === -1) return ''
  const inner = text.slice(open + 1, close)
  // Find the first top-level comma.
  let depth = 0
  let strMode: string | null = null
  let tmplDepth = 0
  for (let i = 0; i < inner.length; i++) {
    const c = inner[i]
    if (strMode) {
      if (c === '\\') {
        i++
        continue
      }
      if (c === strMode) strMode = null
      continue
    }
    if (c === "'" || c === '"' || c === '`') {
      strMode = c
      continue
    }
    if (c === '(' || c === '{' || c === '[') depth++
    else if (c === ')' || c === '}' || c === ']') depth--
    else if (c === ',' && depth === 0 && tmplDepth === 0) return inner.slice(0, i).trim()
  }
  return inner.trim()
}

/** The full inner argument text of a call whose `(` is at `open`. */
function callArgs(text: string, open: number): string {
  const close = matchDelim(text, open)
  if (close === -1) return ''
  return text.slice(open + 1, close)
}

/**
 * Extract a static event-name string from a first-argument expression, or null
 * if it is dynamic (a variable / concatenation / interpolated template).
 */
function staticEventName(arg: string): string | null {
  const quoted = /^\s*(['"])((?:[^'"\\]|\\.)*)\1\s*$/.exec(arg)
  if (quoted) return quoted[2]
  const tmpl = /^\s*`([^`$\\]*)`\s*$/.exec(arg) // backtick with no ${…} and no escapes
  if (tmpl) return tmpl[1]
  return null
}

const lint: A11yLint = {
  name: 'listener-missing-cleanup',
  wcag: '4.1.2',
  description:
    'A DOM addEventListener registered inside a useEffect/useLayoutEffect whose ' +
    'same effect provides no teardown for it — no removeEventListener for the ' +
    'same event, no returned AbortController .abort() for a signal-bound ' +
    'listener, and not a { once: true } one-shot. The listener is re-added on ' +
    'every effect re-run and never removed on unmount, so a keydown/resize/' +
    'scroll/click handler keeps firing against a torn-down component (stale ' +
    'focus traps, ghost reposition, N-times duplicate handlers). Fix at the ' +
    'root: return a cleanup that removes the listener (or abort a signal). ' +
    'Listeners added outside an effect (event handlers, module-scope guards) ' +
    'are out of scope.',
  check(files: LintFile[]): Violation[] {
    const violations: Violation[] = []
    for (const { path, text: raw } of files) {
      const text = blankComments(raw)
      if (!/addEventListener/.test(text)) continue
      const spans = effectSpans(text)
      if (spans.length === 0) continue
      const nl = newlineIndex(text)

      ADD_RE.lastIndex = 0
      let m: RegExpExecArray | null
      while ((m = ADD_RE.exec(text))) {
        const paren = m.index + m[0].length - 1 // index of the '('
        const span = innermostContaining(spans, paren)
        if (!span) continue // not inside any effect — out of scope

        const args = callArgs(text, paren)
        // Escape hatch: one-shot self-removing listener.
        if (/\bonce\s*:\s*true\b/.test(args)) continue

        const eventName = staticEventName(firstArg(text, paren))
        const signalBound = /\bsignal\b/.test(args)

        // Escape hatch: AbortController — signal-bound + the effect aborts.
        const spanText = text.slice(span.open, span.close + 1)
        if (signalBound && /\.abort\s*\(/.test(spanText)) continue

        // Cleanup: a removeEventListener for the same event in this effect.
        let cleaned = false
        REMOVE_RE.lastIndex = 0
        let r: RegExpExecArray | null
        while ((r = REMOVE_RE.exec(spanText))) {
          const rParen = r.index + r[0].length - 1
          const rEvent = staticEventName(firstArg(spanText, rParen))
          // Dynamic add-name OR dynamic remove-name → treat any remove as a match.
          if (eventName === null || rEvent === null || rEvent === eventName) {
            cleaned = true
            break
          }
        }
        if (cleaned) continue

        violations.push({
          file: path,
          line: offsetToLine(nl, m.index),
          message:
            `addEventListener(${eventName ? `'${eventName}'` : '…'}) inside an ` +
            'effect with no teardown — return a cleanup that ' +
            `removeEventListener(${eventName ? `'${eventName}'` : '…'}) ` +
            '(or abort a { signal }, or use { once: true }); otherwise it is ' +
            're-added on every re-run and keeps firing after unmount.',
        })
      }
    }
    return violations
  },
  selftest: {
    bad: [
      // no teardown at all
      `export const A = () => {
        useEffect(() => {
          window.addEventListener('resize', onResize)
        }, [])
        return null
      }`,
      // cleanup removes a DIFFERENT event (scroll) than the one added (resize)
      `export const B = () => {
        useEffect(() => {
          window.addEventListener('resize', f)
          return () => window.removeEventListener('scroll', f)
        }, [])
        return null
      }`,
      // useLayoutEffect, no teardown
      `export const C = () => {
        useLayoutEffect(() => {
          document.addEventListener('keydown', handleKey)
        }, [])
        return null
      }`,
      // signal-bound BUT the effect never aborts (no teardown for the signal)
      `export const D = () => {
        useEffect(() => {
          const ctrl = new AbortController()
          window.addEventListener('resize', f, { signal: ctrl.signal })
        }, [])
        return null
      }`,
    ],
    good: [
      // inline ref cleanup — same event removed in the return
      `export const E = () => {
        useEffect(() => {
          const el = ref.current
          if (!el) return
          el.addEventListener('input', h)
          return () => el.removeEventListener('input', h)
        }, [])
        return null
      }`,
      // one-shot listener (self-removing) inside an effect
      `export const F = () => {
        useEffect(() => {
          document.addEventListener('transitionend', done, { once: true })
        }, [])
        return null
      }`,
      // AbortController: signal-bound + returned abort tears it down
      `export const G = () => {
        useEffect(() => {
          const ctrl = new AbortController()
          window.addEventListener('resize', f, { signal: ctrl.signal })
          window.addEventListener('scroll', f, { signal: ctrl.signal })
          return () => ctrl.abort()
        }, [])
        return null
      }`,
      // listener added in an EVENT HANDLER (not an effect) — out of scope; a
      // separate unmount effect owns teardown (the Subnet/VLAN stepper shape)
      `export const H = () => {
        const onDown = useCallback(() => {
          document.addEventListener('mouseup', clearTimers)
        }, [clearTimers])
        useEffect(() => {
          return () => document.removeEventListener('mouseup', clearTimers)
        }, [clearTimers])
        return null
      }`,
      // module-scope guarded listener — not inside any effect
      `if (typeof window !== 'undefined') {
        window.addEventListener('resize', globalHandler)
      }
      export const I = () => null`,
      // handler-added one-shot with { once: true } — out of scope AND self-removing
      `export const J = () => {
        const onDown = () => {
          document.addEventListener('mouseup', clear, { once: true })
        }
        return <button onMouseDown={onDown}>x</button>
      }`,
      // two listeners in one effect, both removed (same events) in the return
      `export const K = () => {
        useEffect(() => {
          window.addEventListener('scroll', reposition, true)
          window.addEventListener('resize', reposition)
          return () => {
            window.removeEventListener('scroll', reposition, true)
            window.removeEventListener('resize', reposition)
          }
        }, [])
        return null
      }`,
    ],
  },
}

export default lint
