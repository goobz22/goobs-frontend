// src/components/Nav/VerticalVariant/mainNav/list.tsx
'use client'
import React, { FC, useState } from 'react'
import Link from 'next/link'
import { white } from '../../../../styles/palette'
import { Typography } from '../../../Typography'

interface ListNavProps {
  title?: string
  onClick?: () => void
  level: number
  route?: string
  trigger?: 'route' | 'onClick'
  onClose?: () => void
  variant?: 'temporary' | 'permanent'
  isActive?: boolean
  activeAndHoverColor: string
}

// Premium theme styles (when not sacred theme)
const premiumStyles = {
  menuItem: {
    marginLeft: '24px',
    marginTop: '8px',
    height: '32px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    paddingLeft: '16px',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  } as React.CSSProperties,

  menuItemActive: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  } as React.CSSProperties,

  menuItemHover: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  } as React.CSSProperties,

  typography: {
    whiteSpace: 'nowrap',
    transition: 'all 0.3s ease',
  } as React.CSSProperties,

  link: {
    textDecoration: 'none',
    color: 'inherit',
  } as React.CSSProperties,

  glyph: {
    display: 'none', // Hidden for premium theme
  } as React.CSSProperties,

  glyphVisible: {
    display: 'none', // Hidden for premium theme
  } as React.CSSProperties,
}

// Sacred theme styles
const sacredStyles = {
  menuItem: {
    marginLeft: '24px',
    marginTop: '8px',
    height: '32px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    paddingLeft: '16px',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    position: 'relative',
    color: 'rgba(255, 215, 0, 1)',
    '&::before': {
      content: '"𓁟"',
      position: 'absolute',
      left: '8px',
      opacity: 0,
      transition: 'all 0.3s ease',
      color: 'rgba(255, 215, 0, 1)',
      fontSize: '16px',
    },
  } as React.CSSProperties,

  menuItemActive: {
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
  } as React.CSSProperties,

  menuItemHover: {
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    transform: 'translateX(8px)',
    textShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
    '&::before': {
      opacity: 1,
      transform: 'translateX(-4px) scale(1.25)',
    },
  } as React.CSSProperties,

  typography: {
    whiteSpace: 'nowrap',
    transition: 'all 0.3s ease',
    fontWeight: 600,
    letterSpacing: '0.025em',
    textShadow: '0 0 3px rgba(255, 215, 0, 0.3)',
  } as React.CSSProperties,

  link: {
    textDecoration: 'none',
    color: 'inherit',
  } as React.CSSProperties,

  glyph: {
    position: 'absolute',
    left: '8px',
    opacity: 0,
    transition: 'all 0.3s ease',
    color: 'rgba(255, 215, 0, 1)',
    fontSize: '16px',
  } as React.CSSProperties,

  glyphVisible: {
    opacity: 1,
    transform: 'translateX(-4px) scale(1.25)',
  } as React.CSSProperties,
}

const ListNav: FC<ListNavProps> = ({
  title,
  onClick,
  route,
  trigger,
  onClose,
  variant,
  isActive,
  activeAndHoverColor,
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const issacredtheme = activeAndHoverColor.includes('rgba(255, 215, 0, 0.15)')

  const styles = issacredtheme ? sacredStyles : premiumStyles

  const menuItemStyle = {
    ...styles.menuItem,
    ...(isActive ? styles.menuItemActive : {}),
    ...(isHovered ? styles.menuItemHover : {}),
    ...(isActive && issacredtheme
      ? { backgroundColor: activeAndHoverColor }
      : {}),
    ...(isHovered && issacredtheme
      ? { backgroundColor: activeAndHoverColor }
      : {}),
  }

  const glyphStyle = issacredtheme
    ? {
        ...styles.glyph,
        ...(isHovered ? styles.glyphVisible : {}),
      }
    : {}

  const menuItemContent = (
    <Typography
      fontvariant="merrih5"
      fontcolor={issacredtheme ? '#FFD700' : white.main}
      text={title ?? ''}
      style={styles.typography}
    />
  )

  const menuItem = (
    <div
      onClick={() => {
        if (onClick) onClick()
        if (trigger === 'route' && variant === 'temporary' && onClose) {
          onClose()
        }
      }}
      style={menuItemStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {issacredtheme && <div style={glyphStyle}>𓁟</div>}
      {menuItemContent}
    </div>
  )

  if (route && trigger === 'route') {
    return (
      <Link href={route} style={styles.link}>
        {menuItem}
      </Link>
    )
  }

  return menuItem
}

export default ListNav
