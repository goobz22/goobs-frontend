'use client'
import React, { useCallback, useState, useEffect, useRef } from 'react'
import cssStyles from './RoutingNumber.module.css'
import FieldShell, { type FieldStyleOverrides } from '../../Shell'
import { useFieldBinding } from '../../Shell/useFieldBinding'

export interface RoutingNumberProps {
  /** Fires on every edit with the digits-only routing-number string. */
  onChange?: (value: string) => void
  /** Optional side-channel for validity changes (ABA checksum + length). */
  onValidityChange?: (isValid: boolean) => void
  /** Validates the ABA checksum in addition to the 9-digit length (default true). */
  useChecksum?: boolean
  /** Marks the value as prefilled: it renders masked until the field is focused or edited. */
  isDefaultValue?: boolean
  /** Controlled value. Omit inside a `<Form>` with `name` to let the engine drive it. */
  value?: string
  /** Field label (default 'Routing Number'). */
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

/**
 * ABA routing-number input built on FieldShell (9 digits). `onChange` emits
 * the digits-only string — not a DOM event — and `onValidityChange` reports
 * the 9-digit length plus, when `useChecksum` is on, the ABA checksum. With
 * `isDefaultValue`, a prefilled number renders masked until focused or
 * edited. Auto-binds by `name` inside a goobs `<Form>` when no explicit
 * `value` is passed.
 */
const RoutingNumber: React.FC<RoutingNumberProps> = ({
  onChange: onChangeProp,
  onValidityChange,
  value: valueProp,
  useChecksum = true,
  isDefaultValue = false,
  label = 'Routing Number',
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
  // Tracks focus for the masked default-value display flip only.
  const [isFocused, setIsFocused] = useState<boolean>(false)
  const [hasBeenEdited, setHasBeenEdited] = useState<boolean>(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const disabled = styles?.disabled || false
  const required = styles?.required || false

  const validateRoutingChecksum = useCallback(
    (routingNumber: string): boolean => {
      if (routingNumber.length !== 9) return false
      const d0 = parseInt(routingNumber.charAt(0), 10)
      const d1 = parseInt(routingNumber.charAt(1), 10)
      const d2 = parseInt(routingNumber.charAt(2), 10)
      const d3 = parseInt(routingNumber.charAt(3), 10)
      const d4 = parseInt(routingNumber.charAt(4), 10)
      const d5 = parseInt(routingNumber.charAt(5), 10)
      const d6 = parseInt(routingNumber.charAt(6), 10)
      const d7 = parseInt(routingNumber.charAt(7), 10)
      const d8 = parseInt(routingNumber.charAt(8), 10)
      const sum = 3 * (d0 + d3 + d6) + 7 * (d1 + d4 + d7) + (d2 + d5 + d8)
      return sum % 10 === 0
    },
    []
  )

  const validateRoutingNumber = useCallback(
    (routingNumber: string): boolean => {
      const trimmedValue = routingNumber.trim()
      if (trimmedValue === '') return true
      if (trimmedValue.length !== 9) return false
      const hasOnlyDigits = /^\d+$/.test(trimmedValue)
      return (
        hasOnlyDigits && (!useChecksum || validateRoutingChecksum(trimmedValue))
      )
    },
    [useChecksum, validateRoutingChecksum]
  )

  const formatInput = useCallback(
    (input: string): string => input.replace(/\D/g, ''),
    []
  )
  const maskRoutingNumber = useCallback((routingNumber: string): string => {
    if (!routingNumber || routingNumber.length !== 9) return routingNumber
    return `${routingNumber.slice(0, 4)}****${routingNumber.slice(-1)}`
  }, [])

  const getDisplayValue = useCallback(
    () =>
      isDefaultValue && !isFocused && !hasBeenEdited && internalValue
        ? maskRoutingNumber(internalValue)
        : internalValue,
    [isDefaultValue, isFocused, hasBeenEdited, internalValue, maskRoutingNumber]
  )

  useEffect(() => {
    setInternalValue(value)
  }, [value])

  // Listen for native 'input' events to support browser automation tools
  useEffect(() => {
    const el = inputRef.current
    if (!el) return

    const handleNativeInput = (e: Event) => {
      const target = e.target as HTMLInputElement
      const formattedValue = formatInput(target.value).slice(0, 9)
      if (formattedValue !== internalValue) {
        setInternalValue(formattedValue)
        setHasBeenEdited(true)
        const valid = validateRoutingNumber(formattedValue)
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
    validateRoutingNumber,
    formatInput,
  ])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value
      const formattedValue = formatInput(rawValue).slice(0, 9)
      setInternalValue(formattedValue)
      setHasBeenEdited(true)
      const valid = validateRoutingNumber(formattedValue)
      onChange?.(formattedValue)
      onValidityChange?.(valid)
    },
    [onChange, onValidityChange, validateRoutingNumber, formatInput]
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
  const finalPlaceholder = sacredTheme ? '021000021' : placeholder

  // Input wrapper / adornment / input chrome lives in
  // RoutingNumber.module.css (same shape as AccountNumber). Colors fall
  // back to FieldShell vars.

  return (
    <FieldShell
      id={id}
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
            {sacredTheme && <span>⚡</span>}
          </div>
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            id={inputId}
            name={name}
            value={getDisplayValue()}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={disabled}
            placeholder={finalPlaceholder}
            maxLength={9}
            data-field-name={dataFieldName}
            className={cssStyles.input}
            {...inputAriaProps}
          />
        </div>
      )}
    </FieldShell>
  )
}

RoutingNumber.displayName = 'RoutingNumber'

export default RoutingNumber
