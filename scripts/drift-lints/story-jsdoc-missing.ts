import type { DriftFile, DriftInstance, DriftLint } from '../lint-drift'

/**
 * DRIFT: story-jsdoc-missing — exported Storybook stories with no per-story
 * JSDoc.
 *
 * The repo contract is "no unit tests — stories + Chromatic ARE the regression
 * net" (scripts/test-impact-map.ts). The ratified story standard
 * (docs/audits/story-jsdoc-standard-proposal.md §1.1 row "Per-story JSDoc" +
 * §1.4-4) REQUIRES every exported story to carry a JSDoc (`/**`) block
 * IMMEDIATELY above it, stating the observable state the snapshot pins ("Badge
 * anchored bottom-left with content '12'") — never a restatement of the story
 * name and never a bare number. That sentence is what a Chromatic reviewer reads
 * to decide whether a visual diff is a regression; an undocumented story is an
 * unlabeled baseline. The exemplar is src/components/Badge/badge.stories.tsx
 * (every `export const … : Story` preceded by a JSDoc block).
 *
 * DOMINANT FORM (evidence, measured 2026-07-11): 646 of 1198 story exports
 * (53.9% adoption) already carry the JSDoc-immediately-above shape; 552 across
 * 68 files do not. This module FREEZES those 552 so no new undocumented story
 * export can land, ratcheting the tree toward the standard.
 *
 * DETECTION: a top-level `export const <Name>: Story = {` / `: StoryObj<…> = {`
 * whose immediately-preceding line is NOT the close of a JSDoc (`/**`) block.
 * Story exports are the only col-0 `export const` annotated `Story`/`StoryObj`
 * in a *.stories.tsx (verified: 1198/1198); demo helpers (`: React.FC`, bare
 * `=`) are correctly excluded by the type requirement.
 *
 * DELIBERATE UNDER-MEASURE (false positives are poison): this counts only the
 * PRESENCE of a JSDoc (`/**`) block directly above. A block that is present but
 * "contentless" (the `1) Light Theme Variants` numbered labels the audit flags
 * in Tabs/Toolbar/TransferList) is scored as documented here — judging a bare
 * number vs a real sentence is a semantic call left to review, not this gate.
 * The scan is comment- and template-literal-aware (a single char pass blanks
 * comment and template CONTENT so an `export const … : Story` written inside a
 * JSDoc example or a template-literal demo is never a phantom hit, and also
 * records where each JSDoc block closes so "documented" can be decided — the
 * pattern of scripts/a11y-lints/label-input-id-divergence.ts). Unlike a naive
 * quote tracker it does NOT treat `'`/`"` as string delimiters: story files are
 * JSX-heavy and a bare apostrophe in JSX text (`Don't`) would otherwise desync
 * the scan and blank the rest of the file (a real bug caught here during the
 * census). See scanStories for why ignoring single/double quotes is safe.
 * Template-literal `${…}` interpolation is treated as opaque content (a `` ` ``
 * inside an interpolation could mis-close) — acceptable: no real story export or
 * JSDoc lives inside an interpolation in this tree.
 */

interface StoryScan {
  /** source with comment + template-literal CONTENT blanked, newlines preserved */
  code: string
  /** 1-based line numbers on which a JSDoc block closes */
  jsdocEndLines: Set<number>
}

/**
 * Single char-scan that (a) blanks line-comment, block-comment, and
 * template-literal CONTENT so an `export const … : Story` written inside a
 * comment/JSDoc example or a template-literal demo is never matched, and (b)
 * records the line each JSDoc block closes on, so a story export can be checked
 * for a JSDoc block on the line directly above it.
 *
 * ⚠️ Single/double-quote strings are DELIBERATELY NOT tracked. Story files are
 * JSX-heavy and JSX TEXT routinely contains bare apostrophes (`Don't`, `you're`)
 * — a naive quote tracker treats that `'` as a string open and desyncs, blanking
 * the rest of the file (a real bug caught during this module's census: an
 * apostrophe swallowed every story below it). Because story exports are always
 * col-0 on their own line, the only cost of ignoring `'`/`"` is that a `//` or
 * a JSDoc-opening `/*` sequence appearing INSIDE a quoted string literal would
 * be read as a comment; both are exceedingly rare in this tree and would only
 * mis-blank content, never fabricate a story export. Template literals ARE
 * tracked (backtick, with `\\` escape) because col-0 demo code lives in them.
 */
