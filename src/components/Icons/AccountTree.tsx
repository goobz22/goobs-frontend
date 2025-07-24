import React from 'react'

interface AccountTreeIconProps {
  sx?: React.CSSProperties
  className?: string
}

const AccountTreeIcon: React.FC<AccountTreeIconProps> = ({ sx, className }) => (
  <svg
    className={className}
    style={sx}
    fill="currentColor"
    width="24"
    height="24"
    viewBox="0 0 24 24"
  >
    <path d="M22 11V3h-7v3H9V3H2v8h7V8h2v10h4v3h7v-8h-7v3h-2V8h2v3z" />
  </svg>
)

export default AccountTreeIcon
