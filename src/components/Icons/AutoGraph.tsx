'use client'

import React from 'react'
import { IconStyles } from './types'
import cssStyles from './icon.module.css'

interface AutoGraphIconProps extends React.SVGProps<SVGSVGElement> {
  styles?: IconStyles
}

const AutoGraphIcon: React.FC<AutoGraphIconProps> = ({
  styles,
  style = {},
  ...props
}) => {
  const theme = styles?.theme || 'light'

  // Caller-supplied overrides (size / color / filter / transform / etc.) and
  // the native `style` prop stay in JS; theme + hover + transition live in CSS.
  const wrapperStyle: React.CSSProperties = {
    ...(styles?.padding && { padding: styles.padding }),
    ...(styles?.margin && { margin: styles.margin }),
  }

  const svgStyle: React.CSSProperties = {
    ...(styles?.color && { color: styles.color }),
    ...(styles?.backgroundColor && {
      backgroundColor: styles.backgroundColor,
    }),
    ...(styles?.borderRadius && { borderRadius: styles.borderRadius }),
    ...(styles?.filter && { filter: styles.filter }),
    ...(styles?.transform && { transform: styles.transform }),
    ...(styles?.boxShadow && { boxShadow: styles.boxShadow }),
    ...(styles?.size && { width: styles.size, height: styles.size }),
    ...style,
  }

  return (
    <div
      className={cssStyles.wrapper}
      data-theme={theme}
      data-disabled={styles?.disabled ? 'true' : undefined}
      style={wrapperStyle}
    >
      <svg
        className={cssStyles.svg}
        xmlns="http://www.w3.org/2000/svg"
        height="24"
        viewBox="0 0 24 24"
        width="24"
        fill="currentColor"
        style={svgStyle}
        {...props}
      >
        <path d="M14.06,9.94L12,9L9.94,10.06L7,6V3A1,1 0 0,1 8,2H16A1,1 0 0,1 17,3V6L14.06,9.94M4,14H2A2,2 0 0,0 4,12V14M4,18H2A2,2 0 0,0 4,16V18M4,22H2A2,2 0 0,0 4,20V22M22,14H20V12A2,2 0 0,1 22,14M22,18H20V16A2,2 0 0,1 22,18M22,22H20V20A2,2 0 0,1 22,22M18.5,12C19.3,12 20,12.7 20,13.5V14.5C20,15.3 19.3,16 18.5,16H5.5C4.7,16 4,15.3 4,14.5V13.5C4,12.7 4.7,12 5.5,12H18.5M16,14H8V18H16V14Z" />
      </svg>
    </div>
  )
}

export default AutoGraphIcon
