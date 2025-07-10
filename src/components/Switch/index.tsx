'use client'

import React, { useState, useEffect } from 'react'

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

interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  sacredtheme?: boolean
  outline?: boolean
  label?: string
}

// Premium theme styles (when sacredtheme=false)
const premiumStyles = {
  container: {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    cursor: 'pointer',
    gap: '8px',
  } as React.CSSProperties,

  containerDisabled: {
    cursor: 'not-allowed',
    opacity: 0.6,
  } as React.CSSProperties,

  track: {
    position: 'relative',
    width: '48px',
    height: '24px',
    backgroundColor: 'rgba(156, 163, 175, 0.3)',
    borderRadius: '12px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    border: '1px solid rgba(156, 163, 175, 0.2)',
    backdropFilter: 'blur(4px)',
    overflow: 'hidden',
  } as React.CSSProperties,

  trackNoOutline: {
    border: 'none',
  } as React.CSSProperties,

  trackChecked: {
    backgroundColor: 'rgb(59, 130, 246)',
    borderColor: 'transparent',
    boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)',
  } as React.CSSProperties,

  trackFocused: {
    boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.2)',
  } as React.CSSProperties,

  trackDisabled: {
    backgroundColor: 'rgba(156, 163, 175, 0.2)',
    borderColor: 'rgba(156, 163, 175, 0.1)',
  } as React.CSSProperties,

  thumb: {
    position: 'absolute',
    top: '2px',
    left: '2px',
    width: '20px',
    height: '20px',
    backgroundColor: 'white',
    borderRadius: '50%',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '10px',
  } as React.CSSProperties,

  thumbChecked: {
    transform: 'translateX(24px)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
  } as React.CSSProperties,

  thumbDisabled: {
    backgroundColor: 'rgba(249, 250, 251, 0.8)',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
  } as React.CSSProperties,

  input: {
    position: 'absolute',
    opacity: 0,
    width: '100%',
    height: '100%',
    margin: 0,
    cursor: 'pointer',
  } as React.CSSProperties,

  inputDisabled: {
    cursor: 'not-allowed',
  } as React.CSSProperties,

  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: 'rgb(55, 65, 81)',
    fontFamily: 'Inter, system-ui, sans-serif',
    userSelect: 'none',
  } as React.CSSProperties,

  labelDisabled: {
    color: 'rgb(156, 163, 175)',
  } as React.CSSProperties,
}

