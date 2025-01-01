'use client'
import React, { useState, useEffect } from 'react'
import { AppBar, Tabs as MuiTabs, Tab } from '@mui/material'
import { usePathname } from 'next/navigation'
// Import your black palette color
import { black } from '../../styles/palette'

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
}

/**
 * A horizontal navigation component, built with MUI Tabs.
 */
function Tabs({
  items,
  height = '48px',
  alignment = 'left',
  navname = '',
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
        backgroundColor: black.main, // Ensure the AppBar is black
        color: '#fff',
        overflow: 'hidden', // Prevent hover effects from spilling
        height,
        minHeight: height,
        display: 'flex',
        justifyContent: 'center',
        boxShadow: 'none',
      }}
    >
      <MuiTabs
        value={activeTabValues[navname]?.tabId || false}
        onChange={handleTabChange}
        variant="fullWidth"
        aria-label="nav tabs"
        sx={{
          // Make the entire Tabs area black too
          backgroundColor: black.main,
          height: '100%',
          '& .MuiTabs-flexContainer': {
            height: '100%',
            display: 'flex',
            justifyContent: alignment === 'left' ? 'flex-start' : alignment,
            // The container is also black
            backgroundColor: black.main,
          },
          '& .MuiTab-root': {
            height: '100%',
            minHeight: 'unset',
            display: 'flex',
            alignItems: 'center',
            textTransform: 'none',
            boxSizing: 'border-box',
            backgroundColor: black.main,
            color: '#fff',
            fontWeight: 500,
            fontFamily: 'Merriweather',
            fontSize: 16,
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
            '&.Mui-selected': {
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
            },
          },
        }}
      >
        {items.map(item => (
          <Tab
            key={item.title}
            value={item.title || ''}
            label={item.title || ''}
            onClick={() => handleTabClick(item)}
            sx={{
              ...(item.hasleftborder === 'true' && {
                borderLeft: '1px solid white',
              }),
              ...(item.hasrightborder === 'true' && {
                borderRight: '1px solid white',
              }),
            }}
          />
        ))}
      </MuiTabs>
    </AppBar>
  )
}

export default Tabs
