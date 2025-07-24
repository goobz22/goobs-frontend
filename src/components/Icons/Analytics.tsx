import React from 'react'

interface AnalyticsIconProps {
  style?: React.CSSProperties
  fontSize?: 'small' | 'medium' | 'large'
  className?: string
}

const AnalyticsIcon: React.FC<AnalyticsIconProps> = ({
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
      <path d="M2,2H4V20H22V22H2V2M7,10V18H9V10H7M12,6V18H14V6H12M17,14V18H19V14H17Z" />
    </svg>
  )
}

export default AnalyticsIcon
