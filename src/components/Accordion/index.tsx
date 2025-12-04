'use client'

import React, {
  useState,
  useEffect,
  useCallback,
  type FC,
  type ReactNode,
} from 'react'
import Link from 'next/link'
import { alpha } from '../../utils'

const SACRED_GOLD = '#FFD700'

export interface AccordionProps {
  summary: ReactNode
  details?: ReactNode
  expanded?: boolean
  defaultExpanded?: boolean
  onChange?: (event: React.SyntheticEvent, expanded: boolean) => void
  styles?: {
    disabled?: boolean
    theme?: string
    level?: number
    padding?: string
    borderRadius?: string
    backgroundColor?: string
    summaryBackgroundColor?: string
    summaryColor?: string
    outline?: string | boolean
    levelIndentBase?: number
    levelIndentIncrement?: number
    borderColor?: string
    borderWidth?: string
    marginBottom?: string
  }
  level?: number
  type?: 'accordion' | 'menu'
  onClick?: (event: React.SyntheticEvent) => void
  href?: string
  isActive?: boolean
}

const useAccordionState = ({
  expanded: controlledExpanded,
  defaultExpanded = false,
  onChange,
  styles,
}: {
  expanded?: boolean
  defaultExpanded?: boolean
  onChange?: (event: React.SyntheticEvent, expanded: boolean) => void
  styles?: AccordionProps['styles']
}) => {
  const { current: isControlled } = React.useRef(
    controlledExpanded !== undefined
  )
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded)

  const expanded = isControlled ? controlledExpanded : internalExpanded

  const handleToggle = useCallback(
    (event: React.SyntheticEvent) => {
      if (styles?.disabled) return
      const newExpanded = !expanded
      if (!isControlled) {
        setInternalExpanded(newExpanded)
      }
      onChange?.(event, newExpanded)
    },
    [styles?.disabled, expanded, isControlled, onChange]
  )

  useEffect(() => {
    if (isControlled) {
      setInternalExpanded(controlledExpanded!)
    }
  }, [controlledExpanded, isControlled])

  return { expanded, handleToggle }
}

