'use client'

import React, { useState } from 'react'
import {
  IconStyles,
  getIconStyles,
  injectSacredKeyframes,
  SACRED_GLYPHS,
} from '../../theme'

interface AddShoppingCartIconProps extends React.SVGProps<SVGSVGElement> {
  styles?: IconStyles
}

const AddShoppingCartIcon: React.FC<AddShoppingCartIconProps> = ({
  styles,
  style = {},
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const glyph = SACRED_GLYPHS[9]

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
        <path d="M440-600v-120q0-33 23.5-56.5T520-800h120q33 0 56.5 23.5T720-720v120h120q33 0 56.5 23.5T920-520v200q0 33-23.5 56.5T840-240H520q-33 0-56.5-23.5T440-320v-280Zm80 0h200v-120H520v120ZM280-80q-33 0-56.5-23.5T200-160v-560q0-8.5 5.75-14.25T220-740h40v-20q0-33 23.5-56.5T340-840h120q33 0 56.5 23.5T540-760v20h40q8.5 0 14.25 5.75T600-720q0 8.5-5.75 14.25T580-700H220v560h240q8.5 0 14.25 5.75T480-120q0 8.5-5.75 14.25T460-100H280Zm60-640h120v-20H340v20Z" />
      </svg>
      {computedStyles.isSacredTheme && (
        <div style={computedStyles.glyph}>{glyph}</div>
      )}
    </div>
  )
}

export default AddShoppingCartIcon
