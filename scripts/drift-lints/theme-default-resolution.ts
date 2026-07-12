import type { DriftFile, DriftInstance, DriftLint } from '../lint-drift'

/**
 * DRIFT CLASS: theme default-resolution.
 *
 * Every goobs component that reads `styles.theme` falls back to a hard-coded
 * default when the consumer passes none. But the library never declared that
 * default ONCE — it is spelled inline, per file, with TWO different literals:
 *
 *   - ~44 root resolutions default to 'light'  (Alert, Badge, Avatar, AppBar,
 *     Checkbox, RadioGroup, ToggleButton, Tooltip, ProgressBar, List, Toolbar,
 *     the ComplexTextEditor/DataGrid-table/ProjectBoard internals, …)
 *   - ~30 default to 'sacred'  (Card, Button, Chip, Select, Tabs, Stepper,
 *     Divider, MenuItem, EmptyState, ListItemCard, FileDropzone, DataGrid,
 *     every Dropdown + IPAM field, WorkspaceFilterShell, and — decisively —
 *     Field/Shell, the shared field chrome every input composes on)
 *   - 2 default to 'dark'  (CodeCopy, Switch — dark-by-design, not drift)
 *
 * Same concept, two library-wide defaults. A consumer that composes
 * `<Alert>` (defaults light) inside `<Card>` (defaults sacred) with ZERO theme
 * props gets mismatched surfaces — a visible visual-identity bug that no prop
 * change can pre-empt because the mismatch is baked into the components.
 *
 * WHY A RATCHET, NOT A FIX: unifying is BREAKING (flipping a 'light'-defaulting
 * surface to 'sacred' changes what a zero-prop consumer sees) and is an
 * operator-level visual-identity call. So this module does not rewrite anything;
 * it FREEZES today's per-file default so (a) no existing file silently CHANGES
 * its default literal and (b) no NEW file introduces yet another inline default.
 * Unification onto ONE shared default is a future campaign (see `canon`).
 *
 * WHAT COUNTS AS A ROOT RESOLUTION (measured):
 *   - assignment:  `const|let <id>[: T] = <obj>?.theme ||/?? '<lit>'`
 *   - own surface: `data-theme={<obj>?.theme ||/?? '<lit>'}`  (a DOM attribute
 *     the component stamps on ITS OWN element)
 * WHAT IS NOT A ROOT (excluded, so the detector is not noisy):
 *   - pass-throughs `theme: <obj>?.theme ||/?? '<lit>'` / `<Child styles={{ theme: … }}>`
 *     (forwarding a default to a CHILD, matched by the leading `theme:` / `|`)
 *   - ternary branches `… ? 'sacred' : <obj>?.theme || 'light'` (ambiguous which
 *     literal is "the default" — leading `:` excludes them; e.g. Field/USD)
 *   - comparisons `x === <obj>?.theme || 'light'` (leading `==`/`<=`/`>=`/`!=`)
 *   - the 261 leaf glyphs under `src/components/Icons/` — uniformly 'light',
 *     not surfaces; including them would swamp the ~even light/sacred split that
 *     is the actual drift. (Under-measured on purpose — documented, not a bug.)
 *
 * PER-LITERAL FREEZE (why the baseline key is `path::literal`): the runner's
 * baseline is a {key: count} map and only fires on GROWTH / a NEW key. A plain
 * `{path: count}` could NOT catch a file flipping its single default
 * light→sacred (count stays 1). Encoding the literal into the instance `.file`
 * makes countsOf group per-file-per-literal, so a flip reads as the old
 * `path::light` key shrinking to 0 while a new `path::sacred` key GROWS from 0 →
 * the ratchet fires. That is what makes "no file CHANGES its default"
 * enforceable under a count-only runner; it also makes the baseline JSON
 * self-documenting (each file's frozen default is visible).
 */

/** Blank `//` and `/* … *​/` comment content (string-aware, newlines kept) so a
 *  JSDoc that quotes `styles?.theme || 'light'` (this file, plus real decoys in
 *  Toolbar/Popover) is never itself a hit. Apostrophes in comment prose would
 *  desync a naive quote walker — copied from the a11y-lints pattern. */
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

/** `<obj>?.theme ||/?? '<lit>'` — the resolution core. Group 1 = object name
 *  (styles / propStyles / resolvedStyles / dataGridStyles / …), group 2 = the
 *  default literal. */
/** `theme = '<lit>'` as a DESTRUCTURING-PARAM default (the shape the
 *  push-review proved invisible to CORE: PricingTable:89, DetailField:95/182,
 *  Tab:462 resolve their default via `({ theme = 'light' }) =>` with no
 *  `.theme` member access anywhere in the file). Preceded by `{`, `,` or `(`
 *  so an object-literal `theme: 'x'`, a JSX `data-theme={theme}`, and a
 *  comparison never match. */
