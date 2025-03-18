import React, { useMemo, useEffect } from 'react'
import QRCode from 'react-qr-code'
import { Box, Paper } from '@mui/material'
import { SxProps } from '@mui/system'
import { authenticator } from 'otplib'
import Typography from '../Typography'
import CustomButton, { CustomButtonProps } from '../Button'
import { CheckCircleOutline } from '@mui/icons-material'
import ConfirmationCodeInputs, {
  ConfirmationCodeInputsProps,
} from '../ConfirmationCodeInput'

/**
 * Props for the QRCodeComponent
 * @typedef {Object} QRCodeProps
 * @property {string} username - The username/email for the MFA setup
 * @property {string} [appName] - The name of the application for MFA (defaults to "ThothOS")
 * @property {number} [size] - The size of the QR code in pixels
 * @property {string} [title] - An optional title to display above the QR code
 * @property {SxProps} [sx] - Custom styles to apply to the component
 * @property {(secret: string) => void} [onSecretGenerated] - Callback function to receive the generated secret
 * @property {boolean} [showVerifyButton] - Whether to show the verify button
 * @property {() => void | Promise<void>} [onVerify] - Callback function for when the Verify button is clicked
 * @property {() => void | Promise<void>} [onDisableVerification] - Required callback function for when verification is disabled
 * @property {Partial<CustomButtonProps>} [verifyButtonProps] - Custom props for the Verify button
 * @property {Partial<CustomButtonProps>} [disableVerificationButtonProps] - Custom props for the Disable Verification button
 * @property {boolean} [showSuccessState] - Whether to show the success state UI
 * @property {string} [successMessage] - Custom success message to display
 * @property {boolean} [showConfirmationInput] - Whether to show the confirmation code input
 * @property {string} [confirmationCode] - The current confirmation code value
 * @property {(value: string) => void} [onConfirmationCodeChange] - Callback for when confirmation code changes
 * @property {ConfirmationCodeInputsProps} [confirmationCodeProps] - Custom props for the confirmation code input
 * @property {boolean} [showDisableConfirmation] - Whether to show the disable confirmation state
 */
export interface QRCodeProps {
  username: string
  appName?: string
  size?: number
  title?: string
  sx?: SxProps
  onSecretGenerated?: (secret: string) => void
  showVerifyButton?: boolean
  onVerify?: () => void | Promise<void>
  onDisableVerification?: () => void | Promise<void>
  verifyButtonProps?: Partial<CustomButtonProps>
  disableVerificationButtonProps?: Partial<CustomButtonProps>
  showSuccessState?: boolean
  successMessage?: string
  showConfirmationInput?: boolean
  confirmationCode?: string
  onConfirmationCodeChange?: (value: string) => void
  confirmationCodeProps?: Partial<ConfirmationCodeInputsProps>
  showDisableConfirmation?: boolean
}

/**
 * A component that displays a QR code for MFA setup with Material-UI styling
 * @param {QRCodeProps} props - The props for the component
 * @returns {React.ReactElement} The rendered QR code component
 */
