import React from 'react'
import { Box, Paper } from '@mui/material'
import Typography from '../../../../components/Typography'
import CustomButton from '../../../../components/Button'

/**
 * Props for the SimplePricingSummary component.
 */
interface SimplePricingSummaryProps {
  /** Width of the pricing summary card */
  width?: string
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
}

/**
 * SimplePricingSummary component renders a card displaying a simple pricing summary,
 * including subtotal, total, proceed button, and additional information about taxes and discounts.
 */
const SimplePricingSummary: React.FC<SimplePricingSummaryProps> = ({
  width = '100%',
  height,
  subtotal = 'USD 180.00',
  total = 'USD 180.00',
  proceedText = 'Proceed to checkout',
  taxText = 'Taxes may apply before placing an order.',
  discountText = 'Coupons and discounts will apply on the next step.',
  onProceed,
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
        border: '1px solid #e8e8e8',
        width: width,
        minHeight: height,
        padding: '16px',
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
            fontcolor="black"
            fontvariant="merriparagraph"
          />
          <Typography
            text={subtotal}
            fontcolor="black"
            fontvariant="merriparagraph"
          />
        </Box>

        {/* Total section */}
        <Box
          sx={{
            borderTop: '1px solid #e8e8e8',
            marginTop: '8px',
            paddingTop: '8px',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography text="TOTAL" fontcolor="black" fontvariant="merrih5" />
            <Typography text={total} fontcolor="black" fontvariant="merrih5" />
          </Box>
        </Box>
      </Box>

      {/* Proceed button */}
      <Box sx={{ marginTop: '16px' }}>
        <CustomButton
          text={proceedText}
          variant="contained"
          backgroundcolor="black"
          fontcolor="white"
          fontvariant="merriparagraph"
          onClick={onProceed}
          width="100%"
        />
      </Box>

      {/* Tax information */}
      <Typography
        text={taxText}
        fontcolor="black"
        fontvariant="merriparagraph"
        sx={{ marginTop: '8px', fontSize: '12px' }}
      />

      {/* Discount information */}
      <Typography
        text={discountText}
        fontcolor="black"
        fontvariant="merriparagraph"
        sx={{ marginTop: '4px', fontSize: '12px' }}
      />
    </Paper>
  )
}

export default SimplePricingSummary
