'use client'

import React from 'react'
import type { ProjectBoardStyles, ViewState } from './types'
import { getProjectBoardTheme } from '../../theme/projectboard'

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
  const theme = getProjectBoardTheme(styles)
  const isDark = styles?.theme === 'dark'
  const isSacred = styles?.theme === 'sacred'

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

  // Base colors for different themes
  const textColor = isSacred
    ? 'rgba(255, 215, 0, 0.9)'
    : isDark
      ? 'rgba(255, 255, 255, 0.9)'
      : 'rgba(31, 41, 55, 0.9)'

  const hoverTextColor = isSacred
    ? 'rgba(255, 215, 0, 1)'
    : isDark
      ? 'rgba(255, 255, 255, 1)'
      : 'rgba(31, 41, 55, 1)'

  const separatorColor = isSacred
    ? 'rgba(255, 215, 0, 0.5)'
    : isDark
      ? 'rgba(156, 163, 175, 0.6)'
      : 'rgba(107, 114, 128, 0.6)'

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '1rem 1.5rem',
    background: theme.toolbarContainer.background,
    borderBottom: `1px solid ${isSacred ? 'rgba(255, 215, 0, 0.2)' : isDark ? 'rgba(75, 85, 99, 0.5)' : 'rgba(226, 232, 240, 0.8)'}`,
    transition: theme.transition,
  }

  const buttonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    background: 'transparent',
    border: 'none',
    borderRadius: '8px',
    color: textColor,
    fontSize: '0.875rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: theme.transition,
    outline: 'none',
  }

  const separatorStyle: React.CSSProperties = {
    color: separatorColor,
    fontSize: '0.875rem',
    userSelect: 'none',
  }

  const currentViewStyle: React.CSSProperties = {
    color: textColor,
    fontSize: '0.875rem',
    fontWeight: 600,
  }

  return (
    <div style={containerStyle}>
      <button
        type="button"
        onClick={onBack}
        style={buttonStyle}
        onMouseEnter={e => {
          e.currentTarget.style.background = isSacred
            ? 'rgba(255, 215, 0, 0.1)'
            : isDark
              ? 'rgba(75, 85, 99, 0.5)'
              : 'rgba(243, 244, 246, 1)'
          e.currentTarget.style.color = hoverTextColor
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'transparent'
          e.currentTarget.style.color = textColor
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ flexShrink: 0 }}
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
      <span style={separatorStyle}>/</span>
      <span style={currentViewStyle}>{getBreadcrumbText()}</span>
    </div>
  )
}
