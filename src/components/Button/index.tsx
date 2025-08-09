/**
 * @fileoverview This file defines the Button component, a versatile and themeable button element.
 * It supports light, dark, and sacred themes with extensive customization options for icons, text, and layout.
 */
'use client'

import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
  forwardRef,
} from 'react'
import type { ReactNode } from 'react'
import { getButtonStyles, SACRED_GLYPHS } from '../../theme'
import type { ButtonStyles } from '../../theme'

// --------------------------------------------------------------------------
// PROPS INTERFACE
// --------------------------------------------------------------------------

export interface ButtonGroupProps {
  value: string
  exclusive?: boolean
  onChange: (
    event: React.MouseEvent<HTMLElement>,
    newValue: string | null
  ) => void
  children: React.ReactNode
  styles?: ButtonStyles // Reuse Button's styles for consistency
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  value,
  exclusive,
  onChange,
  children,
  styles,
}) => {
  const groupStyles = getButtonStyles(styles) // Get base styles from Button's theme function
  const childrenArray = React.Children.toArray(children)
  const totalChildren = childrenArray.length

  const enhancedChildren = React.Children.map(children, (child, index) => {
    if (React.isValidElement<ButtonProps>(child)) {
      const isFirst = index === 0
      const isLast = index === totalChildren - 1
      const isSelected =
        ((child.props as { value?: string }).value || '') === value

      // Get border color from theme
      const borderColor =
        styles?.theme === 'sacred'
          ? 'rgba(255, 215, 0, 0.4)'
          : styles?.theme === 'dark'
            ? 'rgba(75, 85, 99, 0.8)'
            : 'rgba(226, 232, 240, 0.8)'

      return React.cloneElement(child, {
        ...child.props,
        styles: {
          ...child.props.styles,
          ...styles, // Merge group styles with individual
          // Remove individual button borders and adjust border radius
          borderColor: 'transparent',
          borderWidth: '0',
          boxShadow: 'none',
          margin: '0',
          padding: '8px 16px', // Add proper padding for text readability
          borderRadius: isFirst
            ? `${groupStyles.container.borderRadius || '8px'} 0 0 ${groupStyles.container.borderRadius || '8px'}`
            : isLast
              ? `0 ${groupStyles.container.borderRadius || '8px'} ${groupStyles.container.borderRadius || '8px'} 0`
              : '0',
          // Add right border for all except last using border-right
          ...(!isLast && {
            borderRightWidth: '1px',
            borderRightStyle: 'solid',
            borderRightColor: borderColor,
          }),
          // Selected state background override
          ...(isSelected && {
            backgroundColor:
              styles?.theme === 'sacred'
                ? 'rgba(255, 215, 0, 0.2)'
                : styles?.theme === 'dark'
                  ? 'rgba(59, 130, 246, 0.3)'
                  : 'rgba(59, 130, 246, 0.1)',
          }),
        },
        onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
          if (exclusive) {
            onChange(e, (child.props as { value?: string }).value || '')
          }
          if (child.props.onClick) {
            child.props.onClick(e)
          }
        },
        // Inject selected based on value
        selected: isSelected,
      })
    }
    return child
  })

  const computedGroupStyle: React.CSSProperties = {
    display: 'flex',
    borderRadius: groupStyles.container.borderRadius || '8px',
    overflow: 'hidden',
    background: 'transparent',
    boxShadow: groupStyles.container.boxShadow,
    border: groupStyles.container.border,
    padding: '0',
  }

  return <div style={computedGroupStyle}>{enhancedChildren}</div>
}

// Update ButtonProps to include optional 'selected' and 'value' for toggle support
export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'style'> {
  /** The text content of the button. */
  text?: string
  /** An icon to display within the button. Can be a React node or a component. */
  icon?: ReactNode
  /** Comprehensive styling options including theme, custom colors, and layout properties. */
  styles?: ButtonStyles
  selected?: boolean // New optional prop for toggle state
  value?: string // New optional prop for toggle value
}

