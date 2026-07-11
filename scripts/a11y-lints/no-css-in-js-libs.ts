import type { A11yLint, LintFile, Violation } from '../lint-a11y'

/**
 * Repo convention (see .claude/rules/goobs.md "Styling conventions going
 * forward"): styling is CSS-modules + `data-theme` attributes + CSS custom
 * properties. Runtime CSS-in-JS libraries (`clsx`, `classnames`, `@emotion/*`,
 * `styled-components`) are BANNED — classes are composed with the local
 * `(...n) => n.filter(Boolean).join(' ')` helper, never a third-party lib.
 *
 * There are 0 such imports today; this module is the permanent wall that keeps
 * one from being reintroduced (the whole class is "impossible" once gated).
 */

/** A bare module specifier is banned if it IS or is a subpath of these. */
function isBannedSpecifier(spec: string): boolean {
  if (spec === 'clsx' || spec === 'classnames') return true
  if (spec === 'styled-components' || spec.startsWith('styled-components/'))
    return true
  if (spec === '@emotion' || spec.startsWith('@emotion/')) return true
  return false
}

/** Every way a module specifier can enter a file, as [regex]. */
const SPECIFIER_MATCHERS: RegExp[] = [
  // `import x from 'spec'`, `import { a } from 'spec'`, `export … from 'spec'`
  /\b(?:import|export)\b[^'"\n]*\bfrom\s*['"]([^'"]+)['"]/g,
  // side-effect import: `import 'spec'`
  /\bimport\s*['"]([^'"]+)['"]/g,
  // `require('spec')`
  /\brequire\(\s*['"]([^'"]+)['"]\s*\)/g,
  // dynamic `import('spec')`
  /\bimport\(\s*['"]([^'"]+)['"]\s*\)/g,
]

const lint: A11yLint = {
  name: 'no-css-in-js-libs',
  // WCAG is not the axis here (this is a house-style/maintainability wall), but
  // the runner requires the field; 1.4.x styling is the closest umbrella.
  wcag: '1.4.x',
  description:
    'Runtime CSS-in-JS libs (clsx / classnames / @emotion/* / styled-components) are banned — compose classes with the local join helper + CSS modules + data-theme.',
  check(files: LintFile[]): Violation[] {
    const violations: Violation[] = []
    for (const { path, text } of files) {
      const lines = text.split('\n')
      lines.forEach((line, i) => {
        // Skip pure comment lines so a doc example naming a lib isn't flagged.
        const trimmed = line.trim()
        if (
          trimmed.startsWith('//') ||
          trimmed.startsWith('*') ||
          trimmed.startsWith('/*')
        )
          return
        for (const matcher of SPECIFIER_MATCHERS) {
          matcher.lastIndex = 0
          let m: RegExpExecArray | null
          while ((m = matcher.exec(line)) !== null) {
            const spec = m[1]
            if (isBannedSpecifier(spec)) {
              violations.push({
                file: path,
                line: i + 1,
                message: `banned CSS-in-JS import '${spec}' — use CSS modules + data-theme + the local class-join helper, no clsx/classnames/@emotion/styled-components`,
              })
            }
          }
        }
      })
    }
    return violations
  },
  selftest: {
    bad: [
      "import clsx from 'clsx'",
      "import cx from 'classnames'",
      "import styled from 'styled-components'",
      "import { css } from '@emotion/react'",
      "import styled from '@emotion/styled'",
      "const cx = require('classnames')",
      "const mod = await import('clsx')",
      "import styledMacro from 'styled-components/macro'",
    ],
    good: [
      "import { join } from 'node:path'",
      "import type { Foo } from '../types'",
      "import { helper } from './classnames-helper'",
      "import styles from './Button.module.css'",
      "const label = 'clsx and classnames are banned here'",
      "// import clsx from 'clsx' — example in a comment, not a real import",
    ],
  },
}
export default lint
