'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
import cssStyles from './Dropdown.module.css'

export interface DropdownOption {
  value: string | number
  icon?: React.ReactNode
  _id?: string
}

export interface DropdownProps {
  label: string
  options: DropdownOption[]
  defaultValue?: string | number
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void
  onBlur?: React.FocusEventHandler<HTMLSelectElement>
  onFocus?: React.FocusEventHandler<HTMLSelectElement>
  value?: string | number
  showIdColumns?: boolean
  helperText?: string
  styles?: {
    disabled?: boolean
    required?: boolean
    theme?: 'sacred' | 'light' | 'dark'
    helperTextType?: 'error' | 'warning' | 'info' | string
    height?: string
    fontSize?: string
    padding?: string
    width?: string
    marginBottom?: string
    marginTop?: string
    fullWidth?: boolean
    background?: string
    backdropFilter?: string
    fontFamily?: string
    borderRadius?: string
  }
}

const Dropdown: React.FC<DropdownProps> = ({
  label,
  options,
  defaultValue,
  onChange,
  onBlur,
  onFocus,
  value: externalValue,
  showIdColumns = false,
  helperText,
  styles,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const [value, setValue] = useState<string | number>(
    externalValue ?? defaultValue ?? ''
  )
  // dropdownPosition removed — menu uses CSS position: absolute, top: 100%

  const disabled = styles?.disabled || false
  const required = styles?.required || false
  const theme = styles?.theme || 'sacred'

  // Track previous externalValue/defaultValue to update using derived state pattern
  const [prevExternalValue, setPrevExternalValue] = useState(externalValue)
  const [prevDefaultValue, setPrevDefaultValue] = useState(defaultValue)
  if (externalValue !== prevExternalValue) {
    setPrevExternalValue(externalValue)
    if (externalValue !== undefined && externalValue !== null) {
      setValue(externalValue)
    }
  } else if (defaultValue !== prevDefaultValue) {
    setPrevDefaultValue(defaultValue)
    if (defaultValue !== undefined && defaultValue !== null) {
      setValue(defaultValue)
    }
  }

  // Filter options
  const filteredOptions = useMemo(() => {
    if (showIdColumns) return options
    return options.filter(opt => {
      const val = String(opt.value).toLowerCase()
      return !(val === 'id' || val === '_id' || /^[0-9a-f]{24}$/.test(val))
    })
  }, [options, showIdColumns])

  // Position is now handled by CSS (position: absolute, top: 100%)
  // No JavaScript positioning needed

  // Close dropdown when clicking outside or scrolling
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      const clickedOutsideContainer =
        dropdownRef.current && !dropdownRef.current.contains(target)
      const clickedOutsideMenu =
        menuRef.current && !menuRef.current.contains(target)

      if (clickedOutsideContainer && clickedOutsideMenu) {
        setIsOpen(false)
      }
    }

    const handleScroll = (event: Event) => {
      // Don't close if scrolling inside the dropdown menu itself
      if (menuRef.current && menuRef.current.contains(event.target as Node)) {
        return
      }
      setIsOpen(false)
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      // Use capture phase to catch scroll events on any scrollable ancestor
      window.addEventListener('scroll', handleScroll, true)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('scroll', handleScroll, true)
    }
  }, [isOpen])

  const handleSelect = (option: DropdownOption) => {
    const selectedValue =
      option._id != null && option._id !== ''
        ? String(option._id)
        : String(option.value)
    setValue(option.value)
    setIsOpen(false)

    // Create synthetic event for onChange compatibility
    // Use _id when available since forms typically track selection by ID
    if (onChange) {
      const syntheticEvent = {
        target: { value: selectedValue },
        currentTarget: { value: selectedValue },
      } as React.ChangeEvent<HTMLSelectElement>
      onChange(syntheticEvent)
    }
  }

  // Find selected option
  const selectedOption = filteredOptions.find(
    opt =>
      String(opt.value) === String(value) || String(opt._id) === String(value)
  )
  const displayValue = selectedOption?.value || value || 'Select...'

  // Check if we're in browser environment for portal
  const canUsePortal = typeof document !== 'undefined'

  // Build button class names
  const buttonClassNames = [cssStyles.button, isOpen && cssStyles.open]
    .filter(Boolean)
    .join(' ')

  // Build arrow class names
  const arrowClassNames = [cssStyles.arrow, isOpen && cssStyles.open]
    .filter(Boolean)
    .join(' ')

  // Build helper text class names
  const helperTextClassNames = [
    cssStyles.helperText,
    styles?.helperTextType === 'error' && cssStyles.error,
  ]
    .filter(Boolean)
    .join(' ')

  // Container style overrides
  const containerStyleOverrides: React.CSSProperties = {}
  if (styles?.fullWidth) containerStyleOverrides.width = '100%'
  else if (styles?.width) containerStyleOverrides.width = styles.width
  if (styles?.marginBottom)
    containerStyleOverrides.marginBottom = styles.marginBottom
  if (styles?.marginTop) containerStyleOverrides.marginTop = styles.marginTop

  // Button style overrides
  const buttonStyleOverrides: React.CSSProperties = {}
  if (styles?.height) buttonStyleOverrides.minHeight = styles.height
  if (styles?.fontSize) buttonStyleOverrides.fontSize = styles.fontSize
  if (styles?.padding) buttonStyleOverrides.padding = styles.padding
  if (styles?.fontFamily) buttonStyleOverrides.fontFamily = styles.fontFamily
  if (styles?.borderRadius)
    buttonStyleOverrides.borderRadius = styles.borderRadius

  // Menu style overrides (position handled by CSS)
  const menuStyleOverrides: React.CSSProperties = {}
  if (styles?.background) menuStyleOverrides.backgroundColor = styles.background
  if (styles?.backdropFilter)
    menuStyleOverrides.backdropFilter = styles.backdropFilter
  if (styles?.borderRadius)
    menuStyleOverrides.borderRadius = styles.borderRadius

  return (
    <div
      ref={dropdownRef}
      className={cssStyles.container}
      data-theme={theme}
      style={
        Object.keys(containerStyleOverrides).length > 0
          ? containerStyleOverrides
          : undefined
      }
    >
      {/* Label */}
      {label && (
        <label className={cssStyles.label}>
          {label}
          {required && <span className={cssStyles.requiredIndicator}>*</span>}
        </label>
      )}

      {/* Dropdown Button */}
      <button
        ref={buttonRef}
        type="button"
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={`${label}: ${displayValue}`}
        className={buttonClassNames}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onBlur={onBlur as any}
        onFocus={onFocus as any}
        disabled={disabled}
        style={
          Object.keys(buttonStyleOverrides).length > 0
            ? buttonStyleOverrides
            : undefined
        }
      >
        <span>{displayValue}</span>
        <span className={arrowClassNames} />
      </button>

      {/* Dropdown Menu — rendered inline for reliable positioning and extension access */}
      {isOpen && !disabled && (
        <div
          ref={menuRef}
          className={cssStyles.menu}
          data-theme={theme}
          role="listbox"
          aria-label={`${label} options`}
        >
          {filteredOptions.length === 0 ? (
            <div className={cssStyles.emptyState}>No options available</div>
          ) : (
            filteredOptions.map((option, index) => {
              const isSelected =
                String(option.value) === String(value) ||
                String(option._id) === String(value)
              const optionClassNames = [
                cssStyles.option,
                isSelected && cssStyles.selected,
              ]
                .filter(Boolean)
                .join(' ')
              return (
                <button
                  key={index}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  className={optionClassNames}
                  onClick={() => handleSelect(option)}
                >
                  {String(option.value)}
                </button>
              )
            })
          )}
        </div>
      )}

      {/* Helper Text */}
      {helperText && <div className={helperTextClassNames}>{helperText}</div>}
    </div>
  )
}

export default Dropdown
