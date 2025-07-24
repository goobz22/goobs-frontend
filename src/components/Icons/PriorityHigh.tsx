/**
 * @fileoverview PriorityHigh icon component
 */
'use client'
import React from 'react'

interface PriorityHighIconProps {
  width?: number
  height?: number
  color?: string
  className?: string
  style?: React.CSSProperties
}

const PriorityHighIcon: React.FC<PriorityHighIconProps> = ({
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
      <path d="M14 20H10V11H14V20ZM14 9H10V4H14V9Z" fill={color} />
      <path d="M12 2L14.5 4.5L12 7L9.5 4.5L12 2Z" fill={color} />
    </svg>
  )
}

PriorityHighIcon.displayName = 'PriorityHighIcon'

export default PriorityHighIcon
