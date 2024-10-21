import React, { useMemo } from 'react'
import QRCode from 'react-qr-code'
import { Box, Typography, Paper, Theme, CircularProgress } from '@mui/material'
import { SxProps } from '@mui/system'
import { authenticator } from 'otplib'

/**
 * Props for the QRCodeComponent
 * @typedef {Object} QRCodeProps
 * @property {string} username - The username for the MFA setup
 * @property {string} appName - The name of the application for MFA
 * @property {number} [size] - The size of the QR code in pixels
 * @property {string} [title] - An optional title to display above the QR code
 * @property {SxProps<Theme>} [sx] - Custom styles to apply to the component
 * @property {(secret: string) => void} [onSecretGenerated] - Callback function to receive the generated secret
 */
export interface QRCodeProps {
  username: string
  appName: string
  size?: number
  title?: string
  sx?: SxProps<Theme>
  onSecretGenerated?: (secret: string) => void
}

/**
 * A component that displays a QR code for MFA setup with Material-UI styling
 * @param {QRCodeProps} props - The props for the component
 * @returns {React.ReactElement} The rendered QR code component
 */
const QRCodeComponent: React.FC<QRCodeProps> = React.memo(
  ({ username, appName, size = 256, title, sx, onSecretGenerated }) => {
    // Generate the secret and OTP auth URL
    const { secret, otpAuth } = useMemo(() => {
      const generatedSecret = authenticator.generateSecret()
      const otpAuthUrl = authenticator.keyuri(
        encodeURIComponent(username),
        encodeURIComponent(appName),
        generatedSecret
      )
      if (onSecretGenerated) {
        onSecretGenerated(generatedSecret)
      }
      return { secret: generatedSecret, otpAuth: otpAuthUrl }
    }, [username, appName, onSecretGenerated])

    // Calculate responsive size
    const responsiveSize = useMemo(() => {
      return Math.min(size, window.innerWidth - 32) // 32px for padding
    }, [size])

    if (!otpAuth) {
      return (
        <Box sx={{ ...sx, p: 2 }} role="alert">
          <Typography color="error">
            Error: Failed to generate QR code
          </Typography>
        </Box>
      )
    }

    return (
      <Paper
        elevation={3}
        sx={{
          ...sx,
          p: 3,
          display: 'inline-block',
          maxWidth: '100%',
          boxSizing: 'border-box',
        }}
      >
        {title && (
          <Typography variant="h6" gutterBottom align="center">
            {title}
          </Typography>
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
          <React.Suspense
            fallback={
              <CircularProgress
                size={responsiveSize / 4}
                aria-label="Loading QR Code"
              />
            }
          >
            <QRCode
              value={otpAuth}
              size={responsiveSize}
              style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
              aria-label={`QR Code for ${title || 'MFA Setup'}`}
            />
          </React.Suspense>
        </Box>
        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          Secret: {secret}
        </Typography>
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

  return authenticator.verify({ token, secret })
}
