'use client'
import React, { FC } from 'react'
import { MenuItem, alpha } from '@mui/material'
import Link from 'next/link'
import { semiTransparentWhite, white } from '../../../../styles/palette'
import { Typography } from '../../../Typography'

interface SubViewNavProps {
  title?: string
  route?: string
  trigger?: 'route' | 'onClick'
  onClick?: () => void
  activeAndHoverColor?: string
  onClose?: () => void
  variant?: 'temporary' | 'permanent'
  /**
   * Whether the nav item is currently active/selected.
   */
  isActive?: boolean
}

/**
 * SubViewNav component for displaying a fourth-level navigation item
 * This is meant to be used for items that are children of viewNav items
 */
const SubViewNav: FC<SubViewNavProps> = ({
  title,
  route,
  trigger,
  onClick,
  activeAndHoverColor = semiTransparentWhite.main,
  onClose,
  variant,
  isActive,
}) => {
  // Handle click to support both route and onClick
  const handleClick = () => {
    if (trigger === 'route' && variant === 'temporary' && onClose) {
      onClose()
    } else if (trigger === 'onClick' && onClick) {
      onClick()
      if (variant === 'temporary' && onClose) {
        onClose()
      }
    }
  }

  // Check if we're using sacred theming based on hover color
  const issacredtheme =
    activeAndHoverColor.includes('255, 215, 0') ||
    activeAndHoverColor === alpha('#FFD700', 0.15)

  return (
    <Link
      key={title}
      href={route ?? ''}
      style={{
        textDecoration: 'none',
        color: 'white',
        whiteSpace: 'nowrap', // keep text in one line
      }}
      onClick={handleClick}
    >
      <MenuItem
        sx={{
          color: issacredtheme ? alpha('#FFD700', 0.9) : white.main,
          // Increased indentation by 15px compared to previous value
          marginLeft: '68px',
          whiteSpace: 'nowrap',
          padding: '6px 16px',
          minHeight: '32px',
          position: 'relative',
          transition: 'all 0.3s ease',
          backgroundColor: isActive ? activeAndHoverColor : 'transparent',
          ...(issacredtheme && {
            '&::before': {
              content: '"𓊖"',
              position: 'absolute',
              left: '8px',
              opacity: 0,
              transition: 'all 0.3s ease',
              color: '#FFD700',
              fontSize: '13px',
            },
          }),
          '&:hover': {
            backgroundColor: activeAndHoverColor,
            ...(issacredtheme && {
              color: '#FFD700',
              transform: 'translateX(5px)',
              textShadow: '0 0 9px rgba(255, 215, 0, 0.65)',
              '&::before': {
                opacity: 1,
                transform: 'translateX(-2px) scale(1.15)',
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
                background:
                  'linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.12), transparent)',
                animation: 'shimmer 1.3s ease-in-out',
              },
            }),
          },
          '&:active': {
            backgroundColor: activeAndHoverColor,
          },
        }}
      >
        <Typography
          fontvariant="merriparagraph"
          text={title ?? ''}
          fontcolor={issacredtheme ? alpha('#FFD700', 0.9) : white.main}
          sx={{
            whiteSpace: 'nowrap',
            fontSize: '0.85rem',
            ...(issacredtheme && {
              fontWeight: 500,
              letterSpacing: 0.6,
              transition: 'all 0.3s ease',
            }),
          }}
        />
      </MenuItem>
    </Link>
  )
}

export default SubViewNav
