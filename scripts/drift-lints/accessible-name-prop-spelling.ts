import type { DriftFile, DriftInstance, DriftLint } from '../lint-drift'

/**
 * DRIFT: accessible-name prop spelling.
 *
 * A component that lets a consumer set the accessible name of its control
 * exposes that seam under TWO rival spellings:
 *
 *   - camelCase goobs-prop convention  — `ariaLabel?: string`,
 *     `ariaLabelledby?: string`, `ariaDescribedBy?: string` (the form the
 *     2026-07 a11y campaign standardized on for goobs' OWN props).
 *   - native DOM-attribute passthrough — a quoted-kebab member
 *     `'aria-label'?: string`, `'aria-labelledby'?: string`,
 *     `'aria-describedby'?: string`, used where the component builds a prop
 *     bag it spreads verbatim onto a native element (Field/Shell
 *     `inputAriaProps`, Icons `svgA11y`, internal button FCs in Pagination /
 *     TransferList / ToggleButton) or intentionally mirrors the DOM attribute
 *     (Button, IconButton, Breadcrumb, ProgressBar, ConfirmationCodeInput).
 *
 * Same intent, two spellings — and a handful of components (Field/Shell,
 * Pagination) carry BOTH. Consumers then guess which one a given component
 * wants. This module is the CENSUS + RATCHET over that seam: it freezes both
 * populations so the drift can't GROW, while `canon` records that NEW
 * goobs-facing props must use camelCase.
 *
 * WHAT COUNTS (an EXPLICIT Props-type MEMBER that names the seam):
 *   - camelCase, OPTIONAL only: `ariaLabel?: string` (also ariaLabelledby /
 *     ariaLabelledBy / ariaDescribedby / ariaDescribedBy). The optional `?:`
 *     is the member signal — a bare `ariaLabel: string` is AMBIGUOUS with a
 *     function parameter (`resolveAriaLabel(ariaLabel: string | undefined)`,
 *     `renderList(..., ariaLabel: string | undefined)`) so it is deliberately
 *     UNDER-MEASURED (false positives are poison). This drops 3 real required
 *     camelCase members (Card checkbox/drag-handle, DataGrid/Footer button
 *     type) — acceptable per the under-measure-the-ambiguous-shape rule.
 *   - quoted-kebab, optional OR required: `'aria-label': string`,
 *     `'aria-label'?: string`, `"aria-labelledby"?: string`, etc. A quoted
 *     member can NEVER be a function parameter, so requiring the RHS to be a
 *     `string` type safely captures both required and optional forms.
 *
 * WHAT DOES NOT COUNT (correctly excluded — pinned by selftest):
 *   - destructure / object-literal VALUES: `'aria-label': ariaLabel = '…'`,
 *     `'aria-label': accessibleName`, `ariaLabel: 'Go to first page'` (the RHS
 *     is an identifier / literal, not the `string` TYPE keyword).
 *   - function parameters: `ariaLabel: string | undefined,` (no `?:`).
 *   - native REST-SPREAD passthrough with no explicit member
 *     (`extends React.ButtonHTMLAttributes<…>`) — sanctioned AND invisible
 *     here (nothing to freeze; it grows freely).
 *   - JSX usage `<button aria-label="…">` and JSDoc prose (comments blanked).
 *   - inline seam-named TYPE ARGUMENTS mid-expression, e.g.
 *     `React.isValidElement<{ 'aria-describedby'?: string }>(children)` — a
 *     type predicate reading a FOREIGN child's native attribute, not a goobs
 *     Props member. Excluded by requiring the member to occupy its own line
 *     (the codebase writes every real member one-per-line; the type-guard sits
 *     mid-expression after `isValidElement<{`).
 */

/** Blank `//` and `/* … *​/` comment content (string-aware, newlines kept) so
 *  JSDoc prose describing `ariaLabel?: string` never becomes a phantom hit —
 *  apostrophes in comments also desync a naive quote walker (the pattern this
 *  repo's a11y modules standardized on). Copied from
 *  scripts/a11y-lints/label-input-id-divergence.ts. */
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

// camelCase accessible-name members. OPTIONAL (`?:`) only — the marker is what
// makes this unambiguously a Props member and not a function parameter. RHS is
// pinned to the `string` type keyword (`\bstring\b` → also matches
// `string | undefined`) so destructures / literal values never match.
const CAMEL =
  /(?<![\w$])(ariaLabel|ariaLabelledby|ariaLabelledBy|ariaDescribedby|ariaDescribedBy)\s*\?\s*:\s*string\b/g
