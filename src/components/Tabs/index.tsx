'use client'

import React, { useState } from 'react'
import { alpha } from '../../utils'

const SACRED_GOLD = '#FFD700'

export interface TabsItem {
  title?: string
  label?: string
  route?: string
  trigger?: 'route' | 'onClick'
  onClick?: () => void
}

export interface TabsProps {
  items: TabsItem[]
  activeTab?: number
  onChange?: (index: number) => void
  alignment?: 'left' | 'center' | 'right' | 'justify'
  styles?: {
    theme?: string
    padding?: string
    gap?: string
    borderBottom?: string
    height?: string
    tabLeftBorder?: string | boolean
    tabRightBorder?: string | boolean
    backgroundColor?: string
  }
}

const Tabs: React.FC<TabsProps> = ({
  items,
  activeTab = 0,
  onChange,
  alignment = 'center',
  styles,
}) => {
  const [hoveredTab, setHoveredTab] = useState<number | null>(null)

  const handleTabClick = (index: number, tab: TabsItem) => {
    if (onChange) {
      onChange(index)
    }

    if (tab.trigger === 'route' && tab.route) {
      // Use location.assign() instead of direct href assignment to avoid lint error
      window.location.assign(tab.route)
    } else if (tab.trigger === 'onClick' && tab.onClick) {
      tab.onClick()
    }
  }

  // Handle tabLeftBorder - convert boolean to string
  const tabLeftBorderValue =
    styles?.tabLeftBorder === true
      ? `1px solid ${alpha(SACRED_GOLD, 0.3)}`
      : styles?.tabLeftBorder === false
        ? undefined
        : styles?.tabLeftBorder

  // Handle tabRightBorder - convert boolean to string
  const tabRightBorderValue =
    styles?.tabRightBorder === true
      ? `1px solid ${alpha(SACRED_GOLD, 0.3)}`
      : styles?.tabRightBorder === false
        ? undefined
        : styles?.tabRightBorder

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent:
      alignment === 'left'
        ? 'flex-start'
        : alignment === 'right'
          ? 'flex-end'
          : alignment === 'justify'
            ? 'space-between'
            : 'center',
    alignItems: 'center',
    gap: styles?.gap || '8px',
    padding: styles?.padding,
    height: styles?.height,
    marginBottom: '16px',
    borderBottom:
      styles?.borderBottom || `1px solid ${alpha(SACRED_GOLD, 0.2)}`,
    borderLeft: tabLeftBorderValue,
    borderRight: tabRightBorderValue,
    backgroundColor: styles?.backgroundColor,
    flexWrap: 'wrap',
  }

  return (
    <div style={containerStyle}>
      {items.map((tab, index) => {
        const isActive = activeTab === index
        const isHovered = hoveredTab === index
        const label = tab.label || tab.title || ''

        return (
          <Tab
            key={index}
            label={label}
            isActive={isActive}
            isHovered={isHovered}
            onClick={() => handleTabClick(index, tab)}
            onMouseEnter={() => setHoveredTab(index)}
            onMouseLeave={() => setHoveredTab(null)}
          />
        )
      })}
    </div>
  )
}

export interface TabProps {
  label: string
  isActive: boolean
  isHovered?: boolean
  onClick: () => void
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  disabled?: boolean
  styles?: {
    theme?: string
    padding?: string
    fontSize?: string
    fontWeight?: string | number
  }
}

export const Tab: React.FC<TabProps> = ({
  label,
  isActive,
  isHovered = false,
  onClick,
  onMouseEnter,
  onMouseLeave,
  disabled = false,
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled) {
      onClick()
    }
  }

  const getBackgroundColor = () => {
    if (disabled) return 'transparent'
    if (isActive)
      return `linear-gradient(135deg, ${alpha(SACRED_GOLD, 0.2)}, ${alpha(SACRED_GOLD, 0.1)})`
    if (isHovered)
      return `linear-gradient(135deg, ${alpha(SACRED_GOLD, 0.1)}, ${alpha(SACRED_GOLD, 0.05)})`
    return 'transparent'
  }

  const getBorderBottomColor = () => {
    if (disabled) return 'transparent'
    if (isActive) return SACRED_GOLD
    if (isHovered) return alpha(SACRED_GOLD, 0.5)
    return 'transparent'
  }

  const getColor = () => {
    if (disabled) return 'rgba(255, 255, 255, 0.4)'
    if (isActive) return SACRED_GOLD
    if (isHovered) return 'rgba(255, 215, 0, 0.9)'
    return 'rgba(255, 255, 255, 0.7)'
  }

  const tabStyle: React.CSSProperties = {
    position: 'relative',
    padding: '12px 24px',
    background: getBackgroundColor(),
    border: 'none',
    borderBottom: `2px solid ${getBorderBottomColor()}`,
    color: getColor(),
    fontFamily: '"Cinzel", serif',
    fontSize: '14px',
    fontWeight: isActive ? 600 : 400,
    letterSpacing: '0.05em',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.3s ease',
    textShadow: isActive ? `0 0 10px ${alpha(SACRED_GOLD, 0.5)}` : 'none',
    boxShadow: isActive ? `0 0 20px ${alpha(SACRED_GOLD, 0.3)}` : 'none',
    outline: 'none',
    opacity: disabled ? 0.6 : 1,
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      style={tabStyle}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      disabled={disabled}
    >
      {label}
    </button>
  )
}

Tabs.displayName = 'Tabs'
Tab.displayName = 'Tab'

export default Tabs
