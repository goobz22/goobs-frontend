'use client'

import React, { useState } from 'react'
import {
  IconStyles,
  getIconStyles,
  injectSacredKeyframes,
  SACRED_GLYPHS,
} from '../../theme'

interface PeopleIconProps extends React.SVGProps<SVGSVGElement> {
  styles?: IconStyles
}

const PeopleIcon: React.FC<PeopleIconProps> = ({
  styles,
  style = {},
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const glyph = SACRED_GLYPHS[8]

  // Inject CSS keyframes for sacred animations
  if (styles?.theme === 'sacred') {
    injectSacredKeyframes()
  }

  // Compute styles based on theme and state
  const computedStyles = getIconStyles(styles, isHovered, styles?.disabled)

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
        <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zM4 18v-4h3v7H5v-3H4zM13 2c0 1.11-.89 2-2 2s-2-.89-2-2 .89-2 2-2 2 .89 2 2zM15.5 22H17v-7h2v7h1.5c.83 0 1.5.67 1.5 1.5S21.33 25 20.5 25h-5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5zM12.5 11.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S11 9.17 11 10s.67 1.5 1.5 1.5zM17 12c-.83 0-1.5.67-1.5 1.5S16.17 15 17 15s1.5-.67 1.5-1.5S17.83 12 17 12z" />
        <path d="M12.5 11.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S11 9.17 11 10s.67 1.5 1.5 1.5z" />
        <path d="M6.5 6C7.33 6 8 5.33 8 4.5S7.33 3 6.5 3 5 3.67 5 4.5 5.67 6 6.5 6z" />
        <path d="M9 16c-1.1 0-2-.9-2-2v-4c0-1.1.9-2 2-2h6c1.1 0 2 .9 2 2v4c0 1.1-.9 2-2 2H9z" />
        <circle cx="9" cy="8" r="2" />
        <circle cx="15" cy="8" r="2" />
      </svg>
      {computedStyles.isSacredTheme && (
        <div style={computedStyles.glyph}>{glyph}</div>
      )}
    </div>
  )
}

export default PeopleIcon
