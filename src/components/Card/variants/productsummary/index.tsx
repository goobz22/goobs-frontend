import React, { useState } from 'react'
import { Box, Paper, Switch } from '@mui/material'
import { CardProps } from '../../index'
import Typography from '../../../../components/Typography'
import CustomButton, { CustomButtonProps } from '../../../../components/Button'

/**
 * Props for the ProductSummaryCard component.
 * Extends CardProps and includes additional custom properties.
 */
interface ProductSummaryCardProps extends CardProps {
  /** Annual price of the product */
  annualPrice?: string
  /** Monthly price of the product */
  monthlyPrice?: string
  /** Props for the first button */
  button1Props?: CustomButtonProps
  /** Props for the second button */
  button2Props?: CustomButtonProps
}

/**
 * ProductSummaryCard component renders a card displaying a summary of a product,
 * including its title, description, pricing options, and action buttons.
 */
const ProductSummaryCard: React.FC<ProductSummaryCardProps> = ({
  title,
  body,
  annualPrice,
  monthlyPrice,
  width,
  height,
  button1Props,
  button2Props,
  ...rest
}) => {
  /** State to track whether annual or monthly pricing is selected */
  const [isAnnualPricing, setIsAnnualPricing] = useState(true)

  /**
   * Toggles between annual and monthly pricing
   */
  const handlePricingToggle = () => {
    setIsAnnualPricing(!isAnnualPricing)
  }

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
        height: height,
        ...rest.sx,
      }}
    >
      {/* Title and Price section */}
      <Box
        sx={{
          borderBottom: '1px solid #e8e8e8',
          width: '100%',
          paddingLeft: '15px',
          paddingRight: '15px',
          paddingBottom: '10px',
          paddingTop: '10px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography text={title} fontcolor="black" fontvariant="merrih5" />
        <Typography
          text={isAnnualPricing ? `$${annualPrice}` : `$${monthlyPrice}`}
          fontcolor="primary"
          fontvariant="merrih6"
        />
      </Box>

      {/* Body text section */}
      {body && (
        <Box sx={{ padding: '16px 15px' }}>
          <Typography
            text={body}
            fontcolor="black"
            fontvariant="merriparagraph"
          />
        </Box>
      )}

      {/* Buttons and Pricing Toggle section */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingLeft: '15px',
          paddingRight: '15px',
          paddingBottom: '15px',
        }}
      >
        {/* First button */}
        {button1Props && <CustomButton {...button1Props} />}

        {/* Pricing toggle switch */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography
            text="Monthly"
            fontvariant="merriparagraph"
            fontcolor="black"
            sx={{ marginRight: '8px' }}
          />
          <Switch
            checked={isAnnualPricing}
            onChange={handlePricingToggle}
            color="primary"
          />
          <Typography
            text="Annual"
            fontvariant="merriparagraph"
            fontcolor="black"
            sx={{ marginLeft: '8px' }}
          />
        </Box>

        {/* Second button */}
        {button2Props && <CustomButton {...button2Props} />}
      </Box>
    </Paper>
  )
}

export default ProductSummaryCard
