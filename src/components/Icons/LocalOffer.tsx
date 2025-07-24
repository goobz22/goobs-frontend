'use client'

import React from 'react'

interface LocalOfferIconProps {
  style?: React.CSSProperties
  fontSize?: 'small' | 'medium' | 'large'
  className?: string
}

const LocalOfferIcon: React.FC<LocalOfferIconProps> = ({
  style,
  fontSize = 'medium',
  className,
}) => {
  const sizeMap = {
    small: 20,
    medium: 24,
    large: 32,
  }

  const size = sizeMap[fontSize]

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      style={style}
      className={className}
    >
      <path d="M21.41,11.58L12.41,2.58C12.04,2.21 11.53,2 11,2H4C2.9,2 2,2.9 2,4V11C2,11.53 2.21,12.04 2.59,12.42L11.59,21.42C11.95,21.78 12.45,21.97 13,22C13.55,22 14.05,21.78 14.41,21.41L21.41,14.41C21.78,14.05 22,13.55 22,13C22,12.45 21.78,11.95 21.41,11.58M13,20L4,11V4H11L20,13L13,20M6.5,5A1.5,1.5 0 1,1 5,6.5A1.5,1.5 0 0,1 6.5,5Z" />
    </svg>
  )
}

export default LocalOfferIcon
