import type { A11yLint, LintFile, Violation } from '../lint-a11y'

/**
 * ── CANONICAL ACTION-VERB VOCABULARY (goobs Tier-2 test-selector contract) ──
 *
 * Every interactive control that *does something* (as opposed to merely
 * *displaying* something) must carry a `data-action="<verb>"` so a single
 * Playwright helper can locate "the save button" / "the delete button" /
 * "the next-page button" regardless of which workspace it lives in or how its
 * visible label drifts ("Create" → "Create New" → "+ Add"). This mirrors the
 * `action` prop already exposed by the goobs `<Button>`/`<IconButton>` and the
 * `[data-action]` selectors the DataGrid toolbar/row already emit. It is the
 * ACTION analogue of `data-field-name` (which anchors INPUT selectors).
 *
 * Verbs are **kebab-case**. The canonical set (extend as new real actions
 * appear — a free-form kebab verb is legal, this list just keeps naming
 * consistent so tests stay stable):
 *
 *   save            submit a create/edit form (the ThothOS SUBMIT_ACTION_SEL —
 *                   LOAD-BEARING, never rename; `SaveButton` emits it)
 *   save-creation   inline DataGrid row-create submit (LOAD-BEARING DataGrid
 *                   test contract — CreationRow/AddCard; do not fold into `save`)
 *   create submit edit delete cancel confirm reset apply review export
 *   close open toggle                 disclosure / menu / overlay open/close/toggle
 *   next back first last prev goto-page goto-step   stepper / pagination stepping
 *   copy add remove clear select search retry upload navigate increment decrement
 *   move-left move-right              DataGrid column reorder (existing contract)
 *   move-all-right move-all-left move-selected-right move-selected-left  TransferList
 *   open-column-menu sort-asc sort-desc manage-columns   DataGrid header (existing)
 *   toggle-password  dismiss  scroll-left scroll-right
 *
 * ── DRIFT-NORMALIZATION DECISIONS (task-mandated audit of the commit family) ──
 * The pre-existing values `save`, `save-creation`, `create`, `confirm`,
 * `cancel-creation`, `save-composite`, `cancel-composite`, `open-column-menu`,
 * `sort-asc`/`sort-desc`, `manage-columns`, `move-left`/`move-right` are all
 * TARGETED BY LIVE TEST SELECTORS (the ThothOS resolver's `SUBMIT_ACTION_SEL`
 * matches `save`; DataGrid Playwright specs match `[data-action="save-creation"]`
 * / `[data-action="open-column-menu"]` — the code comments at those callsites
 * cite the exact selectors). Renaming any of them would silently break a
 * consumer contract, so they are LEFT VERBATIM. `save` stays `save`,
 * `save-creation` stays distinct from `save`, `create`/`confirm` stay as-is.
 * This module only ADDS `data-action` to controls that LACK it; it never
 * rewrites an existing value. See `deferred` in the returned structured result.
 *
 * ── ESCAPE HATCHES (genuine non-actions / self-selecting controls) ──
 * A `<button>`/`<Button>` is NOT flagged when:
 *  1. it already carries `data-action` (or the `action` prop) — satisfied;
 *  2. it is an ARIA composite-widget child that has its OWN established
 *     selector contract: `role="tab"` (Tabs — located via `data-tab-id`/
 *     `data-tab-subject`), or `role` ∈ {menuitem, menuitemradio,
 *     menuitemcheckbox, option, treeitem} (menu/listbox/tree children driven
 *     by ARIA role + owning-widget patterns, not a per-item action verb);
 *  3. (goobs `<Button>`/`<IconButton>` only) it has no literal `onClick` and no
 *     `type="submit"` — a forwarding wrapper or a display-only button — OR it
 *     spreads props (`{...x}`) that may carry `action` at runtime.
 * These are encoded in the CHECK (not an ignore-list of files) so the class
 * stays enforced everywhere.
 *
 * ── WHY NAV CONTROLS ARE STILL ACTIONS ──
 * Pagination first/prev/next/last, breadcrumb crumbs, accordion menu items and
 * stepper steps DO get a verb: a route/page/step change is a real user action a
 * test needs to drive, and each has a distinct verb (`first`/`prev`/`next`/
 * `last`/`goto-page`, `navigate`, `goto-step`). Only `role="tab"` (which already
 * ships `data-tab-id`) is treated as navigation-not-action.
 */

// Opening-tag matchers. The `(?=[\s/>])` lookahead prevents `<button` from
// matching `<buttonish` and `<Button` from matching `<ButtonGroup`.
const RAW_BUTTON_RE = /<button(?=[\s/>])/g
const GOOBS_BUTTON_RE = /<(?:Button|CustomButton|IconButton)(?=[\s/>])/g

