import React, { useState } from 'react'
import { IconButton } from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'

const FavoriteIconComponent: React.FC = () => {
  const [isFavorite, setIsFavorite] = useState(false)

  const handleFavoriteClick = () => {
    setIsFavorite(!isFavorite)
  }

  return (
    <IconButton onClick={handleFavoriteClick} size="small">
      {isFavorite ? (
        <FavoriteIcon style={{ color: 'red' }} />
      ) : (
        <FavoriteBorderIcon />
      )}
    </IconButton>
  )
}

export default FavoriteIconComponent
