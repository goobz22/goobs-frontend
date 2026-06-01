'use client'

import React from 'react'
import { IconStyles } from './types'
import cssStyles from './icon.module.css'

interface VpnKeyIconProps extends React.SVGProps<SVGSVGElement> {
  styles?: IconStyles
}

const VpnKeyIcon: React.FC<VpnKeyIconProps> = ({
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
        <path d="M12.65 10C11.7 7.31 8.9 5.5 5.77 6.12c-2.29.46-4.15 2.29-4.63 4.58C.32 14.57 2.92 18 6.71 18c1.89 0 3.62-.75 4.88-1.97l5.66 5.66c.39.39 1.02.39 1.41 0l.71-.71c.39-.39.39-1.02 0-1.41L13.71 14c.5-.65.8-1.45.8-2.31 0-.26-.03-.51-.08-.76C14.99 10.33 13.88 10 12.65 10zM6.5 15.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5S9 11.62 9 13s-1.12 2.5-2.5 2.5z" />
      </svg>
    </div>
  )
}

export default VpnKeyIcon
