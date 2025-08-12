'use client'

import React, { useState, useEffect, useMemo } from 'react'
import {
  IconStyles,
  getIconStyles,
  injectSacredKeyframes,
  SACRED_GLYPHS,
} from '../../theme'

interface AnimationIconProps extends React.SVGProps<SVGSVGElement> {
  styles?: IconStyles
}

const AnimationIcon: React.FC<AnimationIconProps> = ({
  styles,
  style = {},
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [glyph, setGlyph] = useState(SACRED_GLYPHS[0])
  useEffect(() => {
    setGlyph(SACRED_GLYPHS[Math.floor(Math.random() * SACRED_GLYPHS.length)])
  }, [])

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
        <path d="M480-480q-17 0-28.5-11.5T440-520q0-17 11.5-28.5T480-560q17 0 28.5 11.5T520-520q0 17-11.5 28.5T480-480ZM120-120v-200h80v120h120v80H120Zm560 0v-80h120v-120h80v200H680ZM120-680v-200h200v80H200v120h-80Zm640 0v-120H640v-80h200v200h-80ZM360-360v-240h240v240H360Z" />
      </svg>
      {computedStyles.isSacredTheme && (
        <div style={computedStyles.glyph}>{glyph}</div>
      )}
    </div>
  )
}

export default AnimationIcon
