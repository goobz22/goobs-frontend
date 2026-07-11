# a11y class lints — one module per accessibility issue CLASS

This directory is the permanent regression gate for accessibility issue classes
found during the 2026-07 component a11y audit (hearing-impaired, reading-impaired /
screen-reader, SEO-semantic). It is run by `bun run lint:a11y`
(= `bun scripts/lint-a11y.ts`), which is part of `lint:all`.

**The rule (T8, class-first):** a bug found in one component is a CLASS until a
detection script proves it a one-off. When an audit finds an issue shape that recurs
(or plausibly recurs) across components, add ONE module here that:

1. abstracts the *logical shape* of the issue (not the literal string from one file),
2. enumerates every instance across `src/` with `file:line` output,
3. self-tests against `bad`/`good` fixture snippets (the runner refuses to run a
   module whose selftest fails — a broken lint is a false-green risk),
4. stays green forever after the class is fixed.

## Module contract

File name = lint name = kebab-case class slug (e.g. `missing-accessible-name.ts`).
Default-export an `A11yLint` (types importable from `../lint-a11y.ts`):

```ts
import type { A11yLint, LintFile, Violation } from '../lint-a11y'

const lint: A11yLint = {
  name: 'clickable-noninteractive-element', // MUST match filename
  wcag: '4.1.2',
  description:
    'A div/span with onClick but no role/tabIndex is invisible to keyboard and screen-reader users.',
  check(files: LintFile[]): Violation[] {
    const violations: Violation[] = []
    for (const { path, text } of files) {
      const lines = text.split('\n')
      lines.forEach((line, i) => {
        if (
          /<(div|span)\b[^>]*\bonClick=/.test(line) &&
          !/\brole=/.test(line) &&
          !/\btabIndex=/.test(line)
        ) {
          violations.push({
            file: path,
            line: i + 1,
            message: 'clickable <div>/<span> without role/tabIndex — use <button> or add role+tabIndex+key handling',
          })
        }
      })
    }
    return violations
  },
  selftest: {
    bad: ['export const X = () => <div onClick={() => {}}>go</div>'],
    good: [
      'export const X = () => <button onClick={() => {}}>go</button>',
      'export const X = () => <div role="button" tabIndex={0} onClick={() => {}}>go</div>',
    ],
  },
}
export default lint
```

## Rules for lint authors (workflow agents)

- Check `ls scripts/a11y-lints/` FIRST — if a module for your class (or a close
  superset) already exists, extend it instead of adding a near-duplicate.
- The check receives every `src/**/*.{ts,tsx}` file except `.d.ts` and stories.
  Multi-line JSX means a naive single-line regex can miss instances — prefer
  scanning joined text with index→line mapping when the shape spans lines.
- False positives are worse than missed edge cases: a lint that cries wolf gets
  deleted. Encode legitimate escape hatches (e.g. `aria-hidden` decorative icons)
  into the check, not into an ignore list.
- After the lint is green, it must STAY in `bun run check`/`lint:all` — never
  delete a module because it is inconvenient; fix the code.
- Verify with `bun scripts/lint-a11y.ts --only <name>` before committing.
