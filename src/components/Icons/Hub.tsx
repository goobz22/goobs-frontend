'use client'

import React, { useState } from 'react'
import { IconStyles, getIconStyles, injectSacredKeyframes } from '../../theme'

interface HubIconProps extends React.SVGProps<SVGSVGElement> {
  styles?: IconStyles
}

const HubIcon: React.FC<HubIconProps> = ({ styles, style = {}, ...props }) => {
  const [isHovered, setIsHovered] = useState(false)
  // Inject CSS keyframes for sacred animations
  if (styles?.theme === 'sacred') {
    injectSacredKeyframes()
  }

  // Compute styles based on theme and state
  const computedStyles = getIconStyles(styles, isHovered, styles?.disabled)

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
        <path d="M0 0h24v24H0V0z" fill="none" />
        <path d="M8.4 18.2c.38.23.85.12 1.1-.25.25-.38.12-.86-.25-1.11l-.01-.01a5 5 0 0 1 0-8.49c.38-.24.5-.72.25-1.1-.24-.38-.72-.5-1.1-.25a7 7 0 0 0 0 11.21zm-2.79 2.11c.36.27.87.19 1.13-.18s.17-.87-.19-1.13a9 9 0 0 1 0-14.99c.36-.26.45-.77.19-1.13A.799.799 0 0 0 5.6 2.7a10.987 10.987 0 0 0 0 17.6l.01.01zm9.2-2.1a.776.776 0 0 0 1.1.25 7 7 0 0 0-.01-11.21.776.776 0 0 0-1.1.25c-.25.38-.12.85.26 1.1a5 5 0 0 1-.01 8.49.78.78 0 0 0-.24 1.12zm3.58 2.1a11 11 0 0 0 .01-17.59.802.802 0 0 0-1.13.19c-.26.36-.18.87.19 1.13a9 9 0 0 1-.01 14.99.8.8 0 0 0-.18 1.13c.26.37.77.45 1.12.19v-.04zM13 9.18V5c0-.66-.68-1.09-1.26-.8l-4.2 2.1c-.44.22-.54.8-.18 1.14l4.2 4.2c.44.43 1.18.15 1.2-.43.02-.47-.18-.89-.56-1.2.51-.38.8-.98.8-1.61V9.18z" />
      </svg>
      {computedStyles.isSacredTheme && <div style={computedStyles.glyph}></div>}
    </div>
  )
}

export default HubIcon
