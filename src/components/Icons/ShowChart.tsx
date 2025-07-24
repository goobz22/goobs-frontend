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

interface ShowChartIconProps extends React.SVGProps<SVGSVGElement> {
  sacredtheme?: boolean
}

// Premium theme styles
const premiumStyles = {
  icon: {
    color: '#4A5568',
    transition: 'all 0.3s ease',
  },
  iconHover: {
    color: '#2D3748',
    transform: 'scale(1.1)',
  },
}

// Sacred theme styles
const sacredStyles = {
  icon: {
    color: '#FFD700',
    filter: 'drop-shadow(0 0 4px rgba(255, 215, 0, 0.4))',
    transition: 'all 0.3s ease',
  },
  iconHover: {
    color: '#FFF8DC',
    filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.8))',
    transform: 'scale(1.1)',
  },
  glyph: {
    position: 'absolute' as const,
    color: 'rgba(255, 215, 0, 0.6)',
    fontSize: '8px',
    fontFamily: '"Noto Sans Egyptian Hieroglyphs", serif',
    animation: 'sacredGlyphRotate 3s linear infinite',
    opacity: 0,
    transition: 'opacity 0.3s ease',
  },
  glyphVisible: {
    opacity: 1,
  },
}

const ShowChartIcon: React.FC<ShowChartIconProps> = ({
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
        <path d="m136-240-92-92 296-296 160 160 208-208 92 92-300 300-160-160-204 204Z" />
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

export default ShowChartIcon
