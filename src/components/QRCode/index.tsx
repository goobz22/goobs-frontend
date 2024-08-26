import React, { useMemo } from 'react'
import QRCode from 'react-qr-code'
import { Box, Typography, Paper, Theme, CircularProgress } from '@mui/material'
import { SxProps } from '@mui/system'

/**
 * Props for the QRCodeComponent
 * @typedef {Object} QRCodeProps
 * @property {string} value - The value to be encoded in the QR code
 * @property {number} [size] - The size of the QR code in pixels
 * @property {string} [title] - An optional title to display above the QR code
 * @property {SxProps<Theme>} [sx] - Custom styles to apply to the component
 */
export interface QRCodeProps {
  value: string
  size?: number
  title?: string
  sx?: SxProps<Theme>
}

/**
 * A component that displays a QR code with Material-UI styling
 * @param {QRCodeProps} props - The props for the component
 * @returns {React.ReactElement} The rendered QR code component
 */
const QRCodeComponent: React.FC<QRCodeProps> = React.memo(
  ({ value, size = 256, title, sx }) => {
    // Validate the QR code value
    const isValidValue = useMemo(() => {
      if (!value) return false
      try {
        // Check if the value is a valid URL
        new URL(value)
        return true
      } catch {
        // If not a URL, check if it's a non-empty string
        return typeof value === 'string' && value.trim().length > 0
      }
    }, [value])

    // Calculate responsive size
    const responsiveSize = useMemo(() => {
      return Math.min(size, window.innerWidth - 32) // 32px for padding
    }, [size])

    if (!isValidValue) {
      return (
        <Box sx={{ ...sx, p: 2 }} role="alert">
          <Typography color="error">
            Error: Invalid or empty QR code value
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
              value={value}
              size={responsiveSize}
              style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
              aria-label={`QR Code for ${title || value}`}
            />
          </React.Suspense>
        </Box>
      </Paper>
    )
  }
)

QRCodeComponent.displayName = 'QRCodeComponent'

export default QRCodeComponent
