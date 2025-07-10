'use client'

import React, { useState, useEffect } from 'react'
import CloseIcon from '../Icons/Close'

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

interface ChipProps {
  label: string
  onDelete?: () => void
  sacredtheme?: boolean
  outline?: boolean
  disabled?: boolean
}

// Premium theme styles (when sacredtheme=false)
const premiumStyles = {
  chip: {
    display: 'flex',
    alignItems: 'center',
    height: '28px',
    paddingLeft: '12px',
    paddingRight: '12px',
    borderRadius: '16px',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'default',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    color: 'rgb(59, 130, 246)',
    border: '1px solid rgba(59, 130, 246, 0.2)',
    backdropFilter: 'blur(4px)',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    fontFamily: 'Inter, system-ui, sans-serif',
  } as React.CSSProperties,

  chipNoOutline: {
    border: 'none',
    boxShadow: 'none',
    backgroundColor: 'rgba(59, 130, 246, 0.08)',
  } as React.CSSProperties,

  chipHover: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    borderColor: 'rgba(59, 130, 246, 0.3)',
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)',
  } as React.CSSProperties,

  chipDisabled: {
    backgroundColor: 'rgba(156, 163, 175, 0.1)',
    color: 'rgb(156, 163, 175)',
    borderColor: 'rgba(156, 163, 175, 0.2)',
    cursor: 'not-allowed',
    transform: 'none',
    boxShadow: 'none',
  } as React.CSSProperties,

  closeButton: {
    marginLeft: '6px',
    marginRight: '-4px',
    padding: '2px',
    borderRadius: '50%',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    color: 'rgba(59, 130, 246, 0.7)',
  } as React.CSSProperties,

  closeButtonHover: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    color: 'rgb(59, 130, 246)',
    transform: 'scale(1.1)',
  } as React.CSSProperties,

  closeButtonDisabled: {
    color: 'rgba(156, 163, 175, 0.5)',
    cursor: 'not-allowed',
  } as React.CSSProperties,
}

// Sacred theme styles (when sacredtheme=true)
const sacredStyles = {
  chip: {
    display: 'flex',
    alignItems: 'center',
    height: '32px',
    paddingLeft: '16px',
    paddingRight: '16px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.4s ease',
    cursor: 'default',
    backgroundColor: 'rgba(10, 10, 10, 0.9)',
    color: '#FFD700',
    border: '1px solid rgba(255, 215, 0, 0.3)',
    backdropFilter: 'blur(8px)',
    boxShadow:
      '0 0 20px rgba(255, 215, 0, 0.2), 0 0 40px rgba(255, 215, 0, 0.1)',
    fontFamily: 'Cinzel, serif',
    backgroundImage: `
      radial-gradient(circle at center, rgba(255, 215, 0, 0.05) 0%, transparent 50%)
    `,
    position: 'relative',
    overflow: 'hidden',
  } as React.CSSProperties,

  chipNoOutline: {
    border: 'none',
    boxShadow: 'none',
  } as React.CSSProperties,

  chipHover: {
    backgroundColor: 'rgba(10, 10, 10, 0.95)',
    borderColor: 'rgba(255, 215, 0, 0.6)',
    transform: 'translateY(-2px) scale(1.02)',
    boxShadow:
      '0 0 30px rgba(255, 215, 0, 0.4), 0 0 60px rgba(255, 215, 0, 0.2)',
    backgroundImage: `
      radial-gradient(circle at center, rgba(255, 215, 0, 0.1) 0%, transparent 50%)
    `,
  } as React.CSSProperties,

  chipDisabled: {
    backgroundColor: 'rgba(10, 10, 10, 0.6)',
    color: 'rgba(255, 215, 0, 0.3)',
    borderColor: 'rgba(255, 215, 0, 0.1)',
    cursor: 'not-allowed',
    transform: 'none',
    boxShadow: 'none',
  } as React.CSSProperties,

  closeButton: {
    marginLeft: '8px',
    marginRight: '-4px',
    padding: '3px',
    borderRadius: '50%',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    color: 'rgba(255, 215, 0, 0.7)',
    position: 'relative',
    zIndex: 1,
  } as React.CSSProperties,

  closeButtonHover: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    color: '#FFD700',
    transform: 'scale(1.15) rotate(90deg)',
    boxShadow: '0 0 12px rgba(255, 215, 0, 0.3)',
  } as React.CSSProperties,

  closeButtonDisabled: {
    color: 'rgba(255, 215, 0, 0.2)',
    cursor: 'not-allowed',
  } as React.CSSProperties,

  glyph: {
    position: 'absolute',
    fontSize: '10px',
    color: 'rgba(255, 215, 0, 0.2)',
    transition: 'all 0.3s ease',
    pointerEvents: 'none',
    zIndex: 0,
  } as React.CSSProperties,

  glyphLeft: {
    left: '2px',
    top: '50%',
    transform: 'translateY(-50%)',
  } as React.CSSProperties,

  glyphRight: {
    right: '2px',
    top: '50%',
    transform: 'translateY(-50%)',
  } as React.CSSProperties,

  glyphVisible: {
    opacity: 0.4,
  } as React.CSSProperties,

  glyphFloating: {
    animation: 'sacredFloat 2s ease-in-out infinite',
  } as React.CSSProperties,

  glyphDelayedFloating: {
    animation: 'sacredFloat 2s ease-in-out infinite 1s',
  } as React.CSSProperties,

  shimmer: {
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background:
      'linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.2), transparent)',
    animation: 'sacredShimmer 3s ease-in-out infinite',
  } as React.CSSProperties,
}

