// src/components/Nav/VerticalVariant/mainNav/list.tsx
'use client'
import React, { FC } from 'react'
import { MenuItem, alpha, keyframes } from '@mui/material'
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

const shimmer = keyframes`
  from {
    background-position: -200% 0;
  }
  to {
    background-position: 200% 0;
  }
`

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
  const issacredtheme =
    activeAndHoverColor.includes('255, 215, 0') ||
    activeAndHoverColor === alpha('#FFD700', 0.15)

  const menuItemContent = (
    <Typography
      fontvariant="merrih5"
      fontcolor={issacredtheme ? '#FFD700' : white.main}
      text={title ?? ''}
      sx={{
        whiteSpace: 'nowrap', // No wrapping
        ...(issacredtheme && {
          fontWeight: 600,
          letterSpacing: 1.2,
          transition: 'all 0.3s ease',
          textShadow: '0 0 5px rgba(255, 215, 0, 0.5)',
        }),
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
        ...(issacredtheme && {
          position: 'relative',
          transition: 'all 0.3s ease',
          color: '#FFD700',
          '&::before': {
            content: '"𓁟"',
            position: 'absolute',
            left: '8px',
            opacity: 0,
            transition: 'all 0.3s ease',
            color: '#FFD700',
            fontSize: '16px',
          },
        }),
        '&:hover': {
          backgroundColor: activeAndHoverColor,
          ...(issacredtheme && {
            color: '#FFD700',
            transform: 'translateX(8px)',
            textShadow: '0 0 12px rgba(255, 215, 0, 0.8)',
            '&::before': {
              opacity: 1,
              transform: 'translateX(-4px) scale(1.2)',
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              left: 0,
              top: 0,
              right: 0,
              bottom: 0,
              background:
                'linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.2), transparent)',
              animation: `${shimmer} 1s ease-in-out`,
            },
          }),
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
