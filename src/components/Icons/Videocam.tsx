'use client'

import React from 'react'

interface VideocamIconProps {
  style?: React.CSSProperties
  fontSize?: 'small' | 'medium' | 'large'
  className?: string
}

const VideocamIcon: React.FC<VideocamIconProps> = ({
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
      <path d="M17,10.5V7A1,1 0 0,0 16,6H4A1,1 0 0,0 3,7V17A1,1 0 0,0 4,18H16A1,1 0 0,0 17,17V13.5L21,17.5V6.5L17,10.5Z" />
    </svg>
  )
}

export default VideocamIcon
