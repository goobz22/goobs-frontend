'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Box, styled, useMediaQuery } from '@mui/material'
import CustomButton, { CustomButtonProps } from '../Button'
import Searchbar, { SearchbarProps } from '../Searchbar'
import Dropdown, { DropdownProps } from '../Dropdown'
import { white, black, semiTransparentWhite, grey } from '../../styles/palette'

// A simple vertical divider
const VerticalDivider = styled(Box)({
  borderLeft: '2px solid black',
  height: '20px',
})

export interface ToolbarProps {
  /** Array of CustomButtonProps to render as buttons on the left side. */
  buttons?: CustomButtonProps[]
  /** Array of DropdownProps to render as dropdowns on the right side. */
  dropdowns?: DropdownProps[]
  /** Props for the search bar. */
  searchbarProps?: Partial<SearchbarProps>
  /** Optional middle component to render between the left buttons and the searchbar. */
  middleComponent?: React.ReactNode
}

function CustomToolbar({
  buttons,
  dropdowns,
  searchbarProps,
  middleComponent,
}: ToolbarProps) {
  const [checkboxWidth] = useState(45)
  const toolbarHeight = 60
  const buttonHeight = '45px'

  // Determine if we are on tablet/mobile (<= 1024px)
  const isTabletOrBelow = useMediaQuery('(max-width:1024px)')

  // Refs for measuring widths
  const containerRef = useRef<HTMLDivElement>(null)

  // Whether to show the searchbar (desktop only)
  const [showSearchbar, setShowSearchbar] = useState(true)

  // We'll treat the searchbar as 300px wide when shown
  const SEARCHBAR_WIDTH = 300
  const extraPadding = 30

  /**
   * Wrap checkSpace in a useCallback so it’s a stable reference
   * and can be listed in the useEffect dependency array without warnings.
   */
  const checkSpace = useCallback(() => {
    // If we're on tablet/mobile, the searchbar is always hidden, so no check needed.
    if (isTabletOrBelow) {
      setShowSearchbar(false)
      return
    }

    const container = containerRef.current
    if (!container) return

    // Temporarily ensure we "want" the searchbar so we can measure total scrollWidth
    setShowSearchbar(true)

    requestAnimationFrame(() => {
      // If scrollWidth truly exceeds clientWidth => hide the searchbar
      if (container.scrollWidth > container.clientWidth + extraPadding) {
        setShowSearchbar(false)
      } else {
        setShowSearchbar(true)
      }
    })
  }, [isTabletOrBelow, extraPadding])

  // On mount + window resize (and if `isTabletOrBelow` changes), run checkSpace
  useEffect(() => {
    const handleResize = () => {
      checkSpace()
    }
    window.addEventListener('resize', handleResize)

    // Check once on mount
    checkSpace()

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [checkSpace, isTabletOrBelow])

  return (
    <Box
      ref={containerRef}
      sx={{
        pt: 0,
        pl: isTabletOrBelow ? 0 : `${checkboxWidth}px`,
        display: 'flex',
        flexWrap: 'nowrap', // no wrapping: we measure scrollWidth for overflow
        flexDirection: isTabletOrBelow ? 'column' : 'row',
        alignItems: 'center',
        height: isTabletOrBelow ? 'auto' : `${toolbarHeight}px`,
        width: '100%',
        overflow: 'hidden', // hide horizontal overflow if it doesn't fit
      }}
    >
      {/* ----------------------------------------- */}
      {/* 1) Left: Divider + Buttons (never hidden) */}
      {/* ----------------------------------------- */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          flexShrink: 0,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            height: '100%',
            padding: isTabletOrBelow ? '0 5px' : '0 15px',
          }}
        >
          <VerticalDivider />
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            flexShrink: 0,
            padding: isTabletOrBelow ? '0 5px' : '0 15px',
          }}
        >
          {buttons?.map((btn, i) => {
            // If the button is disabled, we set disabled={true} on CustomButton
            // Also override backgroundcolor to grey.main
            const isDisabled = Boolean(btn.disabled)

            return (
              <CustomButton
                key={i}
                text={btn.text}
                onClick={btn.onClick}
                disabled={isDisabled} // MUI disabled
                disableButton={isDisabled ? 'true' : 'false'} // unify if needed
                fontcolor={white.main}
                backgroundcolor={isDisabled ? grey.main : black.main}
                fontvariant="merriparagraph"
                variant="contained"
                height={buttonHeight}
              />
            )
          })}
        </Box>
      </Box>

      {/* ----------------------------------------- */}
      {/* 2) Middle component (ManageRow), no hide */}
      {/* ----------------------------------------- */}
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
        {middleComponent}
      </Box>

      {/* ----------------------------------------- */}
      {/* 3) The searchbar (desktop only, can hide) */}
      {/* ----------------------------------------- */}
      <Box
        sx={{
          width:
            showSearchbar && !isTabletOrBelow ? `${SEARCHBAR_WIDTH}px` : '0px',
          opacity: showSearchbar && !isTabletOrBelow ? 1 : 0,
          pointerEvents: showSearchbar && !isTabletOrBelow ? 'all' : 'none',
          transition: 'width 0.3s ease, opacity 0.3s ease',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          flexShrink: 0,
          height: isTabletOrBelow ? 'auto' : '100%',
          marginTop: '-8px',
        }}
      >
        <Box
          sx={{
            padding: showSearchbar && !isTabletOrBelow ? '0 15px' : '0px',
            transition: 'padding 0.3s ease',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}
        >
          <Searchbar
            backgroundcolor={semiTransparentWhite.main}
            outlinecolor="none"
            label="Search the DataGrid"
            fontcolor={black.main}
            iconcolor={black.main}
            value={searchbarProps?.value || ''}
            onChange={searchbarProps?.onChange || (() => {})}
            {...searchbarProps}
          />
        </Box>
      </Box>

      {/* Spacer to push dropdowns to the far right */}
      <Box sx={{ flexGrow: 1 }} />

      {/* ----------------------------------------- */}
      {/* 4) Dropdowns (never hide)                */}
      {/* ----------------------------------------- */}
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

export default CustomToolbar
