import React from 'react'

interface ViewModuleIconProps {
  fontSize?: 'small' | 'medium' | 'large' | number
  color?: string
  style?: React.CSSProperties
  className?: string
}

const ViewModuleIcon: React.FC<ViewModuleIconProps> = ({
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
      <path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z" />
    </svg>
  )
}

export default ViewModuleIcon
