'use client'

import React, { useState } from 'react'
import { IconStyles, getIconStyles, injectSacredKeyframes } from '../../theme'

interface ConstructionIconProps extends React.SVGProps<SVGSVGElement> {
  styles?: IconStyles
}

const ConstructionIcon: React.FC<ConstructionIconProps> = ({
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
        <path d="M0 0h24v24H0V0z" fill="none" />
        <path d="M13.7826 15.1719L19.1421 20.5765L21.2634 18.4552L15.9039 13.0506L13.7826 15.1719Z" />
        <path d="M17.5 10C17.11 10 16.69 9.95 16.36 9.91L4.97 21.25L2.86 19.14L10.27 11.74L8.5 9.96C7.78 10.63 6.81 11 5.78 11C3.69 11 2 9.31 2 7.22C2 6.56 2.18 5.95 2.5 5.42L5.53 8.45L8.36 5.62L5.32 2.59C5.86 2.27 6.47 2.08 7.13 2.08C9.22 2.08 10.91 3.77 10.91 5.86C10.91 6.89 10.54 7.86 9.87 8.57L11.63 10.33L13.33 8.63C13.12 8.06 13 7.45 13 6.82C13 4.15 15.17 2 17.86 2C18.55 2 19.2 2.14 19.79 2.38L16.66 5.51L18.52 7.37L21.65 4.25C21.89 4.84 22.03 5.49 22.03 6.18C22.03 8.87 19.88 11.02 17.19 11.02C17.06 11.02 17.03 11.01 17.5 10Z" />
      </svg>
      {computedStyles.isSacredTheme && <div style={computedStyles.glyph}></div>}
    </div>
  )
}

export default ConstructionIcon
