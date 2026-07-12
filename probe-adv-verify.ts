import { readdirSync, readFileSync, statSync } from 'node:fs'
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
const all = walk(join(ROOT, 'src'))
const rel = (p: string) => relative(ROOT, p).split('\\').join('/')
const inScope = all
  .filter((p) => p.endsWith('.module.css') || /[\\/]styles[\\/][^\\/]+\.css$/.test(p))
  .map(rel)
const allCss = all.filter((p) => p.endsWith('.css')).map(rel)

console.log('css files total:', allCss.length, '| in drift scope:', inScope.length)
const outOfScope = allCss.filter((f) => !inScope.includes(f))
console.log('CSS OUT OF SCOPE (the ratchet can never see these):', outOfScope.length)
for (const f of outOfScope) console.log('    ', f)

const shorthand: string[] = []
const upper: string[] = []
const degenerate: string[] = []
const oddQuote: string[] = []
const slashStarInUrl: string[] = []
const perFile: Record<string, number> = {}
let indep = 0

for (const f of inScope) {
  const raw = readFileSync(join(ROOT, f), 'utf8')
  // Independent comment strip: non-greedy regex (different algorithm than the lint's walker)
  const stripped = raw.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '))

  const re = /(?<![\w-])font-size\s*:\s*(-?[\d.]+px)/g
  let m: RegExpExecArray | null
  while ((m = re.exec(stripped))) {
    indep++
    perFile[f] = (perFile[f] ?? 0) + 1
  }

  // ESCAPE HATCH 1: the `font:` shorthand carrying a px size
  const sh = /(?<![\w-])font\s*:\s*[^;}]*?\d+px/gi
  let s: RegExpExecArray | null
  while ((s = sh.exec(stripped))) shorthand.push(f + ' :: ' + s[0].trim())

  // ESCAPE HATCH 2: case variants (the lint's regex has no /i flag)
  const up = /(?<![\w-])(FONT-SIZE|Font-Size|font-Size)\s*:|[\d.]+(PX|Px|pX)\b/g
  let u: RegExpExecArray | null
  while ((u = up.exec(stripped))) upper.push(f + ' :: ' + u[0])

  // Walker hazards
  if (/\/\*\//.test(raw)) degenerate.push(f)
  const dq = (raw.match(/"/g) ?? []).length
  const sq = (raw.match(/'/g) ?? []).length
  if (dq % 2 || sq % 2) oddQuote.push(f + ' (doubleQuotes=' + dq + ' singleQuotes=' + sq + ')')
  if (/url\([^)"']*\/\*/.test(raw)) slashStarInUrl.push(f)
}

console.log('\nINDEPENDENT bare-px font-size count:', indep)
const baseline = JSON.parse(
  readFileSync('scripts/drift-lints/baselines/css-px-font-size.json', 'utf8')
) as Record<string, number>
const baseSum = Object.values(baseline).reduce((a, b) => a + b, 0)
console.log(
  'baseline sum:',
  baseSum,
  '| baseline files:',
  Object.keys(baseline).length,
  '| independent files:',
  Object.keys(perFile).length
)
for (const key of new Set([...Object.keys(baseline), ...Object.keys(perFile)])) {
  if ((baseline[key] ?? 0) !== (perFile[key] ?? 0))
    console.log('  MISMATCH', key, 'baseline=', baseline[key] ?? 0, 'independent=', perFile[key] ?? 0)
}

console.log('\nESCAPE HATCH — `font:` shorthand with px (lint MISSES):', shorthand.length)
shorthand.forEach((x) => console.log('    ', x))
console.log('ESCAPE HATCH — case variants (lint has no /i):', upper.length)
upper.slice(0, 12).forEach((x) => console.log('    ', x))
console.log('WALKER HAZARD — degenerate /*/ opener:', degenerate.length, degenerate)
console.log('WALKER HAZARD — odd quote count (string mode runaway):', oddQuote.length)
oddQuote.forEach((x) => console.log('    ', x))
console.log('WALKER HAZARD — /* inside unquoted url():', slashStarInUrl.length, slashStarInUrl)
