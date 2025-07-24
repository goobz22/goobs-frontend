/**
 * @fileoverview BusinessCenter icon component
 */
'use client'
import React from 'react'

interface BusinessCenterIconProps {
  width?: number
  height?: number
  color?: string
  className?: string
  style?: React.CSSProperties
}

const BusinessCenterIcon: React.FC<BusinessCenterIconProps> = ({
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
        d="M20 7H16V5C16 3.9 15.1 3 14 3H10C8.9 3 8 3.9 8 5V7H4C2.9 7 2 7.9 2 9V19C2 20.1 2.9 21 4 21H20C21.1 21 22 20.1 22 19V9C22 7.9 21.1 7 20 7ZM10 5H14V7H10V5ZM20 19H4V17H6V15H8V17H16V15H18V17H20V19ZM20 13H4V9H20V13Z"
        fill={color}
      />
    </svg>
  )
}

BusinessCenterIcon.displayName = 'BusinessCenterIcon'

export default BusinessCenterIcon
