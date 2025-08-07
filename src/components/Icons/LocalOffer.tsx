'use client'

import React, { useState, useEffect, useMemo } from 'react'
import {
  IconStyles,
  getIconStyles,
  injectSacredKeyframes,
  SACRED_GLYPHS,
} from '../../theme'

interface LocalOfferIconProps extends React.SVGProps<SVGSVGElement> {
  styles?: IconStyles
}

const LocalOfferIcon: React.FC<LocalOfferIconProps> = ({
  styles,
  style = {},
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [glyph] = useState(
    SACRED_GLYPHS[Math.floor(Math.random() * SACRED_GLYPHS.length)]
  )

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
        <path d="m840-234-60-11q-16-3-31-3t-31 3l-60 11q-52 10-99-16t-75-74l-51-84q-9-14-9-32t9-32l51-84q28-48 75-74t99-16l60 11q16 3 31 3t31-3l60-11q52-10 99 16t75 74l51 84q9 14 9 32t-9 32l-51 84q-28 48-75 74t-99 16ZM760-400q33 0 56.5-23.5T840-480q0-33-23.5-56.5T760-560q-33 0-56.5 23.5T680-480q0 33 23.5 56.5T760-400ZM126-80l-46-46 634-634 46 46L126-80Z" />
      </svg>
      {computedStyles.isSacredTheme && (
        <div style={computedStyles.glyph}>{glyph}</div>
      )}
    </div>
  )
}

export default LocalOfferIcon
