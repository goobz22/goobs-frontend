import React from 'react'

interface CompareArrowsIconProps {
  fontSize?: 'small' | 'medium' | 'large'
  color?: string
  style?: React.CSSProperties
}

const CompareArrowsIcon: React.FC<CompareArrowsIconProps> = ({
  fontSize = 'medium',
  color = 'currentColor',
  style = {},
}) => {
  const sizeMap = {
    small: '20px',
    medium: '24px',
    large: '32px',
  }

  const size = sizeMap[fontSize]

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        color,
        ...style,
      }}
    >
      <path
        d="M9.01 14H2v2h7.01v3L13 15l-3.99-4v3zM14.99 13v-3H22V8h-7.01V5L11 9l3.99 4z"
        fill="currentColor"
      />
    </svg>
  )
}

export default CompareArrowsIcon
