'use client'

import React, { useState, useEffect, useMemo } from 'react'
import {
  IconStyles,
  getIconStyles,
  injectSacredKeyframes,
  SACRED_GLYPHS,
} from '../../theme'

interface AppleIconProps extends React.SVGProps<SVGSVGElement> {
  styles?: IconStyles
}

const AppleIcon: React.FC<AppleIconProps> = ({
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
        <path d="M480-120q-151 0-255.5-104.5T120-480q0-151 104.5-255.5T480-840q151 0 255.5 104.5T840-480q0 151-104.5 255.5T480-120Zm0-80q117 0 198.5-81.5T760-480q0-117-81.5-198.5T480-760q-117 0-198.5 81.5T200-480q0 117 81.5 198.5T480-200Zm0-280Z" />
      </svg>
      {computedStyles.isSacredTheme && (
        <div style={computedStyles.glyph}>{glyph}</div>
      )}
    </div>
  )
}

export default AppleIcon
