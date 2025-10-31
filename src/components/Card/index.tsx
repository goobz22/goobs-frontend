/**
 * @fileoverview Card component system with Content and Actions sub-components
 */
'use client'

import React, { forwardRef, useState, useMemo } from 'react'
import { getCardStyles, type CardStyles } from '../../theme/card'
import { SACRED_GLYPHS, injectKeyframes } from '../../theme/shared'

// --------------------------------------------------------------------------
// SACRED GLYPHS CONSTANTS (from shared)
// --------------------------------------------------------------------------

// --------------------------------------------------------------------------
// CARD PROPS
// --------------------------------------------------------------------------

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The content to display inside the card. */
  children: React.ReactNode
  /** Comprehensive styling options including theme, custom colors, and layout properties. */
  styles?: CardStyles
  /** Optional elevation level for depth appearance (0-24). */
  elevation?: number
}

// --------------------------------------------------------------------------
// CARD CONTENT PROPS
// --------------------------------------------------------------------------

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The content to display inside the card content area. */
  children: React.ReactNode
  /** Comprehensive styling options including theme, custom colors, and layout properties. */
  styles?: CardStyles
}

// --------------------------------------------------------------------------
// CARD ACTIONS PROPS
// --------------------------------------------------------------------------

export interface CardActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The actions/buttons to display in the card actions area. */
  children: React.ReactNode
  /** Comprehensive styling options including theme, custom colors, and layout properties. */
  styles?: CardStyles
}

// --------------------------------------------------------------------------
// CARD HEADER PROPS
// --------------------------------------------------------------------------

export interface CardHeaderProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'title'> {
  /** The header content to display in the card header area. */
  children?: React.ReactNode
  /** The title text for the card header. */
  title?: string
  /** The subtitle text for the card header. */
  subtitle?: string
  /** Action element to display on the right side of the header. */
  action?: React.ReactNode
  /** Avatar element to display on the left side of the header. */
  avatar?: React.ReactNode
  /** Comprehensive styling options including theme, custom colors, and layout properties. */
  styles?: CardStyles
}

// --------------------------------------------------------------------------
// SACRED THEME BACKGROUND DECORATIONS
// --------------------------------------------------------------------------

const SacredBackground: React.FC<{
  isVisible: boolean
  isHovered: boolean
}> = ({ isVisible, isHovered }) => {
  if (!isVisible) return null

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      {/* Sacred Glyphs Background */}
      <SacredBackgroundGlyphs isHovered={isHovered} />

      {/* Shimmer effect on hover */}
      {isHovered && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background:
              'linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.1), transparent)',
            animation: 'sacredShimmer 1.5s ease-in-out',
            zIndex: 1,
          }}
        />
      )}
    </div>
  )
}

const SacredBackgroundGlyphs: React.FC<{ isHovered: boolean }> = ({
  isHovered,
}) => {
  const [randoms, setRandoms] = React.useState(
    Array.from({ length: 4 }, () => ({
      fontSize: 16,
      left: '50%',
      top: '50%',
      rotation: 0,
      duration: 60,
    }))
  )

  React.useEffect(() => {
    setRandoms(
      Array.from({ length: 4 }, () => ({
        fontSize: Math.random() * 20 + 12,
        left: `${Math.random() * 80 + 10}%`,
        top: `${Math.random() * 80 + 10}%`,
        rotation: Math.random() * 360,
        duration: Math.random() * 40 + 60,
      }))
    )
  }, [])

  return (
    <>
      {SACRED_GLYPHS.slice(0, 4).map((glyph: string, index: number) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            fontSize: randoms[index]?.fontSize ?? 16,
            opacity: isHovered ? 0.08 : 0.03,
            color: '#FFD700',
            left: randoms[index]?.left ?? '50%',
            top: randoms[index]?.top ?? '50%',
            transform: `rotate(${randoms[index]?.rotation ?? 0}deg)`,
            userSelect: 'none',
            transition: 'opacity 0.3s ease',
            animation: `sacredGlyphRotate ${randoms[index]?.duration ?? 60}s linear infinite`,
          }}
        >
          {glyph}
        </div>
      ))}
    </>
  )
}

// --------------------------------------------------------------------------
// MAIN CARD COMPONENT
// --------------------------------------------------------------------------

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, styles, elevation = 1, className, ...restProps }, ref) => {
    const [isHovered, setIsHovered] = useState(false)
    const isDisabled = styles?.disabled
    const isSacredTheme = styles?.theme === 'sacred'

    React.useEffect(() => {
      injectKeyframes()
    }, [])

    const computedStyles = useMemo(
      () => getCardStyles(styles, isHovered, isDisabled, elevation),
      [styles, isHovered, isDisabled, elevation]
    )

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
        style={computedStyles.container}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...restProps}
      >
        {/* Sacred theme background decorations */}
        <SacredBackground isVisible={isSacredTheme} isHovered={isHovered} />

        {/* Main content */}
        <div style={{ position: 'relative', zIndex: 2 }}>{children}</div>
      </div>
    )
  }
)

Card.displayName = 'Card'

// --------------------------------------------------------------------------
// CARD CONTENT COMPONENT
// --------------------------------------------------------------------------

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ children, styles, className, ...restProps }, ref) => {
    const computedStyles = useMemo(() => getCardStyles(styles), [styles])

    return (
      <div
        ref={ref}
        className={className}
        style={computedStyles.content}
        {...restProps}
      >
        {children}
      </div>
    )
  }
)

CardContent.displayName = 'CardContent'

// --------------------------------------------------------------------------
// CARD ACTIONS COMPONENT
// --------------------------------------------------------------------------

export const CardActions = forwardRef<HTMLDivElement, CardActionsProps>(
  ({ children, styles, className, ...restProps }, ref) => {
    const computedStyles = useMemo(() => getCardStyles(styles), [styles])

    return (
      <div
        ref={ref}
        className={className}
        style={computedStyles.actions}
        {...restProps}
      >
        {children}
      </div>
    )
  }
)

CardActions.displayName = 'CardActions'

// --------------------------------------------------------------------------
// CARD HEADER COMPONENT
// --------------------------------------------------------------------------

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
    const computedStyles = useMemo(() => getCardStyles(styles), [styles])
    const themeName = styles?.theme || 'light'
    const subtitleColor =
      themeName === 'sacred'
        ? 'rgba(255, 215, 0, 0.75)'
        : themeName === 'dark'
          ? 'rgba(248, 250, 252, 0.7)'
          : 'rgba(0, 0, 0, 0.6)'

    return (
      <div
        ref={ref}
        className={className}
        style={computedStyles.header}
        {...restProps}
      >
        {avatar && <div style={{ marginRight: '16px' }}>{avatar}</div>}
        <div style={{ flex: '1 1 auto', minWidth: 0 }}>
          {title && (
            <div
              style={{
                fontSize: '1.25rem',
                fontWeight: 500,
                lineHeight: 1.6,
                marginBottom: subtitle ? '4px' : 0,
              }}
            >
              {title}
            </div>
          )}
          {subtitle && (
            <div
              style={{
                fontSize: '0.875rem',
                color: subtitleColor,
                lineHeight: 1.43,
              }}
            >
              {subtitle}
            </div>
          )}
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
