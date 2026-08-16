import type { A11yLint, LintFile, Violation } from '../lint-a11y'

/**
 * CLASS: an element that claims a RANGE role but never publishes its value.
 *
 * ARIA gives `meter`, `scrollbar`, `slider` — and `separator` ONCE IT IS
 * FOCUSABLE — a required `aria-valuenow`; axe-core encodes exactly this
 * (`aria-required-attr`, whose `isStaticSeparator()` exempts only the
 * non-focusable separator). Without it AT has a control it can reach and
 * operate but cannot report a position for.
 *
 * FOUND BY: the DataGrid column-resize handle, which carried
 * `role="separator"` + `tabIndex={0}` + Arrow-key resizing and an `aria-label`,
 * but no value trio. Measured downstream in ThothOS it was 18 of that app's 22
 * remaining CRITICAL a11y findings — one element, four pages.
 *
 * WHY A LINT RATHER THAN A ONE-OFF FIX: the shape is a *promotion* — an element
 * with an inert structural role becomes a widget the moment someone adds
 * `tabIndex` to make it keyboard operable, and the required attributes are
 * nowhere near that edit. goobs already has eight correct range-role elements
 * (Card + ProgressBar progressbars, five spinbutton fields, the Divider
 * separator); this keeps the ninth from arriving undescribed.
 *
 * The check deliberately mirrors axe rather than exceeding it: `progressbar`
 * and `spinbutton` list `aria-valuenow` as ALLOWED, not required, so they are
 * not flagged. A lint that cries wolf gets deleted.
 */

/** Roles whose `aria-valuenow` is required unconditionally (per axe-core). */
const ALWAYS_REQUIRES_VALUENOW = new Set(['meter', 'scrollbar', 'slider'])
/** Roles whose `aria-valuenow` is required only when the element is focusable. */
const REQUIRES_VALUENOW_WHEN_FOCUSABLE = new Set(['separator'])

/**
 * Blank out comments so a role mentioned in prose (this repo documents ARIA
 * decisions heavily — `Divider` explains `role="separator"` in a JSDoc block)
 * cannot be read as markup. Offsets are preserved so violation lines stay
 * correct; string and template literals are respected so a `https://…` inside a
 * string is not mistaken for a line comment.
 *
 * KNOWN GAP, stated rather than implied: this does not model REGEX LITERALS, so a
 * pattern containing an unpaired quote (`/["']/`) opens phantom string state and
 * the rest of that file's comments go un-blanked. Reaching a false positive from
 * there needs a range role written inside such a comment AND arranged to parse as
 * an opening tag, which `enclosingOpeningTag` then has to accept. If that ever
 * happens the fix is a real tokenizer here, not an ignore list.
 */
function blankComments(text: string): string {
  const out = text.split('')
  let index = 0
  let quote: string | null = null
  while (index < text.length) {
    const char = text[index]
    const next = text[index + 1]
    if (quote) {
      if (char === '\\') {
        index += 2
        continue
      }
      if (char === quote) quote = null
      index += 1
      continue
    }
    if (char === '"' || char === "'" || char === '`') {
      quote = char
      index += 1
      continue
    }
    if (char === '/' && next === '/') {
      while (index < text.length && text[index] !== '\n') {
        out[index] = ' '
        index += 1
      }
      continue
    }
    if (char === '/' && next === '*') {
      while (index < text.length && !(text[index] === '*' && text[index + 1] === '/')) {
        if (text[index] !== '\n') out[index] = ' '
        index += 1
      }
      out[index] = ' '
      out[index + 1] = ' '
      index += 2
      continue
    }
    index += 1
  }
  return out.join('')
}

/**
 * The full opening-tag text containing `roleIndex`, or null when the match is
 * not inside one (prose, an object literal, a props type). Walks back to the
 * `<` that opens the tag — refusing to cross a `>` — then forward to the `>`
 * that closes it, tracking brace depth so `style={{ a: '>' }}` cannot end it.
 */
function enclosingOpeningTag(text: string, roleIndex: number): string | null {
  let start = roleIndex
  while (start >= 0) {
    const char = text[start]
    if (char === '>') return null
    if (char === '<') break
    start -= 1
  }
  if (start < 0) return null
  if (!/[A-Za-z]/.test(text[start + 1] ?? '')) return null

  let depth = 0
  let quote: string | null = null
  for (let index = start; index < text.length; index += 1) {
    const char = text[index]
    if (quote) {
      if (char === quote) quote = null
      continue
    }
    if (char === '"' || char === "'" || char === '`') {
      quote = char
      continue
    }
    if (char === '{') depth += 1
    else if (char === '}') depth -= 1
    else if (char === '>' && depth === 0) return text.slice(start, index + 1)
  }
  return null
}

