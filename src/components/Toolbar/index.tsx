'use client'

import React, { FC } from 'react'
import { Box, useMediaQuery, keyframes, alpha } from '@mui/material'
import Left from './left'
import LeftCenter from './leftCenter'
import Right from './right'
import RightCenter, { RightCenterProps } from './rightCenter'
import { CustomButtonProps } from '../Button'
import { DropdownProps } from '../Field/Dropdown/Regular'
import { SearchbarProps } from '../Field/Search'

// Sacred theming animations
const sacredBorderPulse = keyframes`
  0% { border-color: ${alpha('#FFD700', 0.3)}; }
  50% { border-color: ${alpha('#FFD700', 0.6)}; }
  100% { border-color: ${alpha('#FFD700', 0.3)}; }
`

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
  sacredtheme?: boolean
}

const CustomToolbar: FC<CustomToolbarProps> = ({
  buttons,
  searchbarProps,
  rightCenterProps,
  dropdowns,
  sacredtheme,
}) => {
  // 1) Mobile:  <= 600px
  // 2) Tablet:  600px < width <= 1024px
  // 3) Desktop: > 1024px
  const isMobile = useMediaQuery('(max-width:600px)')
  const isTabletOrBelow = useMediaQuery('(max-width:1024px)')

  const containerStyles = sacredtheme
    ? {
        backgroundColor: alpha('#000000', 0.8),
        border: `1px solid ${alpha('#FFD700', 0.3)}`,
        borderRadius: 2,
        padding: 2,
        backgroundImage: `
      linear-gradient(rgba(255, 215, 0, 0.02), rgba(255, 215, 0, 0.02)),
      radial-gradient(circle at top left, rgba(255, 215, 0, 0.08) 0%, transparent 50%)
    `,
        animation: `${sacredBorderPulse} 3s ease-in-out infinite`,
        position: 'relative' as const,
        '&::before': {
          content: '"𓊗"',
          position: 'absolute',
          top: '5px',
          right: '10px',
          fontSize: '16px',
          color: alpha('#FFD700', 0.2),
          animation: 'rotate 20s linear infinite',
        },
      }
    : undefined

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
          ...containerStyles,
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
          <Left buttons={buttons} sacredtheme={sacredtheme} />
          {searchbarProps && (
            <LeftCenter {...searchbarProps} sacredtheme={sacredtheme} />
          )}
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
          {rightCenterProps && (
            <RightCenter {...rightCenterProps} sacredtheme={sacredtheme} />
          )}
          {dropdowns?.map((dd, index) => (
            <Right key={index} dropdown={dd} sacredtheme={sacredtheme} />
          ))}
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
          ...containerStyles,
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
          <Left buttons={buttons} sacredtheme={sacredtheme} />
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
          {rightCenterProps && (
            <RightCenter {...rightCenterProps} sacredtheme={sacredtheme} />
          )}
          {dropdowns?.map((dd, index) => (
            <Right key={index} dropdown={dd} sacredtheme={sacredtheme} />
          ))}
        </Box>
      </Box>
    )
  }

  // ================== MOBILE (width <= 600px) ==================
  // Hide the searchbar, stack everything vertically.
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        mb: 2,
        ...containerStyles,
      }}
    >
      {/* Row 1: Buttons */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Left buttons={buttons} sacredtheme={sacredtheme} />
      </Box>

      {/* Row 2: RightCenter (selected rows actions) */}
      {rightCenterProps && (
        <Box sx={{ mt: 2 }}>
          <RightCenter {...rightCenterProps} sacredtheme={sacredtheme} />
        </Box>
      )}

      {/* Row 3: (multiple) Dropdowns */}
      {dropdowns?.map((dd, index) => (
        <Box sx={{ mt: 2 }} key={index}>
          <Right dropdown={dd} sacredtheme={sacredtheme} />
        </Box>
      ))}
    </Box>
  )
}

export default CustomToolbar
