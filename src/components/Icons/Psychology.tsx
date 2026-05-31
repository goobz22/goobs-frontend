'use client'

import React from 'react'
import { IconStyles } from './types'
import cssStyles from './icon.module.css'

interface PsychologyIconProps extends React.SVGProps<SVGSVGElement> {
  styles?: IconStyles
}

const PsychologyIcon: React.FC<PsychologyIconProps> = ({
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
        <path d="M13,8.57C15.81,8.57 18.04,6.34 18.04,3.53C18.04,0.72 15.81,0 13,0C10.19,0 7.96,2.23 7.96,5.04C7.96,5.75 8.1,6.42 8.36,7.03C5.64,8.5 3.5,11.42 3.5,15C3.5,18.59 6.41,21.5 10,21.5C13.59,21.5 16.5,18.59 16.5,15C16.5,11.42 14.36,8.5 11.64,7.03C12.14,7.6 12.76,8.03 13.46,8.31C13.31,8.4 13.16,8.48 13,8.57M9,14L12,16.5L15,14V12L12,14.5L9,12V14M12,10.5C13.38,10.5 14.5,9.38 14.5,8C14.5,6.62 13.38,5.5 12,5.5C10.62,5.5 9.5,6.62 9.5,8C9.5,9.38 10.62,10.5 12,10.5Z" />
      </svg>
    </div>
  )
}

export default PsychologyIcon
