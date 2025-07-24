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

interface CalculateIconProps extends React.SVGProps<SVGSVGElement> {
  sacredtheme?: boolean
}

// --------------------------------------------------------------------------
// STYLES
// --------------------------------------------------------------------------

const premiumStyles = {
  icon: {
    color: '#6366f1',
    filter: 'drop-shadow(0 0 8px rgba(99, 102, 241, 0.3))',
    transition: 'all 0.3s ease',
  },
  iconHover: {
    color: '#4f46e5',
    filter: 'drop-shadow(0 0 12px rgba(99, 102, 241, 0.5))',
    transform: 'scale(1.1)',
  },
}

const sacredStyles = {
  icon: {
    color: '#FFD700',
    filter:
      'drop-shadow(0 0 8px rgba(255, 215, 0, 0.6)) drop-shadow(0 0 16px rgba(255, 215, 0, 0.3))',
    transition: 'all 0.3s ease',
  },
  iconHover: {
    color: '#FFA500',
    filter:
      'drop-shadow(0 0 12px rgba(255, 215, 0, 0.8)) drop-shadow(0 0 24px rgba(255, 215, 0, 0.4))',
    transform: 'scale(1.1) rotate(5deg)',
  },
  glyph: {
    position: 'absolute' as const,
    fontSize: '8px',
    color: '#FFD700',
    opacity: 0,
    transition: 'all 0.3s ease',
    pointerEvents: 'none' as const,
    fontFamily: '"Noto Sans Egyptian Hieroglyphs", serif',
    animation: 'sacredGlyphRotate 10s linear infinite',
  },
  glyphVisible: {
    opacity: 0.8,
    transform: 'scale(1.2)',
  },
}

const CalculateIcon: React.FC<CalculateIconProps> = ({
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
        <path d="M320-240h60v-80h80v-60h-80v-80h-60v80h-80v60h80v80Zm200-30h200v-60H520v60Zm0-100h200v-60H520v60Zm44-150 56-56 56 56 42-42-56-56 56-56-42-42-56 56-56-56-42 42 56 56-56 56 42 42ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z" />
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

export default CalculateIcon
