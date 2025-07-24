import React from 'react'

interface VpnLockIconProps {
  style?: React.CSSProperties
  fontSize?: 'small' | 'medium' | 'large'
  className?: string
}

const VpnLockIcon: React.FC<VpnLockIconProps> = ({
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
      <path d="M22,4V16A2,2 0 0,1 20,18H16L12,22L8,18H4A2,2 0 0,1 2,16V4A2,2 0 0,1 4,2H20A2,2 0 0,1 22,4M13.5,6A1.5,1.5 0 0,0 12,7.5V8.5A1.5,1.5 0 0,0 10.5,10V13.5A1.5,1.5 0 0,0 12,15H15A1.5,1.5 0 0,0 16.5,13.5V10A1.5,1.5 0 0,0 15,8.5V7.5A1.5,1.5 0 0,0 13.5,6Z" />
    </svg>
  )
}

export default VpnLockIcon
