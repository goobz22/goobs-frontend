#!/usr/bin/env bun
/**
 * lint-story-coverage.ts — every VALUE export in src/index.ts must be exercised
 * by at least one story.
 *
 * goobs has NO unit tests — stories + Chromatic ARE the regression net, so an
 * unstoried barrel export is a shipped component with ZERO regression coverage
 * (docs/audits/story-jsdoc-audit-2026-07-01.md §4 found 13 of them).
 *
 * Also enforces two story-file invariants eslint cannot express
 * (story-jsdoc-standard-proposal.md §4.3):
 *   - no two metas may share a `title:` (duplicate Chromatic baselines)
 *
 * Exit 1 on any violation. The allowlist below is the anti-rot mechanism the
 * old stylelint exemptions lacked: every entry carries a WHY, and an entry
 * whose export GAINS a story fails the run (stale allowlist).
 *
 * Run from the repo root:  bun scripts/lint-story-coverage.ts
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const HERE = path.dirname(fileURLToPath(import.meta.url)).replace(/\\/g, '/')
const ROOT = HERE.endsWith('/scripts') ? HERE.slice(0, -'/scripts'.length) : process.cwd().replace(/\\/g, '/')

// Exports that legitimately need no story — each with a reason, reviewed in PR.
const allowlist = new Map<string, string>([
  ['commonKeyframes', 'module-load side effect; executed whenever any story renders'],
  ['css', 'deprecated util, zero consumers — deletion candidate (audit §4.1 C3)'],
  ['keyframes', 'runtime keyframe injector; executed via SacredGlyphFrame stories'],
])

// ---- collect barrel VALUE exports ----
const barrelSource = readFileSync(`${ROOT}/src/index.ts`, 'utf8')
const exportNames = new Set<string>()
for (const match of barrelSource.matchAll(/export\s*\{([^}]+)\}\s*from/g)) {
  for (let name of match[1].split(',')) {
    name = name.trim()
    if (!name || name.startsWith('type ')) continue
    name = name.replace(/^default as\s+/, '')
    // `X as Y` re-export: the public name is Y
    const aliased = name.match(/^\w+\s+as\s+(\w+)$/)
    exportNames.add(aliased ? aliased[1] : name)
  }
}
// `export * as Icons` — covered as a namespace by the AllIcons showcase story.
const namespaceExports = [...barrelSource.matchAll(/export \* as (\w+)/g)].map(m => m[1])

// Pure-type names slip through `export {}` lists when declared without the
// `type` keyword upstream; filter to names that are values in the source file.
// Heuristic: a name is type-only if every declaration site is interface/type.
function isTypeOnly(name: string): boolean {
  // cheap: types in this codebase end in Props/Styles/Config/Options/... AND
  // are declared as interface/type. Verify by grepping declarations.
  const pattern = new RegExp(`(export\\s+)?(interface|type)\\s+${name}\\b`)
  const valuePattern = new RegExp(
    `(const|function|class)\\s+${name}\\b|const ${name}\\s*[:=]`
  )
  let sawType = false
  let sawValue = false
  for (const file of sourceFiles) {
    const text = fileText.get(file)!
    if (pattern.test(text)) sawType = true
    if (valuePattern.test(text)) sawValue = true
  }
  return sawType && !sawValue
}

// ---- read all source + story files once ----
function walk(dir: string, acc: string[] = []): string[] {
  if (!existsSync(dir)) return acc
  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules' || entry === 'dist' || entry.startsWith('.') || entry === 'storybook-static') continue
    const full = `${dir}/${entry}`
    if (statSync(full).isDirectory()) walk(full, acc)
    else if (/\.(tsx|ts)$/.test(entry)) acc.push(full)
  }
  return acc
}
const sourceFiles = walk(`${ROOT}/src`)
const fileText = new Map(sourceFiles.map(file => [file, readFileSync(file, 'utf8')]))
const storyFiles = sourceFiles.filter(file => file.endsWith('.stories.tsx'))

// ---- coverage check ----
const uncovered: string[] = []
const staleAllowlist: string[] = []
for (const name of [...exportNames].sort()) {
  if (isTypeOnly(name)) continue
  const covered = storyFiles.some(story => {
    const text = fileText.get(story)!
    return new RegExp(`<${name}[\\s/>]`).test(text) || new RegExp(`\\b${name}\\b`).test(text)
  })
  if (allowlist.has(name)) {
    if (covered) staleAllowlist.push(name)
    continue
  }
  if (!covered) uncovered.push(name)
}

// ---- duplicate meta titles ----
const titleOwners = new Map<string, string[]>()
for (const story of storyFiles) {
  const titleMatch = fileText.get(story)!.match(/title:\s*['"`]([^'"`]+)['"`]/)
  if (!titleMatch) continue
  const owners = titleOwners.get(titleMatch[1]) || []
  owners.push(story.replace(`${ROOT}/`, ''))
  titleOwners.set(titleMatch[1], owners)
}
const duplicateTitles = [...titleOwners.entries()].filter(([, owners]) => owners.length > 1)

// ---- report ----
let failed = false
if (uncovered.length) {
  failed = true
  console.error(`story-coverage: ${uncovered.length} barrel export(s) with no story:\n  ${uncovered.join('\n  ')}`)
}
if (staleAllowlist.length) {
  failed = true
  console.error(`story-coverage: stale allowlist entries (now covered — remove them): ${staleAllowlist.join(', ')}`)
}
if (duplicateTitles.length) {
  failed = true
  for (const [title, owners] of duplicateTitles)
    console.error(`story-coverage: duplicate meta title "${title}" in:\n  ${owners.join('\n  ')}`)
}
if (failed) process.exit(1)
console.log(
  `story-coverage: OK — ${exportNames.size} barrel exports checked (${allowlist.size} allowlisted, namespaces: ${namespaceExports.join(', ') || 'none'}), ${storyFiles.length} story files, no duplicate titles.`
)
