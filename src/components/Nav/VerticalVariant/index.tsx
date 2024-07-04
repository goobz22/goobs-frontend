'use client'

import React from 'react'
import {
  Drawer,
  Box,
  Typography,
  Stack,
  Divider,
  MenuItem,
  Accordion as MuiAccordion,
  AccordionSummary,
  AccordionDetails,
  List,
} from '@mui/material'
import StyledComponent from '../../StyledComponent'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { NavProps, SubNav, View } from '../index'
import {
  white,
  black,
  ocean,
  semiTransparentWhite,
} from '../../../styles/palette'

/**
 * Interface for the props of the VerticalVariant component
 */
export interface VerticalVariantProps {
  items: (NavProps | SubNav | View)[] // Array of navigation items
  showSearchbar: boolean // Flag to show/hide search bar
  showDropdown: boolean // Flag to show/hide dropdown
  showTitle: boolean // Flag to show/hide title
  showLine: boolean // Flag to show/hide divider line
  verticalNavTitle: string // Title for the vertical navigation
  dropdownLabel: string // Label for the dropdown
  searchbarLabel: string // Label for the search bar
  anchor: 'left' | 'right' // Position of the drawer
  expandedNavs: string[] // Array of expanded navigation items
  setExpandedNavs: React.Dispatch<React.SetStateAction<string[]>> // Function to set expanded navs
  expandedSubnavs: string[] // Array of expanded subnavigation items
  setExpandedSubnavs: React.Dispatch<React.SetStateAction<string[]>> // Function to set expanded subnavs
  verticalNavWidth: string // Width of the vertical navigation
  selectedNav?: string // Currently selected navigation item
}

/**
 * VerticalVariant component for rendering a vertical navigation drawer
 * @param {VerticalVariantProps} props - The props for the component
 * @returns {JSX.Element} The rendered VerticalVariant component
 */
