'use client'
import React from 'react'

interface GridViewIconProps {
  fontSize?: 'small' | 'medium' | 'large'
  style?: React.CSSProperties
}

const GridViewIcon: React.FC<GridViewIconProps> = ({
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
      <path d="M3,11H11V3H3M3,21H11V13H3M13,21H21V13H13M13,3V11H21V3" />
    </svg>
  )
}

export default GridViewIcon
