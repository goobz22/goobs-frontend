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
  _id?: string
}

export interface SearchableHistoryProps {
  label: string
  options: DropdownOption[]
  defaultValue?: string
  onChange?: (value: DropdownOption | null) => void
  placeholder?: string
  helperText?: string
  styles?: FormFieldStyles
  externalHistoryUpdate?: DropdownOption | null
}

const capitalizeText = (text: string) => {
  return text
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
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
      minHeight: styles?.minHeight || '40px',
      padding: styles?.padding || '8px 16px',
      borderRadius: styles?.borderRadius || '8px',
      border: `${styles?.borderWidth || '1px'} solid ${borderColor}`,
      transition,
      backgroundColor: themeConfig.background,
      color: themeConfig.text,
      cursor: 'text',
      outline: 'none',
      fontFamily: themeConfig.fontFamily,
      fontSize: styles?.fontSize || '16px',
      ...(styles?.disabled && {
        backgroundColor: '#E0E0E0',
        color: '#9E9E9E',
        borderColor: '#BDBDBD',
        cursor: 'not-allowed',
      }),
    } as React.CSSProperties,
    input: {
      border: 'none',
      outline: 'none',
      background: 'transparent',
      color: themeConfig.text,
      fontFamily: themeConfig.fontFamily,
      fontSize: styles?.fontSize || '16px',
      width: '100%',
      padding: 0,
      height: '100%',
      ...(styles?.disabled && {
        color: '#9E9E9E',
        cursor: 'not-allowed',
      }),
    } as React.CSSProperties,
    arrowButton: {
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      padding: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: themeConfig.text,
      minWidth: '20px',
      height: '100%',
      ...(styles?.disabled && {
        color: '#9E9E9E',
        cursor: 'not-allowed',
      }),
    } as React.CSSProperties,
    listbox: {
      position: 'absolute' as const,
      top: '100%',
      left: 0,
      right: 0,
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
      // Custom scrollbar styling based on theme
      scrollbarWidth: 'thin' as const,
      scrollbarColor: sacredTheme
        ? 'rgba(255, 215, 0, 0.6) rgba(255, 215, 0, 0.1)'
        : styles?.theme === 'dark'
          ? 'rgba(156, 163, 175, 0.6) rgba(75, 85, 99, 0.3)'
          : 'rgba(156, 163, 175, 0.6) rgba(243, 244, 246, 0.3)',
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
            : styles?.theme === 'dark'
              ? 'rgba(75, 85, 99, 0.6)'
              : '#F3F4F6'
          : 'transparent',
        color: themeConfig.text,
        border: 'none',
        cursor: 'pointer',
        fontFamily: themeConfig.fontFamily,
        fontSize: '14px',
        transition,
      }) as React.CSSProperties,
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

const getScrollbarStyles = (theme: string) => {
  const sacredTheme = theme === 'sacred'
  const darkTheme = theme === 'dark'

  return `
    .searchable-history-listbox::-webkit-scrollbar {
      width: 8px;
    }
    
    .searchable-history-listbox::-webkit-scrollbar-track {
      background: ${
        sacredTheme
          ? 'rgba(255, 215, 0, 0.1)'
          : darkTheme
            ? 'rgba(75, 85, 99, 0.3)'
            : 'rgba(243, 244, 246, 0.3)'
      };
      border-radius: 4px;
    }
    
    .searchable-history-listbox::-webkit-scrollbar-thumb {
      background: ${
        sacredTheme
          ? 'rgba(255, 215, 0, 0.6)'
          : darkTheme
            ? 'rgba(156, 163, 175, 0.6)'
            : 'rgba(156, 163, 175, 0.6)'
      };
      border-radius: 4px;
    }
    
    .searchable-history-listbox::-webkit-scrollbar-thumb:hover {
      background: ${
        sacredTheme
          ? 'rgba(255, 215, 0, 0.8)'
          : darkTheme
            ? 'rgba(156, 163, 175, 0.8)'
            : 'rgba(156, 163, 175, 0.8)'
      };
    }
    
    .searchable-history-input::placeholder {
      color: ${
        sacredTheme
          ? 'rgba(255, 215, 0, 0.6)'
          : darkTheme
            ? 'rgba(156, 163, 175, 0.7)'
            : 'rgba(107, 114, 128, 0.7)'
      };
    }
  `
}

