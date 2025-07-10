'use client'
import React, { FC, useState } from 'react'
import Link from 'next/link'
import { Typography } from '../../../Typography'

interface ViewNavProps {
  title?: string
  route?: string
  trigger?: 'route' | 'onClick'
  onClick?: () => void
  level: number
  activeAndHoverColor?: string
  onClose?: () => void
  variant?: 'temporary' | 'permanent'
  isActive?: boolean
}

const getStyles = (
  issacredtheme: boolean,
  isActive: boolean,
  isHovered: boolean,
  activeAndHoverColor: string
) => ({
  link: {
    textDecoration: 'none',
    color: 'white',
    whiteSpace: 'nowrap',
  } as React.CSSProperties,
  content: {
    marginLeft: '3rem',
    height: '2rem',
    borderRadius: '0.375rem',
    display: 'flex',
    alignItems: 'center',
    paddingLeft: '1rem',
    transition: 'all 0.3s ease',
    whiteSpace: 'nowrap',
    backgroundColor: isActive ? activeAndHoverColor : 'transparent',
    ...(isHovered && { backgroundColor: activeAndHoverColor }),
    ...(issacredtheme && {
      position: 'relative',
      color: 'rgba(255, 215, 0, 0.9)',
      '::before': {
        content: '"𓏏"',
        position: 'absolute',
        left: '0.5rem',
        opacity: 0,
        transition: 'all 0.3s ease',
        color: '#FFD700',
        fontSize: '0.875rem',
      },
    }),
    ...(issacredtheme &&
      isHovered && {
        transform: 'translateX(0.375rem)',
        textShadow: '0 0 8px rgba(255,215,0,0.5)',
        '::before': {
          opacity: 1,
          transform: 'translateX(-0.25rem) scale(1.25)',
        },
      }),
  } as React.CSSProperties,
  typography: {
    whiteSpace: 'nowrap',
    ...(issacredtheme && {
      fontWeight: 500,
      letterSpacing: '0.025em',
      transition: 'all 0.3s ease',
    }),
  } as React.CSSProperties,
})

const ViewNav: FC<ViewNavProps> = ({
  title,
  route,
  trigger,
  onClick,
  activeAndHoverColor = 'rgba(255,255,255,0.5)',
  onClose,
  variant,
  isActive,
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const issacredtheme = activeAndHoverColor.includes('rgba(255, 215, 0, 0.15)')
  const styles = getStyles(
    issacredtheme,
    !!isActive,
    isHovered,
    activeAndHoverColor
  )

  const content = (
    <div
      onClick={() => {
        if (trigger === 'route' && variant === 'temporary' && onClose) {
          onClose()
        } else if (trigger === 'onClick' && onClick) {
          onClick()
          if (variant === 'temporary' && onClose) {
            onClose()
          }
        }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={styles.content}
    >
      <Typography
        fontvariant="merriparagraph"
        text={title ?? ''}
        fontcolor={issacredtheme ? 'rgba(255, 215, 0, 0.9)' : 'white'}
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

export default ViewNav
