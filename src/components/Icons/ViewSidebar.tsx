import React from 'react'

interface ViewSidebarIconProps {
  style?: React.CSSProperties
  className?: string
  size?: number
}

const ViewSidebarIcon: React.FC<ViewSidebarIconProps> = ({
  style = {},
  className = '',
  size = 24,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      style={style}
      className={className}
    >
      <path d="M3 3h4v18H3V3zm6 0h12v18H9V3zm2 2v14h8V5h-8z" />
    </svg>
  )
}

export default ViewSidebarIcon
