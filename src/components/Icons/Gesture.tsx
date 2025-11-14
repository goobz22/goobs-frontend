'use client'

import React, { useState } from 'react'
import { IconStyles, getIconStyles, injectSacredKeyframes } from '../../theme'

interface GestureIconProps extends React.SVGProps<SVGSVGElement> {
  styles?: IconStyles
}

const GestureIcon: React.FC<GestureIconProps> = ({
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
        <path d="m80-40 200-560h80L240-280h240L360-600h80l120 320h160L600-600h80l120 320h80L680-880h-80L480-560 360-880h-80L80-40Zm280-240h-80l40-80h80l-40 80Zm240 0h-80l40-80h80l-40 80Z" />
      </svg>
      {computedStyles.isSacredTheme && <div style={computedStyles.glyph}></div>}
    </div>
  )
}

export default GestureIcon
