import React from 'react'

interface ExpandMoreProps {
  size?: number
  color?: string
  style?: React.CSSProperties
}

const ExpandMore: React.FC<ExpandMoreProps> = ({
  size = 24,
  color = 'currentColor',
  style,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
    >
      <path
        d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"
        fill={color}
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </svg>
  )
}

export default ExpandMore
