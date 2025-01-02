'use client'
import React, { useState, useCallback, FC } from 'react'
import { useRouter } from 'next/navigation'
import { Drawer, Box, Stack, Divider } from '@mui/material'
import Link from 'next/link'
import { Typography } from '../Typography'
import SearchableDropdown from '../SearchableDropdown'
import { white, ocean, semiTransparentWhite } from '../../styles/palette'

// New imports for split components
import ExpandingNav from './VerticalVariant/mainNav/expanding'
import ListNav from './VerticalVariant/mainNav/list'
import ExpandingSubNav from './VerticalVariant/subNav/expanding'
import ListSubNav from './VerticalVariant/subNav/list'
import ViewNav from './VerticalVariant/viewNav'

// --------------------------------------------------------------------------
// INTERFACES
// --------------------------------------------------------------------------

/**
 * A single interface that covers all vertical nav items:
 *   - navType = 'mainNav' => can have subnavs
 *   - navType = 'subNav' => can have views
 *   - navType = 'viewNav' => no children
 */
export interface NavItem {
  navType: 'mainNav' | 'subNav' | 'viewNav'
  title: string
  route?: string
  trigger?: 'route' | 'onClick'
  onClick?: () => void
  // For mainNav items only:
  subnavs?: NavItem[]
  // For subNav items only:
  views?: NavItem[]
}

/**
 * NavProps for the vertical nav component.
 */
export interface NavProps {
  /** The entire nav data array (mainNav, subNav, viewNav items). */
  items?: NavItem[]

  /** Whether to show the search box. */
  showSearchableNav?: boolean

  /** Whether to show the nav title. */
  showTitle?: boolean

  /** Whether to show a horizontal divider line. */
  showLine?: boolean

  /** Title text for the nav. */
  verticalNavTitle?: string

  /** Label for the search box. */
  searchableNavLabel?: string

  /** Side on which the Drawer anchors. */
  anchor?: 'left' | 'right'

  /** Background color (drawer or items). */
  backgroundcolor?: string

  /** Label color when shrunk (search box). */
  shrunkfontcolor?: string

  /** Label color when not shrunk (search box). */
  unshrunkfontcolor?: string

  /** Destination route if user clicks the nav title. */
  titleUrl?: string

  /** Controls mobile drawer open state. */
  mobileOpen?: boolean

  /** Handler for closing the mobile drawer. */
  onClose?: () => void

  /** MUI Drawer variant: 'temporary' or 'permanent'. */
  variant?: 'temporary' | 'permanent'

  /** Spacing from the top of the screen. */
  spacingfromtopofscreen?: string

  /** Margin above the nav title. */
  marginabovetitle?: string

  /** Margin below the nav title. */
  marginbelowtitle?: string
}

// --------------------------------------------------------------------------
// SINGLE CONST NAV COMPONENT
// --------------------------------------------------------------------------

