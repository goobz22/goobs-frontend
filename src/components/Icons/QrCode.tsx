'use client'

import React, { useState, useEffect, useMemo } from 'react'
import {
  IconStyles,
  getIconStyles,
  injectSacredKeyframes,
  SACRED_GLYPHS,
} from '../../theme'

interface QrCodeIconProps extends React.SVGProps<SVGSVGElement> {
  styles?: IconStyles
}

const QrCodeIcon: React.FC<QrCodeIconProps> = ({
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
        viewBox="0 0 24 24"
        width="24"
        fill="none"
        style={{ ...computedStyles.icon, ...style }}
        {...props}
      >
        <rect x="3" y="3" width="8" height="8" rx="1" fill="currentColor" />
        <rect x="13" y="3" width="8" height="8" rx="1" fill="currentColor" />
        <rect x="3" y="13" width="8" height="8" rx="1" fill="currentColor" />
        <rect x="5" y="5" width="4" height="4" fill="white" />
        <rect x="15" y="5" width="4" height="4" fill="white" />
        <rect x="5" y="15" width="4" height="4" fill="white" />
        <rect x="6.5" y="6.5" width="1" height="1" fill="currentColor" />
        <rect x="16.5" y="6.5" width="1" height="1" fill="currentColor" />
        <rect x="6.5" y="16.5" width="1" height="1" fill="currentColor" />
        <rect x="13" y="13" width="2" height="2" fill="currentColor" />
        <rect x="16" y="13" width="2" height="2" fill="currentColor" />
        <rect x="19" y="13" width="2" height="2" fill="currentColor" />
        <rect x="13" y="16" width="2" height="2" fill="currentColor" />
        <rect x="19" y="16" width="2" height="2" fill="currentColor" />
        <rect x="13" y="19" width="2" height="2" fill="currentColor" />
        <rect x="16" y="19" width="2" height="2" fill="currentColor" />
        <rect x="19" y="19" width="2" height="2" fill="currentColor" />
      </svg>
      {computedStyles.isSacredTheme && (
        <div style={computedStyles.glyph}>{glyph}</div>
      )}
    </div>
  )
}

export default QrCodeIcon
