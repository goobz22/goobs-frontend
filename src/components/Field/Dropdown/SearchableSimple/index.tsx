'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
import ReactDOM from 'react-dom'
import { alpha } from '../../../../utils'

const SACRED_GOLD = '#FFD700'

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
    theme?: string
    [key: string]: any
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
  const [value, setValue] = useState<string | number>('')
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  })
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(
    null
  )

  const disabled = styles?.disabled || false
  const required = styles?.required || false

  // Create portal container on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const container = document.createElement('div')
      container.id = 'searchable-simple-portal'
      document.body.appendChild(container)
      setPortalContainer(container)

      return () => {
        document.body.removeChild(container)
      }
    }
  }, [])

  // Set initial value from defaultValue
  useEffect(() => {
    if (defaultValue !== undefined && defaultValue !== null) {
      setValue(defaultValue)
    }
  }, [defaultValue])

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

  // Close dropdown when clicking outside
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

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
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

  return (
    <div
      ref={dropdownRef}
      style={{ position: 'relative', width: '100%', marginBottom: '16px' }}
    >
      {/* Label */}
      {label && (
        <label
          style={{
            display: 'block',
            marginBottom: '8px',
            color: SACRED_GOLD,
            fontSize: '14px',
            fontFamily: '"Cinzel", serif',
            letterSpacing: '0.05em',
          }}
        >
          {label}
          {required && (
            <span style={{ color: SACRED_GOLD, marginLeft: '4px' }}>*</span>
          )}
        </label>
      )}

      {/* Dropdown Button */}
      <button
        ref={buttonRef}
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        style={{
          width: '100%',
          padding: '12px 16px',
          backgroundColor: disabled
            ? 'rgba(0, 0, 0, 0.3)'
            : 'rgba(0, 0, 0, 0.6)',
          border: `1px solid ${alpha(SACRED_GOLD, isOpen ? 0.6 : 0.3)}`,
          borderRadius: '8px',
          color: disabled
            ? 'rgba(255, 255, 255, 0.4)'
            : 'rgba(255, 255, 255, 0.9)',
          fontFamily: '"Crimson Text", serif',
          fontSize: '16px',
          textAlign: 'left',
          cursor: disabled ? 'not-allowed' : 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          transition: 'all 0.3s ease',
          boxShadow: isOpen ? `0 0 15px ${alpha(SACRED_GOLD, 0.3)}` : 'none',
          outline: 'none',
        }}
        onMouseEnter={e => {
          if (!disabled) {
            e.currentTarget.style.borderColor = alpha(SACRED_GOLD, 0.5)
            e.currentTarget.style.boxShadow = `0 0 10px ${alpha(SACRED_GOLD, 0.2)}`
          }
        }}
        onMouseLeave={e => {
          if (!disabled && !isOpen) {
            e.currentTarget.style.borderColor = alpha(SACRED_GOLD, 0.3)
            e.currentTarget.style.boxShadow = 'none'
          }
        }}
      >
        <span>{displayValue}</span>
        <span
          style={{
            marginLeft: '8px',
            width: '0',
            height: '0',
            borderLeft: '5px solid transparent',
            borderRight: '5px solid transparent',
            borderTop: `5px solid ${SACRED_GOLD}`,
            transition: 'transform 0.3s ease',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            display: 'inline-block',
          }}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen &&
        !disabled &&
        portalContainer &&
        ReactDOM.createPortal(
          <div
            ref={menuRef}
            style={{
              position: 'fixed',
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
              width: `${dropdownPosition.width}px`,
              backgroundColor: 'rgba(0, 0, 0, 0.95)',
              border: `1px solid ${alpha(SACRED_GOLD, 0.4)}`,
              borderRadius: '8px',
              maxHeight: '300px',
              overflowY: 'auto',
              overflowX: 'hidden',
              zIndex: 999999,
              boxShadow: `0 8px 32px ${alpha(SACRED_GOLD, 0.2)}`,
              backdropFilter: 'blur(10px)',
            }}
          >
            {/* Search Input */}
            <div
              style={{
                padding: '8px',
                borderBottom: `1px solid ${alpha(SACRED_GOLD, 0.2)}`,
              }}
            >
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  backgroundColor: 'rgba(0, 0, 0, 0.6)',
                  border: `1px solid ${alpha(SACRED_GOLD, 0.3)}`,
                  borderRadius: '6px',
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontFamily: '"Crimson Text", serif',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
                onFocus={e => {
                  e.currentTarget.style.borderColor = alpha(SACRED_GOLD, 0.5)
                  e.currentTarget.style.boxShadow = `0 0 10px ${alpha(SACRED_GOLD, 0.2)}`
                }}
                onBlur={e => {
                  e.currentTarget.style.borderColor = alpha(SACRED_GOLD, 0.3)
                  e.currentTarget.style.boxShadow = 'none'
                }}
              />
            </div>

            {/* Options List */}
            <div>
              {filteredOptions.length === 0 ? (
                <div
                  style={{
                    padding: '12px 16px',
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontFamily: '"Crimson Text", serif',
                    textAlign: 'center',
                  }}
                >
                  No options found
                </div>
              ) : (
                filteredOptions.map((option, index) => {
                  const isSelected =
                    String(option.value) === String(value) ||
                    String(option._id) === String(value)
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSelect(option)}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        backgroundColor: isSelected
                          ? alpha(SACRED_GOLD, 0.2)
                          : 'transparent',
                        border: 'none',
                        borderBottom:
                          index < filteredOptions.length - 1
                            ? `1px solid ${alpha(SACRED_GOLD, 0.1)}`
                            : 'none',
                        color: isSelected
                          ? SACRED_GOLD
                          : 'rgba(255, 255, 255, 0.9)',
                        fontFamily: '"Crimson Text", serif',
                        fontSize: '14px',
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        outline: 'none',
                        whiteSpace: 'normal',
                        wordWrap: 'break-word',
                        overflowWrap: 'break-word',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.backgroundColor = alpha(
                          SACRED_GOLD,
                          0.15
                        )
                        e.currentTarget.style.color = SACRED_GOLD
                      }}
                      onMouseLeave={e => {
                        if (!isSelected) {
                          e.currentTarget.style.backgroundColor = 'transparent'
                          e.currentTarget.style.color =
                            'rgba(255, 255, 255, 0.9)'
                        } else {
                          e.currentTarget.style.backgroundColor = alpha(
                            SACRED_GOLD,
                            0.2
                          )
                          e.currentTarget.style.color = SACRED_GOLD
                        }
                      }}
                    >
                      {String(option.value)}
                    </button>
                  )
                })
              )}
            </div>
          </div>,
          portalContainer
        )}

      {/* Helper Text */}
      {helperText && (
        <div
          style={{
            marginTop: '4px',
            fontSize: '12px',
            color: 'rgba(255, 255, 255, 0.6)',
            fontFamily: '"Crimson Text", serif',
          }}
        >
          {helperText}
        </div>
      )}
    </div>
  )
}

export default SearchableSimple
