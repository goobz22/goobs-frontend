'use client'

import React, { useState, useCallback, useRef } from 'react'
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
  // Remove dropdownRef as it's no longer needed

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
      // Let the select element handle the opening
      const selectElement =
        event.currentTarget.parentElement?.querySelector('select')
      if (selectElement) {
        selectElement.focus()
      }
    },
    [styles?.disabled]
  )

  const handleFocus = useCallback(
    (event: React.FocusEvent<HTMLDivElement>) => {
      if (styles?.disabled) return
      setFocused(true)
      onFocus?.(event)
    },
    [onFocus, styles?.disabled]
  )

  // Remove handleOptionClick as it's no longer needed with native select

  // Native select handles its own outside click behavior

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
        <div style={{ position: 'relative', width: '100%' }}>
          <div
            ref={containerRef}
            onClick={handleContainerClick}
            onFocus={handleFocus}
            style={componentStyles.chipContainer}
            tabIndex={styles?.disabled ? -1 : 0}
            aria-required={styles?.required || undefined}
          >
            {selectedValues.length === 0 ? (
              <span style={componentStyles.placeholder}>{label}</span>
            ) : (
              selectedValues.map(value => (
                <Chip
                  key={value}
                  label={value}
                  {...(styles?.disabled
                    ? {}
                    : { onDelete: () => handleToggle(value) })}
                  styles={{
                    theme: styles?.theme || 'light',
                  }}
                />
              ))
            )}
          </div>
          <select
            multiple
            value={selectedValues}
            onChange={e => {
              const selected = Array.from(
                e.target.selectedOptions,
                option => option.value
              )
              setSelectedValues(selected)
              onChange?.(selected)
            }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              opacity: 0,
              cursor: 'pointer',
            }}
            disabled={styles?.disabled}
            size={isOpen ? Math.min(options.length, 6) : 1}
            onFocus={() => setIsOpen(true)}
            onBlur={() => setIsOpen(false)}
          >
            {options.map(option => (
              <option key={option._id || option.value} value={option.value}>
                {option.value}
              </option>
            ))}
          </select>
          <div style={componentStyles.iconWrapper}>
            <ExpandMoreIcon
              styles={{ theme: styles?.theme || 'sacred' }}
              style={componentStyles.icon}
            />
          </div>
        </div>
      </div>
      {helperText && <div style={componentStyles.footerText}>{helperText}</div>}
    </div>
  )
}

export default MultiSelectChip
