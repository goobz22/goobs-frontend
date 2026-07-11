import type { A11yLint, LintFile, Violation } from '../lint-a11y'

/**
 * ── missing-keyboard-arrow-nav (WCAG 2.1.1 Keyboard) ────────────────────────
 *
 * A composite-widget container role advertises a specific keyboard interaction
 * model to assistive tech: the WAI-ARIA APG requires that a `menu` / `menubar`
 * / `listbox` / `tree` / `grid` / `treegrid` be navigated with the ARROW keys
 * (a roving tabindex or `aria-activedescendant`), because the widget's OWNED
 * ITEMS (menuitem / option / treeitem / gridcell) are pulled OUT of the Tab
 * sequence. If the container claims one of those roles but no Arrow-key handler
 * exists, keyboard-only and screen-reader users can never reach or operate the
 * items — a hard WCAG 2.1.1 (Keyboard) failure, not a mere APG nicety.
 *
 * This is the class the 2026-07 audit found in the DataGrid: the desktop
 * `role="grid"` had pointer-only cell selection/edit (now fixed by
 * `useGridKeyboardNav` roving the cells in DataGrid/Table/Rows), and the
 * column-actions `role="menu"` popover had menu/menuitem roles but no arrow
 * roving (now fixed by the `handleMenuKeyDown` handlers in DataGrid/Footer and
 * DataGrid/Table/ColumnHeaderRow). One instance is a class: this module
 * enumerates EVERY composite container across src/ and proves each one wires
 * the required Arrow model.
 *
 * ── TARGET ROLES (two families) ─────────────────────────────────────────────
 *
 *   MENU family  — `menu`, `menubar`, `listbox`, `tree`
 *     Items (menuitem / option / treeitem) are DEFINITIONALLY removed from the
 *     Tab order. Arrow-key roving is the ONLY way to reach them → the container
 *     is satisfied ONLY when its component implements Arrow navigation.
 *
 *   GRID family  — `grid`, `treegrid`
 *     A grid may be operated EITHER by roving its cells with the Arrow keys
 *     (single Tab stop — the desktop DataGrid) OR by making each row/cell
 *     individually Tab-focusable (the mobile DataGrid card view, where every
 *     `role="row"` Card is `tabIndex={0}` + Enter/Space). BOTH are keyboard-
 *     operable, so a grid is satisfied by Arrow nav OR an explicit item focus
 *     model. A grid whose rows/cells have NEITHER strands keyboard users.
 *
 * ── SATISFACTION IS COMPONENT-SUBTREE-SCOPED (not single-file) ──────────────
 * The keyboard model routinely lives in a CHILD of the element that carries
 * the role: a `<table role="grid">` (DataGrid/Table/index.tsx) delegates cell
 * roving to its rows component (DataGrid/Table/Rows). So a container role is
 * checked against every non-story file in its OWN directory and below — the
 * handler counts wherever in that subtree it lives. The directory boundary is
 * tight (SearchableSimple in Field/Dropdown/SearchableSimple/ does NOT satisfy
 * a listbox in the SIBLING Field/Dropdown/SearchableHistory/), so delegation is
 * credited without letting an unrelated component's handler mask a real gap.
 *
 * ── WHAT COUNTS AS "HAS ARROW NAV" ──────────────────────────────────────────
 *   1. a quoted Arrow key literal in a keydown comparison — `'ArrowDown'`,
 *      `"ArrowUp"`, `case 'ArrowLeft'` (quotes distinguish a KEY comparison
 *      from an icon import like `ArrowUpward` / `ArrowDropDown`, which are bare
 *      identifiers), OR
 *   2. use of the shared library keyboard primitives `useArrowKeyNav`
 *      (Field/Shell — the four Dropdown listboxes) or `useGridKeyboardNav`
 *      (DataGrid grid cells). A component can delegate entirely to these and
 *      never spell an Arrow literal, so the hook usage counts on its own.
 *
 * ── ESCAPE HATCHES (encoded in the check, never a file ignore-list) ─────────
 *   • Comments/JSDoc are blanked before scanning, so a `role="menu"` mentioned
 *     in a doc-comment or `@example` is never flagged (and a documented Arrow
 *     binding in prose never falsely satisfies).
 *   • GRID family: an explicit item focus model — a `role="row"`/`gridcell`
 *     descendant carrying a `tabIndex` — satisfies the grid (Tab-focusable rows
 *     are operable), distinguishing the Tab-operable mobile card grid from a
 *     genuinely dead one.
 *   • NON-TARGET roles are intentionally NOT flagged: `toolbar` and `tablist`
 *     (their buttons/tabs stay in the Tab order → operable without arrows; a
 *     roving toolbar is an APG SHOULD, not a 2.1.1 MUST), and `radiogroup`
 *     (a group of native `<input type="radio">` gets Arrow navigation from the
 *     browser for free). These are out of scope for a 2.1.1 keyboard-reach gate.
 */

