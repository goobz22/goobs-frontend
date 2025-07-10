'use client'

import React, { useState } from 'react'
import InfoIcon from '../Icons/Info'
import CheckCircleIcon from '../Icons/CheckCircle'
import ErrorIcon from '../Icons/Error'
import WarningIcon from '../Icons/Warning'

export interface AlertProps {
  severity: 'error' | 'warning' | 'info' | 'success'
  message: string
  onClose?: () => void
  className?: string
  sacredtheme?: boolean
  outline?: boolean
}

// Premium theme styles (when sacredtheme=false)
const premiumStyles = {
  container: {
    padding: '20px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    backdropFilter: 'blur(8px)',
    border: '1px solid',
    fontFamily: '"Inter", sans-serif',
    fontSize: '15px',
    lineHeight: 1.5,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08), 0 1px 4px rgba(0, 0, 0, 0.04)',
  } as React.CSSProperties,

  containerNoOutline: {
    border: 'none',
    boxShadow: 'none',
  } as React.CSSProperties,

  containerHover: {
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.08)',
  } as React.CSSProperties,

  // Premium severity styles
  error: {
    backgroundColor: 'rgba(254, 242, 242, 0.9)',
    borderColor: 'rgba(248, 113, 113, 0.4)',
    color: 'rgb(153, 27, 27)',
  } as React.CSSProperties,

  warning: {
    backgroundColor: 'rgba(255, 251, 235, 0.9)',
    borderColor: 'rgba(251, 191, 36, 0.4)',
    color: 'rgb(146, 64, 14)',
  } as React.CSSProperties,

  info: {
    backgroundColor: 'rgba(239, 246, 255, 0.9)',
    borderColor: 'rgba(96, 165, 250, 0.4)',
    color: 'rgb(30, 64, 175)',
  } as React.CSSProperties,

  success: {
    backgroundColor: 'rgba(240, 253, 244, 0.9)',
    borderColor: 'rgba(74, 222, 128, 0.4)',
    color: 'rgb(21, 128, 61)',
  } as React.CSSProperties,

  icon: {
    width: '20px',
    height: '20px',
    flexShrink: 0,
    transition: 'all 0.3s ease',
  } as React.CSSProperties,

  iconHover: {
    transform: 'scale(1.1)',
  } as React.CSSProperties,

  message: {
    flex: 1,
    fontWeight: 500,
  } as React.CSSProperties,

  closeButton: {
    width: '24px',
    height: '24px',
    borderRadius: '6px',
    border: 'none',
    background: 'rgba(0, 0, 0, 0.1)',
    color: 'currentColor',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    transition: 'all 0.2s ease',
    flexShrink: 0,
  } as React.CSSProperties,

  closeButtonHover: {
    background: 'rgba(0, 0, 0, 0.2)',
    transform: 'scale(1.1)',
  } as React.CSSProperties,

  accent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '4px',
    transition: 'all 0.3s ease',
  } as React.CSSProperties,
}

// Sacred theme styles (when sacredtheme=true)
const sacredStyles = {
  container: {
    padding: '24px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.4s ease',
    backgroundColor: 'rgba(10, 10, 10, 0.9)',
    border: '2px solid rgba(255, 215, 0, 0.4)',
    fontFamily: '"Cinzel", serif',
    fontSize: '16px',
    lineHeight: 1.6,
    boxShadow:
      '0 0 20px rgba(255, 215, 0, 0.2), 0 0 40px rgba(255, 215, 0, 0.1)',
    backdropFilter: 'blur(8px)',
    backgroundImage: `
      radial-gradient(circle at top right, rgba(255, 215, 0, 0.03) 0%, transparent 50%),
      radial-gradient(circle at bottom left, rgba(255, 215, 0, 0.02) 0%, transparent 50%)
    `,
  } as React.CSSProperties,

  containerNoOutline: {
    border: 'none',
    boxShadow: 'none',
  } as React.CSSProperties,

  containerHover: {
    transform: 'translateY(-2px)',
    borderColor: 'rgba(255, 215, 0, 0.6)',
    boxShadow:
      '0 0 30px rgba(255, 215, 0, 0.3), 0 0 60px rgba(255, 215, 0, 0.15)',
  } as React.CSSProperties,

  // Sacred severity styles - all use gold variations
  error: {
    color: 'rgba(255, 120, 120, 0.9)',
    textShadow: '0 0 10px rgba(255, 120, 120, 0.5)',
  } as React.CSSProperties,

  warning: {
    color: 'rgba(255, 215, 0, 0.9)',
    textShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
  } as React.CSSProperties,

  info: {
    color: 'rgba(120, 200, 255, 0.9)',
    textShadow: '0 0 10px rgba(120, 200, 255, 0.5)',
  } as React.CSSProperties,

  success: {
    color: 'rgba(120, 255, 150, 0.9)',
    textShadow: '0 0 10px rgba(120, 255, 150, 0.5)',
  } as React.CSSProperties,

  icon: {
    width: '24px',
    height: '24px',
    flexShrink: 0,
    transition: 'all 0.3s ease',
    filter: 'drop-shadow(0 0 6px currentColor)',
  } as React.CSSProperties,

  iconHover: {
    transform: 'scale(1.2) rotate(5deg)',
    filter: 'drop-shadow(0 0 12px currentColor)',
  } as React.CSSProperties,

  message: {
    flex: 1,
    fontWeight: 600,
    letterSpacing: '0.02em',
  } as React.CSSProperties,

  closeButton: {
    width: '28px',
    height: '28px',
    borderRadius: '8px',
    border: '1px solid rgba(255, 215, 0, 0.3)',
    background: 'rgba(255, 215, 0, 0.1)',
    color: '#FFD700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    transition: 'all 0.3s ease',
    flexShrink: 0,
    fontFamily: '"Cinzel", serif',
    textShadow: '0 0 6px rgba(255, 215, 0, 0.5)',
  } as React.CSSProperties,

  closeButtonHover: {
    background: 'rgba(255, 215, 0, 0.2)',
    borderColor: 'rgba(255, 215, 0, 0.6)',
    transform: 'scale(1.1)',
    boxShadow: '0 0 12px rgba(255, 215, 0, 0.4)',
  } as React.CSSProperties,

  glyph: {
    position: 'absolute',
    fontSize: '12px',
    opacity: 0.2,
    color: '#FFD700',
    pointerEvents: 'none',
  } as React.CSSProperties,

  glyphTopRight: {
    top: '8px',
    right: '8px',
  } as React.CSSProperties,

  glyphBottomLeft: {
    bottom: '8px',
    left: '8px',
  } as React.CSSProperties,
}

