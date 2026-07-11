import type { A11yLint, LintFile, Violation } from '../lint-a11y'

/**
 * CLASS: icon-missing-aria-hidden (WCAG 1.1.1 Non-text Content, Level A).
 *
 * A decorative icon that carries NO accessibility intent is announced by screen
 * readers as a stray, unlabelled "graphic"/character that adds noise beside the
 * text, button, or field it merely decorates — or, if it duplicates state already
 * exposed elsewhere (a chevron mirroring `aria-expanded`, a check mirroring a
 * native checkbox), it double-announces it. The 2026-07 component audit found this
 * shape in two concrete forms, both handled by this one module:
 *
 *   (A) a hand-authored inline `<svg>` with no `aria-hidden` and no accessible name
 *       (Accordion, Alert, BigCalendar, Button, Checkbox, Chip, ComplexTextEditor,
 *       ConfirmationCodeInput, DataGrid); and
 *   (B) a decorative Unicode ICON-GLYPH rendered as literal JSX TEXT — an Egyptian
 *       hieroglyph (𓊹 𓊗 𓊨 …), a check/cross dingbat (✓ ✕), a geometric caret /
 *       shape indicator (▲ ▼ ◆ ●), a sparkle/star (✦ ★), or a UI symbol (⚙ ⚡ ☰ ⧉)
 *       that sits naked in the reading order (QRCode 𓊹, Switch ✓/𓊹, DataGrid Rows
 *       ▲ value-indicator, Field/USD 𓊹, Toolbar 𓊗, TransferList 𓊨, PricingTable ✦).
 *
 * Every fix is the same: mark the icon decorative with `aria-hidden="true"` (svg
 * also gets `focusable="false"` to drop the legacy IE/Edge tab stop), either on the
 * icon element itself or on a decorative ancestor that already wraps it; OR — for
 * the rare meaningful icon — give it a real accessible name (`role="img"` +
 * `aria-label`/`aria-labelledby`, or a child `<title>` for svg).
 *
 * ── (A) svg shape: the class (not the literal string from one file) ──────────
 * A raw `<svg …>` JSX element (a hand-written inline SVG, NOT a goobs `<Icon>`)
 * whose opening tag exposes no accessibility intent and which carries no
 * `<title>` child. Such an svg reaches the accessibility tree naked.
 *
 * The architectural root fix (why goobs `<Icon>` usages are NOT flagged): the 261
 * goobs Icon components render their `<svg>` through `resolveIconA11y`
 * (src/components/Icons/iconA11y.ts), which makes every icon **decorative by
 * default** — with no text alternative it spreads `aria-hidden="true"
 * focusable="false"` onto the inner svg, flipping to a named `role="img"` only when
 * the consumer passes `aria-label`/`aria-labelledby`/`title`. Those svgs spread
 * `{...svgA11y}`, which this check treats as a satisfied escape hatch, so the whole
 * Icons family passes without an ignore-list.
 *
 * ── (B) glyph shape: the class ──────────────────────────────────────────────
 * A curated set of decorative icon-glyph codepoints (Egyptian hieroglyphs, check /
 * cross dingbats, geometric shapes, sparkles/stars, and a few UI symbols — see
 * `isDecorativeIconGlyph`) rendered as literal JSX text that is neither hidden nor
 * named. Bare directional arrows (→ ← ↑ ↓ ↗ …) are DELIBERATELY EXCLUDED: they
 * routinely appear as meaningful JSX text ("{oldValue} → {newValue}"), so flagging
 * them would cry wolf. The check is content-scoped (by codepoint), complementing
 * the className-scoped `decorative-content-not-hidden` lint (which catches
 * decorative elements by their CSS-module class name regardless of content).
 *
 * ── Escape hatches (encoded in the check, NOT a file ignore-list) ────────────
 * (A) An `<svg>` is CORRECT — and passes — when its opening tag has any of:
 *   • `aria-hidden` (any non-false value) — decorative, the standard fix;
 *   • `aria-label` / `aria-labelledby` — a real accessible name (meaningful svg);
 *   • a `{...svgA11y}` spread — the goobs Icon resolver owns its a11y at runtime;
 *   • `role="presentation"` / `role="none"` — explicitly removed from the a11y tree;
 * or when the element contains a child `<title>` element (the correct
 * accessible-name mechanism for inline SVG — a `title` *attribute* on `<svg>` is
 * inert, so only a child element counts).
 *
 * (B) A decorative glyph is CORRECT — and passes — when it, OR ANY ANCESTOR
 * element, is covered: `aria-hidden` (non-false), `aria-label`/`aria-labelledby`, a
 * `{...svgA11y}` spread, `role` naming/presentation (img/presentation/none or an
 * interactive role), or an interactive host element (`<button>`/`<a>`). An
 * interactive/labelled host means the glyph is either suppressed by the host's real
 * name or IS the intended name (a missing-accessible-name concern, not this one),
 * so hiding it here would be wrong — those are not flagged.
 *
 * ── Masking ─────────────────────────────────────────────────────────────────
 * Block/line comments and single/double/back-quoted string literals are blanked
 * (length + newlines preserved) before scanning, so an `<svg>` named in a JSDoc
 * example or a selector string, and a glyph living in a STRING literal (a `text`
 * prop, a lookup-table value, a function return) or a comment, never produce a
 * finding. This is why dynamic glyphs like Switch's `getThumbContent()` (a returned
 * string) and CodeCopy's `text={'✓'}` (a labelled Button) are not matched here.
 */

