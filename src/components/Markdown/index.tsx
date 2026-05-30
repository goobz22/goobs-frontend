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

export interface MarkdownProps {
  /** Markdown source. Empty / nullish renders nothing. */
  children?: string
  /** Maximum content width in px. Defaults to 720. Pass 0 for full-width. */
  maxWidth?: number
  /** Text alignment for the rendered block. */
  align?: 'left' | 'center' | 'right'
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
  className,
  ...rest
}) => {
  const html = useMemo(() => mdToHtml(children), [children])
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
