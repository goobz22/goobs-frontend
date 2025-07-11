/**
 * @fileoverview This file defines the Button component, a versatile and themeable button element.
 * It supports both a modern "premium" theme and a stylized "sacred" theme, with extensive
 * customization options for icons, text, and layout.
 *
 * The component is built with React and is being transitioned to Tailwind CSS for styling,
 * ensuring consistency and maintainability. It is designed to be highly reusable and
 * adaptable to various use cases within the application.
 */
'use client'

import React, { useState, useEffect, useMemo, ReactNode } from 'react'

// --------------------------------------------------------------------------
// SACRED THEMING CONSTANTS
// --------------------------------------------------------------------------

const SACRED_GLYPHS = [
  '𓁟',
  '𓂀',
  '𓃀',
  '𓄿',
  '𓊖',
  '𓊗',
  '𓋴',
  '𓏏',
  '𓊨',
  '𓁦',
  '𓅓',
  '𓆄',
  '𓇳',
  '𓈖',
  '𓊹',
  '𓊺',
  '𓊻',
  '𓋹',
  '𓌻',
  '𓍿',
  '𓅨',
  '𓂋',
  '𓏭',
  '𓊵',
]

// --------------------------------------------------------------------------
// PROPS INTERFACE
// --------------------------------------------------------------------------

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'style'> {
  /** The text content of the button. */
  text?: string
  /** An icon to display within the button. Can be a React node or a component. */
  icon?: ReactNode
  /** The position of the icon relative to the text. */
  iconLocation?: 'left' | 'right' | 'above'
  /** The alignment of the button's content (text and icon). */
  contentAlign?: 'left' | 'center' | 'right'
  /** If true, enables the "sacred" theme for a stylized appearance. */
  sacredtheme?: boolean
  /** If true, displays an outline style. */
  outline?: boolean
  /** If true, the button will be in a loading state. */
  loading?: boolean
  /** Custom styles to apply to the button container. */
  style?: React.CSSProperties
  /** Additional CSS classes for custom styling. */
  className?: string
}

// --------------------------------------------------------------------------
// STYLING (to be migrated to Tailwind variants)
// --------------------------------------------------------------------------
const premiumStyles: Record<string, React.CSSProperties> = {
  container: {
    display: 'inline-flex',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    borderRadius: '10px',
    border: '1px solid rgba(226, 232, 240, 0.8)',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(8px)',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
    cursor: 'pointer',
    fontFamily: '"Inter", sans-serif',
    fontWeight: 600,
    fontSize: '14px',
    letterSpacing: '-0.025em',
    color: 'rgb(55, 65, 81)',
    textAlign: 'center',
    userSelect: 'none',
    whiteSpace: 'nowrap',
    padding: '12px 24px',
    minHeight: '44px',
    gap: '8px',
  },
  containerNoOutline: {
    border: 'none',
    boxShadow: 'none',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  containerHover: {
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15), 0 2px 6px rgba(0, 0, 0, 0.08)',
    backgroundColor: 'rgba(239, 246, 255, 0.95)',
    borderColor: 'rgba(59, 130, 246, 0.3)',
    color: 'rgb(29, 78, 216)',
  },
  containerActive: {
    transform: 'translateY(0px)',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.08)',
  },
  containerDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
    backgroundColor: 'rgba(249, 250, 251, 0.8)',
    color: 'rgb(156, 163, 175)',
    transform: 'none',
    boxShadow: 'none',
  },
}

const sacredStyles: Record<string, React.CSSProperties> = {
  container: {
    display: 'inline-flex',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.4s ease',
    borderRadius: '12px',
    border: '2px solid rgba(255, 215, 0, 0.4)',
    backgroundColor: 'rgba(10, 10, 10, 0.9)',
    backdropFilter: 'blur(8px)',
    boxShadow:
      '0 0 20px rgba(255, 215, 0, 0.2), 0 0 40px rgba(255, 215, 0, 0.1)',
    cursor: 'pointer',
    fontFamily: '"Cinzel", serif',
    fontWeight: 700,
    fontSize: '15px',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    color: 'rgba(255, 215, 0, 0.9)',
    textAlign: 'center',
    userSelect: 'none',
    whiteSpace: 'nowrap',
    padding: '16px 32px',
    minHeight: '52px',
    gap: '12px',
    textShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
  },
  containerNoOutline: {
    border: 'none',
    boxShadow: 'none',
  },
  containerHover: {
    transform: 'translateY(-2px)',
    borderColor: 'rgba(255, 215, 0, 0.8)',
    boxShadow:
      '0 0 30px rgba(255, 215, 0, 0.4), 0 0 60px rgba(255, 215, 0, 0.2)',
    color: '#FFD700',
    textShadow: '0 0 15px rgba(255, 215, 0, 0.8)',
  },
  containerActive: {
    transform: 'translateY(-1px)',
    boxShadow:
      '0 0 20px rgba(255, 215, 0, 0.3), 0 0 40px rgba(255, 215, 0, 0.15)',
  },
  containerDisabled: {
    opacity: 0.4,
    cursor: 'not-allowed',
    backgroundColor: 'rgba(10, 10, 10, 0.6)',
    color: 'rgba(255, 215, 0, 0.3)',
    borderColor: 'rgba(255, 215, 0, 0.2)',
    transform: 'none',
    boxShadow: 'none',
    textShadow: 'none',
  },
  glyph: {
    position: 'absolute',
    fontSize: '14px',
    color: 'rgba(255, 215, 0, 0.3)',
    transition: 'all 0.3s ease',
    opacity: 0,
    pointerEvents: 'none',
  },
  glyphLeft: {
    left: '8px',
    top: '50%',
    transform: 'translateY(-50%)',
  },
  glyphRight: {
    right: '8px',
    top: '50%',
    transform: 'translateY(-50%)',
  },
  glyphVisible: {
    opacity: 1,
  },
}
// --------------------------------------------------------------------------
// BUTTON COMPONENT
// --------------------------------------------------------------------------

