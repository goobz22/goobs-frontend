'use client'
import React, { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { getTabsStyles } from '../../theme'
import type { TabsStyles } from '../../theme'

export interface TabsItem {
  title?: string
  route?: string
  trigger?: 'route' | 'onClick'
  onClick?: () => void
}

export interface ActiveTabValue {
  tabId: string | false
}

export interface TabsProps {
  items: TabsItem[]
  alignment?: 'left' | 'center' | 'right' | 'justify'
  navname?: string
  /** Comprehensive styling options including theme, custom colors, and layout properties */
  styles?: TabsStyles
  /** @deprecated Use styles.theme instead */
  sacredtheme?: boolean
}

function Tabs({
  items,
  alignment = 'left',
  navname = '',
  styles,
  sacredtheme = false,
}: TabsProps) {
  const [activeTabValues, setActiveTabValues] = useState<
    Record<string, ActiveTabValue>
  >({})
  const [hoveredTab, setHoveredTab] = useState<string | null>(null)
  const pathname = usePathname()

  // Handle backwards compatibility with sacredtheme prop
  const effectiveStyles = {
    ...styles,
    theme: styles?.theme || (sacredtheme ? 'sacred' : 'light'),
    alignment: styles?.alignment || alignment,
  } as TabsStyles

  const computedStyles = getTabsStyles(
    effectiveStyles,
    hoveredTab,
    activeTabValues[navname]?.tabId as string
  )

  useEffect(() => {
    const currentTab = items.find(item => item.route === pathname)
    setActiveTabValues(prev => ({
      ...prev,
      [navname]: { tabId: currentTab?.title || false },
    }))
  }, [items, navname, pathname])

  const handleTabChange = (newValue: string) => {
    setActiveTabValues(prev => ({
      ...prev,
      [navname]: { tabId: newValue },
    }))
  }

  const handleTabClick = (tab: TabsItem) => {
    if (tab.title) {
      handleTabChange(tab.title)
    }

    if (tab.trigger === 'route' && tab.route) {
      window.location.href = tab.route
    } else if (tab.trigger === 'onClick' && tab.onClick) {
      tab.onClick()
    }
  }

  return (
    <div style={computedStyles.container}>
      <div style={computedStyles.tabsContainer}>
        <div style={computedStyles.tabsInnerContainer}>
          {items.map(item => {
            const isActive = activeTabValues[navname]?.tabId === item.title
            const isHovered = hoveredTab === item.title

            const tabStyle: React.CSSProperties = {
              ...computedStyles.tab,
              ...(isHovered && !isActive && computedStyles.tabHover),
              ...(isActive && computedStyles.tabActive),
              ...computedStyles.tabLeftBorder,
              ...computedStyles.tabRightBorder,
            }

            const tabIndicatorStyle: React.CSSProperties = {
              ...computedStyles.tabIndicator,
              ...(isActive && computedStyles.tabIndicatorActive),
            }

            return (
              <button
                key={item.title}
                onClick={() => handleTabClick(item)}
                style={tabStyle}
                onMouseEnter={() => setHoveredTab(item.title || '')}
                onMouseLeave={() => setHoveredTab(null)}
              >
                <div style={tabIndicatorStyle} />
                <div style={computedStyles.tabContent}>
                  <span>{item.title || ''}</span>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// Individual Tab component for standalone use
export interface TabProps {
  children?: React.ReactNode
  value?: string | number
  label?: string
  disabled?: boolean
  styles?: TabsStyles
  onClick?: () => void
}

export const Tab: React.FC<TabProps> = ({
  children,
  value,
  label,
  disabled = false,
  styles,
  onClick,
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false)

  const computedStyles = getTabsStyles(
    styles,
    isHovered ? String(value) : null,
    ''
  )

  const tabStyle: React.CSSProperties = {
    ...computedStyles.tab,
    ...(isHovered && computedStyles.tabHover),
    ...(disabled && { opacity: 0.6, pointerEvents: 'none' }),
  }

  return (
    <button
      style={tabStyle}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      <div style={computedStyles.tabContent}>
        <span>{label}</span>
        {children}
      </div>
    </button>
  )
}

export default Tabs
