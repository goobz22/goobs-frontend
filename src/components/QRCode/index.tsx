import React, { useMemo, useEffect } from 'react'
import QRCode from 'react-qr-code'
import { Box, Paper } from '@mui/material'
import { SxProps } from '@mui/system'
import { authenticator } from 'otplib'
import Typography from '../Typography'

/**
 * Props for the QRCodeComponent
 * @typedef {Object} QRCodeProps
 * @property {string} username - The username/email for the MFA setup
 * @property {string} [appName] - The name of the application for MFA (defaults to "ThothOS")
 * @property {number} [size] - The size of the QR code in pixels
 * @property {string} [title] - An optional title to display above the QR code
 * @property {SxProps} [sx] - Custom styles to apply to the component
 * @property {(secret: string) => void} [onSecretGenerated] - Callback function to receive the generated secret
 */
export interface QRCodeProps {
  username: string
  appName?: string
  size?: number
  title?: string
  sx?: SxProps
  onSecretGenerated?: (secret: string) => void
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
      digits: 6, // Microsoft Authenticator uses 6-digit codes
      step: 30, // 30-second interval for code generation
    }

    return authenticator.verify({ token, secret })
  } catch (error) {
    console.error('MFA verification error:', error)
    return false
  }
}
