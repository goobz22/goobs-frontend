'use client'
import React, { useState, useCallback } from 'react'
import {
  Drawer,
  Box,
  Stack,
  Divider,
  MenuItem,
  Accordion as MuiAccordion,
  AccordionSummary,
  AccordionDetails,
  List,
} from '@mui/material'
import SearchableDropdown from '../../SearchableDropdown'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { NavProps, SubNav, View } from '../index'
import { white, ocean, semiTransparentWhite } from '../../../styles/palette'
import { Typography } from './../../Typography'

export interface VerticalVariantProps {
  items: (NavProps | SubNav | View)[]
  showSearchableNav: boolean
  showTitle: boolean
  showLine: boolean
  verticalNavTitle: string
  searchableNavLabel: string
  anchor: 'left' | 'right'
  expandedNavs: string[]
  setExpandedNavs: React.Dispatch<React.SetStateAction<string[]>>
  expandedSubnavs: string[]
  setExpandedSubnavs: React.Dispatch<React.SetStateAction<string[]>>
  verticalNavWidth: string
  backgroundcolor?: string
  shrunkfontcolor?: string
  unshrunkfontcolor?: string
  titleUrl?: string
  mobileOpen?: boolean
  onClose?: () => void
  variant?: 'temporary' | 'permanent'
  spacingfromtopofscreen?: string
}

function VerticalVariant({
  items,
  showSearchableNav,
  showTitle,
  showLine,
  verticalNavTitle,
  searchableNavLabel,
  anchor,
  expandedNavs,
  setExpandedNavs,
  expandedSubnavs,
  setExpandedSubnavs,
  verticalNavWidth,
  backgroundcolor,
  shrunkfontcolor = white.main,
  unshrunkfontcolor = white.main,
  titleUrl = '/',
  mobileOpen = false,
  onClose,
  variant = 'permanent',
  spacingfromtopofscreen = '0px',
}: VerticalVariantProps) {
  const router = useRouter()
  const [selectedNav, setSelectedNav] = useState<string | null>(null)

  const navOptions = items
    .filter((item): item is NavProps => 'title' in item && 'subnavs' in item)
    .map(nav => ({ value: nav.title ?? '' }))

  const handleNavClick = useCallback(
    (nav: NavProps) => {
      console.log('Clicked Nav:', nav.title)
      if (nav.trigger === 'route') {
        if (nav.route) {
          router.push(nav.route)
          if (variant === 'temporary' && onClose) {
            onClose()
          }
        }
      } else if (nav.trigger === 'onClick') {
        if (nav.onClick) {
          nav.onClick()
          if (variant === 'temporary' && onClose) {
            onClose()
          }
        }
      }
    },
    [router, variant, onClose]
  )

  const handleSearchableNavChange = useCallback(
    (newValue: { value: string } | null) => {
      const newVal = newValue ? newValue.value : null
      setSelectedNav(newVal)
      console.log('SearchableNav selection changed to:', newVal)
    },
    []
  )

  const renderItem = useCallback(
    (
      item: NavProps | SubNav | View,
      level: number,
      activeAndHoverColor = semiTransparentWhite.main
    ) => {
      if ('title' in item && 'subnavs' in item) {
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
                setExpandedNavs(
                  expandedNavs.filter(title => title !== nav.title)
                )
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
              <Typography
                fontvariant="merrih5"
                fontcolor={white.main}
                text={nav.title ?? ''}
                marginLeft={4 * level}
              />
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
                <Typography
                  fontvariant="merrih6"
                  text={subnav.title ?? ''}
                  fontcolor={white.main}
                />
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
                <Typography
                  fontvariant="merrih6"
                  fontcolor={white.main}
                  text={subnav.title ?? ''}
                  marginLeft={4}
                />
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
        const view = item as View
        return (
          <Link
            key={view.title}
            style={{
              textDecoration: 'none',
              color: 'white',
            }}
            href={view.route ?? ''}
            onClick={variant === 'temporary' ? onClose : undefined}
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
              <Typography
                fontvariant="merriparagraph"
                text={view.title ?? ''}
                fontcolor={white.main}
              />
            </MenuItem>
          </Link>
        )
      }
      return null
    },
    [
      expandedNavs,
      setExpandedNavs,
      expandedSubnavs,
      setExpandedSubnavs,
      handleNavClick,
      variant,
      onClose,
    ]
  )

  const drawerContent = (
    <>
      <Box px={`15px`}>
        {showTitle && (
          <Box pt="0px" pb="0px">
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
            width: verticalNavWidth,
            backgroundColor: white.main,
            mt: 2.5,
          }}
        />
      )}
      {selectedNav
        ? items
            .filter(
              (item): item is NavProps =>
                'title' in item && item.title === selectedNav
            )
            .map(item => renderItem(item, 0))
        : items.map(item => renderItem(item, 0))}
    </>
  )

  return (
    <Drawer
      variant={variant}
      anchor={anchor}
      open={variant === 'temporary' ? mobileOpen : true}
      onClose={onClose}
      elevation={0}
      sx={{
        width: variant === 'permanent' ? verticalNavWidth : 'auto',
        height: '100%',
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: verticalNavWidth,
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

export default VerticalVariant
