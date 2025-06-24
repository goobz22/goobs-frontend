// src/components/Nav/VerticalVariant/mainNav/list.tsx
'use client'
import React, { FC } from 'react'
import { MenuItem } from '@mui/material'
import Link from 'next/link'
import { white } from '../../../../styles/palette'
import { Typography } from '../../../Typography'

interface ListNavProps {
  title?: string
  /**
   * Click handler for route or onClick triggers.
   */
  onClick?: () => void
  /**
   * Indentation level for the item.
   */
  level: number
  /**
   * Route for navigation
   */
  route?: string
  /**
   * Trigger type: 'route' or 'onClick'
   */
  trigger?: 'route' | 'onClick'
  /**
   * For closing mobile drawer
   */
  onClose?: () => void
  /**
   * Drawer variant
   */
  variant?: 'temporary' | 'permanent'
  /**
   * Whether the nav item is currently active/selected.
   */
  isActive?: boolean
  /**
   * Color for the active and hover states.
   */
  activeAndHoverColor: string
}

/**
 * For a main nav item that has NO children and doesn't need expansion.
 */
const ListNav: FC<ListNavProps> = ({
  title,
  onClick,
  route,
  trigger,
  onClose,
  variant,
  isActive,
  activeAndHoverColor,
}) => {
  const menuItemContent = (
    <Typography
      fontvariant="merrih5"
      fontcolor={white.main}
      text={title ?? ''}
      sx={{
        whiteSpace: 'nowrap', // No wrapping
      }}
    />
  )

  const menuItem = (
    <MenuItem
      sx={{
        // Match indentation of ExpandingNav text
        // (AccordionSummary ml=1 + icon)
        marginLeft: '24px',
        marginTop: 2,
        height: '32px',
        borderRadius: '4px',
        backgroundColor: isActive ? activeAndHoverColor : 'transparent',
        '&:hover': {
          backgroundColor: activeAndHoverColor,
        },
      }}
      onClick={() => {
        if (onClick) onClick()
        if (trigger === 'route' && variant === 'temporary' && onClose) {
          onClose()
        }
      }}
    >
      {menuItemContent}
    </MenuItem>
  )

  // If we have a route and it's a route trigger, wrap in Link
  if (route && trigger === 'route') {
    return (
      <Link href={route} style={{ textDecoration: 'none', color: 'inherit' }}>
        {menuItem}
      </Link>
    )
  }

  // Otherwise just return the MenuItem
  return menuItem
}

export default ListNav
