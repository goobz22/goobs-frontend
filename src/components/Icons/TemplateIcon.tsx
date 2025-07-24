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

interface TemplateIconProps extends React.SVGProps<SVGSVGElement> {
  sacredtheme?: boolean
}

// Premium theme styles (when sacredtheme=false)
const premiumStyles = {
  icon: {
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))',
    color: 'rgb(107, 114, 128)',
  } as React.CSSProperties,

  iconHover: {
    transform: 'scale(1.05)',
    filter: 'drop-shadow(0 2px 4px rgba(107, 114, 128, 0.3))',
    color: 'rgb(79, 70, 229)',
  } as React.CSSProperties,
}

// Sacred theme styles (when sacredtheme=true)
const sacredStyles = {
  icon: {
    transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
    filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.3))',
    color: '#FFD700',
    textShadow: '0 0 20px rgba(255, 215, 0, 0.5)',
  } as React.CSSProperties,

  iconHover: {
    transform: 'scale(1.1) rotate(5deg)',
    filter: 'drop-shadow(0 0 16px rgba(255, 215, 0, 0.6))',
    color: '#FFA500',
    textShadow: '0 0 30px rgba(255, 215, 0, 0.8)',
  } as React.CSSProperties,

  glyph: {
    position: 'absolute',
    fontSize: '0.6rem',
    color: '#FFD700',
    opacity: 0,
    transition: 'all 0.3s ease',
    animation: 'sacredGlyphRotate 2s linear infinite',
    pointerEvents: 'none',
    textShadow: '0 0 10px rgba(255, 215, 0, 0.8)',
  } as React.CSSProperties,

  glyphVisible: {
    opacity: 0.8,
  } as React.CSSProperties,
}

const TemplateIcon: React.FC<TemplateIconProps> = ({
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
        viewBox="0 0 24 24"
        width="24"
        fill="currentColor"
        style={iconStyle}
        {...props}
      >
        <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
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

export default TemplateIcon
