'use client'

import React, { useState } from 'react'
import { IconStyles, getIconStyles, injectSacredKeyframes } from '../../theme'

interface GoogleIconProps extends React.SVGProps<SVGSVGElement> {
  styles?: IconStyles
}

const GoogleIcon: React.FC<GoogleIconProps> = ({
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
        <path d="M480-240q-33 0-56.5-23.5T400-320v-320q0-33 23.5-56.5T480-720q33 0 56.5 23.5T560-640v320q0 33-23.5 56.5T480-240Zm-160 80q-33 0-56.5-23.5T240-240v-480q0-33 23.5-56.5T320-800q33 0 56.5 23.5T400-720v480q0 33-23.5 56.5T320-160Zm320 0q-33 0-56.5-23.5T560-240v-480q0-33 23.5-56.5T640-800q33 0 56.5 23.5T720-720v480q0 33-23.5 56.5T640-160Z" />
      </svg>
      {computedStyles.isSacredTheme && <div style={computedStyles.glyph}></div>}
    </div>
  )
}

export default GoogleIcon
