import type { A11yLint, LintFile, Violation } from '../lint-a11y'

/**
 * CLASS: missing-dialog-focus-trap (WCAG 2.4.3 Focus Order, 4.1.2 Name/Role/Value).
 *
 * An element that DECLARES ITSELF a MODAL dialog — `role="dialog"` or
 * `role="alertdialog"` together with a truthy `aria-modal` — promises assistive
 * tech and keyboard users the WAI-ARIA APG Dialog(Modal) contract:
 *   1. focus MOVES INTO the surface when it opens (so AT announces it and the
 *      keyboard user lands inside, not on the now-obscured trigger),
 *   2. Tab is TRAPPED inside the surface while it is open (focus can't wander
 *      into the inert background — 2.4.3 Focus Order),
 *   3. Escape dismisses it, and
 *   4. focus is RESTORED to the trigger when it closes.
 * A surface that claims `aria-modal` but implements none of this strands a
 * keyboard/AT user on an obscured background control — the exact defect the
 * 2026-07 audit found in Card.ConfirmDelete and the temporary Drawer.
 *
 * This gate flags a self-declared MODAL dialog surface rendered in a file that
 * shows NO evidence of implementing the focus contract. The two canonical fixes:
 *   • it is a real top-level dialog → add the focus management (move focus in,
 *     trap Tab, Escape → close, restore focus on unmount — see Dialog/Drawer/
 *     Popover/Panel for the reference effect); OR
 *   • it is REDUNDANTLY nested inside a managed goobs <Dialog>/<Drawer>/
 *     <Popover>/<Panel> (which already owns the dialog role + focus trap) →
 *     DROP the inner `role`/`aria-modal` and let the wrapper own the semantics,
 *     naming the wrapper instead (a dialog nested in a dialog is itself an ARIA
 *     bug). This was the CompositeFieldEditModal instance.
 *
 * ── What counts as a MODAL dialog (the detection) ────────────────────────────
 * A single JSX opening tag that carries BOTH:
 *   • `role="dialog"` or `role="alertdialog"` (literal string attribute), AND
 *   • `aria-modal=` set to anything OTHER than the explicit non-modal
 *     `"false"`/`{false}` — i.e. `aria-modal="true"`, `aria-modal={true}`, or a
 *     dynamic `aria-modal={open}` / `aria-modal={variant === 'x' ? open : …}`.
 * Requiring both on the SAME tag avoids matching a `role="dialog"` on one
 * element and an unrelated `aria-modal` on another.
 *
 * NON-modal surfaces are deliberately OUT of scope: a `role="alertdialog"` with
 * `aria-modal="false"` (Card.ConfirmDelete's inline confirmation — it moves
 * focus in + Escape but intentionally does NOT trap Tab or isolate the
 * background) and a bare `role="dialog"` with no `aria-modal` (a non-modal
 * disclosure / popover) do not owe a focus TRAP. The class is a *focus trap*,
 * which is a MODAL-dialog obligation.
 *
 * ── Escape hatch (encoded in the check, NOT a file ignore-list) ──────────────
 * The file already implements the dialog focus contract. The unambiguous,
 * low-false-positive signal shared by every managed goobs overlay (Dialog,
 * Drawer, Popover, Panel, DataGrid/ManageColumnsSimple) is BOTH:
 *   • it reads `document.activeElement` — to remember the trigger and restore
 *     focus to it on close, AND
 *   • it traps `'Tab'` — a key comparison against the `Tab` key.
 * An unmanaged modal (the CompositeFieldEditModal instance) has NEITHER. This is
 * file-level on purpose: the focus contract is implemented in a `useEffect`
 * elsewhere in the file, never inline on the tag — mirroring the file-level
 * hatches in the sibling a11y lints.
 *
 * Comment/JSDoc text is blanked before scanning (so a `// role="dialog"` note or
 * a `'…role="dialog"…'` warning string is never mistaken for a real tag), and
 * the opening tag is read brace/string-aware so a `>` inside `onKey={() => …}`
 * or a template literal does not terminate it early.
 */

/**
 * Replace the CONTENT of `//` line comments and block/JSDoc comments with
 * spaces, preserving every newline so byte offsets and line numbers are
 * unchanged. String-aware so a `//` inside an attribute string (an `https://`
 * URL) is not mistaken for a comment. This is what stops a JSDoc example or a
 * dev-warning message that mentions `role="dialog"` from being read as JSX.
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
 * string-aware so the `>` inside `onKeyDown={(e) => f(e)}` (arrow, inside `{}`),
 * inside a `` `template ${x}` `` literal, or inside a brace expression is not
 * mistaken for the tag terminator. Returns null if unterminated.
 */
