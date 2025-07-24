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

interface PrecisionManufacturingIconProps
  extends React.SVGProps<SVGSVGElement> {
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

const PrecisionManufacturingIcon: React.FC<PrecisionManufacturingIconProps> = ({
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
        <path d="M160-120v-200h160v200H160Zm240 0v-440h160v440H400Zm240 0v-320h160v320H640ZM160-400v-160h160v160H160Zm240 0v-160h160v160H400Zm240-160v-160h160v160H640ZM160-640v-200h160v200H160Zm240 0v-200h160v200H400Zm240 0v-200h160v200H640Z" />
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

export default PrecisionManufacturingIcon
