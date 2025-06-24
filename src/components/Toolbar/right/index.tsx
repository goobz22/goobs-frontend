'use client'

import React from 'react'
import { Box, alpha } from '@mui/material'
import Dropdown, { DropdownProps } from '../../Field/Dropdown/Regular'
import { black } from '../../../styles/palette'

export interface RightProps {
  /** A single dropdown to render. (We'll render multiple <Right> if needed.) */
  dropdown: DropdownProps
  sacredtheme?: boolean
}

function Right({ dropdown, sacredtheme }: RightProps) {
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
          sacredtheme ? '#FFD700' : dropdown.outlinecolor || black.main
        }
        fontcolor={sacredtheme ? '#FFD700' : dropdown.fontcolor || black.main}
        shrunkfontcolor={
          sacredtheme ? '#FFD700' : dropdown.shrunkfontcolor || black.main
        }
        backgroundcolor={
          sacredtheme ? alpha('#000000', 0.6) : dropdown.backgroundcolor
        }
        {...dropdown}
      />
    </Box>
  )
}

export default Right
