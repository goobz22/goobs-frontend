// src/components/Card/variants/detailedpricingsummary/index.tsx

import React from 'react'
import { Box, Paper, keyframes, alpha } from '@mui/material'
import Typography from '../../../../components/Typography'
import CustomButton from '../../../../components/Button'

// --------------------------------------------------------------------------
// SACRED THEMING CONSTANTS AND ANIMATIONS
// --------------------------------------------------------------------------

const SACRED_GLYPHS = ['𓊹', '𓊺', '𓊻', '𓋹', '𓌻', '𓍿']

const sacredGlow = keyframes`
  0% { box-shadow: 0 0 5px rgba(255, 215, 0, 0.3), inset 0 0 10px rgba(255, 215, 0, 0.1); }
  50% { box-shadow: 0 0 15px rgba(255, 215, 0, 0.5), inset 0 0 20px rgba(255, 215, 0, 0.2); }
  100% { box-shadow: 0 0 5px rgba(255, 215, 0, 0.3), inset 0 0 10px rgba(255, 215, 0, 0.1); }
`

const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-3px); }
  100% { transform: translateY(0px); }
`

/**
 * Props for the DetailedPricingSummary component.
 */
interface DetailedPricingSummaryProps {
  /** Width of the pricing summary card */
  width?: string
  /** Height of the pricing summary card */
  height?: string | number
  /** Description of the product */
  product?: string
  /** Name of the vendor */
  vendor?: string
  /** Price from the vendor */
  vendorPrice?: string
  /** Subtotal of the order */
  subtotal?: string
  /** VAT amount */
  vat?: string
  /** Total price of the order */
  total?: string
  /** Text for the proceed button */
  proceedText?: string
  /** Function to call when the proceed button is clicked */
  onProceed?: () => void
  /** Enable Egyptian/Sacred theming */
  sacredtheme?: boolean
}

/**
 * DetailedPricingSummary component renders a card with detailed pricing information.
 * It displays product details, vendor information, subtotal, VAT, total, and a proceed button.
 */
const DetailedPricingSummary: React.FC<DetailedPricingSummaryProps> = ({
  height,
  product = 'Goobs Repo Unlimited × 1',
  vendor = 'Technologies Unlimited',
  vendorPrice = '$180.00',
  subtotal = '$180.00',
  vat = '$0.00',
  total = '$180.00',
  proceedText = 'Proceed to checkout',
  onProceed,
  sacredtheme = false,
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
        border: sacredtheme
          ? `1px solid ${alpha('#FFD700', 0.3)}`
          : '1px solid #e8e8e8',
        minHeight: height,
        padding: '16px',
        backgroundColor: sacredtheme ? '#0a0a0a' : 'white',
        overflow: 'hidden',
        ...(sacredtheme && {
          backgroundImage: `
            linear-gradient(rgba(255, 215, 0, 0.02), rgba(255, 215, 0, 0.02)),
            radial-gradient(circle at bottom left, rgba(255, 215, 0, 0.05) 0%, transparent 50%)
          `,
          animation: `${sacredGlow} 3s ease-in-out infinite`,
          '&::before': {
            content: `"${SACRED_GLYPHS[0]}"`,
            position: 'absolute',
            top: '8px',
            right: '8px',
            color: alpha('#FFD700', 0.2),
            fontSize: '24px',
            animation: `${floatAnimation} 4s ease-in-out infinite`,
          },
        }),
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        {/* Product section */}
        <Typography
          text="Product"
          fontcolor={sacredtheme ? '#FFD700' : 'black'}
          fontvariant="merriparagraph"
          sx={
            sacredtheme
              ? {
                  fontFamily: '"Cinzel", serif',
                  fontWeight: 600,
                  letterSpacing: '1px',
                  textShadow: '0 0 8px rgba(255, 215, 0, 0.5)',
                }
              : undefined
          }
        />
        <Typography
          text={product}
          fontcolor={sacredtheme ? alpha('#FFD700', 0.8) : 'black'}
          fontvariant="merriparagraph"
          sx={{ marginTop: '8px' }}
        />

        {/* Vendor section */}
        <Box sx={{ marginTop: '16px' }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography
              text="Vendor:"
              fontcolor={sacredtheme ? alpha('#FFD700', 0.9) : 'black'}
              fontvariant="merriparagraph"
            />
            <Typography
              text={vendor}
              fontcolor={sacredtheme ? alpha('#FFD700', 0.8) : 'black'}
              fontvariant="merriparagraph"
            />
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}
          >
            <Typography
              text={vendorPrice}
              fontcolor={sacredtheme ? '#FFD700' : 'black'}
              fontvariant="merriparagraph"
              sx={
                sacredtheme
                  ? {
                      fontWeight: 600,
                      textShadow: '0 0 6px rgba(255, 215, 0, 0.4)',
                    }
                  : undefined
              }
            />
          </Box>
        </Box>

        {/* Subtotal section */}
        <Box sx={{ marginTop: '16px' }}>
          <Typography
            text="Subtotal"
            fontcolor={sacredtheme ? alpha('#FFD700', 0.9) : 'black'}
            fontvariant="merriparagraph"
          />
          <Typography
            text={subtotal}
            fontcolor={sacredtheme ? alpha('#FFD700', 0.8) : 'black'}
            fontvariant="merriparagraph"
            align="right"
          />
        </Box>

        {/* VAT section */}
        <Box sx={{ marginTop: '8px' }}>
          <Typography
            text="VAT"
            fontcolor={sacredtheme ? alpha('#FFD700', 0.9) : 'black'}
            fontvariant="merriparagraph"
          />
          <Typography
            text={vat}
            fontcolor={sacredtheme ? alpha('#FFD700', 0.8) : 'black'}
            fontvariant="merriparagraph"
            align="right"
          />
        </Box>

        {/* Total section */}
        <Box
          sx={{
            borderTop: sacredtheme
              ? `1px solid ${alpha('#FFD700', 0.3)}`
              : '1px solid #e8e8e8',
            marginTop: '8px',
            paddingTop: '8px',
            ...(sacredtheme && {
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
              text="Total"
              fontcolor={sacredtheme ? '#FFD700' : 'black'}
              fontvariant="merrih5"
              sx={
                sacredtheme
                  ? {
                      fontFamily: '"Cinzel", serif',
                      fontWeight: 700,
                      textShadow: '0 0 10px rgba(255, 215, 0, 0.6)',
                    }
                  : undefined
              }
            />
            <Typography
              text={total}
              fontcolor={sacredtheme ? '#FFD700' : 'black'}
              fontvariant="merrih5"
              sx={
                sacredtheme
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
          backgroundcolor={sacredtheme ? alpha('#000000', 0.9) : 'black'}
          fontcolor={sacredtheme ? '#FFD700' : 'white'}
          fontvariant="merriparagraph"
          onClick={onProceed}
          width="100%"
          sacredtheme={sacredtheme}
        />
      </Box>
    </Paper>
  )
}

export default DetailedPricingSummary
