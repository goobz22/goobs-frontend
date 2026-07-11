import type { A11yLint, LintFile, Violation } from '../lint-a11y'

/**
 * CLASS: interactive-missing-public-ref (consumer DX / focus management).
 *
 * A consumer-facing component whose `index.tsx` renders a REAL native
 * interactive element (`<input>`, `<button>`, `<select>`, `<textarea>`,
 * `<option>`) but exposes NO public ref silently swallows a consumer's ref:
 * `<Select ref={myRef} />` does nothing, so the consumer can't focus, scroll,
 * measure, or imperatively drive the control. React 19 makes the fix additive
 * and cheap — declare a `ref?: React.Ref<HTMLXxxElement>` prop and thread it to
 * the primary interactive element (the ref-as-prop pattern; `forwardRef` is the
 * older equivalent). 17 of the library's leaf components already forward a ref
 * (Button, Checkbox, IconButton, TreeView, DetailField, …); this gate holds the
 * rest of the consumer-facing interactive components to the same contract.
 *
 * ── Escape hatches (encoded in the check, NOT a file ignore-list) ────────────
 *  1. The file already exposes a ref — it uses `forwardRef`, OR it declares a
 *     lowercase `ref?:` prop (the React-19 ref-as-prop the fix adds). File-level
 *     on purpose: once a component threads a public ref to ANY of its elements
 *     it is no longer "dropping" the consumer ref.
 *  2. The component is not consumer-importable. Only `index.tsx` files whose
 *     component directory is re-exported from the package barrel (`src/index.ts`)
 *     are flagged. Internal render helpers a consumer can never hold a ref to
 *     (e.g. `DataGrid/Table/CreationRow`, `ComplexTextEditor/SimpleEditor`,
 *     `ProjectBoard/board`) are out of scope for a *consumer*-DX gate. Note this
 *     correctly KEEPS the deep-but-exported leaves `Metric/Accordion` and
 *     `Filter/Section`, which a path-depth heuristic would wrongly drop.
 *  3. TODO(Field/**): the `src/components/Field/**` family threads its native
 *     control through the shared `Field/Shell`, so exposing a public ref there
 *     needs a coordinated FieldShell change (a serial pass owns that). Field
 *     leaves are deferred and excluded here — remove this guard once FieldShell
 *     forwards a ref, at which point every Field leaf must thread it too.
 *
 * Interactive tags mentioned only inside comments or string/template literals
 * (JSDoc examples like `the <button>`, test-selector strings) are masked before
 * scanning, so they never produce a false positive.
 */

const INTERACTIVE_TAGS = ['input', 'button', 'select', 'textarea', 'option']
// A JSX opening tag is the tag name immediately after `<`, followed by
// whitespace/newline (attrs to come, incl. the multi-line `<input\n …` shape),
// `>` (no attrs), or `/` (self-close). Word-name match avoids `<IconButton`.
const INTERACTIVE_RE = new RegExp(
  `<(${INTERACTIVE_TAGS.join('|')})(?=[\\s/>])`,
  'g'
)

/**
 * Blank out block comments, line comments, and single/double/back-quoted string
 * literals (preserving newlines + length so line numbers stay accurate) so a
 * tag named in a JSDoc example or a selector string is never matched as JSX.
 */
