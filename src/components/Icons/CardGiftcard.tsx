'use client'

import React from 'react'

interface CardGiftcardIconProps {
  style?: React.CSSProperties
  fontSize?: 'small' | 'medium' | 'large'
  className?: string
}

const CardGiftcardIcon: React.FC<CardGiftcardIconProps> = ({
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
      <path d="M20,6H16.35C16.64,5.43 16.86,4.82 17,4.18C17.16,3.54 17.13,2.88 16.91,2.26C16.68,1.64 16.28,1.09 15.74,0.68C15.2,0.27 14.55,0 13.88,0C13.21,0 12.56,0.27 12.02,0.68C11.48,1.09 11.08,1.64 10.85,2.26C10.63,2.88 10.6,3.54 10.76,4.18C10.9,4.82 11.12,5.43 11.41,6H4A2,2 0 0,0 2,8V20A2,2 0 0,0 4,22H20A2,2 0 0,0 22,20V8A2,2 0 0,0 20,6M12,4A1,1 0 1,1 13,5A1,1 0 0,1 12,4M20,20H4V10H20V20Z" />
    </svg>
  )
}

export default CardGiftcardIcon
