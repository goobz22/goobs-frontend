'use client'
import React, { useState, useCallback, useRef, useEffect } from 'react'
import cssStyles from './Password.module.css'
import FieldShell, { type FieldStyleOverrides } from '../Shell'
import { useFieldBinding } from '../Shell/useFieldBinding'
import ShowHideEyeIcon from '../../Icons/ShowHideEye'

export interface PasswordFieldProps {
  /** Field label (default 'Password'). */
  label?: string
  placeholder?: string
  /** Controlled value. Omit inside a `<Form>` with `name` to let the engine drive it. */
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

/**
 * Password input built on FieldShell with a show/hide eye toggle overlaid on
 * the input. `onChange` emits the plain string value — not a DOM event.
 * Auto-binds its value by `name` inside a goobs `<Form>` when no explicit
 * `value` is passed; otherwise it is a controlled input.
 */
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

  // Inner frame lives in Password.module.css so the eye-toggle button can be
  // absolutely positioned over the input. FieldShell handles the outer label
  // / helper region; the border falls back to FieldShell's CSS variables.
  // Caller-supplied layout overrides (height/radius/padding/font/color) are
  // forwarded as CSS custom properties, and the disabled chrome is driven by
  // the native :disabled pseudo-class.
  const wrapperCssVars: Record<string, string> = {}
  if (styles?.height) wrapperCssVars['--password-height'] = styles.height
  if (styles?.borderRadius) {
    wrapperCssVars['--password-radius'] = styles.borderRadius
  }
  if (styles?.padding) wrapperCssVars['--password-padding'] = styles.padding
  if (styles?.paddingLeft) {
    wrapperCssVars['--password-padding-left'] = styles.paddingLeft
  }
  if (styles?.paddingRight) {
    wrapperCssVars['--password-padding-right'] = styles.paddingRight
  }
  if (styles?.paddingTop) {
    wrapperCssVars['--password-padding-top'] = styles.paddingTop
  }
  if (styles?.paddingBottom) {
    wrapperCssVars['--password-padding-bottom'] = styles.paddingBottom
  }
  if (styles?.fontSize) wrapperCssVars['--password-font-size'] = styles.fontSize
  if (styles?.fontWeight !== undefined) {
    wrapperCssVars['--password-font-weight'] = String(styles.fontWeight)
  }
  if (styles?.lineHeight) {
    wrapperCssVars['--password-line-height'] = styles.lineHeight
  }
  if (styles?.fontFamily) {
    wrapperCssVars['--password-font-family'] = styles.fontFamily
  }
  if (styles?.textColor) {
    wrapperCssVars['--password-text-color'] = styles.textColor
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
        <div
          className={cssStyles.inputWrapper}
          style={wrapperCssVars as React.CSSProperties}
        >
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
            className={cssStyles.input}
            {...inputAriaProps}
          />

          <button
            type="button"
            onClick={togglePasswordVisibility}
            className={cssStyles.eyeButton}
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