const DESTRUCTURE_DEFAULT =
  /[{,(]\s*theme\s*=\s*['"](light|sacred|dark)['"]/g

const CORE =
  /([A-Za-z_$][\w$]*)\s*\??\.\s*theme\s*(?:\|\||\?\?)\s*['"](light|sacred|dark)['"]/g

/** Classify a match by the text immediately before it (comment-blanked). Only a
 *  plain assignment `=` or a `data-theme={` own-surface attribute is a ROOT; a
 *  leading `:` (pass-through property OR ternary branch), `|` (chained `||`
 *  fallback), or a comparison `==`/`<=`/`>=`/`!=` is not. */
function classify(pre: string): 'assign' | 'datatheme' | null {
  const trimmed = pre.replace(/\s+$/, '')
  const last = trimmed[trimmed.length - 1]
  if (last === '=') {
    const before = trimmed[trimmed.length - 2]
    if (before && '=<>!'.includes(before)) return null // ==, <=, >=, !=
    return 'assign'
  }
  if (last === '{') {
    if (/data-theme\s*=\s*\{$/.test(trimmed)) return 'datatheme'
    return null
  }
  return null
}

const lint: DriftLint = {
  name: 'theme-default-resolution',
  description:
    "Components resolve styles.theme to a hard-coded default two different ways library-wide (~44 default 'light', ~30 default 'sacred') — the same concept with two defaults, so a zero-prop <Alert> (light) inside <Card> (sacred) renders mismatched surfaces. The ratchet freezes each file's current default (baseline key is path::literal) so no file changes its default and no new file adds another inline default.",
  canon:
    "Declare a component's theme default ONCE via a shared resolveTheme/DEFAULT_THEME helper; do not add a new `styles?.theme || 'x'` root literal or change an existing file's frozen default — the unification target is 'sacred'.\n\n" +
    "Evidence for 'sacred' as the target (a MINORITY count, 30 < 44 'light', chosen against raw dominance for architectural reasons): (1) the CSS-modules system makes 'sacred' the HARD-CODED default class — `[data-theme='light'|'dark']` are OVERRIDES on top of a sacred base (src/styles + goobs.md §1), so a component resolving to 'light' is drifting AWAY from its own stylesheet's default; (2) Field/Shell — the shared field chrome that all 34 input components compose on — resolves `?? 'sacred'`; (3) the primary branded surfaces (Card, Button, Chip, Select, Tabs, Stepper, Divider, MenuItem, EmptyState, DataGrid, every Dropdown/IPAM field, WorkspaceFilterShell) already resolve 'sacred', while the 'light' plurality is inflated by internal sub-components (Fade/Zoom/Slide animation wrappers, ComplexTextEditor/DataGrid-table/ProjectBoard internals, List×4) that inherit context rather than stand alone as surfaces. Unifying is BREAKING + operator-gated (visual identity), so this module only ratchets; it does not flip anything.",
  scope: 'ts',
  measure(files: DriftFile[]): DriftInstance[] {
    const instances: DriftInstance[] = []
    for (const { path, text: raw } of files) {
      // Leaf glyphs are uniformly 'light' and are not surfaces — excluding them
      // keeps the census on the ~even light/sacred surface split that is the drift.
      if (path.includes('/components/Icons/')) continue
      const text = blankComments(raw)
      DESTRUCTURE_DEFAULT.lastIndex = 0
      let dd: RegExpExecArray | null
      while ((dd = DESTRUCTURE_DEFAULT.exec(text))) {
        instances.push({
          // same per-literal key convention as CORE below: a default FLIP
          // shrinks the old key and grows the new one.
          file: `${path}::${dd[1]}`,
          line: text.slice(0, dd.index).split('\n').length,
          token: `destructure-default '${dd[1]}'`,
        })
      }
      CORE.lastIndex = 0
      let m: RegExpExecArray | null
      while ((m = CORE.exec(text))) {
        const kind = classify(text.slice(0, m.index))
        if (!kind) continue
        const obj = m[1]
        const lit = m[2]
        const line = text.slice(0, m.index).split('\n').length
        instances.push({
          // literal encoded into the key so the count-only ratchet freezes the
          // default PER FILE PER LITERAL (a flip = old key shrinks, new key grows).
          file: `${path}::${lit}`,
          line,
          token: `root theme default '${lit}' (${kind}, ${obj}?.theme)`,
        })
      }
    }
    return instances
  },
  selftest: {
    bad: [
      // Destructuring-param default — the blind spot the push-review proved
      // (PricingTable/DetailField/Tab shape): no `.theme` access anywhere.
      "const PricingTable = ({ theme = 'light' }: Props) => <div data-theme={theme} />",
      // assignment root defaulting light (Alert / Badge / Avatar form)
      "const theme = styles?.theme || 'light'",
      // assignment root defaulting sacred via ?? (Chip / Card / Field/Shell form)
      "const theme = resolvedStyles?.theme ?? 'sacred'",
      // typed assignment root (BigCalendar / Field/Shell `: FieldTheme =` form)
      "const theme: FieldTheme = styles?.theme ?? 'sacred'",
      // own-surface data-theme root (Dropdown / IPAM form)
      "return <div data-theme={styles?.theme || 'sacred'}>x</div>",
    ],
    good: [
      // Object-literal property and JSX attr are not resolution roots.
      "const styleDefaults = { theme: 'light' }",
      'const El = () => <div data-theme={theme} />',
      // pass-through: forwarding a default to a CHILD is not a root.
      "<Icon styles={{ theme: styles?.theme || 'sacred', size: 16 }} />",
      // ternary branch: which literal is "the default" is ambiguous (Field/USD).
      "const t = sacredTheme ? 'sacred' : styles?.theme || 'light'",
      // chained `||` fallback inside a pass-through (DataGrid/Toolbar).
      "styles={{ theme: btn.styles?.theme || styles?.theme || 'light' }}",
      // comparison, not a default resolution.
      "const same = current === styles?.theme || 'light'",
      // the literal inside a comment is documentation, not code (Toolbar/Popover).
      "// old default was `styles?.theme || 'light'`\nconst n = 1",
    ],
  },
}

export default lint
