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

interface GroupWorkIconProps extends React.SVGProps<SVGSVGElement> {
  sacredtheme?: boolean
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

const GroupWorkIcon: React.FC<GroupWorkIconProps> = ({
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
        <path d="M480-160q-100 0-170-70t-70-170h80q0 66 47 113t113 47q66 0 113-47t47-113h80q0 100-70 170t-170 70ZM680-80q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113T680-80Zm-600 0q-66 0-113-47T-80-240q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113T80-80Zm400-240q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm0-160Z" />
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

export default GroupWorkIcon
