/**
 * @fileoverview Defines the Alert component for displaying important messages.
 * It supports multiple severity levels and light, dark, and sacred themes.
 */
'use client'

import React, { useState, useMemo, useCallback } from 'react'
import InfoIcon from '../Icons/Info'
import CheckCircleIcon from '../Icons/CheckCircle'
import ErrorIcon from '../Icons/Error'
import WarningIcon from '../Icons/Warning'
import { getAlertStyles, SACRED_GLYPHS, type AlertStyles } from '../../theme'

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
  /** Comprehensive styling options including theme, custom colors, and layout properties. */
  styles?: AlertStyles
}

// --------------------------------------------------------------------------
// SACRED THEME COMPONENTS
// --------------------------------------------------------------------------

const SacredGlyphs: React.FC<{
  severity: 'error' | 'warning' | 'info' | 'success'
}> = ({ severity }) => {
  const glyphIndex = { error: 0, warning: 1, info: 2, success: 3 }[severity]

  const glyphStyles = useMemo(
    () => ({
      glyph: {
        position: 'absolute' as const,
        fontSize: '12px',
        opacity: 0.2,
        color: '#FFD700',
        pointerEvents: 'none' as const,
      },
      glyphTopRight: {
        top: '8px',
        right: '8px',
      },
      glyphBottomLeft: {
        bottom: '8px',
        left: '8px',
      },
    }),
    []
  )

  return (
    <>
      <div style={{ ...glyphStyles.glyph, ...glyphStyles.glyphTopRight }}>
        {SACRED_GLYPHS[glyphIndex]}
      </div>
      <div style={{ ...glyphStyles.glyph, ...glyphStyles.glyphBottomLeft }}>
        {SACRED_GLYPHS[(glyphIndex + 2) % 4]}
      </div>
    </>
  )
}

// --------------------------------------------------------------------------
// MAIN ALERT COMPONENT
// --------------------------------------------------------------------------

/**
 * A component for displaying important messages with different severity levels and themes.
 */
const Alert: React.FC<AlertProps> = ({
  severity,
  message,
  onClose,
  styles,
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isClosing, setIsClosing] = useState(false)

  const computedStyles = useMemo(
    () => getAlertStyles(styles, severity, isHovered, isClosing),
    [styles, severity, isHovered, isClosing]
  )

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
  }, [])

  const handleClose = useCallback(() => {
    setIsClosing(true)
    setTimeout(() => {
      onClose?.()
    }, 200)
  }, [onClose])

  const Icon = useMemo(() => {
    return {
      error: ErrorIcon,
      warning: WarningIcon,
      info: InfoIcon,
      success: CheckCircleIcon,
    }[severity]
  }, [severity])

  const isSacredTheme = styles?.theme === 'sacred'

  return (
    <div
      style={computedStyles.container}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="alert"
    >
      {isSacredTheme && <SacredGlyphs severity={severity} />}

      <Icon
        styles={{ theme: styles?.theme || 'sacred' }}
        style={computedStyles.icon}
      />

      <div style={computedStyles.message}>{message}</div>

      {onClose && (
        <button onClick={handleClose} style={computedStyles.closeButton}>
          ✕
        </button>
      )}
    </div>
  )
}

export default Alert
