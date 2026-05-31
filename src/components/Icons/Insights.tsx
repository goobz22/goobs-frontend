'use client'

import React from 'react'
import { IconStyles } from './types'
import cssStyles from './icon.module.css'

interface InsightsIconProps extends React.SVGProps<SVGSVGElement> {
  styles?: IconStyles
}

const InsightsIcon: React.FC<InsightsIconProps> = ({
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
        <path d="M21 8c-1.45 0-2.26 1.44-1.93 2.51l-3.57 3.57c-.52-.4-1.17-.64-1.88-.64-.16 0-.32.02-.47.04L9.4 10.73c.15-.39.24-.82.24-1.27 0-1.89-1.54-3.46-3.46-3.46S2.72 7.57 2.72 9.46s1.54 3.46 3.46 3.46c.16 0 .32-.02.47-.04l3.75 2.75c-.15.39-.24.82-.24 1.27 0 1.89 1.54 3.46 3.46 3.46s3.46-1.54 3.46-3.46c0-.72-.2-1.4-.55-1.93l3.57-3.57c.52.4 1.17.64 1.88.64 1.89 0 3.46-1.54 3.46-3.46S22.89 8 21 8zM6.18 11.82c-.74 0-1.36-.62-1.36-1.36s.62-1.36 1.36-1.36 1.36.62 1.36 1.36-.62 1.36-1.36 1.36zM13.82 19.18c-.74 0-1.36-.62-1.36-1.36s.62-1.36 1.36-1.36 1.36.62 1.36 1.36-.62 1.36-1.36 1.36zM21 11.82c-.74 0-1.36-.62-1.36-1.36s.62-1.36 1.36-1.36 1.36.62 1.36 1.36-.62 1.36-1.36 1.36z" />
      </svg>
    </div>
  )
}

export default InsightsIcon
