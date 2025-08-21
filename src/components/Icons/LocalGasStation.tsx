'use client'

import React, { useState } from 'react'
import {
  IconStyles,
  getIconStyles,
  injectSacredKeyframes,
  SACRED_GLYPHS,
} from '../../theme'

interface LocalGasStationIconProps extends React.SVGProps<SVGSVGElement> {
  styles?: IconStyles
}

const LocalGasStationIcon: React.FC<LocalGasStationIconProps> = ({
  styles,
  style = {},
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const glyph = SACRED_GLYPHS[17]

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
        <path d="M160-120q-33 0-56.5-23.5T80-200v-360q0-33 23.5-56.5T160-640h40v-200q0-33 23.5-56.5T280-920h200q33 0 56.5 23.5T560-840v320h120q17 0 28.5 11.5T720-480q0 17-11.5 28.5T680-440H560v240q0 33-23.5 56.5T480-120H160Zm120-520h200v-200H280v200Zm-120 440h320v-360h-80q-33 0-56.5-23.5T320-640h-80v360Zm200-280v-240H280v240h80Z" />
      </svg>
      {computedStyles.isSacredTheme && (
        <div style={computedStyles.glyph}>{glyph}</div>
      )}
    </div>
  )
}

export default LocalGasStationIcon
