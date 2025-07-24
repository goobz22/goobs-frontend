import React from 'react'

interface StoreMallDirectoryIconProps {
  style?: React.CSSProperties
  fontSize?: 'small' | 'medium' | 'large'
  className?: string
}

const StoreMallDirectoryIcon: React.FC<StoreMallDirectoryIconProps> = ({
  style,
  fontSize = 'medium',
  className,
}) => {
  const sizeMap = {
    small: 20,
    medium: 24,
    large: 32,
  }

  const size = sizeMap[fontSize]

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      style={style}
      className={className}
    >
      <path d="M19,7H18V6A4,4 0 0,0 14,2H10A4,4 0 0,0 6,6V7H5A1,1 0 0,0 4,8V19A3,3 0 0,0 7,22H17A3,3 0 0,0 20,19V8A1,1 0 0,0 19,7M10,4H14A2,2 0 0,1 16,6V7H8V6A2,2 0 0,1 10,4M18,19A1,1 0 0,1 17,20H7A1,1 0 0,1 6,19V9H8V10A1,1 0 0,0 10,11A1,1 0 0,0 12,10H12A1,1 0 0,0 14,11A1,1 0 0,0 16,10V9H18V19Z" />
    </svg>
  )
}

export default StoreMallDirectoryIcon
