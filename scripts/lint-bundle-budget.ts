#!/usr/bin/env bun
/**
 * lint-bundle-budget — bundle-size regression gate (run AFTER `bun run build`;
 * wired into prepublishOnly). Every consumer pays these bytes on install and
 * first paint; a silent 30% jump from an accidental barrel import of a heavy
 * dep is exactly the class this catches. Budgets = baseline + ~10% headroom;
 * raising one is a DELIBERATE commit to this file with a reason, never a lint
 * tweak to get green.
 *
 * TWO CHECKS, because the size budget alone measures a PROXY. A total-bytes
 * budget can be green while the property it exists to protect is false: a
 * heavy dependency can be statically imported into the eagerly-evaluated entry
 * chunk and still fit under the ceiling, and it will keep fitting until some
 * unrelated growth finally pushes it over — at which point the size number
 * blames the wrong commit. So the second check measures the property directly:
 * heavy payloads must not appear in the entry chunk AT ALL.
 *
 * The class is real and was measured, not imagined. `import hljs from
 * 'highlight.js'` in CodeCopy put ~872 KB of grammars into the entry chunk,
 * where it was reached by every consumer route that touched the barrel — in
 * ThothOS, every single route, an app that renders zero code blocks. The size
 * budget never fired: the bundle sat at 90.0% of its ceiling, comfortably
 * "clean", for the entire time the defect existed.
 *
 * Run `bun scripts/lint-bundle-budget.ts --selftest` to prove the marker check
 * can actually fail (planted defect) and does not cry wolf (clean input).
 */
import { readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = join(import.meta.dir, '..')

/** path -> max bytes (baseline noted alongside). */
const BUDGETS: Record<string, { max: number; baseline: string }> = {
  // Baseline 2026-08-16: 1.32 MB, down from 2.65 MB when highlight.js stopped
  // being statically imported by CodeCopy (see EAGER_PAYLOADS below). The
  // ceiling was lowered with it — leaving the old 2.95 MB ceiling in place
  // would have silently re-admitted the exact regression that was just fixed.
  'dist/goobs-frontend.es.js': { max: 1_450_000, baseline: '1.32 MB' },
  // UMD is a single-file format: it CANNOT code-split, so rolldown inlines
  // every dynamic import back into this one file. It therefore carries both
  // the per-grammar chunks and the full-bundle fallback, and grew 2.69 -> 2.84
  // MB in the same change that halved the ESM entry. That is the deliberate
  // trade: the modern ESM path (what every real consumer resolves) drops
  // ~1.34 MB, the legacy single-file path pays ~144 KB of duplication.
  'dist/goobs-frontend.umd.js': { max: 2_990_000, baseline: '2.84 MB' },
  'dist/goobs-frontend.css': { max: 490_000, baseline: '443 KB' },
}

/**
 * Entry chunks whose module body runs as soon as a consumer imports the
 * barrel. Anything reachable from module scope here is paid on every route.
 */
const EAGER_ENTRIES = ['dist/goobs-frontend.es.js']

/**
 * Heavy dependencies that MUST stay behind a dynamic `import()`, keyed by a
 * marker string that appears only inside the dependency's own payload.
 *
 * Marker choice matters: it must be internal to the dep, never the module
 * specifier. `'html2canvas'` as a marker would match the `import('html2canvas')
 * ` specifier that the correct, code-split version leaves behind — a detector
 * that reds on the fix is worse than no detector.
 */
const EAGER_PAYLOADS: { marker: string; dep: string; loadedBy: string }[] = [
  {
    marker: 'hljs-',
    dep: 'highlight.js',
    loadedBy: 'src/components/CodeCopy/highlighter.ts',
  },
  {
    marker: 'jsPDF',
    dep: 'jspdf',
    loadedBy: 'src/components/DataGrid/index.tsx (exportToPDF)',
  },
  {
    marker: 'data-html2canvas',
    dep: 'html2canvas',
    loadedBy: 'src/components/DataGrid/index.tsx (exportToPDF)',
  },
]

/** One eager-payload finding: which dep leaked into which entry chunk. */
type PayloadFinding = { entry: string; dep: string; marker: string }

/**
 * Scans one entry chunk's source for heavy-dependency payload markers.
 *
 * Kept pure and separate from the filesystem so `--selftest` can plant a
 * defect in the INPUT rather than hand-feed a verdict — a planted-defect test
 * that stubs the result only proves the comparison operator works.
 *
 * @param entry Display name of the chunk being scanned.
 * @param source Full text of the built chunk.
 * @returns One finding per heavy dependency found inline in the chunk.
 */
export function findEagerPayloads(
  entry: string,
  source: string
): PayloadFinding[] {
  return EAGER_PAYLOADS.filter(({ marker }) => source.includes(marker)).map(
    ({ marker, dep }) => ({ entry, dep, marker })
  )
}

if (process.argv.includes('--selftest')) {
  const failures: string[] = []

  // Direction 1 — it can fail. A chunk carrying a highlight.js payload must be
  // reported, or the gate is decorative.
  const planted = findEagerPayloads(
    'planted.js',
    'const o={classPrefix:"hljs-",languages:{}};export default o'
  )
  if (planted.length !== 1 || planted[0]?.dep !== 'highlight.js') {
    failures.push(
      `planted highlight.js payload was not detected (got ${JSON.stringify(planted)})`
    )
  }

  // Direction 2 — it does not cry wolf. The CORRECT, code-split form leaves a
  // bare `import('html2canvas')` specifier in the entry chunk; reporting that
  // would red the very shape this gate is asking for.
  const clean = findEagerPayloads(
    'clean.js',
    'const load=()=>import("html2canvas");const p=()=>import("jspdf");'
  )
  if (clean.length !== 0) {
    failures.push(
      `clean code-split input produced findings (got ${JSON.stringify(clean)})`
    )
  }

  if (failures.length > 0) {
    for (const f of failures) console.error(`✗ ${f}`)
    console.error('\nlint-bundle-budget --selftest FAILED')
    process.exit(1)
  }
  console.log(
    'lint-bundle-budget --selftest clean (planted defect reds, clean input passes)'
  )
  process.exit(0)
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

// Print the denominator so "0 findings" cannot be confused with "0 examined".
console.log(
  `  eager-payload scan: ${EAGER_PAYLOADS.length} heavy dep(s) × ${EAGER_ENTRIES.length} entry chunk(s)`
)
for (const rel of EAGER_ENTRIES) {
  let source: string
  try {
    source = readFileSync(join(ROOT, rel), 'utf8')
  } catch {
    console.error(`✗ ${rel} missing — run \`bun run build\` first`)
    failed = true
    continue
  }
  for (const { dep, marker } of findEagerPayloads(rel, source)) {
    const loadedBy =
      EAGER_PAYLOADS.find(p => p.dep === dep)?.loadedBy ?? 'unknown'
    console.error(
      `✗ ${rel} inlines ${dep} (marker ${JSON.stringify(marker)}) at module-eval scope. ` +
        `Every consumer route pays those bytes whether or not it renders the component. ` +
        `Load it with a dynamic import() instead — see ${loadedBy}.`
    )
    failed = true
  }
}

if (failed) {
  console.error('\nlint-bundle-budget FAILED')
  process.exit(1)
}
console.log('lint-bundle-budget clean')
