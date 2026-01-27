'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
import ReactDOM from 'react-dom'
import cssStyles from './SearchableSimple.module.css'

export interface DropdownOption {
  value: string | number
  _id?: string
}

export interface SearchableSimpleProps {
  label: string
  options: DropdownOption[]
  defaultValue?: string | number
  onChange?: (value: DropdownOption | null) => void
  placeholder?: string
  helperText?: string
  styles?: {
    disabled?: boolean
    required?: boolean
    theme?: 'sacred' | 'light' | 'dark'
    width?: string
    minWidth?: string
    height?: string
    minHeight?: string
    borderRadius?: string
    fontSize?: string
    fontFamily?: string
    padding?: string
    marginTop?: string
    helperTextType?: 'error' | 'info'
    marginBottom?: string
    backgroundColor?: string
    borderColor?: string
    textColor?: string
  }
}

const SearchableSimple: React.FC<SearchableSimpleProps> = ({
  label,
  options,
  defaultValue,
  onChange,
  placeholder = 'Select...',
  helperText,
  styles,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const [value, setValue] = useState<string | number>(defaultValue ?? '')
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  })

  const disabled = styles?.disabled || false
  const required = styles?.required || false
  const theme = styles?.theme || 'sacred'

  // Track previous defaultValue to update using derived state pattern
  const [prevDefaultValue, setPrevDefaultValue] = useState(defaultValue)
  if (defaultValue !== prevDefaultValue) {
    setPrevDefaultValue(defaultValue)
    if (defaultValue !== undefined && defaultValue !== null) {
      setValue(defaultValue)
    }
  }

  // Use useMemo to filter options based on search term
  const filteredOptions = useMemo(() => {
    const filtered = searchTerm
      ? options.filter(option =>
          String(option.value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      : options

    // Limit to first 100 results for performance
    return filtered.slice(0, 100)
  }, [searchTerm, options])

  // Update dropdown position when opened
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setDropdownPosition({
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
      })
    }
  }, [isOpen])

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
        setSearchTerm('')
      }
    }

    const handleScroll = (event: Event) => {
      // Don't close if scrolling inside the dropdown menu itself
      if (menuRef.current && menuRef.current.contains(event.target as Node)) {
        return
      }
      setIsOpen(false)
      setSearchTerm('')
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
    setValue(option.value)
    onChange?.(option)
    setIsOpen(false)
    setSearchTerm('')
  }

  // Find option by either value or _id
  const selectedOption = options.find(
    opt =>
      String(opt.value) === String(value) || String(opt._id) === String(value)
  )
  const displayValue = selectedOption?.value || value || placeholder

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
  if (styles?.width) containerStyleOverrides.width = styles.width
  if (styles?.marginBottom)
    containerStyleOverrides.marginBottom = styles.marginBottom
  if (styles?.marginTop) containerStyleOverrides.marginTop = styles.marginTop

  // Button style overrides
  const buttonStyleOverrides: React.CSSProperties = {}
  if (styles?.backgroundColor)
    buttonStyleOverrides.backgroundColor = styles.backgroundColor
  if (styles?.borderColor) buttonStyleOverrides.borderColor = styles.borderColor
  if (styles?.textColor) buttonStyleOverrides.color = styles.textColor
  if (styles?.height) buttonStyleOverrides.minHeight = styles.height
  if (styles?.fontSize) buttonStyleOverrides.fontSize = styles.fontSize
  if (styles?.fontFamily) buttonStyleOverrides.fontFamily = styles.fontFamily
  if (styles?.padding) buttonStyleOverrides.padding = styles.padding
  if (styles?.borderRadius)
    buttonStyleOverrides.borderRadius = styles.borderRadius

  // Menu style overrides
  const menuStyleOverrides: React.CSSProperties = {
    top: `${dropdownPosition.top}px`,
    left: `${dropdownPosition.left}px`,
    width: `${dropdownPosition.width}px`,
  }
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
        className={buttonClassNames}
        onClick={() => !disabled && setIsOpen(!isOpen)}
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

      {/* Dropdown Menu */}
      {isOpen &&
        !disabled &&
        typeof document !== 'undefined' &&
        ReactDOM.createPortal(
          <div
            ref={menuRef}
            className={cssStyles.menu}
            data-theme={theme}
            style={menuStyleOverrides}
          >
            {/* Search Input */}
            <div className={cssStyles.searchContainer}>
              <input
                type="text"
                className={cssStyles.searchInput}
                placeholder="Search..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Options List */}
            <div>
              {filteredOptions.length === 0 ? (
                <div className={cssStyles.emptyState}>No options found</div>
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
                      className={optionClassNames}
                      onClick={() => handleSelect(option)}
                    >
                      {String(option.value)}
                    </button>
                  )
                })
              )}
            </div>
          </div>,
          document.body
        )}

      {/* Helper Text */}
      {helperText && <div className={helperTextClassNames}>{helperText}</div>}
    </div>
  )
}

export default SearchableSimple
