// src/components/Card/variants/productsummary/index.tsx

'use client'

import React, { useState } from 'react'
import { Box, Paper, Switch, keyframes, alpha } from '@mui/material'
import Typography from '../../../../components/Typography'
import CustomButton, { CustomButtonProps } from '../../../../components/Button'

// --------------------------------------------------------------------------
// SACRED THEMING CONSTANTS AND ANIMATIONS
// --------------------------------------------------------------------------

const SACRED_GLYPHS = ['𓊻', '𓋹', '𓌻', '𓍿', '𓅨', '𓂋']

const sacredPulse = keyframes`
  0% { opacity: 0.5; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.05); }
  100% { opacity: 0.5; transform: scale(1); }
`

const sacredSwitchGlow = keyframes`
  0% { box-shadow: 0 0 5px rgba(255, 215, 0, 0.3); }
  50% { box-shadow: 0 0 10px rgba(255, 215, 0, 0.6); }
  100% { box-shadow: 0 0 5px rgba(255, 215, 0, 0.3); }
`

const floatAnimation = keyframes`
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-3px) rotate(180deg); }
  100% { transform: translateY(0px) rotate(360deg); }
`

/**
 * Props for the ProductSummaryCard component.
 */
interface ProductSummaryCardProps {
  /** Title of the product */
  title?: string
  /** Body text */
  body?: string
  /** Annual price of the product */
  annualPrice?: string
  /** Monthly price of the product */
  monthlyPrice?: string
  /** Props for the first button */
  button1Props?: CustomButtonProps
  /** Props for the second button */
  button2Props?: CustomButtonProps
  /** Height of the card */
  height?: string | number
  /** Enable Egyptian/Sacred theming */
  sacredtheme?: boolean
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
  height,
  button1Props,
  button2Props,
  sacredtheme = false,
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
        border: sacredtheme
          ? `1px solid ${alpha('#FFD700', 0.3)}`
          : '1px solid #e8e8e8',
        height: height,
        backgroundColor: sacredtheme ? '#0a0a0a' : 'white',
        overflow: 'hidden',
        ...(sacredtheme && {
          backgroundImage: `
            linear-gradient(rgba(255, 215, 0, 0.02), rgba(255, 215, 0, 0.02)),
            radial-gradient(circle at center, rgba(255, 215, 0, 0.05) 0%, transparent 50%)
          `,
          boxShadow: '0 0 20px rgba(255, 215, 0, 0.2)',
          '&::before': {
            content: `"${SACRED_GLYPHS[1]}"`,
            position: 'absolute',
            bottom: '16px',
            left: '16px',
            color: alpha('#FFD700', 0.15),
            fontSize: '64px',
            animation: `${floatAnimation} 10s ease-in-out infinite`,
            zIndex: 0,
          },
        }),
      }}
    >
      {/* Title and Price section */}
      <Box
        sx={{
          borderBottom: sacredtheme
            ? `1px solid ${alpha('#FFD700', 0.3)}`
            : '1px solid #e8e8e8',
          width: '100%',
          paddingLeft: '15px',
          paddingRight: '15px',
          paddingBottom: '10px',
          paddingTop: '10px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'relative',
          zIndex: 1,
          ...(sacredtheme && {
            background: `linear-gradient(to right, ${alpha('#FFD700', 0.05)}, transparent)`,
          }),
        }}
      >
        <Typography
          text={title}
          fontcolor={sacredtheme ? '#FFD700' : 'black'}
          fontvariant="merrih5"
          sx={
            sacredtheme
              ? {
                  fontFamily: '"Cinzel", serif',
                  fontWeight: 600,
                  letterSpacing: '1px',
                  textShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
                }
              : undefined
          }
        />
        <Typography
          text={isAnnualPricing ? `$${annualPrice}` : `$${monthlyPrice}`}
          fontcolor={sacredtheme ? '#FFD700' : 'primary'}
          fontvariant="merrih6"
          sx={
            sacredtheme
              ? {
                  fontWeight: 700,
                  textShadow: '0 0 8px rgba(255, 215, 0, 0.6)',
                  animation: `${sacredPulse} 2s ease-in-out infinite`,
                }
              : undefined
          }
        />
      </Box>

      {/* Body text section */}
      {body && (
        <Box sx={{ padding: '16px 15px', position: 'relative', zIndex: 1 }}>
          <Typography
            text={body}
            fontcolor={sacredtheme ? alpha('#FFD700', 0.8) : 'black'}
            fontvariant="merriparagraph"
            sx={
              sacredtheme
                ? {
                    letterSpacing: '0.5px',
                  }
                : undefined
            }
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
          marginTop: 'auto',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* First button */}
        {button1Props && (
          <CustomButton {...button1Props} sacredtheme={sacredtheme} />
        )}

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
            fontcolor={sacredtheme ? alpha('#FFD700', 0.7) : 'black'}
            sx={{
              marginRight: '8px',
              ...(sacredtheme &&
                !isAnnualPricing && {
                  color: '#FFD700',
                  textShadow: '0 0 6px rgba(255, 215, 0, 0.5)',
                }),
            }}
          />
          <Switch
            checked={isAnnualPricing}
            onChange={handlePricingToggle}
            color="primary"
            sx={
              sacredtheme
                ? {
                    '& .MuiSwitch-switchBase': {
                      color: alpha('#FFD700', 0.7),
                      '&.Mui-checked': {
                        color: '#FFD700',
                        '& + .MuiSwitch-track': {
                          backgroundColor: alpha('#FFD700', 0.5),
                          opacity: 1,
                          animation: `${sacredSwitchGlow} 2s ease-in-out infinite`,
                        },
                      },
                    },
                    '& .MuiSwitch-track': {
                      backgroundColor: alpha('#FFD700', 0.3),
                      opacity: 1,
                    },
                  }
                : undefined
            }
          />
          <Typography
            text="Annual"
            fontvariant="merriparagraph"
            fontcolor={sacredtheme ? alpha('#FFD700', 0.7) : 'black'}
            sx={{
              marginLeft: '8px',
              ...(sacredtheme &&
                isAnnualPricing && {
                  color: '#FFD700',
                  textShadow: '0 0 6px rgba(255, 215, 0, 0.5)',
                }),
            }}
          />
        </Box>

        {/* Second button */}
        {button2Props && (
          <CustomButton {...button2Props} sacredtheme={sacredtheme} />
        )}
      </Box>
    </Paper>
  )
}

export default ProductSummaryCard
