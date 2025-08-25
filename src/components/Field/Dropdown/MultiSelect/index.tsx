'use client'

import React, { useState, useCallback, useRef, useEffect } from 'react'
import {
  getSharedFormFieldStyles,
  getSharedLabelStyles,
  getSharedContainerStyles,
  getSharedFooterTextStyles,
  getRequiredIndicatorStyle,
  type FormFieldStyles,
} from '../../../../theme'
import Chip from '../../../Chip'
import ExpandMoreIcon from '../../../Icons/ExpandMore'

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
  styles?: FormFieldStyles
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

  const { themeConfig, borderColor, labelColor, footerTextColor, transition } =
    getSharedFormFieldStyles(styles, focused)

  // Get theme name for conditional styling
  const themeName = styles?.theme || 'sacred'
  const isSacredTheme = themeName === 'sacred'

  // Update selected values from external changes
  useEffect(() => {
    if (defaultSelected && Array.isArray(defaultSelected)) {
      setSelectedValues(defaultSelected)
    } else if (!defaultSelected) {
      setSelectedValues([])
    }
  }, [defaultSelected])



  // Handle clicks outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
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

  const componentStyles = {
    container: getSharedContainerStyles(styles),
    label: getSharedLabelStyles(labelColor, themeConfig),
    selectWrapper: {
      position: 'relative' as const,
    },
    chipContainer: {
      display: 'flex',
      alignItems: 'flex-start', // Changed to allow vertical expansion
      flexWrap: 'wrap' as const,
      gap: '6px', // Increased gap for better spacing
      minHeight: styles?.height || '40px',
      height: 'auto', // Allow height to grow with content
      flex: 1,
      border: `${styles?.borderWidth || '1px'} solid ${borderColor}`,
      borderRadius: styles?.borderRadius || '8px',
      backgroundColor: themeConfig.background,
      color: themeConfig.text,
      padding: styles?.padding || '12px 40px 12px 16px', // Increased vertical padding
      cursor: styles?.disabled ? 'not-allowed' : 'pointer',
      transition,
      ...(styles?.disabled && {
        backgroundColor: '#E0E0E0',
        color: '#9E9E9E',
        borderColor: '#BDBDBD',
      }),
    },
    placeholder: {
      color: themeConfig.text,
      opacity: 0.6,
      padding: '2px 0', // Add padding to align with chips
    },
    iconWrapper: {
      position: 'absolute' as const,
      top: '50%',
      right: '12px',
      transform: 'translateY(-50%)',
      display: 'flex',
      alignItems: 'center',
      pointerEvents: 'none' as const,
    },
    icon: {
      width: '20px',
      height: '20px',
      color: styles?.disabled ? '#9E9E9E' : themeConfig.text,
      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
      transition,
    },
    dropdown: {
      position: 'absolute' as const,
      top: 'calc(100% + 4px)',
      left: '0',
      right: '0',
      zIndex: 99999,
      maxHeight: '200px',
      overflowY: 'auto' as const,
      overflowX: 'hidden' as const,
      border: `${styles?.borderWidth || '1px'} solid ${borderColor}`,
      borderRadius: styles?.borderRadius || '8px',
      backgroundColor: themeConfig.background,
      boxShadow:
        '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    },
    option: {
      display: 'flex',
      alignItems: 'center',
      padding: '8px 12px',
      cursor: 'pointer',
      transition,
      color: themeConfig.text,
    },
    checkbox: {
      marginRight: '8px',
    },
    footerText: getSharedFooterTextStyles(footerTextColor, themeConfig, styles),
  }

  const handleToggle = useCallback(
    (value: string, event?: React.MouseEvent) => {
      if (event) {
        event.preventDefault()
        event.stopPropagation()
      }
      if (styles?.disabled) return
      const newSelectedValues = selectedValues.includes(value)
        ? selectedValues.filter(v => v !== value)
        : [...selectedValues, value]
      setSelectedValues(newSelectedValues)
      onChange?.(newSelectedValues)
      // Don't close the dropdown - let user select multiple items
    },
    [selectedValues, onChange, styles?.disabled]
  )

  const handleContainerClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (styles?.disabled) return
      event.preventDefault()
      event.stopPropagation()
      setIsOpen(!isOpen)
    },
    [isOpen, styles?.disabled]
  )

  const handleFocus = useCallback(
    (event: React.FocusEvent<HTMLDivElement>) => {
      if (styles?.disabled) return
      setFocused(true)
      onFocus?.(event)
    },
    [onFocus, styles?.disabled]
  )

  const handleBlur = useCallback(() => {
    if (styles?.disabled) return
    setFocused(false)
  }, [styles?.disabled])

  return (
    <div style={componentStyles.container}>
      <label style={componentStyles.label}>
        {label}
        {styles?.required && (
          <span style={getRequiredIndicatorStyle(styles)}>
            {styles?.requiredIndicatorText || ' *'}
          </span>
        )}
      </label>
      <div style={componentStyles.selectWrapper}>
        <div style={{ position: 'relative', width: '100%' }} ref={containerRef}>
          <div
            style={componentStyles.chipContainer}
            onClick={handleContainerClick}
            onFocus={handleFocus}
            onBlur={handleBlur}
            tabIndex={styles?.disabled ? -1 : 0}
          >
            {selectedValues.length === 0 ? (
              <span style={componentStyles.placeholder}>Select items...</span>
            ) : (
              selectedValues.map(selectedValue => {
                // Find the option to get the display name
                // First try to match by _id, then by value
                const option = options.find(opt => opt._id === selectedValue) || 
                              options.find(opt => opt.value === selectedValue)
                const displayLabel = option ? option.value : selectedValue
                
                return (
                  <Chip
                    key={selectedValue}
                    label={displayLabel}
                    {...(styles?.disabled
                      ? {}
                      : { onDelete: () => handleToggle(selectedValue) })}
                    styles={{
                      theme: styles?.theme || 'light',
                      padding: '6px 12px', // Better padding for chips
                      height: 'auto', // Allow chip height to adjust
                      fontSize: '14px', // Consistent font size
                      whiteSpace: 'normal', // Allow text wrapping if needed
                      wordBreak: 'break-word', // Break long words
                    }}
                  />
                )
              })
            )}
          </div>
          <div style={componentStyles.iconWrapper}>
            <ExpandMoreIcon
              styles={{ theme: styles?.theme || 'sacred' }}
              style={componentStyles.icon}
            />
          </div>
          {isOpen && (
            <div style={componentStyles.dropdown}>
              {options.map(option => {
                const isSelected = selectedValues.includes(option._id || option.value)
                
                return (
                  <div
                    key={option._id || option.value}
                    style={{
                      ...componentStyles.option,
                      backgroundColor: isSelected
                        ? isSacredTheme
                          ? 'rgba(255, 215, 0, 0.2)'
                          : 'rgba(59, 130, 246, 0.1)'
                        : 'transparent',
                    }}
                    onClick={e => handleToggle(option._id || option.value, e)}
                    onMouseEnter={e => {
                      if (!isSelected) {
                        e.currentTarget.style.backgroundColor = isSacredTheme
                          ? 'rgba(255, 215, 0, 0.1)'
                          : 'rgba(229, 231, 235, 1)'
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
                      style={componentStyles.checkbox}
                      onClick={e => e.stopPropagation()}
                    />
                    <span>{option.value}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
      {helperText && <div style={componentStyles.footerText}>{helperText}</div>}
    </div>
  )
}

export default MultiSelectChip
