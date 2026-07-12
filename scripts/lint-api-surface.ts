#!/usr/bin/env bun
/**
 * lint-api-surface — public API surface gate (api-extractor-style, but
 * dependency-free; run in prepublishOnly AFTER lint:budget).
 *
 * A published library's `src/index.ts` barrel IS its contract: every name it
 * re-exports (values AND types) is something a consumer can `import`. Removing
 * or renaming one is a BREAKING change; adding one widens the surface you now
 * have to support forever. Both should be DELIBERATE, reviewed in the diff —
 * never a silent side effect of an unrelated edit. This gate freezes the
 * surface in a committed baseline (`docs/api-surface.json`) and fails when the
 * live barrel drifts from it.
 *
 * What it parses: the export statements in `src/index.ts` — names only.
 *   - `export { default as Foo, type FooProps, Bar as Baz } from '...'`  → Foo, FooProps, Baz
 *   - `export type { AType, BType as CType } from '...'`                  → AType, CType
 *   - `export * as Icons from '...'`                                      → Icons (one namespace binding)
 *   - `export * from './x'`  → resolves ./x one+ levels and enumerates ITS
 *       re-exported names (so a change to a star-re-exported module is caught);
 *       if ./x can't be read, records a `* from './x'` marker instead so the
 *       star declaration itself is still tracked.
 *   - `export const/function/class/type/... Name`                        → Name
 * Comments are blanked with a string-aware scanner first (apostrophes in
 * comments desync naive walkers — a proven incident class in this repo).
 *
 * Modes:
 *   (default)    compare live surface vs baseline; exit 1 listing added/removed.
 *   --update     rewrite docs/api-surface.json from the live barrel.
 *   --selftest   verify the parser + compare logic on in-memory fixtures.
 *
 * Usage: bun scripts/lint-api-surface.ts [--update | --selftest]
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'

const ROOT = join(import.meta.dir, '..')
const INDEX = join(ROOT, 'src/index.ts')
const BASELINE = join(ROOT, 'docs/api-surface.json')

const IDENT = /^[A-Za-z_$][\w$]*$/

/**
 * Blank out `//` line comments and block comments while preserving string
 * literals verbatim (so `from './path'` specifiers survive). A char-by-char
 * scanner that tracks string state is the only safe way — apostrophes inside
 * comments (`don't`, `consumer's`) desync a naive regex walker.
 */
export function stripComments(src: string): string {
  let out = ''
  let i = 0
  const n = src.length
  while (i < n) {
    const c = src[i]
    const d = src[i + 1]
    // line comment
    if (c === '/' && d === '/') {
      while (i < n && src[i] !== '\n') i++
      continue
    }
    // block comment
    if (c === '/' && d === '*') {
      i += 2
      while (i < n && !(src[i] === '*' && src[i + 1] === '/')) i++
      i += 2
      continue
    }
    // string / template literal — copy through verbatim
    if (c === '"' || c === "'" || c === '`') {
      const quote = c
      out += c
      i++
      while (i < n) {
        const ch = src[i]
        out += ch
        if (ch === '\\') {
          // copy the escaped char too
          if (i + 1 < n) out += src[i + 1]
          i += 2
          continue
        }
        i++
        if (ch === quote) break
      }
      continue
    }
    out += c
    i++
  }
  return out
}

/** Reduce one export specifier (`default as Foo`, `type Bar as Baz`, `Qux`) to
 *  the name a consumer actually sees (the binding after `as`, `type` dropped). */
function specifierName(rawSpecifier: string): string | null {
  let spec = rawSpecifier.trim()
  if (!spec) return null
  if (spec.startsWith('type ')) spec = spec.slice(5).trim()
  const parts = spec.split(/\s+as\s+/)
  const name = parts[parts.length - 1].trim()
  return IDENT.test(name) ? name : null
}

/** How to expand `export * from '<spec>'`: return the names it contributes. */
type StarResolver = (specifier: string) => string[]

/**
 * Extract the public names declared by the export statements in one source
 * string. `resolveStar` decides how `export * from '...'` is expanded; when
 * omitted a `* from '...'` marker is emitted (hermetic — used by --selftest).
 */
