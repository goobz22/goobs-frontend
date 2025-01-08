'use client'

import React from 'react'
import { Box, useMediaQuery } from '@mui/material'
import LeftToolbar, { LeftToolbarProps } from './left'
import RightToolbar, { RightToolbarProps } from './right'

export interface CustomToolbarProps
  extends LeftToolbarProps,
    RightToolbarProps {}

/**
 * Parent toolbar that arranges the LeftToolbar and RightToolbar:
 * - Side by side on desktop
 * - Stacked on tablet/mobile
 */
function CustomToolbar({
  buttons,
  searchbarProps,
  customComponent, // previously middleComponent
  dropdowns,
}: CustomToolbarProps) {
  const isTabletOrBelow = useMediaQuery('(max-width:1024px)')

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isTabletOrBelow ? 'column' : 'row',
        width: '100%',
      }}
    >
      {/* LEFT TOOLBAR: buttons + searchbar */}
      <LeftToolbar buttons={buttons} searchbarProps={searchbarProps} />

      {/* RIGHT TOOLBAR: customComponent + dropdowns */}
      <RightToolbar customComponent={customComponent} dropdowns={dropdowns} />
    </Box>
  )
}

export default CustomToolbar
