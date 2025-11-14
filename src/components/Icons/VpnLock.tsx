'use client'

import React, { useState } from 'react'
import { IconStyles, getIconStyles, injectSacredKeyframes } from '../../theme'

interface VpnLockIconProps extends React.SVGProps<SVGSVGElement> {
  styles?: IconStyles
}

const VpnLockIcon: React.FC<VpnLockIconProps> = ({
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
        <path d="M22,4V16A2,2 0 0,1 20,18H16L12,22L8,18H4A2,2 0 0,1 2,16V4A2,2 0 0,1 4,2H20A2,2 0 0,1 22,4M13.5,6A1.5,1.5 0 0,0 12,7.5V8.5A1.5,1.5 0 0,0 10.5,10V13.5A1.5,1.5 0 0,0 12,15H15A1.5,1.5 0 0,0 16.5,13.5V10A1.5,1.5 0 0,0 15,8.5V7.5A1.5,1.5 0 0,0 13.5,6Z" />
      </svg>
      {computedStyles.isSacredTheme && <div style={computedStyles.glyph}></div>}
    </div>
  )
}

export default VpnLockIcon
