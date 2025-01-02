// src/components/Nav/VerticalVariant/mainNav/list.tsx
'use client'
import React, { FC } from 'react'
import { Box } from '@mui/material'
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
}

/**
 * For a main nav item that has NO children and doesn't need expansion.
 */
const ListNav: FC<ListNavProps> = ({ title, onClick }) => {
  return (
    <Box
      // You can style this however you like
      sx={{
        display: 'flex',
        alignItems: 'center',
        height: '32px',
        cursor: onClick ? 'pointer' : 'default',
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
}

export default ListNav
