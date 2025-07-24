import React from 'react'

interface IntegrationInstructionsIconProps {
  style?: React.CSSProperties
  fontSize?: 'small' | 'medium' | 'large'
  className?: string
}

const IntegrationInstructionsIcon: React.FC<
  IntegrationInstructionsIconProps
> = ({ style, fontSize = 'medium', className }) => {
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
      <path d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M19,19H5V5H19V19M17,12H7V10H17V12M17,16H7V14H17V16M17,8H7V6H17V8Z" />
    </svg>
  )
}

export default IntegrationInstructionsIcon
