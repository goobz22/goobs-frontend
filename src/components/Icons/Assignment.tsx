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

interface AssignmentIconProps extends React.SVGProps<SVGSVGElement> {
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

const AssignmentIcon: React.FC<AssignmentIconProps> = ({
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
        <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h168q13-36 43.5-58t68.5-22q38 0 68.5 22t43.5 58h168q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm80-80h280v-80H280v80Zm0-160h400v-80H280v80Zm0-160h400v-80H280v80Zm200-190q13 0 21.5-8.5T510-820q0-13-8.5-21.5T480-850q-13 0-21.5 8.5T450-820q0 13 8.5 21.5T480-790Z" />
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

export default AssignmentIcon
