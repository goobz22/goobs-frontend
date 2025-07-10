'use client'

import React, { useState, useEffect, useRef } from 'react'
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
  helperText?: string
  placeholder?: string
  disabled?: boolean
  width?: string
  style?: React.CSSProperties
  sacredtheme?: boolean
  shrunklabelposition?: 'onNotch' | 'aboveNotch'
  name?: string
  error?: boolean
}

const getStyles = (
  sacredtheme: boolean,
  isOpen: boolean,
  error: boolean,
  isLabelShrunken: boolean,
  shrunklabelposition: 'onNotch' | 'aboveNotch'
) => ({
  container: {
    position: 'relative',
    width: '100%',
    marginTop: '15px',
    height: 'auto',
  } as React.CSSProperties,
  label: {
    position: 'absolute',
    transition: 'all 0.2s ease-in-out',
    pointerEvents: 'none',
    color: sacredtheme ? 'rgba(255, 215, 0, 0.8)' : '#6B7280',
    ...(isLabelShrunken
      ? {
          fontSize: '0.75rem',
          ...(shrunklabelposition === 'aboveNotch'
            ? { top: '-1.25rem', left: '0' }
            : {
                top: '0',
                left: '0.75rem',
                transform: 'translateY(-50%)',
                backgroundColor: sacredtheme ? 'black' : 'white',
                padding: '0 0.25rem',
              }),
        }
      : { top: '50%', left: '1rem', transform: 'translateY(-50%)' }),
    ...(isOpen && { color: sacredtheme ? '#FFD700' : '#3B82F6' }),
  } as React.CSSProperties,
  trigger: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: '0.5rem',
    borderRadius: '0.375rem',
    border: `2px solid ${error ? '#EF4444' : isOpen ? (sacredtheme ? '#FFD700' : '#3B82F6') : sacredtheme ? 'rgba(255, 215, 0, 0.5)' : '#D1D5DB'}`,
    transition: 'all 0.3s ease',
    backgroundColor: sacredtheme ? 'rgba(0, 0, 0, 0.8)' : 'white',
    color: sacredtheme ? '#FFD700' : 'black',
  } as React.CSSProperties,
  listbox: {
    position: 'absolute',
    top: '100%',
    left: 0,
    width: '100%',
    backgroundColor: sacredtheme ? 'rgba(0,0,0,0.95)' : 'white',
    border: `1px solid ${sacredtheme ? 'rgba(255, 215, 0, 0.5)' : '#E5E7EB'}`,
    marginTop: '0.25rem',
    borderRadius: '0.375rem',
    zIndex: 10,
    boxShadow:
      '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    maxHeight: '15rem',
    overflowY: 'auto',
  } as React.CSSProperties,
  tabContainer: {
    display: 'flex',
    borderBottom: `1px solid ${sacredtheme ? 'rgba(255, 215, 0, 0.5)' : '#E5E7EB'}`,
  },
  tabButton: (isActive: boolean) => ({
    flex: 1,
    padding: '0.5rem',
    backgroundColor: isActive
      ? sacredtheme
        ? 'rgba(255, 215, 0, 0.2)'
        : '#E5E7EB'
      : 'transparent',
    color: sacredtheme ? '#FFD700' : 'black',
    border: 'none',
    cursor: 'pointer',
  }),
  searchContainer: {
    padding: '0.5rem',
  },
  searchInput: {
    width: '100%',
    padding: '0.5rem',
    border: `1px solid ${sacredtheme ? 'rgba(255, 215, 0, 0.5)' : '#D1D5DB'}`,
    borderRadius: '0.25rem',
    backgroundColor: sacredtheme ? 'rgba(0, 0, 0, 0.8)' : 'white',
    color: sacredtheme ? '#FFD700' : 'black',
  },
  option: {
    padding: '0.5rem',
    cursor: 'pointer',
    color: sacredtheme ? 'rgba(255, 215, 0, 0.9)' : 'black',
    '&:hover': {
      backgroundColor: sacredtheme ? 'rgba(255, 215, 0, 0.1)' : '#F3F4F6',
    },
  } as React.CSSProperties,
  helperText: {
    fontSize: '0.75rem',
    marginTop: '0.25rem',
    color: error ? '#EF4444' : '#6B7280',
  },
})

const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
  label,
  options,
  defaultValue,
  onChange,
  helperText,
  placeholder,
  disabled = false,
  width,
  style,
  sacredtheme = false,
  shrunklabelposition = 'onNotch',
  name,
  error = false,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [selectedOption, setSelectedOption] = useState<DropdownOption | null>(
    null
  )
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [history, setHistory] = useState<DropdownOption[]>([])
  const [activeTab, setActiveTab] = useState<'options' | 'history'>('options')
  const containerRef = useRef<HTMLDivElement>(null)

  const isLabelShrunken: boolean = isOpen || !!selectedOption || !!placeholder
  const styles = getStyles(
    sacredtheme,
    isOpen,
    error,
    isLabelShrunken,
    shrunklabelposition
  )

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
    <div
      style={{ ...styles.container, ...style, width: width || '100%' }}
      ref={containerRef}
    >
      <label htmlFor={name} style={styles.label}>
        {label}
      </label>
      <button
        type="button"
        style={styles.trigger}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
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
        <div style={styles.listbox}>
          <div style={styles.tabContainer}>
            <button
              onClick={() => setActiveTab('options')}
              style={styles.tabButton(activeTab === 'options')}
            >
              Options
            </button>
            <button
              onClick={() => setActiveTab('history')}
              style={styles.tabButton(activeTab === 'history')}
            >
              History
            </button>
          </div>
          {activeTab === 'options' && (
            <div>
              <div style={styles.searchContainer}>
                <input
                  type="text"
                  placeholder="Search..."
                  style={styles.searchInput}
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              {filteredOptions.map(option => (
                <div
                  key={option.uniqueKey || option.value}
                  style={styles.option}
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
                  style={styles.option}
                  onClick={() => handleSelect(option)}
                >
                  {option.value}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {helperText && <p style={styles.helperText}>{helperText}</p>}
    </div>
  )
}

export default SearchableDropdown
