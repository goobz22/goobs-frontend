import React from 'react'
import Search from '@mui/icons-material/Search'

const SearchIcon: React.FC<{
  size?: number | 'small' | 'medium' | 'large'
  color?: string
}> = ({ size = 'medium', color = 'black' }) => {
  let fontSize = '20px'

  if (typeof size === 'number') {
    fontSize = `${size}px`
  } else {
    switch (size) {
      case 'small':
        fontSize = '16px'
        break
      case 'medium':
        fontSize = '20px'
        break
      case 'large':
        fontSize = '24px'
        break
    }
  }

  return <Search style={{ fontSize, color }} />
}

export default SearchIcon
