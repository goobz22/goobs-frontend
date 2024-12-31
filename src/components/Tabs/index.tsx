'use client'
import React, { useState, useEffect } from 'react'
import { AppBar, Toolbar, Box, Tabs as MuiTabs, Tab } from '@mui/material'
import { usePathname } from 'next/navigation'

/** Represents the shape of each tab item in the horizontal nav. */
export interface TabsItem {
  /** The text/title displayed on the tab */
  title?: string

  /** The URL route */
  route?: string

  /** The trigger type: 'route' | 'onClick' */
  trigger?: 'route' | 'onClick'

  /** OnClick callback */
  onClick?: () => void

  /** Optional left border */
  hasleftborder?: string

  /** Optional right border */
  hasrightborder?: string
}

/** Represents the currently active/selected tab */
export interface ActiveTabValue {
  tabId: string | false
}

/** Props for the horizontal Tabs component. */
export interface TabsProps {
  /** Array of horizontal items (TabsItem). */
  items: TabsItem[]

  /** Height of the tabs bar. */
  height?: string

  /** MUI alignment. */
  alignment?: 'left' | 'center' | 'right' | 'inherit' | 'justify'

  /** Unique name for this tab set (for managing active tab). */
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
    /**
     * Find the item whose route matches the current path
     */
    const currentTab = items.find(item => item.route === pathname)

    setActiveTabValues(prev => ({
      ...prev,
      [navname]: { tabId: currentTab?.title || false },
    }))
  }, [items, navname, pathname])

  /**
   * When user changes tab via click,
   * update the activeTabValues record.
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
      sx={{
        backgroundColor: 'black',
        color: 'white',
      }}
    >
      <Toolbar
        disableGutters
        sx={{
          paddingLeft: 0,
          paddingRight: 0,
          height: `${height} !important`,
          minHeight: `${height} !important`,
          borderTop: '1px solid white',
        }}
      >
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: alignment === 'left' ? 'flex-start' : alignment,
          }}
        >
          <Box
            sx={{
              flexGrow: 1,
              display: 'flex',
              height: height,
              justifyContent: 'flex-start',
              paddingLeft: 0,
              paddingRight: 0,
            }}
          >
            <MuiTabs
              value={activeTabValues[navname]?.tabId || false}
              onChange={handleTabChange}
              aria-label="nav tabs"
              variant="fullWidth"
              sx={{
                height: height,
                '& .MuiTabs-flexContainer': {
                  height: '100%',
                },
                '& .MuiTab-root': {
                  height: '100%',
                  minHeight: 'unset',
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
                    flex: 1,
                    textTransform: 'none',
                    boxSizing: 'border-box',
                    backgroundColor: 'black',
                    color: '#fff',
                    fontWeight: 500,
                    fontFamily: 'Merriweather',
                    fontSize: 16,
                    height: height,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                    '& .MuiTouchRipple-root': {
                      color: '#fff',
                    },
                    '&.Mui-selected': {
                      color: '#fff',
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    },
                    '& .MuiSvgIcon-root': {
                      color: '#fff',
                    },
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
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Tabs
