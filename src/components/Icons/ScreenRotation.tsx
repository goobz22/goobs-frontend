'use client'

import React, { useState, useEffect, useMemo } from 'react'
import {
  IconStyles,
  getIconStyles,
  injectSacredKeyframes,
  SACRED_GLYPHS,
} from '../../theme'

interface ScreenRotationIconProps extends React.SVGProps<SVGSVGElement> {
  styles?: IconStyles
}

const ScreenRotationIcon: React.FC<ScreenRotationIconProps> = ({
  styles,
  style = {},
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [glyph] = useState(
    SACRED_GLYPHS[Math.floor(Math.random() * SACRED_GLYPHS.length)]
  )

  useEffect(() => {
    if (styles?.theme === 'sacred') {
      injectSacredKeyframes()
    }
  }, [styles?.theme])

  const computedStyles = useMemo(
    () => getIconStyles(styles, isHovered, styles?.disabled),
    [styles, isHovered]
  )

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
        style={{ ...computedStyles.icon, ...style }}
        {...props}
      >
        <path d="M160-80v-160q0-33 23.5-56.5T240-320h80v-80q0-33 23.5-56.5T400-480h80v-80q0-33 23.5-56.5T560-640h80v-80h-40q-33 0-56.5-23.5T520-800q0-33 23.5-56.5T600-880h200q33 0 56.5 23.5T880-800v160q0 33-23.5 56.5T800-560h-160q-33 0-56.5-23.5T560-640h-80v80h40q33 0 56.5 23.5T600-480v80h40q33 0 56.5 23.5T720-320v80h40q33 0 56.5 23.5T840-160q0 33-23.5 56.5T760-80H560q-33 0-56.5-23.5T480-160q0-33 23.5-56.5T560-240v-80H240v80h160q33 0 56.5 23.5T480-160v160q0 33-23.5 56.5T400-80H160z" />
      </svg>
      {computedStyles.isSacredTheme && (
        <div style={computedStyles.glyph}>{glyph}</div>
      )}
    </div>
  )
}

export default ScreenRotationIcon
