#!/usr/bin/env bun
/**
 * lint-story-restricted-syntax — the two story-file bans that oxlint cannot
 * express.
 *
 * WHY THIS FILE EXISTS. The ESLint config carried a `no-restricted-syntax`
 * block scoped to `src/**\/*.stories.tsx` with two AST selectors. oxlint has no
 * `no-restricted-syntax` rule and @oxlint/migrate reported it as "not
 * implemented", so migrating to oxlint would have dropped both bans silently.
 * They are house rules the operator wrote, not third-party defaults, so they
 * are re-implemented here rather than recorded as a coverage loss.
 *
 * BAN 1 — `Property[key.name='backgrounds'] Property[key.name='default']`
 *   `parameters.backgrounds.default` is a DEAD Storybook 8 API. The SB10
 *   runtime ignores it, so a story that pins its canvas that way silently
 *   renders on the default background and its Chromatic snapshot pins the
 *   wrong thing. The live form is
 *   `globals: { backgrounds: { value: 'dark' } }`, which is what every story
 *   in this repo already uses — this gate keeps the dead form from coming back.
 *
 * BAN 2 — `Property[key.name='tags'] Literal[value='autodocs']`
 *   autodocs is tagged GLOBALLY in .storybook/preview.tsx. Re-tagging per meta
 *   produces a duplicate docs entry.
 *
 * CARVE-OUT. The same three peer-authored stories the ESLint config exempted
 * are exempt here, for the same reason and with the same instruction: delete
 * the carve-out once their author migrates them.
 *
 * IMPLEMENTATION. The selectors are structural, so this is a brace-balanced
 * scan rather than a regex over the whole file: find a `backgrounds` /`tags`
 * key, take its value's balanced extent, and look inside THAT extent only.
 * A regex over the raw text would fire on an unrelated `default:` further down
 * the file.
 *
 * Usage:  bun scripts/lint-story-restricted-syntax.ts [--selftest] [--root <dir>]
 * Exit 1 on any violation outside the carve-out.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
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

/**
 * Peer-authored stories that pre-date the Wave-0 standard and still carry
 * `tags: ['autodocs']`. Exempt exactly as eslint.config.mjs exempted them.
 * Remove this list once their author migrates them.
 */
export const CARVE_OUT = [
  'src/components/Card/card.stories.tsx',
  'src/components/Filter/Section/filterSection.stories.tsx',
  'src/components/Metric/Accordion/metricsAccordion.stories.tsx',
] as const

const BACKGROUNDS_DEFAULT_MESSAGE =
  'parameters.backgrounds.default is a dead SB8 API the SB10 runtime ignores. ' +
  "Pin the canvas via story globals: { backgrounds: { value: ... } }."
const AUTODOCS_MESSAGE =
  'autodocs is tagged globally in .storybook/preview.tsx. Never re-tag per meta.'

/** 1-based line number of `index` within `text`. */
function lineAt(text: string, index: number): number {
  let line = 1
  for (let i = 0; i < index && i < text.length; i++) {
    if (text[i] === '\n') line++
  }
  return line
}

/**
 * The extent of the value that follows the key ending at `afterKey`, from its
 * opening bracket to the matching close. Returns null when the value is not a
 * bracketed literal (an identifier, a call, a spread), which neither selector
 * can match anyway.
 */
function bracketedValueExtent(
  text: string,
  afterKey: number,
  open: '{' | '['
): { start: number; end: number } | null {
  const close = open === '{' ? '}' : ']'
  let i = afterKey
  while (i < text.length && /\s/.test(text[i] as string)) i++
  if (text[i] !== ':') return null
  i++
  while (i < text.length && /\s/.test(text[i] as string)) i++
  if (text[i] !== open) return null
  const start = i
  let depth = 0
  for (; i < text.length; i++) {
    const ch = text[i]
    if (ch === open) depth++
    else if (ch === close) {
      depth--
      if (depth === 0) return { start, end: i }
    }
  }
  return null
}

