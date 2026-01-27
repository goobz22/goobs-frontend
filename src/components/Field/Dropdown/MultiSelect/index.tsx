'use client'

import React, { useState, useCallback, useRef, useEffect } from 'react'
import ReactDOM from 'react-dom'
import Chip from '../../../Chip'
import cssStyles from './MultiSelect.module.css'

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
    theme?: 'sacred' | 'light' | 'dark'
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

  const disabled = styles?.disabled || false
  const required = styles?.required || false
  const theme = styles?.theme || 'sacred'

  // Track previous defaultSelected to update using derived state pattern
  const [prevDefaultSelected, setPrevDefaultSelected] =
    useState(defaultSelected)
  if (
    defaultSelected !== prevDefaultSelected &&
    JSON.stringify(defaultSelected) !== JSON.stringify(prevDefaultSelected)
  ) {
    setPrevDefaultSelected(defaultSelected)
    if (defaultSelected && Array.isArray(defaultSelected)) {
      setSelectedValues(defaultSelected)
    } else if (!defaultSelected) {
      setSelectedValues([])
    }
  }

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

  // Close dropdown when clicking outside or scrolling
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

  // Check if we're in browser environment for portal
  const canUsePortal = typeof document !== 'undefined'

  // Build chip container class names
  const chipContainerClassNames = [
    cssStyles.chipContainer,
    focused && cssStyles.focused,
    disabled && cssStyles.disabled,
  ]
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

  // Chip container style overrides
  const chipContainerStyleOverrides: React.CSSProperties = {}
  if (styles?.minHeight || styles?.height)
    chipContainerStyleOverrides.minHeight = styles.minHeight || styles.height
  if (styles?.height) chipContainerStyleOverrides.height = styles.height
  if (styles?.borderWidth)
    chipContainerStyleOverrides.borderWidth = styles.borderWidth
  if (styles?.borderColor)
    chipContainerStyleOverrides.borderColor = styles.borderColor
  if (styles?.borderRadius)
    chipContainerStyleOverrides.borderRadius = styles.borderRadius
  if (styles?.backgroundColor)
    chipContainerStyleOverrides.backgroundColor = styles.backgroundColor
  if (styles?.padding) chipContainerStyleOverrides.padding = styles.padding

  // Icon wrapper style overrides
  const iconWrapperStyleOverrides: React.CSSProperties = {}
  if (styles?.arrowTop) {
    iconWrapperStyleOverrides.top = styles.arrowTop
    iconWrapperStyleOverrides.transform = 'none'
  }
  if (styles?.arrowRight) iconWrapperStyleOverrides.right = styles.arrowRight
  if (styles?.arrowBottom) iconWrapperStyleOverrides.bottom = styles.arrowBottom
  if (styles?.arrowPadding)
    iconWrapperStyleOverrides.padding = styles.arrowPadding

  // Menu style overrides
  const menuStyleOverrides: React.CSSProperties = {
    top: `${dropdownPosition.top}px`,
    left: `${dropdownPosition.left}px`,
    width: `${dropdownPosition.width}px`,
  }
  if (styles?.borderWidth) menuStyleOverrides.borderWidth = styles.borderWidth
  if (styles?.borderRadius)
    menuStyleOverrides.borderRadius = styles.borderRadius

  return (
    <div
      className={cssStyles.container}
      data-theme={theme}
      style={
        Object.keys(containerStyleOverrides).length > 0
          ? containerStyleOverrides
          : undefined
      }
    >
      {label && (
        <label className={cssStyles.label}>
          {label}
          {required && (
            <span className={cssStyles.requiredIndicator}>
              {styles?.requiredIndicatorText || '*'}
            </span>
          )}
        </label>
      )}
      <div className={cssStyles.wrapper} ref={containerRef}>
        <div
          ref={chipContainerButtonRef}
          className={chipContainerClassNames}
          onClick={handleContainerClick}
          onFocus={handleFocus}
          onBlur={handleBlur}
          tabIndex={disabled ? -1 : 0}
          style={
            Object.keys(chipContainerStyleOverrides).length > 0
              ? chipContainerStyleOverrides
              : undefined
          }
        >
          {selectedValues.length === 0 ? (
            <span className={cssStyles.placeholder}>Select items...</span>
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
        <div
          className={cssStyles.iconWrapper}
          style={
            Object.keys(iconWrapperStyleOverrides).length > 0
              ? iconWrapperStyleOverrides
              : undefined
          }
        >
          <div className={arrowClassNames} />
        </div>
        {isOpen &&
          canUsePortal &&
          ReactDOM.createPortal(
            <div
              ref={menuRef}
              className={cssStyles.menu}
              data-theme={theme}
              style={menuStyleOverrides}
            >
              {options.map(option => {
                const isSelected = selectedValues.includes(
                  option._id || option.value
                )
                const optionClassNames = [
                  cssStyles.option,
                  isSelected && cssStyles.selected,
                ]
                  .filter(Boolean)
                  .join(' ')

                return (
                  <div
                    key={option._id || option.value}
                    className={optionClassNames}
                    onClick={e => handleToggle(option._id || option.value, e)}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}}
                      onClick={e => e.stopPropagation()}
                    />
                    <span>{option.value}</span>
                  </div>
                )
              })}
            </div>,
            document.body
          )}
      </div>
      {helperText && <div className={helperTextClassNames}>{helperText}</div>}
    </div>
  )
}

MultiSelectChip.displayName = 'MultiSelectChip'

export default MultiSelectChip
