'use client'

import React from 'react'
import { IconStyles } from './types'
import cssStyles from './icon.module.css'

interface CloudSyncIconProps extends React.SVGProps<SVGSVGElement> {
  styles?: IconStyles
}

const CloudSyncIcon: React.FC<CloudSyncIconProps> = ({
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
        <path d="M21.5,14.5L20.09,13.09L18.5,14.68V12C18.5,10.62 17.87,9.37 16.84,8.6C17.24,7.79 17.5,6.91 17.5,6C17.5,3.79 15.71,2 13.5,2C12.85,2 12.26,2.16 11.74,2.44C10.76,0.95 9.23,0 7.5,0C4.46,0 2,2.46 2,5.5C2,6.06 2.08,6.6 2.23,7.11C0.95,8.08 0,9.68 0,11.5C0,14.26 2.24,16.5 5,16.5H6V15H5C3.07,15 1.5,13.43 1.5,11.5C1.5,9.57 3.07,8 5,8H5.5C5.5,5.79 7.29,4 9.5,4C11.07,4 12.39,4.81 13.03,6.04C13.5,6 14,6.07 14.47,6.2C15.54,6.5 16.5,7.18 17.07,8.15C17.5,8.1 18,8.13 18.5,8.23V6.5L20.09,8.09L21.5,6.68L24,9.18L21.5,11.68L20.09,10.27L18.5,11.86V9.5C18.5,10.88 17.38,12 16,12H15V13H16C18.21,13 20,11.21 20,9V10.5L21.41,9.09L22.82,10.5L20.32,13L17.82,10.5L19.23,9.09L20,9.86V8C20,5.79 18.21,4 16,4H15V3H16C19.31,3 22,5.69 22,9V11.5L20.59,10.09L19.18,11.5L21.68,14L24.18,11.5L22.77,10.09L21.36,11.5Z" />
      </svg>
      {theme === 'sacred' && <div className={cssStyles.glyph}></div>}
    </div>
  )
}

export default CloudSyncIcon
