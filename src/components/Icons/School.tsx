'use client'

import React from 'react'
import { IconStyles } from './types'
import cssStyles from './icon.module.css'

interface SchoolIconProps extends React.SVGProps<SVGSVGElement> {
  styles?: IconStyles
}

const SchoolIcon: React.FC<SchoolIconProps> = ({
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
        <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
      </svg>
    </div>
  )
}

export default SchoolIcon
