// src/components/Icons/Calendar.tsx
import React from 'react'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import { SvgIconProps } from '@mui/material/SvgIcon'
import { keyframes } from '@mui/material'

const glowPulse = keyframes`
  0% { filter: drop-shadow(0 0 3px rgba(255, 215, 0, 0.5)); }
  50% { filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.8)); }
  100% { filter: drop-shadow(0 0 3px rgba(255, 215, 0, 0.5)); }
`

interface CalendarIconProps extends SvgIconProps {
  sacredTheme?: boolean
}

const CalendarIcon: React.FC<CalendarIconProps> = ({
  sacredTheme,
  ...props
}) => {
  // Set a default size for the icon
  const iconSize = '20px' // You can change this value to any size you want

  return (
    <CalendarTodayIcon
      {...props}
      style={{
        fontSize: iconSize, // Set the size of the icon
        ...(sacredTheme && {
          color: '#FFD700',
          animation: `${glowPulse} 2s ease-in-out infinite`,
        }),
        ...props.style, // Allow for other styles to be applied if necessary
      }}
    />
  )
}

export default CalendarIcon
