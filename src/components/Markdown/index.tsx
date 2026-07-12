// src/components/Markdown/index.tsx
//
// Read-only markdown renderer. Reuses the same `mdToHtml` converter the
// MarkdownEditor uses for its preview, so what authors see in the editor
// matches what readers see in published content. Pure presentation
// component — no editor chrome, no toolbar, no state.

'use client'

import React, { useMemo, type CSSProperties } from 'react'
import { mdToHtml } from '../ComplexTextEditor/utils/conversion'
import cssStyles from './Markdown.module.css'

/** Local class joiner — repo has no clsx/classnames dependency. */
function mergeClassNames(...names: Array<string | undefined>): string {
  return names.filter(Boolean).join(' ')
}

/**
 * Make each injected `<pre>` code block keyboard-operable and screen-reader
 * navigable (WCAG 2.1.1 Keyboard).
 *
 * `mdToHtml` emits bare `<pre><code>…</code></pre>`, and `Markdown.module.css`
 * gives `.root pre` `overflow-x: auto` so a long code line scrolls INSIDE its
 * own box instead of widening the page (WCAG 1.4.10 Reflow). But a scroll
 * container that has no `tabindex` and no focusable children is unreachable by
 * keyboard: a keyboard-only user in a browser that does not auto-focus scroll
 * containers (Safari; older Chromium) cannot scroll it to read the clipped
 * code. This is the exact failure axe flags as `scrollable-region-focusable`
 * (Serious).
 *
 * `tabindex="0"` makes the block focusable so it can be scrolled with the arrow
 * keys; `role="region"` + a unique `aria-label` exposes it as a labelled,
 * navigable region. The label is numbered when a single block emits more than
 * one code block so axe `landmark-unique` stays clean within the instance. (A
 * component cannot dedupe labels ACROSS sibling instances on a host page — that
 * residual is a best-practice, not a WCAG failure, and is strictly better than
 * the Serious keyboard failure it replaces.)
 *
 * Because `mdToHtml` HTML-escapes the source before building tags, the only
 * literal `<pre>` tokens in `html` are the converter's own — a source `<pre>`
 * arrives as `&lt;pre&gt;` and is never matched.
 */
function makeCodeBlocksAccessible(html: string): string {
  const total = (html.match(/<pre>/g) ?? []).length
  if (total === 0) return html
  let index = 0
  return html.replace(/<pre>/g, () => {
    index += 1
    const label = total > 1 ? `Code block ${index}` : 'Code block'
    return `<pre tabindex="0" role="region" aria-label="${label}">`
  })
}

/**
 * Shift every rendered `<h1>`–`<h6>` heading DOWN by `offset` levels, clamped to
 * the legal `<h1>`–`<h6>` range.
 *
 * `mdToHtml` maps a leading `#`/`##`/`###`/`####` to a literal `<h1>`–`<h4>`, so
 * an embedded block dropped mid-page can emit a second `<h1>` and break the
 * document outline / SEO heading order. A consumer sets `headingOffset` to
 * demote the block's headings beneath an existing page heading. `0` (the
 * default) leaves headings untouched, so existing callers are unaffected.
 *
 * The level digit lives in both the opening and closing tag, so a single
 * pass over `<hN>` / `</hN>` shifts a heading's two tags consistently. Source
 * text is HTML-escaped by `mdToHtml`, so only the converter's real heading tags
 * match (never `<hr>`, `<header>`, or an escaped literal in code).
 */
function shiftHeadingLevels(html: string, offset: number): string {
  if (!offset) return html
  return html.replace(
    /<(\/?)h([1-6])>/g,
    (_match, slash: string, level: string) => {
      const shifted = Math.min(6, Math.max(1, Number(level) + offset))
      return `<${slash}h${shifted}>`
    }
  )
}

export interface MarkdownProps {
  /** Markdown source. Empty / nullish renders nothing. */
  children?: string
  /** Maximum content width in px. Defaults to 720. Pass 0 for full-width. */
  maxWidth?: number
  /** Text alignment for the rendered block. */
  align?: 'left' | 'center' | 'right'
  /**
   * Shift every rendered heading DOWN by this many levels so an embedded block
   * can slot beneath an existing page heading instead of emitting a second
   * `<h1>` (document-outline / SEO correctness). Levels are clamped to the
   * legal `<h1>`–`<h6>` range; `0` (the default) leaves headings untouched, so
   * existing callers are unaffected. Example: a block whose source starts with
   * `#` renders `<h3>` when `headingOffset={2}`.
   */
  headingOffset?: number
  /** Optional className passed through to the wrapper. */
  className?: string
  /** Optional data-testid hook for tests / instrumentation. */
  'data-testid'?: string
}

/**
 * Render a markdown string as a styled block. Wraps `mdToHtml` output in a
 * styled container with sensible defaults for paragraph spacing, link
 * color, list indentation, code-block monospace, and image responsiveness.
 *
 * Safe by construction: `mdToHtml` escapes user input before building tags
 * so dangerouslySetInnerHTML cannot inject arbitrary HTML from the source.
 */
export const Markdown: React.FC<MarkdownProps> = ({
  children = '',
  maxWidth = 720,
  align = 'left',
  headingOffset = 0,
  className,
  ...rest
}) => {
  // Convert once, then post-process the injected HTML for a11y correctness
  // (both steps operate on the converter's own tags — `mdToHtml` escapes the
  // source, so no user content is matched): demote heading levels for embedded
  // blocks (document outline / SEO) and make `<pre>` code blocks keyboard-
  // scrollable (WCAG 2.1.1). Neither step adds/removes/renames any existing
  // `data-*`/role/aria attribute or changes an element, so the machine-test
  // selector contract is untouched.
  const html = useMemo(() => {
    const raw = mdToHtml(children)
    if (!raw) return ''
    return makeCodeBlocksAccessible(shiftHeadingLevels(raw, headingOffset))
  }, [children, headingOffset])
  if (!html) return null

  const fullWidth = maxWidth <= 0

  // Caller-supplied runtime value rides in as a CSS custom property (recipe
  // rule 3); the selector that consumes it lives in the module's .root class.
  const dynamicStyle: CSSProperties = {
    ['--md-max-width' as string]: fullWidth ? 'none' : `${maxWidth}px`,
  }

  return (
    <div
      className={mergeClassNames(cssStyles.root, className)}
      data-component="Markdown"
      data-testid={rest['data-testid'] ?? 'goobs-markdown'}
      data-align={align}
      data-full-width={fullWidth ? 'true' : undefined}
      style={dynamicStyle}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

export default Markdown
