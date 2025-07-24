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

interface AssessmentIconProps extends React.SVGProps<SVGSVGElement> {
  sacredtheme?: boolean
  fontSize?: 'small' | 'medium' | 'large'
}

// --------------------------------------------------------------------------
// STYLING CONSTANTS
// --------------------------------------------------------------------------

const premiumStyles = {
  icon: {
    color: '#4A5568', // Cool gray
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
  },
  iconHover: {
    color: '#2D3748', // Darker gray
    transform: 'scale(1.1)',
  },
}

const sacredStyles = {
  icon: {
    color: '#F7DC6F', // Egyptian gold
    filter: 'drop-shadow(0 0 8px rgba(247, 220, 111, 0.4))',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
  },
  iconHover: {
    color: '#F4D03F', // Brighter gold
    filter: 'drop-shadow(0 0 12px rgba(247, 220, 111, 0.6))',
    transform: 'scale(1.1)',
  },
  glyph: {
    position: 'absolute' as const,
    fontSize: '8px',
    color: '#F7DC6F',
    opacity: 0,
    transition: 'all 0.3s ease',
    pointerEvents: 'none' as const,
    animation: 'sacredGlyphRotate 3s linear infinite',
  },
  glyphVisible: {
    opacity: 0.7,
  },
}

const AssessmentIcon: React.FC<AssessmentIconProps> = ({
  sacredtheme = false,
  fontSize = 'medium',
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

  const sizeMap = {
    small: '20',
    medium: '24',
    large: '28',
  }

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
        height={sizeMap[fontSize]}
        viewBox="0 -960 960 960"
        width={sizeMap[fontSize]}
        fill="currentColor"
        style={iconStyle}
        {...props}
      >
        <path d="M280-280h80v-200h-80v200Zm160 0h80v-400h-80v400Zm160 0h80v-120h-80v120ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z" />
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

export default AssessmentIcon
