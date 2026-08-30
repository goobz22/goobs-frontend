#!/usr/bin/env bun
/**
 * lint-meeting-affordance-gate — the NO-DEAD-BUTTON wall for the board's
 * meeting controls.
 *
 * ─────────────────────────────── THE BUG CLASS ───────────────────────────────
 *
 * A control that is DRAWN for a capability the host did not supply. The board's
 * meeting affordances had this in two compounding forms:
 *
 *   1. the four handlers were REQUIRED props, so a host that must not offer a
 *      capability could not withhold one — it had to pass a stub, and a stub
 *      draws a live button that reports success the product never delivers;
 *   2. the one site that DID notice a missing handler expressed it as
 *      `disabled={isSubmittingMeeting || !onScheduleMeeting}` — a greyed-out
 *      button still advertises the capability, and "greyed out" reads to a user
 *      as "not right now", not "never".
 *
 * Downstream this was load-bearing, not cosmetic: ThothOS' `lint:workspace-
 * affordance-axis` had to carry the three admin task boards as a DECLARED
 * EXEMPTION (`GOOBS_MEETING_SEAM`) precisely because the meeting control could
 * not be withheld the way the OPTIONAL `onUpdateCompanyNotes?` editor is.
 *
 * ─────────────────────────── WHAT THIS GATE ASSERTS ──────────────────────────
 *
 *  A. THE API STAYS WITHHOLDABLE. All four meeting handlers are declared
 *     OPTIONAL (`?`) in both the public props (`types/index.tsx`) and the
 *     inline form (`forms/ShowTask/inline.tsx`). Re-requiring one silently
 *     re-opens the seam and re-strands the downstream exemption.
 *
 *  B. NO CAPABILITY IS EXPRESSED AS `disabled`. A meeting handler identifier
 *     may never appear inside a `disabled={…}` expression. `disabled` is for
 *     transient in-flight state (`isSubmittingMeeting`); absence of a
 *     capability is expressed by NOT RENDERING.
 *
 *  C. EVERY CONTROL SITE IS GATED BY THE HOME. Each meeting action invoked from
 *     JSX sits under a conditional naming the matching `can<X>Meeting` flag,
 *     which is `canUseMeetingCapability`'s answer. A new meeting button added
 *     without a gate fails here rather than shipping as a dead control.
 *
 * WHY A GUARD GIVEN THE HOME EXISTS (C7). `canUseMeetingCapability` is rung 2 —
 * one place to ask the question — but nothing stops the next control from
 * simply not asking, which is exactly how site 2 above drifted from the others.
 * Rung 1 (a control primitive that cannot render without a resolved capability)
 * would be the end state and is not reachable inside a defect fix. This is the
 * interim wall.
 *
 * HARD RED, no baseline (T16): green means zero findings.
 *
 * Usage:  bun scripts/lint-meeting-affordance-gate.ts [--selftest] [--root <dir>]
 */
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

export interface LintFile {
  path: string
  text: string
}
export interface Violation {
  file: string
  line: number
  message: string
}

/** capability -> the handler prop and the resolved flag the render sites read. */
export const MEETING_HANDLERS = {
  schedule: { handler: 'onScheduleMeeting', flag: 'canScheduleMeeting' },
  confirm: { handler: 'onConfirmMeeting', flag: 'canConfirmMeeting' },
  reschedule: { handler: 'onRescheduleMeeting', flag: 'canRescheduleMeeting' },
  cancel: { handler: 'onCancelMeeting', flag: 'canCancelMeeting' },
} as const

/**
 * JSX-invoked actions per capability. These are the things a CONTROL does; the
 * `const <name> =` definition of each is skipped, since a definition is not a
 * control.
 */
const CONTROL_ACTIONS: Record<keyof typeof MEETING_HANDLERS, string[]> = {
  schedule: ['handleScheduleMeeting', "setSchedulingView('form')"],
  confirm: ['handleConfirmMeetingAction'],
  reschedule: [
    'handleRescheduleMeetingAction',
    'initializeRescheduleForm',
    "setSchedulingView('reschedule')",
  ],
  cancel: ['handleCancelMeetingAction'],
}

/**
 * How far back a control site may look for its gate. A JSX conditional wraps
 * its control within a handful of lines; 15 covers the widest real case (a
 * gate, a comment, the opening tag, and a multi-line className) without letting
 * an unrelated mention of the flag several controls away count as a gate.
 */
const GATE_LOOKBACK_LINES = 15

const PROPS_FILE = 'src/components/ProjectBoard/types/index.tsx'
const INLINE_FILE = 'src/components/ProjectBoard/forms/ShowTask/inline.tsx'

/** Blank `//` and `/* *​/` comment bodies, newline-preserving. */
function blankComments(text: string): string {
  const out = text.split('')
  for (let i = 0; i < text.length; i++) {
    if (text[i] === '/' && text[i + 1] === '*') {
      let j = i + 2
      while (j < text.length && !(text[j] === '*' && text[j + 1] === '/')) j++
      for (let k = i; k < Math.min(j + 2, text.length); k++)
        if (out[k] !== '\n') out[k] = ' '
      i = j + 1
    } else if (text[i] === '/' && text[i + 1] === '/') {
      let j = i
      while (j < text.length && text[j] !== '\n') j++
      for (let k = i; k < j; k++) out[k] = ' '
      i = j
    }
  }
  return out.join('')
}

