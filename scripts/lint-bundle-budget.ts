#!/usr/bin/env bun
/**
 * lint-bundle-budget — bundle-size regression gate (run AFTER `bun run build`;
 * wired into prepublishOnly). Every consumer pays these bytes on install and
 * first paint; a silent 30% jump from an accidental barrel import of a heavy
 * dep is exactly the class this catches. Budgets = baseline (2026-07-12,
 * v0.201.0 post-a11y-campaign) + ~10% headroom; raising one is a DELIBERATE
 * commit to this file with a reason, never a lint tweak to get green.
 */
import { statSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = join(import.meta.dir, '..')

/** path -> max bytes (baseline noted alongside). */
const BUDGETS: Record<string, { max: number; baseline: string }> = {
  'dist/goobs-frontend.es.js': { max: 2_950_000, baseline: '2.65 MB' },
  'dist/goobs-frontend.umd.js': { max: 2_990_000, baseline: '2.69 MB' },
  'dist/goobs-frontend.css': { max: 490_000, baseline: '443 KB' },
}

let failed = false
for (const [rel, { max, baseline }] of Object.entries(BUDGETS)) {
  let size: number
  try {
    size = statSync(join(ROOT, rel)).size
  } catch {
    console.error(`✗ ${rel} missing — run \`bun run build\` first`)
    failed = true
    continue
  }
  const pct = ((size / max) * 100).toFixed(1)
  if (size > max) {
    console.error(
      `✗ ${rel} is ${size.toLocaleString()} B — over its ${max.toLocaleString()} B budget (baseline ${baseline}). ` +
        'Investigate what grew (new dep? un-code-split import?) before raising the budget here with a reason.'
    )
    failed = true
  } else {
    console.log(`  ${rel} ${size.toLocaleString()} B (${pct}% of budget)`)
  }
}
if (failed) {
  console.error('\nlint-bundle-budget FAILED')
  process.exit(1)
}
console.log('lint-bundle-budget clean')
