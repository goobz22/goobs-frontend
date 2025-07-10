// src/components/Checkbox/index.tsx

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

const CheckIcon = ({ sacredtheme = false }: { sacredtheme?: boolean }) => (
  <svg
    viewBox="0 0 16 16"
    fill="currentColor"
    style={{
      width: sacredtheme ? '18px' : '16px',
      height: sacredtheme ? '18px' : '16px',
      flexShrink: 0,
    }}
  >
    <path d="M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z" />
  </svg>
)

const IndeterminateIcon = ({
  sacredtheme = false,
}: {
  sacredtheme?: boolean
}) => (
  <svg
    viewBox="0 0 16 16"
    fill="currentColor"
    style={{
      width: sacredtheme ? '18px' : '16px',
      height: sacredtheme ? '18px' : '16px',
      flexShrink: 0,
    }}
  >
    <path d="M4 8a1 1 0 011-1h6a1 1 0 110 2H5a1 1 0 01-1-1z" />
  </svg>
)

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  sacredtheme?: boolean
  outline?: boolean
  indeterminate?: boolean
}

// Premium theme styles (when sacredtheme=false)
const premiumStyles = {
  wrapper: {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  } as React.CSSProperties,

  wrapperDisabled: {
    cursor: 'not-allowed',
  } as React.CSSProperties,

  container: {
    position: 'relative',
    width: '24px',
    height: '24px',
    flexShrink: 0,
  } as React.CSSProperties,

  input: {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    opacity: 0,
    cursor: 'pointer',
    margin: 0,
    padding: 0,
    zIndex: 3,
  } as React.CSSProperties,

  inputDisabled: {
    cursor: 'not-allowed',
  } as React.CSSProperties,

  box: {
    pointerEvents: 'none',
    width: '100%',
    height: '100%',
    border: '2px solid rgb(59, 130, 246)',
    borderRadius: '4px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    backgroundColor: 'rgba(249, 250, 251, 0.9)',
    backdropFilter: 'blur(4px)',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
    position: 'absolute',
    top: '0',
    left: '0',
    zIndex: 1,
  } as React.CSSProperties,

  boxNoOutline: {
    border: 'none',
    boxShadow: 'none',
    backgroundColor: 'rgba(249, 250, 251, 0.6)',
  } as React.CSSProperties,

  boxHover: {
    backgroundColor: 'rgba(239, 246, 255, 0.8)',
    borderColor: 'rgb(37, 99, 235)',
    transform: 'scale(1.05)',
    boxShadow:
      '0 4px 12px rgba(59, 130, 246, 0.2), 0 2px 6px rgba(59, 130, 246, 0.1)',
  } as React.CSSProperties,

  boxChecked: {
    backgroundColor: 'rgb(59, 130, 246)',
    borderColor: 'transparent',
    boxShadow:
      '0 4px 12px rgba(59, 130, 246, 0.3), 0 2px 6px rgba(59, 130, 246, 0.2)',
  } as React.CSSProperties,

  boxIndeterminate: {
    backgroundColor: 'rgb(59, 130, 246)',
    borderColor: 'transparent',
    boxShadow:
      '0 4px 12px rgba(59, 130, 246, 0.3), 0 2px 6px rgba(59, 130, 246, 0.2)',
  } as React.CSSProperties,

  boxDisabled: {
    backgroundColor: 'rgba(249, 250, 251, 0.5)',
    borderColor: 'rgb(156, 163, 175)',
    transform: 'none',
    boxShadow: 'none',
  } as React.CSSProperties,

  icon: {
    pointerEvents: 'none',
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    color: 'white',
    opacity: 0,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    transform: 'scale(0.8)',
    zIndex: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: '3px',
    paddingLeft: '3px',
  } as React.CSSProperties,

  iconVisible: {
    opacity: 1,
    transform: 'scale(1)',
  } as React.CSSProperties,

  iconDisabled: {
    color: 'rgb(156, 163, 175)',
  } as React.CSSProperties,

  iconNoOutline: {
    paddingTop: '1px',
    paddingLeft: '1px',
  } as React.CSSProperties,

  accent: {
    position: 'absolute',
    left: '-2px',
    top: '-2px',
    right: '-2px',
    bottom: '-2px',
    borderRadius: '6px',
    background: 'linear-gradient(45deg, rgb(59, 130, 246), rgb(147, 197, 253))',
    opacity: 0,
    transition: 'opacity 0.3s ease',
    zIndex: -1,
  } as React.CSSProperties,

  accentVisible: {
    opacity: 0.3,
  } as React.CSSProperties,
}

