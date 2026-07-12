import type { A11yLint, LintFile, Violation } from '../lint-a11y'

/**
 * ── label-in-name (WCAG 2.5.3 Label in Name) ──
 *
 * When a control carries a VISIBLE text label, its ACCESSIBLE NAME must CONTAIN
 * that visible text. Speech-input users say what they SEE ("click Save"); if an
 * `aria-label` overrides the accessible name to something the visible text isn't
 * a substring of (e.g. a "Save" button whose `aria-label="Submit form"`), the
 * voice command never matches the control — it becomes undriveable by voice.
 *
 * THE PRECEDENT (architectural, in-library): `Field/Shell/index.tsx:373-385`
 * gates its `ariaLabel` prop off the visible label — it merges `ariaLabel` into
 * the input's `aria-label` ONLY when NO visible `<label>` renders, precisely so
 * the programmatic name can never diverge from a visible label (its own comment
 * cites WCAG 2.5.3). This module enforces that same rule for RAW elements /
 * components that hard-code both an `aria-label` (or `ariaLabel`) literal AND a
 * literal visible-text child.
 *
 * ── THE DETECTABLE STATIC SHAPE (crisp, under-measured) ──
 *
 * An opening JSX tag that supplies BOTH:
 *   (a) a LITERAL `aria-label="X"` or `ariaLabel="X"` (a quoted string — a
 *       dynamic `aria-label={expr}` is not statically knowable, so it is
 *       SKIPPED), AND
 *   (b) a LITERAL plain-text child Y between `>` and `</tag>` — pure text, no
 *       nested element (`<`), no `{expression}`, no HTML entity (`&…;`), so the
 *       visible label is statically known,
 * where, after case-folding and whitespace-collapsing both, X does NOT contain
 * Y as a substring. That is a provable Label-in-Name failure.
 *
 * ── ESCAPE HATCHES (ENCODED IN THE CHECK, never an ignore-list) ──
 *  1. `aria-label={…}` / `ariaLabel={…}` (dynamic value) → not a literal, SKIP.
 *  2. child content containing `<` (nested element), `{` (expression) or `&`
 *     (HTML entity) → the visible text is not statically knowable, SKIP
 *     (under-measure: an icon-only `<button aria-label="Close"><Icon/></button>`
 *     has NO visible text label and is correctly out of scope here).
 *  3. empty / whitespace-only child → no visible text label (icon-only), SKIP.
 *  4. a visible child that is NOT a clean word run — anything outside
 *     `[A-Za-z0-9 '\-]` (arrows/glyphs like `Next →`, punctuation, slashes,
 *     colons, symbols) → substring matching would be unreliable, SKIP
 *     (FALSE POSITIVES ARE POISON — under-measure the ambiguous case).
 *  5. self-closing tag → no child, SKIP.
 *  6. a visible child with no letter or digit → no readable label, SKIP.
 *
 * WHY substring, case-insensitive, whitespace-normalized: WCAG 2.5.3's
 * containment test folds case and normalizes whitespace; the accessible name
 * must merely CONTAIN the visible label (best practice: START with it). A
 * coincidental containment ("OK" ⊂ "Okay") is left UNFLAGGED on purpose — the
 * safe (under-measuring) direction.
 */

/** Every JSX opening tag: native (`button`), Component (`Button`), or dotted
 *  (`Foo.Bar`). The lookahead stops a longer identifier from matching and keeps
 *  the `<` at the tag start so `readOpeningTag` can read the full tag body. */
const TAG_OPEN_RE = /<([A-Za-z][A-Za-z0-9]*(?:\.[A-Za-z][A-Za-z0-9]*)*)(?=[\s/>])/g

