'use client'

import React, { useState, useEffect, useRef, useId } from 'react'
import ReactDOM from 'react-dom'
import {
  getFormFieldTheme,
  getRequiredProps,
  type FormFieldStyles,
} from '../../../../theme'
import ArrowDropDownIcon from '../../../Icons/ArrowDropDown'
import SearchIcon from '../../../Icons/Search'
import HistoryIcon from '../../../Icons/History'
import { useEscape } from '../../Shell'

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
  /** Stable test selector — emitted as `data-field` on the container. */
  dataField?: string
  /** Stable test selector — emitted as `data-field-name` on the container. */
  dataFieldName?: string
}

const SearchableHistory: React.FC<SearchableHistoryProps> = ({
  label,
  items = [],
  onSelect,
  placeholder = 'Search navigation...',
  helperText,
  styles,
  maxHistoryItems = 10,
  dataField,
  dataFieldName,
}) => {
  // Stable, SSR-safe ids for label↔input + listbox ARIA wiring.
  const reactId = useId()
  const inputId = `searchable-history-${reactId}`
  const listboxId = `${inputId}-listbox`
  const helperId = `${inputId}-helper`
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

  // Close dropdown when clicking outside or scrolling
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

    const handleScroll = (event: Event) => {
      // Don't close if scrolling inside the dropdown menu itself
      if (
        dropdownRef.current &&
        dropdownRef.current.contains(event.target as Node)
      ) {
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
    // Inlined from the deleted `getSharedFormFieldStyles` helper.
    // Field components moved to CSS modules + FieldShell; this
    // component still does extensive bespoke layout (search box +
    // tabbed history panel + portalled dropdown) so it derives the
    // colors from the theme map and keeps its own inline-style
    // generators.
    const themeConfig = getFormFieldTheme(styles)
    const helperTextType = styles?.helperTextType || 'info'
    const isError = helperTextType === 'error'
    const borderColor = isError
      ? themeConfig.border.error
      : isOpen
        ? themeConfig.border.focused
        : themeConfig.border.default
    const labelColor = isError
      ? themeConfig.label.error
      : themeConfig.label.default
    const footerTextColor =
      helperTextType === 'error'
        ? themeConfig.footerText.error
        : themeConfig.footerText.default
    const transition = 'all 0.2s ease'

    const sacredTheme = styles?.theme === 'sacred'

    return {
      container: {
        // Inlined from the deleted `getSharedContainerStyles`.
        width: styles?.width || '100%',
        marginTop: styles?.marginTop,
        marginBottom: styles?.marginBottom,
        marginLeft: styles?.marginLeft,
        marginRight: styles?.marginRight,
        overflow: 'visible',
        position: 'relative' as const,
      } as React.CSSProperties,
      label: {
        // Inlined from the deleted `getSharedLabelStyles`.
        display: 'block',
        marginBottom: '4px',
        fontSize: styles?.fontSize || '14px',
        fontFamily: themeConfig.fontFamily,
        color: labelColor,
        transition,
      } as React.CSSProperties,
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
      footerText: {
        // Inlined from the deleted `getSharedFooterTextStyles`.
        marginTop: '4px',
        fontSize: styles?.fontSize || '12px',
        fontFamily: themeConfig.fontFamily,
        color: footerTextColor,
        minHeight: '1em',
      } as React.CSSProperties,
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

  // Escape closes the dropdown when focus is anywhere in this
  // component's subtree (search input or the portalled menu).
  useEscape(isOpen, () => {
    setIsOpen(false)
    inputRef.current?.focus()
  })

  return (
    <div
      style={{ ...componentStyles.container, overflow: 'visible' }}
      ref={containerRef}
      data-field={dataField}
      data-field-name={dataFieldName}
      data-state={isOpen ? 'open' : undefined}
    >
      {label && (
        <label htmlFor={inputId} style={componentStyles.label}>
          {label}
          {styles?.required && (
            <span
              style={{
                color: styles?.requiredIndicatorColor || 'rgba(239, 68, 68, 1)',
                marginLeft: '2px',
                fontWeight: 600,
              }}
            >
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
            id={inputId}
            role="combobox"
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            aria-controls={listboxId}
            aria-label={!label ? placeholder : undefined}
            aria-describedby={helperText ? helperId : undefined}
            data-action={isOpen ? 'close' : 'open'}
            data-subject={dataField}
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
              id={listboxId}
              role="listbox"
              aria-labelledby={inputId}
              data-popover="searchable-history"
              data-subject={dataField}
              style={{
                position: 'fixed',
                top: `${dropdownPosition.top}px`,
                left: `${dropdownPosition.left}px`,
                width: `${dropdownPosition.width}px`,
                // Aligned with Dialog's z-index (9999) so the dropdown
                // doesn't punch through modals. Was previously 999999
                // — that was anchor-day debugging cruft.
                zIndex: 9999,
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

      {helperText && (
        <div id={helperId} style={componentStyles.footerText}>
          {helperText}
        </div>
      )}
    </div>
  )
}

export default SearchableHistory
