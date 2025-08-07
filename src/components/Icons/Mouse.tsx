'use client'

import React, { useState, useEffect, useMemo } from 'react'
import {
  IconStyles,
  getIconStyles,
  injectSacredKeyframes,
  SACRED_GLYPHS,
} from '../../theme'

interface MouseIconProps extends React.SVGProps<SVGSVGElement> {
  styles?: IconStyles
}

const MouseIcon: React.FC<MouseIconProps> = ({
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
        <path d="M480-80q-83 0-141.5-58.5T280-280v-200q0-83 58.5-141.5T480-680q83 0 141.5 58.5T680-480v200q0 83-58.5 141.5T480-80Zm-40-520v120h80v-120q0-17-11.5-28.5T480-640q-17 0-28.5 11.5T440-600Zm40 440q50 0 85-35t35-85v-200q0-50-35-85t-85-35q-50 0-85 35t-35 85v200q0 50 35 85t85 35Z" />
      </svg>
      {computedStyles.isSacredTheme && (
        <div style={computedStyles.glyph}>{glyph}</div>
      )}
    </div>
  )
}

MouseIcon.displayName = 'MouseIcon'

export default MouseIcon
