import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import type { A11yLint, LintFile, Violation } from '../lint-a11y'

/**
 * CLASS: missing-focus-visible-style (WCAG 2.4.7 Focus Visible / 2.4.11 Focus
 * Appearance / 1.4.11 Non-text Contrast).
 *
 * A component whose CSS module SUPPRESSES the browser's native focus indicator
 * yet provides NO visible keyboard-focus replacement. Keyboard-only users then
 * have no way to see which control is focused — the exact defect the 2026-07
 * a11y audit found in Accordion, Alert, Avatar, BigCalendar, Breadcrumb,
 * Button, Card, Checkbox, and more.
 *
 * ── The LOGICAL SHAPE (not the literal string from one file) ──────────────────
 * The class lives in the `.module.css`, so this module scans `*.module.css`
 * (the a11y-lint runner only feeds `.ts`/`.tsx`; a CSS-level class must read the
 * stylesheets itself — see `check()`). A stylesheet is a violation when it:
 *
 *   TRIGGER (it removes / hides the native focus ring):
 *     (a) sets `outline: none` / `outline: 0` on some selector — the UA ring is
 *         explicitly killed; you only kill a ring on a focusable thing; OR
 *     (b) visually hides a native control with `opacity: 0` on an `input`-ish
 *         selector (the "custom control over a hidden native input" pattern —
 *         Checkbox/Switch/ToggleButton): the real <input>'s own focus ring is
 *         invisible, so a sibling/wrapper must render one.
 *   AND
 *   NO VISIBLE FOCUS REPLACEMENT:
 *     no `:focus` / `:focus-visible` / `:focus-within` rule anywhere in the file
 *     whose declaration block paints something visible (a real `outline`,
 *     `box-shadow`, `border`, `background`, or `text-decoration`). A bare
 *     `:focus { outline: none }` that only re-kills the ring does NOT count as a
 *     replacement — it is the anti-pattern, and is still flagged.
 *
 * ── ESCAPE HATCHES (encoded in the check, never a file ignore-list) ───────────
 *  1. `src/components/Field/**` — the entire Field input family renders THROUGH
 *     the shared `Field/Shell/FieldShell`, whose `.inputSlot:focus-within` (and
 *     each field wrapper's `.inputWrapper:focus-within`) paints the focus glow
 *     for the whole family. A Field leaf legitimately does `outline: none` on its
 *     inner <input> and carries no `:focus` of its own — the indicator is
 *     inherited from the shell. Flagging them would be a flood of false
 *     positives. (Same architectural boundary the other a11y lints draw.)
 *  2. `src/components/Icons/**` — icons are decorative SVG glyphs rendered inside
 *     a button/link; they are never independently focusable, so an icon `:hover`
 *     recolor needs no focus style.
 *  3. A `:hover` on a `::-webkit-scrollbar-thumb` (or any `::` pseudo-ELEMENT) or
 *     a native `<option>` menu item is NOT treated as a focusable trigger — those
 *     are UA-driven, not keyboard-focus targets. This module deliberately does
 *     NOT use `:hover` as a trigger at all: `:hover` decorates plenty of
 *     non-focusable elements (rows, cards, scrollbars, icons), so it is far too
 *     noisy a signal for this class. Ring-removal and hidden-native-input are the
 *     two airtight, low-false-positive signals that an element is focusable AND
 *     lacks an indicator.
 *
 * CSS comments are stripped before scanning so a prose mention of `outline:` /
 * `opacity: 0` / `:focus` inside a `/* … *\/` block (these files comment heavily)
 * never trips a trigger or masks a missing indicator.
 */

/** Repo root (…/scripts/a11y-lints → up two). */
const ROOT = join(import.meta.dir, '..', '..')

/** Field family (FieldShell provides :focus-within) + decorative Icons. */
const EXCLUDED_PATH_RE = /^src\/components\/(Field|Icons)\//

/** Replace every CSS comment with same-length spaces, preserving newlines. */
function stripCssComments(css: string): string {
  return css.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '))
}

