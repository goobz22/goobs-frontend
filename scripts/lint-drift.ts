#!/usr/bin/env bun
/**
 * drift ratchet runner — the systematic-drift gate (`bun run lint:drift`).
 *
 * A DRIFT class is the same concept spelled N different ways across components
 * (onChange signatures, theme defaults, styles-key synonyms, missing JSDoc,
 * missing className passthrough…). Unlike an a11y defect, the existing
 * instances often can't be mass-fixed without breaking the public API — but
 * drift GROWTH is always preventable. So each module here is a RATCHET:
 *
 *   1. `measure()` returns every current instance (file + stable token).
 *   2. A committed baseline (scripts/drift-lints/baselines/<name>.json,
 *      a { file: count } map) freezes today's drift.
 *   3. The runner FAILS when any file's count GROWS or a new file appears —
 *      new code must use the canonical form (each module documents it in
 *      `canon`, with the evidence that picked it).
 *   4. Shrinkage prints a tighten reminder; `--update` rewrites baselines
 *      (a deliberate, reviewed commit — tightening the ratchet).
 *
 * Modules live in scripts/drift-lints/*.ts (contract mirrors
 * scripts/a11y-lints/README.md: default-export, name === filename, mandatory
 * selftest that the runner refuses to skip; comment-blank before scanning —
 * apostrophes in comments desync naive walkers).
 *
 * Usage:
 *   bun scripts/lint-drift.ts               # selftest + ratchet check
 *   bun scripts/lint-drift.ts --selftest    # selftests only
 *   bun scripts/lint-drift.ts --only <name> # one module
 *   bun scripts/lint-drift.ts --update      # rewrite baselines to current
 */
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from 'node:fs'
import { join, relative } from 'node:path'
import { pathToFileURL } from 'node:url'

export interface DriftFile {
  /** repo-relative path, forward slashes */
  path: string
  text: string
}
export interface DriftInstance {
  file: string
  line: number
  /** short stable description of the instance (shown in growth failures) */
  token: string
}
export interface DriftLint {
  /** kebab-case slug, must equal the module filename without .ts */
  name: string
  description: string
  /** The canonical form new code must use, with the evidence that picked it. */
  canon: string
  /** Which files to scan: 'ts' (src/**∕*.ts[x], no .d.ts/stories) | 'css'
   *  (src/**∕*.module.css + src/styles/*.css) | 'stories' (*.stories.tsx). */
  scope: 'ts' | 'css' | 'stories'
  measure(files: DriftFile[]): DriftInstance[]
  /** bad: each snippet must yield >=1 instance; good: each must yield 0. */
  selftest: { bad: string[]; good: string[] }
}

const ROOT = join(import.meta.dir, '..')
const LINTS_DIR = join(import.meta.dir, 'drift-lints')
const BASELINE_DIR = join(LINTS_DIR, 'baselines')

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) walk(full, out)
    else out.push(full)
  }
  return out
}

function filesForScope(scope: DriftLint['scope']): DriftFile[] {
  const all = walk(join(ROOT, 'src'))
  const rel = (p: string) => relative(ROOT, p).replace(/\\/g, '/')
  let picked: string[]
  if (scope === 'css')
    picked = all.filter((p) => p.endsWith('.module.css') || /[\\/]styles[\\/][^\\/]+\.css$/.test(p))
  else if (scope === 'stories') picked = all.filter((p) => /\.stories\.tsx$/.test(p))
  else
    picked = all.filter(
      (p) =>
        /\.(ts|tsx)$/.test(p) &&
        !p.endsWith('.d.ts') &&
        !/\.stories\.(ts|tsx)$/.test(p)
    )
  return picked.map((p) => ({ path: rel(p), text: readFileSync(p, 'utf8') }))
}

async function loadLints(): Promise<DriftLint[]> {
  let moduleFiles: string[] = []
  try {
    moduleFiles = readdirSync(LINTS_DIR).filter(
      (f) => f.endsWith('.ts') && !f.startsWith('_')
    )
  } catch {
    return []
  }
  const lints: DriftLint[] = []
  for (const file of moduleFiles.sort()) {
    const mod = await import(pathToFileURL(join(LINTS_DIR, file)).href)
    const lint: DriftLint = mod.default
    if (!lint?.name || typeof lint.measure !== 'function' || !lint.selftest || !lint.canon) {
      console.error(`✗ ${file} does not export a valid DriftLint (name/canon/measure/selftest)`)
      process.exit(1)
    }
    if (lint.name !== file.replace(/\.ts$/, '')) {
      console.error(`✗ ${file}: lint.name '${lint.name}' must match filename`)
      process.exit(1)
    }
    lints.push(lint)
  }
  return lints
}

