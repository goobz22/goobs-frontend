'use client'

import React from 'react'
import { IconStyles } from './types'
import cssStyles from './icon.module.css'

interface LooksTwoIconProps extends React.SVGProps<SVGSVGElement> {
  styles?: IconStyles
}

const LooksTwoIcon: React.FC<LooksTwoIconProps> = ({
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
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4 10.5h-2.5V12H14c.55 0 1-.45 1-1V9c0-.55-.45-1-1-1h-2.5c-.55 0-1 .45-1 1v.5h1.5V9h2v1.5h-2.5c-.55 0-1 .45-1 1V17h4v-1.5h-2.5v-2z" />
      </svg>
    </div>
  )
}

export default LooksTwoIcon
