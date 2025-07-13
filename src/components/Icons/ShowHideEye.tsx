'use client'

import React, { useEffect, useState } from 'react'

// --------------------------------------------------------------------------
// SACRED THEMING CONSTANTS
// --------------------------------------------------------------------------

const SACRED_GLYPHS = [
  '𓁟',
  '𓂀',
  '𓃀',
  '𓄿',
  '𓊖',
  '𓊗',
  '𓋴',
  '𓏏',
  '𓊨',
  '𓁦',
  '𓅓',
  '𓆄',
  '𓇳',
  '𓈖',
  '𓊹',
  '𓊺',
  '𓊻',
  '𓋹',
  '𓌻',
  '𓍿',
  '𓅨',
  '𓂋',
  '𓏭',
  '𓊵',
]

interface ShowHideEyeIconProps {
  visible?: boolean
  sacredtheme?: boolean
  style?: React.CSSProperties
}

// Premium theme styles (when sacredtheme=false)
const premiumStyles = {
  icon: {
    width: '16px',
    height: '16px',
    color: 'rgb(75, 85, 99)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))',
  } as React.CSSProperties,

  iconHover: {
    transform: 'scale(1.05)',
    filter: 'drop-shadow(0 2px 4px rgba(75, 85, 99, 0.3))',
    color: 'rgb(55, 65, 81)',
  } as React.CSSProperties,
}

// Sacred theme styles (when sacredtheme=true)
const sacredStyles = {
  icon: {
    width: '16px',
    height: '16px',
    color: 'rgba(255, 215, 0, 0.9)',
    transition: 'all 0.4s ease',
    filter: 'drop-shadow(0 0 6px rgba(255, 215, 0, 0.5))',
    fontFamily: 'Segoe UI Historic, Noto Sans Egyptian Hieroglyphs, serif',
  } as React.CSSProperties,

  iconHover: {
    transform: 'scale(1.1) rotate(5deg)',
    filter: 'drop-shadow(0 0 12px rgba(255, 215, 0, 0.8))',
    color: '#FFD700',
    fontFamily: 'Segoe UI Historic, Noto Sans Egyptian Hieroglyphs, serif',
  } as React.CSSProperties,

  glyph: {
    position: 'absolute',
    fontSize: '10px',
    color: 'rgba(255, 215, 0, 0.6)',
    transition: 'all 0.3s ease',
    opacity: 0,
    pointerEvents: 'none',
    animation: 'sacredGlyphRotate 20s linear infinite',
    fontFamily: 'Segoe UI Historic, Noto Sans Egyptian Hieroglyphs, serif',
  } as React.CSSProperties,

  glyphVisible: {
    opacity: 1,
    fontFamily: 'Segoe UI Historic, Noto Sans Egyptian Hieroglyphs, serif',
  } as React.CSSProperties,
}

const ShowHideEyeIcon: React.FC<ShowHideEyeIconProps> = ({
  visible = false,
  sacredtheme = false,
  style = {},
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [glyph] = useState(
    SACRED_GLYPHS[Math.floor(Math.random() * SACRED_GLYPHS.length)]
  )

  // CSS keyframes for sacred animations
  useEffect(() => {
    if (sacredtheme) {
      const styleSheet = document.styleSheets[0]
      const keyframes = `
        @keyframes sacredGlyphRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `
      try {
        styleSheet.insertRule(keyframes, styleSheet.cssRules.length)
      } catch {
        // Keyframes might already exist
      }
    }
  }, [sacredtheme])

  const styles = sacredtheme ? sacredStyles : premiumStyles
  const iconStyle = {
    ...styles.icon,
    ...(isHovered && sacredtheme ? styles.iconHover : {}),
    ...(isHovered && !sacredtheme ? premiumStyles.iconHover : {}),
    ...style,
  }

  return (
    <div
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {visible ? (
        sacredtheme ? (
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
          >
            <path d="M1 12C2.73 16.11 7 20 12 20s9.27-3.89 11-8c-1.73-4.11-6-8-11-8S2.73 7.89 1 12z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        )
      ) : sacredtheme ? (
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
        >
          <path d="M17.94 17.94A10.06 10.06 0 0 1 12 20C7 20 2.73 16.11 1 12c.74-1.81 2.01-3.41 3.56-4.69M9.53 9.53A3.001 3.001 0 0 1 12 15a3 3 0 0 1-2.47-5.47" />
          <path d="M1 1l22 22" />
        </svg>
      )}
      {sacredtheme && (
        <div
          style={{
            ...sacredStyles.glyph,
            ...(isHovered && sacredStyles.glyphVisible),
            top: '-6px',
            right: '-6px',
          }}
        >
          {glyph}
        </div>
      )}
    </div>
  )
}

export default ShowHideEyeIcon
