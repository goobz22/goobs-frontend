'use client'
import React, { useState, useEffect } from 'react'
import { AppBar, Toolbar, Box, Tabs, Tab } from '@mui/material'
import { NavProps, SubNav, View } from '../index'
import { usePathname } from 'next/navigation'

type Alignment = 'left' | 'center' | 'right' | 'inherit' | 'justify'

export interface ActiveTabValue {
  tabId: string | false
}

export interface HorizontalVariantProps {
  items: (NavProps | SubNav | View)[]
  height?: string
  alignment?: Alignment
  navname?: string
}

function HorizontalVariant({
  items,
  height = '48px',
  navname = '',
}: HorizontalVariantProps) {
  const [activeTabValues, setActiveTabValues] = useState<
    Record<string, ActiveTabValue>
  >({})
  const pathname = usePathname()

  useEffect(() => {
    const currentTab = items.find(
      item => 'orientation' in item && item.route === pathname
    ) as NavProps | undefined

    setActiveTabValues(prev => ({
      ...prev,
      [navname]: { tabId: currentTab?.title || false },
    }))
  }, [items, navname, pathname])

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTabValues(prev => ({
      ...prev,
      [navname]: { tabId: newValue },
    }))
  }

  const handleTabClick = (tab: NavProps) => {
    if (tab.trigger === 'route') {
      if (tab.route) {
        window.location.href = tab.route
      }
    } else if (tab.trigger === 'onClick') {
      if (tab.onClick) {
        tab.onClick()
      }
    } else if (tab.trigger === 'routeonhorizontal') {
      if (tab.route) {
        window.location.href = tab.route
      }
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
            justifyContent: 'flex-start',
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
            <Tabs
              value={activeTabValues[navname]?.tabId || false}
              onChange={handleTabChange}
              aria-label="nav tabs"
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
              {items.map((item: NavProps | SubNav | View) => {
                if ('orientation' in item) {
                  const tab = item as NavProps
                  return (
                    <Tab
                      key={tab.title}
                      value={tab.title || ''}
                      label={tab.title || ''}
                      onClick={() => handleTabClick(tab)}
                      sx={{
                        minHeight: 0,
                        textTransform: 'none',
                        border: 'none',
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
                        ...(tab.hasleftborder === 'true' && {
                          borderLeft: '1px solid white',
                        }),
                        ...(tab.hasrightborder === 'true' && {
                          borderRight: '1px solid white',
                        }),
                        width: 'auto',
                        justifyContent: 'center',
                        alignItems: 'center',
                        px: 4,
                      }}
                    />
                  )
                }
                return null
              })}
            </Tabs>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default HorizontalVariant
