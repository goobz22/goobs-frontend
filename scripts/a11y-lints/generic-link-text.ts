import type { A11yLint, LintFile, Violation } from '../lint-a11y'

/**
 * ── generic-link-text (WCAG 2.4.4 Link Purpose (In Context)) ──
 *
 * A screen-reader user can pull up a list of every link/button on a page and
 * navigate BY that list — stripped of surrounding sentence context. A control
 * whose ENTIRE accessible name is a generic filler phrase ("click here", "read
 * more", "learn more", "details", "more", "here", "link", "go") is meaningless
 * in that list: fifteen "read more" rows point nowhere the user can tell apart.
 * WCAG 2.4.4 requires the link's PURPOSE be determinable from its name (in its
 * programmatic context — an aria-label/aria-labelledby counts as that context).
 *
 * ── THE SHAPE THIS MODULE DETECTS (crisp, near-zero false positive) ──
 *
 * A `<a href>` / native `<button>` / goobs `<Button>` / `<CustomButton>` whose
 * ONLY child content is a LITERAL text run that — lowercased, entity- and
 * punctuation-stripped, whitespace-collapsed — EQUALS one of the generic phrases
 * below, AND whose opening tag supplies NO accessible-name supplement
 * (aria-label / ariaLabel / aria-labelledby / ariaLabelledby / title) and NO
 * prop spread (`{...x}` could inject one at runtime). Such a control's whole
 * accessible name IS the generic phrase.
 *
 * ── THE PHRASE SET (documented + easily extendable) ──
 * To flag another generic filler phrase, add its lowercased form to
 * GENERIC_PHRASES below — nothing else changes. The match is on the WHOLE
 * normalized name (so "read more about pricing" or "more details" are NOT
 * flagged — only a bare, entirely-generic name is).
 *
 * ── THE FIX SEAM (additive) ──
 * Make the visible text specific, OR keep the short visible text and add an
 * aria-label that names the destination/action:
 *   <a href="/pricing" aria-label="Read more about pricing">Read more</a>
 * The accessible name then satisfies 2.4.4 without changing the visual design.
 *
 * ── ESCAPE HATCHES (encoded in the CHECK, never an ignore-list) ──
 *  1. aria-label / ariaLabel / aria-labelledby / ariaLabelledby / title on the
 *     tag → the name is supplemented; not flagged.
 *  2. a prop spread `{...x}` on the tag → may inject a name mechanism at runtime;
 *     not flagged.
 *  3. a `{expression}` child (`<Button>{ctaText}</Button>`) → the visible text is
 *     CONFIGURABLE via a prop, not a literal — statically unknowable, so NOT
 *     flagged. This is the PricingTable-CTA shape (CTA text is a prop), which is
 *     exactly why this class is expected to be near-zero.
 *  4. a nested element child (`<a><Icon/> Read more</a>`) → the composed name may
 *     include visually-hidden descriptive text or the child's own label;
 *     statically ambiguous, so NOT flagged (under-measure — false positives poison
 *     a lint). A pure literal generic child is the only flagged shape.
 *  5. an `<a>` with NO href → not an interactive link (not focusable, absent from
 *     the link list), so a generic name there is not a 2.4.4 issue; not flagged.
 *  6. a `text=`/other PROP carrying the label is NOT a text CHILD — out of this
 *     class's stated scope (literal JSX text children); not scanned.
 *
 * WHY only `Button`/`CustomButton` among components: those two are the goobs
 * clickable primitives that render their `children` as the visible label. Icon
 * primitives (`IconButton`, `SaveButton`, …) get their name from an icon +
 * caller aria-label and are the missing-accessible-name class's concern, not
 * this one.
 */

/**
 * THE PHRASE SET — lowercased, whole-name generic filler. Extend here.
 */
const GENERIC_PHRASES: ReadonlySet<string> = new Set<string>([
  'click here',
  'here',
  'read more',
  'learn more',
  'more',
  'details',
  'link',
  'go',
])

