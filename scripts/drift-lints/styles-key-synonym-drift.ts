import type { DriftFile, DriftInstance, DriftLint } from '../lint-drift'

/**
 * DRIFT CLASS: styles-object key synonym drift.
 *
 * The `*Styles` prop interfaces spell the SAME visual concept with different
 * synonymous keys across components. A census of every exported `*Styles`
 * interface member repo-wide (33 interfaces, 830 members) grouped members by
 * their trailing concept token and looked for concepts with a dominant spelling
 * plus a minority synonym. A synonym is gated only when the dominant form leads
 * the minority by >= 3:1 AND the two forms are unambiguously the same concept
 * (no CSS shorthand/longhand semantic difference). Below 3:1, or when the two
 * forms are a genuine CSS distinction, the concept is UNSETTLED — documented
 * here, not gated (false positives are poison; we prefer to under-measure).
 *
 * GATED concept (>= 3:1, unambiguous):
 *   transition timing-function / easing —
 *     `transitionEasing`          x14  (Alert, AppBar, BigCalendar, Checkbox,
 *                                       ComplexTextEditor, DataGrid, Drawer,
 *                                       Field/Shell, Popover, ProgressBar,
 *                                       ProjectBoard, RadioGroup, Tooltip,
 *                                       TreeView)  <- DOMINANT / canon
 *     `transitionTimingFunction`  x3   (Fade, Slide, Zoom)  <- minority synonym
 *   14:3 = 4.67:1. Both keys describe the SAME CSS `transition-timing-function`
 *   (the easing curve) — there is no behavioural difference, only spelling. The
 *   dominant `transitionEasing` is also the shorter, React-animation-ecosystem
 *   term (framer-motion / react-spring say "easing"), so it is the canon.
 *
 * UNSETTLED concepts (measured but NOT gated — note only):
 *   - content color: `color` x9 vs `textColor` x4 = 2.25:1 (< 3:1). The forms
 *     are true synonyms (Field/Text and Field/Search literally read
 *     `styles?.textColor || styles?.color`), but `color` does not dominate 3:1,
 *     so it is unsettled — a future unify campaign should pick one.
 *   - background fill: `...BackgroundColor` (longhand, ~42) vs `...Background`
 *     (shorthand, ~16) = ~2.6:1 (< 3:1) AND ambiguous — CSS `background` is a
 *     shorthand that also accepts gradients/images (ProgressBar bar fills,
 *     Drawer permanent/temporary surfaces use it on purpose), so `...Background`
 *     is not mechanically a misspelling of `...BackgroundColor`. Not gated.
 *
 * Careful (per the census rule): legitimately DIFFERENT concepts that merely
 * share a trailing token are NOT synonyms — e.g. `headerColor` vs `iconColor`,
 * or `summaryBackgroundColor` vs `backgroundColor`, are distinct UI parts.
 * Grouping is scoped to the concept (trailing token + qualifier), so those
 * never collapse together. This detector only flags the exact confirmed
 * minority key(s), inside exported `*Styles` interface bodies.
 *
 * DETECTION: a member named `transitionTimingFunction` (the confirmed minority
 * synonym) declared at the top level of an exported `*Styles` interface.
 * `transitionEasing` (canon) is clean. Keys outside a `*Styles` interface, keys
 * nested inside an object-typed member, and the name inside a comment are all
 * out of scope.
 */

/** Confirmed minority synonym key -> its dominant (canon) spelling, for
 *  concepts whose dominance clears 3:1 and whose forms are unambiguous. */
const MINORITY_TO_CANON: Record<string, string> = {
  transitionTimingFunction: 'transitionEasing',
}

const MINORITY_MEMBER = new RegExp(
  '(?:^|[;\\n,{}])\\s*(' + Object.keys(MINORITY_TO_CANON).join('|') + ')\\s*\\??\\s*:',
  'g'
)

