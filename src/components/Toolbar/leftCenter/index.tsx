// src/components/Toolbar/leftCenter/index.tsx

'use client'

import React, { FC } from 'react'
import { Box } from '@mui/material'
import Searchbar, { SearchbarProps } from '../../Field/Search'

const LeftCenter: FC<Partial<SearchbarProps>> = props => {
  const {
    shrunklabelposition,
    shrunkfontcolor,
    unshrunkfontcolor,
    label,
    backgroundcolor,
    iconcolor,
    outlinecolor,
    fontcolor,
    placeholder,
    // Provide sensible defaults:
    value = '',
    onChange = () => {},
  } = props

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-end',
        width: '400px',
        height: '55px',
      }}
    >
      <Box sx={{ marginBottom: '10px' }}>
        <Searchbar
          shrunklabelposition={shrunklabelposition}
          shrunkfontcolor={shrunkfontcolor}
          unshrunkfontcolor={unshrunkfontcolor}
          label={label}
          backgroundcolor={backgroundcolor}
          iconcolor={iconcolor}
          outlinecolor={outlinecolor}
          fontcolor={fontcolor}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      </Box>
    </Box>
  )
}

export default LeftCenter
