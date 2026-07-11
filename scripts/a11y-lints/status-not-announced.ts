import type { A11yLint, LintFile, Violation } from '../lint-a11y'

/**
 * status-not-announced — WCAG 4.1.3 Status Messages.
 *
 * A live region (`role="status"`, `role="alert"`, or a non-off `aria-live`)
 * exists precisely so that a state change — "Copied to clipboard", "Code is
 * invalid", "Uploading…", a changed notification count — is spoken to a
 * screen-reader user WITHOUT moving focus. The 2026-07 audit found two ways a
 * live region is present in the markup yet still announces NOTHING. Both are
 * mechanically detectable with near-zero false positives; the "missing a live
 * region entirely" shape (Badge/Button/BigCalendar) is a semantic judgement per
 * component and is guarded by those components' stories, not by this lint.
 *
 * ── Shape 1 — the label-only live region ────────────────────────────────────
 * A live region that is EMPTY (self-closing, or a body that is only whitespace /
 * JSX comments) but carries `aria-label` / `aria-labelledby`. The "message"
 * rides entirely on the label. Screen readers announce a live region by its
 * CHANGED TEXT CONTENT; they do NOT re-announce a live region when only its
 * `aria-label` mutates — so the status change is completely silent. (This is the
 * exact ConfirmationCodeInput validity-region bug: an empty `<div role="status">`
 * whose only state cue was a swapped `aria-label`.) The fix is to render the
 * message as element CONTENT and drop the label.
 *
 * ── Shape 2 — the muted (aria-hidden) live region ───────────────────────────
 * A live region that ALSO carries `aria-hidden="true"` on the SAME element. It
 * is removed from the accessibility tree, so its content mutations can never be
 * announced. (Same-element only: `aria-hidden` on a decorative spinner/icon that
 * sits NEXT TO the region is the correct, common pattern — CodeCopy, SaveButton,
 * FileDropzone all do this — so a file-level co-occurrence of `aria-live` and
 * `aria-hidden` is NOT a hit; the two attributes must be on the one element.)
 *
 * ── Legitimate escape hatches encoded in the check (never an ignore-list) ────
 *  - `aria-live="off"` is an explicitly MUTED region (a page of static Badges is
 *    not a swarm of announcements) → not treated as a live region.
 *  - An empty live region WITHOUT a label (`<div ref={liveRef} role="status" />`)
 *    is the legitimate imperatively-/re-render-populated placeholder pattern →
 *    Shape 1 requires a label, so it is not flagged.
 *  - A dynamic `role={…}` / `aria-live={…}` (Badge resolves these from props) is
 *    not a literal live-region marker → not flagged (its story covers it).
 */

/** True while `i` sits on the closing `>` of a JSX opening tag (depth 0). */
interface OpenTag {
  /** full opening-tag text, `<tag …>` or `<tag …/>` */
  tag: string
  /** 0-based index in `text` of the `<` */
  start: number
  /** 0-based index in `text` just AFTER the opening tag's `>` */
  bodyStart: number
  selfClosing: boolean
}

/**
 * Scan `text` and yield every JSX opening tag with accurate boundaries. A naive
 * regex mis-handles `>` inside string/expression attribute values
 * (`aria-label="a > b"`, `className={a > b ? x : y}`), so we walk the attribute
 * region tracking string quotes and `{…}` brace depth and only accept a `>` at
 * depth 0 outside any string as the tag terminator.
 */
function openTags(text: string): OpenTag[] {
  const tags: OpenTag[] = []
  // `<` followed by a tag-name start — never matches a closing `</…>` (the `/`
  // is not a name char) nor a fragment `<>`.
  const startRe = /<[A-Za-z][A-Za-z0-9.]*/g
  let m: RegExpExecArray | null
  while ((m = startRe.exec(text))) {
    let i = m.index + m[0].length
    let quote = '' // '"' | "'" | '`' when inside a string, else ''
    let depth = 0 // {…} nesting in expression attribute values
    let selfClosing = false
    for (; i < text.length; i++) {
      const c = text[i]
      if (quote) {
        // Backtick strings can nest `${…}`, but a `>` inside a template is still
        // ignored while `quote` is set, so we don't need brace tracking here.
        if (c === quote && text[i - 1] !== '\\') quote = ''
        continue
      }
      if (c === '"' || c === "'" || c === '`') {
        quote = c
        continue
      }
      if (c === '{') {
        depth++
        continue
      }
      if (c === '}') {
        depth--
        continue
      }
      if (c === '>' && depth === 0) {
        selfClosing = text[i - 1] === '/'
        break
      }
    }
    if (i >= text.length) continue // unterminated (truncated file) — skip
    tags.push({
      tag: text.slice(m.index, i + 1),
      start: m.index,
      bodyStart: i + 1,
      selfClosing,
    })
    startRe.lastIndex = i + 1
  }
  return tags
}

