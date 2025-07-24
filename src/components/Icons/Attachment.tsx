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

interface AttachmentIconProps extends React.SVGProps<SVGSVGElement> {
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

const AttachmentIcon: React.FC<AttachmentIconProps> = ({
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
        <path d="M720-330q0 104-73 177T470-80q-104 0-177-73t-73-177v-370q0-75 52.5-127.5T400-880q75 0 127.5 52.5T580-700v350q0 46-32 78t-78 32q-46 0-78-32t-32-78v-310h80v310q0 13 8.5 21.5T470-320q13 0 21.5-8.5T500-350v-350q0-42-29-71t-71-29q-42 0-71 29t-29 71v370q0 71 49.5 120.5T470-160q71 0 120.5-49.5T640-330v-390h80v390Z" />
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

export default AttachmentIcon
