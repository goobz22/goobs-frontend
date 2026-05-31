'use client'

import React from 'react'
import { IconStyles } from './types'
import cssStyles from './icon.module.css'

interface FileCopyIconProps extends React.SVGProps<SVGSVGElement> {
  styles?: IconStyles
}

const FileCopyIcon: React.FC<FileCopyIconProps> = ({
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
        <path d="M0 0h24v24H0V0z" fill="none" />
        <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm-1 4H8c-1.1 0-1.99.9-1.99 2L6 21c0 1.1.89 2 1.99 2H19c1.1 0 2-.9 2-2V11l-6-6zm4 16H8V7h6v5h5v9z" />
      </svg>
    </div>
  )
}

export default FileCopyIcon
