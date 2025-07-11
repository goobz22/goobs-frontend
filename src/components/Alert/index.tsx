/**
 * @fileoverview Defines the Alert component for displaying important messages.
 * It supports multiple severity levels and two distinct themes: "premium" and "sacred".
 */
'use client'

import React, { useState } from 'react'
import InfoIcon from '../Icons/Info'
import CheckCircleIcon from '../Icons/CheckCircle'
import ErrorIcon from '../Icons/Error'
import WarningIcon from '../Icons/Warning'

// --------------------------------------------------------------------------
// PROPS INTERFACE
// --------------------------------------------------------------------------

export interface AlertProps {
  /** The severity of the alert, which determines the icon and color scheme. */
  severity: 'error' | 'warning' | 'info' | 'success'
  /** The message to be displayed in the alert. */
  message: string
  /** Callback fired when the alert is closed. If not provided, the close button will not be shown. */
  onClose?: () => void
  /** If true, enables the stylized "sacred" theme. */
  sacredtheme?: boolean
  /** If true, displays an outline style. */
  outline?: boolean
  /** Additional CSS classes for custom styling. */
  className?: string
}

// --------------------------------------------------------------------------
// STYLING (to be migrated to Tailwind variants)
// --------------------------------------------------------------------------

const premiumStyles: Record<string, React.CSSProperties> = {
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
  },
  containerNoOutline: {
    border: 'none',
    boxShadow: 'none',
  },
  containerHover: {
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.08)',
  },
  error: {
    backgroundColor: 'rgba(254, 242, 242, 0.9)',
    borderColor: 'rgba(248, 113, 113, 0.4)',
    color: 'rgb(153, 27, 27)',
  },
  warning: {
    backgroundColor: 'rgba(255, 251, 235, 0.9)',
    borderColor: 'rgba(251, 191, 36, 0.4)',
    color: 'rgb(146, 64, 14)',
  },
  info: {
    backgroundColor: 'rgba(239, 246, 255, 0.9)',
    borderColor: 'rgba(96, 165, 250, 0.4)',
    color: 'rgb(30, 64, 175)',
  },
  success: {
    backgroundColor: 'rgba(240, 253, 244, 0.9)',
    borderColor: 'rgba(74, 222, 128, 0.4)',
    color: 'rgb(21, 128, 61)',
  },
  icon: {
    width: '20px',
    height: '20px',
    flexShrink: 0,
    transition: 'all 0.3s ease',
  },
  iconHover: {
    transform: 'scale(1.1)',
  },
  message: {
    flex: 1,
    fontWeight: 500,
  },
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
  },
  closeButtonHover: {
    background: 'rgba(0, 0, 0, 0.2)',
    transform: 'scale(1.1)',
  },
  accent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '4px',
    transition: 'all 0.3s ease',
  },
}

const sacredStyles: Record<string, React.CSSProperties> = {
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
  },
  containerNoOutline: {
    border: 'none',
    boxShadow: 'none',
  },
  containerHover: {
    transform: 'translateY(-2px)',
    borderColor: 'rgba(255, 215, 0, 0.6)',
    boxShadow:
      '0 0 30px rgba(255, 215, 0, 0.3), 0 0 60px rgba(255, 215, 0, 0.15)',
  },
  error: {
    color: 'rgba(255, 120, 120, 0.9)',
    textShadow: '0 0 10px rgba(255, 120, 120, 0.5)',
  },
  warning: {
    color: 'rgba(255, 215, 0, 0.9)',
    textShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
  },
  info: {
    color: 'rgba(120, 200, 255, 0.9)',
    textShadow: '0 0 10px rgba(120, 200, 255, 0.5)',
  },
  success: {
    color: 'rgba(120, 255, 150, 0.9)',
    textShadow: '0 0 10px rgba(120, 255, 150, 0.5)',
  },
  icon: {
    width: '24px',
    height: '24px',
    flexShrink: 0,
    transition: 'all 0.3s ease',
    filter: 'drop-shadow(0 0 6px currentColor)',
  },
  iconHover: {
    transform: 'scale(1.2) rotate(5deg)',
    filter: 'drop-shadow(0 0 12px currentColor)',
  },
  message: {
    flex: 1,
    fontWeight: 600,
    letterSpacing: '0.02em',
  },
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
  },
  closeButtonHover: {
    background: 'rgba(255, 215, 0, 0.2)',
    borderColor: 'rgba(255, 215, 0, 0.6)',
    transform: 'scale(1.1)',
    boxShadow: '0 0 12px rgba(255, 215, 0, 0.4)',
  },
  glyph: {
    position: 'absolute',
    fontSize: '12px',
    opacity: 0.2,
    color: '#FFD700',
    pointerEvents: 'none',
  },
  glyphTopRight: {
    top: '8px',
    right: '8px',
  },
  glyphBottomLeft: {
    bottom: '8px',
    left: '8px',
  },
}

// --------------------------------------------------------------------------
// THEME RENDERERS
// --------------------------------------------------------------------------

const PremiumAlert: React.FC<Omit<AlertProps, 'sacred'>> = ({
  severity,
  message,
  onClose,
  outline = true,
  className,
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isClosing, setIsClosing] = useState(false)

  const handleClose = () => {
    console.log('Closing premium alert.')
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

const SacredAlert: React.FC<Omit<AlertProps, 'sacred'>> = ({
  severity,
  message,
  onClose,
  outline = true,
  className,
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isClosing, setIsClosing] = useState(false)

  const handleClose = () => {
    console.log('Closing sacred alert.')
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

// --------------------------------------------------------------------------
// MAIN ALERT COMPONENT
// --------------------------------------------------------------------------

/**
 * A component for displaying important messages with different severity levels and themes.
 */
const Alert: React.FC<AlertProps> = props => {
  console.log('Alert rendered with props:', props)

  if (props.sacredtheme) {
    return <SacredAlert {...props} />
  }

  return <PremiumAlert {...props} />
}

export default Alert
