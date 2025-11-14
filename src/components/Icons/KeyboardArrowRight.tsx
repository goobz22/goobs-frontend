'use client'

import React, { useState } from 'react'
import { IconStyles, getIconStyles, injectSacredKeyframes } from '../../theme'

interface KeyboardArrowRightIconProps extends React.SVGProps<SVGSVGElement> {
  styles?: IconStyles
}

const KeyboardArrowRightIcon: React.FC<KeyboardArrowRightIconProps> = ({
  styles,
  style = {},
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false)

  // Use a deterministic glyph index to avoid hydration mismatches
  // Use a fixed index or derive from props for consistency  // Inject CSS keyframes for sacred animations
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
        <path d="M355.385-263.692 312.308-306.77l216.307-216.307L312.308-739.385l43.077-43.077 259.385 259.385L355.385-263.692Z" />
      </svg>
      {computedStyles.isSacredTheme && <div style={computedStyles.glyph}></div>}
    </div>
  )
}

export default KeyboardArrowRightIcon
