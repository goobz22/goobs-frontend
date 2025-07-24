import React from 'react'

interface ViewListIconProps {
  fontSize?: 'small' | 'medium' | 'large' | number
  color?: string
  style?: React.CSSProperties
  className?: string
}

const ViewListIcon: React.FC<ViewListIconProps> = ({
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
      <path d="M4 14h4v-4H4v4zm0 5h4v-4H4v4zM4 9h4V5H4v4zm5 5h12v-4H9v4zm0 5h12v-4H9v4zM9 5v4h12V5H9z" />
    </svg>
  )
}

export default ViewListIcon