const Accordion: FC<AccordionProps> = props => {
  const {
    summary,
    details,
    styles,
    level = 0,
    type = 'accordion',
    onClick,
    href,
    isActive,
    expanded: controlledExpanded,
    defaultExpanded,
    onChange,
    ...rest
  } = props

  const stateConfig: {
    expanded?: boolean
    defaultExpanded?: boolean
    onChange?: (event: React.SyntheticEvent, expanded: boolean) => void
    styles?: typeof styles
  } = {}

  if (controlledExpanded !== undefined) {
    stateConfig.expanded = controlledExpanded
  }
  if (defaultExpanded !== undefined) {
    stateConfig.defaultExpanded = defaultExpanded
  }
  if (onChange !== undefined) {
    stateConfig.onChange = onChange
  }
  if (styles !== undefined) {
    stateConfig.styles = styles
  }

  const { expanded, handleToggle } = useAccordionState(stateConfig)
  const [isHovered, setIsHovered] = useState(false)

  const isSacredTheme = styles?.theme === 'sacred'
  const isMenuType = type === 'menu'
  const disabled = styles?.disabled || false

  const handleClick = useCallback(
    (event: React.SyntheticEvent) => {
      if (disabled) return
      if (isMenuType) {
        onClick?.(event)
      } else {
        handleToggle(event)
      }
    },
    [isMenuType, onClick, handleToggle, disabled]
  )

  // Calculate indent based on level
  const levelIndentBase = styles?.levelIndentBase ?? 20
  const levelIndentIncrement = styles?.levelIndentIncrement ?? 20
  const levelIndent = levelIndentBase + level * levelIndentIncrement

  // Handle outline prop - convert boolean to string
  const outlineValue =
    styles?.outline === true
      ? 'none'
      : styles?.outline === false
        ? undefined
        : styles?.outline

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    marginBottom: styles?.marginBottom || '4px',
    borderRadius: styles?.borderRadius || '8px',
    backgroundColor:
      styles?.backgroundColor ||
      (isSacredTheme ? 'rgba(0, 0, 0, 0.4)' : '#fff'),
    border: styles?.borderColor
      ? `${styles?.borderWidth || '1px'} solid ${styles.borderColor}`
      : isSacredTheme
        ? `${styles?.borderWidth || '1px'} solid ${alpha(SACRED_GOLD, 0.3)}`
        : `${styles?.borderWidth || '1px'} solid #e5e7eb`,
    transition: 'all 0.3s ease',
    overflow: 'hidden',
    outline: outlineValue,
  }

  // Determine summary background color
  const getSummaryBackgroundColor = () => {
    // Use explicit summaryBackgroundColor if provided
    if (styles?.summaryBackgroundColor && !isHovered && !isActive) {
      return styles.summaryBackgroundColor
    }
    if (isActive && isMenuType) {
      return isSacredTheme
        ? alpha(SACRED_GOLD, 0.15)
        : 'rgba(59, 130, 246, 0.1)'
    }
    if (isHovered && !disabled) {
      return isSacredTheme ? alpha(SACRED_GOLD, 0.1) : '#f9fafb'
    }
    return styles?.summaryBackgroundColor || 'transparent'
  }

  const summaryStyle: React.CSSProperties = {
    position: 'relative',
    padding: styles?.padding || '12px',
    paddingLeft: isMenuType ? `${16 + levelIndent}px` : `${40 + levelIndent}px`,
    paddingRight: '24px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: getSummaryBackgroundColor(),
    color:
      styles?.summaryColor ||
      (isActive && isMenuType
        ? isSacredTheme
          ? SACRED_GOLD
          : '#3B82F6'
        : isSacredTheme
          ? 'rgba(255, 255, 255, 0.9)'
          : '#111827'),
    fontWeight: isActive && isMenuType ? 600 : 400,
    fontFamily: isSacredTheme ? '"Cinzel", serif' : 'inherit',
    fontSize: '14px',
    transition: 'all 0.3s ease',
    whiteSpace: 'nowrap',
    minWidth: 'fit-content',
  }

  const iconStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${8 + levelIndent}px`,
    top: '50%',
    transform: `translateY(-50%) ${expanded ? 'rotate(180deg)' : 'rotate(0deg)'}`,
    transition: 'transform 0.3s ease',
    color: isSacredTheme ? SACRED_GOLD : '#6b7280',
    width: '20px',
    height: '20px',
  }

  const detailsStyle: React.CSSProperties = {
    padding: styles?.padding || '12px',
    paddingLeft: `${24 + levelIndent}px`,
    color: isSacredTheme ? 'rgba(255, 255, 255, 0.8)' : '#374151',
    fontFamily: isSacredTheme ? '"Crimson Text", serif' : 'inherit',
    fontSize: '14px',
    borderTop: isSacredTheme
      ? `1px solid ${alpha(SACRED_GOLD, 0.2)}`
      : '1px solid #e5e7eb',
  }

  const arrowIconSvg = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      style={iconStyle}
    >
      <path d="M7 10l5 5 5-5z" />
    </svg>
  )

  const summaryContent = (
    <div
      style={summaryStyle}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-expanded={isMenuType ? undefined : expanded}
      {...rest}
    >
      {!isMenuType && arrowIconSvg}
      {summary}
    </div>
  )

  return (
    <div style={containerStyle}>
      {isMenuType && href ? (
        <Link href={href} style={{ textDecoration: 'none', color: 'inherit' }}>
          {summaryContent}
        </Link>
      ) : (
        summaryContent
      )}

      {!isMenuType && expanded && details && (
        <div style={detailsStyle}>{details}</div>
      )}
    </div>
  )
}

Accordion.displayName = 'Accordion'
export default Accordion
