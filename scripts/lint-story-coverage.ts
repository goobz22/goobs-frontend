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
  // Hooks/utilities executed INSIDE component stories (audit §4.1 weak-indirect):
  ['useEscape', 'runs in every Dropdown/MultiSelect/Searchable* story (menu dismissal)'],
  ['useOptionalFormContext', 'runs in FieldShell on every field story render'],
  ['useTreeViewContext', 'runs on every TreeView story render (item context)'],
  ['getRequiredProps', 'FieldShell required-marker logic; every required-field story'],
  ['validateRequired', 'FieldShell required validation; exercised by Form stories'],
])
// NOT allowlisted on purpose: src/utils/formatters.ts (zero consumers, C3
// delete candidate — owner decided to KEEP). Its exports never reach the
// scanned barrel (src/index.ts): they are re-exported only by
// src/utils/index.ts, and the barrel never re-exports that module, so this
// script has nothing to check for them. (src/utils/index.ts itself DOES ship —
// Tabs imports its hex-only `alpha` (src/components/Tabs/index.tsx) and Tabs
// is barrel-exported — but shipping via an importer does not put formatters'
// names on the barrel.) If formatters ever gets barrel-exported, its names
// must gain stories or entries here.

// ---- collect barrel VALUE exports (with their source module for
// default-alias resolution: `default as CVVField from './Field/Number/CVV'`
// is covered by a story in that module's own directory rendering the
// default import under its local name) ----
const barrelSource = readFileSync(`${ROOT}/src/index.ts`, 'utf8')
const exportNames = new Set<string>()
const defaultAliasDir = new Map<string, string>()
for (const match of barrelSource.matchAll(/export\s*\{([^}]+)\}\s*from\s*['"]([^'"]+)['"]/g)) {
  const fromPath = match[2]
  for (let name of match[1].split(',')) {
    name = name.trim()
    if (!name || name.startsWith('type ')) continue
    const isDefaultAlias = /^default as\s+/.test(name)
    name = name.replace(/^default as\s+/, '')
    // `X as Y` re-export: the public name is Y
    const aliased = name.match(/^\w+\s+as\s+(\w+)$/)
    const publicName = aliased ? aliased[1] : name
    exportNames.add(publicName)
    if (isDefaultAlias) {
      const moduleDir = path
        .normalize(path.join(`${ROOT}/src`, fromPath.replace(/^\.\//, '')))
        .replace(/\\/g, '/')
      defaultAliasDir.set(publicName, moduleDir)
    }
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
// Compound subcomponents are exported flat (PanelHeader) but rendered dotted
// (<Panel.Header>) — accept the dotted form when the name splits into
// another exported name + a PascalCase remainder.
function dottedForms(name: string): string[] {
  const forms: string[] = []
  for (const parent of exportNames) {
    if (name !== parent && name.startsWith(parent) && /^[A-Z]/.test(name.slice(parent.length)))
      forms.push(`${parent}.${name.slice(parent.length)}`)
  }
  return forms
}
const uncovered: string[] = []
const staleAllowlist: string[] = []
for (const name of [...exportNames].sort()) {
  if (isTypeOnly(name)) continue
  const dotted = dottedForms(name)
  const aliasDir = defaultAliasDir.get(name)
  const covered = storyFiles.some(story => {
    const text = fileText.get(story)!
    if (new RegExp(`\\b${name}\\b`).test(text)) return true
    if (dotted.some(form => text.includes(`<${form}`))) return true
    // default-alias: a story inside the module's own directory renders the
    // default export under whatever local name it chose
    if (aliasDir && story.startsWith(`${aliasDir}/`)) return true
    return false
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
  // Meta titles are category paths ('Components/X'); requiring a slash keeps
  // demo-data `title:` fields (card headings etc.) from matching.
  const titleMatch = fileText
    .get(story)!
    .match(/title:\s*['"`]([^'"`]*\/[^'"`]+)['"`]/)
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
