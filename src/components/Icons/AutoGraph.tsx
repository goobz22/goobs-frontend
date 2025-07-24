import React from 'react'

interface AutoGraphIconProps {
  style?: React.CSSProperties
  fontSize?: 'small' | 'medium' | 'large'
  className?: string
}

const AutoGraphIcon: React.FC<AutoGraphIconProps> = ({
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
      <path d="M14.06,9.94L12,9L9.94,10.06L7,6V3A1,1 0 0,1 8,2H16A1,1 0 0,1 17,3V6L14.06,9.94M4,14H2A2,2 0 0,0 4,12V14M4,18H2A2,2 0 0,0 4,16V18M4,22H2A2,2 0 0,0 4,20V22M22,14H20V12A2,2 0 0,1 22,14M22,18H20V16A2,2 0 0,1 22,18M22,22H20V20A2,2 0 0,1 22,22M18.5,12C19.3,12 20,12.7 20,13.5V14.5C20,15.3 19.3,16 18.5,16H5.5C4.7,16 4,15.3 4,14.5V13.5C4,12.7 4.7,12 5.5,12H18.5M16,14H8V18H16V14Z" />
    </svg>
  )
}

export default AutoGraphIcon
