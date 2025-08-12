/**
 * @fileoverview ToggleButton and ToggleButtonGroup components for goobs-frontend
 * Provides toggleable button functionality with sacred theme support
 */
'use client'

import React, { useState, useMemo, ReactNode } from 'react'
import { getButtonStyles } from '../../theme'
import type { ButtonStyles } from '../../theme'

// --------------------------------------------------------------------------
// TOGGLE BUTTON PROPS INTERFACE
// --------------------------------------------------------------------------

export interface ToggleButtonProps {
  value: string
  children: ReactNode
  selected?: boolean
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  disabled?: boolean
  size?: 'small' | 'medium' | 'large'
  styles?: ButtonStyles
  isFirst?: boolean
  isLast?: boolean
  'aria-label'?: string
}

// --------------------------------------------------------------------------
// TOGGLE BUTTON GROUP PROPS INTERFACE
// --------------------------------------------------------------------------

export interface ToggleButtonGroupProps {
  value: string | null
  exclusive?: boolean
  onChange: (
    event: React.MouseEvent<HTMLElement>,
    newValue: string | null
  ) => void
  children: React.ReactNode
  size?: 'small' | 'medium' | 'large'
  styles?: ButtonStyles
}

// --------------------------------------------------------------------------
// TOGGLE BUTTON COMPONENT
// --------------------------------------------------------------------------

export const ToggleButton: React.FC<ToggleButtonProps> = ({
  value,
  children,
  selected = false,
  onClick,
  disabled = false,
  size = 'medium',
  styles,
  isFirst = false,
  isLast = false,
  'aria-label': ariaLabel,
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isPressed, setIsPressed] = useState(false)

  const buttonStyles = useMemo(() => {
    const baseStyles = getButtonStyles(styles)
    const theme = styles?.theme || 'light'

    // Size configurations
    const sizeConfig = {
      small: { padding: '6px 12px', fontSize: '14px' },
      medium: { padding: '8px 16px', fontSize: '16px' },
      large: { padding: '12px 24px', fontSize: '18px' },
    }

    // Theme-specific styling
    let themeStyles = {}
    if (theme === 'sacred') {
      themeStyles = {
        backgroundColor: selected
          ? 'rgba(255, 215, 0, 0.2)'
          : 'rgba(255, 215, 0, 0.05)',
        color: selected ? '#FFD700' : 'rgba(255, 215, 0, 0.8)',
        borderTop: selected
          ? '1px solid rgba(255, 215, 0, 0.8)'
          : '1px solid rgba(255, 215, 0, 0.3)',
        borderBottom: selected
          ? '1px solid rgba(255, 215, 0, 0.8)'
          : '1px solid rgba(255, 215, 0, 0.3)',
        borderLeft: selected
          ? '1px solid rgba(255, 215, 0, 0.8)'
          : '1px solid rgba(255, 215, 0, 0.3)',
        borderRight: selected
          ? '1px solid rgba(255, 215, 0, 0.8)'
          : '1px solid rgba(255, 215, 0, 0.3)',
        fontFamily: 'var(--font-cinzel), serif',
        textShadow: selected
          ? '0 0 4px rgba(255, 215, 0, 0.6)'
          : '0 0 2px rgba(255, 215, 0, 0.3)',
        boxShadow: selected
          ? '0 0 12px rgba(255, 215, 0, 0.3), inset 0 0 8px rgba(255, 215, 0, 0.1)'
          : '0 0 4px rgba(255, 215, 0, 0.1)',
        backdropFilter: 'blur(8px)',
        ...(isHovered &&
          !disabled && {
            backgroundColor: selected
              ? 'rgba(255, 215, 0, 0.3)'
              : 'rgba(255, 215, 0, 0.1)',
            boxShadow:
              '0 0 16px rgba(255, 215, 0, 0.4), inset 0 0 8px rgba(255, 215, 0, 0.1)',
            textShadow: '0 0 6px rgba(255, 215, 0, 0.8)',
          }),
        ...(isPressed &&
          !disabled && {
            backgroundColor: 'rgba(255, 215, 0, 0.4)',
            transform: 'translateY(1px)',
          }),
      }
    } else if (theme === 'dark') {
      themeStyles = {
        backgroundColor: selected
          ? 'rgba(59, 130, 246, 0.3)'
          : 'rgba(75, 85, 99, 0.3)',
        color: selected ? '#60a5fa' : '#d1d5db',
        borderTop: selected
          ? '1px solid #60a5fa'
          : '1px solid rgba(75, 85, 99, 0.8)',
        borderBottom: selected
          ? '1px solid #60a5fa'
          : '1px solid rgba(75, 85, 99, 0.8)',
        borderLeft: selected
          ? '1px solid #60a5fa'
          : '1px solid rgba(75, 85, 99, 0.8)',
        borderRight: selected
          ? '1px solid #60a5fa'
          : '1px solid rgba(75, 85, 99, 0.8)',
        ...(isHovered &&
          !disabled && {
            backgroundColor: selected
              ? 'rgba(59, 130, 246, 0.4)'
              : 'rgba(75, 85, 99, 0.5)',
          }),
      }
    } else {
      // Light theme
      themeStyles = {
        backgroundColor: selected
          ? 'rgba(59, 130, 246, 0.1)'
          : 'rgba(241, 245, 249, 0.8)',
        color: selected ? '#2563eb' : '#475569',
        borderTop: selected
          ? '1px solid #2563eb'
          : '1px solid rgba(226, 232, 240, 0.8)',
        borderBottom: selected
          ? '1px solid #2563eb'
          : '1px solid rgba(226, 232, 240, 0.8)',
        borderLeft: selected
          ? '1px solid #2563eb'
          : '1px solid rgba(226, 232, 240, 0.8)',
        borderRight: selected
          ? '1px solid #2563eb'
          : '1px solid rgba(226, 232, 240, 0.8)',
        ...(isHovered &&
          !disabled && {
            backgroundColor: selected
              ? 'rgba(59, 130, 246, 0.2)'
              : 'rgba(226, 232, 240, 1)',
          }),
      }
    }

    // Group styling overrides
    let groupStyles = {}
    if (isFirst || isLast) {
      groupStyles = {
        borderRadius: isFirst ? '7px 0 0 7px' : isLast ? '0 7px 7px 0' : '0',
        margin: 0,
      }
      // Remove right border for non-last items in group
      if (!isLast) {
        groupStyles = {
          ...groupStyles,
          borderRight: 'none',
        }
      }
    }

    return {
      ...baseStyles.container,
      ...sizeConfig[size],
      ...themeStyles,
      borderRadius: '6px',
      fontWeight: selected ? '600' : '500',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative' as const,
      userSelect: 'none' as const,
      outline: 'none',
      textDecoration: 'none',
      ...groupStyles,
    } as React.CSSProperties
  }, [styles, selected, isHovered, isPressed, disabled, size, isFirst, isLast])

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled && onClick) {
      onClick(event)
    }
  }

  return (
    <button
      style={buttonStyles}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-pressed={selected}
      data-value={value}
    >
      {children}
    </button>
  )
}

