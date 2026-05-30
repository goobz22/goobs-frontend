'use client'

import React from 'react'
import { IconStyles } from '../../theme'
import cssStyles from './icon.module.css'

interface ApartmentIconProps extends React.SVGProps<SVGSVGElement> {
  styles?: IconStyles
}

const ApartmentIcon: React.FC<ApartmentIconProps> = ({
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
        <path d="M17,11V3H7V4H15V11H17M21,9V7H17V9H21M7,11V9L5,9V11H7M21,11V9H19V11H21M5,11V13H7V11H5M17,13V11H15V13H17M7,13V15H5V13H7M21,13V15H17V13H21M15,15V13H7V15H15M17,15V17H21V15H19V17H17M15,19V17H17V15H15V17H7V19H15M5,19V17H7V19H5M5,15V17H17V15H5Z" />
      </svg>
      {theme === 'sacred' && <div className={cssStyles.glyph}></div>}
    </div>
  )
}

export default ApartmentIcon
