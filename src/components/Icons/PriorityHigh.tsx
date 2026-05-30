'use client'

import React from 'react'
import { IconStyles } from '../../theme'
import cssStyles from './icon.module.css'

interface PriorityHighIconProps extends React.SVGProps<SVGSVGElement> {
  styles?: IconStyles
}

const PriorityHighIcon: React.FC<PriorityHighIconProps> = ({
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
        <path d="M14 20H10V11H14V20ZM14 9H10V4H14V9Z" />
        <path d="M12 2L14.5 4.5L12 7L9.5 4.5L12 2Z" />
      </svg>
      {theme === 'sacred' && <div className={cssStyles.glyph}></div>}
    </div>
  )
}

PriorityHighIcon.displayName = 'PriorityHighIcon'

export default PriorityHighIcon
