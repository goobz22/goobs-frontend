'use client'
import React, { FC } from 'react'
import { MenuItem, alpha } from '@mui/material'
import Link from 'next/link'
import { semiTransparentWhite, white } from '../../../../styles/palette'
import { Typography } from '../../../Typography'

interface ViewNavProps {
  title?: string
  route?: string
  trigger?: 'route' | 'onClick'
  onClick?: () => void
  level: number
  activeAndHoverColor?: string
  onClose?: () => void
  variant?: 'temporary' | 'permanent'
}

const ViewNav: FC<ViewNavProps> = ({
  title,
  route,
  trigger,
  onClick,
  activeAndHoverColor = semiTransparentWhite.main,
  onClose,
  variant,
}) => {
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
      onClick={() => {
        if (trigger === 'route' && variant === 'temporary' && onClose) {
          onClose()
        } else if (trigger === 'onClick' && onClick) {
          onClick()
          if (variant === 'temporary' && onClose) {
            onClose()
          }
        }
      }}
    >
      <MenuItem
        sx={{
          color: isSacredTheme ? alpha('#FFD700', 0.9) : white.main,
          // Increased to align with ExpandingViewNav text (which has an icon)
          marginLeft: '53px',
          whiteSpace: 'nowrap',
          position: 'relative',
          transition: 'all 0.3s ease',
          ...(isSacredTheme && {
            '&::before': {
              content: '"𓏏"',
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
            ...(isSacredTheme && {
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
                animation: 'shimmer 1.2s ease-in-out',
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
            ...(isSacredTheme && {
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

export default ViewNav
