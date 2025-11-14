'use client'

import React, { useState } from 'react'
import { IconStyles, getIconStyles, injectSacredKeyframes } from '../../theme'

interface StorageIconProps extends React.SVGProps<SVGSVGElement> {
  styles?: IconStyles
}

const StorageIcon: React.FC<StorageIconProps> = ({
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
        <path d="M2 20h20v-4H2v4zm2-3h2v2H4v-2zm-2-2h20v-4H2v4zm2-3h2v2H4v-2zm-2-2h20V6H2v4zm2-3h2v2H4V8z" />
      </svg>
      {computedStyles.isSacredTheme && <div style={computedStyles.glyph}></div>}
    </div>
  )
}

export default StorageIcon
