'use client'
import React, { FC } from 'react'
import { MenuItem } from '@mui/material'
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
          color: white.main,
          // Increased indentation compared to subViewNav
          marginLeft: '85px',
          whiteSpace: 'nowrap',
          padding: '6px 16px',
          minHeight: '32px',
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
          text={title ?? ''}
          fontcolor={white.main}
          sx={{
            whiteSpace: 'nowrap',
            fontSize: '0.8rem', // Slightly smaller than SubViewNav
          }}
        />
      </MenuItem>
    </Link>
  )
}

export default SubSubViewNav
