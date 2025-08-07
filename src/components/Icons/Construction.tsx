'use client'

import React, { useState, useEffect, useMemo } from 'react'
import {
  IconStyles,
  getIconStyles,
  injectSacredKeyframes,
  SACRED_GLYPHS,
} from '../../theme'

interface ConstructionIconProps extends React.SVGProps<SVGSVGElement> {
  styles?: IconStyles
}

const ConstructionIcon: React.FC<ConstructionIconProps> = ({
  styles,
  style = {},
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [glyph] = useState(
    SACRED_GLYPHS[Math.floor(Math.random() * SACRED_GLYPHS.length)]
  )

  // Inject CSS keyframes for sacred animations
  useEffect(() => {
    if (styles?.theme === 'sacred') {
      injectSacredKeyframes()
    }
  }, [styles?.theme])

  // Compute styles based on theme and state
  const computedStyles = useMemo(
    () => getIconStyles(styles, isHovered, styles?.disabled),
    [styles, isHovered]
  )

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
        <path d="M13.78,15.3L19.78,21.3L21.89,19.14L15.89,13.14L13.78,15.3M17.5,10.1C17.11,10.1 16.69,10.05 16.36,9.91L4.97,21.25L2.86,19.14L10.27,11.74C8.5,8.3 9.74,4.6 13.09,3.67C13.6,3.5 14.13,3.44 14.65,3.44C16.03,3.44 17.05,4.46 17.05,5.84C17.05,5.97 17.03,6.1 17.01,6.23L14.92,8.32L15.92,9.32L18.01,7.23C18.14,7.21 18.27,7.19 18.4,7.19C19.78,7.19 20.8,8.21 20.8,9.59C20.8,10.73 20.16,11.72 19.21,12.08C18.5,12.3 17.6,12.2 16.68,11.5L14.24,13.94L12.19,11.89C12.69,11.11 12.92,10.22 12.92,9.34C12.92,8.7 12.8,8.1 12.58,7.54L17.5,10.1Z" />
      </svg>
      {computedStyles.isSacredTheme && (
        <div style={computedStyles.glyph}>{glyph}</div>
      )}
    </div>
  )
}

export default ConstructionIcon
