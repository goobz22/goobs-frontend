'use client'

import React, { useState, useCallback, useRef, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { alpha } from '../../../../utils'
import Chip from '../../../Chip'

const SACRED_GOLD = '#FFD700'

export interface SelectOption {
  value: string
  _id?: string
}

export interface MultiSelectChipProps {
  label?: React.ReactNode
  options?: SelectOption[]
  defaultSelected?: string[]
  onChange?: (values: string[]) => void
  onFocus?: (event: React.FocusEvent<HTMLDivElement>) => void
  helperText?: string
  styles?: {
    disabled?: boolean
    required?: boolean
    theme?: string
    width?: string
    height?: string
    minHeight?: string
    borderWidth?: string
    borderRadius?: string
    padding?: string
    fontSize?: string
    marginBottom?: string
    helperTextType?: 'error' | 'info'
    requiredIndicatorText?: string
    backgroundColor?: string
    borderColor?: string
    arrowRight?: string
    arrowTop?: string
    arrowPadding?: string
    arrowBottom?: string
  }
}

const MultiSelectChip: React.FC<MultiSelectChipProps> = ({
  label = '',
  options = [],
  defaultSelected = [],
  onChange,
  onFocus,
  helperText,
  styles,
}) => {
  const [selectedValues, setSelectedValues] =
    useState<string[]>(defaultSelected)
  const [focused, setFocused] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const chipContainerButtonRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  })
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(
    null
  )

  const disabled = styles?.disabled || false
  const required = styles?.required || false

  // Create portal container on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const container = document.createElement('div')
      container.id = 'multiselect-dropdown-portal'
      document.body.appendChild(container)
      setPortalContainer(container)

      return () => {
        document.body.removeChild(container)
      }
    }
  }, [])

  useEffect(() => {
    if (defaultSelected && Array.isArray(defaultSelected)) {
      setSelectedValues(defaultSelected)
    } else if (!defaultSelected) {
      setSelectedValues([])
    }
  }, [defaultSelected])

  // Update dropdown position when opened
  useEffect(() => {
    if (isOpen && chipContainerButtonRef.current) {
      const rect = chipContainerButtonRef.current.getBoundingClientRect()
      setDropdownPosition({
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
      })
    }
  }, [isOpen])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      const clickedOutsideContainer =
        containerRef.current && !containerRef.current.contains(target)
      const clickedOutsideMenu =
        menuRef.current && !menuRef.current.contains(target)

      if (clickedOutsideContainer && clickedOutsideMenu) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [isOpen])

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: styles?.width || '100%',
    marginBottom: '16px',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '8px',
    color: SACRED_GOLD,
    fontSize: '14px',
    fontFamily: '"Cinzel", serif',
    letterSpacing: '0.05em',
  }

  const chipContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: '6px',
    minHeight: styles?.minHeight || styles?.height || '40px',
    height: styles?.height || 'auto',
    border: `${styles?.borderWidth || '1px'} solid ${styles?.borderColor || alpha(SACRED_GOLD, focused ? 0.6 : 0.3)}`,
    borderRadius: styles?.borderRadius || '8px',
    backgroundColor:
      styles?.backgroundColor ||
      (disabled ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.6)'),
    padding: styles?.padding || '12px 40px 12px 16px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: focused ? `0 0 15px ${alpha(SACRED_GOLD, 0.3)}` : 'none',
    boxSizing: 'border-box',
  }

  const placeholderStyle: React.CSSProperties = {
    color: 'rgba(255, 255, 255, 0.6)',
    fontFamily: '"Crimson Text", serif',
    fontSize: '16px',
    padding: '2px 0',
  }

  const iconWrapperStyle: React.CSSProperties = {
    position: 'absolute',
    top: styles?.arrowTop || '50%',
    right: styles?.arrowRight || '12px',
    bottom: styles?.arrowBottom,
    transform: styles?.arrowTop ? undefined : 'translateY(-50%)',
    display: 'flex',
    alignItems: 'center',
    pointerEvents: 'none',
    padding: styles?.arrowPadding,
  }

  const arrowStyle: React.CSSProperties = {
    width: 0,
    height: 0,
    borderLeft: '5px solid transparent',
    borderRight: '5px solid transparent',
    borderTop: `5px solid ${SACRED_GOLD}`,
    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
    transition: 'transform 0.3s ease',
  }

  const helperTextStyle: React.CSSProperties = {
    marginTop: '4px',
    fontSize: '12px',
    color:
      styles?.helperTextType === 'error'
        ? '#ff6b6b'
        : 'rgba(255, 255, 255, 0.6)',
    fontFamily: '"Crimson Text", serif',
  }

  const handleToggle = useCallback(
    (value: string, event?: React.MouseEvent) => {
      if (event) {
        event.preventDefault()
        event.stopPropagation()
      }
      if (disabled) return
      const newSelectedValues = selectedValues.includes(value)
        ? selectedValues.filter(v => v !== value)
        : [...selectedValues, value]
      setSelectedValues(newSelectedValues)
      onChange?.(newSelectedValues)
    },
    [selectedValues, onChange, disabled]
  )

  const handleContainerClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (disabled) return
      event.preventDefault()
      event.stopPropagation()
      setIsOpen(!isOpen)
    },
    [isOpen, disabled]
  )

  const handleFocus = useCallback(
    (event: React.FocusEvent<HTMLDivElement>) => {
      if (disabled) return
      setFocused(true)
      onFocus?.(event)
    },
    [onFocus, disabled]
  )

  const handleBlur = useCallback(() => {
    if (disabled) return
    setFocused(false)
  }, [disabled])

  return (
    <div style={containerStyle}>
      {label && (
        <label style={labelStyle}>
          {label}
          {required && (
            <span style={{ color: SACRED_GOLD, marginLeft: '4px' }}>
              {styles?.requiredIndicatorText || '*'}
            </span>
          )}
        </label>
      )}
      <div style={{ position: 'relative', width: '100%' }} ref={containerRef}>
        <div
          ref={chipContainerButtonRef}
          style={chipContainerStyle}
          onClick={handleContainerClick}
          onFocus={handleFocus}
          onBlur={handleBlur}
          tabIndex={disabled ? -1 : 0}
        >
          {selectedValues.length === 0 ? (
            <span style={placeholderStyle}>Select items...</span>
          ) : (
            selectedValues.map(selectedValue => {
              const option =
                options.find(opt => opt._id === selectedValue) ||
                options.find(opt => opt.value === selectedValue)
              const displayLabel = option ? option.value : selectedValue

              return (
                <Chip
                  key={selectedValue}
                  label={displayLabel}
                  {...(disabled
                    ? {}
                    : { onDelete: () => handleToggle(selectedValue) })}
                  styles={{
                    padding: '6px 12px',
                    height: 'auto',
                    fontSize: '14px',
                    whiteSpace: 'normal',
                    wordBreak: 'break-word',
                  }}
                />
              )
            })
          )}
        </div>
        <div style={iconWrapperStyle}>
          <div style={arrowStyle} />
        </div>
        {isOpen &&
          portalContainer &&
          ReactDOM.createPortal(
            <div
              ref={menuRef}
              style={{
                position: 'fixed',
                top: `${dropdownPosition.top}px`,
                left: `${dropdownPosition.left}px`,
                width: `${dropdownPosition.width}px`,
                zIndex: 999999,
                maxHeight: '200px',
                overflowY: 'auto',
                overflowX: 'hidden',
                border: `${styles?.borderWidth || '1px'} solid ${alpha(SACRED_GOLD, 0.3)}`,
                borderRadius: styles?.borderRadius || '8px',
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                boxShadow: `0 4px 6px ${alpha(SACRED_GOLD, 0.2)}`,
              }}
            >
              {options.map(option => {
                const isSelected = selectedValues.includes(
                  option._id || option.value
                )

                const optionStyle: React.CSSProperties = {
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px 12px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontFamily: '"Crimson Text", serif',
                  backgroundColor: isSelected
                    ? alpha(SACRED_GOLD, 0.2)
                    : 'transparent',
                }

                return (
                  <div
                    key={option._id || option.value}
                    style={optionStyle}
                    onClick={e => handleToggle(option._id || option.value, e)}
                    onMouseEnter={e => {
                      if (!isSelected) {
                        e.currentTarget.style.backgroundColor = alpha(
                          SACRED_GOLD,
                          0.1
                        )
                      }
                    }}
                    onMouseLeave={e => {
                      if (!isSelected) {
                        e.currentTarget.style.backgroundColor = 'transparent'
                      }
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}}
                      style={{ marginRight: '8px' }}
                      onClick={e => e.stopPropagation()}
                    />
                    <span>{option.value}</span>
                  </div>
                )
              })}
            </div>,
            portalContainer
          )}
      </div>
      {helperText && <div style={helperTextStyle}>{helperText}</div>}
    </div>
  )
}

MultiSelectChip.displayName = 'MultiSelectChip'

export default MultiSelectChip
