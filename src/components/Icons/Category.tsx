/**
 * @fileoverview Category icon component
 */
'use client'

import React, { useState } from 'react'
import {
  IconStyles,
  getIconStyles,
  injectSacredKeyframes,
  SACRED_GLYPHS,
} from '../../theme'

interface CategoryIconProps extends React.SVGProps<SVGSVGElement> {
  styles?: IconStyles
}

const CategoryIcon: React.FC<CategoryIconProps> = ({
  styles,
  style = {},
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const glyph = SACRED_GLYPHS[1]

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
        <path d="M180-120q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h65v-60q0-8.5 5.75-14.25T265-920q8.5 0 14.25 5.75T285-900v60h390v-60q0-8.5 5.75-14.25T695-920q8.5 0 14.25 5.75T715-900v60h65q24 0 42 18t18 42v600q0 24-18 42t-42 18H180Zm0-80h600v-440H180v440Zm0-520h600v-80H180v80Zm0 0v-80 80Zm300 200q-17 0-28.5-11.5T440-560q0-17 11.5-28.5T480-600q17 0 28.5 11.5T520-560q0 17-11.5 28.5T480-520Zm-160 0q-17 0-28.5-11.5T280-560q0-17 11.5-28.5T320-600q17 0 28.5 11.5T360-560q0 17-11.5 28.5T320-520Zm320 0q-17 0-28.5-11.5T600-560q0-17 11.5-28.5T640-600q17 0 28.5 11.5T680-560q0 17-11.5 28.5T640-520ZM480-360q-17 0-28.5-11.5T440-400q0-17 11.5-28.5T480-440q17 0 28.5 11.5T520-400q0 17-11.5 28.5T480-360Zm-160 0q-17 0-28.5-11.5T280-400q0-17 11.5-28.5T320-440q17 0 28.5 11.5T360-400q0 17-11.5 28.5T320-360Zm320 0q-17 0-28.5-11.5T600-400q0-17 11.5-28.5T640-440q17 0 28.5 11.5T680-400q0 17-11.5 28.5T640-360Z" />
      </svg>
      {computedStyles.isSacredTheme && (
        <div style={computedStyles.glyph}>{glyph}</div>
      )}
    </div>
  )
}

export default CategoryIcon
