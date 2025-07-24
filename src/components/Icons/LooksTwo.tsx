import React from 'react'

interface LooksTwoIconProps {
  fontSize?: 'small' | 'medium' | 'large'
  color?: string
  style?: React.CSSProperties
}

const LooksTwoIcon: React.FC<LooksTwoIconProps> = ({
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
        d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4 10.5h-2.5V12H14c.55 0 1-.45 1-1V9c0-.55-.45-1-1-1h-2.5c-.55 0-1 .45-1 1v.5h1.5V9h2v1.5h-2.5c-.55 0-1 .45-1 1V17h4v-1.5h-2.5v-2z"
        fill="currentColor"
      />
    </svg>
  )
}

export default LooksTwoIcon
