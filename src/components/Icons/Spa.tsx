'use client'

import React, { useState, useEffect, useMemo } from 'react'
import {
  IconStyles,
  getIconStyles,
  injectSacredKeyframes,
  SACRED_GLYPHS,
} from '../../theme'

interface SpaIconProps extends React.SVGProps<SVGSVGElement> {
  styles?: IconStyles
}

const SpaIcon: React.FC<SpaIconProps> = ({ styles, style = {}, ...props }) => {
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
        <path d="M480-880q83 0 141.5 58.5T680-680q0 48-18.5 92.5T613-510q-18 18-42.5 18T528-510q-18-18-18-42.5t18-42.5q12-12 19-27t7-33q0-33-23.5-56.5T480-735q-33 0-56.5 23.5T400-655q0 18 7 33t19 27q18 18 18 42.5T426-510q-18 18-42.5 18T341-510q-30-33-48.5-77.5T274-680q0-83 58.5-141.5T480-880ZM40-160q0-34 17.5-62.5T98-276q52-27 109.5-41.5T328-332q13 0 25.5.5T378-330q11 1 18.5 9.5T404-302v2q0 11-7.5 19.5T378-270q-14 1-26.5 1.5T326-267q-74 0-129 13.5T98-213q-23 11-30.5 29T68-160h152q17 0 28.5 11.5T260-120q0 17-11.5 28.5T220-80H40v-80Zm546-172q72 0 129.5 14.5T814-276q23 11 40.5 39.5T872-174v14H700q-17 0-28.5-11.5T660-200q0-17 11.5-28.5T700-240h152q-7-18-14.5-36T814-305q-44-27-99-40.5T586-359q-14 0-26.5-.5T534-361q-11-1-18.5-9.5T508-389v-2q0-11 7.5-19.5T534-421q14-1 26.5-1.5T586-423Z" />
      </svg>
      {computedStyles.isSacredTheme && (
        <div style={computedStyles.glyph}>{glyph}</div>
      )}
    </div>
  )
}

export default SpaIcon
