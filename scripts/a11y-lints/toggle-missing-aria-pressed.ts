import type { A11yLint, LintFile, Violation } from '../lint-a11y'

/**
 * CLASS: toggle-missing-aria-pressed (WCAG 1.4.1 use-of-color / 4.1.2 name-role-value).
 *
 * A "toggle button" is a control that maintains an on/off (pressed/unpressed)
 * state the click flips. If the ONLY signal of that state is visual — a
 * conditional `.selected`/`.active` class, an icon swap, a color change — then
 * a screen-reader user hears a plain button and a color-blind / low-vision user
 * can't tell it apart from its neighbours. The WAI-ARIA fix is a programmatic
 * state attribute (`aria-pressed`) that flips with the visual state. This is the
 * shape the 2026-07 audit found across ComplexTextEditor (the rich-text format
 * buttons, the Simple/Rich/Markdown mode switch, and the Markdown "Toggle
 * Preview" button), where active state was conveyed by color alone.
 *
 * ── THE STATICALLY-DETECTABLE SHAPE (what this module enumerates) ────────────
 * A button-like element (`<button>`, or goobs `<Button>`/`<CustomButton>`/
 * `<IconButton>`) whose `onClick` INLINE-FLIPS a boolean React state — the
 * self-evident toggle signature:
 *
 *     onClick={() => setShowPreview(!showPreview)}     // setX(!x)
 *     onClick={() => setDark(v => !v)}                 // setX(v => !v)
 *     onClick={() => setOn(prev => !prev)}             // setX(prev => !prev)
 *
 * A control that flips a boolean on click IS a toggle; if its opening tag
 * exposes NO programmatic state signal, it conveys that state visually-only and
 * is flagged. This is exactly the MarkdownEditor "Toggle Preview" bug. The
 * inline shape is chosen deliberately: it is self-contained in one opening tag
 * (no cross-file data-flow, so no guessing, so few false positives) and it is
 * the highest-frequency way the regression reappears when someone hand-writes a
 * new toggle.
 *
 * ── ESCAPE HATCHES (encoded in the check, never an ignore-list of files) ─────
 * A flipping button is NOT flagged when its opening tag already conveys the
 * state to assistive tech through any of:
 *   • `aria-pressed`   — the canonical toggle-button state (the audit's fix);
 *   • `aria-expanded`  — a DISCLOSURE / combobox / menu / accordion button
 *                        (show/hide a region) correctly uses this, NOT
 *                        aria-pressed — e.g. DataGrid/Footer, Dropdown/Regular,
 *                        MobileCardView/Card, Filter/Section;
 *   • `aria-checked` / `role="switch"|"checkbox"|"menuitemcheckbox"` — switch /
 *                        checkbox semantics carry state via aria-checked;
 *   • `aria-selected` / `role="tab"|"option"|"menuitemradio"|"radio"` — a
 *                        selection within a composite widget uses aria-selected;
 *   • `aria-current`   — "current item" state (e.g. a page/step toggle);
 *   • a STATE-DEPENDENT accessible name — a ternary `aria-label={on ? … : …}`
 *                        (or `title={…?…:…}`) that changes with the same state
 *                        fully conveys it non-visually, so aria-pressed would be
 *                        redundant — e.g. Field/Password's Show/Hide-password
 *                        eye button;
 *   • a prop SPREAD (`{...rest}`) — may supply a state attribute at runtime.
 *
 * ── SIBLING SHAPES THE AUDIT FIXED THAT ARE NOT STATICALLY DETECTABLE HERE ───
 * Two ComplexTextEditor instances share the CLASS but not this detectable
 * signature, so they are (correctly) out of this module's scope — they were
 * fixed by the per-component audit and have no generic, low-false-positive
 * static signature:
 *   • the rich-text format buttons (bold/italic/…): their onClick is
 *     `handleEditorAction('bold')` and the active state comes from
 *     `document.queryCommandState`, not an inline boolean flip;
 *   • the Simple/Rich/Markdown mode switch: goobs `<Button value=…>` children of
 *     an exclusive `<ButtonGroup>` with no per-button onClick — detecting that
 *     needs cross-tag context and would false-flag ordinary button rows.
 * Documented here so a future author knows the boundary rather than re-deriving
 * it; both live behind `aria-pressed` today and stay green under other lints.
 *
 * JSX named only inside comments (JSDoc `@example`) is blanked before scanning,
 * so example toggles in documentation never produce a false positive.
 */

