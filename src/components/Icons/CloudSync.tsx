'use client'

import React from 'react'
import { IconStyles } from './types'
import cssStyles from './icon.module.css'
import { resolveIconA11y } from './iconA11y'

interface CloudSyncIconProps extends React.SVGProps<SVGSVGElement> {
  styles?: IconStyles
}

const CloudSyncIcon: React.FC<CloudSyncIconProps> = ({
  styles,
  style = {},
  ...props
}) => {
  const theme = styles?.theme || 'light'
  const { rest, svgA11y, title } = resolveIconA11y(props)

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
        {...rest}
        {...svgA11y}
      >
        {title ? <title>{title}</title> : null}
        {/* Cloud body (from CloudUpload) + sync circular-arrows cut out of it
            via fill-rule evenodd, so the sync motif reads on any theme. */}
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM12.6 9.2V7.8l-2 1.7 2 1.7v-1.4c1.66 0 3 1.34 3 3 0 .5-.13.98-.35 1.4l1.02.86c.43-.66.68-1.43.68-2.26 0-2.21-1.79-4-4-4zm0 7c-1.66 0-3-1.34-3-3 0-.5.13-.98.35-1.4l-1.02-.86c-.43.66-.68 1.43-.68 2.26 0 2.21 1.79 4 4 4v1.4l2-1.7-2-1.7v1.4z"
        />
      </svg>
    </div>
  )
}

export default CloudSyncIcon
