'use client'

import React, { useState, useEffect, useMemo } from 'react'
import {
  IconStyles,
  getIconStyles,
  injectSacredKeyframes,
  SACRED_GLYPHS,
} from '../../theme'

interface GavelIconProps extends React.SVGProps<SVGSVGElement> {
  styles?: IconStyles
}

const GavelIcon: React.FC<GavelIconProps> = ({
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
        <path d="M2.6,16.9L1.2,18.3L2.6,19.7L9.9,12.4L8.5,11L2.6,16.9M9.9,12.4L8.5,11L12.4,7.1L13.8,8.5L9.9,12.4M13.1,8.9L11.7,7.5L13.8,5.4L16.6,2.6C17,2.2 17.6,2.2 18,2.6L21.4,6C21.8,6.4 21.8,7 21.4,7.4L18.6,10.2L15.2,6.8L13.1,8.9M15.2,6.8L16.6,8.2L18.7,6.1L17.3,4.7L15.2,6.8M3,22H21V20H3V22Z" />
      </svg>
      {computedStyles.isSacredTheme && (
        <div style={computedStyles.glyph}>{glyph}</div>
      )}
    </div>
  )
}

export default GavelIcon
