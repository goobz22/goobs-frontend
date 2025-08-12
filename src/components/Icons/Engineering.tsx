/**
 * @fileoverview Engineering icon component
 */
'use client'

import React, { useState, useEffect, useMemo } from 'react'
import {
  IconStyles,
  getIconStyles,
  injectSacredKeyframes,
  SACRED_GLYPHS,
} from '../../theme'

interface EngineeringIconProps extends React.SVGProps<SVGSVGElement> {
  styles?: IconStyles
}

const EngineeringIcon: React.FC<EngineeringIconProps> = ({
  styles,
  style = {},
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [glyph, setGlyph] = useState(SACRED_GLYPHS[0])
  useEffect(() => {
    setGlyph(SACRED_GLYPHS[Math.floor(Math.random() * SACRED_GLYPHS.length)])
  }, [])

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
        <path d="M9 12C10.66 12 12 10.66 12 9S10.66 6 9 6 6 7.34 6 9 7.34 12 9 12ZM9 8C9.55 8 10 8.45 10 9S9.55 10 9 10 8 9.55 8 9 8.45 8 9 8Z" />
        <path d="M9 13C6.67 13 2 14.17 2 16.5V19H16V16.5C16 14.17 11.33 13 9 13ZM14 17H4V16.5C4 15.9 6.29 15 9 15S14 15.9 14 16.5V17Z" />
        <path d="M16.5 5.5L18.5 7.5L23 3L21.5 1.5L18.5 4.5L17 3L16.5 5.5Z" />
        <path d="M15.5 10L17 8.5L19 10.5L22.5 7L21 5.5L19 7.5L18 6.5L15.5 10Z" />
      </svg>
      {computedStyles.isSacredTheme && (
        <div style={computedStyles.glyph}>{glyph}</div>
      )}
    </div>
  )
}

EngineeringIcon.displayName = 'EngineeringIcon'

export default EngineeringIcon
