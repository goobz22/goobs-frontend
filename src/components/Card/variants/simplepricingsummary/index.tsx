// src/components/Card/variants/simplepricingsummary/index.tsx

import React from 'react'
import { Box, Paper, keyframes, alpha } from '@mui/material'
import Typography from '../../../../components/Typography'
import CustomButton from '../../../../components/Button'

// --------------------------------------------------------------------------
// SACRED THEMING CONSTANTS AND ANIMATIONS
// --------------------------------------------------------------------------

const SACRED_GLYPHS = ['𓏭', '𓊵', '𓁟', '𓂀']

const sacredGlow = keyframes`
  0% { box-shadow: 0 0 5px rgba(255, 215, 0, 0.3), inset 0 0 10px rgba(255, 215, 0, 0.1); }
  50% { box-shadow: 0 0 15px rgba(255, 215, 0, 0.5), inset 0 0 20px rgba(255, 215, 0, 0.2); }
  100% { box-shadow: 0 0 5px rgba(255, 215, 0, 0.3), inset 0 0 10px rgba(255, 215, 0, 0.1); }
`

const glyphRotate = keyframes`
  0% { transform: rotate(0deg) scale(1); opacity: 0.2; }
  50% { transform: rotate(180deg) scale(1.1); opacity: 0.4; }
  100% { transform: rotate(360deg) scale(1); opacity: 0.2; }
`

/**
 * Props for the SimplePricingSummary component.
 */
interface SimplePricingSummaryProps {
  /** Height of the pricing summary card */
  height?: string | number
  /** Subtotal amount */
  subtotal?: string
  /** Total amount */
  total?: string
  /** Text for the proceed button */
  proceedText?: string
  /** Text explaining tax information */
  taxText?: string
  /** Text explaining discount information */
  discountText?: string
  /** Callback function for the proceed button */
  onProceed?: () => void
  /** Enable Egyptian/Sacred theming */
  sacredTheme?: boolean
}

/**
 * SimplePricingSummary component renders a card displaying a simple pricing summary,
 * including subtotal, total, proceed button, and additional information about taxes and discounts.
 */
const SimplePricingSummary: React.FC<SimplePricingSummaryProps> = ({
  height,
  subtotal = 'USD 180.00',
  total = 'USD 180.00',
  proceedText = 'Proceed to checkout',
  taxText = 'Taxes may apply before placing an order.',
  discountText = 'Coupons and discounts will apply on the next step.',
  onProceed,
  sacredTheme = false,
}) => {
  return (
    <Paper
      elevation={1}
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        border: sacredTheme
          ? `1px solid ${alpha('#FFD700', 0.3)}`
          : '1px solid #e8e8e8',
        minHeight: height,
        padding: '16px',
        backgroundColor: sacredTheme ? '#0a0a0a' : 'white',
        overflow: 'hidden',
        ...(sacredTheme && {
          backgroundImage: `
            linear-gradient(rgba(255, 215, 0, 0.02), rgba(255, 215, 0, 0.02)),
            radial-gradient(circle at bottom right, rgba(255, 215, 0, 0.05) 0%, transparent 50%)
          `,
          animation: `${sacredGlow} 4s ease-in-out infinite`,
          '&::before': {
            content: `"${SACRED_GLYPHS[2]}"`,
            position: 'absolute',
            top: '16px',
            right: '16px',
            color: alpha('#FFD700', 0.2),
            fontSize: '32px',
            animation: `${glyphRotate} 8s ease-in-out infinite`,
          },
        }),
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        {/* Subtotal section */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography
            text="Subtotal"
            fontcolor={sacredTheme ? alpha('#FFD700', 0.9) : 'black'}
            fontvariant="merriparagraph"
          />
          <Typography
            text={subtotal}
            fontcolor={sacredTheme ? alpha('#FFD700', 0.8) : 'black'}
            fontvariant="merriparagraph"
          />
        </Box>

        {/* Total section */}
        <Box
          sx={{
            borderTop: sacredTheme
              ? `1px solid ${alpha('#FFD700', 0.3)}`
              : '1px solid #e8e8e8',
            marginTop: '8px',
            paddingTop: '8px',
            ...(sacredTheme && {
              background: `linear-gradient(to right, ${alpha('#FFD700', 0.05)}, transparent)`,
            }),
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography
              text="TOTAL"
              fontcolor={sacredTheme ? '#FFD700' : 'black'}
              fontvariant="merrih5"
              sx={
                sacredTheme
                  ? {
                      fontFamily: '"Cinzel", serif',
                      fontWeight: 700,
                      letterSpacing: '2px',
                      textShadow: '0 0 10px rgba(255, 215, 0, 0.6)',
                    }
                  : undefined
              }
            />
            <Typography
              text={total}
              fontcolor={sacredTheme ? '#FFD700' : 'black'}
              fontvariant="merrih5"
              sx={
                sacredTheme
                  ? {
                      fontFamily: '"Cinzel", serif',
                      fontWeight: 700,
                      textShadow: '0 0 10px rgba(255, 215, 0, 0.6)',
                    }
                  : undefined
              }
            />
          </Box>
        </Box>
      </Box>

      {/* Proceed button */}
      <Box sx={{ marginTop: '16px' }}>
        <CustomButton
          text={proceedText}
          variant="contained"
          backgroundcolor={sacredTheme ? alpha('#000000', 0.9) : 'black'}
          fontcolor={sacredTheme ? '#FFD700' : 'white'}
          fontvariant="merriparagraph"
          onClick={onProceed}
          width="100%"
          sacredTheme={sacredTheme}
        />
      </Box>

      {/* Tax information */}
      <Typography
        text={taxText}
        fontcolor={sacredTheme ? alpha('#FFD700', 0.6) : 'black'}
        fontvariant="merriparagraph"
        sx={{
          marginTop: '8px',
          fontSize: '12px',
          ...(sacredTheme && {
            fontStyle: 'italic',
          }),
        }}
      />

      {/* Discount information */}
      <Typography
        text={discountText}
        fontcolor={sacredTheme ? alpha('#FFD700', 0.6) : 'black'}
        fontvariant="merriparagraph"
        sx={{
          marginTop: '4px',
          fontSize: '12px',
          ...(sacredTheme && {
            fontStyle: 'italic',
          }),
        }}
      />
    </Paper>
  )
}

export default SimplePricingSummary
