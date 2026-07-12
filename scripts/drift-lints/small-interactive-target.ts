import type { DriftFile, DriftInstance, DriftLint } from '../lint-drift'

/**
 * DRIFT CLASS: small-interactive-target (WCAG 2.2 AA — 2.5.8 Target Size
 * (Minimum)). A pointer target must be at least 24 x 24 CSS px, unless it is
 * covered by an exception (Spacing, Equivalent, Inline, Essential, or under UA
 * control). This ratchet freezes the CSS rules that give an INTERACTIVE-named
 * element a FIXED sub-24px width/height/min-width/min-height, and FAILS when a
 * new such rule appears — new controls must be born ≥24px or extend their hit
 * area (padding, or a transparent `::before { position:absolute; inset:-Npx }`
 * hit-extender on a position:relative target — see Chip `.closeButton`).
 *
 * WHY A NAME HEURISTIC (and its honest limits): whether a class is a real
 * pointer target is a fact about the TSX that renders it (a `<button>`, an
 * `onClick`, a `role`), which a CSS-scoped lint cannot see. So this measures a
 * PROXY: the class NAME denotes a control. That proxy fails in BOTH directions,
 * and per the module contract FALSE POSITIVES ARE POISON, so the heuristic is
 * tuned to UNDER-measure:
 *   - A decorative element with an interactive-sounding name is vetoed by a
 *     DECORATIVE word (`.iconContainer`, `.buttonContainer`, `.chipLabel` — the
 *     structural/graphical part is not itself the target; the control is
 *     measured on its own class). This is why TreeView's clickable
 *     `.iconContainer` (icon+container → vetoed) is DELIBERATELY MISSED rather
 *     than risk flagging the decorative `.icon` / Stepper `.customIcon` / the
 *     SaveButton `.spinner` alongside it.
 *   - A real target whose class name carries no control word is missed (an
 *     accepted under-measure — the ratchet still catches the common,
 *     control-named cases).
 * The subject-compound rule (only the rightmost compound's classes are read)
 * keeps a descendant selector like `.foo .icon` from borrowing `.foo`'s words,
 * and pseudo-elements without a class (`::-webkit-scrollbar-thumb`) never match
 * — scrollbars are UA chrome, out of scope for 2.5.8.
 *
 * WHAT IS AN INSTANCE: a `width` / `height` / `min-width` / `min-height`
 * declaration whose value is a bare px literal < 24, inside a rule whose
 * rightmost selector has a class with an INTERACTIVE word and no DECORATIVE
 * word. `max-width` / `max-height` (a cap, not a floor), custom-property
 * definitions (`--switch-thumb-size: 20px`), `border-width`, and token/`calc`/
 * `clamp`/`%` values never match.
 *
 * BASELINE (the legitimately-remaining sub-24 targets, each under a 2.5.8
 * exception — the ratchet's contract is NO GROWTH, and story-pinned fixes
 * SHRINK it via `--update`):
 *   - Field Number/Percentage/USD `.button` (16px increment/decrement) —
 *     EQUIVALENT exception: the same value is settable by typing into the
 *     ≥24px-tall text input on the same field.
 *   - DataGrid `.resizeHandle` (8px col-resize grip) — ESSENTIAL exception: a
 *     column-resize handle must sit on the thin column edge; width is essential.
 *   - TreeView `.checkbox` (16/18px native checkbox) — EQUIVALENT exception:
 *     the node is also selectable via its ≥24px row/label control.
 * Chip (`.pill[data-chip-clickable]`→24px, `.closeButton` ::before 24px hit
 * area, `.chip` root 32px) and Stepper (`.stepButton` target ≥24px via padding;
 * the 20px `.customIcon` is decorative) produce ZERO instances — they are fixed,
 * so the ratchet holds them at zero.
 */

/** Blank `/* … *​/` comment content (string-aware, newline-preserving) so an
 *  interactive-looking `width: 16px` written inside a comment is never a hit.
 *  CSS has no `//` line comments (a `//` only appears inside `url(https://…)`),
 *  so that branch is intentionally absent. Adapted from
 *  scripts/a11y-lints/label-input-id-divergence.ts / css-px-font-size.ts. */
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

/** Control nouns: a class carrying one of these (as a whole camelCase/kebab
 *  word) is treated as a pointer target. */
