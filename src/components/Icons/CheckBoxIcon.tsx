'use client'
import React from 'react'

interface CheckBoxIconProps {
  fontSize?: 'small' | 'medium' | 'large'
  style?: React.CSSProperties
}

const CheckBoxIcon: React.FC<CheckBoxIconProps> = ({
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
      <path d="M10,17L5,12L6.41,10.58L10,14.17L17.59,6.58L19,8M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.11,3 19,3Z" />
    </svg>
  )
}

export default CheckBoxIcon
