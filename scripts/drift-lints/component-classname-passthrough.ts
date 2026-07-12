import type { DriftLint, DriftFile, DriftInstance } from '../lint-drift'

/**
 * DRIFT: component-classname-passthrough — the external-className gap.
 *
 * A goobs top-level component that accepts NO external `className` (nor `style`)
 * cannot be positioned or spaced by a consumer: `<Chip className="mt-2">` type-
 * errors or silently no-ops, so the consumer has no escape hatch to nudge margin,
 * grid placement, z-index, etc. without forking the component. className
 * passthrough (merge the consumer class onto the root element) is the universal
 * React composition convention — every design-system primitive is expected to
 * forward it. Today only ~25 of 55 top-level components do; ~30 don't.
 *
 * CANON (additive — the merge idiom already exists in this repo): every top-level
 * component's Props must ACCEPT an external className. Three accepted forms, all
 * already present in the codebase:
 *   (a) `extends React.HTMLAttributes<T>` (Card/Divider/Paper/… — brings
 *       className?: + style?: + the DOM attrs, spread `...rest` onto the root),
 *   (b) an explicit `className?: string` member merged via the AppBar idiom
 *       `mergeClassNames(cssStyles.root, className)`  (AppBar/Markdown/Form/…),
 *   (c) `style?: React.CSSProperties` alongside (Form/TransferList/…).
 * The BESPOKE `styles?: XStyles` object is NOT passthrough — it configures the
 * component's own theming, it does not let a consumer add a positioning class.
 *
 * DETECTION (comment-safe, *Props-scoped — NEVER whole-file): for each
 * `src/components/<Name>/index.tsx`, extract every `*Props` interface/type block
 * and test, WITHIN those blocks only, for `className?:` / `style?: CSSProperties`
 * / an `…HTMLAttributes<`/`ComponentProps<`/`DetailedHTMLProps<` extend-or-
 * intersect. If NO props block carries any of those signals the file is an
 * instance (the component accepts no external className). Scanning whole-file
 * would false-negative Table (a body-local `const x: React.ThHTMLAttributes<…>`)
 * and mis-read JSX object-literals `{ className: cssStyles.x }` — so signals are
 * only honored inside a *Props declaration. Conservative by design: a file whose
 * PRIMARY export lacks className but a compound sub-part (exported from the same
 * index) accepts it is counted as ACCEPTS, not an instance (DetailField's
 * DetailGrid, Tabs' TabPanel) — under-measuring an ambiguous shape beats a noisy
 * detector. Scope is strictly the top-level dir index.tsx; nested Field/* sub-
 * components and the Icons barrel are out of scope.
 */

/** Blank `//` and block-comment content (string-aware, newlines kept) so a
 *  JSDoc mentioning `className` is never read as a props member. */
function blankComments(text: string): string {
  const out = text.split('')
  let str: string | null = null
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (str) {
      if (c === '\\') {
        i++
        continue
      }
      if (c === str) str = null
      continue
    }
    if (c === "'" || c === '"' || c === '`') {
      str = c
      continue
    }
    if (c === '/' && text[i + 1] === '/') {
      let j = i
      while (j < text.length && text[j] !== '\n') {
        out[j] = ' '
        j++
      }
      i = j - 1
      continue
    }
    if (c === '/' && text[i + 1] === '*') {
      let j = i
      while (j < text.length && !(text[j] === '*' && text[j + 1] === '/')) {
        if (text[j] !== '\n') out[j] = ' '
        j++
      }
      if (j < text.length) {
        out[j] = ' '
        out[j + 1] = ' '
        j += 1
      }
      i = j
      continue
    }
  }
  return out.join('')
}

const CLASSNAME = /\bclassName\?:/
const STYLE_CSS = /\bstyle\??:\s*(?:React\.)?CSSProperties\b/
const HTMLATTR = /\b\w*HTMLAttributes\s*</
const COMPPROPS = /\bComponentProps(?:WithoutRef|WithRef)?\s*</
const DETAILED = /\bDetailedHTMLProps\s*</

function blockAccepts(block: string): boolean {
  return (
    CLASSNAME.test(block) ||
    STYLE_CSS.test(block) ||
    HTMLATTR.test(block) ||
    COMPPROPS.test(block) ||
    DETAILED.test(block)
  )
}

/** Extract each exported `*Props` interface/type body (brace/stmt matched,
 *  interface `extends` header included). Comment-blanked text expected. */
