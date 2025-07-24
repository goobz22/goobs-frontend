import React from 'react'

interface AutoAwesomeIconProps {
  style?: React.CSSProperties
  fontSize?: 'small' | 'medium' | 'large'
  className?: string
}

const AutoAwesomeIcon: React.FC<AutoAwesomeIconProps> = ({
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
      <path d="M19,9L20.25,6.25L23,5L20.25,3.75L19,1L17.75,3.75L15,5L17.75,6.25L19,9M11.5,9.5L9,4L6.5,9.5L1,12L6.5,14.5L9,20L11.5,14.5L17,12L11.5,9.5M19,15L17.75,17.75L15,19L17.75,20.25L19,23L20.25,20.25L23,19L20.25,17.75L19,15Z" />
    </svg>
  )
}

export default AutoAwesomeIcon
