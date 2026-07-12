import type { DriftFile, DriftInstance, DriftLint } from '../lint-drift'

/**
 * DRIFT CLASS: a user-VISIBLE string rendered with NO prop to override it.
 *
 * Two shapes, one class ("the copy is baked in; a consumer can't change it"):
 *
 *   1. A `placeholder="…"` JSX attribute whose value is a BARE string literal,
 *      in a component file whose Props declare NO `placeholder` prop. The whole
 *      input's placeholder text is then unreachable from the outside.
 *   2. An empty / status / error-state message rendered as BARE JSX TEXT (e.g.
 *      `<div className={s.emptyState}>No options found</div>`), where the
 *      component exposes no prop for that copy.
 *
 * CANON (what NEW code must do): every user-visible string is a PROP with today's
 * text as the DEFAULT — `placeholder={placeholder ?? 'Search…'}`,
 * `emptyLabel = 'No options found'`. Evidence: the campaign that fixed the
 * aria-label subset of this exact class established the pattern (an additive
 * prop defaulting to the current literal — see repo precedent `Markdown`'s
 * `data-testid` prop, `Search`'s `placeholder`/`ariaLabel`); every Field leaf
 * that DOES thread `placeholder` through Props is the dominant, compliant form.
 * A string a consumer cannot localize, rebrand, or right-size for its context is
 * product drift — the canon makes the default free and the override possible.
 *
 * ── Detection (comment-SAFE; comments are blanked before scanning) ────────────
 * PASS 1 — placeholder attributes: a file is SKIPPED entirely when its text
 *   declares a `placeholder?:` prop (the specified gate: "no placeholder prop in
 *   the file's Props"). This deliberately UNDER-measures — e.g. SearchableSimple
 *   exposes `placeholder?:` for its field yet hardcodes the INTERNAL search box's
 *   `placeholder="Search…"`; the file gate skips it (false-positives are poison,
 *   an ambiguous shape is dropped). In a non-skipped file, every
 *   `placeholder="…"` / `placeholder='…'` (bare literal — `placeholder={…}`
 *   expressions are already compliant and never match) is one instance.
 *   NOTE: a destructuring default `placeholder = 'x'` would also match the
 *   literal shape, but in this codebase it ALWAYS co-occurs with a `placeholder?:`
 *   decl, so the file gate excludes it — the documented conservative boundary.
 *
 * PASS 2 — empty/status/error copy: an EXPLICIT, hand-verified inventory of the
 *   specific literals found by discovery (each confirmed to render as JSX text in
 *   an empty/status/error state with no overriding prop). A phrase counts ONLY
 *   where it appears as JSX TEXT — the nearest non-whitespace char before it is
 *   `>` — so the same words inside a quoted assignment or a default are NOT hit.
 *   This half is an inventory, not a structural sweep: copying one of these exact
 *   strings into a new file trips the ratchet (growth), but brand-new distinct
 *   copy is intentionally not auto-caught — conservative by design; PASS 1 is the
 *   live structural ratchet.
 */

/** Blank `//` and `/* … *​/` comment content (string-aware, newlines kept) so a
 *  literal quoted inside a JSDoc never counts. Copied from the a11y-lints
 *  blankComments pattern (apostrophes in comments desync naive quote tracking). */
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

// A file "exposes a placeholder prop" when its Props declare `placeholder?:`
// (the optional-prop syntax every placeholder-bearing component here uses). The
// `[^.\w]` / SOL boundary rejects member access like `fieldConfig.placeholder`.
const PLACEHOLDER_PROP_DECL = /(?:^|[^.\w])placeholder\s*\?\s*:/m

