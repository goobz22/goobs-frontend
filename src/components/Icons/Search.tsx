import React from 'react'
import Search from '@mui/icons-material/Search'
import { keyframes } from '@mui/material'

const glowPulse = keyframes`
  0% { filter: drop-shadow(0 0 3px rgba(255, 215, 0, 0.5)); }
  50% { filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.8)); }
  100% { filter: drop-shadow(0 0 3px rgba(255, 215, 0, 0.5)); }
`

const SearchIcon: React.FC<{
  size?: number | 'small' | 'medium' | 'large'
  color?: string
  sacredTheme?: boolean
}> = ({ size = 'medium', color = 'black', sacredTheme }) => {
  let fontSize = '20px'

  if (typeof size === 'number') {
    fontSize = `${size}px`
  } else {
    switch (size) {
      case 'small':
        fontSize = '16px'
        break
      case 'medium':
        fontSize = '20px'
        break
      case 'large':
        fontSize = '24px'
        break
    }
  }

  return (
    <Search
      style={{
        fontSize,
        color: sacredTheme ? '#FFD700' : color,
        ...(sacredTheme && {
          animation: `${glowPulse} 2s ease-in-out infinite`,
        }),
      }}
    />
  )
}

export default SearchIcon
