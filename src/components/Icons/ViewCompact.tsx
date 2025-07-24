import React from 'react'

interface ViewCompactIconProps {
  fontSize?: 'small' | 'medium' | 'large' | number
  color?: string
  style?: React.CSSProperties
  className?: string
}

const ViewCompactIcon: React.FC<ViewCompactIconProps> = ({
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
      <path d="M3 19h6v-7H3v7zm7 0h12v-7H10v7zM3 5v6h19V5H3z" />
    </svg>
  )
}

export default ViewCompactIcon