function extractPropsBlocks(text: string): string[] {
  const blocks: string[] = []
  const re = /export\s+(interface|type)\s+[A-Za-z0-9_]*Props\b/g
  let m: RegExpExecArray | null
  while ((m = re.exec(text))) {
    const kind = m[1]
    const i = re.lastIndex
    if (kind === 'interface') {
      const braceIdx = text.indexOf('{', i)
      if (braceIdx < 0) continue
      const header = text.slice(i, braceIdx) // captures `extends …`
      let depth = 0
      let j = braceIdx
      for (; j < text.length; j++) {
        if (text[j] === '{') depth++
        else if (text[j] === '}') {
          depth--
          if (depth === 0) {
            j++
            break
          }
        }
      }
      blocks.push(header + text.slice(braceIdx, j))
    } else {
      const eq = text.indexOf('=', i)
      if (eq < 0) continue
      let depth = 0
      let j = eq
      for (; j < text.length; j++) {
        const c = text[j]
        if (c === '{' || c === '(' || c === '<' || c === '[') depth++
        else if (c === '}' || c === ')' || c === '>' || c === ']') depth--
        else if (c === ';' && depth <= 0) break
      }
      blocks.push(text.slice(eq, j))
    }
  }
  return blocks
}

const TOP_LEVEL_INDEX = /^src\/components\/[^/]+\/index\.tsx$/
const SELFTEST = /(^|\/)__selftest__\//

function lineOf(text: string, index: number): number {
  return text.slice(0, index).split('\n').length
}

/** Anchor line: the primary `*Props` decl, else the default export, else 1. */
function anchorLine(text: string): number {
  const propsRe = /export\s+(?:interface|type)\s+[A-Za-z0-9_]*Props\b/
  const p = propsRe.exec(text)
  if (p) return lineOf(text, p.index)
  const d = /export default\s+[A-Za-z0-9_]+/.exec(text)
  if (d) return lineOf(text, d.index)
  return 1
}

const lint: DriftLint = {
  name: 'component-classname-passthrough',
  scope: 'ts',
  description:
    'A top-level goobs component whose Props accept no external className/style — the consumer cannot position or space it (<Chip className="mt-2"> silently no-ops). Add className passthrough: extend React.HTMLAttributes<T>, or declare className?: string and merge it onto the root with the AppBar mergeClassNames idiom.',
  canon:
    'Every top-level component accepts an external className (merge it onto the root via the AppBar mergeClassNames idiom) — its Props must declare className?: string (optionally style?: React.CSSProperties) OR extend React.HTMLAttributes<T>.\n' +
    'EVIDENCE: className passthrough is the universal React design-system composition convention — a consumer must be able to add a positioning/spacing class without forking the component; without it <Chip className="mt-2"> type-errors or no-ops. The idiom already exists in-repo (AppBar mergeClassNames; Card/Paper/Divider extend React.HTMLAttributes), so the canon is ADDITIVE — generalize the ~25 components that already accept it to the ~30 that do not. The bespoke `styles?: XStyles` prop is theming, not passthrough, and does not satisfy the canon.',
  measure(files: DriftFile[]): DriftInstance[] {
    const out: DriftInstance[] = []
    for (const { path, text: raw } of files) {
      const isSelftest = SELFTEST.test(path)
      if (!isSelftest && !TOP_LEVEL_INDEX.test(path)) continue
      const text = blankComments(raw)
      const blocks = extractPropsBlocks(text)
      if (blocks.some(blockAccepts)) continue // accepts external className
      const nameMatch = /components\/([^/]+)\/index\.tsx$/.exec(path)
      const component = nameMatch ? nameMatch[1] : path
      out.push({
        file: path,
        line: anchorLine(text),
        token: `${component}: Props accept no external className`,
      })
    }
    return out
  },
  selftest: {
    bad: [
      // Bespoke `styles?` object only — theming, NOT className passthrough.
      'export interface ChipProps {\n  label: string\n  styles?: ChipStyles\n}\nconst Chip: FC<ChipProps> = () => null\nexport default Chip',
      // JSDoc mentions className, but no className MEMBER — comment prose must not count.
      "export interface FooProps {\n  /** pass a className to the wrapper */\n  onChange?: () => void\n}\nexport default function Foo() {\n  return <div className={styles.root} />\n}",
    ],
    good: [
      // (a) extends React.HTMLAttributes<T>.
      'export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {\n  variant?: string\n}\nexport default function Card() { return null }',
      // (b) explicit className?: string member.
      'export interface AppBarProps {\n  className?: string\n  children?: React.ReactNode\n}\nexport default function AppBar() { return null }',
      // (c) style?: React.CSSProperties member.
      'export interface FormProps {\n  style?: React.CSSProperties\n}\nexport default function Form() { return null }',
    ],
  },
}

export default lint
