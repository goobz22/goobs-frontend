'use client'

import React, { useState } from 'react'
import { IconStyles, getIconStyles, injectSacredKeyframes } from '../../theme'

interface BankIconProps extends React.SVGProps<SVGSVGElement> {
  styles?: IconStyles
}

const BankIcon: React.FC<BankIconProps> = ({
  styles,
  style = {},
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false)

  if (styles?.theme === 'sacred') {
    injectSacredKeyframes()
  }

  const computedStyles = getIconStyles(styles, isHovered, styles?.disabled)

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
        style={{ ...computedStyles.icon, ...style }}
        {...props}
      >
        <path d="M12 3L2 8h20l-10-5zm-8 6v8h16V9H4zm2 2h2v4H6v-4zm4 0h2v4h-2v-4zm4 0h2v4h-2v-4zm4 0h2v4h-2v-4zM2 19h20v2H2v-2z" />
      </svg>
      {computedStyles.isSacredTheme && <div style={computedStyles.glyph}></div>}
    </div>
  )
}

export default BankIcon
