'use client'

import React from 'react'

interface TrendingUpIconProps {
  size?: number
  color?: string
  style?: React.CSSProperties
  sacredtheme?: boolean
}

const TrendingUpIcon: React.FC<TrendingUpIconProps> = ({
  size = 24,
  color = 'currentColor',
  style,
  sacredtheme,
}) => {
  const effectiveColor = sacredtheme ? 'rgba(255, 215, 0, 0.8)' : color

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
    >
      <path
        d="m16 6 2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"
        fill={effectiveColor}
      />
    </svg>
  )
}

export default TrendingUpIcon
