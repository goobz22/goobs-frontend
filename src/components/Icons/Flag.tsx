'use client'

import React, { useState } from 'react'
import { IconStyles, getIconStyles, injectSacredKeyframes } from '../../theme'

interface FlagIconProps extends React.SVGProps<SVGSVGElement> {
  styles?: IconStyles
}

const FlagIcon: React.FC<FlagIconProps> = ({
  styles,
  style = {},
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false)

  // Inject CSS keyframes for sacred animations
  if (styles?.theme === 'sacred') {
    injectSacredKeyframes()
  }

  // Compute styles based on theme and state
  const computedStyles = getIconStyles(styles, isHovered, styles?.disabled)

  const iconStyle = {
    ...computedStyles.icon,
    ...style,
  }

  return (
    <div
      style={computedStyles.container}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24"
        viewBox="0 -960 960 960"
        width="24"
        fill="currentColor"
        style={iconStyle}
        {...props}
      >
        <path d="M200-120v-680q0-8.5 5.75-14.25T220-820q8.5 0 14.25 5.75T240-800v40h500q12.75 0 21.375 8.625T770-730v260q0 12.75-8.625 21.375T740-440H520v320q0 8.5-5.75 14.25T500-100q-8.5 0-14.25-5.75T480-120v-320H240v320q0 8.5-5.75 14.25T220-100q-8.5 0-14.25-5.75T200-120Zm40-400h490v-220H240v220Zm0 0v-220 220Z" />
      </svg>
    </div>
  )
}

export default FlagIcon
