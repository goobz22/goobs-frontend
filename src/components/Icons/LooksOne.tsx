import React from 'react'

interface LooksOneIconProps {
  fontSize?: 'small' | 'medium' | 'large'
  color?: string
  style?: React.CSSProperties
}

const LooksOneIcon: React.FC<LooksOneIconProps> = ({
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
        d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14h-1.5v-8H10v-1.5h4V17z"
        fill="currentColor"
      />
    </svg>
  )
}

export default LooksOneIcon