/** The whole gate over a set of story files. PURE — no I/O, so it is selftestable. */
export function check(files: LintFile[]): Violation[] {
  const violations: Violation[] = []
  for (const file of files) {
    if ((CARVE_OUT as readonly string[]).includes(file.path)) continue
    const { text } = file

    // BAN 1 — a `default` key anywhere inside a `backgrounds` object value.
    for (const m of text.matchAll(/\bbackgrounds\b/g)) {
      const extent = bracketedValueExtent(text, m.index + m[0].length, '{')
      if (!extent) continue
      const body = text.slice(extent.start, extent.end + 1)
      const inner = /(^|[{,\s])default\s*:/.exec(body)
      if (inner) {
        violations.push({
          file: file.path,
          line: lineAt(text, extent.start + inner.index),
          message: BACKGROUNDS_DEFAULT_MESSAGE,
        })
      }
    }

    // BAN 2 — the 'autodocs' string literal inside a `tags` array value.
    for (const m of text.matchAll(/\btags\b/g)) {
      const extent = bracketedValueExtent(text, m.index + m[0].length, '[')
      if (!extent) continue
      const body = text.slice(extent.start, extent.end + 1)
      const inner = /'autodocs'|"autodocs"/.exec(body)
      if (inner) {
        violations.push({
          file: file.path,
          line: lineAt(text, extent.start + inner.index),
          message: AUTODOCS_MESSAGE,
        })
      }
    }
  }
  return violations
}

// ─────────────────────────────────────────────────────────────────────────────
// SELFTEST — every `bad` snippet must yield >=1 violation, every `good` 0.
// ─────────────────────────────────────────────────────────────────────────────

const BAD: ReadonlyArray<readonly [string, string]> = [
  [
    'sb8 backgrounds.default',
    "const meta = { parameters: { backgrounds: { default: 'dark' } } }\n",
  ],
  [
    'sb8 backgrounds.default, multiline',
    'const meta = {\n  parameters: {\n    backgrounds: {\n      default: "light",\n' +
      "      values: [{ name: 'light', value: '#fff' }],\n    },\n  },\n}\n",
  ],
  ['per-meta autodocs', "const meta = { tags: ['autodocs'] }\n"],
  [
    'per-meta autodocs beside another tag',
    "const meta = { tags: ['test', \"autodocs\"] }\n",
  ],
]

const GOOD: ReadonlyArray<readonly [string, string]> = [
  [
    'the live globals form',
    "export const Dark: Story = { globals: { backgrounds: { value: 'dark' } } }\n",
  ],
  [
    'a `default:` that is NOT under backgrounds',
    "const meta = { globals: { backgrounds: { value: 'dark' } } }\n" +
      'export default meta\n' +
      'const cfg = { layout: { default: 1 } }\n',
  ],
  ['tags without autodocs', "const meta = { tags: ['test', 'stable'] }\n"],
  [
    'the word autodocs outside a tags array',
    'const note = "autodocs is global; see preview.tsx"\n',
  ],
]

function runSelftest(): void {
  const failures: string[] = []
  for (const [name, text] of BAD) {
    if (check([{ path: 'src/x.stories.tsx', text }]).length === 0) {
      failures.push(`bad fixture produced NO violation: ${name}`)
    }
  }
  for (const [name, text] of GOOD) {
    const found = check([{ path: 'src/x.stories.tsx', text }])
    if (found.length > 0) {
      failures.push(`good fixture produced ${found.length} violation(s): ${name}`)
    }
  }
  // The carve-out must actually carve out.
  const carved = check([{ path: CARVE_OUT[0], text: "const meta = { tags: ['autodocs'] }\n" }])
  if (carved.length !== 0) failures.push('carve-out did not exempt its file')
  if (failures.length) {
    for (const f of failures) console.error(`✗ selftest: ${f}`)
    console.error('lint-story-restricted-syntax SELFTEST FAILED — the gate cannot be trusted')
    process.exit(1)
  }
  console.log(
    `lint-story-restricted-syntax selftest OK (${BAD.length} bad, ${GOOD.length} good, carve-out honored)`
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// DRIVER
// ─────────────────────────────────────────────────────────────────────────────

const rootIdx = process.argv.indexOf('--root')
const ROOT = rootIdx >= 0 ? process.argv[rootIdx + 1]! : join(import.meta.dir, '..')
const SRC = join(ROOT, 'src')

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) walk(full, out)
    else if (full.endsWith('.stories.tsx')) out.push(full)
  }
  return out
}

runSelftest()
if (process.argv.includes('--selftest')) process.exit(0)

const storyFiles: LintFile[] = walk(SRC).map(p => ({
  path: relative(ROOT, p).replace(/\\/g, '/'),
  text: readFileSync(p, 'utf8'),
}))

if (storyFiles.length === 0) {
  console.error(
    `✗ no *.stories.tsx found under ${SRC} — an unmeasured surface is not a clean one`
  )
  process.exit(1)
}

const violations = check(storyFiles).sort(
  (a, b) => a.file.localeCompare(b.file) || a.line - b.line
)
if (violations.length) {
  for (const v of violations) console.log(`${v.file}:${v.line} ${v.message}`)
  console.error(
    `\nlint-story-restricted-syntax FAILED — ${violations.length} restricted-syntax ` +
      `violation(s) across ${storyFiles.length} story file(s)`
  )
  process.exit(1)
}
console.log(
  `lint-story-restricted-syntax clean — 0 dead-SB8 backgrounds.default, 0 per-meta autodocs, ` +
    `across ${storyFiles.length} story file(s) (${CARVE_OUT.length} carved out)`
)
