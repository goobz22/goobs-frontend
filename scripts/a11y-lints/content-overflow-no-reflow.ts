import { readFileSync } from 'node:fs'
import { join, posix } from 'node:path'
import type { A11yLint, LintFile, Violation } from '../lint-a11y'

/**
 * CLASS: content-overflow-no-reflow (WCAG 1.4.10 Reflow).
 *
 * A component renders content it does NOT itself size — arbitrarily-wide media
 * or preformatted text — WITHOUT a CSS reflow guard, so that content overflows
 * its container and forces a two-dimensional page scroll at a 320px-wide
 * viewport / 400% zoom. 1.4.10 forbids exactly that: content must reflow to a
 * single-column narrow viewport without a horizontal page scroll.
 *
 * The 2026-07 audit found this shape twice, both in the Markdown renderer: its
 * `mdToHtml` output emits bare `<img>` (a wide image overflowed the content box)
 * and `<pre><code>` (a long unwrapped code line widened the whole page). Both
 * were fixed in CSS — `.root img { max-width: 100% }` and
 * `.root pre { overflow-x: auto }` (Markdown.module.css) — NOT in the TSX.
 *
 * ── The LOGICAL SHAPE (not the literal string from one file) ──────────────────
 * The TRIGGER lives in the .tsx (an element renders un-sized content); the FIX
 * lives in the companion .module.css. So this module is TSX-triggered but
 * CSS-verified — it reads the component's imported stylesheet from disk (the
 * a11y-lint runner only feeds .ts/.tsx; a CSS-level fix must be read from the
 * stylesheet — the same shape `missing-focus-visible-style` uses). Three
 * trigger kinds:
 *
 *   (A) INJECTED HTML — an element with `dangerouslySetInnerHTML`. The injected
 *       markup is arbitrary (markdown / rich-text / user content) and can carry
 *       BOTH a wide `<img>` and a long-line `<pre>`. It is reflow-safe only when
 *       its CSS either (a) scroll-contains the container itself
 *       (`overflow[-x]: auto|scroll|hidden` on the container class — the whole
 *       subtree is then clipped/scrolled inside the box, never widening the
 *       page), OR (b) constrains BOTH descendant media
 *       (`.<container> img { max-width|width }`) AND descendant preformatted text
 *       (`.<container> pre { overflow[-x]: auto|scroll|hidden }`) — the exact
 *       Markdown fix — OR (c) carries an inline `overflow`/`maxWidth` style.
 *
 *   (B) RAW `<img>` — an intrinsic image element. Reflow-safe when its own class
 *       (or a descendant `img` rule) constrains width (`max-width`/`width`), or
 *       it has an inline width cap. (A fixed-small avatar with a width class is
 *       fine; an un-capped raw image with a data-driven src is the risk.)
 *
 *   (C) RAW `<pre>` — an intrinsic preformatted block. Reflow-safe when its own
 *       class (or a descendant `pre` rule) scroll-contains it (`overflow[-x]`),
 *       or it has an inline overflow style. (CodeCopy's `.pre { overflow: auto }`
 *       is the reference good state.)
 *
 * ── ESCAPE HATCHES (encoded in the check, never a file ignore-list) ───────────
 *  1. CONTAINER scroll-containment (`overflow[-x]: auto|scroll|hidden` on the
 *     trigger's own class) fully guards an injected subtree — nothing inside can
 *     widen the page — so it satisfies the guard on its own. `overflow: visible`
 *     (the default) and a bare `max-width` on the CONTAINER do NOT: a wide
 *     descendant still overflows a max-width container that does not clip.
 *  2. INLINE `overflow`/`overflow-x`/`maxWidth` in the trigger's `style={{…}}`
 *     counts as a guard (data-driven layouts legitimately size inline).
 *  3. The descendant guards are SCOPED to the trigger's container class, so a
 *     stylesheet SHARED by two injected surfaces (ComplexTextEditor's
 *     `.markdownPreview` + `.richSurface`) must guard EACH — an `img` rule under
 *     one container does not falsely satisfy the other.
 *  4. `<img>`/`<pre>` mentioned inside a `/* … *\/` block comment or JSX
 *     `{/* … *\/}` comment (JSDoc "renders a plain `<img>`") is stripped before
 *     scanning, and a `<pre` inside a string literal (`formatBlock', '<pre>'`) is
 *     skipped — neither is a rendered element.
 *  aria-hidden is deliberately NOT an escape hatch: reflow is a VISUAL failure,
 *  so hidden-from-AT content still overflows the viewport.
 */

