'use client'

import React, { useState, useEffect, useMemo } from 'react'
import {
  IconStyles,
  getIconStyles,
  injectSacredKeyframes,
  SACRED_GLYPHS,
} from '../../theme'

interface FormatListNumberedIconProps extends React.SVGProps<SVGSVGElement> {
  styles?: IconStyles
}

const FormatListNumberedIcon: React.FC<FormatListNumberedIconProps> = ({
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
        viewBox="0 0 24 24"
        width="24"
        fill="currentColor"
        style={iconStyle}
        {...props}
      >
        {/* Number 1 */}
        <path d="M3 5h1v3H3V5z" />
        <path d="M2.5 5h2v0.5h-2V5z" />
        {/* Number 2 */}
        <path d="M2 11h2v0.5H2v-0.5z" />
        <path d="M3.5 11.5h0.5v0.5H3.5v-0.5z" />
        <path d="M2 12.5h2v0.5H2v-0.5z" />
        <path d="M2 13h0.5v0.5H2V13z" />
        <path d="M2 13.5h2v0.5H2v-0.5z" />
        {/* Number 3 */}
        <path d="M2 17h2v0.5H2V17z" />
        <path d="M3.5 17.5h0.5v0.5H3.5v-0.5z" />
        <path d="M2.5 18h1v0.5h-1V18z" />
        <path d="M3.5 18.5h0.5v0.5H3.5v-0.5z" />
        <path d="M2 19h2v0.5H2V19z" />
        {/* Text lines */}
        <path d="M7 6h13v1H7V6z" />
        <path d="M7 12h13v1H7v-1z" />
        <path d="M7 18h13v1H7v-1z" />
      </svg>
      {computedStyles.isSacredTheme && (
        <div style={computedStyles.glyph}>{glyph}</div>
      )}
    </div>
  )
}

export default FormatListNumberedIcon
