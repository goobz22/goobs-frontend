'use client'

import React, { useState, useEffect, useMemo } from 'react'
import {
  IconStyles,
  getIconStyles,
  injectSacredKeyframes,
  SACRED_GLYPHS,
} from '../../theme'

interface ExtensionIconProps extends React.SVGProps<SVGSVGElement> {
  styles?: IconStyles
}

const ExtensionIcon: React.FC<ExtensionIconProps> = ({
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
        viewBox="0 -960 960 960"
        width="24"
        fill="currentColor"
        style={iconStyle}
        {...props}
      >
        <path d="M354-120H200q-33 0-56.5-23.5T120-200v-154q48 0 84-30.5t36-77.5q0-47-36-77.5T120-570v-190q0-33 23.5-56.5T200-840h154q0-48 30.5-84t77.5-36q47 0 77.5 36t30.5 84h190q33 0 56.5 23.5T840-760v190q48 0 84 30.5t36 77.5q0 47-36 77.5T840-354v154q0 33-23.5 56.5T760-120H570q0-48-30.5-84T462-240q-47 0-77.5 36T354-120Z" />
      </svg>
      {computedStyles.isSacredTheme && (
        <div style={computedStyles.glyph}>{glyph}</div>
      )}
    </div>
  )
}

export default ExtensionIcon
