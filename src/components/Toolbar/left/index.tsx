'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Box, styled, useMediaQuery } from '@mui/material'
import CustomButton, { CustomButtonProps } from '../../Button'
import Searchbar, { SearchbarProps } from '../../Searchbar'
import {
  white,
  black,
  grey,
  semiTransparentWhite,
} from '../../../styles/palette'

/** A simple vertical divider */
const VerticalDivider = styled(Box)({
  borderLeft: '2px solid black',
  height: '20px',
})

export interface LeftToolbarProps {
  /**
   * Array of `CustomButtonProps` to render as buttons on the left side.
   */
  buttons?: CustomButtonProps[]

  /**
   * Props for the search bar.
   */
  searchbarProps?: Partial<SearchbarProps>
}

/**
 * Left toolbar for buttons (left) + searchbar (right).
 * Hides the searchbar on tablet/mobile or when there is insufficient space.
 */
function LeftToolbar({ buttons, searchbarProps }: LeftToolbarProps) {
  const [checkboxWidth] = useState(45)
  const toolbarHeight = 60
  const buttonHeight = '45px'

  // Determine if we are on tablet/mobile (<= 1024px)
  const isTabletOrBelow = useMediaQuery('(max-width:1024px)')

  // Ref for measuring widths
  const containerRef = useRef<HTMLDivElement>(null)

  // Whether to show the searchbar (desktop only)
  const [showSearchbar, setShowSearchbar] = useState(true)

  // We'll treat the searchbar as 300px wide when shown
  const SEARCHBAR_WIDTH = 300
  const extraPadding = 30

  const checkSpace = useCallback(() => {
    if (isTabletOrBelow) {
      setShowSearchbar(false)
      return
    }

    const container = containerRef.current
    if (!container) return

    // Temporarily show it so we can measure
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

  useEffect(() => {
    const handleResize = () => checkSpace()
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
        display: 'flex',
        flexWrap: 'nowrap',
        flexDirection: isTabletOrBelow ? 'column' : 'row',
        alignItems: 'center',
        // UPDATED: use 'auto' so no extra forced height
        height: isTabletOrBelow ? 'auto' : `${toolbarHeight}px`,
        width: '100%',
        overflow: 'hidden',
        pt: 0,
        pl: isTabletOrBelow ? 0 : `${checkboxWidth}px`,
      }}
    >
      {/* Left-side buttons (with a vertical divider) */}
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
            const isDisabled = Boolean(btn.disabled)
            return (
              <CustomButton
                key={i}
                text={btn.text}
                onClick={btn.onClick}
                disabled={isDisabled}
                disableButton={isDisabled ? 'true' : 'false'}
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

      <Box
        sx={{
          display: showSearchbar && !isTabletOrBelow ? 'flex' : 'none',
          width:
            showSearchbar && !isTabletOrBelow ? `${SEARCHBAR_WIDTH}px` : '0px',
          transition: 'width 0.3s ease, opacity 0.3s ease',
          overflow: 'hidden',
          alignItems: 'center',
          flexShrink: 0,
          height: 'auto',
          // UPDATED: shift the searchbar up by 5px
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
    </Box>
  )
}

export default LeftToolbar
