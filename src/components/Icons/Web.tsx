import React from 'react'

interface WebIconProps {
  fontSize?: 'small' | 'medium' | 'large' | number
  color?: string
  style?: React.CSSProperties
  className?: string
}

const WebIcon: React.FC<WebIconProps> = ({
  fontSize = 'medium',
  color = 'currentColor',
  style,
  className,
}) => {
  const size =
    typeof fontSize === 'number'
      ? fontSize
      : fontSize === 'small'
        ? 20
        : fontSize === 'large'
          ? 32
          : 24

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      style={style}
      className={className}
    >
      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-5 14H4v-4h11v4zm0-5H4V9h11v4zm5 5h-4V9h4v9z" />
    </svg>
  )
}

export default WebIcon
