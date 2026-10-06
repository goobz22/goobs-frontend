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
import { dirname, join, relative, resolve, sep } from 'node:path'
import { gzipSync } from 'node:zlib'
import ts from 'typescript'

const ROOT = join(import.meta.dir, '..')

/** path -> max bytes (baseline noted alongside). */
const BUDGETS: Record<string, { max: number; baseline: string }> = {
  // 0.302.4: 1,556,571 B (327 KB gzip). Replacing the bypassable HTML regex
  // with sanitize-html adds its HTML/CSS parsers and entity tables. This is
  // deliberately synchronous for matching SSR/browser output and preserves
  // editor formatting. Retain ~10% headroom over that measured security cost.
  // The eager-payload fence below still rejects the highlight.js regression.
  'dist/goobs-frontend.es.js': {
    max: 1_710_000,
    baseline: '1.56 MB (parser-based HTML sanitization)',
  },
  // UMD is a single-file format: it CANNOT code-split, so rolldown inlines
  // every dynamic import back into this one file. It therefore carries both
  // the per-grammar chunks and the full-bundle fallback, and grew 2.69 -> 2.84
  // MB in the same change that halved the ESM entry. That is the deliberate
  // trade: the modern ESM path (what every real consumer resolves) drops
  // ~1.34 MB, the legacy single-file path pays ~144 KB of duplication.
  // Same sanitizer cost in the single-file build: 3,027,979 B, ~10% headroom.
  'dist/goobs-frontend.umd.js': {
    max: 3_330_000,
    baseline: '3.03 MB (parser-based HTML sanitization)',
  },
  'dist/goobs-frontend.css': { max: 490_000, baseline: '443 KB' },
}

// W-1216: 0.302.3 measured 255,167 B at gzip level 9. Static siblings
// count toward initial transfer; every requested file has its own gzip stream.
export const EAGER_GZIP_BASELINE = 255_167
export const EAGER_GZIP_MAX = Math.floor(EAGER_GZIP_BASELINE * 1.1)

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
    marker: 'allowedSchemesAppliedToAttributes',
    dep: 'sanitize-html',
    loadedBy: 'src/components/ComplexTextEditor/utils/conversion.ts',
  },
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
  const findings = EAGER_PAYLOADS.filter(({ marker }) =>
    source.includes(marker)
  ).map(({ marker, dep }) => ({ entry, dep, marker }))
  const dependencies = [
    ...EAGER_PAYLOADS.map(payload => payload.dep),
    'entities',
  ]
  for (const specifier of staticSpecifiers(source)) {
    const dep = dependencies.find(
      name => specifier === name || specifier.startsWith(name + '/')
    )
    if (dep && !findings.some(finding => finding.dep === dep)) {
      findings.push({ entry, dep, marker: `static import ${specifier}` })
    }
  }
  return findings
}

function staticSpecifiers(source: string): string[] {
  const file = ts.createSourceFile(
    'bundle.js',
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.JS
  )
  const imports: string[] = []
  for (const statement of file.statements) {
    if (
      !ts.isImportDeclaration(statement) &&
      !ts.isExportDeclaration(statement)
    )
      continue
    const specifier = statement.moduleSpecifier
    if (specifier && ts.isStringLiteral(specifier)) imports.push(specifier.text)
  }
  return imports
}

export type EagerChunk = {
  file: string
  source: string
  raw: number
  gzip9: number
}

/** Follow static ESM imports/re-exports; dynamic imports stay deferred. */
export function readEagerChunks(
  distDirectory: string,
  entry: string
): EagerChunk[] {
  const root = resolve(distDirectory)
  const visited = new Set<string>()
  const chunks: EagerChunk[] = []
  const visit = (file: string) => {
    const absolute = resolve(file)
    if (!absolute.startsWith(root + sep))
      throw new Error(`Bundle import escapes dist: ${absolute}`)
    if (visited.has(absolute)) return
    visited.add(absolute)
    const bytes = readFileSync(absolute)
    const source = bytes.toString('utf8')
    chunks.push({
      file: relative(root, absolute),
      source,
      raw: bytes.length,
      gzip9: gzipSync(bytes, { level: 9 }).length,
    })
    for (const specifier of staticSpecifiers(source)) {
      if (specifier.startsWith('./') || specifier.startsWith('../')) {
        visit(resolve(dirname(absolute), specifier))
      }
    }
  }
  visit(resolve(root, entry))
  return chunks
}

function runCli(): void {
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
    const parser = findEagerPayloads(
      'parser.js',
      'const defaults={allowedSchemesAppliedToAttributes:[]};'
    )
    if (parser.length !== 1 || parser[0]?.dep !== 'sanitize-html')
      failures.push('inline HTML parser was not detected')
    const external = findEagerPayloads(
      'external.js',
      'import {decodeHTML} from "entities";'
    )
    if (external.length !== 1 || external[0]?.dep !== 'entities')
      failures.push('eager external entity table was not detected')

    const clean = findEagerPayloads(
      'clean.js',
      'const load=()=>import("html2canvas");const p=()=>import("jspdf");const html=()=>import("sanitize-html");const text=()=>import("entities");'
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
      'lint-bundle-budget --selftest clean (3 planted payloads detected; deferred imports clean)'
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

  for (const rel of EAGER_ENTRIES) {
    let chunks: EagerChunk[]
    try {
      chunks = readEagerChunks(
        join(ROOT, 'dist'),
        relative(join(ROOT, 'dist'), join(ROOT, rel))
      )
    } catch (error) {
      console.error(`✗ ${rel} eager closure unreadable — ${String(error)}`)
      failed = true
      continue
    }
    const gzip = chunks.reduce((total, chunk) => total + chunk.gzip9, 0)
    console.log(
      `  initial ESM closure: ${chunks.length} file(s), ${gzip.toLocaleString()} B gzip9; baseline ${EAGER_GZIP_BASELINE.toLocaleString()} B, +10% ceiling ${EAGER_GZIP_MAX.toLocaleString()} B`
    )
    if (gzip > EAGER_GZIP_MAX) {
      console.error(
        `✗ ${rel} initial gzip cost exceeds the frozen +10% ceiling`
      )
      failed = true
    }
    console.log(
      `  eager-payload scan: ${EAGER_PAYLOADS.length} payload signatures + 5 static dependency names × ${chunks.length} file(s)`
    )
    for (const chunk of chunks) {
      for (const { dep, marker } of findEagerPayloads(
        chunk.file,
        chunk.source
      )) {
        const loadedBy =
          EAGER_PAYLOADS.find(payload => payload.dep === dep)?.loadedBy ??
          'src/components/ComplexTextEditor/utils/conversion.ts'
        console.error(
          `✗ ${chunk.file} eagerly loads ${dep} (marker ${JSON.stringify(marker)}). Load it with a dynamic import() instead — see ${loadedBy}.`
        )
        failed = true
      }
    }
  }

  if (failed) {
    console.error('\nlint-bundle-budget FAILED')
    process.exit(1)
  }
  console.log('lint-bundle-budget clean')
}

if (import.meta.main) runCli()
