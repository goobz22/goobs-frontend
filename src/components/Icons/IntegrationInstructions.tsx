'use client'

import React, { useState } from 'react'
import { IconStyles, getIconStyles, injectSacredKeyframes } from '../../theme'

interface IntegrationInstructionsIconProps
  extends React.SVGProps<SVGSVGElement> {
  styles?: IconStyles
}

const IntegrationInstructionsIcon: React.FC<
  IntegrationInstructionsIconProps
> = ({ styles, style = {}, ...props }) => {
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
        <path d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M19,19H5V5H19V19M17,12H7V10H17V12M17,16H7V14H17V16M17,8H7V6H17V8Z" />
      </svg>
      {computedStyles.isSacredTheme && <div style={computedStyles.glyph}></div>}
    </div>
  )
}

export default IntegrationInstructionsIcon