/**
 * Blank out block comments, line comments, and single/double/back-quoted string
 * literals (preserving newlines + length so line numbers stay accurate) so an
 * `<svg>` / glyph named in a comment, a JSDoc example, or a string literal is never
 * matched as JSX. Only ever replaces characters with spaces, so it can cause a
 * missed edge case but never a false positive.
 */
function maskNonCode(text: string): string {
  let t = text.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '))
  t = t.replace(/(^|[^:])\/\/[^\n]*/g, (m, p1: string) =>
    p1 + ' '.repeat(m.length - p1.length)
  )
  t = t.replace(/'(?:[^'\\\n]|\\.)*'/g, (m) => "'" + ' '.repeat(Math.max(0, m.length - 2)) + "'")
  t = t.replace(/"(?:[^"\\\n]|\\.)*"/g, (m) => '"' + ' '.repeat(Math.max(0, m.length - 2)) + '"')
  // Template literals can span multiple lines, so blank only the NON-newline
  // characters (keep `\n`) — otherwise a multi-line `<style>{`…css…`}</style>`
  // collapses newlines and shifts every subsequent glyph/svg line number.
  t = t.replace(/`(?:[^`\\]|\\.)*`/g, (m) => '`' + m.slice(1, -1).replace(/[^\n]/g, ' ') + '`')
  return t
}

// ── (A) inline-svg detection ────────────────────────────────────────────────

/**
 * True when an svg opening tag declares any accessibility intent.
 *
 * `maskedTag` has its attribute-VALUE string literals blanked, so name-only
 * hatches are checked against it — a random `data-x="aria-label…"` VALUE can
 * never fake a hatch. The role hatch needs the attribute VALUE, so it reads the
 * unmasked `rawTag` (character positions are identical between the two).
 */
function openTagIsAccessible(maskedTag: string, rawTag: string): boolean {
  // Decorative (the standard fix) — `aria-hidden` with any value.
  if (/\baria-hidden\b/.test(maskedTag)) return true
  // Named / meaningful — a real accessible name. `\baria-label` matches both
  // `aria-label` and `aria-labelledby`.
  if (/\baria-label/.test(maskedTag)) return true
  // The goobs Icon resolver: `{...svgA11y}` spreads aria-hidden/role at runtime.
  if (/\bsvgA11y\b/.test(maskedTag)) return true
  // Explicitly removed from the a11y tree via a presentational role (value-based).
  if (/\brole\s*=\s*["'](?:presentation|none)["']/.test(rawTag)) return true
  return false
}

function checkSvgs(path: string, text: string, masked: string): Violation[] {
  const violations: Violation[] = []
  const svgOpen = /<svg\b/g
  let match: RegExpExecArray | null
  while ((match = svgOpen.exec(masked)) !== null) {
    const start = match.index
    // End of the opening tag: attribute values were masked to spaces, so the
    // first '>' at/after the tag start closes it (self-closing '/>' included).
    const gt = masked.indexOf('>', start)
    if (gt === -1) break
    const maskedTag = masked.slice(start, gt + 1)
    const rawTag = text.slice(start, gt + 1)

    if (openTagIsAccessible(maskedTag, rawTag)) continue

    // A child <title> is the correct accessible-name mechanism for inline SVG —
    // check the element body (only possible when not self-closing).
    const selfClosing = masked[gt - 1] === '/'
    if (!selfClosing) {
      const closeIdx = masked.indexOf('</svg>', gt)
      const body = closeIdx === -1 ? masked.slice(gt + 1) : masked.slice(gt + 1, closeIdx)
      if (/<title[\s>]/.test(body)) continue
    }

    const line = masked.slice(0, start).split('\n').length
    violations.push({
      file: path,
      line,
      message:
        'decorative inline <svg> exposed to assistive tech — add aria-hidden="true" ' +
        'focusable="false" (decorative), or a real name (role="img" + aria-label, or a ' +
        'child <title>) if it is meaningful',
    })
  }
  return violations
}

// ── (B) decorative-icon-glyph-as-text detection ─────────────────────────────

/**
 * True when `cp` is a decorative UI icon-glyph codepoint. Curated to the classes
 * this library actually uses as ornament/indicators — kept narrow so meaningful
 * text (currency, math, and especially directional arrows) is never matched:
 *   • Egyptian Hieroglyphs  U+13000–U+1342F  (sacred flourishes)
 *   • Geometric Shapes      U+25A0–U+25FF    (▲ ▼ ◆ ● ○ ■ carets/indicators)
 *   • check / cross dingbats U+2713–U+2718   (✓ ✔ ✕ ✖ ✗ ✘)
 *   • sparkles / stars       ✦ ✧ ★ ☆
 *   • UI symbols             ⚙ ⚡ ☰ ⧉
 * Arrows (U+2190–U+21FF, U+2B00-block) are intentionally OMITTED.
 */
function isDecorativeIconGlyph(cp: number): boolean {
  if (cp >= 0x13000 && cp <= 0x1342f) return true // Egyptian Hieroglyphs
  if (cp >= 0x25a0 && cp <= 0x25ff) return true // Geometric Shapes
  if (cp >= 0x2713 && cp <= 0x2718) return true // ✓ ✔ ✕ ✖ ✗ ✘
  if (cp === 0x2726 || cp === 0x2727) return true // ✦ ✧
  if (cp === 0x2605 || cp === 0x2606) return true // ★ ☆
  if (cp === 0x2699 || cp === 0x26a1) return true // ⚙ ⚡
  if (cp === 0x2630 || cp === 0x29c9) return true // ☰ ⧉
  return false
}

/**
 * True when an opening tag's attribute text makes the element (and thus its
 * descendant text) accessibility-covered: decorative, named, resolver-owned, or an
 * interactive/labelled host. Reads the raw attribute slice; since a match only
 * SUPPRESSES a finding, an over-match yields a false negative, never a false
 * positive.
 */
function tagCoversDescendantGlyphs(tagName: string, attrText: string): boolean {
  // Interactive host element — the glyph is suppressed by the host's real name or
  // is itself the intended name (a missing-accessible-name concern, not this one).
  if (/^(?:button|a)$/i.test(tagName)) return true
  // aria-hidden (any value except an explicit false) — decorative.
  if (/\baria-hidden\b/.test(attrText)) {
    if (!/\baria-hidden\s*=\s*(?:["']false["']|\{\s*false\s*\})/.test(attrText))
      return true
  }
  // A real accessible name (aria-label / aria-labelledby) on the host.
  if (/\baria-label/.test(attrText)) return true
  // The goobs Icon resolver spread owns aria-hidden/role at runtime.
  if (/\bsvgA11y\b/.test(attrText)) return true
  // A naming, presentational, or interactive ARIA role (value-based).
  if (
    /\brole\s*=\s*["'](?:img|presentation|none|button|link|menuitem|menuitemcheckbox|menuitemradio|tab|option|checkbox|radio|switch)["']/.test(
      attrText
    )
  )
    return true
  return false
}

/**
 * Advance from just after an opening tag's name to that tag's closing `>`,
 * tracking `{…}` depth and string/template quotes so a `>` inside an expression or
 * string (`=>`, `a > b`) does not end the tag. Runs over MASKED text, where string
 * bodies are blanked but the delimiter quotes remain, so quote tracking still
 * balances. Returns the closing `>` index and whether the tag self-closes.
 */
function readTagEnd(
  text: string,
  from: number
): { end: number; selfClosing: boolean } {
  let depth = 0
  let quote: string | null = null
  let lastNonSpace = ''
  for (let i = from; i < text.length; i++) {
    const c = text[i]
    if (quote) {
      if (c === quote && text[i - 1] !== '\\') quote = null
      continue
    }
    if (c === '"' || c === "'" || c === '`') {
      quote = c
      lastNonSpace = c
      continue
    }
    if (c === '{') {
      depth++
      lastNonSpace = c
      continue
    }
    if (c === '}') {
      depth--
      lastNonSpace = c
      continue
    }
    if (c === '>' && depth === 0) return { end: i, selfClosing: lastNonSpace === '/' }
    if (c !== ' ' && c !== '\t' && c !== '\n' && c !== '\r') lastNonSpace = c
  }
  return { end: text.length - 1, selfClosing: false }
}