const QRCodeComponent: React.FC<QRCodeProps> = React.memo(
  ({
    username,
    appName = 'ThothOS',
    size = 256,
    title,
    sx,
    onSecretGenerated,
    showVerifyButton = false,
    onVerify,
    onDisableVerification,
    verifyButtonProps = {},
    disableVerificationButtonProps = {},
    showSuccessState = false,
    successMessage = 'Verification Successful',
    showConfirmationInput = false,
    confirmationCode = '',
    onConfirmationCodeChange,
    confirmationCodeProps = {},
    showDisableConfirmation = false,
  }) => {
    // Generate the secret and OTP auth URL
    const { secret, otpAuth } = useMemo(() => {
      const generatedSecret = authenticator.generateSecret()

      // We're using the raw username (likely email) directly instead of "your%20account"
      const otpAuthUrl = authenticator.keyuri(
        username, // Use the raw username/email without encoding
        appName, // Now defaulting to "ThothOS"
        generatedSecret
      )
      return { secret: generatedSecret, otpAuth: otpAuthUrl }
    }, [username, appName])

    // Move the callback to useEffect to avoid state updates during render
    useEffect(() => {
      if (onSecretGenerated && secret) {
        onSecretGenerated(secret)
      }
    }, [secret, onSecretGenerated])

    // Calculate responsive size
    const responsiveSize = useMemo(() => {
      return Math.min(size, window.innerWidth - 32) // 32px for padding
    }, [size])

    if (!otpAuth) {
      return (
        <Box sx={{ ...sx, p: 2 }} role="alert">
          <Typography
            text="Error: Failed to generate QR code"
            fontcolor="error"
            fontvariant="merriparagraph"
          />
        </Box>
      )
    }

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
          <Typography
            text={successMessage}
            fontvariant="merrih5"
            align="center"
          />
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
                if (onDisableVerification) void onDisableVerification()
              }}
            />
          </Box>
        </Box>
      )
    }

    // If showing disable confirmation state, render QR with confirmation input
    if (showDisableConfirmation) {
      return (
        <Paper
          elevation={3}
          sx={{
            p: 3,
            display: 'inline-block',
            maxWidth: '100%',
            boxSizing: 'border-box',
            ...sx,
          }}
        >
          {title && (
            <Typography
              text={title}
              fontvariant="merrih5"
              align="center"
              gutterBottom
            />
          )}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: responsiveSize,
              height: responsiveSize,
              margin: 'auto',
            }}
          >
            <QRCode
              value={otpAuth}
              size={responsiveSize}
              style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
              aria-label={`QR Code for ${title || 'MFA Setup'}`}
              data-testid="mfa-qrcode"
            />
          </Box>
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography
              text={`${appName}: ${username}`}
              fontvariant="merriparagraph"
              align="center"
            />
          </Box>

          <Box
            sx={{
              mt: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <ConfirmationCodeInputs
              isValid={false}
              codeLength={6}
              value={confirmationCode}
              onChange={onConfirmationCodeChange}
              showActionButtons={false}
              onDisableVerification={() => {}}
              {...confirmationCodeProps}
            />

            <CustomButton
              text="Verify & Disable"
              fontcolor="white"
              backgroundcolor="black"
              width="100%"
              height="40px"
              {...verifyButtonProps}
              onClick={() => {
                if (onVerify) void onVerify()
              }}
              disableButton={
                verifyButtonProps?.disableButton ||
                (confirmationCode.length < 6 ? 'true' : 'false')
              }
            />
          </Box>
        </Paper>
      )
    }

    // Default QR code view with optional confirmation input and buttons
    return (
      <Paper
        elevation={3}
        sx={{
          p: 3,
          display: 'inline-block',
          maxWidth: '100%',
          boxSizing: 'border-box',
          ...sx,
        }}
      >
        {title && (
          <Typography
            text={title}
            fontvariant="merrih5"
            align="center"
            gutterBottom
          />
        )}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: responsiveSize,
            height: responsiveSize,
            margin: 'auto',
          }}
        >
          <QRCode
            value={otpAuth}
            size={responsiveSize}
            style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
            aria-label={`QR Code for ${title || 'MFA Setup'}`}
            data-testid="mfa-qrcode"
          />
        </Box>
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography
            text={`${appName}: ${username}`}
            fontvariant="merriparagraph"
            align="center"
          />
        </Box>

        {showConfirmationInput && (
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
            <ConfirmationCodeInputs
              isValid={false}
              codeLength={6}
              value={confirmationCode}
              onChange={onConfirmationCodeChange}
              showActionButtons={false}
              onDisableVerification={() => {}}
              {...confirmationCodeProps}
            />
          </Box>
        )}

        {showVerifyButton && (
          <Box
            sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}
          >
            <CustomButton
              text="Verify Code"
              fontcolor="white"
              backgroundcolor="black"
              width="100%"
              height="40px"
              {...verifyButtonProps}
              onClick={() => {
                if (onVerify) void onVerify()
              }}
              disableButton={
                verifyButtonProps?.disableButton ||
                (showConfirmationInput && confirmationCode.length < 6
                  ? 'true'
                  : 'false')
              }
            />
          </Box>
        )}
      </Paper>
    )
  }
)

QRCodeComponent.displayName = 'QRCodeComponent'

export default QRCodeComponent

/**
 * Verifies a MFA token against a secret.
 *
 * @param token - The token to verify.
 * @param secret - The secret key to verify against.
 * @returns A boolean indicating whether the token is valid.
 * @throws Error if inputs are invalid.
 */
export function verifyMFAToken(token: string, secret: string): boolean {
  if (!token || typeof token !== 'string') {
    throw new Error('Invalid token')
  }
  if (!secret || typeof secret !== 'string') {
    throw new Error('Invalid secret')
  }

  try {
    // Configure authenticator options to match Microsoft Authenticator
    authenticator.options = {
      window: 1, // Allow codes from 1 step before and after
      step: 30, // 30-second interval for code generation
      digits: 6, // Microsoft Authenticator uses 6-digit codes
    }

    return authenticator.verify({ token, secret })
  } catch (error) {
    console.error('MFA verification error:', error)
    return false
  }
}
