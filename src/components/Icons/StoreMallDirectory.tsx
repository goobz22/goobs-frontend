'use client'

import React, { useState, useEffect, useMemo } from 'react'
import {
  IconStyles,
  getIconStyles,
  injectSacredKeyframes,
  SACRED_GLYPHS,
} from '../../theme'

interface StoreMallDirectoryIconProps extends React.SVGProps<SVGSVGElement> {
  styles?: IconStyles
}

const StoreMallDirectoryIcon: React.FC<StoreMallDirectoryIconProps> = ({
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
        <path d="M19,7H18V6A4,4 0 0,0 14,2H10A4,4 0 0,0 6,6V7H5A1,1 0 0,0 4,8V19A3,3 0 0,0 7,22H17A3,3 0 0,0 20,19V8A1,1 0 0,0 19,7M10,4H14A2,2 0 0,1 16,6V7H8V6A2,2 0 0,1 10,4M18,19A1,1 0 0,1 17,20H7A1,1 0 0,1 6,19V9H8V10A1,1 0 0,0 10,11A1,1 0 0,0 12,10H12A1,1 0 0,0 14,11A1,1 0 0,0 16,10V9H18V19Z" />
      </svg>
      {computedStyles.isSacredTheme && (
        <div style={computedStyles.glyph}>{glyph}</div>
      )}
    </div>
  )
}

export default StoreMallDirectoryIcon
