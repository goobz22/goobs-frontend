#!/usr/bin/env bun
/**
 * test-impact-map.ts — given changed goobs file(s), print WHICH stories + consumers + gates cover them.
 *
 * The GROUNDING tool for the dev-loop contract. goobs has NO unit tests — its safety net is
 * Storybook stories (the per-component spec) + Chromatic visual regression + tsc + eslint + stylelint.
 * So here the "failing-test-first" unit is a STORY that exercises the new state/variant, plus the
 * Chromatic visual baseline. The TDAD rule still holds: surface the EXACT impacted stories + consumers
 * + gates rather than reciting "do TDD"; a component with NO story is the GAP — write the story first.
 *
 * Self-contained: resolves paths relative to itself, no external deps. Run from the repo root:
 *   bun scripts/test-impact-map.ts src/components/Button/Button.tsx
 *   bun scripts/test-impact-map.ts --changed
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const HERE = path.dirname(fileURLToPath(import.meta.url)).replace(/\\/g, '/')
const ROOT = HERE.endsWith('/scripts') ? HERE.slice(0, -('/scripts'.length)) : process.cwd().replace(/\\/g, '/')
const SRC = `${ROOT}/src`

function run(cmd: string): string { try { return execSync(cmd, { cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'] }).toString() } catch { return '' } }

// ---- changed files ----
const argv = process.argv.slice(2)
let files: string[] = argv.includes('--changed')
  ? [...new Set((run('git diff --name-only HEAD') + '\n' + run('git diff --name-only --cached')).split('\n').map(s => s.trim()).filter(Boolean))]
  : argv.filter(a => !a.startsWith('--'))
files = files.filter(f => /\.(tsx|ts|css)$/.test(f))

// ---- read all source files once (one focused component lib — cheap) ----
function walk(dir: string, acc: string[] = []): string[] {
  if (!existsSync(dir)) return acc
  for (const e of readdirSync(dir)) {
    if (e === 'node_modules' || e === 'dist' || e.startsWith('.') || e === 'storybook-static') continue
    const p = `${dir}/${e}`
    if (statSync(p).isDirectory()) walk(p, acc)
    else if (/\.(tsx|ts|css)$/.test(e)) acc.push(p)
  }
  return acc
}
const sources = walk(SRC).map(p => ({ rel: p.replace(ROOT + '/', ''), text: readFileSync(p, 'utf8') }))
const allStories = sources.filter(s => s.rel.endsWith('.stories.tsx'))

// component name + dir from a path under src/components/<X>/...
function componentOf(rel: string): { name: string; dir: string } | null {
  const m = rel.match(/src\/components\/([^/]+)\//)
  return m && m[1] ? { name: m[1], dir: `src/components/${m[1]}` } : null
}

function coverage(rel: string): { story: string[]; consumers: string[]; isStory: boolean } {
  if (rel.endsWith('.stories.tsx')) return { story: [], consumers: [], isStory: true }
  const comp = componentOf(rel)
  const story = new Set<string>(), consumers = new Set<string>()
  if (comp) {
    // same-dir story (the component's own spec)
    for (const s of allStories) if (s.rel.startsWith(comp.dir + '/')) story.add(s.rel)
    // consumers: other source files that import this component by path or barrel name
    const pathHit = `components/${comp.name}`
    for (const s of sources) {
      if (s.rel.startsWith(comp.dir + '/')) continue
      const nameHit = /\.(tsx|ts)$/.test(s.rel) && new RegExp(`\\b${comp.name}\\b`).test(s.text) && /\b(import|from)\b/.test(s.text)
      if (s.text.includes(pathHit) || nameHit) {
        ;(s.rel.endsWith('.stories.tsx') ? story : consumers).add(s.rel)
      }
    }
  }
  return { story: [...story], consumers: [...consumers], isStory: false }
}

function gatesFor(rel: string): string[] {
  const g = ['typecheck: `bun run typecheck` (tsc --noEmit)', 'lint: `bun run lint` (eslint)']
  if (/\.css$/.test(rel)) g.push('stylelint: `bunx stylelint "src/**/*.css"` (CSS-module rules)')
  g.push('build: `bun run build` (tsc --noEmit && vite build — ThothOS consumes the built dist/)')
  g.push('visual: Storybook story + **Chromatic** snapshot (the visual-regression gate)')
  return g
}

if (!files.length) { console.log('no changed files (use: <file> ... | --changed)'); process.exit(0) }
console.log(`# TEST-IMPACT MAP (goobs) — ${files.length} changed file(s)\n`)
let anyComponent = false
for (const f of files) {
  const rel = f.replace(/\\/g, '/').replace(ROOT + '/', '')
  const { story, consumers, isStory } = coverage(rel)
  if (isStory) { console.log(`## ${rel}  [a story — it IS the spec/visual coverage]\n`); continue }
  anyComponent = true
  const comp = componentOf(rel)
  console.log(`## ${rel}${comp ? `  [component: ${comp.name}]` : ''}`)
  console.log(`   gates:     ${gatesFor(rel).join('\n              ')}`)
  console.log(`   story:     ${story.length ? story.join('\n              ') : '(none)'}`)
  console.log(`   consumers: ${consumers.length ? consumers.slice(0, 12).join('\n              ') + (consumers.length > 12 ? `\n              … +${consumers.length - 12} more` : '') : '(none)'}`)
  if (!story.length) console.log(`   ⚠ GAP: this component has NO story — write/extend the story FIRST to exercise the new state, then snapshot it (Chromatic).`)
  console.log('')
}

console.log(`# VERIFY — run these (show evidence):`)
console.log(`  bun run typecheck && bun run lint`)
console.log(`  bun run build                     # ThothOS picks up changes only after the dist/ rebuild`)
if (anyComponent) {
  console.log(`  # Visual: run the changed component's story + its consumers' stories and snapshot via Chromatic.`)
  console.log(`  # Local visual-review render path (flaky Chrome on this box): launch a SEPARATE headless Chrome`)
  console.log(`  #   chrome.exe --headless=new --remote-debugging-port=9333 --user-data-dir=<temp>, connect via`)
  console.log(`  #   claude --chrome / raw CDP → open the story iframe → screenshot. (Detail: .claude/rules/goobs.md)`)
}
console.log(`\n  ⚠ goobs has NO unit tests — the STORY (+ Chromatic baseline) is the regression test. A new`)
console.log(`    state/variant/bug-fix MUST be exercised by a story that visibly fails the old baseline.`)
