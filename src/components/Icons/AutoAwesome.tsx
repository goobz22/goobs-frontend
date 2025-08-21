'use client'

import React, { useState } from 'react'
import {
  IconStyles,
  getIconStyles,
  injectSacredKeyframes,
  SACRED_GLYPHS,
} from '../../theme'

interface AutoAwesomeIconProps extends React.SVGProps<SVGSVGElement> {
  styles?: IconStyles
}

const AutoAwesomeIcon: React.FC<AutoAwesomeIconProps> = ({
  styles,
  style = {},
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const glyph = SACRED_GLYPHS[7]

  if (styles?.theme === 'sacred') {
    injectSacredKeyframes()
  }

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
        <path d="M19,9L20.25,6.25L23,5L20.25,3.75L19,1L17.75,3.75L15,5L17.75,6.25L19,9M11.5,9.5L9,4L6.5,9.5L1,12L6.5,14.5L9,20L11.5,14.5L17,12L11.5,9.5M19,15L17.75,17.75L15,19L17.75,20.25L19,23L20.25,20.25L23,19L20.25,17.75L19,15Z" />
      </svg>
      {computedStyles.isSacredTheme && (
        <div style={computedStyles.glyph}>{glyph}</div>
      )}
    </div>
  )
}

export default AutoAwesomeIcon
