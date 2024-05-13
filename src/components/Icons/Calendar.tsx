// src/components/Icons/Calendar.tsx
import React from 'react'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import { SvgIconProps } from '@mui/material/SvgIcon'

const CalendarIcon: React.FC<SvgIconProps> = props => {
  // Set a default size for the icon
  const iconSize = '20px' // You can change this value to any size you want

  return (
    <CalendarTodayIcon
      {...props}
      style={{
        fontSize: iconSize, // Set the size of the icon
        ...props.style, // Allow for other styles to be applied if necessary
      }}
    />
  )
}

export default CalendarIcon
