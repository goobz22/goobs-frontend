// src/components/Markdown/index.tsx
//
// Read-only markdown renderer. Reuses the same `mdToHtml` converter the
// MarkdownEditor uses for its preview, so what authors see in the editor
// matches what readers see in published content. Pure presentation
// component — no editor chrome, no toolbar, no state.

'use client'

import React, { useMemo } from 'react'
import { mdToHtml } from '../ComplexTextEditor/utils/conversion'

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

  const wrapperStyle: React.CSSProperties = {
    maxWidth: maxWidth > 0 ? maxWidth : undefined,
    margin: maxWidth > 0 && align !== 'left' ? '0 auto' : undefined,
    textAlign: align,
    color: 'inherit',
    lineHeight: 1.65,
    fontSize: 16,
  }

  return (
    <div
      className={className}
      data-testid={rest['data-testid'] ?? 'goobs-markdown'}
      style={wrapperStyle}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

export default Markdown
