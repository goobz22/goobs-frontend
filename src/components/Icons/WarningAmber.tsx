/**
 * @fileoverview WarningAmber icon component
 */
'use client'
import React from 'react'

interface WarningAmberIconProps {
  width?: number
  height?: number
  color?: string
  className?: string
  style?: React.CSSProperties
}

const WarningAmberIcon: React.FC<WarningAmberIconProps> = ({
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
        d="M12 5.99L19.53 19H4.47L12 5.99ZM12 2L1 21H23L12 2Z"
        fill={color}
        fillOpacity="0.3"
      />
      <path d="M13 16H11V18H13V16ZM13 10H11V14H13V10Z" fill={color} />
    </svg>
  )
}

WarningAmberIcon.displayName = 'WarningAmberIcon'

export default WarningAmberIcon
