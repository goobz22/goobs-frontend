'use client'

import React from 'react'

interface DownloadProps {
  size?: number
  color?: string
  style?: React.CSSProperties
}

const Download: React.FC<DownloadProps> = ({
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
        d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"
        fill={color}
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </svg>
  )
}

export default Download
