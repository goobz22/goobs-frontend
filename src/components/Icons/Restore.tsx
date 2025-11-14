'use client'

import React, { useState } from 'react'
import { IconStyles, getIconStyles, injectSacredKeyframes } from '../../theme'

interface RestoreIconProps extends React.SVGProps<SVGSVGElement> {
  styles?: IconStyles
}

const RestoreIcon: React.FC<RestoreIconProps> = ({
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
  return (
    <div
      style={computedStyles.container}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24"
        viewBox="0 0 24 24"
        width="24"
        fill="currentColor"
        style={{ ...computedStyles.icon, ...style }}
        {...props}
      >
        <path d="M13 3a9 9 0 0 0-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0 0 13 21a9 9 0 0 0 0-18zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z" />
      </svg>
      {computedStyles.isSacredTheme && <div style={computedStyles.glyph}></div>}
    </div>
  )
}

export default RestoreIcon
