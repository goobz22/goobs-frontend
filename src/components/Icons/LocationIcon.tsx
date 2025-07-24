'use client'
import React from 'react'

interface LocationIconProps {
  fontSize?: 'small' | 'medium' | 'large'
  style?: React.CSSProperties
}

const LocationIcon: React.FC<LocationIconProps> = ({
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
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
    </svg>
  )
}

export default LocationIcon
