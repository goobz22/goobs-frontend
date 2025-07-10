// src/components/ConfirmationCodeInputs/index.tsx

'use client'
import React, { useState, useEffect, FC, useRef } from 'react'
import CheckCircleOutline from '../Icons/CheckCircleOutline'
import CustomButton, { CustomButtonProps } from '../Button'

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
  verifyButtonProps?: Partial<CustomButtonProps>
  sendResendButtonProps?: Partial<CustomButtonProps>
  disableVerificationButtonProps?: Partial<CustomButtonProps>
  showActionButtons?: boolean
  showSendResendButton?: boolean
  successMessage?: string
  showSuccessState?: boolean
  inputStyle?: React.CSSProperties
  sacredtheme?: boolean
}

const getStyles = (sacredtheme: boolean, isValid: boolean) => ({
  successContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '1.5rem',
    width: '100%',
    ...(sacredtheme && {
      position: 'relative',
      backgroundColor: '#1A1A1A',
      border: '2px solid rgba(255, 215, 0, 0.5)',
      borderRadius: '0.5rem',
      animation: 'sacred-success-glow 2s infinite alternate',
      backgroundImage:
        'radial-gradient(circle at center, rgba(255,215,0,0.1) 0%, transparent 50%)',
    }),
  } as React.CSSProperties,
  successIcon: {
    fontSize: '3.75rem',
    color: sacredtheme ? '#FFD700' : '#22C55E',
    animation: sacredtheme ? 'sacred-pulse 1.5s infinite' : 'none',
    filter: sacredtheme
      ? 'drop-shadow(0 0 20px rgba(255, 215, 0, 0.8))'
      : 'none',
  } as React.CSSProperties,
  successMessage: {
    fontSize: '1.5rem',
    lineHeight: '2rem',
    textAlign: 'center',
    ...(sacredtheme && {
      color: '#FFD700',
      fontFamily: 'Cinzel, serif',
      fontWeight: 'bold',
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      textShadow: '0 0 5px rgba(255,215,0,0.7)',
    }),
  } as React.CSSProperties,
  glyphContainer: {
    display: 'flex',
    gap: '0.25rem',
    marginTop: '0.25rem',
  } as React.CSSProperties,
  glyph: (i: number) =>
    ({
      color: 'rgba(255, 215, 0, 0.6)',
      fontSize: '1.25rem',
      animation: `sacred-glyph-float ${3 + i * 0.5}s infinite alternate`,
    }) as React.CSSProperties,
  buttonContainer: {
    display: 'flex',
    gap: '0.5rem',
    width: '100%',
  } as React.CSSProperties,
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
    padding: sacredtheme ? '1.5rem' : '1rem',
    ...(sacredtheme && {
      backgroundColor: 'rgba(0,0,0,0.8)',
      border: '1px solid rgba(255, 215, 0, 0.3)',
      borderRadius: '0.5rem',
      backgroundImage:
        'linear-gradient(rgba(255,215,0,0.02),rgba(255,215,0,0.02)),radial-gradient(circle at top right,rgba(255,215,0,0.05)_0%,transparent_50%)',
    }),
  } as React.CSSProperties,
  decorativeGlyph: (top: string, side: string, delay?: string) =>
    ({
      position: 'absolute',
      top,
      [side]: side,
      color: 'rgba(255, 215, 0, 0.2)',
      fontSize: '1rem',
      animation: `sacred-glyph-float 4s infinite alternate ${delay || ''}`,
    }) as React.CSSProperties,
  mainContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    gap: '1.25rem',
  } as React.CSSProperties,
  inputsRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  } as React.CSSProperties,
  inputGroup: { display: 'flex', gap: '0.75rem' } as React.CSSProperties,
  input: {
    width: '3rem',
    height: '3.5rem',
    padding: 0,
    textAlign: 'center',
    fontSize: '1.25rem',
    border: '1px solid',
    borderRadius: '0.25rem',
    outline: 'none',
    position: 'relative',
    transition: 'all 0.3s',
    ...(sacredtheme
      ? {
          color: '#FFD700',
          backgroundColor: '#1A1A1A',
          borderColor: 'rgba(255, 215, 0, 0.5)',
          fontFamily: 'monospace',
          fontWeight: 'bold',
          letterSpacing: '0.1em',
          textShadow: '0 0 2px rgba(255,215,0,0.5)',
          animation: 'sacred-input-glow 3s infinite alternate',
          '&:focus': {
            borderColor: '#FFD700',
            borderWidth: '2px',
            transform: 'scale(1.05)',
            boxShadow:
              '0 0 20px rgba(255, 215, 0, 0.6), inset 0 0 15px rgba(255, 215, 0, 0.3)',
          },
        }
      : {
          color: 'black',
          backgroundColor: 'white',
          borderColor: 'black',
          fontWeight: 400,
          '&:focus': {
            borderColor: 'black',
            borderWidth: '2px',
          },
        }),
  } as React.CSSProperties,
  statusIndicator: {
    width: '1.25rem',
    height: '1.25rem',
    borderRadius: '9999px',
    transition: 'all 0.3s',
    backgroundColor: sacredtheme
      ? isValid
        ? '#FFD700'
        : 'rgba(255,215,0,0.3)'
      : isValid
        ? '#22C55E'
        : '#EF4444',
    animation:
      sacredtheme && isValid ? 'status-glow 1.5s infinite alternate' : 'none',
  } as React.CSSProperties,
  bottomGlyphContainer: {
    position: 'absolute',
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
  },
})

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
  inputStyle = {},
  sacredtheme = false,
}) => {
  const [internalValue, setInternalValue] = useState(value)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    inputRefs.current = Array(codeLength).fill(null)
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const val = e.target.value
    if (!/^\d*$/.test(val)) return
    let newValueArr = internalValue.padEnd(codeLength, '').split('')
    if (val.length > 1)
      val.split('').forEach((digit, i) => {
        if (index + i < codeLength) newValueArr[index + i] = digit
      })
    else newValueArr[index] = val.charAt(val.length - 1)
    const newValue = newValueArr.join('').trimEnd()
    setInternalValue(newValue)
    onChange?.(newValue)
    if (val && index < codeLength - 1) inputRefs.current[index + 1]?.focus()
  }

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
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
  }

  const handlePaste = (
    e: React.ClipboardEvent<HTMLInputElement>,
    index: number
  ) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text')
    const digits = pastedData.replace(/\D/g, '').slice(0, codeLength - index)
    if (digits) {
      const newValueArr = internalValue.padEnd(codeLength, '').split('')
      for (let i = 0; i < digits.length; i++)
        if (index + i < codeLength) newValueArr[index + i] = digits[i]
      const newValue = newValueArr.join('').trimEnd()
      setInternalValue(newValue)
      onChange?.(newValue)
      const focusIndex = Math.min(index + digits.length, codeLength - 1)
      inputRefs.current[focusIndex]?.focus()
    }
  }

  const styles = getStyles(sacredtheme, isValid)
  const digits = internalValue.padEnd(codeLength, '').split('')
  const allFieldsFilled = internalValue.length >= codeLength

  if (showSuccessState) {
    return (
      <div style={styles.successContainer}>
        <CheckCircleOutline style={styles.successIcon} />
        <h3 style={styles.successMessage}>{successMessage}</h3>
        {sacredtheme && (
          <div style={styles.glyphContainer}>
            {['𓅨', '𓂋', '𓏭'].map((glyph, i) => (
              <span key={i} style={styles.glyph(i)}>
                {glyph}
              </span>
            ))}
          </div>
        )}
        <div style={styles.buttonContainer}>
          <CustomButton
            text="Disable Verification"
            sacredtheme={sacredtheme}
            {...disableVerificationButtonProps}
            onClick={() => {
              void onDisableVerification()
            }}
            width="100%"
            height="40px"
          />
        </div>
      </div>
    )
  }

  return (
    <div
      style={styles.container}
      role="group"
      aria-label={ariaLabel || 'Confirmation Code'}
    >
      {sacredtheme && (
        <>
          <div style={styles.decorativeGlyph('0.5rem', '0.5rem')}>
            {SACRED_GLYPHS[8]}
          </div>
          <div style={styles.decorativeGlyph('0.5rem', '0.5rem', '3s')}>
            {SACRED_GLYPHS[12]}
          </div>
        </>
      )}
      <div style={styles.mainContent}>
        <div style={styles.inputsRow}>
          <div style={styles.inputGroup}>
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
                aria-label={`${ariaLabel || 'Confirmation Code'} digit ${index + 1}`}
                aria-required={ariaRequired}
                aria-invalid={ariaInvalid}
                style={{ ...styles.input, ...inputStyle }}
              />
            ))}
          </div>
          <div
            style={styles.statusIndicator}
            role="status"
            aria-label={isValid ? 'Code is valid' : 'Code is invalid'}
          />
        </div>
        {showActionButtons && (
          <div style={styles.buttonContainer}>
            {showSendResendButton && (
              <CustomButton
                text={codeSent ? 'Resend Code' : 'Send Code'}
                sacredtheme={sacredtheme}
                {...sendResendButtonProps}
                onClick={() => onSendResend && void onSendResend()}
                width="180px"
                height="44px"
              />
            )}
            <CustomButton
              text="Verify"
              sacredtheme={sacredtheme}
              {...verifyButtonProps}
              onClick={() => onVerify && void onVerify()}
              disableButton={!allFieldsFilled ? 'true' : 'false'}
              width="180px"
              height="44px"
            />
          </div>
        )}
      </div>
      {sacredtheme && (
        <div style={styles.bottomGlyphContainer}>
          {[...Array(3)].map((_, i) => (
            <span key={i} style={styles.bottomGlyph}>
              .
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export default ConfirmationCodeInputs
