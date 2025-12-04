'use client'

import React, { forwardRef, useState } from 'react'
import { alpha } from '../../utils'

const SACRED_GOLD = '#FFD700'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  styles?: {
    disabled?: boolean
    theme?: string
    width?: string
    height?: string
    padding?: string
    contentPadding?: string
    borderRadius?: string
    backgroundColor?: string
    border?: string
    marginBottom?: string
    marginTop?: string
    borderColor?: string
    borderWidth?: string
    borderStyle?: string
  }
  elevation?: number
}

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  styles?: {
    theme?: string
    padding?: string
    contentPadding?: string
    color?: string
  }
}

export interface CardActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  styles?: {
    theme?: string
    padding?: string
    justifyContent?: string
    gap?: string
  }
}

export interface CardHeaderProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'children' | 'title'
> {
  children?: React.ReactNode
  title?: string
  subtitle?: string
  action?: React.ReactNode
  avatar?: React.ReactNode
  styles?: {
    theme?: string
    padding?: string
    titleColor?: string
    subtitleColor?: string
  }
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, styles, elevation = 1, className, ...restProps }, ref) => {
    const [isHovered, setIsHovered] = useState(false)
    const isDisabled = styles?.disabled
    const isSacredTheme = styles?.theme === 'sacred'

    const getElevationShadow = (level: number, hovered: boolean) => {
      const baseLevel = hovered ? level + 2 : level
      if (isSacredTheme) {
        return `0 ${baseLevel * 2}px ${baseLevel * 8}px ${alpha(SACRED_GOLD, 0.2)}`
      }
      return `0 ${baseLevel}px ${baseLevel * 4}px rgba(0, 0, 0, 0.1)`
    }

    const containerStyle: React.CSSProperties = {
      position: 'relative',
      width: styles?.width || '100%',
      height: styles?.height || 'auto',
      padding: styles?.padding || '0',
      marginBottom: styles?.marginBottom,
      marginTop: styles?.marginTop,
      borderRadius: styles?.borderRadius || '12px',
      backgroundColor: isSacredTheme ? 'rgba(0, 0, 0, 0.85)' : '#ffffff',
      border: styles?.border
        ? styles.border
        : styles?.borderColor
          ? `${styles?.borderWidth || '1px'} ${styles?.borderStyle || 'solid'} ${styles.borderColor}`
          : isSacredTheme
            ? `${styles?.borderWidth || '1px'} ${styles?.borderStyle || 'solid'} ${alpha(SACRED_GOLD, isHovered ? 0.5 : 0.3)}`
            : `${styles?.borderWidth || '1px'} ${styles?.borderStyle || 'solid'} rgba(0, 0, 0, 0.12)`,
      boxShadow: getElevationShadow(elevation, isHovered),
      transition: 'all 0.3s ease',
      overflow: 'hidden',
      cursor: isDisabled ? 'not-allowed' : 'default',
      opacity: isDisabled ? 0.6 : 1,
    }

    const handleMouseEnter = () => {
      if (!isDisabled) setIsHovered(true)
    }

    const handleMouseLeave = () => {
      setIsHovered(false)
    }

    return (
      <div
        ref={ref}
        className={className}
        style={containerStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...restProps}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ children, styles, className, ...restProps }, ref) => {
    const isSacredTheme = styles?.theme === 'sacred'

    const contentStyle: React.CSSProperties = {
      padding: styles?.contentPadding || styles?.padding || '16px',
      color: isSacredTheme ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.87)',
      fontFamily: isSacredTheme ? '"Crimson Text", serif' : 'inherit',
    }

    return (
      <div ref={ref} className={className} style={contentStyle} {...restProps}>
        {children}
      </div>
    )
  }
)

CardContent.displayName = 'CardContent'

export const CardActions = forwardRef<HTMLDivElement, CardActionsProps>(
  ({ children, styles, className, ...restProps }, ref) => {
    const isSacredTheme = styles?.theme === 'sacred'

    const actionsStyle: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      padding: styles?.padding || '8px 16px',
      justifyContent: styles?.justifyContent || 'flex-end',
      gap: '8px',
      borderTop: isSacredTheme
        ? `1px solid ${alpha(SACRED_GOLD, 0.2)}`
        : '1px solid rgba(0, 0, 0, 0.12)',
    }

    return (
      <div ref={ref} className={className} style={actionsStyle} {...restProps}>
        {children}
      </div>
    )
  }
)

CardActions.displayName = 'CardActions'

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  (
    {
      children,
      title,
      subtitle,
      action,
      avatar,
      styles,
      className,
      ...restProps
    },
    ref
  ) => {
    const isSacredTheme = styles?.theme === 'sacred'

    const headerStyle: React.CSSProperties = {
      display: 'flex',
      alignItems: 'flex-start',
      padding: styles?.padding || '16px',
    }

    const titleStyle: React.CSSProperties = {
      fontSize: '1.25rem',
      fontWeight: 500,
      lineHeight: 1.6,
      marginBottom: subtitle ? '4px' : 0,
      color: isSacredTheme ? SACRED_GOLD : 'rgba(0, 0, 0, 0.87)',
      fontFamily: isSacredTheme ? '"Cinzel", serif' : 'inherit',
    }

    const subtitleStyle: React.CSSProperties = {
      fontSize: '0.875rem',
      lineHeight: 1.43,
      color: isSacredTheme ? 'rgba(255, 215, 0, 0.75)' : 'rgba(0, 0, 0, 0.6)',
      fontFamily: isSacredTheme ? '"Crimson Text", serif' : 'inherit',
    }

    return (
      <div ref={ref} className={className} style={headerStyle} {...restProps}>
        {avatar && <div style={{ marginRight: '16px' }}>{avatar}</div>}
        <div style={{ flex: '1 1 auto', minWidth: 0 }}>
          {title && <div style={titleStyle}>{title}</div>}
          {subtitle && <div style={subtitleStyle}>{subtitle}</div>}
          {children}
        </div>
        {action && (
          <div style={{ marginLeft: '16px', flexShrink: 0 }}>{action}</div>
        )}
      </div>
    )
  }
)

CardHeader.displayName = 'CardHeader'

export default Card
