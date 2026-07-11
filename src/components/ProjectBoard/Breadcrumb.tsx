'use client'

import React from 'react'
import type { ProjectBoardStyles, ViewState } from './types'
import cssStyles from './ProjectBoard.module.css'

interface BreadcrumbProps {
  viewState: ViewState
  onBack: () => void
  styles?: ProjectBoardStyles
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  viewState,
  onBack,
  styles,
}) => {
  // Old code's isSacred/isDark checks fell through to light when no theme was
  // given; preserve that exact default.
  const theme = styles?.theme ?? 'light'

  // Determine the breadcrumb text based on view state
  const getBreadcrumbText = () => {
    switch (viewState) {
      case 'addTask':
        return 'Create Task'
      case 'showTask':
        return 'Manage Task'
      default:
        return 'Board'
    }
  }

  return (
    // Real breadcrumb landmark per the WAI-ARIA breadcrumb pattern: a <nav>
    // labelled "Breadcrumb" wrapping an ordered list, so assistive tech
    // announces it as a navigation region with a two-item trail (SEO-crawlable
    // list markup too). WCAG 1.3.1 / 2.4.6.
    <nav
      aria-label="Breadcrumb"
      className={cssStyles.breadcrumb}
      data-theme={theme}
    >
      <ol className={cssStyles.breadcrumbList}>
        <li className={cssStyles.breadcrumbItem}>
          <button
            type="button"
            onClick={onBack}
            className={cssStyles.breadcrumbButton}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={cssStyles.breadcrumbIcon}
              // Decorative back-chevron — the adjacent "Board" text already
              // names the control, so hide the glyph from AT (WCAG 1.1.1).
              aria-hidden="true"
              focusable="false"
            >
              <path
                d="M10 12L6 8L10 4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Board</span>
          </button>
          <span className={cssStyles.breadcrumbSeparator} aria-hidden="true">
            /
          </span>
        </li>
        <li className={cssStyles.breadcrumbItem}>
          {/* Current view — flagged aria-current="page" so screen readers
              announce it as the current location (WCAG 4.1.2). */}
          <span className={cssStyles.breadcrumbCurrent} aria-current="page">
            {getBreadcrumbText()}
          </span>
        </li>
      </ol>
    </nav>
  )
}
