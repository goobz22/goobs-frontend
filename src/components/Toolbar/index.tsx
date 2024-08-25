'use client'
import React, { useState } from 'react'
import { Box, styled } from '@mui/material'
import CustomButton, { CustomButtonProps } from '../Button'
import Searchbar, { SearchbarProps } from '../Searchbar'
import Dropdown, { DropdownProps } from '../Dropdown'
import { white, black, semiTransparentWhite } from '../../styles/palette'

/**
 * Styled component for a vertical divider
 */
const VerticalDivider = styled(Box)({
  borderLeft: '2px solid black',
  height: '20px',
})

/**
 * Interface for the CustomToolbar component props
 */
export interface ToolbarProps {
  buttons?: CustomButtonProps[]
  dropdowns?: DropdownProps[]
  searchbarProps?: SearchbarProps
}

/**
 * CustomToolbar component that renders a toolbar with buttons, dropdowns, and a search bar
 * @param {ToolbarProps} props - The props for the CustomToolbar component
 * @returns {JSX.Element} The rendered CustomToolbar component
 */
function CustomToolbar({ buttons, dropdowns, searchbarProps }: ToolbarProps) {
  // State for checkbox width (set to 45px as default)
  const [checkboxWidth] = useState(45)
  // Explicitly set toolbar height to 56px
  const toolbarHeight = 56

  return (
    <Box
      sx={{
        pt: 0,
        pl: `${checkboxWidth}px`,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'stretch',
        height: `${toolbarHeight}px`,
      }}
    >
      {/* Left section of the toolbar */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'stretch',
          height: '100%',
        }}
      >
        {/* Vertical divider */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            height: '100%',
            padding: '0 15px',
          }}
        >
          <VerticalDivider />
        </Box>
        {/* Buttons section */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            height: '100%',
            padding: '0 15px',
          }}
        >
          {buttons &&
            buttons.map((button, index) => (
              <CustomButton
                key={index}
                text={button.text}
                fontcolor={white.main}
                backgroundcolor={black.main}
                fontvariant="merriparagraph"
                variant="contained"
                onClick={button.onClick}
              />
            ))}
        </Box>
      </Box>
      {/* Search bar section */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          width: '300px',
          minWidth: '200px',
          height: '100%',
        }}
      >
        <Searchbar
          backgroundcolor={semiTransparentWhite.main}
          label="Search the DataGrid"
          fontcolor={black.main}
          iconcolor={black.main}
          onChange={() => console.log('Search changed')}
          {...searchbarProps}
        />
      </Box>
      {/* Dropdowns section */}
      {dropdowns && dropdowns.length > 0 && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            height: '100%',
            padding: '0 15px',
            gap: '10px',
          }}
        >
          {dropdowns.map((dropdown, index) => (
            <Dropdown
              key={index}
              outlinecolor={black.main}
              fontcolor={black.main}
              shrunkfontcolor={black.main}
              onChange={() => console.log('Dropdown changed')}
              {...dropdown}
            />
          ))}
        </Box>
      )}
    </Box>
  )
}

export default CustomToolbar
