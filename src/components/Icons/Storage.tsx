import React from 'react'

interface StorageIconProps {
  style?: React.CSSProperties
  fontSize?: 'small' | 'medium' | 'large'
  className?: string
}

const StorageIcon: React.FC<StorageIconProps> = ({
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
      <path d="M2 20h20v-4H2v4zm2-3h2v2H4v-2zm-2-2h20v-4H2v4zm2-3h2v2H4v-2zm-2-2h20V6H2v4zm2-3h2v2H4V8z" />
    </svg>
  )
}

export default StorageIcon
