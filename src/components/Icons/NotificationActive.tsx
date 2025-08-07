'use client'

import React, { useState, useEffect, useMemo } from 'react'
import {
  IconStyles,
  getIconStyles,
  injectSacredKeyframes,
  SACRED_GLYPHS,
} from '../../theme'

interface NotificationActiveIconProps extends React.SVGProps<SVGSVGElement> {
  styles?: IconStyles
}

const NotificationActiveIcon: React.FC<NotificationActiveIconProps> = ({
  styles,
  style = {},
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [glyph] = useState(
    SACRED_GLYPHS[Math.floor(Math.random() * SACRED_GLYPHS.length)]
  )

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
        <path d="M160-200v-80h80v-280q0-83 50-147.5T375-792q-5-17-5-32 0-50 35-85t85-35q50 0 85 35t35 85q0 15-5 32 75 14 125 78.5T780-560v280h80v80H160Zm320-300q-17 0-28.5-11.5T440-540q0-17 11.5-28.5T480-580q17 0 28.5 11.5T520-540q0 17-11.5 28.5T480-500ZM320-280h320v-280q0-66-47-113t-113-47q-66 0-113 47t-47 113v280ZM480-80q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80Z" />
      </svg>
      {computedStyles.isSacredTheme && (
        <div style={computedStyles.glyph}>{glyph}</div>
      )}
    </div>
  )
}

export default NotificationActiveIcon