/** Repo root (…/scripts/a11y-lints → up two). */
const ROOT = join(import.meta.dir, '..', '..')

/** Selftest snippets carry their companion CSS after this sentinel. */
const COMPANION_CSS = '/*__COMPANION_CSS__*/'

/** Escape a string for use as a literal inside a RegExp. */
function esc(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/** Blank the CONTENT of `//` line comments AND `/* … *\/` block comments
 *  (JSDoc / JSX included), preserving every newline so offsets and reported
 *  line numbers still match the source. String- and template-literal-aware so
 *  a `//` inside a string (`https://…`) is never treated as a comment — a
 *  stray `<pre>`/`<img>` mention in ANY comment form must not read as a
 *  rendered element (CodeCopy's `// The <pre> becomes …` prose was a false
 *  positive under the old block-only stripper). */
function stripBlockComments(text: string): string {
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

/** 1-based line number of a character offset. */
function lineOf(text: string, offset: number): number {
  let line = 1
  for (let i = 0; i < offset && i < text.length; i++)
    if (text[i] === '\n') line++
  return line
}

/**
 * Advance from just after an opening tag's name to that tag's closing `>`,
 * tracking `{…}` depth and string/template quotes so a `>` inside an expression
 * or string does not end the tag early. Returns the closing `>` index.
 */
function readTagEnd(text: string, from: number): number {
  let depth = 0
  let quote: string | null = null
  for (let i = from; i < text.length; i++) {
    const c = text[i]
    if (quote) {
      if (c === quote && text[i - 1] !== '\\') quote = null
      continue
    }
    if (c === '"' || c === "'" || c === '`') {
      quote = c
      continue
    }
    if (c === '{') {
      depth++
      continue
    }
    if (c === '}') {
      depth--
      continue
    }
    if (c === '>' && depth === 0) return i
  }
  return text.length - 1
}

/** Extract the raw `className` value expression from an opening tag's attrs. */
function extractClassName(attrText: string): string {
  const key = /(^|[\s{])className\s*=\s*/g
  const keyMatch = key.exec(attrText)
  if (!keyMatch) return ''
  let i = key.lastIndex
  const open = attrText[i]
  if (open === '"' || open === "'") {
    const end = attrText.indexOf(open, i + 1)
    return end < 0 ? '' : attrText.slice(i + 1, end)
  }
  if (open === '{') {
    let depth = 0
    let quote: string | null = null
    let out = ''
    for (; i < attrText.length; i++) {
      const c = attrText[i]
      if (quote) {
        out += c
        if (c === quote && attrText[i - 1] !== '\\') quote = null
        continue
      }
      if (c === '"' || c === "'" || c === '`') {
        quote = c
        out += c
        continue
      }
      if (c === '{') {
        depth++
        if (depth === 1) continue
        out += c
        continue
      }
      if (c === '}') {
        depth--
        if (depth === 0) return out
        out += c
        continue
      }
      out += c
    }
    return out
  }
  return ''
}

/**
 * The CSS-module member(s) referenced by a className expression, e.g.
 * `mergeClassNames(cssStyles.root, className)` → ['root'],
 * `cssStyles.markdownPreview` → ['markdownPreview']. Property accesses only
 * (`.<ident>`); a bare passthrough var like `className` yields nothing.
 */
function classMembers(attrText: string): string[] {
  const expr = extractClassName(attrText)
  const out: string[] = []
  const re = /\.([A-Za-z_$][\w$]*)/g
  let m: RegExpExecArray | null
  while ((m = re.exec(expr))) out.push(m[1])
  return out
}

/** Does the trigger's own `style={{…}}` set an overflow/maxWidth guard? */
function hasInlineOverflowGuard(attrText: string): boolean {
  return /style\s*=\s*\{[\s\S]*\b(overflowX|overflow|maxWidth)\b/.test(attrText)
}
function hasInlineWidthGuard(attrText: string): boolean {
  return /style\s*=\s*\{[\s\S]*\b(maxWidth|width)\b/.test(attrText)
}

/** Blank every CSS `/* … *\/` comment, preserving newlines. */
function stripCssComments(css: string): string {
  return css.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '))
}

interface CssRule {
  selector: string
  block: string
}
function cssRules(css: string): CssRule[] {
  const out: CssRule[] = []
  const re = /([^{}]+)\{([^{}]*)\}/g
  let m: RegExpExecArray | null
  while ((m = re.exec(css))) out.push({ selector: m[1].trim(), block: m[2] })
  return out
}

const OVERFLOW_CONTAIN = /\boverflow(-x)?\s*:\s*(auto|scroll|hidden)\b/i
const HAS_WIDTH = /\b(max-width|width)\s*:/i

/**
 * The trigger's CONTAINER class scroll-contains its own overflow: a rule whose
 * final compound selector is `.<member>` (optionally with a state pseudo/attr,
 * but NOT a descendant element) and whose block sets overflow auto/scroll/hidden.
 */
function containerScrollContains(css: string, member: string): boolean {
  const finalIsClass = new RegExp(
    '\\.' + esc(member) + '(?![\\w-])(?:::?[\\w-]+|\\[[^\\]]*\\])*\\s*$'
  )
  for (const { selector, block } of cssRules(css)) {
    if (!OVERFLOW_CONTAIN.test(block)) continue
    for (const seg of selector.split(','))
      if (finalIsClass.test(seg.trim())) return true
  }
  return false
}

/** The trigger's own class carries a width cap (raw `<img>` guard). */
function classHasWidth(css: string, member: string): boolean {
  const isClass = new RegExp(
    '\\.' + esc(member) + '(?![\\w-])(?:::?[\\w-]+|\\[[^\\]]*\\])*\\s*$'
  )
  for (const { selector, block } of cssRules(css)) {
    if (!HAS_WIDTH.test(block)) continue
    for (const seg of selector.split(','))
      if (isClass.test(seg.trim())) return true
  }
  return false
}

/** The trigger's own class scroll-contains (raw `<pre>` guard). */
function classHasOverflow(css: string, member: string): boolean {
  return containerScrollContains(css, member)
}

/**
 * A descendant `element` under the container class is constrained: a selector
 * segment names `.<member>` and, after it (as a descendant/child), the intrinsic
 * `element`, and the block matches `blockRe`. Scoping to the container class is
 * what keeps a stylesheet shared by two injected surfaces honest.
 */
function hasScopedDescendantGuard(
  css: string,
  member: string,
  element: string,
  blockRe: RegExp
): boolean {
  const classRe = new RegExp('\\.' + esc(member) + '(?![\\w-])')
  const descRe = new RegExp('[\\s>~+]' + element + '(?![\\w-])')
  for (const { selector, block } of cssRules(css)) {
    if (!blockRe.test(block)) continue
    for (const rawSeg of selector.split(',')) {
      const seg = ' ' + rawSeg.trim()
      const cm = classRe.exec(seg)
      if (!cm) continue
      if (descRe.test(seg.slice(cm.index + cm[0].length))) return true
    }
  }
  return false
}

/** Resolve every `import … from '….module.css'` to a repo-relative path. */
function cssImportPaths(tsxPath: string, tsxText: string): string[] {
  const dir = posix.dirname(tsxPath)
  const re = /import\s+[^'"]*from\s*['"]([^'"]+\.module\.css)['"]/g
  const out: string[] = []
  let m: RegExpExecArray | null
  while ((m = re.exec(tsxText))) {
    const rel = m[1]
    if (!rel.startsWith('.')) continue
    out.push(posix.normalize(posix.join(dir, rel)))
  }
  return out
}

/**
 * The companion CSS for a file. Selftest snippets embed it after the sentinel;
 * real .tsx files resolve + read their imported `.module.css` from disk.
 */
function companionCss(path: string, rawText: string): string {
  if (path.startsWith('__selftest__/')) {
    const idx = rawText.indexOf(COMPANION_CSS)
    return idx < 0 ? '' : rawText.slice(idx + COMPANION_CSS.length)
  }
  return cssImportPaths(path, rawText)
    .map((rel) => {
      try {
        return readFileSync(join(ROOT, rel), 'utf8')
      } catch {
        return ''
      }
    })
    .join('\n')
}

function checkFile(path: string, rawText: string): Violation[] {
  // Split off the selftest companion CSS BEFORE stripping comments (the sentinel
  // is itself a comment), then work over the comment-stripped TSX portion.
  const sentIdx = path.startsWith('__selftest__/')
    ? rawText.indexOf(COMPANION_CSS)
    : -1
  const tsxRaw = sentIdx < 0 ? rawText : rawText.slice(0, sentIdx)
  const tsx = stripBlockComments(tsxRaw)
  const css = stripCssComments(companionCss(path, rawText))
  const violations: Violation[] = []

  const tagRe = /<([A-Za-z][\w.]*)/g
  let m: RegExpExecArray | null
  while ((m = tagRe.exec(tsx))) {
    const before = tsx[m.index - 1]
    // Skip a `<pre`/`<img` that is really inside a string literal, or inside a
    // regex literal (`html.match(/<pre>/g)` — Markdown's converter scans its
    // OWN output for `<pre>` tokens; those are patterns, not rendered elements).
    if (before === '"' || before === "'" || before === '`' || before === '/')
      continue
    const name = m[1]
    const end = readTagEnd(tsx, tagRe.lastIndex)
    const attrText = tsx.slice(tagRe.lastIndex, end)
    tagRe.lastIndex = end + 1
    const members = classMembers(attrText)

    if (/\bdangerouslySetInnerHTML\b/.test(attrText)) {
      // (A) Injected arbitrary HTML.
      const inline = hasInlineOverflowGuard(attrText)
      const contained = members.some((mem) => containerScrollContains(css, mem))
      const imgGuard = members.some((mem) =>
        hasScopedDescendantGuard(css, mem, 'img', HAS_WIDTH)
      )
      const preGuard = members.some((mem) =>
        hasScopedDescendantGuard(css, mem, 'pre', OVERFLOW_CONTAIN)
      )
      if (!inline && !contained && !(imgGuard && preGuard)) {
        const cls = members[0] ? `.${members[0]}` : 'the container class'
        violations.push({
          file: path,
          line: lineOf(tsx, m.index),
          message:
            'element injects arbitrary HTML (dangerouslySetInnerHTML) but its ' +
            `CSS neither scroll-contains ${cls} (overflow-x: auto) nor ` +
            'constrains descendant media — a wide <img> or long <pre> code line ' +
            'overflows and forces a two-dimensional page scroll (WCAG 1.4.10). ' +
            `Add \`${cls} img { max-width: 100% }\` + \`${cls} pre { overflow-x: auto }\` ` +
            '(see Markdown.module.css).',
        })
      }
    } else if (name === 'img') {
      // (B) Raw intrinsic image.
      const safe =
        hasInlineWidthGuard(attrText) ||
        members.some((mem) => classHasWidth(css, mem)) ||
        members.some((mem) =>
          hasScopedDescendantGuard(css, mem, 'img', HAS_WIDTH)
        )
      if (!safe)
        violations.push({
          file: path,
          line: lineOf(tsx, m.index),
          message:
            'raw <img> with no width cap — a wide image overflows its container ' +
            'and forces a two-dimensional page scroll (WCAG 1.4.10). Constrain ' +
            'it with `max-width: 100%; height: auto` (its className class, or an ' +
            'inline maxWidth).',
        })
    } else if (name === 'pre') {
      // (C) Raw intrinsic preformatted block.
      const safe =
        hasInlineOverflowGuard(attrText) ||
        members.some((mem) => classHasOverflow(css, mem)) ||
        members.some((mem) =>
          hasScopedDescendantGuard(css, mem, 'pre', OVERFLOW_CONTAIN)
        )
      if (!safe)
        violations.push({
          file: path,
          line: lineOf(tsx, m.index),
          message:
            'raw <pre> not scroll-contained — a long unwrapped line overflows ' +
            'and forces a two-dimensional page scroll (WCAG 1.4.10). Add ' +
            '`overflow-x: auto; max-width: 100%` to its className class (see ' +
            'CodeCopy.module.css `.pre`).',
        })
    }
  }

  return violations
}

const lint: A11yLint = {
  name: 'content-overflow-no-reflow',
  wcag: '1.4.10',
  description:
    'A component renders content it does not size — HTML injected via ' +
    'dangerouslySetInnerHTML, or a raw <img>/<pre> — without a CSS reflow guard, ' +
    'so a wide image or long code line overflows and forces a two-dimensional ' +
    'page scroll at a 320px viewport / 400% zoom. The fix lives in the companion ' +
    '.module.css (constrain descendant img/pre, or scroll-contain the container), ' +
    'so this TSX-triggered class reads the imported stylesheet from disk.',
  check(files: LintFile[]): Violation[] {
    const violations: Violation[] = []
    for (const { path, text } of files)
      violations.push(...checkFile(path, text))
    return violations
  },
  selftest: {
    bad: [
      // Injected HTML, container class has neither overflow nor descendant guards.
      '<div className={s.preview} dangerouslySetInnerHTML={{ __html: html }} />\n' +
        COMPANION_CSS +
        '\n.preview { width: 50%; border-left: 1px solid; }',
      // Injected HTML with an img guard but MISSING the pre guard.
      '<article className={s.md} dangerouslySetInnerHTML={{ __html: h }} />\n' +
        COMPANION_CSS +
        '\n.md img { max-width: 100%; height: auto; }',
      // Injected HTML whose only overflow lives on a DIFFERENT container class
      // (shared-stylesheet honesty: .other must not satisfy .surface).
      '<div className={s.surface} dangerouslySetInnerHTML={{ __html: h }} />\n' +
        COMPANION_CSS +
        '\n.other { overflow-x: auto; }\n.surface { max-width: 100%; }',
      // Raw <pre> whose class has no overflow containment.
      '<pre className={s.code}>{code}</pre>\n' +
        COMPANION_CSS +
        '\n.code { padding: 8px; font-family: monospace; }',
    ],
    good: [
      // Injected HTML with BOTH scoped descendant guards (the Markdown fix).
      '<div className={mergeClassNames(s.root, className)} dangerouslySetInnerHTML={{ __html: h }} />\n' +
        COMPANION_CSS +
        '\n.root img { max-width: 100%; height: auto; }\n.root pre { max-width: 100%; overflow-x: auto; }',
      // Injected HTML whose CONTAINER scroll-contains (overflow-x on the class).
      '<div className={s.surface} dangerouslySetInnerHTML={{ __html: h }} />\n' +
        COMPANION_CSS +
        '\n.surface { overflow-x: auto; max-width: 100%; }',
      // Injected HTML container clips its overflow (overflow: hidden guards 1.4.10).
      '<article className={s.body} dangerouslySetInnerHTML={{ __html: h }} />\n' +
        COMPANION_CSS +
        '\n.body { overflow: hidden; }',
      // Raw <pre> whose class scroll-contains (the CodeCopy good state).
      '<pre className={s.pre} tabIndex={0}>{code}</pre>\n' +
        COMPANION_CSS +
        '\n.pre { overflow: auto; max-width: 100%; }',
      // A <pre> inside a string literal is not a rendered element.
      "const codeTag = execCmd('formatBlock', '<pre>')\n" +
        COMPANION_CSS +
        '\n.editor { padding: 8px; }',
      // A <pre> inside a REGEX literal is a pattern, not a rendered element
      // (the Markdown makeCodeBlocksAccessible shape).
      'const total = (html.match(/<pre>/g) ?? []).length\n' +
        'return html.replace(/<pre>/g, () => `<pre tabindex="0">`)\n' +
        COMPANION_CSS +
        '\n.root pre { overflow-x: auto; }',
      // JSDoc mentioning a plain <img> is a comment, not a trigger.
      '/** Framework-agnostic: renders a plain `<img>` by default. */\n' +
        'export const X = () => <div className={s.wrap}>hi</div>\n' +
        COMPANION_CSS +
        '\n.wrap { padding: 4px; }',
      // `//` line comments mentioning <pre>/<img> are prose, not rendered
      // elements (the CodeCopy false-positive shape).
      '// The <pre> becomes a keyboard-focusable scroll region when it overflows\n' +
        '// and a wide <img> would be capped by the container.\n' +
        'const measured = useState(false)\n' +
        COMPANION_CSS +
        '\n.pre { overflow: auto; max-width: 100%; }',
      // A non-trigger element with no injected/raw-media content.
      '<div className={s.card}>text</div>\n' +
        COMPANION_CSS +
        '\n.card { padding: 8px; }',
      // Injected HTML with an inline overflow guard needs no stylesheet rule.
      "<div className={s.x} style={{ overflowX: 'auto', maxWidth: '100%' }} dangerouslySetInnerHTML={{ __html: h }} />\n" +
        COMPANION_CSS +
        '\n.x { width: 50%; }',
    ],
  },
}

export default lint
