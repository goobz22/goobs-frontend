'use client'

import React, { FC } from 'react'
import { Box, useMediaQuery } from '@mui/material'
import Left from './left'
import LeftCenter from './leftCenter'
import Right from './right'
import RightCenter, { RightCenterProps } from './rightCenter'
import { CustomButtonProps } from '../Button'
import { DropdownProps } from '../Field/Dropdown/Regular'
import { SearchbarProps } from '../Field/Search'

/**
 * Props for CustomToolbar:
 *  - `buttons` (optional) -> <Left />
 *  - `searchbarProps` (optional) -> <LeftCenter />
 *  - `rightCenterProps` (optional) -> <RightCenter />
 *  - `dropdowns` (optional, can be one or many) -> <Right /> (rendered in a loop)
 */
export interface CustomToolbarProps {
  buttons?: CustomButtonProps[]
  searchbarProps?: SearchbarProps
  rightCenterProps?: RightCenterProps
  dropdowns?: DropdownProps[] // <-- changed from "dropdown?" to "dropdowns?"
}

const CustomToolbar: FC<CustomToolbarProps> = ({
  buttons,
  searchbarProps,
  rightCenterProps,
  dropdowns,
}) => {
  // 1) Mobile:  <= 600px
  // 2) Tablet:  600px < width <= 1024px
  // 3) Desktop: > 1024px
  const isMobile = useMediaQuery('(max-width:600px)')
  const isTabletOrBelow = useMediaQuery('(max-width:1024px)')

  // ================== DESKTOP (width > 1024px) ==================
  // Keep the searchbar visible, everything in one row.
  if (!isTabletOrBelow) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2,
          width: '100%',
        }}
      >
        {/* Left half: Buttons + Searchbar */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            flexWrap: 'wrap',
          }}
        >
          <Left buttons={buttons} />
          {searchbarProps && <LeftCenter {...searchbarProps} />}
        </Box>

        {/* Right half: RightCenter + (multiple) dropdowns */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            flexWrap: 'wrap',
          }}
        >
          {rightCenterProps && <RightCenter {...rightCenterProps} />}
          {dropdowns?.map((dd, index) => <Right key={index} dropdown={dd} />)}
        </Box>
      </Box>
    )
  }

  // ================== TABLET (600px < width <= 1024px) ==================
  // Hide the searchbar, keep buttons on the left, rightCenter + dropdowns on the right.
  if (!isMobile) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2,
          width: '100%',
        }}
      >
        {/* Left half: Buttons */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            flexWrap: 'wrap',
          }}
        >
          <Left buttons={buttons} />
        </Box>

        {/* Right half: RightCenter + (multiple) dropdowns */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            flexWrap: 'wrap',
          }}
        >
          {rightCenterProps && <RightCenter {...rightCenterProps} />}
          {dropdowns?.map((dd, index) => <Right key={index} dropdown={dd} />)}
        </Box>
      </Box>
    )
  }

  // ================== MOBILE (width <= 600px) ==================
  // Hide the searchbar, stack everything vertically.
  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', width: '100%', mb: 2 }}
    >
      {/* Row 1: Buttons */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Left buttons={buttons} />
      </Box>

      {/* Row 2: RightCenter (selected rows actions) */}
      {rightCenterProps && (
        <Box sx={{ mt: 2 }}>
          <RightCenter {...rightCenterProps} />
        </Box>
      )}

      {/* Row 3: (multiple) Dropdowns */}
      {dropdowns?.map((dd, index) => (
        <Box sx={{ mt: 2 }} key={index}>
          <Right dropdown={dd} />
        </Box>
      ))}
    </Box>
  )
}

export default CustomToolbar
