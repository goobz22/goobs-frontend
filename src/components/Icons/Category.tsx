/**
 * @fileoverview Category icon component
 */
'use client'
import React from 'react'

interface CategoryIconProps {
  width?: number
  height?: number
  color?: string
  className?: string
  style?: React.CSSProperties
}

const CategoryIcon: React.FC<CategoryIconProps> = ({
  width = 24,
  height = 24,
  color = 'currentColor',
  className,
  style,
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      <path
        d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2ZM4 14L5 17H7L6 14H4ZM9 14L10 17H12L11 14H9ZM14 14L15 17H17L16 14H14ZM19 14L20 17H22L21 14H19Z"
        fill={color}
      />
    </svg>
  )
}

CategoryIcon.displayName = 'CategoryIcon'

export default CategoryIcon
