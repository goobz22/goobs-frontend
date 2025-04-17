'use client'
import React, { useState, useEffect, FC, useRef } from 'react'
import { Box, Typography, styled } from '@mui/material'
import { CheckCircleOutline } from '@mui/icons-material'
import CustomButton, { CustomButtonProps } from '../Button'

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
}

// Custom styled input for verification code digits
const CodeInput = styled('input')(() => ({
  width: '40px',
  height: '50px',
  padding: '0',
  textAlign: 'center',
  fontSize: '16px',
  fontWeight: 'normal',
  color: 'black',
  backgroundColor: 'white',
  border: '1px solid black',
  borderRadius: '4px',
  outline: 'none',
  // The cursor is visible (not hiding with caretColor)
  '&:focus': {
    borderColor: 'black',
    borderWidth: '2px',
  },
}))

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

  // Calculate container width based on number of inputs and spacing
  const inputAreaWidth = codeLength * 40 + (codeLength - 1) * 8 + 44

  // Calculate button container width
  const minButtonWidth = 120
  const buttonContainerWidth = showSendResendButton
    ? Math.max(inputAreaWidth, minButtonWidth * 2 + 16)
    : Math.max(inputAreaWidth, minButtonWidth)

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
      >
        <CheckCircleOutline sx={{ fontSize: 60, color: 'green' }} />
        <Typography variant="h5" align="center">
          {successMessage}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
          <CustomButton
            text="Disable Verification"
            fontcolor="white"
            backgroundcolor="black"
            width="100%"
            height="40px"
            variant="outlined"
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
      bgcolor={isValid ? 'green' : 'red'}
      role="status"
      aria-label={isValid ? 'Code is valid' : 'Code is invalid'}
    />
  )

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="flex-start"
      role="group"
      aria-label={ariaLabel || 'Confirmation Code'}
      width={`${inputAreaWidth}px`}
      position="relative"
    >
      <Box
        display="flex"
        justifyContent="space-between"
        width="100%"
        position="relative"
        marginBottom={2}
      >
        <Box display="flex" alignItems="center" width="100%">
          <Box display="flex" gap={1} width="100%">
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
                style={{
                  ...inputStyle,
                }}
              />
            ))}
          </Box>
          <Box ml={2}>{statusIndicator}</Box>
        </Box>
      </Box>

      {showActionButtons && (
        <Box
          display="flex"
          justifyContent={showSendResendButton ? 'space-between' : 'center'}
          width={`${buttonContainerWidth}px`}
          marginTop={1}
          sx={{
            marginLeft:
              buttonContainerWidth > inputAreaWidth
                ? `${-(buttonContainerWidth - inputAreaWidth) / 2}px`
                : 0,
          }}
        >
          {showSendResendButton && (
            <CustomButton
              text={codeSent ? 'Resend Code' : 'Send Code'}
              fontcolor="white"
              backgroundcolor="black"
              width={
                showSendResendButton
                  ? `${buttonContainerWidth / 2 - 8}px`
                  : '100%'
              }
              height="40px"
              {...sendResendButtonProps}
              onClick={() => {
                if (onSendResend) void onSendResend()
              }}
              disableButton={sendResendButtonProps?.disableButton || 'false'}
            />
          )}
          <CustomButton
            text="Verify"
            fontcolor="white"
            backgroundcolor="black"
            width={
              showSendResendButton
                ? `${buttonContainerWidth / 2 - 8}px`
                : '100%'
            }
            height="40px"
            {...verifyButtonProps}
            onClick={() => {
              if (onVerify) void onVerify()
            }}
            disableButton={allFieldsFilled ? 'false' : 'true'}
          />
        </Box>
      )}
    </Box>
  )
}

export default ConfirmationCodeInputs
