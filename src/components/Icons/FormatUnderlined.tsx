'use client'

import React, { useState } from 'react'
import { IconStyles, getIconStyles, injectSacredKeyframes } from '../../theme'

interface FormatUnderlinedIconProps extends React.SVGProps<SVGSVGElement> {
  styles?: IconStyles
}

const FormatUnderlinedIcon: React.FC<FormatUnderlinedIconProps> = ({
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
        <path d="M120-120v-80h720v80H120Zm360-200q-83 0-141.5-58.5T280-520v-280h80v280q0 50 35 85t85 35q50 0 85-35t35-85v-280h80v280q0 83-58.5 141.5T480-320Z" />
      </svg>
      {computedStyles.isSacredTheme && <div style={computedStyles.glyph}></div>}
    </div>
  )
}

export default FormatUnderlinedIcon
