'use client'
import React from 'react'

interface ViewCompactIconProps {
  fontSize?: 'small' | 'medium' | 'large'
  style?: React.CSSProperties
}

const ViewCompactIcon: React.FC<ViewCompactIconProps> = ({
  fontSize = 'medium',
  style,
}) => {
  const size = fontSize === 'small' ? 16 : fontSize === 'large' ? 24 : 20

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      style={style}
    >
      <path d="M3,19H9V12H3V19M10,19H22V12H10V19M3,5V11H22V5H3Z" />
    </svg>
  )
}

export default ViewCompactIcon
