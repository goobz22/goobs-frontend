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
const files = walk(join(ROOT, 'src')).filter(
  (p) => p.endsWith('.module.css') || /[\\/]styles[\\/][^\\/]+\.css$/.test(p)
)
const DECL =
  /(--[a-z0-9-]*transition[a-z0-9-]*|transition-property|transition)\s*:\s*all\b/gi
const LOOSE =
  /(--[a-z0-9-]*transition[a-z0-9-]*|transition-property|transition)\s*:\s*([^;{}]*)/gi
const baseline = JSON.parse(
  readFileSync('scripts/drift-lints/baselines/transition-all.json', 'utf8')
) as Record<string, number>

let rawTotal = 0
for (const p of files) {
  const rel = relative(ROOT, p).replace(/\\/g, '/')
  const text = readFileSync(p, 'utf8')
  const raw = (text.match(DECL) ?? []).length
  rawTotal += raw
  const base = baseline[rel] ?? 0
  if (raw !== base) console.log(`DIFF raw=${raw} baseline=${base}  ${rel}`)
  LOOSE.lastIndex = 0
  let m: RegExpExecArray | null
  while ((m = LOOSE.exec(text))) {
    const val = m[2]
    if (/\ball\b/i.test(val) && !/^\s*all\b/i.test(val))
      console.log(`NON-LEADING all: ${rel} :: ${m[0].trim().slice(0, 90)}`)
  }
}
const baseTotal = Object.values(baseline).reduce((a, b) => a + b, 0)
console.log('raw(unblanked) total:', rawTotal, ' baseline total:', baseTotal)
