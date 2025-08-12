'use client'

import React, { useState, useEffect, useMemo } from 'react'
import {
  IconStyles,
  getIconStyles,
  injectSacredKeyframes,
  SACRED_GLYPHS,
} from '../../theme'

interface NetworkCheckIconProps extends React.SVGProps<SVGSVGElement> {
  styles?: IconStyles
}

const NetworkCheckIcon: React.FC<NetworkCheckIconProps> = ({
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
        viewBox="0 0 24 24"
        width="24"
        fill="currentColor"
        style={{ ...computedStyles.icon, ...style }}
        {...props}
      >
        <path d="M15.9 5c-.17 0-.32.09-.41.23l-.07.15-1.37 3.55c-.14.35-.2.75-.2 1.17 0 1.88 1.55 3.4 3.4 3.4 1.88 0 3.4-1.55 3.4-3.4 0-.42-.06-.82-.2-1.17L19.58 5.38c-.09-.14-.24-.23-.41-.23h-3.27z" />
        <path d="M7.6 10.25c1.29 0 2.5.42 3.44 1.19L12 10.5c-.85-.77-1.94-1.25-3.19-1.25s-2.34.48-3.19 1.25L6.56 11.44c.94-.77 2.15-1.19 3.44-1.19z" />
        <path d="M12 16l-5.33-5.33c-.78-.78-1.81-1.17-2.84-1.17S1.97 9.89 1.17 10.67L0 9.5c1.56-1.56 4.09-1.56 5.66 0L12 16z" />
        <path d="M12 16l5.33-5.33c.78-.78 1.81-1.17 2.84-1.17s2.06.39 2.86 1.17L24 9.5c-1.56-1.56-4.09-1.56-5.66 0L12 16z" />
        <circle cx="15.5" cy="9.5" r="1.5" />
      </svg>
      {computedStyles.isSacredTheme && (
        <div style={computedStyles.glyph}>{glyph}</div>
      )}
    </div>
  )
}

export default NetworkCheckIcon