const Alert: React.FC<AlertProps> = ({
  severity,
  message,
  onClose,
  className,
  sacredtheme = false,
  outline = true,
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isClosing, setIsClosing] = useState(false)

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      onClose?.()
    }, 200)
  }

  const Icon = {
    error: ErrorIcon,
    warning: WarningIcon,
    info: InfoIcon,
    success: CheckCircleIcon,
  }[severity]

  const sacredGlyphs = ['𓁟', '𓂀', '𓃀', '𓄿']
  const glyphIndex = { error: 0, warning: 1, info: 2, success: 3 }[severity]

  if (sacredtheme) {
    const containerStyle = {
      ...sacredStyles.container,
      ...(!outline && sacredStyles.containerNoOutline),
      ...(isHovered && sacredStyles.containerHover),
      ...(isClosing && { opacity: 0, transform: 'scale(0.95)' }),
      ...sacredStyles[severity],
    }

    const iconStyle = {
      ...sacredStyles.icon,
      ...(isHovered && sacredStyles.iconHover),
    }

    const closeButtonStyle = {
      ...sacredStyles.closeButton,
      ...(isHovered && sacredStyles.closeButtonHover),
    }

    return (
      <div
        className={className}
        style={containerStyle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        role="alert"
      >
        {/* Sacred glyphs */}
        <div style={{ ...sacredStyles.glyph, ...sacredStyles.glyphTopRight }}>
          {sacredGlyphs[glyphIndex]}
        </div>
        <div style={{ ...sacredStyles.glyph, ...sacredStyles.glyphBottomLeft }}>
          {sacredGlyphs[(glyphIndex + 2) % 4]}
        </div>

        <Icon style={iconStyle} />
        <div style={sacredStyles.message}>{message}</div>
        {onClose && (
          <button onClick={handleClose} style={closeButtonStyle}>
            ✕
          </button>
        )}
      </div>
    )
  }

  // Premium theme
  const containerStyle = {
    ...premiumStyles.container,
    ...(!outline && premiumStyles.containerNoOutline),
    ...(isHovered && premiumStyles.containerHover),
    ...(isClosing && { opacity: 0, transform: 'scale(0.98)' }),
    ...premiumStyles[severity],
  }

  const iconStyle = {
    ...premiumStyles.icon,
    ...(isHovered && premiumStyles.iconHover),
  }

  const closeButtonStyle = {
    ...premiumStyles.closeButton,
    ...(isHovered && premiumStyles.closeButtonHover),
  }

  const accentColors = {
    error: 'rgb(248, 113, 113)',
    warning: 'rgb(251, 191, 36)',
    info: 'rgb(96, 165, 250)',
    success: 'rgb(74, 222, 128)',
  }

  return (
    <div
      className={className}
      style={containerStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="alert"
    >
      {/* Colored accent bar */}
      {outline && (
        <div
          style={{
            ...premiumStyles.accent,
            backgroundColor: accentColors[severity],
          }}
        />
      )}

      <Icon style={iconStyle} />
      <div style={premiumStyles.message}>{message}</div>
      {onClose && (
        <button onClick={handleClose} style={closeButtonStyle}>
          ✕
        </button>
      )}
    </div>
  )
}

export default Alert
