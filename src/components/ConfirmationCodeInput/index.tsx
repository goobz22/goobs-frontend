// src/components/ConfirmationCodeInput/index.tsx

'use client'
import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  type FC,
} from 'react'
import CheckCircleOutline from '../Icons/CheckCircleOutline'
import CustomButton, { type ButtonProps } from '../Button'
import {
  getConfirmationCodeInputStyles,
  type ConfirmationCodeInputStyles,
} from '../../theme'

// --------------------------------------------------------------------------
// PROPS INTERFACE
// --------------------------------------------------------------------------

export interface ConfirmationCodeInputsProps {
  identifier?: string
  isValid: boolean
  codeLength?: number
  'aria-label'?: string
  'aria-required'?: boolean
  'aria-invalid'?: boolean
  onChange?: (value: string) => void
  value?: string
  codeSent?: boolean
  onVerify?: () => void | Promise<void>
  onSendResend?: () => void | Promise<void>
  onDisableVerification: () => void | Promise<void>
  verifyButtonProps?: Partial<ButtonProps>
  sendResendButtonProps?: Partial<ButtonProps>
  disableVerificationButtonProps?: Partial<ButtonProps>
  showActionButtons?: boolean
  showSendResendButton?: boolean
  successMessage?: string
  showSuccessState?: boolean
  /** Comprehensive styling options including theme, custom colors, and layout properties. */
  styles?: ConfirmationCodeInputStyles
}

// --------------------------------------------------------------------------
// SACRED THEME COMPONENTS
// --------------------------------------------------------------------------

const SacredGlyphs: React.FC = () => {
  return null
}

const SacredBottomDecorations: React.FC = () => {
  const decorativeStyles = useMemo(
    () => ({
      bottomGlyphContainer: {
        position: 'absolute' as const,
        bottom: '0.25rem',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '0.25rem',
      } as React.CSSProperties,
      bottomGlyph: {
        color: 'rgba(255,215,0,0.3)',
        fontSize: '0.75rem',
        animation: 'sacred-pulse 2s infinite alternate',
      } as React.CSSProperties,
    }),
    []
  )

  return (
    <div style={decorativeStyles.bottomGlyphContainer}>
      {Array.from({ length: 3 }).map((_, i) => (
        <span key={i} style={decorativeStyles.bottomGlyph}>
          .
        </span>
      ))}
    </div>
  )
}

// --------------------------------------------------------------------------
// MAIN COMPONENT
// --------------------------------------------------------------------------

