/**
 * @fileoverview ReportProblem icon component
 */
'use client'
import React from 'react'

interface ReportProblemIconProps {
  width?: number
  height?: number
  color?: string
  className?: string
  style?: React.CSSProperties
}

const ReportProblemIcon: React.FC<ReportProblemIconProps> = ({
  width = 24,
  height = 24,
  color = 'currentColor',
  className,
  style,
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      <path
        d="M1 21H23L12 2L1 21ZM13 18H11V16H13V18ZM13 14H11V10H13V14Z"
        fill={color}
      />
    </svg>
  )
}

ReportProblemIcon.displayName = 'ReportProblemIcon'

export default ReportProblemIcon
