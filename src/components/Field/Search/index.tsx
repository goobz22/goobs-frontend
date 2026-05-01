'use client'

import React, { useRef, useEffect } from 'react'
import { alpha } from '../../../utils'
import FieldShell, { type FieldStyleOverrides } from '../Shell'

const SACRED_GOLD = '#FFD700'

export interface SearchbarProps {
  label?: string
  placeholder?: string
  value: string
  /**
   * Canonical value-shape onChange. Receives the raw input string —
   * consumers wire this directly into setState without unwrapping a
   * synthetic event.
   */
  onChange: (value: string) => void
  helperText?: string
  /** Error message rendered below the input; sets aria-invalid. */
  error?: string | boolean
  className?: string
  /** Stable test selector — emitted as `data-field` on the wrapper. */
  dataField?: string
  /** Stable test selector — emitted as `data-field-name` on the wrapper. */
  dataFieldName?: string
  styles?: FieldStyleOverrides & {
    // Search-specific overrides that don't fit the FieldShell
    // CSS-variable contract (color-of-icon, padding-of-inner-input,
    // etc.). Forwarded as inline styles on the inner input wrapper /
    // input itself rather than the shell wrapper.
    color?: string
    adornmentColor?: string
  }
}

const Searchbar: React.FC<SearchbarProps> = ({
  label,
  placeholder = 'Search...',
  value,
  onChange,
  helperText,
  error,
  dataField,
  dataFieldName,
  styles,
}) => {
  const inputRef = useRef<HTMLInputElement>(null)

  // Listen for native 'input' events to support browser automation
  // tools that set `input.value` directly and dispatch a native input
  // event, bypassing React's synthetic event system.
  useEffect(() => {
    const el = inputRef.current
    if (!el) return

    const handleNativeInput = (e: Event) => {
      const target = e.target as HTMLInputElement
      if (target.value !== value) {
        onChange(target.value)
      }
    }

    el.addEventListener('input', handleNativeInput)
    return () => el.removeEventListener('input', handleNativeInput)
  }, [onChange, value])

  const disabled = styles?.disabled || false
  const required = styles?.required || false

  // Inner-wrapper visual styling (icon + input border) is local to
  // Searchbar — FieldShell handles the outer wrapper, label, and
  // helper region. We still keep the gold-bordered look here so
  // existing consumers don't see a visual diff.
  const inputWrapperStyle: React.CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    height: styles?.height || '40px',
    width: '100%',
    backgroundColor: disabled ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.6)',
    border: `${styles?.borderWidth || '1px'} solid ${alpha(SACRED_GOLD, 0.3)}`,
    borderRadius: styles?.borderRadius || '8px',
    transition: 'all 0.3s ease',
    boxSizing: 'border-box',
  }

  const searchIconStyle: React.CSSProperties = {
    position: 'absolute',
    left: '16px',
    display: 'flex',
    alignItems: 'center',
    color: styles?.adornmentColor || SACRED_GOLD,
    pointerEvents: 'none',
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
    outline: 'none',
    border: 'none',
    paddingLeft: styles?.paddingLeft || '48px',
    paddingRight: styles?.paddingRight || '16px',
    paddingTop: styles?.paddingTop || '8px',
    paddingBottom: styles?.paddingBottom || '8px',
    fontSize: styles?.fontSize || '16px',
    fontWeight: styles?.fontWeight,
    lineHeight: styles?.lineHeight,
    fontFamily: styles?.fontFamily || '"Crimson Text", serif',
    color:
      styles?.textColor ||
      styles?.color ||
      (disabled ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.9)'),
    boxSizing: 'border-box',
  }

  return (
    <FieldShell
      label={label}
      helperText={helperText}
      error={error}
      disabled={disabled}
      required={required}
      dataField={dataField}
      dataFieldName={dataFieldName}
      styles={styles}
    >
      {({ inputId, inputAriaProps }) => (
        <div style={inputWrapperStyle}>
          <div style={searchIconStyle}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20"
              viewBox="0 0 24 24"
              width="20"
              fill={styles?.adornmentColor || SACRED_GOLD}
            >
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
          </div>

          <input
            ref={inputRef}
            id={inputId}
            data-field-name={dataFieldName}
            type="text"
            value={value}
            onChange={e => onChange(e.target.value)}
            disabled={disabled}
            required={required}
            placeholder={placeholder}
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            style={inputStyle}
            {...inputAriaProps}
          />
        </div>
      )}
    </FieldShell>
  )
}

Searchbar.displayName = 'Searchbar'

export default Searchbar
