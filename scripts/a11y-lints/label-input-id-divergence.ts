import type { A11yLint, LintFile, Violation } from '../lint-a11y'

/**
 * CLASS: label-input-id-divergence (WCAG 1.3.1 / 4.1.2).
 *
 * FieldShell renders `<label htmlFor={inputId}>` with the id it hands the
 * render-prop slot. A leaf that renders its input as `id={id ?? inputId}`
 * (consumer id wins) while the label keeps the SLOT id silently breaks the
 * label↔input association the moment a consumer passes `id`: the `<label>`
 * points at a non-existent element — no clickable label, degraded screen-reader
 * announcement. Found latent across the whole Field family (IPAM, Number,
 * Password, PhoneNumber, USD) by the 2026-07 audit (Field-Number report D2).
 *
 * THE FIX (architectural — makes the shape impossible): FieldShell now accepts
 * a consumer `id` prop and uses it as the slot's `inputId`, so the label's
 * `htmlFor` and the input's `id` can never diverge. Leaves forward
 * `<FieldShell id={id}>` and render `id={inputId}` verbatim.
 *
 * DETECTION: any JSX `id={… ?? inputId}` (a consumer expression overriding the
 * slot id at the input) is the broken shape. `id={inputId}` is the good shape.
 * Escape hatch (encoded): files that do not reference a FieldShell slot at all
 * (`inputId` never appears) are out of scope — a bare `id={a ?? b}` elsewhere
 * is not this class.
 */
const BROKEN_SHAPE = /\bid\s*=\s*\{[^}]*\?\?\s*inputId\s*\}/g

/** Blank `//` and `/* … *​/` comment content (string-aware, newlines kept) so
 *  a JSDoc describing the broken shape is never itself a hit. */
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

const lint: A11yLint = {
  name: 'label-input-id-divergence',
  wcag: '1.3.1, 4.1.2',
  description:
    'A Field leaf renders its input as id={id ?? inputId} while the FieldShell label keeps htmlFor={inputId} — a consumer-passed id silently breaks the label↔input association. Forward the consumer id to <FieldShell id={id}> (the shell threads it to BOTH label and slot) and render id={inputId} verbatim.',
  check(files: LintFile[]): Violation[] {
    const violations: Violation[] = []
    for (const { path, text: raw } of files) {
      const text = blankComments(raw)
      if (!/\binputId\b/.test(text)) continue
      BROKEN_SHAPE.lastIndex = 0
      let m: RegExpExecArray | null
      while ((m = BROKEN_SHAPE.exec(text))) {
        const line = text.slice(0, m.index).split('\n').length
        violations.push({
          file: path,
          line,
          message:
            'input id overrides the FieldShell slot id (`id={… ?? inputId}`) — the shell label keeps htmlFor={inputId}, so a consumer-passed id breaks the label↔input association. Pass the consumer id to <FieldShell id={…}> and render id={inputId}',
        })
      }
    }
    return violations
  },
  selftest: {
    bad: [
      'const X = () => (\n  <FieldShell label={label}>\n    {({ inputId }) => <input id={id ?? inputId} />}\n  </FieldShell>\n)',
      '<input\n  ref={inputRef}\n  id={props.id ?? inputId}\n  type="text"\n/>',
    ],
    good: [
      'const X = () => (\n  <FieldShell label={label} id={id}>\n    {({ inputId }) => <input id={inputId} />}\n  </FieldShell>\n)',
      // No slot reference at all — a generic nullish id elsewhere is not this class.
      '<div id={htmlId ?? fallbackId}>x</div>',
      // The broken shape inside a JSDoc/comment is documentation, not code.
      '/** leaves historically rendered `id={id ?? inputId}` — now fixed */\nconst use = ({ inputId }: Slot) => <input id={inputId} />',
    ],
  },
}

export default lint
