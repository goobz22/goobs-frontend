'use client'

import React, { useState, useEffect } from 'react'

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

interface KeyboardReturnIconProps extends React.SVGProps<SVGSVGElement> {
  sacredtheme?: boolean
}

// Premium theme styles (when sacredtheme=false)
const premiumStyles = {
  icon: {
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))',
    color: 'rgb(99, 102, 241)',
  } as React.CSSProperties,

  iconHover: {
    transform: 'scale(1.05)',
    filter: 'drop-shadow(0 2px 4px rgba(99, 102, 241, 0.3))',
    color: 'rgb(79, 70, 229)',
  } as React.CSSProperties,
}

// Sacred theme styles (when sacredtheme=true)
const sacredStyles = {
  icon: {
    transition: 'all 0.4s ease',
    filter: 'drop-shadow(0 0 6px rgba(255, 215, 0, 0.5))',
    color: 'rgba(255, 215, 0, 0.9)',
  } as React.CSSProperties,

  iconHover: {
    transform: 'scale(1.1) rotate(-5deg)',
    filter: 'drop-shadow(0 0 12px rgba(255, 215, 0, 0.8))',
    color: '#FFD700',
  } as React.CSSProperties,

  glyph: {
    position: 'absolute',
    fontSize: '12px',
    color: 'rgba(255, 215, 0, 0.6)',
    transition: 'all 0.3s ease',
    opacity: 0,
    pointerEvents: 'none',
    animation: 'sacredGlyphRotate 20s linear infinite',
  } as React.CSSProperties,

  glyphVisible: {
    opacity: 1,
  } as React.CSSProperties,
}

const KeyboardReturnIcon: React.FC<KeyboardReturnIconProps> = ({
  sacredtheme = false,
  style = {},
  ...props
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

  const iconStyle = {
    ...(sacredtheme ? sacredStyles.icon : premiumStyles.icon),
    ...(isHovered && sacredtheme ? sacredStyles.iconHover : {}),
    ...(isHovered && !sacredtheme ? premiumStyles.iconHover : {}),
    ...style,
  }

  return (
    <div
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24"
        viewBox="0 -960 960 960"
        width="24"
        fill="currentColor"
        style={iconStyle}
        {...props}
      >
        <path d="M647-440H160q-17 0-28.5-11.5T120-480q0-17 11.5-28.5T160-520h487L423-744q-12-12-11.5-28t12.5-28q12-11 28-11.5t28 11.5l264 264q6 6 8.5 13t2.5 15q0 8-2.5 15t-8.5 13L480-216q-11 11-27.5 11T424-216q-11-11-11-28t11-28l224-224Z" />
      </svg>
      {sacredtheme && (
        <div
          style={{
            ...sacredStyles.glyph,
            ...(isHovered && sacredStyles.glyphVisible),
            top: '-8px',
            right: '-8px',
          }}
        >
          {glyph}
        </div>
      )}
    </div>
  )
}

export default KeyboardReturnIcon
