'use client'
import React from 'react'

interface SmartButtonIconProps {
  fontSize?: 'small' | 'medium' | 'large'
  style?: React.CSSProperties
}

const SmartButtonIcon: React.FC<SmartButtonIconProps> = ({
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
      <path d="M17,15H7V13H17M17,11H7V9H17M17,7H7V5H17M19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3Z" />
    </svg>
  )
}

export default SmartButtonIcon
