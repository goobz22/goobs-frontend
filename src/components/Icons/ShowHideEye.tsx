'use client'

import React from 'react'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { keyframes } from '@mui/material'

const glowPulse = keyframes`
  0% { filter: drop-shadow(0 0 3px rgba(255, 215, 0, 0.5)); }
  50% { filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.8)); }
  100% { filter: drop-shadow(0 0 3px rgba(255, 215, 0, 0.5)); }
`

interface ShowHideEyeIconProps {
  visible?: boolean
  sacredTheme?: boolean
}

const ShowHideEyeIcon: React.FC<ShowHideEyeIconProps> = ({
  visible = false,
  sacredTheme,
}) => {
  const iconStyle = {
    color: sacredTheme ? '#FFD700' : 'black',
    ...(sacredTheme && {
      animation: `${glowPulse} 2s ease-in-out infinite`,
    }),
  }
  return visible ? (
    <VisibilityIcon style={iconStyle} />
  ) : (
    <VisibilityOffIcon style={iconStyle} />
  )
}

export default ShowHideEyeIcon