// Opening-tag matchers. `(?=[\s/>])` stops `<a` matching `<article`/`<aside`,
// `<button` matching `<buttonish`, and `<Button` matching `<ButtonGroup` /
// `<CustomButton` matching `<CustomButtonBar`; `<a>`/`<button>` with no attrs
// still match because `>` is in the lookahead class. Case matters: `<button`
// (native) and `<Button` (component) are deliberately distinct patterns.
const ANCHOR_OPEN_RE = /<a(?=[\s/>])/g
const BUTTON_OPEN_RE = /<button(?=[\s/>])/g
const COMPONENT_BUTTON_OPEN_RE = /<Button(?=[\s/>])/g
const CUSTOM_BUTTON_OPEN_RE = /<CustomButton(?=[\s/>])/g

/**
 * Blank the CONTENT of `//` and `/* … *\/` comments (JSDoc included) to spaces,
 * preserving every newline so byte offsets / line numbers are unchanged. String-
 * and template-aware so a `//` inside an `https://` attribute value — or an
 * apostrophe inside prose that would desync a naive walker — is not eaten. This
 * is what stops a JSDoc `@example` `<a href>read more</a>` from being flagged.
 * (String-aware helper pattern copied from label-input-id-divergence.ts.)
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

/**
 * From the `>` of an opening `<tag>` (index `openEnd`), return the raw content
 * up to the matching `</tag>`, honouring nested same-name opens with a depth
 * counter. Returns null if never closed.
 */
