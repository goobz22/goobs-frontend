import type { A11yLint, LintFile, Violation } from '../lint-a11y'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

/**
 * missing-reduced-motion — WCAG 2.3.3 (Animation from Interactions) /
 * 2.2.2 (Pause, Stop, Hide).
 *
 * CLASS SHAPE: a CSS module produces MOVEMENT motion — a running `animation:`
 * (an applied keyframe animation, esp. an infinite/decorative loop) OR a
 * transform-capable `transition:` combined with an applied *movement*
 * `transform:` (translate/rotate/scale/skew/matrix/perspective/var) — yet the
 * file has NO `@media (prefers-reduced-motion: reduce)` guard to neutralise it.
 * Motion-sensitive / vestibular users then get the movement with no opt-out.
 *
 * WHY THIS IS THE SHAPE, NOT "any transition":
 *  - WCAG 2.3.3 is about MOVEMENT. Pure colour/opacity/box-shadow transitions
 *    (and opacity fades — which the audit explicitly RETAINS) are not motion,
 *    so a colour-only `transition` is intentionally NOT flagged (fewer false
 *    positives, per the README). A `transition` only counts toward a violation
 *    when the same file also applies a real movement transform.
 *  - A `@keyframes` block is a DEFINITION, not motion — motion happens where an
 *    element APPLIES `animation:`. So keyframe bodies (and the transform steps
 *    inside them) are excluded; a file that only defines keyframes (e.g. the
 *    shared global keyframes, a dead decorative keyframe) is clean.
 *  - Static centring transforms (`translate*(-50%)`) are layout, not motion, so
 *    an arrow/icon centred with `translateY(-50%)` under a `transition: transform`
 *    is NOT a violation on its own.
 *  - `--x-transition` / `--x-transform` / `--x-animation` custom-PROPERTY
 *    DEFINITIONS are not applications and are excluded; only the real
 *    `transition:` / `transform:` / `animation:` application counts.
 *
 * FILE-LEVEL GUARD HEURISTIC: presence of any `prefers-reduced-motion` block
 * clears the file. This deliberately does NOT try to prove the guard covers
 * every animated selector (the AppBar-style partial-coverage case) — that is
 * far more false-positive-prone; the per-component audit handled partial
 * coverage. This gate catches the high-value case: NO guard at all.
 *
 * SOURCE NOTE: the class lives in `*.css`, but the runner only hands modules
 * `.ts`/`.tsx` files. So this module self-sources `src/**\/*.css` from disk on a
 * real run; during selftest (fixtures carry `__selftest__/` paths) it scans the
 * passed fixture text as CSS instead of touching disk.
 */

const ROOT = join(import.meta.dir, '..', '..')

function walkCss(dir: string, out: string[] = []): string[] {
  let entries: string[]
  try {
    entries = readdirSync(dir)
  } catch {
    return out
  }
  for (const entry of entries) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) walkCss(full, out)
    else if (full.endsWith('.css')) out.push(full)
  }
  return out
}

function collectCssFromDisk(): LintFile[] {
  return walkCss(join(ROOT, 'src')).map((p) => ({
    path: relative(ROOT, p).replace(/\\/g, '/'),
    text: readFileSync(p, 'utf8'),
  }))
}

/** Blank out /* ... *​/ comments while preserving newlines (line numbers stay
 * valid) so prose that mentions `transition:`/`animation` can't false-match. */
function blankComments(text: string): string {
  return text.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '))
}

/** An applied `animation:`/`animation-name:` with a value that actually runs
 * (not solely none/inherit/…). A `var(...)` value counts — a caller can inject
 * a running (even infinite) animation through it. */
