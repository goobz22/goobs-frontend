'use client'

import React from 'react'
import { IconStyles } from './types'
import cssStyles from './icon.module.css'

interface DeviceHubIconProps extends React.SVGProps<SVGSVGElement> {
  styles?: IconStyles
}

const DeviceHubIcon: React.FC<DeviceHubIconProps> = ({
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
        <path d="M17,16L18.8,14.2C18.93,14.07 19,13.89 19,13.71V10.29C19,10.11 18.93,9.93 18.8,9.8L17,8H7L5.2,9.8C5.07,9.93 5,10.11 5,10.29V13.71C5,13.89 5.07,14.07 5.2,14.2L7,16H17M18,7L20.25,9.25C20.57,9.57 20.75,10 20.75,10.46V13.54C20.75,14 20.57,14.43 20.25,14.75L18,17H15V19.5A1.5,1.5 0 0,1 13.5,21H10.5A1.5,1.5 0 0,1 9,19.5V17H6L3.75,14.75C3.43,14.43 3.25,14 3.25,13.54V10.46C3.25,10 3.43,9.57 3.75,9.25L6,7H9V4.5A1.5,1.5 0 0,1 10.5,3H13.5A1.5,1.5 0 0,1 15,4.5V7H18Z" />
      </svg>
    </div>
  )
}

export default DeviceHubIcon
