/**
 * @fileoverview Card component system with Content and Actions sub-components
 */
'use client'

import React, { forwardRef, useState, useMemo } from 'react'
import { CardStyles, getCardStyles, SACRED_GLYPHS } from '../../theme/card'

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
      {SACRED_GLYPHS.slice(0, 4).map((glyph, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            fontSize: Math.random() * 20 + 12,
            opacity: isHovered ? 0.08 : 0.03,
            color: '#FFD700',
            left: `${Math.random() * 80 + 10}%`,
            top: `${Math.random() * 80 + 10}%`,
            transform: `rotate(${Math.random() * 360}deg)`,
            userSelect: 'none',
            transition: 'opacity 0.3s ease',
            animation: `rotateGlyph ${Math.random() * 40 + 60}s linear infinite`,
          }}
        >
          {glyph}
        </div>
      ))}

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
            animation: 'shimmer 1.5s ease-in-out',
            zIndex: 1,
          }}
        />
      )}
    </div>
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

export default Card

// Add keyframes for animations if needed
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style')
  styleSheet.textContent = `
    @keyframes rotateGlyph {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    @keyframes shimmer {
      0% { left: -100%; }
      100% { left: 100%; }
    }
  `
  document.head.appendChild(styleSheet)
}
