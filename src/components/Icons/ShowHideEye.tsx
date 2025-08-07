'use client'

import React, { useEffect, useState, useMemo } from 'react'
import {
  IconStyles,
  getIconStyles,
  injectSacredKeyframes,
  SACRED_GLYPHS,
} from '../../theme'

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
  const [isHovered, setIsHovered] = useState(false)
  const [glyph] = useState(
    SACRED_GLYPHS[Math.floor(Math.random() * SACRED_GLYPHS.length)]
  )

  useEffect(() => {
    if (styles?.theme === 'sacred') {
      injectSacredKeyframes()
    }
  }, [styles?.theme])

  const computedStyles = useMemo(
    () => getIconStyles(styles, isHovered, styles?.disabled),
    [styles, isHovered]
  )

  const iconStyle = {
    ...computedStyles.icon,
    width: '16px',
    height: '16px',
    ...style,
  }

  return (
    <div
      style={computedStyles.container}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {visible ? (
        computedStyles.isSacredTheme ? (
          <div
            style={{
              ...iconStyle,
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
            style={iconStyle}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
          >
            <path d="M1 12C2.73 16.11 7 20 12 20s9.27-3.89 11-8c-1.73-4.11-6-8-11-8S2.73 7.89 1 12z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        )
      ) : computedStyles.isSacredTheme ? (
        <div
          style={{
            ...iconStyle,
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
          style={iconStyle}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          {...props}
        >
          <path d="M17.94 17.94A10.06 10.06 0 0 1 12 20C7 20 2.73 16.11 1 12c.74-1.81 2.01-3.41 3.56-4.69M9.53 9.53A3.001 3.001 0 0 1 12 15a3 3 0 0 1-2.47-5.47" />
          <path d="M1 1l22 22" />
        </svg>
      )}
      {computedStyles.isSacredTheme && (
        <div style={computedStyles.glyph}>{glyph}</div>
      )}
    </div>
  )
}

export default ShowHideEyeIcon