// ARIA composite-widget roles whose children self-select via role/owner
// patterns rather than a per-item action verb.
const WIDGET_ROLE_RE =
  /\brole\s*=\s*['"](?:tab|menuitem|menuitemradio|menuitemcheckbox|option|treeitem)['"]/

/**
 * Read a JSX opening tag starting at `<` (offset `tagStart`), returning the
 * inclusive index of the tag-closing `>` and the tag body. Brace- and
 * string-aware so the `>` inside `onClick={() => f()}` (arrow, inside `{}`),
 * inside a `` `template ${x}` `` literal, or inside a brace JSX comment is not
 * mistaken for the tag terminator. Returns null if unterminated.
 */
function readOpeningTag(
  text: string,
  tagStart: number
): { end: number; body: string } | null {
  let depth = 0 // {} nesting depth
  let str: string | null = null // active string/template delimiter
  for (let i = tagStart; i < text.length; i++) {
    const c = text[i]
    if (str) {
      if (c === '\\') {
        i++ // skip escaped char
        continue
      }
      if (c === str) str = null
      continue
    }
    if (c === "'" || c === '"' || c === '`') {
      str = c
      continue
    }
    if (c === '{') {
      depth++
      continue
    }
    if (c === '}') {
      if (depth > 0) depth--
      continue
    }
    if (c === '>' && depth === 0) {
      return { end: i, body: text.slice(tagStart, i + 1) }
    }
  }
  return null
}

function offsetToLine(newlineOffsets: number[], offset: number): number {
  // binary search: count of newlines strictly before `offset`, + 1
  let lo = 0
  let hi = newlineOffsets.length
  while (lo < hi) {
    const mid = (lo + hi) >> 1
    if (newlineOffsets[mid] < offset) lo = mid + 1
    else hi = mid
  }
  return lo + 1
}

function newlineIndex(text: string): number[] {
  const out: number[] = []
  for (let i = 0; i < text.length; i++) if (text[i] === '\n') out.push(i)
  return out
}

const hasOnClick = (body: string) => /\bonClick\s*=/.test(body)
const hasSubmitType = (body: string) => /\btype\s*=\s*['"]submit['"]/.test(body)
const hasDataAction = (body: string) => /\bdata-action\b/.test(body)
const hasActionProp = (body: string) => /\baction\s*=/.test(body)
const hasWidgetRole = (body: string) => WIDGET_ROLE_RE.test(body)
const hasSpread = (body: string) => /\{\s*\.\.\./.test(body)

const lint: A11yLint = {
  name: 'missing-data-action-on-actions',
  wcag: '4.1.2',
  description:
    'Interactive action controls (raw <button> with onClick, or goobs <Button>/<IconButton> used as an action) must carry a canonical kebab-case data-action verb (or the `action` prop) so tests can target them by intent rather than drifting label text — the ACTION analogue of data-field-name. Escape hatches: role="tab"/menuitem/option/etc composite-widget children (own selector contract), and goobs buttons with no literal onClick/type=submit or that spread props. See the module header for the canonical verb vocabulary and drift-normalization decisions.',
  check(files: LintFile[]): Violation[] {
    const violations: Violation[] = []
    for (const { path, text } of files) {
      const nl = newlineIndex(text)

      // Shape A — raw <button ... onClick ...> without data-action.
      RAW_BUTTON_RE.lastIndex = 0
      let m: RegExpExecArray | null
      while ((m = RAW_BUTTON_RE.exec(text))) {
        const tag = readOpeningTag(text, m.index)
        if (!tag) continue
        const { body } = tag
        if (!hasOnClick(body)) continue
        if (hasDataAction(body)) continue
        if (hasWidgetRole(body)) continue
        violations.push({
          file: path,
          line: offsetToLine(nl, m.index),
          message:
            'raw <button> with onClick has no data-action — add a canonical kebab-case action verb (see missing-data-action-on-actions header)',
        })
      }

      // Shape B — goobs <Button>/<IconButton>/<CustomButton> used as an action
      // (literal onClick or type="submit") without an `action`/`data-action` prop.
      GOOBS_BUTTON_RE.lastIndex = 0
      while ((m = GOOBS_BUTTON_RE.exec(text))) {
        const tag = readOpeningTag(text, m.index)
        if (!tag) continue
        const { body } = tag
        if (hasActionProp(body) || hasDataAction(body)) continue
        if (hasSpread(body)) continue // spread may carry `action` at runtime
        if (!hasOnClick(body) && !hasSubmitType(body)) continue
        violations.push({
          file: path,
          line: offsetToLine(nl, m.index),
          message:
            'goobs <Button>/<IconButton> used as an action has no `action` prop — add action="<verb>" (canonical kebab-case, see module header)',
        })
      }
    }
    return violations
  },
  selftest: {
    bad: [
      // raw button, onClick, no data-action
      'export const A = () => <button onClick={() => go()}>Next</button>',
      // multi-line raw button with arrow handler (the `>` in `=>` must not end the tag)
      `export const B = () => (
        <button
          onClick={(e) => { if (ok) submit(e) }}
          className={styles.btn}
        >
          Save
        </button>
      )`,
      // goobs Button used as an action, no action prop
      'export const C = () => <Button text="Copy" onClick={handleCopy} />',
      // goobs IconButton action, no action prop
      'export const D = () => <IconButton onClick={remove} aria-label="Remove">x</IconButton>',
      // CustomButton alias, submit type, no action
      'export const E = () => <CustomButton type="submit" text="Go" />',
    ],
    good: [
      // raw button WITH data-action
      'export const F = () => <button onClick={() => go()} data-action="next">Next</button>',
      // dynamic data-action expression
      "export const G = () => <button onClick={t} data-action={open ? 'close' : 'open'}>x</button>",
      // composite-widget child (tab) — escape hatch
      'export const H = () => <button role="tab" onClick={sel} data-tab-id="a">Tab</button>',
      // menuitem role — escape hatch
      'export const I = () => <button role="menuitem" onClick={pick}>Pick</button>',
      // non-interactive raw button (no onClick) — not an action
      'export const J = () => <button className={styles.x}>label</button>',
      // goobs Button WITH action prop
      'export const K = () => <Button action="save" text="Save" onClick={s} />',
      // goobs Button dynamic action prop
      "export const L = () => <Button action={mode} onClick={s} text='Go' />",
      // goobs Button that spreads props (may carry action) — escape hatch
      'export const M = () => <Button {...rest} onClick={s} text="Go" />',
      // goobs Button display-only (no onClick, no submit) — not flagged
      'export const N = () => <Button text="Static" styles={{ theme }} />',
      // goobs Button with data-action instead of action prop
      'export const O = () => <Button data-action="copy" onClick={c} text="Copy" />',
    ],
  },
}

export default lint