function readOpeningTag(
  text: string,
  tagStart: number
): { end: number; body: string } | null {
  let depth = 0 // {} nesting depth
  let str: string | null = null // active string/template delimiter
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

// Any JSX opening tag start: `<` + a tag name (lower-case host element or an
// upper-case/namespaced component), followed by whitespace, `/`, or `>`.
const TAG_START_RE = /<([A-Za-z][A-Za-z0-9.]*)(?=[\s/>])/g

// A dialog-role literal anywhere in the file (cheap pre-filter).
const DIALOG_ROLE_ANY_RE = /\brole\s*=\s*['"](?:dialog|alertdialog)['"]/

/** The opening tag declares a dialog/alertdialog role. */
const hasDialogRole = (body: string): boolean =>
  /\brole\s*=\s*['"](?:dialog|alertdialog)['"]/.test(body)

/**
 * The opening tag declares a MODAL dialog: `aria-modal` is present and set to
 * something other than the explicit non-modal `"false"` / `{false}`. A dynamic
 * `aria-modal={…expr…}` is treated as modal-capable (the managed overlays that
 * use the dynamic form all satisfy the focus-contract escape hatch anyway).
 */
function hasTruthyAriaModal(body: string): boolean {
  if (!/\baria-modal\s*=/.test(body)) return false
  if (/\baria-modal\s*=\s*(?:['"]false['"]|\{\s*false\s*\})/.test(body))
    return false
  return true
}

/**
 * File-level escape hatch: the component implements the APG dialog focus
 * contract — it remembers/restores the trigger (`document.activeElement`) AND
 * traps the `Tab` key. Both are required; an unmanaged modal has neither.
 */
function implementsFocusContract(blanked: string): boolean {
  return /document\.activeElement/.test(blanked) && /['"]Tab['"]/.test(blanked)
}

const MESSAGE =
  'modal dialog (role="dialog"/"alertdialog" + aria-modal) with no focus ' +
  'management in this file — move focus into the surface on open, trap Tab ' +
  'inside it, close on Escape, and restore focus to the trigger on close (APG ' +
  'Dialog pattern; see Dialog/Drawer/Popover/Panel). If this surface is nested ' +
  'inside a managed goobs <Dialog>/<Drawer>/<Popover>/<Panel>, drop the ' +
  'redundant role/aria-modal and let the wrapper own the dialog semantics.'

const lint: A11yLint = {
  name: 'missing-dialog-focus-trap',
  wcag: '2.4.3, 4.1.2',
  description:
    'A self-declared MODAL dialog surface (role="dialog"/"alertdialog" + a ' +
    'truthy aria-modal) rendered in a file that implements no focus management ' +
    'strands keyboard/AT users on the obscured background: focus is never moved ' +
    'into the surface, Tab is not trapped inside it, Escape does not dismiss it, ' +
    'and focus is never restored to the trigger. Fix by implementing the APG ' +
    'Dialog focus contract, or — if the surface is redundantly nested inside a ' +
    'managed goobs <Dialog>/<Drawer>/<Popover>/<Panel> — by dropping the inner ' +
    'role/aria-modal and letting the wrapper own the dialog semantics. Non-modal ' +
    'surfaces (aria-modal="false", or role="dialog" with no aria-modal) owe no ' +
    'focus trap and are out of scope. Escape hatch: the file reads ' +
    'document.activeElement (remember/restore trigger) AND traps the Tab key.',
  check(files: LintFile[]): Violation[] {
    const violations: Violation[] = []
    for (const { path, text: raw } of files) {
      const text = blankComments(raw)
      // Cheap pre-filter: no dialog-role literal anywhere → nothing to check.
      if (!DIALOG_ROLE_ANY_RE.test(text)) continue
      // Escape hatch: the file implements the dialog focus contract.
      if (implementsFocusContract(text)) continue

      const nl = newlineIndex(text)
      TAG_START_RE.lastIndex = 0
      let m: RegExpExecArray | null
      while ((m = TAG_START_RE.exec(text))) {
        const tag = readOpeningTag(text, m.index)
        if (!tag) continue
        const { body } = tag
        if (!hasDialogRole(body)) continue
        if (!hasTruthyAriaModal(body)) continue
        violations.push({
          file: path,
          line: offsetToLine(nl, m.index),
          message: MESSAGE,
        })
      }
    }
    return violations
  },
  selftest: {
    bad: [
      // self-declared modal dialog, no focus management in the file
      'export const A = () => <div role="dialog" aria-modal="true" tabIndex={-1}>x</div>',
      // alertdialog + truthy modal, unmanaged
      'export const B = () => <div role="alertdialog" aria-modal="true">Delete?</div>',
      // multi-line opening tag (role + aria-modal on separate lines) — the tag
      // reader must span lines; still no focus contract in the file
      `export const C = () => (
        <section
          data-composite-modal="true"
          role="dialog"
          aria-modal="true"
          aria-label="Edit fields"
        >
          body
        </section>
      )`,
      // aria-modal={true} literal-expression form, unmanaged
      'export const D = () => <div role="dialog" aria-modal={true}>x</div>',
    ],
    good: [
      // managed modal — reads document.activeElement AND traps Tab (escape hatch)
      `export const E = () => {
        useEffect(() => {
          const previouslyFocused = document.activeElement as HTMLElement | null
          const onKey = (e: KeyboardEvent) => { if (e.key === 'Tab') trap(e) }
          document.addEventListener('keydown', onKey)
          return () => { previouslyFocused?.focus?.() }
        }, [])
        return <div ref={ref} role="dialog" aria-modal="true" tabIndex={-1}>x</div>
      }`,
      // non-modal alertdialog (aria-modal="false") — Card.ConfirmDelete shape,
      // owes no focus trap
      'export const F = () => <div role="alertdialog" aria-modal="false" tabIndex={-1}>x</div>',
      // bare non-modal dialog (no aria-modal) — a disclosure, not a modal
      'export const G = () => <div role="dialog">disclosure</div>',
      // dialog role only in a comment + a selector string — masked, never a tag
      'export const H = () => (/* role="dialog" aria-modal="true" note */ <div data-sel="[role=\'dialog\']">hi</div>)',
      // a plain non-dialog element
      'export const I = () => <div role="region" aria-label="stats">x</div>',
    ],
  },
}

export default lint
