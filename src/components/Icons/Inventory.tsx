import React from 'react'

export interface InventoryIconProps {
  className?: string
  style?: React.CSSProperties
  onClick?: () => void
}

const InventoryIcon: React.FC<InventoryIconProps> = ({
  className,
  style,
  onClick,
}) => (
  <svg
    className={className}
    style={style}
    onClick={onClick}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M20 2H4c-1.1 0-2 .9-2 2v5c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 5H6V5h12v2zm2 5H4c-1.1 0-2 .9-2 2v5c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-5c0-1.1-.9-2-2-2zm-2 5H6v-2h12v2z" />
  </svg>
)

export default InventoryIcon
