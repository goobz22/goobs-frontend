'use client'

import React, { useState } from 'react'
import { IconStyles, getIconStyles, injectSacredKeyframes } from '../../theme'

interface LanIconProps extends React.SVGProps<SVGSVGElement> {
  styles?: IconStyles
}

const LanIcon: React.FC<LanIconProps> = ({ styles, style = {}, ...props }) => {
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
        viewBox="0 0 24 24"
        width="24"
        fill="currentColor"
        style={iconStyle}
        {...props}
      >
        <path d="M13 4h-2v16h2m0-8h8v-2h-8V4m0 6V8h8v2h-8z" />
        <rect x="3" y="6" width="6" height="12" rx="1" />
        <rect x="15" y="2" width="6" height="8" rx="1" />
        <rect x="15" y="14" width="6" height="8" rx="1" />
      </svg>
      {computedStyles.isSacredTheme && <div style={computedStyles.glyph}></div>}
    </div>
  )
}

export default LanIcon
