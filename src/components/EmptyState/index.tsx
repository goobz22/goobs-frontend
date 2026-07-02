'use client'

import React, { forwardRef, type ReactNode } from 'react'
import { emitDiag } from '../../utils/diag'
import cssStyles from './EmptyState.module.css'

export type EmptyStateTheme = 'sacred' | 'light' | 'dark'

export interface EmptyStateProps {
  /** Optional leading icon / glyph (emoji or SVG node). */
  icon?: ReactNode
  /** Primary heading (e.g. "No assignees yet"). */
  title: ReactNode
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
 * box with an optional icon, a required title, an optional description line,
 * and an optional actions slot. Renders with `role="status"` so assistive
 * tech announces the empty condition, and emits a `component.state: 'empty'`
 * diagnostics beacon on mount (a no-op when no host bus is present). Theming
 * via `styles.theme` (default `'sacred'`). `<Card.EmptyState>` is a thin
 * re-export of this component, so it works both standalone and inside
 * `<Card.Grid empty={…}>`.
 */
const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(
  function EmptyState({ icon, title, description, actions, styles }, ref) {
    const theme = styles?.theme ?? 'sacred'

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
        <p className={cssStyles.emptyStateTitle}>{title}</p>
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
