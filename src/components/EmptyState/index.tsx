'use client'

/**
 * =============================================================================
 * EMPTYSTATE — standalone empty / zero-data placeholder
 * =============================================================================
 *
 * Promoted out of `<Card.EmptyState>` so it can be used ANYWHERE — not just
 * inside a `<Card.Grid empty={...}>`. Absorbs the ~26 hand-rolled "No X yet"
 * boxes scattered across the ThothOS wizard steps, list panes, and dashboard
 * tiles (e.g. AssigneesStep:347 "No assignees yet").
 *
 *   <EmptyState
 *     icon="👥"
 *     title="No assignees yet"
 *     description="Add a teammate to get started."
 *     actions={<CustomButton text="Add assignee" onClick={open} />}
 *   />
 *
 * Dashed-gold-border centered placeholder. `role="status"` so assistive tech
 * announces the empty condition. Theme tokens follow the same sacred / light /
 * dark CSS-variable convention as the rest of goobs.
 *
 * BACK-COMPAT: `<Card.EmptyState>` is now a thin re-export of this component
 * (see Card/index.tsx) — every existing `<Card.Grid empty={<Card.EmptyState …>}>`
 * callsite keeps working byte-for-byte.
 *
 * =============================================================================
 */

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