function selftest(lint: DriftLint): string[] {
  const failures: string[] = []
  lint.selftest.bad.forEach((snippet, i) => {
    const hits = lint.measure([
      { path: `__selftest__/${lint.name}/bad-${i}.tsx`, text: snippet },
    ])
    if (hits.length === 0) failures.push(`bad[${i}] produced 0 instances (must be >=1)`)
  })
  lint.selftest.good.forEach((snippet, i) => {
    const hits = lint.measure([
      { path: `__selftest__/${lint.name}/good-${i}.tsx`, text: snippet },
    ])
    if (hits.length > 0)
      failures.push(`good[${i}] produced ${hits.length} instance(s) (must be 0): ${hits[0].token}`)
  })
  return failures
}

function baselinePath(name: string): string {
  return join(BASELINE_DIR, `${name}.json`)
}
function countsOf(instances: DriftInstance[]): Record<string, number> {
  const counts: Record<string, number> = {}
  for (const inst of instances) counts[inst.file] = (counts[inst.file] ?? 0) + 1
  return counts
}

const argv = process.argv.slice(2)
const selftestOnly = argv.includes('--selftest')
const update = argv.includes('--update')
const onlyIdx = argv.indexOf('--only')
if (onlyIdx >= 0 && !argv[onlyIdx + 1]) {
  console.error('✗ --only requires a module name')
  process.exit(1)
}
const only = onlyIdx >= 0 ? argv[onlyIdx + 1] : null

let lints = await loadLints()
if (only) {
  lints = lints.filter((l) => l.name === only)
  if (!lints.length) {
    console.error(`✗ no drift module named '${only}'`)
    process.exit(1)
  }
}
if (!lints.length) {
  console.log('lint:drift — no drift modules yet (scripts/drift-lints/ empty); passing.')
  process.exit(0)
}

let failed = false
for (const lint of lints) {
  const failures = selftest(lint)
  if (failures.length) {
    failed = true
    console.error(`✗ selftest FAILED: ${lint.name}`)
    for (const f of failures) console.error(`    ${f}`)
  }
}
if (failed) process.exit(1)
console.log(`selftest: ${lints.length} drift module(s) OK`)
if (selftestOnly) process.exit(0)

const scopeCache = new Map<string, DriftFile[]>()
let anyGrowth = false
let anyShrink = false
for (const lint of lints) {
  if (!scopeCache.has(lint.scope)) scopeCache.set(lint.scope, filesForScope(lint.scope))
  const instances = lint.measure(scopeCache.get(lint.scope)!)
  const current = countsOf(instances)
  const bp = baselinePath(lint.name)

  if (update || !existsSync(bp)) {
    mkdirSync(BASELINE_DIR, { recursive: true })
    writeFileSync(bp, JSON.stringify(current, null, 1) + '\n')
    console.log(
      `${existsSync(bp) && update ? 'updated' : 'created'} baseline ${lint.name}: ` +
        `${instances.length} instance(s) across ${Object.keys(current).length} file(s)`
    )
    continue
  }

  const baseline = JSON.parse(readFileSync(bp, 'utf8')) as Record<string, number>
  let grew = false
  for (const [file, count] of Object.entries(current)) {
    const allowed = baseline[file] ?? 0
    if (count > allowed) {
      grew = true
      const fresh = instances.filter((i) => i.file === file)
      console.error(
        `✗ ${lint.name}: DRIFT GREW in ${file} (${count} > baseline ${allowed}). New code must use the canon: ${lint.canon.split('\n')[0]}`
      )
      for (const inst of fresh.slice(0, 5))
        console.error(`    ${inst.file}:${inst.line} ${inst.token}`)
    }
  }
  const shrunk = Object.entries(baseline).some(
    ([file, count]) => (current[file] ?? 0) < count
  )
  if (grew) {
    anyGrowth = true
  } else if (shrunk) {
    anyShrink = true
    console.log(`  ${lint.name}: drift SHRANK below baseline — run \`bun scripts/lint-drift.ts --update\` to tighten the ratchet (commit the baseline change)`)
  } else {
    console.log(`  ${lint.name}: ${instances.length} instance(s) — at baseline, no growth`)
  }
}

if (anyGrowth) {
  console.error('\nlint:drift FAILED — systematic drift grew; use the canonical form (module `canon`) or, for a deliberate exception, update the baseline in a reviewed commit with the reason')
  process.exit(1)
}
console.log(`lint:drift clean — ${lints.length} ratchet(s) held${anyShrink ? ' (tighten available)' : ''}`)