/**
 * Blank the CONTENT of `//` and `/* … *\/` comments (JSDoc included) to spaces,
 * preserving every newline so byte offsets / line numbers are unchanged. String-
 * and template-aware so a `//` inside an `https://` value — or an apostrophe in
 * a `// don't` comment — does not desync the walker. This stops a JSDoc example
 * `aria-label="Submit form">Save` from being flagged as real code.
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
 * inclusive index of the tag-closing `>` and the tag body. Brace- and string-
 * aware so a `>` inside `onClick={() => f()}` or a `` `${x}` `` literal is not
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
    if (c === '>' && depth === 0)
      return { end: i, body: text.slice(tagStart, i + 1) }
  }
  return null
}

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/**
 * From the `>` of an opening `<tag>` (index `openEnd`), return the raw content
 * up to the matching `</tag>`, honouring nested same-name opens with a depth
 * counter. Returns null if never closed. Tag name is regex-escaped so a dotted
 * component (`Foo.Bar`) matches literally.
 */
function readElementContent(
  text: string,
  tag: string,
  openEnd: number
): string | null {
  const t = escapeRe(tag)
  const openRe = new RegExp(`<${t}(?=[\\s/>])`, 'g')
  const closeRe = new RegExp(`</${t}\\s*>`, 'g')
  let depth = 0
  let i = openEnd + 1
  const contentStart = i
  while (i < text.length) {
    openRe.lastIndex = i
    closeRe.lastIndex = i
    const nextOpen = openRe.exec(text)
    const nextClose = closeRe.exec(text)
    if (!nextClose) return null
    if (nextOpen && nextOpen.index < nextClose.index) {
      depth++
      i = nextOpen.index + 1
      continue
    }
    if (depth === 0) return text.slice(contentStart, nextClose.index)
    depth--
    i = nextClose.index + 1
  }
  return null
}

function newlineIndex(text: string): number[] {
  const out: number[] = []
  for (let i = 0; i < text.length; i++) if (text[i] === '\n') out.push(i)
  return out
}
function offsetToLine(nl: number[], offset: number): number {
  let lo = 0
  let hi = nl.length
  while (lo < hi) {
    const mid = (lo + hi) >> 1
    if (nl[mid] < offset) lo = mid + 1
    else hi = mid
  }
  return lo + 1
}

const isSelfClosing = (body: string) => /\/\s*>$/.test(body.trimEnd())

/**
 * Extract a LITERAL `aria-label` / `ariaLabel` value from a tag body. Returns
 * the string value for a quoted literal; null when the attribute is absent OR
 * its value is a dynamic `{expression}` (statically unknowable). `aria-labelledby`
 * is NOT matched (the `=` must sit right after `aria-label`).
 */
function literalAriaLabel(body: string): string | null {
  const m = body.match(
    /\b(?:aria-label|ariaLabel)\s*=\s*(?:"([^"]*)"|'([^']*)')/
  )
  if (!m) return null
  return m[1] ?? m[2] ?? null
}

const normalize = (s: string) => s.replace(/\s+/g, ' ').trim()

/**
 * The statically-known visible text label of a child run, or null when there
 * is no clean word-run label to compare (see escape hatches 2/3/4/6). A clean
 * label is pure text — no nested element, expression or entity — that, once
 * whitespace-collapsed, is a non-empty run of only word characters, spaces,
 * apostrophes and hyphens, and contains at least one letter or digit.
 */
