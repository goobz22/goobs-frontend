'use client'

import React from 'react'
import { Box, useMediaQuery } from '@mui/material'
import Dropdown, { DropdownProps } from '../../Dropdown'
import { black } from '../../../styles/palette'

export interface RightToolbarProps {
  /**
   * A custom component to render on the left side of this toolbar.
   * (Previously 'middleComponent', now renamed to 'customComponent'.)
   */
  customComponent?: React.ReactNode

  /**
   * Array of `DropdownProps` to render as dropdowns on the right side.
   */
  dropdowns?: DropdownProps[]
}

/**
 * Right toolbar for customComponent (left) + dropdowns (right).
 */
function RightToolbar({ customComponent, dropdowns }: RightToolbarProps) {
  const isTabletOrBelow = useMediaQuery('(max-width:1024px)')

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isTabletOrBelow ? 'column' : 'row',
        alignItems: 'center',
        width: '100%',
      }}
    >
      {/* Left part: customComponent */}
      {customComponent && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexShrink: 0,
            mt: isTabletOrBelow ? '5px' : 0,
            height: isTabletOrBelow ? 'auto' : '100%',
            padding: isTabletOrBelow ? '0 5px' : '0 15px',
          }}
        >
          {customComponent}
        </Box>
      )}

      {/* Spacer to push dropdowns to the far right in a row layout */}
      {!isTabletOrBelow && <Box sx={{ flexGrow: 1 }} />}

      {/* Dropdowns (right) */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexShrink: 0,
          height: isTabletOrBelow ? 'auto' : '100%',
          padding: isTabletOrBelow ? '0 5px' : '0 15px',
          gap: '10px',
          mt: isTabletOrBelow ? '5px' : 0,
        }}
      >
        {dropdowns?.map((dd, i) => (
          <Dropdown
            key={i}
            outlinecolor={black.main}
            fontcolor={black.main}
            shrunkfontcolor={black.main}
            onChange={() => console.log('Dropdown changed')}
            {...dd}
          />
        ))}
      </Box>
    </Box>
  )
}

export default RightToolbar