const SearchableHistory: React.FC<SearchableHistoryProps> = ({
  label,
  options,
  defaultValue,
  onChange,
  placeholder,
  helperText,
  styles,
  externalHistoryUpdate,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [selectedOption, setSelectedOption] = useState<DropdownOption | null>(
    null
  )
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [history, setHistory] = useState<DropdownOption[]>([])
  const [activeTab, setActiveTab] = useState<'options' | 'history'>('options')
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const componentStyles = getStyles(styles, isOpen)
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
      setSearchTerm(defaultOption.value)
    }
  }, [defaultValue, options])

  // Handle external history updates
  useEffect(() => {
    if (externalHistoryUpdate) {
      setHistory(prevHistory =>
        [
          externalHistoryUpdate,
          ...prevHistory.filter(h => h.value !== externalHistoryUpdate.value),
        ].slice(0, 5)
      )
    }
  }, [externalHistoryUpdate])

  useEffect(() => {
    // Inject scrollbar styles
    const styleId = 'searchable-history-scrollbar-styles'
    let styleElement = document.getElementById(styleId)

    if (!styleElement) {
      styleElement = document.createElement('style')
      styleElement.id = styleId
      document.head.appendChild(styleElement)
    }

    styleElement.textContent = getScrollbarStyles(styles?.theme || 'light')

    return () => {
      // Clean up when component unmounts
      const element = document.getElementById(styleId)
      if (element) {
        element.remove()
      }
    }
  }, [styles?.theme])

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
    setSearchTerm(option.value)
    setIsOpen(false)
    onChange?.(option)
    setHistory(prevHistory =>
      [option, ...prevHistory.filter(h => h.value !== option.value)].slice(0, 5)
    )
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setIsOpen(true)
    // Clear selected option if search doesn't match
    if (selectedOption && selectedOption.value !== e.target.value) {
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
    option.value.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Don't filter history by search term - show all history items
  const filteredHistory = history

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
            className="searchable-history-input"
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
          <div
            style={componentStyles.listbox}
            className="searchable-history-listbox"
          >
            <div style={componentStyles.tabContainer}>
              <button
                onClick={() => setActiveTab('options')}
                style={componentStyles.tabButton(activeTab === 'options')}
              >
                Options
              </button>
              <button
                onClick={() => {
                  setActiveTab('history')
                  setSearchTerm('') // Clear search term when switching to history
                }}
                style={componentStyles.tabButton(activeTab === 'history')}
              >
                History
              </button>
            </div>
            {activeTab === 'options' && (
              <div>
                {filteredOptions.map(option => (
                  <div
                    key={option._id || option.value}
                    style={componentStyles.option}
                    onClick={() => handleSelect(option)}
                  >
                    {capitalizeText(option.value)}
                  </div>
                ))}
                {filteredOptions.length === 0 && (
                  <div style={componentStyles.option}>No options found</div>
                )}
              </div>
            )}
            {activeTab === 'history' && (
              <div>
                {filteredHistory.map(option => (
                  <div
                    key={option._id || option.value}
                    style={componentStyles.option}
                    onClick={() => handleSelect(option)}
                  >
                    {capitalizeText(option.value)}
                  </div>
                ))}
                {filteredHistory.length === 0 && (
                  <div style={componentStyles.option}>No history found</div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {helperText && <div style={componentStyles.footerText}>{helperText}</div>}
    </div>
  )
}

export default SearchableHistory
