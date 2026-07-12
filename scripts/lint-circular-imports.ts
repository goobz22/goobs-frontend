#!/usr/bin/env bun
/**
 * lint-circular-imports — enterprise library-hygiene gate.
 *
 * A circular import chain (A → B → … → A) makes module init order fragile:
 * one of the modules observes a partially-initialized namespace (undefined
 * class extends, TDZ crashes that only appear in certain entry orders), and
 * bundlers silently pick an order that can change between builds. Component
 * libraries gate this because consumers hit the breakage, not the library CI.
 *
 * Scope: static relative imports between first-party modules under src/
 * (`import … from './x'` / `../y` and `export … from`). Bare-specifier
 * (node_modules) imports are irrelevant to init order here. Type-only imports
 * (`import type`) are ERASED at runtime and cannot create an init cycle —
 * skipped. CSS imports are side-effect-only leaves — skipped.
 *
 * Usage:  bun scripts/lint-circular-imports.ts [--selftest]
 * Exit 1 when any cycle exists (each printed once, smallest-entry rotation).
 */
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs'
import { join, relative, posix } from 'node:path'

const ROOT = join(import.meta.dir, '..')
const SRC = join(ROOT, 'src')

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) walk(full, out)
    else out.push(full)
  }
  return out
}

const IMPORT_RE =
  /(?:^|\n)\s*(?:import|export)\s+(?!type[\s{])[^'"\n]*?from\s*['"](\.[^'"]+)['"]/g

/** Resolve a relative specifier to a repo-relative module path, or null. */
function resolveSpecifier(fromFile: string, spec: string): string | null {
  if (spec.endsWith('.css')) return null
  const base = posix.normalize(
    posix.join(posix.dirname(fromFile.replace(/\\/g, '/')), spec)
  )
  const candidates = [
    base,
    `${base}.ts`,
    `${base}.tsx`,
    `${base}/index.ts`,
    `${base}/index.tsx`,
  ]
  for (const candidate of candidates) {
    const abs = join(ROOT, candidate)
    if (existsSync(abs) && statSync(abs).isFile()) return candidate
  }
  return null
}

function buildGraph(
  files: { path: string; text: string }[]
): Map<string, string[]> {
  const graph = new Map<string, string[]>()
  for (const { path, text } of files) {
    const edges: string[] = []
    IMPORT_RE.lastIndex = 0
    let m: RegExpExecArray | null
    while ((m = IMPORT_RE.exec(text))) {
      const target = resolveSpecifier(path, m[1]!)
      if (target && target !== path) edges.push(target)
    }
    graph.set(path, edges)
  }
  return graph
}

/** Every elementary cycle, deduped by smallest-node rotation (DFS back-edges). */
function findCycles(graph: Map<string, string[]>): string[][] {
  const cycles = new Map<string, string[]>()
  const state = new Map<string, 0 | 1 | 2>() // 0 unvisited, 1 on-stack, 2 done
  const stack: string[] = []

  function dfs(node: string) {
    state.set(node, 1)
    stack.push(node)
    for (const next of graph.get(node) ?? []) {
      const s = state.get(next) ?? 0
      if (s === 1) {
        const start = stack.indexOf(next)
        const cycle = stack.slice(start)
        const minIdx = cycle.indexOf([...cycle].sort()[0]!)
        const rotated = [...cycle.slice(minIdx), ...cycle.slice(0, minIdx)]
        cycles.set(rotated.join(' -> '), rotated)
      } else if (s === 0) {
        dfs(next)
      }
    }
    stack.pop()
    state.set(node, 2)
  }

  for (const node of graph.keys()) if ((state.get(node) ?? 0) === 0) dfs(node)
  return [...cycles.values()]
}

function selftest(): void {
  const fixture = [
    { path: 'src/a.ts', text: "import { b } from './b'" },
    { path: 'src/b.ts', text: "import { a } from './a'" },
  ]
  // The fixture files don't exist on disk, so resolveSpecifier can't be used;
  // selftest exercises findCycles directly on a hand-built graph.
  const cyclic = findCycles(
    new Map([
      ['src/a.ts', ['src/b.ts']],
      ['src/b.ts', ['src/a.ts']],
    ])
  )
  const acyclic = findCycles(
    new Map([
      ['src/a.ts', ['src/b.ts']],
      ['src/b.ts', []],
    ])
  )
  const typeOnlySkipped = !IMPORT_RE.test("import type { X } from './x'\n")
  IMPORT_RE.lastIndex = 0
  const valueMatched = IMPORT_RE.test(fixture[0]!.text)
  IMPORT_RE.lastIndex = 0
  if (cyclic.length !== 1 || acyclic.length !== 0 || !typeOnlySkipped || !valueMatched) {
    console.error('✗ lint-circular-imports selftest FAILED', {
      cyclic: cyclic.length,
      acyclic: acyclic.length,
      typeOnlySkipped,
      valueMatched,
    })
    process.exit(1)
  }
  console.log('lint-circular-imports selftest OK')
}

selftest()
if (process.argv.includes('--selftest')) process.exit(0)

const files = walk(SRC)
  .filter((p) => /\.(ts|tsx)$/.test(p) && !p.endsWith('.d.ts'))
  .map((p) => ({
    path: relative(ROOT, p).replace(/\\/g, '/'),
    text: readFileSync(p, 'utf8'),
  }))

const cycles = findCycles(buildGraph(files))
if (cycles.length) {
  for (const cycle of cycles)
    console.log(`CYCLE: ${cycle.join(' -> ')} -> ${cycle[0]}`)
  console.error(`\nlint-circular-imports FAILED — ${cycles.length} cycle(s)`)
  process.exit(1)
}
console.log(`lint-circular-imports clean — ${files.length} modules, 0 cycles`)
