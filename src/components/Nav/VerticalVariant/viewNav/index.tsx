'use client'
import React, { FC } from 'react'
import { MenuItem } from '@mui/material'
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
  level,
  activeAndHoverColor = semiTransparentWhite.main,
  onClose,
  variant,
}) => {
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
          color: white.main,
          pl: level + 6,
          whiteSpace: 'nowrap',
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
          }}
        />
      </MenuItem>
    </Link>
  )
}

export default ViewNav
