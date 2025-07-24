/**
 * @fileoverview Engineering icon component
 */
'use client'
import React from 'react'

interface EngineeringIconProps {
  width?: number
  height?: number
  color?: string
  className?: string
  style?: React.CSSProperties
}

const EngineeringIcon: React.FC<EngineeringIconProps> = ({
  width = 24,
  height = 24,
  color = 'currentColor',
  className,
  style,
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      <path
        d="M9 12C10.66 12 12 10.66 12 9S10.66 6 9 6 6 7.34 6 9 7.34 12 9 12ZM9 8C9.55 8 10 8.45 10 9S9.55 10 9 10 8 9.55 8 9 8.45 8 9 8Z"
        fill={color}
      />
      <path
        d="M9 13C6.67 13 2 14.17 2 16.5V19H16V16.5C16 14.17 11.33 13 9 13ZM14 17H4V16.5C4 15.9 6.29 15 9 15S14 15.9 14 16.5V17Z"
        fill={color}
      />
      <path
        d="M16.5 5.5L18.5 7.5L23 3L21.5 1.5L18.5 4.5L17 3L16.5 5.5Z"
        fill={color}
      />
      <path
        d="M15.5 10L17 8.5L19 10.5L22.5 7L21 5.5L19 7.5L18 6.5L15.5 10Z"
        fill={color}
      />
    </svg>
  )
}

EngineeringIcon.displayName = 'EngineeringIcon'

export default EngineeringIcon
