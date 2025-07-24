import React from 'react'

interface DashboardIconProps {
  style?: React.CSSProperties
  fontSize?: 'small' | 'medium' | 'large'
  className?: string
}

const DashboardIcon: React.FC<DashboardIconProps> = ({
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
      <path d="M13,3V9H21V3M13,21H21V11H13M3,21H11V15H3M3,13H11V3H3V13Z" />
    </svg>
  )
}

export default DashboardIcon
