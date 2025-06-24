// src/components/Card/variants/inventory/index.tsx

import React from 'react'
import { Box, Paper, keyframes, alpha } from '@mui/material'
import Typography from '../../../../components/Typography'
import Link from 'next/link'

// --------------------------------------------------------------------------
// SACRED THEMING CONSTANTS AND ANIMATIONS
// --------------------------------------------------------------------------

const SACRED_GLYPHS = ['𓊖', '𓊗', '𓋴', '𓏏', '𓊨', '𓁦']

const sacredPulse = keyframes`
  0% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.1); }
  100% { opacity: 0.3; transform: scale(1); }
`

const sacredBorderGlow = keyframes`
  0% { box-shadow: 0 0 5px rgba(255, 215, 0, 0.3), inset 0 0 5px rgba(255, 215, 0, 0.1); }
  50% { box-shadow: 0 0 15px rgba(255, 215, 0, 0.5), inset 0 0 10px rgba(255, 215, 0, 0.2); }
  100% { box-shadow: 0 0 5px rgba(255, 215, 0, 0.3), inset 0 0 5px rgba(255, 215, 0, 0.1); }
`

const sacredShimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`

/**
 * Props for the InventoryCard component.
 */
interface InventoryCardProps {
  /** Title of the inventory item */
  title?: string
  /** URL or path of the image to display */
  image?: string
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
  /** Enable Egyptian/Sacred theming */
  sacredtheme?: boolean
  /** Callback for remove action */
  onRemove?: () => void
}

/**
 * InventoryCard component renders a card displaying detailed information about an inventory item.
 * It includes an image, title, price, quantity, and various details about the item's usage and support.
 */
const InventoryCard: React.FC<InventoryCardProps> = ({
  title,
  image,
  height,
  license,
  developmentUse,
  productionUse,
  updates,
  support,
  price,
  quantity,
  sacredtheme = false,
  onRemove,
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
        border: sacredtheme
          ? `1px solid ${alpha('#FFD700', 0.3)}`
          : '1px solid #e8e8e8',
        minHeight: height,
        backgroundColor: sacredtheme ? '#0a0a0a' : 'white',
        overflow: 'hidden',
        ...(sacredtheme && {
          animation: `${sacredBorderGlow} 4s ease-in-out infinite`,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(135deg, transparent, ${alpha('#FFD700', 0.05)}, transparent)`,
            backgroundSize: '200% 100%',
            animation: `${sacredShimmer} 3s ease-in-out infinite`,
            pointerEvents: 'none',
            zIndex: 1,
          },
        }),
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
          position: 'relative',
          zIndex: 2,
          ...(sacredtheme && {
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `linear-gradient(to right, transparent 50%, ${alpha('#000000', 0.8)} 100%)`,
            },
          }),
        }}
      />

      {/* Content section */}
      <Box
        sx={{
          padding: '16px',
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* Sacred decorative glyph */}
        {sacredtheme && (
          <Box
            sx={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              color: alpha('#FFD700', 0.2),
              fontSize: '32px',
              animation: `${sacredPulse} 3s ease-in-out infinite`,
            }}
          >
            {SACRED_GLYPHS[2]}
          </Box>
        )}

        {/* Title and Price section */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          {title && (
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
              fontcolor={sacredtheme ? alpha('#FFD700', 0.9) : 'black'}
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

        {/* Details section */}
        <Box sx={{ marginTop: 'auto', paddingBottom: '10px' }}>
          {/* License information */}
          <Box sx={{ marginTop: '8px' }}>
            <Typography
              text={`License: ${license || ''}`}
              fontcolor={sacredtheme ? alpha('#FFD700', 0.8) : 'black'}
              fontvariant="merriparagraph"
            />
          </Box>
          {/* Development use information */}
          <Box sx={{ marginTop: '4px' }}>
            <Typography
              text={`Development use: ${developmentUse || ''}`}
              fontcolor={sacredtheme ? alpha('#FFD700', 0.8) : 'black'}
              fontvariant="merriparagraph"
            />
          </Box>
          {/* Production use information */}
          <Box sx={{ marginTop: '4px' }}>
            <Typography
              text={`Production use: ${productionUse || ''}`}
              fontcolor={sacredtheme ? alpha('#FFD700', 0.8) : 'black'}
              fontvariant="merriparagraph"
            />
          </Box>
          {/* Updates information */}
          <Box sx={{ marginTop: '4px' }}>
            <Typography
              text={`Updates: ${updates || ''}`}
              fontcolor={sacredtheme ? alpha('#FFD700', 0.8) : 'black'}
              fontvariant="merriparagraph"
            />
          </Box>
          {/* Support information */}
          <Box sx={{ marginTop: '4px' }}>
            <Typography
              text={`Support: ${support || ''}`}
              fontcolor={sacredtheme ? alpha('#FFD700', 0.8) : 'black'}
              fontvariant="merriparagraph"
            />
          </Box>
        </Box>

        {/* Remove link */}
        <Box sx={{ marginTop: 'auto', alignSelf: 'flex-end' }}>
          <Link
            href="#"
            passHref
            onClick={e => {
              e.preventDefault()
              onRemove?.()
            }}
          >
            <Typography
              text="Remove"
              fontcolor={sacredtheme ? '#FFD700' : 'black'}
              fontvariant="merriparagraph"
              sx={
                sacredtheme
                  ? {
                      textDecoration: 'underline',
                      '&:hover': {
                        color: '#FFD700',
                        textShadow: '0 0 8px rgba(255, 215, 0, 0.6)',
                      },
                    }
                  : undefined
              }
            />
          </Link>
        </Box>
      </Box>
    </Paper>
  )
}

export default InventoryCard
