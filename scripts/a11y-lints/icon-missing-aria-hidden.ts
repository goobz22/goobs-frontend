import type { A11yLint, LintFile, Violation } from '../lint-a11y'

/**
 * CLASS: icon-missing-aria-hidden (WCAG 1.1.1 Non-text Content, Level A).
 *
 * A decorative, hand-authored inline `<svg>` that carries NO accessibility
 * intent is announced by screen readers as a stray, unlabelled "graphic"/"image"
 * that adds noise beside the text, button, or field it merely decorates — or, if
 * it duplicates state already exposed elsewhere (a chevron mirroring
 * `aria-expanded`, a check mirroring a native checkbox), it double-announces it.
 * The 2026-07 component audit found this shape in 9 components (Accordion,
 * Alert, BigCalendar, Button, Checkbox, Chip, ComplexTextEditor,
 * ConfirmationCodeInput, DataGrid). Every fix was the same: mark the glyph
 * decorative with `aria-hidden="true"` (plus `focusable="false"` to drop the
 * legacy IE/Edge tab stop), OR — for the rare meaningful glyph — give it a real
 * accessible name (`role="img"` + `aria-label`/`aria-labelledby`, or a child
 * `<title>`).
 *
 * ── Shape of the class (not the literal string from one file) ────────────────
 * A raw `<svg …>` JSX element (a hand-written inline SVG, NOT a goobs `<Icon>`)
 * whose opening tag exposes no accessibility intent and which carries no
 * `<title>` child. Such an svg reaches the accessibility tree naked.
 *
 * ── The architectural root fix (why goobs `<Icon>` usages are NOT flagged) ───
 * The 261 goobs Icon components render their `<svg>` through `resolveIconA11y`
 * (src/components/Icons/iconA11y.ts), which makes every icon **decorative by
 * default**: with no text alternative supplied it spreads `aria-hidden="true"
 * focusable="false"` onto the inner svg, and flips to a named `role="img"` only
 * when the consumer passes `aria-label`/`aria-labelledby`/`title`. That helper is
 * the class's permanent structural fix — a `<SendIcon />` in a labelled button is
 * silent for free. Those svgs spread `{...svgA11y}`, which this check treats as a
 * satisfied escape hatch, so the whole Icons family passes without an ignore-list.
 * (The redundant consumer-side belt-and-suspenders some audit fixes also added —
 * hiding the icon *wrapper* span when a text label is present — is not a
 * lint-detectable shape without false positives and is deliberately out of scope;
 * it is redundant once the icon itself is decorative-by-default.)
 *
 * ── Escape hatches (encoded in the check, NOT a file ignore-list) ────────────
 * An `<svg>` is CORRECT — and passes — when its opening tag has any of:
 *   • `aria-hidden` (any value) — decorative, the standard fix;
 *   • `aria-label` / `aria-labelledby` — a real accessible name (meaningful svg);
 *   • a `{...svgA11y}` spread — the goobs Icon resolver owns its a11y at runtime;
 *   • `role="presentation"` / `role="none"` — explicitly removed from the a11y tree;
 * or when the element contains a child `<title>` element (the correct
 * accessible-name mechanism for inline SVG — a `title` *attribute* on `<svg>` is
 * inert, so only a child element counts).
 *
 * A `<svg>` mentioned only inside a comment or a string/template literal (JSDoc
 * like "the goobs icon `<svg>` carries no name", a selector string) is masked
 * before scanning, so documentation prose never produces a false positive.
 */

/**
 * Blank out block comments, line comments, and single/double/back-quoted string
 * literals (preserving newlines + length so line numbers stay accurate) so an
 * `<svg>` named in a JSDoc example or a selector string is never matched as JSX.
 * (Same masking the sibling interactive-missing-public-ref lint relies on.)
 */
function maskNonCode(text: string): string {
  let t = text.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '))
  t = t.replace(/(^|[^:])\/\/[^\n]*/g, (m, p1: string) =>
    p1 + ' '.repeat(m.length - p1.length)
  )
  t = t.replace(/'(?:[^'\\\n]|\\.)*'/g, (m) => "'" + ' '.repeat(Math.max(0, m.length - 2)) + "'")
  t = t.replace(/"(?:[^"\\\n]|\\.)*"/g, (m) => '"' + ' '.repeat(Math.max(0, m.length - 2)) + '"')
  t = t.replace(/`(?:[^`\\]|\\.)*`/g, (m) => '`' + ' '.repeat(Math.max(0, m.length - 2)) + '`')
  return t
}

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

const lint: A11yLint = {
  name: 'icon-missing-aria-hidden',
  wcag: '1.1.1',
  description:
    'A decorative hand-authored inline <svg> with no aria-hidden and no accessible ' +
    'name (aria-label/aria-labelledby, a {...svgA11y} spread, a presentational role, ' +
    'or a child <title>) is announced by screen readers as a stray unlabelled graphic. ' +
    'Mark it aria-hidden="true" focusable="false" (decorative) or give it a real name.',
  check(files: LintFile[]): Violation[] {
    const violations: Violation[] = []
    for (const { path, text } of files) {
      const masked = maskNonCode(text)
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

        // A child <title> is the correct accessible-name mechanism for inline
        // SVG — check the element body (only possible when not self-closing).
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
    }
    return violations
  },
  selftest: {
    bad: [
      // Bare decorative svg — only geometry/presentation attrs, no a11y.
      'export const X = () => <svg viewBox="0 0 24 24" className={s.icon}><path d="M7 10l5 5 5-5z" /></svg>',
      // Multi-line opening tag (attrs on following lines), no aria-hidden/name.
      'export const X = () => (\n  <svg\n    width="16"\n    height="16"\n    stroke="currentColor"\n  >\n    <path d="M21 15v4" />\n  </svg>\n)',
      // Self-closing decorative svg, no a11y.
      'export const X = () => <svg className={s.icon} width={18} height={18} />',
    ],
    good: [
      // Decorative — the standard fix.
      'export const X = () => <svg aria-hidden="true" focusable="false"><path d="M0" /></svg>',
      // goobs Icon resolver spread owns the a11y at runtime.
      'export const X = () => <svg className={c.svg} fill="currentColor" {...rest} {...svgA11y}>{title ? <title>{title}</title> : null}<path d="M0" /></svg>',
      // Meaningful svg with a real accessible name.
      'export const X = () => <svg role="img" aria-label="Sent"><path d="M0" /></svg>',
      // Named via a child <title> element (the correct inline-SVG name mechanism).
      'export const X = () => <svg aria-labelledby="t"><title id="t">Cart</title><path d="M0" /></svg>',
      // Explicitly presentational.
      'export const X = () => <svg role="presentation"><path d="M0" /></svg>',
      // <svg> mentioned only in a comment / string — masked, not real JSX.
      "export const X = () => <div data-sel={'<svg>'}>{/* the goobs icon <svg> carries no name */}hi</div>",
    ],
  },
}

export default lint