/** CHECK A — every meeting handler prop is declared optional. */
function checkOptionalProps(file: LintFile): Violation[] {
  const violations: Violation[] = []
  const lines = blankComments(file.text).split('\n')
  for (const { handler } of Object.values(MEETING_HANDLERS)) {
    // A DECLARATION is `name?: (` or `name: (` at a property position; a usage
    // (`onScheduleMeeting={…}`, `onScheduleMeeting,`) never carries a colon+paren.
    let declared = false
    lines.forEach((line, i) => {
      const required = new RegExp(`(^|[^\\w.])${handler}\\s*:\\s*\\(`)
      const optional = new RegExp(`(^|[^\\w.])${handler}\\?\\s*:\\s*\\(`)
      if (optional.test(line)) declared = true
      else if (required.test(line)) {
        declared = true
        violations.push({
          file: file.path,
          line: i + 1,
          message:
            `${handler} is declared REQUIRED. A host that must not offer this capability then ` +
            `cannot withhold the handler and has to pass a stub, which draws a control that ` +
            `reports success the product never delivers. Declare it \`${handler}?:\` — a ` +
            `missing handler renders no control.`,
        })
      }
    })
    if (!declared)
      violations.push({
        file: file.path,
        line: 1,
        message:
          `${handler} is not declared in this file at all — the gate's declared universe and ` +
          `the component's props have drifted apart, so this run cannot certify the API`,
      })
  }
  return violations
}

