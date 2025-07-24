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

interface VisibilityIconProps extends React.SVGProps<SVGSVGElement> {
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

const VisibilityIcon: React.FC<VisibilityIconProps> = ({
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
        <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Z" />
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

export default VisibilityIcon
