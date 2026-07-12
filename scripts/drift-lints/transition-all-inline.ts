import type { DriftFile, DriftInstance, DriftLint } from '../lint-drift'

/**
 * transition-all-inline — the TSX side of the `transition: all` class.
 *
 * The sibling `transition-all` module (scope 'css') covers stylesheets; this
 * one covers the SAME drift written as live inline `CSSProperties` in shipped
 * TSX (`style={{ transition: 'all 0.2s ease' }}`). Push-review-proven gap:
 * six live instances (DataGrid Table/Rows x3, TreeView x3) were outside the
 * css scope and in no other gate. `transition: all` animates every mutating
 * property — layout thrash, surprise animation of later-added properties, and
 * it degrades prefers-reduced-motion precision.
 */

/** Blank // and block comments (string-aware, newline-preserving). */
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

/** `transition: 'all …'` / `transition: \`all …\`` / `transitionProperty: 'all'`
 *  as an object-literal member with a string value starting at the `all`
 *  keyword. Comment-blanking removes prose; string CONTENT survives blanking
 *  only for the quote CHARACTERS themselves, so match the quoted value in the
 *  RAW text at positions the blanked text proves are code. */
const INLINE_ALL =
  /\btransition(?:Property)?\s*:\s*(['"`])\s*all\b/g

const lint: DriftLint = {
  name: 'transition-all-inline',
  scope: 'ts',
  description:
    "Inline CSSProperties `transition: 'all …'` in shipped TSX — the same over-broad-transition drift the css-scoped transition-all module freezes, written as a live style object. Six push-review-confirmed instances (DataGrid Table/Rows x3, TreeView x3) were invisible to the css scope.",
  canon:
    "Transition an explicit property list in inline styles too: `transition: 'background-color 160ms ease, box-shadow 160ms ease'`, never `'all …'`. Same canon as the css-side transition-all module; the two modules split scopes only because a DriftLint scans one file set.",
  measure(files: DriftFile[]): DriftInstance[] {
    const instances: DriftInstance[] = []
    for (const { path, text: raw } of files) {
      if (!raw.includes('transition')) continue
      const blanked = blankComments(raw)
      INLINE_ALL.lastIndex = 0
      let m: RegExpExecArray | null
      while ((m = INLINE_ALL.exec(raw))) {
        // Code-position proof: the property name must survive comment-blanking
        // (prose inside a comment is blanked there, so it cannot match).
        if (!/\btransition(?:Property)?\s*:/.test(blanked.slice(m.index, m.index + 24)))
          continue
        instances.push({
          file: path,
          line: raw.slice(0, m.index).split('\n').length,
          token: 'inline transition: all',
        })
      }
    }
    return instances
  },
  selftest: {
    bad: [
      "const style = { transition: 'all 0.2s ease' }",
      'export const X = () => <div style={{ transition: "all 300ms" }} />',
      "const s: CSSProperties = { transitionProperty: 'all' }",
    ],
    good: [
      "const style = { transition: 'background-color 160ms ease' }",
      // Prose in a comment is not a live style.
      "// never write transition: 'all 0.2s' inline\nconst x = 1",
      // A transition referencing a token var is the sanctioned indirection.
      "const style = { transition: 'var(--goobs-transition-colors)' }",
    ],
  },
}

export default lint
