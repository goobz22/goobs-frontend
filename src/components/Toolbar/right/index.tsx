'use client'

import React from 'react'
import { Box, alpha } from '@mui/material'
import Dropdown, { DropdownProps } from '../../Field/Dropdown/Regular'
import { black } from '../../../styles/palette'

export interface RightProps {
  /** A single dropdown to render. (We'll render multiple <Right> if needed.) */
  dropdown: DropdownProps
  sacredTheme?: boolean
}

function Right({ dropdown, sacredTheme }: RightProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        flexShrink: 0,
        height: '100%',
        padding: '0 15px',
        gap: '10px',
        width: '200px',
      }}
    >
      <Dropdown
        outlinecolor={
          sacredTheme ? '#FFD700' : dropdown.outlinecolor || black.main
        }
        fontcolor={sacredTheme ? '#FFD700' : dropdown.fontcolor || black.main}
        shrunkfontcolor={
          sacredTheme ? '#FFD700' : dropdown.shrunkfontcolor || black.main
        }
        backgroundcolor={
          sacredTheme ? alpha('#000000', 0.6) : dropdown.backgroundcolor
        }
        {...dropdown}
      />
    </Box>
  )
}

export default Right
