import React from 'react'

interface LooksFourIconProps {
  fontSize?: 'small' | 'medium' | 'large'
  color?: string
  style?: React.CSSProperties
}

const LooksFourIcon: React.FC<LooksFourIconProps> = ({
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
        d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4 14h-1.5v-2H11V8h1.5v5.5H15V15h1.5v2zm-1.5-4H12v-1.5h1.5V13z"
        fill="currentColor"
      />
    </svg>
  )
}

export default LooksFourIcon
