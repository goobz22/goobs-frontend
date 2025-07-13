'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { SwitchStyles, getSwitchStyles, SACRED_GLYPHS } from '../../theme'

// --------------------------------------------------------------------------
// PROPS INTERFACE
// --------------------------------------------------------------------------

export interface SwitchProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Label text to display on the left side of the switch */
  leftLabel?: string
  /** Label text to display on the right side of the switch */
  rightLabel?: string
  /** Comprehensive styling options including theme, custom colors, and layout properties */
  styles?: SwitchStyles
}

// --------------------------------------------------------------------------
// MAIN SWITCH COMPONENT
// --------------------------------------------------------------------------

const Switch: React.FC<SwitchProps> = ({
  disabled,
  checked,
  styles,
  onChange,
  leftLabel,
  rightLabel,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const isSacredTheme = styles?.theme === 'sacred'

  const computedStyles = useMemo(
    () => getSwitchStyles(styles, isFocused, isHovered, checked, disabled),
    [styles, isFocused, isHovered, checked, disabled]
  )

  // CSS keyframes for sacred animations
  useEffect(() => {
    if (isSacredTheme) {
      const styleSheet = document.styleSheets[0]
      const keyframes = `
        @keyframes sacredSwitchFloat {
          0%, 100% { transform: translateY(-50%) scale(1); opacity: 0.3; }
          50% { transform: translateY(-50%) scale(1.1); opacity: 0.6; }
        }
        @keyframes sacredSwitchShimmer {
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
  }, [isSacredTheme])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(event)
    }
  }

  const getThumbContent = () => {
    if (isSacredTheme) {
      return checked ? '𓊹' : '𓊨'
    }
    return checked ? '✓' : ''
  }

  return (
    <label
      style={computedStyles.container}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Sacred glyphs */}
      {isSacredTheme && (
        <>
          <span
            style={{
              ...computedStyles.glyph,
              ...computedStyles.glyphLeft,
            }}
          >
            {SACRED_GLYPHS[9]}
          </span>
          <span
            style={{
              ...computedStyles.glyph,
              ...computedStyles.glyphRight,
            }}
          >
            {SACRED_GLYPHS[16]}
          </span>
        </>
      )}

      {leftLabel && <span style={computedStyles.leftLabel}>{leftLabel}</span>}

      <div style={computedStyles.track}>
        <input
          type="checkbox"
          style={computedStyles.input}
          checked={checked}
          disabled={disabled}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {/* Sacred shimmer effect */}
        {isSacredTheme && checked && isHovered && (
          <div style={computedStyles.shimmer} />
        )}

        <div style={computedStyles.thumb}>{getThumbContent()}</div>
      </div>

      {rightLabel && (
        <span style={computedStyles.rightLabel}>{rightLabel}</span>
      )}
    </label>
  )
}

Switch.displayName = 'Switch'

export default Switch
