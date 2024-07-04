import React from 'react'
import { Box, Paper } from '@mui/material'
import Typography from '../../../../components/Typography'
import Link from 'next/link'

/**
 * Props for the InventoryCard component.
 */
interface InventoryCardProps {
  /** Title of the inventory item */
  title?: string
  /** URL or path of the image to display */
  image?: string
  /** Width of the inventory card */
  width?: string
  /** Height of the inventory card */
  height?: string | number
  /** License information for the item */
  license?: string
  /** Development use information */
  developmentUse?: string
  /** Production use information */
  productionUse?: string
  /** Update information for the item */
  updates?: string
  /** Support information for the item */
  support?: string
  /** Price of the item */
  price?: string
  /** Quantity of the item */
  quantity?: number
}

/**
 * InventoryCard component renders a card displaying detailed information about an inventory item.
 * It includes an image, title, price, quantity, and various details about the item's usage and support.
 */
const InventoryCard: React.FC<InventoryCardProps> = ({
  title,
  image,
  width,
  height,
  license,
  developmentUse,
  productionUse,
  updates,
  support,
  price,
  quantity,
}) => {
  return (
    <Paper
      elevation={1}
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        border: '1px solid #e8e8e8',
        width: width,
        minHeight: height,
      }}
    >
      {/* Image section */}
      <Box
        sx={{
          width: '200px',
          minHeight: '100%',
          backgroundImage: `url(${image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          flexShrink: 0,
        }}
      />

      {/* Content section */}
      <Box
        sx={{
          padding: '16px',
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Title and Price section */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          {title && (
            <Typography text={title} fontcolor="black" fontvariant="merrih5" />
          )}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
            }}
          >
            <Typography
              text={`${quantity} x ${price}`}
              fontcolor="black"
              fontvariant="merriparagraph"
            />
          </Box>
        </Box>

        {/* Details section */}
        <Box sx={{ marginTop: 'auto', paddingBottom: '10px' }}>
          {/* License information */}
          <Box sx={{ marginTop: '8px' }}>
            <Typography
              text={`License: ${license || ''}`}
              fontcolor="black"
              fontvariant="merriparagraph"
            />
          </Box>
          {/* Development use information */}
          <Box sx={{ marginTop: '4px' }}>
            <Typography
              text={`Development use: ${developmentUse || ''}`}
              fontcolor="black"
              fontvariant="merriparagraph"
            />
          </Box>
          {/* Production use information */}
          <Box sx={{ marginTop: '4px' }}>
            <Typography
              text={`Production use: ${productionUse || ''}`}
              fontcolor="black"
              fontvariant="merriparagraph"
            />
          </Box>
          {/* Updates information */}
          <Box sx={{ marginTop: '4px' }}>
            <Typography
              text={`Updates: ${updates || ''}`}
              fontcolor="black"
              fontvariant="merriparagraph"
            />
          </Box>
          {/* Support information */}
          <Box sx={{ marginTop: '4px' }}>
            <Typography
              text={`Support: ${support || ''}`}
              fontcolor="black"
              fontvariant="merriparagraph"
            />
          </Box>
        </Box>

        {/* Remove link */}
        <Box sx={{ marginTop: 'auto', alignSelf: 'flex-end' }}>
          <Link href="#" passHref>
            <Typography
              text="Remove"
              fontcolor="black"
              fontvariant="merriparagraph"
            />
          </Link>
        </Box>
      </Box>
    </Paper>
  )
}

export default InventoryCard
