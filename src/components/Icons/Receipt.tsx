'use client'

import React from 'react'

interface ReceiptIconProps {
  style?: React.CSSProperties
  fontSize?: 'small' | 'medium' | 'large'
  className?: string
}

const ReceiptIcon: React.FC<ReceiptIconProps> = ({
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
      <path d="M18,17H6V5H18M18,3H6A2,2 0 0,0 4,5V17A2,2 0 0,0 6,19H18A2,2 0 0,0 20,17V5A2,2 0 0,0 18,3M8,15H16V13H8M8,11H16V9H8M8,7H16V5H8" />
    </svg>
  )
}

export default ReceiptIcon
