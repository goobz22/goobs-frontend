'use client'

import React from 'react'
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
import { Typography } from './../../Typography'

export interface VerticalVariantProps {
  items: (NavProps | SubNav | View)[]
  showSearchbar: boolean
  showDropdown: boolean
  showTitle: boolean
  showLine: boolean
  verticalNavTitle: string
  dropdownLabel: string
  searchbarLabel: string
  anchor: 'left' | 'right'
  expandedNavs: string[]
  setExpandedNavs: React.Dispatch<React.SetStateAction<string[]>>
  expandedSubnavs: string[]
  setExpandedSubnavs: React.Dispatch<React.SetStateAction<string[]>>
  verticalNavWidth: string
}

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
}: VerticalVariantProps) {
  const router = useRouter()

  const navOptions = items
    .filter((item): item is NavProps => 'title' in item && 'subnavs' in item)
    .map(nav => nav.title ?? '')

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

  const renderItem = (
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
        {showTitle && (
          <Box pt="0px" pb="0px">
            <Link
              href="/dashboard/"
              passHref
              style={{ textDecoration: 'none' }}
            >
              <Typography
                fontvariant="merrih4"
                fontcolor={white.main}
                text={verticalNavTitle}
              />
            </Link>
          </Box>
        )}
        {(showDropdown || showSearchbar) && (
          <Stack mt={1} spacing={1}>
            {showDropdown && (
              <StyledComponent
                label={dropdownLabel}
                componentvariant="dropdown"
                outlinecolor="none"
                options={navOptions}
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
      {showLine && (
        <Divider
          sx={{
            width: verticalNavWidth,
            backgroundColor: white.main,
            mt: 2.5,
          }}
        />
      )}
      {items.map(item => renderItem(item, 0))}
    </Drawer>
  )
}

export default VerticalVariant
