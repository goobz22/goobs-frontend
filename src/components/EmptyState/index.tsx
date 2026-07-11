'use client'

import React, { forwardRef, type ReactNode, type ElementType } from 'react'
import { emitDiag } from '../../utils/diag'
import cssStyles from './EmptyState.module.css'

export type EmptyStateTheme = 'sacred' | 'light' | 'dark'

export interface EmptyStateProps {
  /** Optional leading icon / glyph (emoji or SVG node). */
  icon?: ReactNode
  /** Primary heading (e.g. "No assignees yet"). */
  title: ReactNode
  /**
   * Semantic level for the `title` heading — the title renders as a real
   * `<h1>`–`<h6>` element (not a styled `<p>`) so screen-reader users can
   * navigate to it by heading and crawlers see a genuine heading. Set this to
   * match the placeholder's position in the surrounding document outline
   * (e.g. `3` inside an `<h2>` section). Default `2`.
   */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6
  /** Optional secondary explanatory line. */
  description?: ReactNode
  /** One or more action element(s) — typically a `<CustomButton>`. */
  actions?: ReactNode
  /** Theming. Default `'sacred'`. */
  styles?: { theme?: EmptyStateTheme }
}

function emptyStateTitleText(title: ReactNode): string | undefined {
  return typeof title === 'string' ? title : undefined
}

/**
 * Standalone empty / zero-data placeholder: a centered, dashed-accent-border
 * box with an optional icon, a required title (rendered as a real
 * `<h1>`–`<h6>` — level via `headingLevel`, default `2`), an optional
 * description line, and an optional actions slot. Renders with `role="status"`
 * so assistive tech announces the empty condition, and emits a
 * `component.state: 'empty'` diagnostics beacon on mount (a no-op when no host
 * bus is present). Theming via `styles.theme` (default `'sacred'`).
 * `<Card.EmptyState>` is a thin re-export of this component, so it works both
 * standalone and inside `<Card.Grid empty={…}>`.
 */
const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(
  function EmptyState(
    { icon, title, headingLevel = 2, description, actions, styles },
    ref
  ) {
    const theme = styles?.theme ?? 'sacred'
    // The title is the placeholder's heading — render it as a genuine heading
    // element (never a styled <p>) so it is reachable by heading navigation and
    // is a real heading in the SSR'd/crawled HTML. `.emptyStateTitle` resets the
    // element's default margin/size, so visual output is unchanged.
    const HeadingTag = `h${headingLevel}` as ElementType

    // Surface the empty-state appearance on the host diagnostics bus so tests
    // can assert "the list rendered its empty placeholder" without scraping
    // DOM text. No-op when no host bus is present (production / non-diag host).
    const subject = emptyStateTitleText(title)
    React.useEffect(() => {
      emitDiag({
        type: 'component.state',
        component: 'EmptyState',
        ...(subject !== undefined && { subject }),
        state: 'empty',
      })
    }, [subject])

    return (
      <div
        ref={ref}
        className={cssStyles.emptyState}
        data-component="EmptyState"
        data-theme={theme}
        data-empty-state="true"
        role="status"
      >
        {icon !== undefined && (
          <div className={cssStyles.emptyStateIcon} aria-hidden="true">
            {icon}
          </div>
        )}
        <HeadingTag className={cssStyles.emptyStateTitle}>{title}</HeadingTag>
        {description !== undefined && (
          <p className={cssStyles.emptyStateDescription}>{description}</p>
        )}
        {actions !== undefined && (
          <div className={cssStyles.emptyStateActions}>{actions}</div>
        )}
      </div>
    )
  }
)

EmptyState.displayName = 'EmptyState'

export default EmptyState
