'use client'

import React, {
  useState,
  useMemo,
  useCallback,
  forwardRef,
  type ReactNode,
} from 'react'
import { alpha } from '../../utils'

const SACRED_GOLD = '#FFD700'

export interface ButtonGroupProps {
  value: string
  exclusive?: boolean
  onChange: (
    event: React.MouseEvent<HTMLElement>,
    newValue: string | null
  ) => void
  children: React.ReactNode
  styles?: ButtonStyles
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  value,
  exclusive,
  onChange,
  children,
  styles,
}) => {
  const childrenArray = React.Children.toArray(children)
  const totalChildren = childrenArray.length

  const enhancedChildren = React.Children.map(children, (child, index) => {
    if (React.isValidElement<ButtonProps>(child)) {
      const isFirst = index === 0
      const isLast = index === totalChildren - 1
      const isSelected =
        ((child.props as { value?: string }).value || '') === value

      const borderColor = alpha(SACRED_GOLD, 0.4)

      return React.cloneElement(child, {
        ...child.props,
        styles: {
          ...child.props.styles,
          ...styles,
          borderColor: 'transparent',
          borderWidth: '0',
          boxShadow: 'none',
          margin: '0',
          padding: '8px 16px',
          borderRadius: isFirst ? '8px 0 0 8px' : isLast ? '0 8px 8px 0' : '0',
          ...(!isLast && {
            borderRightWidth: '1px',
            borderRightStyle: 'solid',
            borderRightColor: borderColor,
          }),
          ...(isSelected && {
            backgroundColor: alpha(SACRED_GOLD, 0.2),
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
        selected: isSelected,
      })
    }
    return child
  })

  const groupStyle: React.CSSProperties = {
    display: 'flex',
    borderRadius: '8px',
    overflow: 'hidden',
    background: 'transparent',
    boxShadow: `0 0 10px ${alpha(SACRED_GOLD, 0.3)}`,
    border: `1px solid ${alpha(SACRED_GOLD, 0.3)}`,
    padding: '0',
  }

  return <div style={groupStyle}>{enhancedChildren}</div>
}

export interface ButtonStyles {
  disabled?: boolean
  theme?: string
  width?: string
  minWidth?: string
  maxWidth?: string
  height?: string
  padding?: string
  margin?: string
  marginTop?: string
  marginBottom?: string
  marginLeft?: string
  marginRight?: string
  fontSize?: string
  fontWeight?: string | number
  borderRadius?: string
  borderWidth?: string
  borderColor?: string
  boxShadow?: string
  iconLocation?: 'left' | 'right' | 'above'
  [key: string]: any
}

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'style'> {
  text?: string
  icon?: ReactNode
  styles?: ButtonStyles
  selected?: boolean
  value?: string
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ text, icon, styles, onClick, selected, ...restProps }, ref) => {
    const [isHovered, setIsHovered] = useState(false)
    const [isActive, setIsActive] = useState(false)

    const filteredProps = useMemo(() => {
      const { sacredtheme, ...validProps } = restProps as any
      void sacredtheme
      return validProps
    }, [restProps])

    const isDisabled = styles?.disabled || filteredProps.disabled
    const iconLocation = styles?.iconLocation || 'left'

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

    const buttonStyle: React.CSSProperties = {
      position: 'relative',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: iconLocation === 'above' ? '4px' : '8px',
      flexDirection: iconLocation === 'above' ? 'column' : 'row',
      width: styles?.width || 'auto',
      minWidth: styles?.minWidth,
      maxWidth: styles?.maxWidth,
      height: styles?.height || '40px',
      padding: styles?.padding || '8px 16px',
      margin: styles?.margin,
      marginTop: styles?.marginTop,
      marginBottom: styles?.marginBottom,
      marginLeft: styles?.marginLeft,
      marginRight: styles?.marginRight,
      fontSize: styles?.fontSize || '14px',
      fontWeight: styles?.fontWeight || 500,
      fontFamily: '"Cinzel", serif',
      color: isDisabled
        ? 'rgba(255, 255, 255, 0.4)'
        : 'rgba(255, 255, 255, 0.9)',
      backgroundColor: isDisabled
        ? 'rgba(0, 0, 0, 0.3)'
        : isActive || selected
          ? alpha(SACRED_GOLD, 0.3)
          : isHovered
            ? alpha(SACRED_GOLD, 0.2)
            : 'rgba(0, 0, 0, 0.6)',
      border: `${styles?.borderWidth || '1px'} solid ${styles?.borderColor || alpha(SACRED_GOLD, isHovered ? 0.6 : 0.3)}`,
      borderRadius: styles?.borderRadius || '8px',
      boxShadow:
        styles?.boxShadow ||
        (isHovered && !isDisabled
          ? `0 0 15px ${alpha(SACRED_GOLD, 0.3)}`
          : 'none'),
      cursor: isDisabled ? 'not-allowed' : 'pointer',
      transition: 'all 0.3s ease',
      outline: 'none',
      userSelect: 'none',
      textTransform: 'none',
      letterSpacing: '0.05em',
      boxSizing: 'border-box',
      whiteSpace: styles?.whiteSpace as any,
    }

    const iconComponent = useMemo(() => {
      return icon ? (
        <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>
      ) : null
    }, [icon])

    return (
      <button
        ref={ref}
        style={buttonStyle}
        disabled={isDisabled}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onClick={handleClick}
        {...filteredProps}
      >
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
