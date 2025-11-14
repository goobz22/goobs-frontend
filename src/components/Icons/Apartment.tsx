'use client'

import React, { useState } from 'react'
import { IconStyles, getIconStyles, injectSacredKeyframes } from '../../theme'

interface ApartmentIconProps extends React.SVGProps<SVGSVGElement> {
  styles?: IconStyles
}

const ApartmentIcon: React.FC<ApartmentIconProps> = ({
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
        viewBox="0 0 24 24"
        width="24"
        fill="currentColor"
        style={iconStyle}
        {...props}
      >
        <path d="M17,11V3H7V4H15V11H17M21,9V7H17V9H21M7,11V9L5,9V11H7M21,11V9H19V11H21M5,11V13H7V11H5M17,13V11H15V13H17M7,13V15H5V13H7M21,13V15H17V13H21M15,15V13H7V15H15M17,15V17H21V15H19V17H17M15,19V17H17V15H15V17H7V19H15M5,19V17H7V19H5M5,15V17H17V15H5Z" />
      </svg>
      {computedStyles.isSacredTheme && <div style={computedStyles.glyph}></div>}
    </div>
  )
}

export default ApartmentIcon
