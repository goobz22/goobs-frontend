'use client'
import React, { useCallback, useState, useEffect, useRef } from 'react'
import cssStyles from './AccountNumber.module.css'
import FieldShell, { type FieldStyleOverrides } from '../../Shell'
import { useFieldBinding } from '../../Shell/useFieldBinding'

export interface AccountNumberProps {
  /**
   * Fires on every edit with the (possibly partial) account-number string.
   * Validation status now flows through `onValidityChange` so consumers
   * who don't care about validity can stay value-only.
   */
  onChange?: (value: string) => void
  /**
   * Optional side-channel for validity changes. Replaces the legacy
   * tuple-position `(value, isValid)` shape.
   */
  onValidityChange?: (isValid: boolean) => void
  minLength?: number
  maxLength?: number
  isDefaultValue?: boolean
  value?: string
  label?: React.ReactNode
  placeholder?: string
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
  styles?: FieldStyleOverrides
}

const AccountNumber: React.FC<AccountNumberProps> = ({
  onChange: onChangeProp,
  onValidityChange,
  value: valueProp,
  minLength = 8,
  maxLength = 17,
  isDefaultValue = false,
  label = 'Account Number',
  placeholder,
  id,
  name,
  onFocus,
  onBlur,
  helperText,
  error,
  dataField,
  dataFieldName,
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

  const [internalValue, setInternalValue] = useState<string>(value)
  // Tracks whether the input is focused so the masked default-value
  // display flips to the raw value while the user is editing it. Pure
  // display logic — not used for visual border state (CSS handles that
  // via :focus-visible inside FieldShell).
  const [isFocused, setIsFocused] = useState<boolean>(false)
  const [hasBeenEdited, setHasBeenEdited] = useState<boolean>(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const disabled = styles?.disabled || false
  const required = styles?.required || false

  const validateAccountNumber = useCallback(
    (accountNumber: string): boolean => {
      const trimmedValue = accountNumber.trim()
      if (trimmedValue === '') return true
      const normalizedValue = trimmedValue.replace(/-/g, '')
      const hasOnlyDigits = /^\d+$/.test(normalizedValue)
      const isValidLength =
        normalizedValue.length >= minLength &&
        normalizedValue.length <= maxLength
      return hasOnlyDigits && isValidLength
    },
    [minLength, maxLength]
  )

  const formatInput = useCallback(
    (input: string): string => input.replace(/[^\d-]/g, ''),
    []
  )

  const maskAccountNumber = useCallback((accountNumber: string): string => {
    if (!accountNumber || accountNumber.length < 4) return accountNumber
    const lastFour = accountNumber.slice(-4)
    return '*'.repeat(Math.max(0, accountNumber.length - 4)) + lastFour
  }, [])

  const getDisplayValue = useCallback(() => {
    if (isDefaultValue && !isFocused && !hasBeenEdited && internalValue)
      return maskAccountNumber(internalValue)
    return internalValue
  }, [
    isDefaultValue,
    isFocused,
    hasBeenEdited,
    internalValue,
    maskAccountNumber,
  ])

  useEffect(() => {
    setInternalValue(value)
  }, [value])

  // Listen for native 'input' events to support browser automation tools
  // (e.g. agent-browser's form_input) that set `input.value` directly
  // and dispatch a native `input` event, bypassing React's synthetic
  // event system. Without this listener the test-driven value gets
  // out of sync with React state.
  useEffect(() => {
    const el = inputRef.current
    if (!el) return

    const handleNativeInput = (e: Event) => {
      const target = e.target as HTMLInputElement
      const formattedValue = formatInput(target.value)
      if (formattedValue !== internalValue) {
        setInternalValue(formattedValue)
        setHasBeenEdited(true)
        const valid = validateAccountNumber(formattedValue)
        onChange?.(formattedValue)
        onValidityChange?.(valid)
      }
    }

    el.addEventListener('input', handleNativeInput)
    return () => el.removeEventListener('input', handleNativeInput)
  }, [
    onChange,
    onValidityChange,
    internalValue,
    validateAccountNumber,
    formatInput,
  ])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value
      const formattedValue = formatInput(rawValue)
      setInternalValue(formattedValue)
      setHasBeenEdited(true)
      const valid = validateAccountNumber(formattedValue)
      onChange?.(formattedValue)
      onValidityChange?.(valid)
    },
    [onChange, onValidityChange, validateAccountNumber, formatInput]
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

  const sacredTheme = styles?.theme === 'sacred'
  const finalPlaceholder = sacredTheme ? '1234567890' : placeholder

  // Input wrapper / adornment / input chrome lives in
  // AccountNumber.module.css. The theme/border/text colors fall back to the
  // FieldShell CSS variables.

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
        <div className={cssStyles.inputWrapper}>
          <div className={cssStyles.adornment}>
            <span>#</span>
          </div>
          <input
            ref={inputRef}
            type="text"
            id={id ?? inputId}
            name={name}
            value={getDisplayValue()}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={disabled}
            placeholder={finalPlaceholder}
            maxLength={maxLength + 5}
            data-field-name={dataFieldName}
            className={cssStyles.input}
            {...inputAriaProps}
          />
        </div>
      )}
    </FieldShell>
  )
}

AccountNumber.displayName = 'AccountNumber'

export default AccountNumber
