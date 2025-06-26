// src/components/Nav/VerticalVariant/subNav/list.tsx
'use client'
import React, { FC } from 'react'
import { MenuItem, alpha, keyframes } from '@mui/material'
import Link from 'next/link'
import { white } from '../../../../styles/palette'
import { Typography } from '../../../Typography'

interface ListSubNavProps {
  title?: string
  route?: string
  trigger?: 'route' | 'onClick'
  activeAndHoverColor: string
  onClose?: () => void
  variant?: 'temporary' | 'permanent'
  /**
   * Whether the nav item is currently active/selected.
   */
  isActive?: boolean
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
 * SubNav item that is a single route link (no children / no expand).
 */
const ListSubNav: FC<ListSubNavProps> = ({
  title,
  route,
  trigger,
  activeAndHoverColor,
  onClose,
  variant,
  isActive,
}) => {
  const issacredtheme =
    activeAndHoverColor.includes('255, 215, 0') ||
    activeAndHoverColor === alpha('#FFD700', 0.15)

  return (
    <Link
      key={title}
      style={{ textDecoration: 'none', color: 'white' }}
      href={route ?? ''}
    >
      <MenuItem
        sx={{
          color: issacredtheme ? alpha('#FFD700', 0.9) : white.main,
          ml: '35px', // Indent the single menu item if desired
          backgroundColor: isActive ? activeAndHoverColor : 'transparent',
          position: 'relative',
          transition: 'all 0.3s ease',
          ...(issacredtheme && {
            '&::before': {
              content: '"𓃀"',
              position: 'absolute',
              left: '8px',
              opacity: 0,
              transition: 'all 0.3s ease',
              color: '#FFD700',
              fontSize: '14px',
            },
          }),
          '&:hover': {
            backgroundColor: activeAndHoverColor,
            ...(issacredtheme && {
              color: '#FFD700',
              transform: 'translateX(6px)',
              textShadow: '0 0 10px rgba(255, 215, 0, 0.7)',
              '&::before': {
                opacity: 1,
                transform: 'translateX(-3px) scale(1.2)',
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
                background:
                  'linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.15), transparent)',
                animation: `${shimmer} 1.2s ease-in-out`,
              },
            }),
          },
          '&:active': { backgroundColor: activeAndHoverColor },
          whiteSpace: 'nowrap', // keep text on a single line
        }}
        onClick={() => {
          if (trigger === 'route' && variant === 'temporary' && onClose) {
            onClose()
          }
        }}
      >
        <Typography
          fontvariant="merrih6"
          text={title ?? ''}
          fontcolor={issacredtheme ? alpha('#FFD700', 0.9) : white.main}
          sx={{
            ...(issacredtheme && {
              fontWeight: 500,
              letterSpacing: 0.8,
              transition: 'all 0.3s ease',
            }),
          }}
        />
      </MenuItem>
    </Link>
  )
}

export default ListSubNav
