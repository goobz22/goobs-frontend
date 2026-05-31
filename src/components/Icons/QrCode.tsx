'use client'

import React from 'react'
import { IconStyles } from './types'
import cssStyles from './icon.module.css'

interface QrCodeIconProps extends React.SVGProps<SVGSVGElement> {
  styles?: IconStyles
}

const QrCodeIcon: React.FC<QrCodeIconProps> = ({
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
        fill="none"
        style={svgStyle}
        {...props}
      >
        <rect x="3" y="3" width="8" height="8" rx="1" fill="currentColor" />
        <rect x="13" y="3" width="8" height="8" rx="1" fill="currentColor" />
        <rect x="3" y="13" width="8" height="8" rx="1" fill="currentColor" />
        <rect x="5" y="5" width="4" height="4" fill="white" />
        <rect x="15" y="5" width="4" height="4" fill="white" />
        <rect x="5" y="15" width="4" height="4" fill="white" />
        <rect x="6.5" y="6.5" width="1" height="1" fill="currentColor" />
        <rect x="16.5" y="6.5" width="1" height="1" fill="currentColor" />
        <rect x="6.5" y="16.5" width="1" height="1" fill="currentColor" />
        <rect x="13" y="13" width="2" height="2" fill="currentColor" />
        <rect x="16" y="13" width="2" height="2" fill="currentColor" />
        <rect x="19" y="13" width="2" height="2" fill="currentColor" />
        <rect x="13" y="16" width="2" height="2" fill="currentColor" />
        <rect x="19" y="16" width="2" height="2" fill="currentColor" />
        <rect x="13" y="19" width="2" height="2" fill="currentColor" />
        <rect x="16" y="19" width="2" height="2" fill="currentColor" />
        <rect x="19" y="19" width="2" height="2" fill="currentColor" />
      </svg>
    </div>
  )
}

export default QrCodeIcon
