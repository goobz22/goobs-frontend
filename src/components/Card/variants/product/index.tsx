'use client'

import React, { useState } from 'react'
import { Box, Paper, BoxProps } from '@mui/material'
import Typography from '../../../../components/Typography'
import CustomButton from '../../../../components/Button'
import RemoveIcon from '@mui/icons-material/Remove'
import AddIcon from '@mui/icons-material/Add'

/**
 * Props for the ProductCard component.
 * Extends BoxProps from Material-UI and includes additional custom properties.
 */
interface ProductCardProps extends BoxProps {
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
  ...rest
}) => {
  // State for number of developers input
  const [numDevelopersInput, setNumDevelopersInput] = useState(
    numDevelopers.toString()
  )
  // State for number of licenses
  const [numLicenses, setNumLicenses] = useState(licenses)

  /**
   * Handles the action of adding a developer.
   * Increments the number of developers and updates licenses accordingly.
   */
  const handleAddDeveloper = () => {
    const newNumDevelopers = parseInt(numDevelopersInput, 10) + 1
    setNumDevelopersInput(newNumDevelopers.toString())
    setNumLicenses(newNumDevelopers)
    onAddDeveloper?.()
  }

  /**
   * Handles the action of removing a developer.
   * Decrements the number of developers and updates licenses accordingly.
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
   * @param event - The change event from the input field
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
        ...rest.sx,
      }}
    >
      {/* Number of developers section */}
      <Box
        // @ts-ignore
        sx={{ mb: 2 }}
      >
        <Typography text="Number of developers" fontvariant="merriparagraph" />
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
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: '4px',
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
            }}
            onClick={handleAddDeveloper}
          >
            <AddIcon sx={{ fontSize: '16px' }} />
          </Box>
        </Box>
      </Box>

      {/* Pricing information section */}
      <Box sx={{ mb: 2 }}>
        <Box>
          <Typography
            text={`Licenses: ${numLicenses}`}
            fontvariant="merriparagraph"
          />
        </Box>
        <Box>
          <Typography
            text={`Unit price: $ ${unitPrice}`}
            fontvariant="merriparagraph"
          />
        </Box>
        <Box sx={{ fontWeight: 'bold' }}>
          <Typography
            text={`Total: $ ${(unitPrice * numLicenses).toFixed(2)}`}
            fontvariant="merriparagraph"
          />
        </Box>
      </Box>

      {/* Action buttons section */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-start' }}>
        <Box sx={{ mr: '2px' }}>
          <CustomButton
            text="Buy now"
            fontcolor="white"
            backgroundcolor="black"
            onClick={onBuy}
          />
        </Box>
        <Box sx={{ ml: '2px' }}>
          <CustomButton
            text="Live Preview"
            fontcolor="white"
            backgroundcolor="black"
            onClick={onLivePreview}
          />
        </Box>
      </Box>

      {/* Feature descriptions section */}
      <Box>
        {featuredescriptions.map((feature, index) => (
          <Box key={index}>
            <Typography text={`✓ ${feature}`} fontvariant="merriparagraph" />
          </Box>
        ))}
      </Box>

      {/* Release date section */}
      <Box sx={{ mt: 2 }}>
        <Typography
          text={`First release: ${releaseDate}`}
          fontvariant="merriparagraph"
        />
      </Box>

      {/* Contact section */}
      <Box sx={{ mt: 2, cursor: 'pointer' }} onClick={onContact}>
        <Typography text="Questions? Contact us" fontvariant="merriparagraph" />
      </Box>

      {/* Creator information section */}
      <Box sx={{ mt: 2 }}>
        <Typography
          text={`Created by ${createdBy}`}
          fontvariant="merriparagraph"
        />
      </Box>
    </Paper>
  )
}

export default ProductCard
