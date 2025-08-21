'use client'

import React, { useState } from 'react'
import {
  IconStyles,
  getIconStyles,
  injectSacredKeyframes,
  SACRED_GLYPHS,
} from '../../theme'

interface FileCopyIconProps extends React.SVGProps<SVGSVGElement> {
  styles?: IconStyles
}

const FileCopyIcon: React.FC<FileCopyIconProps> = ({
  styles,
  style = {},
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const glyph = SACRED_GLYPHS[7]

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
        <path d="M520-200q-20.75 0-35.375-14.625T470-250q0-20.75 14.625-35.375T520-300q20.75 0 35.375 14.625T570-250q0 20.75-14.625 35.375T520-200Zm-80 0q-20.75 0-35.375-14.625T390-250q0-20.75 14.625-35.375T440-300q20.75 0 35.375 14.625T490-250q0 20.75-14.625 35.375T440-200Zm160 0q-20.75 0-35.375-14.625T550-250q0-20.75 14.625-35.375T600-300q20.75 0 35.375 14.625T650-250q0 20.75-14.625 35.375T600-200ZM280-80q-33 0-56.5-23.5T200-160v-560q0-33 23.5-56.5T280-800h320l240 240v320q0 33-23.5 56.5T760-160H280Zm0-80h480v-280H560v-200H280v480Zm0 0v-480 480Z" />
      </svg>
      {computedStyles.isSacredTheme && (
        <div style={computedStyles.glyph}>{glyph}</div>
      )}
    </div>
  )
}

export default FileCopyIcon
