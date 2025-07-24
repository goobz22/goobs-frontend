import React from 'react'

export interface ContactsIconProps {
  className?: string
  style?: React.CSSProperties
  onClick?: () => void
}

const ContactsIcon: React.FC<ContactsIconProps> = ({
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
    <path d="M20 0H4v2h16V0zM4 24h16v-2H4v2zM20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-8 2.75c1.24 0 2.25 1.01 2.25 2.25S13.24 11.25 12 11.25 9.75 10.24 9.75 9s1.01-2.25 2.25-2.25zM17 17H7v-1.5c0-1.67 3.33-2.5 5-2.5s5 .83 5 2.5V17z" />
  </svg>
)

export default ContactsIcon