/** Line number (1-based) of a character offset in `text`. */
function lineOf(text: string, offset: number): number {
  let line = 1
  for (let i = 0; i < offset && i < text.length; i++)
    if (text[i] === '\n') line++
  return line
}

/**
 * A declaration block paints a visible focus indicator when it sets a real
 * outline (value not none/0), a box-shadow, a border, a background, or a
 * text-decoration. Bare `outline: none` / `outline: 0` does NOT count.
 */
function blockPaintsVisible(block: string): boolean {
  if (/\bbox-shadow\s*:/i.test(block)) return true
  if (/\boutline\s*:\s*(?!\s*(?:none|0)\b)[^;]+/i.test(block)) return true
  if (/\bborder(?:-[a-z]+)?\s*:\s*(?!\s*(?:none|0)\b)[^;]+/i.test(block)) return true
  if (/\bbackground(?:-color)?\s*:/i.test(block)) return true
  if (/\btext-decoration\b[^;]*:/i.test(block)) return true
  return false
}

/**
 * True when the stylesheet has at least one `:focus` / `:focus-visible` /
 * `:focus-within` rule whose block paints something visible. For each `:focus`
 * occurrence, take the declaration block that follows (the next `{ … }`).
 */
function hasVisibleFocusRule(css: string): boolean {
  const focusRe = /:focus(?:-visible|-within)?\b/g
  let m: RegExpExecArray | null
  while ((m = focusRe.exec(css))) {
    const open = css.indexOf('{', m.index)
    if (open < 0) continue
    const close = css.indexOf('}', open)
    const block = css.slice(open + 1, close < 0 ? css.length : close)
    if (blockPaintsVisible(block)) return true
  }
  return false
}

/** First `outline: none|0` offset (the ring-removal trigger), or -1. */
function ringRemovalOffset(css: string): number {
  const m = /\boutline\s*:\s*(?:none|0)\b/i.exec(css)
  return m ? m.index : -1
}

/**
 * First offset of the hidden-native-input trigger: a rule whose SELECTOR names
 * an input control (`.input`, `.xInput`, bare `input`, `input[type=…]`) and
 * whose block sets `opacity: 0`. Returns the offset of the `opacity: 0`, or -1.
 */
function hiddenInputOffset(css: string): number {
  const ruleRe = /([^{}]*)\{([^}]*)\}/g
  let m: RegExpExecArray | null
  while ((m = ruleRe.exec(css))) {
    const selector = m[1]
    const block = m[2]
    if (!/(^|[.\s>~+])input\w*\b|\binput\s*[.[:]/i.test(selector)) continue
    const op = /\bopacity\s*:\s*0(?:\.0+)?\b(?!\.)/i.exec(block)
    if (op) return m.index + m[0].indexOf(op[0], m[1].length)
  }
  return -1
}

/** Evaluate ONE stylesheet. Returns 0 or 1 violation (at the trigger site). */
function scanCss(path: string, rawCss: string): Violation[] {
  if (EXCLUDED_PATH_RE.test(path)) return []
  const css = stripCssComments(rawCss)

  const ringOff = ringRemovalOffset(css)
  const hiddenOff = hiddenInputOffset(css)
  const offsets = [ringOff, hiddenOff].filter((o) => o >= 0)
  if (offsets.length === 0) return [] // no trigger — not in scope

  if (hasVisibleFocusRule(css)) return [] // has a real focus indicator — fine

  const triggerOffset = Math.min(...offsets)
  const isRing = ringOff >= 0 && ringOff === triggerOffset
  const reason = isRing
    ? 'removes the native focus ring (outline: none/0)'
    : 'visually hides a native input (opacity: 0)'
  return [
    {
      file: path,
      line: lineOf(css, triggerOffset),
      message:
        `${reason} but has no visible :focus-visible/:focus-within/:focus ` +
        'rule — keyboard users get no focus indicator. Add a per-theme ' +
        ':focus-visible outline/box-shadow (WCAG 2.4.7).',
    },
  ]
}

