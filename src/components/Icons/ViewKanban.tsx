'use client'

import React from 'react'
import { IconStyles } from './types'
import cssStyles from './icon.module.css'
import { resolveIconA11y } from './iconA11y'

interface ViewKanbanIconProps extends React.SVGProps<SVGSVGElement> {
  styles?: IconStyles
}

const ViewKanbanIcon: React.FC<ViewKanbanIconProps> = ({
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
        <path d="M3 3h6v9H3V3zm0 11h6v7H3v-7zm8-11h6v7h-6V3zm0 9h6v9h-6v-9zm8-9h2v18h-2V3z" />
      </svg>
    </div>
  )
}

export default ViewKanbanIcon