/**
 * Detect decorative icon-glyphs rendered as literal JSX text with no covering
 * `aria-hidden`/name on the glyph element or any ancestor. Walks the MASKED text
 * (comments + string literals already blanked) with a tag stack so ancestor
 * coverage (a decorative wrapper hiding a subtree — the common goobs pattern) is
 * honoured. Each stack frame's `covered` flag ORs the whole ancestor chain.
 */
function checkGlyphs(path: string, masked: string): Violation[] {
  const violations: Violation[] = []

  // Precompute line-start offsets for O(log n) line lookup.
  const lineStarts: number[] = [0]
  for (let i = 0; i < masked.length; i++)
    if (masked[i] === '\n') lineStarts.push(i + 1)
  const lineOf = (idx: number): number => {
    let lo = 0
    let hi = lineStarts.length - 1
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1
      if (lineStarts[mid] <= idx) lo = mid
      else hi = mid - 1
    }
    return lo + 1
  }

  // Scan a text run [from, to) for a decorative glyph; report against `covered`.
  // Only the FIRST glyph in a run is reported (one wrapper fix hides the rest).
  const scanRun = (from: number, to: number, covered: boolean): void => {
    if (covered) return
    for (let i = from; i < to; ) {
      const cp = masked.codePointAt(i)
      if (cp === undefined) break
      const wide = cp > 0xffff
      if (isDecorativeIconGlyph(cp)) {
        violations.push({
          file: path,
          line: lineOf(i),
          message:
            'decorative icon-glyph rendered as text is exposed to assistive tech — ' +
            'add aria-hidden="true" to the glyph element or a decorative ancestor ' +
            '(or give the host control a real accessible name if the glyph is meaningful)',
        })
        return
      }
      i += wide ? 2 : 1
    }
  }

  const stack: Array<{ name: string; covered: boolean }> = []
  const tagRe = /<(\/?)([A-Za-z][A-Za-z0-9.]*)/g
  let m: RegExpExecArray | null
  let lastEnd = 0
  while ((m = tagRe.exec(masked)) !== null) {
    // Text run preceding this tag belongs to the current innermost element.
    scanRun(lastEnd, m.index, stack[stack.length - 1]?.covered ?? false)

    const isClose = m[1] === '/'
    const name = m[2]
    const afterName = tagRe.lastIndex

    if (isClose) {
      const gt = masked.indexOf('>', afterName)
      lastEnd = gt < 0 ? masked.length : gt + 1
      tagRe.lastIndex = lastEnd
      for (let s = stack.length - 1; s >= 0; s--) {
        if (stack[s].name === name) {
          stack.length = s
          break
        }
      }
      continue
    }

    const { end, selfClosing } = readTagEnd(masked, afterName)
    lastEnd = end + 1
    tagRe.lastIndex = lastEnd
    const attrText = masked.slice(afterName, end)
    const parentCovered = stack[stack.length - 1]?.covered ?? false
    const covered = parentCovered || tagCoversDescendantGlyphs(name, attrText)
    if (!selfClosing) stack.push({ name, covered })
  }
  scanRun(lastEnd, masked.length, stack[stack.length - 1]?.covered ?? false)

  return violations
}