export function parseSurface(source: string, resolveStar?: StarResolver): string[] {
  const clean = stripComments(source)
  const names = new Set<string>()

  // export { ... } / export type { ... }  (with or without `from`)
  const blockRe = /export\s+(?:type\s+)?\{([^}]*)\}/g
  let m: RegExpExecArray | null
  while ((m = blockRe.exec(clean))) {
    for (const raw of m[1].split(',')) {
      const name = specifierName(raw)
      if (name) names.add(name)
    }
  }

  // export * as Name from '...'  (single namespace binding)
  const nsRe = /export\s+\*\s+as\s+([A-Za-z_$][\w$]*)\s+from/g
  while ((m = nsRe.exec(clean))) names.add(m[1])

  // export * from '...'  (wildcard re-export)
  const starRe = /export\s+\*\s+from\s+['"]([^'"]+)['"]/g
  while ((m = starRe.exec(clean))) {
    const specifier = m[1]
    const expanded = resolveStar
      ? resolveStar(specifier)
      : [`* from '${specifier}'`]
    for (const name of expanded) names.add(name)
  }

  // export const/let/var/function/class/interface/enum/type Name = ...
  const declRe =
    /export\s+(?:default\s+)?(?:async\s+)?(?:abstract\s+)?(?:const|let|var|function\*?|class|interface|enum|type)\s+([A-Za-z_$][\w$]*)/g
  while ((m = declRe.exec(clean))) names.add(m[1])

  return [...names].sort()
}

/** Resolve a relative module specifier to a readable source file, trying the
 *  usual TS extensions and index files. Returns null when nothing resolves. */
function resolveModule(fromFile: string, specifier: string): string | null {
  if (!specifier.startsWith('.')) return null // bare/package specifiers aren't ours to read
  const base = resolve(dirname(fromFile), specifier)
  const candidates = [
    base,
    `${base}.ts`,
    `${base}.tsx`,
    join(base, 'index.ts'),
    join(base, 'index.tsx'),
  ]
  for (const candidate of candidates) {
    if (candidate.endsWith('.d.ts')) continue // never read declaration files
    if (existsSync(candidate) && !candidate.endsWith('/')) {
      try {
        readFileSync(candidate, 'utf8')
        return candidate
      } catch {
        /* keep trying */
      }
    }
  }
  return null
}

/** Parse a barrel file from disk, resolving `export *` targets recursively
 *  (visited-guarded) so star-re-exported names land in the surface. */
export function parseSurfaceFile(
  file: string,
  visited: Set<string> = new Set()
): string[] {
  const key = resolve(file)
  if (visited.has(key)) return []
  visited.add(key)
  const source = readFileSync(file, 'utf8')
  return parseSurface(source, (specifier) => {
    const resolved = resolveModule(file, specifier)
    if (!resolved) return [`* from '${specifier}'`]
    return parseSurfaceFile(resolved, visited)
  })
}

/** Compare two surface lists → what was added / removed. */
export function diffSurface(
  baseline: string[],
  current: string[]
): { added: string[]; removed: string[] } {
  const baseSet = new Set(baseline)
  const currSet = new Set(current)
  const added = current.filter((name) => !baseSet.has(name)).sort()
  const removed = baseline.filter((name) => !currSet.has(name)).sort()
  return { added, removed }
}

// --------------------------------------------------------------------------
// modes
// --------------------------------------------------------------------------

function readBaseline(): string[] {
  const parsed = JSON.parse(readFileSync(BASELINE, 'utf8')) as unknown
  if (Array.isArray(parsed)) return parsed as string[]
  if (parsed && typeof parsed === 'object' && Array.isArray((parsed as { surface?: unknown }).surface))
    return (parsed as { surface: string[] }).surface
  throw new Error('docs/api-surface.json is malformed — expected an array or a { surface: [...] } object')
}

function writeBaseline(surface: string[]): void {
  const doc = {
    note:
      'Public API surface of goobs-frontend — the names re-exported from src/index.ts (values AND types). ' +
      'Regenerate with `bun scripts/lint-api-surface.ts --update`. Gate: `bun run lint:api`. ' +
      'REMOVALS are breaking changes (require a semver MAJOR bump + a deliberate baseline update); ' +
      'ADDITIONS require a deliberate baseline-update commit.',
    count: surface.length,
    surface,
  }
  writeFileSync(BASELINE, `${JSON.stringify(doc, null, 2)}\n`)
}

