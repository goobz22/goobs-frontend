// src/components/ConfirmationCodeInputs/index.tsx

'use client'
import React, { useState, useEffect, FC, useRef } from 'react'
import { Box, Typography, styled, keyframes, alpha } from '@mui/material'
import { CheckCircleOutline } from '@mui/icons-material'
import CustomButton, { CustomButtonProps } from '../Button'

// --------------------------------------------------------------------------
// SACRED THEMING CONSTANTS AND ANIMATIONS
// --------------------------------------------------------------------------

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

const sacredInputGlow = keyframes`
  0% { 
    box-shadow: 0 0 5px rgba(255, 215, 0, 0.3), inset 0 0 10px rgba(255, 215, 0, 0.1);
    border-color: ${alpha('#FFD700', 0.5)};
  }
  50% { 
    box-shadow: 0 0 15px rgba(255, 215, 0, 0.5), inset 0 0 20px rgba(255, 215, 0, 0.2);
    border-color: ${alpha('#FFD700', 0.8)};
  }
  100% { 
    box-shadow: 0 0 5px rgba(255, 215, 0, 0.3), inset 0 0 10px rgba(255, 215, 0, 0.1);
    border-color: ${alpha('#FFD700', 0.5)};
  }
`

const sacredPulse = keyframes`
  0% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.1); opacity: 1; }
  100% { transform: scale(1); opacity: 0.8; }
`

const glyphFloat = keyframes`
  0% { transform: translateY(0px) rotate(0deg); opacity: 0.3; }
  50% { transform: translateY(-5px) rotate(180deg); opacity: 0.5; }
  100% { transform: translateY(0px) rotate(360deg); opacity: 0.3; }
`

const sacredSuccessGlow = keyframes`
  0% { 
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.4);
    transform: scale(1);
  }
  50% { 
    box-shadow: 0 0 40px rgba(255, 215, 0, 0.6), 0 0 60px rgba(255, 215, 0, 0.3);
    transform: scale(1.05);
  }
  100% { 
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.4);
    transform: scale(1);
  }
`

const statusGlow = keyframes`
  0% { box-shadow: 0 0 5px currentColor; }
  50% { box-shadow: 0 0 15px currentColor, 0 0 25px currentColor; }
  100% { box-shadow: 0 0 5px currentColor; }
`

export interface ConfirmationCodeInputsProps {
  identifier?: string
  isValid: boolean
  codeLength?: number
  'aria-label'?: string
  'aria-required'?: boolean
  'aria-invalid'?: boolean
  onChange?: (value: string) => void
  value?: string

  /** Whether a verification code has been sent (to toggle between "Send Code" and "Resend Code") */
  codeSent?: boolean

  /** Callback function for when the Verify button is clicked */
  onVerify?: () => void | Promise<void>

  /** Callback function for when the Send/Resend button is clicked */
  onSendResend?: () => void | Promise<void>

  /** Required callback function for when verification is disabled */
  onDisableVerification: () => void | Promise<void>

  /** Custom props for the Verify button */
  verifyButtonProps?: Partial<CustomButtonProps>

  /** Custom props for the Send/Resend button */
  sendResendButtonProps?: Partial<CustomButtonProps>

  /** Custom props for the Disable Verification button */
  disableVerificationButtonProps?: Partial<CustomButtonProps>

  /** Whether to show action buttons (verify and send/resend) */
  showActionButtons?: boolean

  /** Whether to show the Send/Resend button. If false, only the Verify button will be shown. */
  showSendResendButton?: boolean

  /** Custom success message to display */
  successMessage?: string

  /** Whether to show the success state UI */
  showSuccessState?: boolean

  /** Custom styling for the input fields */
  inputStyle?: React.CSSProperties

  /** Enable Egyptian/Sacred theming */
  sacredtheme?: boolean
}