// A bare-literal `placeholder="…"` / `placeholder='…'` JSX attribute. The value
// alternation is a quoted string only, so `placeholder={…}` (compliant, derived
// from a prop) never matches. Group 1 is the boundary char, group 2 the attr.
const PLACEHOLDER_LITERAL_ATTR =
  /(^|[^.\w])(placeholder\s*=\s*(?:"[^"]*"|'[^']*'))/gm

// Hand-verified empty/status/error-state copy — each a JSX text node with no
// overriding prop (verified against the component's Props). Ordered longest-first
// so a phrase that contains another ('No options available' ⊃ 'No options') can
// never be shadowed (none currently nest, but the order keeps that invariant).
const EMPTY_STATE_COPY: string[] = [
  'No case updates yet. All task changes will appear here.',
  'No meetings scheduled for this task yet.',
  'No resolution information yet',
  'No data to display.',
  'No options available',
  'No recent searches',
  'No options found',
  'Select items...',
  'Select an option',
  'Drop task here',
  'No tasks yet',
  'No items',
]

/** True when, scanning back over whitespace from `idx`, the first non-space char
 *  is `>` — i.e. the phrase is JSX text, not a quoted string / default value. */
function isJsxText(text: string, idx: number): boolean {
  let j = idx - 1
  while (j >= 0 && (text[j] === ' ' || text[j] === '\t' || text[j] === '\n' || text[j] === '\r')) {
    j--
  }
  return j >= 0 && text[j] === '>'
}

function lineAt(text: string, idx: number): number {
  return text.slice(0, idx).split('\n').length
}

const lint: DriftLint = {
  name: 'non-overridable-user-string',
  scope: 'ts',
  canon:
    'Every user-visible string is a prop with today’s text as the default (placeholder={placeholder ?? ‘Search…’}, emptyLabel = ‘No options found’) — a hardcoded placeholder attribute or empty/status JSX-text message a consumer cannot override is drift. Evidence: the dominant Field family already threads placeholder through Props, and the aria-label subset of this class was already fixed by the additive-prop-with-current-literal-as-default campaign (repo precedent: Markdown data-testid, Search placeholder/ariaLabel).',
  description:
    'User-facing strings baked in with no prop override: bare-literal placeholder="…" attributes in files whose Props declare no placeholder prop, plus the specific empty/status/error-state JSX-text messages discovery named. New code must expose the string as a prop defaulting to the current literal.',
  measure(files: DriftFile[]): DriftInstance[] {
    const instances: DriftInstance[] = []
    for (const { path, text: raw } of files) {
      const text = blankComments(raw)

      // PASS 1 — bare-literal placeholder attrs in files with no placeholder prop.
      if (!PLACEHOLDER_PROP_DECL.test(text)) {
        PLACEHOLDER_LITERAL_ATTR.lastIndex = 0
        let m: RegExpExecArray | null
        while ((m = PLACEHOLDER_LITERAL_ATTR.exec(text))) {
          const attrStart = m.index + m[1].length
          const attr = m[2].replace(/\s+/g, ' ').trim()
          instances.push({
            file: path,
            line: lineAt(text, attrStart),
            token: attr.length > 60 ? attr.slice(0, 57) + '…' : attr,
          })
        }
      }

      // PASS 2 — enumerated empty/status/error JSX-text copy.
      for (const phrase of EMPTY_STATE_COPY) {
        let from = 0
        for (;;) {
          const idx = text.indexOf(phrase, from)
          if (idx < 0) break
          from = idx + phrase.length
          if (!isJsxText(text, idx)) continue
          instances.push({
            file: path,
            line: lineAt(text, idx),
            token: `copy: "${phrase.length > 48 ? phrase.slice(0, 45) + '…' : phrase}"`,
          })
        }
      }
    }
    return instances
  },
  selftest: {
    bad: [
      // Bare-literal placeholder attr, file has no `placeholder?:` prop.
      'const X = () => <input placeholder="Search..." />',
      // Single-quoted variant, still non-overridable.
      "const Y = () => <textarea placeholder='Full name' />",
      // Enumerated empty-state copy rendered as JSX text.
      'const Z = () => <div className={s.emptyState}>No options found</div>',
      // Status region JSX text.
      'const W = () => <span role="status">No data to display.</span>',
    ],
    good: [
      // Compliant: placeholder derived from a prop with a default.
      'const A = () => <input placeholder={placeholder ?? "Search..."} />',
      // Compliant: bare passthrough expression.
      'const B = () => <input placeholder={placeholder} />',
      // File exposes a `placeholder?:` prop → whole file is gated out (even a
      // hardcoded internal placeholder is conservatively skipped).
      'interface P { placeholder?: string }\nconst C = ({ placeholder = "Search..." }: P) => (\n  <input placeholder={placeholder} />\n)',
      // Enumerated phrase inside a QUOTED string (not JSX text) — not this class.
      'const msg = "No options found"\nconst D = () => <p>{msg}</p>',
      // Arbitrary empty-state copy NOT in the inventory — conservatively unmeasured.
      'const E = () => <div className={s.emptyState}>No widgets here yet</div>',
      // The literal quoted inside a JSDoc is documentation, not markup.
      '/** renders `placeholder="Search..."` and "No options found" when empty */\nconst F = () => <ul>{items}</ul>',
      // Empty-state copy sourced from a prop — the canonical fix shape.
      'const G = () => <div className={s.emptyState}>{emptyLabel}</div>',
    ],
  },
}

export default lint
