import React from 'react'

interface IconProps {
  style?: React.CSSProperties
  className?: string
  color?: string
}

const PersonAddIcon: React.FC<IconProps> = ({ style, className, color }) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        ...style,
        color: color || style?.color || 'currentColor',
      }}
      className={className}
    >
      <path
        d="M15 12C17.21 12 19 10.21 19 8S17.21 4 15 4 11 5.79 11 8 12.79 12 15 12ZM6 10V7H4V10H1V12H4V15H6V12H9V10H6ZM15 14C12.33 14 7 15.34 7 18V20H23V18C23 15.34 17.67 14 15 14Z"
        fill="currentColor"
      />
    </svg>
  )
}

export default PersonAddIcon
