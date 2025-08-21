'use client'

import React, { useState } from 'react'
import {
  IconStyles,
  getIconStyles,
  injectSacredKeyframes,
  SACRED_GLYPHS,
} from '../../theme'

interface PrecisionManufacturingIconProps
  extends React.SVGProps<SVGSVGElement> {
  styles?: IconStyles
}

const PrecisionManufacturingIcon: React.FC<PrecisionManufacturingIconProps> = ({
  styles,
  style = {},
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const glyph = SACRED_GLYPHS[18]

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
        <path d="M160-120v-200h160v200H160Zm240 0v-440h160v440H400Zm240 0v-320h160v320H640ZM160-400v-160h160v160H160Zm240 0v-160h160v160H400Zm240-160v-160h160v160H640ZM160-640v-200h160v200H160Zm240 0v-200h160v200H400Zm240 0v-200h160v200H640Z" />
      </svg>
      {computedStyles.isSacredTheme && (
        <div style={computedStyles.glyph}>{glyph}</div>
      )}
    </div>
  )
}

export default PrecisionManufacturingIcon
