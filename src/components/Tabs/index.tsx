'use client'
import React, { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

export interface TabsItem {
  title?: string
  route?: string
  trigger?: 'route' | 'onClick'
  onClick?: () => void
  hasleftborder?: boolean
  hasrightborder?: boolean
}

export interface ActiveTabValue {
  tabId: string | false
}

export interface TabsProps {
  items: TabsItem[]
  height?: string
  alignment?: 'left' | 'center' | 'right' | 'justify'
  navname?: string
  sacredtheme?: boolean
  className?: string
  style?: React.CSSProperties
}

const premiumStyles = {
  container: {
    position: 'sticky',
    top: 0,
    zIndex: 50,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgb(0,0,0)',
    color: 'white',
  } as React.CSSProperties,
  tabsContainer: {
    width: '100%',
    height: '100%',
  } as React.CSSProperties,
  tabsInnerContainer: {
    height: '100%',
    display: 'flex',
    position: 'relative',
  } as React.CSSProperties,
  tab: {
    height: '100%',
    padding: '0 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 500,
    fontSize: '16px',
    transition: 'all 0.3s ease',
    position: 'relative',
    boxSizing: 'border-box',
    fontFamily: 'Merriweather, serif',
    border: 'none',
    backgroundColor: 'transparent',
    color: 'white',
    cursor: 'pointer',
  } as React.CSSProperties,
  tabHover: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  } as React.CSSProperties,
  tabActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: 'white',
  } as React.CSSProperties,
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '2px',
    transition: 'all 0.3s ease',
    backgroundColor: 'transparent',
  } as React.CSSProperties,
  tabIndicatorActive: {
    backgroundColor: 'white',
    height: '2px',
  } as React.CSSProperties,
  border: {
    borderLeft: '1px solid white',
  } as React.CSSProperties,
}

const sacredStyles = {
  container: {
    ...premiumStyles.container,
    backgroundColor: 'rgb(0,0,0)',
    color: '#FFD700',
    borderBottom: '2px solid rgba(255, 215, 0, 0.4)',
    animation: 'sacred-glow-pulse 2s infinite alternate',
    boxShadow: '0 0 20px rgba(255, 215, 0, 0.3)',
  } as React.CSSProperties,
  tabsContainer: premiumStyles.tabsContainer,
  tabsInnerContainer: premiumStyles.tabsInnerContainer,
  tab: {
    ...premiumStyles.tab,
    fontFamily: '"Cinzel", serif',
    letterSpacing: '0.05em',
    color: 'rgba(255, 215, 0, 0.8)',
  } as React.CSSProperties,
  tabHover: {
    color: '#FFD700',
    textShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
    animation: 'sacred-shimmer 1s forwards',
  } as React.CSSProperties,
  tabActive: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    color: '#FFD700',
    fontWeight: 600,
    textShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
  } as React.CSSProperties,
  tabIndicator: {
    ...premiumStyles.tabIndicator,
  } as React.CSSProperties,
  tabIndicatorActive: {
    backgroundColor: '#FFD700',
    height: '4px',
    boxShadow: '0 0 10px rgba(255, 215, 0, 0.8)',
  } as React.CSSProperties,
  border: {
    borderLeft: '1px solid rgba(255, 215, 0, 0.3)',
  } as React.CSSProperties,
  glyph: {
    fontSize: '12px',
    opacity: 0.6,
    animation: 'glyph-rotate 10s linear infinite',
  } as React.CSSProperties,
  tabContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  } as React.CSSProperties,
}

function Tabs({
  items,
  height = '48px',
  alignment = 'left',
  navname = '',
  sacredtheme = false,
  className,
  style,
}: TabsProps) {
  const [activeTabValues, setActiveTabValues] = useState<
    Record<string, ActiveTabValue>
  >({})
  const [hoveredTab, setHoveredTab] = useState<string | null>(null)
  const pathname = usePathname()
  const styles = sacredtheme ? sacredStyles : premiumStyles

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

  const alignmentStyles = {
    left: { justifyContent: 'flex-start' },
    center: { justifyContent: 'center' },
    right: { justifyContent: 'flex-end' },
    justify: { justifyContent: 'space-between' },
    inherit: { justifyContent: 'flex-start' },
  }

  const containerStyle: React.CSSProperties = {
    ...styles.container,
    height,
    minHeight: height,
    ...style,
  }

  return (
    <div style={containerStyle} className={className}>
      <div style={styles.tabsContainer}>
        <div
          style={{
            ...styles.tabsInnerContainer,
            ...alignmentStyles[alignment],
          }}
        >
          {items.map((item, index) => {
            const isActive = activeTabValues[navname]?.tabId === item.title
            const isHovered = hoveredTab === item.title

            const tabStyle: React.CSSProperties = {
              ...styles.tab,
              ...(isHovered && !isActive && styles.tabHover),
              ...(isActive && styles.tabActive),
              ...(item.hasleftborder && styles.border),
              ...(item.hasrightborder && {
                ...styles.border,
                borderRight: styles.border.borderLeft,
                borderLeft: 'none',
              }),
            }

            const tabIndicatorStyle: React.CSSProperties = {
              ...styles.tabIndicator,
              ...(isActive && styles.tabIndicatorActive),
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
                <div style={sacredStyles.tabContent}>
                  {sacredtheme && (
                    <span
                      style={{
                        ...sacredStyles.glyph,
                        animation: `glyph-rotate ${10 + index * 2}s linear infinite`,
                      }}
                    >
                      {index % 2 === 0 ? '𓊹' : '𓋹'}
                    </span>
                  )}
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

export default Tabs
