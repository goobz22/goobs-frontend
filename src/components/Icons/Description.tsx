'use client'

import React from 'react'
import { IconStyles } from './types'
import cssStyles from './icon.module.css'
import { resolveIconA11y } from './iconA11y'

interface DescriptionIconProps extends React.SVGProps<SVGSVGElement> {
  styles?: IconStyles
}

const DescriptionIcon: React.FC<DescriptionIconProps> = ({
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
        <path d="M14 2H6C5.45 2 4.95 2.22 4.59 2.59C4.22 2.95 4 3.45 4 4V20C4 20.55 4.22 21.05 4.59 21.41C4.95 21.78 5.45 22 6 22H18C18.55 22 19.05 21.78 19.41 21.41C19.78 21.05 20 20.55 20 20V8L14 2ZM18 20H6V4H13V9H18V20ZM8 12H16V14H8V12ZM8 16H13V18H8V16Z" />
      </svg>
    </div>
  )
}

export default DescriptionIcon
