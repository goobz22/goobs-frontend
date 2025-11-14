'use client'

import React, { useState } from 'react'
import { IconStyles, getIconStyles, injectSacredKeyframes } from '../../theme'

interface HandshakeIconProps extends React.SVGProps<SVGSVGElement> {
  styles?: IconStyles
}

const HandshakeIcon: React.FC<HandshakeIconProps> = ({
  styles,
  style = {},
  ...props
}) => {
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
        <path d="M21.71,8.71C22.1,8.32 22.1,7.68 21.71,7.29L16.71,2.29C16.32,1.9 15.68,1.9 15.29,2.29L13.29,4.29C12.9,4.68 12.9,5.32 13.29,5.71L15.29,7.71L10.41,12.59C10.05,12.95 9.55,13.16 9.02,13.16C8.74,13.16 8.47,13.09 8.23,12.96C7.46,12.54 7.12,11.64 7.54,10.87L9.71,6.71C10.1,6.32 10.1,5.68 9.71,5.29L7.71,3.29C7.32,2.9 6.68,2.9 6.29,3.29L2.29,7.29C1.9,7.68 1.9,8.32 2.29,8.71L4.29,10.71L6.46,8.54L5.54,10.87C4.78,12.8 5.80,15.02 7.73,15.78C8.19,15.92 8.67,16 9.16,16C10.2,16 11.2,15.59 11.88,14.88L16.46,10.29L18.29,12.12L21.71,8.71Z" />
      </svg>
      {computedStyles.isSacredTheme && <div style={computedStyles.glyph}></div>}
    </div>
  )
}

export default HandshakeIcon