const Nav: FC<NavProps> = ({
  items = [],
  showSearchableNav = true,
  showTitle = true,
  showLine = true,
  verticalNavTitle = 'Navigation',
  searchableNavLabel = 'Search or select a nav',
  anchor = 'left',
  shrunkfontcolor = 'black',
  unshrunkfontcolor = 'black',
  backgroundcolor,
  titleUrl,
  mobileOpen = false,
  onClose,
  variant = 'permanent',
  spacingfromtopofscreen,
  marginabovetitle = '0px',
  marginbelowtitle = '0px',
}) => {
  // States for expanded mainNavs and subNavs
  const [expandedNavs, setExpandedNavs] = useState<string[]>([])
  const [expandedSubnavs, setExpandedSubnavs] = useState<string[]>([])

  // Default width for the vertical nav
  const [verticalNavWidth] = useState<string>('250px')

  // For route triggers
  const router = useRouter()

  // For search dropdown
  const [selectedNav, setSelectedNav] = useState<string | null>(null)

  // Build search dropdown options from mainNav items
  const navOptions = items
    .filter(item => item.navType === 'mainNav')
    .map(item => ({ value: item.title }))

  /**
   * Handle route or onClick triggers for mainNav/subNav/viewNav
   */
  const handleNavClick = useCallback(
    (item: NavItem) => {
      if (item.trigger === 'route' && item.route) {
        router.push(item.route)
        if (variant === 'temporary' && onClose) {
          onClose()
        }
      } else if (item.trigger === 'onClick' && item.onClick) {
        item.onClick()
        if (variant === 'temporary' && onClose) {
          onClose()
        }
      }
    },
    [router, variant, onClose]
  )

  /**
   * When user selects a mainNav from the search dropdown
   */
  const handleSearchableNavChange = useCallback(
    (newValue: { value: string } | null) => {
      setSelectedNav(newValue?.value || null)
    },
    []
  )

  /**
   * Recursively render mainNav -> subNav -> viewNav
   */
  const renderItem = useCallback(
    (
      item: NavItem,
      level: number,
      activeAndHoverColor = semiTransparentWhite.main
    ) => {
      switch (item.navType) {
        // 1) MAIN NAV
        case 'mainNav': {
          const hasChildren = !!item.subnavs?.length
          if (hasChildren) {
            // Render the expanding version
            return (
              <ExpandingNav
                key={item.title}
                title={item.title}
                expandedNavs={expandedNavs}
                setExpandedNavs={setExpandedNavs}
                onClick={() => handleNavClick(item)}
                level={level}
              >
                {item.subnavs?.map(subItem =>
                  renderItem(subItem, level + 1, activeAndHoverColor)
                )}
              </ExpandingNav>
            )
          } else {
            // Render the simple list version (no children)
            return (
              <ListNav
                key={item.title}
                title={item.title}
                onClick={() => handleNavClick(item)}
                level={level}
              />
            )
          }
        }

        // 2) SUB NAV
        case 'subNav': {
          const hasChildren = !!item.views?.length
          if (hasChildren) {
            // Render the expanding subNav
            return (
              <ExpandingSubNav
                key={item.title}
                title={item.title}
                expandedSubnavs={expandedSubnavs}
                setExpandedSubnavs={setExpandedSubnavs}
              >
                {item.views?.map(view =>
                  renderItem(view, level + 2, activeAndHoverColor)
                )}
              </ExpandingSubNav>
            )
          } else {
            // Render the simple list subNav
            return (
              <ListSubNav
                key={item.title}
                title={item.title}
                route={item.route}
                trigger={item.trigger}
                activeAndHoverColor={activeAndHoverColor}
                onClose={onClose}
                variant={variant}
              />
            )
          }
        }

        // 3) VIEW NAV
        case 'viewNav': {
          return (
            <ViewNav
              key={item.title}
              title={item.title}
              route={item.route}
              trigger={item.trigger}
              onClick={item.onClick}
              level={level}
              activeAndHoverColor={activeAndHoverColor}
              onClose={onClose}
              variant={variant}
            />
          )
        }

        default:
          return null
      }
    },
    [
      expandedNavs,
      setExpandedNavs,
      expandedSubnavs,
      setExpandedSubnavs,
      handleNavClick,
      onClose,
      variant,
    ]
  )

  // Drawer Content: Title, optional search, optional divider, then items
  const drawerContent = (
    <>
      <Box px="15px" sx={{ whiteSpace: 'nowrap' /* no text wrapping */ }}>
        {showTitle && (
          <Box mt={marginabovetitle} mb={marginbelowtitle}>
            <Link
              href={titleUrl || '/'}
              passHref
              style={{ textDecoration: 'none' }}
              onClick={variant === 'temporary' ? onClose : undefined}
            >
              <Typography
                fontvariant="merrih4"
                fontcolor={white.main}
                text={verticalNavTitle}
              />
            </Link>
          </Box>
        )}

        {showSearchableNav && (
          <Stack mt={{ xs: '10px', md: '10px', lg: 0 }} spacing={0}>
            <Box
              sx={{
                position: 'relative',
                zIndex: theme => theme.zIndex.drawer + 1,
                width: '100%',
                minHeight: '40px',
                whiteSpace: 'nowrap',
              }}
            >
              <SearchableDropdown
                label={searchableNavLabel}
                options={navOptions}
                backgroundcolor={backgroundcolor || semiTransparentWhite.main}
                outlinecolor="none"
                fontcolor={white.main}
                shrunkfontcolor={shrunkfontcolor}
                unshrunkfontcolor={unshrunkfontcolor}
                shrunklabelposition="aboveNotch"
                onChange={handleSearchableNavChange}
                placeholder="Search..."
              />
            </Box>
          </Stack>
        )}
      </Box>

      {showLine && (
        <Divider
          sx={{
            width: '100%',
            backgroundColor: white.main,
            mt: 2.5,
          }}
        />
      )}

      {selectedNav
        ? // If user picked a mainNav item from the search
          items.filter(i => i.title === selectedNav).map(i => renderItem(i, 0))
        : // Otherwise render all nav items
          items.map(i => renderItem(i, 0))}
    </>
  )

  // Render the Drawer
  return (
    <Drawer
      variant={variant}
      anchor={anchor}
      open={variant === 'temporary' ? mobileOpen : true}
      onClose={onClose}
      elevation={0}
      sx={{
        width: 'auto',
        height: '100%',
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          minWidth: verticalNavWidth,
          width: '280px',
          whiteSpace: 'nowrap',
          // Remove horizontal scrollbar:
          overflowX: 'hidden',
          // Optionally allow vertical scrolling if content is taller:
          overflowY: 'auto',
          border: 0,
          zIndex: theme =>
            variant === 'temporary'
              ? theme.zIndex.drawer + 2
              : theme.zIndex.drawer - 1,
          backgroundColor: ocean.main,
          pt: '17px',
          boxSizing: 'border-box',
          marginTop: spacingfromtopofscreen,
        },
      }}
    >
      {drawerContent}
    </Drawer>
  )
}

export default Nav
