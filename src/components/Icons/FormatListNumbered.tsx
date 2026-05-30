'use client'

import React from 'react'
import { IconStyles } from '../../theme'
import cssStyles from './icon.module.css'

interface FormatListNumberedIconProps extends React.SVGProps<SVGSVGElement> {
  styles?: IconStyles
}

const FormatListNumberedIcon: React.FC<FormatListNumberedIconProps> = ({
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
        {/* Number 1 */}
        <path d="M3 5h1v3H3V5z" />
        <path d="M2.5 5h2v0.5h-2V5z" />
        {/* Number 2 */}
        <path d="M2 11h2v0.5H2v-0.5z" />
        <path d="M3.5 11.5h0.5v0.5H3.5v-0.5z" />
        <path d="M2 12.5h2v0.5H2v-0.5z" />
        <path d="M2 13h0.5v0.5H2V13z" />
        <path d="M2 13.5h2v0.5H2v-0.5z" />
        {/* Number 3 */}
        <path d="M2 17h2v0.5H2V17z" />
        <path d="M3.5 17.5h0.5v0.5H3.5v-0.5z" />
        <path d="M2.5 18h1v0.5h-1V18z" />
        <path d="M3.5 18.5h0.5v0.5H3.5v-0.5z" />
        <path d="M2 19h2v0.5H2V19z" />
        {/* Text lines */}
        <path d="M7 6h13v1H7V6z" />
        <path d="M7 12h13v1H7v-1z" />
        <path d="M7 18h13v1H7v-1z" />
      </svg>
      {theme === 'sacred' && <div className={cssStyles.glyph}></div>}
    </div>
  )
}

export default FormatListNumberedIcon
