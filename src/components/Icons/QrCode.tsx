import React from 'react'

interface QrCodeIconProps {
  fontSize?: 'small' | 'medium' | 'large'
  sx?: React.CSSProperties
  className?: string
}

const QrCodeIcon: React.FC<QrCodeIconProps> = ({
  fontSize = 'medium',
  sx = {},
  className = '',
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
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={sx}
      className={className}
    >
      {/* QR Code pattern */}
      <rect x="3" y="3" width="8" height="8" rx="1" fill="currentColor" />
      <rect x="13" y="3" width="8" height="8" rx="1" fill="currentColor" />
      <rect x="3" y="13" width="8" height="8" rx="1" fill="currentColor" />

      {/* Inner squares */}
      <rect x="5" y="5" width="4" height="4" fill="white" />
      <rect x="15" y="5" width="4" height="4" fill="white" />
      <rect x="5" y="15" width="4" height="4" fill="white" />

      {/* Center dots */}
      <rect x="6.5" y="6.5" width="1" height="1" fill="currentColor" />
      <rect x="16.5" y="6.5" width="1" height="1" fill="currentColor" />
      <rect x="6.5" y="16.5" width="1" height="1" fill="currentColor" />

      {/* QR pattern dots */}
      <rect x="13" y="13" width="2" height="2" fill="currentColor" />
      <rect x="16" y="13" width="2" height="2" fill="currentColor" />
      <rect x="19" y="13" width="2" height="2" fill="currentColor" />
      <rect x="13" y="16" width="2" height="2" fill="currentColor" />
      <rect x="19" y="16" width="2" height="2" fill="currentColor" />
      <rect x="13" y="19" width="2" height="2" fill="currentColor" />
      <rect x="16" y="19" width="2" height="2" fill="currentColor" />
      <rect x="19" y="19" width="2" height="2" fill="currentColor" />
    </svg>
  )
}

export default QrCodeIcon
