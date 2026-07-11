'use client'

import React from 'react'
import { IconStyles } from './types'
import cssStyles from './icon.module.css'
import { resolveIconA11y } from './iconA11y'

interface GavelIconProps extends React.SVGProps<SVGSVGElement> {
  styles?: IconStyles
}

const GavelIcon: React.FC<GavelIconProps> = ({
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
        <path d="M2.6,16.9L1.2,18.3L2.6,19.7L9.9,12.4L8.5,11L2.6,16.9M9.9,12.4L8.5,11L12.4,7.1L13.8,8.5L9.9,12.4M13.1,8.9L11.7,7.5L13.8,5.4L16.6,2.6C17,2.2 17.6,2.2 18,2.6L21.4,6C21.8,6.4 21.8,7 21.4,7.4L18.6,10.2L15.2,6.8L13.1,8.9M15.2,6.8L16.6,8.2L18.7,6.1L17.3,4.7L15.2,6.8M3,22H21V20H3V22Z" />
      </svg>
    </div>
  )
}

export default GavelIcon
