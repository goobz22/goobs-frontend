'use client'

import React, {
  useState,
  useMemo,
  useCallback,
  forwardRef,
  useEffect,
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
  variant?: string
  width?: string
  minWidth?: string
  maxWidth?: string
  height?: string
  minHeight?: string
  padding?: string
  margin?: string
  marginTop?: string
  marginBottom?: string
  marginLeft?: string
  marginRight?: string
  fontSize?: string
  fontWeight?: string | number
  fontFamily?: string
  letterSpacing?: string
  textTransform?: 'none' | 'capitalize' | 'uppercase' | 'lowercase'
  borderRadius?: string
  borderWidth?: string
  borderColor?: string
  border?: string
  boxShadow?: string
  iconLocation?: 'left' | 'right' | 'above'
  whiteSpace?: 'normal' | 'nowrap' | 'pre' | 'pre-wrap' | 'pre-line'
  backgroundColor?: string
  background?: string
  color?: string
  borderRightWidth?: string
  borderRightStyle?: string
  borderRightColor?: string
  outline?: string | boolean
  hoverBackgroundColor?: string
  hoverBorderColor?: string
  hoverTransform?: string
  hoverBoxShadow?: string
  textShadow?: string
  flex?: string | number
  opacity?: number | string
  cursor?: string
  size?: string
}

export interface ButtonProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'style'
> {
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
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
      const checkMobile = () => {
        setIsMobile(window.innerWidth <= 768)
      }
      checkMobile()
      window.addEventListener('resize', checkMobile)
      return () => window.removeEventListener('resize', checkMobile)
    }, [])

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

    // Handle outline prop - convert boolean to string
    const outlineValue =
      styles?.outline === true
        ? 'none'
        : styles?.outline === false
          ? undefined
          : styles?.outline || 'none'

    // Determine background color based on state
    const getBackgroundColor = () => {
      if (isDisabled) return 'rgba(0, 0, 0, 0.3)'
      if (
        (styles?.backgroundColor || styles?.background) &&
        !isHovered &&
        !isActive &&
        !selected
      ) {
        return styles?.backgroundColor || styles?.background
      }
      if (isActive || selected) return alpha(SACRED_GOLD, 0.3)
      if (isHovered) {
        return styles?.hoverBackgroundColor || alpha(SACRED_GOLD, 0.2)
      }
      return (
        styles?.backgroundColor || styles?.background || 'rgba(0, 0, 0, 0.6)'
      )
    }

    // Determine border based on state
    const getBorderValue = () => {
      if (styles?.border) return styles.border
      const borderColor =
        isHovered && styles?.hoverBorderColor
          ? styles.hoverBorderColor
          : styles?.borderColor || alpha(SACRED_GOLD, isHovered ? 0.6 : 0.3)
      return `${styles?.borderWidth || '1px'} solid ${borderColor}`
    }

    const buttonStyle: React.CSSProperties = {
      position: 'relative',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: iconLocation === 'above' ? '4px' : '8px',
      flexDirection: iconLocation === 'above' ? 'column' : 'row',
      width: styles?.width || 'auto',
      minWidth: styles?.minWidth || 'fit-content',
      maxWidth: styles?.maxWidth,
      height: styles?.height || 'auto',
      minHeight: styles?.minHeight || (isMobile ? '36px' : '40px'),
      padding: styles?.padding || (isMobile ? '6px 12px' : '8px 16px'),
      margin: styles?.margin,
      marginTop: styles?.marginTop,
      marginBottom: styles?.marginBottom,
      marginLeft: styles?.marginLeft,
      marginRight: styles?.marginRight,
      fontSize: styles?.fontSize || (isMobile ? '12px' : '14px'),
      fontWeight: styles?.fontWeight || 500,
      fontFamily: styles?.fontFamily || '"Cinzel", serif',
      color:
        styles?.color ||
        (isDisabled ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.9)'),
      backgroundColor: getBackgroundColor(),
      border: getBorderValue(),
      borderRadius: styles?.borderRadius || '8px',
      boxShadow:
        isHovered && styles?.hoverBoxShadow
          ? styles.hoverBoxShadow
          : styles?.boxShadow ||
            (isHovered && !isDisabled
              ? `0 0 15px ${alpha(SACRED_GOLD, 0.3)}`
              : 'none'),
      textShadow: styles?.textShadow,
      flex: styles?.flex,
      cursor: styles?.cursor || (isDisabled ? 'not-allowed' : 'pointer'),
      transition: 'all 0.3s ease',
      transform:
        isHovered && styles?.hoverTransform ? styles.hoverTransform : undefined,
      outline: outlineValue,
      userSelect: 'none',
      textTransform: styles?.textTransform || 'none',
      letterSpacing: styles?.letterSpacing || '0.05em',
      boxSizing: 'border-box',
      whiteSpace: (styles?.whiteSpace as any) || 'nowrap',
      opacity: styles?.opacity,
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
