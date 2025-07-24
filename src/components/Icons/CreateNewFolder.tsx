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

interface CreateNewFolderIconProps extends React.SVGProps<SVGSVGElement> {
  sacredtheme?: boolean
}

// Premium theme styles (when sacredtheme=false)
const premiumStyles = {
  icon: {
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))',
    color: 'rgb(34, 197, 94)',
  } as React.CSSProperties,

  iconHover: {
    transform: 'scale(1.05)',
    filter: 'drop-shadow(0 2px 4px rgba(34, 197, 94, 0.3))',
    color: 'rgb(21, 128, 61)',
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

const CreateNewFolderIcon: React.FC<CreateNewFolderIconProps> = ({
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
        <path d="M560-320h80v-80h80v-80h-80v-80h-80v80h-80v80h80v80ZM160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h240l80 80h320q33 0 56.5 23.5T880-640v400q0 33-23.5 56.5T800-160H160Zm0-80h640v-400H447l-80-80H160v480Zm0 0v-480 480Z" />
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

export default CreateNewFolderIcon