const IFACE_OPEN = /export\s+interface\s+\w*Styles\b[^{]*\{/g

/** Blank `//` and block-comment content (string-aware, newlines preserved) so a
 *  JSDoc naming the minority key is never itself a hit. Pattern copied from
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

/** Blank the contents of nested `{ ... }` (object-typed members) inside an
 *  interface body so only TOP-LEVEL members are scanned — a synonym key nested
 *  as a sub-field is not a top-level styles key (matches the census). Newlines
 *  are preserved so line numbers stay accurate. */
function blankNestedObjects(body: string): string {
  const chars = body.split('')
  let depth = 0
  for (let k = 0; k < chars.length; k++) {
    const c = chars[k]
    if (c === '{') {
      depth++
      continue
    }
    if (c === '}') {
      depth--
      continue
    }
    if (depth > 0 && c !== '\n') chars[k] = ' '
  }
  return chars.join('')
}

const lint: DriftLint = {
  name: 'styles-key-synonym-drift',
  description:
    'The *Styles prop interfaces spell one visual concept with different synonymous keys. Gated (>=3:1, unambiguous): the CSS transition-timing-function key is transitionEasing (14) not transitionTimingFunction (3). Unsettled (noted, not gated): color/textColor (2.25:1), background-shorthand/longhand (ambiguous).',
  canon:
    'Spell each *Styles concept with its dominant synonym: the transition timing-function key is `transitionEasing` (14 uses), NOT `transitionTimingFunction` (3 uses).\n' +
    'Evidence: within the exported *Styles interfaces, transitionEasing outnumbers transitionTimingFunction 14:3 (4.67:1); both keys map to the identical CSS transition-timing-function (the easing curve) with no behavioural difference, and "easing" is the shorter React-animation-ecosystem term (framer-motion / react-spring). New *Styles keys for the easing curve must use transitionEasing. (Unsettled, below the 3:1 bar, therefore NOT gated: color vs textColor 9:4, and the ...Background shorthand vs ...BackgroundColor longhand — the latter a real CSS distinction.)',
  scope: 'ts',
  measure(files: DriftFile[]): DriftInstance[] {
    const instances: DriftInstance[] = []
    for (const { path, text: raw } of files) {
      const text = blankComments(raw)
      IFACE_OPEN.lastIndex = 0
      let iface: RegExpExecArray | null
      while ((iface = IFACE_OPEN.exec(text))) {
        const openIdx = iface.index + iface[0].length - 1 // position of '{'
        let depth = 0
        let end = openIdx
        for (; end < text.length; end++) {
          const c = text[end]
          if (c === '{') depth++
          else if (c === '}') {
            depth--
            if (depth === 0) break
          }
        }
        const bodyStart = openIdx + 1
        const body = blankNestedObjects(text.slice(bodyStart, end))
        MINORITY_MEMBER.lastIndex = 0
        let m: RegExpExecArray | null
        while ((m = MINORITY_MEMBER.exec(body))) {
          const key = m[1]
          const idOffset = bodyStart + m.index + m[0].indexOf(key)
          const line = text.slice(0, idOffset).split('\n').length
          instances.push({
            file: path,
            line,
            token: `${key} -> ${MINORITY_TO_CANON[key]}`,
          })
        }
        // continue scanning after this interface's close brace
        IFACE_OPEN.lastIndex = end
      }
    }
    return instances
  },
  selftest: {
    bad: [
      // Minority synonym as a top-level member of an exported *Styles interface.
      'export interface FadeStyles {\n  theme?: string\n  transitionTimingFunction?: string\n}',
      // Works through an `extends` clause and among other members.
      'export interface SlideStyles extends FormFieldStyles {\n  transitionDuration?: string\n  transitionTimingFunction?: string\n  disabled?: boolean\n}',
    ],
    good: [
      // The canonical dominant spelling.
      'export interface ZoomStyles {\n  transitionEasing?: string\n}',
      // Not a *Styles interface — a Props interface with the same key is out of scope.
      'export interface FadeProps {\n  transitionTimingFunction?: string\n}',
      // The minority key nested inside an object-typed member is a sub-field, not a top-level styles key.
      'export interface CardStyles {\n  customStyles?: { transitionTimingFunction?: string }\n}',
      // The minority key only in a JSDoc comment is documentation, not a member.
      "export interface DrawerStyles {\n  /** legacy alias transitionTimingFunction — use transitionEasing instead */\n  transitionEasing?: string\n}",
      // The key in a plain object literal (not an interface) is out of scope.
      "const s = { transitionTimingFunction: 'ease-in-out' }",
    ],
  },
}

export default lint
