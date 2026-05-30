'use client'
import React, { useCallback, useState, useRef, useEffect } from 'react'
import FieldShell, { type FieldStyleOverrides } from '../../Shell'
import { useFieldBinding } from '../../Shell/useFieldBinding'

export type CardType =
  | 'visa'
  | 'mastercard'
  | 'amex'
  | 'discover'
  | 'dinersclub'
  | 'jcb'
  | 'unknown'
interface CardPattern {
  type: CardType
  pattern: RegExp
  length: number[]
  format: RegExp
}

const cardPatterns: CardPattern[] = [
  {
    type: 'amex',
    pattern: /^3[47]/,
    length: [15],
    format: /(\d{4})(\d{6})(\d{5})/,
  },
  {
    type: 'visa',
    pattern: /^4/,
    length: [16, 18, 19],
    format: /(\d{4})(\d{4})(\d{4})(\d{4})/,
  },
  {
    type: 'mastercard',
    pattern: /^5[1-5]|^222[1-9]|^22[3-9]|^2[3-6]|^27[0-1]|^2720/,
    length: [16],
    format: /(\d{4})(\d{4})(\d{4})(\d{4})/,
  },
  {
    type: 'discover',
    pattern: /^6(?:011|5)/,
    length: [16],
    format: /(\d{4})(\d{4})(\d{4})(\d{4})/,
  },
  {
    type: 'dinersclub',
    pattern: /^3(?:0[0-5]|[68])/,
    length: [14],
    format: /(\d{4})(\d{6})(\d{4})/,
  },
  {
    type: 'jcb',
    pattern: /^35/,
    length: [16],
    format: /(\d{4})(\d{4})(\d{4})(\d{4})/,
  },
]

export interface CreditCardNumberProps {
  /**
   * Fires on every edit with the digits-only card-number string.
   * Validation status flows via `onValidityChange`; detected card brand
   * flows via `onCardTypeChange`.
   */
  onChange?: (value: string) => void
  /** Optional side-channel for validity changes. */
  onValidityChange?: (isValid: boolean) => void
  /** Optional side-channel for card-brand detection. */
  onCardTypeChange?: (cardType: CardType) => void
  useLuhnValidation?: boolean
  isDefaultValue?: boolean
  enableFormatting?: boolean
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
  disabled?: boolean
  styles?: FieldStyleOverrides
}

