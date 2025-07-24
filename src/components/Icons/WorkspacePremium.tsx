import React from 'react'

interface WorkspacePremiumIconProps {
  style?: React.CSSProperties
  fontSize?: 'small' | 'medium' | 'large'
  className?: string
}

const WorkspacePremiumIcon: React.FC<WorkspacePremiumIconProps> = ({
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
      <path d="M10,2L8.5,5H5A1,1 0 0,0 4,6V19A1,1 0 0,0 5,20H19A1,1 0 0,0 20,19V6A1,1 0 0,0 19,5H15.5L14,2H10M12,6L13.5,9H17L14.5,11.5L15.5,15L12,13L8.5,15L9.5,11.5L7,9H10.5L12,6Z" />
    </svg>
  )
}

export default WorkspacePremiumIcon
