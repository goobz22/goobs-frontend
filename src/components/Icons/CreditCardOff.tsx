'use client'

import React, { useState } from 'react'
import { IconStyles, getIconStyles, injectSacredKeyframes } from '../../theme'

interface CreditCardOffIconProps extends React.SVGProps<SVGSVGElement> {
  styles?: IconStyles
}

const CreditCardOffIcon: React.FC<CreditCardOffIconProps> = ({
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
        viewBox="0 -960 960 960"
        width="24"
        fill="currentColor"
        style={iconStyle}
        {...props}
      >
        <path d="m792-56-64-64H160q-33 0-56.5-23.5T80-200v-560q0-33 23.5-56.5T160-840h80l80 80H160v560h488L56-792l56-56 736 736-56 56ZM880-193l-80-80v-327H473L353-720h447q33 0 56.5 23.5T880-640v447ZM434-400Zm192-72Z" />
      </svg>
      {computedStyles.isSacredTheme && <div style={computedStyles.glyph}></div>}
    </div>
  )
}

export default CreditCardOffIcon
