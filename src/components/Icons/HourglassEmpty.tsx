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

interface HourglassEmptyIconProps extends React.SVGProps<SVGSVGElement> {
  sacredtheme?: boolean
}

// Premium theme styles (when sacredtheme=false)
const premiumStyles = {
  icon: {
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))',
    color: 'rgb(107, 114, 128)',
  } as React.CSSProperties,

  iconHover: {
    transform: 'scale(1.05)',
    filter: 'drop-shadow(0 2px 4px rgba(107, 114, 128, 0.3))',
    color: 'rgb(75, 85, 99)',
  } as React.CSSProperties,
}

// Sacred theme styles (when sacredtheme=true)
const sacredStyles = {
  icon: {
    transition: 'all 0.4s ease',
    filter: 'drop-shadow(0 0 6px rgba(255, 215, 0, 0.5))',
    color: 'rgba(255, 215, 0, 0.9)',
  } as React.CSSProperties,

  iconHover: {
    transform: 'scale(1.1) rotate(5deg)',
    filter: 'drop-shadow(0 0 12px rgba(255, 215, 0, 0.8))',
    color: '#FFD700',
  } as React.CSSProperties,

  glyph: {
    position: 'absolute',
    fontSize: '12px',
    color: 'rgba(255, 215, 0, 0.6)',
    transition: 'all 0.3s ease',
    opacity: 0,
    pointerEvents: 'none',
    animation: 'sacredGlyphRotate 20s linear infinite',
  } as React.CSSProperties,

  glyphVisible: {
    opacity: 1,
  } as React.CSSProperties,
}

const HourglassEmptyIcon: React.FC<HourglassEmptyIconProps> = ({
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
        <path d="M480-80q-75 0-127.5-52.5T300-260q0-42 19.5-78.5T374-388q-35-17-54.5-53.5T300-520q0-33 14.5-62T355-628q-26-17-40.5-46T300-736q0-58 41-99t99-41q58 0 99 41t41 99q0 33-14.5 62T540-628q26 17 40.5 46T595-520q0 42-19.5 78.5T521-388q35 17 54.5 53.5T595-260q0 75-52.5 127.5T480-80Zm0-80q42 0 71-29t29-71q0-42-29-71t-71-29q-42 0-71 29t-29 71q0 42 29 71t71 29Zm0-240q33 0 56.5-23.5T560-480q0-33-23.5-56.5T480-560q-33 0-56.5 23.5T400-480q0 33 23.5 56.5T480-400Zm0-240q42 0 71-29t29-71q0-42-29-71t-71-29q-42 0-71 29t-29 71q0 42 29 71t71 29Zm0-100Zm0 380Zm0 240Z" />
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

export default HourglassEmptyIcon
