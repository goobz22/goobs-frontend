import type { A11yLint, LintFile, Violation } from '../lint-a11y'

/**
 * missing-data-component-root — test-selector Tier-0 contract.
 *
 * Every TOP-LEVEL component exported from `src/index.ts` must emit
 * `data-component="<ExportName>"` on its rendered root element. That attribute
 * is the resolver's Tier-0 selector: it is how the test recommender / harness
 * finds a component in the DOM without keying off drifting label text or brittle
 * class hashes. A top-level component whose root omits it is invisible to the
 * selector contract (screen-reader/AT parity + testability), so the recommender
 * falls back to fragile xpath — exactly the drift this attribute exists to kill.
 *
 * Shape of the class (not the literal string from one file): a top-level
 * component-directory entry point (`src/components/<Dir>/index.tsx`) that renders
 * a component root yet contains NO `data-component=` anywhere in the file.
 *
 * SCOPE — top-level dirs only. The entry point of a top-level exported component
 * lives at exactly one directory segment under `components/`
 * (`src/components/<Dir>/index.tsx`). Nested entry points
 * (`src/components/DataGrid/Footer/index.tsx`, `src/components/Field/Text/index.tsx`,
 * `src/components/Form/DataGrid/index.tsx`, …) are sub-components, NOT the
 * top-level export, and are deliberately out of scope.
 *
 * ESCAPE HATCHES (encoded in the check, never an ignore-list of files):
 *  - Nested Field inputs render `FieldShell`, which emits
 *    `data-component="FieldShell"` on their behalf — so Field entry points never
 *    need their own. They are already out of scope (nested), and `Field` is also
 *    named in EXCLUDED_DIRS defensively in case a `Field/index.tsx` barrel appears.
 *  - `Icons` are individual decorative SVG files, not selector-addressable
 *    top-level components — excluded defensively for the same reason.
 *  - A file that renders NO JSX root (a pure re-export barrel) has no root to
 *    carry the attribute and is not flagged.
 */

/** Directory names that are exempt even at the single-segment level. */
const EXCLUDED_DIRS = new Set(['Field', 'Icons'])

/** Real top-level component entry point: `src/components/<Dir>/index.tsx`. */
const TOP_LEVEL_ENTRY = /^src\/components\/([^/]+)\/index\.tsx$/

/**
 * In scope when the path is a real single-segment top-level component entry
 * point whose dir is not exempt — OR a selftest fixture (so the runner's
 * synthetic `__selftest__/…` paths exercise the content logic below).
 */
function pathInScope(path: string): boolean {
  if (path.startsWith('__selftest__/')) return true
  const match = TOP_LEVEL_ENTRY.exec(path)
  if (!match) return false
  return !EXCLUDED_DIRS.has(match[1])
}

/** Renders a component root: contains at least one JSX opening tag. */
function rendersComponentRoot(text: string): boolean {
  return /<[A-Za-z][\w.]*[\s/>]/.test(text)
}

function hasDataComponent(text: string): boolean {
  // Both the JSX-attribute form (`data-component="X"` / `data-component={x}`)
  // and the props-object form (`'data-component': 'X'`) spread onto the root
  // satisfy the contract.
  return /data-component\s*=|['"]data-component['"]\s*:/.test(text)
}

/** Line of the root render (first `return (`), else first JSX tag, else 1. */
function rootLine(text: string): number {
  const lines = text.split('\n')
  const returnIdx = lines.findIndex((line) => /\breturn\s*\(/.test(line))
  if (returnIdx >= 0) return returnIdx + 1
  const jsxIdx = lines.findIndex((line) => /<[A-Za-z][\w.]*[\s/>]/.test(line))
  return jsxIdx >= 0 ? jsxIdx + 1 : 1
}

const lint: A11yLint = {
  name: 'missing-data-component-root',
  wcag: '4.1.2',
  description:
    'A top-level exported component (src/components/<Dir>/index.tsx) must emit data-component="<ExportName>" on its rendered root — the Tier-0 test-selector contract. Without it the component is unaddressable by the resolver and falls back to brittle text/xpath lookup.',
  check(files: LintFile[]): Violation[] {
    const violations: Violation[] = []
    for (const { path, text } of files) {
      if (!pathInScope(path)) continue
      if (!rendersComponentRoot(text)) continue
      if (hasDataComponent(text)) continue
      violations.push({
        file: path,
        line: rootLine(text),
        message:
          'top-level component root is missing data-component="<ExportName>" — add it to the rendered root element (additive; keep any existing data-* markers)',
      })
    }
    return violations
  },
  selftest: {
    bad: [
      // top-level root with no data-component at all
      'export default function Widget() {\n  return (\n    <div className={s.root}>hi</div>\n  )\n}',
      // has bespoke data-* markers + data-theme but still no data-component
      'const Grid = forwardRef(function Grid(props, ref) {\n  return (\n    <div ref={ref} className={s.grid} data-datagrid={id} data-theme="sacred">\n      rows\n    </div>\n  )\n})\nexport default Grid',
    ],
    good: [
      // root carries data-component
      'export default function Widget() {\n  return (\n    <div className={s.root} data-component="Widget">hi</div>\n  )\n}',
      // data-component alongside a bespoke marker (additive is fine)
      'export default function Grid() {\n  return (\n    <div className={s.grid} data-datagrid={id} data-component="DataGrid">rows</div>\n  )\n}',
      // props-object form spread onto the root (e.g. ConfirmationCodeInput)
      "const rootProps = { 'data-component': 'Widget' }\nexport default function Widget() {\n  return (\n    <div className={s.root} {...rootProps}>hi</div>\n  )\n}",
      // pure re-export barrel — no JSX root to carry the attribute
      'export { default } from "./Widget"\nexport type { WidgetProps } from "./types"',
    ],
  },
}

export default lint
