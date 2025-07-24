'use client'

import React from 'react'

interface ExpandLessProps {
  size?: number
  color?: string
  style?: React.CSSProperties
}

const ExpandLess: React.FC<ExpandLessProps> = ({
  size = 24,
  color = 'currentColor',
  style,
}) => {
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
        d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z"
        fill={color}
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </svg>
  )
}

export default ExpandLess
