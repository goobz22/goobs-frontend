// src/components/Card/variants/product/index.tsx

'use client'

import React, { useState } from 'react'
import { Box, Paper, keyframes, alpha } from '@mui/material'
import Typography from '../../../../components/Typography'
import CustomButton from '../../../../components/Button'
import RemoveIcon from '@mui/icons-material/Remove'
import AddIcon from '@mui/icons-material/Add'

// --------------------------------------------------------------------------
// SACRED THEMING CONSTANTS AND ANIMATIONS
// --------------------------------------------------------------------------

const SACRED_GLYPHS = ['𓅓', '𓆄', '𓇳', '𓈖', '𓊹', '𓊺']

const sacredGlow = keyframes`
  0% { box-shadow: 0 0 10px rgba(255, 215, 0, 0.3); }
  50% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.5); }
  100% { box-shadow: 0 0 10px rgba(255, 215, 0, 0.3); }
`

const rotateGlyph = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`

const sacredCounterGlow = keyframes`
  0% { box-shadow: inset 0 0 5px rgba(255, 215, 0, 0.3); }
  50% { box-shadow: inset 0 0 10px rgba(255, 215, 0, 0.5); }
  100% { box-shadow: inset 0 0 5px rgba(255, 215, 0, 0.3); }
`

/**
 * Props for the ProductCard component.
 */
interface ProductCardProps {
  /** Title of the product */
  title?: string
  /** Initial number of developers */
  numDevelopers?: number
  /** Callback function when adding a developer */
  onAddDeveloper?: () => void
  /** Callback function when removing a developer */
  onRemoveDeveloper?: () => void
  /** Number of licenses */
  licenses?: number
  /** Unit price of the product */
  unitPrice?: number
  /** Total price (calculated) */
  total?: number
  /** Callback function for buy action */
  onBuy?: () => void
  /** Callback function for live preview action */
  onLivePreview?: () => void
  /** Array of feature descriptions */
  featuredescriptions?: string[]
  /** Release date of the product */
  releaseDate?: string
  /** Callback function for contact action */
  onContact?: () => void
  /** Creator of the product */
  createdBy?: string
  /** Enable Egyptian/Sacred theming */
  sacredtheme?: boolean
  /** Height of the card */
  height?: string | number
}

/**
 * ProductCard component renders a card displaying detailed information about a product.
 * It includes options to adjust the number of developers/licenses, shows pricing information,
 * and provides actions like Buy Now and Live Preview.
 */
const ProductCard: React.FC<ProductCardProps> = ({
  numDevelopers = 1,
  onAddDeveloper,
  onRemoveDeveloper,
  licenses = 1,
  unitPrice = 180,
  onBuy,
  onLivePreview,
  featuredescriptions = [],
  releaseDate,
  onContact,
  createdBy,
  sacredtheme = false,
  height,
}) => {
  // State for number of developers input
  const [numDevelopersInput, setNumDevelopersInput] = useState(
    numDevelopers.toString()
  )
  // State for number of licenses
  const [numLicenses, setNumLicenses] = useState(licenses)

  /**
   * Handles the action of adding a developer.
   */
  const handleAddDeveloper = () => {
    const newNumDevelopers = parseInt(numDevelopersInput, 10) + 1
    setNumDevelopersInput(newNumDevelopers.toString())
    setNumLicenses(newNumDevelopers)
    onAddDeveloper?.()
  }

  /**
   * Handles the action of removing a developer.
   */
  const handleRemoveDeveloper = () => {
    const newNumDevelopers = parseInt(numDevelopersInput, 10) - 1
    if (newNumDevelopers >= 1) {
      setNumDevelopersInput(newNumDevelopers.toString())
      setNumLicenses(newNumDevelopers)
      onRemoveDeveloper?.()
    }
  }

  /**
   * Handles changes in the number of developers input field.
   */
  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = event.target.value
    setNumDevelopersInput(value)
    setNumLicenses(parseInt(value, 10))
  }

  return (
    <Paper
      elevation={1}
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        padding: '16px',
        minHeight: height,
        backgroundColor: sacredtheme ? '#0a0a0a' : 'white',
        border: sacredtheme
          ? `1px solid ${alpha('#FFD700', 0.3)}`
          : '1px solid #e8e8e8',
        overflow: 'hidden',
        ...(sacredtheme && {
          backgroundImage: `
            linear-gradient(rgba(255, 215, 0, 0.02), rgba(255, 215, 0, 0.02)),
            radial-gradient(circle at top left, rgba(255, 215, 0, 0.05) 0%, transparent 50%)
          `,
          animation: `${sacredGlow} 4s ease-in-out infinite`,
          '&::before': {
            content: `"${SACRED_GLYPHS[4]}"`,
            position: 'absolute',
            top: '16px',
            right: '16px',
            color: alpha('#FFD700', 0.2),
            fontSize: '48px',
            animation: `${rotateGlyph} 20s linear infinite`,
            zIndex: 0,
          },
        }),
      }}
    >
      {/* Number of developers section */}
      <Box sx={{ mb: 2, position: 'relative', zIndex: 1 }}>
        <Typography
          text="Number of developers"
          fontvariant="merriparagraph"
          fontcolor={sacredtheme ? alpha('#FFD700', 0.9) : 'black'}
          sx={
            sacredtheme
              ? {
                  fontWeight: 600,
                  letterSpacing: '0.5px',
                }
              : undefined
          }
        />
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          {/* Remove developer button */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '24px',
              height: '24px',
              cursor: 'pointer',
              borderRadius: '4px',
              transition: 'all 0.3s ease',
              ...(sacredtheme && {
                color: '#FFD700',
                '&:hover': {
                  backgroundColor: alpha('#FFD700', 0.1),
                  transform: 'scale(1.1)',
                },
              }),
            }}
            onClick={handleRemoveDeveloper}
          >
            <RemoveIcon sx={{ fontSize: '16px' }} />
          </Box>
          {/* Number of developers input */}
          <Box
            sx={{ mx: 1, display: 'flex', alignItems: 'center', width: '45px' }}
          >
            <input
              type="text"
              value={numDevelopersInput}
              onChange={handleInputChange}
              style={{
                width: '100%',
                border: sacredtheme
                  ? `1px solid ${alpha('#FFD700', 0.5)}`
                  : '1px solid #ccc',
                borderRadius: '4px',
                padding: '4px',
                backgroundColor: sacredtheme ? alpha('#000000', 0.8) : 'white',
                color: sacredtheme ? '#FFD700' : 'black',
                textAlign: 'center',
                fontWeight: sacredtheme ? 600 : 400,
                ...(sacredtheme && {
                  boxShadow: `inset 0 0 5px ${alpha('#FFD700', 0.2)}`,
                  animation: `${sacredCounterGlow} 3s ease-in-out infinite`,
                }),
              }}
            />
          </Box>
          {/* Add developer button */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '24px',
              height: '24px',
              cursor: 'pointer',
              borderRadius: '4px',
              transition: 'all 0.3s ease',
              ...(sacredtheme && {
                color: '#FFD700',
                '&:hover': {
                  backgroundColor: alpha('#FFD700', 0.1),
                  transform: 'scale(1.1)',
                },
              }),
            }}
            onClick={handleAddDeveloper}
          >
            <AddIcon sx={{ fontSize: '16px' }} />
          </Box>
        </Box>
      </Box>

      {/* Pricing information section */}
      <Box sx={{ mb: 2, position: 'relative', zIndex: 1 }}>
        <Box>
          <Typography
            text={`Licenses: ${numLicenses}`}
            fontvariant="merriparagraph"
            fontcolor={sacredtheme ? alpha('#FFD700', 0.8) : 'black'}
          />
        </Box>
        <Box>
          <Typography
            text={`Unit price: $ ${unitPrice}`}
            fontvariant="merriparagraph"
            fontcolor={sacredtheme ? alpha('#FFD700', 0.8) : 'black'}
          />
        </Box>
        <Box sx={{ fontWeight: 'bold' }}>
          <Typography
            text={`Total: $ ${(unitPrice * numLicenses).toFixed(2)}`}
            fontvariant="merriparagraph"
            fontcolor={sacredtheme ? '#FFD700' : 'black'}
            sx={
              sacredtheme
                ? {
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    textShadow: '0 0 8px rgba(255, 215, 0, 0.6)',
                  }
                : undefined
            }
          />
        </Box>
      </Box>

      {/* Action buttons section */}
      <Box
        sx={{
          mb: 2,
          display: 'flex',
          justifyContent: 'flex-start',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Box sx={{ mr: '2px' }}>
          <CustomButton
            text="Buy now"
            fontcolor={sacredtheme ? '#FFD700' : 'white'}
            backgroundcolor={sacredtheme ? alpha('#000000', 0.9) : 'black'}
            onClick={onBuy}
            sacredtheme={sacredtheme}
          />
        </Box>
        <Box sx={{ ml: '2px' }}>
          <CustomButton
            text="Live Preview"
            fontcolor={sacredtheme ? '#FFD700' : 'white'}
            backgroundcolor={sacredtheme ? alpha('#000000', 0.9) : 'black'}
            onClick={onLivePreview}
            sacredtheme={sacredtheme}
          />
        </Box>
      </Box>

      {/* Feature descriptions section */}
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        {featuredescriptions.map((feature, index) => (
          <Box key={index}>
            <Typography
              text={`✓ ${feature}`}
              fontvariant="merriparagraph"
              fontcolor={sacredtheme ? alpha('#FFD700', 0.8) : 'black'}
            />
          </Box>
        ))}
      </Box>

      {/* Release date section */}
      <Box sx={{ mt: 2, position: 'relative', zIndex: 1 }}>
        <Typography
          text={`First release: ${releaseDate}`}
          fontvariant="merriparagraph"
          fontcolor={sacredtheme ? alpha('#FFD700', 0.7) : 'black'}
        />
      </Box>

      {/* Contact section */}
      <Box
        sx={{
          mt: 2,
          cursor: 'pointer',
          position: 'relative',
          zIndex: 1,
          ...(sacredtheme && {
            '&:hover': {
              '& .MuiTypography-root': {
                color: '#FFD700',
                textShadow: '0 0 6px rgba(255, 215, 0, 0.6)',
              },
            },
          }),
        }}
        onClick={onContact}
      >
        <Typography
          text="Questions? Contact us"
          fontvariant="merriparagraph"
          fontcolor={sacredtheme ? alpha('#FFD700', 0.8) : 'black'}
        />
      </Box>

      {/* Creator information section */}
      <Box sx={{ mt: 2, position: 'relative', zIndex: 1 }}>
        <Typography
          text={`Created by ${createdBy}`}
          fontvariant="merriparagraph"
          fontcolor={sacredtheme ? alpha('#FFD700', 0.7) : 'black'}
        />
      </Box>
    </Paper>
  )
}

export default ProductCard