// --------------------------------------------------------------------------
// TOGGLE BUTTON GROUP COMPONENT
// --------------------------------------------------------------------------

export const ToggleButtonGroup: React.FC<ToggleButtonGroupProps> = ({
  value,
  exclusive = true,
  onChange,
  children,
  size = 'medium',
  styles,
}) => {
  const childrenArray = React.Children.toArray(children)
  const totalChildren = childrenArray.length

  const groupStyles = useMemo(() => {
    const baseStyles = getButtonStyles(styles)
    const theme = styles?.theme || 'light'

    let borderColor = 'rgba(226, 232, 240, 0.8)'
    if (theme === 'sacred') {
      borderColor = 'rgba(255, 215, 0, 0.4)'
    } else if (theme === 'dark') {
      borderColor = 'rgba(75, 85, 99, 0.8)'
    }

    return {
      display: 'inline-flex',
      position: 'relative' as const,
      border: `1px solid ${borderColor}`,
      borderRadius: baseStyles.container.borderRadius || '8px',
      overflow: 'hidden',
    } as React.CSSProperties
  }, [styles])

  const enhancedChildren = React.Children.map(children, (child, index) => {
    if (React.isValidElement<ToggleButtonProps>(child)) {
      const isFirst = index === 0
      const isLast = index === totalChildren - 1
      const isSelected = child.props.value === value

      return React.cloneElement(child, {
        ...child.props,
        selected: isSelected,
        size,
        styles: {
          ...styles,
          ...child.props.styles,
        },
        onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
          if (exclusive) {
            const newValue = isSelected ? null : child.props.value
            onChange(e, newValue)
          } else {
            onChange(e, child.props.value)
          }

          if (child.props.onClick) {
            child.props.onClick(e)
          }
        },
        isFirst,
        isLast,
      })
    }
    return child
  })

  return <div style={groupStyles}>{enhancedChildren}</div>
}

export default ToggleButton
