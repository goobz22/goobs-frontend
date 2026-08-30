#!/usr/bin/env bun
/**
 * lint-touch-target-height — WCAG 2.5.5 Target Size (Enhanced, 44x44 CSS px)
 * wall for the SHARED CONTROL BASELINE.
 *
 * ─────────────────────────────── THE BUG CLASS ───────────────────────────────
 *
 * goobs' control vocabulary was written for a MOUSE. `--goobs-control-height`
 * is 32px, and under `@media (width <= 768px)` components swapped in
 * `--goobs-control-height-compact: 28px` — so the library made its controls
 * SMALLER on exactly the viewports where the pointer becomes a thumb. That is
 * the class: **a control that shrinks on the touch breakpoint.**
 *
 * MEASURED, not theorised. The downstream ThothOS mobile oracle
 * (`G18.mobile-responsive`, `.runner/ship/mobile-responsive.json`, run of
 * 2026-08-19, 90 page renders across tablet+mobile) reported **505 control
 * instances** that cleared the 24px AA floor and sat under 44px, and the
 * dominant class in every sample was goobs' own `.button` at 36x28 — the
 * compact token doing precisely what it was told. Two independent instances
 * of the shrink shape existed in the library besides Button
 * (`TextField .inputWrapper`, `MultiSelect .chipContainer`, both `min-height:
 * 36px` inside their mobile media block), which is what makes this a CLASS and
 * not an incident (T8).
 *
 * ─────────────────────────── WHAT THIS GATE ASSERTS ──────────────────────────
 *
 * Two halves, because closing only one leaves the other free to regrow:
 *
 *  A. THE TOKEN FLOOR (the home exists and is >= 44). `src/styles/global.css`
 *     must carry a touch-scoped `@media` block that raises EVERY control
 *     baseline token to >= 44px. If the block is missing, a token is missing
 *     from it, or a value is under 44, the home is not actually a home.
 *
 *  B. NO TOUCH SHRINK (nothing forks around the home). Inside any touch-scoped
 *     `@media` block, no rule may pin `height`/`min-height` to a bare px
 *     literal under 44. A component that needs a control height reads the
 *     token; one that hardcodes a smaller number is re-introducing the class
 *     one file at a time, which is exactly how the three instances above
 *     arrived independently.
 *
 * A "touch-scoped" media condition is `pointer: coarse` or a narrow-width
 * clause (`max-width: Npx` / `width <= Npx`) with N <= 1024 — the breakpoint
 * range where the library already switches to its compact vocabulary.
 *
 * ──────────────────────────────── ESCAPE HATCH ───────────────────────────────
 *
 * ENCODED in the check, never an external ignore-list (the lint-rtl-spacing
 * `rtl-keep` convention): a declaration carrying an inline
 * `/* touch-target-keep: <reason> *​/` marker is a deliberate, documented
 * sub-44 box under a real WCAG 2.5.8 exception (Equivalent, Essential, Inline,
 * or under UA control). The marker forces the reason to be written down next
 * to the number rather than argued for in a review thread.
 *
 * ───────────────────────── RELATION TO THE DRIFT RATCHET ─────────────────────
 *
 * `scripts/drift-lints/small-interactive-target.ts` is a growth RATCHET over
 * the 24px AA floor with a committed baseline of legitimate exceptions. This
 * is not that: it is HARD RED at the 44px enhanced target, zero instances, no
 * baseline (T16). They do not overlap — the ratchet reads sub-24 declarations
 * anywhere and under-measures on purpose via a class-name heuristic; this
 * reads ANY sub-44 height inside a touch breakpoint, where the name heuristic
 * is unnecessary because a non-control almost never pins a height there.
 *
 * ────────────────────────── PROVING IT FAILS FIRST ───────────────────────────
 *
 * `--root <dir>` points the scan at another checkout, which is how the
 * red->green was demonstrated without mutating this tree: exporting the
 * pre-fix CSS with `git show HEAD:<path>` into a scratch root and scanning it
 * reds on the missing token block plus the two hardcoded 36px fields; scanning
 * the fixed tree greens. The selftest fixtures pin the same two shapes as
 * standalone snippets so the boundary cannot be re-rolled silently.
 *
 * Usage:  bun scripts/lint-touch-target-height.ts [--selftest] [--root <dir>]
 * Exit 1 when the token floor is unmet or any un-exempt sub-44 height is
 * declared inside a touch breakpoint.
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
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

/** WCAG 2.5.5 Target Size (Enhanced), level AAA. */
export const TOUCH_TARGET_MIN_PX = 44

/**
 * The widest `max-width` still treated as a touch breakpoint. The library's
 * own compact vocabulary switches at 768px; 1024 leaves headroom for a tablet
 * clause without sweeping in desktop-range media queries.
 */
