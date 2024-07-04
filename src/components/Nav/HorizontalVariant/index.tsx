'use client'
import React, { useState, useEffect } from 'react'
import { Box, Tabs, styled, Tab } from '@mui/material'
import { get, set, JSONValue } from 'goobs-cache'
import { NavProps, SubNav, View } from '../index'

// Define the possible alignment values for the navigation
type Alignment = 'left' | 'center' | 'right' | 'inherit' | 'justify'

/**
 * Interface representing the active tab value
 */
export interface ActiveTabValue {
  tabId: string
}

/**
 * Interface for the props of the HorizontalVariant component
 */
export interface HorizontalVariantProps {
  items: (NavProps | SubNav | View)[] // Array of navigation items
  height?: string // Optional height of the navigation
  alignment?: Alignment // Optional alignment of the navigation
  navname?: string // Optional name for the navigation
}

/**
 * Styled component for the Tab, extending MUI's Tab with custom props
 */
const StyledTab = styled(Tab, {
  shouldForwardProp: prop =>
    prop !== 'height' && prop !== 'hasleftborder' && prop !== 'hasrightborder',
})<NavProps & { height?: string }>(
  ({ height = '80px', hasleftborder = 'false', hasrightborder = 'false' }) => ({
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
    ...(hasleftborder === 'true' && {
      borderLeft: '1px solid white',
    }),
    ...(hasrightborder === 'true' && {
      borderRight: '1px solid white',
    }),
  })
)

/**
 * Styled component for the horizontal navigation container
 */
const HorizontalNavContainer = styled(Box)<{
  height?: string
  alignment?: Alignment
}>(({ height = '80px', alignment = 'left' }) => ({
  flexGrow: 1,
  bgcolor: 'black',
  display: 'flex',
  height: height,
  justifyContent: alignment,
  paddingLeft: '5px',
  paddingRight: '5px',
}))

/**
 * HorizontalVariant component for rendering a horizontal navigation bar
 * @param {HorizontalVariantProps} props - The props for the component
 * @returns {JSX.Element} The rendered HorizontalVariant component
 */
function HorizontalVariant({
  items,
  height = '80px',
  alignment = 'left',
  navname,
}: HorizontalVariantProps) {
  // State to store active tab values
  const [activeTabValues, setActiveTabValues] = useState<
    Record<string, ActiveTabValue | null>
  >({})

  // Effect to fetch active tab values from cache on component mount
  useEffect(() => {
    const fetchActiveTabValues = async () => {
      const result = await get('activeTabValues', 'client')
      if (result && typeof result === 'object' && 'value' in result) {
        setActiveTabValues(
          (result as JSONValue).value as Record<string, ActiveTabValue | null>
        )
      }
    }

    fetchActiveTabValues()
  }, [])

  /**
   * Handle tab change event
   * @param {React.SyntheticEvent} event - The event object
   * @param {string} newValue - The new value of the selected tab
   */
  const handleTabChange = async (
    event: React.SyntheticEvent,
    newValue: string
  ) => {
    const updatedActiveTabValues = {
      ...activeTabValues,
      [navname ?? '']: { tabId: newValue },
    }
    setActiveTabValues(updatedActiveTabValues)
    // Store updated values in cache with 30 minutes expiration
    await set(
      'activeTabValues',
      { type: 'json', value: updatedActiveTabValues } as JSONValue,
      new Date(Date.now() + 30 * 60 * 1000),
      'client'
    )
  }

  /**
   * Handle tab click event based on the tab's trigger type
   * @param {NavProps} tab - The tab object that was clicked
   */
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
    <HorizontalNavContainer height={height} alignment={alignment}>
      <Tabs
        value={activeTabValues[navname ?? '']?.tabId || false}
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
          // Only render NavProps items as tabs
          if ('orientation' in item) {
            const tab = item as NavProps
            return (
              <StyledTab
                key={tab.title}
                value={tab.title}
                label={tab.title}
                hasleftborder={tab.hasleftborder}
                hasrightborder={tab.hasrightborder}
                height={height}
                orientation={tab.orientation}
                sx={{
                  width: 'auto',
                  justifyContent: 'center',
                  alignItems: 'center',
                  px: 4,
                }}
                onClick={() => handleTabClick(tab)}
                title={tab.title}
                route={tab.route}
                navname={tab.navname}
              />
            )
          }
          return null
        })}
      </Tabs>
    </HorizontalNavContainer>
  )
}

export default HorizontalVariant
