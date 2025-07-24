import React from 'react'

export interface AccountBalanceIconProps {
  className?: string
  style?: React.CSSProperties
  onClick?: () => void
}

const AccountBalanceIcon: React.FC<AccountBalanceIconProps> = ({
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
    <path d="M4 10h3v7H4zm6.5 0h3v7h-3zM2 19h20v3H2zm15-9h3v7h-3zM12 1L2 6v2h20V6l-10-5z" />
  </svg>
)

export default AccountBalanceIcon
