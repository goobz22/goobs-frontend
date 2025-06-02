// src/components/Toolbar/leftCenter/index.tsx

'use client'

import React, { FC } from 'react'
import { Box, keyframes, alpha } from '@mui/material'
import Searchbar, { SearchbarProps } from '../../Field/Search'

// Sacred theming animation
const sacredGlow = keyframes`
  0% { box-shadow: 0 0 10px rgba(255, 215, 0, 0.3); }
  50% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.5); }
  100% { box-shadow: 0 0 10px rgba(255, 215, 0, 0.3); }
`

interface LeftCenterProps extends Partial<SearchbarProps> {
  sacredTheme?: boolean
}

const LeftCenter: FC<LeftCenterProps> = props => {
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
    sacredTheme,
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
        position: 'relative',
        ...(sacredTheme && {
          '&::before': {
            content: '"𓂀"',
            position: 'absolute',
            top: '5px',
            right: '-20px',
            fontSize: '16px',
            color: alpha('#FFD700', 0.3),
            animation: 'rotate 15s linear infinite',
            zIndex: 1,
          },
        }),
      }}
    >
      <Box
        sx={{
          marginBottom: '7px',
          width: '100%',
          ...(sacredTheme && {
            animation: `${sacredGlow} 3s ease-in-out infinite`,
            borderRadius: '4px',
          }),
        }}
      >
        <Searchbar
          shrunklabelposition={shrunklabelposition}
          shrunkfontcolor={sacredTheme ? '#FFD700' : shrunkfontcolor}
          unshrunkfontcolor={
            sacredTheme ? alpha('#FFD700', 0.8) : unshrunkfontcolor
          }
          label={sacredTheme ? 'Divine Search' : label}
          backgroundcolor={
            sacredTheme ? alpha('#000000', 0.6) : backgroundcolor
          }
          iconcolor={sacredTheme ? '#FFD700' : iconcolor}
          outlinecolor={sacredTheme ? '#FFD700' : outlinecolor}
          fontcolor={sacredTheme ? '#FFD700' : fontcolor}
          placeholder={sacredTheme ? 'Seek ancient wisdom...' : placeholder}
          value={value}
          onChange={onChange}
          sacredTheme={sacredTheme}
        />
      </Box>
    </Box>
  )
}

export default LeftCenter
