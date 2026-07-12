import type { DriftFile, DriftInstance, DriftLint } from '../lint-drift'

/**
 * DRIFT CLASS: diag-event coverage inversion (stateful containers that emit no
 * diagnostics).
 *
 * goobs exposes a dependency-free diagnostic seam (`emitDiag`, src/utils/diag.ts)
 * so a host test suite can assert on a component's runtime transitions without
 * mocking. ~26 components already honor it — Accordion, Dialog, Drawer, Popover,
 * Snackbar, Tabs, Pagination, Stepper, Tooltip, BigCalendar, Form… — emitting
 * `component.state` (a state transition) and/or `nav.change` (a view/selection
 * move). But the coverage is INVERTED: the MOST stateful containers — the ones
 * whose transitions a buyer's test suite most needs to observe — emit NONE.
 * DataGrid (60 useState across its subtree: sort/filter/page/selection/inline-
 * edit/column-reorder) and ProjectBoard (88: task-select/search/status-filter/
 * card-drag) and TreeView (7: expand/collapse/select/focus) are dark to the bus.
 *
 * This ratchet FREEZES that inversion so no NEW stateful container ships dark,
 * and so removing `emitDiag` from an already-instrumented container regresses
 * the gate. Unifying the 3 frozen instances (adding component.state/nav.change
 * to their primary transitions) is a FUTURE additive campaign — this module only
 * measures + gates.
 *
 * THE CENSUS (per top-level component `src/components/<Name>/` that HAS an
 * index.tsx = an exported top-level anchor):
 *   - stateHooks = useState + useReducer summed across the WHOLE dir subtree.
 *   - hasEmitDiag = `emitDiag` called ANYWHERE in the dir subtree.
 *   - pureInput  = the component's OWN index.tsx emits `data-field-name` (it IS
 *                  a field — instrumented via the field-binding / FieldShell
 *                  diag beacon, NOT via component.state). A container that merely
 *                  EMBEDS fields (DataGrid's editable cells emit data-field-name
 *                  only in subfiles) is NOT a pure input.
 * INSTANCE iff: stateHooks >= 4 AND !hasEmitDiag AND !pureInput.
 *
 * Deliberately CONSERVATIVE (false positives are poison): the `pureInput` filter
 * excludes field components even when they are heavily stateful (ComplexTextEditor
 * 11 state, TransferList 4 state — both bind data-field-name at their index), and
 * the >=4 threshold excludes small inputs (ToggleButton/RadioGroup/
 * ConfirmationCodeInput). The prose census motivating this dimension names all of
 * those; the mechanical criterion correctly narrows to the 3 genuine
 * *containers*. See the workflow notes for the reconciliation.
 */

/** Blank `//` and `/* … *​/` comment content (string-aware, newlines kept) so a
 *  JSDoc mentioning `emitDiag`/`useState`/`data-field-name` (or a commented-out
 *  call) can never be scanned as code — copied from the a11y-lints pattern
 *  (apostrophes in comments desync a naive quote walker; two proven incidents). */
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