export const TOUCH_BREAKPOINT_MAX_PX = 1024

/**
 * The control-baseline tokens that MUST be raised on touch. Adding a token to
 * the baseline vocabulary in global.css without adding it here would leave it
 * silently un-raised, so this list is the gate's own declared universe.
 */
export const CONTROL_BASELINE_TOKENS = [
  '--goobs-control-height',
  '--goobs-control-height-compact',
  '--goobs-target-min',
] as const

/** The file that owns the tokens. */
const TOKEN_HOME = 'src/styles/global.css'

/**
 * Blank `/* … *​/` comment bodies (string-aware, newline-preserving) so a
 * `min-height: 16px` written inside a comment is never a hit, while line
 * numbers stay exact. CSS has no `//` line comments. Adapted from
 * scripts/drift-lints/small-interactive-target.ts.
 */
function blankComments(text: string): string {
  const out = text.split('')
  let str: string | null = null
  for (let i = 0; i < text.length; i++) {
    const c = text[i]!
    if (str) {
      if (c === '\\') {
        i++
        continue
      }
      if (c === str) str = null
      continue
    }
    if (c === "'" || c === '"') {
      str = c
      continue
    }
    if (c === '/' && text[i + 1] === '*') {
      let j = i + 2
      while (j < text.length && !(text[j] === '*' && text[j + 1] === '/')) j++
      for (let k = i; k < Math.min(j + 2, text.length); k++)
        if (out[k] !== '\n') out[k] = ' '
      i = j + 1
      continue
    }
  }
  return out.join('')
}

/** 1-based line number of an offset. */
function lineAt(text: string, index: number): number {
  let line = 1
  for (let i = 0; i < index && i < text.length; i++) if (text[i] === '\n') line++
  return line
}

/**
 * Is this `@media` condition touch-scoped? `pointer: coarse`, or a
 * narrow-width clause at or under TOUCH_BREAKPOINT_MAX_PX in either the legacy
 * (`max-width: 768px`) or range (`width <= 768px`) syntax.
 */
export function isTouchScopedCondition(condition: string): boolean {
  if (/pointer\s*:\s*coarse/.test(condition)) return true
  const legacy = /max-width\s*:\s*(\d+)px/g
  let m: RegExpExecArray | null
  while ((m = legacy.exec(condition)))
    if (Number(m[1]) <= TOUCH_BREAKPOINT_MAX_PX) return true
  const range = /width\s*<=\s*(\d+)px/g
  while ((m = range.exec(condition)))
    if (Number(m[1]) <= TOUCH_BREAKPOINT_MAX_PX) return true
  return false
}

interface MediaBlock {
  condition: string
  /** offset of the first char INSIDE the block */
  start: number
  /** offset just past the last char inside the block */
  end: number
}

