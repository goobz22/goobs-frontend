#!/usr/bin/env bun
/**
 * lint-rtl-spacing — RTL-readiness gate for STATIC-LAYOUT directional CSS.
 *
 * Physical, direction-hardcoded spacing/border/alignment properties bake a
 * left-to-right assumption into the stylesheet: under `direction: rtl` a
 * `margin-left` stays on the *left* instead of following the reading order, so a
 * mirrored layout breaks. Their logical equivalents (`margin-inline-start`,
 * `text-align: start`, `border-start-start-radius`, …) are IDENTICAL to the
 * physical form in LTR but flip correctly in RTL, so converting them is a no-op
 * today and unblocks internationalization tomorrow.
 *
 * This gate flags the unambiguous static-layout subset and nothing else:
 *   - margin-left / margin-right            -> margin-inline-start / -end
 *   - padding-left / padding-right          -> padding-inline-start / -end
 *   - border-left / border-right (+ -width/-color/-style)
 *                                           -> border-inline-start / -end (…)
 *   - text-align: left | right              -> text-align: start | end
 *   - border-{top,bottom}-{left,right}-radius
 *                                           -> border-{start,end}-{start,end}-radius
 *
 * EXPLICITLY NOT GATED (out of scope by design — these are NOT logicalizable by
 * a mechanical rename):
 *   - left: / right: / top: / bottom: positioning (often JS-anchored via
 *     getBoundingClientRect-fed CSS vars, or deliberate physical placement);
 *   - transform: translateX(...) directional motion; floats.
 *
 * Escape hatches (ENCODED in the check — never an external ignore-list):
 *   1. `rtl-keep` — a line carrying an inline `/* rtl-keep: <reason> *​/` marker
 *      is a DELIBERATE, documented physical property (e.g. a drawer edge anchored
 *      by a physical `[data-anchor='left']` prop, or a JS-placed tooltip arrow
 *      tail). Add the marker + a reason to keep a property physical on purpose.
 *   2. bare `transparent` border side — a `border-left/right` whose final color
 *      token is exactly `transparent` is CSS-triangle / spacer geometry with no
 *      visible directional affordance; it renders identically LTR/RTL, so it is
 *      exempt. (A `color-mix(…, transparent)` or any visible color is NOT exempt.)
 *
 * Custom-property definitions (`--x-margin-left: …`) and `var(--x-left)`
 * references are naturally out of scope: the check is anchored to the DECLARATION
 * position (start of the trimmed line), where a `--`-prefixed name or a mid-value
 * `var()` never matches.
 *
 * Usage:  bun scripts/lint-rtl-spacing.ts [--selftest]
 * Exit 1 when any un-exempt physical declaration exists (printed as file:line).
 */
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs'
import { join, relative } from 'node:path'

export interface LintFile {
  /** repo-relative path, forward slashes */
  path: string
  text: string
}
export interface Violation {
  file: string
  line: number
  message: string
}

const ROOT = join(import.meta.dir, '..')
const SRC = join(ROOT, 'src')

/** Blank every /* … *​/ comment (multi-line aware) while preserving line count,
 *  so a commented-out declaration is never flagged. Newlines are kept; every
 *  other comment character becomes a space. */
function stripComments(text: string): string {
  return text.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '))
}

const cornerRe = /^\s*(border-(?:top|bottom)-(?:left|right)-radius)\s*:/
const marginPadRe = /^\s*((?:margin|padding)-(?:left|right))\s*:/
const borderSideRe = /^\s*(border-(?:left|right)(?:-width|-color|-style)?)\s*:\s*([^;]*)/
const textAlignRe = /^\s*text-align\s*:\s*(left|right)\b/

/** True when a border side value's final color token is exactly `transparent`
 *  (triangle / spacer geometry — RTL-neutral, exempt). A `color-mix(…,
 *  transparent)` or any visible color returns false (NOT exempt). */
function isBareTransparentBorder(value: string): boolean {
  const cleaned = value
    .replace(/!important\s*$/i, '')
    .replace(/;?\s*$/, '')
    .trim()
  return /(?:^|\s)transparent$/.test(cleaned)
}

const CORNER_TO_LOGICAL: Record<string, string> = {
  'border-top-left-radius': 'border-start-start-radius',
  'border-top-right-radius': 'border-start-end-radius',
  'border-bottom-left-radius': 'border-end-start-radius',
  'border-bottom-right-radius': 'border-end-end-radius',
}

