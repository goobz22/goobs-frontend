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

interface MouseIconProps extends React.SVGProps<SVGSVGElement> {
  sacredtheme?: boolean
}

// Premium dark theme styles
const premiumStyles = {
  icon: {
    width: '20px',
    height: '20px',
    color: 'rgba(255, 255, 255, 0.8)',
    transition: 'all 0.3s ease',
  },
  iconHover: {
    color: 'rgba(59, 130, 246, 0.9)',
    transform: 'scale(1.1)',
  },
}

// Sacred theme styles
const sacredStyles = {
  icon: {
    width: '20px',
    height: '20px',
    color: '#FFD700',
    filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.6))',
    transition: 'all 0.3s ease',
  },
  iconHover: {
    color: '#FFF8DC',
    filter: 'drop-shadow(0 0 12px rgba(255, 215, 0, 0.8))',
    transform: 'scale(1.1)',
  },
  glyph: {
    position: 'absolute' as const,
    fontSize: '8px',
    color: '#FFD700',
    opacity: 0,
    transition: 'all 0.3s ease',
    animation: 'sacredGlyphRotate 3s linear infinite',
    pointerEvents: 'none' as const,
  },
  glyphVisible: {
    opacity: 0.7,
  },
}

const MouseIcon: React.FC<MouseIconProps> = ({
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
        <path d="M480-80q-83 0-141.5-58.5T280-280v-200q0-83 58.5-141.5T480-680q83 0 141.5 58.5T680-480v200q0 83-58.5 141.5T480-80Zm-40-520v120h80v-120q0-17-11.5-28.5T480-640q-17 0-28.5 11.5T440-600Zm40 440q50 0 85-35t35-85v-200q0-50-35-85t-85-35q-50 0-85 35t-35 85v200q0 50 35 85t85 35Z" />
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

MouseIcon.displayName = 'MouseIcon'

export default MouseIcon
