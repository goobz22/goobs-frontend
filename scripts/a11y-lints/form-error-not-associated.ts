import type { A11yLint, LintFile, Violation } from '../lint-a11y'

/**
 * CLASS: form-error-not-associated (WCAG 3.3.1 / 4.1.2).
 *
 * FieldShell's `inputAriaProps` carries the field's error association:
 * `aria-describedby` -> the helper/error region (plus `aria-invalid`). JSX is
 * later-wins, so a consumer that spreads `{...inputAriaProps}` and THEN writes
 * an explicit `aria-describedby="…"` silently CLOBBERS the shell's error link —
 * the field still styles invalid, but screen readers never hear the message
 * (the Field-USD issue-10 / ConfirmationCodeInput follow-up shape from the
 * 2026-07 audit).
 *
 * DETECTION: inside one JSX opening tag, `...inputAriaProps` followed later in
 * the SAME tag by an explicit `aria-describedby=` attribute.
 *
 * ── ESCAPE HATCHES (encoded in the check, never an ignore-list) ─────────────
 *  1. Explicit `aria-describedby` BEFORE the spread — the shell's link wins
 *     while erroring (the spread only sets the key when a helper shows).
 *  2. A MERGING value — an expression that references `inputAriaProps` (e.g.
 *     `[inputAriaProps['aria-describedby'], hintId].filter(Boolean).join(' ')`)
 *     preserves the error link and is the documented way to add a second id.
 *  2b. The merge behind a VARIABLE — `aria-describedby={describedBy}` where the
 *     local `const describedBy = […, inputAriaProps['aria-describedby']]…`
 *     definition references the bag (the FileDropzone shape): resolved by
 *     looking up the identifier's `const` initializer in the same file.
 *  2c. A SIBLING-SHELL mirror — the value references a `*helperId*` identifier
 *     (the shell's helper-region id naming): a composite range field whose end
 *     input points at the START shell's helper region (DateRange/TimeRange).
 *     The spread's own bag provably carries no association there (the end
 *     shell gets no error prop), and the override IS an error-region link —
 *     the exact association this class protects.
 *  3. Tags with no `...inputAriaProps` spread are out of scope — this class is
 *     specifically about dropping the SHELL's association.
 * Comments are blanked before scanning (apostrophes in comments desync naive
 * quote tracking; JSDoc prose must never fabricate a tag).
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

/** Read a JSX opening tag from `<` to its depth-0 `>` (brace/string aware). */
function readOpeningTag(text: string, tagStart: number): string | null {
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
    if (c === '>' && depth === 0) return text.slice(tagStart, i + 1)
  }
  return null
}

/** The balanced `{…}` inner content starting at `openIdx`. */
function extractBraces(s: string, openIdx: number): string {
  let depth = 0
  let str: string | null = null
  for (let i = openIdx; i < s.length; i++) {
    const c = s[i]
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
    if (c === '{') depth++
    else if (c === '}') {
      depth--
      if (depth === 0) return s.slice(openIdx + 1, i)
    }
  }
  return s.slice(openIdx + 1)
}

function lineOf(text: string, offset: number): number {
  let line = 1
  for (let i = 0; i < offset && i < text.length; i++)
    if (text[i] === '\n') line++
  return line
}