function scanStories(text: string): StoryScan {
  const out = text.split('')
  const jsdocEndLines = new Set<number>()
  let line = 1
  let mode: 'code' | 'line' | 'block' | 'template' = 'code'
  let blockIsJsDoc = false
  let i = 0
  const n = text.length
  while (i < n) {
    const c = text[i]
    if (c === '\n') {
      if (mode === 'line') mode = 'code'
      line++
      i++
      continue
    }
    if (mode === 'line') {
      out[i] = ' '
      i++
      continue
    }
    if (mode === 'block') {
      if (c === '*' && text[i + 1] === '/') {
        if (blockIsJsDoc) jsdocEndLines.add(line)
        out[i] = ' '
        out[i + 1] = ' '
        mode = 'code'
        blockIsJsDoc = false
        i += 2
        continue
      }
      out[i] = ' '
      i++
      continue
    }
    if (mode === 'template') {
      if (c === '\\') {
        // Escaped char inside a template literal (e.g. an escaped backtick):
        // consume both so it can't close the template. Preserve a newline's
        // line count.
        out[i] = ' '
        if (text[i + 1] === '\n') line++
        else if (text[i + 1] !== undefined) out[i + 1] = ' '
        i += 2
        continue
      }
      if (c === '`') {
        mode = 'code'
        out[i] = ' '
        i++
        continue
      }
      out[i] = ' '
      i++
      continue
    }
    // mode === 'code'
    if (c === '/' && text[i + 1] === '/') {
      mode = 'line'
      out[i] = ' '
      out[i + 1] = ' '
      i += 2
      continue
    }
    if (c === '/' && text[i + 1] === '*') {
      mode = 'block'
      blockIsJsDoc = text[i + 2] === '*'
      out[i] = ' '
      out[i + 1] = ' '
      i += 2
      continue
    }
    if (c === '`') {
      mode = 'template'
      out[i] = ' '
      i++
      continue
    }
    i++
  }
  return { code: out.join(''), jsdocEndLines }
}

/** A col-0 story export: `export const <Name>: Story|StoryObj…= {`. */
const STORY_EXPORT = /^export const (\w+)\s*:\s*(?:Story|StoryObj)\b/

const lint: DriftLint = {
  name: 'story-jsdoc-missing',
  description:
    'Exported Storybook stories (`export const X: Story = {…}`) lacking a `/** … */` JSDoc block immediately above them — the per-story description a Chromatic reviewer reads (goobs has no unit tests). Ratchets against regression of the 646 already-documented story exports; new stories must carry the doc.',
  canon:
    'Every exported story (`export const <Name>: Story|StoryObj = {…}`) carries a `/** … */` JSDoc block on the line IMMEDIATELY above it, stating the observable state the snapshot pins.\n\n' +
    'Evidence: ratified by docs/audits/story-jsdoc-standard-proposal.md §1.1 (row "Per-story JSDoc") + §1.4-4 as Required, exemplar src/components/Badge/badge.stories.tsx; and it is already the DOMINANT form — 646 of 1198 story exports (53.9%) carry it (measured 2026-07-11). goobs has no unit tests, so the per-story JSDoc is the sentence a Chromatic reviewer reads to decide whether a visual diff is a regression; an undocumented story is an unlabeled baseline.',
  scope: 'stories',
  measure(files: DriftFile[]): DriftInstance[] {
    const instances: DriftInstance[] = []
    for (const { path, text } of files) {
      const { code, jsdocEndLines } = scanStories(text)
      const codeLines = code.split('\n')
      for (let idx = 0; idx < codeLines.length; idx++) {
        const match = codeLines[idx].match(STORY_EXPORT)
        if (!match) continue
        const lineNo = idx + 1
        if (jsdocEndLines.has(lineNo - 1)) continue // JSDoc directly above → documented
        instances.push({
          file: path,
          line: lineNo,
          token: `story '${match[1]}' has no /** */ JSDoc above it`,
        })
      }
    }
    return instances
  },
  selftest: {
    bad: [
      // A theme story with only a banner line-comment above it (the AppBar shape).
      "// Theme stories\nexport const LightTheme: Story = {\n  name: 'Themes/Light',\n}",
      // A StoryObj-typed export with nothing above it.
      'export const ConfirmDeleteFlow: StoryObj<typeof CardConfirmDelete> = {\n  args: {},\n}',
    ],
    good: [
      // Single-line JSDoc directly above the export.
      "/** Sacred badge anchored top-right with content '5'. */\nexport const SacredTheme: Story = {\n  name: 'Themes/Sacred',\n}",
      // Multi-line JSDoc directly above the export.
      '/**\n * Light-theme badge: filled chip on a light anchor.\n */\nexport const LightTheme: Story = {}',
      // A non-story helper export is not a story — never flagged, JSDoc or not.
      'export const DemoAnchor: React.FC = () => null',
      // The broken shape written INSIDE a JSDoc example is documentation, not a
      // story export — the following real export is documented, so 0 hits.
      '/** e.g. `export const Foo: Story = {}` — the shape. */\nexport const RealOne: Story = {}',
      // A story export inside a template-literal demo string is blanked, and the
      // real export below it is documented — 0 hits.
      '/** Docs demo. */\nexport const Real: Story = {\n  render: () => <Code>{`\nexport const NotAStory: Story = {}\n`}</Code>,\n}',
    ],
  },
}

export default lint