const Chip: React.FC<ChipProps> = ({
  label,
  onDelete,
  sacredtheme = false,
  outline = true,
  disabled = false,
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isCloseHovered, setIsCloseHovered] = useState(false)

  // CSS keyframes for sacred animations
  useEffect(() => {
    if (sacredtheme) {
      const styleSheet = document.styleSheets[0]
      const keyframes = `
        @keyframes sacredFloat {
          0%, 100% { transform: translateY(-50%) translateX(0px); opacity: 0.2; }
          50% { transform: translateY(-50%) translateX(1px); opacity: 0.4; }
        }
        @keyframes sacredShimmer {
          0% { left: '-100%'; }
          50% { left: '100%'; }
          100% { left: '100%'; }
        }
      `
      try {
        styleSheet.insertRule(keyframes, styleSheet.cssRules.length)
      } catch {
        // Keyframes might already exist
      }
    }
  }, [sacredtheme])

  const styles = sacredtheme ? sacredStyles : premiumStyles

  const chipStyle = {
    ...styles.chip,
    ...(!outline && styles.chipNoOutline),
    ...(isHovered && !disabled && styles.chipHover),
    ...(disabled && styles.chipDisabled),
  }

  const closeButtonStyle = {
    ...styles.closeButton,
    ...(isCloseHovered && !disabled && styles.closeButtonHover),
    ...(disabled && styles.closeButtonDisabled),
  }

  return (
    <div
      style={chipStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Sacred theme effects */}
      {sacredtheme && (
        <>
          <span
            style={{
              ...sacredStyles.glyph,
              ...sacredStyles.glyphLeft,
              ...(isHovered && sacredStyles.glyphVisible),
              ...sacredStyles.glyphFloating,
            }}
          >
            {SACRED_GLYPHS[7]}
          </span>
          <span
            style={{
              ...sacredStyles.glyph,
              ...sacredStyles.glyphRight,
              ...(isHovered && sacredStyles.glyphVisible),
              ...sacredStyles.glyphDelayedFloating,
            }}
          >
            {SACRED_GLYPHS[13]}
          </span>
          {isHovered && <div style={sacredStyles.shimmer} />}
        </>
      )}

      <span style={{ position: 'relative', zIndex: 1 }}>{label}</span>

      {onDelete && (
        <button
          onClick={disabled ? undefined : onDelete}
          style={closeButtonStyle}
          onMouseEnter={() => setIsCloseHovered(true)}
          onMouseLeave={() => setIsCloseHovered(false)}
          disabled={disabled}
          aria-label="Remove chip"
        >
          <CloseIcon style={{ width: '16px', height: '16px' }} />
        </button>
      )}
    </div>
  )
}

export default Chip
