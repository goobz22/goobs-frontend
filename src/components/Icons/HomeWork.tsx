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

interface HomeWorkIconProps extends React.SVGProps<SVGSVGElement> {
  sacredtheme?: boolean
}

// --------------------------------------------------------------------------
// SACRED THEMING STYLES
// --------------------------------------------------------------------------

const sacredStyles = {
  icon: {
    filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.6))',
    color: 'rgba(255, 215, 0, 0.9)',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  iconHover: {
    filter: 'drop-shadow(0 0 12px rgba(255, 215, 0, 1))',
    color: '#FFD700',
    transform: 'scale(1.1) rotate(2deg)',
  },
  glyph: {
    position: 'absolute',
    color: 'rgba(255, 215, 0, 0.4)',
    fontSize: '12px',
    zIndex: 10,
    opacity: 0,
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  glyphVisible: {
    opacity: 1,
    animation: 'sacredGlyphRotate 20s linear infinite',
  },
}

// --------------------------------------------------------------------------
// PREMIUM THEMING STYLES
// --------------------------------------------------------------------------

const premiumStyles = {
  icon: {
    filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))',
    color: 'currentColor',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  iconHover: {
    filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15))',
    transform: 'translateY(-1px)',
  },
}

const HomeWorkIcon: React.FC<HomeWorkIconProps> = ({
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
        <path d="M200-120v-240h80v160h400v-160h80v240H200ZM80-280v-240q0-33 23.5-56.5T160-600h160v-160q0-33 23.5-56.5T400-840h160q33 0 56.5 23.5T640-760v160h160q33 0 56.5 23.5T880-520v240H80Zm320-320h160v-160H400v160Z" />
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

export default HomeWorkIcon
