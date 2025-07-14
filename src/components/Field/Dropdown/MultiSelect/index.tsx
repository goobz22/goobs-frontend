'use client'

import React, { useState, useCallback, useRef, useEffect } from 'react'
import {
  getSharedFormFieldStyles,
  getSharedLabelStyles,
  getSharedContainerStyles,
  getSharedFooterTextStyles,
  getRequiredIndicatorStyle,
  getRequiredProps,
  type FormFieldStyles,
} from '../../../../theme'
import Checkbox from '../../../Checkbox'
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
  label = 'Select options',
  options = [],
  defaultSelected = [],
  onChange,
  onFocus,
  helperText,
  styles,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedValues, setSelectedValues] =
    useState<string[]>(defaultSelected)
  const [focused, setFocused] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const { themeConfig, borderColor, labelColor, footerTextColor, transition } =
    getSharedFormFieldStyles(styles, focused)

  const componentStyles = {
    container: getSharedContainerStyles(styles),
    label: getSharedLabelStyles(labelColor, themeConfig),
    selectWrapper: {
      position: 'relative' as const,
    },
    chipContainer: {
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'wrap' as const,
      gap: '0.25rem',
      minHeight: styles?.height || '40px',
      flex: 1,
      border: `${styles?.borderWidth || '1px'} solid ${borderColor}`,
      borderRadius: styles?.borderRadius || '8px',
      backgroundColor: themeConfig.background,
      color: themeConfig.text,
      padding: styles?.padding || '8px 40px 8px 16px',
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
    },
    iconWrapper: {
      position: 'absolute' as const,
      top: styles?.arrowTop || '0',
      right: styles?.arrowRight || '0',
      bottom: styles?.arrowBottom || '0',
      left: styles?.arrowLeft || 'auto',
      display: 'flex',
      alignItems: 'center',
      padding: styles?.arrowPadding || '0 12px',
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
      top: '100%',
      left: '0',
      right: '0',
      zIndex: 1000,
      maxHeight: '200px',
      overflowY: 'auto' as const,
      border: `${styles?.borderWidth || '1px'} solid ${borderColor}`,
      borderRadius: styles?.borderRadius || '8px',
      backgroundColor: themeConfig.background,
      boxShadow:
        '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      marginTop: '4px',
    },
    option: {
      display: 'flex',
      alignItems: 'center',
      padding: '8px 12px',
      cursor: 'pointer',
      transition,
      '&:hover': {
        backgroundColor:
          (styles?.theme || 'light') === 'light'
            ? '#F7FAFC'
            : (styles?.theme || 'light') === 'dark'
              ? '#2D3748'
              : 'rgba(255, 215, 0, 0.1)',
      },
    },
    optionLabel: {
      marginLeft: '8px',
      color: themeConfig.text,
    },
    footerText: getSharedFooterTextStyles(footerTextColor, themeConfig, styles),
  }

  const handleToggle = useCallback(
    (value: string) => {
      if (styles?.disabled) return
      const newSelectedValues = selectedValues.includes(value)
        ? selectedValues.filter(v => v !== value)
        : [...selectedValues, value]
      setSelectedValues(newSelectedValues)
      onChange?.(newSelectedValues)
    },
    [selectedValues, onChange, styles?.disabled]
  )

  const handleContainerClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (styles?.disabled) return
      event.preventDefault()
      setIsOpen(!isOpen)
      setFocused(true)
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

  const handleOptionClick = useCallback(
    (value: string, event: React.MouseEvent) => {
      event.preventDefault()
      event.stopPropagation()
      handleToggle(value)
      // Keep dropdown open for multi-select - don't close here
    },
    [handleToggle]
  )

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node

      // Check if click is outside both the container and dropdown
      const isOutsideContainer =
        containerRef.current && !containerRef.current.contains(target)
      const isOutsideDropdown =
        dropdownRef.current && !dropdownRef.current.contains(target)

      if (isOutsideContainer && isOutsideDropdown) {
        setIsOpen(false)
        setFocused(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

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
        <div
          ref={containerRef}
          onClick={handleContainerClick}
          onFocus={handleFocus}
          style={componentStyles.chipContainer}
          tabIndex={styles?.disabled ? -1 : 0}
          {...getRequiredProps(styles?.required)}
        >
          {selectedValues.length === 0 ? (
            <span style={componentStyles.placeholder}>{label}</span>
          ) : (
            selectedValues.map(value => (
              <Chip
                key={value}
                label={value}
                onDelete={
                  styles?.disabled ? undefined : () => handleToggle(value)
                }
                styles={{
                  theme: styles?.theme || 'light',
                }}
              />
            ))
          )}
        </div>
        <div style={componentStyles.iconWrapper}>
          <ExpandMoreIcon style={componentStyles.icon} />
        </div>
        {isOpen && (
          <div ref={dropdownRef} style={componentStyles.dropdown}>
            {options.map(option => (
              <div
                key={option._id || option.value}
                onClick={event => handleOptionClick(option.value, event)}
                style={componentStyles.option}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor =
                    (styles?.theme || 'light') === 'light'
                      ? '#F7FAFC'
                      : (styles?.theme || 'light') === 'dark'
                        ? '#2D3748'
                        : 'rgba(255, 215, 0, 0.1)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }}
              >
                <Checkbox
                  checked={selectedValues.includes(option.value)}
                  onChange={() => handleToggle(option.value)}
                  styles={{
                    theme: styles?.theme || 'light',
                  }}
                />
                <div style={componentStyles.optionLabel}>{option.value}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      {helperText && <div style={componentStyles.footerText}>{helperText}</div>}
    </div>
  )
}

export default MultiSelectChip
