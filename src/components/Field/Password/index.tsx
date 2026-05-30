'use client'
import React, { useState, useCallback, useRef, useEffect } from 'react'
import FieldShell, { type FieldStyleOverrides } from '../Shell'
import { useFieldBinding } from '../Shell/useFieldBinding'
import ShowHideEyeIcon from '../../Icons/ShowHideEye'

export interface PasswordFieldProps {
  label?: string
  placeholder?: string
  value?: string
  /**
   * Canonical value-shape onChange. Receives the raw input string —
   * consumers wire this directly into setState without unwrapping a
   * synthetic event.
   */
  onChange?: (value: string) => void
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
  helperText?: string
  /** Error message rendered below the input; sets aria-invalid. */
  error?: string | boolean
  id?: string
  /** Stable test selector — emitted as `data-field` on the wrapper. */
  dataField?: string
  /** Stable test selector — emitted as `data-field-name` on the wrapper. */
  dataFieldName?: string
  /** Forwarded to the input as `name` for native form submission. */
  name?: string
  /** Per-instance style overrides. */
  styles?: FieldStyleOverrides
}

const PasswordField: React.FC<PasswordFieldProps> = ({
  label = 'Password',
  placeholder,
  value: valueProp,
  onChange: onChangeProp,
  onFocus,
  onBlur,
  helperText,
  error,
  id,
  dataField,
  dataFieldName,
  name,
  styles,
}) => {
  // Tier-1 form binding. Inside a <Form> with a `name` and no explicit value,
  // the engine drives value/onChange; touched is marked via bindingOnBlur
  // (chained into handleBlur below). Outside a form / with an explicit value
  // this is a byte-for-byte pass-through. The destructured value/onChange
  // SHADOW the incoming props so downstream code is unchanged.
  const {
    value,
    onChange,
    onBlur: bindingOnBlur,
  } = useFieldBinding<string>({
    name,
    value: valueProp,
    onChange: onChangeProp,
    onBlur: undefined,
  })

  const [passwordVisible, setPasswordVisible] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Chain the engine touched-mark (no-op outside a <Form>) before the caller's
  // FocusEvent onBlur, which keeps its original signature unchanged.
  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      bindingOnBlur?.()
      onBlur?.(e)
    },
    [bindingOnBlur, onBlur]
  )

  const disabled = styles?.disabled || false
  const required = styles?.required || false

  // Listen for native 'input' events to support browser automation
  // tools that set `input.value` directly and dispatch a native input
  // event, bypassing React's synthetic event system.
  useEffect(() => {
    const el = inputRef.current
    if (!el) return

    const handleNativeInput = (e: Event) => {
      const target = e.target as HTMLInputElement
      if (target.value !== value) {
        onChange?.(target.value)
      }
    }

    el.addEventListener('input', handleNativeInput)
    return () => el.removeEventListener('input', handleNativeInput)
  }, [onChange, value])

  const togglePasswordVisibility = useCallback(
    () => setPasswordVisible(prev => !prev),
    []
  )

  // Inner-wrapper styling kept local so the eye-toggle button can be
  // absolutely positioned over the input. FieldShell handles the
  // outer label / helper region.
  const inputWrapperStyle: React.CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    height: styles?.height || '40px',
    width: '100%',
    margin: 0,
    padding: 0,
    boxSizing: 'border-box',
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
    outline: 'none',
    border: '1px solid var(--field-border-default, rgba(255,215,0,0.3))',
    borderRadius: styles?.borderRadius || '8px',
    padding: styles?.padding || '8px 48px 8px 16px',
    paddingLeft: styles?.paddingLeft || '16px',
    paddingRight: styles?.paddingRight || '48px',
    paddingTop: styles?.paddingTop || '8px',
    paddingBottom: styles?.paddingBottom || '8px',
    fontSize: styles?.fontSize || '16px',
    fontWeight: styles?.fontWeight,
    lineHeight: styles?.lineHeight,
    fontFamily: styles?.fontFamily,
    color: styles?.textColor || 'inherit',
    boxSizing: 'border-box',
    ...(disabled && { opacity: 0.5, cursor: 'not-allowed' }),
  }

  const eyeButtonStyle: React.CSSProperties = {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    cursor: 'pointer',
    background: 'transparent',
    border: 'none',
    outline: 'none',
    padding: 0,
    display: 'flex',
    alignItems: 'center',
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
      name={name}
      filled={Boolean(value && value.length > 0)}
      styles={styles}
    >
      {({ inputId, inputAriaProps }) => (
        <div style={inputWrapperStyle}>
          <input
            ref={inputRef}
            type={passwordVisible ? 'text' : 'password'}
            id={id ?? inputId}
            name={name}
            data-field-name={dataFieldName}
            value={value}
            onChange={e => onChange?.(e.target.value)}
            onFocus={onFocus}
            onBlur={handleBlur}
            disabled={disabled}
            required={required}
            placeholder={placeholder}
            style={inputStyle}
            {...inputAriaProps}
          />

          <button
            type="button"
            onClick={togglePasswordVisibility}
            style={eyeButtonStyle}
            disabled={disabled}
            aria-label={passwordVisible ? 'Hide password' : 'Show password'}
          >
            <ShowHideEyeIcon
              visible={passwordVisible}
              styles={{ theme: styles?.theme || 'sacred' }}
            />
          </button>
        </div>
      )}
    </FieldShell>
  )
}

export default PasswordField
