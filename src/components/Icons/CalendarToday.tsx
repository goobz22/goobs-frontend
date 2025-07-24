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

interface CalendarTodayIconProps extends React.SVGProps<SVGSVGElement> {
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

const CalendarTodayIcon: React.FC<CalendarTodayIconProps> = ({
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
        <path d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Zm280 240q-17 0-28.5-11.5T440-440q0-17 11.5-28.5T480-480q17 0 28.5 11.5T520-440q0 17-11.5 28.5T480-360Zm-160 0q-17 0-28.5-11.5T280-440q0-17 11.5-28.5T320-480q17 0 28.5 11.5T360-440q0 17-11.5 28.5T320-360Zm320 0q-17 0-28.5-11.5T600-440q0-17 11.5-28.5T640-480q17 0 28.5 11.5T680-440q0 17-11.5 28.5T640-360ZM480-200q-17 0-28.5-11.5T440-240q0-17 11.5-28.5T480-280q17 0 28.5 11.5T520-240q0 17-11.5 28.5T480-200Zm-160 0q-17 0-28.5-11.5T280-240q0-17 11.5-28.5T320-280q17 0 28.5 11.5T360-240q0 17-11.5 28.5T320-200Zm320 0q-17 0-28.5-11.5T600-240q0-17 11.5-28.5T640-280q17 0 28.5 11.5T680-240q0 17-11.5 28.5T640-200Z" />
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

export default CalendarTodayIcon
