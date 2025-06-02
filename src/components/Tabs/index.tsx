'use client'
import React, { useState, useEffect } from 'react'
import { AppBar, Tabs as MuiTabs, Tab, keyframes, alpha } from '@mui/material'
import { usePathname } from 'next/navigation'
// Import your black palette color
import { black } from '../../styles/palette'

// Sacred theming animations
const sacredShimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`

const glowPulse = keyframes`
  0% { box-shadow: 0 0 5px rgba(255, 215, 0, 0.5); }
  50% { box-shadow: 0 0 15px rgba(255, 215, 0, 0.8); }
  100% { box-shadow: 0 0 5px rgba(255, 215, 0, 0.5); }
`

export interface TabsItem {
  title?: string
  route?: string
  trigger?: 'route' | 'onClick'
  onClick?: () => void
  hasleftborder?: string
  hasrightborder?: string
}

export interface ActiveTabValue {
  tabId: string | false
}

export interface TabsProps {
  items: TabsItem[]
  height?: string
  alignment?: 'left' | 'center' | 'right' | 'inherit' | 'justify'
  navname?: string
  sacredTheme?: boolean
}

/**
 * A horizontal navigation component, built with MUI Tabs.
 */
function Tabs({
  items,
  height = '48px',
  alignment = 'left',
  navname = '',
  sacredTheme = false,
}: TabsProps) {
  const [activeTabValues, setActiveTabValues] = useState<
    Record<string, ActiveTabValue>
  >({})
  const pathname = usePathname()

  useEffect(() => {
    // Find the item whose route matches the current path
    const currentTab = items.find(item => item.route === pathname)
    setActiveTabValues(prev => ({
      ...prev,
      [navname]: { tabId: currentTab?.title || false },
    }))
  }, [items, navname, pathname])

  /**
   * When user changes tab via click, update the activeTabValues record.
   */
  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTabValues(prev => ({
      ...prev,
      [navname]: { tabId: newValue },
    }))
  }

  /**
   * Called when a tab is clicked:
   * - if trigger='route', navigate to the route
   * - if trigger='onClick', call onClick
   */
  const handleTabClick = (tab: TabsItem) => {
    if (tab.trigger === 'route' && tab.route) {
      window.location.href = tab.route
    } else if (tab.trigger === 'onClick' && tab.onClick) {
      tab.onClick()
    }
  }

  return (
    <AppBar
      position="sticky"
      elevation={0} // Remove MUI's default shadow
      sx={{
        backgroundColor: sacredTheme ? '#0a0a0a' : black.main,
        color: sacredTheme ? '#FFD700' : '#fff',
        overflow: 'hidden',
        height,
        minHeight: height,
        display: 'flex',
        justifyContent: 'center',
        boxShadow: sacredTheme ? `0 0 20px ${alpha('#FFD700', 0.3)}` : 'none',
        ...(sacredTheme && {
          borderBottom: `2px solid ${alpha('#FFD700', 0.4)}`,
          backgroundImage: `
            linear-gradient(rgba(255, 215, 0, 0.03), rgba(255, 215, 0, 0.03)),
            radial-gradient(circle at top center, rgba(255, 215, 0, 0.1) 0%, transparent 70%)
          `,
          animation: `${glowPulse} 3s ease-in-out infinite`,
        }),
      }}
    >
      <MuiTabs
        value={activeTabValues[navname]?.tabId || false}
        onChange={handleTabChange}
        variant="fullWidth"
        aria-label="nav tabs"
        sx={{
          backgroundColor: sacredTheme ? 'transparent' : black.main,
          height: '100%',
          '& .MuiTabs-flexContainer': {
            height: '100%',
            display: 'flex',
            justifyContent: alignment === 'left' ? 'flex-start' : alignment,
            backgroundColor: sacredTheme ? 'transparent' : black.main,
          },
          '& .MuiTabs-indicator': {
            backgroundColor: sacredTheme ? '#FFD700' : '#fff',
            height: sacredTheme ? '3px' : '2px',
            ...(sacredTheme && {
              boxShadow: '0 0 10px rgba(255, 215, 0, 0.8)',
            }),
          },
          '& .MuiTab-root': {
            height: '100%',
            minHeight: 'unset',
            display: 'flex',
            alignItems: 'center',
            textTransform: 'none',
            boxSizing: 'border-box',
            backgroundColor: sacredTheme ? 'transparent' : black.main,
            color: sacredTheme ? alpha('#FFD700', 0.8) : '#fff',
            fontWeight: 500,
            fontFamily: sacredTheme ? '"Cinzel", serif' : 'Merriweather',
            fontSize: 16,
            transition: 'all 0.3s ease',
            position: 'relative',
            ...(sacredTheme && {
              letterSpacing: '1px',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background:
                  'linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.1), transparent)',
                backgroundSize: '200% 100%',
                opacity: 0,
                transition: 'opacity 0.3s ease',
              },
            }),
            '&:hover': {
              backgroundColor: sacredTheme
                ? 'transparent'
                : 'rgba(255, 255, 255, 0.1)',
              ...(sacredTheme && {
                color: '#FFD700',
                textShadow: '0 0 10px rgba(255, 215, 0, 0.7)',
                '&::before': {
                  opacity: 1,
                  animation: `${sacredShimmer} 1.5s ease-in-out`,
                },
              }),
            },
            '&.Mui-selected': {
              backgroundColor: sacredTheme
                ? alpha('#FFD700', 0.1)
                : 'rgba(255, 255, 255, 0.2)',
              ...(sacredTheme && {
                color: '#FFD700',
                textShadow: '0 0 15px rgba(255, 215, 0, 0.8)',
                fontWeight: 600,
              }),
            },
          },
        }}
      >
        {items.map((item, index) => (
          <Tab
            key={item.title}
            value={item.title || ''}
            label={
              sacredTheme ? (
                <span
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <span
                    style={{
                      fontSize: '12px',
                      opacity: 0.6,
                      animation: `rotate ${10 + index * 2}s linear infinite`,
                    }}
                  >
                    {index % 2 === 0 ? '𓊹' : '𓋹'}
                  </span>
                  {item.title || ''}
                </span>
              ) : (
                item.title || ''
              )
            }
            onClick={() => handleTabClick(item)}
            sx={{
              ...(item.hasleftborder === 'true' && {
                borderLeft: sacredTheme
                  ? `1px solid ${alpha('#FFD700', 0.3)}`
                  : '1px solid white',
              }),
              ...(item.hasrightborder === 'true' && {
                borderRight: sacredTheme
                  ? `1px solid ${alpha('#FFD700', 0.3)}`
                  : '1px solid white',
              }),
            }}
          />
        ))}
      </MuiTabs>
    </AppBar>
  )
}

export default Tabs