/** CHECK B — no meeting capability is expressed as `disabled`. */
function checkNoDisabledCapability(file: LintFile): Violation[] {
  const violations: Violation[] = []
  const blanked = blankComments(file.text)
  const re = /disabled=\{/g
  let m: RegExpExecArray | null
  while ((m = re.exec(blanked))) {
    // Brace-match the attribute expression.
    let depth = 1
    let i = m.index + m[0].length
    const start = i
    while (i < blanked.length && depth > 0) {
      if (blanked[i] === '{') depth++
      else if (blanked[i] === '}') depth--
      i++
    }
    const expr = blanked.slice(start, i - 1)
    for (const { handler, flag } of Object.values(MEETING_HANDLERS)) {
      if (!new RegExp(`(^|[^\\w.])${handler}([^\\w]|$)`).test(expr)) continue
      const line = blanked.slice(0, m.index).split('\n').length
      violations.push({
        file: file.path,
        line,
        message:
          `disabled={…} tests ${handler}. A greyed-out control still advertises a capability ` +
          `this deployment does not have — gate the RENDER on ${flag} instead and keep ` +
          `disabled for transient in-flight state only.`,
      })
    }
  }
  return violations
}

/** CHECK C — every JSX-invoked meeting action sits under its capability gate. */
function checkControlSitesGated(file: LintFile): Violation[] {
  const violations: Violation[] = []
  const lines = blankComments(file.text).split('\n')
  for (const [capability, actions] of Object.entries(CONTROL_ACTIONS)) {
    const { flag } =
      MEETING_HANDLERS[capability as keyof typeof MEETING_HANDLERS]
    for (const action of actions) {
      lines.forEach((line, i) => {
        if (!line.includes(action)) return
        // Skip the DEFINITION of the action — a definition is not a control.
        if (new RegExp(`(const|function)\\s+${action.replace(/[(').]/g, '\\$&')}`).test(line))
          return
        const window = lines
          .slice(Math.max(0, i - GATE_LOOKBACK_LINES), i + 1)
          .join('\n')
        if (window.includes(flag)) return
        violations.push({
          file: file.path,
          line: i + 1,
          message:
            `meeting action \`${action}\` is reachable from JSX with no \`${flag}\` gate within ` +
            `${GATE_LOOKBACK_LINES} lines above it. Every meeting control renders only when ` +
            `canUseMeetingCapability('${capability}', …) says so — otherwise it is a dead button.`,
        })
      })
    }
  }
  return violations
}

/** The whole gate. PURE. */
export function check(files: LintFile[]): Violation[] {
  const violations: Violation[] = []
  for (const file of files) {
    if (file.path.endsWith(PROPS_FILE) || file.path.endsWith(INLINE_FILE))
      violations.push(...checkOptionalProps(file))
    if (file.path.endsWith(INLINE_FILE)) {
      violations.push(...checkNoDisabledCapability(file))
      violations.push(...checkControlSitesGated(file))
    }
  }
  return violations
}

// ─────────────────────────────────────────────────────────────────────────────
// SELFTEST
// ─────────────────────────────────────────────────────────────────────────────

/** A props file with all four handlers optional, for fixtures not about check A. */
const OPTIONAL_PROPS = Object.values(MEETING_HANDLERS)
  .map(({ handler }) => `  ${handler}?: (a: string) => void`)
  .join('\n')

const selftestFixtures: { bad: LintFile[]; good: LintFile[] } = {
  bad: [
    // CHECK A — the pre-fix shape: a REQUIRED handler.
    {
      path: PROPS_FILE,
      text:
        OPTIONAL_PROPS.replace(
          '  onScheduleMeeting?: (a: string) => void',
          '  onScheduleMeeting: (a: string) => void'
        ) + '\n',
    },
    // CHECK A — a handler missing from the file entirely.
    { path: PROPS_FILE, text: '  onScheduleMeeting?: (a: string) => void\n' },
    // CHECK B — the pre-fix shape: capability expressed as disabled.
    {
      path: INLINE_FILE,
      text:
        OPTIONAL_PROPS +
        '\n<button disabled={isSubmittingMeeting || !onScheduleMeeting}>go</button>\n',
    },
    // CHECK C — an ungated control site.
    {
      path: INLINE_FILE,
      text: OPTIONAL_PROPS + '\n<button onClick={handleConfirmMeetingAction}>Accept</button>\n',
    },
    // CHECK C — gated by the WRONG capability's flag.
    {
      path: INLINE_FILE,
      text:
        OPTIONAL_PROPS +
        '\n{canScheduleMeeting && (\n  <button onClick={handleCancelMeetingAction}>Decline</button>\n)}\n',
    },
  ],
  good: [
    // All four optional.
    { path: PROPS_FILE, text: OPTIONAL_PROPS + '\n' },
    // A correctly gated control.
    {
      path: INLINE_FILE,
      text:
        OPTIONAL_PROPS +
        '\n{canConfirmMeeting && (\n  <button onClick={handleConfirmMeetingAction}>Accept</button>\n)}\n',
    },
    // disabled on a transient in-flight state is fine.
    {
      path: INLINE_FILE,
      text:
        OPTIONAL_PROPS +
        '\n{canScheduleMeeting && (\n  <button disabled={isSubmittingMeeting} onClick={handleScheduleMeeting}>go</button>\n)}\n',
    },
    // The action's DEFINITION is not a control site.
    {
      path: INLINE_FILE,
      text: OPTIONAL_PROPS + '\nconst handleConfirmMeetingAction = async () => {}\n',
    },
    // A commented-out ungated control must not be flagged.
    {
      path: INLINE_FILE,
      text:
        OPTIONAL_PROPS +
        '\n// <button onClick={handleConfirmMeetingAction}>Accept</button>\n',
    },
    // A file this gate does not own is never scanned.
    { path: 'src/components/Card/index.tsx', text: '<button onClick={handleConfirmMeetingAction} />' },
  ],
}

function runSelftest(): void {
  const failures: string[] = []
  selftestFixtures.bad.forEach((fixture, i) => {
    if (check([fixture]).length === 0)
      failures.push(`bad[${i}] produced 0 violations (must be >=1)`)
  })
  selftestFixtures.good.forEach((fixture, i) => {
    const hits = check([fixture])
    if (hits.length > 0)
      failures.push(
        `good[${i}] produced ${hits.length} violation(s) (must be 0): ${hits[0]!.message}`
      )
  })
  if (failures.length) {
    console.error('✗ lint-meeting-affordance-gate selftest FAILED')
    for (const f of failures) console.error(`    ${f}`)
    process.exit(1)
  }
  console.log(
    `lint-meeting-affordance-gate selftest OK (${selftestFixtures.bad.length} bad, ${selftestFixtures.good.length} good)`
  )
}

const rootIdx = process.argv.indexOf('--root')
if (rootIdx >= 0 && !process.argv[rootIdx + 1]) {
  console.error('✗ --root requires a directory')
  process.exit(1)
}
const ROOT = rootIdx >= 0 ? process.argv[rootIdx + 1]! : join(import.meta.dir, '..')

runSelftest()
if (process.argv.includes('--selftest')) process.exit(0)

const targets = [PROPS_FILE, INLINE_FILE]
const files: LintFile[] = []
for (const rel of targets) {
  const abs = join(ROOT, rel)
  if (!existsSync(abs)) {
    console.error(
      `✗ ${rel} not found under ${ROOT} — an unmeasured control surface is not a clean one`
    )
    process.exit(1)
  }
  files.push({ path: rel, text: readFileSync(abs, 'utf8') })
}

const violations = check(files).sort(
  (a, b) => a.file.localeCompare(b.file) || a.line - b.line
)
if (violations.length) {
  for (const v of violations) console.log(`${v.file}:${v.line} ${v.message}`)
  console.error(
    `\nlint-meeting-affordance-gate FAILED — ${violations.length} finding(s) across ${files.length} file(s)`
  )
  process.exit(1)
}
console.log(
  `lint-meeting-affordance-gate clean — 4 meeting handlers optional in both prop surfaces, ` +
    `0 capabilities expressed as \`disabled\`, every meeting control site gated by ` +
    `canUseMeetingCapability, across ${files.length} file(s)`
)
