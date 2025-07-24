import React from 'react'

export interface GroupsIconProps {
  className?: string
  style?: React.CSSProperties
  onClick?: () => void
}

const GroupsIcon: React.FC<GroupsIconProps> = ({
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
    <path d="M12 12.75c1.63 0 3.07.39 4.24.9 1.08.47 1.76 1.56 1.76 2.73V18H6v-1.61c0-1.18.68-2.26 1.76-2.73 1.17-.52 2.61-.91 4.24-.91zM4 13c1.1 0 2-.9 2-2 0-1.1-.9-2-2-2s-2 .9-2 2c0 1.1.9 2 2 2zm1.13 1.1c-.37-.06-.74-.1-1.13-.1-.99 0-1.93.21-2.78.58C.48 14.9 0 15.62 0 16.43V18h4.5v-1.61c0-.83.23-1.61.63-2.29zM20 13c1.1 0 2-.9 2-2 0-1.1-.9-2-2-2s-2 .9-2 2c0 1.1.9 2 2 2zm1.13 1.1c.37-.06.74-.1 1.13-.1.99 0 1.93.21 2.78.58.74.32 1.22 1.04 1.22 1.85V18H19.5v-1.61c0-.83-.23-1.61-.63-2.29.37-.06.74-.1 1.13-.1zM12 6c1.66 0 3 1.34 3 3 0 1.66-1.34 3-3 3s-3-1.34-3-3c0-1.66 1.34-3 3-3z" />
  </svg>
)

export default GroupsIcon