const CreditCardNumber: React.FC<CreditCardNumberProps> = ({
  onChange: onChangeProp,
  onValidityChange,
  onCardTypeChange,
  value: valueProp,
  useLuhnValidation = true,
  isDefaultValue = false,
  enableFormatting = true,
  label = 'Card Number',
  placeholder = '1234 5678 9012 3456',
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
  // value) this is a byte-for-byte pass-through of the caller's props. The
  // engine stores the digits-only card string this field's onChange emits;
  // the derived-state block below reformats it for display. The component
  // contract keeps a string `value`, so the bound value is coalesced to ''
  // exactly as the old `value = ''` param default did.
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

  const detectCardType = useCallback((cardNumber: string): CardType => {
    const cleanNumber = cardNumber.replace(/\D/g, '')
    for (const pattern of cardPatterns)
      if (pattern.pattern.test(cleanNumber)) return pattern.type
    return 'unknown'
  }, [])

  const validateLuhn = useCallback((cardNumber: string): boolean => {
    const cleanNumber = cardNumber.replace(/\D/g, '')
    if (cleanNumber.length < 13) return false
    let sum = 0
    let isEven = false
    for (let i = cleanNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cleanNumber.charAt(i), 10)
      if (isEven) {
        digit *= 2
        if (digit > 9) digit -= 9
      }
      sum += digit
      isEven = !isEven
    }
    return sum % 10 === 0
  }, [])

  const validateCreditCard = useCallback(
    (cardNumber: string): boolean => {
      const cleanNumber = cardNumber.replace(/\D/g, '')
      if (cleanNumber === '') return true
      if (!/^\d+$/.test(cleanNumber)) return false
      const detectedType = detectCardType(cleanNumber)
      const pattern = cardPatterns.find(p => p.type === detectedType)
      if (pattern) {
        if (!pattern.length.includes(cleanNumber.length)) return false
      } else if (cleanNumber.length < 13 || cleanNumber.length > 19)
        return false
      return !useLuhnValidation || validateLuhn(cleanNumber)
    },
    [detectCardType, useLuhnValidation, validateLuhn]
  )

  const formatInput = useCallback(
    (input: string): string => {
      const cleanNumber = input.replace(/\D/g, '')
      if (!enableFormatting) return cleanNumber
      const detectedType = detectCardType(cleanNumber)
      const pattern = cardPatterns.find(p => p.type === detectedType)
      if (pattern && cleanNumber.length >= 4) {
        const match = cleanNumber.match(pattern.format)
        if (match) return match.slice(1).join(' ').trim()
      }
      return cleanNumber.replace(/(\d{4})(?=\d)/g, '$1 ')
    },
    [detectCardType, enableFormatting]
  )

  const maskCreditCard = useCallback(
    (cardNumber: string): string => {
      const cleanNumber = cardNumber.replace(/\D/g, '')
      if (!cleanNumber || cleanNumber.length < 8) return cardNumber
      const firstFour = cleanNumber.slice(0, 4)
      const lastFour = cleanNumber.slice(-4)
      const maskedPortion = '*'.repeat(Math.max(0, cleanNumber.length - 8))
      const maskedNumber = firstFour + maskedPortion + lastFour
      return enableFormatting ? formatInput(maskedNumber) : maskedNumber
    },
    [enableFormatting, formatInput]
  )

  const getDisplayValue = useCallback(
    () =>
      isDefaultValue && !isFocused && !hasBeenEdited && internalValue
        ? maskCreditCard(internalValue)
        : internalValue,
    [isDefaultValue, isFocused, hasBeenEdited, internalValue, maskCreditCard]
  )

  // Track previous value prop for derived state pattern
  const [prevValue, setPrevValue] = useState(value)
  if (value !== prevValue) {
    setPrevValue(value)
    const safeValue = value || ''
    const formattedValue = formatInput(safeValue)
    setInternalValue(formattedValue)
  }

  // Listen for native 'input' events to support browser automation tools
  useEffect(() => {
    const el = inputRef.current
    if (!el) return

    const handleNativeInput = (e: Event) => {
      const target = e.target as HTMLInputElement
      const formattedValue = formatInput(target.value).slice(0, 23)
      if (formattedValue !== internalValue) {
        setInternalValue(formattedValue)
        setHasBeenEdited(true)
        const detectedType = detectCardType(formattedValue)
        const valid = validateCreditCard(formattedValue)
        onChange?.(formattedValue.replace(/\D/g, ''))
        onValidityChange?.(valid)
        onCardTypeChange?.(detectedType)
      }
    }

    el.addEventListener('input', handleNativeInput)
    return () => el.removeEventListener('input', handleNativeInput)
  }, [
    onChange,
    onValidityChange,
    onCardTypeChange,
    internalValue,
    formatInput,
    detectCardType,
    validateCreditCard,
  ])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value
      const formattedValue = formatInput(rawValue).slice(0, 23)
      setInternalValue(formattedValue)
      setHasBeenEdited(true)
      const detectedType = detectCardType(formattedValue)
      const valid = validateCreditCard(formattedValue)
      onChange?.(formattedValue.replace(/\D/g, ''))
      onValidityChange?.(valid)
      onCardTypeChange?.(detectedType)
    },
    [
      onChange,
      onValidityChange,
      onCardTypeChange,
      validateCreditCard,
      formatInput,
      detectCardType,
    ]
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

  const getCardIcon = useCallback(() => '💳', [])

  // Inline-style chrome — see AccountNumber for the same pattern.
  const inputWrapperStyle: React.CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    height: '40px',
    width: '100%',
    border: '1px solid var(--field-border-default, hsl(0,0%,20%))',
    borderRadius: '8px',
    backgroundColor: 'var(--field-bg, transparent)',
    color: 'var(--field-text, inherit)',
    margin: 0,
    padding: 0,
    boxSizing: 'border-box',
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
    outline: 'none',
    border: 'none',
    padding: '8px 16px',
    paddingLeft: '48px',
    paddingRight: '16px',
    fontSize: '16px',
    color: 'inherit',
    boxSizing: 'border-box',
  }

  const adornmentStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    left: '16px',
    color: 'var(--field-text, inherit)',
    pointerEvents: 'none',
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    marginTop: '-3px',
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
          <div style={adornmentStyle}>
            <span>{getCardIcon()}</span>
          </div>
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            id={id ?? inputId}
            name={name}
            value={getDisplayValue()}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={disabled}
            placeholder={placeholder}
            maxLength={23}
            autoComplete="cc-number"
            data-field-name={dataFieldName}
            style={inputStyle}
            {...inputAriaProps}
          />
        </div>
      )}
    </FieldShell>
  )
}

CreditCardNumber.displayName = 'CreditCardNumber'
export default CreditCardNumber
