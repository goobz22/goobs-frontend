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

interface AdminPanelSettingsIconProps extends React.SVGProps<SVGSVGElement> {
  sacredtheme?: boolean
}

// --------------------------------------------------------------------------
// SACRED THEMING STYLES
// --------------------------------------------------------------------------

const sacredStyles = {
  icon: {
    transition: 'all 0.3s ease',
    filter: 'drop-shadow(0 0 8px rgba(218, 165, 32, 0.3))',
    color: '#DAA520',
  },
  iconHover: {
    filter: 'drop-shadow(0 0 15px rgba(218, 165, 32, 0.6))',
    transform: 'scale(1.1)',
    color: '#FFD700',
  },
  glyph: {
    position: 'absolute' as const,
    fontSize: '8px',
    color: '#DAA520',
    opacity: 0,
    transition: 'all 0.3s ease',
    animation: 'sacredGlyphRotate 3s linear infinite',
    textShadow: '0 0 4px rgba(218, 165, 32, 0.8)',
  },
  glyphVisible: {
    opacity: 0.7,
  },
}

const premiumStyles = {
  icon: {
    transition: 'all 0.2s ease',
    color: '#6366F1',
  },
  iconHover: {
    color: '#4F46E5',
    transform: 'scale(1.05)',
  },
}

const AdminPanelSettingsIcon: React.FC<AdminPanelSettingsIconProps> = ({
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
        <path d="M680-280q25 0 42.5-17.5T740-340q0-25-17.5-42.5T680-400q-25 0-42.5 17.5T620-340q0 25 17.5 42.5T680-280Zm0 120q31 0 57-14.5t42-38.5q-22-13-47-20t-52-7q-27 0-52 7t-47 20q16 24 42 38.5t57 14.5ZM480-80q-139-35-229.5-159.5T160-516v-244l320-120 320 120v244q0 66-13 129t-37 122q-15-5-31-8t-33-3q-86 0-146 60t-60 146q0 17 3 33t8 31Zm200-80q-83 0-141.5-58.5T480-360q0-83 58.5-141.5T680-560q83 0 141.5 58.5T880-360q0 83-58.5 141.5T680-160ZM480-146q-2-7-3-13.5t-1-14.5q0-104 73-177t177-73q8 0 15 .5t15 1.5q-24-118-98.5-204.5T480-754L240-670v154q0 131 74.5 230T480-146Zm0-368Z" />
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

export default AdminPanelSettingsIcon
