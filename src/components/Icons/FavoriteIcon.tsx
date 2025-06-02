'use client'

import React, { useState } from 'react'
import { IconButton, keyframes, alpha } from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'

const heartbeat = keyframes`
  0% { transform: scale(1); }
  25% { transform: scale(1.1); }
  50% { transform: scale(1); }
  75% { transform: scale(1.05); }
  100% { transform: scale(1); }
`

const glowPulse = keyframes`
  0% { filter: drop-shadow(0 0 5px rgba(255, 215, 0, 0.5)); }
  50% { filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.8)); }
  100% { filter: drop-shadow(0 0 5px rgba(255, 215, 0, 0.5)); }
`

interface FavoriteIconComponentProps {
  sacredTheme?: boolean
}

const FavoriteIconComponent: React.FC<FavoriteIconComponentProps> = ({
  sacredTheme,
}) => {
  const [isFavorite, setIsFavorite] = useState(false)

  const handleFavoriteClick = () => {
    setIsFavorite(!isFavorite)
  }

  return (
    <IconButton
      onClick={handleFavoriteClick}
      size="small"
      sx={{
        ...(sacredTheme && {
          '&:hover': {
            backgroundColor: alpha('#FFD700', 0.1),
          },
        }),
      }}
    >
      {isFavorite ? (
        <FavoriteIcon
          style={{
            color: sacredTheme ? '#FFD700' : 'red',
            ...(sacredTheme && {
              animation: `${heartbeat} 1.5s ease-in-out infinite, ${glowPulse} 2s ease-in-out infinite`,
            }),
          }}
        />
      ) : (
        <FavoriteBorderIcon
          style={{
            color: sacredTheme ? alpha('#FFD700', 0.7) : undefined,
            ...(sacredTheme && {
              transition: 'all 0.3s ease',
              '&:hover': {
                color: '#FFD700',
              },
            }),
          }}
        />
      )}
    </IconButton>
  )
}

export default FavoriteIconComponent