// quoted-kebab accessible-name members. Optional OR required — a quoted key is
// never a parameter, so the `string`-typed RHS alone proves it a member.
const QUOTED =
  /(['"])(aria-label|aria-labelledby|aria-describedby)\1\s*\??\s*:\s*string\b/g

function lineAt(text: string, index: number): number {
  return text.slice(0, index).split('\n').length
}

// A real Props member occupies its own line: everything from the line start up
// to the match is whitespace. This excludes mid-expression seam-named type
// arguments like `isValidElement<{ 'aria-describedby'?: string }>` (a type
// predicate about a foreign child, not a member of a goobs component's props).
function isStandaloneMember(text: string, index: number): boolean {
  const lineStart = text.lastIndexOf('\n', index - 1) + 1
  return /^\s*$/.test(text.slice(lineStart, index))
}

const lint: DriftLint = {
  name: 'accessible-name-prop-spelling',
  scope: 'ts',
  description:
    'Accessible-name props are spelled two rival ways across components: the camelCase goobs convention (ariaLabel / ariaLabelledby / ariaDescribedBy) and native quoted-kebab passthrough ("aria-label"). This freezes the NON-canonical quoted-kebab member population (canonical camelCase members are sanctioned and uncounted — recalibrated 2026-07-12).',
  canon:
    'Use camelCase for a goobs-facing accessible-name prop: `ariaLabel` / `ariaLabelledby` / `ariaDescribedby` (dominant 57 of 74 explicit members; the form the 2026-07 a11y campaign standardized on). Native quoted-kebab (`\'aria-label\'?: string`) is SANCTIONED only where the component builds a prop bag it spreads verbatim onto a native element (Field/Shell inputAriaProps, Icons svgA11y, internal button FCs) or an HTMLAttributes rest-spread passthrough — not as the default spelling for a new prop.\n' +
    'EVIDENCE: JSX exposes native ARIA attributes as kebab (`aria-label`), so any component `extends *HTMLAttributes` gets kebab for free; goobs deliberately adds camelCase `ariaLabel` as its OWN prop so the seam is a real prop (documentable, defaultable, testable via getByRole name) rather than a raw DOM attribute. Census at freeze: 57 camelCase members vs 17 quoted-kebab members = 74 across the library; camelCase wins ~77%. The quoted-kebab population is frozen (baseline {file: count}); canonical camelCase members are uncounted, so adding one never fails the ratchet. A NEW quoted-kebab member outside a sanctioned prop-bag context is the drift.',
  measure(files: DriftFile[]): DriftInstance[] {
    const out: DriftInstance[] = []
    for (const { path, text: raw } of files) {
      const text = blankComments(raw)
      if (!text.includes('aria')) continue
      // RECALIBRATED 2026-07-12: canonical camelCase members are NOT
      // instances — counting them made the ratchet fail on exactly the
      // action its own failure message prescribes (adding an ariaLabel
      // prop). Only the non-canonical quoted-kebab population is frozen.
      let m: RegExpExecArray | null
      QUOTED.lastIndex = 0
      while ((m = QUOTED.exec(text))) {
        if (!isStandaloneMember(text, m.index)) continue
        out.push({
          file: path,
          line: lineAt(text, m.index),
          token: `native-kebab ${m[1]}${m[2]}${m[1]}`,
        })
      }
    }
    return out
  },
  selftest: {
    bad: [
      // quoted-kebab optional members — the minority native-passthrough form.
      "interface BarProps {\n  'aria-label'?: string\n  'aria-labelledby'?: string\n}",
      // quoted-kebab REQUIRED member (an svgA11y / prop-bag shape).
      "interface Baz {\n  'aria-label': string | undefined\n}",
    ],
    good: [
      // canonical camelCase members — the sanctioned form, NOT counted
      // (recalibrated 2026-07-12: canon usage must never fail the ratchet).
      'export interface FooProps {\n  ariaLabel?: string\n}',
      'interface Q {\n  ariaLabelledBy?: string\n  ariaDescribedBy?: string\n}',
      // Function parameter, not a member — required camelCase is deliberately
      // under-measured to avoid this false positive.
      'function resolveAriaLabel(\n  ariaLabel: string | undefined,\n  label: ReactNode\n) {\n  return ariaLabel\n}',
      // Destructure with a default — RHS is a binding, not the `string` type.
      "const { 'aria-label': ariaLabel = 'breadcrumb' } = props",
      // Object-literal value — RHS is a string literal, not the type keyword.
      "const props = { ariaLabel: 'Go to first page' }",
      // Native REST-SPREAD passthrough — sanctioned and uncounted (no member).
      'interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {\n  label: string\n}',
      // JSX usage — an attribute, not a Props member declaration.
      '<button aria-label="Send" />',
      // Inline type-guard argument reading a foreign child's native attribute —
      // a type predicate mid-expression, not a goobs Props member (own-line rule).
      "const ok =\n  React.isValidElement<{ 'aria-describedby'?: string }>(children)",
      // JSDoc prose describing the shape — blanked before scanning.
      '/** Optional ariaLabel?: string for the link; pass \'aria-label\' to override. */\nconst x = 1',
    ],
  },
}

export default lint
