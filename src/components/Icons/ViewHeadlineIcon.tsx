'use client'
import React from 'react'

interface ViewHeadlineIconProps {
  fontSize?: 'small' | 'medium' | 'large'
  style?: React.CSSProperties
}

const ViewHeadlineIcon: React.FC<ViewHeadlineIconProps> = ({
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
      <path d="M4,5H20V7H4V5M4,9H20V11H4V9M4,13H20V15H4V13M4,17H20V19H4V17Z" />
    </svg>
  )
}

export default ViewHeadlineIcon