/** Recursively collect every `*.module.css` under `src/`. */
function collectModuleCss(): LintFile[] {
  const out: LintFile[] = []
  const walk = (dir: string) => {
    let entries: string[]
    try {
      entries = readdirSync(dir)
    } catch {
      return
    }
    for (const entry of entries) {
      const full = join(dir, entry)
      if (statSync(full).isDirectory()) walk(full)
      else if (full.endsWith('.module.css'))
        out.push({
          path: relative(ROOT, full).replace(/\\/g, '/'),
          text: readFileSync(full, 'utf8'),
        })
    }
  }
  walk(join(ROOT, 'src'))
  return out
}

const lint: A11yLint = {
  name: 'missing-focus-visible-style',
  wcag: '2.4.7, 2.4.11, 1.4.11',
  description:
    'A .module.css that suppresses the native focus ring (outline: none/0, or a ' +
    'visually-hidden opacity:0 input) but provides no visible :focus-visible/' +
    ':focus-within/:focus replacement — keyboard users see no focus indicator. ' +
    'The Field/** family (FieldShell :focus-within) and decorative Icons/** are ' +
    'excluded; :hover is not treated as a trigger (too noisy). This is a ' +
    'CSS-level class, so the module scans *.module.css from disk rather than the ' +
    '.ts/.tsx files the runner feeds it.',
  check(files: LintFile[]): Violation[] {
    // Selftest invocation: the runner passes synthetic `__selftest__/…` files
    // whose text is a CSS snippet. Route those through the same CSS logic so the
    // module self-verifies. Any other invocation is a real run: ignore the
    // .ts/.tsx `files` (this class lives in CSS) and walk *.module.css from disk.
    const synthetic =
      files.length > 0 && files.every((f) => f.path.startsWith('__selftest__/'))
    const targets = synthetic ? files : collectModuleCss()
    return targets.flatMap(({ path, text }) => scanCss(path, text))
  },
  selftest: {
    bad: [
      // ring removed on a button, no focus rule at all
      '.button { color: red; outline: none; }\n.button:hover { background: blue; }',
      // hidden native input (checkbox pattern), sibling has no focus rule
      '.input {\n  position: absolute;\n  opacity: 0;\n}\n.box { border: 2px solid gray; }',
      // :focus present but it only RE-kills the ring (no visible replacement)
      '.link { outline: 0; }\n.link:focus { outline: none; }',
      // ring removed; a :focus-within exists but paints nothing visible
      '.trigger { outline: none; }\n.wrapper:focus-within { transition: none; }',
    ],
    good: [
      // ring removed BUT replaced with a :focus-visible box-shadow
      '.button { outline: none; }\n.button:focus-visible { box-shadow: 0 0 0 3px blue; }',
      // hidden input WITH a :focus-visible sibling outline
      '.input { opacity: 0; }\n.input:focus-visible ~ .box { outline: 2px solid blue; }',
      // ring removed on inner input, focus glow on the wrapper (:focus-within)
      '.input { outline: none; }\n.wrapper:focus-within { box-shadow: 0 0 15px orange; }',
      // plain :focus with a real visible outline is a valid indicator
      '.link { outline: none; }\n.link:focus { outline: 2px solid blue; }',
      // no trigger at all: only a decorative scrollbar-thumb :hover
      '.content::-webkit-scrollbar-thumb:hover { background: gray; }',
      // no trigger: hover recolor on a non-focusable element, no ring removed
      '.row:hover { background: rgba(0,0,0,0.04); }',
      // a comment mentioning outline:none / opacity:0 must NOT trigger
      '/* the input is opacity: 0 and we set outline: none on it */\n.card { padding: 8px; }',
      // outline:none lives INSIDE the focus-visible block (replaced by box-shadow)
      '.btn:focus-visible { outline: none; box-shadow: 0 0 0 2px teal; }',
    ],
  },
}

export default lint