function runUpdate(): void {
  const surface = parseSurfaceFile(INDEX)
  writeBaseline(surface)
  console.log(
    `lint-api-surface: wrote docs/api-surface.json — ${surface.length} public name(s).`
  )
}

function runCompare(): void {
  if (!existsSync(BASELINE)) {
    console.error(
      '✗ docs/api-surface.json missing — generate it with `bun scripts/lint-api-surface.ts --update` and commit it.'
    )
    process.exit(1)
  }
  const baseline = readBaseline()
  const current = parseSurfaceFile(INDEX)
  const { added, removed } = diffSurface(baseline, current)

  if (added.length === 0 && removed.length === 0) {
    console.log(
      `lint-api-surface clean — ${current.length} public name(s) match the baseline.`
    )
    return
  }

  if (removed.length) {
    console.error(`✗ ${removed.length} public export REMOVED from src/index.ts:`)
    for (const name of removed) console.error(`    - ${name}`)
    console.error(
      '  REMOVALS are BREAKING changes: they require a semver MAJOR bump and a DELIBERATE\n' +
        '  baseline update. If this removal is intended, run `bun scripts/lint-api-surface.ts --update`\n' +
        '  and commit docs/api-surface.json alongside the major-version bump.'
    )
  }
  if (added.length) {
    console.error(`✗ ${added.length} public export ADDED to src/index.ts:`)
    for (const name of added) console.error(`    + ${name}`)
    console.error(
      '  ADDITIONS widen the supported surface. If intended, run\n' +
        '  `bun scripts/lint-api-surface.ts --update` and commit the baseline update.'
    )
  }
  console.error('\nlint-api-surface FAILED — public API surface drifted from docs/api-surface.json')
  process.exit(1)
}

function runSelftest(): void {
  const failures: string[] = []
  const eq = (label: string, actual: unknown, expected: unknown) => {
    const a = JSON.stringify(actual)
    const e = JSON.stringify(expected)
    if (a !== e) failures.push(`${label}\n      expected ${e}\n      got      ${a}`)
  }

  // --- parser: every export form, plus an apostrophe-laden comment ---
  const fixtureSource = [
    "// a line comment with an apostrophe: don't desync the scanner",
    '/* block comment: consumer\'s names must not leak { Ghost } */',
    "export { default as Foo, type FooProps, Bar, Baz as Qux } from './foo'",
    "export type { AType, BType as CType } from './types'",
    "export * as NS from './ns'",
    "export * from './star'",
    'export const localConst = 1',
    'export function helper() {}',
  ].join('\n')
  eq('parser extracts all export forms (star → marker when hermetic)', parseSurface(fixtureSource), [
    "* from './star'",
    'AType',
    'Bar',
    'CType',
    'Foo',
    'FooProps',
    'NS',
    'Qux',
    'helper',
    'localConst',
  ])

  // --- parser: a resolver expands `export *` into real names ---
  eq(
    'parser expands star via resolver',
    parseSurface("export * from './star'", () => ['Alpha', 'Beta']),
    ['Alpha', 'Beta']
  )

  // --- compare logic: unchanged / added / removed ---
  eq('diff unchanged', diffSurface(['A', 'B'], ['A', 'B']), { added: [], removed: [] })
  eq('diff added', diffSurface(['A', 'B'], ['A', 'B', 'C']), { added: ['C'], removed: [] })
  eq('diff removed', diffSurface(['A', 'B', 'C'], ['A', 'B']), { added: [], removed: ['C'] })
  eq('diff added + removed', diffSurface(['A', 'B'], ['A', 'C']), {
    added: ['C'],
    removed: ['B'],
  })

  if (failures.length) {
    console.error('✗ lint-api-surface --selftest FAILED:')
    for (const f of failures) console.error(`  - ${f}`)
    process.exit(1)
  }
  console.log('lint-api-surface --selftest clean — parser + compare logic verified.')
}

const mode = process.argv[2]
if (mode === '--selftest') runSelftest()
else if (mode === '--update') runUpdate()
else if (mode === undefined) runCompare()
else {
  console.error(`Unknown argument: ${mode}\nUsage: bun scripts/lint-api-surface.ts [--update | --selftest]`)
  process.exit(1)
}