function visibleLabel(content: string): string | null {
  if (/[<{&]/.test(content)) return null // nested element / expression / entity
  const norm = normalize(content)
  if (norm === '') return null // icon-only / whitespace — no visible label
  if (!/[A-Za-z0-9]/.test(norm)) return null // glyph/punctuation only — no text
  if (!/^[A-Za-z0-9 '\-]+$/.test(norm)) return null // has symbols → ambiguous, skip
  return norm
}

const lint: A11yLint = {
  name: 'label-in-name',
  wcag: '2.5.3',
  description:
    'A control that carries BOTH a literal aria-label="X" (or ariaLabel="X") AND a literal visible-text child Y, where X does not (case-insensitively, whitespace-normalized) CONTAIN Y, violates WCAG 2.5.3 Label in Name: speech-input users say the VISIBLE text, so the accessible name must contain it or the control is undriveable by voice. Make the aria-label start with (or contain) the visible text, or drop the override and let the visible text be the name — FieldShell (src/components/Field/Shell/index.tsx) is the precedent: it applies ariaLabel only when NO visible label renders. Escape hatches encoded in the check: a dynamic aria-label={expr} value, a child with a nested element / {expression} / HTML entity, an empty or whitespace-only child (icon-only, no visible label), a child that is not a clean word run (arrows/glyphs/punctuation), and self-closing tags are all skipped — statically ambiguous cases are under-measured, never guessed.',
  check(files: LintFile[]): Violation[] {
    const violations: Violation[] = []
    for (const { path, text: raw } of files) {
      if (!/aria-label|ariaLabel/.test(raw)) continue
      const text = blankComments(raw)
      const nl = newlineIndex(text)

      TAG_OPEN_RE.lastIndex = 0
      let m: RegExpExecArray | null
      while ((m = TAG_OPEN_RE.exec(text))) {
        const tag = m[1]
        const opened = readOpeningTag(text, m.index)
        if (!opened) continue
        const { body, end } = opened
        if (isSelfClosing(body)) continue
        const label = literalAriaLabel(body)
        if (label == null) continue // absent or dynamic aria-label — skip
        const content = readElementContent(text, tag, end)
        if (content == null) continue
        const visible = visibleLabel(content)
        if (visible == null) continue // no clean visible text label — skip
        if (normalize(label).toLowerCase().includes(visible.toLowerCase()))
          continue // accessible name contains the visible label — compliant
        violations.push({
          file: path,
          line: offsetToLine(nl, m.index),
          message: `aria-label "${normalize(label)}" does not contain the visible text "${visible}" — WCAG 2.5.3 Label in Name: speech-input users say the visible text, so the accessible name must contain it. Make the aria-label start with the visible text, or drop it and let the visible text be the name (label-in-name)`,
        })
      }
    }
    return violations
  },
  selftest: {
    bad: [
      // The canonical shape: visible "Save", name "Submit form" (no containment).
      '<button aria-label="Submit form">Save</button>',
      // Multi-line child; className + handler present.
      `export const B = () => (
        <button className={styles.next} aria-label="Go to next step" onClick={next}>
          Continue
        </button>
      )`,
      // camelCase ariaLabel prop on a component with a plain-text child.
      '<IconButton ariaLabel="Remove item">Delete</IconButton>',
      // Single-quoted literal, mismatched.
      "<a href='/home' aria-label='Return home'>Dashboard</a>",
    ],
    good: [
      // Accessible name CONTAINS the visible text.
      '<button aria-label="Save invoice draft">Save</button>',
      // Dynamic aria-label — statically unknowable, skipped.
      '<button aria-label={dynamicLabel}>Save</button>',
      // Icon-only button: aria-label but no text child (self-closing / nested icon).
      '<button aria-label="Close" onClick={close} />',
      '<button aria-label="Close"><CloseIcon /></button>',
      // Expression child — statically unknowable, skipped.
      '<button aria-label="Submit form">{childLabel}</button>',
      // Visible text has a trailing glyph (arrow) → ambiguous word run, skipped.
      '<button aria-label="Go to next page">Next →</button>',
      // Coincidental containment ("OK" ⊂ "Okay") — under-measured, not flagged.
      '<button aria-label="Okay">OK</button>',
      // Exact match (visible text IS the whole accessible name).
      '<button aria-label="Save">Save</button>',
      // Case + whitespace differ only — still contained.
      '<button aria-label="please SAVE now">save</button>',
      // No aria-label at all — visible text is the name, out of scope.
      '<button>Delete</button>',
    ],
  },
}

export default lint
