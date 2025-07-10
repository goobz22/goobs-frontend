// src/components/Nav/VerticalVariant/subNav/list.tsx
'use client'
import React, { FC, useState } from 'react'
import Link from 'next/link'
import { white } from '../../../../styles/palette'
import { Typography } from '../../../Typography'

interface ListSubNavProps {
  title?: string
  route?: string
  trigger?: 'route' | 'onClick'
  activeAndHoverColor: string
  onClose?: () => void
  variant?: 'temporary' | 'permanent'
  isActive?: boolean
}

// Premium theme styles (when not sacred theme)
const premiumStyles = {
  menuItem: {
    marginLeft: '36px',
    height: '32px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    paddingLeft: '16px',
    transition: 'all 0.3s ease',
    whiteSpace: 'nowrap',
    backgroundColor: 'transparent',
    cursor: 'pointer',
  } as React.CSSProperties,

  menuItemActive: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  } as React.CSSProperties,

  menuItemHover: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  } as React.CSSProperties,

  typography: {
    transition: 'all 0.3s ease',
  } as React.CSSProperties,

  link: {
    textDecoration: 'none',
    color: 'white',
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
    marginLeft: '36px',
    height: '32px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    paddingLeft: '16px',
    transition: 'all 0.3s ease',
    whiteSpace: 'nowrap',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    position: 'relative',
    color: 'rgba(255, 215, 0, 0.9)',
    '&::before': {
      content: '"𓃀"',
      position: 'absolute',
      left: '8px',
      opacity: 0,
      transition: 'all 0.3s ease',
      color: 'rgba(255, 215, 0, 1)',
      fontSize: '14px',
    },
  } as React.CSSProperties,

  menuItemActive: {
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
  } as React.CSSProperties,

  menuItemHover: {
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    transform: 'translateX(6px)',
    textShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
    '&::before': {
      opacity: 1,
      transform: 'translateX(-4px) scale(1.25)',
    },
  } as React.CSSProperties,

  typography: {
    fontWeight: 500,
    letterSpacing: '0.015em',
    transition: 'all 0.3s ease',
  } as React.CSSProperties,

  link: {
    textDecoration: 'none',
    color: 'white',
  } as React.CSSProperties,

  glyph: {
    position: 'absolute',
    left: '8px',
    opacity: 0,
    transition: 'all 0.3s ease',
    color: 'rgba(255, 215, 0, 1)',
    fontSize: '14px',
  } as React.CSSProperties,

  glyphVisible: {
    opacity: 1,
    transform: 'translateX(-4px) scale(1.25)',
  } as React.CSSProperties,
}

const ListSubNav: FC<ListSubNavProps> = ({
  title,
  route,
  trigger,
  activeAndHoverColor,
  onClose,
  variant,
  isActive,
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

  const content = (
    <div
      onClick={() => {
        if (trigger === 'route' && variant === 'temporary' && onClose) {
          onClose()
        }
      }}
      style={menuItemStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {issacredtheme && <div style={glyphStyle}>𓃀</div>}
      <Typography
        fontvariant="merrih6"
        text={title ?? ''}
        fontcolor={issacredtheme ? 'rgba(255, 215, 0, 0.9)' : white.main}
        style={styles.typography}
      />
    </div>
  )

  if (route && trigger === 'route') {
    return (
      <Link href={route ?? ''} style={styles.link}>
        {content}
      </Link>
    )
  }

  return content
}

export default ListSubNav
