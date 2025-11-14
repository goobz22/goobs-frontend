'use client'

import React, { useState } from 'react'
import { IconStyles, getIconStyles, injectSacredKeyframes } from '../../theme'

interface LowPriorityIconProps extends React.SVGProps<SVGSVGElement> {
  styles?: IconStyles
}

const LowPriorityIcon: React.FC<LowPriorityIconProps> = ({
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
        <path d="M14 10H10V20H14V10ZM14 4H10V8H14V4Z" />
        <path d="M12 22L9.5 19.5L12 17L14.5 19.5L12 22Z" />
      </svg>
      {computedStyles.isSacredTheme && <div style={computedStyles.glyph}></div>}
    </div>
  )
}

LowPriorityIcon.displayName = 'LowPriorityIcon'

export default LowPriorityIcon