// Custom styled input for verification code digits
const CodeInput = styled('input')<{ sacredtheme?: boolean }>(
  ({ sacredtheme }) => ({
    width: '48px',
    height: '56px',
    padding: '0',
    textAlign: 'center',
    fontSize: '20px',
    fontWeight: sacredtheme ? 'bold' : 'normal',
    color: sacredtheme ? '#FFD700' : 'black',
    backgroundColor: sacredtheme ? '#0a0a0a' : 'white',
    border: sacredtheme
      ? `2px solid ${alpha('#FFD700', 0.5)}`
      : '1px solid black',
    borderRadius: '4px',
    outline: 'none',
    position: 'relative',
    transition: 'all 0.3s ease',
    ...(sacredtheme && {
      fontFamily: 'monospace',
      letterSpacing: '2px',
      textShadow: '0 0 8px rgba(255, 215, 0, 0.6)',
      animation: `${sacredInputGlow} 4s ease-in-out infinite`,
    }),
    '&:focus': {
      borderColor: sacredtheme ? '#FFD700' : 'black',
      borderWidth: '2px',
      ...(sacredtheme && {
        boxShadow:
          '0 0 20px rgba(255, 215, 0, 0.6), inset 0 0 15px rgba(255, 215, 0, 0.3)',
        transform: 'scale(1.05)',
      }),
    },
    '&::placeholder': {
      color: sacredtheme ? alpha('#FFD700', 0.3) : undefined,
    },
  })
)

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
  // Initialize internal state with the value prop
  const [internalValue, setInternalValue] = useState(value)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Initialize refs array
  useEffect(() => {
    inputRefs.current = Array(codeLength).fill(
      null
    ) as (HTMLInputElement | null)[]
  }, [codeLength])

  // Update internal state when value prop changes
  useEffect(() => {
    if (internalValue !== value) {
      setInternalValue(value)
    }
  }, [value, internalValue])

  // Auto-focus first input field when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputRefs.current[0] && internalValue.length === 0) {
        inputRefs.current[0].focus()
      }
    }, 100)
    return () => clearTimeout(timer)
  }, [internalValue.length])

  // Handle input change for a specific digit
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const target = e.target
    const val = target.value

    // Only accept numbers
    if (!/^\d*$/.test(val)) {
      return
    }

    // Create a copy of the current value as an array of characters
    let newValueArr = internalValue.padEnd(codeLength, '').split('')

    // If input has multiple characters (from paste), process them
    if (val.length > 1) {
      const digits = val.split('')
      for (let i = 0; i < digits.length; i++) {
        if (index + i < codeLength) {
          newValueArr[index + i] = digits[i]
        }
      }
    } else {
      // Only replace the single character at the index
      newValueArr[index] = val.charAt(val.length - 1)
    }

    // Convert back to string and remove trailing spaces
    const newValue = newValueArr.join('').trimEnd()

    // Update internal state and call onChange
    setInternalValue(newValue)
    onChange?.(newValue)

    // Move focus to next input if we have a value and there's a next input
    if (val && index < codeLength - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  // Handle key down events for navigation
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    const target = e.target as HTMLInputElement

    switch (e.key) {
      case 'Backspace': {
        if (target.value === '') {
          // If current field is empty and not the first field, move to previous field
          if (index > 0) {
            e.preventDefault()
            inputRefs.current[index - 1]?.focus()

            // Also clear the previous field if needed
            const newValueArr = internalValue.split('')
            newValueArr[index - 1] = ''
            const newValue = newValueArr.join('').trimEnd()
            setInternalValue(newValue)
            onChange?.(newValue)
          }
        } else {
          // Clear current field but don't move
          const newValueArr = internalValue.split('')
          newValueArr[index] = ''
          const newValue = newValueArr.join('').trimEnd()
          setInternalValue(newValue)
          onChange?.(newValue)
        }
        break
      }

      case 'Delete': {
        // Clear current field
        const newValueArr = internalValue.split('')
        newValueArr[index] = ''
        const newValue = newValueArr.join('').trimEnd()
        setInternalValue(newValue)
        onChange?.(newValue)
        break
      }

      case 'ArrowLeft':
        // Move to previous input if exists
        if (index > 0) {
          e.preventDefault()
          inputRefs.current[index - 1]?.focus()
        }
        break

      case 'ArrowRight':
        // Move to next input if exists
        if (index < codeLength - 1) {
          e.preventDefault()
          inputRefs.current[index + 1]?.focus()
        }
        break

      case 'Enter':
        // If on the last input field and all fields are filled, trigger verify action
        if (
          index === codeLength - 1 &&
          internalValue.length >= codeLength &&
          onVerify
        ) {
          e.preventDefault()
          void onVerify()
        }
        break

      default: {
        // For number keys, handle them directly
        if (/^\d$/.test(e.key)) {
          e.preventDefault()

          // Update the value at this index
          const newValueArr = internalValue.padEnd(codeLength, '').split('')
          newValueArr[index] = e.key
          const newValue = newValueArr.join('').trimEnd()

          setInternalValue(newValue)
          onChange?.(newValue)

          // Move to next input if there's one
          if (index < codeLength - 1) {
            inputRefs.current[index + 1]?.focus()
          }
        }
        break
      }
    }
  }

  // Handle paste event to distribute digits across inputs
  const handlePaste = (
    e: React.ClipboardEvent<HTMLInputElement>,
    index: number
  ) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text')
    const digits = pastedData.replace(/\D/g, '').slice(0, codeLength - index)

    if (digits) {
      // Update the value from the current index onwards
      const newValueArr = internalValue.padEnd(codeLength, '').split('')

      for (let i = 0; i < digits.length; i++) {
        if (index + i < codeLength) {
          newValueArr[index + i] = digits[i]
        }
      }

      const newValue = newValueArr.join('').trimEnd()
      setInternalValue(newValue)
      onChange?.(newValue)

      // Focus the input after the last pasted digit or the last input
      const focusIndex = Math.min(index + digits.length, codeLength - 1)
      inputRefs.current[focusIndex]?.focus()
    }
  }

  // Split the value into individual digits
  const digits = internalValue.padEnd(codeLength, '').split('')

  // Check if all code fields are filled
  const allFieldsFilled = internalValue.length >= codeLength

  // If showing success state, render the success UI
  if (showSuccessState) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap={2}
        padding={3}
        width="100%"
        sx={
          sacredtheme
            ? {
                position: 'relative',
                backgroundColor: '#0a0a0a',
                border: `2px solid ${alpha('#FFD700', 0.5)}`,
                borderRadius: '8px',
                animation: `${sacredSuccessGlow} 3s ease-in-out infinite`,
                backgroundImage: `
            radial-gradient(circle at center, rgba(255, 215, 0, 0.1) 0%, transparent 50%)
          `,
              }
            : undefined
        }
      >
        <CheckCircleOutline
          sx={{
            fontSize: 60,
            color: sacredtheme ? '#FFD700' : 'green',
            ...(sacredtheme && {
              filter: 'drop-shadow(0 0 20px rgba(255, 215, 0, 0.8))',
              animation: `${sacredPulse} 2s ease-in-out infinite`,
            }),
          }}
        />
        <Typography
          variant="h5"
          align="center"
          sx={
            sacredtheme
              ? {
                  color: '#FFD700',
                  fontFamily: '"Cinzel", serif',
                  fontWeight: 700,
                  letterSpacing: '2px',
                  textShadow: '0 0 15px rgba(255, 215, 0, 0.6)',
                  textTransform: 'uppercase',
                }
              : undefined
          }
        >
          {successMessage}
        </Typography>
        {sacredtheme && (
          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
            {['𓅨', '𓂋', '𓏭'].map((glyph, i) => (
              <Box
                key={i}
                sx={{
                  color: alpha('#FFD700', 0.6),
                  fontSize: '20px',
                  animation: `${glyphFloat} ${3 + i * 0.5}s ease-in-out infinite`,
                }}
              >
                {glyph}
              </Box>
            ))}
          </Box>
        )}
        <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
          <CustomButton
            text="Disable Verification"
            fontcolor={sacredtheme ? '#FFD700' : 'white'}
            backgroundcolor={sacredtheme ? alpha('#000000', 0.9) : 'black'}
            width="100%"
            height="40px"
            variant="outlined"
            sacredtheme={sacredtheme}
            {...disableVerificationButtonProps}
            onClick={() => {
              void onDisableVerification()
            }}
          />
        </Box>
      </Box>
    )
  }

  const statusIndicator = (
    <Box
      width={20}
      height={20}
      borderRadius="50%"
      bgcolor={
        sacredtheme
          ? isValid
            ? '#FFD700'
            : alpha('#FFD700', 0.3)
          : isValid
            ? 'green'
            : 'red'
      }
      role="status"
      aria-label={isValid ? 'Code is valid' : 'Code is invalid'}
      sx={
        sacredtheme
          ? {
              animation: `${statusGlow} 2s ease-in-out infinite`,
              transition: 'all 0.3s ease',
            }
          : undefined
      }
    />
  )

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      role="group"
      aria-label={ariaLabel || 'Confirmation Code'}
      position="relative"
      sx={
        sacredtheme
          ? {
              padding: '24px',
              backgroundColor: alpha('#000000', 0.8),
              border: `1px solid ${alpha('#FFD700', 0.3)}`,
              borderRadius: '8px',
              backgroundImage: `
          linear-gradient(rgba(255, 215, 0, 0.02), rgba(255, 215, 0, 0.02)),
          radial-gradient(circle at top right, rgba(255, 215, 0, 0.05) 0%, transparent 50%)
        `,
            }
          : { padding: '16px' }
      }
    >
      {/* Sacred decorative elements */}
      {sacredtheme && (
        <>
          <Box
            sx={{
              position: 'absolute',
              top: '8px',
              left: '8px',
              color: alpha('#FFD700', 0.2),
              fontSize: '16px',
              animation: `${glyphFloat} 6s ease-in-out infinite`,
            }}
          >
            {SACRED_GLYPHS[8]}
          </Box>
          <Box
            sx={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              color: alpha('#FFD700', 0.2),
              fontSize: '16px',
              animation: `${glyphFloat} 6s ease-in-out infinite 3s`,
            }}
          >
            {SACRED_GLYPHS[12]}
          </Box>
        </>
      )}

      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        width="100%"
        gap={2.5}
      >
        {/* Input fields row */}
        <Box display="flex" alignItems="center" gap={2}>
          <Box display="flex" gap={1.5}>
            {Array.from({ length: codeLength }).map((_, index) => (
              <CodeInput
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
                sacredtheme={sacredtheme}
                style={{
                  ...inputStyle,
                }}
              />
            ))}
          </Box>
          {statusIndicator}
        </Box>

        {/* Action buttons */}
        {showActionButtons && (
          <Box
            display="flex"
            gap={2}
            width="100%"
            maxWidth="400px"
            justifyContent="center"
          >
            {showSendResendButton && (
              <CustomButton
                text={codeSent ? 'Resend Code' : 'Send Code'}
                fontcolor={sacredtheme ? '#FFD700' : 'white'}
                backgroundcolor={sacredtheme ? alpha('#000000', 0.9) : 'black'}
                width="180px"
                height="44px"
                sacredtheme={sacredtheme}
                {...sendResendButtonProps}
                onClick={() => {
                  if (onSendResend) void onSendResend()
                }}
                disableButton={sendResendButtonProps?.disableButton || 'false'}
              />
            )}
            <CustomButton
              text="Verify"
              fontcolor={sacredtheme ? '#FFD700' : 'white'}
              backgroundcolor={sacredtheme ? alpha('#000000', 0.9) : 'black'}
              width="180px"
              height="44px"
              sacredtheme={sacredtheme}
              {...verifyButtonProps}
              onClick={() => {
                if (onVerify) void onVerify()
              }}
              disableButton={allFieldsFilled ? 'false' : 'true'}
            />
          </Box>
        )}
      </Box>

      {/* Sacred bottom decoration */}
      {sacredtheme && (
        <Box
          sx={{
            position: 'absolute',
            bottom: '4px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 0.5,
          }}
        >
          {['𓊖', '𓊗', '𓊖'].map((glyph, i) => (
            <Box
              key={i}
              sx={{
                color: alpha('#FFD700', 0.3),
                fontSize: '12px',
                animation: `${sacredPulse} ${2 + i * 0.3}s ease-in-out infinite`,
              }}
            >
              {glyph}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  )
}

export default ConfirmationCodeInputs
