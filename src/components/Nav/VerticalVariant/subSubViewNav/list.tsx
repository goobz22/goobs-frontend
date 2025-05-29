'use client'
import React, { FC } from 'react'
import { MenuItem, alpha } from '@mui/material'
import Link from 'next/link'
import { semiTransparentWhite, white } from '../../../../styles/palette'
import { Typography } from '../../../Typography'

interface SubSubViewNavProps {
  title?: string
  route?: string
  trigger?: 'route' | 'onClick'
  onClick?: () => void
  activeAndHoverColor?: string
  onClose?: () => void
  variant?: 'temporary' | 'permanent'
}

/**
 * SubSubViewNav component for displaying a fifth-level navigation item
 * This is meant to be used for items that are children of expanding subViewNav items
 */
const SubSubViewNav: FC<SubSubViewNavProps> = ({
  title,
  route,
  trigger,
  onClick,
  activeAndHoverColor = semiTransparentWhite.main,
  onClose,
  variant,
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
  const isSacredTheme =
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
          color: isSacredTheme ? alpha('#FFD700', 0.9) : white.main,
          // Increased indentation compared to subViewNav
          marginLeft: '85px',
          whiteSpace: 'nowrap',
          padding: '6px 16px',
          minHeight: '32px',
          position: 'relative',
          transition: 'all 0.3s ease',
          ...(isSacredTheme && {
            '&::before': {
              content: '"𓂀"',
              position: 'absolute',
              left: '8px',
              opacity: 0,
              transition: 'all 0.3s ease',
              color: '#FFD700',
              fontSize: '12px',
            },
          }),
          '&:hover': {
            backgroundColor: activeAndHoverColor,
            ...(isSacredTheme && {
              color: '#FFD700',
              transform: 'translateX(4px)',
              textShadow: '0 0 8px rgba(255, 215, 0, 0.6)',
              '&::before': {
                opacity: 1,
                transform: 'translateX(-2px)',
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
                background:
                  'linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.1), transparent)',
                animation: 'shimmer 1.5s ease-in-out',
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
          fontcolor={isSacredTheme ? alpha('#FFD700', 0.9) : white.main}
          sx={{
            whiteSpace: 'nowrap',
            fontSize: '0.8rem', // Slightly smaller than SubViewNav
            ...(isSacredTheme && {
              fontWeight: 500,
              letterSpacing: 0.5,
              transition: 'all 0.3s ease',
            }),
          }}
        />
      </MenuItem>
    </Link>
  )
}

export default SubSubViewNav