// Button-like opening tags. The `(?=[\s/>])` lookahead stops `<button` from
// matching `<buttonish` and `<Button` from matching `<ButtonGroup`.
const RAW_BUTTON_RE = /<button(?=[\s/>])/g
const GOOBS_BUTTON_RE = /<(?:Button|CustomButton|IconButton)(?=[\s/>])/g

// Inline boolean-flip signatures inside an onClick handler:
//   setX(!x)              -> set\w+\(\s*!
//   setX(v => !v)         -> set\w+\(\s*\(?\s*\w*\s*\)?\s*=>\s*!
//   setX(prev => !prev)   -> (same functional-updater form)
const BOOLEAN_FLIP_RE =
  /\bset[A-Z]\w*\(\s*(?:!|\(?\s*\w*\s*\)?\s*=>\s*!)/

// State signals that satisfy WCAG 4.1.2 for a toggle / disclosure / selection.
const STATE_ATTR_RE =
  /\baria-(?:pressed|expanded|checked|selected|current)\b/
const STATE_ROLE_RE =
  /\brole\s*=\s*['"](?:switch|checkbox|menuitemcheckbox|tab|option|menuitemradio|radio)['"]/
// A state-dependent accessible name: aria-label / title bound to a ternary.
const NAME_TOGGLE_RE = /\b(?:aria-label|title)\s*=\s*\{[^}]*\?[^}]*:[^}]*\}/

