'use client'
import React, { useState } from 'react'
import { Box, styled } from '@mui/material'
import CustomButton, { CustomButtonProps } from '../Button'
import Searchbar, { SearchbarProps } from '../Searchbar'
import Dropdown, { DropdownProps } from '../Dropdown'
import { white, black, semiTransparentWhite } from '../../styles/palette'

const VerticalDivider = styled(Box)({
  borderLeft: '2px solid black',
  height: '20px',
})

export interface ToolbarProps {
  buttons?: CustomButtonProps[]
  dropdowns?: DropdownProps[]
  searchbarProps?: Partial<SearchbarProps>
}

function CustomToolbar({ buttons, dropdowns, searchbarProps }: ToolbarProps) {
  const [checkboxWidth] = useState(45)
  const toolbarHeight = 45

  return (
    <Box
      sx={{
        pt: 0,
        pl: `${checkboxWidth}px`,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        height: `${toolbarHeight}px`,
        width: '100%',
      }}
    >
      {/* Left section with buttons and divider */}
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
            alignItems: 'flex-end', // Changed from center to flex-end
            paddingBottom: '13px', // Added padding to align with other elements
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
          padding: '0 15px',
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

      {/* Spacer to push dropdowns to the right */}
      <Box sx={{ flexGrow: 1 }} />

      {/* Dropdowns section */}
      {dropdowns && dropdowns.length > 0 && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-end', // Changed from center to flex-end
            paddingBottom: '13px', // Added padding to align with other elements
            height: '100%',
            padding: '0 15px',
            gap: '10px',
            marginLeft: 'auto',
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