const lint: A11yLint = {
  name: 'form-error-not-associated',
  wcag: '3.3.1, 4.1.2',
  description:
    "A consumer spreads FieldShell's {...inputAriaProps} and then writes an explicit aria-describedby later in the same JSX tag — JSX is later-wins, so the shell's error-region link is silently clobbered and screen readers never hear the validation message. Put the explicit attribute BEFORE the spread, or merge: aria-describedby={[inputAriaProps['aria-describedby'], extraId].filter(Boolean).join(' ')}.",
  check(files: LintFile[]): Violation[] {
    const violations: Violation[] = []
    for (const { path, text: raw } of files) {
      if (!raw.includes('inputAriaProps')) continue
      const text = blankComments(raw)
      const tagRe = /<[A-Za-z][\w.]*/g
      let m: RegExpExecArray | null
      while ((m = tagRe.exec(text))) {
        const tag = readOpeningTag(text, m.index)
        if (!tag) continue
        tagRe.lastIndex = m.index + tag.length
        const spreadIdx = tag.search(/\{\s*\.\.\.\s*inputAriaProps\s*\}/)
        if (spreadIdx < 0) continue
        const after = tag.slice(spreadIdx)
        const attr = /\baria-describedby\s*=\s*/.exec(after)
        if (!attr) continue
        // Hatch 2 — a merging expression referencing inputAriaProps keeps the link.
        const valueStart = spreadIdx + attr.index + attr[0].length
        const valueChar = tag[valueStart]
        const value =
          valueChar === '{'
            ? extractBraces(tag, valueStart)
            : valueChar === '"' || valueChar === "'"
              ? tag.slice(valueStart + 1, tag.indexOf(valueChar, valueStart + 1))
              : ''
        if (/\binputAriaProps\b/.test(value)) continue
        // Hatch 2c — sibling-shell mirror: the value targets a shell helper
        // region id (an error-region link, not a clobber), or FORWARDS another
        // bag's association by reading its ['aria-describedby'] member (the
        // DateRange end-input shape: startInputAriaRef.current['aria-describedby']).
        if (/helperId/i.test(value)) continue
        if (/\[\s*['"]aria-describedby['"]\s*\]/.test(value)) continue
        // Hatch 2b — merge behind a variable: a bare identifier whose local
        // `const` initializer references the bag (or a shell helper id).
        const ident = value.trim()
        if (/^[A-Za-z_$][\w$]*$/.test(ident)) {
          const def = new RegExp(
            `\\bconst\\s+${ident.replace(/\$/g, '\\$')}\\s*=`
          ).exec(text)
          if (def) {
            const init = text.slice(def.index, def.index + 400)
            if (/\binputAriaProps\b/.test(init) || /helperId/i.test(init))
              continue
          }
        }
        violations.push({
          file: path,
          line: lineOf(text, m.index),
          message:
            "explicit aria-describedby AFTER {...inputAriaProps} clobbers the shell's error-region link (JSX later-wins) — screen readers never hear the validation message. Move it before the spread, or merge with inputAriaProps['aria-describedby']",
        })
      }
    }
    return violations
  },
  selftest: {
    bad: [
      '<input id={inputId} {...inputAriaProps} aria-describedby="hint" />',
      '<input\n  id={inputId}\n  {...inputAriaProps}\n  aria-describedby={hintId}\n/>',
    ],
    good: [
      // Explicit BEFORE the spread — the shell's link wins while erroring.
      '<input aria-describedby="hint" {...inputAriaProps} id={inputId} />',
      // Merging expression preserves the error link.
      "<input {...inputAriaProps} aria-describedby={[inputAriaProps['aria-describedby'], hintId].filter(Boolean).join(' ')} />",
      // No shell spread — out of scope for this class.
      '<input aria-describedby="hint" id={id} />',
      // Spread with no explicit override at all.
      '<input id={inputId} {...inputAriaProps} />',
      // Prose in a comment must not fabricate a tag or an attribute.
      "// spread {...inputAriaProps} then aria-describedby= would clobber the shell's link\nconst x = 1",
      // Merge behind a variable (the FileDropzone shape).
      "const describedBy = [hintId, inputAriaProps['aria-describedby']].filter(Boolean).join(' ') || undefined\nexport const Y = () => <input {...inputAriaProps} aria-describedby={describedBy} />",
      // Sibling-shell mirror (the DateRange/TimeRange end-input shape).
      '<input {...inputAriaProps} aria-describedby={startHelperRendered ? startHelperIdRef.current : undefined} />',
      // Mirror via a captured bag ref — forwards an existing association.
      "<input {...inputAriaProps} aria-describedby={\n  startInputAriaRef.current['aria-describedby']\n} />",
    ],
  },
}

export default lint
