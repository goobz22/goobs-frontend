'use client'

import React, { useState } from 'react'
import { IconStyles, getIconStyles, injectSacredKeyframes } from '../../theme'

interface NotificationImportantIconProps extends React.SVGProps<SVGSVGElement> {
  styles?: IconStyles
}

const NotificationImportantIcon: React.FC<NotificationImportantIconProps> = ({
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
        <path d="M12,2A2,2 0 0,1 14,4V5.09C16.84,6.41 18.73,9.53 18,12.64C16.96,14.67 15.77,16.54 14.5,18.34L13,17.75C14.04,16.14 15.04,14.47 15.95,12.77C16.46,11.88 16.46,10.77 15.95,9.88C14.96,8.06 13.03,7 11,7C8.97,7 7.04,8.06 6.05,9.88C5.54,10.77 5.54,11.88 6.05,12.77C6.96,14.47 7.96,16.14 9,17.75L7.5,18.34C6.23,16.54 5.04,14.67 4,12.64C3.27,9.53 5.16,6.41 8,5.09V4A2,2 0 0,1 12,2M11,8.5H13V12.5H11V8.5M11,14H13V16H11V14Z" />
      </svg>
      {computedStyles.isSacredTheme && <div style={computedStyles.glyph}></div>}
    </div>
  )
}

export default NotificationImportantIcon
