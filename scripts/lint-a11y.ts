#!/usr/bin/env bun
/**
 * a11y class-lint runner — the permanent regression gate for accessibility
 * issue CLASSES found during the 2026-07 component accessibility audit
 * (hearing-impaired, reading-impaired / screen-reader, SEO-semantic).
 *
 * Every module in scripts/a11y-lints/*.ts detects ONE issue class across the
 * whole src/ tree (contract: scripts/a11y-lints/README.md). The runner:
 *   1. ALWAYS self-tests every module first (a lint whose selftest fails is a
 *      false-green risk and fails the run outright).
 *   2. Runs every module over src/**\/*.{ts,tsx} (excluding .d.ts and stories)
 *      and prints violations as `file:line message [module]`.
 *   3. Exits non-zero on any violation or selftest failure.
 *
 * Usage:
 *   bun scripts/lint-a11y.ts               # selftest + full scan
 *   bun scripts/lint-a11y.ts --selftest    # selftest only
 *   bun scripts/lint-a11y.ts --only <name> # single module (still selftests it)
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { pathToFileURL } from 'node:url'

export interface LintFile {
  /** repo-relative path, forward slashes */
  path: string
  text: string
}
export interface Violation {
  file: string
  line: number
  message: string
}
export interface A11yLint {
  /** kebab-case slug, must equal the module filename without .ts */
  name: string
  /** WCAG success criterion / criteria this class violates, e.g. '4.1.2' */
  wcag: string
  description: string
  /** Return every instance of the class in the given files. */
  check(files: LintFile[]): Violation[]
  /**
   * Fixture snippets: every `bad` snippet MUST yield >=1 violation when
   * checked as a standalone .tsx fixture; every `good` snippet MUST yield 0.
   */
  selftest: { bad: string[]; good: string[] }
}

const ROOT = join(import.meta.dir, '..')
const LINTS_DIR = join(import.meta.dir, 'a11y-lints')

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) walk(full, out)
    else out.push(full)
  }
  return out
}

function collectSourceFiles(): LintFile[] {
  return walk(join(ROOT, 'src'))
    .filter(
      (p) =>
        /\.(ts|tsx)$/.test(p) &&
        !p.endsWith('.d.ts') &&
        !/\.stories\.(ts|tsx)$/.test(p)
    )
    .map((p) => ({
      path: relative(ROOT, p).replace(/\\/g, '/'),
      text: readFileSync(p, 'utf8'),
    }))
}

async function loadLints(): Promise<A11yLint[]> {
  let moduleFiles: string[] = []
  try {
    moduleFiles = readdirSync(LINTS_DIR).filter(
      (f) => f.endsWith('.ts') && !f.startsWith('_')
    )
  } catch {
    return []
  }
  const lints: A11yLint[] = []
  for (const file of moduleFiles.sort()) {
    const mod = await import(pathToFileURL(join(LINTS_DIR, file)).href)
    const lint: A11yLint = mod.default
    if (!lint?.name || typeof lint.check !== 'function' || !lint.selftest) {
      console.error(`✗ ${file} does not export a valid A11yLint (see README)`)
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

function selftest(lint: A11yLint): string[] {
  const failures: string[] = []
  lint.selftest.bad.forEach((snippet, i) => {
    const hits = lint.check([
      { path: `__selftest__/${lint.name}/bad-${i}.tsx`, text: snippet },
    ])
    if (hits.length === 0)
      failures.push(`bad[${i}] produced 0 violations (must be >=1)`)
  })
  lint.selftest.good.forEach((snippet, i) => {
    const hits = lint.check([
      { path: `__selftest__/${lint.name}/good-${i}.tsx`, text: snippet },
    ])
    if (hits.length > 0)
      failures.push(
        `good[${i}] produced ${hits.length} violation(s) (must be 0): ${hits[0].message}`
      )
  })
  return failures
}

const argv = process.argv.slice(2)
const selftestOnly = argv.includes('--selftest')
const onlyIdx = argv.indexOf('--only')
const only = onlyIdx >= 0 ? argv[onlyIdx + 1] : null

let lints = await loadLints()
if (only) {
  lints = lints.filter((l) => l.name === only)
  if (lints.length === 0) {
    console.error(`✗ no lint module named '${only}' in scripts/a11y-lints/`)
    process.exit(1)
  }
}
if (lints.length === 0) {
  console.log('lint:a11y — no lint modules yet (scripts/a11y-lints/ empty); passing.')
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
console.log(`selftest: ${lints.length} module(s) OK`)
if (selftestOnly) process.exit(0)

const files = collectSourceFiles()
let total = 0
for (const lint of lints) {
  const violations = lint
    .check(files)
    .sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line)
  total += violations.length
  for (const v of violations)
    console.log(`${v.file}:${v.line} ${v.message} [${lint.name}]`)
  if (violations.length)
    console.log(
      `— ${lint.name} (WCAG ${lint.wcag}): ${violations.length} violation(s)`
    )
}
if (total > 0) {
  console.error(`\nlint:a11y FAILED — ${total} violation(s) across ${lints.length} class lint(s)`)
  process.exit(1)
}
console.log(`lint:a11y clean — ${lints.length} class lint(s) over ${files.length} files`)