// Sacred theme styles (when sacredtheme=true)
const sacredStyles = {
  wrapper: {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.4s ease',
  } as React.CSSProperties,

  wrapperDisabled: {
    cursor: 'not-allowed',
  } as React.CSSProperties,

  container: {
    position: 'relative',
    width: '28px',
    height: '28px',
    flexShrink: 0,
  } as React.CSSProperties,

  input: {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    opacity: 0,
    cursor: 'pointer',
    margin: 0,
    padding: 0,
    zIndex: 3,
  } as React.CSSProperties,

  inputDisabled: {
    cursor: 'not-allowed',
  } as React.CSSProperties,

  box: {
    pointerEvents: 'none',
    width: '100%',
    height: '100%',
    border: '2px solid rgba(255, 215, 0, 0.4)',
    borderRadius: '6px',
    transition: 'all 0.4s ease',
    backgroundColor: 'rgba(10, 10, 10, 0.9)',
    backdropFilter: 'blur(8px)',
    boxShadow:
      '0 0 20px rgba(255, 215, 0, 0.2), 0 0 40px rgba(255, 215, 0, 0.1)',
    backgroundImage: `
      radial-gradient(circle at center, rgba(255, 215, 0, 0.05) 0%, transparent 50%)
    `,
    position: 'absolute',
    top: '0',
    left: '0',
    zIndex: 1,
  } as React.CSSProperties,

  boxNoOutline: {
    border: 'none',
    boxShadow: 'none',
  } as React.CSSProperties,

  boxHover: {
    borderColor: 'rgba(255, 215, 0, 0.8)',
    transform: 'scale(1.1)',
    boxShadow:
      '0 0 30px rgba(255, 215, 0, 0.4), 0 0 60px rgba(255, 215, 0, 0.2)',
    backgroundImage: `
      radial-gradient(circle at center, rgba(255, 215, 0, 0.1) 0%, transparent 50%)
    `,
  } as React.CSSProperties,

  boxChecked: {
    backgroundColor: 'rgba(10, 10, 10, 0.9)',
    borderColor: '#FFD700',
    boxShadow:
      '0 0 40px rgba(255, 215, 0, 0.6), 0 0 80px rgba(255, 215, 0, 0.3)',
    backgroundImage: `
      linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(10, 10, 10, 0.9) 50%, rgba(255, 215, 0, 0.1) 100%),
      radial-gradient(circle at center, rgba(255, 215, 0, 0.15) 0%, transparent 50%)
    `,
  } as React.CSSProperties,

  boxIndeterminate: {
    backgroundColor: 'rgba(10, 10, 10, 0.9)',
    borderColor: '#FFD700',
    boxShadow:
      '0 0 40px rgba(255, 215, 0, 0.6), 0 0 80px rgba(255, 215, 0, 0.3)',
    backgroundImage: `
      linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(10, 10, 10, 0.9) 50%, rgba(255, 215, 0, 0.1) 100%),
      radial-gradient(circle at center, rgba(255, 215, 0, 0.15) 0%, transparent 50%)
    `,
  } as React.CSSProperties,

  boxDisabled: {
    backgroundColor: 'rgba(10, 10, 10, 0.6)',
    borderColor: 'rgba(255, 215, 0, 0.2)',
    transform: 'none',
    boxShadow: 'none',
  } as React.CSSProperties,

  icon: {
    pointerEvents: 'none',
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    color: '#FFD700',
    opacity: 0,
    transition: 'all 0.4s ease',
    transform: 'scale(0.8) rotate(-10deg)',
    filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.6))',
    zIndex: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: '3px',
    paddingLeft: '3px',
  } as React.CSSProperties,

  iconVisible: {
    opacity: 1,
    transform: 'scale(1) rotate(0deg)',
    filter: 'drop-shadow(0 0 12px rgba(255, 215, 0, 0.8))',
  } as React.CSSProperties,

  iconDisabled: {
    color: 'rgba(255, 215, 0, 0.3)',
    filter: 'none',
  } as React.CSSProperties,

  iconNoOutline: {
    paddingTop: '1px',
    paddingLeft: '1px',
  } as React.CSSProperties,

  glyph: {
    position: 'absolute',
    fontSize: '12px',
    color: 'rgba(255, 215, 0, 0.3)',
    transition: 'all 0.3s ease',
    pointerEvents: 'none',
  } as React.CSSProperties,

  glyphLeft: {
    left: '-24px',
    top: '50%',
    transform: 'translateY(-50%)',
  } as React.CSSProperties,

  glyphRight: {
    right: '-24px',
    top: '50%',
    transform: 'translateY(-50%)',
  } as React.CSSProperties,

  glyphVisible: {
    opacity: 0.6,
  } as React.CSSProperties,

  glyphFloating: {
    animation: 'sacredFloat 3s ease-in-out infinite',
  } as React.CSSProperties,

  glyphDelayedFloating: {
    animation: 'sacredFloat 3s ease-in-out infinite 1.5s',
  } as React.CSSProperties,
}

const DataGridCheckbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    { sacredtheme = false, outline = true, indeterminate, disabled, ...props },
    ref
  ) => {
    const id = React.useId()
    const internalRef = React.useRef<HTMLInputElement>(null)
    const [isHovered, setIsHovered] = useState(false)

    React.useImperativeHandle(ref, () => internalRef.current!)

    React.useEffect(() => {
      if (internalRef.current) {
        internalRef.current.indeterminate = indeterminate || false
      }
    }, [indeterminate])

    // CSS keyframes for sacred animations
    useEffect(() => {
      if (sacredtheme) {
        const styleSheet = document.styleSheets[0]
        const keyframes = `
          @keyframes sacredFloat {
            0%, 100% { transform: translateY(-50%) translateX(0px); opacity: 0.3; }
            50% { transform: translateY(-50%) translateX(2px); opacity: 0.6; }
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
    const isChecked = props.checked
    const isIndeterminate = indeterminate && !isChecked

    const wrapperStyle = {
      ...styles.wrapper,
      ...(disabled && styles.wrapperDisabled),
    }

    const inputStyle = {
      ...styles.input,
      ...(disabled && styles.inputDisabled),
    }

    const boxStyle = {
      ...styles.box,
      ...(!outline && styles.boxNoOutline),
      ...(isHovered && !disabled && styles.boxHover),
      ...(isChecked && styles.boxChecked),
      ...(isIndeterminate && styles.boxIndeterminate),
      ...(disabled && styles.boxDisabled),
    }

    const iconStyle = {
      ...styles.icon,
      ...(!outline && styles.iconNoOutline),
      ...((isChecked || isIndeterminate) && styles.iconVisible),
      ...(disabled && styles.iconDisabled),
    }

    return (
      <label
        htmlFor={id}
        style={wrapperStyle}
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
                ...sacredStyles.glyphFloating,
              }}
            >
              {SACRED_GLYPHS[11]}
            </span>
            <span
              style={{
                ...sacredStyles.glyph,
                ...sacredStyles.glyphRight,
                ...(isHovered && sacredStyles.glyphVisible),
                ...sacredStyles.glyphDelayedFloating,
              }}
            >
              {SACRED_GLYPHS[15]}
            </span>
          </>
        )}

        {/* Premium theme accent */}
        {!sacredtheme && outline && (isChecked || isIndeterminate) && (
          <div
            style={{
              ...premiumStyles.accent,
              ...premiumStyles.accentVisible,
            }}
          />
        )}

        <div style={styles.container}>
          <input
            type="checkbox"
            id={id}
            ref={internalRef}
            style={inputStyle}
            aria-checked={indeterminate ? 'mixed' : undefined}
            disabled={disabled}
            {...props}
          />
          <div style={boxStyle}></div>
          <div style={iconStyle}>
            {indeterminate ? (
              <IndeterminateIcon sacredtheme={sacredtheme} />
            ) : (
              <CheckIcon sacredtheme={sacredtheme} />
            )}
          </div>
        </div>
      </label>
    )
  }
)

DataGridCheckbox.displayName = 'DataGridCheckbox'

export default DataGridCheckbox