// --------------------------------------------------------------------------
// SACRED THEME COMPONENTS
// --------------------------------------------------------------------------

const SacredGlyphs: React.FC<{
  isHovered: boolean
  isDisabled: boolean
  isIconOnly: boolean
}> = ({ isHovered, isDisabled, isIconOnly }) => {
  // Initialize with consistent values to prevent hydration mismatch
  const [leftGlyph, setLeftGlyph] = useState(SACRED_GLYPHS[0])
  const [rightGlyph, setRightGlyph] = useState(SACRED_GLYPHS[1])
  const [isHydrated, setIsHydrated] = useState(false)

  // Set random glyphs only on client side after hydration
  useEffect(() => {
    if (!isHydrated) {
      setLeftGlyph(
        SACRED_GLYPHS[Math.floor(Math.random() * SACRED_GLYPHS.length)]
      )
      setRightGlyph(
        SACRED_GLYPHS[Math.floor(Math.random() * SACRED_GLYPHS.length)]
      )
      setIsHydrated(true)
    }
  }, [isHydrated])

  // Change sacred glyphs on hover for a dynamic effect
  useEffect(() => {
    if (isHovered && isHydrated) {
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
  }, [isHovered, isHydrated])

  const glyphStyles = useMemo(
    () => ({
      glyph: {
        position: 'absolute' as const,
        fontSize: '14px',
        color: 'rgba(255, 215, 0, 0.3)',
        transition: 'all 0.3s ease',
        opacity: 0,
        pointerEvents: 'none' as const,
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
    }),
    []
  )

  if (isIconOnly) {
    return null
  }

  return (
    <>
      <div
        style={{
          ...glyphStyles.glyph,
          ...glyphStyles.glyphLeft,
          ...(isHovered && !isDisabled && glyphStyles.glyphVisible),
        }}
      >
        {leftGlyph}
      </div>
      <div
        style={{
          ...glyphStyles.glyph,
          ...glyphStyles.glyphRight,
          ...(isHovered && !isDisabled && glyphStyles.glyphVisible),
        }}
      >
        {rightGlyph}
      </div>
    </>
  )
}

// --------------------------------------------------------------------------
// MAIN BUTTON COMPONENT
// --------------------------------------------------------------------------

/**
 * A versatile and themeable button component.
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ text, icon, styles, onClick, selected, ...restProps }, ref) => {
    const [isHovered, setIsHovered] = useState(false)
    const [isActive, setIsActive] = useState(false)

    const isDisabled = styles?.disabled || restProps.disabled
    const isIconOnly = !!icon && !text
    const isSacredTheme = styles?.theme === 'sacred'
    const iconLocation = styles?.iconLocation || 'left'

    const computedStyles = useMemo(
      () =>
        getButtonStyles(styles, isHovered, isActive || selected, isDisabled), // Treat selected as active for styling
      [styles, isHovered, isActive, selected, isDisabled]
    )

    const handleMouseEnter = useCallback(() => {
      setIsHovered(true)
    }, [])

    const handleMouseLeave = useCallback(() => {
      setIsHovered(false)
      setIsActive(false)
    }, [])

    const handleMouseDown = useCallback(() => {
      setIsActive(true)
    }, [])

    const handleMouseUp = useCallback(() => {
      setIsActive(false)
    }, [])

    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        if (!isDisabled && onClick) {
          onClick(event)
        }
      },
      [isDisabled, onClick]
    )

    const iconComponent = useMemo(() => {
      return icon ? <span>{icon}</span> : null
    }, [icon])

    return (
      <button
        ref={ref}
        style={computedStyles.container}
        disabled={isDisabled}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onClick={handleClick}
        {...restProps}
      >
        {isSacredTheme && (
          <SacredGlyphs
            isHovered={isHovered}
            isDisabled={!!isDisabled}
            isIconOnly={isIconOnly}
          />
        )}

        {iconLocation === 'above' && iconComponent}
        {iconLocation === 'left' && iconComponent}

        {text && <span>{text}</span>}

        {iconLocation === 'right' && iconComponent}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