// Container roles whose owned items leave the Tab order → Arrow nav is the ONLY
// reach path. Quoted-exact so `tree` never matches `treegrid`/`treeitem`.
const MENU_ROLE_RE =
  /\brole\s*=\s*['"](menu|menubar|listbox|tree)['"]/g
// Grid roles: operable by Arrow roving OR an explicit item focus model.
const GRID_ROLE_RE = /\brole\s*=\s*['"](treegrid|grid)['"]/g

// A quoted Arrow key literal (a KEY comparison, not an icon identifier).
const ARROW_KEY_RE = /['"]Arrow(?:Up|Down|Left|Right)['"]/
// Shared library keyboard-nav primitives — delegating to these counts even
// when the component spells no Arrow literal itself.
const NAV_HOOK_RE = /\b(?:useArrowKeyNav|useGridKeyboardNav)\b/
// An explicit item focus model on a grid's rows/cells (Tab-focusable items).
const ITEM_ROLE_RE = /\brole\s*=\s*['"](?:row|gridcell|rowheader|columnheader)['"]/
const TABINDEX_RE = /\btabIndex\b/

/**
 * Replace the CONTENT of `//` line comments and block comments with spaces,
 * preserving newlines so byte offsets / line numbers are unchanged. String- and
 * template-literal-aware so a `//` inside a URL string is not treated as a
 * comment. This stops a `role="menu"` inside JSDoc / an `@example` — and a
 * documented Arrow binding written in prose — from being read as real code.
 */
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

function newlineIndex(text: string): number[] {
  const out: number[] = []
  for (let i = 0; i < text.length; i++) if (text[i] === '\n') out.push(i)
  return out
}

function offsetToLine(newlineOffsets: number[], offset: number): number {
  let lo = 0
  let hi = newlineOffsets.length
  while (lo < hi) {
    const mid = (lo + hi) >> 1
    if (newlineOffsets[mid] < offset) lo = mid + 1
    else hi = mid
  }
  return lo + 1
}

/** Directory portion of a forward-slash repo-relative path. */
function dirOf(path: string): string {
  const i = path.lastIndexOf('/')
  return i < 0 ? '' : path.slice(0, i)
}

/** True when `file` is in `dir` or any subdirectory of it. */
function inSubtree(fileDir: string, dir: string): boolean {
  return fileDir === dir || fileDir.startsWith(dir + '/')
}

interface FileFacts {
  dir: string
  hasArrowNav: boolean
  hasItemFocusModel: boolean
}

const lint: A11yLint = {
  name: 'missing-keyboard-arrow-nav',
  wcag: '2.1.1',
  description:
    'A composite-widget container role (menu/menubar/listbox/tree/grid/treegrid) advertises an Arrow-key navigation model, but its component implements none — so its items, which the role removes from the Tab order, are unreachable by keyboard/AT (WCAG 2.1.1). Satisfaction is component-subtree-scoped: a quoted Arrow-key literal, the shared useArrowKeyNav/useGridKeyboardNav hooks, or (grid family only) a Tab-focusable role="row"/gridcell item model anywhere in the container’s own directory. toolbar/tablist/radiogroup are intentionally out of scope (Tab-operable / native).',
  check(files: LintFile[]): Violation[] {
    // Pre-blank every file once and derive its keyboard facts, so the
    // subtree satisfaction scan below is a cheap boolean lookup.
    const facts = new Map<string, FileFacts>()
    const blankedByPath = new Map<string, string>()
    for (const { path, text } of files) {
      const blanked = blankComments(text)
      blankedByPath.set(path, blanked)
      facts.set(path, {
        dir: dirOf(path),
        hasArrowNav: ARROW_KEY_RE.test(blanked) || NAV_HOOK_RE.test(blanked),
        hasItemFocusModel:
          ITEM_ROLE_RE.test(blanked) && TABINDEX_RE.test(blanked),
      })
    }
    const allFacts = [...facts.values()]

    // Does any non-story file in `dir` (or below) satisfy the given predicate?
    const subtreeHas = (dir: string, pick: (f: FileFacts) => boolean): boolean =>
      allFacts.some((f) => inSubtree(f.dir, dir) && pick(f))

    const violations: Violation[] = []

    const scan = (
      re: RegExp,
      family: 'menu' | 'grid',
      path: string,
      blanked: string,
      nl: number[]
    ) => {
      const dir = dirOf(path)
      re.lastIndex = 0
      let m: RegExpExecArray | null
      while ((m = re.exec(blanked))) {
        const role = m[1]
        const arrowOk = subtreeHas(dir, (f) => f.hasArrowNav)
        const gridFocusOk =
          family === 'grid' && subtreeHas(dir, (f) => f.hasItemFocusModel)
        if (arrowOk || gridFocusOk) continue
        violations.push({
          file: path,
          line: offsetToLine(nl, m.index),
          message:
            `role="${role}" advertises a composite-widget keyboard model but ` +
            `no Arrow-key navigation is implemented in its component — the ` +
            `role removes its items from the Tab order, so keyboard/AT users ` +
            `cannot reach them (WCAG 2.1.1). Add roving Arrow/Home/End nav ` +
            `(see Field/Shell useArrowKeyNav or DataGrid useGridKeyboardNav)` +
            (family === 'grid'
              ? ', or make each role="row"/gridcell item Tab-focusable.'
              : '.'),
        })
      }
    }

    for (const { path } of files) {
      const blanked = blankedByPath.get(path)!
      const nl = newlineIndex(blanked)
      scan(MENU_ROLE_RE, 'menu', path, blanked, nl)
      scan(GRID_ROLE_RE, 'grid', path, blanked, nl)
    }
    return violations
  },
  selftest: {
    bad: [
      // listbox with plain-div options, no Arrow handler (the SearchableHistory shape)
      `export const A = () => (
        <div role="listbox">
          <div onClick={pick}>Alpha</div>
          <div onClick={pick}>Beta</div>
        </div>
      )`,
      // menu with menuitems but no Arrow roving
      `export const B = () => (
        <ul role="menu">
          <li role="menuitem" onClick={a}>Copy</li>
          <li role="menuitem" onClick={b}>Delete</li>
        </ul>
      )`,
      // grid whose rows/cells have NO tabIndex and NO Arrow handler
      `export const C = () => (
        <div role="grid">
          <div role="row"><div role="gridcell">1</div></div>
        </div>
      )`,
      // tree with treeitems, no Arrow navigation
      `export const D = () => (
        <div role="tree">
          <div role="treeitem">Root</div>
        </div>
      )`,
      // treegrid, no Arrow and no focusable rows
      'export const E = () => <table role="treegrid"><tbody><tr><td>x</td></tr></tbody></table>',
    ],
    good: [
      // listbox WITH a quoted Arrow-key handler
      `export const F = () => (
        <div role="listbox" onKeyDown={e => { if (e.key === 'ArrowDown') next() }}>
          <div role="option">Alpha</div>
        </div>
      )`,
      // listbox that delegates to the shared useArrowKeyNav hook (no Arrow literal)
      `export const G = () => {
        const onKeyDown = useArrowKeyNav({ count, activeIndex, onActiveIndexChange })
        return <div role="listbox" onKeyDown={onKeyDown}><div role="option">x</div></div>
      }`,
      // grid roved with Arrow keys via useGridKeyboardNav
      `export const H = () => {
        const { moveTo } = useGridKeyboardNav(rows, cols)
        return <table role="grid"><tbody><tr role="row"><td role="gridcell" tabIndex={-1}>c</td></tr></tbody></table>
      }`,
      // grid with a Tab-focusable item model (role="row" + tabIndex), no Arrow needed
      `export const I = () => (
        <div role="grid">
          <div role="row" tabIndex={0} onKeyDown={onKey}>card</div>
        </div>
      )`,
      // role name only appears inside a comment — not real markup
      `export const J = () => {
        // this list is a role="menu" conceptually but rendered as a plain <ul>
        return <ul><li>a</li></ul>
      }`,
      // NON-target roles: toolbar / tablist / radiogroup are operable via Tab / native
      `export const K = () => (
        <>
          <div role="toolbar"><button>Bold</button></div>
          <div role="tablist"><button role="tab">One</button></div>
          <div role="radiogroup"><input type="radio" name="x" /></div>
        </>
      )`,
      // a non-composite role (dialog) is never a target
      'export const L = () => <div role="dialog">hi</div>',
    ],
  },
}

export default lint