const ConfirmationCodeInputs: FC<ConfirmationCodeInputsProps> = ({
  codeLength = 6,
  isValid,
  onChange,
  value = '',
  'aria-label': ariaLabel,
  'aria-required': ariaRequired,
  'aria-invalid': ariaInvalid,
  codeSent = false,
  onVerify,
  onSendResend,
  onDisableVerification,
  verifyButtonProps = {},
  sendResendButtonProps = {},
  disableVerificationButtonProps = {},
  showActionButtons = false,
  showSendResendButton = true,
  successMessage = 'Verification Successful',
  showSuccessState = false,
  styles,
}) => {
  const [internalValue, setInternalValue] = useState(value)
  const [isHovered, setIsHovered] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const isSacredTheme = styles?.theme === 'sacred'
  const isDisabled = styles?.disabled

  const computedStyles = useMemo(
    () =>
      getConfirmationCodeInputStyles(styles, isHovered, isValid, isDisabled),
    [styles, isHovered, isValid, isDisabled]
  )

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
  }, [])

  useEffect(() => {
    inputRefs.current = Array.from({ length: codeLength }, () => null)
  }, [codeLength])

  useEffect(() => {
    if (internalValue !== value) setInternalValue(value)
  }, [value, internalValue])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputRefs.current[0] && internalValue.length === 0)
        inputRefs.current[0].focus()
    }, 100)
    return () => clearTimeout(timer)
  }, [internalValue.length])

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
      const val = e.target.value
      if (!/^\d*$/.test(val)) return
      const newValueArr = internalValue.padEnd(codeLength, '').split('')
      if (val.length > 1)
        val.split('').forEach((digit, i) => {
          if (index + i < codeLength) newValueArr[index + i] = digit
        })
      else newValueArr[index] = val.charAt(val.length - 1)
      const newValue = newValueArr.join('').trimEnd()
      setInternalValue(newValue)
      onChange?.(newValue)
      if (val && index < codeLength - 1) inputRefs.current[index + 1]?.focus()
    },
    [internalValue, codeLength, onChange]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
      const clearAndMoveBack = () => {
        if (index > 0) {
          e.preventDefault()
          inputRefs.current[index - 1]?.focus()
          const newValueArr = internalValue.split('')
          newValueArr[index - 1] = ''
          const newValue = newValueArr.join('').trimEnd()
          setInternalValue(newValue)
          onChange?.(newValue)
        }
      }
      const clearCurrent = () => {
        const newValueArr = internalValue.split('')
        newValueArr[index] = ''
        const newValue = newValueArr.join('').trimEnd()
        setInternalValue(newValue)
        onChange?.(newValue)
      }

      switch (e.key) {
        case 'Backspace':
          if (e.currentTarget.value === '') {
            clearAndMoveBack()
          } else {
            clearCurrent()
          }
          break
        case 'Delete':
          clearCurrent()
          break
        case 'ArrowLeft':
          if (index > 0) {
            e.preventDefault()
            inputRefs.current[index - 1]?.focus()
          }
          break
        case 'ArrowRight':
          if (index < codeLength - 1) {
            e.preventDefault()
            inputRefs.current[index + 1]?.focus()
          }
          break
        case 'Enter':
          if (
            index === codeLength - 1 &&
            internalValue.length >= codeLength &&
            onVerify
          ) {
            e.preventDefault()
            void onVerify()
          }
          break
        default:
          if (/^\d$/.test(e.key)) {
            e.preventDefault()
            const newValueArr = internalValue.padEnd(codeLength, '').split('')
            newValueArr[index] = e.key
            const newValue = newValueArr.join('').trimEnd()
            setInternalValue(newValue)
            onChange?.(newValue)
            if (index < codeLength - 1) inputRefs.current[index + 1]?.focus()
          }
      }
    },
    [internalValue, codeLength, onChange, onVerify]
  )

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>, index: number) => {
      e.preventDefault()
      const pastedData = e.clipboardData.getData('text') || ''
      const digits = pastedData.replace(/\D/g, '').slice(0, codeLength - index)
      if (digits) {
        const newValueArr = internalValue.padEnd(codeLength, '').split('')
        for (let i = 0; i < digits.length; i++)
          if (index + i < codeLength) newValueArr[index + i] = digits.charAt(i)
        const newValue = newValueArr.join('').trimEnd()
        setInternalValue(newValue)
        onChange?.(newValue)
        const focusIndex = Math.min(index + digits.length, codeLength - 1)
        inputRefs.current[focusIndex || 0]?.focus()
      }
    },
    [internalValue, codeLength, onChange]
  )

  const handleFocus = useCallback((index: number) => {
    setFocusedIndex(index)
  }, [])

  const handleBlur = useCallback(() => {
    setFocusedIndex(null)
  }, [])

  const digits = internalValue.padEnd(codeLength, '').split('')
  const allFieldsFilled = internalValue.length >= codeLength

  if (showSuccessState) {
    return (
      <div style={computedStyles.successContainer}>
        <CheckCircleOutline style={computedStyles.successIcon} />
        <h3 style={computedStyles.successMessage}>{successMessage}</h3>
        <div style={computedStyles.buttonContainer}>
          <CustomButton
            text="Disable Verification"
            styles={{
              theme: styles?.theme || 'light',
              width: '100%',
              height: '40px',
            }}
            {...disableVerificationButtonProps}
            onClick={() => {
              void onDisableVerification()
            }}
          />
        </div>
      </div>
    )
  }

  return (
    <div
      style={computedStyles.container}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="group"
      aria-label={ariaLabel || 'Confirmation Code'}
    >
      {isSacredTheme && <SacredGlyphs />}
      <div style={computedStyles.mainContent}>
        <div style={computedStyles.inputsRow}>
          <div style={computedStyles.inputGroup}>
            {Array.from({ length: codeLength }).map((_, index) => (
              <input
                key={index}
                ref={el => {
                  inputRefs.current[index] = el
                }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digits[index] || ''}
                onChange={e => handleInputChange(e, index)}
                onKeyDown={e => handleKeyDown(e, index)}
                onPaste={e => handlePaste(e, index)}
                onFocus={() => handleFocus(index)}
                onBlur={handleBlur}
                aria-label={`${ariaLabel || 'Confirmation Code'} digit ${index + 1}`}
                aria-required={ariaRequired}
                aria-invalid={ariaInvalid}
                disabled={isDisabled}
                style={{
                  ...computedStyles.input,
                  ...(focusedIndex === index && computedStyles.inputFocus),
                }}
              />
            ))}
          </div>
          <div
            style={computedStyles.statusIndicator}
            role="status"
            aria-label={isValid ? 'Code is valid' : 'Code is invalid'}
          />
        </div>
        {showActionButtons && (
          <div style={computedStyles.buttonContainer}>
            {showSendResendButton && (
              <CustomButton
                text={codeSent ? 'Resend Code' : 'Send Code'}
                styles={{
                  theme: styles?.theme || 'light',
                  width: '180px',
                  height: '44px',
                }}
                {...sendResendButtonProps}
                onClick={() => onSendResend && void onSendResend()}
              />
            )}
            <CustomButton
              text="Verify"
              styles={{
                theme: styles?.theme || 'light',
                width: '180px',
                height: '44px',
              }}
              {...verifyButtonProps}
              onClick={() => onVerify && void onVerify()}
              disabled={!allFieldsFilled}
            />
          </div>
        )}
      </div>
      {isSacredTheme && <SacredBottomDecorations />}
    </div>
  )
}

export default ConfirmationCodeInputs
