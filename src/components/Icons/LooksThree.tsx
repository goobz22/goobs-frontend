import React from 'react'

interface LooksThreeIconProps {
  fontSize?: 'small' | 'medium' | 'large'
  color?: string
  style?: React.CSSProperties
}

const LooksThreeIcon: React.FC<LooksThreeIconProps> = ({
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
        d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4 8c.55 0 1 .45 1 1v2c0 .55-.45 1-1 1h-2.5V17H15c.55 0 1-.45 1-1v-2c0-.55-.45-1-1-1 .55 0 1-.45 1-1v-1c0-.55-.45-1-1-1h-3.5v1.5H15v1h-1.5V13h2v2h-2V17z"
        fill="currentColor"
      />
    </svg>
  )
}

export default LooksThreeIcon
