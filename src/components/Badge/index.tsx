'use client'

import React from 'react'
import { getBadgeStyles, type BadgeStyles } from '../../theme/badge'

export interface BadgeProps {
  content: React.ReactNode
  children: React.ReactNode
  styles?: BadgeStyles
}

const Badge: React.FC<BadgeProps> = ({ content, children, styles }) => {
  const computedStyles = getBadgeStyles(styles)

  return (
    <div style={computedStyles.container}>
      {children}
      <span style={computedStyles.badge}>{content}</span>
    </div>
  )
}

export default Badge
