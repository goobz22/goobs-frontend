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

interface FavoriteIconComponentProps {
  sacredtheme?: boolean
  style?: React.CSSProperties
}

// Premium theme styles (when sacredtheme=false)
const premiumStyles = {
  container: {
    position: 'relative',
    display: 'inline-block',
    padding: '4px',
    borderRadius: '50%',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    backgroundColor: 'transparent',
    cursor: 'pointer',
  } as React.CSSProperties,

  containerHover: {
    backgroundColor: 'rgba(243, 244, 246, 0.5)',
  } as React.CSSProperties,

  iconFilled: {
    width: '24px',
    height: '24px',
    color: 'rgb(239, 68, 68)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))',
  } as React.CSSProperties,

  iconOutline: {
    width: '24px',
    height: '24px',
    color: 'rgb(75, 85, 99)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))',
  } as React.CSSProperties,

  iconHover: {
    transform: 'scale(1.05)',
    filter: 'drop-shadow(0 2px 4px rgba(239, 68, 68, 0.3))',
  } as React.CSSProperties,

  iconOutlineHover: {
    transform: 'scale(1.05)',
    filter: 'drop-shadow(0 2px 4px rgba(75, 85, 99, 0.3))',
    color: 'rgb(55, 65, 81)',
  } as React.CSSProperties,
}

// Sacred theme styles (when sacredtheme=true)
const sacredStyles = {
  container: {
    position: 'relative',
    display: 'inline-block',
    padding: '4px',
    borderRadius: '50%',
    transition: 'all 0.4s ease',
    backgroundColor: 'transparent',
    cursor: 'pointer',
  } as React.CSSProperties,

  containerHover: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
  } as React.CSSProperties,

  iconFilled: {
    width: '24px',
    height: '24px',
    color: '#FFD700',
    transition: 'all 0.4s ease',
    filter: 'drop-shadow(0 0 6px rgba(255, 215, 0, 0.5))',
    animation: 'heartbeat 1.5s ease-in-out infinite',
  } as React.CSSProperties,

  iconOutline: {
    width: '24px',
    height: '24px',
    color: 'rgba(255, 215, 0, 0.7)',
    transition: 'all 0.4s ease',
    filter: 'drop-shadow(0 0 6px rgba(255, 215, 0, 0.5))',
  } as React.CSSProperties,

  iconHover: {
    transform: 'scale(1.1) rotate(5deg)',
    filter: 'drop-shadow(0 0 12px rgba(255, 215, 0, 0.8))',
    color: '#FFD700',
  } as React.CSSProperties,

  iconOutlineHover: {
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

const FavoriteIconComponent: React.FC<FavoriteIconComponentProps> = ({
  sacredtheme = false,
  style = {},
}) => {
  const [isFavorite, setIsFavorite] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [glyph] = useState(
    SACRED_GLYPHS[Math.floor(Math.random() * SACRED_GLYPHS.length)]
  )

  // CSS keyframes for sacred animations
  useEffect(() => {
    if (sacredtheme) {
      const styleSheet = document.styleSheets[0]
      const keyframes = `
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
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

  const handleFavoriteClick = () => {
    setIsFavorite(!isFavorite)
  }

  const styles = sacredtheme ? sacredStyles : premiumStyles

  const containerStyle = {
    ...styles.container,
    ...(isHovered &&
      (sacredtheme ? styles.containerHover : premiumStyles.containerHover)),
    ...style,
  }

  const iconStyle = isFavorite
    ? {
        ...styles.iconFilled,
        ...(isHovered && styles.iconHover),
      }
    : {
        ...styles.iconOutline,
        ...(isHovered &&
          (sacredtheme
            ? styles.iconOutlineHover
            : premiumStyles.iconOutlineHover)),
      }

  return (
    <div
      onClick={handleFavoriteClick}
      style={containerStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isFavorite ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24"
          viewBox="0 -960 960 960"
          width="24"
          fill="currentColor"
          style={iconStyle}
        >
          <path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Z" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24"
          viewBox="0 -960 960 960"
          width="24"
          fill="currentColor"
          style={iconStyle}
        >
          <path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z" />
        </svg>
      )}
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

export default FavoriteIconComponent
