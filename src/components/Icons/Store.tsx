'use client'

import React, { useState, useEffect, useMemo } from 'react'
import {
  IconStyles,
  getIconStyles,
  injectSacredKeyframes,
  SACRED_GLYPHS,
} from '../../theme'

interface StoreIconProps extends React.SVGProps<SVGSVGElement> {
  styles?: IconStyles
}

const StoreIcon: React.FC<StoreIconProps> = ({
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
        viewBox="0 -960 960 960"
        width="24"
        fill="currentColor"
        style={iconStyle}
        {...props}
      >
        <path d="M840-680v480q0 33-23.5 56.5T760-120H200q-33 0-56.5-23.5T120-200v-480h-40v-80h160v-40q0-33 23.5-56.5T320-880h320q33 0 56.5 23.5T720-800v40h160v80h-40ZM320-760h320v-40H320v40ZM200-200h560v-480H200v480Zm280-240q33 0 56.5-23.5T560-520v-40h-80v40q0 33 23.5 56.5T480-440Zm-160 0q33 0 56.5-23.5T400-520v-40h-80v40q0 33 23.5 56.5T320-440Zm320 0q33 0 56.5-23.5T720-520v-40h-80v40q0 33 23.5 56.5T640-440ZM200-200v-480 480Z" />
      </svg>
      {computedStyles.isSacredTheme && (
        <div style={computedStyles.glyph}>{glyph}</div>
      )}
    </div>
  )
}

export default StoreIcon
