'use client'

import React from 'react'
import { IconStyles } from '../../theme'
import cssStyles from './icon.module.css'

interface PointOfSaleIconProps extends React.SVGProps<SVGSVGElement> {
  styles?: IconStyles
}

const PointOfSaleIcon: React.FC<PointOfSaleIconProps> = ({
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
        <path d="M17,2H7A2,2 0 0,0 5,4V20A2,2 0 0,0 7,22H17A2,2 0 0,0 19,20V4A2,2 0 0,0 17,2M17,20H7V4H17M16,6H8V8H16M16,10H8V12H16M16,14H8V16H16" />
      </svg>
      {theme === 'sacred' && <div className={cssStyles.glyph}></div>}
    </div>
  )
}

export default PointOfSaleIcon
