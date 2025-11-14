'use client'

import React, { useState } from 'react'
import { IconStyles, getIconStyles, injectSacredKeyframes } from '../../theme'

interface ReceiptIconProps extends React.SVGProps<SVGSVGElement> {
  styles?: IconStyles
}

const ReceiptIcon: React.FC<ReceiptIconProps> = ({
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
        <path d="M18,17H6V5H18M18,3H6A2,2 0 0,0 4,5V17A2,2 0 0,0 6,19H18A2,2 0 0,0 20,17V5A2,2 0 0,0 18,3M8,15H16V13H8M8,11H16V9H8M8,7H16V5H8" />
      </svg>
      {computedStyles.isSacredTheme && <div style={computedStyles.glyph}></div>}
    </div>
  )
}

export default ReceiptIcon
