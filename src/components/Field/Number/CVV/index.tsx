'use client'
import React, { useCallback, useState, useRef, useEffect } from 'react'
import cssStyles from './CVV.module.css'
import FieldShell, { type FieldStyleOverrides } from '../../Shell'
import { useFieldBinding } from '../../Shell/useFieldBinding'

export interface CVVProps {
  /** Fires on every edit with the digits-only CVV string. */
  onChange?: (value: string) => void
  /** Optional side-channel for validity changes. */
  onValidityChange?: (isValid: boolean) => void
  /** Minimum digit count for validity (default 3). */
  minLength?: number
  /** Maximum digit count for validity (default 4); also caps the input length. */
  maxLength?: number
  /** Marks the value as prefilled: it renders fully masked (*'s) until the field is focused or edited. */
  isDefaultValue?: boolean
  /** Controlled value. Omit inside a `<Form>` with `name` to let the engine drive it. */
  value?: string
  /** Field label (default 'CVV'). */
  label?: React.ReactNode
  /** Placeholder text (default '123'). */
  placeholder?: string
  /**
   * Programmatic accessible name applied when no visible label renders.
   * Forwarded to FieldShell, which sets it as the input's `aria-label` ONLY
   * when `label` is absent (WCAG 2.5.3 Label in Name); ignored when a visible
   * label is set.
   */
  ariaLabel?: string
  id?: string
  /** Forwarded to the input as `name` for native form submission. */
  name?: string
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
  helperText?: string
  /** Error message rendered below the input; sets aria-invalid. */
  error?: string | boolean
  /** Stable test selector — emitted as `data-field` on the wrapper. */
  dataField?: string
  /** Stable test selector — emitted as `data-field-name` on the wrapper. */
  dataFieldName?: string
  /** Disables the input. Takes precedence over `styles.disabled`. */
  disabled?: boolean
  styles?: FieldStyleOverrides
}

/**
 * Card security-code input built on FieldShell. Input is digits-only and
 * capped at `maxLength`; `onChange` emits the plain string — not a DOM event —
 * and `onValidityChange` reports the digits/length check. With
 * `isDefaultValue`, a prefilled code renders fully masked until focused or
 * edited. Auto-binds by `name` inside a goobs `<Form>` when no explicit
 * `value` is passed.
 */
const CVV: React.FC<CVVProps> = ({
  onChange: onChangeProp,
  onValidityChange,
  value: valueProp,
  minLength = 3,
  maxLength = 4,
  isDefaultValue = false,
  label = 'CVV',
  placeholder = '123',
  ariaLabel,
  id,
  name,
  onFocus,
  onBlur,
  helperText,
  error,
  dataField,
  dataFieldName,
  disabled: disabledProp,
  styles,
}) => {
  // Tier-1 form binding: inside a <Form> with a `name` and no explicit
  // `value`, value/onChange come from the form engine and `markTouched`
  // marks the field touched on blur. Outside a form (or with an explicit
  // value) this is a byte-for-byte pass-through of the caller's props.
  // The component contract keeps a string `value`, so the bound value is
  // coalesced to '' exactly as the old `value = ''` param default did.
  const {
    value: boundValue,
    onChange,
    onBlur: markTouched,
  } = useFieldBinding<string>({
    name,
    value: valueProp,
    onChange: onChangeProp,
  })
  const value = boundValue ?? ''

  const [internalValue, setInternalValue] = useState<string>(value || '')
  // Tracks focus for the masked default-value display flip only.
  const [isFocused, setIsFocused] = useState<boolean>(false)
  const [hasBeenEdited, setHasBeenEdited] = useState<boolean>(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const disabled = disabledProp ?? styles?.disabled ?? false
  const required = styles?.required || false

  const validateCVV = useCallback(
    (cvv: string): boolean => {
      const trimmedValue = cvv.trim()
      if (trimmedValue === '') return true
      const hasOnlyDigits = /^\d+$/.test(trimmedValue)
      const isValidLength =
        trimmedValue.length >= minLength && trimmedValue.length <= maxLength
      return hasOnlyDigits && isValidLength
    },
    [minLength, maxLength]
  )

  const formatInput = useCallback(
    (input: string): string => input.replace(/\D/g, ''),
    []
  )
  const maskCVV = useCallback(
    (cvv: string): string => (!cvv ? cvv : '*'.repeat(cvv.length)),
    []
  )

  const getDisplayValue = useCallback(
    () =>
      isDefaultValue && !isFocused && !hasBeenEdited && internalValue
        ? maskCVV(internalValue)
        : internalValue,
    [isDefaultValue, isFocused, hasBeenEdited, internalValue, maskCVV]
  )

  // Track previous value prop for derived state pattern
  const [prevValue, setPrevValue] = useState(value)
  if (value !== prevValue) {
    setPrevValue(value)
    setInternalValue(value || '')
  }

  // Listen for native 'input' events to support browser automation tools
  useEffect(() => {
    const el = inputRef.current
    if (!el) return

    const handleNativeInput = (e: Event) => {
      const target = e.target as HTMLInputElement
      const formattedValue = formatInput(target.value)
      const truncatedValue = formattedValue.slice(0, maxLength)
      if (truncatedValue !== internalValue) {
        setInternalValue(truncatedValue)
        setHasBeenEdited(true)
        const valid = validateCVV(truncatedValue)
        onChange?.(truncatedValue)
        onValidityChange?.(valid)
      }
    }

    el.addEventListener('input', handleNativeInput)
    return () => el.removeEventListener('input', handleNativeInput)
  }, [
    onChange,
    onValidityChange,
    internalValue,
    validateCVV,
    formatInput,
    maxLength,
  ])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value
      const formattedValue = formatInput(rawValue)
      const truncatedValue = formattedValue.slice(0, maxLength)
      setInternalValue(truncatedValue)
      setHasBeenEdited(true)
      const valid = validateCVV(truncatedValue)
      onChange?.(truncatedValue)
      onValidityChange?.(valid)
    },
    [onChange, onValidityChange, validateCVV, formatInput, maxLength]
  )

  const handleFocus = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true)
      onFocus?.(e)
    },
    [onFocus]
  )
  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false)
      markTouched?.()
      onBlur?.(e)
    },
    [markTouched, onBlur]
  )

  // Input wrapper / adornment / input chrome lives in CVV.module.css
  // (same shape as AccountNumber). Colors fall back to FieldShell vars.

  return (
    <FieldShell
      id={id}
      ariaLabel={ariaLabel}
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
        <div className={cssStyles.inputWrapper}>
          <div className={cssStyles.adornment} aria-hidden="true">
            <span>🔒</span>
          </div>
          <input
            ref={inputRef}
            type="password"
            inputMode="numeric"
            id={inputId}
            name={name}
            value={getDisplayValue()}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={disabled}
            placeholder={placeholder}
            maxLength={maxLength}
            autoComplete="cc-csc"
            data-field-name={dataFieldName}
            className={cssStyles.input}
            {...inputAriaProps}
          />
        </div>
      )}
    </FieldShell>
  )
}

CVV.displayName = 'CVV'
export default CVV
