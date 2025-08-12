'use client'

import React, { useState, useEffect, useMemo } from 'react'
import {
  IconStyles,
  getIconStyles,
  injectSacredKeyframes,
  SACRED_GLYPHS,
} from '../../theme'

interface InsightsIconProps extends React.SVGProps<SVGSVGElement> {
  styles?: IconStyles
}

const InsightsIcon: React.FC<InsightsIconProps> = ({
  styles,
  style = {},
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [glyph, setGlyph] = useState(SACRED_GLYPHS[0])
  useEffect(() => {
    setGlyph(SACRED_GLYPHS[Math.floor(Math.random() * SACRED_GLYPHS.length)])
  }, [])

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
        viewBox="0 0 24 24"
        width="24"
        fill="currentColor"
        style={iconStyle}
        {...props}
      >
        <path d="M21 8c-1.45 0-2.26 1.44-1.93 2.51l-3.57 3.57c-.52-.4-1.17-.64-1.88-.64-.16 0-.32.02-.47.04L9.4 10.73c.15-.39.24-.82.24-1.27 0-1.89-1.54-3.46-3.46-3.46S2.72 7.57 2.72 9.46s1.54 3.46 3.46 3.46c.16 0 .32-.02.47-.04l3.75 2.75c-.15.39-.24.82-.24 1.27 0 1.89 1.54 3.46 3.46 3.46s3.46-1.54 3.46-3.46c0-.72-.2-1.4-.55-1.93l3.57-3.57c.52.4 1.17.64 1.88.64 1.89 0 3.46-1.54 3.46-3.46S22.89 8 21 8zM6.18 11.82c-.74 0-1.36-.62-1.36-1.36s.62-1.36 1.36-1.36 1.36.62 1.36 1.36-.62 1.36-1.36 1.36zM13.82 19.18c-.74 0-1.36-.62-1.36-1.36s.62-1.36 1.36-1.36 1.36.62 1.36 1.36-.62 1.36-1.36 1.36zM21 11.82c-.74 0-1.36-.62-1.36-1.36s.62-1.36 1.36-1.36 1.36.62 1.36 1.36-.62 1.36-1.36 1.36z" />
      </svg>
      {computedStyles.isSacredTheme && (
        <div style={computedStyles.glyph}>{glyph}</div>
      )}
    </div>
  )
}

export default InsightsIcon
