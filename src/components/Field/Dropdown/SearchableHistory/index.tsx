'use client'

import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
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
import SearchIcon from '../../../Icons/Search'
import HistoryIcon from '../../../Icons/History'

export type NavigationItem = {
  id: string
  label: string
  route?: string
  category?: string
  description?: string
  icon?: React.ReactNode
  type?: 'navigation' | 'data' | 'action'
  metadata?: Record<string, any>
}

export type SearchableHistoryProps = {
  label?: string
  items: NavigationItem[]
  onSelect?: (item: NavigationItem) => void
  placeholder?: string
  helperText?: string
  styles?: FormFieldStyles
  maxHistoryItems?: number
}

const SearchableHistory: React.FC<SearchableHistoryProps> = ({
  label,
  items = [],
  onSelect,
  placeholder = 'Search navigation...',
  helperText,
  styles,
  maxHistoryItems = 10,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedItem, setSelectedItem] = useState<NavigationItem | null>(null)
  // Use lazy initialization to load history from localStorage
  const [history, setHistory] = useState<NavigationItem[]>(() => {
    if (typeof window === 'undefined') return []
    const savedHistory = localStorage.getItem('searchableHistory')
    if (savedHistory) {
      try {
        return JSON.parse(savedHistory)
      } catch {
        return []
      }
    }
    return []
  })
  const [activeTab, setActiveTab] = useState<'overview' | 'history'>('overview')
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const searchBoxRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  })

  // Save history to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined' && history.length > 0) {
      localStorage.setItem('searchableHistory', JSON.stringify(history))
    }
  }, [history])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      // Check if click is outside both the container AND the dropdown portal
      const clickedOutsideContainer =
        containerRef.current && !containerRef.current.contains(target)
      const clickedOutsideDropdown =
        dropdownRef.current && !dropdownRef.current.contains(target)

      if (clickedOutsideContainer && clickedOutsideDropdown) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Update dropdown position when opened
  useEffect(() => {
    if (isOpen && searchBoxRef.current) {
      const rect = searchBoxRef.current.getBoundingClientRect()
      setDropdownPosition({
        top: rect.bottom + 4, // Just use rect.bottom for fixed positioning
        left: rect.left,
        width: rect.width,
      })
    }
  }, [isOpen])

  const getStyles = () => {
    const {
      themeConfig,
      borderColor,
      labelColor,
      footerTextColor,
      transition,
    } = getSharedFormFieldStyles(styles, isOpen)

    const sacredTheme = styles?.theme === 'sacred'

    return {
      container: {
        ...getSharedContainerStyles(styles),
        overflow: 'visible',
        position: 'relative' as const,
      },
      label: getSharedLabelStyles(labelColor, themeConfig),
      searchBox: {
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        height: '40px',
        padding: '0 12px',
        borderRadius: styles?.borderRadius || '8px',
        border: `${styles?.borderWidth || '1px'} solid ${borderColor}`,
        transition,
        backgroundColor: themeConfig.background,
        cursor: 'text',
        gap: '8px',
        boxSizing: 'border-box',
      } as React.CSSProperties,
      input: {
        flex: 1,
        border: 'none',
        outline: 'none',
        background: 'transparent',
        color: themeConfig.text,
        fontFamily: themeConfig.fontFamily,
        fontSize: styles?.fontSize || '14px',
        padding: 0,
      } as React.CSSProperties,
      dropdown: {
        position: 'absolute' as const,
        top: 'calc(100% + 4px)',
        left: '0',
        right: '0',
        zIndex: 99999,
        maxHeight: '400px',
        overflowY: 'auto' as const,
        overflowX: 'hidden' as const,
        border: `${styles?.borderWidth || '1px'} solid ${borderColor}`,
        borderRadius: styles?.borderRadius || '8px',
        backgroundColor: themeConfig.background,
        boxShadow:
          '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
      tabs: {
        display: 'flex',
        borderBottom: `1px solid ${borderColor}`,
        backgroundColor: sacredTheme
          ? 'rgba(0, 0, 0, 0.3)'
          : 'rgba(0, 0, 0, 0.02)',
      } as React.CSSProperties,
      tab: (isActive: boolean) =>
        ({
          flex: 1,
          padding: '10px',
          border: 'none',
          background: isActive
            ? sacredTheme
              ? 'rgba(255, 215, 0, 0.15)'
              : themeConfig.background
            : 'transparent',
          color: isActive
            ? sacredTheme
              ? '#FFD700'
              : themeConfig.text
            : themeConfig.text,
          cursor: 'pointer',
          fontFamily: themeConfig.fontFamily,
          fontSize: '13px',
          fontWeight: isActive ? 600 : 400,
          transition,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
        }) as React.CSSProperties,
      itemsList: {
        overflowY: 'auto' as const,
        padding: '8px',
        minHeight: '200px',
        maxHeight: '350px',
      },
      item: {
        padding: '10px 12px',
        cursor: 'pointer',
        borderRadius: '6px',
        transition,
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '4px',
      } as React.CSSProperties,
      itemLabel: {
        flex: 1,
        fontSize: '14px',
        fontWeight: 500,
      } as React.CSSProperties,
      itemCategory: {
        fontSize: '11px',
        opacity: 0.6,
        marginTop: '2px',
      } as React.CSSProperties,
      itemDescription: {
        fontSize: '12px',
        opacity: 0.7,
        marginTop: '2px',
      } as React.CSSProperties,
      emptyState: {
        padding: '20px',
        textAlign: 'center' as const,
        opacity: 0.5,
        fontSize: '14px',
      },
      footerText: getSharedFooterTextStyles(
        footerTextColor,
        themeConfig,
        styles
      ),
    }
  }

  const componentStyles = getStyles()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    if (!isOpen) {
      setIsOpen(true)
    }
    // Stay on current tab when typing
  }

  const handleInputFocus = () => {
    setIsOpen(true)
    setActiveTab('overview')
  }

  const handleItemSelect = (item: NavigationItem) => {
    setSelectedItem(item)
    setSearchTerm(item.label)
    setIsOpen(false)

    // Add to history
    setHistory(prev => {
      const filtered = prev.filter(h => h.id !== item.id)
      return [item, ...filtered].slice(0, maxHistoryItems)
    })

    onSelect?.(item)
  }

  const clearHistory = () => {
    setHistory([])
    localStorage.removeItem('searchableHistory')
  }

  // Filter items based on search term
  const filteredItems = items.filter(item => {
    if (!searchTerm) return true
    const term = searchTerm.toLowerCase()
    return (
      item.label.toLowerCase().includes(term) ||
      item.category?.toLowerCase().includes(term) ||
      item.description?.toLowerCase().includes(term)
    )
  })

  const renderItem = (item: NavigationItem) => {
    const isSelected = selectedItem?.id === item.id
    const sacredTheme = styles?.theme === 'sacred'

    return (
      <div
        key={item.id}
        style={{
          padding: '10px 12px',
          cursor: 'pointer',
          backgroundColor: isSelected
            ? sacredTheme
              ? 'rgba(255, 215, 0, 0.2)'
              : 'rgba(59, 130, 246, 0.1)'
            : 'transparent',
          color: sacredTheme ? '#FFD700' : '#1f2937',
          transition: 'all 0.2s',
          borderRadius: '6px',
          margin: '2px 0',
          fontFamily: sacredTheme ? '"Cinzel", serif' : 'inherit',
        }}
        onClick={() => handleItemSelect(item)}
        onMouseEnter={e => {
          if (!isSelected) {
            e.currentTarget.style.backgroundColor = sacredTheme
              ? 'rgba(255, 215, 0, 0.1)'
              : 'rgba(229, 231, 235, 0.5)'
            if (sacredTheme) {
              e.currentTarget.style.boxShadow =
                '0 0 10px rgba(255, 215, 0, 0.2)'
            }
          }
        }}
        onMouseLeave={e => {
          if (!isSelected) {
            e.currentTarget.style.backgroundColor = 'transparent'
            e.currentTarget.style.boxShadow = 'none'
          }
        }}
      >
        <div style={{ fontSize: '14px', fontWeight: 500 }}>{item.label}</div>
        {item.description && (
          <div
            style={{
              fontSize: '11px',
              opacity: 0.6,
              marginTop: '4px',
              fontFamily: sacredTheme ? '"Cinzel", serif' : 'inherit',
            }}
          >
            {item.description}
          </div>
        )}
      </div>
    )
  }

  return (
    <div
      style={{ ...componentStyles.container, overflow: 'visible' }}
      ref={containerRef}
    >
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
        <div ref={searchBoxRef} style={componentStyles.searchBox}>
          <SearchIcon
            styles={{ theme: styles?.theme || 'sacred', size: 18 }}
            style={{ marginTop: '5px' }}
          />
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            placeholder={placeholder}
            style={componentStyles.input}
            disabled={styles?.disabled}
            {...getRequiredProps(styles?.required)}
          />
          <button
            onClick={e => {
              e.preventDefault()
              e.stopPropagation()
              setIsOpen(!isOpen)
              if (!isOpen) {
                inputRef.current?.focus()
              }
            }}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              color: 'inherit',
            }}
            type="button"
            disabled={styles?.disabled}
          >
            <ArrowDropDownIcon
              styles={{ theme: styles?.theme || 'sacred' }}
              style={{
                transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s',
              }}
            />
          </button>
        </div>
        {isOpen &&
          typeof document !== 'undefined' &&
          ReactDOM.createPortal(
            <div
              ref={dropdownRef}
              style={{
                position: 'fixed',
                top: `${dropdownPosition.top}px`,
                left: `${dropdownPosition.left}px`,
                width: `${dropdownPosition.width}px`,
                zIndex: 999999,
                backgroundColor:
                  styles?.theme === 'sacred'
                    ? 'rgba(0, 0, 0, 0.95)'
                    : '#ffffff',
                border:
                  styles?.theme === 'sacred'
                    ? '2px solid rgba(255, 215, 0, 0.5)'
                    : '1px solid #e5e7eb',
                borderRadius: '8px',
                maxHeight: '400px',
                overflow: 'hidden',
                boxShadow:
                  styles?.theme === 'sacred'
                    ? '0 10px 30px rgba(255, 215, 0, 0.3), inset 0 0 20px rgba(255, 215, 0, 0.1)'
                    : '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              }}
            >
              {/* Tabs for Overview, Search and History */}
              <div
                style={{
                  display: 'flex',
                  borderBottom:
                    styles?.theme === 'sacred'
                      ? '1px solid rgba(255, 215, 0, 0.3)'
                      : '1px solid #e5e7eb',
                  backgroundColor:
                    styles?.theme === 'sacred'
                      ? 'rgba(0, 0, 0, 0.3)'
                      : 'rgba(0, 0, 0, 0.02)',
                }}
              >
                <button
                  style={{
                    flex: 1,
                    padding: '10px',
                    border: 'none',
                    background:
                      activeTab === 'overview'
                        ? styles?.theme === 'sacred'
                          ? 'rgba(255, 215, 0, 0.15)'
                          : '#ffffff'
                        : 'transparent',
                    color:
                      activeTab === 'overview'
                        ? styles?.theme === 'sacred'
                          ? '#FFD700'
                          : '#000000'
                        : styles?.theme === 'sacred'
                          ? 'rgba(255, 215, 0, 0.6)'
                          : '#6b7280',
                    cursor: 'pointer',
                    fontFamily:
                      styles?.theme === 'sacred'
                        ? '"Cinzel", serif'
                        : 'inherit',
                    fontSize: '13px',
                    fontWeight: activeTab === 'overview' ? 600 : 400,
                    transition: 'all 0.2s',
                    textAlign: 'center',
                  }}
                  onClick={e => {
                    e.stopPropagation()
                    e.preventDefault()
                    setActiveTab('overview')
                  }}
                  type="button"
                >
                  Overview
                </button>
                <button
                  style={{
                    flex: 1,
                    padding: '10px',
                    border: 'none',
                    background:
                      activeTab === 'history'
                        ? styles?.theme === 'sacred'
                          ? 'rgba(255, 215, 0, 0.15)'
                          : '#ffffff'
                        : 'transparent',
                    color:
                      activeTab === 'history'
                        ? styles?.theme === 'sacred'
                          ? '#FFD700'
                          : '#000000'
                        : styles?.theme === 'sacred'
                          ? 'rgba(255, 215, 0, 0.6)'
                          : '#6b7280',
                    cursor: 'pointer',
                    fontFamily:
                      styles?.theme === 'sacred'
                        ? '"Cinzel", serif'
                        : 'inherit',
                    fontSize: '13px',
                    fontWeight: activeTab === 'history' ? 600 : 400,
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                  onClick={e => {
                    e.stopPropagation()
                    e.preventDefault()
                    setActiveTab('history')
                  }}
                  type="button"
                >
                  <HistoryIcon
                    styles={{ theme: styles?.theme || 'sacred', size: 14 }}
                  />
                  History
                </button>
              </div>

              {/* Content Area */}
              <div
                style={{
                  maxHeight: '350px',
                  overflowY: 'auto',
                  padding: '8px',
                }}
              >
                {activeTab === 'overview' ? (
                  // Overview tab - show filtered items organized by category
                  <>
                    {['Workspace', 'Space', 'View'].map(category => {
                      const categoryItems = filteredItems.filter(
                        item => item.category === category
                      )
                      if (categoryItems.length === 0) return null

                      return (
                        <div key={category}>
                          <div
                            style={{
                              padding: '8px 12px 4px',
                              fontSize: '11px',
                              fontWeight: 600,
                              opacity: 0.5,
                              textTransform: 'uppercase',
                              color:
                                styles?.theme === 'sacred'
                                  ? '#FFD700'
                                  : '#6b7280',
                              fontFamily:
                                styles?.theme === 'sacred'
                                  ? '"Cinzel", serif'
                                  : 'inherit',
                              borderBottom:
                                styles?.theme === 'sacred'
                                  ? '1px solid rgba(255, 215, 0, 0.1)'
                                  : '1px solid rgba(0, 0, 0, 0.05)',
                              marginBottom: '4px',
                            }}
                          >
                            {category}s
                          </div>
                          {categoryItems.map(item => renderItem(item))}
                        </div>
                      )
                    })}
                    {filteredItems.length === 0 && (
                      <div
                        style={{
                          padding: '20px',
                          textAlign: 'center',
                          opacity: 0.5,
                          color:
                            styles?.theme === 'sacred' ? '#FFD700' : '#6b7280',
                          fontFamily:
                            styles?.theme === 'sacred'
                              ? '"Cinzel", serif'
                              : 'inherit',
                        }}
                      >
                        {searchTerm
                          ? `No results for "${searchTerm}"`
                          : 'No navigation items available'}
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {history.length > 0 ? (
                      <>
                        {history.map(item => renderItem(item))}
                        <div
                          style={{
                            padding: '8px 12px',
                            marginTop: '8px',
                            borderTop:
                              styles?.theme === 'sacred'
                                ? '1px solid rgba(255, 215, 0, 0.2)'
                                : '1px solid rgba(0, 0, 0, 0.1)',
                          }}
                        >
                          <button
                            onClick={clearHistory}
                            style={{
                              background: 'none',
                              border: 'none',
                              color:
                                styles?.theme === 'sacred'
                                  ? '#FFD700'
                                  : '#3B82F6',
                              cursor: 'pointer',
                              fontSize: '12px',
                              padding: '4px 0',
                              opacity: 0.8,
                              fontFamily:
                                styles?.theme === 'sacred'
                                  ? '"Cinzel", serif'
                                  : 'inherit',
                            }}
                            type="button"
                          >
                            Clear History
                          </button>
                        </div>
                      </>
                    ) : (
                      <div
                        style={{
                          padding: '20px',
                          textAlign: 'center',
                          opacity: 0.5,
                          color:
                            styles?.theme === 'sacred' ? '#FFD700' : '#6b7280',
                          fontFamily:
                            styles?.theme === 'sacred'
                              ? '"Cinzel", serif'
                              : 'inherit',
                        }}
                      >
                        No recent searches
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>,
            document.body
          )}
      </div>

      {helperText && <div style={componentStyles.footerText}>{helperText}</div>}
    </div>
  )
}

export default SearchableHistory