export function check(files: LintFile[]): Violation[] {
  const violations: Violation[] = []
  for (const { path, text } of files) {
    const rawLines = text.split('\n')
    const codeLines = stripComments(text).split('\n')
    for (let i = 0; i < codeLines.length; i++) {
      // Escape hatch 1: a documented, deliberate physical property.
      if (rawLines[i]!.includes('rtl-keep')) continue
      const line = codeLines[i]!

      const ta = line.match(textAlignRe)
      if (ta) {
        const logical = ta[1] === 'left' ? 'start' : 'end'
        violations.push({
          file: path,
          line: i + 1,
          message: `text-align: ${ta[1]} — use text-align: ${logical} (logical) so alignment follows RTL; add an inline /* rtl-keep: reason */ marker if the physical direction is intentional`,
        })
        continue
      }

      const corner = line.match(cornerRe)
      if (corner) {
        const logical = CORNER_TO_LOGICAL[corner[1]!] ?? 'border-*-*-radius'
        violations.push({
          file: path,
          line: i + 1,
          message: `${corner[1]} — use ${logical} (logical corner) for RTL; add /* rtl-keep: reason */ if intentional`,
        })
        continue
      }

      const mp = line.match(marginPadRe)
      if (mp) {
        const prop = mp[1]!
        const logical = prop.replace(/-left$/, '-inline-start').replace(/-right$/, '-inline-end')
        violations.push({
          file: path,
          line: i + 1,
          message: `${prop} — use ${logical} (logical) for RTL; add /* rtl-keep: reason */ if intentional`,
        })
        continue
      }

      const bs = line.match(borderSideRe)
      if (bs) {
        // Escape hatch 2: bare-transparent triangle / spacer border.
        if (isBareTransparentBorder(bs[2]!)) continue
        const prop = bs[1]!
        const logical = prop
          .replace(/^border-left/, 'border-inline-start')
          .replace(/^border-right/, 'border-inline-end')
        violations.push({
          file: path,
          line: i + 1,
          message: `${prop} — use ${logical} (logical) for RTL; add /* rtl-keep: reason */ if the physical side is intentional (anchored/JS-placed) or the border is a bare-transparent triangle`,
        })
        continue
      }
    }
  }
  return violations
}

// ---------------------------------------------------------------------------
// Selftest — every `bad` must yield >=1 violation; every `good` must yield 0.
// ---------------------------------------------------------------------------
const selftestFixtures = {
  bad: [
    '.x { margin-left: 4px; }',
    '.x { margin-right: 4px; }',
    '.x { padding-left: 8px; }',
    '.x { padding-right: 8px; }',
    '.x { border-left: 1px solid red; }',
    '.x { border-right-color: blue; }',
    '.x { text-align: left; }',
    '.x { text-align: right; }',
    '.x { border-top-left-radius: 4px; }',
    '.x { border-bottom-right-radius: 4px; }',
    // color-mix with a transparent ARGUMENT is a visible border — NOT exempt.
    '.x { border-left: 1px solid color-mix(in srgb, var(--a) 25%, transparent); }',
  ],
  good: [
    '.x { margin-inline-start: 4px; }',
    '.x { padding-inline-end: 8px; }',
    '.x { border-inline-start: 1px solid red; }',
    '.x { border-inline-end-color: blue; }',
    '.x { text-align: start; }',
    '.x { text-align: center; }',
    '.x { border-start-start-radius: 4px; }',
    // Positioning is NOT gated.
    '.x { left: 0; right: 0; top: 0; bottom: 0; }',
    // Directional motion is NOT gated.
    '.x { transform: translateX(-50%); }',
    // Bare-transparent triangle / reset borders are exempt.
    '.x { border-left: 5px solid transparent; }',
    '.x { border-right: 0 none transparent; }',
    // Custom-property DEFINITION whose name contains a physical direction.
    '.x { --pb-margin-left: 0; }',
    // A var() REFERENCE whose name contains a physical direction (decl is logical).
    '.x { border-inline-start: var(--tabs-border-left); }',
    // rtl-keep marker exempts a deliberate physical property.
    ".paper { border-right: 1px solid red; /* rtl-keep: anchored drawer edge */ }",
    // A commented-out physical declaration must not be flagged.
    '.x { /* margin-left: 4px; */ color: red; }',
  ],
}

function runSelftest(): void {
  const failures: string[] = []
  selftestFixtures.bad.forEach((snippet, i) => {
    const hits = check([{ path: `__selftest__/bad-${i}.css`, text: snippet }])
    if (hits.length === 0) failures.push(`bad[${i}] produced 0 violations (must be >=1): ${snippet}`)
  })
  selftestFixtures.good.forEach((snippet, i) => {
    const hits = check([{ path: `__selftest__/good-${i}.css`, text: snippet }])
    if (hits.length > 0)
      failures.push(`good[${i}] produced ${hits.length} violation(s) (must be 0): ${snippet} -> ${hits[0]!.message}`)
  })
  if (failures.length) {
    console.error('✗ lint-rtl-spacing selftest FAILED')
    for (const f of failures) console.error(`    ${f}`)
    process.exit(1)
  }
  console.log(
    `lint-rtl-spacing selftest OK (${selftestFixtures.bad.length} bad, ${selftestFixtures.good.length} good)`
  )
}

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) walk(full, out)
    else out.push(full)
  }
  return out
}

function collectCssFiles(): LintFile[] {
  const files = walk(SRC).filter((p) => p.endsWith('.module.css'))
  const globalCss = join(SRC, 'styles', 'global.css')
  if (existsSync(globalCss)) files.push(globalCss)
  return files.map((p) => ({
    path: relative(ROOT, p).replace(/\\/g, '/'),
    text: readFileSync(p, 'utf8'),
  }))
}

runSelftest()
if (process.argv.includes('--selftest')) process.exit(0)

const violations = check(collectCssFiles()).sort(
  (a, b) => a.file.localeCompare(b.file) || a.line - b.line
)
if (violations.length) {
  for (const v of violations) console.log(`${v.file}:${v.line} ${v.message}`)
  console.error(
    `\nlint-rtl-spacing FAILED — ${violations.length} un-exempt physical directional declaration(s). ` +
      `Convert to the logical equivalent, or add an inline /* rtl-keep: reason */ marker if the physical direction is intentional.`
  )
  process.exit(1)
}
const scanned = collectCssFiles().length
console.log(`lint-rtl-spacing clean — 0 un-exempt physical directional declarations across ${scanned} CSS file(s)`)