const hasOnClick = (body: string) => /\bonClick\s*=/.test(body)
const hasSpread = (body: string) => /\{\s*\.\.\./.test(body)
const hasBooleanFlip = (body: string) => BOOLEAN_FLIP_RE.test(body)
const hasStateSignal = (body: string) =>
  STATE_ATTR_RE.test(body) ||
  STATE_ROLE_RE.test(body) ||
  NAME_TOGGLE_RE.test(body)

/**
 * Replace the CONTENT of `//` line comments and `/* … *\/` block comments with
 * spaces, preserving every newline so byte offsets and line numbers are
 * unchanged. String/template-aware so a `//` inside an `https://` URL string is
 * not mistaken for a comment. Keeps string CONTENT intact (we need
 * `role="switch"` / `aria-label="…"` text) — it only neutralises comments so a
 * JSDoc `@example` toggle is never flagged as real code.
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

/**
 * Read a JSX opening tag starting at `<` (offset `tagStart`), returning the
 * inclusive index of the tag-closing `>` and the tag body. Brace- and
 * string-aware so the `>` inside `onClick={() => f()}` (the arrow, inside `{}`),
 * inside a `` `template ${x}` `` literal, or inside a brace JSX comment is not
 * mistaken for the tag terminator. Returns null if unterminated.
 */
function readOpeningTag(
  text: string,
  tagStart: number
): { end: number; body: string } | null {
  let depth = 0
  let str: string | null = null
  for (let i = tagStart; i < text.length; i++) {
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

const lint: A11yLint = {
  name: 'toggle-missing-aria-pressed',
  wcag: '1.4.1, 4.1.2',
  description:
    'A button-like element (<button> or goobs <Button>/<CustomButton>/<IconButton>) whose onClick inline-flips a boolean state (setX(!x) / setX(v => !v)) is a toggle button; if its opening tag exposes no programmatic state signal it conveys the on/off state visually-only (color / class / icon), invisible to screen-reader and color-blind users. Add aria-pressed (or, for a disclosure, aria-expanded) that flips with the visual state. Escape hatches (encoded in the check): aria-pressed/expanded/checked/selected/current, role=switch/checkbox/tab/option/etc, a state-dependent aria-label/title ternary, or a prop spread. See the module header for the sibling shapes (execCommand toolbars, exclusive ButtonGroup) that are not statically detectable.',
  check(files: LintFile[]): Violation[] {
    const violations: Violation[] = []
    for (const { path, text: raw } of files) {
      // Scan a comment-blanked copy so a JSDoc `@example` toggle is never
      // flagged; offsets / line numbers are identical to the raw source.
      const text = blankComments(raw)
      if (!/set[A-Z]/.test(text)) continue // fast bail — no setters at all
      const nl = newlineIndex(text)

      for (const re of [RAW_BUTTON_RE, GOOBS_BUTTON_RE]) {
        re.lastIndex = 0
        let m: RegExpExecArray | null
        while ((m = re.exec(text))) {
          const tag = readOpeningTag(text, m.index)
          if (!tag) continue
          const { body } = tag
          if (!hasOnClick(body)) continue // not interactive → not a toggle
          if (!hasBooleanFlip(body)) continue // onClick doesn't flip a bool
          if (hasSpread(body)) continue // spread may carry a state attr
          if (hasStateSignal(body)) continue // already conveys state to AT
          violations.push({
            file: path,
            line: offsetToLine(nl, m.index),
            message:
              'toggle button (onClick flips a boolean) has no aria-pressed — its on/off state is conveyed visually only; add aria-pressed (or aria-expanded for a disclosure) that flips with the state',
          })
        }
      }
    }
    return violations
  },
  selftest: {
    bad: [
      // the MarkdownEditor "Toggle Preview" bug: inline setX(!x), no state attr
      'export const A = () => <button onClick={() => setShowPreview(!showPreview)}>Toggle Preview</button>',
      // functional-updater flip on a raw button
      'export const B = () => <button onClick={() => setDark(v => !v)}>Theme</button>',
      // prev-updater flip
      'export const C = () => <button onClick={() => setActive(prev => !prev)}>x</button>',
      // goobs Button flipping a boolean, no aria-pressed
      'export const D = () => <Button onClick={() => setBold(!bold)} text="Bold" />',
      // multi-line opening tag (the `>` in `=>` must not end the tag early)
      `export const E = () => (
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className={styles.btn}
        >
          x
        </button>
      )`,
      // IconButton toggle, only a decorative class carries state
      'export const F = () => <IconButton onClick={() => setStarred(!starred)} className={starred ? styles.on : styles.off} />',
    ],
    good: [
      // the audit's fix: aria-pressed flips with the state
      'export const G = () => <button onClick={() => setShowPreview(!showPreview)} aria-pressed={showPreview}>Toggle Preview</button>',
      // disclosure button correctly uses aria-expanded, not aria-pressed
      'export const H = () => <button onClick={() => setOpen(!open)} aria-expanded={open}>Menu</button>',
      // switch semantics carry state via aria-checked
      'export const I = () => <button role="switch" aria-checked={on} onClick={() => setOn(!on)}>x</button>',
      // tab selection uses aria-selected
      'export const J = () => <button role="tab" aria-selected={sel} onClick={() => setSel(!sel)}>Tab</button>',
      // state-dependent accessible name fully conveys the state (Password eye btn)
      "export const K = () => <button onClick={() => setPlaying(!playing)} aria-label={playing ? 'Pause' : 'Play'}>x</button>",
      // prop spread may supply aria-pressed at runtime — escape hatch
      'export const L = () => <button {...rest} onClick={() => setX(!x)}>x</button>',
      // not a toggle: onClick does not flip a boolean
      'export const M = () => <button onClick={() => save()}>Save</button>',
      // the flip is on a non-button element — out of scope (this class is buttons)
      'export const N = () => <div onClick={() => setX(!x)}>x</div>',
      // goobs Button toggle WITH aria-pressed
      'export const O = () => <Button onClick={() => setBold(!bold)} aria-pressed={bold} text="Bold" />',
      // ButtonGroup is not a button-like tag (lookahead guards it)
      'export const P = () => <ButtonGroup onClick={() => setX(!x)}>x</ButtonGroup>',
    ],
  },
}

export default lint