const INTERACTIVE_WORDS = new Set([
  'button',
  'btn',
  'chip',
  'checkbox',
  'radio',
  'toggle',
  'swatch',
  'option',
  'handle',
  'thumb',
  'grip',
  'knob',
  'trigger',
  'close',
  'delete',
  'remove',
  'increment',
  'decrement',
  'stepper',
  'tab',
  'link',
  'anchor',
  'action',
])

/** Decorative / structural nouns: their presence VETOES a match, even beside an
 *  interactive word — the sized element is a graphic or a wrapper, not the
 *  target itself (`.iconContainer`, `.buttonContainer`, `.chipLabel`). This is
 *  the under-measure knob: ambiguous names are dropped, not flagged. */
const DECORATIVE_WORDS = new Set([
  'icon',
  'dot',
  'spinner',
  'indicator',
  'divider',
  'connector',
  'caret',
  'arrow',
  'chevron',
  'glyph',
  'badge',
  'count',
  'track',
  'rail',
  'scrollbar',
  'avatar',
  'thumbnail',
  'line',
  'rule',
  'separator',
  'ring',
  'ripple',
  'overlay',
  'backdrop',
  'shadow',
  'container',
  'wrapper',
  'group',
  'list',
  'bar',
  'row',
  'cell',
  'panel',
  'content',
  'area',
  'region',
  'section',
  'grid',
  'column',
  'label',
  'text',
  'title',
  'heading',
  'description',
  'hint',
  'message',
  'placeholder',
  'progress',
  'fill',
  'meter',
  'gauge',
  'spacer',
  'marker',
  'decoration',
  'tick',
  'dash',
])

/** Split a class name into lowercase words across camelCase, kebab, and
 *  underscore boundaries: `closeButton` → [close, button],
 *  `resize-handle` → [resize, handle]. */
function wordsOf(className: string): string[] {
  return className
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .split(/[-_\s]+/)
    .map((w) => w.toLowerCase())
    .filter(Boolean)
}

/** A class is an interactive target iff it carries an interactive word and no
 *  decorative word. */
function classIsInteractive(className: string): boolean {
  const words = wordsOf(className)
  if (!words.some((w) => INTERACTIVE_WORDS.has(w))) return false
  if (words.some((w) => DECORATIVE_WORDS.has(w))) return false
  return true
}

/** Does this rule's SUBJECT (the rightmost compound of each comma-separated
 *  selector) carry an interactive class? Only the subject is sized by the
 *  rule, so a descendant ancestor (`.foo .icon`) never lends its words. */
function selectorTargetsInteractive(selector: string): boolean {
  for (const part of selector.split(',')) {
    // Rightmost compound = text after the last combinator (space, >, +, ~).
    const subject = part.trim().split(/[\s>+~]+/).pop() ?? ''
    const classes = subject.match(/\.(-?[A-Za-z_][\w-]*)/g) ?? []
    for (const cls of classes) {
      if (classIsInteractive(cls.slice(1))) return true
    }
  }
  return false
}

/** A single declaration `width|height|min-width|min-height: <n>px` with n < 24.
 *  Anchored at the start of an isolated declaration so `max-width`,
 *  `border-width`, and `--x-width` custom props never match; a token / calc /
 *  clamp / % / rem value never starts with a bare px number so never matches. */
const SIZE_DECL = /^((?:min-)?(?:width|height))\s*:\s*(\d*\.?\d+)px\b/