function runsAnimation(line: string): boolean {
  const m = /(^|[^-\w])animation(-name)?\s*:\s*([^;{]*)/i.exec(line)
  if (!m) return false
  const value = m[3].toLowerCase().replace(/none|inherit|initial|unset/g, '').trim()
  return value.length > 0
}

/** An applied `transition:`/`transition-property:` that can animate a transform
 * (value mentions `all`, `transform`, or a `var(...)` that resolves to one). */
function transformCapableTransition(line: string): boolean {
  const m = /(^|[^-\w])transition(-property)?\s*:\s*([^;{]*)/i.exec(line)
  if (!m) return false
  const value = m[3].toLowerCase()
  return /\ball\b/.test(value) || /transform/.test(value) || /var\(/.test(value)
}

/** An applied `transform:` that MOVES — excludes `text-transform`, custom-prop
 * definitions, `none`, and static ±50% centring translates. */
function movesTransform(line: string): boolean {
  const m = /(^|[^-\w])transform\s*:\s*([^;{]*)/i.exec(line)
  if (!m) return false
  let value = m[2].toLowerCase()
  // Drop static centring translates (layout, not motion).
  value = value.replace(
    /translate[xyz3d]*\(\s*-?50%\s*(?:,\s*-?50%\s*)?\)/g,
    ' '
  )
  value = value.replace(/none|inherit|initial|unset/g, ' ')
  return /rotate\(|scale[xyz]?\(|skew[xy]?\(|matrix\(|perspective\(|translate[xyz3d]*\(|\bvar\(/.test(
    value
  )
}

/** Scan one CSS file; return at most one file-level violation. */
function scanCss(path: string, rawText: string): Violation | null {
  // A guard anywhere in the file clears it (see FILE-LEVEL GUARD HEURISTIC).
  if (/prefers-reduced-motion/i.test(rawText)) return null

  const lines = blankComments(rawText).split('\n')
  let depth = 0
  let keyframeDepth = -1 // brace depth at which the current @keyframes opened; -1 = outside
  let animationLine = -1
  let transitionLine = -1
  let movementLine = -1

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const insideKeyframes = keyframeDepth !== -1

    // Keyframe BODIES are definitions, not applied motion — skip signal
    // detection while inside one (the applying `animation:` is what counts).
    if (!insideKeyframes) {
      if (animationLine === -1 && runsAnimation(line)) animationLine = i + 1
      if (transitionLine === -1 && transformCapableTransition(line))
        transitionLine = i + 1
      if (movementLine === -1 && movesTransform(line)) movementLine = i + 1
    }

    if (/@keyframes\b/i.test(line)) keyframeDepth = depth
    depth += (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length
    if (keyframeDepth !== -1 && depth <= keyframeDepth) keyframeDepth = -1
  }

  const signalAnimation = animationLine !== -1
  const signalMovingTransition = transitionLine !== -1 && movementLine !== -1
  if (!signalAnimation && !signalMovingTransition) return null

  const anchor = signalAnimation
    ? animationLine
    : Math.min(
        ...[transitionLine, movementLine].filter((n) => n > 0)
      )

  return {
    file: path,
    line: anchor,
    message: signalAnimation
      ? 'CSS applies a running animation with no @media (prefers-reduced-motion: reduce) guard — add a guard setting animation: none for motion-sensitive users'
      : 'CSS applies a movement transition/transform with no @media (prefers-reduced-motion: reduce) guard — add a guard neutralising the transition/transform',
  }
}

const lint: A11yLint = {
  name: 'missing-reduced-motion',
  wcag: '2.3.3',
  description:
    'A CSS module produces movement motion (a running animation, or a transform-capable transition plus an applied movement transform) with no @media (prefers-reduced-motion: reduce) guard, giving motion-sensitive/vestibular users no opt-out.',
  check(files: LintFile[]): Violation[] {
    // The runner only hands us .ts/.tsx; this class lives in CSS. During
    // selftest the fixture text (carrying a __selftest__/ path) IS the CSS to
    // scan; on a real run we self-source src/**/*.css from disk.
    const isSelftest = files.some((f) => f.path.includes('__selftest__'))
    const targets = isSelftest ? files : collectCssFromDisk()
    const violations: Violation[] = []
    for (const { path, text } of targets) {
      const violation = scanCss(path, text)
      if (violation) violations.push(violation)
    }
    return violations
  },
  selftest: {
    bad: [
      // running (infinite/decorative) animation, no guard
      '.glyph { animation: spin 2s infinite linear; }',
      // chevron: transform-capable transition + rotate movement
      '.arrow { transition: transform 0.3s ease; }\n.arrow.open { transform: rotate(180deg); }',
      // hover lift threaded through a var transition + a var movement transform
      '.row { transition: var(--t); }\n.row:hover { transform: translateX(4px); }',
      // scale enter: shorthand transition that includes transform + scale
      '.pop { transform: scale(0.9); transition: opacity 0.3s ease, transform 0.3s ease; }',
    ],
    good: [
      // guarded — a reduced-motion block clears the file
      '.glyph { animation: spin 2s infinite; }\n@media (prefers-reduced-motion: reduce) {\n  .glyph { animation: none; }\n}',
      // colour/opacity-only transitions are not movement (WCAG 2.3.3)
      '.tag { transition: color 0.2s ease, background-color 0.2s ease, opacity 0.3s ease; }',
      // @keyframes DEFINITION only, never applied — not motion
      '@keyframes spin {\n  from { transform: rotate(0deg); }\n  to { transform: rotate(360deg); }\n}',
      // transform-capable transition but the only transform is static centring
      '.icon {\n  position: absolute;\n  top: 50%;\n  transform: translateY(-50%);\n  transition: transform 0.3s ease;\n}',
      // text-transform is not a movement transform; custom-prop defs are not applications
      '.label {\n  --x-transition: all 0.2s ease;\n  text-transform: uppercase;\n  transition: color 0.2s ease;\n}',
    ],
  },
}

export default lint
