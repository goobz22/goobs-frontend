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
    <div className={cssStyles.breadcrumb} data-theme={theme}>
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
      <span className={cssStyles.breadcrumbSeparator}>/</span>
      <span className={cssStyles.breadcrumbCurrent}>{getBreadcrumbText()}</span>
    </div>
  )
}
