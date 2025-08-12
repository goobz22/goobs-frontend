'use client'

import React, { useState, useEffect, useMemo } from 'react'
import {
  IconStyles,
  getIconStyles,
  injectSacredKeyframes,
  SACRED_GLYPHS,
} from '../../theme'

interface RouterIconProps extends React.SVGProps<SVGSVGElement> {
  styles?: IconStyles
}

const RouterIcon: React.FC<RouterIconProps> = ({
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
        <path d="M15.9 5c-.17 0-.32.09-.41.23l-.07.15-1.37 3.34c-.14.35.18.73.54.73h2.54c.36 0 .68-.38.54-.73L15.46 5.38c-.09-.2-.26-.38-.47-.38zm-4.07 0c-.21 0-.38.18-.47.38L9.99 8.72c-.14.35.18.73.54.73h2.54c.36 0 .68-.38.54-.73L12.24 5.38c-.09-.2-.26-.38-.47-.38zM8.93 5c-.17 0-.32.09-.41.23l-.07.15-1.37 3.34c-.14.35.18.73.54.73h2.54c.36 0 .68-.38.54-.73L8.33 5.38C8.24 5.18 8.07 5 7.86 5zM20 13H4c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-6c0-1.1-.9-2-2-2zM7 19c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm3 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" />
      </svg>
      {computedStyles.isSacredTheme && (
        <div style={computedStyles.glyph}>{glyph}</div>
      )}
    </div>
  )
}

export default RouterIcon
