'use client'

import React, { useState, useEffect, useRef } from 'react'
import {
  getDropdownStyles,
  getRequiredIndicatorStyle,
  type DropdownStyles,
} from '../../../../theme'
import ArrowDropDownIcon from '../../../Icons/ArrowDropDown'

export interface DropdownOption {
  value: string | number
  attribute1?: string
  attribute2?: string
  _id?: string
}

export interface SearchableSimpleProps {
  label: string
  options: DropdownOption[]
  defaultValue?: string | number
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
) => getDropdownStyles(styles, isOpen, isFocused)

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
  const containerRef = useRef<HTMLDivElement>(null)
  // const inputRef = useRef<HTMLInputElement>(null)

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
    setIsOpen(false)
    onChange?.(option)
  }

  // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   // Disabled for now - pure dropdown
  // }

  // const handleInputFocus = () => {
  //   // Disabled for now - pure dropdown
  // }

  // const handleArrowClick = (e: React.MouseEvent) => {
  //   e.stopPropagation()
  //   setIsOpen(!isOpen)
  //   if (!isOpen) {
  //     inputRef.current?.focus()
  //   }
  // }

  // const filteredOptions = options.filter(option =>
  //   option.value && searchTerm
  //     ? option.value.toLowerCase().includes(searchTerm.toLowerCase())
  //     : Boolean(option.value)
  // )

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
        <select
          value={selectedOption?.value || ''}
          onChange={e => {
            const option = options.find(opt => opt.value === e.target.value)
            if (option) {
              handleSelect(option)
            }
          }}
          style={{
            ...triggerStyle,
            width: '100%',
            appearance: 'none',
            paddingRight: '40px',
            cursor: 'pointer',
          }}
          disabled={styles?.disabled}
        >
          <option value="">{placeholder || 'Select...'}</option>
          {options.map(option => (
            <option key={option._id || option.value} value={option.value}>
              {capitalizeText(option.attribute1 || String(option.value) || '')}
            </option>
          ))}
        </select>
        <div
          style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
          }}
        >
          <ArrowDropDownIcon styles={{ theme: styles?.theme || 'sacred' }} />
        </div>
      </div>

      {helperText && <div style={componentStyles.footerText}>{helperText}</div>}
    </div>
  )
}

export default SearchableSimple
