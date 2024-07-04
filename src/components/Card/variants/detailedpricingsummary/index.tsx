import React from 'react'
import { Box, Paper } from '@mui/material'
import Typography from '../../../../components/Typography'
import CustomButton from '../../../../components/Button'

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
}

/**
 * DetailedPricingSummary component renders a card with detailed pricing information.
 * It displays product details, vendor information, subtotal, VAT, total, and a proceed button.
 */
const DetailedPricingSummary: React.FC<DetailedPricingSummaryProps> = ({
  width = '100%',
  height,
  product = 'Goobs Repo Unlimited × 1',
  vendor = 'Technologies Unlimited',
  vendorPrice = '$180.00',
  subtotal = '$180.00',
  vat = '$0.00',
  total = '$180.00',
  proceedText = 'Proceed to checkout',
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
        {/* Product section */}
        <Typography
          text="Product"
          fontcolor="black"
          fontvariant="merriparagraph"
        />
        <Typography
          text={product}
          fontcolor="black"
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
              fontcolor="black"
              fontvariant="merriparagraph"
            />
            <Typography
              text={vendor}
              fontcolor="black"
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
              fontcolor="black"
              fontvariant="merriparagraph"
            />
          </Box>
        </Box>

        {/* Subtotal section */}
        <Box sx={{ marginTop: '16px' }}>
          <Typography
            text="Subtotal"
            fontcolor="black"
            fontvariant="merriparagraph"
          />
          <Typography
            text={subtotal}
            fontcolor="black"
            fontvariant="merriparagraph"
            align="right"
          />
        </Box>

        {/* VAT section */}
        <Box sx={{ marginTop: '8px' }}>
          <Typography
            text="VAT"
            fontcolor="black"
            fontvariant="merriparagraph"
          />
          <Typography
            text={vat}
            fontcolor="black"
            fontvariant="merriparagraph"
            align="right"
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
            <Typography text="Total" fontcolor="black" fontvariant="merrih5" />
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
    </Paper>
  )
}

export default DetailedPricingSummary
