// src/components/Nav/VerticalVariant/mainNav/list.tsx
'use client'
import React, { FC } from 'react'
import { Box } from '@mui/material'
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
}) => {
  const content = (
    <Box
      // You can style this however you like
      sx={{
        display: 'flex',
        alignItems: 'center',
        height: '32px',
        cursor: onClick || route ? 'pointer' : 'default',
        // Indent from the left
        ml: 5,
        mt: 2,
        '&:hover': {
          // Example: highlight on hover
          color: white.main,
        },
      }}
      onClick={() => {
        if (onClick) onClick()
        if (trigger === 'route' && variant === 'temporary' && onClose) {
          onClose()
        }
      }}
    >
      <Typography
        fontvariant="merrih5"
        fontcolor={white.main}
        text={title ?? ''}
        sx={{
          whiteSpace: 'nowrap', // No wrapping
        }}
      />
    </Box>
  )

  // If we have a route and it's a route trigger, wrap in Link
  if (route && trigger === 'route') {
    return (
      <Link href={route} style={{ textDecoration: 'none' }}>
        {content}
      </Link>
    )
  }

  // Otherwise just return the Box
  return content
}

export default ListNav