function readElementContent(
  text: string,
  tag: string,
  openEnd: number
): string | null {
  const openRe = new RegExp(`<${tag}(?=[\\s/>])`, 'g')
  const closeRe = new RegExp(`</${tag}\\s*>`, 'g')
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

const hasNameMechanism = (body: string) =>
  /\baria-label\b/.test(body) ||
  /\baria-labelledby\b/.test(body) ||
  /\bariaLabel\b/.test(body) ||
  /\bariaLabelledby\b/.test(body) ||
  /\btitle\s*=/.test(body)
const hasSpread = (body: string) => /\{\s*\.\.\./.test(body)
const hasHref = (body: string) => /\bhref\s*=/.test(body)
const isSelfClosing = (body: string) => /\/\s*>$/.test(body.trimEnd())

/**
 * If `content` is a PURE literal text child that computes to a generic name,
 * return that normalized name; else null. Null when the content contains a
 * nested element (`<`) or a dynamic expression (`{`) — those are not pure
 * literals and their name is statically ambiguous.
 */
function genericPhrase(content: string): string | null {
  if (/[<{]/.test(content)) return null // nested element / configurable prop
  const normalized = content
    .replace(/&#?[0-9a-zA-Z]+;/g, ' ') // HTML entities (&raquo; &rarr; &nbsp;) → space
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^[^a-z0-9]+/, '') // leading arrows / punctuation
    .replace(/[^a-z0-9]+$/, '') // trailing arrows / ellipsis / punctuation
  if (!normalized) return null
  return GENERIC_PHRASES.has(normalized) ? normalized : null
}

const lint: A11yLint = {
  name: 'generic-link-text',
  wcag: '2.4.4',
  description:
    'A link/button whose ENTIRE literal text child is a generic filler phrase (click here, here, read more, learn more, more, details, link, go) has no determinable purpose in a screen-reader link list (WCAG 2.4.4). Detected on <a href>, native <button>, and goobs <Button>/<CustomButton> when the sole child is that literal AND the tag carries no aria-label / ariaLabel / aria-labelledby / title supplement and no prop spread. Fix by making the visible text specific or adding an aria-label that names the destination/action. Escape hatches encoded in the check: any name mechanism or spread on the tag, a {expression} child (configurable prop text — the PricingTable-CTA shape), a nested-element child (statically ambiguous composed name), an <a> without href (not a link), and PROP labels like text= (not a text child). Phrase set is documented + extendable in GENERIC_PHRASES.',
  check(files: LintFile[]): Violation[] {
    const violations: Violation[] = []
    for (const { path, text: raw } of files) {
      const text = blankComments(raw)
      const nl = newlineIndex(text)

      const scan = (
        re: RegExp,
        tag: string,
        requireHref: boolean,
        kind: string
      ) => {
        re.lastIndex = 0
        let m: RegExpExecArray | null
        while ((m = re.exec(text))) {
          const opened = readOpeningTag(text, m.index)
          if (!opened) continue
          const { body, end } = opened
          if (isSelfClosing(body)) continue // no children on a self-closing tag
          if (requireHref && !hasHref(body)) continue // <a> without href isn't a link
          if (hasNameMechanism(body) || hasSpread(body)) continue
          const content = readElementContent(text, tag, end)
          if (content == null) continue
          const phrase = genericPhrase(content)
          if (!phrase) continue
          violations.push({
            file: path,
            line: offsetToLine(nl, m.index),
            message: `generic ${kind} text "${phrase}" is the entire accessible name — its purpose is indeterminable in a screen-reader link list (WCAG 2.4.4); make the visible text specific or add an aria-label naming the destination/action (generic-link-text)`,
          })
        }
      }

      scan(ANCHOR_OPEN_RE, 'a', true, 'link')
      scan(BUTTON_OPEN_RE, 'button', false, 'button')
      scan(COMPONENT_BUTTON_OPEN_RE, 'Button', false, 'button')
      scan(CUSTOM_BUTTON_OPEN_RE, 'CustomButton', false, 'button')
    }
    return violations
  },
  selftest: {
    bad: [
      // the canonical shape — a generic "read more" link with an href.
      'export const A = () => <a href="/x">read more</a>',
      // case-insensitive native button.
      'export const B = () => <button onClick={f}>Learn More</button>',
      // goobs <Button> component with a generic literal child.
      'export const C = () => <Button onClick={f}>Click here</Button>',
      // <CustomButton> with a generic literal child.
      'export const D = () => <CustomButton href="/x">Details</CustomButton>',
      // multi-line child on its own line with a trailing entity arrow.
      'export const E = () => (\n  <a href="/pricing">\n    Read more &raquo;\n  </a>\n)',
      // bare "here".
      'export const F = () => <a href="/x">here</a>',
      // bare "Go".
      'export const G = () => <button>Go</button>',
    ],
    good: [
      // aria-label supplements the generic visible text (the fix seam).
      'export const H = () => <a href="/x" aria-label="Read more about pricing">read more</a>',
      // configurable text via a prop expression — not a literal (PricingTable CTA).
      'export const I = () => <a href="/x">{ctaText}</a>',
      // component ariaLabel prop supplement.
      'export const J = () => <Button ariaLabel="Learn more about billing">Learn more</Button>',
      // descriptive visible text — not generic.
      'export const K = () => <a href="/x">Read our full pricing guide</a>',
      // prop spread may inject a name mechanism at runtime.
      'export const L = () => <button {...rest}>more</button>',
      // nested element child — composed name is statically ambiguous; not flagged.
      'export const M = () => <a href="/x"><Icon /> Read more</a>',
      // aria-labelledby name mechanism.
      'export const N = () => <a href="/x" aria-labelledby="lbl">details</a>',
      // title supplies an accessible name.
      'export const O = () => <button title="Save changes">Go</button>',
      // <a> without href is not an interactive link — not flagged.
      'export const P = () => <a>more</a>',
      // a non-generic descriptive button label.
      'export const Q = () => <button>Add to cart</button>',
      // the bad shape inside a comment is documentation, not rendered JSX.
      '/** Example of a bad link: <a href="/x">read more</a> */\nexport const R = () => <a href="/x">Compare all plans and features</a>',
      // a text= PROP is not a text child — out of scope, not scanned.
      'export const S = () => <Button text="read more" href="/x" />',
      // a longer phrase that merely contains a generic word is not the whole name.
      'export const T = () => <button>more details</button>',
    ],
  },
}

export default lint
