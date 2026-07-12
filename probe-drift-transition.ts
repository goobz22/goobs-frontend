import lint from './scripts/drift-lints/transition-all'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

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
  .filter((p) => p.endsWith('.module.css') || /[\\/]styles[\\/][^\\/]+\.css$/.test(p))
  .map((p) => ({
    path: relative(ROOT, p).split('\\').join('/'),
    text: readFileSync(p, 'utf8'),
  }))

const measured = lint.measure(files)
const baseline = JSON.parse(
  readFileSync('scripts/drift-lints/baselines/transition-all.json', 'utf8')
) as Record<string, number>

// GROUND TRUTH: naive raw regex WITHOUT comment-blanking -> reveals comment-borne matches
const RAW =
  /(--[a-z0-9-]*transition[a-z0-9-]*|transition-property|transition)\s*:\s*all\b/gi
const rawCounts: Record<string, number> = {}
for (const f of files) {
  const n = (f.text.match(RAW) || []).length
  if (n) rawCounts[f.path] = n
}
const mCounts: Record<string, number> = {}
for (const inst of measured) mCounts[inst.file] = (mCounts[inst.file] ?? 0) + 1

console.log('file | baseline | measured | raw(no comment-blank)')
const allFiles = new Set([
  ...Object.keys(baseline),
  ...Object.keys(mCounts),
  ...Object.keys(rawCounts),
])
for (const f of [...allFiles].sort()) {
  const b = baseline[f] ?? 0
  const m = mCounts[f] ?? 0
  const r = rawCounts[f] ?? 0
  let flag = ''
  if (b !== m) flag = '   <<<< BASELINE != MEASURED'
  else if (r !== m) flag = `   (comments blanked: ${r - m})`
  console.log(`${f} | ${b} | ${m} | ${r}${flag}`)
}
const total = Object.values(baseline).reduce((a, b) => a + b, 0)
console.log(`\ntotals: baseline=${total} measured=${measured.length}`)

// What the lint deliberately does NOT count: token USAGES that resolve to `all`
let usages = 0
const usageFiles = new Set<string>()
for (const f of files) {
  const u = f.text.match(/transition[a-z-]*\s*:\s*var\(\s*--[a-z0-9-]*transition/gi)
  if (u) {
    usages += u.length
    usageFiles.add(f.path)
  }
}
console.log(`token USAGES (uncounted by design): ${usages} across ${usageFiles.size} files`)
