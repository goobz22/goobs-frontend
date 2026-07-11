'use client'

import React from 'react'
import { IconStyles } from './types'
import cssStyles from './icon.module.css'
import { resolveIconA11y } from './iconA11y'

interface ShowHideEyeIconProps extends React.SVGProps<SVGSVGElement> {
  visible?: boolean
  styles?: IconStyles
}

const ShowHideEyeIcon: React.FC<ShowHideEyeIconProps> = ({
  visible = false,
  styles,
  style = {},
  ...props
}) => {
  const theme = styles?.theme || 'light'
  const isSacredTheme = theme === 'sacred'
  const { rest, svgA11y, title } = resolveIconA11y(props)

  // Caller-supplied overrides (size / color / filter / transform / etc.) and
  // the native `style` prop stay in JS; theme + hover + transition live in CSS.
  const wrapperStyle: React.CSSProperties = {
    ...(styles?.padding && { padding: styles.padding }),
    ...(styles?.margin && { margin: styles.margin }),
  }

  // ShowHideEye hardcodes a 16px square (legitimate JS-stayer per recipe);
  // caller `size` may still override it, and the native `style` wins last.
  const svgStyle: React.CSSProperties = {
    ...(styles?.color && { color: styles.color }),
    ...(styles?.backgroundColor && {
      backgroundColor: styles.backgroundColor,
    }),
    ...(styles?.borderRadius && { borderRadius: styles.borderRadius }),
    ...(styles?.filter && { filter: styles.filter }),
    ...(styles?.transform && { transform: styles.transform }),
    ...(styles?.boxShadow && { boxShadow: styles.boxShadow }),
    width: '16px',
    height: '16px',
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
      {visible ? (
        isSacredTheme ? (
          <div
            className={cssStyles.svg}
            aria-hidden={svgA11y['aria-hidden']}
            role={svgA11y.role}
            aria-label={svgA11y['aria-label'] ?? title}
            aria-labelledby={svgA11y['aria-labelledby']}
            style={{
              ...svgStyle,
              fontSize: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily:
                'Segoe UI Historic, Noto Sans Egyptian Hieroglyphs, serif',
            }}
          >
            𓂀
          </div>
        ) : (
          <svg
            className={cssStyles.svg}
            style={svgStyle}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...rest}
            {...svgA11y}
          >
            {title ? <title>{title}</title> : null}
            <path d="M1 12C2.73 16.11 7 20 12 20s9.27-3.89 11-8c-1.73-4.11-6-8-11-8S2.73 7.89 1 12z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        )
      ) : isSacredTheme ? (
        <div
          className={cssStyles.svg}
          aria-hidden={svgA11y['aria-hidden']}
          role={svgA11y.role}
          aria-label={svgA11y['aria-label'] ?? title}
          aria-labelledby={svgA11y['aria-labelledby']}
          style={{
            ...svgStyle,
            fontSize: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily:
              'Segoe UI Historic, Noto Sans Egyptian Hieroglyphs, serif',
            position: 'relative',
          }}
        >
          <span style={{ opacity: 0.5 }}>𓂀</span>
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%) rotate(45deg)',
              width: '20px',
              height: '2px',
              backgroundColor: 'currentColor',
            }}
          />
        </div>
      ) : (
        <svg
          className={cssStyles.svg}
          style={svgStyle}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          {...rest}
          {...svgA11y}
        >
          {title ? <title>{title}</title> : null}
          <path d="M17.94 17.94A10.06 10.06 0 0 1 12 20C7 20 2.73 16.11 1 12c.74-1.81 2.01-3.41 3.56-4.69M9.53 9.53A3.001 3.001 0 0 1 12 15a3 3 0 0 1-2.47-5.47" />
          <path d="M1 1l22 22" />
        </svg>
      )}
    </div>
  )
}

export default ShowHideEyeIcon
