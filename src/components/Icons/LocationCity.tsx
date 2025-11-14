'use client'

import React, { useState } from 'react'
import { IconStyles, getIconStyles, injectSacredKeyframes } from '../../theme'

interface LocationCityIconProps extends React.SVGProps<SVGSVGElement> {
  styles?: IconStyles
}

const LocationCityIcon: React.FC<LocationCityIconProps> = ({
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
        <path d="M15 11V5l-3-3-3 3v2H3v14h18V11h-6zM7 19H5v-2h2v2zM7 15H5v-2h2v2zM7 11H5V9h2v2zM13 19h-2v-2h2v2zM13 15h-2v-2h2v2zM13 11h-2V9h2v2zM13 7h-2V5h2v2zM19 19h-2v-2h2v2zM19 15h-2v-2h2v2z" />
      </svg>
      {computedStyles.isSacredTheme && <div style={computedStyles.glyph}></div>}
    </div>
  )
}

export default LocationCityIcon
