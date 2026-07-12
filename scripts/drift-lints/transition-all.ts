import type { DriftFile, DriftInstance, DriftLint } from '../lint-drift'

/**
 * DRIFT: transition:all — animating EVERY property instead of an explicit list.
 *
 * ~43 raw `transition: all <duration> [ease]` declarations live across the
 * .module.css files, plus 4 convenience TOKEN definitions in global.css
 * (`--goobs-transition-{fast,medium,slow,premium}: all …`) that ~80 components
 * consume via `transition: var(--goobs-transition-*)`. A `var()` USAGE inherits
 * its `all` from the token, so it is measured ONCE at the token DEFINITION site,
 * never at each usage (otherwise the same drift is counted ~80×).
 *
 * WHY `all` IS THE DRIFT (canon is picked by PRINCIPLE, not by the 43-vs-4
 * dominance — the dominant form IS the drift): `all` transitions every property
 * that changes, so a width/height/top/left/padding mutation LAYOUT-THRASHES on
 * the main thread; any property added to the element LATER silently starts
 * animating; and it defeats `prefers-reduced-motion` precision — you cannot keep
 * a colour fade while killing a layout animation when the transition targets
 * `all`. MDN/CSS-WG performance guidance and WCAG 2.3.3 both say: enumerate the
 * properties you actually animate (ideally compositor-only transform/opacity).
 *
 * CANON: `transition an explicit property list` —
 *   transition: background-color 0.2s ease, box-shadow 0.2s ease;
 *   /* or *​/ transition-property: background-color, box-shadow;
 *
 * DETECTION: any `transition:` / `transition-property:` declaration whose VALUE
 * begins with the `all` keyword, PLUS any `--…transition…:` custom-property
 * DEFINITION whose value begins with `all`. A `transition: var(--…)` usage or a
 * `--x-transition: var(--goobs-transition-*)` alias has a `var(...)` value (not
 * the `all` keyword) → correctly NOT a hit. Comment-blanked first: the Paper and
 * Select reduced-motion notes carry a literal `transition: all …` inside
 * backticks next to an apostrophe (`user's`), which desyncs naive quote walkers.
 */
const DECL =
  /(--[a-z0-9-]*transition[a-z0-9-]*|transition-property|transition)\s*:\s*all\b/gi

/**
 * Blank CSS `/* … *​/` block comments (string-aware, newline-preserving) so a
 * rule spelled out in prose is never itself a hit. CSS-adapted from the TS a11y
 * helper: CSS has NO `//` line comments, so — unlike that helper — we must NOT
 * treat `//` as a comment (it would swallow `url(https://…)` and under-count).
 * Only `'`/`"` open strings in CSS; a `/*` inside a string does not start a
 * comment. Because a block comment is entered at `/*` BEFORE any inner
 * apostrophe/backtick, comment prose can never desync the quote state.
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
    if (c === "'" || c === '"') {
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

const lint: DriftLint = {
  name: 'transition-all',
  scope: 'css',
  description:
    'transition: all / transition-property: all (and the --goobs-transition-* tokens that resolve to `all …`) animate EVERY property change — layout thrash on width/height mutation, surprise-animation of properties added later, and no prefers-reduced-motion precision. Transition an explicit property list instead.',
  canon:
    'Transition an EXPLICIT property list — name each animated property (`transition: background-color 0.2s ease, box-shadow 0.2s ease` or `transition-property: background-color, box-shadow`), never `all`. Evidence: the dominant form is `transition: all` (43 raw literals + 4 `--goobs-transition-*` token defs = 47), but that dominance IS the drift — canon is picked by principle, not popularity. `all` animates every property that changes → main-thread layout thrash on any width/height/top/left/padding mutation, silently animates properties added to the element later, and defeats prefers-reduced-motion precision (WCAG 2.3.3 + MDN/CSS-WG performance guidance: enumerate the properties, prefer compositor-only transform/opacity).',
  measure(files: DriftFile[]): DriftInstance[] {
    const instances: DriftInstance[] = []
    for (const { path, text: raw } of files) {
      const text = blankComments(raw)
      DECL.lastIndex = 0
      let m: RegExpExecArray | null
      while ((m = DECL.exec(text))) {
        const line = text.slice(0, m.index).split('\n').length
        instances.push({
          file: path,
          line,
          // stable, line-independent: the matched property + ": all"
          token: `${m[1]}: all`,
        })
      }
    }
    return instances
  },
  selftest: {
    bad: [
      // raw shorthand literal
      '.x {\n  transition: all 0.3s ease;\n}',
      // transition-property longhand
      '.y {\n  transition-property: all;\n}',
      // convenience TOKEN definition resolving to `all …`
      ':root {\n  --goobs-transition-medium: all var(--goobs-duration-medium) var(--goobs-ease);\n}',
      // multi-line token def (the `all` keyword sits on the property line)
      ':root {\n  --goobs-transition-premium: all var(--goobs-duration-premium)\n    var(--goobs-ease);\n}',
    ],
    good: [
      // THE CANON — explicit property list
      '.x {\n  transition: background-color 0.2s ease, box-shadow 0.2s ease;\n}',
      '.y {\n  transition-property: background-color, box-shadow;\n}',
      // a token USAGE inherits `all` from the def site — counted THERE, not here
      '.z {\n  transition: var(--goobs-transition-slow);\n}',
      // aliasing a token to a local var is a var() value, not the `all` keyword
      '.w {\n  --dg-transition: var(--goobs-transition-medium);\n  transition: var(--dg-transition);\n}',
      // nested var fallback — still a var() value, never `all`
      '.a {\n  transition: var(--alert-transition, var(--goobs-transition-medium));\n}',
      // the bad shape quoted inside a comment (backticks + an apostrophe) is prose
      "/* Reduced motion: the `.select` carries `transition: all 0.2s ease` for\n   a user's border shift (WCAG 2.3.3). */\n.select {\n  transition: color 0.2s ease;\n}",
    ],
  },
}

export default lint
