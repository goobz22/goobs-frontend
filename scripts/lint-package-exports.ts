#!/usr/bin/env bun
/**
 * lint-package-exports — npm package-integrity gate (run AFTER `bun run build`;
 * wired into prepublishOnly, not lint:all, because it verifies dist/).
 *
 * A library's package.json is a CONTRACT: every path in `exports`/`main`/
 * `module`/`types` must exist in the tarball or consumers fail at install/
 * import time with errors CI here never sees (the enterprise publint/ATTW
 * category, dependency-free version). Also asserts the peer-dependency and
 * sideEffects declarations that keep consumers' bundlers correct.
 *
 * Usage: bun scripts/lint-package-exports.ts   (exit 1 on any failure)
 */
import { existsSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = join(import.meta.dir, '..')
const pkg = (await import(join(ROOT, 'package.json'))) as Record<string, unknown>

const failures: string[] = []
const checkPath = (label: string, rel: unknown) => {
  if (typeof rel !== 'string') return
  if (!existsSync(join(ROOT, rel))) failures.push(`${label} -> ${rel} does not exist`)
}

function walkExports(node: unknown, trail: string) {
  if (typeof node === 'string') return checkPath(`exports${trail}`, node)
  if (node && typeof node === 'object')
    for (const [key, value] of Object.entries(node))
      walkExports(value, `${trail}.${key}`)
}

checkPath('main', pkg.main)
checkPath('module', pkg.module)
checkPath('types', pkg.types)
walkExports(pkg.exports, '')

// Peer contract: a React library MUST declare react/react-dom as peers —
// shipping them as deps double-bundles React and crashes consumers' hooks.
const peers = (pkg.peerDependencies ?? {}) as Record<string, string>
for (const name of ['react', 'react-dom'])
  if (!peers[name]) failures.push(`peerDependencies missing '${name}'`)
const deps = (pkg.dependencies ?? {}) as Record<string, string>
for (const name of ['react', 'react-dom', 'next'])
  if (deps[name])
    failures.push(`'${name}' must be a peerDependency, not a dependency`)

// Tree-shaking contract: sideEffects must stay declared (CSS-only).
if (!Array.isArray(pkg.sideEffects))
  failures.push('sideEffects array declaration missing (tree-shaking contract)')

if (failures.length) {
  for (const f of failures) console.error(`✗ ${f}`)
  console.error(`\nlint-package-exports FAILED — ${failures.length} problem(s)`)
  process.exit(1)
}
console.log('lint-package-exports clean — exports map, peers, sideEffects all verified')