function VerticalVariant({
  items,
  showSearchbar,
  showDropdown,
  showTitle,
  showLine,
  verticalNavTitle,
  dropdownLabel,
  searchbarLabel,
  anchor,
  expandedNavs,
  setExpandedNavs,
  expandedSubnavs,
  setExpandedSubnavs,
  verticalNavWidth,
  selectedNav,
}: VerticalVariantProps) {
  const router = useRouter()

  // Filter and map navigation options for the dropdown
  const navOptions = items
    .filter((item): item is NavProps => 'title' in item && 'subnavs' in item)
    .map(nav => nav.title ?? '')

  /**
   * Handle dropdown change event
   * @param {React.ChangeEvent<{ value: unknown }>} event - The change event
   */
  const handleDropdownChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    const selectedOption = event.target.value as string
    console.log('handleDropdownChange - selectedOption:', selectedOption)
  }

  /**
   * Handle navigation item click event
   * @param {NavProps} nav - The clicked navigation item
   */
  const handleNavClick = (nav: NavProps) => {
    console.log('Clicked Nav:', nav.title)
    if (nav.trigger === 'route') {
      if (nav.route) {
        router.push(nav.route)
      }
    } else if (nav.trigger === 'onClick') {
      if (nav.onClick) {
        nav.onClick()
      }
    }
  }

  /**
   * Render a navigation item (NavProps, SubNav, or View)
   * @param {NavProps | SubNav | View} item - The item to render
   * @param {number} level - The nesting level of the item
   * @param {string} activeAndHoverColor - The color for active and hover states
   * @returns {JSX.Element | null} The rendered item
   */
  const renderItem = (
    item: NavProps | SubNav | View,
    level: number,
    activeAndHoverColor = semiTransparentWhite.main
  ) => {
    if ('title' in item && 'subnavs' in item) {
      // Render NavProps item
      const nav = item as NavProps
      const isExpanded = expandedNavs.includes(nav.title ?? '')
      return (
        <MuiAccordion
          key={nav.title}
          disableGutters
          elevation={0}
          square
          expanded={isExpanded}
          onChange={() => {
            if (isExpanded) {
              setExpandedNavs(expandedNavs.filter(title => title !== nav.title))
            } else {
              setExpandedNavs([...expandedNavs, nav.title ?? ''])
            }
          }}
          sx={{
            pl: 0,
            backgroundColor: 'transparent',
            '.MuiAccordionSummary-root': {
              pl: 0,
            },
            '&:before': {
              display: 'none',
            },
          }}
        >
          <AccordionSummary
            expandIcon={
              nav.subnavs && nav.subnavs.length > 0 ? (
                <ExpandMoreIcon
                  sx={{
                    color: 'transparent',
                  }}
                />
              ) : null
            }
            aria-controls="accordion-content"
            id="accordion-header"
            sx={{
              boxSizing: 'border-box',
              border: 'none',
              py: '6px',
              mt: 2,
              ml: 3,
              minHeight: 0,
              height: '32px',
              '& .MuiAccordionSummary-content': {
                m: 0,
              },
              '&:hover': {
                '& .MuiSvgIcon-root': {
                  color: white.main,
                },
              },
              '&.Mui-expanded': {
                '& .MuiSvgIcon-root': {
                  color: white.main,
                },
              },
            }}
            onClick={() => handleNavClick(nav)}
          >
            {nav.trigger === 'route' || nav.trigger === 'onClick' ? (
              <Typography variant="merrih5" color={white.main} pl={4 * level}>
                {nav.title}
              </Typography>
            ) : (
              <Typography variant="merrih5" color={white.main} pl={4 * level}>
                {nav.title}
              </Typography>
            )}
          </AccordionSummary>
          <AccordionDetails sx={{ border: 'none', p: 0 }}>
            <List sx={{ py: 0 }}>
              {nav.subnavs?.map(subnav =>
                renderItem(subnav, level + 1, activeAndHoverColor)
              )}
            </List>
          </AccordionDetails>
        </MuiAccordion>
      )
    } else if ('title' in item && 'views' in item) {
      // Render SubNav item
      const subnav = item as SubNav
      const isExpanded = expandedSubnavs.includes(subnav.title ?? '')
      if (subnav.views?.length === 0) {
        return (
          <Link
            key={subnav.title}
            style={{
              textDecoration: 'none',
              color: 'white',
            }}
            href={subnav.route ?? ''}
          >
            <MenuItem
              sx={{
                color: white.main,
                ml: '25px',
                '&:hover': {
                  backgroundColor: activeAndHoverColor,
                },
                '&:active': {
                  backgroundColor: activeAndHoverColor,
                },
              }}
            >
              <Typography variant="merrih6">{subnav.title}</Typography>
            </MenuItem>
          </Link>
        )
      } else {
        return (
          <MuiAccordion
            key={subnav.title}
            disableGutters
            elevation={0}
            square
            expanded={isExpanded}
            onChange={() => {
              if (isExpanded) {
                setExpandedSubnavs(
                  expandedSubnavs.filter(title => title !== subnav.title)
                )
              } else {
                setExpandedSubnavs([...expandedSubnavs, subnav.title ?? ''])
              }
            }}
            sx={{
              pl: 0,
              backgroundColor: 'transparent',
              '.MuiAccordionSummary-root': {
                pl: 0,
              },
              '&:before': {
                display: 'none',
              },
            }}
          >
            <AccordionSummary
              expandIcon={
                <ExpandMoreIcon
                  sx={{
                    color: 'transparent',
                  }}
                />
              }
              aria-controls="accordion-content"
              id="accordion-header"
              sx={{
                boxSizing: 'border-box',
                border: 'none',
                py: '6px',
                mt: 0,
                ml: '8px',
                minHeight: 0,
                height: '32px',
                '& .MuiAccordionSummary-content': {
                  m: 0,
                },
                '&:hover': {
                  '& .MuiSvgIcon-root': {
                    color: white.main,
                  },
                },
                '&.Mui-expanded': {
                  '& .MuiSvgIcon-root': {
                    color: white.main,
                  },
                },
              }}
            >
              <Typography variant="merrih6" color={white.main} pl={4}>
                {subnav.title}
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ border: 'none', p: 0 }}>
              <List sx={{ py: 0 }}>
                {subnav.views?.map(view =>
                  renderItem(view, level + 1, activeAndHoverColor)
                )}
              </List>
            </AccordionDetails>
          </MuiAccordion>
        )
      }
    } else if ('title' in item && 'route' in item) {
      // Render View item
      const view = item as View
      return (
        <Link
          key={view.title}
          style={{
            textDecoration: 'none',
            color: 'white',
          }}
          href={view.route ?? ''}
        >
          <MenuItem
            sx={{
              color: white.main,
              pl: level + 6,
              '&:hover': {
                backgroundColor: activeAndHoverColor,
              },
              '&:active': {
                backgroundColor: activeAndHoverColor,
              },
            }}
          >
            <Typography variant="merriparagraph">{view.title}</Typography>
          </MenuItem>
        </Link>
      )
    }
    return null
  }

  return (
    <Drawer
      variant="permanent"
      anchor={anchor}
      elevation={0}
      sx={{
        width: verticalNavWidth,
        height: '100%',
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: verticalNavWidth,
          border: 0,
          zIndex: theme => theme.zIndex.drawer - 1,
          backgroundColor: ocean.main,
          pt: '17px',
          boxSizing: 'border-box',
        },
      }}
    >
      <Box
        // @ts-ignore
        px={`15px`}
      >
        {/* Render title if showTitle is true */}
        {showTitle && (
          <Box pt="0px" pb="0px">
            <Link
              href="/dashboard/"
              passHref
              style={{ textDecoration: 'none' }}
            >
              <Typography variant="merrih4" color={white.main}>
                {verticalNavTitle}
              </Typography>
            </Link>
          </Box>
        )}
        {/* Render dropdown and searchbar if either showDropdown or showSearchbar is true */}
        {(showDropdown || showSearchbar) && (
          <Stack mt={1} spacing={1}>
            {showDropdown && (
              <StyledComponent
                label={dropdownLabel}
                componentvariant="dropdown"
                outlinecolor="none"
                options={navOptions}
                value={selectedNav || navOptions[0]}
                onChange={handleDropdownChange}
                backgroundcolor={white.main}
                shrunklabellocation="above"
                shrunkfontcolor={white.main}
                unshrunkfontcolor={black.main}
              />
            )}
            {showSearchbar && (
              <StyledComponent
                componentvariant="searchbar"
                label={searchbarLabel}
                backgroundcolor={semiTransparentWhite.main}
                iconcolor={white.main}
                outlinecolor="none"
                shrunklabellocation="onnotch"
                combinedfontcolor={white.main}
              />
            )}
          </Stack>
        )}
      </Box>
      {/* Render divider line if showLine is true */}
      {showLine && (
        <Divider
          sx={{
            width: verticalNavWidth,
            backgroundColor: white.main,
            mt: 2.5,
          }}
        />
      )}
      {/* Render navigation items */}
      {items.map(item => renderItem(item, 0))}
    </Drawer>
  )
}

export default VerticalVariant
