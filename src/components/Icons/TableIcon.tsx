'use client'
import React from 'react'

interface TableIconProps {
  fontSize?: 'small' | 'medium' | 'large'
  style?: React.CSSProperties
}

const TableIcon: React.FC<TableIconProps> = ({
  fontSize = 'medium',
  style,
}) => {
  const size = fontSize === 'small' ? 16 : fontSize === 'large' ? 24 : 20

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      style={style}
    >
      <path d="M10 4H4c-1.1 0-2 .9-2 2v3h20V6c0-1.1-.9-2-2-2h-6c0-1.1-.9-2-2-2zM2 19c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-7H2v7z" />
    </svg>
  )
}

export default TableIcon
