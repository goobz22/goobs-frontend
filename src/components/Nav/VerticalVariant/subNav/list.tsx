// src/components/Nav/VerticalVariant/subNav/list.tsx
'use client'
import React, { FC } from 'react'
import { MenuItem } from '@mui/material'
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
  return (
    <Link
      key={title}
      style={{ textDecoration: 'none', color: 'white' }}
      href={route ?? ''}
    >
      <MenuItem
        sx={{
          color: white.main,
          ml: '35px', // Indent the single menu item if desired
          backgroundColor: isActive ? activeAndHoverColor : 'transparent',
          '&:hover': { backgroundColor: activeAndHoverColor },
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
          fontcolor={white.main}
        />
      </MenuItem>
    </Link>
  )
}

export default ListSubNav
