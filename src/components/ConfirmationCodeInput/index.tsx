'use client'
import React, { ChangeEvent, useState, useEffect, FC } from 'react'
import { Box, Typography } from '@mui/material'
import { CheckCircleOutline } from '@mui/icons-material'
import { red, grey } from '../../styles/palette'
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
}

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
  ...props
}) => {
  // Initialize internal state with the value prop
  const [internalValue, setInternalValue] = useState(value)
  const [isFocused, setIsFocused] = useState(false)
  const [cursorPosition, setCursorPosition] = useState(value.length)
  const inputRef = React.useRef<HTMLInputElement>(null)

  // Update internal state when value prop changes
  useEffect(() => {
    if (internalValue !== value) {
      setInternalValue(value)
      setCursorPosition(value.length)
    }
  }, [value, internalValue])

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    // Only allow digits and limit to codeLength
    const newValue = event.target.value.replace(/\D/g, '').slice(0, codeLength)

    if (internalValue !== newValue) {
      setInternalValue(newValue)
      setCursorPosition(event.target.selectionStart || newValue.length)
      onChange?.(newValue)
    }
  }

  const handleSelect = () => {
    if (inputRef.current) {
      setCursorPosition(inputRef.current.selectionStart || internalValue.length)
    }
  }

  // Calculate container width based on number of inputs
  const inputAreaWidth = codeLength * 40 + (codeLength - 1) * 8 + 44

  // Calculate button container width
  const minButtonWidth = 120
  const buttonContainerWidth = showSendResendButton
    ? Math.max(inputAreaWidth, minButtonWidth * 2 + 16)
    : Math.max(inputAreaWidth, minButtonWidth)

  // Split the value into individual digits for display
  const digits = internalValue.padEnd(codeLength, ' ').split('')

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
        <Box
          display="flex"
          gap={1}
          sx={{
            position: 'relative',
            width: '100%',
          }}
        >
          {/* Hidden input for actual value */}
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={internalValue}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onSelect={handleSelect}
            onKeyUp={handleSelect}
            onMouseUp={handleSelect}
            aria-label={ariaLabel || 'Confirmation Code'}
            aria-required={ariaRequired}
            aria-invalid={ariaInvalid}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '50px',
              opacity: 0,
              cursor: 'text',
              fontSize: '16px',
              letterSpacing: '39px',
              paddingLeft: '15px',
              zIndex: 1,
            }}
            {...props}
          />

          {/* Visual segments */}
          {digits.map((digit, index) => (
            <Box
              key={index}
              sx={{
                border: '1px solid black',
                borderRadius: 1,
                width: 40,
                height: 50,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'black',
                backgroundColor: 'white',
                fontSize: '16px',
                userSelect: 'none',
                pointerEvents: 'none',
                position: 'relative',
                '&::after':
                  isFocused && index === cursorPosition
                    ? {
                        content: '""',
                        position: 'absolute',
                        right:
                          index === cursorPosition && cursorPosition > 0
                            ? '0'
                            : 'auto',
                        left:
                          index === cursorPosition && cursorPosition === 0
                            ? '0'
                            : 'auto',
                        transform: 'none',
                        top: '15%',
                        height: '70%',
                        width: '1px',
                        backgroundColor: 'black',
                        animation: 'blink 1s step-end infinite',
                      }
                    : {},
                '@keyframes blink': {
                  'from, to': {
                    opacity: 1,
                  },
                  '50%': {
                    opacity: 0,
                  },
                },
              }}
            >
              {digit.trim()}
            </Box>
          ))}
        </Box>

        <Box
          width={20}
          height={20}
          borderRadius="50%"
          bgcolor={isValid ? grey.main : red.main}
          position="static"
          role="status"
          aria-label={isValid ? 'Code is valid' : 'Code is invalid'}
          alignSelf="center"
          marginRight={2}
        />
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