const lint: DriftLint = {
  name: 'small-interactive-target',
  scope: 'css',
  description:
    'A CSS rule gives an interactive-named element (button/chip/checkbox/handle/close/…) a fixed sub-24px width/height/min-*, below the WCAG 2.5.8 (AA 2.2) 24x24 target-size floor. New controls must be born >=24px or extend their hit area (padding, or a transparent ::before inset hit-extender). A CSS lint cannot read the TSX, so the class-NAME heuristic under-measures: decorative-named parts (icon/container/spinner) are vetoed rather than risk false positives.',
  canon:
    'A pointer target must be >=24x24 CSS px (WCAG 2.5.8). Grow the HIT AREA without touching the visual: bump a negligibly-small dim (Chip pill 22->24px), add padding, or extend the target with a transparent `::before { position:absolute; inset:-Npx }` on a position:relative control (Chip `.closeButton` renders a 24x24 ::before around a ~16px glyph).\n' +
    'The class-NAME proxy (interactive word present, decorative word absent, read only on the rule subject) under-measures on purpose — false positives are poison. Baselined remainders are each under a 2.5.8 exception: Field increment `.button` 16px (Equivalent: type into the field), DataGrid `.resizeHandle` 8px (Essential: thin column grip), TreeView `.checkbox` 16/18px (Equivalent: row/label selects). Growth of ANY interactive-named sub-24 dim fails; fixes shrink the baseline via --update.',
  measure(files: DriftFile[]): DriftInstance[] {
    const out: DriftInstance[] = []
    for (const { path, text: raw } of files) {
      const text = blankComments(raw)
      // Stack-based walk: track the nesting of selectors, and attribute each
      // declaration to its innermost enclosing rule. @keyframes frames and
      // at-rule wrappers (@media/@supports) carry no class, so a declaration
      // inside them only matches when a nested CLASS rule wraps it.
      const stack: string[] = []
      let buf = ''
      let bufStart = 0
      const flushDecl = (endIndex: number) => {
        const decl = buf.trim()
        if (decl.includes(':')) {
          const m = SIZE_DECL.exec(decl)
          if (m) {
            const value = parseFloat(m[2])
            const subject = stack[stack.length - 1] ?? ''
            if (value < 24 && selectorTargetsInteractive(subject)) {
              const declOffset = bufStart + (buf.length - buf.trimStart().length)
              const line = text.slice(0, declOffset).split('\n').length
              // Short stable token: subject class + prop:value.
              const cls =
                (subject.match(/\.(-?[A-Za-z_][\w-]*)/) ?? [])[0] ?? subject
              out.push({
                file: path,
                line,
                token: `${cls} ${m[1]}:${m[2]}px`,
              })
            }
          }
        }
        buf = ''
        bufStart = endIndex
      }
      for (let i = 0; i < text.length; i++) {
        const c = text[i]
        if (c === '{') {
          stack.push(buf.trim())
          buf = ''
          bufStart = i + 1
        } else if (c === '}') {
          flushDecl(i)
          stack.pop()
          buf = ''
          bufStart = i + 1
        } else if (c === ';') {
          flushDecl(i)
        } else {
          if (buf === '') bufStart = i
          buf += c
        }
      }
    }
    return out
  },
  selftest: {
    bad: [
      // increment/decrement button (the real Field-number shape).
      '.button {\n  width: 16px;\n  height: 16px;\n  min-width: 16px;\n}',
      // a close/delete control given a small fixed height.
      '.closeButton { min-height: 20px; }',
      // a resize/drag handle narrower than 24.
      '.resizeHandle { width: 8px; }',
      // a native checkbox sized under 24, with an attribute selector attached.
      ".checkbox[data-theme='sacred'] { width: 18px; height: 18px; }",
      // fractional value under 24.
      '.toggle { height: 23.5px; }',
    ],
    good: [
      // a control already >= 24 in both axes.
      '.button { width: 24px; height: 32px; }',
      // min at exactly the 24 floor passes.
      '.chip { min-height: 24px; }',
      // decorative graphic — not include-worded.
      '.icon { width: 20px; height: 20px; }',
      '.spinner { width: 13px; height: 13px; }',
      '.divider { height: 20px; }',
      // interactive word beside a decorative word → vetoed (the container/graphic
      // part is not the target; the real control is measured on its own class).
      '.iconContainer { width: 20px; height: 20px; }',
      '.buttonContainer { height: 20px; }',
      '.chipLabel { height: 16px; }',
      // scrollbar pseudo-element: subject class is decorative-worded, and the
      // ::-webkit-scrollbar part has no class of its own.
      '.tableWrapper::-webkit-scrollbar { width: 8px; height: 8px; }',
      '.board::-webkit-scrollbar-thumb { width: 12px; }',
      // ancestor is interactive but the SIZED subject is a decorative graphic.
      '.button .icon { width: 16px; }',
      // caps and custom-property definitions are not floors.
      '.button { max-width: 16px; max-height: 16px; }',
      ':root { --switch-thumb-size: 20px; }',
      '.field { border-width: 2px; }',
      // token / calc / clamp / % values (never a bare px literal).
      '.button { min-height: var(--goobs-control-height); }',
      '.button { width: calc(100% - 8px); }',
      '.tab { height: 2rem; }',
      // word-boundary safety: "table"/"transaction" are not tab/action.
      '.table { height: 16px; }',
      '.transactionRow { height: 16px; }',
      // the broken shape inside a comment is documentation, not code.
      '/* legacy: .button { width: 16px } */\n.button { min-height: 24px; }',
    ],
  },
}

export default lint
