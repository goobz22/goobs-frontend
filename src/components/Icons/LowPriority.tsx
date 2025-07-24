/**
 * @fileoverview LowPriority icon component
 */
'use client'
import React from 'react'

interface LowPriorityIconProps {
  width?: number
  height?: number
  color?: string
  className?: string
  style?: React.CSSProperties
}

const LowPriorityIcon: React.FC<LowPriorityIconProps> = ({
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
      <path d="M14 10H10V20H14V10ZM14 4H10V8H14V4Z" fill={color} />
      <path d="M12 22L9.5 19.5L12 17L14.5 19.5L12 22Z" fill={color} />
    </svg>
  )
}

LowPriorityIcon.displayName = 'LowPriorityIcon'

export default LowPriorityIcon