/** Every `@media` block with its brace-matched body span. */
function mediaBlocks(text: string): MediaBlock[] {
  const blocks: MediaBlock[] = []
  const re = /@media([^{]*)\{/g
  let m: RegExpExecArray | null
  while ((m = re.exec(text))) {
    let depth = 1
    let i = m.index + m[0].length
    const start = i
    while (i < text.length && depth > 0) {
      if (text[i] === '{') depth++
      else if (text[i] === '}') depth--
      i++
    }
    blocks.push({ condition: m[1]!, start, end: i - 1 })
  }
  return blocks
}

/**
 * CHECK B — no un-exempt sub-44 `height`/`min-height` px literal inside a
 * touch-scoped media block.
 *
 * `max-height` is a cap rather than a floor and never matches; custom-property
 * DEFINITIONS (`--x-height: 20px`) never match, because the property name must
 * sit at a declaration boundary (not preceded by `-` or a word character).
 */
function checkNoTouchShrink(file: LintFile): Violation[] {
  const violations: Violation[] = []
  const blanked = blankComments(file.text)
  for (const block of mediaBlocks(blanked)) {
    if (!isTouchScopedCondition(block.condition)) continue
    const body = blanked.slice(block.start, block.end)
    const re = /(^|[^\w-])(min-height|height)\s*:\s*(\d+(?:\.\d+)?)px/g
    let d: RegExpExecArray | null
    while ((d = re.exec(body))) {
      const px = parseFloat(d[3]!)
      if (px >= TOUCH_TARGET_MIN_PX) continue
      const absolute = block.start + d.index
      const line = lineAt(file.text, absolute)
      // The marker is read from the ORIGINAL text (comments intact) on the
      // declaration's own line.
      const rawLine = file.text.split('\n')[line - 1] ?? ''
      if (/touch-target-keep\s*:/.test(rawLine)) continue
      violations.push({
        file: file.path,
        line,
        message:
          `${d[2]}: ${px}px inside a touch breakpoint (@media${block.condition.trim()}) ` +
          `is under the ${TOUCH_TARGET_MIN_PX}px thumb target — read var(--goobs-control-height) ` +
          `(raised on touch in ${TOKEN_HOME}) instead of pinning a smaller literal, or add an ` +
          `inline /* touch-target-keep: reason */ marker naming the WCAG 2.5.8 exception`,
      })
    }
  }
  return violations
}

/**
 * CHECK A — the token home raises every control baseline token to >= 44px in a
 * touch-scoped block.
 */
function checkTokenFloor(file: LintFile): Violation[] {
  const blanked = blankComments(file.text)
  const raised = new Map<string, number>()
  for (const block of mediaBlocks(blanked)) {
    if (!isTouchScopedCondition(block.condition)) continue
    const body = blanked.slice(block.start, block.end)
    for (const token of CONTROL_BASELINE_TOKENS) {
      const re = new RegExp(`${token}\\s*:\\s*(\\d+(?:\\.\\d+)?)px`, 'g')
      let m: RegExpExecArray | null
      while ((m = re.exec(body))) {
        const px = parseFloat(m[1]!)
        const prior = raised.get(token)
        // The LAST touch-scoped definition wins in the cascade; keep the
        // smallest seen so a later weakening cannot hide behind an earlier
        // conforming one.
        raised.set(token, prior === undefined ? px : Math.min(prior, px))
      }
    }
  }
  const violations: Violation[] = []
  for (const token of CONTROL_BASELINE_TOKENS) {
    const px = raised.get(token)
    if (px === undefined) {
      violations.push({
        file: file.path,
        line: 1,
        message:
          `${token} is never raised inside a touch-scoped @media block, so every control that ` +
          `reads it keeps its mouse-era height on a touchscreen. Define it at >= ` +
          `${TOUCH_TARGET_MIN_PX}px under @media (width <= 768px), (pointer: coarse) — ` +
          `see the TOUCH TARGET BASELINE block`,
      })
    } else if (px < TOUCH_TARGET_MIN_PX) {
      violations.push({
        file: file.path,
        line: 1,
        message:
          `${token} is raised to only ${px}px on touch, under the ${TOUCH_TARGET_MIN_PX}px ` +
          `thumb target (WCAG 2.5.5)`,
      })
    }
  }
  return violations
}

/** The whole gate over a set of CSS files. PURE — no I/O, so it is selftestable. */
export function check(files: LintFile[]): Violation[] {
  const violations: Violation[] = []
  for (const file of files) violations.push(...checkNoTouchShrink(file))
  const home = files.find(f => f.path.endsWith(TOKEN_HOME))
  if (home) violations.push(...checkTokenFloor(home))
  return violations
}

// ─────────────────────────────────────────────────────────────────────────────
// SELFTEST — every `bad` snippet must yield >=1 violation, every `good` 0.
// ─────────────────────────────────────────────────────────────────────────────

/** A conforming token home, reused by the fixtures that are not about check A. */
const GOOD_TOKEN_HOME =
  ':root { --goobs-control-height: 32px; --goobs-control-height-compact: 28px; --goobs-target-min: 24px; }\n' +
  '@media (width <= 768px), (pointer: coarse) {\n' +
  '  :root { --goobs-control-height: 44px; --goobs-control-height-compact: 44px; --goobs-target-min: 44px; }\n' +
  '}\n'

const selftestFixtures: {
  bad: Array<{ path: string; text: string }>
  good: Array<{ path: string; text: string }>
} = {
  bad: [
    // THE MEASURED SHAPE — TextField/MultiSelect pinned 36px in their mobile block.
    { path: 'x.module.css', text: '@media (max-width: 768px) { .inputWrapper { min-height: 36px; } }' },
    // Range syntax, the spelling Button's compact block uses.
    { path: 'x.module.css', text: '@media (width <= 768px) { .button { min-height: 28px; } }' },
    // Coarse-pointer scoping is equally a touch breakpoint.
    { path: 'x.module.css', text: '@media (pointer: coarse) { .chip { height: 32px; } }' },
    // CHECK A — a token home with no touch block at all (the pre-fix state).
    {
      path: 'src/styles/global.css',
      text: ':root { --goobs-control-height: 32px; --goobs-control-height-compact: 28px; --goobs-target-min: 24px; }',
    },
    // CHECK A — a touch block that raises only SOME of the tokens.
    {
      path: 'src/styles/global.css',
      text:
        ':root { --goobs-control-height: 32px; }\n' +
        '@media (pointer: coarse) { :root { --goobs-control-height: 44px; } }',
    },
    // CHECK A — a touch block that raises to a value still under 44.
    {
      path: 'src/styles/global.css',
      text:
        ':root { --goobs-control-height: 32px; }\n' +
        '@media (pointer: coarse) { :root { --goobs-control-height: 40px; ' +
        '--goobs-control-height-compact: 44px; --goobs-target-min: 44px; } }',
    },
  ],
  good: [
    // The fix shape: read the token, never a literal.
    { path: 'x.module.css', text: '@media (max-width: 768px) { .inputWrapper { min-height: var(--goobs-control-height); } }' },
    // >= 44 literal inside a touch block is fine.
    { path: 'x.module.css', text: '@media (max-width: 768px) { .button { min-height: 44px; } }' },
    // A DESKTOP-range media query is out of scope — this gate is about touch.
    { path: 'x.module.css', text: '@media (min-width: 1200px) { .button { min-height: 28px; } }' },
    // Unconditional (non-media) declarations are out of scope; the token home
    // is what guarantees they rise, and check A owns that.
    { path: 'x.module.css', text: '.button { min-height: 32px; }' },
    // max-height is a cap, not a floor.
    { path: 'x.module.css', text: '@media (max-width: 768px) { .button { max-height: 20px; } }' },
    // A custom-property DEFINITION is not a box height.
    { path: 'x.module.css', text: '@media (max-width: 768px) { .switch { --switch-thumb-height: 20px; } }' },
    // A commented-out declaration must never be flagged.
    { path: 'x.module.css', text: '@media (max-width: 768px) { .button { /* min-height: 28px; */ color: red; } }' },
    // The documented escape hatch.
    {
      path: 'x.module.css',
      text:
        '@media (max-width: 768px) { .resizeHandle { min-height: 8px; ' +
        '/* touch-target-keep: ESSENTIAL — a column-resize grip must sit on the column edge */ } }',
    },
    // A conforming token home.
    { path: 'src/styles/global.css', text: GOOD_TOKEN_HOME },
  ],
}

function runSelftest(): void {
  const failures: string[] = []
  selftestFixtures.bad.forEach((fixture, i) => {
    const hits = check([fixture])
    if (hits.length === 0)
      failures.push(
        `bad[${i}] produced 0 violations (must be >=1): ${JSON.stringify(fixture.text)}`
      )
  })
  selftestFixtures.good.forEach((fixture, i) => {
    const hits = check([fixture])
    if (hits.length > 0)
      failures.push(
        `good[${i}] produced ${hits.length} violation(s) (must be 0): ` +
          `${JSON.stringify(fixture.text)} -> ${hits[0]!.message}`
      )
  })
  if (failures.length) {
    console.error('✗ lint-touch-target-height selftest FAILED')
    for (const f of failures) console.error(`    ${f}`)
    process.exit(1)
  }
  console.log(
    `lint-touch-target-height selftest OK (${selftestFixtures.bad.length} bad, ${selftestFixtures.good.length} good)`
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

const rootIdx = process.argv.indexOf('--root')
if (rootIdx >= 0 && !process.argv[rootIdx + 1]) {
  console.error('✗ --root requires a directory')
  process.exit(1)
}
const ROOT = rootIdx >= 0 ? process.argv[rootIdx + 1]! : join(import.meta.dir, '..')
const SRC = join(ROOT, 'src')

function collectCssFiles(): LintFile[] {
  const files = walk(SRC).filter(p => p.endsWith('.module.css'))
  const globalCss = join(SRC, 'styles', 'global.css')
  if (existsSync(globalCss)) files.push(globalCss)
  return files.map(p => ({
    path: relative(ROOT, p).replace(/\\/g, '/'),
    text: readFileSync(p, 'utf8'),
  }))
}

runSelftest()
if (process.argv.includes('--selftest')) process.exit(0)

const cssFiles = collectCssFiles()
if (!cssFiles.some(f => f.path.endsWith(TOKEN_HOME))) {
  console.error(
    `✗ ${TOKEN_HOME} was not found under ${ROOT} — the token floor (check A) could not be ` +
      `measured, and an unmeasured floor is not a clean one`
  )
  process.exit(1)
}
const violations = check(cssFiles).sort(
  (a, b) => a.file.localeCompare(b.file) || a.line - b.line
)
if (violations.length) {
  for (const v of violations) console.log(`${v.file}:${v.line} ${v.message}`)
  console.error(
    `\nlint-touch-target-height FAILED — ${violations.length} touch-target violation(s) ` +
      `across ${cssFiles.length} CSS file(s)`
  )
  process.exit(1)
}
console.log(
  `lint-touch-target-height clean — control baseline tokens all >= ${TOUCH_TARGET_MIN_PX}px on ` +
    `touch, 0 sub-${TOUCH_TARGET_MIN_PX}px heights inside touch breakpoints, across ` +
    `${cssFiles.length} CSS file(s)`
)
