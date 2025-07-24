'use client'

import React from 'react'

interface BankIconProps {
  size?: number
  color?: string
  style?: React.CSSProperties
  sacredtheme?: boolean
}

const BankIcon: React.FC<BankIconProps> = ({
  size = 24,
  color = 'currentColor',
  style,
  sacredtheme,
}) => {
  const effectiveColor = sacredtheme ? 'rgba(255, 215, 0, 0.8)' : color

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
        d="M12 3L2 8h20l-10-5zm-8 6v8h16V9H4zm2 2h2v4H6v-4zm4 0h2v4h-2v-4zm4 0h2v4h-2v-4zm4 0h2v4h-2v-4zM2 19h20v2H2v-2z"
        fill={effectiveColor}
      />
    </svg>
  )
}

export default BankIcon
