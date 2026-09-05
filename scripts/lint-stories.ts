#!/usr/bin/env bun
/**
 * lint-stories — run oxlint over exactly the STORY surface.
 *
 * This is the oxlint replacement for the old
 * `eslint "src/**\/*.stories.tsx" ".storybook/**\/*.{ts,tsx}" --max-warnings=0`
 * script, and it exists because oxlint cannot express that file set on its own
 * command line:
 *
 *   - oxlint does NOT expand globs in positional arguments. It walks
 *     DIRECTORIES. `oxlint "src/**\/*.stories.tsx"` reports
 *     "No files found to lint" (verified against oxlint 1.81.0), so the shell
 *     would have to expand it — which is not portable across the cmd.exe that
 *     `npm run` uses on Windows and the sh that CI uses.
 *   - oxlint's `--ignore-pattern` matcher does NOT honour gitignore-style `!`
 *     negation, so "ignore src, then un-ignore the stories" does not work
 *     either: `--ignore-pattern "src/**\/*.tsx" --ignore-pattern
 *     "!src/**\/*.stories.tsx"` yields zero src files, not the stories.
 *
 * So the file list is enumerated here and handed to oxlint explicitly. The
 * per-file rule set still comes from .oxlintrc.json — the story overrides
 * (eslint-plugin-storybook via jsPlugins, the no-restricted-globals /
 * no-restricted-properties story bans, the three peer-authored carve-outs)
 * match on the file PATH, so an explicit list resolves identically to a
 * directory walk.
 *
 * The oxlint exit code is this script's exit code, unmodified: nothing here
 * interprets, summarises or softens the result.
 */
import { Glob } from 'bun'
import { relative, resolve } from 'node:path'

const repoRoot = resolve(import.meta.dir, '..')

/** The two globs the ESLint script covered, unchanged. */
const PATTERNS = ['src/**/*.stories.tsx', '.storybook/**/*.ts', '.storybook/**/*.tsx']

const files: string[] = []
for (const pattern of PATTERNS) {
  for (const match of new Glob(pattern).scanSync({ cwd: repoRoot })) {
    files.push(relative(repoRoot, resolve(repoRoot, match)).replaceAll('\\', '/'))
  }
}
files.sort()

if (files.length === 0) {
  console.error(
    'lint-stories: no story files matched — the glob or the tree moved. Refusing to report a pass over nothing.'
  )
  process.exit(1)
}

console.log(`lint-stories: ${files.length} files (stories + .storybook)`)

const oxlint = resolve(
  repoRoot,
  'node_modules/.bin/oxlint' + (process.platform === 'win32' ? '.exe' : '')
)

const result = Bun.spawnSync([oxlint, '--type-aware', '--deny-warnings', ...files], {
  cwd: repoRoot,
  stdio: ['inherit', 'inherit', 'inherit'],
})

process.exit(result.exitCode ?? 1)
