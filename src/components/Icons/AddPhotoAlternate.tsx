'use client'

import React, { useState, useEffect, useMemo } from 'react'
import {
  IconStyles,
  getIconStyles,
  injectSacredKeyframes,
  SACRED_GLYPHS,
} from '../../theme'

interface AddPhotoAlternateIconProps extends React.SVGProps<SVGSVGElement> {
  styles?: IconStyles
}

const AddPhotoAlternateIcon: React.FC<AddPhotoAlternateIconProps> = ({
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
        <path d="M19 7v2.99s-1.99.01-2 0V7h-3s.01-1.99 0-2h3V2h2v3h3v2h-3zm-3 4V9h-3V7h-3v2.4L12.6 11H16zm-5 0v2h3v2.99s-1.99.01-2 0V13H9v-2h2zm-2 4H7v-2H5v2H2v2h3v3h2v-3h2v-2z" />
        <path d="M0 0h24v24H0z" fill="none" />
        <path
          d="m21 19.1-8-6.7-2.9 2.7L8 13v8h12.1zM5 16l3-4 2.03 2.71L16 8l5 6v6c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2v-4z"
          opacity="0.3"
        />
      </svg>
      {computedStyles.isSacredTheme && (
        <div style={computedStyles.glyph}>{glyph}</div>
      )}
    </div>
  )
}

export default AddPhotoAlternateIcon