function maskNonCode(text: string): string {
  let t = text.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '))
  t = t.replace(/(^|[^:])\/\/[^\n]*/g, (m, p1: string) =>
    p1 + ' '.repeat(m.length - p1.length)
  )
  t = t.replace(/'(?:[^'\\\n]|\\.)*'/g, (m) => "'" + ' '.repeat(Math.max(0, m.length - 2)) + "'")
  t = t.replace(/"(?:[^"\\\n]|\\.)*"/g, (m) => '"' + ' '.repeat(Math.max(0, m.length - 2)) + '"')
  t = t.replace(/`(?:[^`\\]|\\.)*`/g, (m) => '`' + ' '.repeat(Math.max(0, m.length - 2)) + '`')
  return t
}

/** True when the file already exposes a public ref (either escape hatch #1). */
function exposesPublicRef(masked: string): boolean {
  // `forwardRef(` / `React.forwardRef(` — the classic ref-forwarding wrapper.
  if (/\bforwardRef\b/.test(masked)) return true
  // A lowercase `ref?:` prop declaration — the React-19 ref-as-prop the fix
  // adds. Case-sensitive + word-boundary so `buttonRef?:` / `inputRef?:`
  // (internal, non-public ref plumbing) do NOT count.
  if (/(^|[^A-Za-z0-9_])ref\?:/.test(masked)) return true
  return false
}

/** `src/components/<dir>/index.tsx` → `<dir>`, else null. */
function componentDirOf(path: string): string | null {
  const m = path.match(/^src\/components\/(.+)\/index\.tsx$/)
  return m ? m[1] : null
}

/** Component dirs re-exported from the package barrel (`src/index.ts`). */
function barrelExportedDirs(files: LintFile[]): Set<string> {
  const barrel = files.find((f) => f.path === 'src/index.ts')
  const dirs = new Set<string>()
  if (!barrel) return dirs
  const re = /from\s*['"]\.\/components\/([^'"]+)['"]/g
  let m: RegExpExecArray | null
  while ((m = re.exec(barrel.text)) !== null) dirs.add(m[1])
  return dirs
}

const lint: A11yLint = {
  name: 'interactive-missing-public-ref',
  wcag: '2.4.3',
  description:
    'A consumer-facing component that renders a native interactive element ' +
    '(<input>/<button>/<select>/<textarea>/<option>) but forwards no public ref ' +
    'silently drops `ref={…}` — consumers cannot focus, scroll, measure, or ' +
    'imperatively drive the control. Add a `ref?: React.Ref<…>` prop threaded to ' +
    'the primary interactive element (React 19 ref-as-prop).',
  check(files: LintFile[]): Violation[] {
    const violations: Violation[] = []
    const exportedDirs = barrelExportedDirs(files)

    for (const { path, text } of files) {
      const masked = maskNonCode(text)

      INTERACTIVE_RE.lastIndex = 0
      const hit = INTERACTIVE_RE.exec(masked)
      if (!hit) continue // no interactive element in real JSX
      if (exposesPublicRef(masked)) continue // escape hatch #1

      const line = masked.slice(0, hit.index).split('\n').length
      const tag = hit[1]
      const message =
        `interactive <${tag}> rendered without a forwarded ref — add a ` +
        '`ref?: React.Ref<…>` prop threaded to the primary interactive element ' +
        '(React 19 ref-as-prop) so consumers can focus/measure/drive it'

      // Selftest / synthetic snippets (path not under src/) are judged on pure
      // shape so the module self-verifies without the real barrel present.
      if (!path.startsWith('src/')) {
        violations.push({ file: path, line, message })
        continue
      }

      const dir = componentDirOf(path)
      if (!dir) continue // not a component entry file
      // Escape hatch #3 — Field/** deferred to the serial FieldShell pass.
      if (dir === 'Field' || dir.startsWith('Field/')) continue
      // Escape hatch #2 — only consumer-importable (barrel-exported) leaves.
      if (!exportedDirs.has(dir)) continue

      violations.push({ file: path, line, message })
    }
    return violations
  },
  selftest: {
    bad: [
      // single-line <select> control, no ref
      'export const X = () => <select><option>a</option></select>',
      // multi-line <button> opening tag (attrs on following lines), no ref
      'export const X = () => (\n  <button\n    type="button"\n    onClick={() => {}}\n  >\n    go\n  </button>\n)',
      // <input> with only an INTERNAL callback ref (inputRef), no public ref
      'export const X = ({ inputRef }: { inputRef?: (el: HTMLInputElement|null)=>void }) => <input ref={inputRef} />',
      // <option> leaf (MenuItem shape), no ref
      'export const X = () => <option value="a">A</option>',
    ],
    good: [
      // forwardRef → exposes a ref
      'export const X = forwardRef<HTMLButtonElement, {}>((props, ref) => <button ref={ref} />)',
      // React-19 ref-as-prop → exposes a ref
      'export const X = ({ ref }: { ref?: React.Ref<HTMLSelectElement> }) => <select ref={ref}><option>a</option></select>',
      // no interactive element at all
      'export const X = () => <div role="button" tabIndex={0}>go</div>',
      // interactive tag only inside a string / comment — masked, not real JSX
      "export const X = () => <div data-sel={'<button>'}>{/* renders a <input> label */}hi</div>",
    ],
  },
}

export default lint