/** A live region declared with LITERAL markers (dynamic role/aria-live is not). */
function isLiveRegion(tag: string): boolean {
  if (/\brole\s*=\s*["'](?:status|alert)["']/.test(tag)) return true
  // aria-live with a literal value that is not the explicitly-muted "off".
  const live = /\baria-live\s*=\s*["'](polite|assertive|off)["']/.exec(tag)
  return live != null && live[1] !== 'off'
}

function hasAriaLabel(tag: string): boolean {
  return /\baria-label(?:ledby)?\s*=/.test(tag)
}

function hasAriaHiddenTrue(tag: string): boolean {
  return /\baria-hidden\s*=\s*(?:["']true["']|\{\s*true\s*\})/.test(tag)
}

/**
 * The element's body (everything after the opening `>` up to its close) carries
 * NO announceable text: it is only whitespace, JSX comments, or a trivial empty
 * expression (`{''}`, `{' '}`, `{null}`, `{false}`, `{undefined}`, `{``}`). We
 * only need to know whether the FIRST real thing after the tag is the close tag.
 */
const TRIVIAL_BODY =
  /^(?:\s+|\{\s*\/\*[\s\S]*?\*\/\s*\}|\{\s*(?:''|""|'\s*'|"\s*"|`\s*`|null|false|undefined)\s*\})+/

function hasEmptyBody(text: string, bodyStart: number): boolean {
  const rest = text.slice(bodyStart).replace(TRIVIAL_BODY, '')
  return rest.startsWith('</')
}

function lineOf(text: string, index: number): number {
  let line = 1
  for (let i = 0; i < index && i < text.length; i++)
    if (text[i] === '\n') line++
  return line
}

const lint: A11yLint = {
  name: 'status-not-announced',
  wcag: '4.1.3',
  description:
    'A live region (role="status"/"alert" or non-off aria-live) that announces nothing: either it is empty and rides its message on an aria-label (screen readers do not re-announce label changes on a live region), or it is aria-hidden and thus removed from the accessibility tree. Render the status as text content and keep the live region in the a11y tree (WCAG 4.1.3).',
  check(files: LintFile[]): Violation[] {
    const violations: Violation[] = []
    for (const { path, text } of files) {
      for (const t of openTags(text)) {
        if (!isLiveRegion(t.tag)) continue
        if (hasAriaHiddenTrue(t.tag)) {
          violations.push({
            file: path,
            line: lineOf(text, t.start),
            message:
              'live region is aria-hidden="true" — it is removed from the accessibility tree and can never announce; drop aria-hidden (put it on the decorative child instead) so the status is spoken (WCAG 4.1.3)',
          })
          continue
        }
        const empty = t.selfClosing || hasEmptyBody(text, t.bodyStart)
        if (empty && hasAriaLabel(t.tag)) {
          violations.push({
            file: path,
            line: lineOf(text, t.start),
            message:
              'empty live region relies on aria-label for its message — screen readers do not re-announce aria-label changes on a live region, so the status change is silent; render the message as element text content and drop the label (WCAG 4.1.3)',
          })
        }
      }
    }
    return violations
  },
  selftest: {
    bad: [
      // Shape 1 — self-closing status region whose only cue is a swapped label
      // (the ConfirmationCodeInput validity-dot bug).
      `<div role="status" aria-label={isValid ? 'Code is valid' : 'Code is invalid'} className={s.dot} />`,
      // Shape 1 — empty body (only a JSX comment) + aria-label on an aria-live region.
      `<div aria-live="polite" aria-label={statusMessage}>{/* message rides on the label */}</div>`,
      // Shape 2 — a live region that is itself aria-hidden, so it never announces.
      `<div role="status" aria-live="polite" aria-hidden="true">{message}</div>`,
    ],
    good: [
      // Content-bearing polite region, no label — announces its changed text.
      `<div role="status" aria-live="polite">{copied ? 'Copied to clipboard' : ''}</div>`,
      // Imperatively-/re-render-populated placeholder: empty but NO label.
      `<div ref={liveRef} role="status" aria-live="polite" />`,
      // Explicitly muted static badge — aria-live="off" is not a live region.
      `<span aria-live="off" aria-label="5 unread" />`,
      // Decorative icon carrying aria-hidden that is NOT a live region.
      `<span aria-hidden="true" className={s.icon}>★</span>`,
      // FileDropzone-shaped multi-state content region, no label.
      `<div role="status" aria-live="polite">{status === 'uploading' ? 'Uploading image...' : status === 'selected' ? 'Image selected' : ''}</div>`,
      // A live region NEXT TO a decorative aria-hidden child (the correct pattern
      // CodeCopy/SaveButton use) — attributes are on different elements.
      `<div role="status" aria-live="polite"><Spinner aria-hidden="true" />{label}</div>`,
    ],
  },
}

export default lint
