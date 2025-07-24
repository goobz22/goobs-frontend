import React from 'react'

interface ApartmentIconProps {
  style?: React.CSSProperties
  fontSize?: 'small' | 'medium' | 'large'
  className?: string
}

const ApartmentIcon: React.FC<ApartmentIconProps> = ({
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
      <path d="M17,11V3H7V4H15V11H17M21,9V7H17V9H21M7,11V9L5,9V11H7M21,11V9H19V11H21M5,11V13H7V11H5M17,13V11H15V13H17M7,13V15H5V13H7M21,13V15H17V13H21M15,15V13H7V15H15M17,15V17H21V15H19V17H17M15,19V17H17V15H15V17H7V19H15M5,19V17H7V19H5M5,15V17H17V15H5Z" />
    </svg>
  )
}

export default ApartmentIcon
