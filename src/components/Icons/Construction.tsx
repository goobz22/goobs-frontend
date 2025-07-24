'use client'

import React from 'react'

interface ConstructionIconProps {
  style?: React.CSSProperties
  fontSize?: 'small' | 'medium' | 'large'
  className?: string
}

const ConstructionIcon: React.FC<ConstructionIconProps> = ({
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
      <path d="M13.78,15.3L19.78,21.3L21.89,19.14L15.89,13.14L13.78,15.3M17.5,10.1C17.11,10.1 16.69,10.05 16.36,9.91L4.97,21.25L2.86,19.14L10.27,11.74C8.5,8.3 9.74,4.6 13.09,3.67C13.6,3.5 14.13,3.44 14.65,3.44C16.03,3.44 17.05,4.46 17.05,5.84C17.05,5.97 17.03,6.1 17.01,6.23L14.92,8.32L15.92,9.32L18.01,7.23C18.14,7.21 18.27,7.19 18.4,7.19C19.78,7.19 20.8,8.21 20.8,9.59C20.8,10.73 20.16,11.72 19.21,12.08C18.5,12.3 17.6,12.2 16.68,11.5L14.24,13.94L12.19,11.89C12.69,11.11 12.92,10.22 12.92,9.34C12.92,8.7 12.8,8.1 12.58,7.54L17.5,10.1Z" />
    </svg>
  )
}

export default ConstructionIcon
