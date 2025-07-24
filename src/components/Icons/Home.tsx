import React from 'react'

interface HomeIconProps {
  style?: React.CSSProperties
  fontSize?: 'small' | 'medium' | 'large'
  className?: string
}

const HomeIcon: React.FC<HomeIconProps> = ({
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
      <path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z" />
    </svg>
  )
}

export default HomeIcon
