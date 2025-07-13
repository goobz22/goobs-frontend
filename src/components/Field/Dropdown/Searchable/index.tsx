'use client'

import React, { useState, useEffect, useRef } from 'react'
import {
  getSharedFormFieldStyles,
  getSharedLabelStyles,
  getSharedContainerStyles,
  getSharedFooterTextStyles,
  getRequiredIndicatorStyle,
  getRequiredProps,
  type FormFieldStyles,
} from '../../../../theme'
import ArrowDropDownIcon from '../../../Icons/ArrowDropDown'

export interface DropdownOption {
  value: string
  attribute1?: string
  attribute2?: string
  uniqueKey?: string
}

export interface SearchableDropdownProps {
  label: string
  options: DropdownOption[]
  defaultValue?: string
  onChange?: (value: DropdownOption | null) => void
  placeholder?: string
  helperText?: string
  styles?: FormFieldStyles
}

const getStyles = (styles?: FormFieldStyles, isOpen?: boolean) => {
  const { themeConfig, borderColor, labelColor, footerTextColor, transition } =
    getSharedFormFieldStyles(styles, isOpen)

  const sacredTheme = styles?.theme === 'sacred'

  return {
    container: getSharedContainerStyles(styles),
    label: getSharedLabelStyles(labelColor, themeConfig),
    trigger: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      height: styles?.height || '40px',
      padding: styles?.padding || '8px 16px',
      borderRadius: styles?.borderRadius || '8px',
      border: `${styles?.borderWidth || '1px'} solid ${borderColor}`,
      transition,
      backgroundColor: themeConfig.background,
      color: themeConfig.text,
      cursor: 'pointer',
      outline: 'none',
      fontFamily: themeConfig.fontFamily,
      fontSize: styles?.fontSize || '16px',
    } as React.CSSProperties,
    listbox: {
      position: 'absolute' as const,
      top: '100%',
      left: 0,
      width: '100%',
      backgroundColor: themeConfig.background,
      border: `1px solid ${borderColor}`,
      marginTop: '4px',
      borderRadius: styles?.borderRadius || '8px',
      zIndex: 10,
      boxShadow: sacredTheme
        ? '0 10px 30px rgba(255, 215, 0, 0.3)'
        : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      maxHeight: '240px',
      overflowY: 'auto' as const,
    },
    tabContainer: {
      display: 'flex',
      borderBottom: `1px solid ${borderColor}`,
    } as React.CSSProperties,
    tabButton: (isActive: boolean) =>
      ({
        flex: 1,
        padding: '8px 16px',
        backgroundColor: isActive
          ? sacredTheme
            ? 'rgba(255, 215, 0, 0.2)'
            : '#F3F4F6'
          : 'transparent',
        color: themeConfig.text,
        border: 'none',
        cursor: 'pointer',
        fontFamily: themeConfig.fontFamily,
        fontSize: '14px',
        transition,
      }) as React.CSSProperties,
    searchContainer: {
      padding: '8px',
    } as React.CSSProperties,
    searchInput: {
      width: '100%',
      padding: '8px 12px',
      border: `1px solid ${borderColor}`,
      borderRadius: '4px',
      backgroundColor: themeConfig.background,
      color: themeConfig.text,
      fontFamily: themeConfig.fontFamily,
      fontSize: '14px',
      outline: 'none',
    } as React.CSSProperties,
    option: {
      padding: '8px 16px',
      cursor: 'pointer',
      color: themeConfig.text,
      fontFamily: themeConfig.fontFamily,
      fontSize: '14px',
      transition,
      '&:hover': {
        backgroundColor: sacredTheme ? 'rgba(255, 215, 0, 0.1)' : '#F3F4F6',
      },
    } as React.CSSProperties,
    footerText: getSharedFooterTextStyles(footerTextColor, themeConfig, styles),
  }
}

const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
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
  const [history, setHistory] = useState<DropdownOption[]>([])
  const [activeTab, setActiveTab] = useState<'options' | 'history'>('options')
  const containerRef = useRef<HTMLDivElement>(null)

  const componentStyles = getStyles(styles, isOpen)

  useEffect(() => {
    const defaultOption = options.find(option => option.value === defaultValue)
    if (defaultOption) setSelectedOption(defaultOption)
  }, [defaultValue, options])

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
    setSearchTerm('')
    setIsOpen(false)
    onChange?.(option)
    setHistory(prevHistory =>
      [option, ...prevHistory.filter(h => h.value !== option.value)].slice(0, 5)
    )
  }

  const filteredOptions = options.filter(option =>
    option.value.toLowerCase().includes(searchTerm.toLowerCase())
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

      <div style={{ position: 'relative' }}>
        <button
          type="button"
          style={componentStyles.trigger}
          onClick={() => !styles?.disabled && setIsOpen(!isOpen)}
          disabled={styles?.disabled}
          {...getRequiredProps(styles?.required)}
        >
          <span>{selectedOption ? selectedOption.value : placeholder}</span>
          <ArrowDropDownIcon
            style={{
              transition: 'transform 0.2s',
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          />
        </button>

        {isOpen && (
          <div style={componentStyles.listbox}>
            <div style={componentStyles.tabContainer}>
              <button
                onClick={() => setActiveTab('options')}
                style={componentStyles.tabButton(activeTab === 'options')}
              >
                Options
              </button>
              <button
                onClick={() => setActiveTab('history')}
                style={componentStyles.tabButton(activeTab === 'history')}
              >
                History
              </button>
            </div>
            {activeTab === 'options' && (
              <div>
                <div style={componentStyles.searchContainer}>
                  <input
                    type="text"
                    placeholder="Search..."
                    style={componentStyles.searchInput}
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>
                {filteredOptions.map(option => (
                  <div
                    key={option.uniqueKey || option.value}
                    style={componentStyles.option}
                    onClick={() => handleSelect(option)}
                  >
                    {option.value}
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'history' && (
              <div>
                {history.map(option => (
                  <div
                    key={option.uniqueKey || option.value}
                    style={componentStyles.option}
                    onClick={() => handleSelect(option)}
                  >
                    {option.value}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {helperText && <div style={componentStyles.footerText}>{helperText}</div>}
    </div>
  )
}

export default SearchableDropdown