/**
 * A versatile and themeable button component.
 */
const Button: React.FC<ButtonProps> = ({
  text,
  icon,
  iconLocation = 'left',
  contentAlign = 'center',
  sacredtheme = false,
  outline = true,
  loading = false,
  disabled = false,
  className,
  style,
  onClick,
  ...restProps
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isActive, setIsActive] = useState(false)

  const [leftGlyph, setLeftGlyph] = useState(
    SACRED_GLYPHS[Math.floor(Math.random() * SACRED_GLYPHS.length)]
  )
  const [rightGlyph, setRightGlyph] = useState(
    SACRED_GLYPHS[Math.floor(Math.random() * SACRED_GLYPHS.length)]
  )

  const isReallyDisabled = disabled || loading
  const isIconOnly = !!icon && !text

  useEffect(() => {
    console.log('Button mounted or props changed:', {
      text,
      sacredtheme,
      disabled,
      loading,
    })
  }, [text, sacredtheme, disabled, loading])

  // Change sacred glyphs on hover for a dynamic effect
  useEffect(() => {
    if (sacredtheme && isHovered) {
      const timer = setTimeout(() => {
        setLeftGlyph(
          SACRED_GLYPHS[Math.floor(Math.random() * SACRED_GLYPHS.length)]
        )
        setRightGlyph(
          SACRED_GLYPHS[Math.floor(Math.random() * SACRED_GLYPHS.length)]
        )
      }, 300) // Debounce to avoid excessive changes
      return () => clearTimeout(timer)
    }
  }, [isHovered, sacredtheme])

  const handleMouseEnter = () => {
    console.log('Mouse entered button')
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    console.log('Mouse left button')
    setIsHovered(false)
    setIsActive(false)
  }

  const handleMouseDown = () => {
    console.log('Mouse down on button')
    setIsActive(true)
  }

  const handleMouseUp = () => {
    console.log('Mouse up on button')
    setIsActive(false)
  }

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    console.log('Button clicked')
    if (!isReallyDisabled && onClick) {
      onClick(event)
    }
  }

  // Memoize styles to prevent recalculations on every render
  const computedStyle = useMemo(() => {
    const baseStyles = sacredtheme ? sacredStyles : premiumStyles
    let combinedStyle: React.CSSProperties = { ...baseStyles.container }

    if (!outline) {
      combinedStyle = { ...combinedStyle, ...baseStyles.containerNoOutline }
    }
    if (isReallyDisabled) {
      combinedStyle = { ...combinedStyle, ...baseStyles.containerDisabled }
    } else {
      if (isHovered) {
        combinedStyle = { ...combinedStyle, ...baseStyles.containerHover }
      }
      if (isActive) {
        combinedStyle = { ...combinedStyle, ...baseStyles.containerActive }
      }
    }

    const justifyContent =
      contentAlign === 'left'
        ? 'flex-start'
        : contentAlign === 'right'
          ? 'flex-end'
          : 'center'

    const flexDirection: React.CSSProperties['flexDirection'] =
      iconLocation === 'above' ? 'column' : 'row'

    return {
      ...combinedStyle,
      justifyContent,
      flexDirection,
      ...style, // Allow overriding with custom styles
    }
  }, [
    sacredtheme,
    isHovered,
    isActive,
    isReallyDisabled,
    contentAlign,
    iconLocation,
    style,
    outline,
  ])

  const iconComponent = icon ? (
    <span className="button-icon">{icon}</span>
  ) : null

  const glyphStyle = useMemo(() => {
    const style: React.CSSProperties = { ...sacredStyles.glyph }
    if (isHovered && !isReallyDisabled) {
      style.opacity = sacredStyles.glyphVisible.opacity
    }
    return style
  }, [isHovered, isReallyDisabled])

  return (
    <button
      style={computedStyle}
      className={className}
      disabled={isReallyDisabled}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onClick={handleClick}
      {...restProps}
    >
      {sacredtheme && !isIconOnly && (
        <>
          <div style={{ ...glyphStyle, ...sacredStyles.glyphLeft }}>
            {leftGlyph}
          </div>
          <div style={{ ...glyphStyle, ...sacredStyles.glyphRight }}>
            {rightGlyph}
          </div>
        </>
      )}

      {iconLocation === 'above' && iconComponent}
      {iconLocation === 'left' && iconComponent}

      {text && <span className="button-text">{text}</span>}

      {iconLocation === 'right' && iconComponent}
    </button>
  )
}

Button.displayName = 'Button'

export default Button
