'use client'

import React from 'react'
import { IconStyles } from '../../theme'
import cssStyles from './icon.module.css'

interface ContractIconProps extends React.SVGProps<SVGSVGElement> {
  styles?: IconStyles
}

const ContractIcon: React.FC<ContractIconProps> = ({
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
        <path d="M5 3C3.89 3 3 3.89 3 5V19C3 20.11 3.89 21 5 21H12.09C12.03 20.67 12 20.34 12 20C12 16.69 14.69 14 18 14C19.09 14 20.12 14.28 21 14.81V8L14 3H5M7 7H12V9H7V7M7 11H17V13H7V11M7 15H17V17H7V15M23 18.5C23 19.88 21.88 21 20.5 21S18 19.88 18 18.5 19.12 16 20.5 16 23 17.12 23 18.5M19.5 19.5H21V18H19.5V19.5M21 17H19.5V16.25C19.5 16.11 19.61 16 19.75 16S20 16.11 20 16.25V16.5C20 16.78 20.22 17 20.5 17Z" />
      </svg>
      {theme === 'sacred' && <div className={cssStyles.glyph}></div>}
    </div>
  )
}

export default ContractIcon
