import { readdirSync, statSync, readFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import ts from 'typescript'

const ROOT = process.cwd()
function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) walk(full, out)
    else out.push(full)
  }
  return out
}
const files = walk(join(ROOT, 'src'))
  .map((p) => relative(ROOT, p).split('\\').join('/'))
  .filter(
    (p) =>
      /\.(ts|tsx)$/.test(p) && !p.endsWith('.d.ts') && !/\.stories\.(ts|tsx)$/.test(p)
  )

// GROUND TRUTH: the real TypeScript scanner. Identifiers in comments/strings can
// never be mistaken for code, unlike a hand-rolled quote walker.
function codeIdentifiers(text: string): string[] {
  const scanner = ts.createScanner(
    ts.ScriptTarget.Latest,
    true,
    ts.LanguageVariant.JSX,
    text
  )
  const identifiers: string[] = []
  let kind = scanner.scan()
  while (kind !== ts.SyntaxKind.EndOfFileToken) {
    if (kind === ts.SyntaxKind.Identifier) identifiers.push(scanner.getTokenText())
    kind = scanner.scan()
  }
  return identifiers
}

interface Group {
  stateHooks: number
  emitRaw: boolean
  emitCode: boolean
  fieldRawAtIndex: boolean
  fieldCodeAtIndex: boolean
  hasIndex: boolean
}
const groups = new Map<string, Group>()
for (const path of files) {
  const match = /^src\/components\/([^/]+)\//.exec(path)
  if (!match) continue
  const name = match[1]
  const group: Group = groups.get(name) ?? {
    stateHooks: 0,
    emitRaw: false,
    emitCode: false,
    fieldRawAtIndex: false,
    fieldCodeAtIndex: false,
    hasIndex: false,
  }
  const text = readFileSync(join(ROOT, path), 'utf8')
  const identifiers = codeIdentifiers(text)
  group.stateHooks += identifiers.filter(
    (id) => id === 'useState' || id === 'useReducer'
  ).length
  if (/\bemitDiag\b/.test(text)) group.emitRaw = true
  if (identifiers.includes('emitDiag')) group.emitCode = true
  if (path === `src/components/${name}/index.tsx`) {
    group.hasIndex = true
    if (/data-field-name/.test(text)) group.fieldRawAtIndex = true
    const stripped = text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '')
    if (/data-field-name/.test(stripped)) group.fieldCodeAtIndex = true
  }
  groups.set(name, group)
}

console.log('--- components with >=4 real state hooks OR any emitDiag mention ---')
console.log(
  'name'.padEnd(24) + 'hooks  index  emitRAW emitCODE fieldRAW fieldCODE'
)
for (const [name, group] of [...groups.entries()].sort(
  (a, b) => b[1].stateHooks - a[1].stateHooks
)) {
  if (group.stateHooks < 4 && !group.emitRaw) continue
  console.log(
    name.padEnd(24) +
      String(group.stateHooks).padStart(5) +
      String(group.hasIndex).padStart(7) +
      String(group.emitRaw).padStart(9) +
      String(group.emitCode).padStart(9) +
      String(group.fieldRawAtIndex).padStart(9) +
      String(group.fieldCodeAtIndex).padStart(10)
  )
}

console.log('\n--- DIVERGENCE: token appears in a COMMENT/STRING but not in CODE ---')
let divergences = 0
for (const [name, group] of groups) {
  if (group.emitRaw !== group.emitCode) {
    divergences++
    console.log(
      `  ${name}: emitDiag RAW=${group.emitRaw} CODE=${group.emitCode} <-- comment-only mention`
    )
  }
  if (group.fieldRawAtIndex !== group.fieldCodeAtIndex) {
    divergences++
    console.log(
      `  ${name}: data-field-name RAW=${group.fieldRawAtIndex} CODE=${group.fieldCodeAtIndex}`
    )
  }
}
if (divergences === 0) console.log('  (none)')

console.log('\n--- component dirs with NO index.tsx anchor (invisible to the ratchet) ---')
for (const [name, group] of groups)
  if (!group.hasIndex)
    console.log(`  ${name}: ${group.stateHooks} state hooks, emitCode=${group.emitCode}`)

console.log('\n--- GROUND-TRUTH would-flag set (index + >=4 hooks + no emitDiag + not field) ---')
for (const [name, group] of groups)
  if (
    group.hasIndex &&
    group.stateHooks >= 4 &&
    !group.emitCode &&
    !group.fieldCodeAtIndex
  )
    console.log(`  ${name} (${group.stateHooks} hooks)`)
