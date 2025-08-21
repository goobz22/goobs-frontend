'use client'

import React, { useState } from 'react'
import {
  IconStyles,
  getIconStyles,
  injectSacredKeyframes,
  SACRED_GLYPHS,
} from '../../theme'

interface SupportIconProps extends React.SVGProps<SVGSVGElement> {
  styles?: IconStyles
}

const SupportIcon: React.FC<SupportIconProps> = ({
  styles,
  style = {},
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const glyph = SACRED_GLYPHS[21]

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
        <path d="M12,1C8.96,1 6.21,2.65 4.98,5.24L2.25,5.65C1.18,5.84 0.5,6.85 0.68,7.92C0.86,8.99 1.87,9.67 2.94,9.49L4.63,9.2C4.57,9.76 4.54,10.37 4.54,11C4.54,11.64 4.57,12.24 4.63,12.81L2.94,12.5C1.87,12.32 0.86,13 0.68,14.07C0.5,15.14 1.18,16.15 2.25,16.34L4.98,16.75C6.21,19.34 8.96,20.99 12,20.99C15.04,20.99 17.79,19.34 19.03,16.75L21.76,16.34C22.83,16.15 23.51,15.14 23.33,14.07C23.15,13 22.14,12.32 21.07,12.5L19.38,12.81C19.44,12.24 19.47,11.64 19.47,11C19.47,10.37 19.44,9.76 19.38,9.2L21.07,9.49C22.14,9.67 23.15,8.99 23.33,7.92C23.51,6.85 22.83,5.84 21.76,5.65L19.03,5.24C17.79,2.65 15.04,1 12,1M12,3.5A6.5,6.5 0 0,1 18.5,10A6.5,6.5 0 0,1 12,16.5A6.5,6.5 0 0,1 5.5,10A6.5,6.5 0 0,1 12,3.5M12,6A4,4 0 0,0 8,10A4,4 0 0,0 12,14A4,4 0 0,0 16,10A4,4 0 0,0 12,6M12,8A2,2 0 0,1 14,10A2,2 0 0,1 12,12A2,2 0 0,1 10,10A2,2 0 0,1 12,8Z" />
      </svg>
      {computedStyles.isSacredTheme && (
        <div style={computedStyles.glyph}>{glyph}</div>
      )}
    </div>
  )
}

export default SupportIcon