const STATE_HOOK = /\buseState\s*[<(]|\buseReducer\s*[<(]/g
const EMIT_DIAG = /\bemitDiag\b/
const FIELD_NAME = /data-field-name/
/** immediate child of src/components — the top-level component boundary */
const COMPONENT = /^src\/components\/([^/]+)\//

function countStateHooks(blanked: string): number {
  STATE_HOOK.lastIndex = 0
  return (blanked.match(STATE_HOOK) ?? []).length
}

interface Group {
  /** blanked text of the top-level index.tsx (the exported anchor), if present */
  indexText?: string
  indexPath?: string
  indexLine: number
  stateHooks: number
  hasEmitDiag: boolean
}

const lint: DriftLint = {
  name: 'stateful-container-missing-diag',
  scope: 'ts',
  description:
    'A stateful container component (>=4 useState/useReducer across its dir, exported top-level, not a data-field-name-bound input) emits NO emitDiag anywhere — its primary transitions (sort/filter/page/select/expand/drag/task-open) are invisible to the host diagnostics bus that ~26 lighter peers already feed. Instrument the primary transitions with emitDiag component.state / nav.change.',
  canon:
    'Stateful containers instrument their primary transitions with emitDiag (component.state / nav.change).\n' +
    'Evidence: ~26 goobs components already emit component.state/nav.change to the dependency-free host bus (src/utils/diag.ts) — the Tier-3 universal-form diagnostics contract (data-state/component.state + nav.change on containers). A container whose sort/filter/page/selection/expand/drag transitions never reach the bus is untestable by a buyer’s suite exactly where it matters most. NEW code that adds a stateful container (>=4 useState/useReducer, not a data-field-name-bound field) must emit emitDiag on its primary transitions; a data-field-name-bound input is instrumented via the field-binding/FieldShell diag beacon instead and is out of scope here.',
  measure(files: DriftFile[]): DriftInstance[] {
    const groups = new Map<string, Group>()
    const ensure = (key: string): Group => {
      let g = groups.get(key)
      if (!g) {
        g = { stateHooks: 0, hasEmitDiag: false, indexLine: 1 }
        groups.set(key, g)
      }
      return g
    }

    for (const f of files) {
      const blanked = blankComments(f.text)
      let key: string
      let isIndex: boolean
      if (f.path.startsWith('src/')) {
        // Real repo file: only files under a top-level component dir participate.
        const m = COMPONENT.exec(f.path)
        if (!m) continue
        key = `src/components/${m[1]}`
        isIndex = f.path === `${key}/index.tsx`
      } else {
        // Synthetic/selftest snippet: the single file IS its own component + index.
        key = f.path
        isIndex = true
      }
      const g = ensure(key)
      g.stateHooks += countStateHooks(blanked)
      if (EMIT_DIAG.test(blanked)) g.hasEmitDiag = true
      if (isIndex) {
        g.indexText = blanked
        g.indexPath = f.path
        const hit = blanked.search(STATE_HOOK)
        g.indexLine = hit >= 0 ? blanked.slice(0, hit).split('\n').length : 1
      }
    }

    const instances: DriftInstance[] = []
    for (const [key, g] of groups) {
      if (g.indexText === undefined) continue // no exported top-level anchor
      if (g.stateHooks < 4) continue // not a container
      if (g.hasEmitDiag) continue // already instrumented
      if (FIELD_NAME.test(g.indexText)) continue // pure input (field-bound) — out of scope
      const name = key.startsWith('src/components/')
        ? key.slice('src/components/'.length)
        : key
      instances.push({
        file: g.indexPath!,
        line: g.indexLine,
        token: `${name}: stateful container (${g.stateHooks} state hooks) emits 0 emitDiag — add component.state / nav.change on its primary transitions`,
      })
    }
    return instances
  },
  selftest: {
    bad: [
      // A stateful container: 5 hooks, no emitDiag, not field-bound.
      'function Board() {\n' +
        "  const [a, setA] = useState(0)\n" +
        "  const [b, setB] = useState('')\n" +
        '  const [c, setC] = useState(false)\n' +
        '  const [d, setD] = useState<string | null>(null)\n' +
        '  const [e, setE] = useState<number[]>([])\n' +
        '  return <div onClick={() => { setA(1); setB(\'x\'); setC(true); setD(null); setE([]) }}>{a}{b}{String(c)}{d}{e}</div>\n' +
        '}',
      // COMMENT-SAFETY: a commented-out emitDiag and a data-field-name mention in
      // prose must NOT rescue a 4-hook container (useState + useReducer mix).
      '/* historically this grid called emitDiag and rendered data-field-name cells */\n' +
        'function Grid() {\n' +
        "  const [sort, setSort] = useState('asc')\n" +
        '  const [page, setPage] = useState(0)\n' +
        '  const [sel, dispatch] = useReducer((s: string[]) => s, [])\n' +
        "  const [filter, setFilter] = useState('')\n" +
        "  // emitDiag({ type: 'component.state', component: 'Grid', state: 'sorted' })\n" +
        '  return <table onClick={() => setPage(1)}>{sort}{filter}{String(sel)}{setSort ? 1 : 0}</table>\n' +
        '}',
    ],
    good: [
      // Instrumented: 4 hooks but calls emitDiag → out of scope.
      'function Board() {\n' +
        '  const [a, setA] = useState(0)\n' +
        "  const [b, setB] = useState('')\n" +
        '  const [c, setC] = useState(false)\n' +
        '  const [d, setD] = useState(null)\n' +
        "  const open = () => { emitDiag({ type: 'component.state', component: 'Board', state: 'open' }); setA(1) }\n" +
        '  return <div onClick={open}>{a}{b}{String(c)}{d}{setB}{setC}{setD}</div>\n' +
        '}',
      // Pure input: 5 hooks but binds data-field-name at its index → field, not container.
      'function Editor({ name }: { name: string }) {\n' +
        "  const [a, setA] = useState('')\n" +
        '  const [b, setB] = useState(0)\n' +
        '  const [c, setC] = useState(false)\n' +
        '  const [d, setD] = useState(null)\n' +
        '  const [e, setE] = useState(0)\n' +
        '  return <div data-field-name={name}>{a}{b}{String(c)}{d}{e}{setA}{setB}{setC}{setD}{setE}</div>\n' +
        '}',
      // Below the container threshold: only 3 hooks.
      'function Small() {\n' +
        '  const [a, setA] = useState(0)\n' +
        "  const [b, setB] = useState('')\n" +
        '  const [c, setC] = useState(false)\n' +
        '  return <div onClick={() => setA(1)}>{a}{b}{String(c)}{setB}{setC}</div>\n' +
        '}',
      // COMMENT-SAFETY (phantom state): 4 `useState` words live in a JSDoc; only
      // 1 real hook → below threshold → 0.
      '/** legacy container once wired useState useState useState useState for sort/filter/page/select */\n' +
        'function C() {\n' +
        '  const [a, setA] = useState(0)\n' +
        '  return <div onClick={() => setA(1)}>{a}</div>\n' +
        '}',
    ],
  },
}

export default lint