/** React `tabIndex` (or DOM `tabindex`) that is not an explicit -1. */
function isFocusable(tag: string): boolean {
  const match = /\btab[Ii]ndex\s*=\s*(\{[^}]*\}|"[^"]*"|'[^']*')/.exec(tag)
  if (!match) return false
  return !/-\s*1/.test(match[1] ?? '')
}

const lint: A11yLint = {
  name: 'range-role-missing-valuenow',
  wcag: '4.1.2',
  description:
    'An element with a range role (meter/scrollbar/slider, or a FOCUSABLE separator) must publish aria-valuenow — AT can otherwise operate the control but cannot report its position.',
  check(files: LintFile[]): Violation[] {
    const violations: Violation[] = []
    for (const { path, text } of files) {
      const scannable = blankComments(text)
      const rolePattern = /\brole\s*=\s*["']([a-z]+)["']/g
      let match: RegExpExecArray | null
      while ((match = rolePattern.exec(scannable)) !== null) {
        const role = match[1] ?? ''
        const conditional = REQUIRES_VALUENOW_WHEN_FOCUSABLE.has(role)
        if (!ALWAYS_REQUIRES_VALUENOW.has(role) && !conditional) continue

        const tag = enclosingOpeningTag(scannable, match.index)
        if (!tag) continue
        if (tag.includes('aria-valuenow')) continue
        if (conditional && !isFocusable(tag)) continue

        violations.push({
          file: path,
          line: scannable.slice(0, match.index).split('\n').length,
          message: conditional
            ? `focusable role="${role}" without aria-valuenow — a focusable separator is a range widget (axe aria-required-attr); publish aria-valuenow + aria-valuemin/max, or make it non-focusable AND remove it from the a11y tree`
            : `role="${role}" without aria-valuenow — a range role must publish its current value (axe aria-required-attr)`,
        })
      }
    }
    return violations
  },
  selftest: {
    bad: [
      // The DataGrid defect, as it shipped: operable, named, undescribed.
      'export const X = () => <div role="separator" tabIndex={0} aria-orientation="vertical" aria-label="Resize Name column" />',
      'export const X = () => <div role="slider" aria-valuemin={0} aria-valuemax={10} />',
      'export const X = () => <div role="scrollbar" aria-controls="pane" aria-orientation="vertical" />',
      'export const X = () => <span role="meter" aria-valuemin={0}>7</span>',
      // Multi-line tag: the value trio is genuinely absent, not just off-line.
      'export const X = () => (\n  <div\n    role="separator"\n    tabIndex={0}\n    aria-label="Resize"\n  />\n)',
    ],
    good: [
      // Non-focusable separator — inert structure, exempt (Divider's case).
      'export const X = () => <hr role="separator" aria-orientation="horizontal" />',
      'export const X = () => <div role="separator" tabIndex={-1} aria-label="x" />',
      'export const X = () => <div role="separator" tabIndex={0} aria-valuenow={200} aria-valuemin={50} aria-valuemax={1200} />',
      'export const X = () => <div role="slider" aria-valuenow={3} aria-valuemin={0} aria-valuemax={10} />',
      // Conditional spread still counts as publishing the attribute.
      'export const X = ({ v, has }: { v: number; has: boolean }) => (\n  <input\n    role="scrollbar"\n    {...(has && { \'aria-valuenow\': v })}\n  />\n)',
      // progressbar/spinbutton: allowed, NOT required — must not be flagged.
      'export const X = () => <div role="progressbar" aria-valuemin={0} aria-valuemax={100} />',
      'export const X = () => <input role="spinbutton" aria-valuemin={0} aria-valuemax={32} />',
      // Prose about a role must never be read as markup.
      'export const X = () => <div>{/* role="separator" tabIndex={0} is documented here */}</div>',
      '/**\n * Renders with `role="separator"` + tabIndex={0} by default.\n */\nexport const X = () => <div />',
      // Dynamic role — not statically knowable, deliberately not guessed.
      'export const X = ({ role }: { role: string }) => <div role={role} tabIndex={0} />',
    ],
  },
}
export default lint