// Sacred theme styles (when sacredtheme=true)
const sacredStyles = {
  container: {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    cursor: 'pointer',
    gap: '12px',
  } as React.CSSProperties,

  containerDisabled: {
    cursor: 'not-allowed',
    opacity: 0.6,
  } as React.CSSProperties,

  track: {
    position: 'relative',
    width: '56px',
    height: '28px',
    backgroundColor: 'rgba(10, 10, 10, 0.9)',
    borderRadius: '14px',
    transition: 'all 0.4s ease',
    border: '2px solid rgba(255, 215, 0, 0.3)',
    backdropFilter: 'blur(8px)',
    overflow: 'hidden',
    backgroundImage: `
      radial-gradient(circle at 25% 50%, rgba(255, 215, 0, 0.05) 0%, transparent 50%),
      radial-gradient(circle at 75% 50%, rgba(255, 215, 0, 0.05) 0%, transparent 50%)
    `,
  } as React.CSSProperties,

  trackNoOutline: {
    border: 'none',
    boxShadow: 'none',
  } as React.CSSProperties,

  trackChecked: {
    backgroundColor: 'rgba(10, 10, 10, 0.9)',
    borderColor: '#FFD700',
    boxShadow:
      '0 0 30px rgba(255, 215, 0, 0.6), 0 0 60px rgba(255, 215, 0, 0.3)',
    backgroundImage: `
      radial-gradient(circle at 25% 50%, rgba(255, 215, 0, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 75% 50%, rgba(255, 215, 0, 0.1) 0%, transparent 50%)
    `,
  } as React.CSSProperties,

  trackFocused: {
    boxShadow: '0 0 0 4px rgba(255, 215, 0, 0.3)',
  } as React.CSSProperties,

  trackDisabled: {
    backgroundColor: 'rgba(10, 10, 10, 0.6)',
    borderColor: 'rgba(255, 215, 0, 0.1)',
    boxShadow: 'none',
  } as React.CSSProperties,

  thumb: {
    position: 'absolute',
    top: '2px',
    left: '2px',
    width: '24px',
    height: '24px',
    backgroundColor: 'rgba(10, 10, 10, 0.9)',
    borderRadius: '50%',
    transition: 'all 0.4s ease',
    border: '1px solid rgba(255, 215, 0, 0.4)',
    boxShadow: '0 0 15px rgba(255, 215, 0, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    color: '#FFD700',
    backgroundImage: `
      radial-gradient(circle at center, rgba(255, 215, 0, 0.1) 0%, transparent 70%)
    `,
  } as React.CSSProperties,

  thumbChecked: {
    transform: 'translateX(28px)',
    borderColor: '#FFD700',
    boxShadow:
      '0 0 25px rgba(255, 215, 0, 0.6), 0 0 50px rgba(255, 215, 0, 0.3)',
    backgroundImage: `
      radial-gradient(circle at center, rgba(255, 215, 0, 0.2) 0%, transparent 70%)
    `,
  } as React.CSSProperties,

  thumbDisabled: {
    backgroundColor: 'rgba(10, 10, 10, 0.6)',
    borderColor: 'rgba(255, 215, 0, 0.2)',
    boxShadow: 'none',
    color: 'rgba(255, 215, 0, 0.3)',
  } as React.CSSProperties,

  input: {
    position: 'absolute',
    opacity: 0,
    width: '100%',
    height: '100%',
    margin: 0,
    cursor: 'pointer',
  } as React.CSSProperties,

  inputDisabled: {
    cursor: 'not-allowed',
  } as React.CSSProperties,

  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#FFD700',
    fontFamily: 'Cinzel, serif',
    userSelect: 'none',
  } as React.CSSProperties,

  labelDisabled: {
    color: 'rgba(255, 215, 0, 0.4)',
  } as React.CSSProperties,

  glyph: {
    position: 'absolute',
    fontSize: '8px',
    color: 'rgba(255, 215, 0, 0.3)',
    transition: 'all 0.3s ease',
    pointerEvents: 'none',
    animation: 'sacredSwitchFloat 3s ease-in-out infinite',
  } as React.CSSProperties,

  glyphLeft: {
    left: '-16px',
    top: '50%',
    transform: 'translateY(-50%)',
  } as React.CSSProperties,

  glyphRight: {
    right: '-16px',
    top: '50%',
    transform: 'translateY(-50%)',
  } as React.CSSProperties,

  glyphVisible: {
    opacity: 0.6,
  } as React.CSSProperties,

  shimmer: {
    position: 'absolute',
    top: '0',
    left: '-100%',
    width: '100%',
    height: '100%',
    background:
      'linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.2), transparent)',
    animation: 'sacredSwitchShimmer 2s ease-in-out infinite',
    borderRadius: 'inherit',
  } as React.CSSProperties,
}

const Switch: React.FC<SwitchProps> = ({
  sacredtheme = false,
  outline = true,
  label,
  disabled,
  checked,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  // CSS keyframes for sacred animations
  useEffect(() => {
    if (sacredtheme) {
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
  }, [sacredtheme])

  const styles = sacredtheme ? sacredStyles : premiumStyles

  const containerStyle = {
    ...styles.container,
    ...(disabled && styles.containerDisabled),
  }

  const trackStyle = {
    ...styles.track,
    ...(!outline && styles.trackNoOutline),
    ...(checked && styles.trackChecked),
    ...(isFocused && styles.trackFocused),
    ...(disabled && styles.trackDisabled),
  }

  const thumbStyle = {
    ...styles.thumb,
    ...(checked && styles.thumbChecked),
    ...(disabled && styles.thumbDisabled),
  }

  const inputStyle = {
    ...styles.input,
    ...(disabled && styles.inputDisabled),
  }

  const labelStyle = {
    ...styles.label,
    ...(disabled && styles.labelDisabled),
  }

  return (
    <label
      style={containerStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Sacred glyphs */}
      {sacredtheme && (
        <>
          <span
            style={{
              ...sacredStyles.glyph,
              ...sacredStyles.glyphLeft,
              ...(isHovered && sacredStyles.glyphVisible),
            }}
          >
            {SACRED_GLYPHS[9]}
          </span>
          <span
            style={{
              ...sacredStyles.glyph,
              ...sacredStyles.glyphRight,
              ...(isHovered && sacredStyles.glyphVisible),
            }}
          >
            {SACRED_GLYPHS[16]}
          </span>
        </>
      )}

      <div style={trackStyle}>
        <input
          type="checkbox"
          style={inputStyle}
          checked={checked}
          disabled={disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {/* Sacred shimmer effect */}
        {sacredtheme && checked && isHovered && (
          <div style={sacredStyles.shimmer} />
        )}

        <div style={thumbStyle}>
          {sacredtheme ? (checked ? '𓊹' : '𓊨') : checked ? '✓' : ''}
        </div>
      </div>

      {label && <span style={labelStyle}>{label}</span>}
    </label>
  )
}

export default Switch
