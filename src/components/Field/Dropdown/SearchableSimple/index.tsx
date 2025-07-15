'use client'

import React, { useState, useEffect, useRef } from 'react'
import {
  getDropdownStyles,
  getRequiredIndicatorStyle,
  getRequiredProps,
  type DropdownStyles,
} from '../../../../theme'
import ArrowDropDownIcon from '../../../Icons/ArrowDropDown'

export interface DropdownOption {
  value: string
  attribute1?: string
  attribute2?: string
  _id?: string
}

export interface SearchableSimpleProps {
  label: string
  options: DropdownOption[]
  defaultValue?: string
  onChange?: (value: DropdownOption | null) => void
  placeholder?: string
  helperText?: string
  styles?: DropdownStyles
}

const capitalizeText = (text: string) => {
  return text
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

const getStyles = (
  styles?: DropdownStyles,
  isOpen?: boolean,
  isFocused?: boolean
) => {
  return getDropdownStyles(styles, isOpen, isFocused)
}

const SearchableSimple: React.FC<SearchableSimpleProps> = ({
  label,
  options,
  defaultValue,
  onChange,
  placeholder,
  helperText,
  styles,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [selectedOption, setSelectedOption] = useState<DropdownOption | null>(
    null
  )
  const [searchTerm, setSearchTerm] = useState<string>('')
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const componentStyles = getStyles(styles, isOpen, false)
  const triggerStyle: React.CSSProperties = {
    ...componentStyles.trigger,
    boxSizing: 'border-box',
    height: styles?.height || '40px',
    minHeight: styles?.minHeight || '40px',
  }

  useEffect(() => {
    const defaultOption = options.find(option => option.value === defaultValue)
    if (defaultOption) {
      setSelectedOption(defaultOption)
      setSearchTerm(defaultOption.value || '')
    }
  }, [defaultValue, options])

  useEffect(() => {
    // Inject scrollbar styles
    const styleId = 'dropdown-scrollbar-styles'
    let styleElement = document.getElementById(styleId)

    if (!styleElement) {
      styleElement = document.createElement('style')
      styleElement.id = styleId
      document.head.appendChild(styleElement)
    }

    styleElement.textContent = componentStyles.scrollbarStyles

    return () => {
      // Clean up when component unmounts
      const element = document.getElementById(styleId)
      if (element) {
        element.remove()
      }
    }
  }, [componentStyles.scrollbarStyles])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (option: DropdownOption) => {
    setSelectedOption(option)
    setSearchTerm(option.value || '')
    setIsOpen(false)
    onChange?.(option)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setIsOpen(true)
    // Clear selected option if search doesn't match
    if (selectedOption && (selectedOption.value || '') !== e.target.value) {
      setSelectedOption(null)
    }
  }

  const handleInputFocus = () => {
    setIsOpen(true)
  }

  const handleArrowClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsOpen(!isOpen)
    if (!isOpen) {
      inputRef.current?.focus()
    }
  }

  const filteredOptions = options.filter(option =>
    option.value && searchTerm
      ? option.value.toLowerCase().includes(searchTerm.toLowerCase())
      : Boolean(option.value)
  )

  return (
    <div style={componentStyles.container} ref={containerRef}>
      {label && (
        <label style={componentStyles.label}>
          {label}
          {styles?.required && (
            <span style={getRequiredIndicatorStyle(styles)}>
              {styles?.requiredIndicatorText || ' *'}
            </span>
          )}
        </label>
      )}

      <div style={{ position: 'relative', width: '100%' }}>
        <div style={triggerStyle}>
          <input
            ref={inputRef}
            type="text"
            className="dropdown-input"
            style={componentStyles.input}
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            placeholder={placeholder}
            disabled={styles?.disabled}
            {...getRequiredProps(styles?.required)}
          />
          <button
            type="button"
            style={componentStyles.arrowButton}
            onClick={handleArrowClick}
            disabled={styles?.disabled}
          >
            <ArrowDropDownIcon
              style={{
                transition: 'transform 0.2s',
                transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              }}
            />
          </button>
        </div>

        {isOpen && (
          <div style={componentStyles.dropdown} className="dropdown-listbox">
            {filteredOptions.map(option => (
              <div
                key={option._id || option.value}
                style={componentStyles.option}
                onClick={() => handleSelect(option)}
              >
                {capitalizeText(option.value || '')}
              </div>
            ))}
            {filteredOptions.length === 0 && (
              <div style={componentStyles.option}>No options found</div>
            )}
          </div>
        )}
      </div>

      {helperText && <div style={componentStyles.footerText}>{helperText}</div>}
    </div>
  )
}

export default SearchableSimple