const lint: A11yLint = {
  name: 'icon-missing-aria-hidden',
  wcag: '1.1.1',
  description:
    'A decorative icon exposed to assistive tech: a hand-authored inline <svg> with ' +
    'no aria-hidden/accessible name, OR a decorative Unicode icon-glyph (hieroglyph, ' +
    '✓/✕, ▲/▼, ✦, ⚙…) rendered as JSX text that is neither hidden (on itself or a ' +
    'decorative ancestor) nor inside a named/interactive host. Mark it aria-hidden="true" ' +
    '(svg: + focusable="false"), or give it a real name if it is meaningful.',
  check(files: LintFile[]): Violation[] {
    const violations: Violation[] = []
    for (const { path, text } of files) {
      const masked = maskNonCode(text)
      violations.push(...checkSvgs(path, text, masked))
      violations.push(...checkGlyphs(path, masked))
    }
    return violations
  },
  selftest: {
    bad: [
      // (A) Bare decorative svg — only geometry/presentation attrs, no a11y.
      'export const X = () => <svg viewBox="0 0 24 24" className={s.icon}><path d="M7 10l5 5 5-5z" /></svg>',
      // (A) Multi-line opening tag (attrs on following lines), no aria-hidden/name.
      'export const X = () => (\n  <svg\n    width="16"\n    height="16"\n    stroke="currentColor"\n  >\n    <path d="M21 15v4" />\n  </svg>\n)',
      // (A) Self-closing decorative svg, no a11y.
      'export const X = () => <svg className={s.icon} width={18} height={18} />',
      // (B) Bare geometric caret glyph as text, no coverage.
      'export const X = () => <span style={{ opacity: 0.7 }}>▲</span>',
      // (B) Egyptian hieroglyph (astral codepoint) inside an UNcovered wrapper.
      'export const X = () => <div><span className={s.g}>\u{132b9}</span></div>',
      // (B) Sparkle dingbat as text, no coverage.
      'export const X = () => <p>Featured ✦ plan</p>',
    ],
    good: [
      // (A) Decorative — the standard fix.
      'export const X = () => <svg aria-hidden="true" focusable="false"><path d="M0" /></svg>',
      // (A) goobs Icon resolver spread owns the a11y at runtime.
      'export const X = () => <svg className={c.svg} fill="currentColor" {...rest} {...svgA11y}>{title ? <title>{title}</title> : null}<path d="M0" /></svg>',
      // (A) Meaningful svg with a real accessible name.
      'export const X = () => <svg role="img" aria-label="Sent"><path d="M0" /></svg>',
      // (A) Named via a child <title> element.
      'export const X = () => <svg aria-labelledby="t"><title id="t">Cart</title><path d="M0" /></svg>',
      // (A) Explicitly presentational.
      'export const X = () => <svg role="presentation"><path d="M0" /></svg>',
      // (A/B) <svg>/glyph mentioned only in a comment / string — masked, not real JSX.
      "export const X = () => <div data-sel={'<svg> ▲'}>{/* the goobs icon <svg> ✦ carries no name */}hi</div>",
      // (B) Glyph hidden on its own element.
      'export const X = () => <span aria-hidden="true">▼</span>',
      // (B) Glyph hidden by a decorative ancestor (inheritance).
      'export const X = () => <div aria-hidden="true"><span className={s.g}>\u{132b9}</span></div>',
      // (B) Glyph inside a labelled interactive control — the label is the name.
      'export const X = () => <button aria-label="Remove">✕</button>',
      // (B) Named image via role + aria-label.
      'export const X = () => <div role="img" aria-label="star">★</div>',
      // (B) Glyph in a STRING literal (a text prop / lookup value) — masked.
      "export const X = () => <span className={s.g}>{'\u{132b9}'}</span>",
      // (B) Dynamic glyph via an expression — no literal codepoint to match.
      'export const X = () => <span>{glyph}</span>',
      // (B) A directional ARROW as meaningful text — deliberately not in the set.
      'export const X = () => <p>{oldValue} → {newValue}</p>',
    ],
  },
}

export default lint
