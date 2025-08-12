'use client'

import React, { useState, useEffect, useMemo } from 'react'
import {
  IconStyles,
  getIconStyles,
  injectSacredKeyframes,
  SACRED_GLYPHS,
} from '../../theme'

interface ViewIconProps extends React.SVGProps<SVGSVGElement> {
  styles?: IconStyles
}

const ViewIcon: React.FC<ViewIconProps> = ({
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
        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
      </svg>
      {computedStyles.isSacredTheme && (
        <div style={computedStyles.glyph}>{glyph}</div>
      )}
    </div>
  )
}

export default ViewIcon
